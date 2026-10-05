# Make a plan together

F12.1 · October 4, 2026 · Three draft lessons for owner review.

After Everyday conversations, learners use familiar urban Palestinian language to
make a shared plan, ask for a missing time, preserve activity order, and repair a
misunderstood day or hour. This is a bounded transfer unit, not an additional week
of demonstrated curriculum depth or evidence of spontaneous conversation.

| Order | Lesson | Communicative task |
| --- | --- | --- |
| 8 | [Choose a plan](01-review.md) | Propose an activity, ask when, confirm the details |
| 9 | [What happens first?](02-review.md) | Sequence two activities and distinguish order from clock time |
| 10 | [Clear up the plan](03-review.md) | Correct a misunderstanding and confirm whose family is involved |

There are 18 dialogue turns, 15 teaching cards and 18 contextual practice steps.
Each step has three choices with individual rationales and a retry hint. Existing
recall-before-reveal and phrase reconstruction remain available through the shared
lesson renderer. Estimates are six minutes per lesson, not measured learner times.
English help begins hidden; transliteration and help remain available.

## Source and review boundary

The importable `*-lesson.json` files are the source of truth. The readable review
files include the dialogue, teaching cards, all practice options and rationales.
[The manifest](review-manifest.json) pins the exact package hashes, first-unit
predecessor hashes and phrase-level origin lessons.

The unit draws on the F08-approved first-unit language and its recorded Maknuune
and Lingualism references. It introduces new combinations and communicative tasks,
not a new external source foundation. Embedded source records retain inherited
lexical IDs and publisher locators; no new retrieval or independent verification
is claimed. Publisher dialogues, exercises, datasets and recordings are not copied.
The original source approval covered the first unit; it does not approve these
finished compositions. All new dialogue, explanations and rationales are
AI-assisted drafts for the owner's final review, not native-expert review.

Owner review should check the naturalness of short corrections with `laʾ`, the
shared evening context, my/your family perspective, phrase chunking and whether
each instruction makes the intended answer unambiguous. Wrong choices are usually
valid Arabic for a different requested arrangement. The app explains the specific
mismatch instead of rejecting the expression universally. No reviewed audio ships.

## Import and preview

From the repository root, import drafts with the existing maintenance command:

```sh
dotnet run --project i-api --no-launch-profile -- --import-curriculum "$PWD/content/levantine/plans-02"
```

This command validates the batch and imports it transactionally. Identical packages
are no-ops; it does not approve or publish. Normal startup does not import packages.
Use `npm run api` and `npm run web` in separate terminals for development. Sign in
as the configured curriculum approver, open Curriculum, and use **Preview saved
version** on each draft. The existing console controls approval and publication.

## Verification and delivery

October 4 results:

- `dotnet test Ismi.slnx --no-restore`: **25 passed**, including deterministic
  validation, idempotent import, private drafts, rejected premature publication,
  answer-rationale evaluation and first-unit/new-unit ordering. NuGet vulnerability
  metadata was unavailable; compilation and tests succeeded.
- Focused mobile Chromium test: **1 passed**. All three console previews complete;
  test-published copies download, reload offline, complete with a wrong-answer retry,
  queue three completions and retain unit completion after reconnection/reload.
  Playwright's server setup also passed the production frontend build.
- Combined existing/new-unit browser run: **2 passed** (3.7 minutes). The seven
  existing lessons retain offline completion and checkpoint behavior with the new
  unit tested in the same disposable database.
- Package hashes, teaching-card phrase blocks and source references checked.
- [Local import evidence](local-import.json): records **24–26**, all draft v1,
  verified against the portable lesson payloads. No approval/publication metadata.

The browser check is `i-web/tests/zzz-planning-unit.spec.ts`; it runs after the
existing first-unit walkthrough because that walkthrough asserts the earlier course
size. The new check asserts its own unit and does not assume the overall lesson count.
Backend integration coverage is in `i-tests/CurriculumApiTests.cs`.

Tests approve copies only in disposable databases. No hosted publication, deployment,
real-device accessibility pass, recording review or learner timing is implied.
The twelve-week F12 target remains open.
