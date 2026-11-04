# Account deletion

## Contract and owner decision

On November 3, 2026, the owner requested P5 implementation and selected permanent
deletion after recent sign-in: remove the account and server learning data, clear
its data on this browser, and keep shared curriculum. Other devices clean up when
they reconnect; backups and provider logs have separate retention. This implements
F16.3 in **Beta 0.0.18**, incremented once from 0.0.17 for the deletion feature.
Google/email-code software is reused; this work does not repeat its implementation.

The bounded feature requires:

- Online, authenticated deletion with CSRF protection, rate limiting, sign-in proof
  no older than ten minutes, and the exact typed confirmation `DELETE`.
- One transaction removing Identity account/login/claim/token rows, progress,
  completions, study settings and unused email-code challenges for that email.
  A failure rolls back, retains the account and permits retry.
- Rejection of every old session on its next API request, without waiting for the
  previous security-stamp validation interval. Cookie refresh must not renew proof.
- Removal of the selected account's pending completions, review/checkpoint/recall
  history and reports, story/alphabet progress, started lessons, preferences,
  dashboard and habit data in this browser. Guest and other-account data, shared
  lessons, recordings, alphabet/story downloads and curriculum remain.
- Recoverable network/storage failures, keyboard confirmation/cancellation/focus,
  an honest privacy policy, and independently verified authorized API/web delivery.
  Actual device/assistive-technology acceptance remains distinct from Chromium.

ROADMAP.md owns readiness, remaining gates and delivery. The owner subsequently
authorized commit and deployment to the existing preview on November 3. Hosted
verification uses disposable account data.

## Implementation

[Lifecycle endpoints](../i-api/Services/AccountLifecycleEndpoints.cs) expose
`POST /api/auth/delete-account`, plus authenticated receipt issuance and a
CSRF-protected account-existence check at `/api/auth/account-state`. A protected,
opaque receipt grants no identity/progress access and cannot be forged from an
account ID. It permits local cleanup after logout or cookie expiry without
retaining a database deletion ledger or blocking email reuse.

The receipt is stored locally when this version checks a signed-in session.
Every startup/reconnection checks remembered receipts, including accounts that
are no longer signed in. Successful deletion erases the receipt during local
cleanup. Offline browsers cannot be erased remotely. Browsers that never ran
the receipt-capable version need manual clearing of their old local account data;
this limitation is disclosed in the privacy policy. Receipt decryption also
depends on retaining the existing server Data Protection keys.

[Cookie configuration](../i-api/Program.cs) validates the security stamp on every
request. A separate sign-in-time claim is issued by password, registration,
Google and email-code sign-in; stamp/cookie renewal preserves its original time.
Sessions from older versions without that claim must sign in again to delete.
Google/email-code proof is tested with injected providers, not live consent/email.

[Account UI](../i-web/src/AccountDeletion.vue) requires a second, explicit typed
confirmation. Recent-proof failures direct the learner to sign out and sign in
again with their existing method. Neither cancellation nor an error clears data.
A lost server response triggers a receipt check before deciding whether cleanup
should proceed. CSRF tokens refresh after a session check or deletion attempt,
since another device or a lost response may have revoked the previous identity.

[Device cleanup](../i-web/src/offline.ts) uses one IndexedDB transaction across
snapshots, pending completions and review history. Keys match the complete account
scope, not a partial ID. Minimal deletion markers in IndexedDB/localStorage block
delayed history writes; other tabs reload on the deletion event. Account-specific
snapshot, completion, review and habit writers honor those markers. Shared cache
writes remain available. Storage failure preserves the receipt for a later retry
and does not claim successful local cleanup.

## Retention and recovery boundaries

Deletion removes live account rows, not the Google account, Resend delivery
records, hosting logs or pre-existing backups. No Google access/refresh token is
stored. Editorial curriculum/audit records and reports submitted without account
identifiers remain shared records. New sign-in after deletion creates a new user
ID with no inherited server progress.

