# October 11, 2026 interface cleanup and oval hero rollout

Owner authorized push/deployment of F17.3 and the prior F07 oval hero refinement.
Frontend only; API release `662d17c`, hosted curriculum, account data, recordings
and keys are unchanged by this rollout.

## Preflight

- Main matched remote `9fd83f1` before committing.
- Production frontend build and 31 targeted Chromium checks pass; whitespace checks
  pass. [Exact removals and verification](../interface-copy-cleanup.md).
- Existing linked Vercel project `ismi` under `victorys-projects-c1cb4594` reused.
  No new provider, paid service, backend rollout or curriculum publication.

## Delivery and live verification

- Code release `eada137070df7e71b30ca7f1b8c0f36c30bbb8ab` committed/pushed to main.
- Git-triggered deployment `dpl_9tsjR7z3urh5CRyPCeVJaXmdzMeK` is Ready with matching
  commit metadata; Vercel production build completed successfully.
- Stable URL: [Ismi](https://ismi-arabic.vercel.app/).
  Immutable URL: [release eada137](https://ismi-fcv8v5key-victorys-projects-c1cb4594.vercel.app/).
- Live hero has `50%` corner radius and `0px` border; both character faces remain
  visible. Original artwork and landing wording remain intact.
- Live loading uses only “Loading your study plan…” and settles into the current
  account's Today page. The review button shows its count without a duplicate sentence.
- Continue opens published “Want tea or coffee?” with the goal, scenario and
  Arabic/transliteration/English dialogue. “A conversation worth having” is absent;
  lesson opening also omits the removed version-check subtitle.
- No answers, completions, account edits or publications were submitted in the smoke
  check. Existing account state was read; no backend file/data deployment occurred.
- The already-open PWA refreshed its service worker, then reload displayed the
  latest release. No storage was cleared.
- [Live oval hero screenshot](2026-10-11-oval-cleanup-hero.png).
- Roadmap/README/evidence are pushed in a documentation-only follow-up. Application
  source remains identical to `eada137`. F18's beta gates remain open.

The previous frontend remains recoverable through Vercel deployment history.
