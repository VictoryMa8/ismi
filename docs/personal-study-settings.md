# Personal study settings

F15.1 · Implemented locally October 4, 2026. Not committed or deployed.

## Learner behavior

Account → Study settings is available to guests and signed-in learners. Choose a
5, 10, 15 or 30 minute daily goal (default 15), at least one track and a primary
track from that selection. Removing the primary track selects the first remaining
track; removing all tracks disables saving. These settings never hide courses,
block manual practice, interrupt a lesson or gate retries.

Today shows the allocations and a queue of whole, unfinished published lessons.
One selected track gets the whole goal. With multiple tracks, the initial policy
allocates 60% to the primary track, rounded up to a whole minute, and divides the
remainder evenly in stable track order. This was the recommended implementation
assumption stated during the task, not a separately confirmed owner policy.
For 15 minutes with all tracks, the allocations are 9/3/3. The queue visits the
primary track first and preserves course order within each track. A lesson can
exceed its allocation; it is never split. Completions today subtract from their
own track's allocation, and completed lessons do not enter the new-lesson queue.
Manual review remains available separately; this is not adaptive scheduled review.

MSA and Quranic selections persist but are labeled unavailable. Their allocations
are not reassigned silently, and no unpublished or substitute lessons enter the
queue. The current server catalog still contains only published Levantine content;
the client planner has separate track allocation/completion handling tested with
synthetic multi-track input. This does not claim delivered MSA/Quranic curricula.
Daily completion boundaries continue to use UTC, consistent with existing progress.

## Storage and synchronization

- Guest preferences stay in IndexedDB on this browser. Signing into an account does
  not copy guest choices into it. Signing out restores the guest's own settings.
- Account settings persist in the SQLite `StudySettings` table with a user foreign
  key and revision. Startup creates this additive table for existing databases.
- `GET /api/study-settings` and `POST /api/study-settings` require authentication;
  saves also require the existing antiforgery token. Goals, track IDs, uniqueness,
  selected primary and revision are validated server-side.
- Account edits save locally first. Reconnection verifies the session and sends
  pending edits for that identity. Revision conflicts keep local choices and offer
  **Use account settings** or **Keep this device’s settings**. An identical retry
  after a lost response is safe; a divergent stale write returns 409.
- Settings and dashboard snapshots use identity-specific keys. Legacy dashboard
  snapshots migrate under their previously recorded identity before auth refresh.
  Existing lesson/audio caches are retained. This slice does not redesign the
  existing completion-event queue or add cross-device review-history syncing.
- Without device storage, online account saves can still succeed. If neither local
  nor account storage succeeds, the interface reports failure instead of claiming
  a durable save.

The backend dashboard supplies the full course catalog and actual daily minutes;
the client projects it into the chosen queue identically online and offline.
Changing a goal does not lose minutes that exceeded a previous, smaller goal.

## Verification

October 4, 2026:

- `dotnet test Ismi.slnx --no-restore`: **27 passed**. New coverage checks required
  authentication/CSRF, invalid settings, account isolation, persisted settings after
  host restart, conflicting revisions and identical retries.
- `npx playwright test tests/study-settings.spec.ts tests/course-loop.spec.ts tests/navigation.spec.ts`:
  **10 passed**. Includes allocation totals/ordering with synthetic multiple tracks,
  offline guest reload, unavailable-track behavior, retained course access, offline
  account conflict resolution, guest/account separation, offline course completion,
  reconnection and keyboard/navigation checks at 320/390/768/1280 pixel widths.
- The browser setup's production frontend build passed. The mobile settings
  screenshot was visually inspected; controls wrap without horizontal overflow.
- `git diff --check` passed. NuGet vulnerability metadata lookup was unavailable;
  compilation and the API tests succeeded.

Implementation: `i-web/src/StudySettings.vue`, `studyPlan.ts`,
`useStudySettings.ts`, the App integration, and
`i-api/Services/StudySettingsService.cs`.

Placement assessments, bootcamp content, adaptive review, real assistive-technology
verification and hosting rollout remain outside this completed child. F15 stays open.
