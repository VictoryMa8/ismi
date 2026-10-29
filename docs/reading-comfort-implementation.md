# F33 reading comfort implementation evidence

October 27, 2026 · application candidate **0.0.13**. Current work state and delivery
remain in [ROADMAP.md](../ROADMAP.md#f33-reading-comfort-and-mobile-lesson-ergonomics).
The owner requested F33 implementation; commit, push, deployment and curriculum
publication are separate. Existing local documentation/test edits were preserved.

## Implementation

- `readingComfort.ts` uses version-1 IndexedDB device snapshots keyed by identity
  and stable course ID. Defaults are 100%, Standard, Shown. Supported sizes are
  100/125/150/200%; invalid values and unknown versions use defaults. No guest
  migration or server preference API is introduced. Per-tab writes are serialized;
  BroadcastChannel rereads the last committed snapshot after other tabs save.
  Failed storage leaves the current reading usable with an explicit not-saved notice.
- Account and lesson/review/writing headers open the same native modal controls.
  Course selection, immediate existing-script preview and course-only reset are
  available offline. Native modal focus containment plus explicit return to the
  exact trigger preserve the underlying lesson/input components. The panel has
  one scrolling surface and unique accessible heading IDs.
- `textAttributes` supplies shared per-course presentation styles to existing
  language-tagged target text. Element-level CSS zoom preserves each surface's
  authored baseline typography at 100%; Spacious overrides line height. It does
  not scale the app, portraits or English interface. Stories and written-response
  models/input use the same styles. Alphabet Range overlays compensate for scale
  while leaving joined Arabic and Khmer text nodes intact.
- `ReadingHelp` wraps existing authored help on teaching, chunks/anatomy, grammar,
  Words, eligible review prompts/models, stories and alphabet reading surfaces.
  Temporary reveals reset with text/course/default changes. Empty help adds no
  control. Existing graded response choices, phrase-builder tokens and gated
  placement/recall hints retain their assessment presentation and reveal logic;
  preferences never open those gates. Explicit assessed prompt-help reveals set
  existing help-used evidence, including the started-lesson snapshot.
- VisualViewport changes resize the fixed lesson frame without height animation
  or remounting inputs. The focused input is scrolled only within its content
  scroller when outside its bounds. Pinch zoom retains browser panning. Compact
  landscape headers/actions retain space for the single lesson scroller.

No curriculum files, source pins, package hashes, approvals or publication records
are changed. The application version increments once for this F33 implementation.

## Verification

The production TypeScript/Vite/PWA build passes. The initial sandbox test-server
startup timed out; a retry outside the sandbox using existing dependencies starts
successfully. The first test batch passed all seven grammar checks and three
existing fixed-frame layout checks. New tests initially used an overly exact
implicit-label selector; they now address the actual named comboboxes.

Passing coverage across the final relevant runs: **63 distinct Playwright checks**:
7 grammar, 3 lesson-layout, 8 reading-comfort, 12 alphabet, 4 placement, 5 review,
12 stories and 12 recall checks. The final focused run passed 23/23; the explicit
200% root-font plus 200% target-text reflow rerun passed 3/3 at 320/390/1280px,
including landscape changes and inner-scroller bounds. This is CSS enlargement
and viewport automation, not a physical browser zoom/keyboard acceptance claim.

The broader run exposed two test assumptions: writing focus now includes the new
control, and a course-link assertion used a retired fixture title. Focus-cycle
coverage was updated to include Reading comfort; the title assertion now uses the
returned lesson title. Both pass. A new writing check preserves the same textarea,
its typed Arabic, selection and synthetic composition lifecycle through settings.
The initial implicit-label selector failures were test-selector issues, not lost
preferences. Explicit help now triggers started-session persistence and its test
confirms the saved help-used value.

Reviewed 320px enlarged-text screenshots and compacted the lesson-header control
to an accessible icon on mobile. Production build and displayed **Beta 0.0.13**
checks pass; package/lock versions agree. `git diff --check` passes, curriculum
files are untouched, and the roadmap checker passes 109 records and 545 links.
The existing Vite mixed static/dynamic `offline.ts` import warning remains.

Reproduce using the normal Playwright configuration and these specs. The local
verification used a temporary configuration adding `--no-restore` to the API
command because dependencies were already present and network restore stalled;
all databases were disposable test databases. That temporary config was removed.

## Remaining physical-device and delivery gates

No physical iOS Safari/VoiceOver or Android/TalkBack session was performed. Before
F33.3/parent completion, record actual keyboard/IME composition and selection,
focus return, mixed-script enlarged reading, orientation, browser zoom and offline
restoration on those devices. Browser viewport automation is not that evidence.
Existing F24.2 content/access acceptance is independent.

On October 28 the owner authorized commit and push, including the existing automatic
frontend deployment. Implementation commit `58581bb` was pushed successfully to
`origin/main` October 28. Hosted deployment is not yet verified. No curriculum publication or beta expansion is claimed. Recovery is removal of
this application's reading controls/styles; the new reading snapshots are isolated
from learning progress and account/study settings and need not be deleted.
