# Course switching, shared characters and language palettes

October 16, 2026 · F24.8.1, with F24.7/F06 presentation refinements.

## Issue and behavior

Today derived its lesson card only from selected courses and the allocated daily
queue. Viewing Khmer without adding it to the daily plan therefore removed the card,
even though its five published lessons were still in Courses. A secondary omitted
by the rotation, or a course whose slot was allocated to review, had the same problem.
The selector also became usable before startup dashboard/auth restoration finished,
allowing an early choice to be overwritten by the restored identity's course.
Teaching also mounted before its saved checkpoint was loaded, so a resumed lesson
could show the opening scene instead of its saved teaching card.

The selector now waits for usable startup data; lesson loading remains visible until
checkpoint restoration finishes, so teaching mounts at the saved stage. Today first uses an allocated
lesson, then offers the viewed course's first unfinished lesson (or its last lesson
for review). Manual entry is labeled **Outside today’s plan · study settings unchanged**.
The existing primary course, selected courses, rotation and total daily budget are
unchanged. Explicit study still counts actual completed minutes under the existing
rules. Planned courses retain factual empty states. Course paths, saved lessons,
progress, language filtering and offline/version/identity storage are preserved.

Fattoush and Knafeh are shared recurring characters for every language. An absent
lesson cast now displays them as learning guides on Today, course cards, teaching,
practice/review and completion. Authored cast/participant mappings remain authoritative;
unknown registries keep existing image fallbacks. No roles are inferred from turn
position, and no published dialogue, assigned exercise name, Khmer package hash,
source, approval or review disposition changes. The existing offline portraits and
fixed-square sizing are reused; decorative images do not reveal answers.

Landing palettes now use explicit course IDs instead of featured/last-child
selectors. The old last-child rule incorrectly turned Khmer copy white over its
white surface. Five cards now have distinct, rich surfaces: Palestinian Levantine
green, MSA gold with dark text, Quranic charcoal with gold trim, French blue, Khmer
crimson with blue trim. Names and availability remain textual. Buttons, status labels
and descriptions inherit each card's contrast color; focus outlines stay visible.
Course identity colors do not change exercise correctness colors.

## Verification and delivery

Production Vue/TypeScript/Vite/PWA build passes. Final focused Chromium run: **23
passed / 0 failed** across multi-language, language palettes, existing characters,
study settings and actual Khmer preview publication. Checks cover repeated switching,
teaching/practice/offline reload/resume, saved primary/selection independence,
identity/version separation, existing authored roles/unknown registries/failed images,
all five actual Khmer packages and download/completion/reconnection. Landing cards
at 320 and 1280 px have five distinct backgrounds, text/control contrast at least
4.5:1, keyboard focus and no horizontal overflow. Reordering cards preserves palettes.
The initial run had 22/23 passes; the new teaching locator was scoped to the active
card, then its resume assertion exposed the checkpoint mounting race fixed above.
The full focused suite passed after that fix. No broader application regression,
human assistive-technology or real Safari pass is claimed.

`node scripts/build-khmer-drafts.mjs --check` and `git diff --check` pass. Local
landing colors were visually inspected in the browser. Frontend rollout/live checks
follow; the API remains at its existing revision. The flow is browser selector →
existing dashboard summaries/public lesson API → scoped cached session → rendered
course/lesson. There is no API/schema migration or curriculum publication.
