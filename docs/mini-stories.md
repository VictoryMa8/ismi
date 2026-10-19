# F23 recurring mini-stories

Implementation evidence, October 18, 2026. Current state and authorization remain in
[ROADMAP.md](../ROADMAP.md#f23-recurring-mini-stories).

## Contract and first episode

The owner requested “Implement F23” October 18. The existing contract sequences a
three-episode text arc through first-episode review before authoring episodes two
and three. This implementation provides the shared machinery and the first exact
candidate, not approval/publication or completion of the three-episode parent.

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

The proposed linked arc (outlines only, pending first-episode review):

| Episode | Continuity and communicative target | Candidate taught source |
| --- | --- | --- |
| 1: A little rest | Discover shared tiredness and accept an offer to rest | Everyday lesson 1 v4 |
| 2: Tea after the pause | After resting, clarify a drink preference and politely decline sugar | Everyday lesson 3; inspect exact publication before authoring |
| 3: Catch up tomorrow | Close the visit with a mutually understood next plan | Everyday planning/checkpoint lesson; inspect exact publication before authoring |

No Arabic/check packages for episodes two/three are authored here. Reviewing the
first episode establishes whether this degree of reused dialogue, scene framing,
length and comprehension difficulty works before their child scopes are fixed.
No listening edition or learner-outcome evidence is claimed.

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
