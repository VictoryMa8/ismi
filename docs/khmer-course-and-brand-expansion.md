# Khmer lessons and Ismi's multi-language presentation

Subsequent authorization: the owner requested all F24 implementation and a deployment
candidate on October 15. See [implementation and verification](multi-language/README.md)
and the current roadmap. This original planning/assessment text does not itself
approve F25/F26 course authoring, content publication or deployment.

Planning brief · October 15, 2026. Current status belongs to
[F26](../ROADMAP.md#f26-khmer-course),
[F24.7](../ROADMAP.md#f247-multi-language-wording-landing-and-visual-identity),
[F24.8](../ROADMAP.md#f248-prominent-language-and-course-switching) and
[F27.1](../ROADMAP.md#f271-mobile-friendly-back-navigation).
This expands the implementation plan; it does not start application implementation,
curriculum authoring, publication or deployment.

## Owner direction

Make Khmer a first-class course within Ismi and prepare the surrounding product
for French, eventual Portuguese and further languages. Keep the name Ismi and the
promise **“Speak with the people you love.”** Arabic remains the flagship, with
Palestinian identity visible in its course, characters, examples and visual roots.
The shared product should welcome a Khmer learner without implying that they must
learn Arabic first or that every language is an Arabic track.

The owner permits a broader wording overhaul as part of this planned expansion,
including the landing page, and red/blue Cambodian flag-inspired surfaces alongside
the existing green, red, gold, charcoal and white. Exact replacement copy, color
values and artwork are design deliverables. The existing owner-edited wording stays
in the running application until this work is implemented. Portuguese is future
direction, with no course variety, depth, release date or beta inclusion selected.
The owner's follow-up also requests exploring an English/Arabic/Khmer brand title,
improving page-back controls for mobile and making Arabic–Khmer switching obvious.

## Implementation milestones for Khmer

| Milestone | Concrete deliverable | Completion evidence |
| --- | --- | --- |
| Define the course · F26.1 | Agreed learner brief, Cambodian Khmer reference model, reading inventory, pronunciation-help convention, first-unit rubric, source/rights register and linguistic review route | Recorded decisions and permissioned sources; no reviewer availability assumed |
| Make one lesson work · F24.1/.2/.4 + F26.3 | Versioned language/course metadata, Khmer text/help/audio fields, authored segments and Khmer validation; one clearly marked engineering fixture | Import → learner → download → offline completion → reconnect works; old Arabic state survives; fixture is excluded from public course claims |
| Prepare the first unit · F26.2/.3/.5 | Five source-linked lessons, optional script/sound support, accepted-answer rationales, human model audio and a checkpoint | Exact text/audio/source mappings; linguistic dispositions, validation and owner approval recorded separately from publication |
| Prepare the entry experience · F24.7/.8 | Landing/course cards, three-script title exploration, course-aware onboarding, obvious language switching, shared wording and Khmer red/blue | Mobile/desktop review, switching/state checks and availability states match the candidate content |
| Observe the first unit · F26.6 + F24.5 | Khmer-only and Arabic/Khmer study journeys; immediate and delayed tasks with help/attempt evidence | Actual mobile input, screen-reader, offline, switching and progress checks; defects receive fix/retest dispositions |
| Expand and release · F26.4/.5/.6 + F24.6 | Remaining agreed units, reference material, audio/speaking coverage and release manifest | Full-course criteria, approved publications, hosted verification and rollback evidence |

The recommended first engineering slice is one complete Khmer lesson beside an
existing Arabic lesson. This proves the shared foundation before bulk authoring.
It is an implementation milestone, not permission to publish a fixture or call the
course complete. Khmer technical work need not wait for a completed French course;
the relative implementation priority remains an owner decision.

### First unit: meet someone and keep the exchange going

Use the following five lesson briefs for planning. Exact Khmer, address terms,
grammar, cultural notes and pronunciation help must come from approved sources and
linguistic review; this plan supplies no invented teaching text.

1. **Greet someone:** choose a suitable greeting for a stated relationship and
   respond to it. Introduce script and optional pronunciation help through the
   actual phrases rather than an alphabet prerequisite.
2. **Introduce yourself:** give a name and ask the other person's name in a short
   exchange. Explain the reviewed address choices that make the response fit.
3. **Get to know each other:** exchange one or two simple personal details with
   reviewed question/response patterns; reuse earlier phrases in a new situation.
4. **Ask for help understanding:** ask for repetition or a slower exchange and
   respond after clarification. Make communication repair a taught success.
5. **Put it together:** greet, introduce yourself, exchange a detail and repair a
   misunderstanding in a changed situation. Follow with a unit checkpoint and
   schedule later retrieval of taught material.

Each lesson needs a short dialogue, explicit communicative goal, teaching cards,
contextual practice, reviewed explanations and structured accepted answers. Preserve
script, pronunciation help, English meaning, source IDs and model audio separately.
Offer meaningful alternatives to required typing, listening or speaking. Reading,
listening, written recall and speaking evidence must remain distinguishable.

F26 retains its proposed twelve-unit/sixty-lesson depth and measured 30-day and
course-end outcomes. These remain recommendations until the definition is agreed;
completing the first unit does not satisfy the parent course or establish fluency.

## Landing page changes

Keep the relationship-centered hero headline and a clear route into the real app.
Broaden the supporting description to explain conversation-based language learning,
then state which courses actually have published lessons. The generic description
must not imply that Khmer, French or Portuguese is already available.

Replace the Arabic-only discovery section with **Languages**, grouping Arabic's
Palestinian Levantine, MSA and Quranic courses together and giving Khmer its own
entry. French has a planned entry; eventual Portuguese can be mentioned in a short
future-direction note without a start button or date. Display separate language
and course labels: Khmer is a language; Palestinian Levantine is an Arabic course.
Use factual states such as “Development preview”, “Planned”, and “Pilot available”
only when supported by actual content and release decisions. Show real lesson/unit
depth and reviewer/audio status rather than a generic “available” promise.

Keep an identifiable Palestinian Arabic example with Fattoush and Knafeh. Label it
as an Arabic example instead of making it appear to represent every course. Add a
Khmer example only after its exact text/help/translation/audio is approved for that
use. A labeled Arabic example is sufficient while Khmer is still planned; avoid an
unreviewed script illustration or decorative pseudo-Khmer. Reuse the border-free
oval hero and existing art initially. New Cambodian scenes/characters require a
separate asset brief and cultural review; a global rebrand does not require removing
the existing characters or assigning them Cambodian identities.

The method and benefits sections can remain where their promises apply across
courses. Move Arabic-specific reading, dialect and Quran messaging into the Arabic
course area or its FAQs. Keep **“Understand Arabic from conversation to Quran”** as
an Arabic supporting promise. Expand the FAQ to explain available/planned courses,
course-specific script help, English instruction, parallel study and honest limits
on outcomes when daily time is shared. Preserve preview, adult and beta disclosures.

The existing CTA can keep saying **“Try out the app.”** Before Khmer publication,
its entry experience must make the available Arabic preview clear. Once an approved
Khmer pilot exists, a Khmer card should enter that course or its course detail,
without silently falling back to Arabic. Returning learners retain Continue/Today.
Do not send everyone through a new mandatory course picker. Keep the old
`#arabic-tracks` link working if a broader `#languages` section replaces it.

## Prominent language switching

Once Khmer study is implemented, put a visible current-language/course control in
the learner header on mobile and header/sidebar on desktop. Pair the active name
with an explicit **“Switch”** cue and a chevron; do not rely on a flag, globe icon,
Account setting or onboarding memory to communicate that switching is possible.
Recommend opening a compact selector and choosing **Arabic** or **Khmer** in at
most two taps from each main page. Label Arabic's active course, such as Palestinian
Levantine, so its three courses remain distinct. Restore the last usable course
within each language; retain access to the other Arabic courses with honest status.

Switch the course context consistently across Today, Courses, Practice, Progress
and Words, including help/audio labels and course-specific review/placement/history.
Keep the selected course on reload, respect guest/account boundaries and allow
offline switching among downloaded courses. Show a clear download/connection state
when the chosen course is not cached. No silent fallback to Arabic or newly enabled
fixture course. French and Portuguese can join the same selector when available.

Viewing another course must not silently change the primary course or the total
daily allocation. Keep the daily plan's cross-course obligations distinguishable
from the selected course view. Preserve a started lesson's language and state;
switch only through a safe exit/resume path, never by replacing the current lesson
in place. The full implementation must verify pending progress, downloads and due
review stay attached to the original course. Use F24.5's observed pilot to ask a
learner to find the switch, move to Khmer and return to Arabic without assistance.
Record whether they succeed, then address discoverability issues before release.

## Mobile-friendly back navigation

Replace plain underlined back-link styling with one consistent return control:
a leading arrow/chevron, destination text such as **“Back to Practice”**, a visible
surface or outline, generous spacing and a minimum 44×44 CSS-pixel tap target.
Place it near the page heading/header so it is easy to find on a phone. Preserve
concise labels, clear focus/pressed states and separation from adjacent controls.
Navigation can remain a semantic anchor styled as a control; closing a dialog or
performing an action should use a button. Ordinary links within content need not
all become buttons.

Audit landing-return links, Practice pages, cultural collections/archive/detail,
Words and contextual lesson returns, Account and owner-console views. Keep the five
main navigation tabs; a back control is for the applicable return journey, with a
known parent/fallback for direct entry. Preserve supported scroll/filter context,
browser history and offline routes. Do not send a deep-linked visitor out of Ismi
by blindly invoking browser back. Verify mobile widths, enlarged text, keyboard,
screen-reader names and lesson exit/resume. This is F27.1, independent of Khmer;
see [implementation and verification](mobile-back-navigation.md). Current delivery
status belongs to the roadmap; the delivered F27 navigation remains complete.

## Wording across the product

Use shared English for navigation and common actions; resolve target language,
course, script help and audio from the active lesson/course. Keep precise Arabic
labels inside Arabic lessons. Do not apply global find-and-replace to curriculum,
published records, source citations or historical audit evidence.

The following is a copy direction for implementation, not final approved prose:

| Surface / current assumption | Planned wording or behavior |
| --- | --- |
| Hero/footer describe the whole product as Arabic learning | Shared relationship/conversation promise plus a factual course-availability line; retain a clearly labeled Arabic section |
| “Arabic tracks” navigation and discovery | “Languages”; distinct courses inside Arabic, with Khmer/French shown at their actual delivery state |
| App welcome always introduces Fattoush and Knafeh | Shared welcome describes lessons, help and guest entry; course-specific introduction presents the relevant cast. Preserve completed/skipped welcome state |
| Settings refer only to the three Arabic tracks | “Your courses” and “Primary course”; keep English UI and the existing total daily goal, with separate progress per course |
| “Play Arabic”, “Stop Arabic audio”, device-voice notices | “Play Khmer”, “Stop Khmer audio”, or equivalent for the active language; recording/preview/unavailable states stay explicit |
| “Arabizi” or Arabic-script help offered everywhere | Keep Arabizi for Levantine; use the agreed Khmer pronunciation-help label and script support for Khmer; show only relevant help |
| Word search placeholder “Arabic, English or transliteration” | “Search words or meanings”, with active-course filters and relevant script/pronunciation-help search |
| Placement, lesson path and progress assume Levantine | Name the actual course and supported assessment; no combined proficiency or unsupported literacy/pronunciation score |
| Loading reel and Watch & listen are Arabic content | Label their Arabic scope or filter by supported course; show an honest empty state for unsupported courses rather than relabeling Arabic content as Khmer |
| Console validation says “needs an Arabic prompt” | Language-profile-specific prompt/help/segment errors; preserve Arabic and Quran publication safeguards |
| Browser description, social cards and installed-app description say Arabic only | Shared product wording consistent with the landing; course-specific metadata/examples where appropriate; keep title/name recognizable |

Audit visible text, tooltips, accessible names, empty/error/offline states, source
and review labels, metadata and installation copy together. Reuse a small shared
course-label/copy layer rather than adding a full interface-translation system.
Portuguese and future courses should supply metadata and course-specific copy
without another rewrite of the shared shell. Portuguese variety and its curriculum
must be decided before course creation; French retains its separate F25 definition.

## Visual identity

Use a recognizable Ismi shell with richer surfaces and generous white space.
Retain the wordmark, Arabic-script brand accent, Palestinian character assets and
green/red/charcoal heritage. Recommend deep blue and red as Khmer course accents,
inspired by the Cambodian flag, with shared gold available for achievements and
completion. Blue can also appear in shared discovery/landing sections so the
expanded identity is visible before entering a lesson. Exact tokens require visual
and contrast review; flag inspiration is not a requirement to reproduce a flag.

Explore the visible brand title in **English / Arabic / Khmer**, retaining
**Ismi / اسمي** and adding a linguistically checked Khmer rendering of the brand.
Prepare inline desktop and compact/stacked mobile options. Decide explicitly
whether Khmer uses a transliteration of Ismi or a translated name; do not invent
an unreviewed spelling. Treat this as a design exploration with an owner-reviewed
outcome, not a requirement to squeeze three scripts into every small icon or tab.
Use real text with appropriate language tags and direction isolation; Arabic stays
RTL and English/Khmer LTR. Check Khmer shaping, enlarged text and screen-reader
reading order. The existing English relationship headline can remain; the requested
three-script treatment concerns the brand/title, not full interface localization.
Keep compact browser/PWA titles recognizable as Ismi.

Separate course accent colors from correctness/error/focus/offline semantics. A
red Khmer panel must not imply a wrong answer, and blue must not become the sole
language identifier. Pair colors with course names, icons and text feedback. Use
course names as the primary identifiers; a flag alone cannot describe language
variety, register or all the people who speak it. Future French and Portuguese
treatments can share this system without forcing one country identity per language.

Keep both lesson frame height and scroll behavior stable, respect reduced motion,
preserve the mute preference, retain portrait sizing through `--portrait-size`,
and support enlarged script and high contrast. Khmer text needs its own verified
font/layout/input support; a blue theme does not establish Khmer lesson readiness.

## Implementation entry points and verification

October 15 source inspection found Arabic-only wording and assumptions in:

- `i-web/src/LandingPage.vue`, `landing/content.ts`, `landing/landing.css`,
  `AppWelcome.vue` and `AppShell.vue`: hero, discovery, examples, welcome and entry.
- `i-web/src/App.vue`, `StudySettings.vue`, `PlacementCheck.vue`,
  `LearnedWords.vue`, `LoadingWords.vue`, `types.ts` and `studyPlan.ts`: learner
  wording, voice controls, available courses and Arabic-specific fields.
- `i-web/index.html` and `i-web/vite.config.ts`: search/social descriptions,
  prerendering and PWA metadata. No domain move is needed for this planning scope;
  any later replacement of the Arabic-specific preview hostname needs redirects,
  canonical updates and a separately authorized hosting change.
- `i-api/Models/LessonModels.cs`, `Models/StudySettingsModels.cs`,
  `Services/CurriculumValidator.cs` and `Services/SeedCurriculum.cs`: compatibility,
  allowed selections, publication and dashboard availability.

During implementation, verify the complete course journey and targeted existing
Arabic regressions: first entry and returning learner, course choice/switching,
help/audio labels, placement, review/glossary/progress, downloaded fonts/audio,
offline completion/reconnect, guest/account isolation and existing pending progress.
Check Arabic RTL and Khmer/French LTR separately, real Khmer mobile input and
screen-reader use, 200% text and 320/390/768/1440 px layouts. Check prerendered HTML,
metadata, PWA update behavior and old section links. Record visual and functional
results against actual web/API/content versions; planning-only edits require no
application regression run.
Include the three-script title's mobile wrapping/shaping, every audited back
control and the visible two-tap Arabic–Khmer selector in those checks. Confirm
switching and returning preserves course state online, offline and after reload.

Before authoring, resolve F26.1's reference model, depth/reading outcomes,
pronunciation help and review/source route. Before queue changes, resolve F24.3's
allocation policy. Before release, resolve pilot/beta inclusion and provider/privacy
requirements. The recommended defaults remain contemporary Cambodian Khmer with
an identified Phnom Penh-based reference model, optional script support, the
proposed twelve-unit target and a small first-unit pilot before bulk authoring.
None of these recommendations silently commits a reviewer, provider or release.
