# Learner spacing and Practice icons

## Bounded contract

The November 1 owner request covers the four attached spacing/icon screenshots and
matching problems on other learner pages. Fix course resource link separation,
planned-course cards, story catalog heading/actions, repeated Practice icons and
nearby Account/empty-state spacing. Preserve authored curriculum, navigation,
progress and the fixed lesson/dialog frame. Send screenshots of all changed
surfaces before committing. After reviewing those screenshots, the owner
explicitly requested commit and deployment to the existing preview.

Application candidate: **Beta 0.0.16**, one patch increment for this shared UI fix.
Current readiness and delivery belong in ROADMAP.md.

## Verification evidence

- Production TypeScript/Vite build passes with Beta 0.0.16. The existing offline
  dynamic-import warning does not prevent builds.
- **17 distinct existing browser checks pass**: five navigation/lesson-repeat checks
  and twelve story checks. The twelve story checks were rerun successfully after
  the final heading hierarchy adjustment. Widths include 320, 390, 768 and 1280 px.
- All fourteen learner routes were visited at 320 px with no horizontal overflow
  and no captured browser warnings/errors in that audit. Desktop/mobile visual
  checks cover the links, planned cards, Practice, story catalog/empty state,
  alphabet empty state, Account settings/placement and Today shortcuts.
- Story tests retain fixed dialog height, keyboard focus, offline download/resume,
  review notices, source-update/publication gates and progress separation. Test
  data and screenshot fixtures are isolated from the owner's database/host.
- The populated story screenshot uses an isolated copy of the synthetic browser
  test database; it is labeled synthetic. Other review screenshots use the local
  demo catalog. They are UI evidence, not current hosted curriculum inventory.
- Screenshots are saved in the owner's workspace artifact area and sent in the
  conversation, covering all changed surfaces. No screenshot containing account
  details is added to Git. The owner subsequently authorized commit/push and
  deployment of this exact UI candidate; delivery evidence is recorded below.
- The six unrelated local files are byte-for-byte unchanged; the pre-existing
  roadmap edits are retained alongside the new F34 record. Real-device/assistive
  technology acceptance and beta gates remain separate.

## Layout changes

Course resources now have a wrapping navigation row with explicit 12/24 px gaps.
Planned-course cards use a single content column and a separate action row with
20 px separation, keeping View status on one line. Story navigation/title spacing
uses the shared page styles; empty messages/actions and populated cards use grid
and wrapping action gaps. The story heading hierarchy remains sequential.

Grammar uses a notebook/pen, stories use conversation bubbles and alphabet uses
letter/script symbols. All Practice badges use consistent 24 px icons, tile gaps
are 16 px and title/detail gaps are 6 px; counts cannot shrink into the label.
The shared detail spacing also improves Today shortcuts. Alphabet empty content
uses 16 px gaps; Account settings/placement headings have explicit bottom spacing.

## Application delivery

The owner authorized commit and deployment after the screenshot review. The
frontend rollout is in progress on the existing `ismi-arabic.vercel.app` preview.
This UI-only release requires no API upload or curriculum publication. Exact
commit and Vercel readiness evidence will be recorded once verified.
