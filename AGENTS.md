# Ismi Project Context

## Purpose

Ismi is a web-first Arabic learning product inspired by Duolingo, focused exclusively on:

1. Urban Palestinian Levantine Arabic, with Jordanian variants labeled where useful.
2. Modern Standard Arabic (MSA).
3. Quranic Arabic.

Users may study any one track or any combination of the three. The user has confirmed enough shared understanding to begin bounded vertical-slice implementation. Continue to resolve open product decisions explicitly before they become architecture or policy commitments.

## Primary audience and promise

- First users are false beginners who already know enough Arabic for basic questions or directions.
- The primary audience is English-speaking people with Levantine partners or friends; many may also be Muslim.
- The initial release is for adults age 18 and older.
- Launch as an invite-only English-language beta without a broad geographic availability promise.
- Product tone is warm, mature, relationship-centered, and lightly playful in ordinary practice. Quranic lessons use a restrained and respectful tone.
- Lead with the emotional promise: **"Speak with the people you love."**
- Supporting promise: **"Understand Arabic from conversation to Quran."**
- The long-term aspiration is fluency, but short-term outcomes must remain measurable and realistic.

## Settled product decisions

### Curriculum scope

- Levantine is the flagship track.
- Launch target: 12 weeks of Levantine content and 4 weeks each of MSA and Quranic Arabic.
- Levantine uses urban Palestinian as the primary model and labels Jordanian alternatives.
- Quranic Arabic is comprehension-first. Teach decoding and pronunciation, but not detailed tajwid in the initial product.
- Connect related words, roots, meanings, and register differences across tracks when useful; do not force the three curricula into identical vocabulary sequences.

### Thirty-day outcomes at 15 minutes per day

- Levantine: hold a five-minute guided conversation about topics such as the learner's day, plans, food, family, or directions without switching to English.
- MSA: understand common headlines and the gist of a one-minute learner-adapted news segment, then answer comprehension questions.
- Quranic Arabic: read and explain the core vocabulary and direct meaning of Al-Ikhlas, Al-Falaq, and An-Nas.

### Learning experience

- Base lessons on real-life scenarios and short dialogues, followed by vocabulary and grammar reinforcement.
- Build daily goals from five-to-seven-minute micro-lessons.
- Provide a recommended course path with unit checkpoints while keeping review and practice freely accessible.
- Teach grammar through concise in-lesson explanations plus searchable reference guides.
- Arabizi/transliteration remains available throughout Levantine lessons.
- MSA and Quranic lessons prioritize Arabic script, with vowel marks and tap-for-help support.
- Users select a daily goal; offer 5, 10, 15, and 30 minutes, defaulting to 15.
- A personalized daily queue distributes study time across selected tracks while preserving separate progress per track.
- When multiple tracks are selected, the learner chooses one primary track; remaining time is distributed across secondary tracks, with adaptive review inside each allocation.
- Offer a short, skippable placement assessment for each selected track rather than one combined Arabic score.
- Use placement results to recommend alphabet, reading, and sound bootcamp modules.
- Launch speaking practice uses controlled, scripted conversation branches with AI feedback.
- Speaking assessment rewards intelligibility, an appropriate response, and clear production of important sounds rather than imitation of a single native accent.
- Downloaded lessons, audio, exercises, and progress must work offline. AI conversations may require internet access.
- Anchor core Levantine audio in recordings from multiple reviewed Palestinian speakers across gender and age; add Jordanian variants deliberately. Do not rely on text-to-speech as the sole source for core lessons.
- Launch MSA listening with timeless, learner-adapted news-style segments. Add licensed current-news material only after the content and licensing operation can support it.

### Gamification

- Use streaks, XP, mastery levels, and achievements.
- Do not use a punitive heart/energy system that prevents learners from continuing after mistakes.
- Omit competitive leagues at launch.
- Make streaks optional and forgiving, with no shame-based reminders or paid streak repair.
- Include free grace days, configurable reminder categories, quiet hours, and welcoming return messages after a lapse.
- Treat mastery and communicative outcomes as primary; XP is subordinate and should not reward trivial farming.

### Deliberate departures from Duolingo

