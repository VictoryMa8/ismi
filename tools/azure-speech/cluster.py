"""Three male-only diagnostic probes to keep the vowel after l in amle."""
import argparse
from pathlib import Path
from xml.sax.saxutils import escape

import correct
from synthesize import HERE, inputs, digest

OUTPUT = HERE / 'outputs/azure-cluster-v1'
VOICE = 'ar-JO-TaimNeural'
VARIANTS = {
    'continuous-ml': ('ˈʕaːmlɛ', 'Continuous m–l · no internal syllable boundary'),
    'ml-onset': ('ˈʕaː.mlɛ', 'Group m–l with the final vowel'),
    'final-e-long': ('ˈʕaːmlɛː', 'Longer final e · diagnostic, may sound exaggerated'),
}
ALIASES = {
    'alias-final-i': ('عَامْلِي', 'Spelling hint A · final vowel after l'),
    'alias-final-h': ('عَامْلِه', 'Spelling hint B · final e approximation'),
    'alias-final-ih': ('عَامْلِيه', 'Spelling hint C · stronger ending'),
}


def prepared(aliases=False):
    _, clips = inputs()
    clip = clips['e01-04']
    if clip['transcript'] != 'شو عاملة؟':
        raise ValueError('Pinned source changed')
    requests = []
    for method, (hint, label) in (ALIASES if aliases else VARIANTS).items():
        inner = (f'<sub alias="شُو">شو</sub> <sub alias="{escape(hint)}">عاملة</sub>؟') if aliases else (
                 f'<phoneme alphabet="ipa" ph="ʃuː">شو</phoneme> '
                 f'<phoneme alphabet="ipa" ph="{escape(hint)}">عاملة</phoneme>؟')
        body = (f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-JO">'
                f'<voice name="{VOICE}"><prosody rate="0%">'
                f'{inner}'
                '</prosody></voice></speak>').encode()
        requests.append((dict(stepId='e01-04',voice=VOICE,method=method,label=label,rate='0%',
                              transcript=clip['transcript'],sourceArabizi=clip['arabizi'],
                              target='shū ʿāmle',synthesisText=clip['transcript'],
                              ipaWords=None if aliases else ['ʃuː',hint],
                              synthesisAlias=hint if aliases else None,
                              requestFile=f'{VOICE}-e01-04-{method}.ssml',
                              ssmlSha256=digest(body)),body))
    return requests


def page(records, output=OUTPUT):
    source = HERE / 'outputs/azure-ending-v1/ar-JO-TaimNeural-e01-04-word-open-e.wav'
    reference = output/'closest-reference.wav'
    if not reference.exists():
        reference.write_bytes(source.read_bytes())
    cards = ['<h2>Closest previous male sample</h2><p>Owner hears “shoo amel”; not accepted.</p><audio controls preload="none" src="closest-reference.wav"></audio>']
    for record in records:
        request = record['request']
        cards.append(f'<h2>{request["label"]}</h2><audio controls preload="none" aria-label="{request["method"]}" src="{Path(request["requestFile"]).stem}.wav"></audio>')
    (output/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>F19 amle cluster</title>
<style>body{font:18px system-ui;max-width:800px;margin:24px auto;padding:20px;background:#faf9f5;color:#202a25}audio{width:100%;margin:8px 0 24px}h2{font-size:21px}p[lang=ar]{font-size:36px}</style>
<h1>Keep m–l together</h1><p lang="ar" dir="rtl">شو عاملة؟</p><p>Target: shū ʿāmle. Listen for m–l followed by the final e, rather than “amel.” Male voice only. Three synthetic diagnostic candidates; all unpublished and unaccepted. Biddak audio is unchanged.</p>'''+''.join(cards)+'''<script>document.addEventListener('play',e=>{if(e.target.tagName==='AUDIO')document.querySelectorAll('audio').forEach(a=>{if(a!==e.target)a.pause()})},true)</script></html>''')


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--generate',action='store_true')
    parser.add_argument('--aliases',action='store_true')
    args=parser.parse_args()
    if args.generate:
        try:
            output = HERE/'outputs/azure-alias-v1' if args.aliases else OUTPUT
            correct.run(prepared(args.aliases),output,lambda records: page(records,output))
        except (ValueError,OSError,KeyError,EOFError):
            parser.exit(1,'Cluster audition stopped; inspect saved attempt. No retry.\n')
    else:
        print(f'Validated {len(prepared(args.aliases))} male-only requests; no network or credentials accessed.')
