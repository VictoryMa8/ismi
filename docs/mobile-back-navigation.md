# Mobile-friendly back navigation

F27.1 · October 15, 2026. Current status lives in
[ROADMAP.md](../ROADMAP.md#f271-mobile-friendly-back-navigation).

## Behavior

Return controls share `i-web/src/BackControl.vue`: a left arrow, visible label,
white surface, green outline and rounded corners. Targets are at least 48×48 CSS
pixels, with padding, wrapping labels, explicit keyboard focus and forced-colors
support. The arrow stays beside English navigation when lesson text is RTL.
No animation or extra sound behavior is introduced.
Recall also honors Escape pressed while answer evidence is saving: it finishes
the write, then closes and restores focus. Late feedback cannot refocus the closed
dialog. Identity changes cancel any pending exit request.

The component renders an anchor when given a destination and a button for an
action. The existing navigation routes and lesson close handlers remain in use;
no control blindly invokes browser history.

| Return journey | Behavior |
| --- | --- |
| Mobile header area / desktop sidebar → landing | Explicit `#` destination, same visible “Back to landing page” label |
| Review, Checkpoints, Recall, Lesson practice → Practice | Explicit `#/practice` destination, including direct entry |
| Latest cultural picks → Practice | Explicit `#/practice` destination |
| Cultural edition → latest picks | Explicit `#/practice/culture` destination, including missing/withdrawn editions |
| Account → Today | New control above the Account heading; explicit `#/today` fallback |
| Account completion / guest entry | Existing Continue actions use the shared treatment and retain their handlers |
| Completed lesson / failed lesson load → originating page | Shared button uses the existing close handler and contextual label; lesson opener regains focus |
| Review / recall completion → underlying practice | Shared button uses the existing close handler |
| Owner lesson preview → curriculum | Shared button closes only the preview; the saved draft and preview opener remain |
| Curriculum → learner app | Shared button closes the console, retaining the underlying page and restoring focus to its opener |
| Welcome → preceding intro card | Shared button retains the existing card navigation and heading focus |

The five primary tabs remain unchanged. Words retains its search/filter state
while its lesson overlay is open; closing the overlay does not recreate that page.
Account and the curriculum console keep their existing unsaved-content rules.
The icon-only close controls remain available while a lesson is in progress; this
change does not add a new lesson-resume/persistence policy.

## Verification

October 15 local verification:

- Production build (`vue-tsc` + Vite/PWA) passes.
- Initial focused existing browser run: 50/53 passed. It caught duplicate desktop
  landing-return visibility, fixed by making the responsive rule more specific
  than the shared component's scoped display rule. It also caught a recall exit/
  focus race; Escape during save now queues the exit and late heading focus is
  suppressed. The isolated original keyboard scenario passes three consecutive runs.
- Eight existing landing-return/entry/history/PWA checks pass after the responsive
  fix. A later wider rerun encounters stale exact-text expectations for landing
  hero copy and “Primary track”, changed concurrently by separate course work.
  Those assertions and the concurrent product changes are preserved; this note
  does not claim an entirely green shared-checkout regression suite.
- Direct Chromium inspection passes at 320, 390 and 1280 px: minimum 48×48 targets,
  one visible landing return, no underline, LTR English controls, keyboard activation,
  main-content focus, browser history, 200% text without clipped controls/overflow,
  forced colors/reduced motion, offline reload → Practice → landing with focus.
- A separate owner-console journey verifies opening from Account focuses the return
  control, closing keeps `#/account` and restores its opener, and Account's explicit
  return reaches Today. No browser-history dependency is introduced.

Visually inspected [mobile](back-navigation/practice-390.png),
[desktop](back-navigation/practice-1280.png) and
[320 px at 200% text](back-navigation/practice-320-enlarged.png). These previews were
regenerated from the isolated F27.1 release candidate; unrelated course UI is excluded.

Final keyboard verification after the timing fix: the unmodified original recall
scenario passes **3/3 consecutive runs**. No further change was needed to the eight
passing landing-route checks. A subsequent combined rerun was not started because
another local test process occupied port 5063; that process was left alone.
The temporary Playwright config used `dotnet run --no-restore` with already-restored
packages; loopback/browser processes required running outside the filesystem sandbox.
Temporary config, inspection script and diagnostic test instrumentation are removed.

The browser suite uses its own temporary SQLite database and recording directory;
no published curriculum or hosted application is changed. Real assistive-technology
release evidence remains part of F18.

## Delivery

The owner authorized push/deployment October 15. The release is prepared from the
previous `main` baseline plus only F27.1 changes. Concurrent course-foundation,
landing wording and backend edits remain local; this release needs no API deployment
or curriculum publication.

The isolated production build and 53 focused browser checks were verified: the first
run passed 52/53, with the cultural malformed-refresh check passing when rerun alone.
All landing/navigation, lesson/preview, glossary, review, sound and recall checks
passed in that run. Ports 4193/5093 and a disposable database avoided other local
test processes. Direct geometry, 200% text, keyboard/history, offline and console/
Account focus checks also pass at 320/390/1280 px. Updated previews were inspected.
This is scoped release evidence, not a claim that the entire mixed checkout passed.

Commit and Vercel status will be recorded after the authorized push. Real-device/AT
and beta gates remain unchanged.
