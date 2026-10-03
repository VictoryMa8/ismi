"""Reproduce metadata-only proposals. Every mapping below is authored, never positional inference."""
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
# L = Fattoush speaks to Knafeh; O = Knafeh speaks to Fattoush; None = neutral cue.
PAIR = {'L': ('fattoush', 'knafeh'), 'O': ('knafeh', 'fattoush')}
DIALOGUE = {
    1: ['L', 'O', 'L', 'O', 'L', 'O'],
    2: ['O', 'L', 'O', 'L', 'O', 'L'],
    3: ['O', 'L', 'O', 'L', 'O', 'L'],
    4: ['O', 'L', 'O', 'L', 'O', 'L'],
    5: ['L', 'O', 'L', 'O', 'L', 'O'],
    6: ['L', 'O', 'L', 'O', 'L', 'O'],
    7: ['O', 'L', 'O', 'L', 'O', 'L'],
}
CARDS = {
    1: ['L', 'O', 'L', 'O', 'O', 'L', 'O'],
    2: ['O', 'L', 'L', 'L', 'O', 'O'],
    3: ['O', 'L', 'L', 'L', 'L', 'O'],
    4: ['O', 'L', 'L', 'O', 'L', 'O'],
    5: ['L', 'O', 'L', 'O', 'O', 'L'],
    6: ['O', 'O', 'L', 'L', None, None],
    7: ['L', 'O', 'L', None, None, None],
}
# Prompt role and response role. Same participant may continue their own statement.
# Unspoken topic/name cues carry no fictional prompt speaker.
STEPS = {
    1: [('L','O'), ('L','L'), (None,'O'), ('O','L'), ('L','O'), ('L','O'), ('O','L'), ('O','O')],
    2: [('O','L'), ('L','O'), ('O','L'), (None,'O'), (None,None), ('O','L'), ('L','O'), ('L','O')],
    3: [(None,'O'), ('O','L'), ('O','L'), ('O','L'), ('O','L'), ('O','L'), ('L','O'), ('L','O')],
    4: [('L','O'), ('O','L'), ('O','L'), (None,None), ('O','L'), ('L','O'), ('O','L'), ('O','L')],
    5: [('O','L'), ('L','O'), ('O','L'), ('L','O'), ('L','O'), ('O','O'), ('O','L'), ('O','L')],
    6: [(None,None), ('L','O'), ('O','L'), ('L','O'), ('O','L'), (None,None), (None,None), ('L','O')],
    7: [('O','L'), ('O','L'), ('L','L'), (None,None), ('O','L'), ('O','O'), ('L','O'), ('L','O')],
}

def pair(role):
    return dict(zip(('speakerId', 'addresseeId'), PAIR[role]))

manifest = {'asOf': '2026-10-01', 'published': False, 'contentApproved': False,
            'artStatus': 'corporate cartoon proposal; awaiting owner final selection', 'lessons': []}
for number in range(1, 8):
    source = HERE.parent / 'guided-teaching' / f'{number:02}-lesson.json'
    package = json.loads(source.read_text())
    lesson = package['lesson']
    lesson['characters'] = {'registryVersion': 'ismi-cast-v1', 'characterIds': ['fattoush', 'knafeh']}
    for turn, role in zip(lesson['introduction']['dialogue'], DIALOGUE[number], strict=True):
        turn.update(pair(role))
    for card, role in zip(lesson['introduction']['teachingCards'], CARDS[number], strict=True):
        if role: card.update(pair(role))
    for step, (prompt, response) in zip(lesson['steps'], STEPS[number], strict=True):
        if response:
            roles = pair(prompt) if prompt else {}
            roles.update(dict(zip(('responseSpeakerId', 'responseAddresseeId'), PAIR[response])))
            step['characters'] = roles
    target = HERE / source.name
    target.write_text(json.dumps(package, ensure_ascii=False, indent=2) + '\n')
    manifest['lessons'].append({'lessonId': lesson['id'], 'package': target.name,
        'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
        'basedOnPackage': f'../guided-teaching/{source.name}',
        'basedOnSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
        'status': 'draft-proposal', 'dialogueRoles': len(DIALOGUE[number]),
        'assignedTeachingCards': sum(role is not None for role in CARDS[number]),
        'assignedSteps': sum(response is not None for _, response in STEPS[number])})
(HERE / 'review-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
