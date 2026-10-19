# Ismi roadmap

Updated October 18, 2026 · **Single source of current feature state and next work.**

## Agent entry

1. Match the owner's request to a stable ID in the [work queues](#work-queues).
2. Read that ID's [feature record](#feature-records), linked contract/evidence and
   actual checkout. Check `git status`; work on `main`, preserving local changes.
3. Use **Authorization** and **Next action**, not work state alone, to decide what
   you may do. A recommendation is not permission to implement, publish, deploy,
   spend or contact people. Existing owner authorization persists.
4. Update the record and its queue together. [Maintenance rules](docs/planning-workflow.md)
   define the schema; [AGENTS.md](AGENTS.md) holds durable product constraints.
   Run `python3 scripts/check-roadmap.py` before finishing roadmap edits.

A request to audit or reorganize this file authorizes documentation work only.
Never rebuild a delivered layer just because its parent is unfinished. Never close
an umbrella because some children are complete. No percentages or averaged readiness.

## How to read state

**Work state** identifies the main next gate. **Readiness** records independent facts:
implementation, content and verification. **Delivery** records application and content
separately. All must be read together; none implies beta readiness or expert review.

| Work state | Meaning | Agent response |
| --- | --- | --- |
| Partial | Some implementation/authoring exists; defined scope remains | Identify the missing child or bounded deliverable before coding |
| Review pending | Inspectable drafts exist; exact acceptance is missing | Prepare/resolve review items; do not fabricate approval |
| Input needed | Assets, permission, reviewer or external account access is missing | Name the exact input/actor; continue independent authorized work |
| Decision needed | A consequential product/provider/policy choice is unresolved | Investigate facts; present a recommendation to the owner |
| Verification pending | Software/protocol exists; required field or release evidence is missing | Run only authorized checks; distinguish automation from human evidence |
| Planned | Defined work has not begun | Check authorization and dependencies before implementation |
| Delivery pending | Accepted implementation awaits its authorized rollout | Verify the candidate and exact deployment/publication authority |
| Deferred | Owner explicitly paused this scope | Do not resume without the owner's instruction |
| Complete | This bounded contract is satisfied | Preserve it; track extensions/release gates under their owning IDs |

Implementation can be complete while content is draft and delivery is absent.
Content can be published under an **unreviewed preview exception** while review,
rights and audio remain missing. Automated checks do not imply real-device,
VoiceOver/TalkBack, Safari offline, human-audio or learner-outcome acceptance.
“Authored” means structurally prepared; “Approved” means recorded owner acceptance,
not native-expert review. “N/A” means that layer is outside the bounded scope.
“Not run” or “unverified” is missing evidence, not a recorded failure.

## Partly complete features at a glance

| Feature | Implementation | Content | Missing evidence / next gate | Application / publication |
| --- | --- | --- | --- | --- |
| F12 Levantine expansion | Partial course | Follow-on unit drafted; twelve-week depth absent | Exact draft review, speaker dispositions, remaining authoring | Shared app deployed / new drafts private |
| F15 study plan/placement | Settings and Levantine check complete | Remaining reading/sound modules absent | Scope other-track assessments and accepted modules | Delivered slices deployed |
| F17 learning support | Habits/can-do/UI complete | Grammar/reference slice not authored | Bound grammar, reminder and XP work before implementing | Selected children deployed |
| F21 cultural media | Complete | Four research editions awaiting acceptance | Real media/editorial checks, AT, exact publication | App deployed / media unpublished |
| F24 multi-language foundation | Complete | Reviewed French/Khmer first units still required | Real input/AT/Safari offline and observed mixed-language pilot | App deployed / expansion release gated |
| F25 French course | First-unit private flow complete; course partial | Five drafts; 55 lessons unauthored | Exact fluent/source acceptance, audio/check inputs, first-unit pilot | App deployed / five unreviewed text previews |
| F26 Khmer course | Shared app complete; course partial | Five of sixty lessons drafted and preview-published | Review/source/help decisions, 55 lessons, audio/modules/pilot | App deployed / five unreviewed text previews |
| F28 alphabet | Complete under revised text-only contract | Five full packs authored, unreviewed | No remaining F28 gate; human/source/access/release is F30 | App deployed / full drafts unpublished |

These rows summarize the records; they do not change contracts or create permission.

## Current delivery baseline

This is a reconciliation of repository/release evidence, **not a new live audit**.

| Layer | Latest recorded state | Evidence / limit |
| --- | --- | --- |
| Frontend application | F23 stories and exact preview support, Beta 0.0.4, `99f2de4` verified Vercel Ready on existing aliases October 18; documentation follow-up may advance revision | [Story rollout](docs/releases/2026-10-18-mini-stories.md); prior [About rollout](docs/releases/2026-10-18-about.md) |
| ASP.NET API | Healthy exact `99f2de4` deployed October 18; one exact story preview published through service | [Story rollout](docs/releases/2026-10-18-mini-stories.md); all 17 existing tables/assets preserved; course catalog and all ten French/Khmer URLs unchanged |
| Levantine Everyday | Lesson 1 v4 with S0 synthetic prompt audio; lessons 3/6 v3, other four v2 | [October 18 publication](docs/releases/2026-10-18-s0-audio.md); existing publications preserved |
| French lessons | Five exact v1 **unreviewed, text-only** first-unit previews | [F25.2.1 audit](content/french/meet-01/publication.json); no accepted linguistic/rights review or human audio |
| Khmer lessons | Five exact v1 **unreviewed, text-only** first-unit previews | [F26.2.1 audit](content/khmer/meet-01/publication.json); no human audio/accepted linguistic review |
| Alphabet | Five exact v1 inventory-only previews; full five text-only draft packs remain unpublished | [F28 scope](docs/alphabet-text-only-completion.md); F30 acceptance/release remains |
| Mini-stories | Exact A little rest v1 **unreviewed, text-only** preview | [F23.1.1 publication](content/stories/after-a-long-day/publication.json); normal human/source acceptance pending, no beta inclusion |
| Cultural media | Application deployed; four local research editions, hosted catalog empty at last verification | [F21 release](docs/releases/2026-10-15-cultural-media.md) |
| Beta | Not released; invitation/pilot/content/access/provider gates remain | F18; no French/Khmer beta inclusion inferred |

Local DB record numbers and hosted record numbers are different namespaces. Always
inspect the actual target before a new publication claim; historical IDs are evidence,
not a deployment command. UI availability is not curriculum completion.

## Priority and authorization boundaries

- Preserve the owner's selected engagement order: remaining **F23 → F17.5**;
  F22/F17.6/F17.7 are already delivered. F23 implementation was authorized October 18;
  F17.5 remains planning-only and exact content publication remains separate. [Original scopes](docs/learning-engagement-plan.md).
- Arabic content: review F12.1/F12.2 candidates before further release; F09 real
  recordings remain distinct from F19's narrowly authorized free-tier audition.
- Multi-language: F24 software is deployed. Accepted F25/F26 first units and actual
  device/pilot evidence precede bulk course/release decisions. F25/F26 draft implementation is
  authorized; French definition was selected October 18, with exact review/source gates open. F28's
  Metropolitan French choice applies only to its alphabet pack.
- F18.1 remains owner-deferred. No participant/reviewer contact, hiring, spending,
  provider enrollment, beta expansion or changed preview publication follows from
  reorganizing or reprioritizing this roadmap.
- F28 is complete under the owner's explicit text-only scope revision. Human/source
  acceptance, track controls and real access/release evidence remain F30; real audio
  remains with F09/F25.5/F26.5 as applicable. No other parent was narrowed here.

These are dependency lanes, not a new total priority order or a schedule. When a
lane's next step needs input, choose independent work only within existing authority.

## Work queues

Each ID appears once below, grouped by its main next gate. Parent and child states
are independent. Detailed records below carry the full readiness/delivery distinction.
The next-action text names the actor; use the record before taking action.

### Partial

