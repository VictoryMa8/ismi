# October 17, 2026 synthetic-audio application release

Owner authorization: “push and publish.” The candidate contains the complete F19
synthetic provenance/validation/labeling and local draft tooling described in
[the implementation note](../f19-synthetic-audio.md). Eight selected local prompt
mappings and all original source text/roles are preserved.

Application rollout is authorized to the existing Vercel/alwaysdata free development
hosts. Audio publication is **blocked by the verified F0 output-rights condition**;
see [the primary-source investigation](../azure-audio-release-rights.md).
No real WAVs, local database, resource key or hosting credentials are committed or
included in the application deployment. The hosted lesson set is not being changed.

Preflight: 55 API tests, 14 Python audition checks, frontend build and five focused
browser flows pass. Five deployment-tool fixture tests pass. Existing alwaysdata
site 1076252 and SSH access were verified. Candidate/hosting API keys are absent
from proposed source changes. Remote main matches the local baseline `0113abf`.

Application source `5c169b7707f8bd46acf58d885594a401f83ee5e7` was committed and
pushed to `main`. Vercel reports **Ready** for production-target deployment
`ismi-gr37zhoi4-victorys-projects-c1cb4594.vercel.app` on the existing development
aliases. A documentation-only follow-up push records this evidence; it may advance
the frontend revision without changing application source.

The alwaysdata deployment script verified healthy exact API revision `5c169b7`,
assembly integrity, SQLite integrity, unchanged recording hashes and cookie keys.
A separate read-only comparison against the consistent pre-deployment SQLite backup
verified **all 17 table hashes unchanged**. No curriculum or audio publication was
performed. Retained rollback application/database directory:
`/home/ismi/ismi/deployments/20261017-224150-5c169b7707f8`.

The application rollout is complete. The selected F0 audio remains private and
unpublished pending the rights input described above; no paid resource was created.
