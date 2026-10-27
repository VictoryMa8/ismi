# Learning and engagement additions

October 12, 2026 · Owner selected research priorities **1, 2, 4, 5 and 6** for
future implementation. This is an expanded design plan; current statuses and
priorities live in [ROADMAP.md](../ROADMAP.md). This document preserves the original
planning scope; F22, F17.6 and F17.7 were subsequently authorized. See the roadmap and
linked feature notes for current implementation and delivery evidence.
The selection authorizes roadmap planning, not immediate product implementation,
publication, deployment, new providers or spending.

The [research comparison](research/duolingo-mango-feature-candidates.md) supplies
the official Duolingo/Mango references and evidence limits. The examples below
describe learner tasks in English, not new approved Arabic curriculum.

## Shared approach

Start with one source-linked Levantine unit and extend the working teaching,
review, console, glossary and offline foundation. Inspect current publications
before choosing the unit. Everyday is the existing published baseline; the
F12.1 “Make a plan together” drafts require owner approval/publication before
learner delivery. Prefer that unit if it is published by implementation time.
The first slice does not require finishing twelve weeks of curriculum.

- Curriculum records carry stable targets, exact versions, dialect/register,
  sources, accepted responses and explanations. New linguistic content follows
  deterministic validation and the owner's console publication gate. Runtime AI
  does not invent prompts, accepted answers, cultural facts or grammar rules.
- Preserve guest/account isolation, downloaded study, unrestricted hints/retries,
  and version-aware withdrawal. Begin new attempt/achievement history on the
  current device, matching F05/F10; do not silently promise cross-device history
  synchronization. Existing account lesson progress remains separate.
- Preserve the fixed lesson frame, single scroll area, reduced motion, mute and
  concise copy. Arabic/Arabizi/English must work with keyboard, scalable text,
  screen readers and mixed text direction. No required listening, microphone,
  countdown or color-only meaning.
- Proposed measurements use aggregate counts, first attempts, help and delayed
  tasks; no analytics service or new retention policy is selected. Distinguish
  local verification, hosted verification, content publication and observed
  learning evidence in each future feature note.

Recommended work order is F22 → F23 → F17.5 → F17.6 → F17.7, preserving the
selected research order. F17.5 authoring can support F22 sooner; can-do evidence
depends on F22. Quests use whatever approved activities are actually available.
This order does not replace active F09/F12/F19 work or beta release requirements.

## F22 Recall and recombine

### Learner experience

After a phrase or pattern has been taught, the learner responds to a changed
situation from memory. For example, a familiar invitation becomes an invitation
for a different time, followed by clarification when a plan changes. Change one
meaningful constraint at a time; keep required words/forms previously taught.
Avoid puzzles whose difficulty comes from unfamiliar vocabulary.

The learner can submit a typed response, open a small hint, reveal word pieces or
choices, inspect the model, and retry. Arabic and continued Arabizi support are
recommended for Levantine; permitted input forms must be explicitly defined.
Speaking aloud remains optional self-practice until F11 can assess it. Do not
record a mental/spoken self-report as independently graded production.

Feedback explains the intended meaning, required concepts, accepted alternatives
and the contextual distinction if an answer misses the target. Reviewed
structured records determine known cases. Plausible uncertain language receives
an “unable to judge” path with model comparison and an optional review report;
it must not become an authoritative AI failure.

### First implementation slice

Use one unit, three communicative targets and at least two authored changed-context
prompts per target. Reserve one variant per target for a later transfer check;
once seen, it is no longer an unseen prompt for that learner. A repeated prompt
can still provide delayed recall evidence, labeled separately from transfer.

Extend F05/F10 practice rather than add a competing review scheduler. Keep the
approved 1/3/7/14-day schedule until a separate policy change is approved. Current
word-piece results remain assisted practice and are not migrated to production
evidence. Save target/version, prompt variant, input mode, first result, help,
retry and attempt time as separate facts. Keep raw typed text session-only by
default; a volunteered review report needs an explicit minimal-data design.

### Decisions before dependent implementation

Recommend Arabic and Arabizi input, authored accepted variants and narrowly
documented normalization; no unrestricted AI grading is needed for this slice.
Confirm the accepted-input/normalization policy and uncertain-answer review path
before coding the evaluator. Inspect F18 report-case work; reuse it if delivered,
or scope the minimal versioned curriculum review case as part of F22.

### Completion and evidence

- Six source-linked variants cover the three targets with explanations and
  accepted-answer rationales; all new records pass console validation and owner
  approval before publication. Draft-ready and learner-delivered are distinct.
- An independent first response is captured before help; opening assistance or
  a model cannot create independent evidence. Retries never replace first results.
- Known alternatives, meaning/intent errors and uncertain plausible responses
  follow the agreed policy; reports retain the exercise/source/version context.
