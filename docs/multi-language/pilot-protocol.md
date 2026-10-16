# F24 mixed-language verification and observed pilot

Prepared October 15, 2026. This is an execution protocol, not recorded pilot evidence.
It does not resume the deferred Arabic F18.1 rehearsal or authorize participant contact.

## Candidate and setup

Before a human learning session, record exact F25.2/F26.2 first-unit IDs/versions,
source/rights and linguistic-review dispositions, model audio hashes and owner
approval. Engineering fixtures may verify transport/layout but cannot be used as
outcome evidence. Resolve critical text, recording, source and progress defects first.

Proposed expansion matrix: iPhone/Safari with VoiceOver, Android/Chrome with TalkBack,
desktop Chrome keyboard, and macOS Safari/VoiceOver. The existing Arabic pilot target
is iPhone/Safari; its real-device checks remain deferred. The expansion matrix and
available tester/device details require owner agreement. Playwright Chromium/WebKit
results are supplemental, never substitutes for this matrix.

Record OS/browser versions, viewport, text size, installed/tab mode, keyboard/input
method, screen-reader language/voice configuration, app build and actual downloaded
package versions. Use separate test guest/accounts and preserve their pending-event
snapshot before upgrade; do not put identifiable participant data in Git.

## Technical and accessibility tasks

1. Open an existing Arabic download with pending progress after upgrade. Verify exact
   text/version, identity scope, accepted answer explanations and exactly-once sync.
2. Find the labeled selector on Today without directions. Switch Arabic → Khmer and
   back. Record taps, hesitation, announcements and any misleading availability.
   Check Today/Courses/Practice/Progress/Words, a planned course and a missing download.
3. Start an Arabic lesson, leave during teaching and a partly built response, switch
   to Khmer and start another lesson. Return/reload/resume each. Check language,
   script direction, prompt, help, pieces, step and progress independently. Change
   viewed course without changing primary course, then remove/re-add a selected course.
4. Exercise all supported course templates with keyboard and the actual screen reader.
   Record focus order, target/help/English announcements, feedback, character attribution,
   dialog exit/resume and scroll cue. Use enlarged text and reduced motion. Inspect
   Khmer combining/stacked text and authored segments without inserting spaces.
5. Type/select Khmer using the actual mobile input method. Verify caret/selection,
   composition, deletion and help. Only assess supported input templates; text selection
   is still necessary even when typed recall is unavailable for that course.
6. Download the approved lessons/fonts/audio, interrupt an update and reload offline.
   Verify the prior complete version survives. Complete a lesson, switch course, reload,
   reconnect twice and verify one event/reward and correct independent progress.
7. Test a missing/wrong-language device voice, failed model recording and a text-only
   route. No task may require listening, speaking or a timer to make core progress.
8. Withdraw an exact candidate online, refresh, then try its former cached entry.
   Restore an explicitly selected validated prior version. Verify availability,
   wording, glossary, review, placement, pending events and audit history.

Record observed behavior and a concrete defect/retest disposition per task. An access,
progress or integrity blocker stops a release recommendation.

## Observed learning tasks

The owner selects consenting adult participants and the first-unit rubric before
contact/session scheduling. Include Khmer-only and Arabic/Khmer study journeys;
include French/parallel study once its first-unit candidate exists. Do not assume
a participant knows Arabic or that the combined time budget promises every course's
single-language 30-day outcome.

For each approved lesson/unit, record the taught communicative target, changed
situation, attempted response, meaning/intent fit, help, attempt count and content
version. Separate spoken interaction, listening, written recall and script reading.
Use an immediate task and a later due/new-context task on an agreed date. A rendered
word, completed lesson or one successful learner does not establish general literacy,
fluency, CEFR level or course effectiveness. Use actual reviewed course-specific
rationales rather than AI judgments of uncertain language.

## Evidence record and decision

Copy `release-manifest.template.json` for the selected candidate. For each task record:
`taskId`, anonymous participant/device key, `contentVersions`, `observedAt`, `response`,
`helpUsed`, `attemptCount`, `result`, `defectIds`, `retestAt`, and a reference to the
private observation record. Keep raw recordings out of the evidence bundle unless
separate informed consent and retention rules specifically allow them.

After fixes/retests, the owner decides whether to publish exact units, run another
pilot, release the software alone, or widen beta scope. Record frontend/API/content
versions separately, retention/withdrawal support, rollback baseline and live/offline
checks. No participant recruitment, beta expansion, rollout or content approval is
implied by preparing this protocol.
