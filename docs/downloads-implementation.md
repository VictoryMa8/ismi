# Downloads implementation and acceptance evidence

November 3, 2026 · P4 / stable F32 · **Beta 0.0.17** release.

The owner requested “build P4,” authorizing the software in the
[existing contract](downloads-and-reading-comfort.md#f32-downloads-and-recovery-center).
The owner subsequently requested “commit and deploy” November 3, authorizing the
P4 candidate’s commit/push and rollout on the existing preview. Curriculum
publication and beta expansion remain separate. Current state and the remaining actors/gates belong to
[ROADMAP.md](../ROADMAP.md#f32-downloads-and-recovery-center).

## Software

Account → Downloads (`#/account/downloads`) inventories published lesson and
alphabet packages in their existing IndexedDB stores. It groups all five stable
course IDs, retaining General MSA and the Quranic path separately. Only public
dashboard summaries and alphabet endpoints feed the catalog; no authoring endpoint
or unpublished draft is used. The device-shared catalog stores content metadata,
never dashboard completion flags, names, placement, practice or account history.

Each row derives completeness from actual package and required recording bytes;
alphabet font availability is also checked. It exposes not saved, downloading,
saved, update available, failed and unavailable states. Text-only previews retain
their notices and never imply human recordings or linguistic acceptance. Saved
time and successful server-check time are separate; older packages with no saved
timestamp show Unknown. An offline device sees last known availability.

Download, targeted Retry/Update and Remove download reuse the lesson/audio and
alphabet stores. Lesson recordings include authored introduction/teaching assets
as well as exercise prompts. Asset addresses, limits and SHA-256 checks precede
atomic package writes; synchronous storage errors explicitly abort transactions.
Publication is checked again before commit. A failed update preserves its prior
complete package; confirmed 403/404/410 or alphabet withdrawal removes fallback.
Successful transfers remain saved when another package fails.

Web Locks serialize mutations across tabs and expose transient transfer state.
Requests have 30-second deadlines. Reload releases transfer locks and rebuilds
inventory from durable bytes instead of persisting a downloading flag. Browsers
without Web Locks receive an actionable unsupported-management error; existing
online learning and cache reads remain usable. Physical-browser acceptance of
this boundary remains part of F32.3.

Manual removal persists device-shared intent before deleting content. Automatic
cache callers respect it across dashboard refresh, reconnection and tabs; opening
the lesson or explicitly downloading permits saving again. Failed automatic
transfers also wait for targeted retry or explicit lesson opening, so reload does
not immediately erase the failure or silently replace its older usable version.
No new automatic course-wide downloads or eviction are introduced.

Removal collects only unreferenced audio in the relevant existing store. Open
lesson/review dialogs and alphabet practice/playback hold shared usage locks;
manual removal asks the learner to close them across tabs before reclaiming bytes.
Paused lesson positions remain intact and their rows explain the offline resume
requirement. The controls never clear learning stores, queued completions,
recall/can-do/report evidence, placement or preferences. Words/grammar consequences
are explained under About downloads.

Managed storage estimates count package JSON and unique referenced recordings,
deduplicating shared recording URLs. They exclude app/font/media caches and browser
bookkeeping, so they are an approximate logical content size rather than exact
disk allocation. Browser site usage/quota is separately optional with an
Unavailable fallback; saved bytes are not guaranteed against OS/browser eviction.

Only the resolved current identity's pending count and saved positions are shown.
Retry sync requires a successful current-auth check (leaving the queue intact if
that check fails), then uses the existing idempotent
completion endpoint and queue. A scope change stops further submissions. Failed
sync retains events. The Downloads view waits for startup identity resolution,
and an identity change remounts it to clear scoped notices immediately.

## Automated and visual verification

The dedicated [Downloads browser suite](../i-web/tests/downloads.spec.ts) covers:

- Account entry, the displayed package-sourced application version, course groups,
  preview notices, deduplicated recording totals and managed storage accounting.
- Shared audio retained until its last referring lesson is removed; recovery from
  missing required cached bytes without claiming a complete package.
- Exact preservation of queued work, review history, saved positions and sentinel
  recall/report/placement/preference snapshots during content removal.
- Manual removal across refresh/reload and two tabs; explicit re-download; offline
  reload of text-only lesson and published alphabet packages.
- Failed updates caused by corrupt, missing or interrupted audio and injected
  storage quota errors; previous version preservation and successful targeted retry.
- Transient server failures versus confirmed forbidden publication; no offline
  fallback after confirmed withdrawal.
- Two-tab transfer convergence, broadcast inventory changes, open-lesson removal
  protection and reload during a transfer without a permanent downloading state.
- An actual eight-turn offline lesson completion, preserved queue after removal,
  failed sync retention and later successful idempotent completion synchronization.
- Scoped recovery counts, another identity's queue remaining hidden/untouched,
  denied browser estimates, keyboard action/focus restoration, 320/1280px layouts
  and overflow checks. Mobile and desktop screenshots were visually inspected.

The fixture API uses disposable local test data and synthetic silence. Chromium's
offline emulation reset `navigator.onLine` after service-worker navigation in this
environment, so this suite persists the emulated offline signal across reloads
and rejects API requests through a page transport guard while network emulation
also remains enabled. This is automated fault injection, not a physical-device
or real speech pass. Existing alphabet/recording suites independently exercise
the real local API, offline blobs, failed updates and publication controls.

### Recorded results

- Production TypeScript/Vite/PWA build passes at Beta 0.0.17; the Account version
  label is checked against `i-web/package.json` in the Downloads tests. Both lock
  versions remain aligned.
- Thirteen distinct Downloads checks pass (twelve together, then the final
  auth-failure/identity-change safeguard separately). The final Downloads/recording
  run passes 16/16, followed by that additional identity check at 1/1.
- Existing regressions pass: alphabet 12/12, navigation 5/5, reading comfort 8/8,
  recordings 4/4. Together with Downloads, **42 distinct browser checks pass**.
  The initial combined run was 39/41 because two recording assertions expected the
  replaced generic error text; the assertions now verify package-specific error
  text and the Manage downloads link, and their rerun passes.
- `python3 scripts/check-roadmap.py` passes schema/queue/priority coverage and local
  links; `git diff --check` passes. A sandboxed API startup stalled; the successful
  browser runs used approved local-server/browser access outside the sandbox.
- Reviewed 320px mobile and 1280px desktop screenshots are retained for this local
  session at `/tmp/ismi-downloads-review/downloads-320.png` and
  `/tmp/ismi-downloads-review/downloads-1280.png`; these disposable fixture images
  are not curriculum or committed release artifacts.

## Remaining field acceptance and delivery

No actual iOS Safari, Android browser/PWA, VoiceOver or TalkBack session is claimed.
For each supported physical-device session, record browser/OS/AT versions and:
discover Account → Downloads, save, reload offline, finish a lesson, reconnect and
sync; discover and hear progress/error announcements; retry a failed transfer;
remove content and confirm retained learning evidence and keyboard/focus behavior.
Storage-denial/unavailable estimates must stay honest. This technical session does
not resume the deferred F18.1 observed learner rehearsal.

The owner authorized commit/push and the existing-preview application rollout
on November 3 (“commit and deploy”); that rollout is verified below. The API,
publication pins and hosted content remain unchanged. Recovery is a frontend
rollback; no database migration or learning-data deletion is needed. F32 and
F32.3 remain Verification pending until the named physical-device/AT evidence
is recorded.


## Application delivery

On November 3, 2026, implementation commit
`a17936f013d00476edbafdb38bbe5f7e4f2f12eb` was committed and pushed to `main`.
Vercel deployment `dpl_CQdw6u14L3NcUfj6VQmeA2VFXFKx` is **Ready**, built from that
exact Git SHA:
[deployment](https://ismi-25801l0bg-victorys-projects-c1cb4594.vercel.app),
[existing preview Downloads](https://ismi-arabic.vercel.app/#/account/downloads).
Both existing aliases are assigned; `ismi-ruby.vercel.app` redirects to the Arabic
alias. Documentation follow-ups may advance the deployed revision without changing
application code or the package-sourced **Beta 0.0.17** version.

A disposable hosted Chromium session verified:

- Account displays Beta 0.0.17 on both existing aliases and opens Downloads.
- The inventory has **48** real published/saved-content rows across all five stable
  course IDs, with the MSA and Quranic path groups distinct.
- The published Levantine inventory alphabet saves as **Saved · text only** and
  retains its unreviewed notice.
- At 390px and 1280px there is no horizontal overflow; screenshots were captured.
- With browser network access disabled, the actual hosted PWA reloads Downloads,
  retains the saved alphabet and opens all **28** alphabet entries. A direct
  `/api/health` request fails, proving the verification was using offline bytes.
  No fixture transport or API mocking was used in this hosted session.
- The alphabet can be removed offline. After reconnecting and reloading it remains
  Not saved; the disposable guest still has zero queued completions.
- No browser runtime errors were captured.

Hosted aggregate results/screenshots are retained for this session under
`/tmp/ismi-p4-hosted/`; no learner identities or recordings are stored in Git.
Thirty unrelated local files were checked against their pre-commit hashes and
remain unchanged. Shared roadmap/scope files were staged only for F32, preserving
other uncommitted audits and curriculum work in the checkout. This deployment
changes only the frontend; no API upload, content publication, paid resource or
beta opening occurred. Hosted automation does not supply the remaining physical
Safari/Android or VoiceOver/TalkBack acceptance.
