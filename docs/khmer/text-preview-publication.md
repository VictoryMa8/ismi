# Five-lesson Khmer text-preview publication

October 16, 2026 · F26.2.1. The owner explicitly selected: **“Publish these five as
unreviewed text-only preview lessons.”** This supersedes the earlier fluent-review-
before-publication rule only for the exact five first-unit candidates, on the
existing free development preview. Full F26 and beta gates remain unchanged.

## Exact scope and truthful records

The five pinned source packages are `khmer-meet-01-01` through `-05`, hosted draft
records **24–28**, v1. [Original file hashes and hosted verification](../../content/khmer/meet-01/hosted-import.json).
No teaching text, answer rationale, segmentation, source note or review disposition
is changed for this release. Publication adds an explicit notice and ordinary
owner approval/publication audit records. The reviewer remains empty, review and
rights dispositions remain pending, critical issues remain listed and no linguistic
review source or audio is invented.

`KhmerTextPreviewPolicy` embeds the five original packages and pins their raw file
SHA-256 values. A canonical fingerprint also covers the full typed lesson and all
source records, excluding only the workflow version string and the generated
publication notice. Any changed content, additional lesson, other course, fixture,
audio or false review metadata fails the exception. Future package changes require
fresh owner authorization and deliberately updated pins.

The exception defaults **off**. The existing alwaysdata development-preview startup
script explicitly enables `Curriculum__AllowKhmerTextPreview=true`. A future beta
host must omit that flag. With the flag off, preview approval is rejected and these
preview publications are excluded from public catalog/dashboard/lesson feeds;
stored records remain available to the owner. Already downloaded offline content
cannot be revoked until reconnection, following the existing withdrawal rules.

The authenticated, CSRF-protected **Approve text-only preview** action validates
structure and the exact fingerprint, stores the fixed publication notice and records
`approved-text-preview` with the actual owner actor and fingerprint. The existing
Publish action revalidates before publication; withdrawal and exact rollback retain
the notice. The ordinary approval path still rejects pending-review candidates.

## Learner presentation

Landing Khmer availability, course selector, course path, main course pages and all
lesson/review stages show **“Unreviewed · text-only preview.”** The public package
contains the same notice, so downloaded lessons retain it. Details state that these
are AI-assisted drafts, Khmer/help/source rights remain unreviewed and human audio
is absent. Speech preview is disabled for these text-only lessons; interface chimes
remain governed by the existing mute switch. Preview lessons are excluded from the
starting-point assessment. No beta, fluency, literacy or expert-review claim is made.

## Verification before rollout

- API suite: **41 passed**, including owner/CSRF enforcement, all five actual
  package approvals/publications, preserved pending records, rejection of altered
  content/source/review/notice fields, disabled-host serving protection and
  withdrawal/rollback. Arabic payloads remain unchanged.
- Focused Chromium: **10 passed** across actual private drafts, multi-language
  compatibility and the new publication story. The publication test uses all five
  exact candidates in a disposable DB, publishes through the UI, checks public
  metadata/catalog/placement exclusion, downloads one, reloads/completes offline,
  reconnects, and verifies separate Khmer/Arabic progress and landing labels.
- Vue/TypeScript/Vite/PWA production build: **passed** (including the browser
  server build). Regeneration and diff checks pass.
- An initial rollback test mixed an import scope with separate HTTP command scopes;
  clearing that stale test tracker fixed the test without changing rollback logic.
  No full browser regression, human linguistic/AT or real Safari pass is claimed.

## Rollout

API/web rollout and publication are in progress. The application goes live before
publishing hosted versions, so learners receive the notice-aware UI. Publication
will use the owner console, retain exact versions and record post-rollout data,
asset and public-feed evidence here. A hosted data snapshot before rollout is
`/private/tmp/ismi-khmer-preview-predeploy.json`; it contains aggregate hashes only.
