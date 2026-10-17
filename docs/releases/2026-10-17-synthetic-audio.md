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

Rollout pending at candidate preparation. Exact deployed revision, Vercel readiness,
API health and database/recording/key preservation will be recorded after verification.
