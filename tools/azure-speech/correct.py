"""F19 bounded correction audition; synthesis hints never change lesson text."""
import argparse
from datetime import datetime, timezone
import html
import json
from pathlib import Path
import re
import unicodedata
from xml.sax.saxutils import escape

from synthesize import HERE, EXPECTED, VOICES, FORMAT, inputs, fetch, digest, audio_info

OUTPUT = HERE / 'outputs/azure-correction-v1'
TARGETS = {
    'e01-04': dict(text='شو عاملة؟', marked='شُو عَامْلِة؟', target='shū ʿāmle',
                   phonetic='ʃuː ʕaːmle'),
    'e01-06': dict(text='بدك ترتاح؟', marked='بِدَّك تِرْتَاح؟', target='biddak tirtāḥ',
                   phonetic='bidːak tirtaːħ'),
}


def prepared():
    lesson, clips = inputs()
    records = []
    # Put experimental phonemes last: an unsupported-phone error stops the run,
    # preserving the already generated text/vowel comparisons without retry.
    methods = [('plain-normal', '0%', False), ('vowels-normal', '0%', False),
               ('vowels-slow', '-20%', False), ('phonemes-normal', '0%', True)]
    for method, rate, phonemes in methods:
        for voice in VOICES:
            for step, target in TARGETS.items():
                clip = clips[step]
                if clip['transcript'] != target['text']:
                    raise ValueError('Correction source differs from pinned lesson')
                if ''.join(c for c in target['marked'] if not unicodedata.combining(c)) != target['text']:
                    raise ValueError('Vowel hint changed base letters')
                spoken = target['marked'] if method.startswith('vowels') else target['text']
                inner = (f'<phoneme alphabet="ipa" ph="{escape(target["phonetic"])}">'
                         f'{escape(spoken)}</phoneme>') if phonemes else escape(spoken)
                ssml = (f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-JO">'
                        f'<voice name="{voice}"><prosody rate="{rate}">{inner}</prosody></voice></speak>').encode()
                record = dict(stepId=step, voice=voice, method=method, rate=rate,
                              transcript=clip['transcript'], sourceArabizi=clip['arabizi'],
                              target=target['target'], synthesisText=spoken,
                              ipaCandidate=target['phonetic'] if phonemes else None,
                              requestFile=f'{voice}-{step}-{method}.ssml', ssmlSha256=digest(ssml))
                records.append((record, ssml))
    assert len(records) == 16
    return records


def page(records):
    cards = []
    for step, target in TARGETS.items():
        for voice in VOICES:
            cards.append(f'<section><h2>{html.escape(target["target"])} · {voice}</h2>'
                         f'<p lang="ar" dir="rtl">{html.escape(target["text"])}</p>')
            # Copy exact originals locally; no regeneration of rejected baseline.
            original = f'{voice}-{step}.wav'
            source = HERE / 'outputs/azure-v1' / original
            if source.exists():
                destination = OUTPUT / f'original-{original}'
                if not destination.exists():
                    destination.write_bytes(source.read_bytes())
                cards.append(f'<label>Original · unvowelled · slow −20% (rejected batch)</label><audio controls preload="none" src="original-{original}"></audio>')
            for record in records:
                request = record['request']
                if request['stepId'] == step and request['voice'] == voice:
                    label = request['method'].replace('-', ' ')
                    cards.append(f'<label>{label} · {request["rate"]}</label><audio controls preload="none" '
                                 f'aria-label="{voice} {step} {label}" src="{Path(request["requestFile"]).stem}.wav"></audio>')
            cards.append('</section>')
    (OUTPUT / 'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>F19 pronunciation correction</title>
<style>body{font:18px system-ui;max-width:860px;margin:24px auto;padding:20px;color:#202a25;background:#faf9f5}section{border:1px solid #216845;padding:20px;border-radius:12px;margin:20px 0}audio{display:block;width:100%;margin:8px 0 20px}p[lang=ar]{font-size:36px}label{display:block}</style>
<h1>Pronunciation correction audition</h1><p>AI-generated Jordanian voices · unpublished · all new samples await listening review.</p>
<p>Compare the feminine ʿāmle cluster/ending and biddak vowels/doubled d/final k. The approved script says <strong>biddak</strong>, not biddik; that gender target remains flagged for reconciliation. Original lesson text is unchanged.</p>
<p>Vowel marks and IPA are experimental synthesis hints, not linguistically accepted curriculum. Normal-speed controls isolate the effect of the earlier slowdown. Missing phoneme samples mean the probe failed; see the run record.</p>'''
        + ''.join(cards) + '''<script>document.addEventListener('play',e=>{if(e.target.tagName==='AUDIO')document.querySelectorAll('audio').forEach(a=>{if(a!==e.target)a.pause()})},true)</script></html>''')


def run(requests_override=None, output_override=None, render=None, package_sha256=EXPECTED):
    requests = prepared() if requests_override is None else requests_override
    output = OUTPUT if output_override is None else output_override
    if not output.resolve().is_relative_to((HERE / 'outputs').resolve()):
        raise ValueError('Audition output must remain inside ignored outputs')
    render = page if render is None else render
    config_path = HERE / '.cache/resource.json'
    if config_path.stat().st_mode & 0o077:
        raise ValueError('Configuration must have mode 600')
    config = json.loads(config_path.read_text())
    if config.get('tier') != 'F0' or not config.get('verifiedAt'):
        raise ValueError('Verified F0 configuration required')
    region, key = config['region'], config['key']
    if not re.fullmatch('[a-z][a-z0-9]*', region) or not re.fullmatch('[A-Za-z0-9]+', key):
        raise ValueError('Invalid local configuration')
    output.mkdir(parents=True, exist_ok=True)
    if any(output.iterdir()):
        raise ValueError('Existing attempt preserved; no automatic rerun')
    voices = json.loads(fetch(f'https://{region}.tts.speech.microsoft.com/cognitiveservices/voices/list', key))
    if not set(VOICES).issubset({v['ShortName'] for v in voices}):
        raise ValueError('Both regional voices required')
    records = []
    for request, body in requests:
        stem = Path(request['requestFile']).stem
        sidecar = output / f'{stem}.json'
        record = dict(provider='Microsoft Azure Speech', region=region, tier='F0',
                      tierVerifiedAt=config['verifiedAt'], packageSha256=package_sha256,
                      request=request, outputFormat=FORMAT, modelRevision='not exposed',
                      requestedAt=datetime.now(timezone.utc).isoformat(), status='attempt-started',
                      review=dict(ownerListening='pending', linguisticAcceptance='unreviewed'))
        (output / request['requestFile']).write_bytes(body)
        sidecar.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
        try:
            data = fetch(f'https://{region}.tts.speech.microsoft.com/cognitiveservices/v1',key,body)
            record['output'] = audio_info(data)
        except ValueError as error:
            record['status'] = 'failed-no-retry'
            record['failure'] = str(error)
            sidecar.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
            render(records)
            raise
        (output / f'{stem}.wav').write_bytes(data)
        record['status'] = 'generated-unreviewed'
        sidecar.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
        records.append(record)
        render(records)
        print(f'Generated {stem}: {record["output"]["durationSeconds"]:.2f}s; review pending',flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--generate',action='store_true')
    args = parser.parse_args()
    if args.generate:
        try:
            run()
        except (ValueError, OSError, KeyError, EOFError):
            parser.exit(1,'Correction audition stopped. Inspect saved attempt; no retry or fallback.\n')
    else:
        print(f'Validated {len(prepared())} bounded requests; no network or credentials accessed.')
