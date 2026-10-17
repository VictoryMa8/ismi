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

Application **`30ea724f37395e543a960a3cb27fea2c0d753cdd`** is pushed/deployed to
both existing development targets. The API was installed first; exact-revision
health, assembly, SQLite integrity, recordings and cookie keys pass. Vercel deployment
**`dpl_7Yntnfd4MAVkkNJxHxsfK5mL897a`** is Ready, serving
[the existing alias](https://ismi-arabic.vercel.app) from
[the immutable deployment](https://ismi-cvcgtbfp7-victorys-projects-c1cb4594.vercel.app).
The notice-aware frontend was Ready before publication. The cached PWA was refreshed
before using its new console action.

All five hosted records **24–28** are now **published v1**, public version strings
`curriculum-khmer-meet-01-01-v1` through `curriculum-khmer-meet-01-05-v1`.
Each passed **Approve text-only preview**, then **Publish**, through the signed-in
owner console. [Exact packages, versions and audit timestamps](../../content/khmer/meet-01/publication.json)
record actual owner approval/publication without exposing the actor identity.
The audit is October 17 UTC, still October 16 America/Chicago.

Read-only hosted verification confirms all authored payload fields and source records
match the pinned originals, except workflow version and the added notice. Pending
review/rights, empty reviewer and unresolved issue lists remain intact. There are
**18** published lessons: the prior **13 Arabic** payloads compare exactly, plus
these five. Only CurriculumVersions and CurriculumAuditEvents changed; all **13**
other table hashes, including accounts/progress and sources, are unchanged. Recordings
and cookie keys are identical; SQLite integrity is `ok`.

Live learner verification after refresh: Khmer is available in the labeled selector;
Courses displays all five with the global and per-lesson notice; Greet someone opens
with its persistent notice and actual Khmer dialogue. Arabic view is restored with
its existing 3/13 completions and resumable lesson. No live lesson was completed,
no study goal or primary allocation was changed. Download/offline completion/reconnect
and withdrawal/rollback were verified in the disposable automated database, not by
altering the owner's live progress or withdrawing these live lessons.

API rollback retains the previous application and SQLite backup at
`/home/ismi/ismi/deployments/20261017-004736-30ea724f3739`. For content recovery, use
owner withdrawal/rollback controls; do not replace the whole database over newer
learner progress. A future host that disables the explicit preview flag excludes
these lessons from public serving. Restoring a pre-notice frontend while leaving
these preview publications exposed would lose the required learner labels; withdraw
the previews first if rolling back the notice-aware application.

Private aggregate snapshots: `/private/tmp/ismi-khmer-preview-predeploy.json`,
`ismi-khmer-preview-postdeploy.json` (identical) and `ismi-khmer-preview-published.json`.
No secrets or learner rows are included in the committed evidence. Documentation-only
follow-up commits do not require another API deployment; runtime revision stays `30ea724`.
