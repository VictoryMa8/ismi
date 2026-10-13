# Duolingo and Mango feature candidates for Ismi

October 12, 2026 · Research basis for roadmap planning.

**Owner selection update:** priorities 1, 2, 4, 5 and 6 are now selected for future
implementation. Priority 3 remains unselected. See the [current roadmap](../../ROADMAP.md)
and [expanded implementation plan](../learning-engagement-plan.md) for stable feature
IDs and refined scopes. The original comparison below is research, not live status;
no product implementation, provider choice or publication was performed by this planning.

## Recommendation

Borrow Mango's emphasis on producing useful phrases and Duolingo's narrative
variety. Add visible evidence of practical progress before adding more reward
mechanics. The ranked shortlist below extends Ismi's existing lesson/review
foundation; it does not propose rebuilding it.

### 1. Recall and recombine phrases in new situations

**Borrow:** Mango introduces a conversation, breaks it into components, then asks
learners to reconstruct language. [Mango's method](https://www.mangolanguages.com/how-it-works).

**Ismi version:** after learning a pattern, ask for a response with a different
person, plan, location or time. Start without answer tiles; offer an optional hint,
then a reviewed model and explanation. Every variant must preserve the teaching
target and use reviewed accepted answers. Plausible uncertain responses need a
recoverable review path, not authoritative AI rejection. Do not invent Arabic
examples through an unrestricted runtime generator.

**Already present:** F04 recall before reveal, F05 contextual review/checkpoints
and F10 spaced scheduling; F12.1 has drafted planning/clarification contexts pending
review/publication. Current review asks learners to think or say an answer before
checking with choices. **Extension:** capture an unassisted typed/authored response
and grade it with structured answers, including new-context variants. A first
scope could cover one published unit with one unseen-context response per target.
Measure delayed response accuracy and help use, not immediate repetition alone.

### 2. Recurring mini-stories, followed by short listening episodes

**Borrow:** Duolingo Stories use short character narratives; DuoRadio reuses recent
vocabulary/grammar in short audio shows, moving from bilingual support toward the
target language. [Stories](https://blog.duolingo.com/duolingo-advanced-stories/),
[DuoRadio](https://blog.duolingo.com/duoradio-listening-practice/).

**Ismi version:** Fattoush and Knafeh make plans, visit family or handle a small
misunderstanding. Use a 2–4-minute story with a reason to find out what happens,
two comprehension checks and a useful learner response. Begin with reviewed text;
add listening when accepted recordings are available. Always offer a transcript
and keep help available. Mature warmth fits Levantine; playful fictional stories
are not a template for canonical Quranic material.

**Already present:** F04 dialogues and F06 recurring participants. **Extension:**
connected plots and comprehension of a whole scene. F21 external media picks are
a separate scope. Start with one text episode attached to one unit; a linked
three-episode arc can follow. Audio depends on F09.

Duolingo reported a 3% rise in active learners and 4.6% more learning time in its
historical Android Stories rollout. Those are engagement measures, not proof of
greater language proficiency or a predicted Ismi effect. Stories expanded to 100+
courses in 2025. [Rollout report](https://blog.duolingo.com/duolingo-stories-the-journey-to-android/),
[2025 product report](https://blog.duolingo.com/product-highlights/).

### 3. Listen, record, replay and compare

**Borrow:** Mango permits repeated self-recording and listening beside a native
speaker model. Its comparison is an auditory self-review tool.
[Voice Comparison instructions](https://support.mangolanguages.com/hc/en-us/articles/360019099714-Voice-Comparison).

**Ismi version:** listen to a reviewed Palestinian model, record voluntarily,
replay both, then try again with a concise sound/rhythm cue. Keep recordings local
and temporary; clear them after the exercise. Offer a text/listening alternative.
Waveform resemblance must never become a pronunciation grade. Multiple reviewed
models fit the product's intelligibility goal better than matching one accent.

**Already planned:** F09 reviewed voices, F11 guided speaking and F15 sound
bootcamps. **Extension:** a simple self-comparison exercise can precede online AI
feedback. Start with the accepted recording batch once F09 supplies it. No speech
provider is selected by this recommendation.

### 4. Phrase anatomy, culture/register notes and grammar lookup

**Borrow:** Mango pairs literal and intended meanings, maps equivalent phrase
parts visually and places concise grammar/culture notes inside lessons.
[Mango's feature description](https://www.mangolanguages.com/how-it-works).

**Ismi version:** an optional “How this phrase works” view reveals phrase chunks,
their functions and contextual meaning. Use labels/selection alongside color.
Add one specific usage note where it matters: who says it to whom, formality,
gender or a labeled Palestinian/Jordanian difference. Link the explanation to a
searchable grammar reference.

**Already present:** F01/F04 explanations, phrase chunks with Arabic/Arabizi/meaning,
usage/dialect notes and F20 source-linked glossary.
**Already planned:** F17 searchable grammar. **Extension:** explicit phrase-part
functions/pattern mapping beyond the existing chunks, linked to reusable reviewed
usage notes; do not add a second glossary. Start
with a small set of approved phrases and one grammar topic. New cultural claims
need sources and approval; no native-expert review is implied.

### 5. Can-do progress with evidence

**Borrow:** Duolingo Score relates course progress to communicative descriptions.
[Score explanation](https://blog.duolingo.com/duolingo-score/).

**Ismi version:** track-specific cards such as “Make a plan together” show
practiced, demonstrated with help, demonstrated independently and due for review.
Define those statuses before implementation and expose the supporting attempt/date.
Require delayed recall and a new context before making a durable mastery claim.
Do not infer proficiency from completion, XP or a single correct answer.

**Already present:** F05 checkpoints and F17.1 factual recaps. **Already planned:**
F17 mastery/achievements. **Extension:** a visible can-do model connected to
learning evidence. Start with one unit's outcomes; calibration with learners
remains necessary, without claiming CEFR certification.

### 6. Optional weekly learning quests and forgiving streaks

**Borrow:** Duolingo uses quests to encourage varied practice and reports moving
monthly challenges from XP targets toward quests to discourage bulk XP farming.
Its “Time Spent Learning Well” metric is a product proxy, not a proficiency test.
[Quest design](https://blog.duolingo.com/time-spent-learning-well/).

**Ismi version:** an optional weekly set could invite one new lesson, one due
review and one new-context response, scaled to the learner's daily goal. Reward
useful practice and returning after a lapse. Do not require perfect scores,
mandatory timers, paid repair, leagues or friend messaging.

**Already present:** F15 daily goals/queue and F17.1 goal completion feedback.
**Already planned:** F17 optional forgiving streaks, XP and achievements.
**Extension:** learning quests; make them replace duplicated daily chores rather
than increase the queue. Validate opt-outs, repeat farming and goal compatibility.

## Proposed first-slice completion criteria

These were the initial proposed criteria. The selected features now have refined
first scopes and criteria in the [expanded plan](../learning-engagement-plan.md).

| Candidate | Observable completion criteria |
| --- | --- |
| Recall/recombine | One unit has approved changed-context prompts and structured answer rationales; a response is captured before hints; first attempt/help remain distinct; uncertain answers can be reported; downloaded practice works offline |
| Mini-story | One approved episode has source-linked text, two comprehension checks and a learner response; retry/help and keyboard/screen-reader access work; offline text works; audio is not claimed until reviewed recordings/transcript are included |
| Record/compare | Reviewed model and optional microphone/retry/replay work for the chosen phrase set; permission denial has an alternative; disposable local recordings clear on exercise exit; downloaded models work offline; no waveform grade is issued |
| Phrase anatomy | Selected phrases show reviewed literal/intended meaning and labeled functions; one reusable grammar reference is searchable and linked; usage claims have sources; colors are optional and labeled; Arabic/English layout works offline |
| Can-do progress | One unit's agreed outcome statuses link to versioned attempts/dates and distinguish skills/help; delayed/new-context evidence is required by the chosen policy; version changes and offline persistence are verified; speaking is not inferred from text results |
| Weekly quests | A goal-compatible optional set works with available content and offline progress; repeats cannot farm rewards; opt-out and a missed week do not restrict learning; any streak grace/reward policy is explicitly selected before implementation |

Passing these checks establishes the bounded feature behavior. Learning benefit
still needs observed delayed recall and scenario performance; no measured Ismi
benefit is claimed by this planning note.

## What the evidence supports

- **Retrieval:** Karpicke and Roediger's foreign-vocabulary experiment found that
  continued testing after an initial correct response improved delayed recall,
  while additional study alone did not. This supports recall before reveal; it
  does not establish conversational transfer, Arabic effectiveness or the value
  of every proposed exercise. [Original study, 2008](https://doi.org/10.1126/science.1152408).
- **Spacing:** Cepeda and colleagues taught facts to more than 1,350 participants
  and varied review gaps and final-test delays. The best gap depended on the
  retention horizon; longer was not always better. This supports distributed
  practice without validating Ismi's exact 1/3/7/14-day policy. [Original study,
  2008](https://www.psychologicalscience.org/journals/psychological-science/j.1467-9280.2008.02209.x/).
- **Product evidence:** Mango's commissioned, independently conducted 2019 study
  concerns its complete Spanish system, 95 adult novices and two months of use.
  It cannot isolate the effects of colors, notes or voice comparison or establish
  Palestinian Arabic outcomes. [Mango research summary and report links](https://www.mangolanguages.com/research).
- **Speaking:** Duolingo reports better spoken phrase translation among beginner
  French/Spanish learners who used guided calls. The tested phrases included
  practiced content; this is narrower than demonstrating an unprepared real
  conversation, and it does not validate a self-comparison feature.
  [Company study description](https://blog.duolingo.com/falstaff-calls-research/).

Ranking is a product judgment about Ismi's audience and current foundation.
Acceptance should combine usability/return visits with delayed recall,
unseen-context performance, intelligibility where applicable, accessibility and
offline reliability. Engagement alone cannot establish learning effectiveness.

## Planning boundaries

Selected ideas are tracked as Planned features in the roadmap, with consequential
policy decisions still explicit; selection does not start immediate implementation.
Existing F09/F11/F12/F15/F17/F21 commitments retain their own dependencies.
Keep core explanations, retries, offline lessons and baseline
speaking free. Exclude punitive energy, leagues, XP multipliers, pressure-based
notifications, unbounded AI content and a social network from the beta.

Context: [current roadmap](../../ROADMAP.md),
[planning workflow](../planning-workflow.md),
[earlier Duolingo critique](duolingo-user-qualms.md).
