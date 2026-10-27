# F23 recurring mini-stories

Implementation evidence, October 18, 2026. Current state and authorization remain in
[ROADMAP.md](../ROADMAP.md#f23-recurring-mini-stories).

## Contract and first episode

The owner requested “Implement F23” October 18. The original contract sequenced a
three-episode text arc through first-episode review before later authoring. On
October 27 the owner explicitly selected preparing episodes two and three as
unpublished drafts, superseding that authoring sequence only. Exact review/rights,
publication and all release gates remain. The original October 18 implementation
provided shared machinery and the first candidate; the new drafts are described
under [episodes two and three](#episodes-two-and-three).

[A little rest](../content/stories/after-a-long-day/01.pack.json) recontextualizes
six unchanged taught dialogue lines from `levantine-everyday-01-01`, exact local
publication `curriculum-levantine-everyday-01-01-v4`, into three scenes. The local
SQLite publication was inspected read-only. Historical Lina/Omar identities use
the existing Fattoush/Knafeh presentation migration, matching the curriculum API.
No source text, meaning, help or roles were rewritten. Existing lesson audio is
not carried into this text-only episode. This is a local source check, not a new
hosted audit or a claim that the story has been reviewed.

Problem/resolution: both want to catch up but discover they are tired; Fattoush
offers a pause and Knafeh accepts. Two event/intent comprehension checks precede
one contextual response with choices. Each check pins a source index and taught
step target; response choices preserve exact taught Arabic, Arabizi and meaning.
All choices have rationales. The English scene framing/checks and their connection
to the taught scene remain new draft content requiring exact human acceptance.
The estimated 2–4 minutes is unmeasured and carries no timer. The
[exact review sheet](../content/stories/after-a-long-day/01-review.md) includes all
scene lines/checks/rationales and the candidate file SHA-256.

The linked arc now has three review candidates (October 27):

| Episode | Continuity and communicative target | Candidate taught source |
| --- | --- | --- |
| 1: A little rest | Discover shared tiredness and accept an offer to rest | Everyday lesson 1; original v4 preview retained, unpublished v5-source candidate prepared |
| 2: Tea after the pause | After resting, clarify a drink preference and politely decline sugar | Everyday lesson 3 v3; unpublished draft |
| 3: Catch up tomorrow | Close the catch-up by confirming tomorrow, six and Knafeh’s family | Everyday lesson 6 v3; unpublished draft |

The owner reviews reuse, framing, length and difficulty across the exact three
candidates before normal approval/publication. No listening edition or
learner-outcome evidence is claimed.

## Review route

Open Account → Curriculum console → Stories. Import the candidate JSON above to review it. New story draft supplies an empty
structural template; authored draft text is not bundled into the public frontend. Save privately, preview with the real reader,
and validate. Source version mismatches must be reconciled against the target
API's actual publication before approval, including after deployment. An exact
content change resets review through a new saved draft; approved/published
versions are immutable. The console supports version selection, validation,
approval, publication, withdrawal, rollback and actor/time/reason audit history.

Review all scene/role/meaning relationships, English check intent, plausible
alternatives, every answer rationale, taught target references, and exact rights
for reuse/adaptation/offline delivery. Record the actual reviewer, exact review
evidence and source/rights acceptance only after they occur. Those three fields
are deliberately empty in the candidate. Deterministic checks cannot accept them
on a reviewer's behalf. An owner approver must separately approve and publish the
saved exact version. The normal route requires review/rights acceptance. The later October 18 exact
unreviewed-preview exception is described below.

The app does not import, approve or publish stories on startup. Existing curriculum
and preview exceptions remain separate. The additive `StoryPacks` table has a
revision concurrency token and immutable approved version snapshots. HTTP mutations
require authentication, curriculum approver access and CSRF. Public responses omit
reviewer identities, private review/rights evidence and audits. Private preview
never persists learner progress or a download. There are no audio endpoints or
external provider dependencies.

## Source-update drafts

October 27, 2026 — F23.1.2, application **0.0.11**. The original first-story
package pins Everyday lesson-one v4. F17.5's recorded publication is v5, so the
original story fails the exact-current-source requirement on a target with that
publication. The source gate remains strict; no old publication or preview pin
was changed. This finding comes from repository code/release records, not a new
live-host inspection.

In Account → Curriculum console → Stories, select the latest saved story version
and use **Prepare source-update draft**. The protected POST action reads the
actual target's current regular published sources in the same course/unit,
checks existing Arabic/Arabizi/meaning, authored roles, response choices and
taught step IDs, and saves a private draft only if they all match. Missing,
withdrawn, preview, changed or mismatched sources require manual reconciliation.
An already-current source set produces an error without a write.

The action uses normal revision conflict/version rules. It never replaces an
approved/published historical version, carries forward no approval or original
text-preview exception, and clears reviewer, review evidence and rights evidence.
The console displays the changed pins and explicit fresh-review requirement.
Source-version changes alone cannot establish semantic or rights acceptance.
Approval, publication, source withdrawal handling and offline hash invalidation
continue through the existing machinery. No automatic startup import occurs.

The [prepared first-episode draft](../content/stories/after-a-long-day/revisions/current-source/01.pack.json)
changes only the source pin to `curriculum-levantine-everyday-01-01-v5`.
Its file SHA-256 is `0203e02652ff44170cd56b7690fe13769e3b9fb8ab177b092399f99d855d22d8`.
All six lines/roles, three checks and response text/help/meanings match the
recorded F17.5 release input, SHA-256
`1762dbf74a3dbbe52dc2924fda86197ad60075defceeee9652cea223d196f35b`;
its accompanying publication record establishes assigned v5 (the release input
itself still has v4 before the publisher assigns v5).
The [exact review sheet](../content/stories/after-a-long-day/revisions/current-source/01-review.md)
contains the complete unchanged scene/check/rationale candidate and remaining
acceptance items. It is unreviewed/unpublished and cannot inherit the original
October 18 preview exception. The original file hash remains unchanged.

Verification: the full **78/78 API suite** passes, including **17/17 story API
tests**. Ten distinct story browser checks pass
(nine existing checks in the first run; the new console workflow passes after
narrowing its status locator). The production Vue/TypeScript/PWA build passes and
the displayed label is Beta 0.0.11. API coverage includes owner/CSRF, stale
revisions, latest-version selection, immutable history, fresh review/publication
gates, and unchanged-story rejection for text/help/meaning/role/answer/target,
course/unit, preview and withdrawn-source mismatches. The real browser workflow
saves a stale-pin synthetic draft, prepares it through HTTP/SQLite, checks the
returned pins and cleared evidence, verifies review/publication remain blocked,
and rejects a repeated update without a write. Only disposable test databases
were changed. Original candidate SHA-256 and all package/lock versions were checked.

Real screen-reader, physical-device, Safari offline and learner evidence remain
F23.1 gates. The later October 27 owner reply permits unpublished episodes two/three
before first-episode review; it grants no review acceptance or publication. This
addition and the prepared candidate are local/uncommitted, not deployed/published.

## Episodes two and three

October 27, 2026 — the owner selected **Prepare episodes 2–3 as unpublished
drafts**. F23.2 and F23.3 retain the full episode contract: linked scenes,
two source-linked comprehension checks, one assisted response with individual
rationales, exact roles/targets, help/retry/resume, offline/version/identity and
accessibility requirements. The current deliverable is authored private review
candidates; the parent is not complete until exact review, target reconciliation,
publication and required real access evidence pass.

- [Tea after the pause](../content/stories/after-a-long-day/02.pack.json) / [full review sheet](../content/stories/after-a-long-day/02-review.md): six taught lines in three scenes continue the rest with different drink preferences and clarify that declining sugar does not decline the tea or shared break.
- [Catch up tomorrow](../content/stories/after-a-long-day/03.pack.json) / [full review sheet](../content/stories/after-a-long-day/03-review.md): six taught lines in three scenes resolve a vague plan by confirming tomorrow, six o’clock and Knafeh’s family, with tea afterwards.

The [draft manifest](../content/stories/after-a-long-day/draft-manifest.json)
records each exact package/source hash, episode/predecessor ID, and the first
episode’s separate current-source candidate. Scene Arabic, Arabizi, meanings and
speaker IDs are copied unchanged from the exact F22 source artifacts, not freshly
composed. Response choices likewise preserve taught text/help/meaning. Source
version pins come from the recorded [October 13 publication](releases/2026-10-13-recall.md)
and its audit; this is not a new hosted inspection. Missing/currently changed
sources must be reconciled on the actual target before acceptance/publication.

All English scene framing, check prompts, explanations and rationales are new
AI-assisted drafts. Reviewer/review/rights fields remain empty. No rights grant,
native-expert review, audio or independent production/speaking evidence is
inferred from source reuse. The original first-story exception remains limited
to its original package and cannot publish either draft. Normal startup imports
or publishes neither. Draft text is absent from the learner frontend; the later
explicit publication path embeds three exact API resources as described below.

Review using Account → Curriculum console → Stories → Import stories JSON;
select `02.pack.json` or `03.pack.json`, save privately, preview and validate.
The existing reader supports the complete scenes and checks without software
changes. This authoring-only follow-up leaves the application version at
**0.0.11**, with no new deployment or publication.

Validation on October 27:

- **19/19 story API tests pass**, including both real authored packages saved in
  disposable databases with the recorded v3 source snapshots. Exact text/role/
  response/target validation reports only the missing human/source-rights review
  gate. Approval, publication and the first-story exception reject both drafts;
  public endpoints return 404, and attempts do not change their saved revision.
- **2/2 new Chromium checks pass** through owner login → JSON import → private
  save → reader. All six scenes/twelve Arabic lines, both episodes’ six checks,
  wrong-answer retry, correct responses, stage focus and completion render. No
  learner progress/download is persisted; public access and publication stay
  unavailable. Tests modify only their disposable databases.
- The production Vue/TypeScript/PWA build passes as part of the browser setup.
  Source/package hashes and manifest predecessor pins were checked against the
  source artifacts and recorded publication audit. No original first-preview or
  curriculum package was edited.

Real device/AT/Safari/offline/learner observations remain release gates; private
previews establish neither a published offline edition nor human acceptance.

## October 27 requested publication and deployment

The owner subsequently requested “publish and deploy” after being told the exact
three candidates still lacked human/source-rights acceptance. Beta **0.0.12** adds
a separately pinned, disabled-by-default arc preview exception with the same
honest unreviewed/text-only notices and an explicit transactional operator
command. The original October 18 pin remains unchanged. No human review is
invented, and all normal F23 review/source/access/learner gates remain.

[Exact pins, command, checks, deployment/access state and preservation contract](releases/2026-10-27-story-arc.md).
Actual publication/deployment must be verified on the existing target; code or
the release manifest alone does not establish either.

## Learner and data behavior

Courses and Practice link to Mini-stories for Levantine. The catalog only shows
published episodes with current exact source versions. Other courses show an
honest empty state. Today, daily allocation, habits, XP, review scheduling and
can-do achievements receive no story credit; no accounting policy is assumed.
Stories remain freely available regardless of mistakes or retries.

The native modal reader supplies browser focus containment/Escape handling and uses the existing single `LessonScroll` region/cue, visible
header/footer, stable portraits, Arabic RTL, Arabizi LTR, English meanings on help,
explicit character names, keyboard radios and focus on each stage heading. No
animation, microphone, listening requirement or timer is added. Response choices
are assisted written practice, explicitly distinct from independent production,
speaking or proficiency evidence.

Downloads verify a canonical SHA-256 hash of the public payload and recheck the
live catalog before saving atomically to IndexedDB. Downloaded text/checks and
position work after offline reload with the PWA shell. Successful online catalog
refresh and the reconnect event remove withdrawn/revised downloads, close the
reader and refresh availability; source withdrawal/revision likewise hides the
story at the API. Offline devices cannot learn about withdrawals until reconnect.
HTTP availability failures show an error. A network transport failure falls back
to verified downloads with an explicit unavailable/unchecked-connection notice;
`navigator.onLine` alone is not trusted as proof of connectivity. Removal discards the download, not historical progress.

Progress keys include learner identity scope, episode ID and exact content hash.
Identity/course changes immediately close the reader and discard stale async
results. Help, first choice, first-choice assistance and attempt count are stored;
replay preserves first results. A revised hash starts fresh current practice while
retaining earlier records. Text is never typed/stored, and no voice data is taken.
History stays on this device and does not sync between devices. Storage failures
permit continued reading with an honest warning.

## Verification

Application version: **0.0.3**, one increment for this implementation. Package and
lockfile metadata align; the displayed label derives from Vite/version.ts.

- Production Vue/TypeScript/PWA build passes.
- API tests cover owner/CSRF privacy, exact source/text/help/meaning/target gates,
  missing human/rights acceptance, malformed content, revision conflicts,
  immutable publications, rollback, withdrawal and source withdrawal.
- Browser tests use a separate temporary API database and explicitly synthetic
  story/review records. They exercise the real HTTP/SQLite/public projection path,
  public hash verification, IndexedDB and reader rather than accepting real draft
  content as reviewed. No test publishes to the development preview or owner DB.
- Mobile/desktop fixed frame, keyboard/focus, help/retry/replay/no-core-credit,
  offline reload/resume, reconnect withdrawal and guest/account isolation are
  the bounded browser checks.

Final results: **62/62 API tests** (`dotnet test i-tests --no-restore`, including
five story integration tests), **8/8 story browser tests** and **11/11 affected
navigation/Practice/existing curriculum-preview browser checks**. The last story
run includes real candidate import/private preview and revised-publication
invalidation. The production build and roadmap checker pass (89 records, 426
roadmap links/anchors); package/lockfile/displayed version are 0.0.3. The exact
candidate's six lines/roles match the read-only local published v4. Draft text is
absent from the production frontend bundle.

| Boundary | Evidence |
| --- | --- |
| Owner UI → protected API → SQLite | Draft import/private preview and validation browser check; owner/CSRF/conflict API tests |
| SQLite → public projection → reader | Synthetic test publication renders through real HTTP and verifies canonical content hash |
| Reader → device state → offline reload | Real IndexedDB download/resume browser check |
| Source/publication changes → catalog → cached access | Source withdrawal API check; publication revision and reconnect withdrawal browser checks |
| Guest/account boundary | Separate progress snapshots verified across account creation/reload |
| Core lesson accounting | Story/replay leaves completed lesson list and daily minutes unchanged |

Actual screen-reader, physical-device, Safari offline and observed learner timing/
comprehension/return-interest checks are still required before the F23.1 release
contract can pass. Automated Chromium results do not supply those observations.
The initial implementation was local; see the later rollout record below.

## October 18 exact unreviewed-preview exception

After the initial implementation, the owner requested “deploy and publish” and
explicitly selected publication of the exact episode as unreviewed/text-only while
keeping review/rights pending. This adds a narrowly pinned publication path as
application **0.0.4** (separate from the original 0.0.3 story implementation).
`StoryTextPreviewPolicy` embeds and verifies file SHA-256
`58a0827fdeffd2b4469657fc4ed696a15b97f1003670f4a02c7ae97256b63c7b`.
Changed text or review metadata cannot inherit this authorization. Default
application configuration is disabled; only the existing development-preview
startup enables `Curriculum__AllowStoryTextPreview`.

The exact command records `authorized-text-preview`, `textPreview` and an operator
`previewAuthorizedBy`, leaving `approvedBy` null and every package review/rights
field empty. Normal approval still rejects it. Both regular structure/source/role/
answer/target checks and exact-package authorization run before preview publication
or restoration. Disabling the flag hides the public preview. Catalog, reader and
offline payload preserve the unreviewed/text-only notice, pending linguistic/rights
status, missing story audio and non-beta boundary.

An explicit `--publish-story-text-preview true` operator invocation saves and
publishes only that package, refuses conflicting existing text, and is idempotent.
Ordinary startup performs no publication. The publication exception is not first-
episode linguistic acceptance and does not authorize bulk episode authoring.

[Rollout and preservation evidence](releases/2026-10-18-mini-stories.md).

The authorized 0.0.4 rollout is now verified: API/frontend deployed, exact first
text preview v1 published, nine story browser/63 API/five deployment tests pass.
The [release record](releases/2026-10-18-mini-stories.md) records the exact revisions,
publication hashes, preserved existing data, backups and capacity recovery.