- A learner can always finish a started core lesson, inspect an explanation, review mistakes, and retry without paying or waiting.
- Never meter learning with hearts or energy.
- Every graded exercise template requires a reviewed explanation and accepted-answer rationale.
- Use structured accepted answers rather than one exact string. Track meaning, intent, dialect, register, required concepts, and plausible alternatives.
- When rejecting a plausible answer, explain the contextual distinction.
- Space repetition across varied communicative contexts; do not pad paths with concentrated recognition drills.
- Keep core grammar explanations, mistake review, baseline speaking practice, and downloaded core lessons outside premium tiers.
- Make reminders opt-in, quiet-hour aware, easy to disable, and welcoming rather than guilt-based.
- Make accessibility and deterministic offline behavior release gates.
- Publish track depth, dialect/register, reviewer status, and content provenance honestly.

### Free learning floor

The following must remain available without a paid subscription:

- Core lessons.
- Grammar and answer explanations.
- Mistake review and retries.
- Downloaded core lessons and offline progress.
- Baseline speaking practice.

Potential paid value may include additional AI conversation time, expanded content, advanced analytics, and family features. The exact paid model and pricing remain unresolved.

### Business model

- Use a freemium subscription with no third-party advertising.
- Do not create artificial learning friction to drive conversion.
- Exact monthly, annual, family, trial, and regional pricing remains unresolved.

### Answer evaluation

- Grade against reviewed structured answer records first, not one exact string.
- AI may identify plausible meaning-equivalent alternatives, but it must not authoritatively reject uncertain natural language.
- Route uncertain or frequently disputed answers into a human review queue.
- Preserve dialect, register, intent, grammatical constraints, and teaching target when accepting variants.

### Accessibility release gate

Core study must work with keyboard and screen reader, scalable Arabic text, high contrast, captions/transcripts, reduced motion, and alternatives to required listening or speaking. Do not use mandatory timers or color as the only correctness signal. Test mixed RTL Arabic and LTR English/Arabizi with assistive technology before release.

### Accounts and privacy

- Let users begin as guests. Require an account only for durable or cross-device synchronization.
- Delete raw voice recordings promptly after feedback is produced.
- Retain derived scores and learning progress; retaining recordings for product improvement requires separate informed opt-in consent.
- Use AI and speech providers/configurations that prohibit training on learner data, accept only the minimum necessary data, and support deletion.
- Any future research-data contribution must be a separate opt-in, not a condition of learning.

### Correction and publication workflow

- A learner report creates a versioned review case containing the exercise, learner response, dialect/register, source records, AI decision, and learner explanation.
- Severe or Quran-related integrity reports can quarantine affected content pending review.
- The MVP requires an internal curriculum console covering draft creation, provenance, AI output, deterministic validation, human approval, publication, rollback, and audit history.
- Do not permit direct community edits to published curriculum.
- For the initial beta, the user is the final human publication approver and AI assists within the approved-source constraints.
- The beta does not have committed native curriculum reviewers or a qualified Quranic Arabic reviewer. Do not describe content as native-expert-reviewed, scholar-reviewed, or theologically authoritative. Exclude uncertain interpretive material instead of asking AI to resolve it.

## First-100-user beta boundary

The initial release is a free, invite-only beta containing:

- The mobile-first learner web app.
- The internal curriculum review console.
- Twelve weeks of Levantine and four weeks each of MSA and Quranic Arabic.
- Downloadable/offline core lessons and queued progress synchronization.
- Controlled, guided speaking scenarios with online AI feedback.

Do not include billing, a social network, or a live-news content operation in this beta.

### Beta release gates

- Published content is source-linked, deterministically validated, and approved through the review console.
- Offline lesson completion and reconnection pass on supported browsers.
- The accessibility release gate passes for all core exercise types.
- No unresolved critical Quranic text, provenance, licensing, or meaning defects remain.
- A smaller pilot provides evidence that the curriculum can produce the intended track outcomes before opening the full first-100 cohort.

## Technology direction

- Web only for the initial release.
- ASP.NET backend and Vue frontend; the browser client must be PWA-capable.
- Design the learner experience mobile-browser first while keeping it fully usable on desktop. Design the internal curriculum console primarily for desktop.
- The beta account slice uses ASP.NET Core Identity, HttpOnly cookie sessions, and a local SQLite database; the production hosting/database and any external authentication providers remain unresolved.
- Keep AI and speech-provider credentials server-side.
- Offline behavior will require a PWA-capable client, local lesson/progress storage, and later synchronization.

