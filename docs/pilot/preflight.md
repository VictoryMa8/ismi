# Accessibility and offline preflight

Status on September 30, 2026: **not run as part of pilot preparation**. The historical
[walkthrough](../../content/levantine/everyday-01/walkthrough.md) reports automated
keyboard/offline checks; those are not current real screen-reader evidence.

Record tester/date, app revision, content version, browser/OS, screen reader and
version, voice/language configuration, and device. Run on the intended pilot setup.
For an initial desktop check, use macOS VoiceOver with Safari if available; add the
participant's actual setup if different. Browser/assistive-technology support is
not established by listing a suggested pairing here.

For every row record pass/fail/not tested, exact behavior, and issue/retest link.
A real tester must verify what the screen reader announces, not infer it from DOM
attributes. Do not call the accessibility release gate passed on this checklist alone.

| Check | Expected observable behavior | Result / evidence |
| --- | --- | --- |
| Keyboard entry | Skip link reaches main content; Today, Courses, Practice, Account are reachable and identify the current page. Focus remains visible. | Not tested |
| Open lesson | Open Everyday lesson 1 with keyboard. Dialog title is announced; focus enters it; Tab and Shift+Tab stay inside. | Not tested |
| Read mixed-language dialogue | Navigate Fattoush/Knafeh turns with the screen reader. Speaker, Arabic, transliteration and English remain in meaningful order. Arabic language switching works with configured voices; record actual pronunciation/voice limitations. | Not tested |
| Help and notes | Toggle English help and dialogue/notes; their state and content are understandable without sight. Transliteration remains available. | Not tested |
| Select and submit | Instruction, each complete answer and selected state are announced. Submit is reachable without pointer input. | Not tested |
| Wrong answer / retry | Choose a documented distractor. Explanation is reachable/announced; failure is conveyed with words, not only color. Retry gives a clear location and permits another answer. | Not tested |
| Correct / next / finish | Next instruction and completion are announced; no lost focus or trapped control prevents completion. | Not tested |
| Close / reopen | Escape and Close work; focus returns to the opening control. Reopening for practice works. | Not tested |
| Text scaling | Increase browser zoom to 200% and text size where supported; Arabic letters/marks and all controls remain readable without clipped answers. Check narrow mobile viewport too. | Not tested |
| Contrast / motion | Check text and focus visibility with the participant's contrast settings and reduced motion enabled; note any animation or information loss. A full contrast audit remains separate. | Not tested |
| No audio / no speech | Complete using visible text with device speech off and no spoken response required. | Not tested |
| Offline status | Network and queued progress status are understandable with keyboard and screen reader. | Not tested |

If a core task blocks access, fix and retest before involving a learner who depends
on that accommodation. Preserve an honest “not tested” for missing equipment or
an unperformed check; do not infer a pass from automated tests.

## Separate offline new-completion check

Use a dedicated test profile, not a participant's existing progress or the owner's
account. Avoid private browsing. This check deliberately completes one new lesson;
participant practice after completion cannot verify new queued completion credit.

1. While online, open the target published lesson to cache it. Record its ID/version
   and baseline course completion/progress. Do not finish yet.
2. Close the lesson, disconnect the browser/device, reload the app, and reopen the
   same lesson. Confirm the dialogue, choices and explanations remain available.
3. Complete it offline, including an incorrect choice and retry. Record the pending
   sync indication and locally completed state.
4. Reload while offline. Confirm the completion survives and the lesson can be reviewed.
5. Reconnect. Allow synchronization to finish, then reload online. Confirm the
   completed state remains and that progress increases only once from baseline.
6. Reconnect/reload again and review the completed lesson. Confirm no additional
   completion credit. Do not use repeated retries to manufacture XP.

Record failures, browser console/network details without tokens or cookies, and
reproduction steps. Restore connectivity even after failure. Do not clear offline
storage while events are pending. An API outage can defer sync; log it separately
from loss of the locally saved completion.
