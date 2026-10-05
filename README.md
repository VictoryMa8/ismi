# Ismi

Ismi is a mobile-first Arabic learning web app for Palestinian Levantine, Modern Standard Arabic, and Quranic Arabic. Learners can study one track or combine all three in one daily plan.

**[Open the roadmap](ROADMAP.md)** for current status, what is done, what needs
input, and the next recommended work. Agents follow [the planning workflow](docs/planning-workflow.md).
You can simply ask “Update the roadmap,” “Is this feature already done?” or
“Implement F10”; feature IDs are optional.

The app uses a Vue 3 + TypeScript PWA, an ASP.NET Core 10 API and SQLite for the
bounded account/content slice. Product constraints live in [AGENTS.md](AGENTS.md),
and source research in `docs/research/`. Current implementation and publication
status are maintained in the roadmap, with links to feature evidence.

## Project structure

```text
i-api/    ASP.NET Core API and seed curriculum
i-web/    Vue learner client and PWA shell
i-tests/  API domain tests
```

## Run locally

Install Node.js 20.19+ (or 22.12+) and the .NET 10 SDK matching `global.json`. From the repository root, install dependencies once:

```bash
npm run setup
```

From the repository root, start the API in one terminal:

```bash
npm run api
```

Start the frontend in a second terminal, also from the repository root:

```bash
npm run web
```

Open `http://127.0.0.1:5173/` for the landing page, or `http://127.0.0.1:5173/#/today` for the learner app once the API reports it is listening. The API uses `dotnet watch` for hot reload/restarts; the frontend uses Vite for live reload. Logs stay in their respective terminals. Ctrl+C stops only the server in that terminal, including its child processes. Both commands load local `.env` and `.env.local` settings, with shell environment variables taking precedence.

If a port is already occupied, stop the previous server in its terminal. On macOS, `lsof -nP -iTCP:5062 -sTCP:LISTEN` identifies the API listener. For deliberate alternate ports, set `ISMI_API_PORT=5064` and `ISMI_WEB_PORT=5174` in `.env.local` before starting both commands; the frontend proxy automatically follows the API port. The launchers leave unrelated listeners alone.

The underlying commands are `dotnet watch --project i-api run --urls http://127.0.0.1:5062` and `npm --prefix i-web run dev -- --host 127.0.0.1`. Using them directly does not load the repository-root `.env` files automatically.

Learner pages use `#/today`, `#/courses`, `#/practice`, and `#/account`, so bookmarked pages and browser history also work in the offline PWA. Today shows the next lesson; Courses holds the full path; Practice lets learners repeat lessons without advancing course progress.

Learners can continue as guests or create an account from the Account control. Account credentials and synchronized progress are stored locally in `i-api/App_Data/ismi.db`; the directory is ignored by Git. Passwords are hashed by ASP.NET Core Identity and are never stored in plaintext. Authentication uses an HttpOnly cookie, and state-changing account/progress requests require an antiforgery token.

To enable the internal curriculum console for its final approver, set the approver email before starting the API, then register or sign in with that exact email:

```bash
Curriculum__ApproverEmail=you@example.com npm run api
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

The browser downloads the current daily lesson queue and keeps identity-scoped dashboard/settings snapshots and unsynchronized completion events in IndexedDB. Study settings offer 5/10/15/30-minute goals, selected tracks and a primary track; account preferences synchronize with revision-checked conflict handling. Authenticated progress is durable in the local SQLite database. Guest server progress is isolated by an HttpOnly browser identifier and remains in memory; the browser queue is the source for reconnection. SQLite is the beta implementation, not a commitment to the eventual production database.

## Recorded lesson audio

In the curriculum console, create a draft from a lesson, then use **Prompt recordings** to upload a recording for a step. This bounded slice accepts 16-bit PCM WAV files (mono or stereo, 8–48 kHz, at most 10 MB per file). It preserves the uploaded bytes; compression and additional codecs are not implemented.

Complete the speaker credit or agreed pseudonym, Palestinian urban/Jordanian dialect label, exact Arabic transcript, and review notes. The attached `recording` provenance source must document origin and permission for playback and offline distribution. Save, validate, listen to the preview, then approve and publish. Approval checks asset existence, transcript equality, metadata, and a matching source; human approval must establish recording accuracy and permission. It does not certify native-expert review.

The API stores immutable SHA-256-addressed files under `i-api/App_Data/recordings` by default. Override with `Recordings__Path`; back up this directory alongside SQLite. Upload and draft-preview access are owner-gated. Learners can fetch only assets referenced by a currently published lesson. Rollback restores the previous audio references. Already downloaded packages remain available offline; this is not a remote content-revocation mechanism. Unreferenced uploads are retained; automatic asset cleanup is not yet implemented.

IndexedDB stores recording blobs with lesson packages, verifies their SHA-256 hashes, and commits a lesson only when every recording is present. A failed download or storage write preserves the previous complete package. Playback uses local blobs when available and displays an actionable error if playback fails; transcript-based study stays available. The storage upgrade preserves queued progress and removes legacy lesson packages that had audio URLs without downloaded bytes.

No real speaker recordings ship in this change. Seed lessons remain demonstrative and use the labeled browser/device voice preview. Tests generate silent WAV signals solely to verify upload, publication, downloads, and actual browser playback.

## Vercel frontend deployment

The Vercel project is connected to `VictoryMa8/ismi` on GitHub. Pushes to `main` automatically deploy the frontend to `https://ismi-arabic.vercel.app`; `https://ismi-ruby.vercel.app` redirects there. Other branches create previews. The repository-root `vercel.json` supplies the build and API proxy configuration and points `/api/*` to the existing `https://ismi.alwaysdata.net` backend. Backend changes still require a separate alwaysdata deployment.

