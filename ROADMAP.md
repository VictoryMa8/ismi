# Ismi roadmap

Updated October 2, 2026 · **Start here for current feature status.**

This is the single current plan. [AGENTS.md](AGENTS.md) holds product constraints;
[the planning workflow](docs/planning-workflow.md) explains how agents maintain
this file. Older plans provide design context, not current priority or permission.

## At a glance

**Now:** the learner/offline foundation, guided teaching, manual review/checkpoints,
characters, and landing/welcome are implemented in this checkout. Latest curriculum
revisions still need owner publication. The owner authorized pushing/deploying web
and API; both are live and verified. See [release evidence](docs/releases/2026-10-02.md).

**Recommended next:** refine any owner-selected first-unit issues and prepare its
revision release (F08). The next proposed engineering slice is scheduled review
(F10), after its scheduling decision. Recordings can progress independently when
real assets arrive. No new product feature is currently marked Active.

**Waiting on:** curriculum/art approval, real recordings, review scheduling,
speech/AI choices, Quran resource permissions, and beta release evidence.

| ID | Feature / bounded scope | Status | Next action or limit |
| --- | --- | --- | --- |
| [F01](#f01-core-study-and-offline-progress) | Core study and offline progress | Done | Broader browser/accessibility checks belong to F18 |
| [F02](#f02-guest-and-account-baseline) | Guest and account baseline | Done | Recovery/deletion belong to F16 |
| [F03](#f03-levantine-curriculum-console) | Levantine curriculum console | Done | Broader content operations remain in F13/F14/F18 |
| [F04](#f04-first-unit-guided-teaching-packages) | First-unit guided teaching packages | Done | Authored packages; publication belongs to F08 |
| [F05](#f05-manual-review-and-checkpoints) | Manual review and checkpoints | Done | Scheduling belongs to F10; history stays on device |
| [F06](#f06-recurring-character-support) | Recurring character support | Done | Final art/package approval belongs to F08 |
| [F07](#f07-landing-page-and-app-welcome) | Landing page and app welcome | Done | Deployed; invitation gate belongs to F18 |
| [F08](#f08-first-unit-revision-release) | First-unit revision release | Needs input | Owner selects/approves final packages and art |
| [F09](#f09-reviewed-levantine-recordings) | Reviewed Levantine recordings | Needs input | Actual recordings, permissions and review |
| [F10](#f10-scheduled-review) | Scheduled review | Needs decision | Agree intervals/selection behavior |
| [F11](#f11-guided-speaking) | Guided speaking | Needs decision | Choose a first scenario and provider/privacy setup |
| [F12](#f12-levantine-course-expansion) | Levantine course expansion | Planned | Define the next unit; target twelve weeks |
| [F13](#f13-msa-course) | MSA course | Planned | Define first unit and extend publication support |
| [F14](#f14-quranic-course) | Quranic course | Needs input | Approved source IDs/rights and integrity controls |
| [F15](#f15-personal-study-plan-and-placement) | Personal study plan and placement | Planned | Define a bounded settings/placement slice |
| [F16](#f16-account-recovery-and-deletion) | Account recovery and deletion | Needs decision | Set delivery, hosting and retention requirements |
| [F17](#f17-learning-support-and-gamification) | Learning support and gamification | Planned | Split guides, mastery and reminders into tasks |
| [F18](#f18-invite-only-beta-readiness) | Invite-only beta readiness | Needs input | Complete release gates and observed pilot |

**Status key:** Planned = unstarted; Active = authorized work in progress;
Needs decision = a named choice prevents the next step; Needs input = external
assets, approval or evidence are missing; Done = the stated scope is implemented
and has completion evidence. Use On hold for an explicit owner deferral and
Cancelled for explicitly removed scope (retain its ID and reason). IDs identify
features, not priority; recommendations can change without renumbering.
Order is recommended, not a schedule or blanket authorization.

## Delivery and evidence

- **Implementation:** Done rows describe the bounded scopes in this checkout.
  Code release `26f8242` is committed, pushed and deployed. Delivery evidence is in the
  [October 2 rollout record](docs/releases/2026-10-02.md).
- **Curriculum:** seven owner-approved original Everyday lessons and six demo
  fixtures are documented as published. The last local inspection found guided
  lesson 1 v3 published, with six other guided revisions in draft; seven character
  proposals were subsequently saved. October 2 package renames were not imported
  or published. Inspect the target database before claiming exact current versions.
- **Hosting:** the development preview uses Vercel plus alwaysdata. The October 2
  code release is live on both hosts; health, dashboard and published lesson checks
  passed. The host retains seven original Everyday v1 lessons plus six fixtures;
  local curriculum was not migrated by this code rollout.
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

**Outcome:** learners receive the final owner-approved guided/character revisions.
**Next:** inspect saved drafts and current portable hashes; collect the owner's
selected changes/art; make only the requested refinements and present final versions.
**Done when:** owner-authorized versions pass validation and approval/publication
gates in the named target database, with published IDs/versions and audit evidence.
If a host rollout is included, verify it separately.
**Depends on:** owner decisions/approval; [package manifest](content/levantine/everyday-01/revisions/characters/README.md).
Do not redo F04/F06 because publication is pending.

### F09 Reviewed Levantine recordings

**Outcome:** core prompts use permitted, human-reviewed real speaker audio.
**Next:** obtain actual supplied recordings with permissions; choose an explicit
lesson/prompt batch before upload. Text-based development can continue meanwhile.
**Done when:** the selected batch has accurate transcripts, speaker/dialect labels,
source permission and review evidence; authorized publication and verified offline playback.
**Depends on:** assets and human review; [recording preparation](docs/pilot/recordings.md).
Silence fixtures and device voice previews cannot complete this item. Partial batches
must report coverage; the beta needs full core-audio coverage checked under F18.

### F10 Scheduled review

**Outcome:** review appears when due according to an explicitly chosen policy.
**Next decision:** choose scheduling behavior; recommendation is a small deterministic
policy using existing versioned history, with manual practice always available.
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
**Next:** retain useful implementation momentum; gather actual evidence and resolve
cohort/invitation/hosting decisions as needed, rather than create more planning paperwork.
**Done when:** AGENTS.md release gates pass; target curriculum/audio/speaking scope
is delivered; account lifecycle and invitation controls work; content reports create
versioned review cases with appropriate quarantine/audit handling; real assistive-technology
and supported-browser offline checks pass; no critical Quran text/provenance/rights/meaning
defects remain; an observed smaller pilot supports opening the cohort.
**Evidence to collect:** [pilot kit](docs/pilot/README.md), [preflight](docs/pilot/preflight.md),
target app/content revisions, issue resolutions and owner release decision.
Development-preview deployment and automated keyboard tests alone cannot complete this item.

## Recent planning changes

- **October 2, 2026 rollout:** pushed/deployed code release `26f8242` to web/API,
  verified hosted behavior and persistent data, and recorded rollback evidence.
  No curriculum revisions were imported or published.
- **October 2, 2026:** consolidated current planning here; recognized seven completed
  implementation scopes and separated remaining content release, assets, decisions
  and beta gates. Added agent workflow and retired historical handoffs as task queues.
  Planning changes only; no new feature rollout or curriculum publication.

Keep this log short (latest five meaningful changes). Put detailed evidence in the
linked feature notes; keep private learner observations outside Git.
