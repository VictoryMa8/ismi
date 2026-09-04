# Duolingo user qualms and design implications for Ismi

**Research date:** 2026-09-02  
**Purpose:** Identify recurring complaints about Duolingo's learning experience and turn them into product constraints for Ismi, without confusing vocal anecdotes with representative evidence.

## Executive conclusion

The clearest product lesson is not to reject Duolingo-style motivation. Duolingo has strong aggregate satisfaction—Google Play displayed a 4.7 rating across 46.6 million reviews when checked—and its own experiments report positive engagement from streaks, personalized practice, and even the controversial Energy system. At the same time, recent store reviews and first-person reports repeatedly describe a product that can feel as though it protects engagement and conversion metrics at the expense of uninterrupted learning. These sources are useful for discovering failure modes, but they do **not** establish how common each complaint is across all users.

For Ismi, retain bite-sized lessons, friendly progression, optional streaks, XP, mastery, achievements, spaced review, immediate feedback, and guided scenarios. Deliberately diverge in six ways:

1. **Never meter learning or punish mistakes.** No hearts, energy, or paid continuation gate.
2. **Make understanding the primary reward.** Explanations, real production, and communicative milestones outrank XP volume.
3. **Treat AI as a bounded production tool, not a source of truth.** Human-approved curriculum and source records remain canonical.
4. **Represent Arabic varieties explicitly.** Every item knows its track, region/register, accepted variants, and provenance.
5. **Make speaking feedback humble and recoverable.** Recognition failure must never be presented as authoritative proof of bad pronunciation.
6. **Give learners control.** Provide accessible settings, respectful notifications, offline downloads, review choice, and stable curriculum migrations.

## How to read the evidence

This is a **qualitative risk scan**, not a prevalence study. It uses:

- official Duolingo product posts, research papers, and investor disclosures for how mechanics work and what Duolingo says its experiments show;
- current aggregate store metadata plus individual App Store and Google Play reviews;
- direct Reddit posts as first-person reports and discussion samples.

The sampling is purposive and complaint-focused. App-store review ordering is algorithmic and geographically variable; Reddit overrepresents people motivated to post and subreddit moderation shapes what remains visible. Upvotes indicate resonance within the exposed community, not population prevalence. No public, representative survey was found that ranks these complaints across Duolingo's full user base. Accordingly:

- **Official metric** means Duolingo reported an internal result; it is still not an independent audit.
- **Recurring anecdote** means the same failure mode appeared in multiple direct-user sources or across source types.
- **Isolated/limited evidence** flags an important risk with too little evidence to rank confidently.

