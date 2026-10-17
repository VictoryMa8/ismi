# Ismi roadmap

Updated October 16, 2026 · **Start here for current feature status.**

This is the single current plan. [AGENTS.md](AGENTS.md) holds product constraints;
[the planning workflow](docs/planning-workflow.md) explains how agents maintain
this file. Older plans provide design context, not current priority or permission.

## At a glance

**F28 — Five inventory previews published October 16:** following the owner's
“just publish them” direction after notification of absent review/audio, the exact
five Arabic-context/Khmer/French inventories are public as **unreviewed text-only
previews**, all **v1**. They contain character forms and technical Unicode names;
word examples, graded exercises and human audio remain absent. Application `ab2d456`
is pushed/deployed, Vercel Ready and exact API revision verified. All 49 API tests,
build and 18 focused alphabet/preview browser checks pass. Anonymous public manifests
and frontend checksum verification pass. Only the alphabet table changed; all 16
unrelated table hashes and persistent assets are preserved. **F28.1.2 is Done**;
F28 stays Active for full reviewed packs, human audio and real device/AT/Safari gates.
[Publication/audits/recovery](docs/alphabet-inventory-publication.md),
[application](docs/alphabet-explorer.md).

**F24.8.1 — Done and deployed October 16:** owner reported lessons disappearing on language
switches and requested Fattoush/Knafeh across languages plus distinct landing palettes.
Scope: keep manual lesson entry visible for the viewed course without changing daily
allocation; retain explicit character roles and provide shared guides when absent;
replace positional landing color rules with explicit course palettes. Build and all
23 focused browser checks pass, including teaching resume/offline and mobile/desktop
contrast. Frontend `0623273` is Vercel Ready; live switching, all five Khmer entries,
shared guides and landing palettes pass. No curriculum text or publication change.
[Behavior and delivery](docs/multi-language/switching-and-identity.md).

**F26 — Five previews published October 16:** the owner selected Cambodian Khmer/
Phnom Penh, twelve units/sixty lessons and conversation-first optional script help,
then explicitly authorized these five as **unreviewed, text-only development previews**.
Application `30ea724` is pushed/deployed; Vercel Ready and exact API revision verified.
Hosted records **24–28**, all **v1**, are published through the owner console, with
pending review/rights, no reviewer and no human audio retained. Live course/lesson
labels pass. All 13 Arabic publications, learner data, sources and assets are preserved.
API **41/41**, build and **10** focused browser checks pass, including downloaded
Khmer offline completion/reconnection in a disposable database. **F26.2.1 is Done**;
F26 remains Active for fluent review/source/help/inventory decisions, human audio,
real device/AT/Safari/pilot evidence and units 2–12.
[Publication and recovery](docs/khmer/text-preview-publication.md),
[exact versions/audit](content/khmer/meet-01/publication.json),
[candidate evidence](docs/khmer/README.md).

**F24 — Application deployed October 16:** multi-language foundation, course selector,
independent state, approved parallel queue, console safeguards and shared wording
are pushed/deployed as `f515f43`. Live selection/Arabic entry and hosted data
preservation pass. French remains planned; Khmer now has five unreviewed text-only preview publications
under the explicit F26.2.1 exception, described above.
Parent stays Active for reviewed first units, real device/AT/pilot evidence, Safari
offline verification and beta/content decisions. [Behavior](docs/multi-language/README.md),
[rollout](docs/releases/2026-10-16-multi-language.md).

**F27.1 — Complete and deployed October 16:** shared 48 px arrow-and-label return
controls, explicit destinations and keyboard/offline support. Application `5875e6d`
is pushed; Vercel is Ready on the existing development URL. Isolated build and focused
checks pass, with one cultural-refresh retry. Unrelated local course work is excluded;
no API or curriculum change. [Behavior](docs/mobile-back-navigation.md),
[rollout evidence](docs/releases/2026-10-16-back-navigation.md).

**F17.6 — Complete and deployed October 13:** three Everyday written-recall can-do cards,
versioned attempt/help/date evidence, targeted practice and an optional outcome
achievement use the owner-approved independent / distinct-situation / 24-hour
due-review policy. Offline persistence, identity separation and content revisions/
withdrawal are verified. Application release `7b80136` is pushed/Vercel Ready; live
Practice cards, policy, mobile layout and reload are verified. [Behavior](docs/can-do-progress.md),
[rollout evidence](docs/releases/2026-10-13-can-do.md).

