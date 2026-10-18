"""Regenerate exactly the six selected requests on verified S0; no retries."""
import argparse
from datetime import datetime, timezone
import json
import io
import wave
import array
import math
from pathlib import Path
import re
from selected_package import selection
from synthesize import HERE, digest, audio_info, fetch

OUTPUT = HERE / 'outputs/azure-selected-s0-v1'


def prepared():
    unique = {}
    for entry in selection():
        record = entry['synthesis']
        source = HERE / 'outputs' / Path(entry['sourceArtifact']).parent
        body = (source / record['request']['requestFile']).read_bytes()
        if digest(body) != record['request']['ssmlSha256']:
            raise ValueError('Selected SSML hash changed')
        unique.setdefault(entry['canonicalAudioStep'], (entry, body))
    if len(unique) != 6:
        raise ValueError('Expected exactly six selected requests')
    return unique


def comparison(original, regenerated):
    def samples(data):
        with wave.open(io.BytesIO(data), 'rb') as wav:
            params = wav.getparams()
            return params, array.array('h', wav.readframes(wav.getnframes()))
    pa, a = samples(original)
    pb, b = samples(regenerated)
    if pa != pb or not a:
        return dict(equivalent=False, reason='WAV timing/format differs')
    energy_a = sum(x*x for x in a)
    energy_b = sum(x*x for x in b)
    error = sum((x-y)**2 for x,y in zip(a,b))
    correlation = sum(x*y for x,y in zip(a,b))/math.sqrt(energy_a*energy_b)
    snr = 999 if error == 0 else 10*math.log10(energy_a/error)
    peak = max(abs(x-y) for x,y in zip(a,b))/32768
    return dict(equivalent=correlation >= .99998 and snr >= 48 and peak <= .007,
                correlation=correlation, signalToDifferenceDb=snr, peakDifferenceFullScale=peak,
                identicalPcm=error == 0, sampleCount=len(a),
                method='Exact format/timing; correlation >=0.99998, SNR >=48dB, peak difference <=0.007 full scale')


def run():
    items = prepared()
    config_path = HERE / '.cache/resource.json'
    if config_path.stat().st_mode & 0o077:
        raise ValueError('Private config requires mode 600')
    config = json.loads(config_path.read_text())
    if config.get('tier') != 'S0' or not config.get('verifiedAt'):
        raise ValueError('Verified S0 configuration required')
    region = config['region']
    if not re.fullmatch('[a-z0-9]+', region):
        raise ValueError('Invalid region')
    OUTPUT.mkdir(parents=True, exist_ok=True)
    if any(OUTPUT.iterdir()):
        raise ValueError('Existing attempt preserved; inspect before rerun')
    for step, (entry, body) in items.items():
        old = entry['synthesis']
        record = dict(old, tier='S0', tierVerifiedAt=config['verifiedAt'],
                      requestedAt=datetime.now(timezone.utc).isoformat(),
                      status='attempt-started', previousF0AudioSha256=entry['output']['sha256'])
        record.pop('output', None)
        record['review'] = dict(ownerListening='pending regenerated-output comparison',
                                linguisticAcceptance='unreviewed')
        target = OUTPUT / f'{step}.json'
        target.write_text(json.dumps(record, ensure_ascii=False, indent=2)+'\n')
        (OUTPUT / f'{step}.ssml').write_bytes(body)
        data = fetch(f'https://{region}.tts.speech.microsoft.com/cognitiveservices/v1', config['key'], body)
        record['output'] = audio_info(data)
        record['byteIdenticalToAcceptedF0'] = record['output']['sha256'] == entry['output']['sha256']
        original = (HERE / 'outputs' / entry['sourceArtifact'].replace('.json', '.wav')).read_bytes()
        def pcm(value):
            with wave.open(io.BytesIO(value), 'rb') as wav:
                return wav.getparams(), wav.readframes(wav.getnframes())
        record['pcmIdenticalToAcceptedF0'] = pcm(data) == pcm(original)
        record['selectedAudioComparison'] = comparison(original, data)
        (OUTPUT / f'{step}.wav').write_bytes(data)
        record['status'] = 'generated'
        target.write_text(json.dumps(record, ensure_ascii=False, indent=2)+'\n')
        print(f'{step}: generated; identical to selected audio: {record["byteIdenticalToAcceptedF0"]}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--generate', action='store_true')
    args = parser.parse_args()
    if args.generate:
        run()
    else:
        items = prepared()
        print(f'Validated {len(items)} exact requests; {sum(len(body) for _,body in items.values())} UTF-8 SSML bytes. No network request.')
