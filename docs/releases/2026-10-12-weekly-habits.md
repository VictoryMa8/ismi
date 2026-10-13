# October 12, 2026 weekly learning habits rollout

Owner authorized commit, push and deployment of F17.7. This is a frontend release
on the existing free development-preview hosting. No backend deployment, database
migration, curriculum publication or paid service is included.

## Preflight and source

- Remote main matched `e2ed48b` before the release commits.
- Pending owner-requested engagement/language planning documents were preserved in
  documentation commit `5e7d955`; they do not implement French, Khmer or parallel
  language study.
- F17.7 implementation commit `90d3aa5` adds independent, default-off weekly quests
  and forgiving streak controls. [Selected policy and behavior](../weekly-learning-habits.md).
- Production TypeScript/Vite/PWA build and 29 targeted Chromium checks passed.
- Live inspection found that a global lesson-number sort could place fixtures
  ahead of the published unit path. Correction `5aec0ec` preserves the dashboard's
  published order, adds a cross-unit regression assertion, and passes the build
  plus all 16 affected quest/study-settings/Today checks (including eleven F17.7 checks).

## Confirmed deployment

- Final application release: `5aec0ecf908d128da3391fe6a9dd245cd8537588`, pushed to main.
- Existing Vercel project: `ismi`, scope `victorys-projects-c1cb4594`.
- Git-triggered deployment `dpl_93LH95HKnvKxCapw9YDFDpusXWwu` is **Ready**, with
  matching Git SHA, production target and stable aliases confirmed through the CLI.
- Stable URL: [Ismi](https://ismi-arabic.vercel.app/).
- Immutable URL: [release 5aec0ec](https://ismi-1mfawuvv1-victorys-projects-c1cb4594.vercel.app/).
- The Vercel connector could not access this team; the authenticated local CLI
  successfully inspected the same existing project and exact deployment. No new
  project, team, credentials or hosting configuration was created.

## Live browser evidence

An isolated Chromium guest context at 390×844 with reduced motion and the
America/Chicago timezone verified the stable URL:

- Account's Weekly quests and Forgiving streak switches both start off and enable
  independently.
- Today shows three available published-content quests for the default 15-minute
  goal; the first quest matches the existing Next lesson in the published path.
- Rules show the saved timezone and two free grace days per week.
- Reload preserves the opted-in checklist and streak settings.
- Turning quests off leaves the streak visible and does not interfere with study.
- No browser runtime errors occurred. Live `App-C4tPUEWo.js` and
  `App-p8R1kfuz.css` match the final local build.
- [Live weekly panel screenshot](2026-10-12-weekly-habits-live.png).

The smoke check changed only disposable guest-local habit switches. It submitted
no answers/completions, created no durable account, and changed no published
content or existing learner history. Full offline, idempotency, identity, grace
and boundary evidence comes from the local checks; this live smoke does not
establish real assistive-technology/browser coverage or learning outcomes.

API release `662d17c` and the existing hosted curriculum remain the deployed
baseline; there was no backend/data/content rollout. F18's broader gates stay open.

Roadmap, README and this evidence are pushed in a documentation-only follow-up.
The application source stays identical to `5aec0ec`; prior frontend releases remain
recoverable through Vercel deployment history.
