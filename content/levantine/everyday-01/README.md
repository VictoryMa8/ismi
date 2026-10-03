# Everyday conversations with someone you love

October 2 update: repository packages now use Fattoush and Knafeh at the owner’s
request, including the standalone Arabic character-name prompt. Historical
publication statements below refer to predecessor database snapshots. Manifests
preserve predecessor hashes and pin the renamed files; no database import,
reapproval or publication was performed.


The seven original Palestinian Levantine v1 packages were published locally and
to https://ismi-ruby.vercel.app. The local store has since advanced lessons 1 and
2 to v2; the latest seven guided teaching drafts are described below. Live state
was not rechecked or changed during this continuation. Live publication
and all seven API payloads were verified on September 27, 2026 UTC. On September 26, 2026 UTC, the owner explicitly authorized
approval and publication; Codex executed the existing validation, approval, and
publication service and recorded that authorization in the audit. Production deployment followed the owner’s explicit authorization. Publication
does not establish native-expert review. The source foundation was approved by the owner in this
task on September 22, 2026 (“i apporve”). That approval covers the curriculum
foundation and source set, **not the finished content or publication**. The later explicit authorization
approves the exact seven finished v1 packages identified by the manifest.

## Review the actual lessons

Each lesson has six dialogue turns, four expressions from its dialogue, a
teaching note, eight contextual choice interactions, and a two-part closing
exchange. Every choice has its own rationale. Arabic, transliteration, and
English are present throughout; English help is optional and starts hidden in
lesson 7. Guided selection is not a claim of spontaneous speaking ability.

