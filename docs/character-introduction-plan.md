# Recurring characters for Ismi lessons

Current feature status and next actions live in [the roadmap](../ROADMAP.md#f06-recurring-character-support).
This file supplies design/implementation evidence; historical checks are dated checkpoints.

Proposed October 1, 2026. The owner subsequently requested implementation and
specified cartoonish corporate illustration. Optional role support, a bundled
Fattoush/Knafeh design proposal and seven metadata packages are now implemented; see
[the character guide](characters/character-guide.md) and
[metadata proposals](../content/levantine/everyday-01/revisions/characters/README.md).
Final design selection, narrative changes, publication and deployment remain
separate owner decisions.

## Recommendation

Make Fattoush and Knafeh the first two recurring illustrated adults in Ismi. Both
already appear throughout the seven guided Everyday conversations packages.
Give them recognizable faces, consistent personalities and a small continuing
story, then carry that identity from dialogue into recall, practice and review.

The intended experience is: “I know who I’m talking to, what just happened, and
why I’m saying this.” Familiarity should support the promise to speak with the
people you love. Start with a two-character conversation slice; expand the cast
when a new relationship or scenario needs another person.

Duolingo describes familiar personalities and relationships as a way to tell
stories within beginner vocabulary and length constraints. That is a useful
design principle for Ismi, though it does not establish learning benefits for
our implementation. Its original character work also connects illustrations to
the people speaking within exercises. Sources: [character voices and storytelling](https://blog.duolingo.com/character-voices/)
and [building the cast](https://blog.duolingo.com/building-character/).

## First cast and visual direction

These are proposed editorial directions, not new facts about the published
curriculum. Keep the existing names and language model. Avoid inventing a city,
occupation, religious identity or romantic relationship that the scenes do not
establish.

| Character | Proposed personality | Useful narrative behavior | Design goal |
| --- | --- | --- | --- |
| Fattoush | Warm, observant, direct; enjoys a clear plan | Notices how someone feels, asks follow-ups, helps clarify an arrangement | Distinct adult face, silhouette and everyday outfit; expressive without exaggeration |
| Knafeh | Thoughtful, easygoing, lightly humorous | Adds a detail, checks a preference, offers an alternative | Equally recognizable adult design; different silhouette and gestures |

Both characters ask questions, make decisions, work, share food and talk about
family. Give each warmth and agency. Personality should appear through small
choices in approved stories, not gender stereotypes or paragraphs of biography.
Do not assign fixed food/drink preferences that make quiz answers predictable.
The pair can be introduced simply as people who know each other well; proposed
new scenes can use friendship as the default relationship until a different
relationship is explicitly chosen.

Recommend contemporary, gently stylized 2D human illustrations: clear facial
features, warm expressions, simple shapes and everyday clothing. Use Ismi’s
green/red/charcoal accents with a restrained neutral palette. Keep the designs
original; no Duolingo character likenesses, signature proportions or animations.

Prepare a small side-by-side concept sheet before producing the complete asset
set. Compare restrained cartoon and editorial illustration treatments against
the current Arabic lesson cards. The recommended default is the restrained
cartoon treatment: approachable and expressive, while clearly adult.

The initial asset set is deliberately small: two portraits and three expression
variants per character—neutral, speaking/attentive and warm encouragement. Use
static images first. Add gestures or full-body scene illustrations only after
the portrait-based slice works. Record asset authorship, generation/edit history
where applicable, and usage rights. Asset files must be local, optimized and
available offline.

## Where characters appear

| Surface | Proposed behavior |
| --- | --- |
| Meet the conversation | Small portrait pair, existing scenario text and named dialogue bubbles. One-line introduction; no mandatory character onboarding. |
| Dialogue turns | Portrait plus speaker name. Preserve “Fattoush → Knafeh” and equivalent recipient information where it matters. Align by authored participant role, not line-number parity. |
| Phrase teaching | A small named portrait where the phrase has an explicit speaker. General grammar explanations remain neutral. |
| Recall | Keep the person and situation visible while the phrase stays hidden. The character’s expression must not reveal the expected answer. |
| Practice | Identify who asks and who the learner is answering as. Keep Arabic, transliteration and optional help prominent. |
| Feedback | A quiet supportive expression accompanies the existing explanation. No disappointment, mockery or animated interruption after mistakes. |
| Review/checkpoint | Preserve the originating scene’s people and roles when mixing exercises. Do not randomly attach a portrait to a prompt. |
| Courses/Today | A small cast thumbnail can preview a conversation. Keep the current concise lesson titles and controls. |

Example flow for lesson 1: show Fattoush asking Knafeh how he is; retain their names
beside the dialogue; later show “Reply as Knafeh” while the learner recalls his
response. This identity cue should explain the speaker/listener relationship
without adding a translation or showing the answer. Character appearance must
never be the only way to identify the required grammatical person or address
form. Do not infer those forms from an illustration or name.

Keep the fixed dialog bounds, pinned header/stages/navigation and single scroll
area. Portraits should sit within existing cards; reserve their dimensions so
loading or expression changes cannot shift content. Long Arabic lines and large
text must fit before adding larger illustrations.

## A continuing story across the first unit

Use the current seven scenarios as the backbone. This gives the characters
continuity without requiring new Arabic to launch the visual layer.

| Lesson | Existing story beat | Visual/person connection |
| --- | --- | --- |
| Check in | Fattoush and Knafeh catch up at home | Introduce the pair and make speaker/listener roles explicit |
| Today’s activities | They compare their day the next evening | Reuse the same identities as actions and time change |
| Drinks | Knafeh offers Fattoush tea or coffee | Show the host/guest situation; preferences come from the current scene |
| Shared meal | They decide what to eat together | Let both people express a feeling and make a suggestion |
| Family | They ask about each other’s family | Make whose family is being discussed clear; mentioned relatives need no new portraits yet |
| Tomorrow | They agree on a family visit and time | Connect planning expressions to a concrete shared arrangement |
| Put it together | A fresh Friday check-in and plan | Reuse familiar people with changed details, requiring attention to the current exchange |

Later, introduce one older relative or another friend through a lesson that
actually needs them. Name, family relationship, visual representation and
dialogue would be reviewed together. A wider adult cast can support differing
ages, perspectives and voices. Duolingo’s creative team describes varied ages
and contrasting personalities as storytelling tools; Ismi’s choice of cast
remains an editorial proposal. [Character origin stories](https://blog.duolingo.com/duolingo-female-character-origin-stories/).

## Implementation sequence

### 1. Define the two characters and prototype lesson 1

Produce a one-page character guide and concept sheet with consistent front/side
appearance, expression rules and brief personality notes. Mock up the opening
dialogue, one recall turn, one practice turn and mistake feedback using existing
lesson text. Review mobile and desktop versions together.

Deliverable: two proposed designs and a concrete lesson mockup. Resolve the
visual direction and any relationship assumptions here before committing the
full asset set or rewriting scenes. The owner chooses the final character
designs; routine layout decisions can proceed within a later implementation task.

### 2. Add optional character metadata and shared rendering

The current model stores `DialogueTurn.Speaker` as a display string, and practice
steps have no explicit character identity. Add optional stable character IDs
and authored speaker/addressee/response-role metadata. Preserve the existing
speaker text and text-only fallback. Each referenced character resolves through
a small versioned registry with local asset paths and display names.

Use explicit IDs rather than parsing “Fattoush → Knafeh” in the renderer. Audit the
mapping for every dialogue, teaching card and practice step; infer nothing from
the correct answer’s location or the exercise index. Generic teaching cards can
remain unassigned. Distinguish named character roles from the learner’s account
identity; an exercise’s temporary role does not set the learner’s gender.

Implementation touchpoints:

- ASP.NET lesson records, package serialization and deterministic curriculum
  validation: optional character references, valid IDs and consistent scene roles.
- TypeScript lesson types and a reusable `CharacterPortrait`/speaker-label
  component: one rendering contract across teaching, practice and review.
- `LessonTeaching.vue`: named cast and dialogue portraits; remove reliance on
  alternating turn index for character placement.
- `App.vue` and `ReviewPractice.vue`: retain scene identity in prompt, recall,
  feedback and checkpoint states.
- Curriculum console: preview the character mapping and identify missing or
  conflicting roles before approval.
- PWA asset delivery: precache the initial small cast with the app shell; pin
  asset revisions and retain paths referenced by supported published packages.

Keep character metadata optional so older publications, downloaded packages and
demonstration fixtures still open. Start with a bundled registry and assets;
a separate character-management backend is unnecessary for two characters.
Unknown references must produce a usable named/text fallback, while newly
authored packages fail validation for invalid explicit references.

Deliverable: lesson 1 character support in an owner preview, with original
Arabic, accepted answers, grading and provenance intact. Metadata changes to a
published lesson require a new draft; no published snapshot is rewritten.

### 3. Carry the approved treatment across the seven lessons

Prepare versioned drafts with audited cast/role mappings. Preserve existing
unpublished guided revisions: add a reviewed metadata proposal to the correct
draft or create a new version through the console where required. Do not
overwrite portable source packages or assume older approval covers a new package.

Use the same characters throughout dialogue, recall, contextual practice,
mistake review and checkpoints. Every participant change must follow the scene.
The owner approves publication through the existing console workflow.

Deliverable: a complete first-unit character experience, including deterministic
offline use, with backward compatibility for older content.

### 4. Add restrained motion and broader stories after the first slice

If the static character treatment is useful, add brief expression changes or a
small greeting gesture without delaying navigation. Reduced motion uses static
images. Introduce a third character when a new lesson needs another relationship.
Later controlled speaking branches can use the same cast and approved scripts.

Voice is a separate workstream. A fictional character is not the identity or
credit of a real recording contributor. Keep speaker permissions, dialect,
transcript and provenance visible. Do not silently pick a speech provider,
clone a voice, or replace core Palestinian recordings with synthetic character
voices. Art can ship before real recordings are supplied.

## Track-specific treatment

Begin with Levantine only. MSA can later use the same adults in clearly labeled
formal contexts, provided register changes are explicitly taught. Quranic
lessons should use a quiet, restrained presentation without comedic character
performances or a fictional religious authority. Character work does not
unblock either track’s current publication restrictions, source permissions or
review requirements. Keep canonical Quran text and its provenance untouched.

## Acceptance checks

- Learners can identify who is speaking and who they are replying as from text
  alone. Names/roles remain clear with portraits hidden or images unavailable.
- No answer depends on skin tone, outfit, assumed gender, facial expression or
  knowledge of a character’s favorite drink/food.
- Existing Arabic, transliteration, accepted-answer records and source links
  remain unchanged in the initial visual slice. Any narrative rewrite receives
  separate content review.
- Core controls, Arabic scaling, keyboard focus, screen-reader order, contrast
  and mixed RTL/LTR remain usable. Decorative portraits do not duplicate spoken
  names in the accessibility tree. Add a plain-text character description only
  where it provides useful information.
- Full lesson completion, review, checkpoint, offline reload and reconnection
  work with portraits present and with asset loading deliberately failed.
- Character changes do not resize the dialog, move pinned controls, reveal a
  hidden answer, introduce mandatory delays or depend on animation.
- Draft character metadata stays out of public downloads until published.
  Older downloaded versions still work; rollback restores their original roles.

Observe a small set of adult learners before expanding: ask them to identify
the two people, explain who a phrase addresses, and recall a scene after a delay.
Compare the same exercises with and without the portraits. Use this as a
directional usability check, not an efficacy claim. No new analytics provider
or recording retention is needed for this first evaluation.

## Recommended next task

Create the Fattoush/Knafeh concept sheet and lesson 1 visual prototype. Keep the Arabic
and grading unchanged, use static portraits, and prepare it for owner review.
This provides the first concrete decision about the cast before building out
the full unit.
