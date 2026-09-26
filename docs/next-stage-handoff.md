# Current agenda: validate the first usable Levantine unit

Updated September 26, 2026 UTC.

## Completed milestone

Seven Everyday conversations lessons, records 7–13, are approved and published
as v1 in the local SQLite store. The owner explicitly instructed: “Approve for
me, publish, and figure out whats next for ismi.” Codex checked every package
against the review-manifest SHA-256, compared stored content and sources, and
used CurriculumPublishingService validation, approval, and publication methods.
The audit actor records the owner's authorization via Codex. All seven public
learner lesson endpoints returned the expected published v1 and eight exercises.
The six demonstration publications and existing progress were preserved.
This is not a production deployment. Owner authorization does not establish
native-expert language review or effectiveness evidence.

## Recommended next milestone: a small observed learner pilot

Prepare an owner-run pilot of this unit before expanding the content pipeline.
Cohort size, selection, hosting, and pass criteria remain proposals for owner
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
   prioritize revisions from the observed problems. Local supervised sessions can
   begin without settling production hosting; remote access needs an explicit
   hosting and invitation plan first.
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
