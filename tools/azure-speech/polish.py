"""Bounded female-ending repair and optional lighter mnih delivery."""
import argparse
import html
import json
from pathlib import Path
from xml.sax.saxutils import escape

import correct
import lesson_batch as batch
from synthesize import HERE, digest

OUTPUT=HERE/'outputs/azure-polish-v1'
VARIANTS=[
    ('e01-02','female-final-a','مْنِيحَا','0%'),
    ('e01-02','female-unmarked-a','منيحا','0%'),
    ('e01-02','female-lighter','مْنِيحَا','+15%'),
    ('e01-08','male-lighter','مْنِيح','+15%'),
]


def prepared():
    steps={s['id']:s for s in batch.lesson()['steps']}
    requests=[]
    for step,method,hint,word_rate in VARIANTS:
        prompt=steps[step]['prompt']
        word='منيحة' if step=='e01-02' else 'منيح'
        if prompt['arabic']!=f'أنا {word}.':
            raise ValueError('Unexpected approved source')
        # A final alif is a synthesis-only hint for the missing feminine a.
        # Faster word delivery is an optional approximation, not m-only timing.
        body=(f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-JO">'
              f'<voice name="{batch.VOICE}"><sub alias="أَنَا">أنا</sub> '
              f'<prosody rate="{word_rate}"><sub alias="{escape(hint)}">{word}</sub></prosody>.'
              '</voice></speak>').encode()
        request=dict(stepId=step,voice=batch.VOICE,method=method,rate=word_rate,
                     transcript=prompt['arabic'],sourceArabizi=prompt['arabizi'],
                     sourcePackageSha256=batch.PACKAGE_SHA,characters=steps[step].get('characters'),
                     synthesisAlias=hint,requestFile=f'{batch.VOICE}-{step}-{method}.ssml',
                     ssmlSha256=digest(body))
        requests.append((request,body))
    return requests


def page(records):
    cards=[]
    for step,title in [('e01-02','ana mnīḥa · feminine ending repair'),('e01-08','ana mnīḥ · optional lighter delivery')]:
        source=HERE/'outputs/azure-lesson-one-v1'/f'{batch.VOICE}-{step}-draft.wav'
        name=f'previous-{step}.wav'
        if not (OUTPUT/name).exists():
            (OUTPUT/name).write_bytes(source.read_bytes())
        cards.append(f'<section><h2>{title}</h2><p>Previous</p><audio controls preload="none" src="{name}"></audio>')
        for record in records:
            request=record['request']
            if request['stepId']==step:
                label=request['method'].replace('-',' ')
                cards.append(f'<p>{label}</p><audio controls preload="none" aria-label="{label}" src="{Path(request["requestFile"]).stem}.wav"></audio>')
        cards.append('</section>')
    (OUTPUT/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>F19 feminine ending repair</title>
<style>body{font:18px system-ui;max-width:800px;margin:24px auto;padding:20px;background:#faf9f5;color:#202a25}section{border:1px solid #216845;border-radius:12px;padding:20px;margin:20px 0}audio{width:100%;margin:8px 0 20px}</style>
<h1>Feminine ending and lighter delivery</h1><p>Target: ana mnīḥa, with one ana and an audible final a. New synthetic samples await listening review; source text is unchanged.</p>
<p>“Lighter” speeds up only the mnīḥ(a) word by 15%; it does not claim to halve the m independently. Previous clips are preserved. Other lesson-one clips are unchanged.</p>'''+''.join(cards)+'''<script>document.addEventListener('play',e=>{if(e.target.tagName==='AUDIO')document.querySelectorAll('audio').forEach(a=>{if(a!==e.target)a.pause()})},true)</script></html>''')


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--generate',action='store_true')
    args=parser.parse_args()
    if args.generate:
        try:
            correct.run(prepared(),OUTPUT,page,batch.PACKAGE_SHA)
        except (ValueError,OSError,KeyError,EOFError):
            parser.exit(1,'Polish audition stopped; inspect saved attempt. No retry.\n')
    else:
        print(f'Validated {len(prepared())} bounded requests; no network or credentials accessed.')
