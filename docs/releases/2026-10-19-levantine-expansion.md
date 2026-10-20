# F12 twenty-lesson development-preview release · October 19, 2026

The owner explicitly directed twenty new lessons now, the final thirty at a separate
roadmap checkpoint, completion of the revised current cycle, commit, deploy and
publication. These twenty are **unreviewed, text-only development previews** on the
existing free preview, retaining pending linguistic/source-rights acceptance, an
empty reviewer and missing human audio. No beta inclusion or native-expert review
is claimed. Existing Plans/correction candidates remain separate.

## Exact candidate

[Twenty-package manifest](../../content/levantine/expansion-20/review-manifest.json)
pins orders 11–30 across home, family/plans, meals and neighborhood directions.
[Full readable packets](../../content/levantine/expansion-20/README.md) cover every
dialogue, teaching chunk, contextual answer/rationale and recall target. No old
curriculum file or publication notice is replaced by this batch.

Application version **0.0.8** combines the already completed 0.0.6 plan/coverage
feature, one 0.0.7 twenty-lesson preview implementation increment, and one 0.0.8
Arabic name-migration fix increment. Intermediate versions were not separately
deployed; tests/docs/retries do not add increments.

The character fix preserves words such as خلينا and literal escaped sequences
while still migrating standalone legacy names. Server JSON string-token decoding
avoids treating serialized byte substrings as Arabic word boundaries. Immutable
stored publication snapshots are not rewritten by this compatibility fix.

## Preflight and delivery evidence

- Existing site 1076252 and reusable SSH access verified with `deploy:api -- --check`.
- Fresh hosted preflight: no existing records under the twenty target IDs; 23 prior
  published lesson records and SQLite integrity `ok`.
- 67 API tests pass, including all twenty package round-trips, idempotent import,
  rejected ordinary approval with pending review, exact preview approval/publication,
  unchanged pending reviewer/rights and mutation/extra/disabled exception rejection.
- Four focused mobile Chromium checks pass, including every new lesson teaching/
  choice/retry flow, all twenty offline completions, twenty queued progress records
  and successful reconnection/reload with all four units complete. The production
  build and displayed Beta 0.0.8 pass. This is not physical-device/AT evidence.
- Final delivery evidence will be recorded after execution; this file does not
  preclaim a deployment or publication.

The normal API deployment workflow retains application rollback and an online SQLite
backup. Publication uses the normal validator and publishing service through an
owner-authorized maintenance runner; it must not forge account/session approval or
write curriculum rows directly. Preserve a pre-publication consistent database
backup, non-curriculum table digests, published content snapshots, recordings and
cookie-key maps. Verify all twenty public payloads and previous publications after
release. Never copy credentials, raw database contents or learner identities into Git.
