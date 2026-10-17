# Alphabet explorer plan

F28 · October 16, 2026 · Original design plan. Current status and priorities live in
[ROADMAP.md](../ROADMAP.md#f28-alphabet-explorer).

The owner subsequently authorized implementation, push and deployment, and accepted
private Khmer/French packs pending decisions/review, playback without microphone,
unscored repeat-aloud practice and device-local evidence. See the
[implemented application and remaining content gates](alphabet-explorer.md).
Historical authorization statements below describe the original planning request.

## Goal and scope

Give learners a freely accessible place to see a letter, hear its name and sounds,
say it themselves, and recognize it in useful words. Keep exploration optional;
learners can continue conversation lessons without memorizing an alphabet first.
This is reading and sound support for F15, F25.3 and F26.3, not a replacement for
their placement assessments or wider curriculum outcomes.

Cover all three currently scoped languages: Arabic, Khmer and French. Arabic has
shared script records with separate Palestinian Levantine, MSA and Quranic teaching
contexts. Each course has its own examples, pronunciation references, availability
and practice evidence. Portuguese remains future expansion, without a new pack.
French explorer planning does not authorize French course authoring or beta inclusion.

The owner requested a plan. All implementation, content inventories and release
recommendations below are proposals. No new lessons, recordings, publications,
provider integrations, deployments or reviewer engagements are authorized here.

## Current checkout and reusable pieces

Inspected October 16, 2026 on `main`, with a clean checkout at entry:

- [Course metadata](../i-web/src/courses.ts) and the API
  [catalog](../i-api/Models/CourseCatalog.cs) already identify five courses, their
  languages, directions, fonts and pronunciation-help labels.
- [App navigation and viewed-course state](../i-web/src/App.vue) provide the
  Practice hub and course selector. [Landing route recognition](../i-web/src/routes.ts)
  also needs updating when a new learner route is introduced.
- [Placement](placement-starting-point.md) records reading/sound preferences but
  does not assess letter recognition, decoding or pronunciation.
- [Khmer script support](khmer/README.md#implemented-authoring-and-script-flow)
  displays exact whole-expression teaching cards. It is not an individual-letter
  explorer, phonics inventory or evidence of linguistic approval.
- [Offline storage](../i-web/src/offline.ts) verifies hashed recording bytes and
  commits a lesson only after its audio is complete. Its downloader currently
  discovers audio through lesson steps; explorer audio needs an explicit manifest.
- [Curriculum publishing](../i-api/Services/CurriculumPublishingService.cs) is
  lesson-shaped, including public recording access based on published lesson-step
  references. A new content type needs its own validated publication/access path;
  adding frontend cards alone would leave that workflow incomplete.

No alphabet explorer was found in the inspected learner routes, models or teaching
flow. No fresh database, hosted-content or deployment inspection is claimed.

## Learner experience

1. Open **Practice → Alphabet** for the viewed course. Add a secondary link from
   Courses and appropriate reading/sound recommendations after placement. Preserve
   the existing five tabs and use the shared mobile-friendly Back control.
2. Browse a responsive letter grid in the pack's authored order. Search by character,
   reviewed letter name or pronunciation-help spelling. Optional categories separate
   letters, vowel/sign support and common combinations without mixing their counts.
3. Open one letter to see a large selectable form, name, useful variants and a short
   explanation. **Play name** and **Play sound** are distinct actions. Where a sound
   needs a vowel or syllable context, label exactly what the clip demonstrates.
4. Explore **two or three everyday example words per basic letter**, each with
   target text, English meaning, optional course-appropriate pronunciation help and
   reviewed word audio. Highlight the target occurrence and explain relevant sound
   changes or silence. Prefer familiar lesson words; do not mark new examples learned.
5. Choose **Practice this letter** or a short mixed set. Replay, reveal help, skip,
   retry, exit and return to exploration at any time. End with a factual recap of
   what was tried and what needs another look.

Keep the course name and switcher visible. Changing the viewed course stops audio,
preserves per-course browsing/practice state and started lessons, and leaves the
primary course and daily allocation intact. Unavailable packs have an honest planned
or not-yet-reviewed state; never substitute another course's examples or voice.
An explorer pack can eventually be available while its conversation course is still
planned, provided the interface distinguishes those two availability states.

Use the current rich accent palette with visible course names, concise functional
copy, generous touch targets and restrained motion. A focused practice dialog should
reuse the fixed-height frame, one internal scroll area and persistent navigation.

## Language-specific content

These are proposed coverage boundaries, to be pinned in a reviewer-approved
inventory before authoring. “Complete” means that inventory is covered, not every
character in a Unicode block.

| Pack | Letter appearance and supporting entries | Sound and example treatment |
| --- | --- | --- |
| Palestinian Levantine Arabic | Basic Arabic letters, joining/nonjoining behavior, applicable isolated/initial/medial/final forms; separate hamza, vowel-mark and common form support | Urban Palestinian model; distinguish letter names from conversational realization; label reviewed Jordanian alternatives where useful |
| MSA Arabic | Reuse applicable script forms, with separately authored vowel/reading support | MSA pronunciation, vocabulary and usage labels; do not inherit dialect audio or answer rules |
| Quranic Arabic | Reuse applicable script basics; only approved reading marks and examples from trusted records | Decoding/pronunciation support within the initial course boundary; no detailed tajwid or interpretive claims; exact cited text/audio permissions required |
| Khmer | Contemporary consonants with series labels, dependent/independent vowels, common signs and subscript combinations; group introductory and extended support separately | Phnom Penh reference model; demonstrate consonant/vowel combinations and contextual sounds; reviewer chooses exact inventory, names and pronunciation-help convention |
| French | Basic uppercase/lowercase letters; separate accent, cedilla, ligature and common spelling-combination support | Letter names distinct from word sounds; contextual pronunciations, silent letters and multi-letter spellings; reference variety remains an F25.1 decision |

Technical sources support these design distinctions, not acceptance of Ismi's
curriculum or permission to copy examples/audio:

- Unicode explains Arabic contextual forms and joining behavior in its
  [Arabic script FAQ](https://unicode.org/faq/arabic.html). Show authentic word
  contexts, including forms that do not exist for a letter; do not promise four
  distinct shapes for every letter or store presentation glyphs as replacement text.
- [Unicode 17, section 16.4](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-16/)
  describes Khmer inherent vowels, two consonant registers, dependent vowels and
  subscripts. The proposed pack therefore needs combinations, not a fixed
  one-letter/one-sound mapping. Exact modern examples still need fluent review.
- OQLF's [French vowel introduction](https://vitrinelinguistique.oqlf.gouv.qc.ca/22205/la-prononciation/notions-de-base-en-phonetique/les-voyelles-phonetiques)
  distinguishes phonetic sounds from written vowels. Separate spelling and sound
  records; this reference does not select a French course variety.

Example words should be short, useful for adult relationships and everyday life,
and supported by approved sources. Prefer initial, medial and final target contexts
where meaningful, rather than forcing every letter into identical positions.
Basic letters need at least two suitable word examples; combination/sign entries
need a reviewer-defined demonstration rule. If suitable cleared examples are missing,
record the gap and keep the pack partial instead of inventing coverage.

Preserve exact word strings and their source versions. Highlighting must not split
Arabic joins or Khmer combining/subscript sequences, add spaces, or corrupt copying.
Use authored target locators with validated text recombination and rendering checks;
provide an accessible textual explanation when a visual cluster cannot be safely
highlighted. Quran excerpts remain unchanged trusted text with separate display
annotations; never generate or silently normalize them.

## Practice and progress

| Activity | Learner action | Evidence and limits |
| --- | --- | --- |
| Shape recognition | Match a letter to its applicable form or identify it in a word | Records visual recognition; does not establish reading fluency |
| Listening recognition | Hear reviewed audio and choose the matching letter, syllable or word | Only available with approved audio; a text alternative is a separate visual task, not a listening pass |
| Word spotting | Find an authored target occurrence in one of its example words | Accept all intended occurrences; explain the target's role and contextual sound |
| Listen and repeat | Play the model, say it aloud, replay and self-check using a concise sound cue | Speaking opportunity without automatic correctness or a pronunciation score |

Each graded item needs structured accepted answers, an explanation and an
accepted-answer rationale. Avoid random distractors that create ambiguous targets.
Short mixed sets should vary letter forms and word contexts instead of repeating
one recognition drill. No mandatory timer, hearts, course lock or paid retry.

Recommended first version: model playback and repeat-aloud practice without a
microphone requirement. Optional local record/replay/compare is a separately
accept-or-defer enhancement at implementation scoping: verify browser behavior,
request microphone access only after an explicit action, upload nothing, keep raw
audio only for the active comparison and discard it on dismissal/navigation/account
change. Self-comparison never establishes assessed pronunciation. Automatic feedback
remains a later F11/F25.5/F26.5 provider/privacy decision with actual language testing.

Store per-identity, per-course, versioned evidence: letter/pack ID, activity, first
answer, help, attempts and time. Distinguish **viewed**, **practiced**, **recognition
result** and **self-checked sound**; none implies sound mastery. Browsing or replaying
must not complete lessons, raise placement, award XP or change daily scheduling.
Recommend device-local persistence first, with clear Account wording; cross-device
alphabet evidence requires a separately specified sync/conflict scope.

## Content, publication and engineering

Proposed records, to finalize in F28.1:

- **Script inventory:** stable script/entry IDs, authored order, category, exact
  text/form demonstrations and reviewed names. Shared Arabic forms can be referenced
  without duplicating all three courses' data.
- **Course pack:** stable course/pack ID and version, explicit coverage manifest,
  entry references, pronunciation-help convention, course sound mappings, contextual
  notes, word examples and practice definitions.
- **Provenance and audio:** source locator/version, reviewer disposition, rights for
  text/adaptation/recording/offline distribution, exact audio transcript, speaker,
  variety, asset hash and review state. Letter-name, contextual-sound and example-word
  clips are separate references; do not fabricate a bare consonant by cropping audio.
- **Practice evidence:** identity/course/content-version keys, activity-specific
  results and help state, kept separate from lesson completion and can-do claims.

Extend the ASP.NET/Vue application rather than create another course engine. Plan a
dedicated alphabet content model, validator and owner-console section using the same
draft → validate → approve → publish → rollback/withdraw audit principles. Drafts
stay private. Public manifests and recording access must authorize only published
pack references; existing lesson publications and endpoints remain compatible.

Publication checks must verify inventory coverage, target/example integrity,
reviewed explanations, exact source/audio links and redistribution rights. Human
model audio is the intended baseline; browser speech synthesis is not evidence of
reviewed pronunciation. Missing approved audio blocks a pack's sound-ready claim.
An explicitly scoped text-only prototype cannot satisfy the sound explorer outcome.
The exact-five Khmer lesson exception does not authorize these new entries or audio.
MSA/Quranic packs need track-specific controls; a new content type cannot bypass
existing restrictions. Owner approval remains the final publication step.

Add explorer routes to both App and landing route recognition, with reliable deep
links, back/forward and focus restoration. Reuse course metadata, fonts, BackControl,
audio controls and identity boundaries. Stop any other model clip and suppress chimes
during pronunciation playback; playback starts only on interaction.

Download packs explicitly with text, font, practice definitions and every required
audio asset pinned to one manifest version. Extend the existing verified-download
pattern: report completion only after every asset passes, retain a previous complete
version on failure and show storage/download errors clearly. Support offline reload,
practice and evidence persistence. Revalidate publication when online; apply known
withdrawals and preserve historical attempt evidence without claiming old results
cover changed text/audio. Offline clients cannot discover new withdrawals until
reconnection; make that limitation explicit in release evidence.

## Delivery sequence and completion gates

| Task | Deliverable | Done when |
| --- | --- | --- |
| F28.1 Shared design, contract and content gates | Browsing/detail flow, versioned inventory/pack model, validator/console and published manifest/audio access | Reviewed representative fixtures cover joining, combining marks, silent/contextual sounds and unavailable packs; unauthorized drafts/assets stay private; exact proposed inventories and remaining decisions are recorded |
| F28.2 Arabic packs | Shared forms plus three course-specific example/sound packs | Every agreed basic entry has applicable forms, distinct name/sound treatment, 2–3 cleared word examples and approved clips/rationales; each course's review/rights gates pass independently |
| F28.3 Khmer pack | Series/vowel/subscript-aware explorer tied to familiar words | Fluent reviewer accepts inventory/help/text/audio; combinations render and sound correctly; examples/rights are complete; no alphabet prerequisite |
| F28.4 French pack | Letter grid, case pairs and selected spelling/sound support | F25.1 variety/review decisions resolved; complete agreed inventory/examples and approved model audio; accents and combinations preserve exact text |
| F28.5 Practice, offline and evidence | Four baseline activities, pack downloads and separate progress | First/help/retry evidence persists per identity/course/version; incomplete downloads never appear complete; offline reload/practice works; lesson/queue state is preserved |
| F28.6 Access checks and authorized delivery | Verified candidate, per-pack readiness and rollout/rollback evidence | Keyboard, real AT, small-screen/enlarged text, supported-browser offline/reconnection and content-access checks pass; exact content approval and any authorized publication/deployment are separately recorded |

Recommended order: F28.1 and a small private Arabic/Khmer fixture slice → F28.5 →
reviewed full Levantine and Khmer inventories → separately gated MSA/Quranic/French
packs → F28.6 for each ready pack. An early slice proves engineering behavior,
not complete alphabet coverage. Keep F28 Planned until implementation is authorized;
no relative priority change to other workstreams or completion date is inferred.

Verification should include correct and ambiguous distractors, letter-name versus
sound labels, Arabic shaping and mixed direction, Khmer stacks and target selection,
French accents, audio cancellation, direct navigation, course switching and started
lesson preservation, guest/account separation, failed downloads, offline font/audio,
version replacement and known withdrawals. Check 320 px, enlarged text, keyboard,
VoiceOver/TalkBack and real supported Safari offline use. Non-listening/non-speaking
alternatives must remain usable and report the kind of practice actually completed.

The parent completes only when all five course packs meet their pinned basic
coverage and the shared experience passes its gates. Pack readiness and actual
publication/deployment remain separate facts; no date or release claim is made now.

## Decisions before implementation or content acceptance

Recommended defaults: Practice tile plus course links; optional exploration; shared
script forms with course-specific sounds/examples; two or three words per basic
letter; reviewed human audio; unscored repeat-aloud practice; device-local evidence;
no queue/XP integration in the first version. These are planning recommendations,
not newly settled policies.

Confirm or revise those defaults when implementation is requested. Resolve exact
Arabic support/Khmer inventories, Khmer pronunciation help and fluent reviewer,
French variety/review route, source and audio permissions, and Quran resource IDs
before accepting the affected content. Decide whether optional local recording is
in the first slice. Provider selection, spending, reviewer contact and publication
retain their existing authorization boundaries.