Deploy from the repository root using `vercel.json`. Vercel builds `i-web` and proxies `/api/*` to `https://ismi.alwaysdata.net`. If the backend host changes, update the rewrite destination in that file. Keep preview deployments access-restricted for the invite-only beta.

The development preview is deployed at https://ismi-arabic.vercel.app, with its API at https://ismi.alwaysdata.net. The Vercel project is `ismi` under `victorys-projects-c1cb4594`; both production and preview deployments use the checked-in API rewrite. Vercel deployment does not migrate local accounts, progress, curriculum, or recordings; `.vercelignore` excludes backend files and local data. Configure the approver email on the backend host, not in the frontend.

With the Vercel CLI signed in, use `vercel deploy --project ismi --scope victorys-projects-c1cb4594` from the repository root for a preview; add `--prod` to update the stable URL. Verify account cookies, lesson loading, recording upload/playback, and offline download/reconnection before a beta release.

### Free development backend

The current deployment target is alwaysdata's Free plan: .NET 10, 1 GB persistent disk, and 256 MB RAM. It is limited to non-commercial use and the supplied `alwaysdata.net` address. This is a development-preview target, not a production hosting commitment. No paid Render service was activated and its proposed blueprint was removed.

Publish the API locally with `dotnet publish i-api/Ismi.Api.csproj -c Release -o /tmp/ismi-backend/app`, then include `deploy/start-alwaysdata.sh` in that output directory. Upload the published files to the hosting account's application directory. Create a .NET 10 site with that working directory and the command `sh start-alwaysdata.sh`. Set `ISMI_DATA_DIR` to a separate absolute directory within the account (for example, `/home/ACCOUNT/ismi/data`). The host supplies `IP` and `PORT`. Forwarded headers are enabled for its TLS-terminating proxy; the application listener must remain behind that trusted proxy. Set `Curriculum__ApproverEmail` to the intended owner's email.

The startup script places SQLite, recordings, and Data Protection keys under `ISMI_DATA_DIR`, preserving sessions and progress across restarts and code uploads. Keep this SQLite slice on one instance. New hosting starts with demonstration curriculum and no existing accounts; migrating local user data requires a separate explicit request. Protect backups as account data.

The configured alwaysdata account is `ismi`, site `1076252`, with application files in `/home/ismi/ismi/app` and persistent data in `/home/ismi/ismi/data`. The site runs .NET 10 with `sh start-alwaysdata.sh`, binds the provider's IPv6 address, and forces HTTPS. Replace only application files on redeployment. Keep any local hosting credentials in ignored owner-only files; never upload them to either provider or commit them. The temporary SSH key used for the September 27 release was removed after verification.

Historical deployment verification (2026-09-13; not a current rollout check): Vercel build passed; direct and proxied HTTPS health/dashboard endpoints passed; secure CSRF cookies and registration input validation passed without creating an account; the live browser completed a guest lesson and showed synchronized progress with the next lesson selected. SQLite and key directories were confirmed on persistent storage. Full live account creation and recorded-audio publication were not exercised. The provider reported a 138 MB peak backend footprint and also displayed a resource-limit warning; this free preview can be slow and is not a load-tested beta host.

If moving the backend, update the HTTPS origin in `vercel.json`, then deploy and verify the Vercel frontend. The frontend's Hobby plan also restricts use to personal, non-commercial projects. Public beta access still requires the project's release gates and an invitation mechanism.

References: [alwaysdata free plan](https://help.alwaysdata.com/en/admin-billing/billing/public-cloud-prices/), [.NET configuration](https://help.alwaysdata.com/en/docs/web-hosting/languages/dotnet/configuration/), [Vercel Hobby terms](https://vercel.com/docs/plans/hobby).

### Latest release

The October 2 code release `26f8242` is deployed to both hosts. Health, dashboard,
published lesson and live frontend checks passed; hosted account/content data and
cookie keys were preserved. No new curriculum revisions were published. See the
[rollout record](docs/releases/2026-10-02.md) for tests, hashes and rollback locations.

### September 27, 2026 release (historical)

The Vercel production URL served release `a5ef7dc`, and the alwaysdata API was
updated and restarted. Seven owner-approved Everyday conversations v1 lessons
were imported, validated, approved, and published through the curriculum service
in the live database. All seven live endpoints returned eight exercises and six
dialogue turns; the dashboard lists them before the six preserved demonstrations.
Existing account/progress data was preserved. The previous application and an
online SQLite backup remain on the backend host for rollback. Validation before
deployment passed 20 API tests, seven browser tests, and the frontend build.
Reviewed audio, real assistive-technology testing, pilot evidence, and the broader
beta release gates remain outstanding.
