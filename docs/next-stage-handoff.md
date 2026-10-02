# Character introduction implementation — October 1, 2026

Latest deployment request: the owner authorized pushing the tested working tree
to `codex/lesson-experience` and deploying a Vercel frontend preview through the
existing Git integration. The alwaysdata API rollout, local draft migration and
curriculum publication remain separate. The checks below cover this commit;
confirm the exact pushed revision's Vercel deployment status before reporting it
ready. Historical no-deployment statements describe their implementation checkpoints.

The owner requested implementation of `docs/character-introduction-plan.md`, then
clarified the art direction as cartoonish corporate illustration. The new
[character guide](characters/character-guide.md), exact generation prompt and
asset provenance document the proposed Lina/Omar designs. The eight-view sheet
is bundled as a 42 KB WebP with static neutral, attentive and encouraging portraits.
Final design selection remains with the owner.

Optional character IDs, scene cast/version and explicit dialogue/teaching/practice
roles are implemented in ASP.NET/Vue, with shared decorative portrait/role
components, named fallbacks, console mapping inspection and PWA precaching.
Dialogue placement follows participant IDs. Recall keeps roles visible without
revealing phrases; both outcomes use gentle encouragement. Mixed review and
checkpoints retain each originating scene and its step roles. Recording credits
remain separate and unchanged.

All seven metadata proposals are saved and validated locally: lesson 1 record
23 v4; lesson 2 record 19 v3; lessons 3–5 records 20–22 v2; lessons 6–7 records
16–17 v2. Existing importer-owned drafts received metadata through normal audited
updates. All portable guided packages, all 16 published/superseded snapshots,
accounts, progress and prior audit rows were preserved and compared. An ignored
pre-import backup is `i-api/App_Data/ismi-before-characters.db`. No real lesson
was approved/published and no deployment occurred. See the
[proposal manifest and roles](../content/levantine/everyday-01/revisions/characters/README.md).

Local API/frontend remain at 5062/5173. The API runs in the documented localhost
Development profile, with its existing published human approver restored to the
owner gate. The real signed-in owner's lesson 1 v4 preview is open in the app.

Verification: production TypeScript/Vue build passed; **23 API tests passed**;
**26 browser scenarios passed** in the full regression run. Character-specific
checks cover loaded/failed portraits, unknown registry fallback, hidden recall,
keyboard mistakes/retry, 320/1280 px layouts, all seven lessons online/offline,
checkpoint roles and exactly-once reconnection. A final focused check also makes
missing-portrait completion run offline. Real screen-reader and learner
observations remain release work.

---

# Latest feature: review and checkpoints

October 1: the owner authorized implementing the next roadmap feature. Practice
now offers mixed published-context review, versioned mistake explanations and
free retries, and checkpoints for completed units. Offline history and results
are local to each guest/account scope; review does not add course completions or
minutes. Scheduling remains manual pending the owner’s interval preference.
See [review-and-checkpoints.md](review-and-checkpoints.md) for behavior, version
isolation and limits. No curriculum publication, deployment or provider choice
was performed. Preserve the uncommitted roadmap and earlier handoff edits.

Validation: production frontend build and 22 API tests pass; all 23 browser
scenarios passed across the regression and corrected focused runs, including
five new review scenarios, the updated full-unit offline checkpoint, and actual
downloaded-audio playback in review. Initial test-locator failures were fixed
and rerun successfully. Real screen-reader/device testing remains a release
gate. The local-server tests used a temporary `--no-restore` configuration and
disposable database; no live deployment or real publication was exercised.

# Previous UX continuation: sound, motion and color

For the next planned features and recommended implementation order, read
[the feature roadmap](feature-roadmap.md). Its review/checkpoint recommendation
supersedes the older pilot-first recommendation preserved below; the owner has
not approved a schedule or all future implementation work.

October 1 deployment request: the owner authorized pushing the working changes
and a Vercel frontend preview from `codex/lesson-experience`. The preview uses the
existing alwaysdata API rewrite. Backend deployment and curriculum publication
remain separate; Vercel does not migrate local data. All 22 API tests pass in
addition to the frontend/browser checks below (NU1900 vulnerability metadata
refresh warning remains).

