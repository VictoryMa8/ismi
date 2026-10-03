# Content walkthrough and remaining review

Date: September 22, 2026. Applies to the seven packages identified by
`review-manifest.json`. This is the historical pre-publication report. The seven exact v1 packages were
subsequently owner-authorized and published locally on September 26, 2026 UTC.
The pilot, language, recording, and accessibility limitations still apply.

## Content coverage

| Lesson | Dialogue task | Distinct practice emphasis | Closing transfer |
| --- | --- | --- | --- |
| 1 | Day check-in and response | Day versus personal description; contrast; degree; named addressee | A different quiet day, then return the question |
| 2 | Compare completed activities | First/second event; speaker; pronoun reference; past address | Rest before work, then confirm the day |
| 3 | Offer and customize drinks | Choice versus combination; personal preference; polite acceptance/refusal | Roles reverse; order coffee from Fattoush without sugar |
| 4 | Agree on a meal | Hunger and negation; shared suggestion; two dishes | Suggest the meal and reuse the drink preference |
| 5 | Family check-in | Possession; singular/plural reference; relevant follow-up | Mother’s location and an invitation to visit |
| 6 | Arrange tomorrow | Shared action; day/time; whose family; after work | Change the time to seven and the activity to tea |
| 7 | Fresh combined situation | Track who/time/order rather than reciting earlier answers | New work/rest story and tomorrow’s whole arrangement |

All seven have six dialogue turns and eight graded interactions. Correct choice
positions vary across A, B and C. Every wrong choice has a contextual rationale;
none of these responses is labeled universally bad Arabic. In gender-focused
items, the scene explicitly names the speaker or addressee. Lesson 7 hides English
help initially, but the learner may reveal it at any time; transliteration stays
available. The interface offers unrestricted retry.

## Timing estimate and its limits

The lessons are short conversations followed by deliberate practice, not single
questions assigned arbitrary durations. The editorial walkthrough considered:

- Two passes of each short Arabic/transliteration dialogue, around 65 words/minute.
- English help, expressions, scenario, goal and usage/address notes at around
  160 words/minute (recording/source metadata is optional and excluded).
- Reading each instruction, Arabic/transliteration choices and correct feedback
  at around 150 words/minute.
- About 15 seconds of decision/recall time per interaction, plus 35 seconds to
  reconstruct a closing exchange.

Those **assumptions**, applied to the actual word counts, give approximately
6.7, 6.4, 6.4, 6.6, 6.6, 6.8 and 7.3 minutes. Display estimates round to 7, 6, 6,
7, 7, 7 and 7 minutes. Readers who use all help or retry several times will take
longer; confident readers will be faster. There is no timer or pacing restriction.

This is a walkthrough-based planning estimate, **not observed learner timing**.
The automated browser walkthrough is deliberately much faster and validates
controls and persistence, not educational duration. A false-beginner pilot must
still time each lesson and assess whether the practice is sufficient. No
thirty-day outcome, fluency, or spontaneous-speaking claim follows from this work.

## Source and language review still needed

The exact approved sources, rights boundaries and Maknuune v1.0.1 snapshot hash
are recorded in `source-inventory.json`. Each package records the lexical entry
IDs and publisher sample page/table locators actually consulted. The original
compositions and answer rationales remain AI-assisted drafts.

Specific owner review points:

1. Urban realization of ق in `ʾahwe`, `hallaʾ`, and `raʾyak`; the source set contains
   variation and a Gaza model. Do not present one realization as universally
   Palestinian or grade an unlisted natural spoken variant as wrong.
2. Gender/address and inflection consistency: `kīfak/kīfik`, `yōmak/yōmik`,
   `ʿmilt/ʿmilti`, `biddak/biddik`, `law samaḥt/law samaḥti`, and feminine adjective
   endings. The dialogue and instructions specify whose form is needed.
3. Naturalness of the original polite requests and suggestion chunks, especially
   `shū raʾyak…`, `khallīna niʿmal…`, and the confirmation of future plans. Lexical
   references support the building blocks; they do not certify an entire new
   dialogue. The sample's unseen full grammar chapters are not claimed as checked.
4. False-beginner pacing and transfer: practice uses contextual choices supported
   by the current deterministic evaluator, not free-form production or AI speaking
   assessment. The pilot should verify that learners can use the expressions
   beyond recognizing the offered choices.

There are no known remaining structural, option-ID or deterministic grading
failures. Owner authorization was subsequently recorded for these seven finished versions.
Changed versions require new approval. No native
curriculum reviewer was available or claimed. No Quranic content is included.

## Delivery verification

- API tests: 14 passed, including all seven source-linked packages, every answer
  choice, draft import/idempotency, immutable publication gates and course order.
- Production Vue/PWA build: passed as part of browser verification.
- Browser tests: all 4 passed (23.9 seconds for the suite; the full authored-content
  test took 16.7 seconds). The baseline offline loop and owner draft-isolation checks pass.
  The authored-content test walks all seven previews and all seven offline lessons,
  deliberately gets an answer wrong and retries in each, then verifies queued
  reconnection, persisted course progress, unit completion and review without
  duplicate completion credit. Publication in this test affects only its disposable
  test database, never the owner's local drafts.
- All authored exercise walkthroughs use actual Tab/Enter navigation, including
  a wrong answer, contextual feedback, retry, next step and completion. Focus moves
  to the current instruction or feedback and returns to the owner preview button.
- Mobile visual check: the lesson 1 dialogue screenshot was inspected; Arabic is
  RTL, English/transliteration are LTR, and the sheet scrolls without horizontal
  overflow at the tested Pixel 7 viewport. All seven previews assert no horizontal
  overflow. Core text remains available without listening.
- Real screen-reader testing and broader browser/device accessibility release
  gates remain outstanding; automated keyboard checks do not replace them.

## Recordings

Reviewed recordings: zero. Each review file contains its exact dialogue script;
structured prompts and choices supply additional recording lines. The package's
speaker note identifies the roles and requires wording/pronunciation checks
before recordings are labeled reviewed. Browser speech remains an optional,
explicitly labeled device preview. No speech provider, recording purchase or
speaker contact was undertaken.

## Publication verification — September 26, 2026 UTC

The owner explicitly authorized approval and publication of the seven delivered
versions. All package hashes matched the manifest; stored lesson content and
sources matched those packages. Existing service methods validated, approved,
and published records 7–13 as v1, with the owner-via-Codex authorization in the
audit actor. All seven actual local learner endpoints returned published v1 and
eight interactions. No lesson language or expert-review label was changed.

Fresh verification: 14 API tests passed; production frontend build passed; all
4 browser tests passed (22.6 seconds), including offline completion, reconnect,
owner preview isolation, and the seven-lesson walkthrough. Local server/browser
verification required execution outside the network-restricted sandbox.
Publication is local only; no public deployment was performed.
