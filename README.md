# Ismi

Ismi is a mobile-first Arabic learning web app for Palestinian Levantine, Modern Standard Arabic, and Quranic Arabic. Learners can study one track or combine all three in one daily plan.

The current product slice includes:

- A Vue 3 + TypeScript progressive web app.
- An ASP.NET Core 10 API.
- A personalized three-track dashboard with a real ordered Levantine course path.
- A six-lesson demonstrative Week 1 loop built from the original four-step conversation material.
- Credential-free Arabic prompt previews using the browser's available device voice.
- Optional email/password accounts with secure cookie sessions and persistent per-user progress.
- An offline-ready application shell, three-lesson look-ahead cache, and queued completion sync.
- Idempotent lesson completion updates, per-browser guest isolation, and persistent account progress.
- Unit tests for lesson evaluation, lesson structure, and completion behavior.
- An owner-only curriculum console with versioned drafts, provenance, deterministic validation, approval, publication, audit history, and rollback.
- Playwright coverage for mobile offline completion, reconnection, exactly-once sync, and keyboard access.

Product constraints and research live in `AGENTS.md` and `docs/research/`.

The next implementation stage, its acceptance criteria, and owner decisions are documented in [the next-agent handoff](docs/next-stage-handoff.md).

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
