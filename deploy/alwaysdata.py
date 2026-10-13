#!/usr/bin/env python3
"""Deploy only Ismi's API to its existing alwaysdata development preview."""
import argparse
import base64
import hashlib
import json
import os
from pathlib import Path
import shutil
import stat
import subprocess
import sys
import tarfile
import tempfile
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
SITE_ID = 1076252
HOST = 'ismi@ssh-ismi.alwaysdata.net'
SITE_URL = 'https://ismi.alwaysdata.net'
API = f'https://api.alwaysdata.com/v1/site/{SITE_ID}/'


def run(args, **kwargs):
    return subprocess.run(args, check=True, cwd=ROOT, **kwargs)


def build(output):
    app = output / 'app'
    app.mkdir(parents=True, exist_ok=True)
    run(['dotnet', 'publish', 'i-api/Ismi.Api.csproj', '-c', 'Release', '--no-restore', '-m:1', '-nodeReuse:false', '-o', str(app)])
    shutil.copy2(ROOT / 'deploy/start-alwaysdata.sh', app)
    # Never upload development overrides, local data, or credentials.
    for file in app.rglob('*'):
        if file.is_file() and (file.name.startswith('appsettings.') or file.suffix == '.pdb'):
            file.unlink()
    archive = output / 'api.tar.gz'
    with tarfile.open(archive, 'w:gz') as tar:
        for file in sorted(app.iterdir()):
            if file.name in {'App_Data', '.env', 'secrets.json'}:
                raise RuntimeError('Refusing to package local application data or secrets.')
            tar.add(file, arcname=file.name)
    return archive


def site_api(token, method='GET', action=''):
    auth = base64.b64encode(f'{token} account=ismi:'.encode()).decode()
    req = urllib.request.Request(API + action, method=method,
        headers={'Authorization': 'Basic ' + auth, 'Accept': 'application/json'})
    # Authentication never appears in argv, logs, source, or generated artifacts.
    with urllib.request.urlopen(req, timeout=30) as response:
        raw = response.read()
        return json.loads(raw) if raw else None


def ssh(options, code, *arguments):
    # All arguments are validated internal release IDs, not user-supplied shell text.
    return run(['ssh', *options, HOST, 'python3', '-', *arguments], input=code, text=True,
        capture_output=True).stdout.strip()


PREFLIGHT = '''import json, pathlib, sqlite3, shutil, sys, os
os.umask(0o077)
root=pathlib.Path('/home/ismi/ismi')
app=root/'app'; data=root/'data'
if app.is_symlink() or not app.is_dir() or not (data/'ismi.db').is_file():
    raise SystemExit('Unexpected application or persistent-data layout.')
with sqlite3.connect(str(data/'ismi.db')) as db:
    if db.execute('PRAGMA integrity_check').fetchone()[0] != 'ok': raise SystemExit('Database integrity check failed.')
# Room for staging, retained application rollback and a consistent database backup.
size=sum(p.stat().st_size for p in app.rglob('*') if p.is_file()) + (data/'ismi.db').stat().st_size
if shutil.disk_usage(root).free < size + int(sys.argv[2])*3: raise SystemExit('Not enough space for a safe deployment.')
stage=root/'deployments'/sys.argv[1]
stage.mkdir(parents=True, exist_ok=False)
print('Preflight passed.')
'''

INSTALL = '''import hashlib, json, pathlib, shutil, sqlite3, sys, tarfile, os
os.umask(0o077)
root=pathlib.Path('/home/ismi/ismi'); release=sys.argv[1]
stage=root/'deployments'/release; app=root/'app'; data=root/'data'
archive=stage/'api.tar.gz'
if hashlib.sha256(archive.read_bytes()).hexdigest()!=sys.argv[2]: raise SystemExit('Upload hash mismatch.')
new=stage/'new'; new.mkdir()
with tarfile.open(archive) as tar:
    for member in tar.getmembers():
        p=pathlib.PurePosixPath(member.name)
        if p.is_absolute() or '..' in p.parts or member.issym() or member.islnk() or p.parts[0] in {'App_Data','.env','secrets.json'}:
            raise SystemExit('Unexpected archive entry.')
    tar.extractall(new)
if not (new/'Ismi.Api.dll').is_file() or not (new/'start-alwaysdata.sh').is_file(): raise SystemExit('Incomplete release.')
backup=stage/'before'; backup.mkdir()
with sqlite3.connect(str(data/'ismi.db')) as db, sqlite3.connect(str(backup/'ismi.db')) as dest: db.backup(dest)
# Keep identities, recordings and cookie keys entirely outside both app releases.
manifest={'release': release, 'assemblySha256':hashlib.sha256((new/'Ismi.Api.dll').read_bytes()).hexdigest(),
 'recordings': {str(p.relative_to(data)):hashlib.sha256(p.read_bytes()).hexdigest() for p in (data/'recordings').rglob('*') if p.is_file()},
 'keys': {str(p.relative_to(data)):hashlib.sha256(p.read_bytes()).hexdigest() for p in (data/'keys').rglob('*') if p.is_file()}}
(stage/'manifest.json').write_text(json.dumps(manifest))
# Provider may still be serving the old process until restart. Rename directories
# rather than overwrite assemblies used by that process.
app.rename(stage/'old')
try: new.rename(app)
except Exception:
    (stage/'old').rename(app)
    raise
archive.unlink()
print('Installed API; existing application and SQLite backup retained.')
'''

