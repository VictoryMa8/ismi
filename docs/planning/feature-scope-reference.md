# Feature scope and acceptance reference

Reorganized October 17, 2026 from the former long-form roadmap. This file preserves
feature contracts, policy detail and links to dated evidence. **It is not a status,
priority, authorization or next-work document.** Read [ROADMAP.md](../../ROADMAP.md)
for current work states, next actions, delivery and owner decisions. Historical
results are dated evidence, not a fresh check or authority to publish/deploy.

Stable IDs and full acceptance boundaries are preserved. The October 17 F28 scope
revision remains in effect; moving text here does not shrink F24/F26 or any beta gate.

### F01 Core study and offline progress

**Scope delivered:** Today/Courses/Practice/Account, structured evaluation,
explanations/free retries, fixed lesson frame, optional help, reduced motion and
local muted sound controls. Complete lesson/audio downloads, offline reload and
completion, and idempotent queued reconnection preserve progress.

**Evidence:** [client](../../i-web/src/App.vue), [offline storage](../../i-web/src/offline.ts),
[course-loop checks](../../i-web/tests/course-loop.spec.ts), [layout checks](../../i-web/tests/lesson-layout.spec.ts).
Prior results are in the [implementation history](../../docs/next-stage-handoff.md).
This does not establish full accessibility/browser support or spontaneous speaking.

### F02 Guest and account baseline

**Scope delivered:** guest entry; registration/login/logout; HttpOnly cookie
sessions; durable SQLite account progression, with guest isolation.

