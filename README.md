# Ismi

Ismi is a mobile-first Arabic learning web app for Palestinian Levantine, Modern Standard Arabic, and Quranic Arabic. Learners can study one track or combine all three in one daily plan.

The current product slice includes:

- A Vue 3 + TypeScript progressive web app.
- An ASP.NET Core 10 API.
- A personalized three-track dashboard with a real ordered Levantine course path.
- A six-lesson demonstrative Week 1 loop built from the original four-step conversation material.
- Source-linked prompt recordings with owner-only WAV uploads, publication-gated playback, transcripts, and verified offline downloads.
- Credential-free Arabic prompt previews using the browser's available device voice when a recording is absent.
- Optional email/password accounts with secure cookie sessions and persistent per-user progress.
- An offline-ready application shell, three-lesson look-ahead cache, and queued completion sync.
- Idempotent lesson completion updates, per-browser guest isolation, and persistent account progress.
- Unit tests for lesson evaluation, lesson structure, and completion behavior.
- An owner-only curriculum console with versioned drafts, provenance, deterministic validation, approval, publication, audit history, and rollback.
- Playwright coverage for mobile offline completion, reconnection, exactly-once sync, and keyboard access.

Product constraints and research live in `AGENTS.md` and `docs/research/`.

## Project structure

```text
i-api/    ASP.NET Core API and seed curriculum
i-web/    Vue learner client and PWA shell
i-tests/  API domain tests
```

## Run locally

Start the API:

```bash
dotnet run --project i-api --urls http://127.0.0.1:5062
```

In a second terminal, start the web client:

```bash
cd i-web
npm install
npm run dev -- --host 127.0.0.1
```

Then open `http://127.0.0.1:5173/`.

Learners can continue as guests or create an account from the Account control. Account credentials and synchronized progress are stored locally in `i-api/App_Data/ismi.db`; the directory is ignored by Git. Passwords are hashed by ASP.NET Core Identity and are never stored in plaintext. Authentication uses an HttpOnly cookie, and state-changing account/progress requests require an antiforgery token.

To enable the internal curriculum console for its final approver, set the approver email before starting the API, then register or sign in with that exact email:

```bash
Curriculum__ApproverEmail=you@example.com dotnet run --project i-api --urls http://127.0.0.1:5062
```

The console appears in the signed-in account's desktop navigation. A draft must include provenance and pass deterministic structural checks before it can be approved; only an approved version can be published. Learner endpoints read only the published database version. This bounded slice permits Levantine publication and deliberately blocks MSA and Quranic material until their additional content and review gates are implemented.

This beta slice does not yet send email, so email confirmation and password-reset delivery are intentionally unavailable. External Google, Apple, or Microsoft sign-in and the production database remain future deployment decisions.

## Validate

```bash
dotnet test Ismi.slnx
cd i-web
npm run build
npx playwright install chromium
npm run test:e2e
```

The initially migrated lesson is intentionally demonstrative. It is tagged as such in its provenance and is not reviewed launch curriculum. All subsequent learner-facing changes must pass through the publication workflow, and Quranic content must follow the provenance and publication rules in `AGENTS.md`.

The browser keeps the next three lesson packages, the last dashboard snapshot, and unsynchronized completion events in IndexedDB. Authenticated progress is durable in the local SQLite database. Guest server progress is isolated by an HttpOnly browser identifier and remains in memory; the browser queue is the source for reconnection. SQLite is the beta implementation, not a commitment to the eventual production database.

## Recorded lesson audio

In the curriculum console, create a draft from a lesson, then use **Prompt recordings** to upload a recording for a step. This bounded slice accepts 16-bit PCM WAV files (mono or stereo, 8–48 kHz, at most 10 MB per file). It preserves the uploaded bytes; compression and additional codecs are not implemented.

Complete the speaker credit or agreed pseudonym, Palestinian urban/Jordanian dialect label, exact Arabic transcript, and review notes. The attached `recording` provenance source must document origin and permission for playback and offline distribution. Save, validate, listen to the preview, then approve and publish. Approval checks asset existence, transcript equality, metadata, and a matching source; human approval must establish recording accuracy and permission. It does not certify native-expert review.

The API stores immutable SHA-256-addressed files under `i-api/App_Data/recordings` by default. Override with `Recordings__Path`; back up this directory alongside SQLite. Upload and draft-preview access are owner-gated. Learners can fetch only assets referenced by a currently published lesson. Rollback restores the previous audio references. Already downloaded packages remain available offline; this is not a remote content-revocation mechanism. Unreferenced uploads are retained; automatic asset cleanup is not yet implemented.

