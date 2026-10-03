# Chatterbox phrase audio implementation plan

Planning date: October 3, 2026. Roadmap ID: **F19**, first implementation priority.
The owner requested this plan for another agent to start; this task has not installed
Chatterbox, generated audio, changed application code or authorized publication.
[ROADMAP.md](../ROADMAP.md) remains the current status/priority source.

## Problem and bounded outcome

The owner reports robotic delivery and incorrect pronunciation when the app speaks
Arabic phrases. Current prompts without attached recordings use browser/device
speech synthesis. Improve the actual voice output with locally generated, saved
Chatterbox audio, beginning with the eight exercise prompts in lesson 1.

Success means a reproducible local generation workflow, explicit synthetic provenance,
reviewable samples and a working draft integration with online/offline playback.
Generating a WAV alone does not establish correct urban Palestinian pronunciation.
Audition a small sample before investing in full integration. Do not promise quality
improvement until someone has listened and recorded an assessment.

This is an interim synthetic-audio feature. It does not complete F09's real-speaker
recording requirement or replace the settled long-term human-audio plan. The owner
has deferred the learner rehearsal, not waived content approval or beta release gates.

## Approach and boundaries

Generate audio on the development machine in a separate Python environment. Store
accepted clips through the existing ASP.NET recording pipeline; Vue plays/caches
ordinary audio files. Do not run the model in the learner browser, Vercel functions,
or the free alwaysdata API host. No per-play inference, paid API, rented GPU,
subscription, voice-actor hiring or new learner-data collection is required by this design.
Local compute and disk capacity are feasibility questions, not assumed to be free
or unlimited. If local generation is impractical, document the measured limitation;
do not silently switch to a paid service.

Initial scope is eight exercise prompt attachments in lesson 1 (8/56 unit prompts).
Dialogue, teaching-card and answer-option audio, all-seven expansion, MSA/Quranic
speech, voice cloning from user recordings and live speaking feedback are outside
this slice. The console currently rejects teaching-card recordings. Keep that limit
unless a later scope explicitly extends it.

## Inputs and existing implementation

- Approved text: [lesson 1 package](../content/levantine/everyday-01/revisions/pilot-release/01-lesson.json).
  SHA-256: `3fed30fbc3ad6f65355f4ce889e65e1a3e10f248a18b913d5e4544675d96fef1`.
- [Eight-prompt batch](pilot/release-2026-10-03/recording-batch-01.json) supplies step
  IDs, Arabic text and role/address context. Preserve this human-recording checklist;
  create a separate synthetic generation manifest instead of filling its speaker fields
  with invented credits.
- Hosted baseline: `curriculum-levantine-everyday-01-01-v2`; all seven Everyday
  lessons are v2. Local versions differ. Inspect the selected target before drafting.
- [RecordingStore](../i-api/Services/RecordingStore.cs): content-addressed SHA-256
  WAV assets; 16-bit PCM, mono/stereo, 8–48 kHz, up to 10 MB.
- [Lesson models](../i-api/Models/LessonModels.cs),
  [validator](../i-api/Services/CurriculumValidator.cs),
  [publishing service](../i-api/Services/CurriculumPublishingService.cs): existing
  transcript/provenance and immutable publication gates.
- [Console editor](../i-web/src/RecordingEditor.vue),
  [frontend types](../i-web/src/types.ts), [API client](../i-web/src/api.ts),
  [learner playback](../i-web/src/App.vue), [offline storage](../i-web/src/offline.ts).
- Existing checks: [API recording tests](../i-tests/RecordingTests.cs) and
  [browser recording tests](../i-web/tests/recordings.spec.ts). Reuse and extend them.

## Work sequence

### 1. Establish local feasibility and pin the model

Inspect architecture, available memory/disk, Python, and supported inference devices.
Use a project-local isolated environment; keep environments, model weights, caches,
reference audio and generated scratch files out of Git. Choose a compatible pinned
Chatterbox **Multilingual** release and exact weight revision after inspecting its
actual model card and dependencies. Do not accidentally use an English-only model.
Record dependency versions, model identifier/revision, license evidence and attribution
requirements. Verify code and weight licenses separately; a code license is not
permission to clone any person's voice or reuse arbitrary reference recordings.

Prefer the model's supplied/default conditioning when its rights are clear. Inspect
what the selected revision actually loads. Do not scrape a Palestinian voice or use
a celebrity/friend's sample as implicit cloning consent. If a usable voice requires
permissioned reference material that is unavailable, record that as a blocker while
continuing the generator/provenance implementation with test fixtures.

Measure one real Arabic generation: startup time, generation time, device, memory
where measurable, output format, and any failures. If MPS fails, investigate a supported
CPU path before declaring the local route infeasible. Do not assert GPU support from
a generic example without running the selected multilingual model.

### 2. Produce a small, reviewable audition

Start with `e01-01`, `e01-04` and `e01-06`: a casual check-in, a feminine self-description
and a rest offer. Use the exact approved Arabic and explicit Arabic language selection.
Do not feed English role labels or transliteration as spoken text. Keep text generation
out of this process: Chatterbox voices existing curriculum; it does not author it.

Provide a simple local audition page or playable files showing the exact transcript,
step/role context, model/version and synthesis settings. Generate at most a few clearly
tracked variants per prompt initially. Record omissions, additions, repetition,
clipping, unnatural pauses, wrong gender/address endings and uncertain pronunciation.
No automated transcript/ASR check can certify dialect correctness.

