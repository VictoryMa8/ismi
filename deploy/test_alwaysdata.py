import hashlib
import json
import io
from unittest.mock import patch
from pathlib import Path
import sqlite3
import subprocess
import sys
import tarfile
import tempfile
from contextlib import closing
import unittest
import alwaysdata

class DeployTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='ismi-deploy-check-')
        self.root = Path(self.temp.name)
        (self.root/'app').mkdir()
        (self.root/'app/Ismi.Api.dll').write_bytes(b'old assembly')
        (self.root/'data/recordings').mkdir(parents=True)
        (self.root/'data/keys').mkdir()
        (self.root/'data/recordings/approved.wav').write_bytes(b'original recording')
        (self.root/'data/keys/key.xml').write_bytes(b'original cookie key')
        with closing(sqlite3.connect(self.root/'data/ismi.db')) as db:
            db.execute('CREATE TABLE LearnerProgress (Id TEXT PRIMARY KEY, Minutes INTEGER)')
            db.execute('INSERT INTO LearnerProgress VALUES (?,?)', ('fixture', 15))
            db.commit()
        self.release='20261012-fixture'
    def tearDown(self): self.temp.cleanup()
    def remote(self, code, *args):
        code=code.replace("'/home/ismi/ismi'", repr(str(self.root)))
        return subprocess.run([sys.executable, '-', self.release, *args], input=code, text=True, capture_output=True)
    def archive(self, unsafe=False):
        stage=self.root/'deployments'/self.release
        stage.mkdir(parents=True,exist_ok=True)
        src=self.root/'package';src.mkdir()
        (src/'Ismi.Api.dll').write_bytes(b'new assembly')
        (src/'start-alwaysdata.sh').write_text('start')
        archive=stage/'api.tar.gz'
        with tarfile.open(archive,'w:gz') as tar:
            for f in src.iterdir(): tar.add(f,arcname=f.name)
            if unsafe: tar.add(src/'Ismi.Api.dll',arcname='../outside')
        return hashlib.sha256(archive.read_bytes()).hexdigest()
    def test_install_verification_and_rollback_preserve_database_and_assets(self):
        self.assertEqual(self.remote(alwaysdata.PREFLIGHT,'1024').returncode,0)
        digest=self.archive()
        installed=self.remote(alwaysdata.INSTALL,digest)
        self.assertEqual(installed.returncode,0,installed.stderr)
        self.assertEqual((self.root/'app/Ismi.Api.dll').read_bytes(),b'new assembly')
        self.assertEqual(self.remote(alwaysdata.VERIFY).returncode,0)
        with closing(sqlite3.connect(self.root/'deployments'/self.release/'before/ismi.db')) as db:
            self.assertEqual(db.execute('SELECT Minutes FROM LearnerProgress').fetchone(),(15,))
        self.assertEqual(self.remote(alwaysdata.ROLLBACK).returncode,0)
        self.assertEqual((self.root/'app/Ismi.Api.dll').read_bytes(),b'old assembly')
        with closing(sqlite3.connect(self.root/'data/ismi.db')) as db:
            self.assertEqual(db.execute('SELECT Minutes FROM LearnerProgress').fetchone(),(15,))
        self.assertEqual((self.root/'data/keys/key.xml').read_bytes(),b'original cookie key')
    def test_upload_mismatch_and_path_escape_stop_before_swap(self):
        digest=self.archive(unsafe=True)
        self.assertNotEqual(self.remote(alwaysdata.INSTALL,'wrong').returncode,0)
        self.assertNotEqual(self.remote(alwaysdata.INSTALL,digest).returncode,0)
        self.assertEqual((self.root/'app/Ismi.Api.dll').read_bytes(),b'old assembly')
        self.assertFalse((self.root/'deployments'/self.release/'outside').exists())
    def test_health_waits_for_the_requested_running_revision(self):
        responses = [io.BytesIO(json.dumps({'status': 'healthy', 'revision': '1.0.0+old'}).encode()),
                     io.BytesIO(json.dumps({'status': 'healthy', 'revision': '1.0.0+requested'}).encode())]
        with patch('alwaysdata.urllib.request.urlopen', side_effect=responses) as requests, patch('alwaysdata.time.sleep'):
            alwaysdata.health('requested')
            self.assertEqual(requests.call_count, 2)
    def test_persistent_key_change_is_detected(self):
        digest=self.archive()
        self.assertEqual(self.remote(alwaysdata.INSTALL,digest).returncode,0)
        (self.root/'data/keys/key.xml').write_bytes(b'unexpected key change')
        self.assertNotEqual(self.remote(alwaysdata.VERIFY).returncode,0)

if __name__=='__main__': unittest.main()
