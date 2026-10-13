# Ismi roadmap

Updated October 12, 2026 · **Start here for current feature status.**

This is the single current plan. [AGENTS.md](AGENTS.md) holds product constraints;
[the planning workflow](docs/planning-workflow.md) explains how agents maintain
this file. Older plans provide design context, not current priority or permission.

## At a glance

**F22 — implementation verified October 12; rollout in progress:** typed Arabic/Arabizi
recall, first/help/retry evidence, later reserved situations and owner review reports
are implemented. Build, 32 API tests and eight F22 checks pass. The owner approved
all six exact situations/answer records; three Everyday revisions still await hosted
console publication. Frontend `3af91b0` is pushed/deployed; Practice entry verified.
Reusable alwaysdata credentials are being configured for the
new terminal deployment workflow. [Behavior and evidence](docs/recall-and-recombine.md).

**October 12 scope expansion — F24–F26 planned:** the owner added French, Khmer
and parallel language study to Ismi's roadmap. Arabic remains the flagship.
The full plans below include a shared foundation and separate proposed twelve-week
courses, with child tasks, outcomes and release gates. Implementation is unstarted;
course depth/varieties, scheduling policy, review arrangements and inclusion in the
first-100 beta remain explicit decisions. Existing Arabic commitments are retained.

**October 12 planned additions:** the owner selected research priorities 1, 2, 4,
5 and 6 for future implementation: F22 recall/recombine, F23 mini-stories,
F17.5 phrase anatomy/grammar, F17.6 can-do progress and F17.7 weekly quests/forgiving
habits. [Expanded scopes and completion criteria](docs/learning-engagement-plan.md).
F22 was subsequently authorized and implemented, with rollout in progress. F23 and
F17.5/F17.6 remain Planned. F17.7 is implemented/deployed; the original planning
selection did not itself authorize release.

**F17.7 — Complete and deployed October 12:** optional goal-sized weekly quests and
independent forgiving streaks use the owner-selected Monday/timezone/two-grace-day
policy. Production build and 29 targeted checks pass;
[behavior and verification](docs/weekly-learning-habits.md). Release `5aec0ec` is
pushed/deployed, with live controls, published-path order and persistence verified;
[rollout evidence](docs/releases/2026-10-12-weekly-habits.md).

**F17.4 — Complete and deployed October 12:** source-linked loading word reel with
pause and reduced motion. Build and nine targeted checks pass;
[behavior and preview](docs/loading-word-reel.md). Live loader and readiness transition verified.

**October 12 latest rollout:** F17.7 frontend release `5aec0ec` is pushed and deployed
to Vercel. Live controls, published-path quest ordering, reload persistence and
independent opt-out are verified. Build and 29 distinct targeted checks pass across
focused runs, including 16 checks after the ordering correction;
[weekly-habits rollout](docs/releases/2026-10-12-weekly-habits.md).
API release `662d17c` remains deployed; no backend/data/content changes.
Earlier [word-reel rollout](docs/releases/2026-10-12-word-reel.md) remains verified.
Earlier [copy/oval rollout](docs/releases/2026-10-11-copy-cleanup.md) remains verified.
Earlier [placement rollout](docs/releases/2026-10-11.md) remains verified.

**F15.2 — Complete and deployed October 11:** optional six-question Levantine starting-point
check now works with published lessons, device-scoped results, offline downloads
and support preferences. [Behavior and verification](docs/placement-starting-point.md).
Reading/sound bootcamp content and MSA/Quranic assessments remain open under F15.

**F15.1 — Complete October 4:** personal study settings now drive a daily queue,
with guest persistence, durable account preferences and offline conflict handling.
[Implementation and verification](docs/personal-study-settings.md).
Placement and bootcamp content remain open under F15.

**F12.1 — Draft unit complete October 4:** three source-linked lessons for
“Make a plan together” are validated and imported locally as draft records 24–26.
Owner wording review/publication is next; the twelve-week F12 target stays open.
See [packages and verification](content/levantine/plans-02/README.md).

**F10 — Complete October 7 locally:** owner-approved scheduled review now appears
in Today and Practice, with deterministic offline intervals and version handling.
[Policy and verification](docs/scheduled-review.md). Code release `89a6537` is pushed and deployed to Vercel; live review opening verified.

**F20 — Complete and deployed October 9:** learned-word search/filter in Practice, with
source-linked teaching contexts, synced account inclusion and offline persistence.
[Behavior and verification](docs/learned-word-glossary.md). Live glossary and existing account inclusion verified; [rollout record](docs/releases/2026-10-09.md).

**F17.1 — First slice complete and deployed October 11:** Today prioritizes Continue,
with distinct gold completion/goal markers and factual session recaps. Build and
19 targeted browser checks pass; [behavior and verification](docs/learner-satisfaction.md).
Sound audition and optional recall pacing remain proposals.

**Now:** the learner/offline foundation, learned-word glossary, guided teaching, manual and scheduled review/checkpoints,
characters, and landing/welcome are implemented. F17.7 weekly quests/forgiving habits
are complete and live-verified. Frontend release `5aec0ec` and API release `662d17c` are deployed and verified. The seven owner-approved first-unit revisions are now published as hosted
v2, with current art and verified content/source records. F08 is complete.

**F19 — Azure F0 alternative audition authorized.** Both Chatterbox variants
retained pronunciation errors and remain unaccepted. The owner selected a free-tier
Azure audition on October 3: the same three phrases in Jordanian Sana/Taim voices.
Six exact-text SSML requests are [prepared](tools/azure-speech/README.md); the signed-in
account has no subscription. Owner free-account enrollment and F0 resource
verification are needed before generation. No Azure audio
or quality improvement is claimed yet. F10 scheduled review is complete and deployed.

The owner deferred real-device preflight and the learner rehearsal (F18.1) until after
more implementation. F19 is an interim synthetic-audio slice; F09's real-speaker
recordings and all beta evidence requirements remain open. The existing eight-prompt
batch provides the initial text; [v2 release evidence](docs/pilot/release-2026-10-03/README.md)
remains the published baseline.

**Waiting on:** reusable alwaysdata credentials to finish the F22 API/content rollout;
owner Azure free-account enrollment (signed in, but no subscription),
verified F0 access and then owner listening review. No paid services authorized.
Real recordings, live speech-provider choices, Quran permissions
and beta evidence remain separate dependencies.
For the new language plans, course-definition decisions precede authoring; exact
sources, permissions and linguistic/audio review are needed before publication.