Current lesson layout: fixed-height dialog (up to 860 px, bounded by the viewport),
with stationary header, lesson stages and navigation. LessonStages.vue renders
Meet → Learn & recall → Use it throughout teaching and practice. LessonScroll.vue
contains the single internal scroll area with stable scrollbar space; its bottom
fade and clickable “Scroll for more” down-arrow cue appear only when content
remains below. Resize and content changes update the cue, including after card
transitions and source disclosures. New cards start at the top without smooth
automatic scrolling. Navigation remains outside the animated cards. Height
animation was removed because the owner found it distracting. Reduced motion
disables lesson animations and makes clicking the scroll cue immediate.
Geometry checks pass at 1440×1000, 1024×720 and 390×740 through dialogue scroll,
recall/reveal, practice and teaching review. The real owner preview was checked
without progress changes and the browser returned to Today.

Latest checks: production build and all **18 Playwright scenarios passed** in one
run, including the three geometry/scroll-cue checks, all seven guided lessons
online/offline, keyboard retry/review, exactly-once sync, draft isolation,
responsive navigation, sound and recording integrity. Publication in these tests
applies only to copies in the disposable test database. Device listening and real
screen-reader testing remain release checks.

The final visual refinement uses solid green and red surfaces on the next-lesson
card, stronger conversation/teaching backgrounds and a green phrase spotlight.
The sound toggle has no indicator dot. Learner pages use concise functional copy:
Today shows greeting, daily progress, next lesson and course progress; review
status is collapsed in “About this lesson.” Promotional subtitles and repeated
labels are removed. Offline/pending messages appear only when needed, with
normal sync status in Account. Preserve this direction in later work.

The refinement build passed. All 15 browser scenarios passed across the full
and focused runs. The desktop recording test was updated to use Account in the
sidebar after the routine account badge was removed; its final rerun passed,
along with all responsive navigation and sound checks. New hero text contrast is
5.88:1 or better. The real owner’s Today tab was inspected after the changes.

October 1, 2026. The owner requested friendly clicks and answer feedback, smooth
lesson transitions and more color inspired by the Pan-Arab palette. Local Web
Audio chimes now cover navigation, advances, reveal, correct answers, retries and
completion. They start after interaction, work offline, and have a persistent
mute switch in the learner header/sidebar, lesson header and Account. Prompt
playback stays independently controlled, and interface sounds are suppressed
while prompts play. Missing audio support never blocks learning.

Lesson cards crossfade with a small slide inside a stable lesson frame. Outgoing
cards become inert and hidden from assistive technology; incoming headings take
focus. Reduced motion disables lesson animations. Phrase
pieces animate when placed, removed or reordered. Green buttons and phrase areas,
small red accents, charcoal text and white space carry the updated palette.

The real owner console showed lesson 1 record 18 v3 already published by the
owner; the other six guided packages remain drafts. The earlier all-draft status
below is an import checkpoint. No approval, publication or deployment was
performed in this UX continuation. The browser was returned to Today and the
existing local API/frontend remain on ports 5062/5173.

Checks: production Vue/TypeScript build and all **15 Playwright scenarios passed**
in one run. This includes actual Web Audio output, no initial autoplay, persistent
mute, offline sounds, missing audio support, reduced motion, keyboard focus,
320–1280 px navigation layouts, recordings/integrity, draft isolation, all seven
guided packages online/offline, and exactly-once reconnection. The main palette
text combinations measured 5.01:1 or better. Manual inspection used the real
owner preview for learning/recall/reveal. Device listening and real screen-reader
testing remain useful release checks; reviewed Arabic recordings are still absent.

---

# Earlier continuation: explicit teaching across the unit

September 30–October 1, 2026. [Seven guided teaching drafts](../content/levantine/everyday-01/revisions/guided-teaching/README.md)
are imported locally with 43 phrase cards, conversational recall cues, per-card
source links, concise explanations and eight contextual turns each. Lesson 1 was
inspected through the saved owner preview against a local database copy. Its
speaker note was corrected and the rest of the unit now teaches its phrase parts
explicitly. Wrong-order reconstruction supports check/model/retry, and reviewing
teaching preserves the in-progress turn and can return from every stage.

The local database already had records 14–15 published v2 when this continuation
started. New packages are unapproved drafts: lessons 1–2 records 18–19 v3;
lessons 3–5 records 20–22 v2; lessons 6–7 updated importer-owned drafts 16–17 v2.
The earlier packages, hashes, review cases, audit trail and all 15 previously
published/superseded database snapshots are preserved. No approval, publication
or deployment occurred in this work. Older sections below describe historical
states and are superseded by this status where they conflict.

Checks: **22 API tests passed**, **13 browser scenarios passed** across focused
and remaining-regression runs, production build passed, and all seven package /
predecessor hashes plus 43 Arabic/transliteration block reconstructions checked.
Browser coverage completes all seven new packages online/offline, checks draft
isolation, wrong-order keyboard retry, teaching return, reduced motion, mobile
layout, exactly-once synchronization and recording package integrity. Browser
publication occurs only for disposable test copies. The local API was restarted on port 5062 with its original database and owner
configuration; the temporary test-owner servers were stopped. Existing accounts,
progress, published provenance and audit records were also compared against the
pre-import backup and remain unchanged.

