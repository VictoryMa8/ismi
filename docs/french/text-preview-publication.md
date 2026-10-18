# French first-unit text-preview exception

October 18, 2026 · F25.2.1. After being told fluent review, source-rights acceptance
and human audio were absent, the owner explicitly selected **“Publish these five as
unreviewed text-only previews.”** This supersedes fluent-review-before-publication
only for the five original `french-meet-01-01` through `-05` packages on the existing
free development preview. Full French review, audio, pilot and beta gates remain.

`FrenchTextPreviewPolicy` embeds the five originals and pins their raw SHA-256 values
from the [authoring manifest](../../content/french/meet-01/review-manifest.json).
A typed fingerprint covers every lesson field and source record except the workflow
version and generated publication notice. Changed wording, answers, segments, source
notes, review dispositions, audio, fixtures, extra lessons and other courses cannot
use the exception. No original package is edited for this release.

The independent `Curriculum:AllowFrenchTextPreview` flag defaults off and is enabled
only in the existing development startup script. `CourseTextPreviewPolicy` dispatches
to independent French/Khmer policies; approval and public serving check the exact
package fingerprint. A future beta host must omit both preview flags. Disabling a
flag excludes its lessons from public feeds and direct package requests without
removing owner records. Previously downloaded text is removed only after reconnection.

The existing owner-only CSRF-protected **Approve text-only preview** action adds the
fixed **Unreviewed · text-only preview** notice and records the actual actor, release
ID and package fingerprint in `approved-text-preview`. Publish revalidates the exact
candidate. Normal approval still rejects pending linguistic/rights records. Reviewer
stays empty; critical issues and lack of human recordings remain explicit. Withdrawal
and exact rollback retain the notice. No linguistic acceptance is fabricated.

Existing learner presentation carries the notice on course discovery, lesson stages,
review and downloaded content. Device speech is disabled for these text-only lessons;
interface chimes keep the normal mute setting. Starting-check samples exclude the
preview lessons. No assessed pronunciation, fluency, A1 attainment or beta readiness
is claimed.

Pre-rollout checks: **57/57 API tests passed**, including independent flags, exact pins,
owner/CSRF checks, changed-package rejection, preserved pending records and public
serving/withdrawal/rollback. Three focused browser stories cover private French drafts
and actual French/Khmer publication, notice persistence, download/offline reload,
completion/reconnection and separate Arabic progress. Production build and five
deployment-tool fixture tests pass. Real AT/device/Safari and fluent review remain
missing. Rollout/version/publication evidence is recorded in the
[release record](../releases/2026-10-18-french-preview.md).