| ID | Feature / bounded scope | Status | Next action or limit |
| --- | --- | --- | --- |
| [F19](#f19-chatterbox-phrase-audio) | Chatterbox phrase audio | Active · Azure audition | Six requests prepared; activate free account, then verify F0 |
| [F01](#f01-core-study-and-offline-progress) | Core study and offline progress | Done | Broader browser/accessibility checks belong to F18 |
| [F02](#f02-guest-and-account-baseline) | Guest and account baseline | Done | Recovery/deletion belong to F16 |
| [F03](#f03-levantine-curriculum-console) | Levantine curriculum console | Done | Broader content operations remain in F13/F14/F18 |
| [F04](#f04-first-unit-guided-teaching-packages) | First-unit guided teaching packages | Done | Authored packages; publication belongs to F08 |
| [F05](#f05-manual-review-and-checkpoints) | Manual review and checkpoints | Done | Scheduling belongs to F10; history stays on device |
| [F06](#f06-recurring-character-support) | Recurring character support | Done | v1 approved under F08; proposed redesign belongs to F06.1 |
| [F06.1](#f061-character-art-redesign) | Character art redesign | Needs decision · method rejected | Select illustrator, licensed art or reference-led image generation |
| [F07](#f07-landing-page-and-app-welcome) | Landing page and app welcome | Done | Deployed; invitation gate belongs to F18 |
| [F08](#f08-first-unit-revision-release) | First-unit revision release | Done | All seven hosted v2 lessons and 52 source records verified |
| [F09](#f09-reviewed-levantine-recordings) | Reviewed Levantine recordings | Needs input | Actual recordings, permissions and review |
| [F09.1](#f091-first-recording-batch-preparation) | First recording batch preparation | Done | Eight exact prompts prepared; no real recordings yet |
| [F10](#f10-scheduled-review) | Scheduled review | Done · deployed | Approved 1/3/7/14-day policy; history stays on device |
| [F11](#f11-guided-speaking) | Guided speaking | Needs decision | Choose a first scenario and provider/privacy setup |
| [F12](#f12-levantine-course-expansion) | Levantine course expansion | Active · drafts ready | Review F12.1; remaining twelve-week curriculum stays open |
| [F12.1](#f121-make-a-plan-together) | Make a plan together | Done · local drafts | Three lessons validated/imported; owner review/publication pending |
| [F12.2](#f122-transliteration-and-pronunciation-audit) | Transliteration and pronunciation audit | Active · correction drafts validated | Review exact lessons 3/5/7 candidates; speaker/model evidence remains |
| [F13](#f13-msa-course) | MSA course | Planned | Define first unit and extend publication support |
| [F14](#f14-quranic-course) | Quranic course | Needs input | Approved source IDs/rights and integrity controls |
| [F15](#f15-personal-study-plan-and-placement) | Personal study plan and placement | Active · Levantine starting check done | Scope reviewed bootcamp content and remaining track assessments |
| [F15.2](#f152-placement-starting-point) | Placement starting point | Done · deployed | Published-content Levantine check; bootcamps/other tracks remain open |
| [F15.1](#f151-personal-study-settings) | Personal study settings | Done · pushed | Goals/tracks drive queue; guest/account offline persistence verified |
| [F16](#f16-account-recovery-and-deletion) | Account recovery and deletion | Needs decision | Set delivery, hosting and retention requirements |
| [F17](#f17-learning-support-and-gamification) | Learning support and gamification | Planned | F17.7 deployed; F17.5/F17.6, reminders and XP remain open |
| [F17.1](#f171-learner-satisfaction) | Learner satisfaction | Done · deployed first slice | Today/color/completion verified; sound audition and optional timer remain proposals |
| [F17.2](#f172-dashboard-loading-feedback) | Dashboard loading feedback | Done · deployed | Startup/refresh, cached offline and retry verified; hero edge removed |
| [F17.3](#f173-interface-copy-cleanup) | Interface copy cleanup | Done · deployed | Redundant subtitles/quips removed; build and 31 targeted checks pass |
| [F17.4](#f174-loading-word-reel) | Loading word reel | Done · deployed | Six exact glossary samples; pause/reduced motion verified |
| [F17.5](#f175-phrase-anatomy-and-grammar-reference) | Phrase anatomy and grammar reference | Planned | Map six phrases to two patterns and three sourced usage notes |
| [F17.6](#f176-can-do-progress-and-outcome-achievements) | Can-do progress and outcome achievements | Planned | Define one unit's evidence rules using F22 independent attempts |
| [F17.7](#f177-weekly-learning-quests-and-forgiving-habits) | Weekly learning quests and forgiving habits | Done · deployed | Controls/path/persistence live-verified; real AT release checks remain |
| [F18](#f18-invite-only-beta-readiness) | Invite-only beta readiness | Needs input | Rehearsal deferred; full beta gates remain open |
| [F18.1](#f181-first-unit-observed-rehearsal) | First-unit observed rehearsal | On hold | Owner deferred testing until after more implementation |
| [F20](#f20-learned-word-glossary) | Learned-word glossary | Done · deployed | Live existing-account glossary verified; offline/search checks pass |
| [F21](#f21-cultural-watch-and-listen-recommendations) | Cultural watch/listen recommendations | Planned | Scope a weekly curated pick; daily cadence remains a choice |
| [F22](#f22-recall-and-recombine) | Recall and recombine | Active · verified; rollout pending | Exact package owner-approved; deploy API, publish three revisions and verify hosted practice |
| [F23](#f23-recurring-mini-stories) | Recurring mini-stories | Planned | Start F23.1, then scope a linked three-episode text arc |
| [F23.1](#f231-first-text-episode) | First text episode | Planned | One reviewed episode, two comprehension checks and a response |
| [F24](#f24-multi-language-foundation-and-parallel-study) | Multi-language foundation and parallel study | Planned | Define compatible language/course records; agree queue policy |
| [F25](#f25-french-course) | French course | Planned · definition decisions | Proposed twelve-week course; select variety, depth and review route |
| [F26](#f26-khmer-course) | Khmer course | Planned · definition decisions | Proposed twelve-week course; select variety, script/help and review route |

**Status key:** Planned = unstarted; Active = authorized work in progress;
Needs decision = a named choice prevents the next step; Needs input = external
assets, approval or evidence are missing; Done = the stated scope is implemented
and has completion evidence. Use On hold for an explicit owner deferral and
Cancelled for explicitly removed scope (retain its ID and reason). IDs identify
features, not priority; recommendations can change without renumbering.
F19 now proceeds with the owner-authorized Azure F0 audition; remaining rows retain ID order, not execution order.
Priority is not a schedule or blanket publication/deployment authorization.

## Delivery and evidence

- **Implementation:** Done rows describe the bounded scopes in this checkout.
  Frontend release `5aec0ec` is deployed and live-verified October 12;
  [weekly-habits rollout evidence](docs/releases/2026-10-12-weekly-habits.md).
  Earlier [word-reel rollout evidence](docs/releases/2026-10-12-word-reel.md) remains applicable.
  Earlier [copy/oval rollout evidence](docs/releases/2026-10-11-copy-cleanup.md) remains applicable.
  Earlier [loading/hero rollout evidence](docs/releases/2026-10-11-loading.md) remains applicable.
  Earlier [satisfaction rollout evidence](docs/releases/2026-10-11-satisfaction.md) remains applicable.
  Earlier [placement rollout evidence](docs/releases/2026-10-11.md) remains applicable.
  API release `662d17c` remains deployed and verified October 9;
  [API rollout evidence](docs/releases/2026-10-09.md).
  F10 frontend release `89a6537` is pushed and verified deployed; see the
  [October 7 release record](docs/releases/2026-10-07.md).
  Code release `5fead73` is committed and pushed; the API is verified deployed.
  [October 4 rollout record](docs/releases/2026-10-04.md) records the frontend verification limit.
- **Curriculum:** October 3 hosted release published all seven Everyday revisions as
  v2 through normal console gates. All seven public payloads and 52 source records
  match the approved packages; prior v1 records remain superseded for restoration.
  Local state differs: lesson 1 v4 was already published and lessons 2–7 remain drafts.
  [Release, audit and preservation evidence](docs/pilot/release-2026-10-03/README.md).
- **Hosting:** Vercel plus alwaysdata development preview. October 9 rollout
  preserved all application table/recording/key hashes and passed health/dashboard
  and live glossary checks. The October 4 API rollout
  preserved existing data and thirteen publications: seven Everyday v2 lessons and
  six fixtures. October 4 frontend deployment is confirmed Ready by October 9 Vercel history inspection;
  the current October 9 frontend is also Ready and live-verified.
- **Verification basis:** October 4 preflight passed the production frontend build,
  27 API tests, all 44 standard browser tests and Release API publish. These are
  local checks; real screen-reader, learner-outcome and supported-browser evidence
  remains open. No fresh hosted inspection is claimed by the October 7 planning update.

## Completed scopes

### F01 Core study and offline progress

**Scope delivered:** Today/Courses/Practice/Account, structured evaluation,
explanations/free retries, fixed lesson frame, optional help, reduced motion and
local muted sound controls. Complete lesson/audio downloads, offline reload and
completion, and idempotent queued reconnection preserve progress.

**Evidence:** [client](i-web/src/App.vue), [offline storage](i-web/src/offline.ts),
[course-loop checks](i-web/tests/course-loop.spec.ts), [layout checks](i-web/tests/lesson-layout.spec.ts).
Prior results are in the [implementation history](docs/next-stage-handoff.md).
This does not establish full accessibility/browser support or spontaneous speaking.

### F02 Guest and account baseline

**Scope delivered:** guest entry; registration/login/logout; HttpOnly cookie
sessions; durable SQLite account progression, with guest isolation.

**Evidence:** [API](i-api/Program.cs), [account progression](i-api/Services/AccountProgressService.cs),
[account tests](i-tests/AccountApiTests.cs), [runtime instructions](README.md#run-locally).
Recovery, confirmation, deletion and external identity are outside this baseline.

### F03 Levantine curriculum console

**Scope delivered:** owner-gated drafts, source records, deterministic validation,
approval, publication, rollback and audit history; public endpoints serve published
versions. Source-bearing WAV upload and verified offline playback are supported.

**Evidence:** [console](i-web/src/CurriculumConsole.vue),
[publishing service](i-api/Services/CurriculumPublishingService.cs),
[curriculum tests](i-tests/CurriculumApiTests.cs), [recording checks](i-web/tests/recordings.spec.ts).
MSA/Quranic publication is intentionally blocked; no real audio ships.

### F04 First-unit guided teaching packages

**Scope delivered:** seven source-linked Everyday conversations packages with
43 explicit phrase cards, context-based recall before reveal, concise explanations
and contextual practice. Historical packages and publication snapshots are preserved.

**Evidence:** [packages and manifest](content/levantine/everyday-01/revisions/guided-teaching/README.md),
[teaching checks](i-web/tests/lesson-teaching.spec.ts),
[seven-lesson checks](i-web/tests/zz-everyday-lessons.spec.ts).
Done means authored/validated, not approved, published, timed with learners or expert-reviewed.

### F05 Manual review and checkpoints

**Scope delivered:** mixed published-context review, mistake explanations, free
retries and completed-unit checkpoints with recall before reveal and help/first-answer
reporting. Versioned guest/account-scoped history works offline on the current device.
It neither awards duplicate completions nor claims mastery.

**Evidence:** [behavior and recorded verification](docs/review-and-checkpoints.md),
[queue](i-web/src/review.ts), [review checks](i-web/tests/review.spec.ts).
Scheduled intervals and cross-device review-history sync were not implemented.

### F06 Recurring character support

**Scope delivered:** Fattoush/Knafeh portraits, explicit authored participant roles,
shared lesson/review rendering, console mapping inspection, offline assets and
fallbacks. Compatibility handles older names without rewriting stored publications.

**Evidence:** [character guide](docs/characters/character-guide.md),
[metadata packages](content/levantine/everyday-01/revisions/characters/README.md),
[character checks](i-web/tests/zx-characters.spec.ts), [rename tests](i-tests/CharacterRenameTests.cs).
Narrative expansion and final art/package approval are outside this implementation scope.

### F06.1 Character art redesign

**Status:** Needs decision — owner scrapped the programmatically drawn SVG method
October 8 after rejecting both studies. The redesign goal remains open.
**Current scope:** create an editable vector concept/model sheet and a portrait-size
preview for owner review before replacement assets are integrated.
**Outcome:** distinctive Fattoush/Knafeh designs with consistent, intentionally drawn
expressions; F06's working portrait system remains complete.
**Current result:** studies 01 and 02 are rejected historical comparisons; neither
is a candidate for integration. No further SVG-path character generation is planned.
**Next decision:** select a different art route. Recommend a character illustrator,
chosen from actual finished portfolio work, with a bounded two-character concept
commission before expression/turnaround production. Alternatives: licensed cohesive
illustration assets, or image-generation concepts guided by approved visual references.
No commission, contact, spending or production replacement authorized.
**Done when:** owner approves the designs; editable sources, authorship/rights and hashes
are recorded; neutral/attentive/encouraging/profile views remain consistent and legible;
mobile/desktop, fallback and offline rendering pass with unchanged written roles.
**Evidence:** [assessment and proposed workflow](docs/characters/redesign-direction-2026-10-08.md),
[revised concept, editable source and verification](docs/characters/vector-concept-02/README.md).
Local Chromium desktop/mobile renders inspected; all images load, no horizontal
overflow, portrait sizing checked. App-level fallback/offline verification remains open.
**Delivery:** review assets committed/pushed as historical documentation in `662d17c`;
no app artwork replacement or content publication. Preserve v1 assets and version
future art separately.

### F07 Landing page and app welcome

**October 11 owner refinement:** Done and deployed — border-free oval hero with both
faces visible. Build and four responsive landing/welcome checks pass; mobile/desktop
renders inspected. [Preview and evidence](docs/landing/README.md#current-owner-revision).
Deployed in `eada137`; [rollout evidence](docs/releases/2026-10-11-copy-cleanup.md).

**Scope delivered:** mobile/desktop landing page with preserved owner copy and
border-free hero; entry into the real app; once-per-browser skippable three-card
welcome; explicit return links; stable portrait sizing and reload/section navigation.
The isolated sample is retired. No invitation form or enforced beta gate exists.

**Evidence:** [current behavior and prior checks](docs/landing/README.md),
[entry shell](i-web/src/AppShell.vue), [welcome](i-web/src/AppWelcome.vue),
[landing checks](i-web/tests/landing.spec.ts), [navigation checks](i-web/tests/navigation.spec.ts).
The implementation notes record a production build, 24 backend tests and 36 distinct
browser checks across full/focused runs; later owner refinements have targeted coverage.
The October 2 code release is deployed; live landing, welcome, dashboard and lesson
loading passed. See the [rollout record](docs/releases/2026-10-02.md).
**October 11 reconciliation:** owner requested removal of the hero image border.
Current source/asset and live rendered image already have no border or outline;
superseded instructions and documentation were corrected. No app code change or
rollout required. [Inspection evidence](docs/landing/README.md#current-owner-revision).

## Remaining work

Before implementing a broad item below, narrow it to a concrete deliverable with
observable acceptance checks. Add child IDs such as F12.1 when useful; retain the
parent's full scope. An authorized child finishing does not complete its parent.

### F08 First-unit revision release

**Status:** Done — October 3, 2026. The owner approved the exact seven-package release
and existing `ismi-cast-v1` art. All seven were imported, validated, approved and
published through the hosted console, then verified on the public API.
**Outcome delivered:** learners receive the approved guided/character revisions,
including the casual check-in and the two instruction/role corrections.
**Evidence:** [exact packages and hashes](content/levantine/everyday-01/revisions/pilot-release/review-manifest.json),
[published IDs/versions and comparison](docs/pilot/release-2026-10-03/hosted-publication.json),
[console audit evidence](docs/pilot/release-2026-10-03/hosted-audit.json).
All seven serve `curriculum-levantine-everyday-01-0N-v2` (N = 1–7);
7/7 public payloads and 52/52 source records match the approved packages.
**Delivery:** live on the alwaysdata API through the Vercel development preview;
existing code release `26f8242` unchanged. Prior v1 records remain superseded with
console restoration available. No fresh full hosted database backup obtained.
Local draft state is separate; documentation/tests were committed and pushed in `5fead73`.
**Next:** F19 synthetic phrase audio. F18.1 is owner-deferred; F09 real recordings remain separate.
Publication does not establish native-expert review or beta readiness.

### F09 Reviewed Levantine recordings

**Outcome:** core prompts use permitted, human-reviewed real speaker audio.
**Next:** obtain actual supplied recordings with permissions; choose an explicit
lesson/prompt batch before upload. Text-based development can continue meanwhile.
Pin that batch to the F08-approved wording and prompt IDs; the existing recording
preparation now links the F09.1 candidate batch and labels v1 scripts historical.
Final wording approval was received October 3; real assets/permissions/review are
still missing.
**Done when:** the selected batch has accurate transcripts, speaker/dialect labels,
source permission and review evidence; authorized publication and verified offline playback.
**Depends on:** assets and human review; [recording preparation](docs/pilot/recordings.md).
F19 is the prioritized interim synthetic-audio task and cannot complete this human-audio scope.
Silence fixtures and device voice previews cannot complete this item. Partial batches
must report coverage; the beta needs full core-audio coverage checked under F18.

### F09.1 First recording batch preparation

**Status:** Done — October 3. **Scope:** eight lesson-1 prompt transcripts, exact
step IDs, candidate hash, role/address context, suggested filenames, WAV requirements
and blank permission/review fields. [Batch and handoff](docs/pilot/release-2026-10-03/recording-batch-01.md)
and [machine-readable checklist](docs/pilot/release-2026-10-03/recording-batch-01.json).
**Evidence:** 8/8 transcripts/IDs match the candidate; planned coverage is 8/56
unit practice prompts, actual reviewed coverage 0/56. No assets, contacts, rights,
compensation or human review are supplied by preparation. F09 remains open.
**Next:** wording approved October 3; owner-selected speakers/reviewer supply
the permitted clips; a package change requires reconciling the batch hash first.

### F10 Scheduled review

**Status:** Done — October 7, 2026; implemented, pushed and deployed.
**Scope delivered:** due review in Today (selected tracks) and Practice, using
published contexts and existing device-local guest/account history. Up to six
unique exchanges per session; recall before optional help; manual practice and
retries remain freely available. Review adds no duplicate completion or mastery claim.
**Approved policy:** the owner selected 1, 3, 7 and 14 elapsed days. A correct first
answer without translations/choices advances at the due instant; mistake/help
resets to one day. Early successful practice and retries do not advance intervals.
Changed versions restart scheduling; legacy records begin with a one-day interval.
**Evidence:** [policy, implementation and verification](docs/scheduled-review.md),
[scheduler](i-web/src/reviewSchedule.ts), [browser checks](i-web/tests/scheduled-review.spec.ts).
Production frontend build, 27 API tests and all 49 standard browser tests pass;
11 final focused checks pass after the date-label/context selection refinement.
Offline reload, due boundaries, help/mistakes, duplicate contexts, version changes,
withdrawals and identity isolation are covered.
**Delivery:** code release `89a6537` pushed to `main`; Vercel reports Ready
and the stable URL serves the new UI. Live published-lesson loading and scheduled
review opening passed. [Release evidence](docs/releases/2026-10-07.md).
The API and published curriculum are unchanged.
**Limits / next:** review history remains on this device, with no notification
service or cross-device synchronization. Real-device/accessibility
release evidence remains F18.

### F11 Guided speaking

**Outcome:** a controlled scripted conversation provides useful online feedback.
**Next decision:** choose a first scenario and speech/AI provider configuration with
no training on learner data, minimal disclosure and supported deletion.
**Done when:** authorized branches assess appropriate meaning/intelligibility,
feedback works, raw recordings are promptly deleted, and text/accessibility alternatives
and provider failure paths are verified. Baseline practice stays free.

### F12 Levantine course expansion

**Outcome:** twelve weeks of substantive urban Palestinian content, with useful
Jordanian variants labeled. **Status:** Active; F12.1 authoring/integration is complete.
**Next:** owner review of the three F12.1 drafts, followed by separately authorized
publication and the next bounded content scope. A three-lesson transfer unit is not
evidence of twelve weeks of curriculum or measured learning outcomes.
**Done when:** the full target is source-linked, validated, owner-approved/published,
downloadable and backed by observed timing/recall evidence. Fixtures do not count
as curriculum depth; guided choices do not prove the thirty-day speaking outcome.

### F12.1 Make a plan together

**Status:** Done — October 4, 2026, for draft authoring and local integration.
**Scope delivered:** three follow-on lessons, course positions 8–10, using established
first-unit language in new planning/clarification contexts. Eighteen dialogue turns,
fifteen teaching cards and eighteen contextual practice steps have transliteration,
optional help, explicit roles, explanations, retry hints and source records.
**Outcome targeted:** propose a shared activity, ask for missing time, and correct/
confirm day, time and activity in a guided exchange. This is not observed learner evidence.
**Completion evidence:** [packages, readable reviews and checks](content/levantine/plans-02/README.md),
[exact hashes and phrase origins](content/levantine/plans-02/review-manifest.json),
[local import verification](content/levantine/plans-02/local-import.json).
Twenty-five API tests pass; the focused mobile Chromium walkthrough, combined
first-unit/new-unit browser run (2 tests) and production frontend build pass. Validation, draft privacy, publication gate, course ordering,
offline completion and reconnect persistence are covered. Real-device/accessibility,
reviewed audio, owner wording review and measured lesson timing remain open.
**Delivery:** local records 24–26 are unapproved draft v1 and match the authored
packages. Files/tests were committed and pushed in `5fead73`; drafts were not
uploaded or published by the code rollout.
**Next:** owner previews and reviews the three drafts; publication is a separate
content decision. F12's twelve-week scope and beta gates remain incomplete.

### F12.2 Transliteration and pronunciation audit

**Status:** Active — correction candidates validated October 9 after owner
authorization. Owner wording review and actual pronunciation evidence remain open.
**Scope:** inspect unique Arabic/transliteration pairs across the seven current F08
packages, three F12.1 drafts and seed fixtures; separate dialect usage, transcription
conventions, text mismatches and actual pronunciation evidence.
**Findings:** 611 paired objects / 214 unique pairs across ten packages, plus 16
seed prompt/answer pairs inventoried and text-screened. Palestinian references support
`مناح / mnāḥ` as the preferred plural; `law` represents /aw/, with pronunciation help
needed for English readers. Other vowel/model checks require speaker evidence.
**Current result October 9:** three exact candidates for lessons 3/5/7 correct all
eight plural pairs and add pronunciation help while retaining law and listener
endings. Source records, explanations, contextual grading and explicit glossary
senses are matched; candidate/predecessor hashes and readable field reviews are saved.
29 API tests pass, including draft validation/import/privacy and history preservation
in a disposable database. No native/speaker pronunciation approval is claimed.
**Next:** owner reviews the exact candidates; obtain identified urban Palestinian
speaker/model dispositions for outstanding pronunciation flags. Reconcile existing
local drafts before default-database integration; publication remains a separate gate.
**Done when:** inventory coverage is recorded; each flagged form has a source-backed
disposition; justified corrections are draft-validated and reviewed; unresolved
speaker/audio questions are explicit. Text checks alone do not verify pronunciation.
**Depends on:** approved-source constraints and reviewed Palestinian pronunciation
for audio claims. Revised package approval/publication and recording-script/hash
reconciliation are separate gates; preserve published release snapshots.
**Evidence:** [audit findings](docs/research/levantine-transliteration-audit-2026-10-08.md),
[correction candidates, reviews and verification](content/levantine/everyday-01/revisions/transliteration-audit/README.md).
**Delivery:** candidate files/tests committed and pushed in `662d17c`; compatible
web/API code deployed October 9. Local drafts 20/22/17 preserved; hosted curriculum
and all persistent-data hashes preserved. No correction import/approval/publication.

### F13 MSA course

**Outcome:** four weeks of MSA with script/help support and timeless adapted listening.
**Next:** agree the first unit, source/audio permissions and a console extension scope.
**Done when:** source-linked course/audio packages pass appropriate validation and
publication gates, support offline accessible study and have comprehension evidence.
The current three-track dashboard is not evidence that an MSA course exists.

### F14 Quranic course

**Outcome:** four weeks of comprehension-first Quranic study within adopted source boundaries.
**Next input:** exact approved resource IDs and written permissions; exclude uncertain
interpretation. See [source research](docs/research/quran-api-research.md).
**Done when:** unchanged canonical text and separate provenance-bearing translations,
morphology/audio are integrity-checked; console review/publication controls exist;
approved lessons and offline/accessibility checks cover the intended direct-meaning outcomes.
Never generate or silently normalize canonical text, or invent qualified reviewer approval.

### F15 Personal study plan and placement

**October 12 expansion:** the owner authorized roadmap plans for French/Khmer and
parallel language study. F24 extends F15.1's multi-track foundation; F25/F26 define
the new courses. [Inspection evidence](docs/multi-language-feasibility.md).
F15's remaining Arabic placement/bootcamp scope stays open. No new implementation
or beta inclusion is inferred from the planning authorization.

**Outcome:** selectable tracks/primary track, 5/10/15/30-minute goals, separate progress,
and short skippable track-specific placement with bootcamp recommendations.
**Status:** Active — F15.1 settings/queue and F15.2 bounded Levantine starting check
are complete. Reading/sound support preferences are self-reported; modules remain open.
**Next:** scope source-linked reading/sound bootcamp content and the remaining
track-specific assessments. F15.2 is not a calibrated proficiency assessment or
evidence of pronunciation/decoding ability; it does not complete F15.
**Done when:** selected goals/tracks drive the queue and persist as agreed; per-track
placement and applicable reading/sound modules work without a combined Arabic score.

### F15.1 Personal study settings

**Status:** Done — October 4, 2026.
**Scope delivered:** guest-accessible Account controls for 5/10/15/30-minute goals,
selected tracks and a primary track. Guest preferences persist on device; account
preferences persist in SQLite with revision-checked offline synchronization and
explicit conflict resolution. Settings/dashboard caches are identity-scoped.
Today derives a deterministic queue of whole published lessons from the selections;
unavailable tracks remain labeled and do not receive substitute lessons.
**Allocation:** initial recommended assumption is 60% primary, rounded up, with the
remainder split equally in stable track order; no separate owner policy confirmation
is claimed. One selected track receives the entire goal. Goals never block study.
**Evidence:** [behavior, persistence and verification](docs/personal-study-settings.md),
[settings controls](i-web/src/StudySettings.vue), [planner](i-web/src/studyPlan.ts),
[account service](i-api/Services/StudySettingsService.cs),
[browser checks](i-web/tests/study-settings.spec.ts). Twenty-seven API tests,
ten focused browser checks and the production frontend build passed.
**Delivery:** committed/pushed in `5fead73`; API deployed and verified October 4.
Frontend deployment triggered; final hosted browser verification remains open.
**Next:** F15 placement/bootcamp work remains open; F10 scheduled review is complete and deployed.
Real-device assistive-technology evidence remains part of F18.

### F15.2 Placement starting point

**Status:** Done — bounded implementation and frontend deployment October 11, 2026.
**Scope delivered:** optional six-question Levantine check from the first three
published, source-linked, non-demonstrative lessons, with original dialogue context,
optional help and existing reviewed answer rationales/explanations. Skip and retry
remain available. Results and skipped state persist separately for guests/accounts
on this device, retaining first answers, help, source locators and lesson versions.
**Recommendation:** earliest sampled lesson needing practice/help; last sampled
lesson when all six fit without help. This conservative implementation default is
not a calibrated proficiency scale. No completions, mastery, XP, course locks or
queue changes. Reading/sound self-reports identify support preferences; reviewed
bootcamp modules and MSA/Quranic checks remain unavailable.
**Evidence:** [behavior, policy and checks](docs/placement-starting-point.md),
[component](i-web/src/PlacementCheck.vue), [selection/policy](i-web/src/placement.ts),
[browser checks](i-web/tests/placement.spec.ts). Production build, all 29 API tests,
four final placement checks and eight existing study-settings/navigation checks pass.
Offline reload/retry, help/wrong-answer recommendations, skip persistence, identity
isolation, withdrawn-content handling, keyboard and 320px layout covered. Mobile
question/result renders inspected; real AT and learner calibration remain open.
**Next:** F15 reviewed bootcamp content and other-track assessments; account results
remain device-local with no cross-device placement sync.
**Delivery:** code committed/pushed in `267f98e`; Vercel Ready with the stable alias
and live published-v2 placement loading verified October 11. API stays at `662d17c`.
No curriculum publication or database migration.
[Rollout record](docs/releases/2026-10-11.md).

### F16 Account recovery and deletion

**Outcome:** confirmation/recovery and account/data deletion are usable for the beta.
**Next decision:** email delivery, target hosting and precise deletion/retention requirements.
**Done when:** agreed recovery/confirmation/deletion flows work end to end, including
relevant progress/provider data and failure paths, with verified privacy behavior.
External identity remains optional unresolved work, not a condition of F02 completion.

### F17 Learning support and gamification

**Outcome:** searchable grammar references, meaningful mastery/achievements/XP,
optional forgiving streaks and opt-in reminders with categories/quiet hours.
**Next:** F17.7 weekly quests/forgiving habits are complete and deployed. Remaining selected
scopes are F17.5 phrase anatomy/grammar and F17.6 evidence-based can-do progress/achievements.
Define their consequential rules before dependent implementation; reminder delivery and the
XP economy still need separate bounded tasks. Existing in-lesson explanations are
delivered under F01/F04; selected children do not complete the full F17 scope.
**Done when:** agreed subfeatures are usable and verified, reward learning without
trivial farming, preserve free explanations/retries and honor opt-out/quiet hours.
No hearts, leagues, guilt or paid streak repair. Billing is outside the beta.

### F17.1 Learner satisfaction

**Status:** Done — bounded Today/color/completion slice implemented October 11.
Owner authorized F17.1 implementation; the recommended first slice is delivered.
**Scope delivered:** Continue leads Today; compact daily progress/review and an
Up next list avoid repeating the primary lesson. Track allocations remain in an
accessible disclosure. Distinct gold marks completion and daily goals. Lesson
recaps show actual first-attempt results, help use and practiced responses, with
existing encouraging portraits and one completion chime. No mastery or spoken
recall score is inferred; previews/practice do not award daily milestones.
**Verification:** production build and 19 distinct targeted Chromium checks pass
across focused runs, covering mobile/desktop, keyboard/doubled text, reduced motion,
offline completion/reconnection, mute, single completion chime, recording playback,
fixed lesson layout and character fallbacks. Real assistive-technology/browser
release gates remain under F18.
**Next:** gather owner feedback on the deployed first slice. New sound timbres need an audition;
optional Quick recall and its durations remain separate proposals. F17's broader
mastery and reminder scope remains open; device-local habits are delivered under F17.7.
**Evidence:** [implementation and verification](docs/learner-satisfaction.md),
[original UI findings and proposal](docs/learner-satisfaction-proposal.md).
**Delivery:** code release `0852fec` pushed/deployed October 11; live Today verified.
[Rollout evidence](docs/releases/2026-10-11-satisfaction.md). API and curriculum unchanged.

### F17.2 Dashboard loading feedback

**Status:** Done — implemented and deployed October 11.
**Scope delivered:** visible startup and refresh feedback; no misleading
empty/guest/offline dashboard during startup; navigation remains available;
cached offline plans and uncached failure/retry settle correctly. Reduced motion
preserves status text without spinner movement. The landing hero's rounded picture
edge was removed at that rollout, with zero border/radius and no outline/shadow; artwork
and landing wording are preserved. A later F07 owner refinement changes the image
to a border-free oval, deployed in `eada137`.
**Evidence:** [behavior and verification](docs/dashboard-loading.md), production
build and 20 distinct targeted Chromium checks pass across focused runs.
**Next:** owner feedback; F18 real assistive-technology/browser gates remain open.
**Delivery:** code release `138a186` pushed/deployed October 11;
[live verification](docs/releases/2026-10-11-loading.md). API/curriculum unchanged.

### F17.3 Interface copy cleanup

**Status:** Done — implemented and deployed October 11.
**Scope delivered:** removed decorative teaching/welcome/completion quips,
repeated loading explanations, builder/checkpoint subtitles and duplicate
review/settings status. Useful instructions, answer feedback, provenance,
privacy and offline/error notices remain. Landing wording is preserved and
the oval hero is deployed.
**Evidence:** [exact removals and verification](docs/interface-copy-cleanup.md).
Production build and 31 targeted Chromium checks pass; loading, teaching and
completion screenshots inspected. F18 real AT/browser gates remain open.
**Next:** owner feedback on the deployed copy cleanup.
**Delivery:** code release `eada137` pushed/deployed October 11;
[live verification](docs/releases/2026-10-11-copy-cleanup.md). API/curriculum unchanged.

### F17.4 Loading word reel

**Status:** Done — implemented and deployed October 12.
**Scope delivered:** green/gold slot-style loader cycles six source-linked
Levantine words through transliteration → Arabic → meaning. Includes keyboard
pause/resume, hidden-document pause, a still reduced-motion triplet, separate
screen-reader loading status and a fixed-height reel. Startup and compact refresh
remain truthful and never delay ready content.
**Evidence:** [behavior, source records and verification](docs/loading-word-reel.md),
production build and nine distinct targeted Chromium checks pass across runs.
Mobile/enlarged text and real-time Arabic rendering inspected. F18 gates remain open.
**Next:** owner feedback on the deployed animation.
**Delivery:** code release `7bb2c22` pushed/deployed October 12;
[live rollout evidence](docs/releases/2026-10-12-word-reel.md). API/curriculum unchanged.

### F17.5 Phrase anatomy and grammar reference

**Status:** Planned — owner selected research priority 4 on October 12, 2026.
**Outcome:** optional phrase explanations connect natural/literal meaning, labeled
chunk functions, specific culture/register guidance and searchable grammar references.
Extend F04's existing chunks/notes and F20 context links rather than duplicate them.
**First scope:** six approved Levantine phrases, two reusable grammar patterns and
three source-linked situational usage notes; teaching/feedback/reference navigation
and offline access. Optional colors always have equivalent text labels.
**Next:** map the selected unit's phrases to source-backed patterns and usage notes;
prepare the required versioned console metadata and readable owner review.
**Done when:** all selected records are validated, approved/published and linked from
their teaching contexts; reference search/back navigation and downloaded access work;
literal glosses and usage claims are reviewed; keyboard, screen-reader, enlarged
Arabic and RTL/LTR rendering work without relying on color. Record local/hosted
verification separately; no expert-review claim without actual evidence.
**Depends on:** F03/F04/F20, approved sources/content and publication approval.
**Evidence:** [expanded behavior and checks](docs/learning-engagement-plan.md#f175-phrase-anatomy-and-grammar-reference);
existing baseline [teaching](i-web/src/LessonTeaching.vue) and [glossary](docs/learned-word-glossary.md).
**Delivery:** planning only; no new references, content publication or app release.

### F17.6 Can-do progress and outcome achievements

**Status:** Planned — owner selected research priority 5 on October 12, 2026.
**Outcome:** learners see concrete unit outcomes, supporting attempts/help/dates,
recommended next practice and an optional achievement grounded in demonstrated learning.
Keep skills/tracks separate; completion, XP and typed work never imply spoken fluency.
**First scope:** three can-do targets for the F22 unit, device-local versioned evidence
and one outcome achievement. Proposed states distinguish assisted practice,
independent success and successful later demonstration; due review is a separate action.
**Next decision:** agree evidence thresholds, delay/help rules and achievement wording.
Recommend independent success in two distinct contexts, including a later due-review
day; this is a proposal, not an adopted mastery/proficiency scale.
**Done when:** agreed rules and supporting evidence are visible and verified;
help/retries/uncertain answers cannot create independent evidence; delayed/new-context
checks, offline identity separation and changed/withdrawn versions work; legacy
completions are not upgraded to mastery; history remains honest about skill and device
scope. Learner calibration and thirty-day outcome evidence remain F18 work.
**Depends on:** F22 independent attempts and target metadata, F05/F10/F17.1;
explicit assessment rules. Cross-device evidence sync is a separate scope.
**Evidence:** [expanded behavior, proposed rules and checks](docs/learning-engagement-plan.md#f176-can-do-progress-and-outcome-achievements);
existing [checkpoint limits](docs/review-and-checkpoints.md) and [recaps](docs/learner-satisfaction.md).
**Delivery:** planning only; no can-do classifier, new mastery claims or rewards shipped.

### F17.7 Weekly learning quests and forgiving habits

**Status:** Done — owner-authorized device-local slice implemented October 12, 2026.
**Outcome:** optional weekly activities mix new learning, due review and available
story/transfer practice within the existing daily allocation; separately optional
streaks support returning without guilt or restrictions.
**Scope delivered:** independent opt-in weekly checklist and forgiving streak controls
in Account/Today, up to 1/2/3/6 available activities for 5/10/15/30-minute goals,
simple completion acknowledgment and welcoming restart. Existing lesson, due/mixed
review and completed-unit checkpoint flows are reused, with cached-only new lesson
choices offline. No new XP economy or reminder delivery service.
**Selected policy:** completed lessons, reviews and checkpoints qualify; Monday weeks
and calendar days use the timezone saved at opt-in. Two free grace days per week,
unused days expire; goal changes preserve checked tasks and resize the remainder.
Quests/streaks independently default off; guest/account history stays on this device.
Stable activity IDs prevent retry/reload/reconnection credit duplication.
**Verification:** production TypeScript/Vite/PWA build and 29 targeted Chromium
checks pass, including eleven F17.7 checks. Goals, missing content, completed-task
preservation, partial sessions, Monday/DST/timezone/grace boundaries, returning,
offline/reload/reconnect, identity isolation and storage errors are covered.
Keyboard, roles/status labels, doubled text, mobile/desktop and persistent mute
with reduced motion are verified. Real assistive-technology and supported-browser
release checks remain under F18; no learner-outcome evidence is inferred.
**Next:** gather owner feedback on the deployed slice. F22/F23 task types,
cross-device habit sync and reminder delivery remain separate scopes.
**Depends on:** F15.1 goals/queue, F05/F10 practice, F17.1 feedback; F22/F23 supply
optional task types as delivered, not a requirement to invent unavailable activities.
**Evidence:** [implementation, selected rules and verification](docs/weekly-learning-habits.md),
[focused checks](i-web/tests/learning-habits.spec.ts),
[original plan](docs/learning-engagement-plan.md#f177-weekly-learning-quests-and-forgiving-habits).
**Delivery:** `5aec0ec` committed/pushed and deployed to Vercel; live controls,
published-path ordering and persistence pass.
[Rollout evidence](docs/releases/2026-10-12-weekly-habits.md).
No API/database/content change or curriculum publication.

### F18 Invite-only beta readiness

**Outcome:** a free adult English-language invite-only first-100 beta after a smaller pilot.
**Next:** resume the bounded F18.1 rehearsal when the owner is ready; it is currently
deferred in favor of implementation. Split invitation enforcement, learner reports/quarantine, accessibility/browser
verification and beta operations into separately verifiable children. The rehearsal
does not require completing the full first-100 feature scope in advance.
**Done when:** AGENTS.md release gates pass; target curriculum/audio/speaking scope
is delivered; account lifecycle and invitation controls work; content reports create
versioned review cases with appropriate quarantine/audit handling; real assistive-technology
and supported-browser offline checks pass; no critical Quran text/provenance/rights/meaning
defects remain; an observed smaller pilot supports opening the cohort.
**Evidence to collect:** [pilot kit](docs/pilot/README.md), [preflight](docs/pilot/preflight.md),
target app/content revisions, issue resolutions and owner release decision.
Development-preview deployment and automated keyboard tests alone cannot complete this item.

### F18.1 First-unit observed rehearsal

**Status:** On hold — owner explicitly deferred testing on October 3 to implement
more features first. Kit alignment and available automated preflight are complete;
owner selected an adult false beginner on iPhone/Safari. Real-device
preflight, participant sessions and resulting fix/retest evidence remain open.
**Outcome:** observe whether a target false beginner can complete the revised unit,
understand feedback and retrieve expressions without visible choices.
**Next on resumption:** verify the seven published v2 versions on the intended
iPhone and complete VoiceOver/touch/offline preflight. The owner arranges two sessions
and participant agreement to notes. Immediate/delayed recall tasks are already aligned;
do not run them against old hosted wording. Then fix/retest observed issues.
**Done when:** both sessions are recorded anonymously against app/content versions;
actual lesson times, interface versus language help, immediate and delayed recall,
and offline behavior are reported with attempts/denominators; the top findings have
fix/retest dispositions and an explicit next-pilot decision. Progress loss or a
core access blocker prevents widening testing until fixed and retested.
**Depends on:** F08, intended test setup and owner-arranged participation. Real audio
can progress under F09; a text rehearsal cannot establish listening/pronunciation
quality. Owner authorized preparation and evidence-led fixes on October 3; participant
contact and spending remain separate. The exact F08 content/art approval is complete.
**Evidence:** [existing pilot kit](docs/pilot/README.md),
[version-sensitive script](docs/pilot/session-script.md),
[preflight](docs/pilot/preflight.md), [October 3 checks](docs/pilot/release-2026-10-03/README.md):
24 API tests, 3 Chromium tests (including all-seven offline flow), 1 WebKit online
touch unit walkthrough and production build passed. WebKit offline emulation failed
with a matching upstream report; no Safari offline or real AT pass is inferred.
One learner supplies formative evidence only;
F18 and the thirty-day outcomes remain open after this child is complete.

### F19 Chatterbox phrase audio

**Status:** Active — owner authorized an Azure F0 alternative audition October 3.
Chatterbox's unsuccessful samples remain preserved. See [Azure preparation](tools/azure-speech/README.md).
**Outcome:** improve robotic/incorrect device speech with saved,
reviewable synthetic clips, initially eight exercise prompts in lesson 1.
**Next:** owner completes free-account enrollment; portal inspection found no
subscription. Verify an F0 Speech resource, then audition the
six prepared requests (three phrases, two Jordanian voices, rate -20%). No paid
resource, full batch, publication or deployment authorized. Zero accepted clips.
This extends the audition stage to Azure; the local-only Chatterbox plan remains
historical implementation context. Provider terms and accepted provenance must be
resolved before any Azure batch integration or publication.
**Done when:** a reproducible batch workflow (provider/model identified, saved output
hashes retained), complete synthesis provenance,
explicit synthetic labeling, eight accepted draft prompt mappings and focused
playback/offline/validation checks are complete, with actual owner listening review
recorded. Report unresolved pronunciation verification honestly. Unacceptable or
unavailable samples leave the scope incomplete; do not equate generation with quality.
**Depends on:** F08 approved text; F09.1 prompt IDs; usable local runtime and model;
permissioned reference material if required. F18.1 remains deferred. No paid service
or hiring is included, and F09's eventual human-audio requirement is unchanged.
**Evidence:** [local feasibility and audition](docs/chatterbox-audition-2026-10-03.md),
[measurements/hashes/review](docs/chatterbox-audition-2026-10-03.json),
[generator/setup](tools/chatterbox/README.md). Six real MPS outputs (three phrases,
two variants), five passing
generator checks and offline resume verification. Owner confirms the revision
retains pronunciation errors; no clips accepted or native review established. Full-batch/provenance integration remains.
**Delivery:** tooling committed/pushed in `5fead73`; generated samples remain local
and ignored. No audio integrated into the application or database.
New audio publication and any code rollout are separate from the already-approved v2 text/art release.

### F20 Learned-word glossary

**Status:** Done — implemented October 8; pushed/deployed October 9, 2026.
**Scope delivered:** free learned-word glossary in Practice, populated only by completed
lessons; Arabic/English/transliteration search, track/dialect/type filters, pagination,
source references, authored forms/usage notes and links to the exact teaching card.
Stable vocabulary/sense IDs deduplicate contexts while keeping meanings and variants
separate. Missing forms/audio are explicit; no mastery or native-review claim.
**Synchronization:** owner selected existing synced account completions as inclusion.
Fresh online devices fetch completed packages; guest/account dashboards and pending
completions remain isolated. Offline search uses scoped progress and downloaded versions;
word edits, mastery, filters and review history have no new synchronization scope.
**Content:** 123 distinct word/expression senses copied from 43 approved Everyday
teaching cards (159 occurrences), with exact text/notes/source matching. Explicit
vocabulary metadata supports future console-approved packages; demonstrative seeds and
unpublished Plans drafts are excluded. F12.2 flags are shown without silent corrections.
**Evidence:** [behavior, source boundary and verification](docs/learned-word-glossary.md),
[interface](i-web/src/LearnedWords.vue), [model/catalog matching](i-web/src/glossary.ts),
[browser checks](i-web/tests/glossary.spec.ts),
[publication checks](i-tests/CurriculumApiTests.cs). Production build and 28 API tests
pass; six focused glossary checks cover offline completion/reload, identity and
cross-device inclusion, content changes/withdrawal, audio and keyboard/RTL/LTR layout.
All 55 distinct browser checks pass across the broad/final focused runs; the
[feature note](docs/learned-word-glossary.md) records initial timing/rate-limit failures
and the final 10/10 rerun.
**Next:** additional reviewed forms/content follow the normal console workflow. F12.2 corrections, real audio and F18 real assistive-technology/
supported-browser evidence remain separate work.
**Delivery:** code/catalog committed and pushed in `662d17c`; web/API deployed
October 9. Live existing-account glossary verified. No new curriculum publication
or data migration. [Rollout and preservation checks](docs/releases/2026-10-09.md).

### F21 Cultural watch and listen recommendations

**Status:** Planned — owner proposed daily or weekly recommendations October 8.
**Outcome:** Ismi recommends a podcast, video or movie that supports cultural immersion,
with track/dialect, difficulty, duration, subtitle/transcript availability, access/cost
and a brief learning prompt. Use permitted external links to original publishers.
**Next decision:** choose cadence and first curated scope. Recommend one weekly pick
for the flagship Palestinian/Levantine track, optionally a short excerpt/time window;
daily picks can follow once curation is sustainable. Cadence is not yet adopted policy.
**Done when:** approved curated records display a current pick and past picks; links,
dialect/level/access labels and factual descriptions are checked; unavailable content
has a usable fallback; captions/transcript availability is honest. Viewing stays
optional and does not control core progress/streaks or require a paid media subscription.
**Depends on:** owner curation policy, permitted links/resources and availability
checks. This does not create a live-news operation, media hosting or rehosting rights.
**Delivery:** roadmap proposal only; no external recommendations published.

### F22 Recall and recombine

**Status:** Active — implementation and local verification complete October 12, 2026.
Owner authorized push/deployment, selected the answer policy, and approved the exact
six-situation package. Hosted API delivery, console publication and live checks remain.
**Implemented:** source-linked optional recall metadata/validation, typed Arabic/Arabizi
practice, independent-first/help/retry facts, F10-based due selection with reserved later
variants, atomic device persistence and version-aware human report cases/console resolution.
**Policy:** documented NFC/case/space/sentence-punctuation/Arabic-harakat normalization;
letters and meaningful word differences remain. Unknown answers are Unable to judge;
raw text is session-only unless voluntarily reported. [Details](docs/recall-and-recombine.md).
**Current next:** finish reusable hosting-auth setup, deploy the prepared API, import/validate/
approve/publish the three exact owner-approved revisions, verify hosted practice, then
record the exact web/API/content release. No hosted completion is claimed yet.
**Outcome:** learners produce familiar language in changed authored situations before
assistance, with structured accepted alternatives, explanations and free hints/retries.
F05/F10's think/say-then-tiles practice remains delivered; this adds captured independent
typed responses and transfer evidence rather than rebuilding scheduled review.
**First scope:** one Levantine unit, three communicative targets and six source-linked
changed-context variants, with one variant per target reserved for a later transfer
check. Once seen, a variant is labeled repeated practice rather than unseen transfer.
**Selected content:** Everyday lessons 1/3/6, copied from exact hosted v2 payloads.
Three targets cover accepting a rest, requesting tea and confirming seven; each has
an ordinary and reserved later situation. Existing teaching text/sources are preserved.
[Approved package review](content/levantine/everyday-01/revisions/recall/REVIEW.md).
**Done when:** all variants/rationales/explanations are validated, approved/published;
independent first attempts, help and retries remain distinct; accepted alternatives
and contextual errors follow the agreed policy, plausible uncertainty has a recoverable
review/report path; downloaded practice/evidence survive reload, identity changes and
version/withdrawal handling; accessibility and evaluation checks pass. Maintain F10's
existing intervals; neither tiles nor unassessed speaking become production evidence.
**Depends on:** F03/F04/F05/F10, published source-linked content and explicit input policy;
reuse F18's report-case work if available, otherwise scope the minimal review path.
**Evidence:** [expanded flow, data boundaries and checks](docs/learning-engagement-plan.md#f22-recall-and-recombine);
existing [review](docs/review-and-checkpoints.md), [schedule](docs/scheduled-review.md)
and [transfer drafts](content/levantine/plans-02/README.md).
**Verification:** production build/Release API publish, all 32 API tests, eight F22 browser
checks, six glossary checks and eleven review/scheduling/console checks pass. Real AT/
supported-device and learner-outcome evidence remain F18 gates.
**Delivery:** frontend `3af91b0` pushed/deployed; stable Practice entry verified. API
and three owner-approved content revisions await hosted rollout after credential setup.
[Rollout record](docs/releases/2026-10-12-recall.md), [programmatic deployment](deploy/README.md).

### F23 Recurring mini-stories

**Status:** Planned — owner selected research priority 2 on October 12, 2026.
**Outcome:** short connected scenes with Fattoush/Knafeh give learners a reason to
understand a whole situation and contribute a useful response. Extend F04 opening
dialogues/F06 roles; F21 external cultural recommendations remain separate.
**Bounded target:** a linked three-episode Levantine text arc using taught language,
with source-linked comprehension/response practice and offline delivery. Start with
F23.1; scope the remaining two episodes after reviewing the first. Audio editions
are a separate extension dependent on F09, not a gate for the text arc.
**Next:** outline the arc and begin F23.1 when implementation is authorized.
**Done when:** all three episodes meet F23.1's publication, practice, offline,
version/identity and accessibility criteria, preserve a coherent arc and have distinct
communicative targets. F23.1 completion alone does not complete F23; learning benefit
needs separate learner evidence.
**Depends on:** F03/F04/F06 and approved curriculum; F22 for independently graded
typed responses. Character redesign and external media curation are independent.
**Evidence:** [expanded narrative scope and checks](docs/learning-engagement-plan.md#f23-recurring-mini-stories).
**Delivery:** planning only; no stories published or app rollout.

### F23.1 First text episode

**Status:** Planned — first bounded child of F23.
**Outcome / scope:** one reviewed Levantine text episode using taught language, a small
problem/resolution, two comprehension checks and one learner response. Target 2–4
minutes as an estimate to verify, without a timer. Link from the unit/Practice;
Today integration requires an explicit daily-goal accounting rule.
**Next:** outline one selected unit's episode, roles, targets and source records;
extend console content validation/publication without depending on character redesign.
**Done when:** approved/published episode, checks and rationales are source-linked;
help/retry/resume and downloaded text/progress work; version/withdrawal and identity
handling pass; repeat completion cannot inflate core lessons/minutes; fixed-frame
mobile/desktop, keyboard, screen-reader and RTL/LTR reading work. A text release makes
no listening claim; a later audio edition requires F09 accepted recordings/transcripts.
**Depends on:** F03/F04/F06 and approved curriculum; F22 if the response is independently
typed/graded, otherwise report assisted evidence honestly. F09 is needed only for audio.
**Evidence:** [expanded narrative scope and checks](docs/learning-engagement-plan.md#f23-recurring-mini-stories).
**Delivery:** planning only; no episode, new publication, audio or app rollout.
**Parent limit:** F23's remaining two text episodes need their own child scopes;
listening editions need separately scoped F09 recordings/transcripts.

### F24 Multi-language foundation and parallel study

**Status:** Planned — owner authorized roadmap expansion October 12, 2026.
**Outcome:** learners study Arabic, French and Khmer singly or in parallel in the
same English-language app. Arabic retains distinct Levantine/MSA/Quranic courses;
each course has separate placement, progress, review and content safeguards.
Reuse F01/F02/F03/F05/F10/F15.1/F20 rather than rebuilding delivered features.
**Next:** F24.1 compatibility design, followed by agreement on F24.3 scheduling
before implementing the queue. Recommend shared foundation → first French unit →
first Khmer unit → mixed-language pilot → remaining course units. Prototype Khmer
rendering early. This sequence does not supersede the owner's selected Arabic
engagement order, F19 authorization or deferred F18.1 rehearsal.
**Done when:** all six children pass; both first-unit packages work alongside Arabic
with correct language presentation and course accounting; old Arabic publications,
downloads, identities and pending progress survive the upgrade; supported-browser,
offline and real accessibility evidence is recorded. F24 does not complete the full
F25/F26 courses or the original Arabic beta gates.
**Depends on:** existing foundations; F25.2/F26.2 packages for complete-flow checks;
agreed queue policy and supported-browser/device matrix.
**Evidence:** [checkout assessment](docs/multi-language-feasibility.md),
[existing settings](docs/personal-study-settings.md). No expansion implementation,
migration, browser or learner evidence yet; link it here as work proceeds.
**Delivery:** local planning only; no new code, migration, publication or deployment.

#### F24.1 Language and course records with compatibility

**Status:** Planned.
**Scope:** stable language/course IDs, language tags, script direction, font,
pronunciation-help type, audio locale and published-content availability. Recommend
one Arabic language with three courses, plus distinct French and Khmer courses.
Version target-text/help fields to replace Arabic-only naming without rewriting
immutable Arabic publications or losing old downloads and queued completions.
**Next:** map API/package/client/IndexedDB/settings records; specify an additive
migration and recovery procedure, preserving current lesson/version identifiers.
**Done when:** old/new packages and offline caches load; settings/guest/account
isolation survive; pending completions retain their meaning and remain idempotent;
upgrade/recovery checks pass against a preserved copy of existing state.
**Depends on:** F01/F02/F03/F15.1/F20; production database choice remains unresolved.

#### F24.2 Language-aware learner presentation

**Status:** Planned.
**Scope:** course-driven direction, language tags, fonts, help, audio controls,
teaching, exercises, reviews, glossary and placement. Availability follows actual
published packages. Retain the fixed lesson frame, free help/retries and mute choice.
**Next:** inventory Arabic assumptions; use clearly labeled French/Khmer fixtures
while preserving owner landing wording. Do not advertise fixtures as courses.
**Done when:** Arabic RTL and French/Khmer LTR work without clipped text or broken
focus; downloaded fonts/audio work offline; missing model/device voices have honest
fallbacks; switching courses preserves a started lesson's language/state. Keyboard,
screen-reader and non-listening/non-speaking paths support core study.
**Depends on:** F24.1; language-specific checks in F25.3/F26.3.

#### F24.3 Parallel study settings and daily queue

**Status:** Needs decision — allocation and secondary-course rotation policy.
**Scope:** select courses, choose a primary course and retain 5/10/15/30-minute total
goals; allocate due review/new learning independently and persist guest/account
choices with existing offline conflict handling. No combined proficiency score.
**Recommendation:** retain the primary-course concept; rotate secondary courses
across days when the budget cannot fit useful whole micro-lessons. Keep the current
60% split where useful; agree rounding, rotation, due-review overflow and whole-lesson
overruns explicitly. Show courses omitted today and keep manual study available.
**Next:** agree deterministic examples for 1–5 courses and all goals, including
5 minutes across five courses, unavailable content, overdue review and goal changes.
**Done when:** agreed examples pass online/offline with stable ordering, bounded
rotation so no course starves, no silent substitution/duplicate rewards and visible
overruns; removing/re-adding a course preserves its history and started lessons.
**Depends on:** F24.1/F15.1/F10. Cross-device review-history sync is a separate scope.

#### F24.4 Multi-language curriculum console and validation

**Status:** Planned.
**Scope:** per-language draft/import/source/audio checks, review dispositions, owner
approval, publication, rollback and audit. Reject mismatched language/audio/segment
records and unresolved critical linguistic or rights defects. Retain Quran integrity
and MSA/Quranic publication gates until their own controls exist; enabling French
and Khmer must not bypass those gates or establish expert-review claims.
**Next:** specify validator profiles and source/rights/reviewer fields for F25/F26;
coordinate with F22 typed-response work without making its future evaluator universal.
**Done when:** valid drafts pass their profiles; invalid/unauthorized publication
fails; rollback restores exact releases; public/download endpoints serve only
approved versions with factual source/reviewer status and accepted-answer rationale.
**Depends on:** F24.1/F03 and agreed course source/review definitions.

#### F24.5 Mixed-language verification and pilot

**Status:** Planned.
**Scope:** Arabic + French + Khmer settings, placement, lessons, glossary, due review,
download, offline reload/completion and reconnection. Cover identity isolation,
interrupted downloads, withdrawals, stale packages and switching; verify actual
mobile text/input, keyboard and screen-reader behavior.
**Next:** agree devices/browsers, participant setup and observation rubric when first
units exist. New-language participant contact is a separate owner action.
**Done when:** meaningful API/browser checks and real-device evidence pass; a small
observed mixed-language pilot records versions, immediate/delayed retrieval, help,
attempt counts and fix/retest dispositions. Access/progress blockers prevent release.
Do not resume owner-deferred F18.1 without authorization.
**Depends on:** F24.1–F24.4, first-unit text/audio/support under F25/F26 and pilot setup.

#### F24.6 Expansion release decision and delivery

**Status:** Needs decision — pilot/beta inclusion and release order.
**Scope:** truthful course depth/variety/review/provenance display, versioned release
manifests, rollback, hosted verification and correction/support handling. No automatic
landing-copy rewrite, billing, interface localization or paid hosting/provider signup.
**Recommendation:** verify both first units internally, then run a small language
pilot before deciding whether either joins the first-100 Arabic beta. Retain original
Arabic gates; keep unavailable courses factual until approved publication.
**Next:** owner selects cohort/release boundary using pilot evidence. Code rollout
and exact curriculum approval/publication remain separate authorized actions.
**Done when:** authorized rollout records web/API/content versions, preservation of
existing data/caches, live study/offline checks and a withdrawal/rollback rehearsal;
no unverified outcome, CEFR-level or reviewer claims appear publicly.
**Depends on:** F24.5 and approved per-language release scope; F18 if beta is widened.

### F25 French course

**Status:** Planned — owner requested a full roadmap plan October 12, 2026.
**Outcome:** English-taught, relationship-centered French for adult beginners/false
beginners, alone or alongside Arabic/Khmer, with free core lessons, explanations,
review, downloads and baseline guided speaking.
**Proposed depth:** twelve units/weeks, five new 5–7-minute lessons per unit
(60 new lessons), plus varied review and one checkpoint per unit. Review/checkpoints
do not inflate the new-lesson count. Weeks are a suggested study pace, not delivery
dates or a promise for learners sharing their daily time across languages.
The depth and outcomes below are recommendations awaiting F25.1 agreement.
**Proposed outcomes:** at 30 days with 15 minutes devoted to French daily, handle a
three-minute guided introduction/food/plan exchange, extract four requested facts
from a slow 45–60-second studied-topic dialogue and write a short invitation/reply.
At twelve units, complete a five-minute guided social/day-out scenario and understand/
write short practical messages. Record help and delayed/new-context retrieval;
completion alone establishes none of these outcomes.
**Level framework:** selected Pre-A1/A1 communicative descriptors guide tasks; assess
listening, reading, interaction and writing separately. The
[Council of Europe CEFR Companion Volume](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions)
is a planning reference. [Official DELF A1 information](https://www.france-education-international.fr/diplome/delf-tout-public/niveau-a1)
provides an assessment comparison; no DELF preparation/certification or A1 attainment
guarantee is promised. References do not grant permission to copy exam/course material.
**Next:** F25.1 definition/source/review plan, then F25.2 first-unit drafts.
**Done when:** all six children meet agreed criteria; every agreed unit, explanation,
accepted-answer record and model recording is source-linked, validated, reviewed,
owner-approved and published; offline/accessibility, baseline speaking and observed
outcome checks pass. A first unit or 60 drafted lessons does not complete the parent.
**Depends on:** F24, approved text/audio rights and named linguistic review route;
separately approved speech/AI setup for automated feedback.
**Evidence:** [inspection](docs/multi-language-feasibility.md), reference links above.
No French packages, recordings, committed reviewers or outcome evidence yet.
**Delivery:** local planning only; no authoring, code, publication or deployment.

**Proposed unit sequence:** ordering and linguistic targets require source/reviewer
validation before drafting. These are learning briefs, not approved course content.

| Unit | Scenario and observable task | Language/support focus |
| --- | --- | --- |
| 1 | Meet someone: greet, introduce yourself, ask a name and ask for repetition | Greeting/repair phrases, short questions and sound/spelling help |
| 2 | Talk about people you love: introduce a partner/friend and explain relationships | Pronouns, common être/avoir patterns, articles and basic agreement |
| 3 | Share food or a café visit: order, state preferences and clarify a request | Polite requests, quantities, food phrases and register |
| 4 | Make a plan together: propose a day/time, accept/decline and confirm | Days/time, common present forms and questions; month-one checkpoint |
| 5 | Describe your day: compare routines and ask about someone else's | Useful present forms, frequency, negation and routine patterns |
| 6 | Find your way: ask for a place, follow directions and confirm | Location, movement, directions and number recognition |
| 7 | Visit someone's home: describe rooms, offer help and find things | Possession, location, descriptions and situational politeness |
| 8 | Shop together: ask price/size, compare options and clarify | Numbers, demonstratives, comparisons and agreement in context |
| 9 | Make upcoming plans: arrange a weekend and change it | Near-future patterns, invitations, weather and short messages |
| 10 | Share a recent experience: say what happened and ask a follow-up | Selected past-event patterns and sequencing, without exhaustive drills |
| 11 | Ask for practical help: explain a simple problem and understand the reply | Needs, repair strategies and safe everyday scenarios |
| 12 | Spend a day together: integrate food, introductions, directions and plans | New-context transfer, practical message exchange and delayed checkpoint |

#### F25.1 French definition, sources and review route

**Status:** Needs decision — variety, depth/outcomes and review arrangements.
**Recommendation:** contemporary everyday French with a France-based reference
variety and labeled Canadian/other alternatives where supported; informal/polite
address follows the situation. Beginner entry includes a skippable false-beginner check.
**Next:** agree proposed scope/variety; inventory trusted grammar, dictionary and
pronunciation sources with exact reuse/audio rights. Recommend a named fluent French
reviewer; no hire, contact or availability is assumed.
**Done when:** course brief, unit outcomes, assessment rubric, source/rights register
and review route are agreed; unresolved linguistic claims are excluded.
**Depends on:** owner definition decisions and verified reference rights/access.

#### F25.2 French first unit

**Status:** Planned.
**Scope:** five authored introduction/greeting/repair lessons, contextual recall,
varied review and checkpoint; provenance and rationale for every teaching/answer record.
**Next:** draft from approved sources, validate and obtain owner wording approval
before publication; first-unit pilot findings precede full-course authoring.
**Done when:** complete packages pass F24.4 with recorded linguistic dispositions;
accessible offline use and changed-context recall can be verified. Text-ready,
audio-ready, approved and published states are reported separately.
**Depends on:** F25.1; F24.4 for import/publication; F25.3/F25.5 for full learner delivery.

#### F25.3 French starting check, sounds and text support

**Status:** Planned.
**Scope:** short skippable placement from approved content, optional spelling/sound
modules, accent input/help and readable phrase/word chunks. Pronunciation notes are
authored/source-linked; any IPA help is optional rather than an entry requirement.
**Next:** define reading/listening/response samples and conservative starting-point
policy; select reviewed sound targets with the language reviewer.
**Done when:** skip/retry and accessible alternatives work; accents/apostrophes and
segments render correctly; reviewed answer rules explain when spelling matters
without changing originals. Results stay course-specific, with no fluency claim.
**Depends on:** F25.1/F25.2, F24.1/F24.2; result-sync expansion needs its own scope.

#### F25.4 French remaining units and reference material

**Status:** Planned.
**Scope:** units 2–12 (proposed 55 further lessons), reviews/checkpoints, short searchable
grammar/use guides and explicit glossary forms/senses tied to teaching contexts.
**Next:** confirm sequencing using first-unit findings; author in bounded unit batches
through draft → source validation → linguistic review → owner approval.
**Done when:** agreed 12-unit/60-lesson manifest has no missing rationale, explanation
or source records; retrieval is spaced across varied contexts and checkpoints require
transfer. Draft validation does not establish publication or learner outcomes.
**Depends on:** F25.1/F25.2 and first-unit pilot under F25.6; F24.4; F25.5 audio.

#### F25.5 French model audio and guided speaking

**Status:** Planned — speaker/source and provider decisions remain open.
**Scope:** permitted reviewed model recordings for listening/teaching targets,
transcripts, speaker/variety labels and exact phrase/version mappings. Recommend
multiple human speakers; synthetic previews remain labeled and reviewed. Baseline
speaking uses controlled authored branches, optional record/replay and feedback on
intent, intelligibility and important sounds, with text alternatives.
**Next:** prepare first-unit scripts/rights checklist; assess actual French accuracy,
no-training terms, minimum data, deletion and cost before selecting providers.
**Done when:** complete agreed audio mappings pass review/playback/offline checks;
scenario feedback handles uncertainty without authoritative rejection; recordings
are deleted after feedback and improvement retention requires separate consent.
If AI feedback is deferred, record the incomplete scope; audio alone does not finish it.
**Depends on:** approved F25.2/F25.4 text, F24.2/F24.4 and provider/privacy decisions.

#### F25.6 French pilot, publication and release evidence

**Status:** Planned.
**Scope:** first-unit pilot, then full-course verification against agreed outcomes,
versions, immediate/delayed tasks, help used and attempts/denominators.
**Next:** agree setup/rubric through F25.1; observe first-unit use before widening
authoring, then review the complete candidate. Participant contact is a separate action.
**Done when:** offline/reconnection and real accessibility pass; linguistic/audio
defects have fix/retest dispositions; observed tasks support factual outcome claims;
owner-authorized publications and rollout record exact versions and rollback evidence.
A small pilot is formative evidence, not proof of universal A1 attainment.
**Depends on:** F25.2/F25.3 and first-unit F25.5 audio for initial pilot; F25.4/full
audio and F24.5/F24.6 for full release. These stages do not form a dependency cycle.

### F26 Khmer course

**Status:** Planned — owner requested a full roadmap plan October 12, 2026.
**Outcome:** English-taught Khmer for adult beginners/false beginners communicating
with partners, family and friends. Conversation and gradual script learning support
each other; optional pronunciation help remains available without requiring reading
mastery before beginning conversation. Keep the same free learning floor.
**Proposed depth:** twelve units/weeks, five new 5–7-minute lessons per unit
(60 new lessons), plus varied review and one checkpoint per unit. Add a separate
optional script/sound pathway; exact module count is an F26.1/F26.3 decision.
Weeks guide study pace, not delivery or a promise under a shared daily budget.
Depth and outcomes below are recommendations awaiting F26.1 agreement.
**Proposed outcomes:** at 30 days with 15 minutes devoted to Khmer daily, handle a
two-to-three-minute guided greeting/family/food/plan exchange, extract four requested
facts from a slow 30–45-second studied-topic dialogue and recognize an agreed set
of taught words in script. At twelve units, complete a five-minute guided social/day-out
scenario and read short taught-topic messages with optional help. Define the exact
reading inventory/help in the rubric; promise neither unrestricted literacy nor
proficiency certification. Distinguish conversation/listening/reading evidence.
**Next:** F26.1 definition/source/review choices, then first-unit/script support design.
Prototype Khmer rendering/input/segments alongside French's first unit so technical
issues are discovered before committing to full-course authoring.
**Done when:** all six children pass; agreed units and script/sound modules are
source-linked, validated, linguistically reviewed, owner-approved and published;
audio, baseline guided speaking, offline/accessibility and observed outcomes pass.
First-unit or script-rendering success does not complete this parent.
**Depends on:** F24, approved sources/audio rights, named Khmer linguistic review
route and separately approved speech/AI setup for automated feedback.
**Evidence:** [inspection](docs/multi-language-feasibility.md),
[Unicode segmentation guidance](https://www.unicode.org/reports/tr29/#Word_Boundaries)
and [W3C draft Khmer layout gap analysis](https://www.w3.org/TR/khmr-gap/).
Unicode identifies tailored word/line-boundary needs; the W3C draft is a browser-check
reference, not curriculum authority. No Khmer packages, recordings, committed
reviewers or learner evidence exist yet.
**Delivery:** local planning only; no authoring, code, publication or deployment.

**Proposed unit sequence:** Khmer wording, grammar, pronunciation, address and
cultural notes require approved sources/reviewer validation before lesson drafting.

| Unit | Scenario and observable task | Language/support focus |
| --- | --- | --- |
| 1 | Meet someone: greet, introduce yourself and ask for repetition | Reviewed greeting/repair phrases, address choices and script/help orientation |
| 2 | Meet family/friends: introduce a person and explain a relationship | Contextual relationship/address terms and statement/question patterns |
| 3 | Share a meal: request food, state a preference and clarify an order | Polite requests, quantities and food vocabulary |
| 4 | Make a plan together: propose a time, accept/decline and confirm | Days/time and plan patterns; month-one conversation/listening checkpoint |
| 5 | Describe your day: exchange simple information about routines | Useful action/time/frequency patterns; reading taught phrases |
| 6 | Find a place: ask directions and confirm a route | Location/direction phrases, transport and number recognition |
| 7 | Visit someone's home: find things and offer help | Everyday objects, location and reviewed interaction conventions |
| 8 | Shop together: ask price/quantity and choose between items | Numbers, quantities, comparisons and misunderstanding repair |
| 9 | Share a recent experience: describe an event and ask a follow-up | Reviewed time/aspect expressions and sequencing in context |
| 10 | Make upcoming plans: arrange a visit and change it | Upcoming-time expressions, invitations and short taught-topic messages |
| 11 | Ask for practical help: describe a problem and understand a reply | Needs, clarification and safe everyday scenarios |
| 12 | Spend a day together: integrate family, food, directions and plans | New-context transfer, short supported reading and delayed checkpoint |

#### F26.1 Khmer definition, sources and review route

**Status:** Needs decision — variety, depth/outcomes, help convention and review route.
**Recommendation:** contemporary Cambodian Khmer with an identified Phnom Penh-based
speaker/reference model; label regional/register differences only with evidence.
Select one consistent learner pronunciation-help convention with a reviewer; do
not present proposed romanization as authoritative spelling.
**Next:** agree depth, exact reading outcome and reference model; inventory permissioned
dictionary/teaching/grammar/pronunciation sources. Recommend named fluent Khmer
review including address/cultural notes; no hire/contact/availability is assumed.
**Done when:** course brief, reading inventory, rubric, source/rights register and
review route are agreed; uncertain linguistic/cultural claims are excluded.
**Depends on:** owner course-definition decisions and verified source access/rights.

#### F26.2 Khmer first unit

**Status:** Planned.
**Scope:** five authored greeting/introduction/repair lessons, contextual recall,
varied review and checkpoint; separate source-linked script, help, meaning, accepted
answers and audio. Do not mechanically translate the French lesson sequence.
**Next:** draft from approved sources; record linguistic dispositions and owner
wording approval before publication. Use early pilot findings before full authoring.
**Done when:** packages/authored segments pass F24.4; address/register/help and
answer rationales are checked; changed-context recall and accessible offline study
can be verified. Text, audio, approval and publication states remain distinct.
**Depends on:** F26.1 and F26.3's agreed text/segment rules; F24.4 and F26.5 audio.

#### F26.3 Khmer script, sounds, input and starting check

**Status:** Planned.
**Scope:** skippable placement and optional staged script/sound modules linked to
actual lesson words. Reviewed modules cover consonant/vowel patterns, signs and
syllable combinations without an alphabet memorization gate. Separate reading,
listening and support-choice evidence; never infer pronunciation from text answers.
**Next:** reviewer selects exact modules/inventory/help rules; prototype downloaded
fonts, shaping, line height/wrapping and input. Use authored word/phrase segments
for tiles; do not split Khmer into words by whitespace or insert artificial spaces.
**Done when:** original text is preserved and segments recombine exactly; combining/
stacked text is not clipped; help/script work offline at enlarged sizes; input,
selection and real screen-reader checks pass on agreed devices. Skip/retry and
alternatives to typing/listening/speaking preserve progress. Placement recommends
a starting point, not calibrated literacy/pronunciation scores.
**Depends on:** F26.1 and F24.1/F24.2 for prototype; F26.2 for integrated check/modules.

#### F26.4 Khmer remaining units and reference material

**Status:** Planned.
**Scope:** units 2–12 (proposed 55 further lessons), reviews/checkpoints, searchable
use/grammar guides, glossary senses and progressive supported reading linked to
F26.3. Script inventory and vocabulary need not mirror French or Arabic.
**Next:** revise sequence after first-unit findings; author bounded unit batches
through source validation, linguistic review and owner approval.
**Done when:** agreed 12-unit/60-lesson manifest and optional modules are complete;
every answer has rationale/source linkage; help and segments are consistent; spaced
recall and new-context checkpoints cover taught skills. Drafts, TTS alone and
recognition drills alone do not establish the completed course or its outcomes.
**Depends on:** F26.1/F26.2 and first-unit pilot under F26.6; F26.3/F24.4; F26.5 audio.

#### F26.5 Khmer model audio and guided speaking

**Status:** Planned — recordings and Khmer provider suitability remain unresolved.
**Scope:** permitted reviewed human model recordings, exact text/version mappings,
speaker/variety labels and transcripts; recommend multiple speakers. Controlled
branches and optional record/replay use reviewed responses and intelligibility/
intent targets, with text alternatives and the free baseline floor.
**Next:** prepare first-unit scripts and speaker/rights checklist; assess actual
Khmer recognition/feedback with reviewed samples and privacy/cost terms. Advertised
support or French/Arabic results do not establish Khmer suitability.
**Done when:** full agreed audio coverage passes linguistic/playback/offline checks;
automated feedback is verified for taught scenarios, handles uncertainty and meets
no-training/minimum-data/deletion rules. Raw recordings are deleted after feedback;
improvement retention needs separate informed consent. If no acceptable provider
exists, record the gap and request a bounded fallback/scope decision; self-recording
does not by itself fulfill automated assessment.
**Depends on:** approved F26.2/F26.4 text, F24.2/F24.4 and provider/privacy decisions.

#### F26.6 Khmer pilot, publication and release evidence

**Status:** Planned.
**Scope:** first-unit pilot then full-course verification, with separate conversation,
listening and taught-script tasks, immediate/delayed retrieval, help and versioned
attempt counts. Include actual mobile input/shaping/screen-reader and offline checks.
**Next:** agree setup/rubric through F26.1; resolve early findings before full authoring,
then assess the complete candidate. Participant contact is a separate action.
**Done when:** critical linguistic/audio/script/access/progress defects are resolved;
observed tasks support factual outcomes; exact owner-authorized publications and
rollout include rollback, withdrawal and support handling. Rendered script or one
successful participant is not proof of literacy or general course effectiveness.
**Depends on:** F26.2/F26.3 and first-unit F26.5 audio for early pilot; F26.4/full audio
and F24.5/F24.6 for full release. Early/full stages have separate evidence manifests.

## Selected future implementation order

The owner selected research priorities **1, 2, 4, 5 and 6** on October 12:
**F22 → F23 → F17.5 → F17.6 → F17.7**. F17.5 authoring can support F22 sooner;
F17.6 needs independent F22 evidence, and F17.7 uses approved available activities.
[Detailed future-agent plan](docs/learning-engagement-plan.md).

F17.7 was subsequently authorized, completed and deployed with explicit owner-selected
habit policies; F22 is authorized/implemented and undergoing rollout; F23/F17.5/F17.6 remain
Planned, awaiting implementation authorization. Assessment, rewards and provider choices are not silently settled
by the planning selection. Existing F09/F12/F19 work and the
owner-deferred F18.1 rehearsal retain their statuses; beta gates remain requirements.
Research priority **3 (record/replay/compare)** stays unselected research, without a
new implementation task. Existing F09 recordings/F11 guided speaking remain open.

The new language roadmap has its own dependency order: **F24 foundation → F25/F26
first units and support → mixed-language pilot → remaining units → release decision**.
It does not replace the selected Arabic engagement order above. No relative priority
between these workstreams or new implementation start is inferred from adding plans.
Course definition/source work can proceed independently when authorized; full course
authoring should follow the respective first-unit evidence. No completion dates are
committed without agreed scope, content/reviewer availability and measured first-unit effort.

## Recent planning changes

- **October 12, 2026 F22:** owner authorized implementation/push/deployment, selected
  the typed-answer policy and approved the exact six-situation package. Code/build,
  32 API tests and eight F22 checks pass. Hosted API/content rollout remains pending
  reusable credentials. Prepared tested terminal alwaysdata deployment tooling.
  [Feature evidence](docs/recall-and-recombine.md), [deployment workflow](deploy/README.md).


- **October 12, 2026 F17.7:** owner authorized implementation and selected the habit
  policy; independent weekly quests/streaks work with available activities, free grace
  and offline/identity isolation. Build and 29 distinct targeted checks pass across
  focused runs. `5aec0ec` pushed/deployed; live controls/path/persistence verified.
  [Implementation](docs/weekly-learning-habits.md), [rollout](docs/releases/2026-10-12-weekly-habits.md).

- **October 12, 2026 F24–F26:** owner expanded the roadmap to parallel language study,
  French and Khmer. Added the shared foundation and full proposed twelve-unit courses,
  each with six child tasks, decisions, outcomes and release gates. Updated durable
  product scope; first-100 inclusion remains a decision. Planning only.

- **October 12, 2026 selected additions:** owner selected research priorities
  1/2/4/5/6; added Planned F22/F23 and F17.5–F17.7 with bounded first slices,
  dependencies, policy decisions and completion criteria. Priority 3 remains
  unselected; no implementation or release. [Expanded plan](docs/learning-engagement-plan.md),
  [research](docs/research/duolingo-mango-feature-candidates.md).

- **October 12, 2026 F17.4:** implemented source-linked loading word reel with
  transliteration/Arabic/meaning rolls, pause, reduced motion and hidden-tab handling.
  Build and nine targeted checks pass; `7bb2c22` pushed/deployed. Live loader and
  transition to Today verified.
  [Evidence](docs/loading-word-reel.md).

Keep this log short (latest five meaningful changes). Put detailed evidence in the
linked feature notes; keep private learner observations outside Git.
