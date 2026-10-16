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

Preparing the clean application commit and API-before-web rollout. Exact revision,
backup path, provider deployment status and post-rollout evidence will be recorded
once verified. An authorized rollout is not yet a claim of live availability.

## Remaining course gates

F26 remains Active: fluent review, exact source/help/reading dispositions, reviewed
human audio, real device/input/AT/Safari checks, observed first-unit evidence and
then units 2–12. Those gates precede content publication. The release adds private
authoring capability and optional script presentation; it does not establish Khmer
curriculum correctness, audio quality, learner outcomes or beta readiness.
