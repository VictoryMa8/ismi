# F12.2 transliteration correction drafts

October 9, 2026 · Validated local candidates · Owner wording review pending.

| Lesson | Changes | Readable review | Exact field diff |
| --- | --- | --- | --- |
| 3 · Want tea or coffee? | Keep `law`; add `aw` as in English “how” help and preserve listener endings | [03-review](03-review.md) | [03-changes](03-changes.json) |
| 5 · How's your family? | Replace all seven paired copies of `منيحين / mnīḥīn` with `مناح / mnāḥ`; update notes and rationale | [05-review](05-review.md) | [05-changes](05-changes.json) |
| 7 · Put it together | Correct the remaining plural answer; add `law` help | [07-review](07-review.md) | [07-changes](07-changes.json) |

The [manifest](review-manifest.json) pins exact candidate and F08 predecessor hashes.
These candidates preserve answer IDs, accepted choice IDs, meaning, character roles,
course positions and the existing art. They carry explicit source-linked glossary
metadata (20/20/22 distinct senses), keeping semantic IDs from the original teaching
cards. This lets corrected cards remain searchable when approved packages eventually
replace the old publications; the compatibility catalog still represents F08 exactly.
No additional forms or audio are invented.

## Source-backed dispositions

- **A — plural:** the [Lingualism adjective entry](https://resources.lingualism.com/levantine-arabic/adjectives-3/),
  fully retrieved October 9, supplies the plural. The candidates consistently use
  Ismi's `ḥ` convention. Arabic, transliteration, dialogue, expressions, chunks,
  practice answers and explanations change together. All eight paired occurrences
  identified by the audit are covered. Wrong choices keep their contextual rationale:
  a plural response remains wrong when the scene asks about one person.
- **B — law:** [PalWeb](https://palweb.app/library/terms/conjunction-law) transcribes
  `/law/` and lists the polite-request phrase. Retain `law` and teach the English
  reading cue in the dialect guide, relevant teaching cards and answer feedback.
  `lau` is a possible display convention for the same sound, not a different Arabic
  answer. No global spelling convention change is made.
- **C — Fattoush:** retain the character's approved brand spelling and role. This
  draft does not introduce a separate food-word lesson or rename the character.
- **D/E — vowel/model checks and remaining pairs:** retain exact existing text;
  actual urban Palestinian speaker/audio review remains outstanding. The
  [audit inventory](../../../../../docs/research/levantine-transliteration-audit-2026-10-08.md)
  identifies the flagged forms and all 214 unique pairs. Absence of a desk flag is
  not pronunciation approval. Seed-fixture `bas/shway` convention and urban qāf
  questions remain explicit deferred fixture/speaker work.

`mnīḥīn` is not declared universally invalid; other speaker variants need a
recorded dialect/model disposition. The current exercises grade authored answer
IDs, not free-text spelling, so no new natural-language rejection rule is added.
Owner review should approve these exact wording/help changes. Speaker review must
check the remaining vowels, stress, connected speech and sentence naturalness
against identified recordings before pronunciation approval is claimed.

## Validation and preview

Reproduce candidates from the repository root:

```sh
python3 content/levantine/everyday-01/revisions/transliteration-audit/build_packages.py
dotnet test Ismi.slnx --no-restore --filter FullyQualifiedName~TransliterationDraftTests -m:1 /nodeReuse:false
```

The regression test validates and imports all three candidates in a disposable
database, checks repeat-import no-ops, draft privacy against published predecessor
copies, unchanged publication/history, answer grading, listener roles, contextual
rationales and exact glossary teaching text. Test predecessor approval/publication
is confined to the temporary database and does not approve these candidates.

For a separate local console review database:

```sh
Database__Path="$PWD/i-api/App_Data/f12-2-review.db" dotnet run --project i-api --no-launch-profile -- --import-curriculum "$PWD/content/levantine/everyday-01/revisions/transliteration-audit"
Database__Path="$PWD/i-api/App_Data/f12-2-review.db" npm run api
```

Run `npm run web` in another terminal and use the normal owner console preview.
Set up the local approver normally as described in the root README. This optional
review database starts with demo fixtures and has no account/progress history.
Do not approve or publish until the owner has reviewed the exact candidates.

Read-only inspection of the default local database on October 9 found existing
draft records **20/22/17** for lessons **3/5/7**. Those records were preserved;
the default importer correctly refuses a second open draft. These candidates were
not imported into that database and no `--update-imported-drafts` was used.
Before a later default-database integration, explicitly reconcile those existing
drafts. Hosted v2 publications remain the baseline and were not inspected today.

## Verification and delivery

October 9: **29/29 API tests pass**, including the focused correction test.
Manifest hashes match all three candidates and unchanged predecessors. Rebuilding
the candidates is deterministic. The initial checks found duplicate glossary senses
and the one-open-draft rule; deduplication and a published-predecessor test setup
resolved them. A sandbox IPC restriction required running .NET checks with local
IPC access. NuGet vulnerability metadata was unavailable; tests and compilation passed.

No frontend behavior changed, so no browser regression run was performed for this
content-only task. No real-device, assistive-technology, learner or pronunciation
pass is claimed. The lesson-1 eight-prompt recording batch and Azure audition text
are unchanged. Any future recordings for lessons 3/5/7 must use the then-approved
candidate hashes and exact text, not assume the F08 script remains current.

Delivery is local candidate files, review artifacts and tests only: no default or
hosted database mutation, curriculum approval/publication, commit/push or deployment.
F12.2 remains Active pending owner wording review and actual speaker/model evidence.
