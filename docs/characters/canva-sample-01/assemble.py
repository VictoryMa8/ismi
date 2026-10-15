"""Compose existing Pablo Stanley drawings; no new character paths are authored."""
import json
import html
from pathlib import Path

ROOT = Path(__file__).parent
DATA = json.loads((ROOT / 'source/open-peeps-10.6.0.json').read_text())
COLORS = {'skin': '#D99A6C', 'clothing': '#16754F', 'headContrast': '#292523', 'ink': '#292523'}

def attrs(values, colors):
    return ''.join(' ' + key + '="' + html.escape(colors[value['name']] if isinstance(value, dict) and value.get('type') == 'color' else str(value), quote=True) + '"' for key, value in values.items())

def nodes(items, head='longCurly', expression='calm', colors=None):
    colors = colors or COLORS
    result = ''
    for item in items:
        if item['type'] == 'component':
            if item['name'] not in ['head', 'expression']:
                continue
            variant = head if item['name'] == 'head' else expression
            result += '<g' + attrs(item.get('attributes', {}), colors) + '>' + nodes(DATA['components'][item['name']]['variants'][variant]['elements'], head, expression, colors) + '</g>'
        else:
            result += '<' + item['name'] + attrs(item.get('attributes', {}), colors) + '>' + nodes(item.get('children', []), head, expression, colors) + '</' + item['name'] + '>'
    return result

def svg(body, width, height):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">{body}</svg>'

def portrait(expression='calm', head='longCurly', colors=None):
    return nodes(DATA['canvas']['elements'], head, expression, colors)

def placed_person(x, y, width, height, expression='smile', companion=False, mirror=False):
    colors = dict(COLORS, clothing='#B84535', skin='#C98453') if companion else COLORS
    content = portrait(expression, 'short2' if companion else 'longCurly', colors)
    if mirror:
        content = '<g transform="translate(704 0) scale(-1 1)">' + content + '</g>'
    return f'<svg x="{x}" y="{y}" width="{width}" height="{height}" viewBox="0 0 704 1000">{content}</svg>'

def scene(kind):
    body = '<rect width="800" height="440" fill="#F3EEE4"/>'
    if kind == 'cafe':
        body += '<rect x="317" y="28" width="166" height="200" rx="3" fill="#FFFDF8" stroke="#292523" stroke-width="3"/><path d="M400 30V226M319 128H481" fill="none" stroke="#292523" stroke-width="3"/>'
        body += placed_person(30, 20, 310, 440, 'explaining')
        body += placed_person(460, 20, 310, 440, 'smile', True, True)
        body += '<rect x="0" y="352" width="800" height="88" fill="#D8A442"/><path d="M0 352H800" stroke="#292523" stroke-width="4"/>'
        for x in [282, 455]:
            body += f'<ellipse cx="{x+25}" cy="350" rx="48" ry="7" fill="#FFFDF8" stroke="#292523" stroke-width="3"/><path d="M{x+50} 309H{x+62}Q{x+80} 328 {x+50} 334" fill="none" stroke="#292523" stroke-width="4"/><path d="M{x} 305H{x+50}V329Q{x+50} 348 {x+25} 348Q{x} 348 {x} 329Z" fill="#FFFDF8" stroke="#292523" stroke-width="4"/><path d="M{x+14} 288Q{x+4} 279 {x+14} 268M{x+34} 288Q{x+24} 279 {x+34} 268" fill="none" stroke="#292523" stroke-width="3" stroke-linecap="round"/>'
    else:
        body += '<rect x="310" y="35" width="180" height="156" rx="8" fill="#FFFDF8" stroke="#292523" stroke-width="4"/><path d="M312 72H488" stroke="#B84535" stroke-width="28"/><path d="M345 23V50M455 23V50" stroke="#292523" stroke-width="6" stroke-linecap="round"/>'
        for row in range(2):
            for col in range(4):
                body += f'<rect x="{331+col*37}" y="{104+row*36}" width="17" height="14" rx="2" fill="#D6CFC1"/>'
        body += '<circle cx="413" cy="147" r="16" fill="none" stroke="#16754F" stroke-width="4"/>'
        body += placed_person(30, 20, 310, 440, 'smile')
        body += placed_person(460, 20, 310, 440, 'explaining', True, True)
        body += '<rect x="0" y="352" width="800" height="88" fill="#D8A442"/><path d="M0 352H800" stroke="#292523" stroke-width="4"/>'
        body += '<g transform="translate(354 282) rotate(-9 44 66)"><rect width="88" height="131" rx="12" fill="#292523"/><rect x="7" y="12" width="74" height="100" rx="5" fill="#FFFDF8"/><path d="M20 36H64M20 51H57M20 66H63" stroke="#16754F" stroke-width="5" stroke-linecap="round"/><circle cx="44" cy="121" r="4" fill="#FFFDF8"/></g>'
    return body

def text(x, y, label, size=24, color='#292523', weight=400):
    return f'<text x="{x}" y="{y}" font-family="Arial, sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">{html.escape(label)}</text>'

if __name__ == '__main__':
    parts = ['<rect width="1600" height="1000" fill="#FAF7F0"/>', text(64, 65, 'Ismi / illustration study', 42, weight=700), text(64, 103, 'Fattoush — three expressions, two lesson scenes', 22, '#66635D'), text(1320, 65, '01 / OPEN PEEPS', 18, '#16754F', 700)]
    for i, (expression, label) in enumerate([('calm', 'Relaxed'), ('explaining', 'Speaking'), ('smile', 'Smiling')]):
        (ROOT / f'fattoush-{expression}.svg').write_text(svg(portrait(expression), 704, 704))
        x = 65 + i*365
        parts.append(f'<svg x="{x}" y="143" width="300" height="300" viewBox="0 0 704 704">' + portrait(expression) + '</svg>')
        parts.append(text(x, 480, label, 24, weight=700))
        parts.append(f'<svg x="{1190+i*110}" y="245" width="80" height="80" viewBox="0 0 704 704">' + portrait(expression) + '</svg>')
    parts += [text(1190, 210, 'At portrait size', 22, weight=700), text(1190, 365, 'Same hair, face and outfit.', 19, '#66635D'), '<path d="M64 515H1536" stroke="#D9D3C9" stroke-width="2"/>']
    for i, (kind, label) in enumerate([('cafe', 'A café check-in'), ('plans', 'Making plans together')]):
        content = scene(kind)
        (ROOT / f'lesson-{kind}.svg').write_text(svg(content,800,440))
        x=64+i*760
        parts.append(text(x, 558, label, 25, weight=700))
        parts.append(f'<rect x="{x}" y="582" width="712" height="340" fill="#F3EEE4"/><svg x="{x}" y="582" width="712" height="340" viewBox="0 0 800 440">'+content+'</svg>')
    parts += [text(64,967,'Character drawings: Pablo Stanley / Open Peeps (CC0). Palette and scene assembly: Ismi study.',17,'#66635D'),text(1340,967,'REVIEW SAMPLE',17,'#16754F',700)]
    (ROOT / 'sample-board.svg').write_text(svg(''.join(parts),1600,1000))
