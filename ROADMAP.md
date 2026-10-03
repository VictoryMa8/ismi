# Ismi roadmap

Updated October 3, 2026 · **Start here for current feature status.**

This is the single current plan. [AGENTS.md](AGENTS.md) holds product constraints;
[the planning workflow](docs/planning-workflow.md) explains how agents maintain
this file. Older plans provide design context, not current priority or permission.

## At a glance

**Now:** the learner/offline foundation, guided teaching, manual review/checkpoints,
characters, and landing/welcome are implemented. Code release `26f8242` is live on
web/API. The seven owner-approved first-unit revisions are now published as hosted
v2, with current art and verified content/source records. F08 is complete.

**First implementation priority: F19 — Chatterbox phrase audio.** The owner selected
this on October 3 after reporting robotic and incorrectly pronounced device speech.
Start with local feasibility and a three-phrase audition, then a reproducible generator
and explicitly labeled synthetic audio for lesson 1's eight prompts. Follow the
[implementation plan](docs/chatterbox-audio-plan.md). This is planned for the next
agent; no model installation, generation or application implementation has started.
F10 scheduled review follows this work and still needs a scheduling decision.

The owner deferred real-device preflight and the learner rehearsal (F18.1) until after
more implementation. F19 is an interim synthetic-audio slice; F09's real-speaker
recordings and all beta evidence requirements remain open. The existing eight-prompt
batch provides the initial text; [v2 release evidence](docs/pilot/release-2026-10-03/README.md)
remains the published baseline.

**Waiting on:** local Chatterbox feasibility and sample quality evidence, then owner
listening review. Reference-voice rights must be established if reference audio is
needed. Real recordings, later review scheduling, live speech-provider choices,
Quran permissions and beta evidence remain separate dependencies.

