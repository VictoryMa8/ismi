"""Prepare S0 package only when regenerated waveform is equivalent to owner-selected audio."""
import copy
import json
from pathlib import Path
from prepare_draft import prepare
from selected_package import selection
from regenerate_selected import OUTPUT, comparison
from synthesize import audio_info, digest

TERMS = 'https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzure/allprograms'


def prepare_release():
    package = copy.deepcopy(json.loads(prepare().read_text()))
    entries = {entry['stepId']: entry for entry in selection()}
    old_urls = {step['prompt']['audioUrl'] for step in package['lesson']['steps']}
    package['sources'] = [s for s in package['sources'] if s['locator'] not in old_urls]
    added = set()
    for step in package['lesson']['steps']:
        entry = entries[step['id']]
        canonical = entry['canonicalAudioStep']
        record = json.loads((OUTPUT / f'{canonical}.json').read_text())
        data = (OUTPUT / f'{canonical}.wav').read_bytes()
        body = (OUTPUT / f'{canonical}.ssml').read_bytes()
        if (record['tier'] != 'S0' or record['status'] != 'generated'
                or not comparison((Path(__file__).parent / 'outputs' / entry['sourceArtifact'].replace('.json', '.wav')).read_bytes(), data)['equivalent']
                or record['previousF0AudioSha256'] != entry['output']['sha256']
                or audio_info(data) != record['output']
                or digest(body) != record['request']['ssmlSha256']):
            raise ValueError('S0 artifact requires exact acceptance reconciliation')
        url = f'/api/recordings/{record["output"]["sha256"]}.wav'
        recording = step['prompt']['recording']
        step['prompt']['audioUrl'] = url
        recording['sourceLocator'] = url
        synthesis = recording['synthesis']
        synthesis.update(generatedAt=record['requestedAt'], audioSha256=record['output']['sha256'],
                         rightsStatus='cleared', rightsEvidence=f'S0 Standard verified {record["tierVerifiedAt"]}; paid-tier prebuilt neural TTS output-use grant: {TERMS}',
                         ownerReview=entry['ownerReview']+'; same selected SSML; S0 acceptance reconciled by automated waveform comparison, not a new owner listening session')
        if url not in added:
            added.add(url)
            package['sources'].append(dict(sourceType='recording', title='Azure Speech S0 synthetic prompt recording',
                locator=url, rights=f'Paid-tier prebuilt neural TTS output-use grant; S0 generation {record["requestedAt"]}; {TERMS}',
                notes='AI-generated ar-JO-TaimNeural. Owner-selected PCM preserved; Palestinian pronunciation not independently verified.'))
    package['lesson']['introduction']['recordingNote'] = 'Eight exercise prompts use AI-generated Jordanian-voice audio selected by the owner. Female mnīḥa retains the accepted heavier-m fallback. Dialogue and teaching cards have no attached recordings. Independent Palestinian pronunciation review and human recordings remain absent.'
    target = OUTPUT / '01-lesson.json'
    if target.exists() and json.loads(target.read_text()) != package:
        raise ValueError('Existing release export differs; preserved')
    target.write_text(json.dumps(package, ensure_ascii=False, indent=2)+'\n')
    print('Prepared eight S0 mappings; six unique clips are waveform-equivalent to owner-selected audio. No publication performed.')
    return target


if __name__ == '__main__':
    prepare_release()
