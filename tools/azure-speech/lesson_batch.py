"""Lesson-one male audio draft: four new unique prompts and preserved audition clips."""
import argparse
import html
import json
from pathlib import Path
from xml.sax.saxutils import escape

import correct
from synthesize import HERE, digest

ROOT=HERE.parents[1]
PACKAGE=ROOT/'content/levantine/everyday-01/revisions/recall/01-lesson.json'
PACKAGE_SHA='e03c6db0d6cf6cb8bb9169283e6f78de6e797ab1443c3d009131214f791d35bc'
VOICE='ar-JO-TaimNeural'
OUTPUT=HERE/'outputs/azure-lesson-one-v1'
NEW={
    'e01-01': ('شو عامل؟', [('شو','شُو'),('عامل','عَامِل')], '؟'),
    'e01-02': ('أنا منيحة.', [('أنا','أَنَا'),('منيحة','مْنِيحَة')], '.'),
    'e01-03': ('فتوش', [('فتوش','فَتُّوش')], ''),
    'e01-08': ('أنا منيح.', [('أنا','أَنَا'),('منيح','مْنِيح')], '.'),
}
REUSE={
    'e01-04': ('azure-alias-v1',f'{VOICE}-e01-04-alias-final-h','selected by owner for this audition'),
    'e01-06': ('azure-correction-v1',f'{VOICE}-e01-06-phonemes-normal','phrase pronunciation accepted; exact male clip selection pending'),
}


def lesson():
    if digest(PACKAGE.read_bytes())!=PACKAGE_SHA:
        raise ValueError('Current approved lesson pin changed')
    manifest=json.loads((PACKAGE.parent/'review-manifest.json').read_text())
    if not any(r['file']==PACKAGE.name and r['sha256']==PACKAGE_SHA for r in manifest):
        raise ValueError('Approved manifest pin mismatch')
    data=json.loads(PACKAGE.read_text())['lesson']
    if [s['id'] for s in data['steps']] != [f'e01-{i:02d}' for i in range(1,9)]:
        raise ValueError('Expected eight prompt mappings')
    return data


def prepared():
    steps={s['id']:s for s in lesson()['steps']}
    records=[]
    for step,(text,words,punctuation) in NEW.items():
        prompt=steps[step]['prompt']
        if prompt['arabic']!=text:
            raise ValueError('Synthesis source differs from approved prompt')
        inner=' '.join(f'<sub alias="{escape(alias)}">{escape(word)}</sub>' for word,alias in words)+punctuation
        body=(f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-JO">'
              f'<voice name="{VOICE}"><prosody rate="0%">{inner}</prosody></voice></speak>').encode()
        request=dict(stepId=step,voice=VOICE,method='synthesis-alias-draft',rate='0%',
                     transcript=text,sourceArabizi=prompt['arabizi'],meaning=prompt['meaning'],
                     characters=steps[step].get('characters'),sourcePackageSha256=PACKAGE_SHA,
                     aliasWords=words,requestFile=f'{VOICE}-{step}-draft.ssml',ssmlSha256=digest(body))
        records.append((request,body))
    return records


def mappings(records):
    generated={r['request']['stepId']:r for r in records}
    result=[]
    for step in lesson()['steps']:
        identity=step['id']
        canonical={'e01-05':'e01-01','e01-07':'e01-04'}.get(identity,identity)
        if canonical in REUSE:
            folder,stem,review=REUSE[canonical]
            original=HERE/'outputs'/folder
            record=json.loads((original/f'{stem}.json').read_text())
            data=(original/f'{stem}.wav').read_bytes()
            if (record['request']['transcript']!=step['prompt']['arabic']
                    or digest(data)!=record['output']['sha256']):
                raise ValueError('Reused clip mismatch')
            filename=f'reused-{canonical}.wav'
            if not (OUTPUT/filename).exists():
                (OUTPUT/filename).write_bytes(data)
            source=f'{folder}/{stem}.json'
        elif canonical in generated:
            record=generated[canonical]
            filename=Path(record['request']['requestFile']).stem+'.wav'
            review='pending owner listening'
            source=Path(record['request']['requestFile']).stem+'.json'
        else:
            continue
        result.append(dict(stepId=identity,canonicalAudioStep=canonical,transcript=step['prompt']['arabic'],
                           arabizi=step['prompt']['arabizi'],meaning=step['prompt']['meaning'],
                           characters=step.get('characters'),voice=VOICE,file=filename,
                           outputSha256=record['output']['sha256'],sourceRecord=source,
                           review=review,sourcePackageSha256=PACKAGE_SHA))
    return result


def page(records):
    entries=mappings(records)
    cards=[]
    for entry in entries:
        esc=html.escape
        cards.append(f'<section><h2>{entry["stepId"]}</h2><p lang="ar" dir="rtl">{esc(entry["transcript"])}</p>'
                     f'<p>{esc(entry["arabizi"])} — {esc(entry["meaning"])}</p>'
                     f'<audio controls preload="none" aria-label="{entry["stepId"]}" src="{entry["file"]}"></audio><p>{esc(entry["review"])}</p></section>')
    (OUTPUT/'mappings.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n')
    (OUTPUT/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>F19 lesson one audio draft</title>
<style>body{font:18px system-ui;max-width:800px;margin:24px auto;padding:20px;background:#faf9f5;color:#202a25}section{border:1px solid #216845;border-radius:12px;padding:20px;margin:20px 0}p[lang=ar]{font-size:36px}audio{width:100%}</style>
<h1>Lesson one audio draft</h1><p>Synthetic male voice audition · unpublished · no native-expert review. New clips await your listening review.</p>
<p>The selected amle spelling-hint B and existing biddak clip are preserved. Repeated prompts reuse the same audio. This audition does not assign the male voice to every character in the app.</p>'''+''.join(cards)+'''<script>document.addEventListener('play',e=>{if(e.target.tagName==='AUDIO')document.querySelectorAll('audio').forEach(a=>{if(a!==e.target)a.pause()})},true)</script></html>''')


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--generate',action='store_true')
    args=parser.parse_args()
    if args.generate:
        try:
            correct.run(prepared(),OUTPUT,page,PACKAGE_SHA)
        except (ValueError,OSError,KeyError,EOFError):
            parser.exit(1,'Lesson audition stopped; inspect saved attempt. No retry.\n')
    else:
        print(f'Validated {len(prepared())} new unique requests against approved lesson pin; no network or credentials accessed.')
