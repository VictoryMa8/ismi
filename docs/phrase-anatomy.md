# F17.5 phrase anatomy and grammar reference

Owner authorized implementation October 19, 2026. Application candidate: **0.0.5**.
The owner subsequently explicitly approved and authorized commit, deployment and publication on October 19. This records owner acceptance, not native-expert review.

## Implementation

Optional `LessonResponse.languageSupport` travels inside the immutable curriculum
package. It contains a human review disposition/credit, phrase literal guides tied to
teaching-card indexes, text function labels tied to existing chunk indexes, local
reference IDs, example-card indexes, situational usage notes and provenance locators.
Natural meanings, examples and chunks are read directly from teaching cards. No new
glossary or runtime AI-generated morphology exists. IDs are local to a lesson version;
references from different versions/courses are never silently merged.

The API validates shape/nulls, bounded counts, unique IDs/indexes, exact existing
card/chunk links, reference-to-example consistency and supplied source records.
Drafts can remain pending; publication validation requires accepted language support
with a named human credit, followed by the normal owner approval/publication gate.
Null support is omitted during serialization, preserving prior preview package hashes.
The console shows a phrase review panel and previews the same components as learners.

Teaching cards expose **How this phrase works**. Grammar buttons open a local view;
**Back to phrase** restores the triggering button without changing lesson stage,
responses or teaching index. The main lesson and scheduled-review feedback show
support only for exact taught prompt/model phrases. Applicable Words contexts use
the same component and metadata.

**Practice → Grammar reference** searches English topics, authored Arabic/Arabizi
and example text, with useful empty states and teaching-context buttons. Closing a
lesson preserves the reference search. Course and identity changes discard the view's
records/query; records come only from that course's available learner lesson list.
Core explanations require neither login nor payment.

References use the existing complete-package IndexedDB cache and PWA assets. A
refresh replaces records with the current lesson version; 403/404/410 removes a
withdrawn package rather than falling back. Offline/transient failures show saved
versions with a reconnection notice. Failed storage/audio downloads are reported;
no partial lesson is advertised as downloaded. An offline device cannot discover a
withdrawal until reconnection; the saved-version notice states that limit.

## Content candidate and remaining acceptance

The [six-phrase draft](../content/levantine/everyday-01/revisions/phrase-anatomy/README.md)
contains two reference entries and three usage notes with exact inherited source
records and a new original-authoring record. It is not approved or published. Its
review manifest pins candidate and base hashes. Reconcile it onto the latest target
lesson version before publication so hosted audio and newer changes are preserved.

Completion retains the original F17.5 contract: exact human acceptance of literal
guides/usage/source claims, approved/published records and actual keyboard,
screen-reader, enlarged-Arabic and mixed-direction checks. Automated browser evidence
does not substitute for physical-device or screen-reader acceptance. No new content
exception, review waiver, beta inclusion or deployment authority is inferred.

## Verification

October 19, 2026, local candidate only:

- `npm run build --prefix i-web` passes TypeScript/Vue and Vite/PWA production
  compilation. Package/lock metadata is 0.0.5; the browser checks verify **Beta 0.0.5**
  on the About page using the package version as their expected value.
- `dotnet test i-tests/Ismi.Api.Tests.csproj --no-restore -m:1
  -p:UseSharedCompilation=false`: **64 passed**. New coverage checks malformed/null
  metadata, wrong contexts/chunks/sources, private idempotent import, blocked pending
  approval, immutable accepted publication and rollback in a disposable test database.
  Test-only acceptance never changes the draft files or real review records. Existing
  exact-preview policy/hash tests remain passing.
- Selected Playwright files: `grammar.spec.ts`, `glossary.spec.ts`,
  `lesson-teaching.spec.ts`, `lesson-layout.spec.ts`, `navigation.spec.ts` and
  `feature-hubs.spec.ts`: **all 25 selected checks verified across runs**. The initial
  combined run passed 23/25; the grammar version assertion was corrected to inspect
  the About page, and the existing glossary sign-out test now waits for the final
  Today redirect before navigating to Words. All six targeted checks passed on the
  final rerun, including the other 19 passing checks from the combined run.
- Five new grammar checks cover pinned candidate/base hashes and unchanged existing
  lesson text; English/Arabic/Arabizi search and empty results; keyboard selection,
  reference/back focus and teaching position; enlarged Arabic with RTL/LTR and no
  dialog overflow; retained search after lesson closure; offline reload and revised/
  withdrawn package handling; Words/feedback reuse; and private console preview,
  including incomplete unsaved JSON. A generated enlarged-Arabic screenshot was
  visually inspected. Existing layout checks cover 390/1024/1440px; navigation/hubs
  cover 320/390/768/1280px as applicable. These are Chromium automation results.
- `python3 scripts/check-roadmap.py`: 90 feature records and 433 links/anchors pass;
  `git diff --check` passes.

The test runner required localhost socket access outside the filesystem sandbox.
No real screen reader, physical device, Safari offline acceptance, hosted rollout,
content publication or human linguistic/source acceptance was performed at this
initial implementation checkpoint. The subsequent owner-authorized rollout is
recorded below and in the linked release note.


## Authorized release preparation

The owner’s follow-up “approve commit deploy and publish for me” authorizes this
exact prepared scope. A fresh hosted read found lesson-one record 29/v4, with eight
synthetic prompt mappings. All six selected teaching cards match the original
candidate after omitting serializer-default nulls. The release package retains the
entire current hosted lesson and its source records, adding only `languageSupport`
and the new original-authoring source. Owner acceptance and package hash are in
[release/approval.json](../content/levantine/everyday-01/revisions/phrase-anatomy/release/approval.json).
No new expert-review claim, rights grant, audio change or beta inclusion follows.

A consistent hosted SQLite backup and private table/recording/key baselines are
retained under `/home/ismi/ismi/deployments/20261019-f175`. The administrative runner
uses normal curriculum services for validation, approval and publication; it does
not edit curriculum rows directly or create/impersonate an account. Deployment and
publication results are recorded in the release note after verification.


The [verified rollout](releases/2026-10-19-phrase-anatomy.md) subsequently deployed
Beta 0.0.5 and published owner-accepted lesson-one record 35/v5, preserving all
existing audio and unrelated data. Actual screen-reader/device acceptance remains
open under the original contract; owner approval does not claim expert review.
