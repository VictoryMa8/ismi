# Learner satisfaction — Today and completion

October 11, 2026 · F17.1 · Deployed frontend implementation

The owner authorized F17.1 implementation. This delivers the recommended first
slice from [the proposal](learner-satisfaction-proposal.md): Today hierarchy,
gold completion accents and factual lesson recaps. New sound timbres and optional
Quick recall pacing remain proposals for separate work; F17's broader gamification
and reminder policies remain open.

## Behavior

- Today leads with the character-supported next lesson and Continue, followed by
  daily progress and compact scheduled review. Up next excludes the lesson already
  shown in the primary card. Study time by track is a keyboard-operable disclosure;
  settings, review, remaining queued lessons and Courses remain accessible.
- Learner gold is distinct from red. Daily goal completion has explicit text and a
  check mark as well as gold color. Progress width updates smoothly; reduced motion
  disables that transition and completion movement. The fixed lesson frame remains.
- Completion shows actual graded turns: correct first attempts and turns where help
  was used. A retry never replaces the original first-attempt result. Help includes
  response choices and translations, so this is not an unaided recall score or a
  speaking assessment. The accessible Practiced responses disclosure copies Arabic
  and meaning from the lesson's structured correct-answer records.
- Available lesson characters use the existing encouraging portrait and fallback.
  A newly reached daily goal appears in the same completion view, with no extra sound
  or delayed next action. Completion uses one existing chime; its button suppresses
  the generic navigation chime. Persistent mute and Arabic playback suppression
  continue through the existing sound service.
- Facts describe the current lesson session, including practice and console preview;
  opening another lesson resets them. Preview/practice do not award progress or
  daily milestones. Daily minutes retain the existing estimated lesson-duration
  accounting; no actual elapsed-study or mastery claim is added.
- Offline completion and synchronization retain the existing idempotent queue.
  No backend, schema, curriculum publication, provider or account-sync scope changes.

## Verification

Production frontend build passes. Nineteen distinct targeted Chromium browser
checks pass across final/focused runs:

- Today at 390px and 1280px, Continue within the first 650 CSS pixels, queue
  deduplication, review/settings reachability, keyboard disclosures, doubled
  computed main-content text sizes without horizontal overflow and keyboard entry.
- Completion first-attempt accuracy after a wrong answer/retry, help counts,
  exact Arabic practiced response, daily milestone, next-session reset and reduced
  motion. Character previews cover eight-turn summaries, existing portraits and
  failed-image fallbacks without publishing or awarding a milestone.
- Offline completion/reload/reconnection, exactly-once progression, guest and
  account study settings, mute persistence/offline sounds, optional audio support,
  exactly one four-note completion chime, fixed lesson layout at 390/1024/1440px,
  and downloaded recording playback/missing or corrupt recording preservation.

Mobile Today and completion screenshots were visually inspected. Browser-generated
screenshots/traces remain ignored in `i-web/test-results`. The initial sandbox API
startup stalled; the checks passed outside the sandbox. One intermediate run had
two test defects (a mistaken expected fixture phrase and a Playwright evaluation
referencing a Node-side variable); both were corrected and affected checks rerun.
No app defect was inferred from those failures.

These are local Chromium checks, not a real screen-reader, Safari or learner-outcome
validation. F18's broader accessibility/browser and pilot gates remain open.

Implementation: [App.vue](../i-web/src/App.vue), [styles](../i-web/src/style.css).
Coverage: [satisfaction](../i-web/tests/satisfaction.spec.ts),
[course loop](../i-web/tests/course-loop.spec.ts),
[study settings](../i-web/tests/study-settings.spec.ts),
[sounds](../i-web/tests/ux-feedback.spec.ts),
[characters](../i-web/tests/zx-characters.spec.ts),
[layout](../i-web/tests/lesson-layout.spec.ts),
[recordings](../i-web/tests/recordings.spec.ts).

Delivery: code release `0852fec` committed/pushed and deployed October 11.
Live Today hierarchy/disclosure verified; [rollout evidence](releases/2026-10-11-satisfaction.md).
API and curriculum unchanged.
