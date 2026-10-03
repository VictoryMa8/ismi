> Historical package set: at the start of the guided teaching continuation,

October 2 update: repository packages now use Fattoush and Knafeh at the owner’s
request, including the standalone Arabic character-name prompt. Historical
publication statements below refer to predecessor database snapshots. Manifests
preserve predecessor hashes and pin the renamed files; no database import,
reapproval or publication was performed.

> local records 14–15 were already published v2; records 16–17 were still drafts.
> These portable packages and their hashes remain unchanged. The current seven
> proposals and local records are in [guided teaching](../guided-teaching/README.md).
> The draft-status text below records the earlier handoff, not the current database.

# Casual check-in revision and guided teaching

September 30, 2026. Four **unpublished** packages revise published v1 lessons 1,
2, 6 and 7. The owner asked to proceed without waiting for more speaker feedback.
The original v1 packages and manifest remain intact for provenance and rollback.

## What changed

Lesson 1 becomes **Check in with someone you love**. Its six-turn exchange teaches
`شو عامل؟` as a casual check-in to Knafeh, an answer about the speaker's current
condition, and a question back. It explicitly teaches feminine address and
self-description, mild tiredness, and accepting a rest. Six teaching cards carry
phrase blocks and short explanations. Eight contextual exercises keep varied
answer positions and reviewed-answer rationales ready for owner review.

Lessons 2 and 6 replace the old check-in distractor with the casual question and
update the rationale. Lesson 7 checks in with Fattoush, answers about her condition,
then reports activities; its dialogue, practice, expressions and notes agree.
Lesson IDs, step IDs, unit order and completion identity are preserved.

Read [lesson 1](01-review.md), [lesson 2](02-review.md), [lesson 6](06-review.md),
and [lesson 7](07-review.md) for the exact proposed content. Package hashes are
pinned in [the draft manifest](review-manifest.json).

The owner-relayed Palestinian report supplies the conversational-function change.
Previously approved lexical sources supply existing material. A supplemental
Lingualism Levantine sample checks the feminine participle form; it is explicitly
Lebanese-based and is not evidence of Palestinian-native review or previous
foundation approval. Source notes distinguish these boundaries. No publisher
examples or audio are reproduced. Composed exchanges remain AI-assisted and need
owner approval before publication; no external reviewer is claimed.

## Preview locally

From the repository root, import the four packages through the existing command:

```bash
dotnet run --project i-api -- --import-curriculum "$PWD/content/levantine/everyday-01/revisions/check-in-v2"
```

The importer validates and creates drafts; it does not approve or publish. If these
imported drafts already exist, use `--update-import-drafts true` to update only
importer-owned drafts. A separately created unfinished draft must be reconciled in
the console rather than overwritten. The actual database assigns version numbers.

Start the API and frontend as documented in the root README, sign in as the
configured owner, open the curriculum console, select a revised draft and choose
**Preview saved version**. The new teaching flow shows the conversation, a phrase
with its parts, unaided recall before reveal, a concise pattern, then practice.
Preview saves no learner progress and does not enter the public offline cache.

## Delivery boundary

The learner renderer improves all existing packages immediately when the new
frontend is deployed. Detailed phrase blocks appear only where the package supplies
`introduction.teachingCards`; legacy expressions receive teaching/recall cards too.
English prompt and answer translations are separate help controls. Answer
translations appear automatically after checking; they are absent initially.

Some practice turns offer a bounded phrase reconstruction using authored response
pieces; others invite recall before showing choices. Learners can switch from
reconstruction to choices without a penalty. This is not open-ended speaking
assessment, a spaced-review scheduler, or an AI evaluator. No new provider is used.
No reviewed recordings were added. The displayed lesson durations remain the
existing estimates; the added teaching interactions require new observed timing.

## Local validation — September 30

- API/domain tests: 21 passed, including revised-package validation, teaching-card
  persistence, original publication preservation, and rejection of malformed cards
  or teaching audio that bypasses the recording gate.
- Production frontend build: passed through the browser test server builds.
- The full browser run passed 12 checks, including all seven lesson previews and
  offline completions with actual phrase assembly, keyboard retry, reconnection,
  exactly-once sync and review. The new focused teaching check initially used an
  overly strict zero-duration assertion for reduced motion; after allowing the
  existing effectively instantaneous duration, that focused check passed separately.
- The focused teaching check covers phrase blocks, unaided reveal, translation
  separation, wrong-answer rationale/retry, builder undo, narrow 320px layout,
  reduced motion, focus return, and draft isolation. Mobile screenshots were inspected.
- After improving the legacy demonstration teaching fallback, all 10 focused
  course, navigation and recording regression checks passed with another production build.
- Four real local drafts were imported as v2, records 14–17. Original manifest and
  revised-package SHA-256 checks passed. No live deployment/publication occurred.

These checks establish renderer behavior and deterministic delivery. Real
screen-reader testing, native wording review, reviewed recordings, observed timing,
and educational outcome evidence remain outstanding. The owner explicitly elected
not to wait for further speaker feedback before building these draft revisions.
