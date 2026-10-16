# F27.1 back-navigation rollout

October 16, 2026. The owner authorized push and deployment after the October 15
implementation. Application commit `5875e6d60130f62319b0b81a35f142092f9d1652`
is pushed to `main` in `VictoryMa8/ismi`.

## Scope and target

- Shared mobile-friendly back controls, explicit return destinations, console
  page/focus preservation and recall keyboard-exit handling.
- Existing Vercel project `ismi`, ID `prj_bm9WqkQ8JKkjIuA5QHpw3Xjk5W0H`, team
  `team_mfq8lyWncLfiAY4Xkrf40VBO` (`victorys-projects-c1cb4594`).
- Git's existing production target serves the free development preview at
  [ismi-arabic.vercel.app](https://ismi-arabic.vercel.app).
- Deployment `dpl_BkpLCeiZ5TfK2j6DNahM5ibeCLDJ`, URL
  [ismi-kwlsstrbe-victorys-projects-c1cb4594.vercel.app](https://ismi-kwlsstrbe-victorys-projects-c1cb4594.vercel.app).

The release was prepared from previous `main` revision `4d15539` plus only F27.1
changes. Its committed source matches that verified snapshot. Partial staging
preserved the separate local language-course, landing-copy and backend work.
No API deployment, hosting change, credentials change or curriculum publication
was performed. The existing API remains in use.

## Verification

The isolated production build passes. The focused browser run passed 52/53;
the cultural malformed-refresh check passed when rerun alone. All landing,
navigation, lesson/preview, glossary, review, sound and recall checks passed in
the initial run. Separate direct checks at 320/390/1280 px passed touch geometry,
single visible landing return, keyboard/history, 200% text, forced colors/reduced
motion, offline reload/return and console/Account focus preservation.

Tests used ports 4193/5093 and a disposable SQLite database, not hosted content.
The previews in [the feature note](../mobile-back-navigation.md) were regenerated
and inspected from this isolated candidate. This does not establish the broader
course-foundation work or real-device/assistive-technology beta gates.

Vercel's authenticated deployment listing associates the deployment URL with the
exact application commit. `vercel inspect --json` reports `readyState: READY`,
target `production`, and the stable `ismi-arabic.vercel.app` alias assigned.
The older `ismi-ruby.vercel.app` alias is retained. No hosted browser walkthrough,
runtime error scan or new monitoring configuration is claimed.

## Recovery

The preceding deployed revision is `4d15539`. A separately authorized frontend
rollback can restore that application; this release has no database or curriculum
changes to undo. Do not discard the remaining local course work or clear learner
storage to roll back the back-control styling.
