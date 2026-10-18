# Meet someone — private French drafts

Five original AI-assisted F25 text candidates, October 18, 2026. **Unreviewed and
unpublished**; no model audio, designated reviewer or rights acceptance.

| Lesson | Review sheet |
| --- | --- |
| Greet someone and say goodbye | [01](01-review.md) |
| Exchange names with a friend | [02](02-review.md) |
| Meet someone politely | [03](03-review.md) |
| Ask for help understanding | [04](04-review.md) |
| Keep a new exchange going | [05](05-review.md) |

[authoring.json](authoring.json) owns exact phrases, scenarios, explanations,
segments and contextual choices. Generate/check all packages, review sheets and
[manifest hashes](review-manifest.json) from the repository root:

```sh
node scripts/build-french-drafts.mjs
node scripts/build-french-drafts.mjs --check
```

Import privately with the existing maintenance command:

```sh
dotnet run --project i-api --no-launch-profile -- --import-curriculum "$PWD/content/french/meet-01"
```

Import is transactional and repeatable; it never approves or publishes. Sign in
as the configured approver, then Account → Curriculum → select a draft → Preview
saved version. Pending review/rights remain visible. A loaded preview can finish
offline without learning credit or a downloadable package. The general learner
catalog continues to show only published content.

Optional spelling help uses exact phrases and meanings without invented phonetic
transcription. Familiar and polite address are assigned by scene. Alex and Camille
are fictional roles; the recurring characters serve as guides. All text, register,
answers, rationale, segmentation and sources require fluent review. Text choice and
reconstruction are not listening or spontaneous speaking assessments.

The [course implementation/source register](../../../docs/french/README.md) records
owner decisions, source limitations, recording/starting-check briefs and the pilot
protocol. Units 2–12 follow first-unit review and pilot; no bulk unreviewed course
is represented as finished. [ROADMAP.md](../../../ROADMAP.md#f25-french-course)
owns current status. The owner subsequently authorized the exact five as unreviewed text-only previews; [exception and release evidence](../../../docs/french/text-preview-publication.md) records that separate action. The authoring manifest remains the original private-draft snapshot.

## Exact development-preview publication

The five exact original packages are published v1 on the existing development
preview, hosted records 30–34. They remain **unreviewed, text-only** with pending
rights and no human audio. [Publication pins and audit](publication.json) and
[rollout/recovery](../../../docs/releases/2026-10-18-french-preview.md) describe the
separate owner-authorized exception. Local records 32–36 remain private drafts;
hosted/local IDs are separate namespaces.