**F20.1 — Complete and deployed October 13:** Account form controls/status now have
consistent spacing and mobile daily goals use equal columns. Learned words lives
on `#/words`, linked from Practice. Build and all 27 distinct focused/regression
checks pass across runs; live route, 56 existing entries, return link and Account
layout verified. [Behavior and delivery](docs/learned-word-glossary.md#october-13-page-and-account-spacing--f201).

**F22 — Complete and deployed October 13:** typed Arabic/Arabizi recall,
first/help/retry evidence, reserved later situations and owner review reports are
implemented. The owner-approved Everyday 1/3/6 revisions are published as v3 through
console gates. Frontend/API application release `6419f84` is deployed; healthy API,
exact payload/source/audit matching, data/asset preservation and enabled live Practice
entry are verified. [Behavior](docs/recall-and-recombine.md),
[rollout evidence](docs/releases/2026-10-13-recall.md).

**October 12 scope expansion — F25 planned; F26 authorized October 16; F24 authorized October 15:** the owner added French, Khmer
and parallel language study to Ismi's roadmap. Arabic remains the flagship.
The full plans below include a shared foundation and separate proposed twelve-week
courses, with child tasks, outcomes and release gates. The owner subsequently authorized
all F24 foundation/presentation implementation and a deployment candidate, and approved
its queue policy. F26 draft implementation and definition defaults were authorized
October 16; exact review/source/audio and first-100 beta inclusion remain open.
F25 definition/authoring remain separate. Existing Arabic commitments are retained.

**October 15 Khmer plan expansion — F26 / F24.7:** the owner requested a fuller
Khmer implementation path and a shared landing/wording overhaul that prepares Ismi
for French, eventual Portuguese and further languages. Keep the relationship promise
and visible Arabic/Palestinian roots; add Cambodian-inspired red/blue accents.
Follow-up scope: explore an English/Arabic/Khmer brand title (F24.7), make Arabic–Khmer
switching obvious (F24.8), and improve page-back controls for mobile (F27.1).
[First-unit milestones, landing, copy and identity plan](docs/khmer-course-and-brand-expansion.md).
F26 now has five owner-authorized unreviewed text-only preview publications; full release remains gated. F24
shared application work is implemented and deployed.

**F21 — Application deployed October 15:** weekly YouTube video + film + song
collections now have a versioned owner console, Monday UTC delivery, learner/archive
pages, offline metadata and availability/rollback controls. The owner chose broader
Arabic with explicit dialect/register labels. Four research drafts are imported
locally; no actual media is approved/published. Build, 37 API tests and final 21
focused browser checks pass; initial broad run was 106/107 with a recall focus race
subsequently fixed. [Behavior and evidence](docs/cultural-watch-listen.md).
Frontend/API application `4545fea` is pushed/deployed; live page/owner console and
hosted data preservation are verified. Real media/access/editorial, AT and content
publication remain open. [Rollout evidence](docs/releases/2026-10-15-cultural-media.md).

**October 12 planned additions:** the owner selected research priorities 1, 2, 4,
5 and 6 for future implementation: F22 recall/recombine, F23 mini-stories,
F17.5 phrase anatomy/grammar, F17.6 can-do progress and F17.7 weekly quests/forgiving
habits. [Expanded scopes and completion criteria](docs/learning-engagement-plan.md).
F22 was subsequently authorized, completed and deployed. F23/F17.5 remain Planned.
F17.6/F17.7 are implemented/deployed. The original planning
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

**October 13 earlier rollout:** F17.6 frontend `7b80136` is deployed with verified
live Practice/cards/policy/reload. [F17.6 rollout](docs/releases/2026-10-13-can-do.md).
F22 API application release `6419f84` remains deployed and its exact owner-approved
packages are published as v3. Live Practice
is enabled for eligible completed lessons; prior v2 versions and application/database
rollback are retained. [Rollout evidence](docs/releases/2026-10-13-recall.md).
Earlier [weekly-habits rollout](docs/releases/2026-10-12-weekly-habits.md),
[word reel](docs/releases/2026-10-12-word-reel.md),
[copy/oval](docs/releases/2026-10-11-copy-cleanup.md) and
[placement](docs/releases/2026-10-11.md) evidence remains applicable.

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

**Now:** F28’s shared alphabet application and five inventory-only text previews are deployed;
reviewed full packs/examples/human audio and device/AT evidence remain open. The learner/offline foundation, learned-word glossary, guided teaching, manual and scheduled review/checkpoints,
characters, and landing/welcome are implemented. F17.7 weekly quests/forgiving habits
are complete and live-verified. F17.6 can-do cards/achievement are complete and deployed. F21 application `4545fea` is deployed, retaining F22's content. The first unit
has three Everyday v3 and four v2 publications, with current art and verified
content/source records. F08 is complete.

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

**Waiting on:** owner Azure free-account enrollment (signed in, but no subscription),
verified F0 access and then owner listening review. No paid services authorized.
Real recordings, live speech-provider choices, Quran permissions
and beta evidence remain separate dependencies.
For French, course-definition decisions precede authoring. Khmer's five text-only
previews are published under F26.2.1. A fluent reviewer, exact source/help/inventory
dispositions, permissions and linguistic/audio evidence remain before a full reviewed
release and bulk authoring of units 2–12.

| ID | Feature / bounded scope | Status | Next action or limit |
| --- | --- | --- | --- |
| [F19](#f19-chatterbox-phrase-audio) | Chatterbox phrase audio | Active · Azure audition | Six requests prepared; activate free account, then verify F0 |
| [F01](#f01-core-study-and-offline-progress) | Core study and offline progress | Done | Broader browser/accessibility checks belong to F18 |
| [F02](#f02-guest-and-account-baseline) | Guest and account baseline | Done | Recovery/deletion belong to F16 |
| [F03](#f03-levantine-curriculum-console) | Levantine curriculum console | Done | Broader content operations remain in F13/F14/F18 |
| [F04](#f04-first-unit-guided-teaching-packages) | First-unit guided teaching packages | Done | Authored packages; publication belongs to F08 |
| [F05](#f05-manual-review-and-checkpoints) | Manual review and checkpoints | Done | Scheduling belongs to F10; history stays on device |
| [F06](#f06-recurring-character-support) | Recurring character support | Done | Portrait behavior retained; current artwork is F06.1.1 |
| [F06.1](#f061-character-art-redesign) | Character art redesign | Active · art deployed | F06.1.1 complete; broader profile/turnaround views remain |
| [F06.1.1](#f0611-selected-art-integration) | Selected art integration | Done · deployed | Larger lesson/home portraits deployed October 15; 12 focused checks pass |
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
| [F17](#f17-learning-support-and-gamification) | Learning support and gamification | Planned | F17.6/F17.7 deployed; F17.5, reminders and XP remain open |
| [F17.1](#f171-learner-satisfaction) | Learner satisfaction | Done · deployed first slice | Today/color/completion verified; sound audition and optional timer remain proposals |
| [F17.2](#f172-dashboard-loading-feedback) | Dashboard loading feedback | Done · deployed | Startup/refresh, cached offline and retry verified; hero edge removed |
| [F17.3](#f173-interface-copy-cleanup) | Interface copy cleanup | Done · deployed | Redundant subtitles/quips removed; build and 31 targeted checks pass |
| [F17.4](#f174-loading-word-reel) | Loading word reel | Done · deployed | Six exact glossary samples; pause/reduced motion verified |
| [F17.5](#f175-phrase-anatomy-and-grammar-reference) | Phrase anatomy and grammar reference | Planned | Map six phrases to two patterns and three sourced usage notes |
| [F17.6](#f176-can-do-progress-and-outcome-achievements) | Can-do progress and outcome achievements | Done · deployed | Approved policy/cards/achievement; live Practice/reload verified |
| [F17.7](#f177-weekly-learning-quests-and-forgiving-habits) | Weekly learning quests and forgiving habits | Done · deployed | F27 changes new-learner default to on; saved off states stay off |
| [F18](#f18-invite-only-beta-readiness) | Invite-only beta readiness | Needs input | Rehearsal deferred; full beta gates remain open |
| [F18.1](#f181-first-unit-observed-rehearsal) | First-unit observed rehearsal | On hold | Owner deferred testing until after more implementation |
| [F20.1](#f201-learned-words-page-and-account-spacing) | Learned words page and Account spacing | Done · deployed | Separate glossary route and Account gaps verified on Vercel |
| [F20](#f20-learned-word-glossary) | Learned-word glossary | Done · deployed | Live existing-account glossary verified; offline/search checks pass |
| [F21](#f21-cultural-watch-and-listen-recommendations) | Cultural watch/listen recommendations | Active · application deployed | Media/access/AT review and exact owner publication remain |
| [F21.1](#f211-curation-and-first-four-collections) | Curation and first four collections | Active · four research drafts | Resolve playback/runtime/access/support and editorial gaps |
| [F21.2](#f212-media-catalog-and-publication-console) | Media catalog and publication console | Done · deployed | Owner-only versioned workflow, Monday UTC selection and audit verified |
| [F21.3](#f213-learner-collections-and-offline-metadata) | Learner collections and offline metadata | Done · deployed | Three cards/archive, safe links and atomic offline snapshots verified |
| [F21.4](#f214-availability-upkeep-and-corrections) | Availability upkeep and corrections | Active · software verified | Rehearse a real editorial check/replacement cycle after F21.1 |
| [F21.5](#f215-verification-and-authorized-release) | Verification and authorized release | Active · application deployed | Real media/AT checks and owner publication remain |
| [F22](#f22-recall-and-recombine) | Recall and recombine | Done · deployed/published | Three targets/six situations live; broader AT/device and outcome evidence remains F18 |
| [F23](#f23-recurring-mini-stories) | Recurring mini-stories | Planned | Start F23.1, then scope a linked three-episode text arc |
| [F23.1](#f231-first-text-episode) | First text episode | Planned | One reviewed episode, two comprehension checks and a response |
| [F24](#f24-multi-language-foundation-and-parallel-study) | Multi-language foundation and parallel study | Active · application deployed | Reviewed first units, real device/AT/pilot, Safari offline and beta/content decisions remain |
| [F24.7](#f247-multi-language-wording-landing-and-visual-identity) | Multi-language wording, landing and visual identity | Active · application deployed | Shared copy, Languages and Khmer colors deployed; title A approved; real AT remains |
| [F24.8](#f248-prominent-language-and-course-switching) | Prominent language and course switching | Active · application deployed | Selector live; offline flows verified with fixtures; approved units/observed task remain |
| [F25](#f25-french-course) | French course | Planned · definition decisions | Proposed twelve-week course; select variety, depth and review route |
| [F26](#f26-khmer-course) | Khmer course | Active · five previews live | F26.2.1 Done: five unreviewed text-only v1 lessons published; full review/audio/pilot and units 2–12 remain |
| [F27](#f27-feature-discoverability-and-navigation) | Feature discoverability and navigation | Done · deployed | Five tabs, Practice hub, Progress page, feature colors, habits on by default |
| [F27.1](#f271-mobile-friendly-back-navigation) | Mobile-friendly back navigation | Done · deployed | Application `5875e6d` pushed; Vercel Ready, alias confirmed |
| [F28](#f28-alphabet-explorer) | Alphabet explorer | Active · five inventory previews published | Reviewed full packs, examples/human audio and real device/AT/Safari evidence remain |
| [F29](#f29-privacy-policy-and-beta-version) | Privacy policy and beta version | Done · local | Public `#/privacy` page and Beta 0.0.1 label; not yet committed/deployed |

**Status key:** Planned = unstarted; Active = authorized work in progress;
Needs decision = a named choice prevents the next step; Needs input = external
assets, approval or evidence are missing; Done = the stated scope is implemented
and has completion evidence. Use On hold for an explicit owner deferral and
Cancelled for explicitly removed scope (retain its ID and reason). IDs identify
features, not priority; recommendations can change without renumbering.
F19 now proceeds with the owner-authorized Azure F0 audition; remaining rows retain ID order, not execution order.
Priority is not a schedule or blanket publication/deployment authorization.

## Delivery and evidence

- **F21 application, October 15:** `4545fea` frontend/API deployed and live-verified;
  existing hosted data/assets preserved. Media catalog remains empty; four local
  research drafts are unpublished. [Rollout](docs/releases/2026-10-15-cultural-media.md).

- **Implementation:** Done rows describe the bounded scopes in this checkout.
  F27 navigation frontend `3d87ff4` is pushed and Vercel Ready October 15; live bundle includes the new routes. API not redeployed (rate-limit change is test-only).
  F17.6 frontend application release `7b80136` is pushed/Vercel Ready October 13;
  live Practice/cards/policy/reload verified. [F17.6 rollout](docs/releases/2026-10-13-can-do.md).
  F22 frontend/API application release `6419f84` is deployed October 13; three
  exact approved revisions are published v3 and live Practice is enabled.
  [F22 rollout](docs/releases/2026-10-13-recall.md).
  Earlier [weekly-habits rollout evidence](docs/releases/2026-10-12-weekly-habits.md) remains applicable.
  Earlier [word-reel rollout evidence](docs/releases/2026-10-12-word-reel.md) remains applicable.
  Earlier [copy/oval rollout evidence](docs/releases/2026-10-11-copy-cleanup.md) remains applicable.
  Earlier [loading/hero rollout evidence](docs/releases/2026-10-11-loading.md) remains applicable.
  Earlier [satisfaction rollout evidence](docs/releases/2026-10-11-satisfaction.md) remains applicable.
  Earlier [placement rollout evidence](docs/releases/2026-10-11.md) remains applicable.
  Earlier API release `662d17c` was verified October 9;
  [historical API rollout evidence](docs/releases/2026-10-09.md).
  F10 frontend release `89a6537` is pushed and verified deployed; see the
  [October 7 release record](docs/releases/2026-10-07.md).
  Code release `5fead73` is committed and pushed; the API is verified deployed.
  [October 4 rollout record](docs/releases/2026-10-04.md) records the frontend verification limit.
- **Curriculum:** October 3 hosted release published all seven Everyday revisions as
  v2 through normal console gates. All seven public payloads and 52 source records
  match the approved packages; prior v1 records remain superseded for restoration.
  October 13 F22 supersedes Everyday 1/3/6 with approved v3 revisions; the other
  four Everyday lessons remain v2. [Current audit evidence](docs/releases/2026-10-13-recall.md).
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

**Status:** Active — selected art deployed October 14 under F06.1.1; the broader
profile/turnaround scope remains unmade. The owner selected
the least-detailed cartoon treatment, specified Knafeh as a lighter-skinned Palestinian
Arab man with straight hair and no facial hair, then authorized use in the app.
The October 8 rejection of custom SVG-path character studies still applies.
**Current scope delivered:** review sample, seven matching app portrait states,
coffee/planning scenes and local integration with mobile/desktop, failure fallback,
decorative accessibility and real offline checks. The owner subsequently authorized
commit, push and deployment; `03bc3b8` reached Vercel Ready and the owner confirmed
the live artwork October 15. Portrait-size follow-up `9b585a2` is deployed and Ready.
Curriculum publication
is outside this artwork release.
**Outcome:** distinctive Fattoush/Knafeh designs with consistent, intentionally drawn
expressions; F06's working portrait system remains complete.
**Current result:** generated OpenAI image_gen raster art, explicitly attributed as
such. `characters/v2/` preserves original v1 assets. Known v1/v2 cast metadata uses
the selected v2 presentation without rewriting stored source records. PNG sources,
exact prompts/hashes and conversion/layout sources are supplied; character artwork
has no layered illustrator originals. Earlier CC0 Open Peeps and rejected studies
remain historical; no new third-party or Canva premium assets were used.
**Next:** profile/turnaround views remain from the broader design target; no current
app call site requires them. Further asset production/human illustration handoff
remain separate authorization scopes. The selected app artwork rollout and its
requested size refinement use the existing frontend workflow. No commission/contact/spending.
**Done when:** owner approves the designs; editable sources, authorship/rights and hashes
are recorded; neutral/attentive/encouraging/profile views remain consistent and legible;
mobile/desktop, fallback and offline rendering pass with unchanged written roles.
**Evidence:** [revised sample, provenance, size assessment and Canva link](docs/characters/fattoush-expressive-02/README.md),
[app integration, sources and verification](docs/characters/app-art-v2/README.md),
[earlier Open Peeps sample](docs/characters/canva-sample-2026-10-13.md),
[historical assessment](docs/characters/redesign-direction-2026-10-08.md).
**Delivery:** review sample saved separately in Canva; selected v2 app art/code/docs
were committed/pushed/deployed in `03bc3b8`. Original art is preserved. No content
publication. Broader real-device/assistive-technology
release gates remain under F18. Historical review assets were
committed/pushed in `662d17c`; preserve v1 assets and version future art separately.

### F06.1.1 Selected art integration

**Status:** Done — original art deployed October 14 as `03bc3b8`; owner confirmed
the live result October 15. Larger lesson/home-card portraits are deployed October 15
as `9b585a2`; production build and 12 focused checks pass.
**Scope delivered:** neutral/attentive/encouraging portraits for both characters,
welcoming Fattoush, oval coffee landing hero, relevant planning introductions,
welcome/console rendering, supported older cast metadata and offline precaching.
Written roles, recall hiding, retries and fixed lesson frame remain intact.
**Done when:** selected artwork serves existing app roles, originals remain preserved,
sources/hashes are recorded, mobile/desktop and image-failure checks pass, and older
downloaded packages plus every new art file work through a real offline reload.
All these bounded criteria are met; unused profile/turnaround views stay in F06.1.
**Evidence:** [implementation, 23 focused browser checks and screenshots](docs/characters/app-art-v2/README.md).
Production build passes. Thirteen landing/welcome, three lesson-frame and seven
character checks pass across final runs; all ten v2 assets fetch offline.
**October 15 size refinement:** lesson and home next-lesson portraits use 64px,
compact course portraits 44px and completion portraits 72px. Existing larger welcome
and console previews are retained. Production build and 12 existing focused checks
pass across the character/layout and Today/completion runs. No new tests or art assets.
**Next/delivery:** original art release `03bc3b8` reached Vercel Ready (deployment
`dpl_5dKSPFy9mB8MaTfV4ZwqmcQNFAGA`); owner visually confirmed October 15. Larger
portraits are pushed/deployed as `9b585a2` (Vercel Ready, deployment
`dpl_12TFheFLkQm6K5b18sjuZbc7Vi4R`), with the stable alias confirmed. Backend/content
remain unchanged. The follow-up was verified locally and by deployment metadata;
no automated live visual pass is claimed.

### F07 Landing page and app welcome

**Planned extension:** F07's delivered scope stays Done. The owner-requested
multi-language landing/wording/identity overhaul is tracked in
[F24.7](#f247-multi-language-wording-landing-and-visual-identity), with current
copy/art preserved until that implementation; no landing change occurred here.

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
**Next:** use [F28](#f28-alphabet-explorer) for the proposed shared letter/form/sound
explorer; scope remaining reading modules and track-specific assessments separately.
F15.2 is not a calibrated proficiency assessment or
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
**Next:** F17.7 weekly quests/forgiving habits are complete and deployed; F17.6
can-do progress/achievements is complete and deployed. F17.5 phrase anatomy/grammar remains
planned and needs its consequential rules defined before implementation; reminder delivery and the
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

**Status:** Done — bounded first unit, deployed October 13, 2026.
**Outcome delivered:** three Everyday conversations written-recall cards show state,
source version/dialect/register, dates, help/retries and historical attempts, with
per-target practice and an optional outcome achievement. Evidence stays device-local
and guest/account-separated; typed work does not assess listening or speaking.
**Approved policy:** an accepted first response without hint/model or retry demonstrates
independent written recall. Two distinct situations, with the second shown when review
is due at least 24 elapsed hours after the earlier independent response, demonstrate
again later. All three targets earn “Everyday responses — demonstrated again later.”
Deadlines are captured before rescheduling; early repetition/assisted retries/uncertain
answers cannot earn the achievement. Earlier F22 records without a deadline cannot
establish the later due-review state; legacy completions supply no can-do evidence.
**Completion evidence:** production build and 18 distinct policy/recall/scheduled-review
checks pass across focused runs; includes real typed → offline delayed review →
achievement, persistence/toggle/concurrent tabs, revisions/withdrawal, keyboard focus,
320px enlarged text/reduced motion and guest/account isolation. Mobile render inspected.
**Next/limit:** no remaining work in this local slice. Publication changes are unnecessary;
frontend deployment `7b80136` is Ready and live-verified. Real assistive-technology/device checks,
learner calibration and thirty-day outcomes remain F18 work. Cross-device evidence
sync and additional units/skills require separate scope.
**Depends on:** F22 metadata/attempts and F10 scheduling, using existing owner-approved
published packages; no new content, provider or backend migration.
**Evidence:** [behavior, policy, implementation and verification](docs/can-do-progress.md).
**Delivery:** application release `7b80136` is pushed on `main`, Vercel Ready and
live-verified October 13. [Rollout evidence](docs/releases/2026-10-13-can-do.md).
No new curriculum publication or API update; hosted F22 packages remain unchanged.

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
Quests/streaks independently defaulted off on October 12; guest/account history stays on this device.
On October 14, F27 changes the default for new habit states to on. Saved states are unchanged, and either switch can still be turned off.
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

### F20.1 Learned words page and Account spacing

**Status:** Done — implemented, pushed and deployed October 13, 2026.
**Scope:** move the existing F20 glossary onto its own learner route, linked from
Practice, preserving search, filters, teaching links, offline and scoped inclusion;
fix F15.1 Account form spacing, including selector/save/status separation and mobile goals.
**Done when:** standalone route, return/navigation/reload and existing glossary flows
pass; settings have clear spacing without mobile overflow; tested code is pushed and
Ready on the existing Vercel preview.
**Evidence:** [behavior and verification](docs/learned-word-glossary.md#october-13-page-and-account-spacing--f201),
[route/navigation checks](i-web/tests/navigation.spec.ts). Final production build and
all 14 glossary/settings/navigation checks pass, including four viewport widths.
**Next:** no remaining work in this bounded scope; broader F18 device/AT checks remain separate.
**Delivery:** application `04a4f4e` pushed to main and Ready on the existing Vercel
preview; live route, 56 existing entries, return link and Account spacing verified.
No new curriculum publication or API deployment.

### F20 Learned-word glossary

**Status:** Done — implemented October 8; pushed/deployed October 9, 2026.
**Scope delivered:** free learned-word glossary (now a separate page linked from Practice
under F20.1), populated only by completed
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

**Status:** Active — software built and frontend/API deployed October 15; content/release checks remain.
**Owner-selected scope:** one weekly YouTube video, film and song; broader Arabic
with individual dialect/register labels; Monday 00:00 UTC editions. Rentals/subscriptions
are allowed with clear labels, a free companion and no learning requirement.
**Implemented:** separate versioned media catalog/owner console, atomic exact-revision
approval/publication, scheduled visibility, archive/direct routes, Practice/Today entries,
safe publisher links, offline metadata, availability observations/suppression, withdrawal
and revalidated rollback. No media/player/lyrics rehosting or learning-progress credit.
**Next:** complete the actual playback/runtime/access/support/editorial review gaps in
four imported research drafts; verify real AT/devices; obtain exact owner publication
approval. The authorized application rollout is complete. Broader Arabic media
does not enable MSA/Quranic lesson publication or expand the beta curriculum promise.
**Done when:** all five child criteria pass, including real source/media checks,
owner-approved complete current/past editions, usable failure alternatives and honest
offline behavior. Draft content/software checks do not establish a completed release.
**Depends on:** actual permitted resources and human checks; exact owner publication
approval. No new provider, spending or creator contact is required by this software.
**Evidence:** [behavior, architecture, validation and verification](docs/cultural-watch-listen.md),
[content sources and exact review gaps](content/culture/README.md),
[original detailed plan](docs/cultural-watch-listen-plan.md).
**Delivery:** application `4545fea` pushed; frontend Vercel Ready and API healthy at
the exact revision. Live page/owner console, 14 existing table hashes/counts,
recordings and cookie-key preservation verified. Hosted media catalog is empty.
[Rollout evidence](docs/releases/2026-10-15-cultural-media.md). Four v1 drafts remain in the local SQLite database;
all 12 non-media tables retain identical logical row hashes/counts. No actual media
approval/publication. Application deployment does not complete the content gates. Build and all 37 API tests
passed; initial browser suite 106/107, then all 21 media/navigation/recall focused checks
passed after fixing the found recall focus race. No clean 107/107 rerun is claimed.

#### F21.1 Curation and first four collections

**Status:** Active — 12 research candidates across four draft editions plus three
replacement candidates are prepared; all four editions imported locally as v1 drafts.
**Scope:** four weekly video/film/song sets, separate film free companions and one
replacement per media type, with sources, labels, original prompts and text alternatives.
**Next:** resolve exact runtime/edition, playback, region/access/support and editorial
checks recorded in the source README. Unknown access/runtime deliberately fail approval.
**Done when:** all 12 primary records and three replacements have verified evidence
and human review dispositions; missing metadata and suitability decisions are resolved.
**Depends on:** actual source availability and human review; broader Arabic scope is settled.
**Evidence/delivery:** [manifest, import and specific gaps](content/culture/README.md).
No native-expert review, actual approval or publication claimed.

#### F21.2 Media catalog and publication console

**Status:** Done and deployed October 15.
**Delivered:** additive versioned catalog, owner/CSRF gates, JSON import/edit and preview,
validation, exact approval/publication, Monday UTC visibility, archive, audit, concurrency,
withdrawal and revalidated restoration. Entire three-slot editions publish atomically.
**Next:** none for this software slice; actual collection review/release stays under F21.1/F21.5.
**Done criteria met:** draft/future data privacy, stale/concurrent mutation protection,
owner workflow, unsafe/duplicate links, three-slot/free-companion rules and version
recovery pass API/browser checks. Media records are independent from lesson records.
**Evidence:** [implementation and verification](docs/cultural-watch-listen.md),
[service](i-api/Services/CulturalMediaService.cs), [API tests](i-tests/CulturalMediaTests.cs),
[console](i-web/src/CulturalMediaConsole.vue).
**Delivery:** `4545fea` frontend/API deployed, additive empty table and live owner
console verified. No real content publication. [Rollout](docs/releases/2026-10-15-cultural-media.md).

#### F21.3 Learner collections and offline metadata

**Status:** Done and deployed October 15; real AT/device release evidence remains F21.5.
**Delivered:** Practice tile, compact Today link, three media cards, separate film/
companion actions, dated archive/direct routes, safe external links and atomic public
metadata cache with withdrawn-detail reconciliation. Core lessons/progress stay independent.
**Next:** none for this software slice; verify actual publishers and assistive technology
before release. Disconnected metadata cannot be remotely revoked.
**Done criteria met:** 320/390/1280 layouts, 200% text, keyboard links, mixed direction,
reduced motion, offline reload/retry, empty/malformed states and withdrawal purge pass.
**Evidence:** [behavior/cache boundaries](docs/cultural-watch-listen.md),
[learner page](i-web/src/CulturalPicks.vue), [browser checks](i-web/tests/zy-cultural-picks.spec.ts).
**Delivery:** `4545fea` pushed/Vercel Ready; Practice entry, route, refresh and
correct empty-catalog state verified against the deployed API. [Evidence](docs/releases/2026-10-15-cultural-media.md).

#### F21.4 Availability upkeep and corrections

**Status:** Active — software workflow verified; actual editorial-cycle evidence pending.
**Delivered:** dated link checks, immediate audited suppression, corrected revisions,
withdrawal, rollback and reconnect tombstones. Suppression cannot silently substitute
another work or transfer old URL check evidence to a new destination.
**Next:** rehearse the real check/replacement cycle after F21.1's source gaps are resolved.
Optional learner reports remain deferred; no new retention policy is selected.
**Done when:** a real unavailable-item/replacement/recheck cycle has usable approved
alternatives and recorded owner handling; upkeep capacity and offline limits are explicit.
**Depends on:** accepted F21.1 content/replacements; F21.2/F21.3 software is available.
**Evidence/delivery:** [operations and tested synthetic scenarios](docs/cultural-watch-listen.md).
Software deployed; no real curation cycle or accepted replacement content yet.

#### F21.5 Verification and authorized release

**Status:** Active — local software checks complete; real content/accessibility/release gates open.
**Next:** inspect actual media/support, run real AT/supported-device checks, complete
owner review of exact revisions, then publish only with exact approval; the authorized application rollout and preservation
checks are complete.
**Done when:** the complete acceptance matrix has real-source/AT evidence, exact first
edition approval/publication and authorized web/API rollout/preservation/rollback records.
**Depends on:** F21.1/F21.4 completion and exact owner publication approval; application rollout is authorized.
**Evidence:** [full flow and exact test results](docs/cultural-watch-listen.md#verification-on-october-15).
37 API tests passed; 106/107 initial broad browser checks, then 21/21 final focused
checks after a recall focus-return race fix. Source checks and automated tests differ.
**Delivery:** frontend/API `4545fea` deployed with hosted preservation and live UI
checks. No actual content approval/publication. [Rollout evidence](docs/releases/2026-10-15-cultural-media.md).

### F22 Recall and recombine

**Status:** Done — implemented/verified October 12; deployed/published October 13, 2026.
Owner authorized push/deployment, selected the answer policy and approved the exact
six-situation package. Hosted API, publication and live Practice availability are verified.
**Implemented:** source-linked optional recall metadata/validation, typed Arabic/Arabizi
practice, independent-first/help/retry facts, F10-based due selection with reserved later
variants, atomic device persistence and version-aware human report cases/console resolution.
**Policy:** documented NFC/case/space/sentence-punctuation/Arabic-harakat normalization;
letters and meaningful word differences remain. Unknown answers are Unable to judge;
raw text is session-only unless voluntarily reported. [Details](docs/recall-and-recombine.md).
**Current next:** gather feedback on the deployed slice. Broader AT/device and learner-
outcome evidence remains under F18; additional authored targets need their own approval.
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
**Delivery:** frontend/API application release `6419f84` deployed; exact approved Everyday
1/3/6 packages published as hosted v3. Public payloads, 21 sources, audit history,
account/progress/asset preservation and enabled live Practice are verified October 13.
[Rollout record](docs/releases/2026-10-13-recall.md). Temporary SSH access was revoked
and local keys removed. [Programmatic deployment](deploy/README.md) remains available
after reusable credential setup; the owner selected the old workflow for this release.

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

**Status:** Active — owner authorized the entirety of F24 implementation October 15, 2026. The software is implemented and deployed; first-unit, real AT/input, observed-pilot and release gates remain.
**Outcome:** learners study Arabic, French and Khmer singly or in parallel in the
same English-language app. Arabic retains distinct Levantine/MSA/Quranic courses;
each course has separate placement, progress, review and content safeguards.
Shared course metadata, wording and visual identity also accommodate eventual
Portuguese and further languages without promising their curricula or release.
Reuse F01/F02/F03/F05/F10/F15.1/F20 rather than rebuilding delivered features.
**Next:** obtain reviewed F25.2/F26.2 first-unit packages and agree the expansion
device/pilot setup. Supplemental WebKit offline reload hits an internal engine error;
real Safari offline support remains unverified. Human screen-reader/input and observed learning evidence, exact content approval and a
separate beta decision remain. Do not resume deferred F18.1 or author new
courses under this foundation authorization.
**Done when:** all eight children pass; both first-unit packages work alongside Arabic
with correct language presentation and course accounting; old Arabic publications,
downloads, identities and pending progress survive the upgrade; supported-browser,
offline and real accessibility evidence is recorded. F24 does not complete the full
F25/F26 courses or the original Arabic beta gates.
**Depends on:** existing foundations; F25.2/F26.2 packages for complete-flow checks;
agreed queue policy and supported-browser/device matrix.
**Evidence:** API 39/39 and final focused Chromium 18/18 pass; earlier full Chromium 114/115 exposed the now-fixed recall Escape defect. WebKit 10/16 retains an offline engine error. [Implementation, policy and verification](docs/multi-language/README.md),
[pilot protocol](docs/multi-language/pilot-protocol.md),
[release template](docs/multi-language/release-manifest.template.json),
[title options](docs/multi-language/brand-options.html). Existing Arabic IDs, publications,
download records and scoped pending completions remain compatible. The owner approved
whole-session allocation/secondary rotation and requested a deployment candidate.
**Delivery:** owner-authorized application `f515f43` is pushed/deployed October 16 to
the existing web/API preview. Vercel Ready, exact API revision, all 15 table hashes,
13 published payloads and assets are verified. [Rollout and recovery](docs/releases/2026-10-16-multi-language.md).
Real course publication, human pilot and beta expansion remain separate.

#### F24.1 Language and course records with compatibility

**Status:** Done · deployed — additive compatibility and identity preservation implemented.
**Scope:** stable language/course IDs, language tags, script direction, font,
pronunciation-help type, audio locale and published-content availability. Recommend
one Arabic language with three courses, plus distinct French and Khmer courses.
Version target-text/help fields to replace Arabic-only naming without rewriting
immutable Arabic publications or losing old downloads and queued completions.
**Next:** None for the local compatibility slice; use the recovery procedure before an authorized rollout. Hosted preservation/live recovery belongs to F24.6.

**Done when:** old/new packages and offline caches load; settings/guest/account
isolation survive; pending completions retain their meaning and remain idempotent;
upgrade/recovery checks pass against a preserved copy of existing state.
**Depends on:** F01/F02/F03/F15.1/F20; production database choice remains unresolved.
**Evidence:** [implementation and verification](docs/multi-language/README.md).
**Delivery:** application `f515f43` deployed; no new course publication. [Rollout](docs/releases/2026-10-16-multi-language.md).

#### F24.2 Language-aware learner presentation

**Status:** Active — course-aware software deployed; real device/AT and approved model-audio evidence remain.
**Scope:** course-driven direction, language tags, fonts, help, audio controls,
teaching, exercises, reviews, glossary and placement. Availability follows actual
published packages. Retain the fixed lesson frame, free help/retries and mute choice.
**Next:** Agree and run the real-device/input/screen-reader matrix with approved first-unit text/audio; specifically verify Safari offline reload/reconnection after the WebKit internal-error diagnostic. Keep French/Khmer planned until their publication gates pass.

**Done when:** Arabic RTL and French/Khmer LTR work without clipped text or broken
focus; downloaded fonts/audio work offline; missing model/device voices have honest
fallbacks; switching courses preserves a started lesson's language/state. Keyboard,
screen-reader and non-listening/non-speaking paths support core study.
**Depends on:** F24.1; language-specific checks in F25.3/F26.3.
**Evidence:** [implementation and verification](docs/multi-language/README.md).
**Delivery:** application `f515f43` deployed; no new course publication. [Rollout](docs/releases/2026-10-16-multi-language.md).

#### F24.3 Parallel study settings and daily queue

**Status:** Done · deployed — owner approved the recommended policy October 15; whole-session queue implemented.
**Scope:** select courses, choose a primary course and retain 5/10/15/30-minute total
goals; allocate due review/new learning independently and persist guest/account
choices with existing offline conflict handling. No combined proficiency score.
**Approved policy:** whole sessions, roughly 60% primary when useful, UTC-date
secondary rotation (three primary/two secondary slots per five days for a five-minute
goal), one bounded due-review session first within each allocation, visible whole-lesson
overruns and omitted/unavailable courses, plus unrestricted manual study. [Examples](docs/multi-language/README.md#queue-policy-approved-october-15).
**Next:** None for the agreed software policy. Monitor first-unit/pilot findings before changing the policy; no cross-device review-history sync is claimed.

**Done when:** agreed examples pass online/offline with stable ordering, bounded
rotation so no course starves, no silent substitution/duplicate rewards and visible
overruns; removing/re-adding a course preserves its history and started lessons.
**Depends on:** F24.1/F15.1/F10. Cross-device review-history sync is a separate scope.
**Evidence:** [implementation and verification](docs/multi-language/README.md).
**Delivery:** application `f515f43` deployed; no new course publication. [Rollout](docs/releases/2026-10-16-multi-language.md).

#### F24.4 Multi-language curriculum console and validation

**Status:** Done · deployed — course profiles, console workflow, withdrawal and rollback implemented.
**Scope:** per-language draft/import/source/audio checks, review dispositions, owner
approval, publication, rollback and audit. Reject mismatched language/audio/segment
records and unresolved critical linguistic or rights defects. Retain Quran integrity
and MSA/Quranic publication gates until their own controls exist; enabling French
and Khmer must not bypass those gates or establish expert-review claims.
**Next:** Use actual source/review definitions and owner approvals for further candidates. Engineering fixtures cannot publish. F26.2.1 separately permits only the five exact owner-authorized unreviewed text-only preview packages; normal gates remain for other content.

**Done when:** valid drafts pass their profiles; invalid/unauthorized publication
fails; rollback restores exact releases; public/download endpoints serve only
approved versions with factual source/reviewer status and accepted-answer rationale.
**Depends on:** F24.1/F03 and agreed course source/review definitions.
**Evidence:** [implementation and verification](docs/multi-language/README.md).
**Delivery:** application `f515f43` deployed; no new course publication. [Rollout](docs/releases/2026-10-16-multi-language.md).

#### F24.5 Mixed-language verification and pilot

**Status:** Active — automated mixed-language checks implemented; observed pilot not run.
**Scope:** Arabic + French + Khmer settings, placement, lessons, glossary, due review,
download, offline reload/completion and reconnection. Cover identity isolation,
interrupted downloads, withdrawals, stale packages and switching; verify actual
mobile text/input, keyboard and screen-reader behavior.
**Next:** Agree expansion devices/participants/rubric and provide reviewed first units with model audio. Execute the linked protocol; real AT and human learning evidence remain required.

**Done when:** meaningful API/browser checks and real-device evidence pass; a small
observed mixed-language pilot records versions, immediate/delayed retrieval, help,
attempt counts and fix/retest dispositions. Access/progress blockers prevent release.
Do not resume owner-deferred F18.1 without authorization.
**Depends on:** F24.1–F24.4, first-unit text/audio/support under F25/F26 and pilot setup.
**Evidence:** [implementation and verification](docs/multi-language/README.md).
**Delivery:** application `f515f43` deployed; no new course publication. [Rollout](docs/releases/2026-10-16-multi-language.md).

#### F24.6 Expansion release decision and delivery

**Status:** Active — application deployed; real first-unit release and beta decisions remain gated.
**Scope:** truthful course depth/variety/review/provenance display, versioned release
manifests, rollback, hosted verification and correction/support handling. Landing
and shared copy changes are explicitly scoped in F24.7; no billing, interface
localization or paid hosting/provider signup is included.
**Recommendation:** verify both first units internally, then run a small language
pilot before deciding whether either joins the first-100 Arabic beta. Retain original
Arabic gates; keep unavailable courses factual until approved publication.
**Next:** Complete real-device/offline and first-unit recovery evidence, then decide exact content/cohort/beta inclusion after the observed pilot. Code rollout is complete.

**Done when:** authorized rollout records web/API/content versions, preservation of
existing data/caches, live study/offline checks and a withdrawal/rollback rehearsal;
no unverified outcome, CEFR-level or reviewer claims appear publicly.
**Depends on:** F24.5, F24.7, F24.8 and approved per-language release scope; F18 if beta is widened.
**Evidence:** [implementation and verification](docs/multi-language/README.md), [candidate and recovery](docs/multi-language/deployment-candidate.md).
**Delivery:** application `f515f43` deployed; no new course publication. [Rollout](docs/releases/2026-10-16-multi-language.md).

#### F24.7 Multi-language wording, landing and visual identity

**Status:** Active — shared copy, landing Languages section and Khmer accents deployed.
**October 16 follow-up:** owner reported the unavailable-course notice crowding the welcome heading; a 24 px bottom gap is implemented. Production build and direct 320/1280 px checks pass (24 px measured gap, no horizontal overflow); frontend `a7f8f4a` is deployed (Vercel Ready), with the 24 px gap also measured on the live site.
**Outcome:** Ismi welcomes Khmer and future-language learners through shared English
copy and course discovery while retaining its Arabic flagship and Palestinian roots.
**Scope:** landing hero support, Languages section, course statuses/examples/FAQ,
course-aware welcome, settings, help/audio, placement, glossary/progress, accessible
names, errors/empty states, console messages and search/social/PWA descriptions.
Retain Ismi and “Speak with the people you love”; keep Arabic/Quran messaging in
Arabic contexts. Add Cambodian-inspired red/blue surfaces beside the existing
green/red/gold/charcoal/white, with course accents separate from feedback semantics.
Retain oval border-free hero, current characters, concise copy and stable lesson UX.
Design for French and eventual Portuguese without advertising unpublished courses.
Explore a three-script brand title: English / Arabic / Khmer. Retain the existing
Ismi/اسمي identity and review the Khmer rendering before use; exact spelling,
transliteration/translation choice and responsive arrangement remain design work.
**Next:** Run real screen-reader/mobile checks. The owner selected title A (current Ismi/اسمي) October 15; no Khmer form is adopted before linguistic review.

**Done when:** shared wording works without Arabic prerequisites; Arabic-specific
labels remain precise; Khmer entry reaches its actual course or factual planned
state; metadata and installed-app copy agree; old section links, returning entry,
welcome preferences and Arabic study survive. Contrast, keyboard/screen-reader,
enlarged-text and mobile/desktop checks pass; colors never act as the only signal.
No fixture, future Portuguese course, audio/review status or outcome is overstated.
The title exploration has an owner-reviewed outcome; any adopted Khmer form is
linguistically checked, readable at mobile widths, correctly shaped and accessible
alongside RTL Arabic/LTR English. Keep a compact Ismi title for constrained metadata.
**Depends on:** F07/F17.3 baseline; F24.1/.2/.4 course metadata/presentation/availability;
approved Khmer example/content before showing that example or enabling study entry.
**Evidence:** [implementation and verification](docs/multi-language/README.md), [title options](docs/multi-language/brand-options.html), [original design context](docs/khmer-course-and-brand-expansion.md).
**Delivery:** application `f515f43` deployed; no new course publication. [Rollout](docs/releases/2026-10-16-multi-language.md).

#### F24.8 Prominent language and course switching

**Status:** Active — prominent selector, course filtering and scoped resume deployed.
**Outcome:** learners immediately see which language/course is active and how to
switch between Arabic and Khmer without visiting Account or hunting through Courses.
**Scope:** a persistent, labeled selector in the mobile app header and desktop
header/sidebar, with the current language and course plus an explicit “Switch” cue.
Recommend two taps from a main page: open selector → choose Arabic or Khmer.
Arabic retains its separate Palestinian Levantine/MSA/Quranic courses; restore the
last usable course within that language, with clear choices for the others.
Future French/Portuguese entries use the same selector when actually available.
**Next:** observed discoverability and real AT/device checks remain. F24.8.1 switching/teaching-resume, shared characters and language palette fixes are deployed; five Khmer previews are published under F26.2.1.

**Done when:** switching is apparent on Today, Courses, Practice, Progress and Words;
the selected course drives each page's content, help/audio labels, review and progress.
Arabic ↔ Khmer takes at most two taps for already available courses from a main page;
the selection survives reload and offline use of downloaded content. A started lesson
keeps its course/state: switching never relabels it or loses work, and resume is clear.
Separate placement, progress, pending completions and account/guest scope survive.
Switching the viewed course does not silently change the primary course or daily
allocation. Planned/undownloaded courses show factual states and cannot fall back
silently to Arabic. Labels, focus, touch targets, keyboard/screen-reader operation
and small-screen layouts pass; an observed first-unit task checks discoverability.
**Depends on:** F24.1/.2 metadata/presentation, F24.3 settings integration, F24.4
availability, F25/F26 published candidates and F24.5 verification. Khmer integration
does not depend on French publication; enable each language as it becomes available.
**Evidence:** [implementation and verification](docs/multi-language/README.md), [title options](docs/multi-language/brand-options.html), [original design context](docs/khmer-course-and-brand-expansion.md).
**Delivery:** application `f515f43` deployed; no new course publication. [Rollout](docs/releases/2026-10-16-multi-language.md).

##### F24.8.1 Switching continuity and shared presentation

**Status:** Done — implemented and deployed October 16.
**Scope:** Today retains manual entry to published lessons outside daily allocation;
startup selection and saved teaching positions cannot be overwritten by loading races;
Fattoush/Knafeh remain shared guides without changing authored participant roles;
landing cards use explicit, distinct course palettes with readable text/controls.
**Done when:** repeated switching, teaching/practice resume, offline reload, primary
settings independence, authored-role compatibility and mobile/desktop contrast/layout
checks pass; deployed behavior is recorded separately from local checks.
**Verification:** production build and all 23 focused Chromium checks pass, including
repeated switching, teaching/practice/offline resume, settings independence, existing
authored character roles and actual five-package Khmer publication flow. 320/1280 px
palettes pass text/control contrast and layout checks. Package regeneration/diff pass.
**Next:** none for this bounded fix. Real AT/device and observed pilot checks remain
under F24.5/F24.8.
**Delivery:** frontend `0623273` pushed; Vercel Ready on the existing development alias.
Live repeated Arabic/Khmer switching, manual Today entry, loaded shared guides, all
five course entries and distinct landing colors pass. No API/content publication change.
**Evidence:** [behavior and verification](docs/multi-language/switching-and-identity.md).

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
The planned [F28.4](#f284-french-explorer-pack) supplies the alphabet explorer;
it does not complete the wider starting check or authorize French authoring.
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

**Status:** Active — owner authorized F26 implementation October 16 and selected the
recommended Cambodian/Phnom Penh reference, twelve-unit/sixty-lesson target and
conversation-first optional script pathway. Prepare drafts now; designate a fluent
Khmer reviewer before full publication. The owner subsequently authorized application
deployment and explicitly superseded that rule for the exact five first-unit
unreviewed text-only development previews, now published under F26.2.1.
No accepted review or cleared-rights attestation is inferred.
Hiring or provider spend remains unauthorized.
**Outcome:** English-taught Khmer for adult beginners/false beginners communicating
with partners, family and friends. Conversation and gradual script learning support
each other; optional pronunciation help remains available without requiring reading
mastery before beginning conversation. Keep the same free learning floor.
**Agreed target depth (October 16):** twelve units/weeks, five new 5–7-minute lessons per unit
(60 new lessons), plus varied review and one checkpoint per unit. Add a separate
optional script/sound pathway; exact module count is an F26.1/F26.3 decision.
Weeks guide study pace, not delivery or a promise under a shared daily budget.
The exact reading inventory/help and observed outcome rubric still need review;
these are targets, not demonstrated learner outcomes.
**Proposed outcomes:** at 30 days with 15 minutes devoted to Khmer daily, handle a
two-to-three-minute guided greeting/family/food/plan exchange, extract four requested
facts from a slow 30–45-second studied-topic dialogue and recognize an agreed set
of taught words in script. At twelve units, complete a five-minute guided social/day-out
scenario and read short taught-topic messages with optional help. Define the exact
reading inventory/help in the rubric; promise neither unrestricted literacy nor
proficiency certification. Distinguish conversation/listening/reading evidence.
**Next:** designate fluent Khmer review and disposition the five exact first-unit
candidates, sources/rights, provisional help and eight-expression reading inventory.
Obtain reviewed human audio; verify real input/AT/Safari offline and the agreed
first-unit pilot before bulk authoring. Published preview download/offline completion/
reconnection passes in Chromium automation; real device/AT/Safari and learning evidence
remain open. French is not a prerequisite.
**Done when:** all six children pass; agreed units and script/sound modules are
source-linked, validated, linguistically reviewed, owner-approved and published;
audio, baseline guided speaking, offline/accessibility and observed outcomes pass.
The shared landing and course entry meet F24.7, with honest availability and Khmer
presentation while Arabic/Palestinian branding remains visible; F24.8 makes
Arabic–Khmer switching prominent and preserves independent course state.
First-unit or script-rendering success does not complete this parent.
**Depends on:** F24, approved sources/audio rights, named Khmer linguistic review
route and separately approved speech/AI setup for automated feedback.
**Evidence:** [inspection](docs/multi-language-feasibility.md),
[expanded milestones, first-unit briefs and shared brand/copy plan](docs/khmer-course-and-brand-expansion.md),
[Unicode segmentation guidance](https://www.unicode.org/reports/tr29/#Word_Boundaries)
and [W3C draft Khmer layout gap analysis](https://www.w3.org/TR/khmr-gap/).
Unicode identifies tailored word/line-boundary needs; the W3C draft is a browser-check
reference, not curriculum authority. [First-unit implementation/evidence](docs/khmer/README.md),
[packages/review sheets](content/khmer/meet-01/README.md),
[source/rights register](docs/research/khmer-course-sources.md). No human recordings,
committed reviewer or learner outcome evidence exists.
**Delivery:** application `30ea724` pushed/deployed October 16 to the existing
web/API development preview; Vercel Ready and exact API revision verified. Hosted
versions 24–28 are all published v1 through owner preview approval/publication.
All 13 Arabic payloads, learner tables, source records, recordings and keys are
preserved. Local records 27–31 remain private drafts. API 41/41, production build
and 10 focused browser checks pass for this release.
[Publication/recovery](docs/khmer/text-preview-publication.md),
[exact hosted versions and audit](content/khmer/meet-01/publication.json).
Parent remains Active for review/audio/pilot and remaining course criteria.

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

**Status:** Active — owner selected recommended variety/depth/conversation-first
reading direction October 16; exact inventory/help/source approvals and named fluent
reviewer remain. Draft preparation is authorized while review is pending.
**Agreed direction:** contemporary Cambodian Khmer with a Phnom Penh-based reference
model; the actual speaker is not yet identified. Label regional/register differences
only with evidence.
Select one consistent learner pronunciation-help convention with a reviewer; do
not present proposed romanization as authoritative spelling.
**Next:** name the fluent review route and approve exact source/rights, v0 help and
reading-inventory dispositions. [Primary-source register](docs/research/khmer-course-sources.md)
records NIU access without reuse clearance, MSU noncommercial limits and historical
FSI evidence; none is silently declared an approved commercial curriculum foundation.
No reviewer hire/contact/availability is assumed.
**Done when:** course brief, reading inventory, rubric, source/rights register and
review route are agreed; uncertain linguistic/cultural claims are excluded.
**Depends on:** owner course-definition decisions and verified source access/rights.

#### F26.2 Khmer first unit

**Status:** Active — five unreviewed candidates authored; hosted records 24–28
published as v1 on October 16 under the owner's explicit text-only development-preview
exception. Exact package/source matches and preservation of Arabic publications,
learner data and assets pass. F26.2.1 is Done; full first-unit review/audio/pilot remain.
**Scope:** five authored greeting/introduction/repair lessons, contextual recall,
varied review and checkpoint; separate source-linked script, help, meaning, accepted
answers and audio. Do not mechanically translate the French lesson sequence.
The [five lesson briefs](docs/khmer-course-and-brand-expansion.md#first-unit-meet-someone-and-keep-the-exchange-going)
cover greeting, names, personal details, communication repair and an integrated exchange.
**Next:** review [the five candidates](content/khmer/meet-01/README.md), including
original script/help compositions and contextual answer rationales; disposition exact
sources, text, segments and human audio before full reviewed release.
Use first-unit pilot findings before full authoring. Draft software structure passes;
source approval and linguistic/rights review remain pending.
**Done when:** packages/authored segments pass F24.4; address/register/help and
answer rationales are checked; changed-context recall and accessible offline study
can be verified. Text, audio, approval and publication states remain distinct.
**Depends on:** F26.1 and F26.3's agreed text/segment rules; F24.4 and F26.5 audio.

##### F26.2.1 Owner-authorized text-only development preview

**Status:** Done — implemented, deployed and all five published October 16.
**Scope delivered:** exact five on the existing development preview with prominent
unreviewed/text-only labels; pending review/rights and missing human audio retained.
Normal gates remain for other/changed content; beta gates are unchanged.
**Completion evidence:** owner-only, CSRF-protected exact-package approval/publication;
hosted records 24–28, all v1; live course and lesson labels; automated download,
offline completion/reconnect, withdrawal/rollback and placement exclusion. All 13
Arabic payloads, learner/source tables and assets preserved. API 41/41, build and
10 focused browser checks pass; human AT/Safari/learning evidence is not inferred.
**Next:** none for this preview publication. Continue F26.1/F26.2 review/audio/pilot.
**Delivery:** API/web `30ea724` deployed, Vercel Ready; five previews live.
**Evidence:** [policy, verification and recovery](docs/khmer/text-preview-publication.md),
[exact versions/audit](content/khmer/meet-01/publication.json).

#### F26.3 Khmer script, sounds, input and starting check

**Status:** Active — optional exact-expression script practice implemented October 16,
with skippable help and no score/gate. The candidate manifest proposes eight taught
expressions; phonics/sound modules, agreed inventory and real input/AT remain open.
**Scope:** skippable placement and optional staged script/sound modules linked to
actual lesson words. Reviewed modules cover consonant/vowel patterns, signs and
syllable combinations without an alphabet memorization gate. Separate reading,
listening and support-choice evidence; never infer pronunciation from text answers.
The planned [F28.3](#f283-khmer-explorer-pack) supplies individual-letter and
combination exploration; existing expression cards do not fulfill that scope.
**Next:** reviewer selects exact consonant/vowel/sound modules, inventory and help
rules; verify real device input/selection/AT and approved audio offline. Draft
script examples pass keyboard, 320/1440 px and 200% text checks using the existing
font/lesson frame. Authored answer segments recombine exactly; no whitespace splitting
or inserted spaces. The existing course-scoped starting check needs published content.
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

**Status:** Active · preparation only — twelve exact candidate recording scripts and
three speaking branch briefs are in the [manifest](content/khmer/meet-01/review-manifest.json).
No human recordings, permissions or provider suitability are established.
**Scope:** permitted reviewed human model recordings, exact text/version mappings,
speaker/variety labels and transcripts; recommend multiple speakers. Controlled
branches and optional record/replay use reviewed responses and intelligibility/
intent targets, with text alternatives and the free baseline floor.
**Next:** linguistically approve exact scripts, then obtain speaker consent/rights and
reviewed recordings. Assess actual Khmer recognition/feedback with reviewed samples
and explicitly approved privacy/cost terms. Advertised
support or French/Arabic results do not establish Khmer suitability.
**Done when:** full agreed audio coverage passes linguistic/playback/offline checks;
automated feedback is verified for taught scenarios, handles uncertainty and meets
no-training/minimum-data/deletion rules. Raw recordings are deleted after feedback;
improvement retention needs separate informed consent. If no acceptable provider
exists, record the gap and request a bounded fallback/scope decision; self-recording
does not by itself fulfill automated assessment.
**Depends on:** approved F26.2/F26.4 text, F24.2/F24.4 and provider/privacy decisions.

#### F26.6 Khmer pilot, publication and release evidence

**Status:** Active · protocol prepared — [task/rubric and evidence template](docs/khmer/README.md#first-unit-review-and-observation-protocol)
prepared October 16; no pilot, human AT check or release has run.
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
and F24.5/F24.6/F24.7/F24.8 for full release. Early/full stages have separate evidence manifests.

### F27 Feature discoverability and navigation

**Status:** Done locally — owner authorized October 14, 2026; completion criteria met October 15 in this checkout.
**Outcome:** learners can reach review, weekly quests, streak, can-do progress and word search without scrolling through long Today or Practice screens. Feature tiles use a restrained green/red/gold/charcoal accent so each feature is recognizable. New learners see weekly quests and the forgiving streak immediately, and can turn either off.
**Scope:** five bottom tabs (Today, Courses, Practice, Progress, Words). Account moves to the mobile header profile button and the desktop sidebar footer. Practice becomes a short tile hub linking to Review, Checkpoints, Recall and Lesson practice. Progress holds streak, weekly quests, can-do cards and habit switches. Today shows a compact streak / this week / review-due strip. Words is a tab with search at the top. New habit states default both switches on; existing saved states are unchanged.
**Next:** none; optional live click-through on mobile.
**Done when:** the five tabs and focused pages work on mobile and desktop; each Practice tile opens its page; the Today strip links to Progress or starts due review; search is one tap from any tab; new guests have both habits on and a saved off state survives reload; keyboard names include counts; color is not the only signal; build and focused checks pass.
**Depends on:** F05/F10 review, F17.6 can-do, F17.7 habits, F20 glossary.
**Evidence:** [behavior and verification](docs/feature-navigation.md). October 15: full Playwright suite 100 passed; API tests 32 passed.
**Delivery:** frontend `3d87ff4` pushed to `main` and Vercel Ready October 15; API not redeployed.

#### F27.1 Mobile-friendly back navigation


**Status:** Done and deployed October 16, 2026 — implemented October 15; separate from delivered F27.
**Outcome:** page-back controls are recognizable, comfortable to tap and consistently
placed rather than appearing as plain underlined anchor text.
**Scope:** audit every page/sheet with a return action, including Back to landing,
Practice subpages, cultural archive/detail, Words/context, Account and curriculum
views. Use a shared leading chevron/arrow and concise destination label with a
button-like surface or outline, generous spacing and at least a 44×44 CSS-pixel
target. Preserve links for navigation and buttons for actions/dialog dismissal.
**Implemented:** shared `BackControl.vue` across landing returns, Practice/cultural
pages, Account returns, lesson/review/recall completion, owner console and welcome
card navigation. Anchors retain explicit destinations; action buttons retain their
handlers. Targets are at least 48×48 px with wrapping labels, focus and forced-colors
support. Account adds a Today return. Curriculum retains its underlying page and
restores opener focus. Recall queues Escape during evidence saves and prevents late
feedback focus after closure. No new lesson-resume policy is introduced.
**Next:** none for this scope; real-device/AT beta evidence remains under F18.
**Done when:** every applicable back action uses the shared treatment and visible
destination; small screens/enlarged text avoid clipping and crowded adjacent controls.
Direct/deep-linked entry has a reliable in-app destination rather than blindly
calling browser history. Normal browser back/history, keyboard/focus and offline
routes work; lesson exit/resume and explicit landing return remain available.
Nested pages return to the correct parent and preserve supported context/filters;
RTL teaching text does not reverse the surrounding English navigation unexpectedly.
**Depends on:** F07/F27 and existing routes; no Khmer content/provider dependency.
**Evidence:** [behavior, previews and verification](docs/mobile-back-navigation.md),
[October 16 rollout](docs/releases/2026-10-16-back-navigation.md). The isolated
production build passes. Focused browser run: 52/53 passed; the one cultural-refresh
check passed when rerun alone. All return/lesson/preview/glossary/review/recall checks
passed. Additional 320/390/1280 px touch, 200% text, focus/history, offline and console
checks pass; the original recall keyboard scenario also passed three consecutive runs.
**Delivery:** application `5875e6d` pushed to `main`; Vercel deployment
`dpl_BkpLCeiZ5TfK2j6DNahM5ibeCLDJ` is Ready and assigned to the existing development
URL `https://ismi-arabic.vercel.app`. Release source matches the verified isolated
snapshot. No API deployment or curriculum publication; unrelated course edits stay local.

### F28 Alphabet explorer

**Status:** Active · application deployed October 16, 2026. Owner authorized
implementation, push and deployment, then accepted private Khmer/French packs
pending decisions/review, no microphone, unscored repeat-aloud and local evidence.
**Outcome:** learners can explore letter appearance, hear names and contextual
sounds, practice recognition/repeat-aloud production, and study two or three useful
example words per basic letter in Arabic, Khmer and French. Arabic shares script
forms while retaining separate Levantine/MSA/Quranic examples, audio and evidence.
**Implemented:** Practice/Courses/placement entry, search/grid/detail, exact words
and forms with Unicode-safe target markers, four practice types, separate versioned
local evidence/resume, verified atomic audio/font downloads, availability/withdrawal
reconciliation and owner-only versioned validate/approve/publish/rollback/audit flow.
**Next:** obtain exact inventories,
language/help/review/source/rights decisions and human recordings before approving
real packs. MSA/Quranic publication remains blocked pending track-specific controls.
**Done when:** F28.1–F28.6 pass, including full agreed basic inventories in all five
course contexts, applicable forms, separate name/sound treatment, cleared examples
and recordings, reviewed answer explanations, accessible practice and deterministic
offline behavior. Synthetic test fixtures and an unavailable-content deployment do
not complete F28. The inventory-only previews under F28.1.2 do not satisfy those full-pack criteria.
**Depends on:** F24/F27/F03; F09/F13/F14/F25.1/F25.5/F26.1/F26.5 for content/audio.
Supports F15/F25.3/F26.3 without completing their wider placement/module criteria.
**Evidence:** [implementation, contract and remaining gates](docs/alphabet-explorer.md),
[original design](docs/alphabet-explorer-plan.md). All 47 API tests, production build,
12 alphabet browser checks and 21 navigation/course/palette/placement regressions pass.
**Delivery:** application `ab2d456` pushed/deployed to the existing API/Vercel
preview. Five pinned inventory-only records are published as v1 under the explicit
unreviewed/text-only exception. Public labels/checksums pass and all unrelated hosted
data/assets are preserved. [Exact records/recovery](docs/alphabet-inventory-publication.md).
No reviewed full pack or human-audio publication is claimed.

#### F28.1 Shared explorer, content model and gates

**Status:** Active · application deployed; real content/access evidence remains.
**Scope:** grid/detail UX, versioned inventory/course packs, validation, owner console,
public manifests and authorized recording access; reuse shared course metadata.
**Next:** shared application is implemented/tested; accept actual inventory/form/content decisions and reviewed evidence before pack approval.
**Done when:** forms, context-dependent sounds and unavailable packs render honestly;
drafts/assets remain private and source/review/rights gates are enforced with audits.
**Depends on:** F24/F27/F03; [design and acceptance detail](docs/alphabet-explorer-plan.md).

##### F28.1.1 Shared application candidate

**Status:** Done · application deployed October 16.
**Scope:** shared explorer/owner contract, four activities, device-local versioned
history/resume and atomic verified offline downloads, independent of content acceptance.
**Done when:** actual API-to-browser fixture checks prove privacy/workflow, exact
text, activities, identity/course separation, offline replacement and withdrawal.
**Evidence:** all 47 API tests, build, 12 alphabet browser checks and 21 focused
regressions pass; [behavior and limits](docs/alphabet-explorer.md).
**Delivery:** `5bbf861` pushed/deployed; live entry/API/privacy pass and hosted data
preservation is verified. [Rollout](docs/releases/2026-10-16-alphabet.md). No real pack publication.
Parent F28.1/F28.5/F28.6 remain open for accepted content and real device/AT/Safari checks.

##### F28.1.2 Inventory-only preview publication

**Status:** Done · five v1 previews published October 16.
**Scope:** publish the five pinned Arabic-context/Khmer/French inventories as
unreviewed text-only previews, without fabricated review, audio, words or grades.
**Authorization:** owner said “just publish them” after being informed reviewers and
recordings were absent; this supersedes the earlier reviewed-only selection for
these exact development previews. Normal full-pack and beta gates stay in place.
**Next:** normal reviewed full packs and human audio remain with the parent; do
not broaden the exact preview exception to changed text or beta content.
**Done when:** exact five v1 manifests and unreviewed/no-audio labels are public,
missing controls remain unavailable, downloads pass and unrelated data is preserved.
**Evidence:** [candidate files, policy, checks and rollout](docs/alphabet-inventory-publication.md).
**Delivery:** `ab2d456` pushed/deployed; all five exact IDs are published as v1,
revision 3. Public notices/checksums and preservation of all 16 unrelated tables/
assets pass. [Exact hashes/audits](content/alphabet/inventory-preview/publication.json).

#### F28.2 Arabic explorer packs

**Status:** Planned.
**Scope:** shared script forms and three separate Levantine/MSA/Quranic teaching packs.
**Next:** pin basic letters/support inventory and exact course examples/audio sources.
**Done when:** each pack meets agreed coverage, applicable joining forms, names/sounds,
2–3 cleared words per basic letter and reviewed clips/rationales; Quran text remains
unchanged and track-specific review/rights/publication restrictions are enforced.
**Depends on:** F28.1, F09/F13/F14; [pack gates](docs/alphabet-explorer-plan.md).

#### F28.3 Khmer explorer pack

**Status:** Planned.
**Scope:** consonants, series, vowels/signs and common subscript combinations tied
to familiar words, without a mandatory alphabet prerequisite.
**Next:** fluent reviewer selects exact inventory/help; record text/audio rights separately.
**Done when:** full agreed coverage has accepted forms, contextual sounds, examples,
recordings and rationales; combining text/highlights preserve the approved strings.
**Depends on:** F28.1, F26.1 and applicable F26.5 recording decisions;
supports F26.3. [Pack gates](docs/alphabet-explorer-plan.md).
The exact-five F26.2.1 preview exception does not cover these new records.

#### F28.4 French explorer pack

**Status:** Planned.
**Scope:** upper/lowercase letters plus separately grouped accents/cedilla/ligatures
and selected common sound/spelling combinations.
**Next:** resolve F25.1 variety/review route and pin inventory, words and audio rights.
**Done when:** full agreed coverage distinguishes names, contextual sounds and silent
letters with accepted examples/audio/rationales and exact accent-preserving text.
**Depends on:** F28.1, F25.1 and applicable F25.5 recording decisions;
supports F25.3. [Pack gates](docs/alphabet-explorer-plan.md).

#### F28.5 Practice, downloads and separate evidence

**Status:** Active · application deployed; real content/access evidence remains.
**Scope:** shape/listening recognition, word spotting, unscored repeat-aloud practice,
complete offline packs and per-identity/course/version evidence.
**Next:** application behavior passes synthetic API/browser checks; verify complete real packs and supported real browsers after content acceptance.
**Done when:** offline reload/practice and identity separation pass; incomplete updates
retain prior complete packs; audio stops on switches; viewed course, started lessons
and primary allocation stay independent. Listening/self-check results are distinct.
**Depends on:** F28.1 plus each ready content pack; [gates](docs/alphabet-explorer-plan.md).

#### F28.6 Accessibility, verification and authorized delivery

**Status:** Active · application deployed; real content/access evidence remains.
**Scope:** per-pack content/access/offline checks, real device/AT evidence and separately
authorized publication/deployment with recovery records.
**Next:** collect real device/AT/Safari and per-pack content/audio evidence. Application delivery and automated checks pass; linked above.
**Done when:** small screens/enlarged text, keyboard/focus, mixed direction, actual
AT, supported-browser offline/reconnection and content privacy/withdrawal checks
pass; exact approved content and any authorized releases have linked evidence.
**Depends on:** F28.1/F28.5 and each affected pack; [matrix](docs/alphabet-explorer-plan.md).
Ready packs can proceed separately; unfinished packs leave the parent open.

### F29 Privacy policy and beta version

**Scope:** a public privacy page at `#/privacy` describing current behavior (guest
local storage, account fields, essential cookies only, no voice/AI processing yet,
Vercel/alwaysdata hosting, deletion by request until F16) and a single app version
sourced from `i-web/package.json` (`0.0.1`), shown as "Beta 0.0.1".
**Evidence:** linked from the landing footer and Account; production build passes.
**Limits:** update the policy before F11 speaking, F16 deletion or any analytics
ship; it is not legal review. Commit/deploy needs owner authorization.

## Selected future implementation order

The owner selected research priorities **1, 2, 4, 5 and 6** on October 12:
**F22 → F23 → F17.5 → F17.6 → F17.7**. F17.5 authoring can support F22 sooner;
F17.6 needs independent F22 evidence, and F17.7 uses approved available activities.
[Detailed future-agent plan](docs/learning-engagement-plan.md).

F17.7 was subsequently authorized, completed and deployed with explicit owner-selected
habit policies; F22 is completed, deployed and published; F17.6 is completed/deployed
under the October 13 authorization and approved evidence rules. F23/F17.5 remain
Planned, awaiting implementation authorization. Assessment, rewards and provider choices are not silently settled
by the planning selection. Existing F09/F12/F19 work and the
owner-deferred F18.1 rehearsal retain their statuses; beta gates remain requirements.
Research priority **3 (record/replay/compare)** stays unselected research, without a
new implementation task. Existing F09 recordings/F11 guided speaking remain open.

The new language roadmap has its own dependency order: **F24 foundation → F25/F26
first units and support → mixed-language pilot → remaining units → release decision**.
It does not replace the selected Arabic engagement order above. No relative priority
between these workstreams was inferred from adding plans. The owner subsequently
authorized the entirety of F24 on October 15 and F26 draft implementation on October
16. F25 authoring remains separate; Khmer bulk authoring follows reviewed first-unit
and pilot evidence.
Course definition/source work can proceed independently when authorized; full course
authoring should follow the respective first-unit evidence. No completion dates are
committed without agreed scope, content/reviewer availability and measured first-unit effort.
F24.7 shared landing/wording/identity can be designed alongside the first units;
enabled course entry and public claims must follow actual approved availability.
Portuguese is eventual expansion direction, not a new implemented course or beta commitment.

F28 implementation, push and deployment were subsequently authorized October 16.
The owner accepted the recommended first-version defaults and private Khmer/French
packs pending choices/review. Shared application/practice/offline is deployed.
Remaining order: reviewed complete Levantine/Khmer packs → separately gated
MSA/Quranic/French packs → per-pack verification and any authorized delivery.
[Alphabet explorer plan](docs/alphabet-explorer-plan.md).

## Recent planning changes

- **October 16, 2026 F28:** shared application and five owner-requested inventory-only
  previews are deployed as `ab2d456`, all v1 with honest unreviewed/text-only labels.
  API 49/49, build, 18 focused browser checks, live HTTP/checksums and all unrelated
  table/asset preservation pass. F28.1.2 Done; reviewed word/sound packs and actual
  human/device/AT/Safari evidence remain with the parent.
  [Publication](docs/alphabet-inventory-publication.md),
  [exact audits](content/alphabet/inventory-preview/publication.json).

- **October 16, 2026 F24.8.1:** owner reported disappearing lessons during language
  switches, confirmed Fattoush/Knafeh across languages and requested distinct landing
  colors. Bounded fixes are deployed as `0623273`; build and all 23 focused browser
  checks pass. Live switching, five Khmer entries, shared guides and colors verified;
  [evidence](docs/multi-language/switching-and-identity.md). No curriculum text change.

- **October 16, 2026 F26:** owner authorized implementation and selected Cambodian/
  Phnom Penh, twelve units/sixty lessons, optional script and draft-now/fluent-review-
  before-publication. Five first-unit candidates imported locally (27–31), with
  truthful pending review/rights, private preview and optional script support.
  API 40/40, build and 11 distinct focused browser checks pass across runs; all
  13 local published payloads preserved. [Evidence](docs/khmer/README.md).
  Owner-authorized application `57b7898` is pushed/deployed: Vercel Ready, exact API
  revision and all 15 hosted table hashes/13 published payloads/assets preserved.
  [Rollout](docs/releases/2026-10-16-khmer-drafts.md). Reviewer/audio/pilot and units
  2–12 remain. Subsequent lesson-publication request: all five imported privately
  into hosted console (24–28); strict validation reports missing review/rights
  records. Owner explicitly approved the exact-five exception; application `30ea724`
  deployed and all five v1 previews published, retaining pending review/rights and
  no human audio. F26.2.1 Done: API 41/41, build, 10 focused browser checks and live
  course/lesson labels pass; 13 Arabic publications and existing data/assets preserved.
  [Publication evidence](docs/khmer/text-preview-publication.md).

- **October 16, 2026 F24:** owner authorized push/deployment. Application `f515f43`
  is deployed to the existing web/API preview, with exact revision, all 15 hosted
  table hashes, 13 published payloads and assets preserved. Vercel Ready; live
  selector/planned Khmer/Arabic lesson entry verified. [Rollout](docs/releases/2026-10-16-multi-language.md).
  Title A and queue policy are approved. F24 stays Active for reviewed units,
  real device/AT/pilot, Safari offline and beta/content decisions.

- **October 16, 2026 F27.1:** application `5875e6d` is pushed/deployed on the existing
  Vercel development site (Ready; alias confirmed). The scoped frontend release
  preserves unrelated local course work. Build and all focused checks pass across
  the initial run and one cultural-refresh retry; mobile/desktop/offline and console
  returns are verified locally. No API/content change. [Rollout](docs/releases/2026-10-16-back-navigation.md).
