"""Bounded F19 Azure audition. Dry run is offline; no retries or paid fallback."""
import argparse
from datetime import datetime, timezone
import hashlib
import html
import io
import json
from pathlib import Path
import re
import urllib.error
import urllib.request
import wave

from prepare import HERE, AUDITION, EXPECTED, inputs

VOICES = ('ar-JO-SanaNeural', 'ar-JO-TaimNeural')
FORMAT = 'riff-24khz-16bit-mono-pcm'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def requests():
    lesson, clips = inputs()
    manifest = json.loads((HERE / 'requests/manifest.json').read_text())
    if (manifest['packageSha256'] != EXPECTED or manifest['lessonId'] != lesson['id']
            or manifest['requiredTier'] != 'F0' or manifest['outputFormat'] != FORMAT
            or manifest['totalRequests'] != 6 or len(manifest['requests']) != 6):
        raise ValueError('Unexpected audition manifest')
    expected = {(voice, step) for voice in VOICES for step in AUDITION}
    seen = set()
    result = []
    for record in manifest['requests']:
        pair = record['voice'], record['stepId']
        if pair not in expected or pair in seen:
            raise ValueError('Unexpected or duplicate audition request')
        seen.add(pair)
        clip = clips[record['stepId']]
        filename = f'{pair[0]}-{pair[1]}.ssml'
        if record['requestFile'] != filename:
            raise ValueError('Unexpected request filename')
        from xml.etree import ElementTree as ET
        from xml.sax.saxutils import escape
        body = (HERE / 'requests' / filename).read_bytes()
        canonical = (f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-JO">'
                     f'<voice name="{pair[0]}"><prosody rate="-20%">'
                     f'{escape(clip["transcript"])}</prosody></voice></speak>').encode()
        if (body != canonical or digest(body) != record['ssmlSha256']
                or ''.join(ET.fromstring(body).itertext()) != clip['transcript']
                or any(record[key] != clip[key] for key in
                       ('transcript', 'speakerRole', 'addresseeRole'))
                or record['locale'] != 'ar-JO' or record['rate'] != '-20%'):
            raise ValueError('Request differs from approved audition')
        result.append((record, body))
    return result


def audio_info(data):
    if len(data) > 10 * 1024 * 1024:
        raise ValueError('Oversized audio response')
    with wave.open(io.BytesIO(data), 'rb') as wav:
        frames = wav.getnframes()
        if (wav.getcomptype() != 'NONE' or wav.getnchannels() != 1
                or wav.getsampwidth() != 2 or wav.getframerate() != 24000
                or frames == 0 or len(wav.readframes(frames)) != frames * 2):
            raise ValueError('Expected nonempty 24 kHz mono PCM16 WAV')
    return dict(sha256=digest(data), durationSeconds=frames / 24000,
                sampleRate=24000, channels=1, format='PCM_16')


def fetch(url, key, body=None):
    headers = {'Ocp-Apim-Subscription-Key': key, 'User-Agent': 'Ismi-F19-audition'}
    if body is not None:
        headers.update({'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': FORMAT})
    request = urllib.request.Request(url, data=body, headers=headers)
    # Redirects must never forward a resource key to another destination.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *args, **kwargs):
            return None
    try:
        with urllib.request.build_opener(NoRedirect).open(request, timeout=60) as response:
            data = response.read(10 * 1024 * 1024 + 1)
            if len(data) > 10 * 1024 * 1024:
                raise ValueError('Oversized provider response')
            return data
    except urllib.error.HTTPError as error:
        raise ValueError(f'Azure HTTP {error.code}; stopped without retry') from None
    except urllib.error.URLError:
        raise ValueError('Azure connection failed; stopped without retry') from None