| Order | Exact lesson ID | Content review | Estimate | Local draft record |
| --- | --- | --- | --- | --- |
| 1 | levantine-everyday-01-01 | [How was your day?](01-review.md) | 7 min | 7, v1 |
| 2 | levantine-everyday-01-02 | [What did you do today?](02-review.md) | 6 min | 8, v1 |
| 3 | levantine-everyday-01-03 | [Want tea or coffee?](03-review.md) | 6 min | 9, v1 |
| 4 | levantine-everyday-01-04 | [Let's eat together](04-review.md) | 7 min | 10, v1 |
| 5 | levantine-everyday-01-05 | [How's your family?](05-review.md) | 7 min | 11, v1 |
| 6 | levantine-everyday-01-06 | [What are we doing tomorrow?](06-review.md) | 7 min | 12, v1 |
| 7 | levantine-everyday-01-07 | [Put it together](07-review.md) | 7 min | 13, v1 |

The `*-lesson.json` files are the importable source of truth. `*-review.md`
contains the same learner language, questions, choices and rationales in readable
form. Local record IDs apply to `i-api/App_Data/ismi.db`; a fresh database may
assign different IDs. `review-manifest.json` identifies the exact delivered files.

## Import, preview, approve, publish

The instructions below apply to fresh databases or future revisions. Local records
7–13 are already published; do not attempt to approve those versions again.

From the repository root, import into the configured local SQLite store:

```bash
dotnet run --project i-api --no-launch-profile -- \
  --import-curriculum "$PWD/content/levantine/everyday-01"
```

This explicit maintenance command uses `CurriculumPublishingService`. It
validates the entire batch, imports drafts transactionally, records audit events,
and exits. Reimporting identical packages is a no-op. It never approves or
publishes. Ordinary server startup does not import these packages.

To explicitly update a changed draft previously created by this importer, add
`--update-import-drafts true`. Changes to other existing drafts remain conflicts.
Approved or published snapshots are never edited. If a changed package has an
approved/published predecessor and no draft, import creates a new draft version.

Start the app using the root README, setting the approver to your account email:

```bash
Curriculum__ApproverEmail=you@example.com dotnet run --project i-api --urls http://127.0.0.1:5062
# In another terminal:
cd i-web
npm run dev -- --host 127.0.0.1
```

Sign in with that account, open **Curriculum**, and select a lesson's **draft v1**.
Use **Validate** and **Preview saved version**. The learner screen shows the
complete dialogue, teaching notes, choices, feedback, retries, and completion.
Preview reads the persisted version, does not cache drafts, and does not save
learner progress. Save JSON editor changes before previewing.

The console can also import individual `*-lesson.json` files. Do not reimport an
already existing draft through that button: select and edit it instead.

Only after reviewing the actual wording, answers, notes and sources should the
owner select **Approve**, then **Publish**, in lesson order. No source approval
or test result substitutes for that decision. Publishing one lesson does not
publish the rest. Learners receive only published versions. Existing
`levantine-day-*` demonstration lessons, their versions and progress are preserved
in their own unit.

## Sources and review boundaries

[Source inventory](source-inventory.json) records approved references, exact URLs,
retrieval details, rights boundaries, and the Maknuune snapshot hash. Individual
packages include entry IDs or publisher table/page locators and an original
composition record. No publisher dialogue, exercise, table, or audio is copied.

Maknuune v1.0.1 covers multiple Palestinian varieties; Lingualism's verb sample
uses a Gaza model. This unit deliberately chooses urban forms, including
`ʾahwe`, and identifies the addressee in the dialogue and practice context. It
does not treat Gaza/Jordanian alternatives as inherently incorrect Arabic.
No Jordanian alternative is taught in this unit. Long vowels use ā/ī/ū and ē/ō;
ʿ, ḥ, ʾ, sh, kh, gh distinguish the specified consonants. The README/source notes
must not be presented as native-expert review.

Specific owner review points are documented in [the walkthrough/review report](walkthrough.md):
urban pronunciation and feminine endings; the short polite-request and suggestion
chunks; naturalness of the original dialogues; and whether the practice fits
false beginners. There are no known structural validation failures. Owner publication authorization is recorded; independent language review,
a timed learner pilot, and real assistive-technology review remain outstanding.

## Recording scripts and offline use

Every readable review contains the exact dialogue recording script. Speaker and
address notes are in `introduction.recordingNote`; the same package also provides
all prompt and answer transcripts for later individual clips. `audioUrl` is null
throughout. No reviewed audio, native-speaker review, or pronunciation assessment
is claimed. Optional device speech remains visibly labeled as a browser preview.

The next three published lessons download automatically. Opening any other
published lesson online caches it too. Cached dialogues, notes, choices and
rationales work offline. Completion events queue for reconnection. Reopening a
completed lesson enters practice and adds no duplicate completion credit. Each
completed published unit has a review action. While only part of a unit is
published, completion refers to the currently available lessons.

## Delivery counts

- Original lesson packages: **7**, with **42 dialogue turns** and **56 interactions**.
- Published unit lessons locally: **7** (lessons 1–2 v2; lessons 3–7 v1). Last documented live baseline: **7 v1**; live state was not rechecked in this continuation.
- Awaiting owner content/publication approval: **7 guided teaching drafts**; see the revision table.
- New approved/published lessons: **7 / 7**.
- Reviewed recording assets: **0**.
- Existing demonstration publications retained: **6**.

Run checks with `dotnet test Ismi.slnx` and `npm run test:e2e` inside `i-web`.
The latter includes the production frontend build. Browser tests publish copies
only in a disposable test database; they do not approve the owner's real drafts.
See the walkthrough report for the final results and limits of those checks.

## September 30 lesson experience and correction drafts

The learner renderer now teaches phrases individually, offers recall before reveal,
and mixes contextual choices with bounded phrase reconstruction. English answers
start hidden; translation help remains available. The [four original check-in
revision packages](revisions/check-in-v2/README.md) remain preserved. At the start
of this continuation, local records 14–15 were published v2 and 16–17 were draft v2. The original seven v1
packages and publication manifest remain unchanged. The new guided teaching revisions remain unapproved and unpublished.
Added teaching interactions need fresh observed timing; older walkthrough estimates
are not evidence of the rebuilt flow’s duration.

## Guided teaching continuation

[Seven source-linked guided teaching drafts](revisions/guided-teaching/README.md)
now cover the entire unit with 43 explicit phrase cards, contextual recall cues,
concise explanations and per-card sources. They are imported locally as records
18–22 and updated importer-owned drafts 16–17. The prior packages and all published
snapshots remain preserved. No publication or deployment occurred in this work.
