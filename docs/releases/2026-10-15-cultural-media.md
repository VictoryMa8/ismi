# F21 application rollout — October 15, 2026

The owner authorized push/deployment and reusable alwaysdata credential setup.
Frontend and API application revision `4545feac1f9d71acd12c69cc7c4edb3613bac229`
are deployed. Media approval/publication is separate and remains unperformed.
Documentation follow-up commits do not change that application code.

## Frontend

- Existing Vercel project `ismi`, `prj_bm9WqkQ8JKkjIuA5QHpw3Xjk5W0H`, team
  `team_mfq8lyWncLfiAY4Xkrf40VBO`; existing Hobby development preview retained.
- Deployment `dpl_AhB2o9BXYon1FTqgK475sPZE8yZT` is Ready/Promoted, with the
  exact Git revision above. Stable alias:
  [ismi-arabic.vercel.app](https://ismi-arabic.vercel.app).
- Browser verification after API rollout: the learner Watch & listen route loads
  successfully, refresh works, and it states **No weekly collection has been
  published yet.** The owner console opens, its media section loads with no saved
  drafts, and returning to the learner page works. These checks created no content.
- The existing PWA initially showed an older cached application. Its update/reload
  loaded the new five-tab navigation and media entry successfully.
- Vercel connector returned scope 403; the existing authenticated CLI verified
  the same explicit project/team successfully.

## API and preservation

The documented `npm run deploy:api -- --check` authenticated both the existing
site and dedicated SSH key. `npm run deploy:api` then built and deployed the clean
committed revision, verified the archive hash, kept the previous app and a
consistent SQLite backup, atomically swapped app directories and restarted the
existing site. It verified healthy exact-revision response, assembly hash,
SQLite integrity and unchanged recording/cookie-key hashes.

- API: [ismi.alwaysdata.net](https://ismi.alwaysdata.net), site `1076252`.
- Health returned 200 and `1.0.0+4545feac1f9d71acd12c69cc7c4edb3613bac229`.
- Public `/api/culture/weekly` returned 200, schema 1, an empty editions list,
  no current edition and no tombstones, matching the unpublished database.
- Anonymous `/api/admin/culture/editions` returned 401. An initial request to
  the unregistered `/api/admin/culture` group root returned 404; the registered
  editions endpoint was then checked correctly.
- All **14 existing tables** retain identical logical row counts and hashes across
  the rollout, including account, progress, completions, curriculum versions,
  sources, audit and recall-review records. `CulturalCollections` was added with
  **zero rows**. No local SQLite file or local draft was uploaded.
- Rollback directory:
  `/home/ismi/ismi/deployments/20261015-085326-4545feac1f9d`.
  `old/` contains the prior application; `before/ismi.db` is the consistent backup.
  App rollback does not undo an additive schema or replace live learner data.

Logical preservation snapshots are private local count/hash evidence in
`/tmp/ismi-f21-hosted-before.json` and `/tmp/ismi-f21-hosted-after.json`; they contain
no row contents. Hosted preservation is distinct from earlier local/test checks.

## Reusable deployment access

The owner enabled profile 2FA, saved the API token only in the ignored mode-600
local config, created the protected dedicated key and loaded it into the SSH
agent. Its public key was registered for the existing `ismi` SSH user, and a fresh
`--check` succeeded. The private key remains outside Git. No credentials were
uploaded to application hosts or committed. The account ED25519 host fingerprint
was verified before recording strict local host trust:
`SHA256:5i/vJYokzNsnXAeHkwzEm+3kxPQWwsRzwXFPQ7oOvNI`.

The first real API check exposed a deployment-script assumption: .NET sites use
`working_directory`, whereas `path` belongs to static/PHP sites. The script now
checks the .NET type and exact working directory/address. All five deployment
fixture tests pass, including rejection of wrong type, directory and address.
The configured existing site and provider plan were unchanged.

## Content and verification boundaries

Four actual collections remain v1 research drafts in the local SQLite database.
They were not uploaded, approved or published. Existing hosted lesson publication
is unchanged. Real playback/runtime/access/editorial and assistive-technology
checks remain open under F21.1/F21.4/F21.5.

[Implementation and test evidence](../cultural-watch-listen.md): production build,
37 API tests and final 21 focused browser checks passed. The initial broad browser
run was 106/107; its recall focus race was fixed and the failing case passed in the
focused rerun. No clean 107/107 full rerun is claimed.
