# Learner clarity fixes · October 18, 2026

Contract: Practice titles and descriptions remain readable at mobile widths and enlarged text; no AI-assisted draft prefix on unreviewed notices; study/course/lesson wording is explained briefly; Today has one primary action for the saved lesson; grace remains automatic without learner-facing counters/rules; weekly activities are hidden behind an optional control and off for new learners; French/Khmer scenes show Fattoush and Knafeh with authored dialogue/answers intact.

This is application presentation work. It does not publish revised curriculum, accept linguistic/source rights review, supply audio or establish real-device/accessibility evidence.

Implementation:

- Practice uses one column at narrow widths and wraps the full title/description rather than ellipsizing them. Desktop keeps two columns.
- Today removes the unexplained weekly counter. Weekly activities live inside a collapsed optional Progress control, with a Monday–Sunday explanation and off-by-default state for new learners. Existing saved choices persist.
- Grace calculations and saved streak evidence are unchanged; counters and grace rules are absent from learner copy.
- “Your plan” becomes “Today’s lessons”; Courses briefly explains course vs. lesson. “Recall” becomes “Write a response,” with a short explanation and hints.
- A started lesson takes priority in Today’s main card, including after offline reload. The separate global resume button is removed.
- Unreviewed status, pending rights/review and missing audio remain visible; the AI-assisted draft prefix is removed in presentation only, including older downloaded notices. Persisted API notice constants retain their original text because publication authorization checks them exactly.
- Fattoush and Knafeh act out French/Khmer scenes. Labels identify the existing roles (Alex/Camille, Alex/Sam or Host/Guest) because the exact published self-introductions and accepted answers still use those names. This is an explicit presentation mapping; it does not rename target-language text or mutate packages, versions, hashes or progress. Existing authored character mappings take precedence.

Verification · October 18:

- Production TypeScript/Vite/PWA build passed.
- 45 distinct focused Chromium checks passed across feature hubs, French/Khmer drafts, habits, course switching, satisfaction, study settings and typed-response/can-do flows. The initial run passed 42; three stale assertions for removed controls/renamed text were corrected and all three passed their targeted rerun.
- Two API exact-package preview-policy checks passed for French and Khmer, retaining normal review/publication gates.
- Automated layouts cover 320/390/1280 px, enlarged text, keyboard, separate course/account progress and offline/reconnection. The new resume check starts a different lesson, returns to Today, reloads offline and resumes the same teaching stage through the single main card. All five draft scenes per language assert shared character portraits and unchanged authored phrases.
- Mobile Practice and Today-resume renders inspected. Roadmap schema/links and whitespace checks passed.

The owner subsequently requested “commit and reploy.” The UI fixes were delivered from `30a393e`. A persisted-notice regression was subsequently corrected in source `34a936b`; the working API was restored to `08fed75`, and all ten French/Khmer preview URLs pass fresh checks. [Deployment evidence](releases/2026-10-18-learner-clarity.md) records the rollout separately from curriculum publication. Physical iPhone, Safari and real assistive-technology checks are outside this automated evidence.
