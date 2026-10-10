"""Build original editable SVG concepts from shared geometry. No image generation."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).parent
INK='#292823'; GREEN='#16734B'; RED='#B93D35'; GOLD='#D8AA36'; CREAM='#FAF7EE'
def path(d,fill,stroke=INK,width=4):
 return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
def portrait(person,expression):
 woman=person=='fattoush'; skin='#C9824D' if woman else '#DAA36E'; shirt=GREEN if woman else RED
 # Fixed silhouettes and head proportions reused across the expression set.
 out=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" fill="{CREAM}"/>'
 if woman:
  out+=path('M47 176 Q29 155 39 115 L41 74 Q43 38 78 33 Q93 16 122 29 Q157 19 177 48 Q203 69 194 101 L202 149 Q207 173 189 183 Z',INK)
 else:
  out+=path('M53 83 L50 56 Q54 37 73 39 Q75 23 93 32 Q102 16 117 30 Q135 18 145 34 Q167 25 171 44 Q190 42 186 65 L184 92 Z',INK)
 out+=path('M20 240 L26 213 Q34 190 86 183 L153 183 Q205 190 215 217 L220 240 Z',shirt)
 out+=path('M92 156 L92 190 Q120 213 147 190 L147 151 Z',skin)
 if woman:
  out+=path('M90 186 L120 207 L98 228 L78 188 Z',GOLD)
  out+=path('M148 186 L120 207 L143 225 L163 190 Z',GOLD)
 else:
  out+=path('M86 183 Q118 211 153 182 L158 192 Q121 219 81 193 Z',GOLD)
 if expression=='profile':
  out+=path('M80 54 Q122 35 152 62 L164 90 L185 108 Q186 114 169 117 L169 146 Q163 169 138 175 L113 173 Q79 159 76 121 Z',skin)
  out+=path('M84 74 Q101 62 121 54 Q150 54 156 74 L155 50 L129 34 L90 44 Z',INK)
  out+=path('M138 84 L150 82','none',INK,5)
  out+=path('M146 94 L148 99','none',INK,5)
  out+=path('M160 134 L169 131','none',INK,3)
  if not woman: out+=path('M109 116 L126 136 L148 140 L169 128 L169 149 Q155 177 126 169 L110 149 Z',INK)
  out+=path('M94 105 Q80 96 80 112 Q80 128 99 126',skin)
 else:
  out+=path('M63 83 Q57 72 51 84 Q42 98 61 110 M179 83 Q190 72 195 87 Q199 101 182 109',skin)
  if woman:
   out+=path('M65 62 Q89 42 122 44 Q157 46 180 65 L178 126 Q173 156 153 171 Q136 182 119 180 Q83 177 69 144 Z',skin)
   out+=path('M53 96 L56 59 Q75 26 115 35 Q156 25 178 51 L186 102 Q164 89 157 58 Q123 85 69 71 L69 106 Z',INK)
  else:
   out+=path('M64 65 Q118 43 178 64 L177 119 Q176 161 145 176 L104 176 Q70 156 64 121 Z',skin)
   out+=path('M61 80 L57 57 Q77 39 103 48 Q119 32 139 48 Q160 40 180 59 L179 82 L164 66 Q141 66 135 58 Q100 74 77 62 Z',INK)
   out+=path('M67 119 Q77 139 91 143 L94 133 Q116 123 144 134 L149 145 Q168 139 177 118 L175 147 Q161 181 136 181 L107 180 Q77 163 68 146 Z',INK)
   out+=path('M99 141 Q119 135 141 142 L139 158 Q119 165 100 156 Z',skin,'none')
  attentive=expression=='attentive'; happy=expression=='encouraging'
  out+=path('M80 90 Q89 '+('78' if attentive else '82')+' 102 87','none',INK,5)
  out+=path('M139 87 Q151 '+('82' if attentive else '81')+' 163 91','none',INK,5)
  if happy:
   out+=path('M83 106 Q91 98 100 105 M142 105 Q151 98 159 106','none',INK,4)
  else:
   out+=path('M91 101 L91 108 M151 101 L151 108','none',INK,5)
  out+=path('M120 102 L113 122 L126 125','none',INK,3)
  if attentive: out+=path('M104 143 Q122 136 138 142 Q132 159 116 154 Z',INK)
  elif happy: out+=path('M103 141 Q120 151 138 139 Q127 162 109 150 Z',CREAM)
  else: out+=path('M107 143 Q121 148 134 142','none',INK,3)
  if woman: out+=f'<circle cx="59" cy="111" r="5" fill="{GOLD}"/><circle cx="186" cy="111" r="5" fill="{GOLD}"/>'
 out+='</svg>'
 return out
expressions=['neutral','attentive','encouraging','profile']
for person in ['fattoush','knafeh']:
 for expression in expressions:
  (ROOT/f'{person}-{expression}.svg').write_text(portrait(person,expression))
# Self-contained source model sheet, with shared portrait geometry embedded.
sheet=f'<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="800" viewBox="0 0 1120 800"><rect width="1120" height="800" fill="{CREAM}"/><g font-family="Arial, sans-serif" fill="{INK}"><text x="44" y="55" font-size="30" font-weight="700">Ismi · character study 01</text><text x="44" y="86" font-size="16">Editable vector concept · October 8, 2026</text>'
for i,e in enumerate(expressions): sheet+=f'<text x="{160+i*254}" y="124" text-anchor="middle" font-size="14">{e.capitalize()}</text>'
for row,person in enumerate(['fattoush','knafeh']):
 y=142+row*300
 for i,e in enumerate(expressions):
  s=portrait(person,e).replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">',f'<svg x="{40+i*254}" y="{y}" width="240" height="240" viewBox="0 0 240 240">')
  sheet+=s
 sheet+=f'<text x="44" y="{y+267}" font-size="19" font-weight="700">{person.capitalize()}</text>'
sheet+='<text x="44" y="766" font-size="14">Fixed geometry · charcoal outlines · green / red / gold · no gradients or textures</text></g></svg>'
(ROOT/'model-sheet.svg').write_text(sheet)
html='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ismi character study 01</title><style>*{box-sizing:border-box}body{margin:0;padding:32px;background:#faf7ee;color:#292823;font:16px system-ui,sans-serif}main{max-width:1120px;margin:auto}h1{font-size:28px;margin:0 0 8px}p{line-height:1.5} .sheet{width:100%;display:block}section{border-top:1px solid #d9d3c6;padding:24px 0}h2{font-size:20px}.sizes{display:flex;gap:32px;align-items:end;flex-wrap:wrap}.pair{display:flex;gap:10px}.pair img{border-radius:50%;border:2px solid #292823;display:block}small{display:block;margin-top:10px}.scene{max-width:480px;background:white;border:1px solid #d9d3c6;border-radius:16px;padding:20px;display:flex;gap:18px;align-items:center}.scene img{width:64px;height:64px;flex:none;border-radius:50%}.scene p{margin:4px 0}.role{font-weight:700}.note{color:#615c50;font-size:14px}@media(max-width:600px){body{padding:18px}.sizes{gap:20px}h1{font-size:24px}}</style><main><h1>Fattoush &amp; Knafeh</h1><p>First vector concept. Bold outlines, distinct silhouettes, richer green, red and gold.</p><img class="sheet" src="model-sheet.svg" alt="Fattoush and Knafeh, each shown neutral, attentive, encouraging and in profile."><section><h2>At portrait size</h2><div class="sizes">'''
for size in [40,64,96]:
 html+=f'<div><div class="pair"><img width="{size}" height="{size}" src="fattoush-neutral.svg" alt="Fattoush"><img width="{size}" height="{size}" src="knafeh-neutral.svg" alt="Knafeh"></div><small>{size} px</small></div>'
html+='''</div></section><section><h2>Lesson context</h2><div class="scene"><img src="fattoush-attentive.svg" alt=""><div><p class="role">Fattoush → Knafeh</p><p lang="ar" dir="rtl" style="font-size:28px">شو عامل؟</p><p>Shū ʿāmel?</p></div></div><p class="note">Concept preview only. Current app artwork is unchanged.</p></section></main></html>'''
(ROOT/'preview.html').write_text(html)
files=[{'path':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(ROOT.glob('*.svg'))]
(ROOT/'provenance.json').write_text(json.dumps({'status':'local concept; owner review pending','createdOn':'2026-10-08','authorship':'Original SVG paths authored by Codex; AI-assisted vector artwork, not a human illustrator commission or image_gen raster output.','references':'Existing Ismi character identities and owner palette direction; no third-party artwork copied.','model':'Shared fixed face, hair and clothing geometry; expression-specific facial paths.','delivery':'Docs-only concept; no production registry/assets replaced.','files':files},indent=2)+'\n')
