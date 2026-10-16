# F24 application rollout — October 16, 2026

The owner authorized pushing and deploying the implemented foundation. Application
commit `f515f43c38441e432237cd75527d44684b5dacb4` is pushed to `main`.
French/Khmer curriculum, human pilot/AT evidence and beta expansion remain separate;
no curriculum is authored, imported, approved or published by this rollout.

## Scope and verification before rollout

The release adds five-course metadata, additive schema-2 target text/help, language
presentation and font support, independent course progress/placement/review, saved
lesson sessions, a visible selector, the owner-approved `parallel-v1` daily queue,
console validation/withdrawal/rollback and multilingual landing copy. Title option
A retains Ismi/اسمي pending Khmer linguistic review. Previously released F27.1
controls are preserved.

The 176 runtime/test/deployment files match the verified local candidate byte for
byte; intervening commits delivered F27.1 and its documentation. API 39/39 and
final focused Chromium 18/18 pass, with a successful production build. The earlier
full Chromium run was 114/115; its recall Escape failure is corrected and covered
in the final focused run. WebKit is still 10/16 with an offline reload engine
error; real Safari offline and human input/AT checks remain required.
[Implementation and evidence](../multi-language/README.md). Source diff checks
pass excluding the verbatim upstream OFL license's trailing space, which is retained.

## API rollout and preservation

`npm run deploy:api -- --check` verified the existing site and reusable SSH access.
`npm run deploy:api` rebuilt the clean committed revision in Release mode, verified
the archive, retained application and SQLite backups, swapped the application and
restarted the existing alwaysdata site. The API was deployed before the frontend
push to keep schema-2 authoring compatible.

- Host: [ismi.alwaysdata.net](https://ismi.alwaysdata.net), site `1076252`.
- Health is 200/healthy, revision `1.0.0+f515f43c38441e432237cd75527d44684b5dacb4`,
  features `typed-recall-v1` and `multi-language-v1`.
- `/api/courses` returns all five courses: Levantine has 13 existing published
  lessons; MSA, Quranic, French and Khmer each have zero and remain planned.
- `/api/dashboard` returns the same 13 Levantine lessons. Anonymous access to
  `/api/admin/curriculum/versions` returns 401.
- All 15 database tables retain identical row counts and logical hashes. There
  are no new tables or data migrations. SQLite integrity is `ok`.
- All 13 published lesson/version/payload hashes match the pre-rollout snapshot.
  Existing accounts, learning progress, completions, source and audit rows are
  unchanged. No local drafts or synthetic fixtures were uploaded.
- Recordings and cookie-key hashes are unchanged; the deploy script also verifies
  the installed assembly hash.
- Backup/rollback directory:
  `/home/ismi/ismi/deployments/20261016-052650-f515f43c3844`.

Private local aggregate snapshots (counts/hashes, no row contents) are in
`/private/tmp/ismi-f24-hosted-before.json` and
`/private/tmp/ismi-f24-hosted-after.json`. They are not committed.

The publication baseline is six demonstrative `levantine-day-01` through `-06` v1,
plus `levantine-everyday-01-01`, `-03`, `-06` v3 and `-02`, `-04`, `-05`, `-07` v2.
The presence of demo publications is not a new pedagogical/review claim.

## Frontend

Existing project `ismi`, ID `prj_bm9WqkQ8JKkjIuA5QHpw3Xjk5W0H`, team
`team_mfq8lyWncLfiAY4Xkrf40VBO` (`victorys-projects-c1cb4594`). The existing Git
production target serves the free development preview; this is not the first-100
beta release.

The Git push created deployment `dpl_CfW64uW9SKR69PzkJPZT77iuUNvk`,
[ismi-i3x6n6men-victorys-projects-c1cb4594.vercel.app](https://ismi-i3x6n6men-victorys-projects-c1cb4594.vercel.app),
with the exact application commit. Vercel reports **READY**, target `production`,
with the stable [ismi-arabic.vercel.app](https://ismi-arabic.vercel.app) alias and
the retained `ismi-ruby.vercel.app` alias. The provider build completes in 21 seconds.

Live browser checks confirm the Languages landing section with five courses,
current Ismi/اسمي title, planned French/Khmer states, visible language/course
selector and existing signed-in Arabic progress. Selecting Khmer shows “Lessons
not yet available” and changing back opens the existing Arabic lesson transcript.
No completion or account study-settings change was submitted.

The existing browser initially used the previous PWA's cached landing and hit an
old lazy-module import error when entering study. A page reload loaded the new
application successfully, with its selector and current API data. This is recorded
as update behavior, not a clean cold-start or Safari/offline pass. No runtime-log
scan is claimed; the observed browser error was from the prior cached application.
A screenshot is a local artifact, `/private/tmp/ismi-f24-live-khmer-planned.jpg`;
it is not committed because it shows signed-in learner state.

The Vercel MCP connection returned a scope 403. The already-authenticated CLI
accesses the same explicit project/team successfully; no scope or credential
changes were needed.

## Recovery and remaining gates

The preceding frontend revision is `f962365`; the preceding API application is
`4545fea`. The retained API release contains `old/` and `before/ismi.db`. Application
rollback keeps persistent data separate. Once new-course preferences/content exist,
prefer a forward fix: an old settings client may overwrite unsupported course IDs.
Do not blindly restore the database or clear browser storage.
[Recovery procedure](../multi-language/deployment-candidate.md).

Reviewed first units, real device/input/screen-reader and mixed-language learning
evidence, real Safari offline support, exact content approvals and beta inclusion
remain open. F24 stays Active. No paid host, provider, account or monitoring change
is introduced; a runtime error scan and real-device release audit are not claimed.