The high overall store rating is an essential counterweight: the complaints below should guide safeguards, not support a claim that most users dislike Duolingo. [Google Play listing and verified review metadata](https://play.google.com/store/apps/details?hl=en&id=com.duolingo)

## Findings, in practical priority order

### 1. Hearts/Energy: learning interrupted by monetization

**Evidence strength:** strongest recurring complaint cluster in this purposive sample; mechanism and business effect confirmed by Duolingo, prevalence unknown.

Duolingo describes Energy as a usage-based pacing system: exercises consume energy whether an answer is right or wrong, correct-answer streaks can restore some, and learners can watch an ad or spend gems to refill it. The company reported that its initial iOS rollout increased daily active use, median "time spent learning well," and subscriber conversion. This is unusually useful evidence because it confirms both the intended learning framing and the monetization effect. [Duolingo's Energy explainer](https://blog.duolingo.com/duolingo-energy/), [Q2 2025 shareholder letter](https://investors.duolingo.com/static-files/0b55110c-2eb9-466d-8549-5459e0851290)

The user-side failure mode is equally clear: learners report being stopped even after correct answers, uncertainty about whether they can finish a lesson, and pressure to watch ads or subscribe. The pattern appears in an App Store review, a current Google Play review, and large Reddit threads. Those reports establish a recurring objection, not its population share. [App Store review: "Hearts Were Better"](https://apps.apple.com/cy/app/duolingo-language-chess/id570060128?see-all=reviews), [Google Play review listing](https://play.google.com/store/apps/details?hl=en&id=com.duolingo), [June 2025 Energy discussion](https://www.reddit.com/r/duolingo/comments/1l8nmpt/duolingos_new_energy_system_makes_the_application/), [2025 Energy megathread](https://www.reddit.com/r/duolingo/comments/1mdzh0y/energy_megathread/)

**Implication for Ismi:** mistakes should generate teaching, not scarcity. A learner can always finish and repeat downloaded core lessons. If Ismi later needs paid limits, meter costly services transparently—such as live AI conversation minutes—not ordinary exercises, error review, grammar help, or lesson completion.

### 2. Missing explanations and removed human context

**Evidence strength:** recurring anecdote with partial official corroboration.

Users repeatedly describe getting a red/green judgment without learning *why*, particularly after sentence discussions, forums, or richer grammar notes disappeared. A March 2026 Google Play reviewer called removal of sentence discussions a major loss because mistakes can remain unexplained; long-term users similarly connect missing tips and discussions to confusion and rigid accepted answers. [Google Play review listing](https://play.google.com/store/apps/details?hl=en&id=com.duolingo), [long-term user retrospective](https://www.reddit.com/r/duolingo/comments/1hhm0uc/), [course-quality comparison](https://www.reddit.com/r/duolingo/comments/1atrelv/)

Duolingo's own later product move validates the underlying need without validating every complaint: it made "Explain My Answer" free in late 2025, saying knowing the reason behind rules and exceptions builds confidence. At the time of that announcement, coverage was limited to most learners in seven major language courses, with more promised. [Duolingo: Explain My Answer became free](https://blog.duolingo.com/explain-my-answer-now-free/)

**Implication for Ismi:** every graded item needs a concise, editorially approved explanation path: the intended meaning, the learner's specific issue, one contrastive example, and relevant register/dialect note. AI may phrase feedback from approved rules, but the rule and examples must be traceable to reviewed curriculum records. Include "report this item" and an editorial resolution trail. An open forum is optional; understandable feedback is not.

### 3. Repetition without productive difficulty

**Evidence strength:** recurring anecdote; the benefit of well-spaced review is supported by research, but public evidence does not quantify how often Duolingo's sequencing fails.

Recent learners report exact sentences or a single word recurring many times in one lesson or unit, creating recognition by screen pattern rather than retrieval from memory. Others report the opposite after course migrations: unseen vocabulary appears as already learned. [April 2026 repetition discussion](https://www.reddit.com/r/duolingo/comments/1svptbb/the_lessons_are_frustratingly_repetitive/), [November 2025 exact-repeat discussion](https://www.reddit.com/r/duolingo/comments/1p72v5t/more_repetitive/), [July 2026 course-update guidance](https://www.reddit.com/r/duolingo/comments/1uqwax0/duolingo_course_update_heres_what_to_do/)

This is not an argument against repetition. Duolingo's published research and product explanations correctly distinguish spaced retrieval from cramming and use a learner model to schedule review. The design risk is repetition that is too concentrated, too predictable, or dominated by low-effort recognition. [Duolingo spaced-repetition research](https://research.duolingo.com/papers/settles.acl16.pdf), [Duolingo explanation of spaced repetition](https://blog.duolingo.com/spaced-repetition-for-learning/)

**Implication for Ismi:** vary person, tense, intent, speaker, and setting while holding the target skill constant. Space retrieval across days; mix recognition with recall, dictation, recombination, and short free production. Let a learner test out or reduce repetition while preserving a visible mastery check. Measure delayed recall and scenario performance, not only same-session accuracy.

### 4. AI trust, content scale, and loss of human authority

**Evidence strength:** company strategy is confirmed; claimed AI-caused lesson errors are anecdotal and causality is often unprovable.

Duolingo publicly committed to faster AI-assisted content production. Its earlier description showed learning designers setting curriculum, selecting generated exercises, editing stilted output, and retaining final say. In April 2025 it launched 148 courses at once using generative AI in content creation and validation. By Q1 2026, it reported publishing 20,500 course units in one quarter, up from 7,100 per quarter in 2025 and 1,800 in 2024. [Duolingo's lesson-generation workflow](https://blog.duolingo.com/large-language-model-duolingo-lessons/), [148-course launch announcement](https://investors.duolingo.com/news-releases/news-release-details/duolingo-launches-148-new-language-courses), [Q1 2026 shareholder letter](https://investors.duolingo.com/static-files/ac220d7c-e313-4049-b309-1095fd24a86f)

Users associate the acceleration and the 2025 "AI-first" messaging with unnatural sentences, wrong translations, mispronunciations, and flattened course personality. These are credible defect reports and trust signals, but a screenshot or timing correlation cannot establish that AI caused a particular error; several users also note that bad synthetic audio and content defects predate generative AI. [February 2026 quality discussion and counterexamples](https://www.reddit.com/r/duolingo/comments/1rb3boj/the_quality_of_duolingo_has_dropped_so/), [June 2026 German-course discussion](https://www.reddit.com/r/duolingo/comments/1ujtebv/canceling_duolingo_max_and_selling_my_stock_the/), [Duolingo's public AI-first announcement](https://www.linkedin.com/news/story/duolingo-to-swap-contractors-for-ai-6785921/)

**Implication for Ismi:** keep the already selected model: humans approve the foundational curriculum and source material; AI generates only bounded variants from it. Require automated constraint checks plus reviewer sampling before release. For Quranic material, AI must never generate, rewrite, or silently normalize canonical text. Publish provenance internally for every exercise and make user-reported defects easy to quarantine.

### 5. Speaking and listening do not reliably transfer to conversation

**Evidence strength:** gap confirmed by Duolingo; specific recognition failures are recurring anecdotes.

Duolingo itself called speaking practice "historically the biggest gap" in Q1 2026 and added spoken answers, flashcards, real-world Speaking Adventures, and wider access to AI Video Call. That is strong confirmation of the category-level weakness, though not proof that every course or learner has poor outcomes. [Q1 2026 shareholder letter](https://investors.duolingo.com/static-files/ac220d7c-e313-4049-b309-1095fd24a86f)

Direct reports describe two opposite recognition failures: correct or native speech being rejected, and very weak pronunciation being accepted. Learners also say familiar app audio does not prepare them for the speed, reduction, accent range, and turn-taking of real conversation. [July 2026 speech-recognition report](https://www.reddit.com/r/duolingo/comments/1uoh8ra/horrible_speech_recognition_software/), [August 2026 native-speaker test report](https://www.reddit.com/r/duolingo/comments/1vh0pms/the_speech_recognition_exercises_are_completely/), [August 2026 real-conversation discussion](https://www.reddit.com/r/duolingo/comments/1vecxdj/how_well_does_duolingo_hold_up_in_real/)

**Implication for Ismi:** launch with the chosen controlled scenarios, but grade the communicative outcome separately from pronunciation diagnostics. Never deduct mastery solely because speech-to-text failed. Let learners replay, slow audio without changing pitch, view a transcript, record themselves, compare attempts, and choose "recognizer was wrong." Include multiple reviewed Palestinian voices and labeled Jordanian variants, then gradually add natural speed and reduced speech.

### 6. Course quality and depth vary by language

**Evidence strength:** official scope difference plus recurring anecdote.

Learners have long described a night-and-day gap between large courses and smaller ones in audio quality, explanations, stories, depth, and maintenance. [2024 course comparison](https://www.reddit.com/r/duolingo/comments/1atrelv/), [2022 cross-course comparison](https://www.reddit.com/r/duolingo/comments/wm4rag/)

Duolingo's 2026 disclosures provide a concrete scope boundary: content through CEFR B2 had reached courses teaching its nine most-learned languages. That is evidence of uneven depth, though not necessarily uneven correctness. [Q1 2026 shareholder letter](https://investors.duolingo.com/static-files/ac220d7c-e313-4049-b309-1095fd24a86f)

The Arabic-specific risk is especially relevant to Ismi. Duolingo says its course teaches MSA, while recent Arabic learners describe it as useful for script/reading but too short and not suited to everyday communication; native and advanced speakers report confusing mixtures of formal pronunciation, simplified endings, and occasionally odd sentences. Some apparent "dialect errors" are disputed by knowledgeable commenters as valid conversational-MSA simplification, so the defensible issue is often **unlabeled register**, not proven wrongness. These are first-person reports, not a formal course audit. [Duolingo's Arabic dialect guide](https://blog.duolingo.com/arabic-dialects/), [2026 Arabic learner retrospective](https://www.reddit.com/r/duolingo/comments/1tycpqy/the_arabic_course_based_on_an_arabic_speaker/), [native Arabic speaker review](https://www.reddit.com/r/duolingo/comments/10ps1j6/), [MSA-versus-dialect discussion](https://www.reddit.com/r/learn_arabic/comments/1dvxz62/does_duolingo_really_teach_you_msa_and_not_a/)

**Implication for Ismi:** narrow scope honestly and finish it well. Publish separate coverage maps for Palestinian Levantine, MSA, and Quranic Arabic. Never imply that one is a neutral form of another. Label track, register, location, gender/number, script form, transliteration, and acceptable alternatives at the content-record level.

### 7. Translation rigidity and unnatural "one right answer" grading

**Evidence strength:** recurring anecdote, especially consequential for dialect-rich Arabic; no representative error-rate data found.

Users report natural alternatives being rejected because an exercise expects one syntax or gloss, while accepted word-bank answers can encourage literal mapping from English. Duolingo has published unusually concrete scale data for this complaint category: "my answer should have been accepted" generates more than 150,000 user reports per day, while about 15% of reviewed reports result in a newly accepted translation. This does not mean 85% are bad reports; it does show that answer-equivalence is a large, continuous editorial problem. The issue is pedagogical as well as frustrating: rigid grading can teach learners that synonyms, emphasis, register, and regional variants are invalid, while loose grading can erase real contextual distinctions. [Duolingo on course-content reports](https://blog.duolingo.com/how-user-reports-improve-course-content/), [long-term user retrospective](https://www.reddit.com/r/duolingo/comments/1hhm0uc/), [German translation/context discussion](https://www.reddit.com/r/duolingo/comments/1ujtebv/canceling_duolingo_max_and_selling_my_stock_the/)

**Implication for Ismi:** use a structured answer model rather than a single string. Store accepted forms, meaning, intent, register, dialect, required concepts, and common misconceptions. When rejecting a plausible answer, explain the contextual difference. Avoid forcing MSA and Levantine into identical English glosses; show relations without erasing distinctions.

### 8. Streaks, XP, leagues, and notification pressure

**Evidence strength:** mixed evidence. Retention benefit is confirmed internally; anxiety and compulsive use are recurring but unquantified anecdotes.

Duolingo reports that learners who reach a seven-day streak are 3.6 times more likely to complete a course, and that allowing two Streak Freezes increased relative daily activity by 0.38%. This is observational plus experiment-like internal evidence for habit support, not proof that streaks cause learning for every user. In June 2026, 15.4 million users opted into a one-time streak revival, including nearly 8 million without an active streak, demonstrating strong attachment to the mechanic. [Duolingo streak design](https://blog.duolingo.com/how-duolingo-streak-builds-habit/), [Q2 2026 shareholder letter](https://investors.duolingo.com/static-files/3c8277ee-bc94-4f5d-9b77-0db3e46f88b8)

The failure mode is when the proxy becomes the goal. Users describe farming easy exercises for XP, leaderboard fixation, reluctance to stop despite poor learning, and guilt-laden reminders. Duolingo has also published a system that optimizes which daily reminder generates a completed lesson, confirming that notification engagement is deliberately optimized; the paper does not claim emotional harm. [XP/competition discussion](https://www.reddit.com/r/duolingo/comments/1s18f5u/90k_xp/), [2026 notification complaint](https://www.reddit.com/r/duolingo/comments/1ut51qt/emotional_manipulative_notifications/), [Duolingo notification-optimization paper](https://research.duolingo.com/papers/yancey.kdd20.pdf)

**Implication for Ismi:** keep streaks, XP, mastery levels, and achievements as selected, but omit leagues at launch. Make streaks optional, grant no-cost grace/freeze days, celebrate returning after a lapse, and never shame. Weight XP toward new material, delayed review, and demonstrated conversation goals; cap trivial repeat farming. Make mastery and the learner's 30-day outcomes more visually important than XP. Notifications must be opt-in by category and tone, quiet-hour aware, easy to disable, and phrased as invitations.

### 9. Ads and paywalls around pedagogically important tools

**Evidence strength:** business model confirmed; degree of annoyance is anecdotal.

Duolingo says ads and subscriptions fund free course access; Super removes ads, while premium packaging historically included unlimited hearts and practice features. In 2026 it made its Practice tab and Explain My Answer broadly free, suggesting that on-demand review and explanations are increasingly treated as core learning features. [Duolingo's free model](https://blog.duolingo.com/is-duolingo-free/), [Practice tab became free](https://blog.duolingo.com/guide-to-duolingo-practice-hub/), [Explain My Answer became free](https://blog.duolingo.com/explain-my-answer-now-free/)

Direct reports object less to payment existing than to ads, limits, or tiers being placed at the moment a learner needs to recover from a mistake, review vocabulary, or continue momentum. [Google Play review listing](https://play.google.com/store/apps/details?hl=en&id=com.duolingo), [former Super subscriber report](https://www.reddit.com/r/duolingo/comments/1kw0p55/just_canceled_super_and_finally_seeing_how_bare/)

**Implication for Ismi:** define a durable free-learning floor before pricing. Grammar explanations, mistake review, downloaded core lessons, and baseline speaking practice belong in it. Paid value should add breadth, convenience, advanced analytics, tutor-like AI time, or family features—not remove deliberately inserted friction.

### 10. Accessibility, timers, motion, and input constraints

**Evidence strength:** serious but limited direct evidence; not rankable by prevalence from available sources.

Learners with motor, visual, cognitive, autistic, or ADHD-related needs have reported difficulty with timed challenges, motion/audio clutter, path navigation, and loss of choice. A 2024 Duolingo staff request specifically asked screen-reader users and people with visual or hearing disabilities about barriers, confirming active investigation rather than a measured incidence rate. In May 2026, a blind subscriber reported that VoiceOver could no longer detect word-bank options, which would make the affected exercises impossible rather than merely inconvenient. [Duolingo staff accessibility feedback request](https://www.reddit.com/r/duolingo/comments/1c6a2kj/asking_for_feedback_on_accessibility/), [blind learner's VoiceOver report](https://www.reddit.com/r/duolingo/comments/1t0fz8d/duolingo_routinely_excludes_blind_people/), [motor and path-accessibility reports](https://www.reddit.com/r/duolingo/comments/yl5uz8/accessibility_concerns/), [animation/audio-clutter report](https://www.reddit.com/r/duolingo/comments/kxjnau/day_6000_of_waiting_for_any_accessibility_at_all/)

**Implication for Ismi:** make accessibility an MVP acceptance criterion: keyboard and screen-reader operation; semantic RTL/LTR handling; high contrast and scalable text; captions/transcripts; reduced motion and sound; no required timers; alternatives to speaking/listening; and no color-only correctness signal. Test Arabic script plus English UI with assistive technology, not only automated checkers.

### 11. Offline access is unclear and unpredictable

**Evidence strength:** limited anecdote; no clear current first-party offline specification was found.

Duolingo's Android engineering team said in June 2025 that lessons were available offline and described adding offline quest synchronization, but it did not promise selectable course downloads or state how much content is cached. Users report that cached lessons may nevertheless be unavailable, unpredictable, or fail to sync after reconnecting. The defensible finding is therefore not "Duolingo has no offline mode," but that its scope and reliability are unclear to users. [Duolingo Android offline-sync case study](https://blog.duolingo.com/android-app-performance/), [2025 paid-user offline discussion](https://www.reddit.com/r/duolingo/comments/1kbv193/paid_app_requires_internet_now/), [2025 request for full course downloads](https://www.reddit.com/r/duolingo/comments/1mg31q7/please_go_back_to_downloading_entire_language/)

**Implication for Ismi:** implement the already selected offline contract explicitly. Let users download named lesson packs with estimated size; show what is available offline; queue progress safely; resolve sync conflicts visibly; and state that AI conversations require connectivity. Test airplane-mode completion and reconnection as release gates.

## What Ismi should retain from Duolingo

| Mechanic | Keep? | Ismi version |
|---|---:|---|
| Bite-sized daily lessons | Yes | Scenario-centered sessions that fit 5, 10, 15, or 30 minutes. |
| Streak | Yes, optional | Flexible grace days; no shame, paid repair, or loss-framed alerts. |
| XP | Yes, subordinate | Award more for productive recall, delayed review, and communicative tasks; cap farming. |
| Mastery levels | Yes, primary | Evidence by skill and track, with delayed checks and clear "needs review" status. |
| Achievements | Yes | Tie to real outcomes: first full dialogue, understood headline, explained surah vocabulary. |
| Leagues | No at launch | Reconsider only if they improve learning and can be disabled. |
| Spaced repetition | Yes | Adaptive, varied, and transparent; learner can test out or request more practice. |
| Immediate feedback | Yes | Always pair correctness with an accessible "why" and accepted alternatives. |
| Guided characters/scenarios | Yes | Real partner/friend contexts, culturally reviewed, with controlled branches at launch. |
| Playful tone | Yes | Warm and encouraging; never coercive, guilt-based, or flippant around Quranic content. |
| Hearts/Energy | No | Unlimited ordinary learning and recovery from mistakes. |

## Product rules to carry into the Ismi specification

1. **Learning continuity:** a learner can always finish a started core lesson, review the mistake, and retry without paying or waiting.
2. **Explanation coverage:** 100% of graded exercise templates have a reviewed explanation and accepted-answer rationale before release.
3. **Content provenance:** every exercise links to an approved curriculum concept; Quran-related exercises also link to immutable canonical/source records.
4. **Variant integrity:** Palestinian baseline, Jordanian variants, MSA, and Quranic forms are labeled and never silently collapsed.
5. **Speech humility:** recognition confidence is visible internally; low confidence triggers retry/self-review, not an authoritative failure.
6. **Practice quality:** no mastery claim relies only on immediate repetition or word-bank recognition; delayed recall and production are required.
7. **Gamification hierarchy:** mastery and communicative outcomes outrank XP in the main progress view.
8. **Respectful motivation:** streaks and notification categories are opt-in/configurable; lapses receive a welcoming return path.
9. **Stable migrations:** published curriculum versions are immutable; upgrades produce a preview, mapping report, and targeted bridge lessons instead of silently moving progress.
10. **Offline contract:** downloaded lessons, audio, exercises, and queued progress pass airplane-mode and reconnection tests.
11. **Accessibility gate:** core study works with keyboard and screen reader, reduced motion, captions/transcripts, scalable Arabic, and without timers or mandatory audio.
12. **Metric discipline:** optimize and report learning measures—delayed recall, scenario completion, intelligibility, and 30-day outcomes—alongside retention and revenue. Do not accept an engagement lift if it materially worsens lesson completion, trust, or accessibility.

## Research gaps worth validating with Ismi users

Before treating any of the above as market prevalence, run interviews and usability tests with the actual audience: English-speaking false beginners with Palestinian/Levantine partners or friends, including Muslim learners interested in Quranic Arabic. The highest-value questions are:

- Which feels worse: interruption after a mistake, repetitive low-effort review, or lack of explanation?
- How much transliteration support is reassuring versus dependency-forming in Levantine?
- Which Palestinian/Jordanian differences cause real household misunderstandings?
- What pronunciation feedback feels credible, especially across gender, age, and regional voices?
- Does a flexible streak motivate without anxiety? Which reminder tones feel welcome?
- What must be downloadable before travel, family visits, commuting, or unreliable connectivity?
- Which features must remain free for the promise "Speak with the people you love" to remain honest?

Quantitatively, Ismi should track lesson-abandonment reasons, explanation opens, rejected-alternative reports, speech retry/override rates, delayed recall, notification opt-outs, offline sync failures, and progress toward the selected 30-day outcomes. Those measures will be more useful than copying Duolingo's engagement metrics or assuming Reddit represents the market.
