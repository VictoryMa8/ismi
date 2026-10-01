# Guided teaching across Everyday conversations

September 30, 2026. **Seven unpublished, unapproved lesson packages**, imported
into the local owner console. These extend the revised check-in pattern to the
whole unit: conversation → phrase with building blocks → contextual recall before
reveal → concise usage summary → eight contextual practice turns.

There are **43 explicit teaching cards**: seven in lesson 1 and six in each
remaining lesson. Every card includes a conversational recall cue, Arabic and
transliteration blocks, a concise explanation, and provenance locators validated
against the package's source records. Lexical facts stay within the existing unit
source set; the original grouping, glosses, teaching notes and exchanges remain
AI-assisted compositions for owner review. No additional speaker review or
native-expert review is claimed. No publisher dialogue, table, exercise or audio
is copied. The prior package path and SHA-256 are included in each new authoring
record and [manifest](review-manifest.json).

| Lesson | Focus | Local draft |
| --- | --- | --- |
| [1 · Check in](01-review.md) | Speaker/listener distinctions, feelings, returning a question, offering rest | record 18 · v3 |
| [2 · Today’s activities](02-review.md) | Completed actions, sequence, short follow-ups | record 19 · v3 |
| [3 · Drinks](03-review.md) | Offers, preferences, requests to either host | record 20 · v2 |
| [4 · Shared meal](04-review.md) | Feelings, suggestions, agreement, scoped negation | record 21 · v2 |
| [5 · Family](05-review.md) | Possession, plural descriptions, tracking who “her” refers to | record 22 · v2 |
| [6 · Tomorrow](06-review.md) | Shared plans, day, time, confirming a changed arrangement | record 16 · v2 |
| [7 · Connected exchange](07-review.md) | Recombining the unit’s pieces in changed stories and plans | record 17 · v2 |

The database allows one unfinished draft per lesson. Lessons 6 and 7 update the
existing importer-owned drafts with normal update/validation audit events; their
original [check-in-v2 packages](../check-in-v2/README.md) remain unchanged. Lessons
1–5 create new drafts. All 15 pre-existing published/superseded snapshots were
compared before and after import and remain byte-for-byte unchanged. A local
pre-import database backup is at `/tmp/ismi-before-guided-import.db`; portable
history lives in the preserved packages, independent of that temporary backup.

The local store already had lessons 1 and 2 v2 published when this continuation
began, contrary to the older handoff. This work does not infer any new publication
or deployment permission from that state. The seven proposals above remain drafts.

## Preview and import

The drafts are already imported in this checkout. Restart the API after schema
changes, sign in with the configured owner's account, open Account → curriculum
console, select the draft record above, then **Preview saved version**. Preview
uses saved content, saves no learning progress, and never caches drafts for public
offline delivery. Ordinary learner endpoints continue serving their published
versions. No approval, publication, or deployment was performed for this revision.

For a fresh database, from the repository root:

```bash
dotnet run --project i-api --no-launch-profile -- \
  --import-curriculum "$PWD/content/levantine/everyday-01/revisions/guided-teaching"
```

Add `--update-import-drafts true` only when deliberately updating an existing
draft created by this importer. Exact repeat imports are no-ops. Published and
approved content remains immutable; separately created drafts remain conflicts.

## Interaction changes

Practice English translations remain optional and start hidden. Reconstruction
no longer reveals whether the word order matches before checking. A complete
non-matching order receives a model comparison and unrestricted retry; it makes
no general judgment about valid Arabic alternatives and sends no invented answer
ID to the API. Matching tiles select the target’s exact authored answer record,
including when unvowelled Arabic has different spoken address forms.

Review teaching can be opened during practice, then exited at any teaching stage.
The current turn, placed tiles, translation help and checked feedback are preserved.
The default first pass still invites recall before reveal; completed-lesson review
can go directly to practice. Motion honors reduced motion, and keyboard focus
returns to the practice instruction or feedback after an action.

## Checks and remaining limits

Manifest hashes, prior-package hashes, and all 43 Arabic/transliteration block
reconstructions were checked. API tests cover source validation, draft isolation,
history preservation and idempotent import. Browser coverage exercises the new
teaching packages, wrong-order retry, teaching return, mobile layout and offline
progress. Final test results are recorded in `docs/next-stage-handoff.md`.

Owner content approval is still needed before publication. Reviewed audio assets
remain zero. Real screen-reader testing, naturalness review and observed recall /
learning outcomes remain open. Five-to-seven-minute estimates are inherited
planning estimates; the added teaching flow needs observed learner timing. Bounded
reconstruction and guided choices do not demonstrate spontaneous conversation.