NuGet vulnerability metadata
could not refresh (NU1900); tests used restored dependencies and compiled normally.

Remaining: owner review/approval before publication; reviewed recordings (zero);
real screen-reader testing; naturalness and learner-outcome evidence; observed
timing of the longer teaching flow. Estimates and successful guided practice do
not establish spontaneous conversation. Continue useful lesson improvements
without waiting for outside speaker feedback or creating more pilot paperwork.

---

# Current agenda: validate the first usable Levantine unit

Updated September 30, 2026 UTC.

## Completed milestone

Seven Everyday conversations lessons, records 7–13, are approved and published
as v1 in both the local and live SQLite stores. The owner explicitly instructed: “Approve for
me, publish, and figure out whats next for ismi.” Codex checked every package
against the review-manifest SHA-256, compared stored content and sources, and
used CurriculumPublishingService validation, approval, and publication methods.
The audit actor records the owner's authorization via Codex. All seven public
learner lesson endpoints returned the expected published v1 and eight exercises.
The six demonstration publications and existing progress were preserved.
The release is live at https://ismi-ruby.vercel.app with the API at
https://ismi.alwaysdata.net. Vercel production deployment of a5ef7dc is READY;
the restarted API and all seven published lesson payloads were verified. Existing
hosting remains the limited development-preview infrastructure described in the
root README; this deployment does not establish full beta readiness. Owner
authorization does not establish native-expert review or effectiveness evidence.

## Lesson experience rebuilt — September 30

The owner asked to build without waiting for further native feedback and identified
English answer giveaways, missing teaching, and a static lesson experience. The
Vue lesson renderer now follows conversation context → focused phrase teaching →
recall before reveal → usage pattern → contextual practice. Teaching cards can carry
explicit phrase blocks and explanations; existing expressions work with the new
teaching/recall flow. Practice translations start hidden, with independent prompt
and response help; feedback reveals meanings after the attempt. Some turns use
bounded phrase reconstruction, with unrestricted choice fallback. Motion covers
card changes, response selection, feedback, and completion; reduced motion is supported.

Four [check-in revision packages](../content/levantine/everyday-01/revisions/check-in-v2/README.md)
are imported into the **local** console as v2 drafts, records 14–17. Lesson 1 now
teaches a casual **شو عامل؟** check-in with explicit phrase cards; lessons 2, 6,
and 7 update dependent material. Original published v1 packages and hashes are
preserved. No revision was approved or published, and this frontend change has
not been deployed to the live preview. Preview the exact drafts in the console;
publication remains the owner's final approval step. The report and snapshots are
in [review case LEV-2026-09-30-01](../content/levantine/everyday-01/review-cases/LEV-2026-09-30-01.json).

## Recommended next milestone: a small observed learner pilot

The [pilot kit](pilot/README.md) now contains a session script, seven fresh recall
tasks, a private observation template, accessibility/offline preflight, and recording
preparation checklist. The owner selected **one learner first** on September 30.
Next: perform the real assistive-technology preflight and run that rehearsal.
Participant selection, session arrangement, and decision criteria remain proposals.
No pilot observations or new screen-reader verification have been collected.

Prepare an owner-run pilot of this unit before expanding the content pipeline.
Cohort size, selection, invitation controls, and pass criteria remain proposals for owner
agreement; do not silently treat them as settled product decisions.

1. Prepare a session script and a minimal observation sheet. Measure completion
   time, requests for help, confusing answer feedback, and offline/reconnection
   problems. End each lesson with a fresh prompt without answer choices to check
   whether learners can retrieve and use the expressions. No voice recording or
   third-party analytics is needed for this observation.
2. Conduct a real screen-reader and keyboard walkthrough with mixed Arabic,
   English, and transliteration. Fix blocking issues before involving learners
   who depend on those accommodations. Existing browser tests are not a substitute.
3. Have the owner run a small observed pilot with target false beginners, then
   prioritize revisions from the observed problems. The current live app supports supervised
   sessions; remote cohort access still needs an explicit invitation plan.
4. Use those findings to choose the next bounded development slice. Likely candidate:
   guided production using reviewed structured accepted answers and contextual
   explanations. Current multiple-choice practice cannot demonstrate spontaneous
   conversation. Do not choose a speech/AI provider without resolving the existing
   privacy and provider decisions.

