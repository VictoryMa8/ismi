"""Six targeted per-word phoneme probes for the missing amle ending."""
import argparse
import html
import json
from pathlib import Path
from xml.sax.saxutils import escape

import correct
from synthesize import HERE, VOICES, inputs, digest

OUTPUT = HERE / 'outputs/azure-ending-v1'
VARIANTS = {
    'word-syllables': 'ʕaːm.le',
    'word-stress': 'ˈʕaːm.le',
    'word-open-e': 'ˈʕaːm.lɛ',
}


def prepared():
    _, clips = inputs()
    clip = clips['e01-04']
    assert clip['transcript'] == 'شو عاملة؟'
    records = []
    for voice in VOICES:
        for method, phonetic in VARIANTS.items():
            # Use one phoneme element per word, rather than the previous
            # phrase-wide phoneme with spaces in its ph attribute.
            inner = (f'<phoneme alphabet="ipa" ph="ʃuː">شو</phoneme> '
                     f'<phoneme alphabet="ipa" ph="{escape(phonetic)}">عاملة</phoneme>؟')
            body = (f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-JO">'
                    f'<voice name="{voice}"><prosody rate="0%">{inner}</prosody></voice></speak>').encode()
            request = dict(stepId='e01-04', voice=voice, method=method, rate='0%',
                           transcript=clip['transcript'], sourceArabizi=clip['arabizi'],
                           target='shū ʿāmle', synthesisText=clip['transcript'],
                           ipaWords=['ʃuː',phonetic],
                           requestFile=f'{voice}-e01-04-{method}.ssml',ssmlSha256=digest(body))
            records.append((request,body))
    return records


def page(records):
    cards = []
    for voice in VOICES:
        cards.append(f'<section><h2>{voice}</h2><p lang="ar" dir="rtl">شو عاملة؟</p>')
        previous = HERE / 'outputs/azure-correction-v1' / f'{voice}-e01-04-phonemes-normal.wav'
        name = f'previous-{voice}-amle.wav'
        if previous.exists():
            if not (OUTPUT/name).exists():
                (OUTPUT/name).write_bytes(previous.read_bytes())
            cards.append(f'<label>Previous phonemes · owner hears “shoo am”</label><audio controls preload="none" src="{name}"></audio>')
        for record in records:
            request = record['request']
            if request['voice'] == voice:
                label = request['method'].replace('-',' ')
                name = Path(request['requestFile']).stem+'.wav'
                cards.append(f'<label>{label}</label><audio controls preload="none" aria-label="{voice} {label}" src="{name}"></audio>')
        cards.append('</section>')
    (OUTPUT/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>F19 amle ending</title>
<style>body{font:18px system-ui;max-width:800px;margin:24px auto;padding:20px;background:#faf9f5;color:#202a25}section{padding:20px;border:1px solid #216845;border-radius:12px;margin:20px 0}audio{display:block;width:100%;margin:8px 0 24px}p[lang=ar]{font-size:36px}</style>
<h1>Restore the ʿāmle ending</h1><p>Six new synthetic samples · unpublished · listening review pending.</p>
<p>Each word now has its own pronunciation instruction. Compare syllable boundaries, explicit stress, and a more open final e. Listen for the complete “ʿām-le,” including l and the final vowel.</p>
<p>Your feedback accepts the phoneme pronunciation of biddak tirtāḥ; those files remain unchanged. Exact voice selection is still unspecified.</p>'''
        + ''.join(cards) + '''<script>document.addEventListener('play',e=>{if(e.target.tagName==='AUDIO')document.querySelectorAll('audio').forEach(a=>{if(a!==e.target)a.pause()})},true)</script></html>''')


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--generate',action='store_true')
    args=parser.parse_args()
    if args.generate:
        try:
            correct.run(prepared(),OUTPUT,page)
        except (ValueError,OSError,KeyError,EOFError):
            parser.exit(1,'Ending audition stopped; inspect saved attempt. No retry.\n')
    else:
        print(f'Validated {len(prepared())} amle-only requests; no network or credentials accessed.')
