# Interface copy cleanup

October 11, 2026 · F17.3 · Local frontend changes

The owner requested removal of subtitles and small quips that clutter the app.
This pass removes redundant interface copy without changing published lesson
records or the owner's landing-page wording. The prior local oval hero is preserved.

Removed or simplified:

- Dashboard loading's second sentence; the visible loading/updating status remains.
- Lesson opening's version-check subtitle; its loading label remains.
- Completion's repeated lesson goal/generic summary and “Keep building on this
  conversation.” The factual attempt/help recap, practiced responses, portrait,
  daily milestone and offline save notice remain.
- The welcome's visible “Before we let you loose” header. The dialog keeps the
  accessible name “Welcome to Ismi,” its three instructional cards and progress.
- Teaching's “A conversation worth having” and “Make the pieces work together”
  kickers, and “Learn a piece / Bring it back” prefixes. Phrase counts remain.
- The repeated pre-reveal urging to try saying/thinking a phrase. The recall cue,
  heading, Reveal phrase button and post-reveal comparison guidance remain.
- The phrase builder's all-pieces-placed subtitle; Check becomes enabled as before.
  Speaking-order, RTL and remove-piece instructions remain.
- The available-checkpoint retry subtitle and duplicated due-review sentence.
  Buttons still show the due count; next-review dates and unavailable-unit reasons
  remain. History, mistakes and review results remain available.
- The static study-settings storage/sync subtitle. Actual saved/pending/conflict
  status still appears, including guest-versus-account storage information.

Preserved: exercise instructions, answer explanations, dialect/register, content
provenance, recording/reviewer status, privacy, accessible names and cues, loading,
errors, offline notices, and outcome/assessment limitations. No new score, API,
content publication or learning behavior is introduced.

## Verification

Production frontend build and 31 targeted Chromium browser checks pass. Coverage
includes welcome/landing at 320/390/768/1440px, loading/failure/offline, teaching,
phrase building and keyboard retry, scheduled review/checkpoints, study settings
and account conflicts, completion recaps, reduced motion, character portraits and
fallbacks. Existing assertions were aligned with the removed welcome header,
builder subtitle and encouragement text. Screenshots were inspected for the
cleaner loading, teaching and completion layouts.

Implementation: [learner shell](../i-web/src/App.vue),
[welcome](../i-web/src/AppWelcome.vue), [teaching](../i-web/src/LessonTeaching.vue),
[builder](../i-web/src/PhraseBuilder.vue), [review](../i-web/src/ReviewPractice.vue),
[settings](../i-web/src/StudySettings.vue).

Delivery: owner authorized push/deployment October 11; rollout pending. API and
curriculum unchanged. F18's real assistive-technology and broader browser gates remain open.
