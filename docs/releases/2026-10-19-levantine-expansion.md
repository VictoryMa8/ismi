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
- Application and content delivery completed as recorded below.

The normal API deployment workflow retains application rollback and an online SQLite
backup. Publication uses the normal validator and publishing service through an
owner-authorized maintenance runner; it must not forge account/session approval or
write curriculum rows directly. Preserve a pre-publication consistent database
backup, non-curriculum table digests, published content snapshots, recordings and
cookie-key maps. Verify all twenty public payloads and previous publications after
release. Never copy credentials, raw database contents or learner identities into Git.

## Verified application delivery

Implementation commit `f01fed00f0f8dec3e7dd739dbfca62841e90b443` was committed and
pushed on `main`. API health/assembly, SQLite integrity, recording and cookie-key
preservation checks passed through the normal deployment workflow at that revision.
Application rollback and online SQLite backup remain at
`/home/ismi/ismi/deployments/20261020-034914-f01fed00f0f8`.

Vercel confirmed **Ready**, deployment `dpl_ouW3TwukWARJATNWPi1G5pS7XQzn`, for
[the immutable frontend](https://ismi-h042ccmp9-victorys-projects-c1cb4594.vercel.app),
with `ismi-arabic.vercel.app` and `ismi-ruby.vercel.app` aliases. The established
Vercel production target remains the free development preview. A documentation
follow-up push may advance its Git revision without changing application version;
the API stays pinned to the implementation revision.

The first API attempt stopped during pre-install extraction: five archive members
were missing/incomplete and no app swap or database backup/swap had occurred.
Two obsolete application copies from `20261016-060118-57b789802faf` and
`20261017-004736-30ea724f3739` were streamed to owner-only local recovery archives
under `/tmp/ismi-f12-recovery`, compared file-for-file with remote SHA-256 maps,
and only then removed remotely. Their database backups, current app/data/assets
and recent rollback releases were retained. The failed archive/extraction stage
was removed after asserting it contained no old application or database backup.
The retry installed and verified normally. Recovery archive hashes and file maps
are retained in that private recovery directory.

## Exact publication and preservation

A consistent online SQLite backup and private table/assets baseline were retained
at `/home/ismi/ismi/deployments/20261019-f12-expansion/before.db` before publication.
A temporary administrative runner verified raw package hashes and validated all
twenty packages against the deployed assembly before any database write. It then
used `CurriculumPublishingService` to create drafts, record readiness, approve each
exact text preview and publish. The audit actor honestly records owner-delegated
unreviewed development-preview publication; no account/session or human linguistic
acceptance was fabricated and no curriculum rows were written directly.

[Publication verification](../../content/levantine/expansion-20/publication.json)
records all twenty hosted IDs/v1 versions and audit actions. Every public payload
matches its exact original package plus the expected curriculum version and explicit
unreviewed notice. Linguistic/source-rights dispositions remain pending and reviewer
stays empty; no human audio was added. Manifest SHA-256:
`a6005c600a73e3aa16ba50203ae8198751bd1fd9a54e87b687b56f3c46558f29`.

SQLite integrity is `ok`. Only curriculum versions/sources/audit and SQLite counters
changed. Every preexisting curriculum row, source and audit row is byte-identical;
all non-curriculum table digests and recording/key maps match the baseline. All ten
French/Khmer preview URLs still return 200. Previous Plans drafts, correction
candidates, first-unit anatomy/audio and other publications remain unchanged.

The owner-revised F12 current cycle is Complete. F12.6 retains thirty unauthored
lessons; F12.5 retains human/source/audio/outcome/access/full-depth acceptance.
This rollout does not open the beta or establish physical-device/AT evidence.
