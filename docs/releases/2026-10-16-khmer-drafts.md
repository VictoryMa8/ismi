# F26 private draft workflow rollout — October 16, 2026

The owner authorized pushing and deploying the F26 application work to the existing
free development preview. The source includes five explicitly unreviewed Khmer
candidate packages and review notes. The local SQLite records 27–31 are **not**
uploaded. No hosted curriculum import, approval, publication or beta expansion is
part of this application rollout. Khmer learner availability remains planned.

## Candidate and target

- Existing repository: `VictoryMa8/ismi`, branch `main`.
- Vercel project: `prj_bm9WqkQ8JKkjIuA5QHpw3Xjk5W0H`, team
  `team_mfq8lyWncLfiAY4Xkrf40VBO` (`victorys-projects-c1cb4594`).
- Existing alias: [ismi-arabic.vercel.app](https://ismi-arabic.vercel.app).
- API: [ismi.alwaysdata.net](https://ismi.alwaysdata.net), site `1076252`.
- API precedes the web push because the console now uses the owner-only readiness
  endpoint. Health advertises `private-draft-preview-v1` alongside the existing
  `typed-recall-v1` and `multi-language-v1` features.

The implementation has 40 passing API tests, a passing Vue/TypeScript/Vite/PWA build
and 11 distinct focused browser checks passing across runs. Actual pending Khmer
candidates preview with optional script help and offline retry without learner
completion, download or sync records. Existing Arabic teaching and multi-language
compatibility checks pass. Package regeneration and diff checks pass.
[Full implementation evidence](../khmer/README.md).

## Preflight and preservation

`npm run deploy:api -- --check` verifies the existing site/SSH setup. The local and
remote `main` revisions agree before the release commit. Vercel CLI confirms the
existing project/team. The Vercel connector returned scope 403; the authenticated
CLI accesses the same target without credential changes.

A read-only aggregate snapshot before deployment records SQLite integrity `ok`,
15 database tables, 13 published lesson payloads, zero Khmer curriculum records,
and hashes of recordings/cookie keys. The private snapshot is
`/private/tmp/ismi-f26-hosted-before.json`; no row contents or credentials are
committed. The deployment script retains application/SQLite backups and verifies
the exact assembly, revision and persistent assets.

## Rollout status

Application `57b789802faf08a36a866d5734b136f04e935aba` is pushed to `main` and
both application targets are verified.

### API

`npm run deploy:api` rebuilt the clean commit in Release mode, installed it before
the frontend push and verified health revision
`1.0.0+57b789802faf08a36a866d5734b136f04e935aba`, the installed assembly, SQLite
integrity, recordings and cookie keys. Retained application/SQLite recovery path:
`/home/ismi/ismi/deployments/20261016-060118-57b789802faf`.

The post-rollout aggregate snapshot is
`/private/tmp/ismi-f26-hosted-after.json`. It compares exactly with the preflight:
all 15 table counts/logical hashes, all 13 published lesson/version/payload hashes,
all recording/key hashes and zero Khmer records. Existing learner data and Arabic
publications are preserved; no local database or candidate draft was uploaded.
The script's healthy exact revision is the API verification evidence; browser
navigation to an API URL is not treated as a JSON/proxy check because the installed
PWA navigation fallback can show the landing page for that navigation.

### Frontend

The push created Vercel deployment `dpl_6tAXD26TPGuE3JpdQr2fBP6ejR6R`,
[ismi-dyqfhgt7l-victorys-projects-c1cb4594.vercel.app](https://ismi-dyqfhgt7l-victorys-projects-c1cb4594.vercel.app).
CLI inspection confirms **Ready**, exact application commit `57b7898`, and the
existing `ismi-arabic.vercel.app` and `ismi-ruby.vercel.app` aliases. The provider
calls this Git target `production`; it remains Ismi's free development preview,
not the invite-only beta release.

Live browser verification on the stable alias confirms:

- Today loads existing signed-in study state and the saved Arabic resume control.
- The owner console displays the new pending-review/private-preview guidance.
- Selecting Khmer shows “Lessons not yet available” and factual planned status.
- Returning to Arabic restores its course context/resume entry.
- No browser console errors are captured during the checks. This is a limited
  browser check, not a provider runtime-log scan or real-device/AT pass.

The existing PWA initially displayed cached pre-release console guidance. A reload
after deployment activation loaded the new guidance successfully. No storage was
cleared and no lesson completion, content mutation, approval or settings change
was submitted. The viewed course was restored to Arabic. Review all private Khmer
candidates locally; they have not been imported into the hosted console.

### Recovery

The preceding API application is `f515f43`; the preceding frontend source is
`127a56c` (documentation on top of the notice-spacing release). API `old/` and
`before/ismi.db` are retained under the recovery directory above. Roll application
files back separately from persistent learner data. There are no new database
tables or content migrations in this release; do not overwrite the live DB to
undo an application rollout.

## Remaining course gates

F26 remains Active: fluent review, exact source/help/reading dispositions, reviewed
human audio, real device/input/AT/Safari checks, observed first-unit evidence and
then units 2–12. Those gates precede content publication. The release adds private
authoring capability and optional script presentation; it does not establish Khmer
curriculum correctness, audio quality, learner outcomes or beta readiness.
