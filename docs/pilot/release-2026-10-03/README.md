# First-unit release and rehearsal preparation — October 3, 2026

The owner authorized the five-step release → rehearsal → fixes → audio preparation
sequence and selected an adult false beginner on iPhone/Safari. This record tracks
what is executable now and what still needs human evidence.

## Release candidate

Review the [seven exact packages and changes](../../../content/levantine/everyday-01/revisions/pilot-release/README.md)
and [hash manifest](../../../content/levantine/everyday-01/revisions/pilot-release/review-manifest.json).
The existing `ismi-cast-v1` art is retained in the candidate. No Arabic, translation,
accepted-answer or grading-rationale changes were introduced relative to the
character packages. Two contextual role inconsistencies were corrected:

- `e04-07`: the existing prompt addresses Knafeh; instruction/response now agree.
- `e05-01`: Fattoush says the existing masculine “And you?” cue and continues into
  her question to Knafeh, instead of displaying a reversed prompt speaker.

The check-in review case now points to this candidate; its casual-greeting intent
was already owner-confirmed. Owner publication approval is now complete; this does not supply native linguistic review. The pilot script's
immediate and delayed tasks now assess this same exchange.

## Named targets and preservation

- **Local:** `i-api/App_Data/ismi.db`. Online SQLite backup at the ignored,
  owner-only `i-api/App_Data/ismi-before-pilot-2026-10-03.db`; integrity check passed.
  Ran the existing importer against all seven candidates with explicit
  importer-owned-draft updates. All packages passed deterministic validation.
- **Preserved:** accounts, progress and completions compared unchanged; all 17
  prior non-draft version rows and 116 prior audit rows compared unchanged.
  Only lesson 4/5 drafts changed (new audit events 117–120: update + validation).
- **Compatibility:** local lesson 1 v4 was already published before this task,
  with the previous character names in immutable storage. The API's existing
  name adapter makes it equivalent to the renamed candidate; the importer correctly
  reports it unchanged. The other unchanged drafts likewise use the existing adapter.
  This is not a new approval/publication by this task.
- **Host:** all seven Everyday lessons were originally v1. The exact approved packages
  were imported through the hosted console and passed validation → approval → publication.
  All seven now serve v2. Previous v1 records remain superseded; the console offers
  “Restore this version” (observed on lesson 1 v1; not executed). No full fresh hosted
  database backup was obtained. No local accounts/progress were copied to the host,
  and the owner's learner progress was not exercised. No code redeployment occurred.

| Lesson suffix | Local record | Version | State after preparation |
| --- | --- | --- | --- |
| 01 | 23 | 4 | published |
| 02 | 19 | 3 | draft |
| 03 | 20 | 2 | draft |
| 04 | 21 | 2 | draft |
| 05 | 22 | 2 | draft |
| 06 | 16 | 2 | draft |
| 07 | 17 | 2 | draft |

## Verification

Story: candidate packages → validated console drafts → disposable test publication
→ guided lessons/feedback → offline completion → reconnect/review.

- `dotnet test Ismi.slnx --no-restore`: **24 passed**. Existing NU1900 vulnerability
  metadata warning remains; this run did not obtain current NuGet advisory data.
- Candidate/predecessor SHA-256 checks: **7/7 passed**. Recording transcripts and
  step IDs: **8/8 exactly match** the pinned lesson-1 package.
- Production frontend build: passed as part of browser-server setup.
- Existing Chromium course-loop and seven-lesson tests against these candidates:
  **3 passed**. Includes all seven owner previews, isolated test publication, offline
  reload and completion, mistake retry, keyboard access, phrase reconstruction,
  unit checkpoint, reconnection and no duplicate completion credit.
- Initial WebKit reuse of those keyboard/offline tests: **3 failed**, retained as
  a diagnostic result, not an accessibility or Safari pass. WebKit offline reload
  emitted an internal error; Tab-based focus assertions also failed in iPhone
  emulation. No app accessibility fix is inferred from that keyboard configuration.
