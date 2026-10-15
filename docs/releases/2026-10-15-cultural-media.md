# F21 application rollout — October 15, 2026

The owner authorized push/deployment, followed by reusable alwaysdata credential
setup. Media approval/publication is separate and remains unperformed.

## Frontend

- Application commit: `c366a8d393791bf13655b5569be68a60387281e7`, pushed to `main`.
- Existing Vercel project `ismi`, `prj_bm9WqkQ8JKkjIuA5QHpw3Xjk5W0H`, team
  `team_mfq8lyWncLfiAY4Xkrf40VBO`; existing Hobby development preview retained.
- Deployment `dpl_CAX8BScxaiJofey3U8vyDfsNRayJ` is Ready/Promoted and its Git
  source matches the application commit. Stable alias:
  [ismi-arabic.vercel.app](https://ismi-arabic.vercel.app).
- Browser verification: after the existing PWA updated and reloaded, the five-tab
  learner navigation, Practice tile and `#/practice/culture` page render. The
  page currently reports API 404; the old backend does not have media endpoints.
  No functional hosted collection delivery is claimed yet.
- Vercel connector returned scope 403; the existing authenticated CLI verified
  the same explicit project/team successfully.

## API and credential setup — pending

The API was not deployed. `npm run deploy:api -- --prepare` produced a Release
archive successfully; real deployment will rebuild the committed revision.
`--check` found no reusable credential config; the last release record confirms
that its temporary SSH keys were removed. An ignored mode-600 local config is
prepared, with an empty token and the dedicated SSH identity path.

The owner enabled profile 2FA, saved the API token locally, created a protected
SSH key and loaded it into the SSH agent. The API token successfully reads the
existing site. Its .NET target is `working_directory=ismi/app`, type `dotnet`,
address `ismi.alwaysdata.net/`. The deployment script incorrectly checked the
static/PHP `path` field; this was corrected with wrong-target regression coverage.
All five deployment fixture tests pass. The dedicated public key still needs
registering; fresh SSH authentication currently fails. Concurrent owner Safari
activity interrupted browser registration, so an available browser window was
requested.

An earlier unencrypted persistent key attempt was rejected by approval review;
no key was created. The owner subsequently created the protected key privately.
The loaded agent key matches the `.pub` fingerprint. The account ED25519 host
fingerprint was verified and recorded in local known_hosts for strict checking.

No application files, hosted database, recordings or cookie keys have been
changed. No hosted preservation result or new rollback location is claimed.
After setup, verify the fingerprint against the account SSH screen, register the
public key, run `--check`, and use the documented deployment script to retain the
old application/consistent SQLite backup and verify revision, integrity and assets.
The SSH screen lists ED25519 fingerprint
`SHA256:5i/vJYokzNsnXAeHkwzEm+3kxPQWwsRzwXFPQ7oOvNI`.

## Content and verification boundaries

Four actual collections remain v1 research drafts in the local SQLite database.
They were not uploaded, approved or published. Existing hosted lesson publication
is unchanged. Real playback/runtime/access/editorial and assistive-technology
checks remain open under F21.1/F21.4/F21.5.

[Implementation and test evidence](../cultural-watch-listen.md): production build,
37 API tests and final 21 focused browser checks passed. The initial broad browser
run was 106/107; its recall focus race was fixed and the failing case passed in the
focused rerun. No clean 107/107 full rerun is claimed.
