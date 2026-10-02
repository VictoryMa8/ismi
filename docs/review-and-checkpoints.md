# Review and checkpoints

Implemented October 1, 2026 as a bounded Levantine frontend slice.

Practice now offers mixed review, mistake review, and a checkpoint for each
completed unit. Courses links completed units to this practice hub. Existing
individual lesson practice remains freely available.

## Content and queue

The client uses unchanged exercises, accepted responses, rationales, explanations,
and provenance from learner-facing published packages. It does not generate new
Arabic, introduce source claims, or publish drafts. Review includes completed
lessons and lessons where the learner has tried an exercise. Sessions sample up
to six distinct prompt/instruction/model combinations, rotating between lessons,
prioritizing mistakes and then least recently practised contexts. Repeated
delivery-fixture turns do not pad a session.

Checkpoints require all unit lessons completed and available, and begin every
turn with recall before revealing pieces or choices. Translation and choices
remain optional; no listening or speaking is required. Results show how many
first answers matched and how many turns used translations or choices. These
are guided-practice observations, not mastery scores, pass/fail decisions, or
evidence of spontaneous conversation. A checkpoint does not award minutes,
create lesson-completion events, or gate retries.

Scheduling remains manual. The owner was offered a provisional one-day reminder
or entirely manual review; no response was available during implementation.
No reminder interval or consequential mastery/scheduling policy was adopted.
Practice history supports future scheduling after that decision is settled.

## Device storage and versions

IndexedDB `ismi-offline` version 3 adds `review-history`, preserving existing
lesson/audio packages, dashboard snapshots, and queued completions. Each history
record is scoped to the guest browser or account ID, lesson ID, exact published
version, and step ID. It stores the last practice time, unresolved-mistake flag,
selected authored-response ID (null for an unmatched supplied word order), and
authored feedback explanation. A successful retry after seeing the model retains
the mistake; a correct first answer in a fresh practice session resolves it.
Owner previews never write review history.

History and checkpoint results remain on the current device and do not sync
across devices. Offline reload uses the last confirmed review identity without
claiming an authenticated server session. Signing in/out separates review scopes.
Checkpoint history is keyed by the unit's full lesson/version set; changes to
published versions invalidate the displayed result and old mistakes are excluded.

Opening Practice online downloads complete packages for eligible review lessons,
using the existing audio integrity checks. Offline review uses available packages;
an incomplete download disables the unit checkpoint and shows a reconnect notice.
An explicit server 403/404/410 excludes and removes a cached lesson. Storage
failures leave practice/retries available and report that history is not saved.

The review dialog reuses the fixed lesson frame, single scroll region, scroll cue,
phrase builder, reduced-motion transitions, sounds and mute preference. Navigation
and close controls stay pinned. Background content is inert, feedback receives
keyboard focus, and closing returns focus to an available practice control.
Recorded prompts reuse downloaded audio and suppress interface tones during
playback. Real screen-reader and device-listening checks remain release gates.

## Local content inspection

A read-only inspection of `i-api/App_Data/ismi.db` confirmed the seven Everyday
conversations publications: lesson 1 v3, lesson 2 v2, and lessons 3–7 v1. The six
other guided revisions remain drafts. The six original demonstrative publications
also remain. No curriculum state or hosted service was changed by this feature.

## Verification

Production frontend build and all 22 API tests pass. All 23 browser scenarios
passed across the regression and corrected focused runs: the five new review
scenarios, the updated seven-lesson unit flow, and the expanded recording checks.
The initial regression run's two test-locator failures were corrected and rerun
successfully. No failing checks remain. NuGet vulnerability metadata still emits
the existing NU1900 warning; API tests ran with already restored dependencies.

Browser coverage includes offline mistake persistence, unrestricted retry,
fresh-review resolution, checkpoint help/first-answer reporting, offline reload,
no duplicate completion events, changed-version isolation, withdrawn content,
guest/account separation, fixed desktop controls, and all seven guided packages
through the disposable test database. Existing lesson, audio, offline-sync,
navigation and owner-preview regressions are retained.

The standard Playwright configuration is unchanged. In this environment, tests
use a temporary configuration with `dotnet run --no-restore` to avoid an unavailable
NuGet metadata request; local servers and Chromium require execution outside the
filesystem sandbox. No dependencies or providers were added.