def page(output, records):
    cards = []
    for record in records:
        request = record['request']
        label = html.escape(request['voice'] + ' · ' + request['stepId'])
        cards.append(f'<section><h2>{label}</h2><p lang="ar" dir="rtl">'
                     f'{html.escape(request["transcript"])}</p><audio controls preload="none" '
                     f'src="{request["requestFile"].replace(".ssml", ".wav")}" '
                     f'aria-label="{label}"></audio></section>')
    (output / 'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>F19 Azure audition</title>
<style>body{font:18px system-ui;max-width:800px;margin:32px auto;padding:20px;color:#202a25;background:#faf9f5}section{padding:16px;border:1px solid #216845;margin:16px 0;border-radius:12px}p[lang=ar]{font-size:36px}audio{width:100%}</style>
<h1>F19 Azure audition</h1><p>AI-generated Jordanian voices. Unpublished; owner listening review pending.
Palestinian pronunciation unverified. Voices are compared, with no final character assignment.</p>
<p>Listen for ʿayn, masculine/feminine endings, omitted words, naturalness and speech rate.</p>'''
        + ''.join(cards) + '''<script>document.addEventListener('play',e=>{if(e.target.tagName==='AUDIO')document.querySelectorAll('audio').forEach(a=>{if(a!==e.target)a.pause()})},true)</script></html>''', encoding='utf-8')


def run(config_path, output):
    prepared = requests()
    if config_path.stat().st_mode & 0o077:
        raise ValueError('Private configuration must have mode 600')
    config = json.loads(config_path.read_text())
    if config.get('tier') != 'F0' or not config.get('verifiedAt'):
        raise ValueError('Portal F0 verification and date required before synthesis')
    region = config['region']
    if not re.fullmatch(r'[a-z]+[a-z0-9]*', region):
        raise ValueError('Invalid Azure region')
    key = config['key']
    if not isinstance(key, str) or not re.fullmatch(r'[A-Za-z0-9]+', key):
        raise ValueError('Invalid Azure resource key')
    output.mkdir(parents=True, exist_ok=True)
    # Refuse repeats, including ambiguous requests interrupted before a response.
    if any(output.iterdir()):
        raise ValueError('Output directory is nonempty; inspect previous attempt before any rerun')
    voices = json.loads(fetch(f'https://{region}.tts.speech.microsoft.com/cognitiveservices/voices/list', key))
    if not set(VOICES).issubset({v['ShortName'] for v in voices}):
        raise ValueError('Both audition voices must be available in the selected region')
    records = []
    for request, body in prepared:
        stem = Path(request['requestFile']).stem
        identity = dict(provider='Microsoft Azure Speech', region=region, tier='F0',
                        tierVerifiedAt=config['verifiedAt'], packageSha256=EXPECTED,
                        request=request, outputFormat=FORMAT, modelRevision='not exposed',
                        requestedAt=datetime.now(timezone.utc).isoformat(), status='attempt-started',
                        review=dict(ownerListening='pending', palestinianPronunciation='unverified'))
        sidecar = output / f'{stem}.json'
        sidecar.write_text(json.dumps(identity, ensure_ascii=False, indent=2) + '\n')
        data = fetch(f'https://{region}.tts.speech.microsoft.com/cognitiveservices/v1', key, body)
        identity['output'] = audio_info(data)
        (output / f'{stem}.wav').write_bytes(data)
        identity['status'] = 'generated-unreviewed'
        sidecar.write_text(json.dumps(identity, ensure_ascii=False, indent=2) + '\n')
        records.append(identity)
        page(output, records)
        print(f'Generated {stem}: {identity["output"]["durationSeconds"]:.2f}s; review pending')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--generate', action='store_true')
    parser.add_argument('--config', type=Path, default=HERE / '.cache/resource.json')
    parser.add_argument('--output', type=Path, default=HERE / 'outputs/azure-v1')
    args = parser.parse_args()
    try:
        if args.generate:
            # Keep credentials and audio confined to ignored, non-web application paths.
            if not args.config.resolve().is_relative_to((HERE / '.cache').resolve()):
                raise ValueError('Configuration must be inside tools/azure-speech/.cache')
            if not args.output.resolve().is_relative_to((HERE / 'outputs').resolve()):
                raise ValueError('Audio must be inside tools/azure-speech/outputs')
            run(args.config, args.output)
        else:
            print(f'Validated {len(requests())} exact requests. Offline dry run; no credentials read.')
    except (ValueError, OSError, KeyError, wave.Error, EOFError):
        # No raw provider bodies, URLs, config or secrets in diagnostic output.
        parser.exit(1, 'Audition stopped: input, configuration, provider or audio validation failed. No retry or fallback.\n')


if __name__ == '__main__':
    main()
