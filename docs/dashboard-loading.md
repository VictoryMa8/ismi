# Dashboard loading feedback and border-free hero

October 11, 2026 · F17.2 · Deployed frontend changes

The owner requested visible feedback while the dashboard loads, then reiterated
that the landing character picture should have no border. This extends F17.1
without changing APIs, curriculum, learning records or landing wording.

## Behavior

Startup shows “Loading your study plan…” with a decorative spinner and concise
explanation while session lookup, queued progress sync, study settings and dashboard
loading finish. Today, Courses and Practice wait for the actual plan, avoiding a
misleading guest greeting, zero progress, empty-course message or offline status.
Navigation, the landing return and Account remain available.

When an existing plan refreshes, “Updating your study plan…” appears while the
current plan remains usable. The loading state ends in a `finally` block; a counter
keeps overlapping dashboard requests from prematurely hiding it. A failed request
uses the existing cached plan when available. Without one, the learner sees an
explicit failure message and Try again rather than an empty dashboard. Offline
reload still supports downloaded lessons and queued progress.

The status uses `role="status"` and polite announcements. Spinner movement stops
under reduced motion while the same text remains. No artificial progress percentage
or forced delay is introduced. The existing requests do not have a new timeout;
a request that remains pending keeps showing the indicator.

The hero artwork already had no border stroke. Its 18px corner rounding has now
been removed, and the image explicitly has zero border, zero radius, no outline
and no shadow. The artwork, character portraits, landing wording and separate
conversation example card are unchanged.

## Verification

Production build and 20 distinct targeted Chromium browser checks pass across
focused runs. Loading coverage holds session and dashboard requests independently,
checks mobile/desktop and reduced motion, allows navigation during startup, verifies
uncached failure/retry and refresh, and verifies cached offline reload. Existing
course completion/reconnection and satisfaction checks pass. Landing tests cover
320/390/768/1440px, unframed image styles, navigation/welcome, failed API/art,
enlarged text, reload and section links. An old API-failure expectation was updated
from a placeholder guest greeting to the new explicit retry screen. An overly broad
intermediate test edit also changed successful-load expectations; that test-only
edit was corrected, and all affected landing checks passed on the final run.

Loading and landing screenshots are visually inspected. Automated checks do not
establish real assistive-technology or supported-browser release coverage (F18).

Implementation: [App.vue](../i-web/src/App.vue), [learner styles](../i-web/src/style.css),
[landing styles](../i-web/src/landing/landing.css).
Checks: [loading](../i-web/tests/dashboard-loading.spec.ts),
[landing](../i-web/tests/landing.spec.ts),
[course loop](../i-web/tests/course-loop.spec.ts),
[satisfaction](../i-web/tests/satisfaction.spec.ts).

Delivery: code release `138a186` pushed/deployed October 11; live loading and
hero verified. [Rollout evidence](releases/2026-10-11-loading.md). API/curriculum unchanged.