- The offline failure matches an [upstream Playwright report](https://github.com/microsoft/playwright/issues/42775)
  where a literal service-worker response fails under offline emulation. This is
  evidence of a possible tooling limitation, not proof that Ismi works offline on
  Safari. Real-device offline/reconnection remains a release gate.
- Dedicated WebKit online touch walkthrough: **1 passed**, completing all seven
  candidates, wrong-answer feedback/retry in every lesson, the two corrected roles,
  unit completion and progress after reload, with no page errors. Configuration:
  `i-web/playwright.pilot.config.ts`, iPhone 13 emulation on bundled WebKit 26.5.
  [Dialogue screenshot](iphone-webkit-dialogue.png) reviewed for the visible mobile
  layout after stabilizing screenshot animation. The first capture was mid-fade;
  the stable capture shows the opaque fixed lesson frame. This is online touch evidence only; no VoiceOver/real-iPhone claim is made.
- Agent-browser rendering check: welcome and learner dashboard rendered, course
  navigation and next-lesson controls appeared, and browser error output was empty.
  The disposable verification browser was closed afterward.

Tests publish only copies in disposable databases, never the local owner database
or host. Automated walkthrough durations are not learner lesson timings.

## Rehearsal and audio handoff

Use the [aligned session script](../session-script.md), [iPhone preflight](../preflight.md)
and [private observation template](../observation-sheet.md). Session 1 covers lessons
1–3; session 2 covers delayed recall and lessons 4–7. The owner arranges dates and
participant agreement. There are **zero observed learner sessions** and **no real
VoiceOver/iPhone preflight results**. Evidence-led fixes after the sessions remain open.

The [first recording batch](recording-batch-01.md) supplies eight exact step clips,
context, technical format and blank provenance/review fields. Planned attachment
coverage is 8/56 practice prompts (14.3%); actual reviewed coverage is **0/56**.
No speakers contacted, permissions obtained, money committed or audio collected.

## Owner approval and publication

The owner approved the exact seven packages and existing art on October 3 (“I approve”).
The in-app console completed the authorized release after native Safari upload was
unavailable. Every package passed deterministic validation, approval and publication.

- **Published IDs:** `levantine-everyday-01-01` through `levantine-everyday-01-07`.
- **Public versions:** `curriculum-levantine-everyday-01-01-v2` through
  `curriculum-levantine-everyday-01-07-v2`.
- **Target:** `https://ismi.alwaysdata.net`, consumed by `https://ismi-arabic.vercel.app`.
  Existing code release `26f8242` remains deployed; this was a curriculum-only release.
- **Comparison:** 7/7 public lesson payloads and 52/52 source records match the approved
  packages. Only server version strings, omitted/null serialization and the documented
  `englishHelpInitiallyHidden=false` model default were normalized. Package hashes
  remain unchanged. [Payload hashes and comparison evidence](hosted-publication.json).
- **Audit:** all seven console histories show created → validated → approved → published.
  [Captured audit evidence](hosted-audit.json) substitutes “owner-approver” for the account
  identifier. Times in that capture are displayed by the browser, not a Chicago conversion.
- **Preservation/rollback:** all seven v1 records remain superseded. The normal console
  restore control is available; rollback was inspected, not executed. No fresh full
  hosted database backup was obtained. This is not a full hosted database integrity audit.
- **Visual check:** the published first lesson rendered the guided introduction and
  current Fattoush/Knafeh art in [owner preview](hosted-lesson-preview.jpg), without
  saving learner progress. Real iPhone/VoiceOver checks remain unperformed.

Source notes describing earlier draft status are preserved as authored historical
provenance; the console audit records the subsequent owner approval/publication.
Local documentation/test changes remain uncommitted; published curriculum is live.

## Remaining gates

1. On the intended iPhone, confirm all seven v2 versions and complete real touch,
   VoiceOver, text-size and offline/reconnection preflight before learner sessions.
2. Run the two owner-observed sessions, synthesize the top findings, fix/retest, and
   decide the next small pilot. No participant responses or success rates are invented.
3. Supply real clips, permissions and review for the prepared batch; attach them to
   new draft versions, validate and publish after owner approval, then test playback
   and offline downloads on the actual device.

F08 is complete. F09, F18.1 and full beta readiness remain incomplete while these gates are open.
