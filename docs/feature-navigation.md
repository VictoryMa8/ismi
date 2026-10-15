# Feature discoverability and navigation

October 14, 2026 · F27

Review, weekly quests, the streak, can-do progress, and word search were stacked
inside long Today and Practice screens, in the same pale cards. This slice gives
each one a visible entry without adding a new learning mechanic.

## What the learner sees

Bottom navigation, and the desktop sidebar, are Today, Courses, Practice,
Progress, and Words. Account opens from the header profile control on a narrow
screen and from the sidebar footer on a wide screen.

Today, under the greeting, has three shortcuts:

- **Streak** shows study days and grace left, or Off, and opens Progress.
- **This week** shows completed weekly activities, or Off, and opens Progress.
- **Review due** shows the count and starts due review. It stays disabled at zero.

Practice is a two-column set of tiles: Review, Checkpoints, Recall, and Lesson
practice. Each tile shows a count and opens one page: `#/practice/review`,
`#/practice/checkpoints`, `#/practice/recall`, or `#/practice/lessons`. Those
pages keep the Practice tab selected and link back to the hub.

Progress holds the forgiving-streak switch and status, the weekly-quest switch
and checklist, the can-do cards and achievement, and the existing rules. Words
is the learned-word search. The search field stays at the top of that page and
does not take focus on its own.

## Color

Tiles stay white. Each one has a solid icon badge, a colored leading edge, and
a count chip:

- Green: lessons, Review, Lesson practice, and Review due.
- Red: Recall.
- Gold: Streak, weekly quests, and Checkpoints. Gold surfaces use charcoal text.
- Charcoal: Words.

The badge and the label both name the feature. High-contrast mode keeps a
visible border. These tiles do not animate.

## Habits

A new habit state turns weekly quests and the streak on. A state already saved
for that guest or account is left unchanged, so someone who turned them off
stays off until they turn them on from Progress. The switches are independent,
and turning one off keeps saved days and completed tasks.

## Verification

October 15, 2026, local and uncommitted. Run from `i-web` with ports 4173 and 5063
free:

```sh
PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" npm run test:e2e -- --reporter=line
```

Result: 100 passed (6.4 minutes). The run includes the production build. From
the repository root, `dotnet test Ismi.slnx` gives 32 passed.

The browser checks cover the five tabs at 320, 390, and 1280 pixels, tile
counts and destinations, the Today shortcuts, search from the Words tab, a new
guest with both habits on, a saved off state kept across reload, keyboard
names, badge contrast, and reduced motion. Console specs open Account through
the header or sidebar link named “Account”.

Changes made to get the full suite passing:

- Courses “Review and checkpoint” opens `#/practice/checkpoints`. `navigate`
  now maps page names to their route paths.
- The recall spec is renamed `zzzz-recall.spec.ts` so it runs last. Its
  `beforeAll` publishes the three Everyday recall lessons, and no endpoint
  withdraws a new lesson. When recall ran mid-suite, those lessons led the
  study plan and later specs failed. Two of those failures, the checkpoint and
  the completion-summary specs, also fail on clean `HEAD`. The two checkpoint
  buttons were separate units, not a duplicate render.
- With the owner-login specs now back to back, the API's auth limit of 10 per
  minute was exceeded. `RateLimits:AuthPermitLimit` makes the limit
  configurable. Production still defaults to 10, and only the Playwright API
  server sets it to 100.

Real assistive-technology release checks remain under F18.
