# October 18 French application and text-preview release

Owner authorization: **“publish and deploy”**, followed by the explicit selection
**“Publish these five as unreviewed text-only previews”** after the missing review,
source-rights acceptance and human audio were explained. Existing Vercel/alwaysdata
free development hosts only; no broader course, beta, contact or provider spending.

The candidate includes the five original private F25 packages, spelling-help label
refinement, independent default-off hash-pinned French preview policy, existing
owner console action and publication tests. Original package text and review/source
records remain unchanged. [Policy](../french/text-preview-publication.md).

Preflight: 57 API tests, production frontend build, private-French/French-publication/
Khmer-publication browser stories and five deployment fixture tests. Existing
alwaysdata site 1076252 and SSH authentication pass. A consistent hosted SQLite
backup at `/home/ismi/ismi/deployments/f25-20261018-before-publication` and aggregate
snapshot cover all 16 tables, 18 prior publications, recordings and cookie keys;
no pre-existing French records. SQLite integrity is `ok`.

Application **`08fed7525991fdc8202242cf01dbb12eba504bd6`** is committed and pushed
to `main`, deployed to both existing development targets. Vercel reports **Ready**
for [the immutable deployment](https://ismi-gklb53vxa-victorys-projects-c1cb4594.vercel.app),
serving [the existing alias](https://ismi-arabic.vercel.app). Exact-revision API
health, assembly, SQLite integrity, recordings and cookie-key checks pass. Retained
application/database rollback:
`/home/ismi/ismi/deployments/20261018-195150-08fed7525991`.

Hosted import used the installed `/usr/alwaysdata/dotnet/10/dotnet`: SSH’s default
`dotnet` selects .NET 8 and the initial command failed before import. No runtime
installation or hosting change was needed. The successful command imported the
five originals as v1 draft records **30–34**, matching all authored fields and sources.
[Hosted draft evidence](../../content/french/meet-01/hosted-import.json).

All five records are now **published v1** through the signed-in owner console:
**Approve text-only preview**, then **Publish**, with real approval/publication
timestamps and `approved-text-preview` audit fingerprints.
[Publication evidence](../../content/french/meet-01/publication.json) preserves exact
package hashes, record/version identifiers and audit details without actor identity.
Version strings are `curriculum-french-meet-01-01-v1` through `-05-v1`.
Reviewer remains empty, review/rights remain pending, critical issues remain listed
and no human audio or linguistic-review source was invented.

Post-publication read-only comparison against the consistent pre-release backup
confirms **all pre-existing rows preserved**, all **18 prior lesson publications**
unchanged, all **13 non-curriculum table hashes** unchanged, recordings/cookie keys
identical and SQLite integrity `ok`. Only five curriculum versions, their original
source records and workflow audit events were added. There are now 23 published
lessons. Existing alphabet previews and cultural/account/progress tables are intact.

Live learner checks after the cached PWA refresh show French in the course selector
as **Unreviewed preview**, all five course cards with **Unreviewed · text-only preview**,
and the explicit missing-review/rights/audio notice. The first lesson opens with
its actual dialogue and persistent notice. No live lesson was completed or study
settings changed. Download/offline completion/reconnection and withdrawal/rollback
were exercised only in the disposable automated database.
[Live course capture](../french/previews/published-course.png).

Content recovery uses owner withdrawal/rollback controls for the exact French
records; do not restore an old whole database over newer learner progress. Disabling
only the French preview flag hides these publications while preserving the separate
Khmer exception. Before rolling back a notice-aware frontend, withdraw the French
previews if the older client cannot display their labels.

Documentation-only follow-up commits may advance the frontend build; the verified
runtime API/application source remains `08fed75`. Full F25 completion, review/source
acceptance, recordings, starting-check calibration, real device/AT/Safari evidence,
pilot and remaining 55 lessons remain open.