Let the owner hear these samples before producing the full batch. Capture the
owner's assessment honestly; if no competent Palestinian pronunciation check is
available, mark it unverified. Poor output is a reason to revise settings or stop
expansion, not lower the acceptance standard. A proposed pronunciation-specific
spelling/diacritic input must be separately recorded and reviewed; never silently
change the canonical lesson text to make the synthesizer behave.

### 3. Implement reproducible batch generation

Proposed location: `tools/chatterbox/` with pinned environment instructions, CLI,
manifest schema and README. Suggested CLI capabilities: validate inputs/dry run,
select step IDs, select device/seed/settings, generate into a named output directory,
resume completed items and explicitly regenerate selected variants.

The manifest should capture: lesson ID and source package hash; step ID; exact
approved text and any separately approved synthesis input; model/weights revision;
package/runtime versions; language; voice conditioning provenance/hash; seed and
settings; generation date/device; output SHA-256, duration, sample rate/format;
license/attribution references; and actual review status/notes. Reject stale input
hashes, unknown steps, empty outputs and unsupported WAV formats. Keep prior accepted
variants intact. Seeds aid reproducibility but do not promise identical bytes across
hardware; output hashes identify the actual artifact.

After sample acceptance, generate the eight prompt attachments. Identical text may
share an asset only if voice, address context and review allow it; preserve each
step mapping. Convert output explicitly to the existing PCM WAV contract without
changing speed/pitch or clipping. Do not remove the model's watermark.

### 4. Integrate honest synthetic provenance into draft curriculum

Extend recording metadata with an explicit origin such as `human` / `synthetic` and
structured synthesis provenance. Make it backward compatible with existing stored
human-recording metadata without rewriting published snapshots. Update C# models,
TypeScript types, console editing/import, validation, learner labels and source details
together. Preserve transcript equality, matching source records and existing rights
checks. Synthetic fields must not be accepted as evidence of a human speaker or
native-expert review. Separate target dialect from a verified dialect assessment.

Current `App.vue` displays “Recorded” and “Urban Palestinian” for attachments; replace
that assumption for synthetic clips with concise “AI-generated audio” labeling and
accurate review details. Where no clip is attached, retain the explicitly labeled
device-voice preview. An attached clip failing to load should report a retryable error,
not silently switch to an indistinguishable device voice. Keep text alternatives,
sound behavior and free offline access intact.

Use the normal console to prepare a new lesson-1 draft with the eight assets in a
local/test environment. Preserve its approved language, answers and character roles.
Local version numbers are target-specific; do not hard-code “v3” for all databases.
Keep existing published v2 and its hashes unchanged. Do not bypass approval through
database updates or relabel unreviewed clips to satisfy validators.

### 5. Verify and prepare the release candidate

Run focused verification, then the relevant build/regression checks:

| Area | Evidence required |
| --- | --- |
| Generator | Stale package hash and missing/invalid outputs fail clearly; resume preserves existing accepted files; manifest matches actual output hashes |
| Provenance | Legacy metadata still reads; synthetic origin survives save/import/read; incomplete synthesis/source records fail validation; publication gates remain enforced |
| Playback | Accepted files play; stop/replay, rapid navigation and error/retry work without overlapping audio; synthetic labels and transcripts are accessible |
| Offline | All attached assets are downloaded and hash-verified; offline reload/playback works; interrupted downloads preserve the prior complete package |
| Content | Exact texts/roles unchanged; 8/8 mappings verified; real listening notes and unresolved pronunciation issues recorded |
| Scope | Prompt coverage reported as 8/56 at most; no claim of dialogue, unit-wide, native-reviewed or real-iPhone coverage |

Use disposable databases/profiles for automated publication and completion. Real
local model inference is an explicit smoke check, not a heavyweight download on every
CI run. Normal tests can use clearly labeled generated/synthetic fixtures, which do
not count as listening evidence. Do not resume the deferred participant rehearsal as
part of this engineering task. Record real Safari/VoiceOver evidence separately when
actually performed.

Prepare the exact new package/assets/provenance for owner review. Publishing these
new audio assets and deploying code changes require applicable owner authorization;
the earlier approval covered the text/art v2 release, not new generated audio.
Document asset retention and curriculum rollback before any later deployment.

## Completion and stop conditions

F19 can be Done when the local generator, labeled draft integration, eight accepted
prompt mappings, meaningful automated checks and recorded owner listening assessment
are complete. State explicitly whether pronunciation remains unverified and whether
the result is local, committed, deployed or published. The owner may accept a clearly
labeled synthetic preview; that does not turn it into native-reviewed teaching audio.
If samples are not acceptable or hardware/reference rights block real generation,
record exact results and remaining work; do not mark the complete F19 scope Done.

The next agent should begin with step 1 and the three-phrase audition, marking F19
Active when implementation begins. Preserve all existing uncommitted work and work
on `main`. Use root `npm run api` and `npm run web` in separate terminals if needed.
Do not create a branch/worktree, push, publish, buy services or contact anyone merely
because this plan is first priority.

## Primary references checked October 3, 2026

- [Official Chatterbox repository](https://github.com/resemble-ai/chatterbox):
  multilingual Arabic support, installation/examples, CPU/MPS/CUDA device examples,
  model-family distinctions and watermarking. Recheck the selected pinned revision.
- [Official model repository](https://huggingface.co/ResembleAI/chatterbox): model
  artifacts/card; inspect the exact multilingual weights' license before downloading.
- [Official code license](https://github.com/resemble-ai/chatterbox/blob/master/LICENSE): MIT.

These sources establish available software, not measured performance on this machine
or correct Palestinian pronunciation. None of the auditions has been run yet.
