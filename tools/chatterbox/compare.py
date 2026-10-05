"""Build a local comparison page from verified audition outputs."""
import html
import json
from pathlib import Path
from audition import HERE, AUDITION, wav_info


def main():
    output = HERE / 'outputs'
    variants = sorted(p for p in output.glob('audition-v*') if p.is_dir())
    cards = []
    for step in AUDITION:
        samples = []
        transcript = None
        for variant in variants:
            manifest = variant / f'{step}.json'
            if not manifest.exists():
                continue
            record = json.loads(manifest.read_text())
            if record['output'] != wav_info(variant / f'{step}.wav'):
                raise ValueError('Artifact changed: ' + str(manifest))
            clip = record['identity']['clip']
            if transcript is not None and transcript != clip['transcript']:
                raise ValueError('Comparison requires identical canonical text')
            transcript = clip['transcript']
            settings = record['identity']['settings']
            esc = html.escape
            notes = ' '.join(record['review']['notes']) or 'Listening review pending.'
            samples.append(f'''<div><h3>{esc(variant.name)}</h3>
<p>Expression {settings['exaggeration']} · CFG {settings['cfg_weight']} · {record['output']['durationSeconds']:.2f} seconds</p>
<audio controls preload="metadata" src="{esc(variant.name)}/{step}.wav"></audio>
<p>{esc(notes)}</p><a href="{esc(variant.name)}/{step}.json">Provenance</a></div>''')
        if samples:
            cards.append(f'<section><h2>{step}</h2><p lang="ar" dir="rtl" class="arabic">{html.escape(transcript)}</p>'+''.join(samples)+'</section>')
    (output / 'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>F19 audition comparison</title><style>body{font:18px system-ui;max-width:850px;margin:40px auto;padding:0 20px;background:#faf9f5;color:#202a25}section{border:1px solid #216845;border-radius:12px;padding:20px;margin:20px 0}h3{margin-top:30px}.arabic{font-size:36px}audio{width:100%}a{color:#165537}</style>
<h1>Audition comparison</h1><p>AI-generated audio · Chatterbox Multilingual V3 · Palestinian pronunciation unverified.</p>
<p>V1: original. V2: expression reduced from 0.5 to 0, with the same Arabic text, seed and other settings. No playback speed adjustment.</p>
<p>Compare ʿayn and word endings in the check-ins, then the pace of the rest offer. No clips are accepted yet.</p>'''+''.join(cards)+'''<script>document.addEventListener('play',event=>{if(event.target.tagName==='AUDIO')document.querySelectorAll('audio').forEach(audio=>{if(audio!==event.target)audio.pause()})},true)</script></html>''')
    print(output / 'index.html')


if __name__ == '__main__':
    main()
