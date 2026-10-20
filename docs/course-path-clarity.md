# Course path clarity (F27.4)

The October 19, 2026 owner request removes the entire course-wide AI/draft card
and resolves the apparent Week 1 restart after the main Levantine course.

## Contract and cause

The global banner inherited the first lesson publication notice and appeared on
every learner page. Remove that card entirely; preserve honest text-only/unreviewed
labels inside the affected lessons and beside their entries, plus source/review
metadata and all exact published packages.

The database includes six original `levantine-day-01` through `levantine-day-06`
demonstrations in `levantine-week-01`, plus newer substantive units. The API orders
units by internal identifier, so the main units appeared out of order and the old
Week 1 group appeared again afterward. The browser now orders a course by numeric
`courseOrder`. When substantive Levantine lessons exist, those six demonstrations
remain available under Extra practice in Practice rather than as another Courses
unit or automatic new-lesson allocation. A demo-only installation retains its
existing path until substantive content is present.

Main progress counts the course path. No completion records are deleted, extra
practice still counts toward time already studied today, and a started demo can
still resume from Today. Reviews, downloads and original lesson routes retain the
full lesson set. This is a presentation/queue change, not publication, withdrawal,
content review, renumbering packages or a database migration.

Application version: Beta 0.0.10. Current delivery belongs to ROADMAP.md.

## Verification

Checks performed October 19, 2026:

- Vue/TypeScript production build and PWA generation pass. Browser version checks
  read the package version and confirm the displayed Beta 0.0.10 label.
- 27 distinct Playwright checks pass across `course-sequence`, `course-loop`,
  `study-settings`, `multi-language`, `feature-hubs`, `msa-umbrella` and the exact
  French/Khmer publication regression suites. The final two sequence checks were
  repeated after aligning the Up next label with the selected path.
- New 390/1280-pixel checks reproduce alphabetical unit ordering with mixed real
  packages and old demos. They verify numeric course sequence, one Up next entry,
  main-path progress excluding demo completions, no course-wide card, lesson-level
  notices retained, Extra practice access, saved demo resume after offline reload,
  and completed practice consuming the same daily budget.
- Demo-only installations retain their original usable course path. Existing
  offline completion/reconnection, guest/account preferences and separate-language
  progress/selection tests pass. French/Khmer exact preview tests pass with the
  course-wide card absent and lesson-level notices intact throughout practice.
- The mobile course-page screenshot was visually inspected. No published package,
  immutable notice, database record, lesson ID or completion is rewritten.
- Roadmap ID/state/link checks and `git diff --check` pass.

The owner subsequently authorized push and deployment of this verified frontend
candidate. No API changes or curriculum publication are part of the rollout. Chromium automation does not establish real screen-reader/device,
linguistic/source, audio or beta acceptance.

## Application rollout

The owner requested push and deployment after the local checks and confirmed that
the removed card is the notice directly below the language/course switcher. Use the
existing Vercel Git integration on main; exact rollout evidence follows verification.
