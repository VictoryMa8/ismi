# First-unit release candidate — October 3, 2026

Status: owner approved the exact seven packages and existing art on October 3, 2026 ("I approve"); all seven are published as hosted v2 and verified. Uses the existing Fattoush/Knafeh art (`ismi-cast-v1`). No new Arabic, translations, grading targets, or recordings.

Release target: the existing development preview API at `https://ismi.alwaysdata.net`; local console drafts are for review and do not update that host. Exact hosted versions and audit evidence are in the [release record](../../../../../docs/pilot/release-2026-10-03/README.md).

## Approved changes

- All seven packages carry the guided teaching and character metadata, including the October 2 names. The hosted release now serves these approved revisions.
- Lesson 1 teaches a casual check-in with شو عامل؟ / شو عاملة؟ and feeling responses, following the owner-confirmed intent in LEV-2026-09-30-01. This does not assert that the old day question is universally invalid.
- Lesson 4, `e04-07`: keep the existing prompt addressed to Knafeh; make the instruction and response role Knafeh, replying to Fattoush. Arabic, accepted answer and rationale stay unchanged.
- Lesson 5, `e05-01`: label the “And you?” prompt as Fattoush addressing Knafeh, followed by her family question. The same speaker continues; Arabic and answer remain unchanged.

All other lesson content matches the character packages. Structural validation and these consistency corrections are not native-speaker review.

## Exact packages

The manifest pins each candidate and predecessor hash. Console version numbers are target-specific.

| Lesson | Goal | Review | Package |
| --- | --- | --- | --- |
| 1 · Check in with someone you love | Check in, say how you feel, and keep a short exchange going. | [01-review](01-review.md) | [01-lesson.json](01-lesson.json) |
| 2 · What did you do today? | Describe two completed activities in order and answer a relevant follow-up. | [02-review](02-review.md) | [02-lesson.json](02-lesson.json) |
| 3 · Want tea or coffee? | Offer a drink, express a preference, and politely accept or decline. | [03-review](03-review.md) | [03-lesson.json](03-lesson.json) |
| 4 · Let's eat together | Say you are hungry, suggest eating together, and agree on a meal. | [04-review](04-review.md) | [04-lesson.json](04-lesson.json) |
| 5 · How's your family? | Ask about someone’s family, share a short update, and ask a relevant follow-up. | [05-review](05-review.md) | [05-lesson.json](05-lesson.json) |
| 6 · What are we doing tomorrow? | Suggest a shared visit, ask for a time, and confirm tomorrow’s plan. | [06-review](06-review.md) | [06-lesson.json](06-lesson.json) |
| 7 · Put it together | Follow a new exchange about the day and family, then agree on food, a drink, and a time. | [07-review](07-review.md) | [07-lesson.json](07-lesson.json) |

## Release gate

The owner approved these exact seven packages and existing art. All seven passed console validation, approval and publication on the named target. Their public payloads and 52 source records match the approved packages. Prior v1 versions remain superseded and available for console restoration; no fresh full hosted database backup was obtained. Local accounts/progress were not copied to the host.

The local importer may prepare/update importer-owned drafts but never approves or publishes. Pilot session tasks and the first recording batch are pinned to this candidate; if wording changes, regenerate/reconcile them before use.

No participant observations, reviewed audio or real iPhone/VoiceOver evidence exists yet.