IndexedDB stores recording blobs with lesson packages, verifies their SHA-256 hashes, and commits a lesson only when every recording is present. A failed download or storage write preserves the previous complete package. Playback uses local blobs when available and displays an actionable error if playback fails; transcript-based study stays available. The storage upgrade preserves queued progress and removes legacy lesson packages that had audio URLs without downloaded bytes.

No real speaker recordings ship in this change. Seed lessons remain demonstrative and use the labeled browser/device voice preview. Tests generate silent WAV signals solely to verify upload, publication, downloads, and actual browser playback.

## Vercel frontend deployment

Deploy from the repository root using `vercel.mjs`. Vercel builds `i-web` and proxies `/api/*` to `ISMI_API_ORIGIN`, which must be the HTTPS origin of a separately hosted ASP.NET API. Set that variable for each Vercel environment and in the local CLI environment when deploying. The configuration intentionally refuses deployment without an API origin, to avoid publishing a frontend with broken accounts and lessons. Keep preview deployments access-restricted for the invite-only beta.

The development preview is deployed at https://ismi-ruby.vercel.app, with its API at https://ismi.alwaysdata.net. The Vercel project is `ismi` under `victorys-projects-c1cb4594`; both production and preview build environments have `ISMI_API_ORIGIN` configured. Vercel deployment does not migrate local accounts, progress, curriculum, or recordings; `.vercelignore` excludes backend files and local data. Configure the approver email on the backend host, not in the frontend.

With the Vercel CLI signed in, use `ISMI_API_ORIGIN=https://ismi.alwaysdata.net vercel deploy --project ismi --scope victorys-projects-c1cb4594` from the repository root for a preview; add `--prod` to update the stable URL. Verify account cookies, lesson loading, recording upload/playback, and offline download/reconnection before a beta release.

### Free development backend

The current deployment target is alwaysdata's Free plan: .NET 10, 1 GB persistent disk, and 256 MB RAM. It is limited to non-commercial use and the supplied `alwaysdata.net` address. This is a development-preview target, not a production hosting commitment. No paid Render service was activated and its proposed blueprint was removed.

Publish the API locally with `dotnet publish i-api/Ismi.Api.csproj -c Release -o /tmp/ismi-backend/app`, then include `deploy/start-alwaysdata.sh` in that output directory. Upload the published files to the hosting account's application directory. Create a .NET 10 site with that working directory and the command `sh start-alwaysdata.sh`. Set `ISMI_DATA_DIR` to a separate absolute directory within the account (for example, `/home/ACCOUNT/ismi/data`). The host supplies `IP` and `PORT`. Forwarded headers are enabled for its TLS-terminating proxy; the application listener must remain behind that trusted proxy. Set `Curriculum__ApproverEmail` to the intended owner's email.

The startup script places SQLite, recordings, and Data Protection keys under `ISMI_DATA_DIR`, preserving sessions and progress across restarts and code uploads. Keep this SQLite slice on one instance. New hosting starts with demonstration curriculum and no existing accounts; migrating local user data requires a separate explicit request. Protect backups as account data.

The configured alwaysdata account is `ismi`, site `1076252`, with application files in `/home/ismi/ismi/app` and persistent data in `/home/ismi/ismi/data`. The site runs .NET 10 with `sh start-alwaysdata.sh`, binds the provider's IPv6 address, and forces HTTPS. Replace only application files on redeployment. Local hosting credentials and URLs are saved in ignored `.env.hosting.local` with owner-only permissions; never upload that file to either provider or commit it.

Deployment verification (2026-09-13): Vercel build passed; direct and proxied HTTPS health/dashboard endpoints passed; secure CSRF cookies and registration input validation passed without creating an account; the live browser completed a guest lesson and showed synchronized progress with the next lesson selected. SQLite and key directories were confirmed on persistent storage. Full live account creation and recorded-audio publication were not exercised. The provider reported a 138 MB peak backend footprint and also displayed a resource-limit warning; this free preview can be slow and is not a load-tested beta host.

After sign-in and backend provisioning, set `ISMI_API_ORIGIN` to its HTTPS origin, then deploy and verify the Vercel frontend. The frontend's Hobby plan also restricts use to personal, non-commercial projects. Public beta access still requires the project's release gates and an invitation mechanism.

References: [alwaysdata free plan](https://help.alwaysdata.com/en/admin-billing/billing/public-cloud-prices/), [.NET configuration](https://help.alwaysdata.com/en/docs/web-hosting/languages/dotnet/configuration/), [Vercel Hobby terms](https://vercel.com/docs/plans/hobby).