In parallel with pilot preparation, prepare the existing recording scripts for
reviewed Palestinian speaker recordings. Speakers, permissions, budget, and asset
approval need owner decisions; do not contact or purchase on the owner's behalf.
Reviewed audio assets remain at zero. Full beta release gates and the much larger
curriculum target remain open. Week 2 authoring should use pilot findings and an
explicitly approved foundation; MSA and Quranic publication remain gated.

See `content/levantine/everyday-01/README.md`, `review-manifest.json`, and
`walkthrough.md` for versions, publication scope, and remaining quality limits.

---

The original production brief below is retained as historical scope. Its request
to author and deliver seven lessons has been completed; its pending-publication
wording is superseded by the status above.

# Next stage: create and ship usable Levantine lessons

Updated September 22, 2026 after the owner's direction: “I want content to be created, I need lessons to be pushed out so this can actually be a usable app.”

This replaces the previous infrastructure-first handoff. The next agent's main deliverable is substantive lesson content loaded into Ismi and ready for learner use after owner publication approval. Read `AGENTS.md` for the established dialect, source, and publication requirements.

## What to deliver

Create seven complete Palestinian Levantine lessons for the first unit, **Everyday conversations with someone you love**. Work in small batches: deliver the first two complete lessons for preview, then finish the remaining five. Carry the work through authoring, import, learner preview, validation, and the existing approval/publication workflow. Lesson outlines alone do not complete the task.

The existing six seeded entries repeat four multiple-choice prompts. They are fixtures, not the model for the new content. Give the new unit stable IDs and preserve existing learner progress and publication history.

Target false beginners who can already ask simple questions. Build toward a connected exchange about their day, food, family, and plans. Each lesson should provide roughly five to seven minutes of purposeful practice; verify that estimate through a walkthrough instead of assigning it to a single question.

## Lesson production queue

| Order | Lesson | What the learner should be able to do | Teaching focus |
| --- | --- | --- | --- |
| 1 | How was your day? | Answer a check-in, describe their day, and ask the other person back. | Questions about how someone is; descriptions; returning a question. |
| 2 | What did you do today? | Describe two everyday activities in sequence and respond to a follow-up. | A small set of useful past-tense forms; today; then/after. |
| 3 | Want tea or coffee? | Offer a drink, express a preference, and politely accept or decline. | Offers, wanting, preferences, polite responses. |
| 4 | Let's eat together | Say they are hungry, suggest food, and agree on a meal. | Suggestions, food vocabulary in context, agreement and negation. |
| 5 | How's your family? | Ask about someone's family and share a simple update. | Family relationships, possession, appropriate follow-up questions. |
| 6 | What are we doing tomorrow? | Suggest a visit or shared activity and settle on a time. | Future plans, tomorrow, basic time expressions. |
| 7 | Put it together | Follow and participate in a new guided exchange combining the unit's skills. | Transfer to a fresh situation; reduced hints; targeted review. |

This queue is the proposed foundation to put before the owner alongside the exact source set. Use urban Palestinian forms consistently, keep transliteration available, and explicitly label any Jordanian alternatives. Resolve gender/address distinctions in the content rather than teaching one form as universal.

## What a complete lesson contains

- A specific everyday situation and one visible learning goal.
- A short original dialogue, approximately four to six turns, with Arabic, consistent transliteration, and English meaning.
- A compact set of useful expressions introduced through that dialogue, rather than an isolated word list.
- One concise grammar or usage explanation tied to something the learner just encountered.
- Approximately six to ten purposeful practice interactions, adjusted to the teaching goal and walkthrough timing. Use dialogue comprehension, contextual response choices, meaning distinctions, and guided production where the existing app supports it.
- Plausible distractors with explanations of why they do not fit this particular situation. Avoid obviously unrelated filler answers and predictable answer positions.
- A short closing exchange that tests the lesson's goal, with helpful feedback and unrestricted retry.
- Source references for teaching claims, answer rationales, dialect/register notes, and honest review status.
- A recording script and visible transcript. Keep any available device voice preview accurately labeled until reviewed recordings are supplied.

Reuse earlier expressions in new situations across lessons. Do not inflate the lesson count by copying the same questions or splitting one dialogue into several thin lessons. Do not invent evidence that the unit produces fluency or meets the thirty-day outcome.

## Execution sequence

### 1. Establish the content foundation quickly

Inspect the repository and console for any existing approved language sources. If none exist, research a small credible source set for Palestinian vocabulary, grammar, and usage. Use exact publisher/source locators and distinguish checking language facts from permission to copy exercises, text, or audio.

