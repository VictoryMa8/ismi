"""Build F12.2 review candidates from immutable F08 packages; never publish."""
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASE = HERE.parent / 'pilot-release'
ADJECTIVES = 'https://resources.lingualism.com/levantine-arabic/adjectives-3/'
LAW = 'https://palweb.app/library/terms/conjunction-law'
HELP = 'In law, pronounce aw as in English “how”. Keep samaḥt for a male listener and samaḥti for a female listener.'
PLURAL = 'Mnāḥ describes family members together; mnīḥa describes the mother or sister. Mnāḥ is the Palestinian plural taught here; other speaker variants need review.'

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def replace(value):
    if isinstance(value, str):
        return value.replace('منيحين', 'مناح').replace('Mnīḥīn', 'Mnāḥ').replace('mnīḥīn', 'mnāḥ')
    if isinstance(value, list):
        return [replace(item) for item in value]
    if isinstance(value, dict):
        return {key: replace(item) for key, item in value.items()}
    return value

def source(locator, title, notes, kind='publisher-reference'):
    return dict(sourceType=kind, title=title, locator=locator,
                rights='Reference for language facts only; no publisher examples, recordings or datasets reproduced.',
                notes=notes)

manifest = dict(asOf='2026-10-09', status='draft-awaiting-owner-review', published=False,
                contentApproved=False, lessons=[], acceptedVariantPolicy={
                    'plural': 'Teach mnāḥ; do not label mnīḥīn universally invalid. Speaker/model disposition remains pending. These exercises grade authored answer IDs, not free text.',
                    'law': 'Keep law (/aw/). lau is a possible display spelling of the same sound, not a new Arabic answer. No app-wide spelling convention change.',
                    'address': 'Retain samaḥt/samaḥti and their authored listener roles.'})