## Current implementation

- The active repository uses the root-level directories `i-api`, `i-web`, and `i-tests`.
- The Vue PWA displays a mobile-first three-track dashboard and loads a four-step demonstrative Levantine lesson from the ASP.NET API.
- Downloaded lesson packages, the last dashboard snapshot, and pending completion events are stored in IndexedDB. The client can grade the downloaded structured evaluation records offline and retries idempotent completion events after reconnection.
- The API exposes dashboard, lesson, attempt, and completion endpoints. Authenticated progress is stored in SQLite and survives API restarts; guest server progress remains intentionally in memory, with the browser's offline queue handling reconnection.
- Levantine prompts currently offer an explicitly labeled browser/device voice preview when no reviewed recording is available; voice availability and pronunciation vary by device.
- Optional accounts support registration, login, logout, remembered browser sessions, and persistent per-user lesson progress while preserving guest study. Email confirmation, password reset, account deletion, and external identity providers remain unimplemented.
- An owner-email-gated curriculum console now supports versioned Levantine drafts, provenance records, deterministic validation, human approval, publication, audit history, and rollback. Learner lesson endpoints serve only the currently published database version; the original demonstration lesson is migrated into that store on first startup.
- The MSA and Quranic cards, reviewed lesson audio assets, navigation destinations, broader curriculum authoring experience, and production content workflow remain unimplemented. The bounded console explicitly rejects MSA and Quranic publication.
- Seed Arabic is demonstrative and must not be described as reviewed launch curriculum.

## Content and AI guardrails

- Humans approve a foundational curriculum and trusted source material.
- AI may create bounded exercises from approved material; it is not the canonical source of linguistic or Quranic truth.
- Never generate, rewrite, or silently normalize canonical Quran text.
- Keep canonical Quran text, translations, morphology, recitation audio, commentary, and AI-generated exercises as separate, provenance-bearing records.
- Proposed canonical baseline: self-host unchanged Tanzil Quran Text v1.1 with its required attribution, version, retrieval date, and hash.
- Proposed managed integration: Quran Foundation Content API v4 for specifically approved translations, word-level content, metadata, and recitation resources. Keep it behind ASP.NET, use Content Sync where permitted, sync at least every seven days, and obtain written confirmation for every production resource ID and its commercial/storage rights.
- Proposed morphology layer: version-pinned Quranic Arabic Corpus v0.4, stored separately from canonical text and aligned through audited verse/word mappings rather than raw character offsets.
- Treat KFGQPC data as an official comparison source unless and until the exact package's commercial redistribution rights are confirmed in writing.
- Tanzil translations are not cleared for commercial use by default; do not treat the Tanzil Quran-text license as a license for translations.
- Distinguish direct textual meaning from interpretation or tafsir.
- AI receives only approved source-record IDs and may draft structured exercises. Application code copies scripture, translations, morphology, and citations from trusted records. Deterministic validators and a human publish gate are mandatory.
- This source and AI boundary is the adopted working standard, subject to written confirmation of the exact commercial translation, word-level, and audio resource rights.

## Research references

- `docs/research/quran-api-research.md` contains the source, licensing, provenance, caching, and AI-boundary analysis.
- `docs/research/duolingo-user-qualms.md` contains the evidence-backed Duolingo critique and Ismi design implications.

## Open decisions

- Final approved Quran translation, word-level, morphology, and recitation resource IDs and written permissions.
- Subscription pricing, trials, family plans, and regional pricing.
- External authentication providers, production account recovery/email delivery, analytics, and detailed data-retention periods.
- Speech recognition, recording, pronunciation-scoring, and AI providers.
- Production database, content schema, curriculum authoring/review workflow, and admin tooling. SQLite is adopted only for the bounded beta account slice.
- Moderation/safety policy and invite-only beta cohort selection.
- Criteria for selecting the smaller pre-beta pilot and the full first-100 cohort.
- Whether and when to add native Palestinian/Jordanian curriculum review and qualified Quranic Arabic review after the initial beta.
- Visual identity, mascot, tone, and notification strategy.

## Working rule for future agents

Treat the settled decisions above as constraints. Investigate facts instead of asking the user for information available in the repository or reliable primary sources. Put unresolved product decisions to the user with a recommended answer. Do not silently broaden scope or treat an aspiration such as "fluency" as a measurable release criterion.