Bring the owner a concrete proposal: the seven-lesson queue above, exact candidate sources, and any specific material that cannot be verified. Ask for approval of that foundation/source set as required by `AGENTS.md`. Do not turn this into an open-ended research project. Prepare import support and preview structure while awaiting that choice.

Once the source set is approved, author original exercises grounded in it. Do not describe AI-generated text as a linguistic source, fabricate approval, or copy a textbook's lessons into the app.

### 2. Create the first two complete lessons

Write the actual dialogue, teaching notes, prompts, answer options, explanations, and checkpoint for lessons 1 and 2. Save structured lesson packages under `content/levantine/everyday-01/` with a source inventory and a short README explaining how to import them. Prefer the existing `LessonResponse` format where it can carry the material.

Import these as versioned drafts using the existing curriculum service. Make them previewable in the real learner UI without exposing unapproved drafts through public lesson endpoints. The owner should be able to walk through a whole lesson and see what learners will see.

If the current renderer cannot present a dialogue or teaching note, implement that bounded addition as part of these lessons. Do not replace the stack or build a general-purpose authoring platform first. If a graded interaction needs a new evaluator, scope it to the approved teaching need and provide deterministic accepted answers and explanations.

Deliver the first batch for review with specific unresolved language questions, if any. Continue authoring the next batch from the approved foundation while publication review is pending.

### 3. Finish lessons 3–7 and make the unit usable

Maintain a consistent voice, vocabulary progression, transliteration convention, and level of difficulty. The last lesson must introduce a fresh exchange that draws on prior learning, not repeat all previous questions verbatim.

Make the course path display the approved lessons in sequence and allow earlier published lessons to be reopened for practice. Provide a unit-complete state with a review action. Remove learner-facing claims that a missing feature is already available.

Keep the existing download and completion flow working for the new packages. Fix defects that prevent the new lessons from loading, grading correctly, finishing, or saving progress. Broader account, analytics, timezone, and architecture work belongs in a separate backlog unless it directly blocks this delivery.

### 4. Validate, obtain publication approval, and publish

Use the existing console's deterministic validation, owner approval, and publication flow. The owner's standing role as final publication approver remains in force. Present concrete draft versions for review, not a vague request to approve future content. Do not auto-approve new content in a startup seed or claim native-expert review when none occurred.

After the owner approves the actual versions, publish them through the established workflow and verify that learners receive them. Finish by reporting how many lessons are published, how many are awaiting approval, and the exact remaining content issues. If owner approval is pending, deliver all authored packages and working previews; do not call the lessons published.

Reviewed recordings remain a separate asset dependency. Their absence should not stop text-based lesson authoring and preview. It does prevent claiming that reviewed listening content or the full audio release gate is complete. Do not buy assets, contact speakers, or commit to a speech provider without authorization.

## Definition of done

- Seven distinct, substantive lesson packages exist with dialogues, teaching notes, exercises, explanations, and source references.
- Every lesson can be opened and completed in the learner preview, with transliteration and English help.
- Real content reaches learners only through the existing owner approval/publication process.
- The learner can move through the unit and reopen published lessons for review.
- Downloaded text exercises can be completed offline and synchronize after reconnection.
- A complete keyboard walkthrough, including an incorrect answer and retry, works for the delivered exercise types; any new interaction receives appropriate accessibility checks.
- Run the API tests, production frontend build, and focused browser tests for the delivered lessons. Check that success is not dependent on every correct answer being the first choice.
- Record actual content and publication counts, remaining review/audio needs, and how to run/import the unit in the content README.

Passing these checks establishes this content milestone. Broader beta release gates in `AGENTS.md` still apply before launching the full cohort.

## Relevant implementation locations

- `i-api/Models/LessonModels.cs`: lesson and exercise payloads.
- `i-api/Services/CurriculumPublishingService.cs`: draft, approval, publication, rollback.
- `i-api/Services/CurriculumValidator.cs`: structural validation.
- `i-api/Services/SeedCurriculum.cs`: current demonstration content and dashboard assembly; preserve history rather than silently replacing a published seed.
- `i-web/src/CurriculumConsole.vue`: owner editing and review.
- `i-web/src/App.vue`: learner rendering, course path, lesson completion.
- `i-web/src/offline.ts`: downloaded packages and completion queue.
- `i-web/tests/course-loop.spec.ts`: existing browser coverage to extend with the new lessons.

Start by preparing the exact source/foundation proposal, then create lessons 1 and 2 in full. The priority is getting useful lessons into the app; engineering supports that output.
