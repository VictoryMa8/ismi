# F19 local feasibility and first audition — October 3, 2026

**Result:** local Arabic inference succeeds on this Apple M4 Mac using MPS.
Three synthetic prompts were generated in two tracked variants. The owner selected **“Revise pronunciation
or delivery”** after being given the audition. The owner hears missing ʿayn and wrong endings in both check-ins (“shu amin” and
“shu aela”), and says the rest offer is okay but very, very fast. The owner subsequently confirmed V2 retains the same pronunciation errors and
questioned continuing this approach. This audition is unsuccessful for teaching
audio; zero clips are accepted. No further settings-only iteration is planned. Do not expand
to eight prompts or integrate these samples as accepted curriculum audio yet.

## Reproduction and artifacts

- [Tool and setup](../tools/chatterbox/README.md), [generator](../tools/chatterbox/audition.py),
  [model/source pin](../tools/chatterbox/model-lock.json),
  [dependency snapshot](../tools/chatterbox/requirements-macos-arm64-py313.lock.txt).
- [Durable measurements, output hashes and review state](chatterbox-audition-2026-10-03.json).
- Local ignored files: `tools/chatterbox/outputs/audition-v1/index.html`, three WAVs
  and three complete provenance sidecars. The comparison server binds only to
  `127.0.0.1:8767` and serves `tools/chatterbox/outputs/`, including preserved v1
  and revised v2. The original v1-only server is on port 8766.
- Approved source package SHA-256 remains
  `3fed30fbc3ad6f65355f4ce889e65e1a3e10f248a18b913d5e4544675d96fef1`.
  The human recording checklist and all curriculum packages are unchanged.

## Measurements

Machine: arm64 Apple M4, 24 GiB RAM, about 89 GiB initially available disk.
Python 3.13.3, torch/torchaudio 2.6.0, Chatterbox source commit
`5de7a54aa4e5e2baadb0182dde554908b48b85c2` (package version 0.1.7),
Multilingual V3 weights at model revision
`5bb1f6ee58e50c3b8d408bc82a6d3740c2db6e18`.

Model load: **17.72 seconds**, including Chinese helper initialization/download.
Process peak RSS: **5,306,712,064 bytes (~4.94 GiB)**; not total GPU memory.
The Python environment occupies about 1.2 GiB, and model cache about 3.0 GiB,
plus package/download caches. First inference includes warm-up overhead.

| Step | Exact approved text | Generation | Audio duration | Peak amplitude |
| --- | --- | --- | --- | --- |
| e01-01 | شو عامل؟ | 21.66 s | 1.08 s | 0.9191 |
| e01-04 | شو عاملة؟ | 4.43 s | 1.20 s | 0.9738 |
| e01-06 | بدك ترتاح؟ | 3.37 s | 1.20 s | 0.9934 |

All outputs: mono, 24,000 Hz, 16-bit PCM WAV. No clipping, speed/pitch modification
or watermark removal. Upstream Perth successfully initialized and applied its
watermark. No separate watermark-detection claim is made. Settings: language `ar`,
seed 19, CFG 0, exaggeration 0.5, temperature 0.8, repetition penalty 1.2,
min-p 0.05, top-p 1. No external voice reference was used.

### Revised audition (v2)

Expression/exaggeration reduced from 0.5 to 0, with seed 19, CFG 0 and all text
unchanged. Durations are 2.12 s (e01-01), 1.32 s (e01-04), and 1.44 s (e01-06).
This is a measured duration change, not a pronunciation improvement claim.
No playback speed or pitch modification was applied. Owner comparison confirms the pronunciation errors remain. V2 is not accepted;
no separate V2 pacing assessment was supplied.
The [measurement record](chatterbox-audition-2026-10-03.json) pins all six outputs.

## Findings and fixes

1. The original plan called e01-04 a feminine self-description. The approved
   package says “شو عاملة؟”, a feminine-address check-in. The explicit requested
   IDs were retained; the plan's prose was corrected. e01-02 is the self-description.
2. PyPI 0.1.7's multilingual loader only supports V2. The pinned official source
   commit supports V3, so install it separately over the pinned dependency set.
   The CLI verifies the installed loader's SHA-256, not just its version string.
3. Large downloads appeared stalled for several minutes. The interrupted first
   run's downloader completed its artifacts before exit; the standard-HTTP retry
   found all six cached files. HTTP mode is now explicit. No inference speed claim
   includes that first download; its exact total download time was not captured.
4. Released Perth 1.0.1 imports `pkg_resources`. Setuptools 84 caused model startup
   to fail with `PerthImplicitWatermarker = None`; pinning setuptools 80.9.0 fixed
   it. Watermarking was not bypassed. Source's moving Perth Git dependency is
   deliberately replaced by the tested released dependency in setup instructions.
5. Upstream eagerly initializes a Chinese segmenter even for Arabic. The first
   attempt created its cache in `~/.pkuseg`; subsequent runs explicitly use local
   `PKUSEG_HOME`. The CLI now resolves the Chinese mapping request to the pinned
   checkpoint asset instead of an unpinned `main` download. Neither Chinese helper
   participates in Arabic text processing.
6. Upstream punctuation normalization appends a period after Arabic `؟`. Sidecars
   disclose the normalized model input and exact submitted input separately. No
   lesson text or pronunciation-specific spelling was altered.
7. MPS is visible outside the restricted command sandbox and real inference passed
   there. A sandboxed resume initially checked MPS too early and failed; resume now
   verifies existing files using only the standard library, without loading a model
   or requiring GPU access. CPU fallback was unnecessary and has not been measured.

## License and provenance basis

The [pinned model card](https://huggingface.co/ResembleAI/chatterbox/blob/5bb1f6ee58e50c3b8d408bc82a6d3740c2db6e18/README.md)
declares MIT and shows default-conditioning multilingual usage. The
[pinned code license](https://github.com/resemble-ai/chatterbox/blob/5de7a54aa4e5e2baadb0182dde554908b48b85c2/LICENSE)
is MIT; its notice is retained in the tool folder. The publisher's bundled
`conds.pt` is used on this basis for the local audition. Speaker identity, source
language, individual consent documentation and Palestinian dialect are not supplied
by that metadata. No person is credited as a reviewed speaker; external cloning
permission is not inferred from the software license.

## Verification and remaining work

Five standard-library checks pass: approved IDs/text/roles; stale source hash;
changed batch transcripts/roles; invalid/empty WAVs; resume settings/hash integrity.
A real resume with networking disabled validates all three artifacts and preserves
the WAV bytes. The page displays exact transcripts, role context, audio controls,
synthetic/unverified labels and provenance; playing one clip pauses the others.
The Codex in-app browser loaded all six audio elements (readyState 4, no media
errors) and showed the expected transcripts/review labels. No browser/device
accessibility or expert listening result is inferred.

Next: decide a different audio direction before further generation or integration.
Recommendation: retain the tooling/evidence, stop tuning this default voice, and
prioritize the already-planned permissioned human recordings (F09) when available.
No new voice/provider selection, reference acquisition, diacritic experiment or
spending is authorized by this assessment. F19 is Needs decision, not Done.
Full-batch generation, accepted prompt mappings, synthesis provenance integration
and playback/offline checks remain incomplete. Coverage is **3/56 audition prompts
in two variants, 0/56 accepted**.

Everything is local and uncommitted. No application code or database was changed,
no audio was published, no push or deployment occurred, and F09 remains open.
