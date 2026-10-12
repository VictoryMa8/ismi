# Loading word reel

October 12, 2026 · F17.4 · Deployed frontend implementation

The owner requested a more stimulating loading animation, with words rolling
through transliteration, Arabic script and English meaning like a slot machine.
The existing loading/retry/offline behavior remains the foundation.

## Display and controls

The loader now uses a deep green surface, a gold transliteration/meaning face,
a white Arabic face, and a vertical roll between faces. Each face lasts 1.6 seconds,
including a 400ms transition, before the next form appears. After the English
meaning it moves to the next word. The reel viewport stays the same height.
Startup uses the full display; background plan refresh uses a compact version.

Pause holds the current word/form; Resume continues from it. Hidden documents stop
the interval and resume on visibility. Reduced motion stops the timer and movement,
showing the current transliteration, Arabic and meaning together. Preference changes
are honored immediately. The interval and listeners are cleared on unmount.

The screen-reader loading status is a separate polite live region. The animated
faces are decorative; a normal group label exposes the current word's three forms
without announcing each animated face. The loading indicator has no additional
sounds, forced delay, assessment or progress award. Ready content appears immediately,
even halfway through a word. The existing optional interface-sound controls remain.

## Source boundary

Six samples are copied exactly from existing approved Everyday glossary records:
shukran, shāy, ʾahwe, il-yōm, bukra and āh. English meanings are thank you, tea,
coffee, today, tomorrow and yes. These are Palestinian Levantine samples, not
MSA/Quranic curriculum or evidence that the learner knows these words.

[The bundled records](../i-web/src/content/loading-words.json) retain entry and
lesson IDs, source locators, package paths and SHA-256 hashes from the pinned
[glossary catalog](../i-web/src/content/glossary-catalog.json). No linguistic text
is generated, normalized or silently corrected. The samples are available before
network requests finish and offline; no new curriculum publication is performed.

## Verification

Production build and nine distinct targeted Chromium checks pass across runs:

- Exact sample text/source matching and hashes against the approved packages.
- Complete transliteration → Arabic → meaning → next-word sequence with a
  controlled clock; keyboard pause/resume; stable reel/card height; Arabic language
  and RTL attributes; simulated visibility pause/resume; ready-dashboard replacement.
- Real-time animation settles to full opacity and no transform between rolls.
- Reduced motion's still triplet and live preference changes; no horizontal overflow
  at 320/390/1280px or doubled root text size.
- Existing startup/session/dashboard loading, retry, usable background refresh,
  cached offline reload, Today hierarchy and completion recap behavior.

Mobile Arabic and enlarged/reduced-motion renders were inspected.
[Preview](loading-word-reel-preview.png). The animated sequence test uses virtual time;
real-time rendering was checked separately because CSS animation snapshots can
capture a transition frame under a paused clock. The initial test-only JSON imports
were corrected to include Node's required import attributes.

Implementation: [LoadingWords.vue](../i-web/src/LoadingWords.vue),
[learner integration](../i-web/src/App.vue).
Tests: [word reel](../i-web/tests/loading-words.spec.ts),
[loading/offline](../i-web/tests/dashboard-loading.spec.ts),
[satisfaction](../i-web/tests/satisfaction.spec.ts).

Delivery: code release `7bb2c22` pushed/deployed October 12;
[live rollout evidence](releases/2026-10-12-word-reel.md). No API changes or curriculum publication. Real assistive-technology/browser release gates stay under F18.
