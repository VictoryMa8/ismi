"""Compose review documents from unmodified generated artwork; does not draw characters.

Run with the bundled Python runtime (ReportLab, Pillow). PDF uses 1 point per
review pixel, so render at 72 dpi for the actual-size 64/96px comparison.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

ROOT = Path(__file__).resolve().parent
W, H = 1600, 1350
IVORY, INK, GREEN, RED, GOLD = '#FAF7EF', '#292522', '#08734E', '#B83F32', '#D9A42D'
STATES = [('welcoming', 'Welcoming', 'Direct gaze / open smile / small hello'),
          ('listening', 'Attentively listening', 'Side gaze / closed mouth / forward attention'),
          ('encouraging', 'Gently encouraging', 'Direct gaze / quiet smile / low open palm')]

def make_pdf():
    c = canvas.Canvas(str(ROOT / 'review-board.pdf'), pagesize=(W, H))
    c.setTitle('Ismi - Fattoush and Knafeh character review 02')
    c.setAuthor('Ismi review layout; character artwork generated with OpenAI image_gen')
    def box(x, y, w, h, color):
        c.setFillColor(HexColor(color)); c.rect(x, H-y-h, w, h, stroke=0, fill=1)
    def text(x, y, value, size=20, color=INK, bold=False):
        c.setFillColor(HexColor(color)); c.setFont('Helvetica-Bold' if bold else 'Helvetica', size)
        c.drawString(x, H-y-size, value)
    def art(name, x, y, w, h):
        c.drawImage(str(ROOT / name), x, H-y-h, w, h, preserveAspectRatio=True, anchor='c', mask='auto')
    def header(tag, title, sub):
        box(0, 0, W, H, IVORY)
        box(64, 54, 9, 53, GREEN)
        text(91, 47, title, 40, bold=True)
        text(91, 101, sub, 20, '#68635C')
        text(1280, 58, tag, 18, GREEN, True)
    def footer(page):
        box(64, 1278, 1472, 1, '#D9D3C8')
        text(64, 1295, 'GENERATED CONCEPT ART / Review only / October 14, 2026', 17, '#68635C')
        text(1210, 1295, f'Ismi / F06.1 / {page}', 17, GREEN, True)

    header('02 / EXPRESSION STUDY', 'Ismi / Fattoush & Knafeh',
           'Selected simple cartoon direction. Three emotional states and two lesson scenes.')
    for i, (state, label, note) in enumerate(STATES):
        x = 64 + i * 504
        art(f'fattoush-{state}.png', x+32, 158, 400, 400)
        text(x, 578, label, 27, bold=True)
        text(x, 619, note, 18, '#68635C')
    box(64, 668, 1472, 1, '#D9D3C8')
    for x, name, label in [(64, 'lesson-coffee.png', 'Catching up over coffee'),
                            (820, 'lesson-plans.png', 'Making plans together')]:
        text(x, 692, label, 27, bold=True)
        art(name, x, 741, 716, 477.333)
    for i, color in enumerate([GREEN, RED, GOLD, INK]): box(1328+i*52, 1240, 40, 12, color)
    text(64, 1235, 'Knafeh: lighter warm olive skin, straight dark hair, clean-shaven.', 18, '#68635C')
    footer('01'); c.showPage()

    header('02 / PORTRAIT CHECK', 'Expression clarity at actual size',
           'View at 100% or render this page at 72 dpi. The small squares are not enlarged.')
    for i, (state, label, note) in enumerate(STATES):
        x = 64 + i*504
        text(x, 168, label, 26, bold=True)
        art(f'fattoush-{state}.png', x, 219, 240, 240)
        art(f'fattoush-{state}-64.png', x, 500, 64, 64)
        text(x+88, 520, '64 x 64 px', 19, '#68635C')
        art(f'fattoush-{state}-96.png', x, 602, 96, 96)
        text(x+120, 638, '96 x 96 px', 19, '#68635C')
    box(64, 744, 1472, 1, '#D9D3C8')
    text(64, 774, 'What survives reduction', 26, bold=True)
    for i, line in enumerate([
        'Welcoming: direct eye contact, visible open smile and vertical greeting hand.',
        'Listening: side-directed pupils, head turn, closed mouth and no gesture.',
        'Encouraging: direct eye contact, smaller closed smile and a low horizontal open palm.',
        'At 64px, gaze and pose carry more meaning than fine eyebrow differences.',
        'This is visual design review, not evidence from a learner recognition study.'
    ]): text(64, 825+i*35, line, 22, '#68635C')
    text(64, 1042, 'Source and editability', 26, bold=True)
    for i, line in enumerate([
        'New artwork is OpenAI image_gen output. No human-drawn library assets in this sample.',
        'Individual PNGs and exact prompts are included. PDF text and layout are separate objects.',
        'Character faces and body parts are raster artwork, not editable vector paths.',
        'The earlier Open Peeps board and its CC0 source records remain unchanged.'
    ]): text(64, 1092+i*34, line, 20, '#68635C')
    footer('02'); c.save()

def make_html():
    cards=[]
    for state, label, note in STATES:
        cards.append(f'<article><h2>{label}</h2><img class="large" src="fattoush-{state}.png" alt="Fattoush, {label.lower()}"><p>{note}</p><div class="small"><img width="64" height="64" src="fattoush-{state}-64.png" alt="64 pixel portrait"><span>64px</span><img width="96" height="96" src="fattoush-{state}-96.png" alt="96 pixel portrait"><span>96px</span></div></article>')
    html='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ismi character review 02</title><style>
    *{box-sizing:border-box}body{margin:0;background:#FAF7EF;color:#292522;font:17px/1.5 system-ui,sans-serif}main{max-width:1500px;padding:44px 32px;margin:auto}h1{font-size:40px;line-height:1.15;margin:8px 0 14px}h2{font-size:23px}p{color:#68635C}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}.large{display:block;width:100%;height:auto}.small{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.small img{flex:none}section{margin:50px 0}.scenes{display:grid;grid-template-columns:1fr 1fr;gap:32px}.scenes img{width:100%;height:auto}button{font:inherit;background:#08734E;color:white;padding:10px 16px;border:0;border-radius:5px;cursor:pointer}button:focus-visible{outline:3px solid #B83F32;outline-offset:3px}.blind article h2,.blind article p{visibility:hidden}footer{margin-top:32px;padding-top:20px;border-top:1px solid #D9D3C8}@media(max-width:800px){.grid,.scenes{grid-template-columns:1fr}.large{max-width:400px}main{padding:24px}}
    </style><main><header><strong>ISMI / F06.1 / REVIEW 02</strong><h1>Fattoush &amp; Knafeh</h1><p>Generated concepts. Selected simple cartoon direction. App graphics unchanged.</p><button onclick="document.querySelector('.grid').classList.toggle('blind')">Show / hide expression labels</button></header><section class="grid">'''+''.join(cards)+'''</section><p>Small portraits render at their actual 64px and 96px CSS sizes. Use 100% browser zoom.</p><section class="scenes"><article><h2>Catching up over coffee</h2><img src="lesson-coffee.png" alt="Fattoush listens to Knafeh over coffee"></article><article><h2>Making plans together</h2><img src="lesson-plans.png" alt="Fattoush points to a planner while Knafeh holds a pencil"></article></section><footer>October 14, 2026. OpenAI image_gen concepts; no human illustrator attribution. Individual PNG artwork is raster. Layout source and exact prompts included. No integration or release.</footer></main></html>'''
    (ROOT/'review.html').write_text(html)

if __name__ == '__main__':
    for state, _, _ in STATES:
        for size in (64,96):
            Image.open(ROOT/f'fattoush-{state}.png').resize((size,size),Image.Resampling.LANCZOS).save(ROOT/f'fattoush-{state}-{size}.png')
    make_pdf(); make_html()
    print('Created review-board.pdf and review.html')
