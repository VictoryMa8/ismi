#!/usr/bin/env python3
"""Local, unpublished F19 audition. No model imports/downloads during --dry-run."""
import argparse
import hashlib
import html
import importlib.metadata
import json
import os
from pathlib import Path
import platform
import inspect
import random
import resource
import time
import wave
from unittest.mock import patch
from datetime import datetime, timezone

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PACKAGE = ROOT / 'content/levantine/everyday-01/revisions/pilot-release/01-lesson.json'
BATCH = ROOT / 'docs/pilot/release-2026-10-03/recording-batch-01.json'
EXPECTED = '3fed30fbc3ad6f65355f4ce889e65e1a3e10f248a18b913d5e4544675d96fef1'
AUDITION = ['e01-01', 'e01-04', 'e01-06']


def sha(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def inputs(package=PACKAGE, batch=BATCH):
    if sha(package) != EXPECTED:
        raise ValueError('Stale lesson package: reconcile approved package hash first')
    lesson = json.loads(Path(package).read_text())['lesson']
    data = json.loads(Path(batch).read_text())
    if data['packageSha256'] != EXPECTED or data['lessonId'] != lesson['id']:
        raise ValueError('Recording batch does not match approved package')
    steps = {s['id']: s for s in lesson['steps']}
    for clip in data['clips']:
        step = steps[clip['stepId']]
        if clip['transcript'] != step['prompt']['arabic']:
            raise ValueError('Batch transcript mismatch: ' + clip['stepId'])
        roles = step.get('characters', {})
        if clip['speakerRole'] != roles.get('speakerId', 'neutral-narrator') or clip['addresseeRole'] != roles.get('addresseeId'):
            raise ValueError('Batch role mismatch: ' + clip['stepId'])
    return lesson, {c['stepId']: c for c in data['clips']}


def wav_info(path):
    with wave.open(str(path), 'rb') as w:
        if (w.getcomptype() != 'NONE' or w.getsampwidth() != 2 or
            w.getnchannels() not in (1, 2) or not 8000 <= w.getframerate() <= 48000 or
            w.getnframes() == 0 or Path(path).stat().st_size > 10 * 1024 * 1024):
            raise ValueError('Unsupported or empty PCM WAV: ' + str(path))
        frames = w.readframes(w.getnframes())
        if len(frames) != w.getnframes() * w.getnchannels() * 2:
            raise ValueError('Truncated WAV')
        return dict(sha256=sha(path), durationSeconds=w.getnframes() / w.getframerate(),
                    sampleRate=w.getframerate(), channels=w.getnchannels(), format='PCM_16')


def write_json(path, value):
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(path)


def verify_record(record, path, identity):
    if record['identity'] != identity:
        raise ValueError('Existing variant has different inputs/settings; use a new output directory')
    if wav_info(path) != record['output']:
        raise ValueError('Existing WAV failed manifest verification; preserve and inspect it')


def page(output, records):
    cards = []
    for r in records:
        c = r['identity']['clip']
        esc = html.escape
        cards.append(f'''<section><h2>{esc(c['stepId'])}</h2>
<p lang="ar" dir="rtl" class="arabic">{esc(c['transcript'])}</p>
<p>{esc(c['arabizi'])} — {esc(c['meaning'])}</p>
<p>{esc(c['speakerRole'])} → {esc(c['addresseeRole'] or 'none')}</p>
<audio controls preload="metadata" src="{esc(c['stepId'])}.wav"></audio>
<p>AI-generated audio · owner review: {esc(r['review']['ownerListening'])} · Palestinian pronunciation unverified</p>
<details><summary>Generation evidence</summary><pre>{esc(json.dumps(r, ensure_ascii=False, indent=2))}</pre></details></section>''')
    (output / 'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>F19 audio audition</title>
<style>body{font:18px system-ui;max-width:850px;margin:40px auto;padding:0 20px;background:#faf9f5;color:#202a25}section{padding:20px;border:1px solid #216845;border-radius:12px;margin:20px 0}.arabic{font-size:36px}audio{width:100%}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px}</style>
<h1>Three-phrase audition</h1><p>Chatterbox Multilingual V3 · supplied default voice · local unpublished samples.</p>
<p>Listen for omitted/added words, repetition, pauses, clipping and masculine/feminine endings. Assess naturalness and pronunciation separately. See each clip’s review status and provenance for listening notes.</p>''' + ''.join(cards) + '''<script>document.addEventListener('play',event=>{if(event.target.tagName==='AUDIO')document.querySelectorAll('audio').forEach(audio=>{if(audio!==event.target)audio.pause()})},true)</script></html>''')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--steps', nargs='+', default=AUDITION, choices=AUDITION)
    parser.add_argument('--device', choices=['cpu', 'mps'], default='mps')
    parser.add_argument('--seed', type=int, default=19)
    parser.add_argument('--cfg', type=float, default=0.0)
    parser.add_argument('--exaggeration', type=float, default=0.5)
    parser.add_argument('--output', type=Path, default=HERE / 'outputs/audition-v1')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    if not 0 <= args.cfg <= 1 or not 0 <= args.exaggeration <= 2:
        parser.error('cfg must be 0–1 and exaggeration 0–2')
    lesson, clips = inputs()
    lock = json.loads((HERE / 'model-lock.json').read_text())
    settings = dict(language_id='ar', exaggeration=args.exaggeration, cfg_weight=args.cfg,
                    temperature=0.8, repetition_penalty=1.2, min_p=0.05, top_p=1.0)
    identities = [dict(lessonId=lesson['id'], packageSha256=EXPECTED, clip=clips[s],
                       model=lock, device=args.device, seed=args.seed, settings=settings)
                  for s in dict.fromkeys(args.steps)]
    if args.dry_run:
        print(json.dumps(identities, ensure_ascii=False, indent=2))
        return
    os.environ.setdefault('HF_HOME', str(HERE / '.cache/huggingface'))
    os.environ.setdefault('HF_HUB_DISABLE_IMPLICIT_TOKEN', '1')
    os.environ.setdefault('HF_HUB_DISABLE_TELEMETRY', '1')
    os.environ.setdefault('XDG_CACHE_HOME', str(HERE / '.cache'))
    os.environ.setdefault('NUMBA_CACHE_DIR', str(HERE / '.cache/numba'))
    os.environ.setdefault('TORCH_HOME', str(HERE / '.cache/torch'))
    os.environ.setdefault('PKUSEG_HOME', str(HERE / '.cache/pkuseg'))
    os.environ.setdefault('HF_HUB_DISABLE_XET', '1')
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    records = []
    pending = []
    for identity in identities:
        step = identity['clip']['stepId']
        manifest, wav = output / f'{step}.json', output / f'{step}.wav'
        if manifest.exists():
            record = json.loads(manifest.read_text())
            verify_record(record, wav, identity)
            records.append(record)
        elif wav.exists():
            raise ValueError('Untracked WAV exists; use a new output directory')
        else:
            pending.append(identity)
    if pending:
        import numpy as np
        import torch
        import soundfile as sf
        from huggingface_hub import snapshot_download
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS, punc_norm
        if sha(inspect.getfile(ChatterboxMultilingualTTS)) != lock['loaderSha256']:
            raise ValueError('Installed multilingual loader differs from pinned source')
        if importlib.metadata.version('chatterbox-tts') != lock['version']:
            raise ValueError('Installed Chatterbox differs from model lock')
        if args.device == 'mps' and not torch.backends.mps.is_available():
            raise ValueError('MPS unavailable; explicitly retry --device cpu in a new directory')
        started = time.perf_counter()
        checkpoint = Path(snapshot_download(lock['modelId'], revision=lock['revision'],
                          allow_patterns=lock['files'], token=False))
        download_seconds = time.perf_counter() - started
        hashes = {f: sha(checkpoint / f) for f in lock['files']}
        started = time.perf_counter()
        torch.set_num_threads(4)
        # Upstream eagerly initializes the Chinese helper even for Arabic.
        # Resolve its otherwise-unpinned mapping request to our pinned local asset.
        def pinned_mapping(*, repo_id, filename, **kwargs):
            if repo_id != lock['modelId'] or filename != 'Cangjie5_TC.json':
                raise ValueError('Unexpected auxiliary model request')
            return str(checkpoint / filename)
        with patch('chatterbox.models.tokenizers.tokenizer.hf_hub_download', pinned_mapping):
            model = ChatterboxMultilingualTTS.from_local(checkpoint, args.device, t3_model=lock['checkpoint'])
        load_seconds = time.perf_counter() - started
        if model.conds is None:
            raise ValueError('Publisher default conditioning missing; no permitted external reference supplied')
        runtime = {d.metadata['Name']: d.version for d in importlib.metadata.distributions()}
        for identity in pending:
            step = identity['clip']['stepId']
            random.seed(args.seed); np.random.seed(args.seed); torch.manual_seed(args.seed)
            if args.device == 'mps':
                torch.mps.manual_seed(args.seed)
            text = identity['clip']['transcript']
            started = time.perf_counter()
            audio = model.generate(text, **settings).squeeze(0).cpu().numpy()
            elapsed = time.perf_counter() - started
            if audio.ndim != 1 or not len(audio) or not np.isfinite(audio).all() or np.max(np.abs(audio)) == 0:
                raise ValueError('Invalid, silent or empty generation')
            peak = float(np.max(np.abs(audio)))
            if peak >= 1:
                raise ValueError(f'Output would clip ({peak}); preserve settings and investigate')
            wav = output / f'{step}.wav'
            sf.write(wav, audio, model.sr, subtype='PCM_16')
            record = dict(identity=identity, origin='synthetic', generatedAt=datetime.now(timezone.utc).isoformat(),
                          synthesisInput=text, modelNormalizedInput=punc_norm(text),
                          conditioningSha256=hashes['conds.pt'], weightHashes=hashes,
                          python=platform.python_version(), platform=platform.platform(), runtime=runtime,
                          downloadSeconds=download_seconds, modelLoadSeconds=load_seconds,
                          generationSeconds=elapsed, peakAmplitude=peak,
                          processPeakRssBytes=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,
                          output=wav_info(wav), watermark='Upstream Perth applied; not removed',
                          review=dict(ownerListening='pending', pronunciation='unverified', notes=[]))
            write_json(output / f'{step}.json', record)
            records.append(record)
            page(output, records)
            print(json.dumps(dict(step=step, seconds=elapsed, output=record['output']), ensure_ascii=False), flush=True)
    page(output, records)
    print('Audition: ' + str(output / 'index.html'), flush=True)


if __name__ == '__main__':
    main()