- Downloaded practice and saved evidence survive offline reload; identity
  changes, withdrawals and revised content preserve isolation and invalidate
  current claims without destroying historical records.
- Verification covers keyboard/text direction, assistance, retry, uncertain
  grading and offline/version behavior. Collect immediate and later recall with
  attempts/denominators when learner testing resumes; implementation completion
  does not establish conversational effectiveness.

## F23 Recurring mini-stories

### Learner experience

Fattoush and Knafeh face a small, ordinary problem: misunderstood plans, arriving
at the wrong place, or preparing for a family visit. The learner wants to learn
what happens, understands the whole scene and contributes a useful response.
Use warmth and light humor without stereotypes or decorative quips at every step.

A text episode targets roughly 2–4 minutes of reading/practice, an estimate to
verify later rather than a mandatory timer. Learners read one short scene at a
time with available transliteration and tap-for-help meanings. Include two
comprehension checks about events/intent and one contextual response. Listening
episodes can follow when F09 supplies accepted recordings and transcripts.

### First implementation slice

Deliver one episode using previously taught language from the selected unit.
Author the problem, speaker roles, resolution, explicit target references and
checks as console-reviewable content. Link it from the unit and Practice; Today
may recommend it within the existing daily allocation, never as extra compulsory
homework. Reading a scene alone does not prove spoken competence.

Re-use F06 portraits and F04 dialogue presentation without waiting for F06.1 art.
F23.1 is the first text release boundary. F23's bounded parent target is a linked
three-episode text arc; the owner explicitly authorized unpublished F23.2/F23.3
drafts before first-episode review on October 27. Exact review/rights and
publication/accessibility gates remain. Audio editions need separate scope and evidence. One episode does not
complete F23, and the arc does not complete F12's course expansion. F21 external
media curation stays separate.

### F23.1 completion and evidence

- One source-linked episode has a coherent plot, two reviewed comprehension
  checks, one response/rationale, roles and target references; the console can
  draft, validate, approve, publish, roll back and audit it.
- Learners can start, stop, resume, inspect help and retry; downloaded scenes,
  questions and progress work offline with version/withdrawal handling.
- Guest/account history is isolated; finishing/replaying a story does not create
  duplicate core lesson completions or invented daily minutes/XP. Its daily-goal
  contribution must be defined before adding it to Today.
- Mobile/desktop fixed-frame reading, keyboard focus, screen-reader order,
  RTL/LTR and enlarged text are verified. An audio edition is unavailable until
  reviewed model audio and a transcript are present.
- Later learner observations compare comprehension, help and optional return
  interest; story completion is not a proficiency rating.

## F17.5 Phrase anatomy and grammar reference

### Learner experience

An optional “How this phrase works” view answers a concrete question about the
current phrase. Show its natural meaning, a literal breakdown where useful,
and the functions of meaningful chunks: who acts, what changes, or who is being
addressed. A label such as “person ending” accompanies any visual highlighting;
color is an aid, never the only explanation.

Add a short source-linked usage note only where it affects communication: tone,
relationship, setting or a labeled Palestinian/Jordanian difference. Avoid
country-wide claims about what everyone says or believes. Select a phrase part
to read the corresponding concise grammar reference, with reviewed examples and
links back to actual teaching contexts.

### First implementation slice

Extend existing F04 chunks, notes and F20 teaching links rather than create a
second glossary. Cover at least six approved phrases, two reusable pattern
references and three specific situational usage notes from the selected unit.
Search references by plain English topic, Arabic and Arabizi where records contain
them; empty results remain useful. Reuse a note across contexts only when its
meaning/register truly fits. No invented one-to-one mapping between Arabic and
English word positions.

### Completion and evidence

- Selected phrases show source-linked natural/literal meanings and labeled
  functions; two grammar entries and three usage notes are validated/approved
  with versioned sources and publication history.
- Teaching, feedback and applicable glossary contexts link to the same reference;
  search and back navigation preserve the learner's place in the lesson.
- Downloaded referenced material works offline; unavailable references and
  withdrawn/revised content have honest fallbacks. Core explanations remain free.
- Labels work without color, keyboard selection mirrors tap selection, and mixed
  RTL/LTR text, enlarged type and screen-reader reading order are verified.
- Content review checks whether literal glosses clarify rather than mislead;
  native-expert review is not claimed without actual reviewer evidence.

## F17.6 Can-do progress and outcome achievements

October 13: the owner authorized implementation and approved the recommended
24-hour due-review / independent first-response / distinct-situation policy and
achievement wording. [Implemented behavior and verification](can-do-progress.md)
records the adopted rules; the original proposal below remains design context.

### Learner experience

