# October 18 learner clarity deployment

The owner requested the bounded F27.3 learner fixes and then “commit and reploy.” This authorizes committing/pushing on main and updating the existing Vercel/alwaysdata free development preview. No curriculum versions or source/review records are being published or changed.

Candidate: [learner clarity contract and checks](../learner-clarity-fixes.md). Production frontend build, 45 distinct focused browser checks and two exact French/Khmer preview-policy API tests passed. Five deployment workflow fixture tests pass. Read-only preflight verifies existing alwaysdata site 1076252 and SSH authentication; Vercel is linked to project `prj_bm9WqkQ8JKkjIuA5QHpw3Xjk5W0H`, team `team_mfq8lyWncLfiAY4Xkrf40VBO`.

Application commit `30a393e22bb51d9f99e7cbf07524197f2c826078` was committed and pushed to main. Vercel reports **Ready** for [the immutable deployment](https://ismi-qcpqjcrlz-victorys-projects-c1cb4594.vercel.app), assigned to `ismi-arabic.vercel.app` and `ismi-ruby.vercel.app` on the existing project/team. Vercel's target is named production; these remain the established free development-preview aliases, not a beta release.

The API deployed the same exact revision to `https://ismi.alwaysdata.net`. Preflight, upload/archive verification, restart, exact-revision health, assembly, SQLite integrity, recordings and cookie-key checks all passed. Prior application and consistent SQLite backup are retained at `/home/ismi/ismi/deployments/20261018-203837-30a393e22bb5`. Data remains outside application releases; this deployment ran no content import or publication action.

A read-only live browser check after refreshing the cached PWA confirmed the new Write a response label, missing AI-assisted draft prefix, single Today resume card, silent grace and collapsed optional weekly activities. No lesson was started/completed and no study or habit preference was changed. The owner then chose to inspect the UI themselves; no further browser interaction was performed.

Documentation-only follow-up may advance the frontend commit; the verified API runtime remains `30a393e`. No beta release, curriculum revision, accepted review/rights claim or broader publication authority follows.


## Published-preview availability regression

After the rollout, the owner reported French/Khmer unavailable. A fresh live API audit confirmed both course counts were zero and their first lesson URLs returned 404, despite a healthy API. The F27.3 edit removed “AI-assisted draft.” from the API's `Notice` constants; preview authorization compares the full persisted `LessonPublicationNotice` against those constants. Existing published snapshots retained the original notice, so the guard hid all ten lessons. Package pins, review records and flags were unchanged.

The earlier smoke check saw cached learner data and did not establish fresh API catalog/lesson availability. The original policy tests derived their expected notice from the same constant being changed, so they passed against newly approved test records and missed compatibility with existing publications.

Correction: retain the original API notice exactly and keep the existing presentation-only prefix removal in `PublicationNotice.vue`. No publication, database rewrite, guard relaxation or new review acceptance is needed. Both integration cases now use independent literal historical notices: they failed on the regression and pass after restoring the original values, exercising all five packages per course plus review gates, disabling, withdrawal and rollback. Corrected source was committed/pushed as `34a936b8c2d57ff6fe329cc7b3c85f44f62b47bb`.

The normal API deployment stopped before application installation. Its stage `20261018-215224-34a936b8c2d5` held a complete 19,406,435-byte archive and partial extraction; no application rollback, database backup or manifest had been created. This is evidence of a pre-install extraction failure, not a confirmed transfer failure. The deployment wrapper reported `CalledProcessError` without its underlying stderr. The application tree held approximately 949 MB at diagnosis, so hosting space needs attention before the next full upload; provider quota exhaustion was not independently confirmed. Only that reproducible failed archive/extraction was removed, retaining every application/database backup.

To restore availability promptly, the retained previous application in `20261018-203837-30a393e22bb5/old` was restored through the existing rollback routine and the site restarted. The faulty application remains in that release's `failed` directory; persistent data was not replaced. API health now reports exact `08fed7525991fdc8202242cf01dbb12eba504bd6`, the source-equivalent working API before the two notice-string edits. Assembly hash, SQLite integrity, recordings and cookie keys passed verification. The current frontend retains every UI fix and strips the prefix in presentation.

Fresh, uncached direct API checks after recovery confirm French **5 published / 5 unreviewed previews / available**, Khmer **5 / 5 / available**, and HTTP 200 for all ten exact v1 first-unit lesson URLs. Original unreviewed notices remain attached. No content was imported, reapproved, republished or edited, and no learner state was modified. The owner chose to inspect the UI themselves, so recovery verification used the API rather than browser interaction. Future API deployments must use corrected source (`34a936b` or later), not the regressed `30a393e`.
