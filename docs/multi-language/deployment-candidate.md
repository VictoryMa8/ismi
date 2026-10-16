# F24 deployment candidate and recovery

The owner subsequently authorized pushing and deploying this application work on
October 16. The candidate below records the earlier local preparation; actual
rollout evidence is recorded in the [October 16 release note](../releases/2026-10-16-multi-language.md).

Prepared October 15, 2026. This is a local application candidate, not a rollout or
curriculum release. It includes the shared working checkout, including the separately
authorized mobile-back-control work. Existing owner edits are preserved. No commit,
push, credential access, remote mutation or real publication is performed here.

The local artifact directory is `/private/tmp/ismi-f24-candidate`:

- `web.tar.gz`: Vite production/PWA output, including Khmer font/license.
- `api.tar.gz`: Release API prepared with `deploy/alwaysdata.py`'s existing build
  routine; it strips local settings/symbols and includes `start-alwaysdata.sh`.
- `source-manifest.json`: SHA-256 file inventory for the uncommitted source tree.
- `candidate.json`: archive/inventory hashes, validation and explicit delivery gates.

The API is framework-dependent and runs via the existing host's `dotnet Ismi.Api.dll`
startup path. It does not select a new host/database or require paid resources.
Temporary archives can be recreated; do not treat them as a durable Git release.
The embedded Git revision identifies the base checkout; the source inventory is
needed to identify these uncommitted changes. A later authorized commit must be
rebuilt and verified rather than labeling these bytes as that commit.

## Authorized rollout procedure

1. Obtain explicit code rollout authorization and preserve/commit the intended
   checkout under the owner's commit/push instructions. Pushing `main` deploys the
   frontend. Rebuild both components from the resulting exact revision.
2. Use the existing `npm run deploy:api -- --check` workflow before claiming hosted
   access. Record current web/API revision, actual published lesson IDs/versions,
   account/settings/progress counts, SQLite integrity, assets and cookie keys. Keep
   private data/backups outside Git and outside the uploaded application directory.
3. Deploy the API before exposing schema-2 authoring. Its health response advertises
   `multi-language-v1`; new clients refuse schema-2 imports/saves against an older
   API so neutral fields cannot be silently discarded. Verify existing Arabic
   endpoints/auth/settings and per-course dashboard/availability on the host.
4. Deploy the frontend separately. Verify landing, old section links, once-only
   welcome preference, selector, existing Arabic lesson/download, account/guest
   separation, offline completion/reload and exactly-once reconnection. Verify PWA
   update completion before claiming the offline font/app is installed.
5. Keep French/Khmer planned until the owner approves exact source-linked candidate
   packages through the console. Do not publish synthetic test fixtures. Record
   actual variety/depth/reviewer/provenance and a separate content manifest when
   those real units become available. Do not widen the first-100 beta implicitly.

## Recovery and preservation

No SQL or IndexedDB schema migration is required for this foundation. Snapshot the
SQLite database using its backup mechanism, not a blind copy during writes; retain
the external recordings and cookie-key directories. Existing lesson/version IDs,
source records, identity scopes and pending-event IDs must stay intact. Never clear
IndexedDB/localStorage as a recovery shortcut.

For an application failure, restore the retained web/API application baseline and
verify Arabic study/auth/offline behavior. Keep live data separate. Once new-course
settings/content exist, an older application may not understand their extra IDs;
prefer a forward fix. Do not allow an old settings client to overwrite five-course
preferences during rollback. A database restore requires a separately reviewed
plan for progress written after the snapshot; never overwrite it blindly.

For a content problem, withdraw the exact published version with a reason, then
restore an explicitly selected previously published version through rollback after
validation. Check public lessons, availability, audio and audit records. Preserve
queued completions and independently versioned review histories. An offline device
cannot learn about withdrawal until it reconnects; record that limitation honestly.

The observed pilot/real-device protocol and release-manifest template enumerate
remaining external acceptance evidence. The owner decides code rollout, exact
content approvals, release order and beta inclusion separately.

## Packaged artifact identity and validation

Base checkout: `4d15539309f408985ac80c04771c3caea87427ce`, plus the uncommitted
working-tree files recorded in the 176-file source inventory. Documentation is
excluded from that inventory to avoid circular artifact hashes. API assembly
metadata identifies this base revision; it does not identify a committed F24 release.

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `web.tar.gz` | 3,552,204 | `9fceb2496186065e4a55c1434b229a3cc62fa2b808c3feede651076d7248305e` |
| `api.tar.gz` | 19,323,816 | `9182c25d6a7d1ba5c54449881cc2834218abda1a6803a0b0f147e515c4a2b976` |
| `source-manifest.json` | 29,262 | `65994f7029a2b08d576fe848f487d91cbb094725c3d56090e6adbcfb05811b94` |

`candidate.json` SHA-256:
`05d1e6c2c560818af9f600b17e5f7374d7236e7139762666528a14050c0c6c99`.
The JSON records owner-approved title **A — Ismi/اسمي pending Khmer review**, test
results and outstanding gates. `chromium-final.log` retains the 18/18 final focused
run; `webkit-diagnostics/` retains the six offline engine failures.

API tests pass 39/39 and the production frontend builds. The earlier full Chromium
run was 114/115; its recall Escape defect is fixed and covered in the final focused
18/18 run. WebKit remains 10/16, so real Safari offline verification is required.
Archives were inspected for the Khmer font/license and API startup files; API local
settings, symbols, databases and key files are excluded. Real first units, human
AT/input and pilot evidence, owner code rollout and exact content/beta decisions
remain open.
