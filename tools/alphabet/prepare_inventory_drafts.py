#!/usr/bin/env python3
"""Prepare private technical inventories; never approve, publish, fetch, or create audio."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / 'content/alphabet/sources'
OUT = ROOT / 'content/alphabet/drafts'
OUT.mkdir(parents=True, exist_ok=True)
data = {}
for line in (SOURCES / 'UnicodeData-17.0.0.selected.txt').read_text().splitlines():
    if line and not line.startswith('#'):
        fields = line.split(';')
        data[int(fields[0], 16)] = fields
joining = {}
for line in (SOURCES / 'ArabicShaping-17.0.0.selected.txt').read_text().splitlines():
    line = line.split('#')[0].strip()
    if line:
        fields = [part.strip() for part in line.split(';')]
        joining[int(fields[0], 16)] = fields[2]

ARABIC = [ord(c) for c in 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي']
assert len(ARABIC) == 28 and len(set(ARABIC)) == 28
KHMER = list(range(0x1780, 0x17A3))
FRENCH = list(range(ord('A'), ord('Z') + 1))


def forms(cp, script):
    c = chr(cp)
    result = [dict(label='Isolated', text=c, note='Technical character demonstration; linguistic review pending.')]
    if script == 'arabic':
        jt = joining[cp]
        result[0]['note'] += ' Unicode Joining_Type=' + jt + '.'
        if jt == 'D':
            result += [dict(label='Initial', text=c+'\u200d', note='Joiner shaping probe, not a word; review with authentic words before publication.'),
                       dict(label='Medial', text='\u200d'+c+'\u200d', note='Joiner shaping probe, not a word; review with authentic words before publication.')]
        if jt in ['D', 'R']:
            result += [dict(label='Final', text='\u200d'+c, note='Joiner shaping probe, not a word; review with authentic words before publication.')]
    elif script == 'latin':
        lower = int(data[cp][13], 16)
        assert data[lower][12] == f'{cp:04X}'
        result = [dict(label='Uppercase', text=c, note='Unicode case mapping; French teaching name/sounds not yet authored.'),
                  dict(label='Lowercase', text=chr(lower), note='Unicode case mapping; French teaching name/sounds not yet authored.')]
    return result


def clip():
    return dict(url='', transcript='', speaker='', variety='', reviewer='', reviewEvidence='', rightsEvidence='', humanRecording=False, offlineCleared=False)


def prepare(course, script, cps, variety):
    source_ids = ['ucd-17'] + (['arabic-shaping-17'] if script == 'arabic' else [])
    script_entries = [dict(id=f'u{cp:04x}', category='candidate-consonant' if script == 'khmer' else 'basic', text=chr(cp), forms=forms(cp,script)) for cp in cps]
    entries = [dict(id=e['id'], name='', help='', note='Technical source label: '+data[cp][1]+'. This is not a reviewed learner letter name. Names, contextual sounds, examples, explanations and audio remain unauthored.', soundContext='', sourceIds=source_ids, nameAudio=clip(), soundAudio=clip(), examples=[], activities=[]) for e,cp in zip(script_entries,cps)]
    sources = [dict(id='ucd-17',citation='Unicode Character Database 17.0.0 — character identifiers and case mappings only',locator='https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt',version='17.0.0',rightsEvidence='Unicode License V3 and source hashes attached in ../sources; curriculum/source acceptance pending.',textCleared=False,adaptationCleared=False,offlineCleared=False)]
    if script == 'arabic':
        sources += [dict(id='arabic-shaping-17',citation='Unicode ArabicShaping 17.0.0 — Joining_Type data only',locator='https://www.unicode.org/Public/17.0.0/ucd/ArabicShaping.txt',version='17.0.0',rightsEvidence='Unicode License V3 and source hashes attached in ../sources; curriculum/source acceptance pending.',textCleared=False,adaptationCleared=False,offlineCleared=False)]
    pack = dict(id=course+'-alphabet',courseId=course,title='Alphabet — unreviewed inventory proposal',variety=variety,helpConvention='',inventory=dict(id=script+'-inventory-proposal',version=1,basicEntryIds=[] if script=='khmer' else [e['id'] for e in script_entries],entries=script_entries,reviewer='',reviewEvidence=''),entries=entries,sources=sources,reviewer='',reviewEvidence='',engineeringFixture=False,fonts=[dict(url='/fonts/NotoSansKhmer.ttf',hash='f37a8431a0c5d5ed2f81a767417546aca576a81fb7eff9c924d46aecf828f2ca')] if script=='khmer' else [])
    (OUT/(course+'.pack.json')).write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
    return dict(courseId=course,scriptEntries=len(entries),proposedBasicEntries=len(pack['inventory']['basicEntryIds']),reviewed=False,humanRecordings=0,examples=0,activities=0)

summary = [prepare('levantine','arabic',ARABIC,'Urban Palestinian Levantine'),prepare('msa','arabic',ARABIC,'Modern Standard Arabic'),prepare('quranic','arabic',ARABIC,'Quranic script support; no canonical text or interpretation'),prepare('khmer','khmer',KHMER,'Contemporary Cambodian Khmer; Phnom Penh reference'),prepare('french','latin',FRENCH,'')]
arabic = [json.loads((OUT/(c+'.pack.json')).read_text())['inventory'] for c in ['levantine','msa','quranic']]
assert arabic[0] == arabic[1] == arabic[2]
print(json.dumps(summary,indent=2))
