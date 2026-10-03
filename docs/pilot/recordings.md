# Preparation for reviewed speaker recordings

Status: scripts available; no speakers contacted, budget committed, recordings
collected, or asset approvals granted. This work is separate from the text pilot.

For the authorized first batch use the [October 3 lesson-1 prompt pack](release-2026-10-03/recording-batch-01.md),
pinned to the release candidate and awaiting final wording approval. It supplies
eight exact prompt clips, coverage and missing permission/review fields.

The table below is **historical v1 dialogue context**, not the recording instruction
for revised lessons. Its wording comes from the exact v1 package in the
[review manifest](../../content/levantine/everyday-01/review-manifest.json).
Each readable review includes six dialogue turns:

| Lesson | Script |
| --- | --- |
| How was your day? | [01-review](../../content/levantine/everyday-01/01-review.md#dialogue--recording-script) |
| What did you do today? | [02-review](../../content/levantine/everyday-01/02-review.md#dialogue--recording-script) |
| Want tea or coffee? | [03-review](../../content/levantine/everyday-01/03-review.md#dialogue--recording-script) |
| Let's eat together | [04-review](../../content/levantine/everyday-01/04-review.md#dialogue--recording-script) |
| How's your family? | [05-review](../../content/levantine/everyday-01/05-review.md#dialogue--recording-script) |
| What are we doing tomorrow? | [06-review](../../content/levantine/everyday-01/06-review.md#dialogue--recording-script) |
| Put it together | [07-review](../../content/levantine/everyday-01/07-review.md#dialogue--recording-script) |

The review documents retain historical draft banners; the unit README and manifest
identify the subsequently approved versions. Do not silently edit a published
script to reflect a speaker's suggested correction; route a change through a new
version and owner approval.

## Owner decisions before collecting assets

- Select speakers and intended Palestinian urban model; deliberately label any
  Jordanian variants. Confirm speaker credit or an agreed pseudonym.
- Agree compensation/budget and permission for web playback, offline downloads,
  storage and distribution; record the exact permission and restrictions as provenance.
- Assign a wording/pronunciation reviewer and resolve gender/address and naturalness
  questions. Do not imply native-expert review without an actual qualified reviewer.
- Decide which prompt clips to record first. The existing upload/playback feature
  attaches individual exercise prompts, not an entire multi-speaker dialogue track.

## Handoff checklist per prompt clip

Copy the exact lesson/version, step ID and `prompt.arabic` from the structured
package. Include its meaning/transliteration for context and the package's
`introduction.recordingNote` for role/address notes. Keep the full dialogue script
as context; it is not a substitute for the individual prompt transcript.

Prepare 16-bit PCM WAV, mono or stereo, 8–48 kHz, at most 10 MB per file, matching the
[current upload implementation](../../README.md#recorded-lesson-audio). Record:

- Lesson/version/step, exact Arabic transcript and recording filename.
- Speaker credit/pseudonym, dialect, recording date and provenance source ID.
- Permission evidence and any limitations on playback/offline distribution.
- Reviewer, review date, pronunciation/wording notes and unresolved corrections.

Upload through a new console draft, listen to the full clip, verify transcript and
metadata, validate, and seek owner approval of that exact version before publication.
Verify published playback and a complete offline download after publication. The
current immutable storage/hash checks establish byte integrity, not linguistic
accuracy or permission. Until assets pass this process, keep device voice visibly
labeled as a preview and the reviewed-recording count at zero.
