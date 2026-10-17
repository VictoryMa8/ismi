# F28 text-only completion

October 17, 2026. The owner requested everything except human recordings and then
explicitly selected **finish text-only implementation and drafts; track review/release
separately**. Metropolitan French was selected for the alphabet reference. This
replaces F28's former sound-ready completion target; it does not represent linguistic
acceptance, beta readiness or approval of changed publications.

## Delivered scope

The existing explorer, console, Unicode target overlays, atomic offline store,
versioned evidence and resume behavior remain the shared foundation. Packs can now
explicitly declare `textOnly: true`. This mode requires shape and word-spotting
activities, exact examples/transcripts, authored explanations and structured answers.
It rejects audio URLs, recording acceptance claims and listening/repeat activities.
It retains actual linguistic/inventory review, source rights, track controls,
owner/CSRF, immutable approval/versioning and normal publication checks. MSA/Quranic
publication remains blocked. Turning off text-only restores the full four-activity
and human-audio requirements; it is not a route around review.

The learner sees a text-only/no-recordings notice. Word playback controls are absent
where there is no recording. Download confirmation accurately describes text, forms
and visual practice; a text-only recap omits sound self-checks. Empty packs no longer
promise recordings as the only future publication route. New console drafts default
to text-only; reviewed audio packs remain supported.

The optional field is omitted when false in .NET serialization. Existing exact
inventory-preview files, package hashes and public payloads retain their prior
shape. The five pinned preview exception has not been expanded. New drafts cannot
use it. No production database, publication, account, audio, credential or hosted
application was changed in this task.

## Draft content

[Five importable draft packs and exact manifest](../content/alphabet/text-only/README.md)
provide 143 basic and 132 supporting entries, 434 examples/demonstrations and 550
visual activities. All basic entries have two candidate words; support entries have
one or more words or clearly labeled constructed demonstrations. Arabic shares the
same script inventory, while course sound/context records remain separate. Quranic
course words are ordinary decoding examples, not quotations, canonical text or
interpretation. French includes case/diacritic/ligature/combination support. Khmer
includes proposed series, vowels, signs and common subscripts; the final grouping
and help convention still need fluent acceptance.

The authoring script is deterministic and network-free. These are original
AI-assisted candidates with honest pending source acceptance, no reviewer and no
recordings. There is no native/scholar acceptance claim. Draft completeness refers
to the explicit proposed inventory and authoring structure; it cannot establish
pedagogical adequacy or linguistic accuracy.

## Verification

- Production Vue/TypeScript/Vite/PWA build passes.
- All 51 API tests pass. New checks verify audio-free normal publication using only
  a synthetic accepted fixture in a disposable database; missing reviews/rights,
  restricted tracks, audio claims and sound activities still fail. Every real draft
  is bounded, exact inventory coverage and identical shared Arabic inventories are present, all example targets cover .NET
  grapheme-boundary occurrences, and actual unreviewed approval fails. Private draft
  projection works without replacing public content.
- All 24 focused Chromium browser checks pass: the preceding 18 alphabet/audio/
  inventory-preview checks plus six new checks. A synthetic text-only publication
  exercises manifest checksum, complete offline reload, visual practice and saved
  session resume. Each real draft is saved/previewed through the API and console,
  with exact text, absent audio controls, both visual activities, target overlays,
  keyboard focus/Escape and 320 px enlarged text. Public availability stays unchanged.
- Enlarged mobile Arabic/Khmer screenshots were visually inspected; this is
  automated Chromium evidence, not physical-device or real assistive-technology
  acceptance. Initial immediate-reload test needed to wait for the existing
  asynchronous IndexedDB snapshot commit, consistent with the baseline resume test.

## Delivery and follow-ups

F28 is Done for the owner-revised text-only implementation/draft scope. The
subsequent owner-authorized rollout is recorded below. The published content baseline
remains October 16's five exact inventory-only v1 previews.

F30 tracks human inventory/text/help/answer acceptance, source dispositions,
MSA/Quranic controls, physical-device/AT/Safari evidence and separately authorized
release. F09 retains real-speaker recording work; F30 records each pack's eventual
audio readiness without making it part of this text-only completion. No learning,
review, rights or beta gate is silently waived.

## Authorized rollout — October 17

The owner subsequently requested push and deployment to the existing development
preview. Application commit `fdd5c5feaa0e5cb43b5be32c9b04db73c221aa51` is pushed to
`main` and deployed to the existing alwaysdata API. New text-only draft files remain
unpublished; none was imported into the hosted owner database.

`npm run deploy:api -- --check` verified the existing site and reusable SSH access.
`npm run deploy:api` built the clean committed Release revision, retained application/
SQLite recovery, restarted the site and verified exact healthy revision
`1.0.0+fdd5c5feaa0e5cb43b5be32c9b04db73c221aa51`, assembly integrity, recordings and
cookie keys. Recovery directory:
`/home/ismi/ismi/deployments/20261017-065331-fdd5c5feaa0e`.

Independent read-only aggregate snapshots before/after confirm all **17 table
counts/logical hashes** and persistent recording/cookie-key hashes match, with SQLite
integrity `ok`. Anonymous API checks confirm all five existing v1 inventory previews
retain their exact pinned public hashes and unreviewed notice, no words/activities/
audio, and anonymous admin access returns 401. Private aggregate evidence:
`/private/tmp/ismi-f28-text-before.json`, `/private/tmp/ismi-f28-text-after.json`,
`/private/tmp/ismi-f28-text-api-verification.json`.

Frontend deployment `dpl_2AEeTc4XNiXdKRAupDnh6tqq1FcR`,
[ismi-kb0r87zun-victorys-projects-c1cb4594.vercel.app](https://ismi-kb0r87zun-victorys-projects-c1cb4594.vercel.app),
is **Ready**, matches the exact application commit and has the existing
`ismi-arabic.vercel.app` / `ismi-ruby.vercel.app` aliases assigned.
The Vercel connector returned a team-scope 403; the existing authorized CLI verifies
the same project/team successfully. No provider/account/environment change was made.
A subsequent documentation-only commit records this rollout; its frontend source
is identical. API revision and curriculum state remain as verified above.

This verifies application delivery and existing public inventory preservation,
not release of the full draft packs or F30 human/accessibility acceptance.
