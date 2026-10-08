# Scheduled review (F10)

Implemented October 7, 2026. The owner explicitly selected the recommended
1, 3, 7 and 14-day policy in this task. Current status is in
[the roadmap](../ROADMAP.md#f10-scheduled-review).

## Policy and scope

- Review is per published lesson version and step, within the existing guest or
  account scope on this device. A day is exactly 24 elapsed hours, so daylight
  saving and timezone changes do not move the stored instant.
- The first answer schedules the exchange for one day later. At or after its
  due instant, a correct first answer without translations or response choices
  advances to 3, then 7, then 14 days; subsequent successful due reviews stay at 14.
  Word-piece reconstruction is guided practice and can advance the interval;
  this is not a claim of independent recall or mastery.
- A mistake or help returns the interval to one day. Correct retries preserve
  the first answer's schedule. An early successful manual practice preserves the
  due date and interval, preventing repeated practice from racing up the ladder.
  Mistake resolution retains F05's separate rules.
- Legacy F05 history lacks interval/help evidence: its first due instant is one
  day after its saved practice time. No inferred streak or mastery is migrated.
- Completed lessons and attempted exchanges are eligible. Unattempted steps of
  an incomplete, unchanged lesson are left for normal learning. A changed
  published version discards scheduling evidence from the old version and is
  immediately eligible for fresh review. Old records remain isolated.
- Due sessions contain at most six distinct exchanges, ordered by due instant,
  mistakes, last practice, course order and stable IDs, rotating across lessons.
  Identical prompt/instruction/model contexts within one lesson version use their
  most recent result for due selection, avoiding a backlog of duplicate fixture turns.
- Today shows due review for selected tracks alongside the lesson queue; Practice
  preserves access to all available Levantine reviews, even for deselected tracks.
  Scheduled review starts with recall before optional word pieces or choices.
  It adds no completion events, XP, mastery label or daily-goal minutes.
- Manual mixed review, mistake review, checkpoints and lesson retries stay free
  and available before the due date. No notification or reminder service is added.

## Persistence and failures

Optional schedule fields extend the existing IndexedDB records without replacing
history or changing its keys. Attempt and schedule are saved in one transaction.
Offline reload uses cached published packages and the existing identity scope;
review history does not synchronize across devices. The client clock determines
due instants. Counts update every 30 seconds, on window focus and when opening
or closing review. A partial session retains each already-answered exchange.

Missing packages retain the reconnect notice. Explicit 403/404/410 withdrawals
remove cached content; scheduled review cannot select it. Existing storage errors
remain visible and learners can finish or retry without saving history. Owner
previews still never write learner history. Notifications, full accessibility
release evidence and cross-device history synchronization remain separate work.

## Implementation and verification

- [Policy](../i-web/src/reviewSchedule.ts), [selection](../i-web/src/review.ts),
  [storage](../i-web/src/offline.ts), [review UI](../i-web/src/ReviewPractice.vue).
- [Scheduling checks](../i-web/tests/scheduled-review.spec.ts), existing
  [review regressions](../i-web/tests/review.spec.ts) and
  [study settings](../i-web/tests/study-settings.spec.ts).
- Production frontend build and all 27 API tests pass. The complete standard
  browser suite passed all 49 tests (5.1 minutes), including five new scheduling
  checks. The final focused rerun passed all 11 checks after the shared date-label/context
  selector refinement. Both browser runs rebuilt the production frontend.
- Coverage includes exact due instants across a daylight-saving boundary, the
  14-day cap, early practice/retry resistance, help and mistake resets, conservative
  legacy history, duplicate contexts, new versions and withdrawals, Today offline
  reload, partial-session persistence, UI interval advancement and identity isolation.
  Existing tests retain free retries, checkpoints, teaching, course completion,
  audio, navigation, storage failures and settings conflicts.
- Mobile Today and Practice screenshots were inspected for layout. Automated
  Chromium checks do not replace F18's real-device/screen-reader release evidence.
- Tests used a disposable database and a temporary Playwright configuration with
  `dotnet run --no-restore`; the standard configuration is unchanged. Sandboxed
  test servers could not start, so the successful browser runs executed outside
  the sandbox. NuGet emitted the existing NU1900 vulnerability-metadata warning;
  restored dependencies and API tests still succeeded.
- Initial focused runs caught and resolved an unstable Today lesson-list reference
  that closed the review dialog, plus a test expectation that assumed a timezone.
  Final code review aligned the next-date label with duplicate-context selection.

The owner subsequently authorized push and deployment. See the
[October 7 rollout record](releases/2026-10-07.md) for delivery evidence.
No curriculum publication or backend deployment is needed for F10.
