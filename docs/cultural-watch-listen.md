# Weekly Arabic watch & listen — F21

October 15, 2026 · Local implementation and verification.
The [roadmap](../ROADMAP.md#f21-cultural-watch-and-listen-recommendations) holds
current status; the [design plan](cultural-watch-listen-plan.md) gives the broader
scope. The owner authorized implementation and selected **broader Arabic** with
individual dialect/register labels and **Monday 00:00 UTC** editions.

## Learner behavior

Today has a compact Watch & listen link below core activities. Practice has a
matching tile. The focused `#/practice/culture` page keeps Practice selected,
with one YouTube video, film and song per dated edition. Stable archive URLs use
`#/practice/culture/{editionId}`; browser back/forward and direct offline entry work.
The five main tabs and all existing core lesson/progress mechanics are retained.

Cards show original descriptions, creators, Arabic titles when authored,
dialect/register, difficulty with a reason, duration, access and separate resource
actions. Film and free-companion access, runtime and support are distinct. Details
hold the ungraded prompt, text alternative, content notes, caption origin/languages,
region/sign-in observations, support links and last check. Arabic names use explicit
language/direction. Green, charcoal and gold headers identify the three media slots.

External actions open the original publisher in a new tab, with `noopener noreferrer`
and no-referrer policy. There are no embedded players, third-party thumbnails,
prefetch requests, media downloads, lyrics, AI recommendations, accounts required
for browsing, view tracking, notifications or progress credit. External media use
never earns daily minutes, streak days, quest credit, mastery or glossary inclusion.

A missing current release displays the newest available edition as **Latest picks**
with its original date. A fresh empty catalog says no collection is published.
Archives contain genuinely published editions only. No upcoming edition title or
content appears before its server-controlled week boundary.

## Owner authoring and release controls

The existing Curriculum console has **Lessons** and **Watch & listen** sections.
The media section offers file import, bounded JSON draft editing, card preview,
validation, revision history, approve/publish, withdrawal, link checks, suppression,
restore and audit history. Draft previews label unknown access/runtime honestly;
those values cannot pass approval. This slice follows the existing lesson console's
JSON authoring model rather than adding a separate general-purpose CMS.

One collection contains immutable content revisions plus its current publication,
availability observations and audit history. The additive `CulturalCollections`
SQLite table stores that aggregate as JSON with a concurrency revision. One unique
week per collection prevents competing editions. Every mutation checks the expected
revision; EF's concurrency token also prevents simultaneous lost updates.

- Save/edit: update the current draft or create a new draft from approved/published
  content. Published revisions are never edited in place. Week/edition identity is
  fixed; a different week needs a new edition.
- Validate: require exactly three distinct slots, a separate film free companion,
  a free video/song path, direct safe HTTPS destinations, text/support/evidence,
  sensible runtimes/windows and checks within seven days. Canonical YouTube IDs
  prevent a watch URL and its short-link alias from filling two primary slots.
- Approve: only the configured owner can approve an exact saved draft. Approval
  hashes the content; it does not establish native-expert review or media rights.
- Publish: revalidate the approved revision/hash and atomically select all three
  items. A future publication remains private until Monday 00:00 UTC. No cron or
  background service is required.
- Check/suppress: record a dated observation and reason without rewriting approved
  content. A suppressed resource loses its public URL; other links and text remain.
  Checks are matched to the exact resource ID and URL, so a changed destination
  cannot inherit the old URL's availability evidence.
- Correct/restore/withdraw: corrected destinations/copy need a new approved revision;
  restoration is limited to previously published approved versions and rechecks
  current availability. Withdrawal is audited and removes online delivery.

Auth, owner filtering and antiforgery cover all admin writes. Public DTOs explicitly
exclude reviewer notes, evidence text, audit actors, drafts and future content.
Validation checks structure and evidence presence; actual dialect, legitimacy,
caption quality and playback require human inspection.

## Public API and offline data

`GET /api/culture/weekly?offset=0` returns server time, current/latest ID, current-week
flag, catalog revision/ETag, up to eight complete editions, pagination and withdrawal
tombstones. `GET /api/culture/editions/{id}` serves only an eligible published edition.
The owner endpoints are under `/api/admin/culture`; edition listing/detail and
draft/validate/approve/publish/withdraw/rollback/check-link are separate operations.

The learner validates public responses and caches one atomic IndexedDB snapshot:
the first eight editions plus the open archive detail. Cache writes are serialized
and guarded against stale route requests. A successful authoritative refresh clears
old detail data before fetching a detail outside the first page; withdrawals remove
cached links. Invalid/network/storage responses preserve the last complete snapshot
where possible. Older archive pages are browsable online but not advertised as cached.

Offline text stays readable and external actions become a playback-needs-internet
message. The saved edition date and last refresh are explicit; the device clock
cannot unlock future editions. The page refreshes on entry, online events, window
return/focus and explicit retry. A failed catalog request cannot block core study.
Resources with an unavailable primary or offline playback open their text-help details.

Disconnected metadata cannot be remotely revoked. Withdrawal reconciliation requires
a successful connection and storage write; a failed write cannot erase an existing
offline copy. External publisher downloads and accessibility remain outside Ismi's
offline guarantee.

## Real-content preparation and local data

[Four edition manifests and source/gap notes](../content/culture/README.md) cover
12 real candidates plus three replacements. Four v1 drafts are imported into
`i-api/App_Data/ismi.db`, with approval/publication unset. Candidate identity and
some metadata come from original publishers/artists; actual playback, regions,
support, exact durations and editorial review remain open. Unknown access/runtime
deliberately fail validation. The source README records each specific gap, including
conflicting Wajib release metadata and sensitive-content suitability decisions.

`npm run culture:import` resolves absolute source paths before starting the .NET
importer, adds drafts and exits. Repeated imports preserve existing editions unless
`--update-import-drafts=true` explicitly refreshes a still-draft record. It never
approves/publishes or updates an approved revision. It does not load root `.env`
files; set the normal `Database__Path` environment override when needed.

Local preservation check: all **12 existing non-media tables** retained identical
logical row hashes/counts after schema initialization and import. No row contents,
learner identities or credentials were printed. This is a local database check,
not a hosted preservation or publication claim.

## Verification on October 15

Story: an owner saves, previews, validates, approves and publishes an edition in the
console → ASP.NET validates and atomically persists it → a guest receives only the
eligible public payload → the learner opens three cards and archive → offline reload
keeps text, and reconnect/refresh removes a withdrawn edition.

| Boundary | Result and evidence |
| --- | --- |
| Production client build | Passed, including TypeScript and generated PWA service worker |
| API → database → public response | All 37 API tests passed; final five media tests passed again after URL-alias validation was added |
| Browser → owner console → API | Media browser test saves, previews, validates, approves, publishes and opens an eligible archive edition through the real disposable API/database |
| Learner → external link boundary | No third-party network request before a click; distinct rental/companion labels and safe link attributes checked |
| Browser → offline cache | Direct archive route, offline reload, explicit reconnection refresh, withdrawal purge, malformed response preservation and empty/failure states pass |
| Navigation/access/layout | 320/390/1280 widths, 200% text, mixed direction, keyboard links and reduced motion pass; screenshots inspected |
| Broad regression | Initial run: 106/107 passed; a recall opener-focus race was found and fixed |
| Final focused regression | 21/21 passed: four feature-hub, seven F21 and ten recall/can-do checks, including the previously failing keyboard return |

The recall race involved `close()` waiting for a refresh that could be superseded
by a newer refresh. It could skip focusing a temporarily disabled opener. A pending
scope-bound focus return now waits for settled loading/busy state and respects a
learner who has already moved focus. No review/evidence policy changed.

Browser tests use clearly synthetic media in Playwright's disposable database;
their test publications never touch the actual local/hosted content catalog. The
media spec runs as `zy-cultural-picks.spec.ts` after the existing owner-creation
console check, avoiding an order-dependent duplicate owner registration failure.
Chromium's offline-reload emulation did not emit a usable reconnection event in
one run, so that withdrawal test explicitly exercises the visible Refresh action.
Do not claim every real browser reconnection or screen-reader combination passed.

Commands (repository root for .NET, `i-web` for browser checks):

```sh
dotnet test Ismi.slnx --no-restore -m:1 -nodeReuse:false -p:UseSharedCompilation=false
PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" npm run test:e2e -- --reporter=line
PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" npm run test:e2e -- --reporter=line zy-cultural-picks.spec.ts zzzz-recall.spec.ts feature-hubs.spec.ts
```

The first sandboxed .NET build/test attempt could not create local MSBuild sockets;
authorized test runs outside that sandbox completed successfully. Application
verification requires no paid service or external media credentials.

## Exact remaining release work

F21.2/F21.3's local software scope is implemented. F21.1 stays open for actual
playback/metadata/access/editorial checks, and F21.4 still needs a real editorial
cycle using accepted replacement content. F21.5 remains open for real
assistive-technology/supported-device checks, exact owner content approval and
publication, and completion of the authorized API rollout with hosted preservation
and rollback evidence. Optional learner issue submission is deferred; no unagreed
report-data retention policy was introduced.

No content is approved or published in the actual database. The owner authorized
push and application deployment on October 15, followed by reusable alwaysdata
credential setup. Frontend `c366a8d` is pushed/Vercel Ready and its route is verified;
API deployment awaits owner 2FA/token and protected SSH setup. See the
[rollout record](releases/2026-10-15-cultural-media.md). No spending or creator contact is authorized or performed.
