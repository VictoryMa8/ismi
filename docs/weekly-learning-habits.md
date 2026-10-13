# Weekly learning quests and forgiving habits

October 12, 2026 · F17.7 · Local implementation on `main`.

The owner authorized implementation and selected the calendar/grace policy on
October 12. This delivers the first device-local slice described in
[the engagement plan](learning-engagement-plan.md#f177-weekly-learning-quests-and-forgiving-habits).
The broader F17 support/reward/reminder scope and beta release gates remain open.

## Learner behavior

Account → Learning habits has independent **Weekly quests** and **Forgiving streak**
switches, both initially off. Enabling either adds its information below Your plan
on Today. Weekly quests call the existing lesson/review/checkpoint flows; they do
not add duplicate daily queue entries, extra lesson completions, minutes or XP.
Learners can continue through Courses and Practice regardless of checklist state.

Weekly capacity is up to **1 / 2 / 3 / 6 activities** for **5 / 10 / 15 / 30-minute**
daily goals. The plan takes one new lesson first, a due review when available
(otherwise mixed review), an available completed-unit checkpoint, then remaining
new lessons. It can be smaller when content or downloads are unavailable.
Each new lesson/unit appears at most once and review has one checklist task, rather
than repeated fixture quotas. Already completed core lessons are not offered as
new learning. Selected tracks and primary-track/course ordering are respected.

Tasks reference the published dashboard and the existing version-aware review hub.
Review/checkpoint availability comes from actual loaded packages, not guessed
completion counts. Offline new-lesson choices are restricted to cached packages.
Incomplete tasks adapt to available content and selected tracks; completed tasks
remain checked when goals/tracks change. Reducing a goal removes pending work;
completed work is preserved even if it exceeds the new capacity. Unavailable
story/transfer activities are not invented; F22/F23 can supply these later.

Completing the available list receives a simple gold acknowledgment. Missed weeks
and lapses have welcoming return text. Learning, explanation, retries and practice
remain freely accessible. Rules and device scope are visible in both the settings
and Today panels.

## Selected rules

- A full core lesson, full lesson-practice session, review or unit checkpoint
  qualifies as study. Help and retries are allowed; a partial/closed session does
  not qualify. Draft previews do not count. A new-lesson quest specifically requires
  core completion; lesson practice can contribute a study day without claiming it.
- Activity time is the completion time. Calendar days end at midnight and weeks
  begin Monday in the IANA timezone captured at first opt-in. Travel, browser
  timezone changes and daylight-saving changes do not reinterpret stored dates.
- One or more completed activities on a date add **one** study day. Grace preserves
  continuity but does not inflate the displayed study-day count.
- **Two free grace days per Monday week** automatically cover missed calendar
  days following study. They do not bank; unused grace expires on Monday. Today
  remains open and does not consume grace. Exhausting grace starts a fresh streak
  at the next study day, retaining underlying lesson/review progress and saved days.
- Quests and streaks pause credit independently when disabled. Saved history stays
  on this device. Re-enabling does not import historical account completions as
  new habit evidence. A new week replaces the checklist, retaining recorded study
  days and credited activity IDs; there is no weekly archive UI.
- The app generates a stable ID once per lesson/review session. The core lesson
  uses that same ID for queued/server completion. Duplicate callbacks, retries,
  reloads and reconnection cannot award a second acknowledgment or study day.
  Reconnection never generates habit credit from server or queued progress.
- Guest and `user:<id>` records are separate. A completion whose captured scope
  no longer matches the active identity is ignored for habit credit. Account
  progress sync does not imply cross-device quest/streak sync.
- Calendar rollback cannot reopen an earlier checklist or add earlier study-day
  credit. This is device-local guidance, not a server-verified clock or reward
  economy. There are no new XP, paid repair, leagues or reminder-delivery services.

## Implementation

- [Calendar, checklist, completion and grace rules](../i-web/src/learningHabits.ts).
- [Versioned device persistence and scope checks](../i-web/src/useLearningHabits.ts):
  localStorage keys `ismi-learning-habits-v1:guest` and
  `ismi-learning-habits-v1:user:<id>`. Read latest storage before mutations; refresh
  on focus/storage events and a 30-second clock tick. Failed reads/saves show an
  error without blocking study or pretending the switch was saved.
- [Accessible controls and checklist](../i-web/src/LearningHabits.vue).
- [App integration](../i-web/src/App.vue) and
  [existing review flow hooks](../i-web/src/ReviewPractice.vue).

## Verification

[Focused checks](../i-web/tests/learning-habits.spec.ts) exercise four goal sizes,
no-content cases, task uniqueness, completed-task preservation, independent opt-outs,
partial reviews, helped due completion, checkpoint completion, stable IDs, offline
reload/reconnection, guest/account separation, storage failure, calendar rollback,
Monday rollover, DST, travel, free grace and welcoming restart. Mobile/desktop
screenshots were inspected; keyboard controls and doubled text have no horizontal
page overflow. Existing interface mute persists through offline completion/reload;
no new animation is introduced and reduced-motion study continues to work.

Production TypeScript/Vite/PWA build and **29 distinct targeted Chromium checks pass**
across focused runs,
including all eleven F17.7 checks plus course-loop, review/checkpoints, curriculum
preview, scheduled review, study settings and satisfaction regression coverage.
Command: `npm run test:e2e --prefix i-web -- learning-habits.spec.ts course-loop.spec.ts review.spec.ts scheduled-review.spec.ts study-settings.spec.ts satisfaction.spec.ts`.
The rollout ordering correction additionally passed all 16 affected quest, study-settings
and satisfaction checks, including a cross-unit published-path assertion.
Automated roles, labels, focus and status checks do
not establish a real VoiceOver/NVDA pass or the full supported-browser release gate;
those remain F18 work. Checklist completion is not learning-outcome evidence.

## Delivery

Owner authorized commit, push and deployment in the follow-up request. Application
release `5aec0ec` is pushed and deployed to Vercel, with live controls, published-path
ordering and reload persistence verified. [Rollout evidence](releases/2026-10-12-weekly-habits.md).
There is no API/database schema change or curriculum publication. Reminder delivery
and cross-device history remain separate scopes.