ROLLBACK = '''import pathlib, sys
root=pathlib.Path('/home/ismi/ismi'); stage=root/'deployments'/sys.argv[1]
app=root/'app'; old=stage/'old'
if not old.is_dir(): raise SystemExit('No prior application available.')
app.rename(stage/'failed'); old.rename(app)
print('Restored prior application files; persistent data was not replaced.')
'''

VERIFY = '''import hashlib,json,pathlib,sqlite3,sys
root=pathlib.Path('/home/ismi/ismi'); stage=root/'deployments'/sys.argv[1]; data=root/'data'
manifest=json.loads((stage/'manifest.json').read_text())
for category in ('recordings','keys'):
    current={str(p.relative_to(data)):hashlib.sha256(p.read_bytes()).hexdigest() for p in (data/category).rglob('*') if p.is_file()}
    if current!=manifest[category]: raise SystemExit('Persistent asset/key change detected; inspect before proceeding.')
with sqlite3.connect(str(data/'ismi.db')) as db:
    if db.execute('PRAGMA integrity_check').fetchone()[0]!='ok': raise SystemExit('Database integrity failure.')
if hashlib.sha256((root/'app/Ismi.Api.dll').read_bytes()).hexdigest()!=manifest['assemblySha256']: raise SystemExit('Assembly mismatch.')
print('Assembly, SQLite integrity, recordings and cookie keys verified.')
'''


def health(expected_revision=None):
    for _ in range(20):
        try:
            with urllib.request.urlopen(SITE_URL + '/api/health', timeout=10) as response:
                payload = json.load(response)
                version = payload.get('revision', '')
                if payload.get('status') == 'healthy' and (expected_revision is None or version.endswith('+' + expected_revision)): return
        except (urllib.error.URLError, TimeoutError, ValueError):
            pass
        time.sleep(2)
    raise RuntimeError('Health did not recover after the restart.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--prepare', action='store_true', help='Build/package locally without credentials or external changes.')
    parser.add_argument('--check', action='store_true', help='Verify API/SSH access without deploying.')
    parser.add_argument('--config', type=Path, default=ROOT / 'deploy/alwaysdata.local.json')
    args = parser.parse_args()
    if args.prepare:
        output = Path(tempfile.mkdtemp(prefix='ismi-api-release-'))
        print('Prepared:', build(output))
        return
    if not args.config.exists():
        raise RuntimeError('Create the ignored deploy/alwaysdata.local.json from alwaysdata.example.json, chmod 600 it, and configure a reusable SSH key and API token. Do not paste credentials into chat.')
    if stat.S_IMODE(args.config.stat().st_mode) & 0o077:
        raise RuntimeError('Hosting credential file must have mode 600.')
    config = json.loads(args.config.read_text())
    identity = str(Path(config['ssh_identity']).expanduser().resolve())
    token = config['api_token']
    if not Path(identity).is_file() or not token or token.startswith('PUT_'):
        raise RuntimeError('Configure a real SSH identity file and API token in the ignored owner-only file.')
    options = ['-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'IdentitiesOnly=yes', '-i', identity]
    site = site_api(token)
    if site.get('path', '').rstrip('/') not in {'ismi/app', '/home/ismi/ismi/app'}:
        raise RuntimeError('Site working directory does not match the existing Ismi API target.')
    if not any(a.rstrip('/') == 'ismi.alwaysdata.net' for a in site.get('addresses', [])):
        raise RuntimeError('Site addresses do not match the existing Ismi API target.')
    ssh(options, "print('SSH authenticated.')")
    if args.check:
        print('Existing site 1076252 and SSH authentication verified; no deployment performed.')
        return
    changes = run(['git', 'status', '--porcelain'], capture_output=True, text=True).stdout.strip()
    if changes:
        raise RuntimeError('Commit or preserve pending tracked/untracked work before deploying a reproducible revision.')
    revision = run(['git', 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
    release = time.strftime('%Y%m%d-%H%M%S', time.gmtime()) + '-' + revision[:12]
    with tempfile.TemporaryDirectory(prefix='ismi-api-deploy-') as temp:
        archive = build(Path(temp))
        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        print(ssh(options, PREFLIGHT, release, str(archive.stat().st_size)))
        remote = f'/home/ismi/ismi/deployments/{release}/api.tar.gz'
        run(['scp', *options, str(archive), HOST + ':' + remote])
        print(ssh(options, INSTALL, release, digest))
        try:
            site_api(token, 'POST', 'restart/')
            health(revision)
            print(ssh(options, VERIFY, release))
        except Exception:
            print(ssh(options, ROLLBACK, release))
            site_api(token, 'POST', 'restart/')
            health()
            raise RuntimeError('Deployment failed; previous application restored. Review the retained backup and additive schema changes before retrying.')
    print(f'API deployed: {SITE_URL} · revision {revision} · rollback /home/ismi/ismi/deployments/{release}')

if __name__ == '__main__':
    try: main()
    except (RuntimeError, OSError, ValueError, KeyError, subprocess.CalledProcessError, urllib.error.URLError) as error:
        # Do not dump API response bodies, SSH traces, configuration or credentials.
        print('Deploy stopped:', str(error) if isinstance(error, RuntimeError) else type(error).__name__, file=sys.stderr)
        sys.exit(1)