| ID | Feature / bounded scope | Status | Next action or limit |
| --- | --- | --- | --- |
| [F19](#f19-chatterbox-phrase-audio) | Chatterbox phrase audio | Planned · first priority | Local feasibility → three-phrase audition → eight-prompt draft integration |
| [F01](#f01-core-study-and-offline-progress) | Core study and offline progress | Done | Broader browser/accessibility checks belong to F18 |
| [F02](#f02-guest-and-account-baseline) | Guest and account baseline | Done | Recovery/deletion belong to F16 |
| [F03](#f03-levantine-curriculum-console) | Levantine curriculum console | Done | Broader content operations remain in F13/F14/F18 |
| [F04](#f04-first-unit-guided-teaching-packages) | First-unit guided teaching packages | Done | Authored packages; publication belongs to F08 |
| [F05](#f05-manual-review-and-checkpoints) | Manual review and checkpoints | Done | Scheduling belongs to F10; history stays on device |
| [F06](#f06-recurring-character-support) | Recurring character support | Done | Final art/package approval belongs to F08 |
| [F07](#f07-landing-page-and-app-welcome) | Landing page and app welcome | Done | Deployed; invitation gate belongs to F18 |
| [F08](#f08-first-unit-revision-release) | First-unit revision release | Done | All seven hosted v2 lessons and 52 source records verified |
| [F09](#f09-reviewed-levantine-recordings) | Reviewed Levantine recordings | Needs input | Actual recordings, permissions and review |
| [F09.1](#f091-first-recording-batch-preparation) | First recording batch preparation | Done | Eight exact prompts prepared; no real recordings yet |
| [F10](#f10-scheduled-review) | Scheduled review | Needs decision | Agree intervals/selection behavior |
| [F11](#f11-guided-speaking) | Guided speaking | Needs decision | Choose a first scenario and provider/privacy setup |
| [F12](#f12-levantine-course-expansion) | Levantine course expansion | Planned | Define the next unit; target twelve weeks |
| [F13](#f13-msa-course) | MSA course | Planned | Define first unit and extend publication support |
| [F14](#f14-quranic-course) | Quranic course | Needs input | Approved source IDs/rights and integrity controls |
| [F15](#f15-personal-study-plan-and-placement) | Personal study plan and placement | Planned | Define a bounded settings/placement slice |
| [F16](#f16-account-recovery-and-deletion) | Account recovery and deletion | Needs decision | Set delivery, hosting and retention requirements |
| [F17](#f17-learning-support-and-gamification) | Learning support and gamification | Planned | Split guides, mastery and reminders into tasks |
| [F18](#f18-invite-only-beta-readiness) | Invite-only beta readiness | Needs input | Rehearsal deferred; full beta gates remain open |
| [F18.1](#f181-first-unit-observed-rehearsal) | First-unit observed rehearsal | On hold | Owner deferred testing until after more implementation |

**Status key:** Planned = unstarted; Active = authorized work in progress;
Needs decision = a named choice prevents the next step; Needs input = external
assets, approval or evidence are missing; Done = the stated scope is implemented
and has completion evidence. Use On hold for an explicit owner deferral and
Cancelled for explicitly removed scope (retain its ID and reason). IDs identify
features, not priority; recommendations can change without renumbering.
F19 is explicitly first priority; remaining rows retain ID order, not execution order.
Priority is not a schedule or blanket publication/deployment authorization.

## Delivery and evidence

- **Implementation:** Done rows describe the bounded scopes in this checkout.
  Code release `26f8242` is committed, pushed and deployed. Delivery evidence is in the
  [October 2 rollout record](docs/releases/2026-10-02.md).
- **Curriculum:** October 3 hosted release published all seven Everyday revisions as
  v2 through normal console gates. All seven public payloads and 52 source records
  match the approved packages; prior v1 records remain superseded for restoration.
  Local state differs: lesson 1 v4 was already published and lessons 2–7 remain drafts.
  [Release, audit and preservation evidence](docs/pilot/release-2026-10-03/README.md).
- **Hosting:** Vercel plus alwaysdata development preview; code release `26f8242`
  remains live. The curriculum release required no code redeployment. Seven Everyday
  v2 lessons plus six existing fixtures are published. New docs/tests remain uncommitted.
- **Verification basis:** October 2 release checks passed the production frontend
  build, 24 API tests, all 40 standard browser tests and Release API publish. Earlier
  feature notes preserve historical checks. Real screen-reader, learner-outcome
  and supported-browser evidence remains open.

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

### F07 Landing page and app welcome

**Scope delivered:** mobile/desktop landing page with preserved owner copy and
outlined hero; entry into the real app; once-per-browser skippable three-card
welcome; explicit return links; stable portrait sizing and reload/section navigation.
The isolated sample is retired. No invitation form or enforced beta gate exists.

**Evidence:** [current behavior and prior checks](docs/landing/README.md),
[entry shell](i-web/src/AppShell.vue), [welcome](i-web/src/AppWelcome.vue),
[landing checks](i-web/tests/landing.spec.ts), [navigation checks](i-web/tests/navigation.spec.ts).
The implementation notes record a production build, 24 backend tests and 36 distinct
browser checks across full/focused runs; later owner refinements have targeted coverage.
The October 2 code release is deployed; live landing, welcome, dashboard and lesson
loading passed. See the [rollout record](docs/releases/2026-10-02.md).

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
Local draft state is separate; documentation/test changes remain uncommitted.
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

**Outcome:** review appears when due according to an explicitly chosen policy.
**Next decision:** choose scheduling behavior; recommendation is a small deterministic
policy using existing versioned history, with manual practice always available.
The owner chose F19 Chatterbox audio ahead of F10 on October 3. Scheduled review
remains a later proposal. Proposed initial intervals are 1, 3, 7 and 14 days, with
earlier repetition after mistakes; no scheduling policy has been selected.
Intervals and reminder behavior remain proposals until chosen. Notifications are separate.
**Done when:** agreed due-selection/interval behavior works deterministically offline,
handles changed versions, and passes the agreed scenarios without inventing mastery
claims or gating retries. F05 is already complete.

### F11 Guided speaking

**Outcome:** a controlled scripted conversation provides useful online feedback.
**Next decision:** choose a first scenario and speech/AI provider configuration with
no training on learner data, minimal disclosure and supported deletion.
**Done when:** authorized branches assess appropriate meaning/intelligibility,
feedback works, raw recordings are promptly deleted, and text/accessibility alternatives
and provider failure paths are verified. Baseline practice stays free.

### F12 Levantine course expansion

**Outcome:** twelve weeks of substantive urban Palestinian content, with useful
Jordanian variants labeled. **Next:** define the next unit and its communicative
outcome; deliver it as a child task before repeating the pattern.
**Done when:** the full target is source-linked, validated, owner-approved/published,
downloadable and backed by observed timing/recall evidence. Fixtures do not count
as curriculum depth; guided choices do not prove the thirty-day speaking outcome.

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

**Outcome:** selectable tracks/primary track, 5/10/15/30-minute goals, separate progress,
and short skippable track-specific placement with bootcamp recommendations.
**Next:** scope learner settings first; existing dashboard allocations are a baseline,
not completed personalization. Placement/bootcamp content can be separate child tasks.
**Done when:** selected goals/tracks drive the queue and persist as agreed; per-track
placement and applicable reading/sound modules work without a combined Arabic score.

### F16 Account recovery and deletion

**Outcome:** confirmation/recovery and account/data deletion are usable for the beta.
**Next decision:** email delivery, target hosting and precise deletion/retention requirements.
**Done when:** agreed recovery/confirmation/deletion flows work end to end, including
relevant progress/provider data and failure paths, with verified privacy behavior.
External identity remains optional unresolved work, not a condition of F02 completion.

### F17 Learning support and gamification

**Outcome:** searchable grammar references, meaningful mastery/achievements/XP,
optional forgiving streaks and opt-in reminders with categories/quiet hours.
**Next:** split these into bounded tasks; define consequential mastery/reminder rules
explicitly. Existing in-lesson explanations are delivered under F01/F04.
**Done when:** agreed subfeatures are usable and verified, reward learning without
trivial farming, preserve free explanations/retries and honor opt-out/quiet hours.
No hearts, leagues, guilt or paid streak repair. Billing is outside the beta.

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

**Status:** Planned — first implementation priority, selected by the owner October 3.
**Outcome:** improve robotic/incorrect device speech with locally generated,
reviewable synthetic clips, initially eight exercise prompts in lesson 1.
**Next:** the next implementing agent starts with hardware/runtime/license inspection
and three exact-phrase auditions, then follows the
[Chatterbox implementation plan](docs/chatterbox-audio-plan.md). Generate locally;
reuse stored WAV playback/offline infrastructure. No inference on production hosts.
**Done when:** a pinned local batch generator, complete synthesis provenance,
explicit synthetic labeling, eight accepted draft prompt mappings and focused
playback/offline/validation checks are complete, with actual owner listening review
recorded. Report unresolved pronunciation verification honestly. Unacceptable or
unavailable samples leave the scope incomplete; do not equate generation with quality.
**Depends on:** F08 approved text; F09.1 prompt IDs; usable local runtime and model;
permissioned reference material if required. F18.1 remains deferred. No paid service
or hiring is included, and F09's eventual human-audio requirement is unchanged.
**Evidence:** plan based on inspected recording store, validator, editor, playback,
offline code and official Chatterbox documentation; no generated samples or tests yet.
**Delivery:** planning only, uncommitted. New audio publication and any code rollout
are separate from the already-approved v2 text/art release.

## Recent planning changes

- **October 3, 2026 audio priority:** owner selected a Chatterbox implementation plan
  for the next agent. Added F19 as first priority, ahead of scheduled review, with
  local audition, generation, synthetic provenance and offline integration scope.
  Planning only; no dependencies installed, samples generated or product code changed.


- **October 3, 2026 reprioritization:** owner deferred testing and requested more
  feature implementation. F18.1 On hold; F10 recommended pending feature/policy
  choice. No beta gates waived and no new feature implemented by this update.


- **October 3, 2026 publication:** completed owner-approved F08 release through the
  hosted console. All seven public v2 payloads and 52 source records verified against
  approved packages; prior v1 versions retained. F08 Done; F18.1 real-device sessions
  and F09 recordings remain open. No code redeployment or real learner results.


- **October 3, 2026 execution:** prepared/validated seven release candidates, fixed
  two role inconsistencies, reconciled actual local publication state and updated
  the check-in case. Aligned the iPhone/Safari pilot and prepared eight recording
  prompts; checks and exact remaining human/publication gates are linked above.
  No hosted changes, real learner sessions or real recordings occurred.
- **October 3, 2026 assessment:** inspected the clean `main` checkout at `38cdd33`,
  release evidence, lesson manifests, evaluation/review code and pilot kit. Prioritized
  F08 → F18.1 → evidence-led fixes; exposed script/version alignment and first audio
  batch dependencies. No new learner evidence, database/host inspection, test rerun,
  implementation, publication or deployment is claimed by this planning-only update.

Keep this log short (latest five meaningful changes). Put detailed evidence in the
linked feature notes; keep private learner observations outside Git.
