# Recall and recombine — F22

October 12, 2026. Owner authorized implementation, push and deployment, and explicitly
selected Arabic + authored Arabizi evaluation with narrow normalization and human
reports for uncertain responses. Implementation and local checks are complete. The owner approved the exact six-situation
package on October 12. Hosted console publication and web/API delivery remain gates.

## Delivered behavior

Practice offers typed recall for completed, non-demonstrative published Levantine
lessons carrying `recall` records. The first slice adds three communicative targets
and six situations to Everyday lessons 1/3/6. Existing text, teaching, exercises,
audio and provenance are preserved. Models are exact copies of teaching cards;
new English situations, rationales and ASCII alternatives are explicit draft additions.
[Readable review](../content/levantine/everyday-01/revisions/recall/REVIEW.md),
[hashed package manifest](../content/levantine/everyday-01/revisions/recall/review-manifest.json).

Arabic/Arabizi mode, typed first response, free hint/model, comparison, retries and
skip work in the existing fixed-height lesson frame. Header/progress/actions stay
outside the single internal scroll area. No microphone, timer, premium restriction,
lesson completion, daily minutes, XP or spoken mastery is awarded.

## Evaluation and evidence

NFC, lowercase, collapsed whitespace, sentence punctuation (`.,!?،؛؟:;…`) and Arabic
harakat U+064B–0652/U+0670 are ignored. Letters (including hamza/alef forms), word
order, internal apostrophes/hyphens, transliteration diacritics and Arabizi digits
are preserved. Only separately authored alternatives match. Unknown responses are
**Unable to judge**, never an authoritative natural-language failure. Known authored
context errors explain the distinction; every accepted answer has a rationale.
Client grading and server report disposition use the same documented rules; no AI
or provider calls occur.

Device-scoped evidence stores lesson/version, target/variant, prompt exposure time,
first result and first-help flag, each attempt's time/input mode/result/help, repeated
exposure and completion time. Raw typed responses are session-only. Feedback shows
models, so subsequent retries count as assisted; retries never overwrite the first
result. Exposure is recorded before submission, so closing/reloading an already-seen
prompt cannot turn it into an unseen transfer task.

One situation per target is held back until a later elapsed-day due review after an
actual prior response. Re-exposure is labeled **Repeated situation**. Due selection
reuses F10's 1/3/7/14-day functions and review-history store under `recall:<target>`;
it does not migrate tile outcomes to production evidence or change existing intervals.
Early successes and concurrent tabs cannot accelerate intervals. Revised lesson
versions start fresh current evidence; older versioned attempts remain historical.
Explicit server withdrawal removes a downloaded package from the current session.
Offline packages cannot be remotely revoked while disconnected.

Snapshot writes are atomic IndexedDB transactions. Guest/account histories and
consented-report queues are separate. Downloads include the published recall records;
offline reload, response, retry and reconnection work. Practice refreshes current
published packages online and keeps valid downloads for ordinary connection failures.

## Optional human report

Only **Send answer for review** stores/transmits a response (max 500 characters),
optional explanation (max 500), randomized case ID, lesson/version/target/variant and
input mode. No learner/account identity is included. Offline reports persist only
following that explicit consent, can be discarded before submission, and flush on
reconnection with an idempotent ID. Rejected reports remain visible for recovery;
network/CSRF/rate failures retain the queue.

The server reconstructs target, situation, dialect/register, deterministic decision
and provenance from the exact formerly published version; private drafts and fabricated
versions cannot produce cases. Reports on superseded published downloads remain
reviewable. The owner-only console shows open/resolved cases, sources/models and an
immutable resolution/actor/time. A resolution does not edit published answers;
acceptance changes still require a validated, approved curriculum revision.
Cases remain in `RecallReviewCases` for review/audit; automatic case-retention/deletion
rules remain an F16/F18 decision. This is F22's bounded report flow, not the complete
F18 reports/quarantine system.

## Verification and delivery

- Production TypeScript/Vite/PWA build and Release API publish pass.
- All 32 API tests pass, including recall validation, known/uncertain evaluation,
  draft/publication privacy, CSRF, owner access and idempotent review cases.
- Seven F22 Playwright checks pass: evaluation boundaries, reserved/version rules,
  first/help/retry records, offline reports/reconnection, keyboard/RTL/320px/reduced
  motion/identity, withdrawal and concurrent-tab writes/scheduling.
- Six glossary checks and eleven review/scheduling/console checks have passing
  evidence. The initial combined run polluted a fixture-only checkpoint test with
  F22 test publications and hit the shared auth rate limit. Fresh-database rerun
  passed all eleven review/scheduling checks. Test approvals affect disposable
  databases only; they are not owner curriculum approval.
- Mobile render inspected. Real assistive-technology and supported-device release
  evidence and immediate/delayed learner-outcome observations remain F18 gates.

API startup adds the empty `RecallReviewCases` table; existing curriculum/account/
progress tables, recordings and cookie keys are not replaced. Current hosted source
baseline was fetched October 12: Everyday lessons 1/3/6 are v2. New packages are owner-approved files, not hosted publications. Three exact revisions
must be imported/validated/approved/published through the normal console service gates
before learners get the targets.
Code rollout is separately authorized; record web/API/content versions after release.

## Programmatic API deployment

Owner requested a better alternative to browser-driven alwaysdata updates.
[The prepared terminal workflow](../deploy/README.md) builds/packages, verifies the
existing site/SSH target, retains application/SQLite rollback, uploads by SSH/SCP,
restarts through the provider API and checks health/assets/keys. Four fixture tests
pass for install/rollback/data preservation, unsafe/corrupt archives, key changes and running-release health identity.
Actual hosting authentication and end-to-end API rollout have not been established. Frontend commit `3af91b0` is pushed/deployed, with the stable Practice entry verified; the exact API/content rollout remains pending credentials.
