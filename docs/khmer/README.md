# Khmer course implementation and evidence

F26 · October 16, 2026. Current statuses are in [ROADMAP.md](../../ROADMAP.md#f26-khmer-course).

## Agreed direction and candidate

Owner decisions: contemporary Cambodian Khmer with a Phnom Penh reference model;
twelve units/sixty new lessons; adults learning for partners, family and friends;
English instruction; conversation first with optional script help. Prepare drafts
now and designate a fluent reviewer before full reviewed publication. The owner
subsequently authorized the exact five as unreviewed text-only development previews;
[their publication is complete](text-preview-publication.md). Exact pronunciation help,
reading inventory, approved source foundation, reviewers, recordings, providers and
beta inclusion are not silently settled by these choices.

The [first-unit candidate](../../content/khmer/meet-01/README.md) contains five
source-linked, AI-assisted draft packages, readable review sheets and a pinned
manifest. It is a review object, not a reviewed language model. The manifest's
sourceApproval/review/audio fields remain pending/missing; the publication manifest
separately records the explicit text-preview exception. The
[primary-source research](../research/khmer-course-sources.md) records both useful
references and limits, including MSU's noncommercial licence, unresolved NIU reuse
and historical FSI script/contemporary-usage gaps.

## Implemented authoring and script flow

1. `CurriculumValidator.ValidateDraft` checks structure, language/source identity,
   authored answer segments/rationales, vocabulary context, recordings when supplied,
   and optional script-card indexes. It allows truthful pending review and rights.
2. The existing package importer checks the whole batch before transactional draft
   import. Private drafts still cannot appear in public lesson/course/download feeds.
3. Owner-only, CSRF-protected `POST /api/admin/curriculum/versions/{id}/readiness`
   returns separate draft and publication validation and records a `draft-checked`
   audit event. It does not change approval status.
4. The console previews a structurally valid candidate and displays publication
   blockers. Normal Validate/Approve/Publish/rollback retain strict linguistic,
   rights, critical-issue and fixture controls. New-language drafts do not need to
   impersonate a reviewer to be inspectable.
5. Optional script practice references exact existing teaching cards, with
   expandable help/meaning, keyboard disclosure, Khmer font/language/direction,
   no timer/score and no requirement to complete it. It reuses the fixed lesson
   dialog and single internal scroll area. Null support fields are omitted from
   serialized legacy lessons, preserving published Arabic payloads.

F24's course selector, separate progress, whole-session daily queue, downloaded font,
started lessons and generic course-scoped placement remain in use. No duplicate
course engine, French course, new brand spelling or provider integration is added.
The new readiness endpoint requires the matching API before a later web rollout;
health advertises `private-draft-preview-v1`.

## First-unit review and observation protocol

This is an execution-ready protocol, **not evidence of a completed pilot**. Confirm
participant/device setup with the owner; participant contact is a separate action.
The owner-deferred Arabic F18.1 rehearsal is not resumed by this plan.

Before observation: designate the fluent reviewer, approve exact text/help/source
and audio rights, record phrase/answer/segment dispositions, resolve critical issues
and approve the exact internal candidate. Do not bypass the console to make a pilot
public. Record web/API revisions and package hashes plus reviewer/audio versions.

Use a contemporary Khmer model speaker to read exact approved prompts. Automated
speech feedback remains unavailable until a provider is explicitly selected and
verified for Khmer, minimum data, no training and recording deletion. Transcripts
and text response alternatives remain available without claiming assessed speaking.

| Task | Observable evidence | Limits |
| --- | --- | --- |
| Peer introduction | Appropriate greeting, assigned name and name question in an agreed 2–3 minute guided exchange | Record prompted/independent turns, help and intelligibility separately |
| Communication repair | Request repetition after missed information, slower speech after fast delivery, then a relevant response | Review accepted natural alternatives; do not demand one accent |
| Listening | Extract agreed requested details from a reviewed 30–45 second studied-topic sample | Needs actual permitted human audio; no listening score from text choices |
| Reading | Recognize the eight exact taught expression candidates after reviewer agreement | Record help/attempts; no unrestricted literacy or phonics conclusion |
| Delayed transfer | Repeat appropriate introduction/repair in a changed role/situation after at least 24 hours | Record exact delay, prior exposure and help; no success evidence invented |
| Mixed study | Find course switch, move Arabic → Khmer → Arabic, resume each lesson without changing primary allocation | Requires approved internal candidate, not a public fixture |
| Device/access/offline | 320/390 px and enlarged text, real Khmer typing/selection, VoiceOver/TalkBack, downloaded font/audio, reload/complete/reconnect | Browser automation cannot substitute for human AT or real Safari offline evidence |

Store private observations outside Git. The [evidence template](pilot-evidence.template.json)
separates review, publication, device and learning states. Resolve critical defects
and retest before scaling authoring to units 2–12. The 30-day and course-end outcomes
remain assessment targets, not advertised proven results or certified proficiency.

## Verification

Verification results and local import state are recorded below after execution.
The owner subsequently authorized application push/deployment October 16.
[Rollout record](../releases/2026-10-16-khmer-drafts.md) tracks delivery; hosted draft
import and curriculum publication remain separate.

October 16 local results:

- API suite: **40 passed**. Covers transactional/idempotent five-draft import,
  separate draft/publication readiness, anonymous access rejection, blocked approval
  and publication, exact segments, invalid source/script references and unchanged
  public Arabic payloads. Initial run found four-interaction drafts below the
  existing six-interaction minimum; the candidates were expanded and all tests pass.
- Production Vue/TypeScript/Vite/PWA build: **passed** (also run by each browser
  test server).
- Focused browser run: **10 passed** across private curriculum preview, the actual
  five Khmer candidates and F24 compatibility/placement/glossary/switching/offline
  checks. Final disclosure styling/capture refinement: **2 passed**, including
  the Khmer flow again and existing Arabic teaching/retry/reconstruction. This is
  **11 distinct tests**, not a full application regression run.
- The actual candidate test imports all five in a disposable DB, checks their
  pending-review notice and exact optional script examples, exercises keyboard
  disclosure, 320/1440 px layout and 200% text, and completes one loaded preview
  offline with an incorrect-answer retry. No lesson download, learner completion
  or pending sync item is created. All five remain private drafts afterward.
- [320 px capture](previews/first-unit-320.png) and
  [1440 px capture](previews/first-unit-1440.png) were visually inspected. Khmer
  text wraps within the unchanged fixed lesson frame; the footer and scroll cue
  remain visible. This does not establish fluent script review or human AT results.
- The existing F24 offline tests use synthetic test transport. This task does not
  claim a published Khmer download/reload/reconnect pass, human model-audio pass,
  Safari pass or observed learning outcome.
- [Local import evidence](../../content/khmer/meet-01/local-import.json): records
  **27–31**, all v1 drafts, exact authored payloads verified, no approver/publisher.
  All **13** pre-existing local published payloads compare exactly before/after.
  A private local DB backup was made before import. No hosted DB was changed.
- `node scripts/build-khmer-drafts.mjs --check` and `git diff --check`: **passed**.

The above results describe local implementation. The owner subsequently authorized
push/deployment; see the rollout record for current application delivery. No hosted
draft import, publication, provider signup, participant contact or beta expansion
is included in this release.
F26 remains Active for exact review/source/help/reading decisions, human audio,
script/sound modules, observed first-unit/device evidence and then units 2–12.

## October 16 application delivery

Owner-authorized application `57b7898` is pushed/deployed to the existing web/API
development preview. Vercel is Ready; exact API revision, 15 hosted table hashes,
13 published payloads and recording/key preservation pass. Live browser checks
confirm new console guidance and planned Khmer state after refreshing the cached
PWA. No hosted draft import or curriculum publication.
[Rollout and recovery](../releases/2026-10-16-khmer-drafts.md).

## October 16 publication request and hosted preparation

After application deployment, the owner explicitly approved these five as labeled
unreviewed text-only development-preview lessons. **All five are now published v1**,
hosted records 24–28. [Exact versions/audit](../../content/khmer/meet-01/publication.json)
and [policy, checks and recovery](text-preview-publication.md) record the release.
Application `30ea724` is deployed; Vercel Ready and exact API revision verified.

The initial hosted import and ordinary validation correctly exposed missing actual
review, rights and linguistic-review-source records. The implemented exact-package
preview path honors the owner's subsequent exception without inventing those records.
Pending review/rights and no human audio remain visible. All 13 Arabic publications,
learner/source tables and assets are preserved. API 41/41, build and 10 focused browser
checks pass, including published preview download/offline completion/reconnection in
a disposable database. Live course/lesson labels pass. Earlier local-only results
above remain dated evidence, not a claim that hosted content is still unpublished.
F26 remains Active for review/audio/real-device/AT/Safari/pilot and units 2–12.
