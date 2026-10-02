# Character metadata proposals

October 1, 2026. Seven metadata-only proposals based on the preserved guided
teaching packages. They attach Lina and Omar to 42 dialogue turns, 38 of the 43
phrase cards, and 50 of the 56 practice steps. Five generic phrase cues and six
topic/sequence/detail practice steps remain neutral. The original Arabic,
transliteration, scenario, instructional text, answers, grading, explanations,
recording credits and provenance records are unchanged.

The [mapping script](build_packages.py) contains explicit authored mappings. It
does not derive participants from turn parity, answer position, grammatical
gender guesses or the learner's account. In particular, a speaker can continue
their own statement; a name or topic prompt can be neutral while the response
has a specific participant. Original dialogue labels are retained, and omitted
recipient names become visible through the separate explicit roles.

The [manifest](review-manifest.json) pins both proposal and predecessor hashes.
The [character guide](../../../../../docs/characters/character-guide.md) and
asset provenance describe the corporate cartoon proposal. Final art choice and
publication approval are pending; existing approval does not cover these files.

## Local preview

All seven proposals are imported and validated locally: lesson 1 record 23 v4;
lesson 2 record 19 v3; lessons 3–5 records 20–22 v2; lessons 6–7 records 16–17 v2.
The six existing importer-owned drafts received metadata through the normal
update/validation audit workflow. Their earlier portable guided packages remain
unchanged. The full pre-import SQLite backup is ignored at
`i-api/App_Data/ismi-before-characters.db`. Accounts, progress, all 16 existing
published/superseded snapshots and prior audit rows were compared and preserved.
No real version was approved, published or deployed.

## Import and preview

For a new database, use the existing maintenance importer:

```sh
dotnet run --project i-api --no-restore --no-launch-profile -- \
  --import-curriculum "$PWD/content/levantine/everyday-01/revisions/characters"
```

In the current database, lesson 1 already has a published guided version and
can receive a new draft. The remaining six have unfinished guided drafts. Keep
a SQLite backup before applying metadata to those drafts and use the importer's
explicit `--update-import-drafts true` option only for importer-owned drafts.
Previous portable guided packages remain untouched. Other people's drafts and
approved/published snapshots remain immutable through the existing workflow.

In Account → curriculum console, inspect **Character mapping**, validate and
select **Preview saved version**. The mapping view includes all dialogue,
phrase and exercise roles, with unknown/missing/conflicting identities flagged.
Neutral cues are deliberate, not errors. Saved drafts remain outside public
endpoints and downloads; preview does not save learning progress.

Old publications and downloads have optional metadata and continue as text-only
lessons. New explicit references must pass deterministic registry, cast,
speaker-label, pair and response-participant validation. Rollback restores the
previous snapshot's roles. Asset failure never disables lesson navigation.

## Verification

The API regression compares stripped proposals to the guided originals and
checks unchanged source records, seven imports, repeat-import idempotency,
invalid roles, draft isolation, serialization, dashboard cast and rollback.
Browser coverage walks all seven character packages online/offline and through
checkpoint/reconnection, plus image failure, unknown registry fallback, hidden
recall, mistake/retry and 320/1280 px previews. Real screen-reader and observed
learner checks remain release work; no efficacy claim is made.
