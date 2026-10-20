# MSA umbrella presentation (F13.1)

Owner decision: October 19, 2026. Modern Standard Arabic is the shared course
umbrella for general MSA and Quranic study. F13 owns that umbrella; stable F14
owns its Quranic path. This is a product hierarchy, not a linguistic assertion
that Quranic Arabic is the modern register.

## Bounded contract

- Show one MSA entry beside Levantine, French and Khmer on the landing page and
  course catalog; explain both paths and factual availability.
- Expose General MSA and Quranic Arabic within MSA in course switching, the MSA
  course page, study settings, word filters and alphabet authoring.
- Keep `msa` and `quranic` as stable path IDs and expose their shared `groupId`
  in browser/API metadata. Preserve selected/primary paths, progress, started
  lessons, offline cache namespaces and exact published alphabet pins.
- Selecting a viewed path must not change the primary path or time allocation.
  Settings may select either or both paths; both retain distinct placement,
  progress and daily time accounting.
- Retain four weeks each of general MSA and Quranic study, their separate
  measurable goals, source/rights requirements and publication controls.
  No canonical text, lesson/alphabet package, hash or approval is changed.
- Application version: Beta 0.0.9. Website/roadmap implementation is authorized;
  the owner subsequently requested commit and deployment to the existing frontend/API preview. Curriculum publication remains unchanged.

## Implementation

Shared `courseGroups` derives the four top-level entries from the five stable
learning paths. `groupId` and `pathName` match between Vue and the API catalog.
Quranic views identify their MSA parent and use the MSA course palette while
retaining respectful Quranic-specific artwork and study guidance. Existing
settings remain valid without database or IndexedDB migrations.

## Verification

Checks performed October 19, 2026:

- `npm run build --prefix i-web` passes Vue/TypeScript production build and PWA
  generation. The browser confirms the displayed Beta 0.0.9 label.
- `dotnet test Ismi.slnx --no-restore`: 67 passed, including publication/control
  regressions. No curriculum files or publication pins changed.
- 59 Playwright checks pass across `msa-umbrella`, `landing`, `language-palettes`,
  `study-settings`, `placement`, `multi-language`, `alphabet` and `learning-habits`.
  The new umbrella checks cover landing discovery, one grouped catalog entry,
  General MSA/Quranic switching at 390/1280 pixels, guest offline reload, preserved
  selected/primary paths and existing Quranic account settings/API identities.
  Existing checks retain other-language progress, legacy downloads, unfinished
  practice, allocation, placement, word filters and source-schema compatibility.
- Inspected the 390-pixel Quranic-within-MSA course-page screenshot. Landing
  regression checks pass at 320/390/768/1440 pixels; four top-level cards retain
  readable contrasting surfaces.
- `python3 scripts/check-roadmap.py` and `git diff --check` pass. F14 is nested
  under F13; its old anchor is retained for existing links.

Browser checks use Chromium automation and disposable test data; they do not
establish real screen-reader/device, linguistic/source, human-audio, outcome or
beta acceptance. Current delivery and next action live in ROADMAP.md.

## Application rollout

The owner authorized commit/push and deployment after local verification. The
existing Vercel Git integration and programmatic alwaysdata workflow are the
selected delivery routes. Saved credentials and SSH access passed the deployment
check before committing. Exact revision and delivery results will be recorded here.