| ID / scope | Next action or remaining gate |
| --- | --- |
| [F25 · French course](#f25-french-course) | Owner: designate fluent reviewer/source dispositions. Agent: first-unit review/pilot before bulk units 2–12. |
| [F25.3 · French starting check, sounds and text support](#f253-french-starting-check-sounds-and-text-support) | Reviewer/agent: accept sample/spelling inputs, then calibrate starting check and sound/text support. |
| [F06.1 · Character art redesign](#f061-character-art-redesign) | Owner: decide whether to authorize the remaining profile/turnaround production; no current app call site needs it. |
| [F12 · Levantine course expansion](#f12-levantine-course-expansion) | Owner: review F12.1 drafts. Agent: bound the next batch only after review; do not equate three drafts with twelve weeks. |
| [F15 · Personal study plan and placement](#f15-personal-study-plan-and-placement) | Agent: scope remaining track-specific assessments/modules; reuse delivered F28 text-only explorer, with F30/F09 review/audio boundaries. |
| [F17 · Learning support and gamification](#f17-learning-support-and-gamification) | Owner/agent: bound F17.5 and separate reminder/XP tasks before implementation; preserve no-hearts/free-floor constraints. |
| [F18 · Invite-only beta readiness](#f18-invite-only-beta-readiness) | Agent: split remaining invite enforcement, reports/quarantine and operations into bounded tasks. Owner: resume F18.1 only explicitly. |
| [F26 · Khmer course](#f26-khmer-course) | Owner: designate review route and source/help/reading dispositions. Agent: finish first-unit acceptance/pilot before bulk units 2–12. |
| [F26.3 · Khmer script, sounds, input and starting check](#f263-khmer-script-sounds-input-and-starting-check) | Reviewer: select inventory/help and sound modules. Agent: integrate accepted modules and actual device checks; reuse F28/F30 rather than duplicate explorer. |
| [F23 · Recurring mini-stories](#f23-recurring-mini-stories) | Owner: review F23.1. Agent: scope episodes two/three after first review; shared machinery and exact unreviewed preview are deployed. |

### Review pending

| ID / scope | Next action or remaining gate |
| --- | --- |
| [F25.2 · French first unit](#f252-french-first-unit) | Reviewer/owner: disposition five private drafts; exact text, register, answers, segments and source acceptance remain. |
| [F12.2 · Transliteration and pronunciation audit](#f122-transliteration-and-pronunciation-audit) | Owner: review exact corrections. Agent: record source/model dispositions and reconcile existing local drafts before integration. |
| [F21 · Cultural watch and listen recommendations](#f21-cultural-watch-and-listen-recommendations) | Agent: resolve F21.1 source/access/runtime gaps; owner reviews exact editions; F21.5 retains real AT/release checks. |
| [F21.1 · Curation and first four collections](#f211-curation-and-first-four-collections) | Agent: verify precise runtime/edition, playback, region/access/support and editorial suitability; owner records dispositions. |
| [F26.2 · Khmer first unit](#f262-khmer-first-unit) | Reviewer/owner: disposition exact phrases/answers/segments/sources; agent reconciles changes before any new approval/publication. |
| [F23.1 · First text episode](#f231-first-text-episode) | Owner: review exact A little rest scene/check/role/source candidate; v1 is published only under the unreviewed exception. |

### Input needed

| ID / scope | Next action or remaining gate |
| --- | --- |
| [F25.1 · French definition, sources and review route](#f251-french-definition-sources-and-review-route) | Owner: designate fluent French reviewer and disposition prepared sources/rights; course variety/depth/outcome selected. |
| [F25.5 · French model audio and guided speaking](#f255-french-model-audio-and-guided-speaking) | Reviewer: accept fourteen scripts. Owner: arrange permitted recordings and provider/privacy decisions. |
| [F09 · Reviewed Levantine recordings](#f09-reviewed-levantine-recordings) | Owner: supply/select permitted recordings and reviewer for an exact prompt batch. Agent: reconcile script/package hashes before upload. |
| [F14 · Quranic course](#f14-quranic-course) | Owner: approve exact resource IDs/permissions. Agent: scope integrity and track-specific review/publication controls. |
| [F26.5 · Khmer model audio and guided speaking](#f265-khmer-model-audio-and-guided-speaking) | Reviewer: accept scripts. Owner: arrange permitted recordings and provider/privacy decisions; agent verifies actual Khmer feedback/offline behavior. |
| [F30 · Alphabet content acceptance and release](#f30-alphabet-content-acceptance-and-release) | Owner: designate reviewers. Agent: disposition exact inventories/help/examples/rights, scope MSA/Quranic controls, then collect authorized access/release evidence. |

### Decision needed

| ID / scope | Next action or remaining gate |
| --- | --- |
| [F11 · Guided speaking](#f11-guided-speaking) | Owner: select a first scenario and provider/privacy setup. Agent: scope the selected branch and failure/text alternatives. |
| [F16 · Account recovery and deletion](#f16-account-recovery-and-deletion) | Owner: decide email delivery, hosting constraints and deletion/retention requirements; then agent scopes flows. |
| [F26.1 · Khmer definition, sources and review route](#f261-khmer-definition-sources-and-review-route) | Owner/reviewer: accept source/rights, help v0, eight-expression inventory and observed-outcome rubric. |

### Verification pending

| ID / scope | Next action or remaining gate |
| --- | --- |
| [F21.4 · Availability upkeep and corrections](#f214-availability-upkeep-and-corrections) | Agent/owner: execute one real unavailable-item/replacement/recheck cycle once F21.1 content is accepted. |
| [F21.5 · Verification and authorized release](#f215-verification-and-authorized-release) | Agent/owner: finish real media checks and AT; publish only exact approved revisions; application rollout already verified. |
| [F24 · Multi-language foundation and parallel study](#f24-multi-language-foundation-and-parallel-study) | Owner/agent: agree real device/pilot setup and accepted first-unit inputs; verify Safari offline. Do not rebuild settings/selector/console. |
| [F24.2 · Language-aware learner presentation](#f242-language-aware-learner-presentation) | Owner/agent: run actual input/screen-reader/device checks with accepted first-unit text/audio; verify Safari reload/reconnection. |
| [F24.5 · Mixed-language verification and pilot](#f245-mixed-language-verification-and-pilot) | Owner: agree devices/participants/rubric. Agent: execute protocol when reviewed first units/audio are available; F18.1 stays deferred. |
| [F24.6 · Expansion release decision and delivery](#f246-expansion-release-decision-and-delivery) | Agent: complete content-specific device/offline/recovery evidence after F24.5; owner decides exact release/cohort/beta inclusion. |
| [F24.7 · Multi-language wording, landing and visual identity](#f247-multi-language-wording-landing-and-visual-identity) | Owner/agent: perform real screen-reader/mobile checks. A Khmer brand rendering is not adopted without linguistic acceptance. |
| [F24.8 · Prominent language and course switching](#f248-prominent-language-and-course-switching) | Owner/agent: run an observed switching/discoverability task and actual device/AT checks; preserve independent primary allocation. |
| [F26.6 · Khmer pilot, publication and release evidence](#f266-khmer-pilot-publication-and-release-evidence) | Owner: agree rubric/setup/participation after F26.1. Agent: record immediate/delayed evidence and fix/retest before scaling. |

### Planned

| ID / scope | Next action or remaining gate |
| --- | --- |
| [F25.4 · French remaining units and reference material](#f254-french-remaining-units-and-reference-material) | Reviewer/agent: use first-unit review/pilot before bounded units 2–12 batches. |
| [F25.6 · French pilot, publication and release evidence](#f256-french-pilot-publication-and-release-evidence) | Owner/reviewer: accepted text/audio and agreed setup precede the prepared pilot protocol. |
| [F13 · MSA course](#f13-msa-course) | Owner/agent: define first unit, source/audio permissions and a bounded console-control extension. |
| [F17.5 · Phrase anatomy and grammar reference](#f175-phrase-anatomy-and-grammar-reference) | Agent after implementation authorization: map phrases/patterns/notes to exact approved sources and console metadata. |
| [F26.4 · Khmer remaining units and reference material](#f264-khmer-remaining-units-and-reference-material) | Agent after first-unit review/pilot: revise sequence and author source-backed bounded batches. |

### Deferred

| ID / scope | Next action or remaining gate |
| --- | --- |
| [F18.1 · First-unit observed rehearsal](#f181-first-unit-observed-rehearsal) | Owner: explicitly resume and arrange participation. Agent then reconciles task versions against current F22 publications before device preflight. |

### Complete

| ID / scope | Next action or remaining gate |
| --- | --- |
| [F23.1.1 · Exact first-story development preview](#f2311-exact-first-story-development-preview) | Deployed 0.0.4 and published exact v1 unreviewed/text-only; normal F23.1 review/access gates remain. |
| [F31 · About and FAQ page](#f31-about-and-faq-page) | Separate page and shared FAQ deployed as 0.0.2; linked from landing and Account; no remaining work in this scope. |
| [F27.3 · Learner clarity and mobile fixes](#f273-learner-clarity-and-mobile-fixes) | UI fixes delivered; preview availability restored on prior API; source regression corrected in `34a936b`. |
| [F25.2.1 · Owner-authorized French text-only development preview](#f2521-owner-authorized-french-text-only-development-preview) | Five exact v1 previews published; normal F25 review/audio/pilot/depth gates remain. |
| [F19 · Chatterbox phrase audio](#f19-chatterbox-phrase-audio) | Local synthetic-audio contract complete; eight selected mappings integrated into an isolated private console draft. F19.1 retains rights/release. |
| [F19.1 · Synthetic audio rights and preview release](#f191-synthetic-audio-rights-and-preview-release) | Six S0 clips published across eight lesson-one prompts as v4; other publications and learner data preserved. |
| [F01 · Core study and offline progress](#f01-core-study-and-offline-progress) | Bounded scope delivered; deployed. |
| [F02 · Guest and account baseline](#f02-guest-and-account-baseline) | Bounded scope delivered; deployed. |
| [F03 · Levantine curriculum console](#f03-levantine-curriculum-console) | Bounded scope delivered; deployed. |
| [F04 · First-unit guided teaching packages](#f04-first-unit-guided-teaching-packages) | Superseded by F08/F22 releases |
| [F05 · Manual review and checkpoints](#f05-manual-review-and-checkpoints) | Bounded scope delivered; deployed. |
| [F06 · Recurring character support](#f06-recurring-character-support) | Bounded scope delivered; deployed. |
| [F06.1.1 · Selected art integration](#f0611-selected-art-integration) | No curriculum change |
| [F07 · Landing page and app welcome](#f07-landing-page-and-app-welcome) | Bounded scope delivered; deployed. |
| [F08 · First-unit revision release](#f08-first-unit-revision-release) | Published; F22 supersedes lessons 1/3/6 |
| [F09.1 · First recording batch preparation](#f091-first-recording-batch-preparation) | Unpublished scripts |
| [F10 · Scheduled review](#f10-scheduled-review) | Bounded scope delivered; deployed. |
| [F12.1 · Make a plan together](#f121-make-a-plan-together) | Local unapproved drafts |
| [F15.1 · Personal study settings](#f151-personal-study-settings) | Bounded scope delivered; deployed via f24 foundation. |
| [F15.2 · Placement starting point](#f152-placement-starting-point) | Bounded scope delivered; deployed. |
| [F17.1 · Learner satisfaction](#f171-learner-satisfaction) | Bounded scope delivered; deployed. |
| [F17.2 · Dashboard loading feedback](#f172-dashboard-loading-feedback) | Bounded scope delivered; deployed. |
| [F17.3 · Interface copy cleanup](#f173-interface-copy-cleanup) | Bounded scope delivered; deployed. |
| [F17.4 · Loading word reel](#f174-loading-word-reel) | Bounded scope delivered; deployed. |
| [F17.6 · Can-do progress and outcome achievements](#f176-can-do-progress-and-outcome-achievements) | Bounded scope delivered; deployed. |
| [F17.7 · Weekly learning quests and forgiving habits](#f177-weekly-learning-quests-and-forgiving-habits) | Bounded scope delivered; deployed. |
| [F20 · Learned-word glossary](#f20-learned-word-glossary) | Uses existing lesson publications |
| [F20.1 · Learned words page and Account spacing](#f201-learned-words-page-and-account-spacing) | Bounded scope delivered; deployed. |
| [F21.2 · Media catalog and publication console](#f212-media-catalog-and-publication-console) | Catalog empty |
| [F21.3 · Learner collections and offline metadata](#f213-learner-collections-and-offline-metadata) | Catalog empty |
| [F22 · Recall and recombine](#f22-recall-and-recombine) | Everyday 1/3/6 v3 published |
| [F24.1 · Language and course records with compatibility](#f241-language-and-course-records-with-compatibility) | Bounded scope delivered; deployed. |
| [F24.3 · Parallel study settings and daily queue](#f243-parallel-study-settings-and-daily-queue) | Bounded scope delivered; deployed. |
| [F24.4 · Multi-language curriculum console and validation](#f244-multi-language-curriculum-console-and-validation) | Normal gates plus exact F26.2.1 exception |
| [F24.8.1 · Switching continuity and shared presentation](#f2481-switching-continuity-and-shared-presentation) | Bounded scope delivered; deployed. |
| [F24.8.2 · Course identity banner, colors and culture card](#f2482-course-identity-banner-colors-and-culture-card) | Bounded scope delivered; deployed. |
| [F26.2.1 · Owner-authorized text-only development preview](#f2621-owner-authorized-text-only-development-preview) | Five v1 previews published |
| [F27 · Feature discoverability and navigation](#f27-feature-discoverability-and-navigation) | Bounded scope delivered; deployed. |
| [F27.1 · Mobile-friendly back navigation](#f271-mobile-friendly-back-navigation) | Bounded scope delivered; deployed. |
| [F27.2 · Scannable study plan and can-do progress](#f272-scannable-study-plan-and-can-do-progress) | Bounded scope delivered; deployed. |
| [F28 · Alphabet explorer](#f28-alphabet-explorer) | Five old inventory previews; full drafts unpublished |
| [F28.1 · Shared explorer, content model and gates](#f281-shared-explorer-content-model-and-gates) | Existing exact inventory previews |
| [F28.1.1 · Shared application candidate](#f2811-shared-application-candidate) | Bounded scope delivered; deployed. |
| [F28.1.2 · Inventory-only preview publication](#f2812-inventory-only-preview-publication) | Five v1 inventory previews published |
| [F28.2 · Arabic explorer draft packs](#f282-arabic-explorer-draft-packs) | Unpublished draft files |
| [F28.3 · Khmer explorer draft pack](#f283-khmer-explorer-draft-pack) | Unpublished draft files |
| [F28.4 · French explorer draft pack](#f284-french-explorer-draft-pack) | Unpublished draft files |
| [F28.5 · Practice, downloads and separate evidence](#f285-practice-downloads-and-separate-evidence) | Full drafts unpublished |
| [F28.6 · Automated access and candidate verification](#f286-automated-access-and-candidate-verification) | Bounded scope delivered; deployed. |
| [F29 · Privacy policy and beta version](#f29-privacy-policy-and-beta-version) | Bounded scope delivered; included in deployed frontend; route not freshly checked. |

## Feature records

These records own current state. [Scope/acceptance reference](docs/planning/feature-scope-reference.md)
retains detailed contracts, policies and supporting evidence; it does not own status,
priority, next actions or authorization. Feature notes retain detailed test/release
history. Readiness here is reconciled October 17 from those records and the checkout,
not a fresh execution of every feature's tests or inspection of each database.

### F01 Core study and offline progress

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Core study, free explanations/retries, offline downloads/completion and queued progress sync.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f01-core-study-and-offline-progress).

### F02 Guest and account baseline

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Guest entry, cookie accounts and durable course progress; lifecycle extensions are F16.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f02-guest-and-account-baseline).

### F03 Levantine curriculum console

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Owner curriculum workflow and recording transport for Levantine; MSA/Quranic gates retained.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f03-levantine-curriculum-console).

### F04 First-unit guided teaching packages

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Authored; verification — Automated.
- **Delivery:** Application — Committed; content publication — Superseded by F08/F22 releases.
- **Scope:** Seven Everyday guided-teaching packages with 43 phrase cards.
- **Next action:** None for authoring; current publication lineage is F08/F22, not the original package snapshot.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f04-first-unit-guided-teaching-packages).

### F05 Manual review and checkpoints

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Manual context review/checkpoints with versioned device-local history; scheduling is F10.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f05-manual-review-and-checkpoints).

### F06 Recurring character support

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Recurring characters, explicit roles, offline portraits and legacy compatibility.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f06-recurring-character-support).

### F06.1 Character art redesign

- **Work state:** Partial.
- **Readiness:** Implementation — Partial; content — Partial; verification — Automated.
- **Delivery:** Application — Deployed selected art; content publication — No curriculum change.
- **Scope:** Selected art integrated; broader profile/turnaround deliverables remain.
- **Next action:** Owner: decide whether to authorize the remaining profile/turnaround production; no current app call site needs it.
- **Authorization:** Selected art and size refinement delivered; further asset production/handoff is separate scope.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f061-character-art-redesign).

### F06.1.1 Selected art integration

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Approved; verification — Automated.
- **Delivery:** Application — Deployed; content publication — No curriculum change.
- **Scope:** Owner-selected v2 portraits/scenes and larger lesson/home portraits.
- **Next action:** None; preserve source art, prompts/hashes and authored roles.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f0611-selected-art-integration).

### F07 Landing page and app welcome

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Landing, real-app entry, once-only skippable welcome and return links.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f07-landing-page-and-app-welcome).

### F08 First-unit revision release

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Approved; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Published; F22 supersedes lessons 1/3/6.
- **Scope:** Exact seven Everyday v2 revisions approved/published; three later superseded by F22 v3.
- **Next action:** None for this release; use current version lineage before preparing any revision.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f08-first-unit-revision-release).

### F09 Reviewed Levantine recordings

- **Work state:** Input needed.
- **Readiness:** Implementation — Complete transport; content — Scripts only; verification — Partial.
- **Delivery:** Application — Transport deployed; content publication — No human audio published.
- **Scope:** Reviewed real-speaker Levantine recordings; first batch has 8/56 proposed prompt coverage, 0/56 reviewed clips.
- **Next action:** Owner: supply/select permitted recordings and reviewer for an exact prompt batch. Agent: reconcile script/package hashes before upload.
- **Authorization:** Preparation authorized; no hiring, speaker contact or spending. Publication remains exact-version gated.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f09-reviewed-levantine-recordings).
- **Dependencies:** assets and human review; [recording preparation](docs/pilot/recordings.md). F19 is the prioritized interim synthetic-audio task and cannot complete this human-audio scope. Silence fixtures and device voice previews cannot complete this item. Partial batches must report coverage; the beta needs full core-audio coverage checked under F18.

### F09.1 First recording batch preparation

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Authored; verification — Automated.
- **Delivery:** Application — Committed; content publication — Unpublished scripts.
- **Scope:** Eight exact lesson-1 recording prompts, context and blank permissions/review checklist.
- **Next action:** Owner: provide speakers/reviewer and permitted clips under F09; preparation itself is complete.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f091-first-recording-batch-preparation).

### F10 Scheduled review

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Approved 1/3/7/14-day due review, local history and version/withdrawal handling.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f10-scheduled-review).

### F11 Guided speaking

- **Work state:** Decision needed.
- **Readiness:** Implementation — Not started; content — Not authored; verification — Not run.
- **Delivery:** Application — None; content publication — None.
- **Scope:** Controlled scripted conversations with online feedback and privacy-safe voice handling.
- **Next action:** Owner: select a first scenario and provider/privacy setup. Agent: scope the selected branch and failure/text alternatives.
- **Authorization:** Provider, scenario, data handling and cost choices unresolved; no external integration/spend inferred.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f11-guided-speaking).

### F12 Levantine course expansion

- **Work state:** Partial.
- **Readiness:** Implementation — Partial; content — Partial; verification — Partial.
- **Delivery:** Application — Shared application deployed; content publication — Everyday published; Plans drafts private.
- **Scope:** Twelve-week Palestinian Levantine curriculum; one follow-on unit drafted, wider depth absent.
- **Next action:** Owner: review F12.1 drafts. Agent: bound the next batch only after review; do not equate three drafts with twelve weeks.
- **Authorization:** Arabic work authorized; new bounded authoring/publication follows source and owner-review gates.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f12-levantine-course-expansion).

### F12.1 Make a plan together

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Authored; verification — Automated.
- **Delivery:** Application — Committed; content publication — Local unapproved drafts.
- **Scope:** Three Plans lessons, positions 8–10, validated and imported locally.
- **Next action:** Owner: preview/review exact drafts; approval/publication remains separate under F12.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f121-make-a-plan-together).

### F12.2 Transliteration and pronunciation audit

- **Work state:** Review pending.
- **Readiness:** Implementation — Complete draft tooling; content — Draft; verification — Automated.
- **Delivery:** Application — Compatible code deployed; content publication — Correction candidates unpublished.
- **Scope:** Transliteration audit and three exact correction candidates for Everyday lessons 3/5/7.
- **Next action:** Owner: review exact corrections. Agent: record source/model dispositions and reconcile existing local drafts before integration.
- **Authorization:** Audit/correction drafting authorized; actual speaker evidence and exact approval/publication remain required.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f122-transliteration-and-pronunciation-audit).
- **Dependencies:** approved-source constraints and reviewed Palestinian pronunciation for audio claims. Revised package approval/publication and recording-script/hash reconciliation are separate gates; preserve published release snapshots.

### F13 MSA course

- **Work state:** Planned.
- **Readiness:** Implementation — Not started; content — Not authored; verification — Not run.
- **Delivery:** Application — Shared UI only; content publication — No MSA lessons.
- **Scope:** Four-week MSA course with timeless adapted listening and track-specific publication controls.
- **Next action:** Owner/agent: define first unit, source/audio permissions and a bounded console-control extension.
- **Authorization:** Roadmap target; no source/provider choice or publication implied.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f13-msa-course).

### F14 Quranic course

- **Work state:** Input needed.
- **Readiness:** Implementation — Not started; content — Sources proposed; verification — Not run.
- **Delivery:** Application — Shared UI only; content publication — No Quranic lessons.
- **Scope:** Four-week direct-meaning Quranic course with unchanged canonical text and separate provenance layers.
- **Next action:** Owner: approve exact resource IDs/permissions. Agent: scope integrity and track-specific review/publication controls.
- **Authorization:** Approved-source boundary applies; no generated/normalized canonical text or invented qualified acceptance.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f14-quranic-course).

### F15 Personal study plan and placement

- **Work state:** Partial.
- **Readiness:** Implementation — Partial; content — Partial; verification — Partial.
- **Delivery:** Application — Settings/Levantine check deployed; content publication — Other assessments/modules unavailable.
- **Scope:** Study settings and Levantine starting check delivered; remaining track placement/reading/sound modules absent.
- **Next action:** Agent: scope remaining track-specific assessments/modules; reuse delivered F28 text-only explorer, with F30/F09 review/audio boundaries.
- **Authorization:** Existing Arabic scope retained; new assessment/module choices need bounded acceptance criteria.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f15-personal-study-plan-and-placement).

### F15.1 Personal study settings

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed via F24 foundation; content publication — N/A.
- **Scope:** Goal/primary-course settings and guest/account persistence; allocation superseded by approved F24.3 policy.
- **Next action:** None; F24.3 is the current parallel queue policy. Do not reimplement the earlier allocation assumption.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f151-personal-study-settings).

### F15.2 Placement starting point

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Optional published-content six-question Levantine starting check; device-local results/support choices.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f152-placement-starting-point).

### F16 Account recovery and deletion

- **Work state:** Decision needed.
- **Readiness:** Implementation — Not started; content — N/A; verification — Not run.
- **Delivery:** Application — None; content publication — N/A.
- **Scope:** Account confirmation/recovery and data deletion, with defined retention/delivery behavior.
- **Next action:** Owner: decide email delivery, hosting constraints and deletion/retention requirements; then agent scopes flows.
- **Authorization:** Provider, retention and external identity choices unresolved; no service signup/spend inferred.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f16-account-recovery-and-deletion).

### F17 Learning support and gamification

- **Work state:** Partial.
- **Readiness:** Implementation — Partial; content — Partial; verification — Partial.
- **Delivery:** Application — Selected children deployed; content publication — No new grammar-reference content.
- **Scope:** Learning support umbrella: habits/can-do/UI delivered; grammar, XP economy and reminders remain.
- **Next action:** Owner/agent: bound F17.5 and separate reminder/XP tasks before implementation; preserve no-hearts/free-floor constraints.
- **Authorization:** Selected research priorities are planning; delivered children do not authorize remaining product/provider policies.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f17-learning-support-and-gamification).

### F17.1 Learner satisfaction

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Today/Continue, goal/completion colors and factual lesson recaps; sound auditions/timers excluded.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f171-learner-satisfaction).

### F17.2 Dashboard loading feedback

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Truthful startup/refresh/loading/retry and offline feedback; later oval hero refinement retained.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f172-dashboard-loading-feedback).

### F17.3 Interface copy cleanup

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Functional copy cleanup with required instructions/provenance/error notices preserved.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f173-interface-copy-cleanup).

### F17.4 Loading word reel

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Six source-linked loading-word samples with pause, reduced motion and no artificial delay.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f174-loading-word-reel).

### F17.5 Phrase anatomy and grammar reference

- **Work state:** Planned.
- **Readiness:** Implementation — Not started; content — Not authored; verification — Not run.
- **Delivery:** Application — None; content publication — None.
- **Scope:** First scope: six phrases, two reusable grammar patterns, three sourced usage notes and searchable offline reference.
- **Next action:** Agent after implementation authorization: map phrases/patterns/notes to exact approved sources and console metadata.
- **Authorization:** Research priority selected October 12; implementation/publication not authorized by that selection.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f175-phrase-anatomy-and-grammar-reference).
- **Dependencies:** F03/F04/F20, approved sources/content and publication approval.

### F17.6 Can-do progress and outcome achievements

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Three written-recall can-do cards and optional achievement using accepted distinct/delayed evidence.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f176-can-do-progress-and-outcome-achievements).
- **Dependencies:** F22 metadata/attempts and F10 scheduling, using existing owner-approved published packages; no new content, provider or backend migration.

### F17.7 Weekly learning quests and forgiving habits

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Goal-sized weekly quests and forgiving streaks, separate opt-outs and device-local history.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f177-weekly-learning-quests-and-forgiving-habits).
- **Dependencies:** F15.1 goals/queue, F05/F10 practice, F17.1 feedback; F22/F23 supply optional task types as delivered, not a requirement to invent unavailable activities.

### F18 Invite-only beta readiness

- **Work state:** Partial.
- **Readiness:** Implementation — Partial; content — Partial; verification — Partial.
- **Delivery:** Application — Development preview only; content publication — Beta not released.
- **Scope:** First-100 adult invite-only beta: curriculum, voice, account lifecycle, invite/report controls and all release evidence.
- **Next action:** Agent: split remaining invite enforcement, reports/quarantine and operations into bounded tasks. Owner: resume F18.1 only explicitly.
- **Authorization:** Beta gates unchanged; rehearsal deferred, participant contact/spending/beta opening require their own authority.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f18-invite-only-beta-readiness).

### F18.1 First-unit observed rehearsal

- **Work state:** Deferred.
- **Readiness:** Implementation — Protocol ready; content — Published-unit rehearsal kit; verification — Automated preflight only.
- **Delivery:** Application — No observed rehearsal; content publication — N/A.
- **Scope:** Owner-deferred iPhone/Safari first-unit rehearsal with immediate/delayed recall and fix/retest evidence.
- **Next action:** Owner: explicitly resume and arrange participation. Agent then reconciles task versions against current F22 publications before device preflight.
- **Authorization:** Owner deferred October 3; do not resume testing or contact participants from a priority recommendation.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f181-first-unit-observed-rehearsal).
- **Dependencies:** F08, intended test setup and owner-arranged participation. Real audio can progress under F09; a text rehearsal cannot establish listening/pronunciation quality. Owner authorized preparation and evidence-led fixes on October 3; participant contact and spending remain separate. The exact F08 content/art approval is complete.

### F19 Chatterbox phrase audio

- **Work state:** Complete.
- **Readiness:** Implementation — Complete for bounded local synthetic provenance/console draft scope; content — Eight exact owner-selected draft mappings, female lighter accepted fallback; verification — 55 API tests, 14 Python checks, frontend build and five focused browser flows pass; real chosen clip plays in saved draft preview. Real-device/AT gates remain F18.
- **Delivery:** Application — Committed/pushed `5c169b7`, frontend Ready and API healthy on existing development hosts; content publication — Original F0 mappings remain in private local draft record 7 v1; S0 regeneration published under F19.1.
- **Scope:** Reproducible synthetic workflow, provenance/labels, eight accepted draft prompt mappings and focused playback/offline validation; original bounded contract, not human-audio or release completion.
- **Next action:** None in this local implementation scope; F19.1 owns rights acceptance and authorized rollout, F09 owns reviewed human audio.
- **Authorization:** Owner authorized local F19 implementation, F0 synthesis, selected clips/fallback and console integration October 17. Owner subsequently authorized push/publication; application deployed under F19.1. No paid resource, full-unit synthesis or rights acceptance inferred.
- **Completion gate / evidence:** [Contract and linked evidence](docs/planning/feature-scope-reference.md#f19-chatterbox-phrase-audio); [local implementation and verification](docs/f19-synthetic-audio.md).
- **Dependencies:** F22 approved lesson-one source; preserved F08/F09.1 audition lineage; normal console gates. F09 and F18 remain independent.

#### F19.1 Synthetic audio rights and preview release

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Six S0-generated clips across eight exact prompt mappings, rights evidence recorded and owner selections reconciled by automated waveform comparison; verification — Normal service readiness/validation/approval/publication pass, public v4 and six audio hashes verified, thirteen non-curriculum table hashes and existing assets preserved. No new listening, native-expert or field-accessibility review claimed.
- **Delivery:** Application — Existing deployed `5c169b7` support; content publication — Hosted record 29, lesson one v4, October 18; prior record 21 v3 retained for rollback. F0 files remain private.
- **Scope:** Exact synthetic-resource rights acceptance and separately authorized application/audio rollout to the existing development preview; no beta/human-audio claim.
- **Next action:** None in this bounded release; wider human-audio and real-device/beta gates remain F09/F18.
- **Authorization:** Owner requested push/publication and subsequently authorized the S0 switch and six-clip regeneration using verified trial credits, followed by validation/publication. No whole-account pay-as-you-go upgrade or broader spending performed.
- **Completion gate / evidence:** [Rights/release contract](docs/planning/feature-scope-reference.md#f191-synthetic-audio-rights-and-preview-release); [S0 publication evidence](docs/releases/2026-10-18-s0-audio.md).
- **Dependencies:** F19 selected requests/current source; normal publishing-service gates passed.

### F20 Learned-word glossary

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Approved source-derived; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Uses existing lesson publications.
- **Scope:** Learned-word senses/search/context links and synced-account inclusion with offline identity isolation.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f20-learned-word-glossary).

### F20.1 Learned words page and Account spacing

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Standalone Words route and Account/mobile-goal spacing; later integrated into five-tab navigation.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f201-learned-words-page-and-account-spacing).

### F21 Cultural watch and listen recommendations

- **Work state:** Review pending.
- **Readiness:** Implementation — Complete; content — Draft; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Hosted media catalog empty.
- **Scope:** Weekly video/film/song application delivered; four local research editions lack actual media/editorial acceptance.
- **Next action:** Agent: resolve F21.1 source/access/runtime gaps; owner reviews exact editions; F21.5 retains real AT/release checks.
- **Authorization:** Application deployed; no real media approval/publication, creator contact or spending inferred.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f21-cultural-watch-and-listen-recommendations).
- **Dependencies:** actual permitted resources and human checks; exact owner publication approval. No new provider, spending or creator contact is required by this software.

#### F21.1 Curation and first four collections

- **Work state:** Review pending.
- **Readiness:** Implementation — Complete authoring/import; content — Draft; verification — Partial.
- **Delivery:** Application — Four editions imported locally; content publication — Unpublished.
- **Scope:** Twelve primary media candidates and three replacements, with original prompts and access/source gaps.
- **Next action:** Agent: verify precise runtime/edition, playback, region/access/support and editorial suitability; owner records dispositions.
- **Authorization:** Research/curation within selected broader-Arabic scope; exact owner publication approval outstanding.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f211-curation-and-first-four-collections).
- **Dependencies:** actual source availability and human review; broader Arabic scope is settled.

#### F21.2 Media catalog and publication console

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Catalog empty.
- **Scope:** Versioned media owner console, atomic editions, Monday UTC visibility and audited rollback.
- **Next action:** None for software; real collection acceptance is F21.1/F21.5.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f212-media-catalog-and-publication-console).

#### F21.3 Learner collections and offline metadata

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Catalog empty.
- **Scope:** Learner media cards/archive, safe publisher links and atomic offline metadata.
- **Next action:** None for software; real media and AT/device acceptance is F21.5.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f213-learner-collections-and-offline-metadata).

#### F21.4 Availability upkeep and corrections

- **Work state:** Verification pending.
- **Readiness:** Implementation — Complete; content — Depends on F21.1; verification — Automated.
- **Delivery:** Application — Deployed; content publication — No accepted replacement cycle.
- **Scope:** Audited suppression/replacement/upkeep software delivered; real editorial cycle not rehearsed.
- **Next action:** Agent/owner: execute one real unavailable-item/replacement/recheck cycle once F21.1 content is accepted.
- **Authorization:** Software delivered; optional learner reports deferred and new retention policies not selected.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f214-availability-upkeep-and-corrections).
- **Dependencies:** accepted F21.1 content/replacements; F21.2/F21.3 software is available.

#### F21.5 Verification and authorized release

- **Work state:** Verification pending.
- **Readiness:** Implementation — Complete; content — Draft; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Unpublished.
- **Scope:** Per-source, actual AT/device and first-edition approval/publication/recovery evidence.
- **Next action:** Agent/owner: finish real media checks and AT; publish only exact approved revisions; application rollout already verified.
- **Authorization:** Application delivery authorized/completed; exact owner content publication approval still required.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f215-verification-and-authorized-release).
- **Dependencies:** F21.1/F21.4 completion and exact owner publication approval; application rollout is authorized.

### F22 Recall and recombine

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Approved; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Everyday 1/3/6 v3 published.
- **Scope:** Typed contextual recall, independent/help/retry evidence, delayed variants and human answer reports.
- **Next action:** None for released slice; additional targets need exact review and F18 retains broader human/device/outcome evidence.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f22-recall-and-recombine).
- **Dependencies:** F03/F04/F05/F10, published source-linked content and explicit input policy; reuse F18's report-case work if available, otherwise scope the minimal review path.

### F23 Recurring mini-stories

- **Work state:** Partial.
- **Readiness:** Implementation — shared text-story machinery complete; remaining episode scopes follow first review; content — first unreviewed preview and linked arc outline; two episodes unauthored; verification — automated candidate checks, real access/learner evidence missing.
- **Delivery:** Application — Deployed 0.0.4, application source `99f2de4`; content publication — Exact first episode v1 unreviewed/text-only; remaining episodes unauthored.
- **Scope:** Linked three-episode text story arc using taught Levantine language; audio is a separate extension.
- **Next action:** Owner: review F23.1's exact scene/check/role/source candidate. Agent: reconcile feedback, then scope episodes two/three after first review.
- **Authorization:** Owner authorized F23 implementation October 18. Deployment and exact unreviewed-preview publication were authorized October 18; review/source-rights acceptance remain pending; the first-episode review sequence and no-assumed-Today-accounting rule are retained.
- **Completion gate / evidence:** [Full contract](docs/planning/feature-scope-reference.md#f23-recurring-mini-stories); [implementation, arc and verification](docs/mini-stories.md).
- **Dependencies:** F03/F04/F06 and approved curriculum; F22 for independently graded typed responses. Current response choices are explicitly assisted; character redesign and external media curation are independent.

### F23.1 First text episode

- **Work state:** Review pending.
- **Readiness:** Implementation — Complete: console, reader, source/version/identity and offline safeguards; content — Unreviewed first-episode text preview; verification — automated API/browser/build checks, actual screen-reader/device/Safari/learner checks missing.
- **Delivery:** Application — Deployed 0.0.4, application source `99f2de4`; content publication — Exact first episode v1 unreviewed/text-only; normal approval absent.
- **Scope:** One reviewed text episode, two comprehension checks and a response, with offline/version/identity safeguards.
- **Next action:** Owner: disposition A little rest's exact scenes, checks, response rationales, roles and source/rights reuse in Stories console; actual access checks and normal reviewed publication still precede completion.
- **Authorization:** Owner authorized implementation October 18; later authorized deployment and only the exact unreviewed text-preview publication, keeping review/rights pending. Audio is outside this text scope; no Today credit added.
- **Completion gate / evidence:** [Full contract](docs/planning/feature-scope-reference.md#f231-first-text-episode); [candidate and verification](docs/mini-stories.md).
- **Dependencies:** Exact Everyday lesson-one v4 on the selected target; F03/F04/F06. Response is choice-assisted written practice, with no independent production claim. F09 is needed only for audio.

### F23.1.1 Exact first-story development preview

- **Work state:** Complete.
- **Readiness:** Implementation — Complete: pinned exception and honest notices; content — Exact first episode unreviewed; verification — 63 API/nine story-browser/five deploy tests, hosted source/projection and preservation checks pass.
- **Delivery:** Application — Deployed 0.0.4 (`99f2de4` source); content publication — Exact v1 unreviewed/text-only preview.
- **Scope:** Deploy and publish only A little rest as an unreviewed, text-only development preview, preserving pending review/source-rights and no story audio/beta inclusion.
- **Next action:** None in this exact exception scope. Normal F23.1 human/source/access acceptance and the rest of F23 remain open.
- **Authorization:** Owner requested deploy/publication and explicitly selected this exact unreviewed text-only exception October 18. No changed/additional episodes or broader gate waiver.
- **Completion gate / evidence:** [Exact authorization, pin, rollout and preservation evidence](docs/releases/2026-10-18-mini-stories.md).
- **Dependencies:** Exact hosted Everyday lesson-one v4; F23.1 application. Normal F23 review/release gates remain independent.

### F24 Multi-language foundation and parallel study

- **Work state:** Verification pending.
- **Readiness:** Implementation — Complete; content — Partial; verification — Automated; Safari gap.
- **Delivery:** Application — Deployed; content publication — Khmer exact previews only; French none.
- **Scope:** Shared multi-language software delivered; accepted first units, actual device/AT/offline and observed pilot remain.
- **Next action:** Owner/agent: agree real device/pilot setup and accepted first-unit inputs; verify Safari offline. Do not rebuild settings/selector/console.
- **Authorization:** F24 implementation and app rollout authorized/completed; real course release and beta expansion remain separate.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f24-multi-language-foundation-and-parallel-study).
- **Dependencies:** existing foundations; F25.2/F26.2 packages for complete-flow checks; agreed queue policy and supported-browser/device matrix.

#### F24.1 Language and course records with compatibility

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Stable language/course identity, package/cache compatibility and legacy Arabic preservation.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f241-language-and-course-records-with-compatibility).
- **Dependencies:** F01/F02/F03/F15.1/F20; production database choice remains unresolved.

#### F24.2 Language-aware learner presentation

- **Work state:** Verification pending.
- **Readiness:** Implementation — Complete; content — Partial; verification — Automated; Safari gap.
- **Delivery:** Application — Deployed; content publication — Availability follows publications.
- **Scope:** Course-aware rendering, script/font/help/audio and scoped lesson resume software delivered.
- **Next action:** Owner/agent: run actual input/screen-reader/device checks with accepted first-unit text/audio; verify Safari reload/reconnection.
- **Authorization:** Software delivered; physical/human evidence remains, and exact Khmer preview exceptions do not waive it.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f242-language-aware-learner-presentation).
- **Dependencies:** F24.1; language-specific checks in F25.3/F26.3.

#### F24.3 Parallel study settings and daily queue

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Approved whole-session parallel queue, roughly 60% primary, secondary rotation and due-review allocation.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f243-parallel-study-settings-and-daily-queue).
- **Dependencies:** F24.1/F15.1/F10. Cross-device review-history sync is a separate scope.

#### F24.4 Multi-language curriculum console and validation

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Normal gates plus exact F26.2.1 exception.
- **Scope:** Multi-language console profiles, exact validation, owner workflow and versioned withdrawal/rollback.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f244-multi-language-curriculum-console-and-validation).
- **Dependencies:** F24.1/F03 and agreed course source/review definitions.

#### F24.5 Mixed-language verification and pilot

- **Work state:** Verification pending.
- **Readiness:** Implementation — Complete test harness; content — Partial; verification — Automated; no observed pilot.
- **Delivery:** Application — Application deployed; content publication — No expansion pilot release.
- **Scope:** Mixed-language full flow plus actual input/accessibility and immediate/delayed observed pilot.
- **Next action:** Owner: agree devices/participants/rubric. Agent: execute protocol when reviewed first units/audio are available; F18.1 stays deferred.
- **Authorization:** Preparation/software authorized; participant contact, beta expansion and resuming F18.1 not inferred.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f245-mixed-language-verification-and-pilot).
- **Dependencies:** F24.1–F24.4, first-unit text/audio/support under F25/F26 and pilot setup.

#### F24.6 Expansion release decision and delivery

- **Work state:** Verification pending.
- **Readiness:** Implementation — Complete app rollout; content — Partial; verification — Partial.
- **Delivery:** Application — Deployed; content publication — Expansion release gated.
- **Scope:** Application delivery complete; real first-unit release, recovery/withdrawal evidence and cohort decisions pending.
- **Next action:** Agent: complete content-specific device/offline/recovery evidence after F24.5; owner decides exact release/cohort/beta inclusion.
- **Authorization:** App rollout authorized/completed; new content/cohort/beta decisions remain explicit.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f246-expansion-release-decision-and-delivery).
- **Dependencies:** F24.5, F24.7, F24.8 and approved per-language release scope; F18 if beta is widened.

#### F24.7 Multi-language wording, landing and visual identity

- **Work state:** Verification pending.
- **Readiness:** Implementation — Complete; content — Approved shared copy; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Course availability factual.
- **Scope:** Shared wording/landing/identity delivered; owner selected existing Ismi/اسمي title; real AT/mobile acceptance outstanding.
- **Next action:** Owner/agent: perform real screen-reader/mobile checks. A Khmer brand rendering is not adopted without linguistic acceptance.
- **Authorization:** Shared overhaul authorized/deployed; retain current title A and avoid unapproved Khmer spelling/promises.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f247-multi-language-wording-landing-and-visual-identity).
- **Dependencies:** F07/F17.3 baseline; F24.1/.2/.4 course metadata/presentation/availability; approved Khmer example/content before showing that example or enabling study entry.

#### F24.8 Prominent language and course switching

- **Work state:** Verification pending.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Khmer exact previews available.
- **Scope:** Prominent course switching, filtering/resume and identity banner delivered; observed discoverability/real AT pending.
- **Next action:** Owner/agent: run an observed switching/discoverability task and actual device/AT checks; preserve independent primary allocation.
- **Authorization:** Switching/identity implementation delivered; broader human acceptance remains under F24.5.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f248-prominent-language-and-course-switching).
- **Dependencies:** F24.1/.2 metadata/presentation, F24.3 settings integration, F24.4 availability, F25/F26 published candidates and F24.5 verification. Khmer integration does not depend on French publication; enable each language as it becomes available.

##### F24.8.1 Switching continuity and shared presentation

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Switching continuity, manual lesson entry, authored/shared character roles and distinct palettes.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f2481-switching-continuity-and-shared-presentation).

##### F24.8.2 Course identity banner, colors and culture card

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Approved; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Owner-selected colored course banner/picker and Study language bubble; culture art remains picker-only.
- **Next action:** None for bounded UI; real AT/device/discoverability remains F24.5/F24.8.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f2482-course-identity-banner-colors-and-culture-card).

### F25 French course

- **Work state:** Partial.
- **Readiness:** Implementation — First-unit draft flow complete; full course partial; content — Five private unreviewed drafts; verification — 56 API and 12 browser checks; no pilot.
- **Delivery:** Application — `08fed75` deployed to existing web/API preview; content publication — Five exact unreviewed text-only v1 previews.
- **Scope:** Twelve-unit/sixty-lesson contemporary everyday French course with Metropolitan France reference; five first-unit candidates exist, 55 lessons remain.
- **Next action:** Owner: designate fluent reviewer and disposition exact sources/text. Agent: reconcile first-unit review and pilot before units 2–12; finish accepted starting-check/audio inputs.
- **Authorization:** Owner authorized implementation and selected variety/depth/outcome plus draft-now/fluent-review-before-publication route October 18. October 18 application deployment and exact five unreviewed text previews subsequently authorized; no contact, hiring, provider spending or beta expansion.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f25-french-course); [October 18 implementation/evidence](docs/french/README.md).
- **Dependencies:** Uses delivered F24.1–F24.4 software. F25.1/F25.2 review/source acceptance and F25.3/F25.5 support/audio feed early F25.6 pilot; that pilot gates F25.4 bulk authoring.

#### F25.1 French definition, sources and review route

- **Work state:** Input needed.
- **Readiness:** Implementation — Course brief and source register prepared; content — Sources proposed; verification — Primary-reference access checked; acceptance missing.
- **Delivery:** Application — N/A; content publication — N/A.
- **Scope:** Selected Metropolitan France reference, twelve units/sixty lessons and five-minute month-one conversation target; exact source/reviewer/rubric acceptance remains.
- **Next action:** Owner: designate a fluent French reviewer and disposition source/rights records. Reviewer/agent: accept exact text/register and assessment samples using the prepared register.
- **Authorization:** Course definition and draft preparation approved October 18; no source-rights acceptance, reviewer designation, hiring or contact inferred.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f251-french-definition-sources-and-review-route); [October 18 implementation/evidence](docs/french/README.md).
- **Dependencies:** owner definition decisions and verified reference rights/access.

#### F25.2 French first unit

- **Work state:** Review pending.
- **Readiness:** Implementation — Complete first-unit draft flow; content — Five unreviewed drafts; verification — Automated private import/preview and gate checks.
- **Delivery:** Application — `08fed75` deployed; content publication — Hosted records 30–34 published v1 as unreviewed text previews; local records 32–36 remain drafts.
- **Scope:** Five greeting/name/register/repair packages with contextual rationales, exact segments, vocabulary, review sheets and pinned manifest; review/audio/transfer evidence missing.
- **Next action:** Reviewer/owner: disposition exact phrases, register, meanings, explanations, accepted choices, segments and sources. Agent: reconcile and revalidate changed packages.
- **Authorization:** Unpublished drafting and local private import authorized October 18; exact five original hash-pinned text previews subsequently authorized October 18; changed/new text retains normal fluent review.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f252-french-first-unit); [October 18 implementation/evidence](docs/french/README.md).
- **Dependencies:** F25.1 acceptance before approval; F24.4 private flow reused; F25.3/F25.5 and early F25.6 evidence before full delivery.

##### F25.2.1 Owner-authorized French text-only development preview

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Exact five unreviewed exception packages; verification — 57 API tests, three focused browser stories and hosted preservation/live labels.
- **Delivery:** Application — `08fed75` deployed; content publication — Hosted records 30–34 published v1.
- **Scope:** Five hash-pinned French first-unit previews labeled unreviewed/text-only on the existing development preview, with pending rights/review and no human audio.
- **Next action:** None for the exact preview release; full review/audio/pilot/course depth remains F25.1–F25.6.
- **Authorization:** Owner explicitly authorized publication/deployment and selected the five-preview exception October 18. No changed/additional content or beta inclusion.
- **Completion gate / evidence:** [Exact policy](docs/french/text-preview-publication.md); [rollout evidence](docs/releases/2026-10-18-french-preview.md).
- **Dependencies:** F25.2 original pinned packages; tested notice-aware application and exact target backup.

#### F25.3 French starting check, sounds and text support

- **Work state:** Partial.
- **Readiness:** Implementation — Optional spelling help and generic course-specific check foundation present; content — First-unit spelling examples drafted; verification — Automated; accepted assessment/audio and real input/AT absent.
- **Delivery:** Application — Spelling-help refinement and generic check deployed; content publication — First-unit examples only in exact unreviewed previews; no accepted placement/audio content.
- **Scope:** Skippable French starting check and text/sound support; exact spelling examples exist, accepted check calibration and sound modules remain; F28/F30 explorer reused.
- **Next action:** Reviewer/agent: accept manifest sample phrases and spelling policy, then calibrate the conservative course-specific starting check and sound/text alternatives.
- **Authorization:** Implementation/draft support authorized October 18; no unpublished draft becomes learner placement content or approved pronunciation material.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f253-french-starting-check-sounds-and-text-support); [October 18 implementation/evidence](docs/french/README.md).
- **Dependencies:** F25.1/F25.2, F24.1/F24.2; result-sync expansion needs its own scope.

#### F25.4 French remaining units and reference material

- **Work state:** Planned.
- **Readiness:** Implementation — Not started; content — Not authored; verification — Not run.
- **Delivery:** Application — None; content publication — None.
- **Scope:** Remaining French units 2–12, reviews/checkpoints, grammar and glossary.
- **Next action:** Reviewer/agent: use accepted first-unit and F25.6 pilot findings to revise the sequence before authoring units 2–12 in bounded batches.
- **Authorization:** Implementation authorized October 18; bulk authoring follows first-unit review/pilot; no publishing, deployment, contact or spending.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f254-french-remaining-units-and-reference-material); [October 18 implementation/evidence](docs/french/README.md).
- **Dependencies:** F25.1/F25.2 and first-unit pilot under F25.6; F24.4; F25.5 audio.

#### F25.5 French model audio and guided speaking

- **Work state:** Input needed.
- **Readiness:** Implementation — Fourteen recording scripts and three branch briefs prepared; content — Unreviewed text, no human recordings; verification — Audio/feedback not run.
- **Delivery:** Application — No new audio/provider integration; content publication — None.
- **Scope:** French human model recordings and controlled guided speaking; exact draft scripts/branch briefs exist, recordings and privacy-verified feedback remain.
- **Next action:** Reviewer: accept exact scripts. Owner: arrange permitted recordings and decide provider/privacy setup. Agent: integrate accepted assets and verify playback/offline/feedback.
- **Authorization:** Draft script/scenario preparation authorized October 18; no speaker contact, hiring, provider spending, recording consent or live feedback provider inferred.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f255-french-model-audio-and-guided-speaking); [October 18 implementation/evidence](docs/french/README.md).
- **Dependencies:** approved F25.2/F25.4 text, F24.2/F24.4 and provider/privacy decisions.

#### F25.6 French pilot, publication and release evidence

- **Work state:** Planned.
- **Readiness:** Implementation — Pilot protocol/evidence template prepared; content — First-unit candidates unreviewed; verification — No observations or real-device/AT evidence.
- **Delivery:** Application — N/A; content publication — None.
- **Scope:** French first-unit pilot, then full-course access/offline/outcome and release evidence.
- **Next action:** Owner/reviewer: accept first-unit text/audio and agree participant/device setup and exact rubric. Agent: execute immediate/delayed pilot before bulk authoring.
- **Authorization:** Protocol preparation authorized October 18; actual participant contact, publication/deployment and beta expansion remain separate.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f256-french-pilot-publication-and-release-evidence); [October 18 implementation/evidence](docs/french/README.md).
- **Dependencies:** Early pilot needs only accepted first-unit F25.2/F25.3 and first-unit F25.5 audio; its findings gate F25.4 bulk authoring. Full release then needs F25.4/full audio and F24.5/F24.6. Do not require the full course before the first-unit pilot.

### F26 Khmer course

- **Work state:** Partial.
- **Readiness:** Implementation — Partial course; app complete; content — Five drafts; rest unauthored; verification — Automated preview; no pilot.
- **Delivery:** Application — Deployed; content publication — Five exact unreviewed text previews.
- **Scope:** Twelve-unit/sixty-lesson Khmer course: five preview lessons exist, 55 lessons and full reading/sound/speaking coverage remain.
- **Next action:** Owner: designate review route and source/help/reading dispositions. Agent: finish first-unit acceptance/pilot before bulk units 2–12.
- **Authorization:** Khmer draft implementation authorized; normal review/publication gates remain except exact five F26.2.1 previews. No hire/spend/contact/beta expansion.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f26-khmer-course).
- **Dependencies:** Uses delivered F24.1–F24.4 software. F26.1 text/source/review decisions gate accepted content; F26.2/F26.3/F26.5 feed the early F26.6 pilot; that pilot precedes F26.4 bulk authoring. Full-course release later coordinates with F24.5/F24.6.

#### F26.1 Khmer definition, sources and review route

- **Work state:** Decision needed.
- **Readiness:** Implementation — Brief prepared; content — Sources/help proposed; verification — Not accepted.
- **Delivery:** Application — N/A; content publication — N/A.
- **Scope:** Cambodian/Phnom Penh, twelve-unit and conversation-first choices settled; exact sources/help/inventory/reviewer remain.
- **Next action:** Owner/reviewer: accept source/rights, help v0, eight-expression inventory and observed-outcome rubric.
- **Authorization:** Draft preparation authorized; no named reviewer, commercial source acceptance or hiring inferred.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f261-khmer-definition-sources-and-review-route).
- **Dependencies:** owner course-definition decisions and verified source access/rights.

#### F26.2 Khmer first unit

- **Work state:** Review pending.
- **Readiness:** Implementation — Complete draft flow; content — Draft; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Five exact unreviewed text previews.
- **Scope:** Five first-unit greeting/introduction/repair candidates with pending linguistic/rights acceptance, audio and pilot.
- **Next action:** Reviewer/owner: disposition exact phrases/answers/segments/sources; agent reconciles changes before any new approval/publication.
- **Authorization:** Exact five current previews authorized; changed/new text still requires normal acceptance or a new explicit exception.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f262-khmer-first-unit).
- **Dependencies:** F26.1 and F26.3's agreed text/segment rules; F24.4 and F26.5 audio.

##### F26.2.1 Owner-authorized text-only development preview

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Unreviewed exception; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Five v1 previews published.
- **Scope:** Exact five unreviewed text-only development-preview lessons under explicit owner exception.
- **Next action:** None for exact preview release; review/audio/pilot remains F26.1/F26.2/F26.5/F26.6.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f2621-owner-authorized-text-only-development-preview).

#### F26.3 Khmer script, sounds, input and starting check

- **Work state:** Partial.
- **Readiness:** Implementation — Partial; content — Proposed inventory; verification — Automated expression checks.
- **Delivery:** Application — Deployed expression support; content publication — Full modules not published.
- **Scope:** Optional whole-expression support delivered; accepted phonics/modules, actual input/AT and starting check remain.
- **Next action:** Reviewer: select inventory/help and sound modules. Agent: integrate accepted modules and actual device checks; reuse F28/F30 rather than duplicate explorer.
- **Authorization:** Khmer draft implementation authorized; no fabricated reading/listening/proficiency evidence.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f263-khmer-script-sounds-input-and-starting-check).
- **Dependencies:** F26.1 and F24.1/F24.2 for prototype; F26.2 for integrated check/modules.

#### F26.4 Khmer remaining units and reference material

- **Work state:** Planned.
- **Readiness:** Implementation — Not started; content — 55 lessons unauthored; verification — Not run.
- **Delivery:** Application — None; content publication — None.
- **Scope:** Units 2–12, reviews/checkpoints, references/glossary and progressive reading.
- **Next action:** Agent after first-unit review/pilot: revise sequence and author source-backed bounded batches.
- **Authorization:** F26 implementation authorized; bulk authoring remains sequenced behind first-unit review/source/pilot gates.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f264-khmer-remaining-units-and-reference-material).
- **Dependencies:** F26.1/F26.2 and first-unit pilot under F26.6; F26.3/F24.4; F26.5 audio.

#### F26.5 Khmer model audio and guided speaking

- **Work state:** Input needed.
- **Readiness:** Implementation — Scripts/branch briefs only; content — Draft; verification — No human audio/provider evidence.
- **Delivery:** Application — None; content publication — No human audio.
- **Scope:** Twelve candidate recording scripts/three branch briefs prepared; real recordings and guided feedback absent.
- **Next action:** Reviewer: accept scripts. Owner: arrange permitted recordings and provider/privacy decisions; agent verifies actual Khmer feedback/offline behavior.
- **Authorization:** Preparation authorized; no hire, speaker contact, provider spending or unverified support claims.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f265-khmer-model-audio-and-guided-speaking).
- **Dependencies:** approved F26.2/F26.4 text, F24.2/F24.4 and provider/privacy decisions.

#### F26.6 Khmer pilot, publication and release evidence

- **Work state:** Verification pending.
- **Readiness:** Implementation — Protocol ready; content — Depends on reviewed unit; verification — No observed pilot.
- **Delivery:** Application — Preview app deployed; content publication — Full release gated.
- **Scope:** First-unit pilot before bulk authoring; later full-course real device/AT/offline/outcome and release evidence.
- **Next action:** Owner: agree rubric/setup/participation after F26.1. Agent: record immediate/delayed evidence and fix/retest before scaling.
- **Authorization:** Protocol prepared; participant contact, full publication, deployment and beta expansion remain separate.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f266-khmer-pilot-publication-and-release-evidence).
- **Dependencies:** Early pilot needs accepted F26.2/F26.3 and first-unit F26.5 audio, using delivered F24 software. Findings gate F26.4 bulk authoring. Full release later needs F26.4/full audio and F24.5–F24.8 evidence; do not wait for full-course completion to run the early pilot.

### F27 Feature discoverability and navigation

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Five learner tabs, short Practice hub and Progress page preserving saved habit choices; F27.3 delivers the revised defaults/presentation.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f27-feature-discoverability-and-navigation).
- **Dependencies:** F05/F10 review, F17.6 can-do, F17.7 habits, F20 glossary.

#### F27.1 Mobile-friendly back navigation

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** 48 px shared back controls with explicit destinations, keyboard and offline navigation.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f271-mobile-friendly-back-navigation).
- **Dependencies:** F07/F27 and existing routes; no Khmer content/provider dependency.

#### F27.2 Scannable study plan and can-do progress

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Scannable Today plan/can-do progress and useful empty recall entry.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f272-scannable-study-plan-and-can-do-progress).
- **Dependencies:** F15.1/F24.3 study queue, F17.6 written recall and F27 navigation.

#### F27.3 Learner clarity and mobile fixes

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; source notice compatibility corrected in 34a936b; content — N/A; verification — Regression reproduced/fixed in two API cases; live counts and all ten lesson URLs pass after API rollback; real-device/AT absent.
- **Delivery:** Application — Frontend fixes deployed; corrected source 34a936b pushed; API restored to working 08fed75; documentation follow-up may advance frontend; content publication — Unchanged.
- **Scope:** Readable Practice tiles, plain study/response wording, one Today resume action, silent streak grace, hidden optional weekly activities and shared French/Khmer character presentation.
- **Next action:** None in this bounded functional scope; before the next full API upload, assess hosting space and use corrected source 34a936b or later.
- **Authorization:** Owner requested fixes and then “commit and reploy” October 18, authorizing commit/push and deployment to existing development hosts; no curriculum publication.
- **Completion gate / evidence:** [Bounded contract and evidence](docs/learner-clarity-fixes.md).
- **Dependencies:** F06/F17.7/F24/F27.2; preserve exact preview text and answer records.

### F28 Alphabet explorer

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Authored; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Five old inventory previews; full drafts unpublished.
- **Scope:** Owner-revised text-only implementation plus five full unreviewed alphabet draft packs.
- **Next action:** None for revised scope; F30 retains human/source/access/release obligations, recordings remain F09/F26.5.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f28-alphabet-explorer).

#### F28.1 Shared explorer, content model and gates

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Existing exact inventory previews.
- **Scope:** Shared explorer, owner workflow and explicit audio-free contract with review/rights gates.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f281-shared-explorer-content-model-and-gates).

##### F28.1.1 Shared application candidate

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Shared explorer application, four-activity audio mode, versioned local evidence and verified offline transport.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f2811-shared-application-candidate).

##### F28.1.2 Inventory-only preview publication

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Unreviewed exception; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Five v1 inventory previews published.
- **Scope:** Five exact pinned inventory-only previews labeled unreviewed/text-only.
- **Next action:** None for exact release; changed/additional text is outside this exception.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f2812-inventory-only-preview-publication).

#### F28.2 Arabic explorer draft packs

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Authored; verification — Automated.
- **Delivery:** Application — Committed; content publication — Unpublished draft files.
- **Scope:** Three Arabic-context drafts, each 28 basic plus 17 support entries; no canonical Quran text.
- **Next action:** F30: human/source acceptance and release; authoring scope itself is complete.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f282-arabic-explorer-draft-packs).

#### F28.3 Khmer explorer draft pack

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Authored; verification — Automated.
- **Delivery:** Application — Committed; content publication — Unpublished draft files.
- **Scope:** Khmer alphabet draft: 33 basic plus 49 proposed vowel/sign/subscript support entries.
- **Next action:** F30: human/source acceptance and release; authoring scope itself is complete.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f283-khmer-explorer-draft-pack).

#### F28.4 French explorer draft pack

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Authored; verification — Automated.
- **Delivery:** Application — Committed; content publication — Unpublished draft files.
- **Scope:** Metropolitan French alphabet draft: 26 case pairs plus 32 spelling-support entries.
- **Next action:** F30: human/source acceptance and release; authoring scope itself is complete.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f284-french-explorer-draft-pack).

#### F28.5 Practice, downloads and separate evidence

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — Full drafts unpublished.
- **Scope:** Text-only visual practice/offline/resume and separate identity/course/version evidence.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f285-practice-downloads-and-separate-evidence).

#### F28.6 Automated access and candidate verification

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — N/A; verification — Automated.
- **Delivery:** Application — Deployed; content publication — N/A.
- **Scope:** Automated candidate access checks and authorized application rollout; human/device evidence explicitly moved to F30.
- **Next action:** None in this bounded scope; broader release evidence remains F18.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f286-automated-access-and-candidate-verification).

### F29 Privacy policy and beta version

- **Work state:** Complete.
- **Readiness:** Implementation — Complete; content — Authored; verification — Automated.
- **Delivery:** Application — Included in deployed frontend; route not freshly checked; content publication — N/A.
- **Scope:** Public privacy page and Beta 0.0.1 label; October 18 owner rule requires +0.0.1 for each future completed fix/feature implementation ([versioning rule](AGENTS.md#application-versioning)). Policy is descriptive, not legal review.
- **Next action:** Before voice/AI, analytics or deletion changes, update policy to match behavior; no new product scope from this documentation audit.
- **Authorization:** Delivered scope; extensions need their own authorization.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f29-privacy-policy-and-beta-version).

### F30 Alphabet content acceptance and release

- **Work state:** Input needed.
- **Readiness:** Implementation — Partial: track controls absent; content — Full drafts unreviewed; verification — Automated only; real checks missing.
- **Delivery:** Application — F28 application deployed; content publication — Five inventory previews only.
- **Scope:** Human/source acceptance and real access/release evidence split from completed text-only F28.
- **Next action:** Owner: designate reviewers. Agent: disposition exact inventories/help/examples/rights, scope MSA/Quranic controls, then collect authorized access/release evidence.
- **Authorization:** Follow-up planned, not blanket implementation/contact/publication authority; no review/beta gates waived.
- **Completion gate / evidence:** [Full contract and linked evidence](docs/planning/feature-scope-reference.md#f30-alphabet-content-acceptance-and-release).
- **Dependencies:** F28, F09/F13/F14 and applicable F25/F26 content decisions.

### F31 About and FAQ page

- **Work state:** Complete.
- **Readiness:** Implementation — complete; content — authored factual About copy and shared FAQ; verification — production build and automated mobile/desktop page checks pass; all 15 About/landing browser checks pass.
- **Delivery:** Application — `536832b` pushed and Vercel Ready on existing development aliases October 18; content publication — N/A (informational page only).
- **Scope:** Separate small About page with FAQ, landing and Account links, humane learning/cultural context copy and honest native-speaker support status. Application version 0.0.2.
- **Next action:** No remaining work in this bounded scope; native-speaker review/recordings remain with their course gates.
- **Authorization:** Owner authorized implementation, push and deployment October 18; no curriculum publication or review-status change.
- **Completion gate / evidence:** [About page contract and verification](docs/releases/2026-10-18-about.md).
- **Dependencies:** Existing landing/Account routing and shared FAQ; native-speaker review remains with course review gates.

## Recent roadmap changes

- **October 18 — F23:** text-story machinery and exact A little rest v1 unreviewed/text-only preview deployed as 0.0.4 (`99f2de4` source). Existing tables/assets preserved. Normal human/source/access acceptance and remaining two episodes stay open; no Today credit. [Evidence](docs/mini-stories.md).


- **October 18 — F27.3:** mobile Practice text, plain study/response labels, one Today resume action, silent grace, hidden optional weekly activities and shared French/Khmer character presentation UI delivered; notice regression corrected in `34a936b`, working API restored to `08fed75`. All ten French/Khmer previews available again; historical-notice tests now independent of policy constants. Curriculum unchanged.

- **October 18 — F25:** owner selected Metropolitan France reference, twelve units/sixty lessons, five-minute month-one guided target and draft-first review route. Five exact first-unit text previews published on deployed `08fed75`; 57 API/three publication browser checks pass, existing data/assets preserved. Full review/audio/course gates remain.

- **October 18 — F19.1:** S0 verified and six exact selected requests regenerated;
  owner selections reconciled through waveform comparison. Lesson one v4 published
  with eight synthetic prompt mappings; thirteen non-curriculum tables, other
  publications and existing assets preserved. F09/F18 gates remain separate.
- **October 17, 2026 — roadmap structure:** replaced generic Active/Done grouping
  with independent work state, implementation/content/verification readiness,
  application/publication delivery, explicit actor/authorization and linked contracts
  for every feature/child. Removed repeated chronological release summaries. No
  product scope, publication, deployment, spending or deferral was newly authorized.