**Evidence:** [API](../../i-api/Program.cs), [account progression](../../i-api/Services/AccountProgressService.cs),
[account tests](../../i-tests/AccountApiTests.cs), [runtime instructions](../../README.md#run-locally).
Recovery, confirmation, deletion and external identity are outside this baseline.

### F03 Levantine curriculum console

**Scope delivered:** owner-gated drafts, source records, deterministic validation,
approval, publication, rollback and audit history; public endpoints serve published
versions. Source-bearing WAV upload and verified offline playback are supported.

**Evidence:** [console](../../i-web/src/CurriculumConsole.vue),
[publishing service](../../i-api/Services/CurriculumPublishingService.cs),
[curriculum tests](../../i-tests/CurriculumApiTests.cs), [recording checks](../../i-web/tests/recordings.spec.ts).
MSA/Quranic publication is intentionally blocked; no real audio ships.

### F04 First-unit guided teaching packages

**Scope delivered:** seven source-linked Everyday conversations packages with
43 explicit phrase cards, context-based recall before reveal, concise explanations
and contextual practice. Historical packages and publication snapshots are preserved.

**Evidence:** [packages and manifest](../../content/levantine/everyday-01/revisions/guided-teaching/README.md),
[teaching checks](../../i-web/tests/lesson-teaching.spec.ts),
[seven-lesson checks](../../i-web/tests/zz-everyday-lessons.spec.ts).
Done means authored/validated, not approved, published, timed with learners or expert-reviewed.

### F05 Manual review and checkpoints

**Scope delivered:** mixed published-context review, mistake explanations, free
retries and completed-unit checkpoints with recall before reveal and help/first-answer
reporting. Versioned guest/account-scoped history works offline on the current device.
It neither awards duplicate completions nor claims mastery.

**Evidence:** [behavior and recorded verification](../../docs/review-and-checkpoints.md),
[queue](../../i-web/src/review.ts), [review checks](../../i-web/tests/review.spec.ts).
Scheduled intervals and cross-device review-history sync were not implemented.

### F06 Recurring character support

**Scope delivered:** Fattoush/Knafeh portraits, explicit authored participant roles,
shared lesson/review rendering, console mapping inspection, offline assets and
fallbacks. Compatibility handles older names without rewriting stored publications.

**Evidence:** [character guide](../../docs/characters/character-guide.md),
[metadata packages](../../content/levantine/everyday-01/revisions/characters/README.md),
[character checks](../../i-web/tests/zx-characters.spec.ts), [rename tests](../../i-tests/CharacterRenameTests.cs).
Narrative expansion and final art/package approval are outside this implementation scope.

### F06.1 Character art redesign

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

**Done when:** owner approves the designs; editable sources, authorship/rights and hashes
are recorded; neutral/attentive/encouraging/profile views remain consistent and legible;
mobile/desktop, fallback and offline rendering pass with unchanged written roles.

**Evidence:** [revised sample, provenance, size assessment and Canva link](../../docs/characters/fattoush-expressive-02/README.md),
[app integration, sources and verification](../../docs/characters/app-art-v2/README.md),
[earlier Open Peeps sample](../../docs/characters/canva-sample-2026-10-13.md),
[historical assessment](../../docs/characters/redesign-direction-2026-10-08.md).

### F06.1.1 Selected art integration

**Scope delivered:** neutral/attentive/encouraging portraits for both characters,
welcoming Fattoush, oval coffee landing hero, relevant planning introductions,
welcome/console rendering, supported older cast metadata and offline precaching.
Written roles, recall hiding, retries and fixed lesson frame remain intact.

**Done when:** selected artwork serves existing app roles, originals remain preserved,
sources/hashes are recorded, mobile/desktop and image-failure checks pass, and older
downloaded packages plus every new art file work through a real offline reload.
All these bounded criteria are met; unused profile/turnaround views stay in F06.1.

**Evidence:** [implementation, 23 focused browser checks and screenshots](../../docs/characters/app-art-v2/README.md).
Production build passes. Thirteen landing/welcome, three lesson-frame and seven
character checks pass across final runs; all ten v2 assets fetch offline.

**October 15 size refinement:** lesson and home next-lesson portraits use 64px,
compact course portraits 44px and completion portraits 72px. Existing larger welcome
and console previews are retained. Production build and 12 existing focused checks
pass across the character/layout and Today/completion runs. No new tests or art assets.

### F07 Landing page and app welcome

**Planned extension:** F07's delivered scope stays Done. The owner-requested
multi-language landing/wording/identity overhaul is tracked in
[F24.7](../../ROADMAP.md#f247-multi-language-wording-landing-and-visual-identity), with current
copy/art preserved until that implementation; no landing change occurred here.

**October 11 owner refinement:** Done and deployed — border-free oval hero with both
faces visible. Build and four responsive landing/welcome checks pass; mobile/desktop
renders inspected. [Preview and evidence](../../docs/landing/README.md#current-owner-revision).
Deployed in `eada137`; [rollout evidence](../../docs/releases/2026-10-11-copy-cleanup.md).

**Scope delivered:** mobile/desktop landing page with preserved owner copy and
border-free hero; entry into the real app; once-per-browser skippable three-card
welcome; explicit return links; stable portrait sizing and reload/section navigation.
The isolated sample is retired. No invitation form or enforced beta gate exists.

**Evidence:** [current behavior and prior checks](../../docs/landing/README.md),
[entry shell](../../i-web/src/AppShell.vue), [welcome](../../i-web/src/AppWelcome.vue),
[landing checks](../../i-web/tests/landing.spec.ts), [navigation checks](../../i-web/tests/navigation.spec.ts).
The implementation notes record a production build, 24 backend tests and 36 distinct
browser checks across full/focused runs; later owner refinements have targeted coverage.
The October 2 code release is deployed; live landing, welcome, dashboard and lesson
loading passed. See the [rollout record](../../docs/releases/2026-10-02.md).

**October 11 reconciliation:** owner requested removal of the hero image border.
Current source/asset and live rendered image already have no border or outline;
superseded instructions and documentation were corrected. No app code change or
rollout required. [Inspection evidence](../../docs/landing/README.md#current-owner-revision).

### F08 First-unit revision release

**Outcome delivered:** learners receive the approved guided/character revisions,
including the casual check-in and the two instruction/role corrections.

**Evidence:** [exact packages and hashes](../../content/levantine/everyday-01/revisions/pilot-release/review-manifest.json),
[published IDs/versions and comparison](../../docs/pilot/release-2026-10-03/hosted-publication.json),
[console audit evidence](../../docs/pilot/release-2026-10-03/hosted-audit.json).
All seven serve `curriculum-levantine-everyday-01-0N-v2` (N = 1–7);
7/7 public payloads and 52/52 source records match the approved packages.

### F09 Reviewed Levantine recordings

**Outcome:** core prompts use permitted, human-reviewed real speaker audio.

**Done when:** the selected batch has accurate transcripts, speaker/dialect labels,
source permission and review evidence; authorized publication and verified offline playback.

**Depends on:** assets and human review; [recording preparation](../../docs/pilot/recordings.md).
F19 is the prioritized interim synthetic-audio task and cannot complete this human-audio scope.
Silence fixtures and device voice previews cannot complete this item. Partial batches
must report coverage; the beta needs full core-audio coverage checked under F18.

### F09.1 First recording batch preparation

**Evidence:** 8/8 transcripts/IDs match the candidate; planned coverage is 8/56
unit practice prompts, actual reviewed coverage 0/56. No assets, contacts, rights,
compensation or human review are supplied by preparation. F09 remains open.

Supporting references: [Batch and handoff](../../docs/pilot/release-2026-10-03/recording-batch-01.md), [machine-readable checklist](../../docs/pilot/release-2026-10-03/recording-batch-01.json).

### F10 Scheduled review

**Scope delivered:** due review in Today (selected tracks) and Practice, using
published contexts and existing device-local guest/account history. Up to six
unique exchanges per session; recall before optional help; manual practice and
retries remain freely available. Review adds no duplicate completion or mastery claim.

**Approved policy:** the owner selected 1, 3, 7 and 14 elapsed days. A correct first
answer without translations/choices advances at the due instant; mistake/help
resets to one day. Early successful practice and retries do not advance intervals.
Changed versions restart scheduling; legacy records begin with a one-day interval.

**Evidence:** [policy, implementation and verification](../../docs/scheduled-review.md),
[scheduler](../../i-web/src/reviewSchedule.ts), [browser checks](../../i-web/tests/scheduled-review.spec.ts).
Production frontend build, 27 API tests and all 49 standard browser tests pass;
11 final focused checks pass after the date-label/context selection refinement.
Offline reload, due boundaries, help/mistakes, duplicate contexts, version changes,
withdrawals and identity isolation are covered.

Supporting references: [Release evidence](../../docs/releases/2026-10-07.md).

### F11 Guided speaking

**Outcome:** a controlled scripted conversation provides useful online feedback.

**Done when:** authorized branches assess appropriate meaning/intelligibility,
feedback works, raw recordings are promptly deleted, and text/accessibility alternatives
and provider failure paths are verified. Baseline practice stays free.

### F12 Levantine course expansion

**Outcome:** twelve weeks of substantive urban Palestinian content, with useful
Jordanian variants labeled.

**Done when:** the full target is source-linked, validated, owner-approved/published,
downloadable and backed by observed timing/recall evidence. Fixtures do not count
as curriculum depth; guided choices do not prove the thirty-day speaking outcome.

### F12.1 Make a plan together

**Scope delivered:** three follow-on lessons, course positions 8–10, using established
first-unit language in new planning/clarification contexts. Eighteen dialogue turns,
fifteen teaching cards and eighteen contextual practice steps have transliteration,
optional help, explicit roles, explanations, retry hints and source records.

**Outcome targeted:** propose a shared activity, ask for missing time, and correct/
confirm day, time and activity in a guided exchange. This is not observed learner evidence.

**Completion evidence:** [packages, readable reviews and checks](../../content/levantine/plans-02/README.md),
[exact hashes and phrase origins](../../content/levantine/plans-02/review-manifest.json),
[local import verification](../../content/levantine/plans-02/local-import.json).
Twenty-five API tests pass; the focused mobile Chromium walkthrough, combined
first-unit/new-unit browser run (2 tests) and production frontend build pass. Validation, draft privacy, publication gate, course ordering,
offline completion and reconnect persistence are covered. Real-device/accessibility,
reviewed audio, owner wording review and measured lesson timing remain open.

### F12.2 Transliteration and pronunciation audit

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

**Done when:** inventory coverage is recorded; each flagged form has a source-backed
disposition; justified corrections are draft-validated and reviewed; unresolved
speaker/audio questions are explicit. Text checks alone do not verify pronunciation.

**Depends on:** approved-source constraints and reviewed Palestinian pronunciation
for audio claims. Revised package approval/publication and recording-script/hash
reconciliation are separate gates; preserve published release snapshots.

**Evidence:** [audit findings](../../docs/research/levantine-transliteration-audit-2026-10-08.md),
[correction candidates, reviews and verification](../../content/levantine/everyday-01/revisions/transliteration-audit/README.md).

### F13 MSA course

**Outcome:** four weeks of MSA with script/help support and timeless adapted listening.

**Done when:** source-linked course/audio packages pass appropriate validation and
publication gates, support offline accessible study and have comprehension evidence.
The current three-track dashboard is not evidence that an MSA course exists.

### F14 Quranic course

**Outcome:** four weeks of comprehension-first Quranic study within adopted source boundaries.

**Done when:** unchanged canonical text and separate provenance-bearing translations,
morphology/audio are integrity-checked; console review/publication controls exist;
approved lessons and offline/accessibility checks cover the intended direct-meaning outcomes.
Never generate or silently normalize canonical text, or invent qualified reviewer approval.

Supporting references: [source research](../../docs/research/quran-api-research.md).

### F15 Personal study plan and placement

**October 12 expansion:** the owner authorized roadmap plans for French/Khmer and
parallel language study. F24 extends F15.1's multi-track foundation; F25/F26 define
the new courses. [Inspection evidence](../../docs/multi-language-feasibility.md).
F15's remaining Arabic placement/bootcamp scope stays open. No new implementation
or beta inclusion is inferred from the planning authorization.

**Outcome:** selectable tracks/primary track, 5/10/15/30-minute goals, separate progress,
and short skippable track-specific placement with bootcamp recommendations.

**Done when:** selected goals/tracks drive the queue and persist as agreed; per-track
placement and applicable reading/sound modules work without a combined Arabic score.

### F15.1 Personal study settings

**Scope delivered:** guest-accessible Account controls for 5/10/15/30-minute goals,
selected tracks and a primary track. Guest preferences persist on device; account
preferences persist in SQLite with revision-checked offline synchronization and
explicit conflict resolution. Settings/dashboard caches are identity-scoped.
Today derives a deterministic queue of whole published lessons from the selections;
unavailable tracks remain labeled and do not receive substitute lessons.

**Allocation:** initial recommended assumption is 60% primary, rounded up, with the
remainder split equally in stable track order; no separate owner policy confirmation
is claimed. One selected track receives the entire goal. Goals never block study.

**Evidence:** [behavior, persistence and verification](../../docs/personal-study-settings.md),
[settings controls](../../i-web/src/StudySettings.vue), [planner](../../i-web/src/studyPlan.ts),
[account service](../../i-api/Services/StudySettingsService.cs),
[browser checks](../../i-web/tests/study-settings.spec.ts). Twenty-seven API tests,
ten focused browser checks and the production frontend build passed.

### F15.2 Placement starting point

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

**Evidence:** [behavior, policy and checks](../../docs/placement-starting-point.md),
[component](../../i-web/src/PlacementCheck.vue), [selection/policy](../../i-web/src/placement.ts),
[browser checks](../../i-web/tests/placement.spec.ts). Production build, all 29 API tests,
four final placement checks and eight existing study-settings/navigation checks pass.
Offline reload/retry, help/wrong-answer recommendations, skip persistence, identity
isolation, withdrawn-content handling, keyboard and 320px layout covered. Mobile
question/result renders inspected; real AT and learner calibration remain open.

Supporting references: [Rollout record](../../docs/releases/2026-10-11.md).

### F16 Account recovery and deletion

**Outcome:** confirmation/recovery and account/data deletion are usable for the beta.

**Done when:** agreed recovery/confirmation/deletion flows work end to end, including
relevant progress/provider data and failure paths, with verified privacy behavior.
External identity remains optional unresolved work, not a condition of F02 completion.

### F17 Learning support and gamification

**Outcome:** searchable grammar references, meaningful mastery/achievements/XP,
optional forgiving streaks and opt-in reminders with categories/quiet hours.

**Done when:** agreed subfeatures are usable and verified, reward learning without
trivial farming, preserve free explanations/retries and honor opt-out/quiet hours.
No hearts, leagues, guilt or paid streak repair. Billing is outside the beta.

### F17.1 Learner satisfaction

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

**Evidence:** [implementation and verification](../../docs/learner-satisfaction.md),
[original UI findings and proposal](../../docs/learner-satisfaction-proposal.md).

Supporting references: [Rollout evidence](../../docs/releases/2026-10-11-satisfaction.md).

### F17.2 Dashboard loading feedback

**Scope delivered:** visible startup and refresh feedback; no misleading
empty/guest/offline dashboard during startup; navigation remains available;
cached offline plans and uncached failure/retry settle correctly. Reduced motion
preserves status text without spinner movement. The landing hero's rounded picture
edge was removed at that rollout, with zero border/radius and no outline/shadow; artwork
and landing wording are preserved. A later F07 owner refinement changes the image
to a border-free oval, deployed in `eada137`.

**Evidence:** [behavior and verification](../../docs/dashboard-loading.md), production
build and 20 distinct targeted Chromium checks pass across focused runs.

Supporting references: [live verification](../../docs/releases/2026-10-11-loading.md).

### F17.3 Interface copy cleanup

**Scope delivered:** removed decorative teaching/welcome/completion quips,
repeated loading explanations, builder/checkpoint subtitles and duplicate
review/settings status. Useful instructions, answer feedback, provenance,
privacy and offline/error notices remain. Landing wording is preserved and
the oval hero is deployed.

**Evidence:** [exact removals and verification](../../docs/interface-copy-cleanup.md).
Production build and 31 targeted Chromium checks pass; loading, teaching and
completion screenshots inspected. F18 real AT/browser gates remain open.

Supporting references: [live verification](../../docs/releases/2026-10-11-copy-cleanup.md).

### F17.4 Loading word reel

**Scope delivered:** green/gold slot-style loader cycles six source-linked
Levantine words through transliteration → Arabic → meaning. Includes keyboard
pause/resume, hidden-document pause, a still reduced-motion triplet, separate
screen-reader loading status and a fixed-height reel. Startup and compact refresh
remain truthful and never delay ready content.

**Evidence:** [behavior, source records and verification](../../docs/loading-word-reel.md),
production build and nine distinct targeted Chromium checks pass across runs.
Mobile/enlarged text and real-time Arabic rendering inspected. F18 gates remain open.

Supporting references: [live rollout evidence](../../docs/releases/2026-10-12-word-reel.md).

### F17.5 Phrase anatomy and grammar reference

**Outcome:** optional phrase explanations connect natural/literal meaning, labeled
chunk functions, specific culture/register guidance and searchable grammar references.
Extend F04's existing chunks/notes and F20 context links rather than duplicate them.

**First scope:** six approved Levantine phrases, two reusable grammar patterns and
three source-linked situational usage notes; teaching/feedback/reference navigation
and offline access. Optional colors always have equivalent text labels.

**Done when:** all selected records are validated, approved/published and linked from
their teaching contexts; reference search/back navigation and downloaded access work;
literal glosses and usage claims are reviewed; keyboard, screen-reader, enlarged
Arabic and RTL/LTR rendering work without relying on color. Record local/hosted
verification separately; no expert-review claim without actual evidence.

**Depends on:** F03/F04/F20, approved sources/content and publication approval.

**Evidence:** [expanded behavior and checks](../../docs/learning-engagement-plan.md#f175-phrase-anatomy-and-grammar-reference);
existing baseline [teaching](../../i-web/src/LessonTeaching.vue) and [glossary](../../docs/learned-word-glossary.md).

### F17.6 Can-do progress and outcome achievements

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

**Depends on:** F22 metadata/attempts and F10 scheduling, using existing owner-approved
published packages; no new content, provider or backend migration.

**Evidence:** [behavior, policy, implementation and verification](../../docs/can-do-progress.md).

Supporting references: [Rollout evidence](../../docs/releases/2026-10-13-can-do.md).

### F17.7 Weekly learning quests and forgiving habits

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
On October 14, F27 changed both new-state defaults to on. The October 18 F27.3 revision turns weekly activities off for new learners and hides them under an optional Progress control; streak tracking stays on and grace is silent. Saved choices remain unchanged.
Stable activity IDs prevent retry/reload/reconnection credit duplication.

**Verification:** production TypeScript/Vite/PWA build and 29 targeted Chromium
checks pass, including eleven F17.7 checks. Goals, missing content, completed-task
preservation, partial sessions, Monday/DST/timezone/grace boundaries, returning,
offline/reload/reconnect, identity isolation and storage errors are covered.
Keyboard, roles/status labels, doubled text, mobile/desktop and persistent mute
with reduced motion are verified. Real assistive-technology and supported-browser
release checks remain under F18; no learner-outcome evidence is inferred.

**Depends on:** F15.1 goals/queue, F05/F10 practice, F17.1 feedback; F22/F23 supply
optional task types as delivered, not a requirement to invent unavailable activities.

**Evidence:** [implementation, selected rules and verification](../../docs/weekly-learning-habits.md),
[focused checks](../../i-web/tests/learning-habits.spec.ts),
[original plan](../../docs/learning-engagement-plan.md#f177-weekly-learning-quests-and-forgiving-habits).

Supporting references: [Rollout evidence](../../docs/releases/2026-10-12-weekly-habits.md).

### F18 Invite-only beta readiness

**Outcome:** a free adult English-language invite-only first-100 beta after a smaller pilot.

**Done when:** AGENTS.md release gates pass; target curriculum/audio/speaking scope
is delivered; account lifecycle and invitation controls work; content reports create
versioned review cases with appropriate quarantine/audit handling; real assistive-technology
and supported-browser offline checks pass; no critical Quran text/provenance/rights/meaning
defects remain; an observed smaller pilot supports opening the cohort.

**Evidence to collect:** [pilot kit](../../docs/pilot/README.md), [preflight](../../docs/pilot/preflight.md),
target app/content revisions, issue resolutions and owner release decision.
Development-preview deployment and automated keyboard tests alone cannot complete this item.

### F18.1 First-unit observed rehearsal

**Outcome:** observe whether a target false beginner can complete the revised unit,
understand feedback and retrieve expressions without visible choices.

**Done when:** both sessions are recorded anonymously against app/content versions;
actual lesson times, interface versus language help, immediate and delayed recall,
and offline behavior are reported with attempts/denominators; the top findings have
fix/retest dispositions and an explicit next-pilot decision. Progress loss or a
core access blocker prevents widening testing until fixed and retested.

**Depends on:** F08, intended test setup and owner-arranged participation. Real audio
can progress under F09; a text rehearsal cannot establish listening/pronunciation
quality. Owner authorized preparation and evidence-led fixes on October 3; participant
contact and spending remain separate. The exact F08 content/art approval is complete.

**Evidence:** [existing pilot kit](../../docs/pilot/README.md),
[version-sensitive script](../../docs/pilot/session-script.md),
[preflight](../../docs/pilot/preflight.md), [October 3 checks](../../docs/pilot/release-2026-10-03/README.md):
24 API tests, 3 Chromium tests (including all-seven offline flow), 1 WebKit online
touch unit walkthrough and production build passed. WebKit offline emulation failed
with a matching upstream report; no Safari offline or real AT pass is inferred.
One learner supplies formative evidence only;
F18 and the thirty-day outcomes remain open after this child is complete.

### F19 Chatterbox phrase audio

**Outcome:** improve robotic/incorrect device speech with saved,
reviewable synthetic clips, initially eight exercise prompts in lesson 1.

**Done when:** a reproducible batch workflow (provider/model identified, saved output
hashes retained), complete synthesis provenance,
explicit synthetic labeling, eight accepted draft prompt mappings and focused
playback/offline/validation checks are complete, with actual owner listening review
recorded. Report unresolved pronunciation verification honestly. Unacceptable or
unavailable samples leave the scope incomplete; do not equate generation with quality.

**Depends on:** F08 approved text; F09.1 prompt IDs; usable local runtime and model;
permissioned reference material if required. F18.1 remains deferred. No paid service
or hiring is included, and F09's eventual human-audio requirement is unchanged.

**Evidence:** [local feasibility and audition](../../docs/chatterbox-audition-2026-10-03.md),
[measurements/hashes/review](../../docs/chatterbox-audition-2026-10-03.json),
[generator/setup](../../tools/chatterbox/README.md). Six real MPS outputs (three phrases,
two variants), five passing
generator checks and offline resume verification. Owner confirms the revision
retains pronunciation errors; no clips accepted or native review established. Full-batch/provenance integration remains.

Supporting references: [Azure preparation](../../tools/azure-speech/README.md).
October 17 evidence: F0 resource created and post-deployment tier verified in
Safari; bounded [Azure runner](../../tools/azure-speech/synthesize.py) and seven
[offline checks](../../tools/azure-speech/test_audition.py). Six real clips generated
with [exact hashes/provenance](../../docs/azure-audition-2026-10-17.json); local browser
playback entered the playing state. Owner listening reports material pronunciation
errors in feminine “amle” and “biddik”; no clips accepted for integration. Exact
voice attribution was not supplied. The next audio direction remains unresolved.
Mocked test WAVs are separate fixtures. Credentials and actual clips remain local.
Owner subsequently authorized the correction experiment: sixteen new clips for
the two problem phrases, both voices, plain normal/vowels normal/vowels slow/IPA
normal. [Correction provenance and hashes](../../docs/azure-correction-audition-2026-10-17.json)
and [bounded runner](../../tools/azure-speech/correct.py) preserve synthesis hints
separately from the unchanged source text. Nine offline checks pass; real phoneme
requests succeeded and a phoneme clip entered browser playback. All correction
clips await owner listening acceptance; biddak/biddik target reconciliation is flagged.
Subsequent owner feedback accepts the **biddak tirtāḥ** phoneme pronunciation
(voice unspecified) but hears **shū ʿāmle** as **shoo am**. Six additional
[per-word IPA ending probes](../../docs/azure-ending-audition-2026-10-17.json)
were generated using [the bounded ending runner](../../tools/azure-speech/endings.py).
Ten offline checks pass. New amle clips await listening; existing biddak WAVs
are preserved, with no inferred exact voice selection or publication authority.
Owner next selected male **word-open-e** as closest but still heard **amel**.
[Cluster/alias evidence](../../docs/azure-cluster-audition-2026-10-17.json) records
three nearly identical IPA cluster probes followed by three materially different
synthesis-only spelling aliases from [the male-only runner](../../tools/azure-speech/cluster.py).
Twelve offline checks pass. Alias candidates await listening; no amle clip is accepted.
Owner subsequently selected male **Spelling hint B / final e approximation** for
continued audition. [Eight current-source lesson-one draft mappings](../../docs/azure-lesson-one-audition-2026-10-17.json)
pin the F22 approved recall package, preserve selected amle and existing male biddak
audio, and add four new unique male clips using [the bounded lesson runner](../../tools/azure-speech/lesson_batch.py).
Thirteen offline checks and all eight local mapping/file hashes pass. New clips and
exact biddak voice selection await owner review; no final character voice assignment,
app integration, full-unit generation, publication or deployment is inferred.
Owner subsequently called all other current clips pretty good but rejected e01-02's
missing feminine ending; optional lighter m in e01-08 was requested with explicit
permission to keep its original. [Four repair/polish candidates](../../docs/azure-polish-audition-2026-10-17.json)
from [the bounded runner](../../tools/azure-speech/polish.py) preserve all source text
and previous assets. Fourteen offline checks pass. E01-02 repair selection remains
required; whole-word +15% rate is an optional experiment, not m-only duration control.
Owner then selected **male lighter** and allowed **female lighter** as fallback.
[The exact selected eight-mapping asset package](../../docs/azure-selected-lesson-one-2026-10-17.json)
and [offline selection exporter](../../tools/azure-speech/selected_package.py) preserve
six unique WAVs, all source text/roles and qualified owner listening acceptance.
Eight selected mapping hashes and ZIP-relative assets pass; this does not establish
PWA offline behavior. Application synthetic provenance/console integration and
playback/offline gates remain required; assets are not imported as human recordings.
No publication, redistribution-rights acceptance, native review or F09 human-audio
completion is inferred from the selected draft package.
Owner then authorized local app/console integration. The original bounded local
contract is satisfied: [synthetic metadata/validation, labels and private draft](../../docs/f19-synthetic-audio.md)
with [exact integration evidence](../../docs/azure-local-draft-integration-2026-10-17.json).
Eight selected mappings/six WAVs are saved through normal owner endpoints in an
isolated local database; draft validation passes and rights errors block approval.
55 API tests, 14 Python checks, frontend build and five focused browser flows pass.
Actual selected audio plays in the saved preview; real-device/AT gates remain F18.

#### F19.1 Synthetic audio rights and preview release

**Contract:** verify applicable exact Azure resource/terms and evidence permitting
playback/offline redistribution; retain honest voice, model, listening and rights
provenance. Obtain owner acceptance and explicit exact release authority before
committing/pushing/deploying/publishing where required. Preserve target database,
existing publications/assets and rollback evidence; use ordinary console gates.
Complete only after the authorized application and exact audio package are delivered
and target playback/download/rollback checks pass. A selected local draft or successful
test-only publication cannot satisfy this release contract. No beta inclusion,
Palestinian native review or F09 human-audio completion follows.

**Evidence:** [F19 local candidate and pending rights](../../docs/f19-synthetic-audio.md).

### F20 Learned-word glossary

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

**Evidence:** [behavior, source boundary and verification](../../docs/learned-word-glossary.md),
[interface](../../i-web/src/LearnedWords.vue), [model/catalog matching](../../i-web/src/glossary.ts),
[browser checks](../../i-web/tests/glossary.spec.ts),
[publication checks](../../i-tests/CurriculumApiTests.cs). Production build and 28 API tests
pass; six focused glossary checks cover offline completion/reload, identity and
cross-device inclusion, content changes/withdrawal, audio and keyboard/RTL/LTR layout.
All 55 distinct browser checks pass across the broad/final focused runs; the
[feature note](../../docs/learned-word-glossary.md) records initial timing/rate-limit failures
and the final 10/10 rerun.

Supporting references: [Rollout and preservation checks](../../docs/releases/2026-10-09.md).

### F20.1 Learned words page and Account spacing

**Scope:** move the existing F20 glossary onto its own learner route, linked from
Practice, preserving search, filters, teaching links, offline and scoped inclusion;
fix F15.1 Account form spacing, including selector/save/status separation and mobile goals.

**Done when:** standalone route, return/navigation/reload and existing glossary flows
pass; settings have clear spacing without mobile overflow; tested code is pushed and
Ready on the existing Vercel preview.

**Evidence:** [behavior and verification](../../docs/learned-word-glossary.md#october-13-page-and-account-spacing--f201),
[route/navigation checks](../../i-web/tests/navigation.spec.ts). Final production build and
all 14 glossary/settings/navigation checks pass, including four viewport widths.

### F21 Cultural watch and listen recommendations

**Owner-selected scope:** one weekly YouTube video, film and song; broader Arabic
with individual dialect/register labels; Monday 00:00 UTC editions. Rentals/subscriptions
are allowed with clear labels, a free companion and no learning requirement.

**Implemented:** separate versioned media catalog/owner console, atomic exact-revision
approval/publication, scheduled visibility, archive/direct routes, Practice/Today entries,
safe publisher links, offline metadata, availability observations/suppression, withdrawal
and revalidated rollback. No media/player/lyrics rehosting or learning-progress credit.

**Done when:** all five child criteria pass, including real source/media checks,
owner-approved complete current/past editions, usable failure alternatives and honest
offline behavior. Draft content/software checks do not establish a completed release.

**Depends on:** actual permitted resources and human checks; exact owner publication
approval. No new provider, spending or creator contact is required by this software.

**Evidence:** [behavior, architecture, validation and verification](../../docs/cultural-watch-listen.md),
[content sources and exact review gaps](../../content/culture/README.md),
[original detailed plan](../../docs/cultural-watch-listen-plan.md).

Supporting references: [Rollout evidence](../../docs/releases/2026-10-15-cultural-media.md).

#### F21.1 Curation and first four collections

**Scope:** four weekly video/film/song sets, separate film free companions and one
replacement per media type, with sources, labels, original prompts and text alternatives.

**Done when:** all 12 primary records and three replacements have verified evidence
and human review dispositions; missing metadata and suitability decisions are resolved.

**Depends on:** actual source availability and human review; broader Arabic scope is settled.

Supporting references: [manifest, import and specific gaps](../../content/culture/README.md).

#### F21.2 Media catalog and publication console

**Delivered:** additive versioned catalog, owner/CSRF gates, JSON import/edit and preview,
validation, exact approval/publication, Monday UTC visibility, archive, audit, concurrency,
withdrawal and revalidated restoration. Entire three-slot editions publish atomically.

**Done criteria met:** draft/future data privacy, stale/concurrent mutation protection,
owner workflow, unsafe/duplicate links, three-slot/free-companion rules and version
recovery pass API/browser checks. Media records are independent from lesson records.

**Evidence:** [implementation and verification](../../docs/cultural-watch-listen.md),
[service](../../i-api/Services/CulturalMediaService.cs), [API tests](../../i-tests/CulturalMediaTests.cs),
[console](../../i-web/src/CulturalMediaConsole.vue).

Supporting references: [Rollout](../../docs/releases/2026-10-15-cultural-media.md).

#### F21.3 Learner collections and offline metadata

**Delivered:** Practice tile, compact Today link, three media cards, separate film/
companion actions, dated archive/direct routes, safe external links and atomic public
metadata cache with withdrawn-detail reconciliation. Core lessons/progress stay independent.

**Done criteria met:** 320/390/1280 layouts, 200% text, keyboard links, mixed direction,
reduced motion, offline reload/retry, empty/malformed states and withdrawal purge pass.

**Evidence:** [behavior/cache boundaries](../../docs/cultural-watch-listen.md),
[learner page](../../i-web/src/CulturalPicks.vue), [browser checks](../../i-web/tests/zy-cultural-picks.spec.ts).

Supporting references: [Evidence](../../docs/releases/2026-10-15-cultural-media.md).

#### F21.4 Availability upkeep and corrections

**Delivered:** dated link checks, immediate audited suppression, corrected revisions,
withdrawal, rollback and reconnect tombstones. Suppression cannot silently substitute
another work or transfer old URL check evidence to a new destination.

**Done when:** a real unavailable-item/replacement/recheck cycle has usable approved
alternatives and recorded owner handling; upkeep capacity and offline limits are explicit.

**Depends on:** accepted F21.1 content/replacements; F21.2/F21.3 software is available.

Supporting references: [operations and tested synthetic scenarios](../../docs/cultural-watch-listen.md).

#### F21.5 Verification and authorized release

**Done when:** the complete acceptance matrix has real-source/AT evidence, exact first
edition approval/publication and authorized web/API rollout/preservation/rollback records.

**Depends on:** F21.1/F21.4 completion and exact owner publication approval; application rollout is authorized.

**Evidence:** [full flow and exact test results](../../docs/cultural-watch-listen.md#verification-on-october-15).
37 API tests passed; 106/107 initial broad browser checks, then 21/21 final focused
checks after a recall focus-return race fix. Source checks and automated tests differ.

### F22 Recall and recombine

**Implemented:** source-linked optional recall metadata/validation, typed Arabic/Arabizi
practice, independent-first/help/retry facts, F10-based due selection with reserved later
variants, atomic device persistence and version-aware human report cases/console resolution.

**Policy:** documented NFC/case/space/sentence-punctuation/Arabic-harakat normalization;
letters and meaningful word differences remain. Unknown answers are Unable to judge;
raw text is session-only unless voluntarily reported. [Details](../../docs/recall-and-recombine.md).

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
[Approved package review](../../content/levantine/everyday-01/revisions/recall/REVIEW.md).

**Done when:** all variants/rationales/explanations are validated, approved/published;
independent first attempts, help and retries remain distinct; accepted alternatives
and contextual errors follow the agreed policy, plausible uncertainty has a recoverable
review/report path; downloaded practice/evidence survive reload, identity changes and
version/withdrawal handling; accessibility and evaluation checks pass. Maintain F10's
existing intervals; neither tiles nor unassessed speaking become production evidence.

**Depends on:** F03/F04/F05/F10, published source-linked content and explicit input policy;
reuse F18's report-case work if available, otherwise scope the minimal review path.

**Evidence:** [expanded flow, data boundaries and checks](../../docs/learning-engagement-plan.md#f22-recall-and-recombine);
existing [review](../../docs/review-and-checkpoints.md), [schedule](../../docs/scheduled-review.md)
and [transfer drafts](../../content/levantine/plans-02/README.md).

**Verification:** production build/Release API publish, all 32 API tests, eight F22 browser
checks, six glossary checks and eleven review/scheduling/console checks pass. Real AT/
supported-device and learner-outcome evidence remain F18 gates.

Supporting references: [Rollout record](../../docs/releases/2026-10-13-recall.md), [Programmatic deployment](../../deploy/README.md).

### F23 Recurring mini-stories

**Outcome:** short connected scenes with Fattoush/Knafeh give learners a reason to
understand a whole situation and contribute a useful response. Extend F04 opening
dialogues/F06 roles; F21 external cultural recommendations remain separate.

**Bounded target:** a linked three-episode Levantine text arc using taught language,
with source-linked comprehension/response practice and offline delivery. Start with
F23.1; scope the remaining two episodes after reviewing the first. Audio editions
are a separate extension dependent on F09, not a gate for the text arc.

**Done when:** all three episodes meet F23.1's publication, practice, offline,
version/identity and accessibility criteria, preserve a coherent arc and have distinct
communicative targets. F23.1 completion alone does not complete F23; learning benefit
needs separate learner evidence.

**Depends on:** F03/F04/F06 and approved curriculum; F22 for independently graded
typed responses. Character redesign and external media curation are independent.

**Evidence:** [expanded narrative scope and checks](../../docs/learning-engagement-plan.md#f23-recurring-mini-stories).

### F23.1 First text episode

**Outcome / scope:** one reviewed Levantine text episode using taught language, a small
problem/resolution, two comprehension checks and one learner response. Target 2–4
minutes as an estimate to verify, without a timer. Link from the unit/Practice;
Today integration requires an explicit daily-goal accounting rule.

**Done when:** approved/published episode, checks and rationales are source-linked;
help/retry/resume and downloaded text/progress work; version/withdrawal and identity
handling pass; repeat completion cannot inflate core lessons/minutes; fixed-frame
mobile/desktop, keyboard, screen-reader and RTL/LTR reading work. A text release makes
no listening claim; a later audio edition requires F09 accepted recordings/transcripts.

**Depends on:** F03/F04/F06 and approved curriculum; F22 if the response is independently
typed/graded, otherwise report assisted evidence honestly. F09 is needed only for audio.

**Evidence:** [expanded narrative scope and checks](../../docs/learning-engagement-plan.md#f23-recurring-mini-stories).

**Parent limit:** F23's remaining two text episodes need their own child scopes;
listening editions need separately scoped F09 recordings/transcripts.

### F24 Multi-language foundation and parallel study

**Outcome:** learners study Arabic, French and Khmer singly or in parallel in the
same English-language app. Arabic retains distinct Levantine/MSA/Quranic courses;
each course has separate placement, progress, review and content safeguards.
Shared course metadata, wording and visual identity also accommodate eventual
Portuguese and further languages without promising their curricula or release.
Reuse F01/F02/F03/F05/F10/F15.1/F20 rather than rebuilding delivered features.

**Done when:** all eight children pass; both first-unit packages work alongside Arabic
with correct language presentation and course accounting; old Arabic publications,
downloads, identities and pending progress survive the upgrade; supported-browser,
offline and real accessibility evidence is recorded. F24 does not complete the full
F25/F26 courses or the original Arabic beta gates.

**Depends on:** existing foundations; F25.2/F26.2 packages for complete-flow checks;
agreed queue policy and supported-browser/device matrix.

**Evidence:** API 39/39 and final focused Chromium 18/18 pass; earlier full Chromium 114/115 exposed the now-fixed recall Escape defect. WebKit 10/16 retains an offline engine error. [Implementation, policy and verification](../../docs/multi-language/README.md),
[pilot protocol](../../docs/multi-language/pilot-protocol.md),
[release template](../../docs/multi-language/release-manifest.template.json),
[title options](../../docs/multi-language/brand-options.html). Existing Arabic IDs, publications,
download records and scoped pending completions remain compatible. The owner approved
whole-session allocation/secondary rotation and requested a deployment candidate.

Supporting references: [Rollout and recovery](../../docs/releases/2026-10-16-multi-language.md).

#### F24.1 Language and course records with compatibility

**Scope:** stable language/course IDs, language tags, script direction, font,
pronunciation-help type, audio locale and published-content availability. Recommend
one Arabic language with three courses, plus distinct French and Khmer courses.
Version target-text/help fields to replace Arabic-only naming without rewriting
immutable Arabic publications or losing old downloads and queued completions.

**Done when:** old/new packages and offline caches load; settings/guest/account
isolation survive; pending completions retain their meaning and remain idempotent;
upgrade/recovery checks pass against a preserved copy of existing state.

**Depends on:** F01/F02/F03/F15.1/F20; production database choice remains unresolved.

**Evidence:** [implementation and verification](../../docs/multi-language/README.md).

Supporting references: [Rollout](../../docs/releases/2026-10-16-multi-language.md).

#### F24.2 Language-aware learner presentation

**Scope:** course-driven direction, language tags, fonts, help, audio controls,
teaching, exercises, reviews, glossary and placement. Availability follows actual
published packages. Retain the fixed lesson frame, free help/retries and mute choice.

**Done when:** Arabic RTL and French/Khmer LTR work without clipped text or broken
focus; downloaded fonts/audio work offline; missing model/device voices have honest
fallbacks; switching courses preserves a started lesson's language/state. Keyboard,
screen-reader and non-listening/non-speaking paths support core study.

**Depends on:** F24.1; language-specific checks in F25.3/F26.3.

**Evidence:** [implementation and verification](../../docs/multi-language/README.md).

#### F24.3 Parallel study settings and daily queue

**Scope:** select courses, choose a primary course and retain 5/10/15/30-minute total
goals; allocate due review/new learning independently and persist guest/account
choices with existing offline conflict handling. No combined proficiency score.

**Approved policy:** whole sessions, roughly 60% primary when useful, UTC-date
secondary rotation (three primary/two secondary slots per five days for a five-minute
goal), one bounded due-review session first within each allocation, visible whole-lesson
overruns and omitted/unavailable courses, plus unrestricted manual study. [Examples](../../docs/multi-language/README.md#queue-policy-approved-october-15).

**Done when:** agreed examples pass online/offline with stable ordering, bounded
rotation so no course starves, no silent substitution/duplicate rewards and visible
overruns; removing/re-adding a course preserves its history and started lessons.

**Depends on:** F24.1/F15.1/F10. Cross-device review-history sync is a separate scope.

**Evidence:** [implementation and verification](../../docs/multi-language/README.md).

#### F24.4 Multi-language curriculum console and validation

**Scope:** per-language draft/import/source/audio checks, review dispositions, owner
approval, publication, rollback and audit. Reject mismatched language/audio/segment
records and unresolved critical linguistic or rights defects. Retain Quran integrity
and MSA/Quranic publication gates until their own controls exist; enabling French
and Khmer must not bypass those gates or establish expert-review claims.

**Done when:** valid drafts pass their profiles; invalid/unauthorized publication
fails; rollback restores exact releases; public/download endpoints serve only
approved versions with factual source/reviewer status and accepted-answer rationale.

**Depends on:** F24.1/F03 and agreed course source/review definitions.

**Evidence:** [implementation and verification](../../docs/multi-language/README.md).

#### F24.5 Mixed-language verification and pilot

**Scope:** Arabic + French + Khmer settings, placement, lessons, glossary, due review,
download, offline reload/completion and reconnection. Cover identity isolation,
interrupted downloads, withdrawals, stale packages and switching; verify actual
mobile text/input, keyboard and screen-reader behavior.

**Done when:** meaningful API/browser checks and real-device evidence pass; a small
observed mixed-language pilot records versions, immediate/delayed retrieval, help,
attempt counts and fix/retest dispositions. Access/progress blockers prevent release.
Do not resume owner-deferred F18.1 without authorization.

**Depends on:** F24.1–F24.4, first-unit text/audio/support under F25/F26 and pilot setup.

**Evidence:** [implementation and verification](../../docs/multi-language/README.md).

#### F24.6 Expansion release decision and delivery

**Scope:** truthful course depth/variety/review/provenance display, versioned release
manifests, rollback, hosted verification and correction/support handling. Landing
and shared copy changes are explicitly scoped in F24.7; no billing, interface
localization or paid hosting/provider signup is included.

**Recommendation:** verify both first units internally, then run a small language
pilot before deciding whether either joins the first-100 Arabic beta. Retain original
Arabic gates; keep unavailable courses factual until approved publication.

**Done when:** authorized rollout records web/API/content versions, preservation of
existing data/caches, live study/offline checks and a withdrawal/rollback rehearsal;
no unverified outcome, CEFR-level or reviewer claims appear publicly.

**Depends on:** F24.5, F24.7, F24.8 and approved per-language release scope; F18 if beta is widened.

**Evidence:** [implementation and verification](../../docs/multi-language/README.md), [candidate and recovery](../../docs/multi-language/deployment-candidate.md).

#### F24.7 Multi-language wording, landing and visual identity

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

**Evidence:** [implementation and verification](../../docs/multi-language/README.md), [title options](../../docs/multi-language/brand-options.html), [original design context](../../docs/khmer-course-and-brand-expansion.md).

#### F24.8 Prominent language and course switching

**Outcome:** learners immediately see which language/course is active and how to
switch between Arabic and Khmer without visiting Account or hunting through Courses.

**Scope:** a persistent, labeled selector in the mobile app header and desktop
header/sidebar, with the current language and course plus an explicit “Switch” cue.
Recommend two taps from a main page: open selector → choose Arabic or Khmer.
Arabic retains its separate Palestinian Levantine/MSA/Quranic courses; restore the
last usable course within that language, with clear choices for the others.
Future French/Portuguese entries use the same selector when actually available.

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

**Evidence:** [implementation and verification](../../docs/multi-language/README.md), [title options](../../docs/multi-language/brand-options.html), [original design context](../../docs/khmer-course-and-brand-expansion.md).

##### F24.8.1 Switching continuity and shared presentation

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

**Evidence:** [behavior and verification](../../docs/multi-language/switching-and-identity.md).

##### F24.8.2 Course identity banner, colors and culture card

**Scope:** owner request to make the active language apparent: a playful colored
banner and tile picker replace the plain selector; each course has a color identity
(landing palettes, separate from feedback colors, always named); the Study card shows
a prominent speech bubble with the language's own name plus language/course. Original
offline culture artwork (olive trees, mashrabiya, eight-point star, Eiffel Tower,
Angkor Wat) appears in the picker tiles only; after review, the owner removed the
in-card artwork and its caption.

**Done when:** every page shows the viewed course in its color with name; any
available course is two taps away; keyboard/Escape/focus and reduced motion work;
320/390/1280 px layouts fit; existing switching/offline checks pass.

**Verification:** typecheck, build and 45 of 46 focused checks pass. The remaining
check passes alone; in the batch it hits an existing duplicate-owner registration
between specs. Two `satisfaction` failures pre-date this change (clean `HEAD` fails
them too); Continue moved slightly up (≈710 px vs 715 px at `HEAD`). After the
in-card artwork was removed, typecheck, build and 39 focused checks pass.

**Evidence:** [behavior and verification](../../docs/multi-language/switching-and-identity.md#october-16-course-identity-banner-and-culture-card-f2482).

### F25 French course

**Outcome:** English-taught, relationship-centered French for adult beginners/false
beginners, alone or alongside Arabic/Khmer, with free core lessons, explanations,
review, downloads and baseline guided speaking.

**Owner-selected depth (October 18):** twelve units/weeks, five new 5–7-minute lessons per unit
(60 new lessons), plus varied review and one checkpoint per unit. Review/checkpoints
do not inflate the new-lesson count. Weeks are a suggested study pace, not delivery
dates or a promise for learners sharing their daily time across languages.
The owner selected this depth and the five-minute month-one guided interaction target October 18; exact source/reviewer/rubric acceptance remains F25.1.

**Assessment targets:** at 30 days with 15 minutes devoted to French daily, handle a
five-minute guided introductions/family/food/plan exchange, extract four requested facts
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

**Done when:** all six children meet agreed criteria; every agreed unit, explanation,
accepted-answer record and model recording is source-linked, validated, reviewed,
owner-approved and published; offline/accessibility, baseline speaking and observed
outcome checks pass. A first unit or 60 drafted lessons does not complete the parent.

**Depends on:** F24, approved text/audio rights and named linguistic review route;
separately approved speech/AI setup for automated feedback.

**Evidence:** [inspection](../../docs/multi-language-feasibility.md), reference links above.
[October 18 private first-unit packages and verification](../french/README.md); no human recordings, designated reviewer or observed outcomes. Implementation and draft-first/fluent-review-before-publication route authorized October 18; no release/contact/spend authority inferred.

**Unit sequence:** twelve scenario briefs for the selected course. First-unit drafts may be prepared under October 18 authorization; exact text/source acceptance and first-unit pilot precede bulk authoring. These briefs are not approved lesson content.

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

**Owner selection, October 18:** contemporary everyday French with a Metropolitan France reference
variety and labeled Canadian/other alternatives where supported; informal/polite
address follows the situation. Beginner entry includes a skippable false-beginner check.

**Done when:** course brief, unit outcomes, assessment rubric, source/rights register
and review route are agreed; unresolved linguistic claims are excluded.

**Depends on:** owner definition decisions and verified reference rights/access.

#### F25.2 French first unit

**Scope:** five authored introduction/greeting/repair lessons, contextual recall,
varied review and checkpoint; provenance and rationale for every teaching/answer record.

**Done when:** complete packages pass F24.4 with recorded linguistic dispositions;
accessible offline use and changed-context recall can be verified. Text-ready,
audio-ready, approved and published states are reported separately.

**Depends on:** F25.1; F24.4 for import/publication; F25.3/F25.5 for full learner delivery.

#### F25.3 French starting check, sounds and text support

**Scope:** short skippable placement from approved content, optional spelling/sound
modules, accent input/help and readable phrase/word chunks. Pronunciation notes are
authored/source-linked; any IPA help is optional rather than an entry requirement.
The delivered F28 application and [French alphabet draft](../../ROADMAP.md#f284-french-explorer-draft-pack) supply the explorer foundation; F30 retains acceptance/release;
it does not complete the wider starting check. French draft authoring was separately authorized October 18.

**Done when:** skip/retry and accessible alternatives work; accents/apostrophes and
segments render correctly; reviewed answer rules explain when spelling matters
without changing originals. Results stay course-specific, with no fluency claim.

**Depends on:** F25.1/F25.2, F24.1/F24.2; result-sync expansion needs its own scope.

#### F25.4 French remaining units and reference material

**Scope:** units 2–12 (proposed 55 further lessons), reviews/checkpoints, short searchable
grammar/use guides and explicit glossary forms/senses tied to teaching contexts.

**Done when:** agreed 12-unit/60-lesson manifest has no missing rationale, explanation
or source records; retrieval is spaced across varied contexts and checkpoints require
transfer. Draft validation does not establish publication or learner outcomes.

**Depends on:** F25.1/F25.2 and first-unit pilot under F25.6; F24.4; F25.5 audio.

#### F25.5 French model audio and guided speaking

**Scope:** permitted reviewed model recordings for listening/teaching targets,
transcripts, speaker/variety labels and exact phrase/version mappings. Recommend
multiple human speakers; synthetic previews remain labeled and reviewed. Baseline
speaking uses controlled authored branches, optional record/replay and feedback on
intent, intelligibility and important sounds, with text alternatives.

**Done when:** complete agreed audio mappings pass review/playback/offline checks;
scenario feedback handles uncertainty without authoritative rejection; recordings
are deleted after feedback and improvement retention requires separate consent.
If AI feedback is deferred, record the incomplete scope; audio alone does not finish it.

**Depends on:** approved F25.2/F25.4 text, F24.2/F24.4 and provider/privacy decisions.

#### F25.6 French pilot, publication and release evidence

**Scope:** first-unit pilot, then full-course verification against agreed outcomes,
versions, immediate/delayed tasks, help used and attempts/denominators.

**Done when:** offline/reconnection and real accessibility pass; linguistic/audio
defects have fix/retest dispositions; observed tasks support factual outcome claims;
owner-authorized publications and rollout record exact versions and rollback evidence.
A small pilot is formative evidence, not proof of universal A1 attainment.

**Depends on:** F25.2/F25.3 and first-unit F25.5 audio for initial pilot; F25.4/full
audio and F24.5/F24.6 for full release. These stages do not form a dependency cycle.

### F26 Khmer course

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

**Done when:** all six children pass; agreed units and script/sound modules are
source-linked, validated, linguistically reviewed, owner-approved and published;
audio, baseline guided speaking, offline/accessibility and observed outcomes pass.
The shared landing and course entry meet F24.7, with honest availability and Khmer
presentation while Arabic/Palestinian branding remains visible; F24.8 makes
Arabic–Khmer switching prominent and preserves independent course state.
First-unit or script-rendering success does not complete this parent.

**Depends on:** F24, approved sources/audio rights, named Khmer linguistic review
route and separately approved speech/AI setup for automated feedback.

**Evidence:** [inspection](../../docs/multi-language-feasibility.md),
[expanded milestones, first-unit briefs and shared brand/copy plan](../../docs/khmer-course-and-brand-expansion.md),
[Unicode segmentation guidance](https://www.unicode.org/reports/tr29/#Word_Boundaries)
and [W3C draft Khmer layout gap analysis](https://www.w3.org/TR/khmr-gap/).
Unicode identifies tailored word/line-boundary needs; the W3C draft is a browser-check
reference, not curriculum authority. [First-unit implementation/evidence](../../docs/khmer/README.md),
[packages/review sheets](../../content/khmer/meet-01/README.md),
[source/rights register](../../docs/research/khmer-course-sources.md). No human recordings,
committed reviewer or learner outcome evidence exists.

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

Supporting references: [Publication/recovery](../../docs/khmer/text-preview-publication.md), [exact hosted versions and audit](../../content/khmer/meet-01/publication.json).

#### F26.1 Khmer definition, sources and review route

**Agreed direction:** contemporary Cambodian Khmer with a Phnom Penh-based reference
model; the actual speaker is not yet identified. Label regional/register differences
only with evidence.
Select one consistent learner pronunciation-help convention with a reviewer; do
not present proposed romanization as authoritative spelling.

**Done when:** course brief, reading inventory, rubric, source/rights register and
review route are agreed; uncertain linguistic/cultural claims are excluded.

**Depends on:** owner course-definition decisions and verified source access/rights.

Supporting references: [Primary-source register](../../docs/research/khmer-course-sources.md).

#### F26.2 Khmer first unit

**Scope:** five authored greeting/introduction/repair lessons, contextual recall,
varied review and checkpoint; separate source-linked script, help, meaning, accepted
answers and audio. Do not mechanically translate the French lesson sequence.
The [five lesson briefs](../../docs/khmer-course-and-brand-expansion.md#first-unit-meet-someone-and-keep-the-exchange-going)
cover greeting, names, personal details, communication repair and an integrated exchange.

**Done when:** packages/authored segments pass F24.4; address/register/help and
answer rationales are checked; changed-context recall and accessible offline study
can be verified. Text, audio, approval and publication states remain distinct.

**Depends on:** F26.1 and F26.3's agreed text/segment rules; F24.4 and F26.5 audio.

Supporting references: [the five candidates](../../content/khmer/meet-01/README.md).

##### F26.2.1 Owner-authorized text-only development preview

**Scope delivered:** exact five on the existing development preview with prominent
unreviewed/text-only labels; pending review/rights and missing human audio retained.
Normal gates remain for other/changed content; beta gates are unchanged.

**Completion evidence:** owner-only, CSRF-protected exact-package approval/publication;
hosted records 24–28, all v1; live course and lesson labels; automated download,
offline completion/reconnect, withdrawal/rollback and placement exclusion. All 13
Arabic payloads, learner/source tables and assets preserved. API 41/41, build and
10 focused browser checks pass; human AT/Safari/learning evidence is not inferred.

**Evidence:** [policy, verification and recovery](../../docs/khmer/text-preview-publication.md),
[exact versions/audit](../../content/khmer/meet-01/publication.json).

#### F26.3 Khmer script, sounds, input and starting check

**Scope:** skippable placement and optional staged script/sound modules linked to
actual lesson words. Reviewed modules cover consonant/vowel patterns, signs and
syllable combinations without an alphabet memorization gate. Separate reading,
listening and support-choice evidence; never infer pronunciation from text answers.
F28 now supplies the shared individual-letter/combination explorer application and
a [full unreviewed Khmer alphabet draft](../../content/alphabet/text-only/README.md).
Its text-only engineering/draft scope is Done; F30 retains acceptance/release and
F09 recordings. Existing expression cards alone do not fulfill phonics/module or
reviewed sound coverage.

**Done when:** original text is preserved and segments recombine exactly; combining/
stacked text is not clipped; help/script work offline at enlarged sizes; input,
selection and real screen-reader checks pass on agreed devices. Skip/retry and
alternatives to typing/listening/speaking preserve progress. Placement recommends
a starting point, not calibrated literacy/pronunciation scores.

**Depends on:** F26.1 and F24.1/F24.2 for prototype; F26.2 for integrated check/modules.

#### F26.4 Khmer remaining units and reference material

**Scope:** units 2–12 (proposed 55 further lessons), reviews/checkpoints, searchable
use/grammar guides, glossary senses and progressive supported reading linked to
F26.3. Script inventory and vocabulary need not mirror French or Arabic.

**Done when:** agreed 12-unit/60-lesson manifest and optional modules are complete;
every answer has rationale/source linkage; help and segments are consistent; spaced
recall and new-context checkpoints cover taught skills. Drafts, TTS alone and
recognition drills alone do not establish the completed course or its outcomes.

**Depends on:** F26.1/F26.2 and first-unit pilot under F26.6; F26.3/F24.4; F26.5 audio.

#### F26.5 Khmer model audio and guided speaking

**Scope:** permitted reviewed human model recordings, exact text/version mappings,
speaker/variety labels and transcripts; recommend multiple speakers. Controlled
branches and optional record/replay use reviewed responses and intelligibility/
intent targets, with text alternatives and the free baseline floor.

**Done when:** full agreed audio coverage passes linguistic/playback/offline checks;
automated feedback is verified for taught scenarios, handles uncertainty and meets
no-training/minimum-data/deletion rules. Raw recordings are deleted after feedback;
improvement retention needs separate informed consent. If no acceptable provider
exists, record the gap and request a bounded fallback/scope decision; self-recording
does not by itself fulfill automated assessment.

**Depends on:** approved F26.2/F26.4 text, F24.2/F24.4 and provider/privacy decisions.

Supporting references: [manifest](../../content/khmer/meet-01/review-manifest.json).

#### F26.6 Khmer pilot, publication and release evidence

**Scope:** first-unit pilot then full-course verification, with separate conversation,
listening and taught-script tasks, immediate/delayed retrieval, help and versioned
attempt counts. Include actual mobile input/shaping/screen-reader and offline checks.

**Done when:** critical linguistic/audio/script/access/progress defects are resolved;
observed tasks support factual outcomes; exact owner-authorized publications and
rollout include rollback, withdrawal and support handling. Rendered script or one
successful participant is not proof of literacy or general course effectiveness.

**Depends on:** F26.2/F26.3 and first-unit F26.5 audio for early pilot; F26.4/full audio
and F24.5/F24.6/F24.7/F24.8 for full release. Early/full stages have separate evidence manifests.

Supporting references: [task/rubric and evidence template](../../docs/khmer/README.md#first-unit-review-and-observation-protocol).

### F27 Feature discoverability and navigation

**Outcome:** learners can reach practice, streak, can-do progress and word search through focused pages. Weekly activities are optional and tucked away in Progress (owner's October 18 revision).

**Scope:** five tabs (Today, Courses, Practice, Progress, Words), with Account in the header/sidebar. Practice links to Alphabet, Review, Checkpoints, Write a response, Lesson practice and Arabic cultural picks. Today has streak and due-review shortcuts. New streak tracking starts on; weekly activities start off; saved choices remain intact. Grace works silently.

**Done when:** tabs and focused pages work on mobile/desktop; Practice names remain readable; optional controls persist; Today has one primary lesson/resume action; keyboard names include counts and color is not the only signal; build and focused checks pass.

**Depends on:** F05/F10 review, F17.6 can-do, F17.7 habits, F20 glossary.

**Evidence:** [original behavior and verification](../../docs/feature-navigation.md); [October 18 clarity contract/evidence](../learner-clarity-fixes.md). Earlier default-on weekly-quest and three-shortcut rules are superseded by F27.3.

#### F27.1 Mobile-friendly back navigation

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

**Done when:** every applicable back action uses the shared treatment and visible
destination; small screens/enlarged text avoid clipping and crowded adjacent controls.
Direct/deep-linked entry has a reliable in-app destination rather than blindly
calling browser history. Normal browser back/history, keyboard/focus and offline
routes work; lesson exit/resume and explicit landing return remain available.
Nested pages return to the correct parent and preserve supported context/filters;
RTL teaching text does not reverse the surrounding English navigation unexpectedly.

**Depends on:** F07/F27 and existing routes; no Khmer content/provider dependency.

**Evidence:** [behavior, previews and verification](../../docs/mobile-back-navigation.md),
[October 16 rollout](../../docs/releases/2026-10-16-back-navigation.md). The isolated
production build passes. Focused browser run: 52/53 passed; the one cultural-refresh
check passed when rerun alone. All return/lesson/preview/glossary/review/recall checks
passed. Additional 320/390/1280 px touch, 200% text, focus/history, offline and console
checks pass; the original recall keyboard scenario also passed three consecutive runs.

#### F27.2 Scannable study plan and can-do progress

**Scope:** compact lesson rows with clear actions/time/course; concise availability
and progress states; evidence and policy details remain accessible on demand.

**Done when:** both sections provide an obvious next step, unavailable recall has a
working course entry instead of disabled actions, and mobile/desktop, keyboard,
enlarged-text, lesson entry and existing evidence/preference behavior pass checks.

**Depends on:** F15.1/F24.3 study queue, F17.6 written recall and F27 navigation.

**Evidence:** production build and all 33 focused Chromium checks pass;
320/390/1280 px, enlarged text, keyboard, online/offline, course switching,
identity/preferences and versioned recall behavior verified. Mobile/desktop
renders inspected. [Behavior and verification](../../docs/scannable-plan-and-progress.md).

Supporting references: [Delivery evidence](../../docs/scannable-plan-and-progress.md#delivery).

### F28 Alphabet explorer

**Scope decision:** owner excluded human recordings and explicitly selected “finish
text-only implementation and drafts; track review/release separately.” Metropolitan
French is the alphabet reference only; F25's wider course definition remains open.
This supersedes the original sound-ready completion criteria, preserved in the
[original plan](../../docs/alphabet-explorer-plan.md). Remaining obligations are F30/F09,
not waived or represented as completed human evidence.

**Outcome:** five course contexts have complete proposed text-only draft coverage,
forms/case pairs, contextual guidance, candidate examples, structured visual practice,
private console preview, versioned device-local evidence and offline-capable application.

**Done when:** five bounded unreviewed text-only packs cover their explicit proposed
inventories, with two or three examples per basic entry, support demonstrations,
shape/spot activities and rationales; privacy, review/rights gates, downloads/resume,
Unicode targets and relevant automated/browser checks pass. All criteria met.

**Evidence:** [implementation, scope, verification and delivery](../../docs/alphabet-text-only-completion.md),
[five drafts and exact hashes](../../content/alphabet/text-only/README.md). All 51 API tests,
production build and 24 alphabet browser checks pass. 143 basic/132 support entries,
434 examples/demonstrations and 550 visual activities. Actual review remains absent.

Supporting references: [October 17 rollout/recovery](../../docs/alphabet-text-only-completion.md#authorized-rollout--october-17), [existing publication audits](../../docs/alphabet-inventory-publication.md).

#### F28.1 Shared explorer, content model and gates

**Scope:** grid/detail, versioned manifests, owner workflow, visual-only validation,
private drafts and public projection; existing audio mode remains supported.

**Evidence:** [text-only completion](../../docs/alphabet-text-only-completion.md).
Text-only mode excludes recordings and sound activities while preserving actual
review/source/rights/track gates. Existing exact preview pins remain unchanged.

##### F28.1.1 Shared application candidate

**Scope:** shared explorer/owner contract, four activities, device-local versioned
history/resume and atomic verified offline downloads, independent of content acceptance.

**Done when:** actual API-to-browser fixture checks prove privacy/workflow, exact
text, activities, identity/course separation, offline replacement and withdrawal.

**Evidence:** all 47 API tests, build, 12 alphabet browser checks and 21 focused
regressions pass; [behavior and limits](../../docs/alphabet-explorer.md).

Supporting references: [Rollout](../../docs/releases/2026-10-16-alphabet.md).

##### F28.1.2 Inventory-only preview publication

**Scope:** publish the five pinned Arabic-context/Khmer/French inventories as
unreviewed text-only previews, without fabricated review, audio, words or grades.

**Authorization:** owner said “just publish them” after being informed reviewers and
recordings were absent; this supersedes the earlier reviewed-only selection for
these exact development previews. Normal full-pack and beta gates stay in place.

**Done when:** exact five v1 manifests and unreviewed/no-audio labels are public,
missing controls remain unavailable, downloads pass and unrelated data is preserved.

**Evidence:** [candidate files, policy, checks and rollout](../../docs/alphabet-inventory-publication.md).

Supporting references: [Exact hashes/audits](../../content/alphabet/inventory-preview/publication.json).

#### F28.2 Arabic explorer draft packs

**Scope:** shared 28-letter script inventory and 17 support entries in each of
Levantine/MSA/Quranic contexts, separate contextual guidance, candidate words and
visual activities. Ordinary Quranic-course decoding examples contain no scripture.

**Evidence:** [draft coverage/hashes](../../content/alphabet/text-only/README.md).
Human acceptance and MSA/Quranic publication controls remain in F30; audio in F09.

#### F28.3 Khmer explorer draft pack

**Scope:** proposed 33 consonants plus 49 vowel/sign/subscript support entries,
series notes, examples and visual activities; constructed demonstrations are labeled.

**Evidence:** [draft coverage/hashes](../../content/alphabet/text-only/README.md).
Exact final inventory/help acceptance remains in F30; no mandatory alphabet gate.

#### F28.4 French explorer draft pack

**Scope:** Metropolitan French alphabet reference, 26 case pairs plus 32
accent/cedilla/ligature/combination/silent-letter support entries, examples and visual
activities. This does not authorize the F25 conversation curriculum.

**Evidence:** [draft coverage/hashes](../../content/alphabet/text-only/README.md).
Exact linguistic/source acceptance remains in F30; human audio in F09.

#### F28.5 Practice, downloads and separate evidence

**Scope:** shape/word spotting, verified atomic downloads, offline visual practice,
per-identity/course/version evidence and resume; full audio mode retains four activities.

**Evidence:** all 24 focused browser checks pass, including audio-mode regressions,
text-only offline reload/practice/resume, identity/course boundaries and withdrawal.
Real draft preview has no saved learner evidence; synthetic accepted fixtures alone
exercise publication transport. [Limits](../../docs/alphabet-text-only-completion.md).

#### F28.6 Automated access and candidate verification

**Scope:** 320 px/enlarged text, keyboard/focus/Escape, mixed-script exact targets,
private/full-pack previews, public-content preservation and offline checks.

**Evidence:** [51 API tests, build and 24 browser checks](../../docs/alphabet-text-only-completion.md).
Arabic/Khmer enlarged screenshots visually inspected. No physical device,
VoiceOver/TalkBack or Safari acceptance claim. The authorized October 17 application
rollout is verified separately; full drafts remain unpublished.

### F29 Privacy policy and beta version

**Scope:** a public privacy page at `#/privacy` describing current behavior (guest
local storage, account fields, essential cookies only, no voice/AI processing yet,
Vercel/alwaysdata hosting, deletion by request until F16) and a single app version
sourced from `i-web/package.json` (`0.0.1`), shown as "Beta 0.0.1".

**Evidence:** linked from the landing footer and Account; production build passes.

**Limits:** update the policy before F11 speaking, F16 deletion or any analytics
ship; it is not legal review. Commit/deploy needs owner authorization.

### F30 Alphabet content acceptance and release

**Outcome:** turn F28's unreviewed text-only candidates into accepted, source-cleared
course-specific packs and verify an authorized release. Sound-ready packs additionally
require F09 recordings; text-only completion does not claim pronunciation assessment.

**Done when:** exact accepted coverage/text/rights pass; MSA/Quranic track controls
exist before their publication; keyboard/enlarged text plus physical-device/actual
VoiceOver or TalkBack/Safari offline-reconnection evidence pass; any separately
authorized publication/deployment has exact versions/audits/recovery evidence.
Existing source/integrity, accessibility and beta gates remain in force. Audio-ready
claims require actual reviewed human recordings with transcripts/rights through F09.

**Depends on:** F28, F09/F13/F14 and applicable F25/F26 content decisions.

**Evidence:** [remaining boundary](../../docs/alphabet-text-only-completion.md),
[original full-pack design](../../docs/alphabet-explorer-plan.md).

