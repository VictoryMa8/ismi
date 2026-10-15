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

Alwaysdata's signed-in token form requires enabling profile 2FA before token
creation. Owner authentication setup is pending. An attempted unencrypted
persistent SSH key creation was rejected by automatic approval review; no key was
created. A passphrase prompt was then started and cancelled without creating a
key. The owner was asked to create a passphrase-protected dedicated key, load it
in their SSH agent, and save the API token only in the ignored config.

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
