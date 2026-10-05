# Local F19 audition

This tool voices approved lesson text; it does not author curriculum. The initial
scope is three **unpublished, unreviewed synthetic samples**. Full-batch generation
and learner/console integration follow owner listening review. F09 human recordings
remain separate.

## Environment

Run from the repository root on macOS arm64 with Python 3.13.3. Environment, caches
and WAVs stay under this directory and are ignored by Git. No account/token or paid
service is needed. The exact dependency snapshot is
`requirements-macos-arm64-py313.lock.txt`; `model-lock.json` pins weights separately.
Use the pinned source archive (PyPI 0.1.7 lacks the V3 loader despite sharing its
version number). Install the dependency lock first, then source with `--no-deps`: upstream source names a moving Perth Git dependency; this environment uses released Perth 1.0.1 and setuptools 80.9.0 for its `pkg_resources` compatibility. Retain `CHATTERBOX-LICENSE.txt` with redistributed code.

```sh
python3 -m venv tools/chatterbox/.venv
tools/chatterbox/.venv/bin/python -m pip install --cache-dir tools/chatterbox/.cache/pip -r tools/chatterbox/requirements-macos-arm64-py313.lock.txt
tools/chatterbox/.venv/bin/python -m pip install --no-deps "https://github.com/resemble-ai/chatterbox/archive/5de7a54aa4e5e2baadb0182dde554908b48b85c2.tar.gz#sha256=003f8c85dcfeb2d91b3a6f97f43b74703d15131e987dfabb7f3d9aee7c0da2cf"
python3 tools/chatterbox/audition.py --dry-run
python3 -m unittest discover -s tools/chatterbox -p 'test_*.py'
tools/chatterbox/.venv/bin/python tools/chatterbox/audition.py --device mps
```

Model weights download on the first inference run. `--dry-run` and tests need only
Python's standard library. CPU fallback is explicit and uses a separate directory:

```sh
tools/chatterbox/.venv/bin/python tools/chatterbox/audition.py --device cpu --output tools/chatterbox/outputs/audition-cpu-v1
```

Use `--steps e01-01` for one phrase. `--seed`, `--cfg` and `--exaggeration` select a
variant; give changed settings a **new output directory**. Existing files are never
intentionally overwritten: resume verifies settings, format and SHA-256 first.
An orphaned WAV without a manifest requires inspection or a new output directory.
Seeds do not promise byte identity on other hardware. This initial CLI deliberately
restricts steps to the three audition IDs until listening review permits expansion.

Open `outputs/audition-v1/index.html` locally, or serve that directory through a
loopback-only static server. The page has exact Arabic transcripts, role context,
standard audio controls and expandable provenance. Each WAV has a JSON sidecar.
Do not expose the repository, model cache or environment through a web server.

## Model and voice

Chatterbox **Multilingual V3**, Arabic language ID `ar`, publisher-supplied
`conds.pt`, seed 19, CFG 0, exaggeration 0.5, temperature 0.8. The model card
recommends CFG 0 to mitigate cross-language reference accent transfer. No external
voice is cloned. Default voice identity, source language and dialect are unknown;
it is not a reviewed Palestinian speaker or a character-specific voice.

The pinned model repository declares MIT for its artifacts, including supplied
conditioning, and its quickstart uses that conditioning without an external clip.
That is the basis for a local default-voice audition, not evidence of individual
speaker consent or permission to clone arbitrary reference audio. Code and model
license URLs are separately recorded in `model-lock.json`. Keep the upstream Perth
watermark; the tool does not remove it. A later external reference needs its own
permission and provenance review.

Exact canonical Arabic is passed to `generate`. Upstream `punc_norm` appends a
period after Arabic `؟`; each manifest exposes `modelNormalizedInput` as well as the
unchanged `synthesisInput`. No pronunciation spelling or diacritics are substituted.
The source package and human-recording checklist are never edited by this tool.
The plan's original description of e01-04 as a self-description was wrong: that
ID is the feminine check-in; e01-02 contains the feminine self-description.

## Evidence and review

Sidecars record source hash, prompt/roles, model revision, all downloaded weight
hashes, conditioning hash, package/runtime versions, device, seed/settings, UTC
generation time, load/generation duration, process peak RSS, output format/duration
and SHA-256. On macOS `ru_maxrss` is bytes and includes CPU process peak memory;
it is not a complete measurement of GPU memory. Audio converts directly to mono
16-bit PCM with unchanged sample rate and no speed/pitch adjustment. Non-finite,
silent, empty or clipping output fails; format/size limits match RecordingStore.

Listen for omitted/added words, repetition, clipping, pauses, gender/address endings
and pronunciation. Record the owner's actual assessment in the feature note, with
per-clip hashes. Leave Palestinian pronunciation unverified unless competent review
is supplied. A valid WAV or passing automated test is not listening evidence.

Retain the local output directory and its sidecars together until the owner decides
which variants to keep. Caches and the isolated environment are rebuildable;
accepted audio must be retained by hash before cleanup. Nothing is uploaded into
the curriculum database, published, committed or deployed by this tool. Existing
lesson snapshots and their rollback history are unaffected.

## Compare the first revision

```sh
tools/chatterbox/.venv/bin/python tools/chatterbox/audition.py --device mps --exaggeration 0 --output tools/chatterbox/outputs/audition-v2
python3 tools/chatterbox/compare.py
python3 -m http.server 8767 --bind 127.0.0.1 --directory tools/chatterbox/outputs
```

The comparison page preserves both versions and the recorded owner feedback.
Re-running the generator on completed variants verifies their hashes without
importing the model or requiring GPU access. See the dated evidence in
[the feature note](../../docs/chatterbox-audition-2026-10-03.md).
