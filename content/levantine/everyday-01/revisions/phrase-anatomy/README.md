# Phrase anatomy candidate

October 19, 2026 · F17.5 · **Unreviewed, unpublished draft**

`01-lesson.json` adds language support to the existing first-unit lesson-one recall
candidate. It preserves that base's dialogue, teaching cards, vocabulary, exercises,
answers and character mappings exactly. `review-manifest.json` pins both files.
Six phrases (cards 1, 2, 3, 4, 6 and 7), two patterns and three situational notes
use the existing authored chunks; nothing derives morphology from word positions.

Inherited source records retain their exact snapshot hashes, entry IDs, publisher
page references and consultation-only rights limits. The new original-authoring
record identifies the synthesis. This does not establish that the new glosses or
claims have been checked against those sources or accepted by a human. In particular,
review the present-description generalization, biddi/biddak + action explanation,
contextual check-in reading, and shwayy usage. No native-expert review is claimed.

Import this package into the curriculum console as a private draft, inspect **Phrase
anatomy review**, validate, and use **Preview saved version**. The empty reviewer and
pending disposition intentionally block approval/publication. The console's JSON
editor holds the metadata; accepting it still requires the ordinary owner approval
and publication actions. Import does not approve, publish or deploy anything.

**Before publication:** reconcile this candidate with the actual latest lesson-one
record. Its base predates the hosted S0 prompt recordings. Preserve those recordings,
provenance and any newer accepted lesson changes by rebasing only `languageSupport`
and its new original-authoring source onto a fresh draft of that record. Revalidate
all card/chunk/source links and review the resulting exact version. Do not publish
this historical-base package over the current lesson without that reconciliation.

Real screen-reader/device checks and exact content/source acceptance remain required.

## Owner-approved release

On October 19 the owner explicitly approved, committed/deployment-authorized and
publication-authorized this feature. The [release package](release/01-lesson.json)
is rebased onto freshly inspected hosted lesson-one v4, retaining all eight synthetic
prompt mappings and all existing lesson data. Only language support and its new
authoring source are added. [Approval and exact hash](release/approval.json) record
owner acceptance, not native-expert review. The original candidate above remains
an unreviewed historical draft so its tests and pinned base remain reproducible.
