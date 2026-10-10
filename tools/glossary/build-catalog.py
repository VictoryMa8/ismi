"""Copy exact owner-approved teaching records to a compatibility vocabulary catalog.
No translations, morphology, external sources or unpublished drafts are generated.
Run from the repository root. Changes to inputs require normal content review.
"""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
source = root / 'content/levantine/everyday-01/revisions/pilot-release'
result = []
for path in sorted(source.glob('*-lesson.json')):
    package = json.loads(path.read_text())
    lesson = package['lesson']
    cards = []
    for index, card in enumerate(lesson['introduction']['teachingCards']):
        entries = []
        for kind, phrase in [('expression', card['phrase'])] + [
            ('word' if ' ' not in chunk['arabic'].strip() else 'expression', chunk)
            for chunk in card['chunks']
        ]:
            identity = json.dumps([lesson['trackId'], 'palestinian-urban', 'conversational',
                                   kind, phrase['arabic'], phrase['arabizi'], phrase['meaning']], ensure_ascii=False)
            digest = hashlib.sha256(identity.encode()).hexdigest()[:24]
            entries.append(dict(id='lev-' + digest, senseId='sense-' + digest, kind=kind,
                                arabic=phrase['arabic'], arabizi=phrase['arabizi'], meaning=phrase['meaning'],
                                dialect='palestinian-urban', register='conversational', forms=[], note=card['note'],
                                sourceLocators=card.get('sourceLocators') or lesson['introduction']['sourceLocators'],
                                teachingCardIndex=index))
        # Require exact teaching text, explanation, blocks and sources at runtime.
        cards.append(dict(teachingCard=card, entries=entries))
    result.append(dict(lessonId=lesson['id'], packagePath=str(path.relative_to(root)),
                       packageSha256=hashlib.sha256(path.read_bytes()).hexdigest(), cards=cards))
(root / 'i-web/src/content/glossary-catalog.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
