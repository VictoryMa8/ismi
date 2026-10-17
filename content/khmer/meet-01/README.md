# Meet someone and keep the exchange going

F26.2/F26.3 · October 16, 2026 · **Five published unreviewed text-only development previews.**

The owner authorized drafts and selected contemporary Cambodian Khmer with a
Phnom Penh reference model, twelve units/sixty lessons, and conversation-first
study with optional script help. The review route is draft preparation now and a
designated fluent Khmer reviewer before full reviewed publication. The owner later
authorized the exact five-preview exception documented below. These candidates do not
establish a source-approved foundation, current Phnom Penh speech, cleared rights,
reviewed pronunciation or a completed first unit.

| Order | Candidate | Goal |
| --- | --- | --- |
| 1 | [Greet someone](01-review.md) | Greeting, attention and gratitude in a peer meeting |
| 2 | [Introduce yourself](02-review.md) | Give an assigned name and ask a name |
| 3 | [Get to know each other](03-review.md) | Distinguish name and origin requests |
| 4 | [Ask for help understanding](04-review.md) | Request repetition or slower speech, then respond |
| 5 | [Keep the exchange going](05-review.md) | Reuse the phrases in a changed role and situation |

The candidates contain 29 dialogue turns, 18 teaching cards and 30 contextual
practice interactions, with recall before reveal, exact authored reconstruction
segments, response-choice alternatives and contextual rationales. Five/seven-minute
estimates are authoring estimates, not measured learner times. Assigned names and
origins are fictional exercise roles; no learner identity is inferred.

## Source and review boundaries

[Source register](../../../docs/research/khmer-course-sources.md) distinguishes
reference access, reuse rights and review. NIU provides lexical/grammar references;
MSU's textbook is CC BY-NC and is a reference, not a commercial course asset. FSI's
1966 phonemic request patterns are historical evidence, not modern script or
contemporary speaker approval. No publisher dialogue, explanatory prose, image,
recording or book scan is bundled. Ismi scenarios, script combinations, readable
help and explanations are AI-assisted original candidates.

**Every target phrase, source choice, address/context note, pronunciation-help
string, accepted choice/rationale and tile boundary needs fluent review.** In
particular, script compositions for name/origin/repair and modern equivalents of
historical repair patterns are not directly verified dictionary entries. The
readable help is versioned draft help v0, not IPA or authoritative romanization.
All packages truthfully carry an empty reviewer, pending linguistic/rights
status and explicit critical issues. No linguistic-review approval is fabricated.

## Optional script support

Each candidate has a skippable **Optional script practice** disclosure that reuses
its exact teaching-card strings. Help and meaning start collapsed inside it. It
records no score and does not gate the lesson. The manifest proposes eight
whole-expression reading targets; reviewer agreement is still required. These are
familiar-expression recognition candidates, not consonant/vowel instruction,
independent decoding, sound assessment or proof of literacy.

Khmer segmentation is authored, preserves source text exactly, and never inserts
spaces through whitespace tokenization. Arabic/French course rendering and existing
publications retain their established behavior. The existing course-scoped starting
check can use approved published lessons later; the published unreviewed previews remain excluded
from placement, while core study, downloads and separate Khmer progress are available.

## Build, import and review

`authoring.json` is the source of truth. Regenerate packages/readable reviews and
the pinned [review manifest](review-manifest.json) from the repository root:

```sh
node scripts/build-khmer-drafts.mjs
node scripts/build-khmer-drafts.mjs --check
```

The manifest separates reading inventory, exact recording scripts, speaking branch
briefs, deferred checkpoint situations and the remaining eleven unit targets.
It records pending gates, not approvals. No recording is requested from a speaker
until exact wording and playback/offline permissions are approved. No live speech
provider is selected, contacted or paid for.

Import privately using the existing maintenance command:

```sh
dotnet run --project i-api --no-launch-profile -- --import-curriculum "$PWD/content/khmer/meet-01"
```

Imports are transactional and idempotent. Pending review/rights are permitted for
structurally complete drafts. The command neither approves nor publishes, and
ordinary API startup does not import. See `local-import.json` for this checkout's
actual import evidence when present; a copied JSON file alone is not a DB import.

Run `npm run api` and `npm run web` in separate terminals. Sign in as the configured
approver, open Account → Curriculum, select a candidate and use **Preview saved
version**. The console shows the publication blockers while allowing private draft
preview. Ordinary approval/publication/rollback use the full release gate. The exact five
text-only previews have the separately authorized scoped path described below.
A loaded preview works without a network but is never stored as a downloadable
lesson or credited as learner progress; reconnect to open another saved draft.

## Remaining work

A fluent reviewer and exact source/help/inventory dispositions, human model
recordings, actual mobile/input/VoiceOver or TalkBack checks and immediate/delayed
learner evidence remain. The first-unit pilot protocol is in
[docs/khmer/README.md](../../../docs/khmer/README.md). Finalize the first unit before
units 2–12 authoring. Do not fill 55 remaining lessons with unchecked translations.
The exact five-preview publication/rollout is complete; full release and beta inclusion
remain separate owner decisions.

## Published text-only development preview

The owner explicitly authorized **“Publish these five as unreviewed text-only preview
lessons.”** Hosted records **24–28** are now **published v1** through the owner console,
with the new exact-package preview approval followed by publication. Application
`30ea724` is deployed to the existing web/API preview, Vercel Ready. Local draft
records 27–31 remain unchanged.

[publication.json](publication.json) records exact version strings, raw original file
hashes and real approval/publication audit timestamps. Authored fields and sources
match the originals; only the workflow version and generated notice differ. Review
and rights remain pending, the reviewer is empty and human audio remains missing.
The learner sees **Unreviewed · text-only preview**, including downloaded content.
All 13 Arabic publications, existing learner/source data and assets are preserved.
[Implementation, verification and recovery](../../../docs/khmer/text-preview-publication.md).
The earlier [hosted-import.json](hosted-import.json) is historical preparation evidence.
