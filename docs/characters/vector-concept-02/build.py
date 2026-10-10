"""Editable SVG character study, revision 02: curved contours and angle-specific hair."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).parent
INK='#302B28'; GREEN='#166B4C'; RED='#A83832'; GOLD='#CEA24B'; CREAM='#FAF7EE'
def path(d,fill,stroke='none',width=1.8):
 return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
def ellipse(x,y,rx,ry,fill):
 return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}"/>'
def portrait(person,expression):
 woman=person=='fattoush'; profile=expression=='profile'; happy=expression=='encouraging'; attentive=expression=='attentive'
 skin='#CB936D' if woman else '#D3A17B'; shade='#B77D59' if woman else '#BC8863'; hair='#342C29'; sheen='#51413A'
 out=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" fill="{CREAM}"/>'
 if woman and not profile:
  out+=path('M54 185 C38 182 36 164 42 143 C32 125 41 108 42 87 C40 51 60 32 92 31 C119 17 149 25 162 39 C188 47 194 74 188 98 C197 117 184 135 194 153 C200 169 189 184 172 186 Z',hair)
 elif woman:
  out+=path('M55 189 C37 176 47 153 43 136 C34 119 40 108 41 89 C36 62 50 38 76 32 C104 18 139 29 151 50 C157 68 144 83 129 92 C115 115 119 142 108 166 C103 184 81 195 55 189 Z',hair)
 out+=path('M18 240 C21 216 26 204 43 199 C64 192 82 188 99 184 C112 188 131 188 146 184 C165 190 184 194 201 202 C216 209 220 223 224 240 Z',GREEN if woman else RED)
 out+=path('M24 238 C26 216 31 207 47 203 M197 207 C211 215 213 227 215 239','none','#0E533B' if woman else '#852F2C',2)
 if profile:
  out+=path('M105 148 C111 169 102 180 95 188 C108 202 134 206 153 192 C139 181 143 164 146 147 Z',skin)
  out+=path('M111 155 C118 174 134 181 145 184 C139 174 143 160 146 148 Z',shade)
 else:
  out+=path('M96 148 C100 166 100 178 93 187 C108 206 134 207 151 188 C141 180 140 165 143 149 Z',skin)
  out+=path('M99 158 C105 178 128 184 143 175 L143 153 Z',shade)
 if woman:
  out+=path('M83 190 C92 191 100 205 118 210 C139 211 150 194 159 192 C156 208 141 219 120 220 C99 218 86 207 83 190 Z','#10593F')
  out+=path('M92 191 C102 201 109 204 120 205 C132 204 140 200 150 191','none',GOLD,2.8)
  out+=path('M60 210 C69 214 74 230 74 239 M177 209 C172 218 168 230 168 239','none','#2D8060',1.5)
 else:
  out+=path('M86 188 C99 203 139 213 158 190 L160 198 C140 216 105 215 82 197 Z','#822F2B')
  out+=path('M87 190 C105 208 137 209 155 193','none',GOLD,2.4)
  out+=path('M53 213 C61 219 65 231 66 240 M181 214 C176 222 175 230 174 239','none','#C44F45',1.4)
 if profile:
  out+=path('M90 55 C108 39 142 41 151 64 C155 75 151 81 154 90 C157 99 168 105 172 111 C175 117 163 119 159 121 C158 126 161 129 158 133 C164 139 158 143 157 146 C157 160 147 170 136 173 C121 177 99 164 91 149 C85 137 78 125 77 109 C75 90 78 68 90 55 Z',skin,INK,1.5)
  out+=path('M105 117 C106 142 113 159 131 172 C114 170 102 163 92 149 C86 136 80 122 78 109 Z',shade)
  if woman:
   out+=path('M64 96 C49 70 64 39 90 35 C113 24 141 37 148 51 C136 43 121 52 112 67 C107 79 106 88 96 96 C93 107 99 121 94 135 C90 151 99 164 90 181 C73 195 54 184 59 170 C70 153 56 142 62 125 C69 114 59 109 64 96 Z',hair)
   out+=path('M65 75 C68 54 84 46 104 44 M66 88 C72  seventy 84 65 96 59'.replace(' seventy','74'),'none',sheen,2.5)
   out+=path('M78 123 C72 138 87 154 75 174 M53 146 C55 156 52 173 63 179','none',sheen,2.3)
  else:
   out+=path('M74 103 C68 90 66 77 68 64 C65 53 75 42 85 42 C89 31 102 31 108 35 C117 28 128 33 133 38 C146 34 154 44 155 53 C162  sixty 155 74 148 79 C142 71 145 57 135 53 C119 61 106 64 99 64 C95 81 99 94 90 104 Z'.replace(' sixty','60'),hair)
   out+=path('M82 58 C85 47 96 43 104 46 M111 45 C121 40 134 44 140 51 M78 77 C77 70 81 64 86 63','none',sheen,2)
   out+=path('M94 116 C105 125 112 138 125 141 C137 141 149 132 158 131 C158 139 156 143 158 149 C152 167 142 178 130 177 C112 174 99 162 96 148 Z',hair)
   out+=path('M123 145 C135 150 145 143 153 141','none',skin,4)
   out+=path('M106 145 C107 158 116 166 126 169 M143 158 L138 166','none',sheen,1.5)
  out+=path('M105 98 C95 91 89 100 93 110 C96 117 102 120 108 116',skin)
  out+=path('M103 101 C96 97 95 108 101 110','none',shade,1.6)
  out+=path('M132 87 C138 83 144 84 148 86','none',hair,2.3)
  out+=path('M135 97 C139 94 143 96 146 98','none',INK,1.6)
  out+=ellipse(141,98,2.1,3.2,INK)
  out+=path('M155 117 C151 118 150 119 151 121','none',shade,1.2)
  if woman:
   out+=path('M148 137 C152 135 155 137 158 137 M149 141 C152 142 155 141 157 140','none','#8B5045',1.4)
   out+=ellipse(102,122,3,4,GOLD)
 else:
  out+=path('M67 90 C53  eighty 52 100 57 111 C60 118 66 121 70 116 M175 90 C187 82 192 99 184 112 C182 118 177 120 174 115'.replace(' eighty','82'),skin)
  out+=path('M68 65 C75 45 98 38 120 39 C147 38 167 51 174 70 C179  ninety 176 117 169 139 C163 157 143 177 124 178 C103 179 81 163 72 144 C64 126 61 88 68 65 Z'.replace(' ninety','90'),skin,INK,1.4)
  out+=path('M71 88 C69 116 75 142 91 155 C100 166 113 172 123 175 C104 177 82 162 73 144 C67 130 63 101 65 84 Z',shade)
  if woman:
   out+=path('M56 97 C48 81 52 50 77 38 C96 28 112 31 126 33 C150 26 172 42 180  sixty C185 76 179 100 172 109 C176 88 169 75 158 58 C147 76 122 86 97 85 C eighty 88 68 79 67 78 C65 90 68 102 67 115 Z'.replace(' sixty','60').replace(' eighty','80'),hair)
   out+=path('M67  sixty C eighty 44 103  forty 124  forty M79 72 C102 78 134 66 147 49 M161 72 C172 88 172 110 166 121'.replace(' sixty','60').replace(' eighty','80').replace(' forty','40'),'none',sheen,2.1)
   out+=path('M47 125 C42 144 55 158 48 172 M180 125 C174 142 186 160 176 173','none',sheen,2)
  else:
   out+=path('M62 98 C59 88 57 77 60 66 C55 55 64 43 75 43 C76 33 89 29 99 35 C108 24 122 28 127 34 C139 27 151 33 155  forty C170 38 181 51 178 63 C186 73 178  ninety 174 99 L168  eighty C159 77 160 65 152 60 C140 68 128 66 119 60 C102 71 87 70 76 66 C73 80 73 89 67 100 Z'.replace(' forty','40').replace(' ninety','90').replace(' eighty','80'),hair)
   out+=path('M seventy 55 C76 44 88 40 98 44 M106 43 C113 35 124 39 128 45 M143 45 C155 41 166 48 167 57 M85  sixty C95 62 105 56 108 52'.replace(' seventy','70').replace(' sixty','60'),'none',sheen,2)
   out+=path('M70 119 C79 137 85 140 92 144 C92 132 107 129 120 130 C135 128 148 134 151 144 C158 140 166 133 174 119 C175 142 163 167 147 176 C133 186 113 184 101 178 C81 170  seventy 148 70 119 Z'.replace(' seventy','70'),hair)
   out+=path('M98 143 C104 138 113 138 122 140 C133 137 143 141 145 147 C145 158 133 166 121 166 C109 166 99 158 98 143 Z',skin)
   out+=path('M83 144 C86 157 95 167 102 170 M158 148 C153 159 148 165 140 170','none',sheen,1.6)
  out+=path('M81 94 C87 88 96 87 103 91 M138 91 C146 87 155 90 161 94','none',hair,2.7)
  if happy:
   out+=path('M83 106 C88 99 96 99 101 104 M141 104 C147 99 155 100 159 106','none',INK,1.9)
  else:
   out+=path('M82 104 C88 99 96 99 102 104 M139 104 C146 99 154 100 160 105','none',INK,1.5)
   out+=ellipse(93,104,2.9,4,INK)+ellipse(148,104,2.9,4,INK)
   out+=ellipse(94,103,0.8,1,CREAM)+ellipse(149,103,0.8,1,CREAM)
  out+=path('M120 103 C119 113 113 120 115 124 C118 127 123 127 126 124','none',shade,1.6)
  if happy:
   out+=path('M103 144 C114 149 130 149 139 141 C134 157 112 160 103 144 Z','#7D493D')
   out+=path('M107 145 C117 149 129 147 135 144 C128 152 115 153 107 145 Z',CREAM)
  elif attentive:
   out+=path('M110 146 C116 141 130 141 134 146 C135 153 123 158 116 155 C111 153 109 149 110 146 Z','#75473D')
   out+=path('M115 145 C121 144 127 144 130 145','none',CREAM,1.3)
  else:
   out+=path('M106 145 C115 149 128 149 135 144','none','#8B5045',1.8)
   out+=path('M113 151 C119 153 126 152 130 150','none',shade,1)
  if woman:
   out+=ellipse(63,119,3,4,GOLD)+ellipse(180,119,3,4,GOLD)
 out+='</svg>'
 return out
expressions=['neutral','attentive','encouraging','profile']
for person in ['fattoush','knafeh']:
 for expression in expressions:
  (ROOT/f'{person}-{expression}.svg').write_text(portrait(person,expression))
# Self-contained source model sheet, with shared portrait geometry embedded.
sheet=f'<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="800" viewBox="0 0 1120 800"><rect width="1120" height="800" fill="{CREAM}"/><g font-family="Arial, sans-serif" fill="{INK}"><text x="44" y="55" font-size="30" font-weight="700">Ismi · character study 02</text><text x="44" y="86" font-size="16">Editable vector concept · October 8, 2026</text>'
for i,e in enumerate(expressions): sheet+=f'<text x="{160+i*254}" y="124" text-anchor="middle" font-size="14">{e.capitalize()}</text>'
for row,person in enumerate(['fattoush','knafeh']):
 y=142+row*300
 for i,e in enumerate(expressions):
  s=portrait(person,e).replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">',f'<svg x="{40+i*254}" y="{y}" width="240" height="240" viewBox="0 0 240 240">')
  sheet+=s
 sheet+=f'<text x="44" y="{y+267}" font-size="19" font-weight="700">{person.capitalize()}</text>'
sheet+='<text x="44" y="766" font-size="14">Curved contours · angle-specific hair · green / red / gold</text></g></svg>'
(ROOT/'model-sheet.svg').write_text(sheet)
html='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ismi character study 02</title><style>*{box-sizing:border-box}body{margin:0;padding:32px;background:#faf7ee;color:#292823;font:16px system-ui,sans-serif}main{max-width:1120px;margin:auto}h1{font-size:28px;margin:0 0 8px}p{line-height:1.5} .sheet{width:100%;display:block}section{border-top:1px solid #d9d3c6;padding:24px 0}h2{font-size:20px}.sizes{display:flex;gap:32px;align-items:end;flex-wrap:wrap}.pair{display:flex;gap:10px}.pair img{border-radius:50%;border:2px solid #292823;display:block}small{display:block;margin-top:10px}.scene{max-width:480px;background:white;border:1px solid #d9d3c6;border-radius:16px;padding:20px;display:flex;gap:18px;align-items:center}.scene img{width:64px;height:64px;flex:none;border-radius:50%}.scene p{margin:4px 0}.role{font-weight:700}.note{color:#615c50;font-size:14px}@media(max-width:600px){body{padding:18px}.sizes{gap:20px}h1{font-size:24px}}</style><main><h1>Fattoush &amp; Knafeh</h1><p>Refined vector study. Softer contours, finer details and angle-specific hair.</p><img class="sheet" src="model-sheet.svg" alt="Fattoush and Knafeh, each shown neutral, attentive, encouraging and in profile."><section><h2>At portrait size</h2><div class="sizes">'''
for size in [40,64,96]:
 html+=f'<div><div class="pair"><img width="{size}" height="{size}" src="fattoush-neutral.svg" alt="Fattoush"><img width="{size}" height="{size}" src="knafeh-neutral.svg" alt="Knafeh"></div><small>{size} px</small></div>'
html+='''</div></section><section><h2>Lesson context</h2><div class="scene"><img src="fattoush-attentive.svg" alt=""><div><p class="role">Fattoush → Knafeh</p><p lang="ar" dir="rtl" style="font-size:28px">شو عامل؟</p><p>Shū ʿāmel?</p></div></div><p class="note">Concept preview only. Current app artwork is unchanged.</p></section></main></html>'''
(ROOT/'preview.html').write_text(html)
files=[{'path':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(ROOT.glob('*.svg'))]
(ROOT/'provenance.json').write_text(json.dumps({'status':'local concept; owner review pending','createdOn':'2026-10-08','authorship':'Original SVG paths authored by Codex; AI-assisted vector artwork, not a human illustrator commission or image_gen raster output.','references':'Existing Ismi character identities and owner palette direction; no third-party artwork copied.','model':'Curved front-view geometry shared across expressions; independently drawn side-view skull, hair, ear and beard silhouettes.','delivery':'Docs-only concept; no production registry/assets replaced.','files':files},indent=2)+'\n')
