# October 11, 2026 learner satisfaction rollout

Owner authorized push/deployment of F17.1's bounded Today/color/completion slice.
Frontend only; API release `662d17c`, hosted curriculum, database, recordings and
keys are unchanged.

## Preflight

- Main matched remote `6484ce8` before committing. Related existing hero/planning
  documentation edits were preserved and included in the release.
- Fresh production build and whitespace checks pass; 19 distinct targeted browser
  checks passed during implementation. [Feature verification](../learner-satisfaction.md).
- Linked Vercel project `ismi` (`prj_bm9WqkQ8JKkjIuA5QHpw3Xjk5W0H`) and CLI identity
  verified under `victorys-projects-c1cb4594` (`team_mfq8lyWncLfiAY4Xkrf40VBO`).

## Delivery and live checks

- Code release `0852fec79277b4c8ceaf62b0cd52ebfb09d75390` committed/pushed to main.
- Git-triggered Vercel deployment `dpl_2xCHF9ZsFtwsWzvsC5SRxxJCaDkA` is Ready,
  with matching Git metadata. Vercel build completed successfully.
- Stable alias: [Ismi](https://ismi-arabic.vercel.app/).
  Immutable deployment: [release 0852fec](https://ismi-l6zkr47wy-victorys-projects-c1cb4594.vercel.app/).
- Live Today shows Continue above daily progress and plan details. Character
  portraits load; Up next excludes the primary lesson. Study time by track opens
  and closes and retains the existing allocation.
- Continue opens the existing published “What did you do today?” dialogue with
  Arabic, transliteration, English meanings and character roles. No answer or
  lesson completion was submitted; existing account progress was unchanged.
- An already-open PWA initially displayed the previous release; a subsequent
  reload after the service worker updated displayed the new layout.
- [Live mobile Today screenshot](2026-10-11-satisfaction-live.png).
- Roadmap/README/evidence are pushed in a documentation-only follow-up; application
  source remains identical to code release `0852fec`.
- No backend rollout or curriculum publication. Previous frontend remains
  recoverable through Vercel deployment history. Broader F18 beta gates stay open.
