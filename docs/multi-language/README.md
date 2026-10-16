# Multi-language foundation (F24)

Implementation and verification note · October 15, 2026. Current completion status
and remaining acceptance gates belong to [ROADMAP.md](../../ROADMAP.md#f24-multi-language-foundation-and-parallel-study).
The owner authorized the entirety of F24, approved the recommended queue policy,
and requested a deployment candidate. Deployment, curriculum publication, paid
services, F25/F26 course authoring and beta expansion are separate actions.

## Compatibility and course identity

`i-api/Models/CourseCatalog.cs` and `i-web/src/courses.ts` define five stable course
IDs: `levantine`, `msa`, `quranic`, `french`, `khmer`. The first three belong to one
Arabic language. Portuguese has no enabled record or course promise. Tags, direction,
font, pronunciation-help label and audio locale come from course metadata.
`GET /api/courses` reports actual published lesson counts. The dashboard lists all
published courses; progress is calculated separately in each course.

Schema 1 Arabic packages and their `arabic` / `arabizi` fields remain readable.
Schema 2 adds `targetText` / `pronunciationHelp` to prompts, answers, teaching blocks
and vocabulary. Adapters create readable in-memory views; they do not rewrite
published JSON or existing downloads. Conflicting old/new text fields are rejected.
No SQL or IndexedDB schema upgrade is needed. Existing version-3 stores, settings
revision/conflict handling, lesson IDs, version IDs, scope keys and completion IDs
remain in place. A lesson ID cannot move between courses in a revision.

Started lessons are stored under `started-lesson-v1:<identity>:<course>` with the
exact lesson version, step, teaching stage, help, response/feedback and builder
pieces. Resume restores only the matching ID/version; a new content version starts
fresh. Completed lessons clear the saved session. Explicit “Review teaching” starts
at the scene; switching courses preserves the saved session. Removing/re-adding a
course does not delete its lesson, placement, review or completion records.

Viewed course uses `viewed-course-v1:<identity>`; `viewed-language-courses-v1:<identity>` remembers the last usable choice within each language. The labeled native selector is
available above all five main pages on mobile and desktop. Selecting a course does
not edit study settings or primary allocation. Planned courses show a status screen
without substituting Arabic. The selector is disabled while a lesson/review is open;
close and resume provide deliberate transitions without relabeling an open lesson.

## Queue policy approved October 15

`parallel-v1` uses the same UTC date as existing daily completion accounting; the
separate habits timezone policy is unchanged. Goals remain total 5/10/15/30 minutes.

- Work in whole sessions. The primary course receives about 60% when more than one
  session fits; rounding happens through actual lesson durations.
- With a five-minute goal and several courses, primary days occupy three of every
  five calendar days. The other two slots rotate through secondary courses in stable
  registry order. Secondary ordering also rotates for larger budgets. Every available
  selected secondary receives slots over the rotation; opening/reloading the app
  cannot reshuffle a day's order.
- Within a scheduled course, a due review is a five-minute session before new
  lessons. A review backlog does not fill the entire day. Actual review context
  history/version rules remain F10's; uncertain/wrong responses retain due work.
- Completed lesson minutes count toward the shared goal even if that course is
  subsequently removed from the selection. Whole lessons may overrun a remaining
  budget; the UI reports the overrun and never splits or interrupts a lesson.
  Finished review/checkpoint sessions count as five estimated minutes once per
  session ID, persist per identity/UTC date and reduce the remaining shared budget.
  This review-time history remains on the device, like existing review history.
- Unavailable scheduled content is reported. Courses omitted today are labeled and
  remain manually accessible in Courses/Practice. Viewing a different course cannot
  silently insert its lessons into the daily queue.

Examples with five-minute lessons and all five courses available: 5 minutes gives
one rotating session; 10 gives primary + one secondary; 15 gives two primary + one
secondary; 30 gives four primary + two secondary sessions. A seven-minute lesson on
a five-minute single-course plan reports a two-minute overrun. Exhaustive examples
cover all 1–5 course counts and goals over twenty dates, due work, unavailable
content, goal completion and deterministic repeated planning.

## Presentation and authoring

Target text uses course-driven `lang`, `dir` and script styling across teaching,
exercise/review prompts, answer models, builders, placement and the glossary. Arabic
is RTL; French/Khmer are LTR. The fixed lesson frame, single internal scroll area,
free help/retries, reduced-motion behavior and persistent mute choice remain.
Device voices must match the target language. A missing Khmer/French voice disables
the preview and offers the transcript; it cannot fall back to an Arabic voice.
Model recordings remain separate, validated exact-text assets with offline bytes.

Khmer builders use authored `segments`, concatenate without adding spaces and
validate exact reconstruction. Legacy Arabic whitespace behavior remains available.
Noto Sans Khmer is bundled and precached, with its unmodified SIL OFL license.
Source: [Google Fonts' Noto Sans Khmer directory](https://github.com/google/fonts/tree/main/ofl/notosanskhmer),
retrieved October 15. Font SHA-256:
`f37a8431a0c5d5ed2f81a767417546aca576a81fb7eff9c924d46aecf828f2ca`.
Script shaping is preserved; no canonical text normalization or inferred Khmer word
splitting is introduced. Real input/assistive-technology evidence is still required.

Placement is scoped to the viewed course, preserves the old Levantine storage key,
and requires three published source-linked lessons/six contextual questions. It
excludes engineering fixtures. Support preferences and results remain separate per
course/identity. No calibrated proficiency or pronunciation score is inferred.
Glossary senses retain course identity; new-course checkpoint unit IDs are namespaced
without changing existing Arabic checkpoint IDs.

The console supports course-specific draft templates and schema-2 imports, preview,
validation, owner approval, publication, withdrawal and exact-version rollback.
French/Khmer profiles require:

- A `contentReview` record with matching language tag, explicit variety/help
  convention, factual reviewer credit, accepted disposition, cleared rights and
  no unresolved critical issues. `sourceLanguages` maps every supplied source
  locator to that language tag; mismatches are rejected.
- A provenance source of type `linguistic-review` with a recorded disposition.
  Every answer carries a contextual rationale. French can explicitly declare the
  pronunciation-help convention `none`; no artificial phonetics are required.
- Matching recording language, variety, exact transcript, uploaded bytes, source
  permission and review notes. Existing Arabic recording rules remain unchanged.
- Exact Khmer answer segments. Fixtures cannot approve/publish. Arabic-specific
  typed recall cannot be attached to a new language without a reviewed evaluator.

MSA/Quranic publication remains blocked. These checks validate record consistency;
they cannot establish linguistic truth, rights ownership or reviewer qualifications.
The owner still approves exact content. No French/Khmer content was authored,
imported, approved or published by this task. Test data exists only in disposable
test servers and mocked browser responses.

An owner can withdraw the current exact version with a recorded reason. Public
lesson/dashboard/audio feeds then exclude it. Clients remove a cached lesson when
an online request returns 403/404/410; offline copies cannot be remotely revoked
before reconnecting. A previously published superseded version can be restored
through rollback after revalidation, retaining audit history and exact text/version.

## Shared identity and copy

The relationship promise, Ismi/اسمي, Palestinian roots, characters and oval border-free
hero are retained. Languages replaces the Arabic-only discovery section; the old
`#arabic-tracks` anchor remains valid. Khmer gets blue/red accents plus its name and
availability label, separate from answer feedback. Shared welcome, settings,
search/social/PWA descriptions use language-neutral wording. No Khmer teaching
example, future Portuguese course, release date or expert/outcome claim is invented.

[Title options](brand-options.html) compare the current title with a three-script
row and stack. The Khmer block is explicitly a space reservation pending linguistic
review, not a proposed spelling. The owner selected **A — current Ismi/اسمي title pending Khmer review** on October 15.
This completes the title exploration decision; no Khmer form is adopted.

## Verification evidence

The API tests exercise new-language validation failures, isolated approval/publication,
public availability, exact neutral text, immutable course IDs, independent progress,
idempotent completion, withdrawal, rollback and unchanged Arabic payloads.

`i-web/tests/multi-language.spec.ts` exercises mobile/desktop switching, course
filtering, settings independence, exact Khmer building, enlarged text/keyboard,
missing-voice handling, session resume, offline font/text/completion/reconnect and
preservation of legacy database-version-3 Arabic downloads plus guest/other-account
pending completions. Existing suites cover settings conflicts, Arabic teaching,
review, accounts, placement, glossary, layout, sound, navigation and content console.
Test captures use engineering text; they are not curriculum approval or learner
outcome evidence. Final command results and candidate hashes appear below.

## Remaining evidence and release gates

F25.2/F26.2 first units with approved sources, linguistic dispositions and model
audio do not yet exist. F24 cannot claim their complete learning flows. The supported
browser/device matrix and real VoiceOver/TalkBack/input checks need an owner-reviewed
setup. Browser automation is not an observed human pilot or a screen-reader audit.
An observed mixed-language pilot must record content versions, immediate/delayed
retrieval, help, attempts, defects and retests, with a separate participant-contact
action. This task does not resume the owner-deferred F18.1 rehearsal.

Deployment and inclusion in the first-100 beta require separate owner decisions
using that evidence. A build candidate is not a deployed or beta-ready release.


## Candidate and recovery

[Deployment candidate and recovery procedure](deployment-candidate.md) covers the
local archives, API-before-web compatibility gate, hosted preservation and safe
rollback boundaries. [Release manifest template](release-manifest.template.json)
keeps human accessibility/pilot evidence and exact approvals separate from builds.

## Supplemental WebKit result

October 15: `npm run test:e2e --prefix i-web -- --config playwright.multilanguage.config.ts`
finished **10 passed / 6 failed** across desktop/mobile WebKit. Neutral-text mapping,
planned-course states, Khmer keyboard/200% text rendering, missing-voice handling,
schema-2 old-API protection and completed-review-time reload passed. All six failures
occurred at `page.reload()` after `context.setOffline(true)`, with the exact engine
error **“WebKit encountered an internal error.”** Earlier online switching/resume
steps passed. These failures remain recorded; no Safari offline pass is claimed.

The same engine failure was recorded in the [October 3 pilot evidence](../pilot/release-2026-10-03/README.md#verification).
It may be a Playwright limitation; that does not establish real Safari support.
Real iPhone/Safari offline completion/reconnection is still a release gate.
The online fixture transport is injected before app fetch because WebKit's service
worker can bypass Playwright request mocks. Offline app fetches still fail and use
actual IndexedDB; no fixture is published to the real application database.

[Enlarged Khmer WebKit capture](previews/khmer-large-webkit.png) uses synthetic
engineering text and is rendering evidence only. Error contexts are retained in the
local candidate's `webkit-diagnostics` directory, outside Git.

## Final local validation and packaged candidate

October 15 (local time):

- `dotnet test Ismi.slnx --no-restore -v minimal -p:UseSharedCompilation=false -nodeReuse:false`: **39 passed**.
- Production `vue-tsc` / Vite / PWA build: **passed**.
- Broad Chromium regression: **114 passed / 1 failed**. The failure exposed Escape
  after a disabled recall-submit control moved focus to the document body. The
  dialog now handles Escape at document level while open and restores its opener
  after saving evidence.
- Final `npm run test:e2e --prefix i-web -- multi-language.spec.ts zzzz-recall.spec.ts`:
  **18 passed / 0 failed**, including a deliberate focus blur before Escape and
  concurrent-tab persistence. The concurrency check waits for both evidence saves
  before inspecting IndexedDB. All eight mixed-language checks pass, including
  literal pre-schema-2 cached Arabic records.
- Supplemental WebKit: **10 passed / 6 failed**, with the unresolved offline-reload
  engine error described above. No fully passing Safari/offline matrix is claimed.
- `git diff --check`: **passed**.

The final focused run and production output are packaged in the local candidate.
The full Chromium suite was not rerun after the focused fix, so its earlier
114/115 result remains explicit. Automation and synthetic content establish
software behavior, not linguistic quality or human learning/accessibility evidence.

[Deployment candidate details](deployment-candidate.md) record artifact hashes,
compatibility order and recovery. No commit, push, rollout or real curriculum
publication was performed.
