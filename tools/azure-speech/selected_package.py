"""Assemble exact owner-selected lesson-one assets offline, without synthesis/publication."""
import argparse
import html
import json
from pathlib import Path
import zipfile

import lesson_batch as batch
from synthesize import HERE, digest, audio_info

OUTPUT=HERE/'outputs/azure-selected-lesson-one-v1'
CHOICES={
    'e01-01':('azure-lesson-one-v1','ar-JO-TaimNeural-e01-01-draft','owner: everything else pretty good'),
    'e01-02':('azure-polish-v1','ar-JO-TaimNeural-e01-02-female-lighter','owner allows female lighter as fallback; heavier m remains acknowledged'),
    'e01-03':('azure-lesson-one-v1','ar-JO-TaimNeural-e01-03-draft','owner: everything else pretty good'),
    'e01-04':('azure-alias-v1','ar-JO-TaimNeural-e01-04-alias-final-h','owner selected spelling hint B; closest, not bad'),
    'e01-06':('azure-correction-v1','ar-JO-TaimNeural-e01-06-phonemes-normal','owner: biddak perfect; current male clip included in everything else pretty good'),
    'e01-08':('azure-polish-v1','ar-JO-TaimNeural-e01-08-male-lighter','owner: male lighter is perfect'),
}


def selection():
    result=[]
    for step in batch.lesson()['steps']:
        canonical={'e01-05':'e01-01','e01-07':'e01-04'}.get(step['id'],step['id'])
        folder,stem,review=CHOICES[canonical]
        root=HERE/'outputs'/folder
        record=json.loads((root/f'{stem}.json').read_text())
        data=(root/f'{stem}.wav').read_bytes()
        info=audio_info(data)
        if record['output']!=info or record['request']['transcript']!=step['prompt']['arabic']:
            raise ValueError('Selected artifact or transcript changed')
        if record['request']['voice']!=batch.VOICE:
            raise ValueError('Selected voice changed')
        result.append(dict(stepId=step['id'],canonicalAudioStep=canonical,
                           sourcePackageSha256=batch.PACKAGE_SHA,transcript=step['prompt']['arabic'],
                           arabizi=step['prompt']['arabizi'],meaning=step['prompt']['meaning'],
                           characters=step.get('characters'),asset=f'{info["sha256"]}.wav',
                           sourceArtifact=f'{folder}/{stem}.json',output=info,synthesis=record,
                           ownerAcceptedForDraft=True,ownerReview=review,
                           linguisticReview='not established',rightsReview='pending before publication'))
    return result


def assemble():
    entries=selection()
    OUTPUT.mkdir(parents=True,exist_ok=True)
    if any(OUTPUT.iterdir()):
        raise ValueError('Selected package already exists; preserve it')
    for entry in entries:
        source=HERE/'outputs'/entry['sourceArtifact'].replace('.json','.wav')
        destination=OUTPUT/entry['asset']
        if not destination.exists():
            destination.write_bytes(source.read_bytes())
    manifest=dict(lessonId=batch.lesson()['id'],sourcePackageSha256=batch.PACKAGE_SHA,
                  status='owner-selected-local-draft-assets',origin='synthetic',provider='Microsoft Azure Speech',
                  voice=batch.VOICE,voiceLocale='ar-JO',date='2026-10-17',promptCoverage='8/8 lesson-one prompts; 8/56 first-unit prompts only',
                  modelRevision='not exposed',mappings=entries,
                  boundaries='Not an application import payload. Synthetic provenance schema and console draft integration remain required. No publication, native review, verified Palestinian pronunciation, human-audio coverage or rights clearance inferred. Female lighter is an accepted fallback with heavier m acknowledged.')
    (OUTPUT/'selected-audio.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    cards=[]
    for entry in entries:
        cards.append(f'<section><h2>{entry["stepId"]}</h2><p lang="ar" dir="rtl">{html.escape(entry["transcript"])}</p>'
                     f'<p>{html.escape(entry["arabizi"])}</p><audio controls preload="none" aria-label="{entry["stepId"]}" src="{entry["asset"]}"></audio>'
                     f'<p>{html.escape(entry["ownerReview"])}</p></section>')
    (OUTPUT/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Selected lesson-one audio</title>
<style>body{font:18px system-ui;max-width:800px;margin:24px auto;padding:20px;background:#faf9f5;color:#202a25}section{border:1px solid #216845;border-radius:12px;padding:20px;margin:20px 0}p[lang=ar]{font-size:36px}audio{width:100%}</style>
<h1>Selected lesson-one audio</h1><p>AI-generated Jordanian male voice. Eight local draft mappings selected through owner listening; no native-expert review or publication.</p>
<p>Male lighter retained; female lighter retained as the acceptable fallback with heavier m acknowledged. No new synthesis or character-to-voice assignment.</p>
<p><a href="lesson-one-audio.zip" download>Download the offline listening package</a> · <a href="selected-audio.json">Provenance and mappings</a></p>'''+''.join(cards)+'''<script>document.addEventListener('play',e=>{if(e.target.tagName==='AUDIO')document.querySelectorAll('audio').forEach(a=>{if(a!==e.target)a.pause()})},true)</script></html>''')
    with zipfile.ZipFile(OUTPUT/'lesson-one-audio.zip','x',zipfile.ZIP_DEFLATED) as archive:
        for name in ['index.html','selected-audio.json',*sorted({e['asset'] for e in entries})]:
            archive.write(OUTPUT/name,name)
    print('Assembled eight draft mappings / six unique WAVs with full provenance and offline ZIP. No synthesis/publication.')


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--assemble',action='store_true')
    args=parser.parse_args()
    if args.assemble:
        assemble()
    else:
        print(f'Verified {len(selection())} selected mappings; no network or output writes.')
