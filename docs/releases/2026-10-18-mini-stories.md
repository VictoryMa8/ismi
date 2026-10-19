# F23 development-preview rollout — October 18, 2026

The owner authorized deployment/publication, then explicitly selected only the exact
first episode as an unreviewed, text-only preview with linguistic/source-rights
acceptance pending. Package SHA-256:
`58a0827fdeffd2b4469657fc4ed696a15b97f1003670f4a02c7ae97256b63c7b`.

Application candidate: **0.0.4**, original 0.0.3 story implementation plus the new
exact-preview publication path. [Contract and tests](../mini-stories.md).
Normal story approval and beta gates remain unchanged. No human review, rights
clearance, story audio or learner-effectiveness evidence is claimed.

Authenticated alwaysdata `--check` confirms existing site 1076252 and SSH access.
A private read-only baseline records every existing table count/digest plus
recordings/cookie-key hashes; it is not committed because it concerns persistent
owner data. Release/backups and actual deployment/publication results follow. Existing version-rule documentation is retained in the
reproducible release revision.

## Verification and release

- Production Vue/TypeScript/PWA build passes and renders **Beta 0.0.4**.
- **63 API tests**, **nine story browser checks**, and **five deployment workflow
  tests** pass. API coverage proves the exact exception, normal gate rejection,
  changed-package/source rejection, disabled-flag hiding, idempotence, withdrawal
  and rollback, without inventing reviewer/rights fields. Browser coverage includes
  the visible unreviewed notice, private import/preview, offline reload/resume,
  identity/revision isolation and no core lesson/minute credit.
- The fresh hosted lesson-one v4 source matches all six scene lines, meanings,
  help and roles. No existing curriculum package was changed or republished.

Application revision `99f2de49ecea9735bf226abf429bf4d4d2757e93` was committed on
main and deployed to alwaysdata. Health reports that exact assembly revision.
Install/archive, restart, assembly, SQLite integrity, recordings and cookie keys
passed the standard deployment verification. The healthy prior app and consistent
SQLite backup remain at
`/home/ismi/ismi/deployments/20261019-013459-99f2de49ecea`.

The first staging attempt hit the hosting account quota during extraction, before
any app swap or database backup/manifest. Only its failed stage
`20261019-013240-99f2de49ecea` was removed. The obsolete faulty app copy at
`20261018-203837-30a393e22bb5/failed` was streamed to a private local recovery archive,
verified file-for-file against its remote hashes, then removed to make room.
Recovery archive: `/tmp/ismi-recovery-20261018-30a393e-failed.tar.gz`, SHA-256
`ad64d3d674dd04a776e36ed1007babdd7eb5de2592bf0c9ff3078dd21d266ee8`.
Live app/data and every SQLite backup were retained. Account capacity remains
bounded; future deployments should inspect/offload obsolete release artifacts
before staging another complete application.

The SSH shell defaults to .NET 8; its initial CLI invocation stopped before startup.
The exact publication command succeeded using the host's installed .NET 10 binary
with `DOTNET_ROOT` set to that runtime. No database edits or alternate review bypass
were used. The service saved the exact package, recorded the owner preview
exception, and published `after-a-long-day-01` **v1**. Audit actions are
`draft-saved → authorize-text-preview → publish`. Normal `approvedBy` remains null;
`reviewer`, `reviewEvidence` and `rightsEvidence` remain empty. Saved canonical
content hash: `45bb93860e765d0fb75d67b06f50d4b802495ebe758e8291c6a763534ce7b1af`.
Public payload hash (including the honest notice):
`6149a74caebba924f0fb553a4da3ac85fe20123b3ceeb611d7b916809dff85aa`.
[Package/publication record](../../content/stories/after-a-long-day/publication.json).

Fresh verification after publication confirms:

- All **17 pre-existing tables** match their private preflight counts/digests.
  The only new content row is in the additive `StoryPacks` table.
- Recordings and cookie-key maps match exactly; SQLite integrity passes.
- Public story scenes/checks match the exact pinned package after accounting for
  serializer defaults for optional null/empty fields. The unreviewed notice states
  pending linguistic/source-rights acceptance, no story audio and no beta inclusion.
- Course catalog is unchanged; all ten French/Khmer preview lesson URLs return 200.

The release was pushed to main. Vercel confirmed **Ready** for deployment
`dpl_CtcLUPtHyumLqfSFuTBWhUyzZdPi`,
[immutable URL](https://ismi-p2wboiwvu-victorys-projects-c1cb4594.vercel.app),
with both `ismi-arabic.vercel.app` and `ismi-ruby.vercel.app` aliases, October 18
at approximately 20:38 America/Chicago. Vercel calls this target production; these
remain the established free development-preview aliases, not a beta release.
Documentation-only follow-ups may advance the frontend revision; API remains
`99f2de4`. Frontend rollout is confirmed through Vercel metadata, not a new hosted
browser completion/accessibility audit.

[Open Mini-stories](https://ismi-arabic.vercel.app/#/practice/stories).
Normal first-episode human/source acceptance, real access checks, episodes two/three
and learner-outcome evidence remain under F23/F23.1; none is completed by this
publication exception.
