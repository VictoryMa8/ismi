# Scannable study plan and can-do progress — F27.2

October 17, 2026. The owner requested a UX/UI fix for the text-heavy Today plan
and Progress targets, supplying screenshots of both sections. This is a
frontend change on `main`; it does not change curriculum, evidence rules or daily
allocation policy.

## Changes

- Today’s plan is a contained panel with planned minutes and a compact settings
  control. Upcoming lessons are full-width numbered buttons with title, course,
  duration and a trailing arrow. The primary lesson stays in its existing hero.
- The upcoming list excludes the actual hero lesson by ID rather than blindly
  removing the first queue item, so switching viewed courses cannot hide an
  unrelated scheduled lesson. Queue ordering and allocations remain unchanged.
- Whole-session overruns use a short gold minutes badge. Course allocations and
  availability remain under “Study time by course.” Empty plans link directly to
  Courses or Practice as appropriate.
- Can-do progress uses compact stacked rows with a title, distinct state icon,
  written-recall state and working practice action. Unavailable targets show
  “Lesson needed”; one shared “Start with a lesson” / “Unlock more targets” panel
  links to Courses instead of repeating paragraphs and disabled controls.
- Version, dialect/register, supporting dates and source/attempt records remain
  under each available target’s “Attempts and sources”; locked targets expose this
  only when historical evidence exists. Historical evidence is retained
  with a short visible explanation. The policy disclosure uses three clear steps,
  retaining the independence, due review, distinct-situation and 24-hour rules.
- The achievement switch remains available with the same saved identity-specific
  preference. Written recall stays explicitly device-local; no speaking,
  listening or proficiency claim is added.

## Verification

- Production Vue/TypeScript/Vite/PWA build and `git diff --check` pass.
- Final focused Playwright run: **33/33 passed** across `satisfaction`,
  `study-settings`, `feature-hubs`, `multi-language`, `can-do-policy` and
  `zzzz-recall`. The test runner rebuilds the production client and uses a
  disposable database; no hosted curriculum is touched.
- Coverage includes 320/390/1280 px layouts, doubled text, keyboard disclosure and
  lesson entry, manual course access without changed allocations, course switches,
  unavailable targets, practice focus restoration, historical/withdrawn content,
  separate guest/account preferences, offline later review and persistent awards.
- Plan and empty-progress sections visually inspected at 390 and 1280 px, along
  with the existing available/earned-progress render. Corrected the green panel’s
  heading contrast during visual inspection.
- Two older Today assertions were updated for the already-shipped course banner
  and manual lesson entry after reaching the goal. Their corrected flows pass in
  the final run.
- Real device and assistive technology beta gates remain under F18.

## Delivery

The owner authorized commit/push October 17 after local verification.

- Application commit: `242187688f8a118af0277246322af79aba13c2dd`, pushed to
  `origin/main` from the verified checkout.
- Existing Vercel project `ismi`, team `victorys-projects-c1cb4594`, Git target
  `production` (the project's existing development preview, not a beta release).
- Deployment `dpl_G9PUrs9bkRs9XYar5xTTE9nKP264` is **Ready**, verified via the
  authenticated Vercel CLI October 17. Deployment metadata matches the exact
  application SHA and `main` branch. The connector's scope error was bypassed
  using the CLI's existing authorized account.
- The Ready deployment has `ismi-arabic.vercel.app` and `ismi-ruby.vercel.app`
  assigned. Deployment URL:
  <https://ismi-e0vqx5b3e-victorys-projects-c1cb4594.vercel.app>.
- Verification covers local browser behavior and hosted deployment status/aliases;
  no new live browser acceptance claim is made.
- No API deployment, database change or curriculum publication. The previous
  frontend commit `8f5536e` remains available for rollback.

Implementation: [Today plan](../i-web/src/App.vue),
[plan styles](../i-web/src/style.css), [can-do rows](../i-web/src/CanDoProgress.vue).
Checks: [Today](../i-web/tests/satisfaction.spec.ts),
[can-do and recall](../i-web/tests/zzzz-recall.spec.ts),
[study settings](../i-web/tests/study-settings.spec.ts),
[navigation](../i-web/tests/feature-hubs.spec.ts),
[evidence policy](../i-web/tests/can-do-policy.spec.ts).
