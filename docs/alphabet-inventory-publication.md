# F28 inventory-only preview publication

October 16, 2026. After the app-only deployment, the owner requested publication.
Fresh inspection found no real saved packs. The owner initially chose reviewed packs
with human audio, then, after being informed no fluent reviewers/recordings existed,
directed **“just publish them bruh.”** This latest direction authorizes the exact five
inventory-only text previews, clearly labeled unreviewed and without human audio.
The normal reviewed full-pack route and all beta gates remain open.

## Exact scope

`content/alphabet/inventory-preview/pins.json` identifies the five complete files:
28 base entries in each Arabic context, 33 Khmer base entries plus two separately
labeled Pali/Sanskrit transliteration-support characters, and 26 French case pairs.
The preview shows character shapes/forms and technical Unicode identifiers. It does
not contain word curriculum, pronunciation help, canonical Quran text, translation,
interpretation, human audio or graded activities. It does not fulfill F28's full
sound/example-word/reading outcome. Unicode technical names are explicitly not
reviewed learner pronunciation guidance. French variety and Khmer's full inventory/
help decision remain open. Sources/license and retrieval/full-file/excerpt hashes
are retained under `content/alphabet/sources` and included in the public/offline
manifest where applicable.

The five original private inventory proposals remain in `content/alphabet/drafts`;
their actual-validator report is `content/alphabet/readiness.json`. They cannot pass
normal publication validation. The separately pinned preview files contain useful
source identifiers and the exact limited inventory grouping authorized for preview.
All reviewer/evidence fields stay empty, human-recording flags false, recording URLs
empty and source acceptance/rights flags pending. No accepted review is fabricated.

## Publication mechanism

`AlphabetTextPreviewPolicy` verifies raw file hashes and all deserialized fields,
requires `Curriculum:AllowAlphabetTextPreview`, and accepts only these five packages.
The flag is disabled by default and enabled on the existing free development host.
Other hosts hide preview publications when it is absent. The normal validator and
MSA/Quranic lesson gates are unchanged. The exact alphabet exception includes only
character/form data; it does not enable broader MSA/Quranic content publication.

The separate `approve-text-preview` action records an owner publication exception,
then normal publish/withdraw/rollback operations retain audits and immutable versions.
Standard `approve` still fails until real review/content/audio requirements pass.
Any changed pack, extra example, audio, fixture or new pack fails the exact exception.

Automatic browser approval review denied connecting to the authenticated Ismi
browser session because of possible session exposure. No browser access, cookie
extraction, alternate browser surface or credential workaround was used. The
materially safer path is the existing owner-authorized SSH operator connection:
it runs the same gated publication service on the deployed server without touching
an authenticated browser session. Actor/audit strings truthfully identify the
owner-requested operator command, rather than pretending a logged-in review occurred.

`--publish-alphabet-text-previews true` checks every existing course pack before any
write, refuses changed/unrelated content, then saves/authorizes/publishes the exact
candidates. It is idempotent. There is no automatic startup publication. Its paired
`--withdraw-alphabet-text-previews true` restores the unavailable state without
removing history or unrelated content. Do not run both commands at once.

## Verification and delivery

- 49 API tests: unchanged standard gates; exact five authorized packages; no review/
  rights/audio fabrication; changed candidates rejected; default-disabled visibility;
  operator idempotency, refusal to overwrite changed packs, audit and withdrawal.
- Production Vue/TypeScript/Vite/PWA build passes.
- Existing 12 alphabet browser checks pass. Six new preview checks cover every course,
  technical text/forms and labels, absent audio/graded controls, offline Unicode
  license, and real Khmer font/text download plus offline reload. Preview transport
  is synthetic on localhost; exact service publication is independently API-tested.
- Existing 21 navigation/course/palette/placement regressions remain the preceding
  application baseline. No learner lesson/source/progress operation is requested.

Application commit, hosted publication IDs/versions/hashes/audits, HTTP verification
and aggregate data preservation are recorded below after the actual rollout.