Give the learner concrete goals such as “Invite someone,” “Clarify a plan” and
“Respond when plans change.” A compact unit view links each goal to what was
practiced, which help was used, the latest relevant attempt and what to try next.
Offer an achievement when an agreed evidence threshold is met, not merely when
enough lessons or XP have accumulated.

Recommended states are **not yet practiced**, **practiced with help**,
**demonstrated independently**, and **demonstrated again later**. “Due for review”
is a separate current action, not deletion of an earlier achievement. Do not label
these states “fluent,” CEFR-certified or permanent mastery. Keep listening,
reading and production separate; typed responses cannot substantiate speaking.

### First implementation slice and decisions

Map the three F22 targets to one unit's can-do cards and one optional outcome
achievement. The proposed evidence rule is independent success on two distinct
contexts, with at least one attempt on a later due-review day. Confirm the exact
delay, success threshold, acceptable help and achievement wording before implementing
the classifier. F10's scheduling policy and F05 historical results are not silently
reinterpreted as this evidence.

Store versioned attempt facts; derive displayed status from the chosen policy.
After a content revision, explain that new practice is needed; preserve historical
evidence with its version/date and never imply that the learner lost ability.
Start device-local; synchronization and proficiency calibration require separately
bounded work. No private analytics provider or leaderboard is introduced.

### Completion and evidence

- Three outcome cards show the agreed state, skill/input type, source version,
  supporting date/help and an actionable practice link; one achievement uses the
  same published policy and cannot be farmed by retries or early repetition.
- Assisted, incorrect, uncertain and self-reported spoken attempts cannot become
  independent verified evidence; delayed/new-context rules are exercised with
  meaningful boundary cases.
- Offline/device identity, updated/withdrawn content and missing evidence behave
  deterministically. Legacy completions display honestly without invented mastery.
- UI checks cover scalable text, keyboard, screen readers, reduced motion and
  optional achievement display. F18 learner calibration remains separate; feature
  completion is not proof of the thirty-day track outcomes.

## F17.7 Weekly learning quests and forgiving habits

### Learner experience

Offer an optional weekly plan mixing new learning, due review and a story or
new-context task. A 5-minute learner receives fewer activities than a 30-minute
learner. Tasks should contribute to the existing daily plan, not stack more
chores on top. Learners can decline, change their goal, practise freely or return
after a missed week without losing access or accumulated learning evidence.

An example starter set is one new lesson, one due-review session and one story
or changed-context response. Use only available published content. When there
is no new lesson or due review, choose another legitimate activity or offer a
smaller set; never invent obligations, repeat fixtures or demand perfect scores.

Make habit tracking separately optional. A streak can mark study days with free
grace days and a welcoming restart. No shame-based messages, paid repair,
competition, mandatory timers or contacting a learner's friends.

### First implementation slice and decisions

Recommend a local weekly checklist with a simple completion acknowledgment,
no new XP economy and a separate optional forgiving streak. Quests and streaks
have independent switches; turning off one does not turn off learning or the other.
No reminder delivery service is required; F17's quiet-hour-aware, opt-in reminder
work remains a separate future scope.

Before implementing counters, explicitly select qualifying activity, weekly/day
boundaries, timezone changes, grace-day amount/replenishment, offline reconciliation
and goal changes midweek. Recommend credit for substantive completed activities,
including review, without judging a day by perfect answers or elapsed-screen time.
Use stable completion/attempt IDs so retries, reloads and reconnects cannot double
count. Changing a goal should preserve completed tasks and offer a manageable
remainder. New XP awards require a separately agreed anti-farming rule.

### Completion and evidence

- Opt-in quests generate a bounded available-content set appropriate to each
  5/10/15/30-minute goal; new learning, review and applicable story/transfer tasks
  are represented without duplicating the existing queue.
- Selected habit/weekly rules are recorded and visible; opt-out, goal changes,
  no-content cases, partial weeks and welcoming return all work without a lockout.
- Optional streaks honor the agreed free grace policy; no paid repair or punitive
  notifications. Reminder delivery and paid rewards are outside this slice.
- Offline progress/reload/reconnection, retries, week/day boundaries, timezone
  changes and identity changes cannot farm rewards or corrupt history. Device-local
  history is labeled honestly and does not imply cross-device streak accuracy.
- Keyboard/screen-reader access, reduced motion and mute are verified. Later
  observation considers voluntary returns and delayed learning evidence, not
  checklist completion alone.

## Future-agent entry

Read AGENTS.md, the live roadmap, the relevant section here and current code/content.
When implementation is authorized, mark the chosen bounded scope Active before
coding and resolve only decisions that affect it. Do not use the research shortlist
as a second status tracker. Record actual evidence in a feature implementation note,
link it from ROADMAP.md, and keep broader parent targets open when only a child ships.

The unselected record/replay/compare idea remains research only. Existing F09
recordings and F11 guided speaking commitments are unchanged.
