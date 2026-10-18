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

Correction: retain the original API notice exactly and keep the existing presentation-only prefix removal in `PublicationNotice.vue`. No publication, database rewrite, guard relaxation or new review acceptance is needed. Both integration cases now use independent literal historical notices: they failed on the regression and pass after restoring the original values, exercising all five packages per course plus review gates, disabling, withdrawal and rollback. Deployment correction and fresh live counts/lesson responses will be recorded below.