The owner has not selected numeric backup/log retention or a production backup
expiration policy. These remain F16 operational gates; the policy explicitly
discloses that limit rather than inventing an erasure deadline. Before restoring
any account database backup, the operator must reconcile deletions that occurred
after that backup. Do not restore old accounts or reconnect an old database to
learners as an ordinary application rollback. Application-only rollback must keep
the current persistent database and Data Protection keys. Do not delete or modify
existing backups as part of this software task.

## November 3 verification

- Full API suite: **98 passed**, including four new lifecycle cases and two new
  passwordless-deletion cases. Tests cover owned cascades, other-user/curriculum
  preservation, cross-device session revocation, email reuse with a new ID, receipt
  checks without cookies, forged receipts/CSRF, recent proof, password re-sign-in,
  Google/email proof, and a forced SQLite failure with full rollback and retry.
  The final account/passwordless/lifecycle subset also passes **22/22** after
  separating cleanup-check rate limits from sign-in limits.
- Production frontend build passes. Package and both lockfile version fields are
  0.0.18; the browser check verifies the rendered **Beta 0.0.18** label.
- **33 distinct mobile Chromium checks passed across targeted runs**, covering
  deletion, passwordless access, downloads/recovery, reading comfort and study settings. They include deletion
  cancellation/focus, proof/server failures, exact owned-data removal with guest/
  other-account/shared-cache preservation, lost-response recovery, offline second-
  browser reconnection after cookie removal (including a previously cached signed-in
  CSRF token), storage failure followed by reload, 320px enlarged-text reflow and
  automatic reset of another open tab. The final identity/deletion rerun passes;
  mobile/desktop confirmation screenshots were visually inspected.
- The first browser run caught a stale CSRF token after a lost deletion response;
  corrected before the passing run. An initial cache-count assertion also counted
  automatic downloads racing startup; preservation now asserts every prior saved
  lesson remains rather than requiring an unchanged total.
- The initial sandbox browser launch could not start its local API server and
  timed out. The passing run used approved local-server/browser permissions.
  Existing Vite dynamic-import and Node color warnings remain unrelated.

Real Google consent/linking, permitted hosted email delivery/login, authorized
deletion rollout, physical-device/AT checks and backup-retention operations are
not established by these local automated results. No learner accounts, provider
credentials or code emails were used in these tests.

## Preview rollout

On November 3, 2026, the owner requested commit and deployment to the existing
development preview. Beta **0.0.18** was committed on `main` as
`21912ca5039d72a9d570d7af14116f8b2af3770e` and pushed to `origin/main`.

- Vercel marked deployment `dpl_Ca566Z4NtH5G5v4aNEq2wmK87f6j` **Ready** in
  33 seconds. The Account page displayed **Beta 0.0.18**. The secondary alias
  redirected to the primary preview. [Account preview](https://ismi-arabic.vercel.app/#/account)
- The alwaysdata API health endpoint reported the exact implementation revision.
  The deployment verified the assembly, SQLite integrity, recording files and
  cookie keys. Google and email-code options remained enabled through the
  frontend proxy. [API health](https://ismi.alwaysdata.net/api/health)
- In hosted Chromium, a disposable password account saved a lesson completion
  and signed in on two browser contexts. Account deletion required typed
  confirmation, revoked the other session, cleared the first browser and
  prevented password sign-in with the deleted account. The second browser
  cleared its account records after reconnecting without its old cookie.
  Both browsers kept the seeded guest and shared records.
- After deletion, aggregate row fingerprints matched all 19 application tables
  in the pre-deployment SQLite backup. The release retained that backup and the
  previous API application under
  `/home/ismi/ismi/deployments/20261104-025202-21912ca5039d` (UTC release ID).

The SSH check succeeded with the existing key through macOS Keychain. The
initial local package build needed a fresh restore of the pinned NuGet
dependencies. The next attempt stopped during archive extraction as the account
approached its disk quota. The prior API remained healthy. The resumed install
verified the uploaded archive and reused 47 byte-identical files from the
previous application through hard links. It extracted the changed assembly and
verified every staged file against the archive before the swap. The installer
kept the rollback application and database backup and then verified the new
revision after restart. Unrelated local edits were restored and verified by
file hash after packaging.

Hosted Google consent and account linking, email-code delivery and sign-in,
physical device and assistive-technology acceptance, and backup/provider
retention operations remain open.
