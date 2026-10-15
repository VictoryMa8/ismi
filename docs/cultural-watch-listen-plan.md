# F21 — Weekly cultural recommendations

October 15, 2026 · Detailed plan; implementation authorized later the same day.
Current status and priority remain in [ROADMAP.md](../ROADMAP.md#f21-cultural-watch-and-listen-recommendations).

## 1. Agreed direction and remaining choices

The owner selected a **weekly collection containing one YouTube video, one film,
and one song** on October 15. Film rentals and subscriptions are allowed when
clearly labeled, with a free companion option and no learning requirement.
This replaces the earlier proposal for one weekly pick or daily recommendations.
Podcasts may be a later addition; they do not replace one of the three slots.

The intended experience is a small invitation to encounter Arabic beyond Ismi:
watch something short, explore a film, or enjoy a song. The three recommendations
are choices, not a weekly assignment. Watching a whole film never becomes an
implicit expectation within a learner's 5/10/15/30-minute goal.

| Choice | Position for this plan | Status |
| --- | --- | --- |
| Cadence and composition | One weekly collection: YouTube video + film + song | Owner selected |
| Paid film access | Allowed, disclosed before leaving; free companion; optional | Owner selected |
| Initial language scope | Broader Arabic; each work’s language/dialect/register individually labeled | Owner selected at implementation entry |
| Weekly boundary | Monday 00:00 UTC, displayed as a dated edition; independent of personal streak/quest timezone | Owner selected at implementation entry |
| Entry point | Watch & listen tile in Practice, compact link below core activities on Today | Recommended |
| Preparation buffer | Four complete weekly collections plus one replacement candidate per media type | Recommended; measure effort before promising ongoing supply |
| Learner tracking | No watched/completed status, favorites, click history or progress credit in the first slice | Recommended; keeps optional exploration simple |

The owner subsequently authorized implementation, selected broader Arabic scope and
Monday UTC editions. Other recommendations guide the bounded build; publication,
deployment, purchases, contacting creators and new providers require their own
authority. Current implementation/evidence is in [the feature note](cultural-watch-listen.md).

## 2. Inspecting the current foundation

Checkout inspected October 15 on `main`; no pre-existing local changes were present.
F21 has no implementation or authored media collection. No hosted database or
current media availability was audited in this planning task.

| Existing area | What can be reused | Required F21 work |
| --- | --- | --- |
| `i-web/src/App.vue` | Practice hub, feature tiles, Today layout, page navigation | Add the entry and focused collection page; keep the five main tabs |
| `i-web/src/routes.ts`, `AppShell.vue` | Hash-route recognition and landing/app boundary | Recognize collection/archive detail routes, including direct offline entry |
| `i-web/src/CurriculumConsole.vue` | Owner console entry and review conventions | Separate media tab/editor; existing editor expects lessons |
| `i-api/Services/CurriculumApproverFilter.cs`, `CurriculumAccessService.cs` | Owner authorization | Apply to media administration; preserve antiforgery on mutations |
| `i-api/Services/CurriculumPublishingService.cs` | Version/approval/audit patterns | Dedicated collection service; external films/songs must not become lesson records |
| `i-api/Data/IsmiDbContext.cs`, schema initializers | Bounded SQLite persistence | Additive collection/revision/audit schema; preserve account/content data |
| `i-web/src/offline.ts` | Atomic device snapshots in IndexedDB | Dedicated public catalog snapshot and validation; no external media blobs |
| `i-web/src/studyPlan.ts`, learning habits and can-do modules | Existing learning/progress behavior | Preserve it; media viewing is outside these calculations |
| `i-web/tests/feature-hubs.spec.ts`, API test project | Navigation/access test patterns | Add deterministic collection lifecycle and offline cases |

The existing lesson console is not already a generic media CMS. Reuse its access
and workflow conventions without undertaking an unrelated console rewrite.
The current database uses `EnsureCreated` plus explicit additive schema setup;
adding EF entities alone will not upgrade an existing database.

## 3. First collection and learning value

Recommend one modest shared theme each week, such as visiting someone, food at
home, making plans or everyday places. A theme helps the set feel intentional,
but relevance and an honest language label take priority over forcing a match.
These are editorial briefs, not selected titles or approved cultural claims.

| Slot | Recommended shape | Learner invitation |
| --- | --- | --- |
| YouTube video | Official creator/publisher upload; roughly 3–10 minutes or a clearly identified short window | Listen for a familiar greeting, request or response; replay only if useful |
| Film | One named film, year/director, official information and verified viewing paths; full runtime separate from a free trailer/clip | Explore the story through a short official companion; watch the full film if interested |
| Song | One named track and performer, preferably an official artist/label release; full duration plus optional short listening window | Notice a familiar word or the mood; compare sung language with everyday use only when reviewed |

Each item has an original English description, one concise reason it suits this
audience, and one ungraded prompt. Prompts may link to existing published lessons
or teaching cards. They do not generate new glossary entries, accepted answers,
Arabic explanations or mastery evidence automatically.

The owner selected broader Arabic at implementation entry. Identify mixed
Levantine/MSA/other-language passages and sung or poetic language. A Palestinian
creator's identity does not establish the dialect of every work. A popular song
is not automatically a model for contemporary spoken Palestinian Arabic.
Broader Arabic media does not authorize new MSA/Quranic lessons or French/Khmer courses.
If four suitable sets cannot be sourced, bring the exact sourcing gap to the owner.

Use plain difficulty labels such as **Supported**, **Stretch**, and **Advanced
listening**, each with a concrete reason: fast overlapping dialogue, substantial
unfamiliar vocabulary, poetic language, or help from subtitles. These are editorial
estimates, not CEFR ratings or results of the learner's placement check.

The first four-week manifest should list 12 real primary recommendations and
three replacement candidates, exact original URLs, evidence, prompts and review
dispositions. Do not pre-fill the archive with fictional publication dates.
At initial launch it may correctly contain only the current edition.

## 4. Learner pages and concise copy

**Practice:** a Watch & listen tile uses the established feature treatment, an
icon and explicit label. Its small status says “This week's 3 picks” only when a
complete current edition exists. An empty edition state must not claim three picks.

**Today:** a small secondary link appears after core lesson/review actions. It
does not displace Continue, insert a task in the daily queue, or add another large
dashboard section. People without Levantine selected can browse the labeled
collection from Practice; recommendation placement respects agreed course scope.

**Collection page:** proposed route `#/practice/culture`. Show the dated edition,
an optional short theme, then three labeled cards: YouTube, Film and Song. Keep
the Practice tab selected and a Back to Practice link. Avoid carousels, autoplay,
embedded players, promotional subtitles and mandatory dialogs before each link.

Each compact card shows title/creator, language or dialect, difficulty, duration,
access/cost and the primary external action. Details expand to show the prompt,
caption/transcript languages, context/content notes, alternate links and last
availability check. Expanded state does not imply completion.

For a film, the **full film** and **free companion** are separate actions with
separate runtime, subtitle and access labels. A trailer is not labeled as a free
full film or an equivalent substitute for experiencing the whole story. Give the
companion its own achievable prompt. External advertising, sign-in, rental or
subscription requirements are disclosed when observed; Ismi itself remains free.

**Archive:** older genuinely released editions appear newest first, with stable
edition URLs, proposed `#/practice/culture/{editionId}`. Date labels remain factual
when no new edition is ready. A simple paginated list is enough initially; search,
many filters and personalized ranking can wait until the catalog warrants them.

**External links:** actions name the destination and announce a new tab if used.
Use safe HTTPS links, `noopener noreferrer` and a no-referrer policy. No tracking
redirects, affiliate links or automatic third-party thumbnail/player requests.
Text with existing icons is sufficient until image rights are established.

**Unavailable item:** retain an honest slot label and explanation, offer the
approved replacement/companion if usable, and allow return to core learning.
Never redirect silently to a different film/song. A broken full-film link does not
invalidate an independently available official companion; label each separately.

## 5. Curation, provenance and editorial review

For each candidate, inspect the actual recommended work or window. The final
human approver remains the owner; do not claim native or specialist review.
Record checks that an agent cannot perform, including any missing listening or
linguistic review, rather than turning a search snippet into approval evidence.

1. **Identify the work.** Exact title, creator/artist/director, year as relevant,
   original publisher URL and why it belongs in the collection.
2. **Check the destination.** Prefer creator, label, studio, distributor, broadcaster
   or another demonstrably authorized source. Verify title, version and redirects.
   A platform name, HTTPS or HTTP 200 alone does not establish legitimate availability.
3. **Inspect language and suitability.** Document the segment, dialect/register,
   confidence and evidence; review speed, themes and any relevant content notes.
   Keep cultural descriptions specific to the work and source their factual claims.
4. **Check access.** Record date, tested region, free/ad-supported/rental/subscription
   status, login requirements and limitations. Do not promise worldwide access or
   imply a new rental purchase has been tested without authorization.
5. **Check support.** Record subtitle/caption/transcript language and origin
   separately: publisher-provided, automatic, none or unknown. Inspect actual
   availability; automatic captions are not described as reviewed Arabic text.
6. **Author the companion prompt.** Original English copy, optional known lesson
   references and an achievable text-based learning alternative. New Arabic
   teaching claims require the usual source/approval boundary.
7. **Record permissions.** Distinguish linking, metadata, images, quotations,
   lyrics, transcripts and downloadable files. Unresolved reuse means link-only
   with original descriptions, or exclusion if the source itself is uncertain.
8. **Validate and present the exact revision to the owner.** Approval covers the
   three items and their companions, notes, sources and edition date. Changes
   to learning/access content require a new revision and review.

Do not reproduce film dialogue, song lyrics, album art, posters, transcripts or
media files without an established basis for that exact reuse. Link to official
lyrics or subtitles when available; a song recommendation does not authorize
Ismi to translate, annotate or display its lyrics. No platform scraping, caption
extraction service, downloader, runtime AI recommender or media API key is needed.

For everyday first editions, prefer accessible relationship-centered material.
Use factual, brief content notes where relevant. Broader editorial treatment of
politics, conflict, religious interpretation or explicit content needs an agreed
policy before those become routine picks. Do not imply that all Arabic culture
has one voice, or that a film is endorsed as historical or theological authority.

## 6. Proposed data contract

Use a versioned weekly edition as the publication unit. It contains exactly three
distinct primary slots, even if the song's official release is also on YouTube.
One URL cannot satisfy two primary slots. Companion resources are attached to
their item and never counted as additional weekly picks.

| Record/group | Required fields or behavior |
| --- | --- |
| Edition identity | Stable edition ID, revision, schema version, concise theme/title, language/track, week start, optional explicit expiry |
| Item identity | Stable item ID, slot `youtube-video` / `film` / `song`, title, creator credits, year where relevant, item order |
| Learning metadata | Dialect/register tags and evidence, difficulty/reason, original description, ungraded prompt, optional published teaching references |
| Duration | Full work runtime and separately scoped start/end window; distinguish film from companion timings |
| Destination | Resource ID, purpose `primary` / `free-companion` / `alternate`, platform, original HTTPS URL, observed final destination |
| Access observation | Free/ad-supported/rental/subscription/unknown, login/region limitations, checked-at UTC, tested region, evidence note |
| Text support | Caption/subtitle/transcript status, languages, publisher/automatic origin, URL if present; stored per resource |
| Review/provenance | Source locators, reuse disposition, cultural/linguistic evidence, reviewer role/status; internal notes excluded from public DTOs |
| Publication | Draft/approved/published/superseded/withdrawn revision, approver and publisher, timestamps, content hash and concurrency token |
| Operations | Resource health observations, audited suppression/replacement reasons, edition revision affected, prior approved version |

Keep immutable edition content plus append-only audit/availability observations.
Availability changes may suppress a link immediately; changing its URL or wording
requires an approved revision. Mutable operational health must not silently rewrite
the approved payload. A future release is an approved/published edition whose
week has not arrived; public endpoints must omit it entirely until eligible.

Publication validators require all three slots, required credits/labels/evidence,
valid week boundaries, sensible duration/window ranges, source linkage, length
limits and safe URLs. The film must have a free companion under the selected policy.
The proposed first-slice rule also requires a usable free path for video and song.
Unknown cost/support/region facts are explicit, and uncertain essential access
must block primary recommendation until checked. Validate caption labels without
pretending that a deterministic validator can verify their linguistic accuracy.

Use plain text, no arbitrary HTML or scripts. Reject non-HTTPS, credentials in
URLs, localhost/private-network destinations, malformed timestamps and unreviewed
shortened links. Prefer human-recorded link checks initially: an arbitrary server
URL fetcher adds SSRF and reliability work without establishing playback quality.

## 7. Publication, weekly selection and recovery

Proposed lifecycle: **draft → validate → owner approve → publish → eligible week**.
Editing an approved revision creates a draft; publication rechecks validation and
the exact approval hash/concurrency token. Publish the entire edition in one
transaction. Unique edition/week constraints prevent competing current releases;
corrections for a week are revisions of the same edition.

Recommend Monday 00:00 UTC for a shared editorial date. The API determines the
current eligible edition from server time; the browser does not unlock future
content with its clock. An upcoming edition can be owner-published ahead of its
date, so no cron job, new hosting service or background automation is necessary.
Do not confuse this boundary with a learner's local weekly-quest reset.

If a new week has no complete approved edition, keep the last available one under
**Latest picks · [date]**, rather than claiming it is this week's new material.
Allow no current pick if the last edition is withdrawn or expired. Past released
editions remain browsable unless withdrawn; future editions never appear in archive.

The desktop media console needs list/edit, deterministic validation, learner
preview, exact-revision approval, publish-for-week, issue review, withdrawal and
rollback. Reuse the owner access filter and session/antiforgery patterns. A narrow
dedicated service keeps these actions separate from lesson approval and progress.

Recheck all destinations/support before approval and shortly before their week;
recommend a recorded check within seven days of first display, then recheck when
the edition goes live. Reserve candidates reduce gaps but are not automatically
substituted into an edition. The owner can approve a replacement revision when needed.

Proposed issue reporting is limited to fixed reasons such as unavailable,
access/cost mismatch and incorrect language/support label, attached to public
edition/revision/resource IDs. No free text, learner response, playback history or
new identity collection is needed. Rate-limit and deduplicate; untrusted reports
create review work and cannot automatically withdraw content. Verify retention
and abuse handling before adding this optional submission path.

Withdrawal removes the edition/resource from online delivery and returns public
tombstones so reconnecting clients clear stale cached links. Rollback is an audited
selection of a previously approved revision, revalidated for current availability
and schedule conflicts. Never automatically republish a revision with dead links.
Previously cached offline metadata cannot be recalled until reconnection; disclose
this operational limit and avoid claiming remote offline revocation.

## 8. API and frontend implementation outline

Names below describe the proposed boundary; final names can follow repository
conventions without changing the behavior.

| Area | Proposed implementation |
| --- | --- |
| Domain | `CulturalMediaModels.cs`, edition validator and publishing/catalog services under `i-api` |
| Persistence | Dedicated edition revisions, publication selection, audit and resource-health records; additive idempotent initializer |
| Public API | `GET /api/culture/weekly` for current/latest metadata and server time; paginated archive and stable edition detail endpoint |
| Admin API | Owner-gated `/api/admin/culture` draft/validate/approve/publish/withdraw/rollback; explicit revision checks |
| Learner UI | `CulturalPicks.vue`, small reusable item component and typed catalog module; integrate into App navigation |
| Admin UI | `CulturalMediaConsole.vue` reached from existing console; separate data from lesson JSON |
| Cache | Public DTO snapshot through existing `saveDeviceSnapshot`/`getDeviceSnapshot`, dedicated versioned key |
| Authoring | `content/culture/` manifests and an evidence/README template; import into drafts, never auto-publish |
| Tests | Focused API lifecycle tests and `i-web/tests/cultural-picks.spec.ts`; mocked publishers for deterministic browser checks |

An anonymous public catalog is appropriate for guests and accounts because it
contains the same approved editorial content. Drafts, source notes, approver
identities, future editions and administrative observations remain private.
Apply course preference filtering at display time; public catalog caching must
not contain private preferences or be cleared as if it were learner attempt history.

Use a catalog revision/ETag, bounded page sizes and explicit response validation.
Fetch once when entering the feature and refresh on a later online visit or
reconnection, with a manual retry. Avoid polling and keep this request separate
from critical lesson startup; an unavailable catalog cannot block core study.
The public collection query includes withdrawal information necessary to reconcile
the bounded cached archive. Merge detail pages by stable revision, not array order.

## 9. Offline, access and privacy behavior

Cache only validated public metadata, original descriptions/prompts and source
links after a successful request. Commit a complete catalog snapshot atomically;
failed fetches or storage writes preserve the last usable snapshot. Bound the
offline archive, proposed eight editions plus an open detail edition, and identify
which editions are actually cached. The full online archive may be larger.

Offline, show the last fetched edition with its date and “Saved picks · playback
needs internet.” Do not advance the weekly selection from the device clock or
store future editions in the public snapshot. Link buttons can explain the online
requirement while the text and existing downloaded learning alternatives work.
On reconnect, replace withdrawn metadata and show the approved current revision.
Storage denial or an empty cache produces a simple retry/return state.

External media files and third-party pages are never added to the lesson download
pipeline or service-worker media caches. A platform's own offline download feature
is separate from Ismi and is not promised for these recommendations.
[YouTube's official offline guidance](https://support.google.com/youtube/answer/6141269?hl=en)
describes availability limitations by region and video.

No embedded player, third-party images or analytics requests run before the
learner follows a link. Leaving for a publisher starts that publisher's experience;
we cannot verify watch time or treat an external click as learning. No progress,
XP, daily-goal minutes, streak days, weekly quests, can-do evidence or glossary
inclusion is awarded by F21. Do not introduce notifications or email reminders.

All Ismi metadata, prompts and alternatives work with keyboard/screen reader,
200% text, narrow screens, high contrast and reduced motion. Give Arabic names
explicit language/direction and separate them from English metadata and numerals.
Do not require hearing, singing or speaking to use the feature or continue study.
Provide a meaningful text-based learning alternative linked to existing approved
material; a synopsis is not described as an equivalent media transcript.

The external accessibility review records actual caption/transcript/description
support and limitations. Prefer resources with useful text support and accessible
free companions. Do not certify the third-party service as accessible merely
because the Ismi card passes checks. W3C distinguishes captions, transcripts and
description of visual information in its
[media planning guidance](https://www.w3.org/WAI/media/av/planning/); those separate
needs inform the evidence fields and alternatives here.

## 10. Bounded delivery tasks

The following table preserves the original delivery scopes. Implementation was
subsequently authorized; current child statuses and evidence live in the roadmap
and [implementation note](cultural-watch-listen.md).

| ID | Deliverable and next action | Done when | Dependencies |
| --- | --- | --- | --- |
| F21.1 | Curation brief and first four collections. Confirm language scope and source/inspect exact works | 12 primary items + 3 replacements documented; three slots in each edition; film free companions; access/support/dialect evidence and prompts review-ready; unresolved gaps explicit | Owner scope decisions; actual source availability and review |
| F21.2 | Versioned catalog and media console. Confirm weekly boundary, then implement schema/API/workflow | Owner-only drafts, validation, preview, exact approval/publication, dated selection, archive, withdrawal/rollback and audit pass; three-slot publication atomic; drafts/future data private | Agreed scope/boundary; F21.1 provides real record examples |
| F21.3 | Learner collection, archive and offline metadata. Integrate Practice/Today entries | Three cards, distinct film/companion actions, honest labels, archive/direct routes, safe links and atomic offline snapshots work; core learning untouched | F21.2 contract; approved record shape from F21.1 |
| F21.4 | Availability upkeep and corrections. Establish check log and rehearse failures | Rechecks, resource suppression, approved replacement, rollback, reconnect tombstones and cache limits work; owner can manage an unavailable film or song; optional report path only if its policy is settled | F21.2/F21.3; backup candidates from F21.1 |
| F21.5 | Integrated verification and authorized release | Acceptance matrix passes; exact first collection approved/published through console; separately authorized web/API rollout verified with data preservation/rollback; limitations recorded | F21.1–F21.4, explicit publication/deployment authority |

Suggested work order is F21.1 decisions and sample records → F21.2 → F21.3 →
F21.4 → F21.5. Curation can continue alongside authorized development, but code
must not substitute fabricated fixtures for the real-content release gate.
Report text/content readiness, local software, owner approval, publication and
hosting as separate delivery states. Do not promise dates until the first edition
shows how long sourcing and review take. This plan does not reprioritize F23,
F17.5 or the existing authorized Arabic work.

## 11. Acceptance and verification matrix

| Scenario | Evidence required |
| --- | --- |
| Complete weekly set | Exactly one video, one film, one song; a song hosted on YouTube does not fill the video slot too; paid-film/free-companion labels are distinct |
| Missing/unreviewed slot | Validation or publication blocks an incomplete set; no partial edition silently labeled three picks |
| Owner workflow/security | Guest and non-owner denied admin access; CSRF required; edit-after-approval/concurrent publish blocked; only exact approved revision delivered |
| Week boundary | Before/at/after Monday; future payload absent from list/detail/archive; old edition labeled Latest when no new set; client clock changes cannot unlock content |
| Archive/version recovery | Only released editions listed; stable links/history; withdrawn detail has usable state; rollback and corrected metadata preserve audit |
| Link/support failure | HTTP-success-but-unplayable example, region/login/rental change, missing subtitles, dead primary/live companion, dead companion and approved replacement |
| Offline and reconnect | Cached reload/direct route; no false external-download claim; expired/withdrawn catalog reconciliation; failed refresh preserves complete old cache; storage denied/quota handled |
| Accessibility/layout | Keyboard/focus/back behavior, named external destinations, screen reader on actual device, 320/390/1280 widths, enlarged Arabic/English and no color-only meaning |
| Privacy/network | No third-party request before click; no player/image prefetch; public DTO excludes internal/future data; no learner completion/click records created |
| Existing feature regression | Five tabs, landing return/welcome, Today Continue, review, learning habits and daily goal unchanged; guest/account behavior preserved |
| Real title verification | Human inspection of each exact work/window, official-source evidence, support/access limitations and owner disposition logged; browser mocks alone insufficient |
| Hosted rollout | Web/API revisions, health/read-only catalog/admin access, exact approved edition hash, source links, mobile/offline return, persistent DB/keys/recordings preserved |

Implementation validation should include production frontend build, focused API
tests and focused Playwright checks, followed by existing navigation/lesson/offline
regressions appropriate to touched integration points. Use controlled time and
mocked external pages for repeatable tests, plus separate real destination checks.
An HTTP status cannot prove playback, permission, dialect, captions or suitability.

F21 is complete only when the current edition and archive behavior, owner workflow,
failure alternatives, offline metadata and accessibility requirements have evidence.
Keep it open if actual curation, human checks or authorized publication remain.
Developer fixture success does not establish cultural or linguistic effectiveness.
Broader beta accessibility/outcome gates remain in F18; record any first-slice
assistive-technology gap here rather than hiding it under that parent.

## 12. Ongoing operation and later extensions

Each editorial cycle: review the next three recommendations and film companion,
check access/support, validate exact records, obtain owner approval, publish for
the chosen week, verify when eligible, and retain the prior edition for rollback.
Record time spent, unsuitable candidates and unresolved labels privately where
appropriate. Estimate a sustainable buffer from actual cycles. If supply slips,
show the last edition honestly; never let runtime AI invent the missing slot.

Later candidates include podcasts, saved items, learner feedback, library filters,
additional languages, licensed in-app transcripts and optional embedded playback.
Each needs its own bounded scope; personalized recommendations, analytics,
notifications and rewards require explicit policy choices. Licensed downloads,
automatic subtitle translation and a streaming catalog are separate projects.

**Planning evidence, October 15:** roadmap/workflow and listed checkout paths
inspected; official W3C media planning and YouTube offline guidance consulted.
No actual media title, rights holder, region-specific playback or recurring
curation capacity was verified during planning. Later implementation, test and
research-draft evidence is recorded in [the feature note](cultural-watch-listen.md);
this planning evidence is not a publication or deployment claim.
