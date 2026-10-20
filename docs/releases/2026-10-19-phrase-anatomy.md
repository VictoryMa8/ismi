# F17.5 release — October 19, 2026

The owner explicitly directed “approve commit deploy and publish for me” for the
prepared F17.5 scope. This is owner acceptance and delegated publication authority,
not native-expert review, a new publisher rights grant, accessibility acceptance
or beta release.

Application **Beta 0.0.5**, source commit
`b7b910c201cfe128e750dd228641a68c5c82d90c`, was committed and pushed on main.
The implementation's production build, 64 API tests and all 25 selected browser
checks passed as detailed in [feature evidence](../phrase-anatomy.md). Approval and
release reconciliation do not add another application version increment.

## Exact content and preservation

A fresh hosted read found lesson-one record **29/v4**, including eight S0 synthetic
prompt mappings. Six selected teaching cards match the original draft after
serializer-default nulls are omitted. The [approved release package](../../content/levantine/everyday-01/revisions/phrase-anatomy/release/01-lesson.json)
retains the entire hosted lesson and sources, adding only the six-phrase language
support and one original-authoring source. Package SHA-256:
`1762dbf74a3dbbe52dc2924fda86197ad60075defceeee9652cea223d196f35b`.
[Owner acceptance](../../content/levantine/everyday-01/revisions/phrase-anatomy/release/approval.json)
is explicit; the original pending draft remains historical evidence.

A private consistent SQLite backup, table/content digests and recording/key maps are
retained at `/home/ismi/ismi/deployments/20261019-f175`. A temporary administrative
runner used the normal `CurriculumValidator` and `CurriculumPublishingService` over
the existing owner-authorized SSH connection. It validated exact current content
and all audio, saved/read back a draft, checked readiness, validated, approved and
published using an honest owner-delegated actor. No account/session was forged or
curriculum row edited directly. The initial read-only runner attempt loaded the
previous API assembly; using its own dependency manifest resolved that before writes.

Published lesson-one is now **record 35/v5**,
`curriculum-levantine-everyday-01-01-v5`. Record 29/v4 remains available for rollback.
The [publication evidence](../../content/levantine/everyday-01/revisions/phrase-anatomy/release/publication.json)
records public payload equality and audit actions. The two patterns and three usage
notes are owner accepted, with no native-expert review claimed in learner copy.

Fresh post-publication checks passed:

- Public support equals the approved six-phrase/two-pattern/three-note package.
- Every other lesson field (except the expected curriculum version) is unchanged;
  all eight synthetic prompt mappings remain present.
- Prior published content snapshots remain byte-identical. Only the curriculum
  version/source/audit tables and SQLite counters changed; all other table digests
  and recordings/cookie-key maps match the preflight baseline.
- SQLite integrity is `ok`; all ten French/Khmer preview URLs still return 200.

## Application delivery and recovery

Alwaysdata site 1076252 deployed exact API revision `b7b910c`; health/assembly,
SQLite integrity, recordings and cookie keys passed standard deployment checks.
Application rollback and consistent SQLite backup remain at
`/home/ismi/ismi/deployments/20261020-023258-b7b910c201cf`.

The first upload hit the existing free-account quota before installation or an app
swap. Its partial stage was removed. Two obsolete `old` application directories
from `20261015-085326-4545feac1f9d` and `20261016-052650-f515f43c3844` were streamed into
owner-only archives under `/tmp/ismi-f175-recovery`, verified file-for-file against
remote SHA-256 maps, then removed remotely. Their SQLite backups, current app/data,
recordings/keys and recent rollback releases were retained. Recovery archive hashes
and file maps are in that private directory's manifest. The retry succeeded.

Vercel confirmed **Ready** for source `b7b910c` at deployment
`dpl_8ywFPfw3RwBwT9WtF2maKXg968ri`,
[immutable application URL](https://ismi-5dl0obblw-victorys-projects-c1cb4594.vercel.app),
with `ismi-arabic.vercel.app` and `ismi-ruby.vercel.app` aliases. CLI deployment-list
metadata pins the Git commit; inspect metadata confirms Ready and aliases. The MCP
scope returned 403, so the already authenticated CLI supplied verification. Vercel's
production target remains the established free **development preview**. Documentation
follow-up pushes may advance its Git revision; API source remains `b7b910c`.

[Open Grammar reference](https://ismi-arabic.vercel.app/#/practice/grammar).
Physical-device, actual screen-reader and Safari-offline acceptance were not
performed. F17.5 retains its original accessibility completion gate; this rollout
does not waive it or open the beta.
