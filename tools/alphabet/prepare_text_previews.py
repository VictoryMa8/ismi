#!/usr/bin/env python3
"""Prepare the exact owner-requested inventory-only text previews; no review/audio claims."""
import hashlib,json
from pathlib import Path
root=Path(__file__).resolve().parents[2]
folder=root/'content/alphabet'
pins=[]
for course in ['levantine','msa','quranic','khmer','french']:
 p=json.loads((folder/'drafts'/f'{course}.pack.json').read_text())
 p['title']='Alphabet · text-only preview'
 p['helpConvention']='Unicode technical names identify characters; they are not pronunciation guidance.'
 if course=='french':p['variety']='French script; reference pronunciation variety not yet selected'
 if course=='khmer':
  for e in p['inventory']['entries']:
   e['category']='transliteration support' if e['id'] in ['u179d','u179e'] else 'basic'
  p['inventory']['basicEntryIds']=[e['id'] for e in p['inventory']['entries'] if e['category']=='basic']
 for e,s in zip(p['entries'],p['inventory']['entries']):
  # Display identifiers, never pretend a machine character name is a reviewed spoken model.
  raw=e['note'].split('Technical source label: ',1)[1].split('. This is not',1)[0]
  if course in ['levantine','msa','quranic']:
   e['name']=raw.removeprefix('ARABIC LETTER ').title()
  elif course=='khmer':
   e['name']=raw.removeprefix('KHMER LETTER ').title()
  else:e['name']=s['forms'][0]['text']+' / '+s['forms'][1]['text']
  e['note']='Unicode technical identifier: '+raw+'. Spoken names, sounds and word examples are not reviewed.'
  if course=='khmer' and s['id'] in ['u179d','u179e']:
   e['note']+=' Unicode identifies this character as Pali/Sanskrit transliteration support; it is outside the 33-letter preview group.'
 p['inventory']['id']=p['inventory']['id'].replace('proposal','text-preview')
 path=folder/'inventory-preview'/f'{course}.pack.json'
 data=(json.dumps(p,ensure_ascii=False,indent=2)+'\n').encode();path.write_bytes(data)
 pins.append(dict(courseId=course,packId=p['id'],file=path.name,sha256=hashlib.sha256(data).hexdigest(),basicEntries=len(p['inventory']['basicEntryIds']),totalEntries=len(p['entries'])))
(folder/'inventory-preview/pins.json').write_text(json.dumps(pins,indent=2)+'\n')
print(json.dumps(pins,indent=2))
