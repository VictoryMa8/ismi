# Learner satisfaction proposal

October 11, 2026 · F17.1 · Original design proposal.

The owner subsequently authorized implementation. The recommended first
Today/color/completion slice is now [implemented locally](learner-satisfaction.md).
Sound audition and optional Quick recall below remain proposals.

The owner requested ideas for a friendlier dashboard, satisfying sounds,
word-guess countdowns and richer color. The existing Vue implementation and
hosted Today page were inspected. These are design hypotheses to test, not
claims of proven retention or learning gains.

## What exists

- Today greets the learner and shows daily progress, then allocations, scheduled
  review and a numbered queue before the next-lesson card. The visible hosted
  dashboard confirmed that the large lesson card falls below the plan list.
- The next-lesson card already uses solid green and red with character support.
- `uiSounds.ts` already provides tap, advance, reveal, correct, retry and complete
  chimes, interaction-only playback, persistent mute and suppression during prompts.
- Word tiles have a raised edge and press feedback; lessons already use stable
  frames and reduced-motion-aware transitions. Extend these rather than rebuild them.
- The learner CSS currently maps `--gold`, `--gold-soft` and `--gold-bright` to red
  values. Landing gold exists, but a distinct learner gold could add warmth.

## Recommended first slice: Today and completion

1. Keep “Marhaba, [name].” and bring the character-supported next lesson directly
   underneath it. Make Continue the obvious primary action on mobile and desktop.
2. Place daily progress nearby, followed by a compact review action and a short
   “Up next” list. Keep allocation/edit details available in a disclosure rather
   than repeating the next lesson as both a queue entry and a large card.
3. Use deep green for the lesson surface, warm gold for daily achievement and
   completed markers, and red for selected accents. Keep reading areas ivory or
   white. Preserve text/icons alongside feedback colors and verify contrast.
4. On completion, show a short, factual recap based on existing records: practiced
   phrases, first-answer recall and help used where actually measured. Avoid
   “mastered” or “you know N words” claims based solely on completing a lesson.
5. Update progress smoothly, show a brief character encouragement and play one
   completion chord. A daily-goal milestone may use a small gold flourish; coalesce
   simultaneous milestones so several sounds/celebrations do not fire together.
   Reduced motion receives the same information without movement. Keep the lesson
   frame height fixed and the next action available immediately.

Acceptance checks for a future authorized slice: Continue is visible early at
390px and desktop sizes; all queue/review/settings actions remain reachable;
completion summaries match real results; 200% text and keyboard use fit; mute,
reduced motion, offline completion and Arabic playback remain functional.

## Sound direction

Make individual sounds more recognizable and tie them to meaningful actions:

| Moment | Candidate sound | Matching visible feedback |
| --- | --- | --- |
| Place a word tile | Very short, soft wood-like click | Tile settles into its slot |
| Correct response | Warm rising pluck | Check mark and concise explanation |
| Try again | Quiet neutral note | Helpful distinction and immediate retry |
| Reveal help | Gentle two-note cue | Meaning/help becomes visible |
| Complete a lesson | Brief resolved chord | Phrase recap and progress update |
| Complete the daily goal | Distinct variation of the completion chord | Gold goal marker |

Reduce generic navigation clicks if they compete with the learning sounds.
Candidate sound lengths/timbres need an actual audition before adoption. Retain
local offline synthesis and persistent mute; consider Subtle / Expressive / Off
only if two levels offer an audible, useful difference. No background music,
spoken praise over Arabic or repeated countdown ticking is proposed.

## Optional word-guess countdown

Recommend a “Quick recall” option in Practice for already-studied Levantine
material, leaving ordinary lessons and assessments self-paced. Let the learner
choose untimed or a candidate 15/30/60-second pace. Those durations are starting
design options, not established pedagogical targets.

Start only after the learner reads the context and selects Ready. Use a calm
number/ring, with no per-second screen-reader announcement or urgent red flashing.
Pause during help, Arabic playback and a hidden tab. At zero, stop the countdown
and offer “Keep thinking” and “Show help”; preserve the response and allow normal
submission. Expiry alone must not mark the answer wrong, reveal it, advance the
card or affect XP, streaks or core completion. Keep retry and an equivalent
untimed route freely available. Speed should not be presented as mastery.

This follows Ismi's no-mandatory-timer constraint and
[W3C timing guidance](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html),
which calls for control over time limits. Keep the initial experiment separate
from Quranic study and new phrase teaching. Timer value should be assessed with
learner feedback before expanding it.

## Later possibilities

- A compact unit journey showing completed conversations, next lesson and
  checkpoint; each marker remains accessible and shows honest completion status.
- A weekly practice reflection using real activity and recall data, without
  equating minutes/XP with fluency or mastery.
- Authored character reactions for meaningful moments using existing supported
  expressions. Any new Arabic/cultural dialogue follows curriculum review.

Recommend the Today/color/completion slice first, sound audition second, and
optional Quick recall third. These proposals do not settle streak, XP, mastery,
reminder policy, new artwork, provider choices or any deployment.

## Hero request reconciliation

The current landing hero image is already border-free in the checkout and live
site. Hosted computed border was `0px none` and outline style `none`; the rendered
image was inspected October 11. The old documentation and saved previews showed
an outline. The instruction/documentation were reconciled without a code change.