for number in (3, 5, 7):
    original = BASE / f'{number:02}-lesson.json'
    before = json.loads(original.read_text())
    # Source records describe historical consultation and are never rewritten.
    package = dict(lesson=replace(before['lesson']), sources=before['sources'])
    lesson = package['lesson']
    intro = lesson['introduction']
    locators = []
    if number in (5, 7):
        locators.append(ADJECTIVES)
        package['sources'].append(source(ADJECTIVES, 'Lingualism Palestinian adjectives: good, plural',
            'Publisher entry good inspected October 9, 2026: singular mnīɧ, plural mnāɧ. Ismi displays ḥ consistently. Supports the preferred plural, not exclusion of all variants or native review of these sentences.'))
        for card in intro['teachingCards']:
            if 'mnāḥ' in card['phrase']['arabizi'].lower():
                card['note'] = PLURAL
                card['sourceLocators'].append(ADJECTIVES)
        for step in lesson['steps']:
            for answer in step['answers']:
                if 'mnāḥ' in answer['arabizi'].lower():
                    answer['rationale'] += ' Mnāḥ is the Palestinian plural taught here for people together.'
                    if answer['id'] == step['evaluation']['correctAnswerId']:
                        step['evaluation']['correctExplanation'] = answer['rationale']
        intro['usageNote'] += ' ' + PLURAL
    if number in (3, 7):
        locators.append(LAW)
        package['sources'].append(source(LAW, 'PalWeb Palestinian dictionary: لو / law',
            'Dictionary transcription /law/ and phrase membership لو سمحت inspected October 9, 2026. English “how” is an Ismi pronunciation cue for /aw/, not a recording or full pronunciation assessment.', 'reference-lexicon'))
        intro['dialectNote'] += ' ' + HELP
        for card in intro['teachingCards']:
            if 'law ' in card['phrase']['arabizi'].lower():
                card['note'] += ' ' + HELP
                card['sourceLocators'].append(LAW)
        for step in lesson['steps']:
            if any('law ' in answer['arabizi'].lower() for answer in step['answers']):
                for answer in step['answers']:
                    if 'law ' in answer['arabizi'].lower():
                        answer['rationale'] += ' In law, aw sounds like English “how”.'
                        if answer['id'] == step['evaluation']['correctAnswerId']:
                            step['evaluation']['correctExplanation'] = answer['rationale']
    intro['sourceLocators'].extend(locators)
    provenance = f'internal:ismi/everyday-01/{number:02}/transliteration-audit-2026-10-09'
    intro['sourceLocators'].append(provenance)
    package['sources'].append(dict(sourceType='original-authoring-record', title='F12.2 correction draft',
        locator=provenance, rights='Original Ismi help, rationale and draft composition.',
        notes=f'Based on immutable F08 package {original.name}, SHA-256 {digest(original)}. AI-assisted correction draft; owner approval and speaker pronunciation review pending. No publication or recording approval.'))
    # Carry explicit glossary entries: changed teaching cards no longer match the
    # immutable F20 compatibility catalog. Keep IDs for the same semantic senses.
    vocabulary = []
    seen = set()
    for index, (old, card) in enumerate(zip(before['lesson']['introduction']['teachingCards'], intro['teachingCards'], strict=True)):
        old_parts = [('expression', old['phrase'])] + [('word' if ' ' not in p['arabic'].strip() else 'expression', p) for p in old['chunks']]
        parts = [card['phrase']] + card['chunks']
        for (kind, prior), phrase in zip(old_parts, parts, strict=True):
            identity = json.dumps(['levantine', 'palestinian-urban', 'conversational', kind,
                                   prior['arabic'], prior['arabizi'], prior['meaning']], ensure_ascii=False)
            key = hashlib.sha256(identity.encode()).hexdigest()[:24]
            if key in seen:
                continue
            seen.add(key)
            vocabulary.append(dict(id='lev-' + key, senseId='sense-' + key, kind=kind,
                arabic=phrase['arabic'], arabizi=phrase['arabizi'], meaning=phrase['meaning'],
                dialect='palestinian-urban', register='conversational', forms=[], note=card['note'],
                sourceLocators=card['sourceLocators'], teachingCardIndex=index))
    lesson['vocabulary'] = vocabulary
    target = HERE / original.name
    target.write_text(json.dumps(package, ensure_ascii=False, indent=2) + '\n')
    # Exact field-level diff is the owner's bounded review surface.
    changes = []
    def compare(old, new, path=''):
        if isinstance(old, dict) and isinstance(new, dict):
            for key in sorted(old.keys() | new.keys()):
                compare(old.get(key), new.get(key), path + '/' + key)
        elif isinstance(old, list) and isinstance(new, list) and len(old) == len(new):
            for index, (a, b) in enumerate(zip(old, new)):
                compare(a, b, path + '/' + str(index))
        elif old != new:
            changes.append(dict(path=path, before=old, after=new))
    compare(json.loads(original.read_text()), package)
    (HERE / f'{number:02}-changes.json').write_text(json.dumps(changes, ensure_ascii=False, indent=2) + '\n')
    review = [f'# {number}. {lesson["title"]} — F12.2 draft review', '',
              'Unapproved October 9, 2026 draft. No recordings or pronunciation approval.', '',
              f'Exact package: [{target.name}]({target.name}). Full field diff: [{number:02}-changes.json]({number:02}-changes.json).', '', '## Dialogue', '']
    for turn in intro['dialogue']:
        line = turn['line']
        review += [f'**{turn["speaker"]}**', '', line['arabic'], '', line['arabizi'], '', line['meaning'], '']
    review += ['## Teaching cards', '']
    for card in intro['teachingCards']:
        review += [f'### {card["title"]}', '', card['phrase']['arabic'], '', card['phrase']['arabizi'], '', card['phrase']['meaning'], '', card['note'], '', 'Recall: ' + card['recallCue'], '']
        review += [f'- {chunk["arabic"]} · {chunk["arabizi"]} · {chunk["meaning"]}' for chunk in card['chunks']]
        review += ['', 'Sources: ' + ', '.join(card['sourceLocators']), '']
    review += ['## Practice and feedback', '']
    for step in lesson['steps']:
        review += [f'### {step["id"]}', '', step['instruction'], '', 'Roles: ' + json.dumps(step.get('characters', {})), '',
                   'Prompt: ' + ' · '.join(step['prompt'][k] for k in ('arabic', 'arabizi', 'meaning')), '']
        for answer in step['answers']:
            label = ' (accepted)' if answer['id'] == step['evaluation']['correctAnswerId'] else ''
            review += [f'- {answer["id"]}{label}: {answer["arabic"]} · {answer["arabizi"]} · {answer["meaning"]}. Rationale: {answer["rationale"]}']
        review += ['', 'Feedback: ' + step['evaluation']['correctExplanation'], '', 'Retry: ' + step['evaluation']['retryHint'], '']
    (HERE / f'{number:02}-review.md').write_text('\n'.join(review).rstrip() + '\n')
    manifest['lessons'].append(dict(lessonId=lesson['id'], package=target.name, sha256=digest(target),
        basedOnPackage='../pilot-release/' + original.name, basedOnSha256=digest(original),
        changedFields=len(changes), glossaryEntries=len(vocabulary)))
(HERE / 'review-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
