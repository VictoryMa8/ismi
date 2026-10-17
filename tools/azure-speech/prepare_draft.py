"""Export selected assets as an unpublished console draft with pending rights."""
import json
from pathlib import Path

import lesson_batch as batch
from synthesize import HERE, digest, audio_info

SELECTED=HERE/'outputs/azure-selected-lesson-one-v1'
OUTPUT=HERE/'outputs/azure-console-draft-v1'


def prepare():
    selected=json.loads((SELECTED/'selected-audio.json').read_text())
    entries={m['stepId']:m for m in selected['mappings']}
    if len(entries)!=8 or selected['sourcePackageSha256']!=batch.PACKAGE_SHA:
        raise ValueError('Selected package does not match current approved source')
    lesson=batch.lesson()
    package=json.loads(batch.PACKAGE.read_text())
    sources=package['sources']
    seen=set()
    for step in lesson['steps']:
        entry=entries[step['id']]
        data=(SELECTED/entry['asset']).read_bytes()
        if (audio_info(data)!=entry['output'] or entry['transcript']!=step['prompt']['arabic']
                or entry['characters']!=step.get('characters') or not entry['ownerAcceptedForDraft']):
            raise ValueError('Selected audio or authored text/roles changed')
        record=entry['synthesis']
        ssml_path=HERE/'outputs'/Path(entry['sourceArtifact']).parent/record['request']['requestFile']
        body=ssml_path.read_bytes()
        if digest(body)!=record['request']['ssmlSha256']:
            raise ValueError('Selected synthesis request changed')
        url=f'/api/recordings/{entry["output"]["sha256"]}.wav'
        fallback=step['id']=='e01-02'
        step['prompt']['audioUrl']=url
        step['prompt']['recording']=dict(transcript=entry['transcript'],speaker=record['request']['voice'],
            dialect='jordanian',languageTag='ar-JO',sourceLocator=url,origin='synthetic',
            reviewNotes=entry['ownerReview']+'; owner listening only; Palestinian pronunciation not independently verified.',
            synthesis=dict(provider=record['provider'],voice=record['request']['voice'],locale='ar-JO',
                modelRevision=record['modelRevision'],generatedAt=record['requestedAt'],ssml=body.decode(),
                ssmlSha256=record['request']['ssmlSha256'],audioSha256=entry['output']['sha256'],
                reviewDisposition='accepted-fallback' if fallback else 'accepted',ownerReview=entry['ownerReview'],
                rightsStatus='pending',rightsEvidence=None))
        if url not in seen:
            seen.add(url)
            sources.append(dict(sourceType='recording',title='Owner-selected synthetic Azure Speech audition',locator=url,
                                rights='Pending provider playback/offline redistribution-rights acceptance; not cleared for publication.',
                                notes='AI-generated ar-JO-TaimNeural; no human or native-expert recording claim.'))
    if lesson.get('introduction'):
        lesson['introduction']['recordingNote']='Eight exercise prompts have owner-selected AI-generated Jordanian-voice audio in this private draft. Female mnīḥa is an accepted fallback with a heavier m. Dialogue and teaching cards have no attached recordings. Human recordings and independent Palestinian pronunciation review remain absent.'
    lesson['version']=''
    package['lesson']=lesson
    OUTPUT.mkdir(parents=True,exist_ok=True)
    target=OUTPUT/'01-lesson.json'
    if target.exists():
        if json.loads(target.read_text())!=package:raise ValueError('Existing draft export differs; preserved')
    else:target.write_text(json.dumps(package,ensure_ascii=False,indent=2)+'\n')
    print('Prepared eight synthetic draft attachments and six pending-rights sources; no approval/publication.')
    return target


if __name__=='__main__':
    prepare()
