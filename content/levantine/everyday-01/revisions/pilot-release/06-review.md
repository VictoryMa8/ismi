# 6. What are we doing tomorrow? — release review

Unapproved October 3 candidate. Exact package: [06-lesson.json](06-lesson.json).

## Dialogue

**Fattoush**

شو رح نعمل بكرا؟

Shū raḥ niʿmal bukra?

What will we do tomorrow?

**Knafeh**

نزور أهلي بعد الشغل؟

Nzūr ahli baʿd ish-shughl?

Shall we visit my family after work?

**Fattoush**

تمام. أي ساعة؟

Tamām. Ayy sāʿa?

Okay. What time?

**Knafeh**

الساعة ستة.

Is-sāʿa sitte.

At six o’clock.

**Fattoush → Knafeh**

تمام، بكرا الساعة ستة نزور أهلك.

Tamām, bukra is-sāʿa sitte nzūr ahlak.

Okay, tomorrow at six we’ll visit your family. (to Knafeh)

**Knafeh**

وبعدين نشرب شاي سوا.

W-baʿdēn nishrab shāy sawa.

And afterwards we’ll drink tea together.

## Teaching cards

Read the unchanged [guided teaching review](../guided-teaching/06-review.md).

## Practice and feedback

### e06-01

Instruction: Ask about tomorrow’s shared plan, not yesterday’s actions.

Roles: {}

Prompt: بكرا · Bukra · Tomorrow

- a: شو عملت اليوم؟ · Shū ʿmilt il-yōm? · What did you do today? (to Knafeh). Rationale: This asks Knafeh what he already did today.
- b: شو عامل؟ · Shū ʿāmel? · How are you doing? (casual check-in to Knafeh). Rationale: This checks in with Knafeh instead of asking about tomorrow’s shared plan.
- c (accepted): شو رح نعمل بكرا؟ · Shū raḥ niʿmal bukra? · What will we do tomorrow?. Rationale: Raḥ plus the “we” form and bukra asks about a shared future plan.

Feedback: Raḥ plus the “we” form and bukra asks about a shared future plan.

Retry hint: Keep both tomorrow and “we.”

### e06-02

Instruction: Knafeh suggests visiting his own family after work. Speak as Knafeh.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: شو رح نعمل بكرا؟ · Shū raḥ niʿmal bukra? · What will we do tomorrow?

- a (accepted): نزور أهلي بعد الشغل؟ · Nzūr ahli baʿd ish-shughl? · Shall we visit my family after work?. Rationale: Ahli identifies Knafeh’s family when Knafeh speaks; after work supplies the ordering.
- b: نزور أهلك بعد الشغل؟ · Nzūr ahlik baʿd ish-shughl? · Shall we visit your family after work? (to Fattoush). Rationale: This would mean Fattoush’s family, changing whose family they visit.
- c: اشتغلت، وبعدين زرت أمي. · Ishtaghalt, w-baʿdēn zurt immi. · I worked, then visited my mother.. Rationale: This recounts completed work and a visit rather than making tomorrow’s suggestion.

Feedback: Ahli identifies Knafeh’s family when Knafeh speaks; after work supplies the ordering.

Retry hint: Knafeh is speaking, so use “my family.”

### e06-03

Instruction: You like the visit idea but still need the time. Ask for it.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: نزور أهلي بعد الشغل؟ · Nzūr ahli baʿd ish-shughl? · Shall we visit my family after work?

- a: كيف أهلك؟ · Kīf ahlak? · How’s your family? (to Knafeh). Rationale: This asks how the family is rather than when to visit.
- b (accepted): تمام. أي ساعة؟ · Tamām. Ayy sāʿa? · Okay. What time?. Rationale: Ayy sāʿa asks for a clock time after accepting the idea.
- c: بدك شاي ولا قهوة؟ · Biddak shāy walla ʾahwe? · Do you want tea or coffee? (to Knafeh). Rationale: This offers drinks rather than settling the schedule.

Feedback: Ayy sāʿa asks for a clock time after accepting the idea.

Retry hint: Ask for the missing clock time.

### e06-04

Instruction: The agreed time is six. Give that time.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: تمام. أي ساعة؟ · Tamām. Ayy sāʿa? · Okay. What time?

- a (accepted): الساعة ستة. · Is-sāʿa sitte. · At six o’clock.. Rationale: Sitte sets six o’clock, matching the agreed time.
- b: الساعة سبعة. · Is-sāʿa sabʿa. · At seven o’clock.. Rationale: Sabʿa sets seven, an hour later.
- c: بكرا · Bukra · Tomorrow. Rationale: Tomorrow gives the day but not the clock time.

Feedback: Sitte sets six o’clock, matching the agreed time.

Retry hint: Choose the time, not only the day.

### e06-05

Instruction: Fattoush confirms: tomorrow, six, Knafeh’s family. Preserve all three details.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: نزور أهلي بعد الشغل؟ · Nzūr ahli baʿd ish-shughl? · Shall we visit my family after work?

- a: تمام، اليوم الساعة ستة نزور أهلك. · Tamām, il-yōm is-sāʿa sitte nzūr ahlak. · Okay, today at six we’ll visit your family. (to Knafeh). Rationale: The family and time fit, but this changes tomorrow to today.
- b: تمام، بكرا الساعة سبعة نزور أهلك. · Tamām, bukra is-sāʿa sabʿa nzūr ahlak. · Okay, tomorrow at seven we’ll visit your family. (to Knafeh). Rationale: The day and family fit, but this changes six to seven.
- c (accepted): تمام، بكرا الساعة ستة نزور أهلك. · Tamām, bukra is-sāʿa sitte nzūr ahlak. · Okay, tomorrow at six we’ll visit your family. (to Knafeh). Rationale: The confirmation carries forward day, time, and whose family.

Feedback: The confirmation carries forward day, time, and whose family.

Retry hint: Check each detail rather than matching only the family.

### e06-06

Instruction: In this plan, the visit follows work. Choose “after work.”

Roles: {}

Prompt: نزور أهلي بعد الشغل؟ · Nzūr ahli baʿd ish-shughl? · Shall we visit my family after work?

- a: قبل الشغل · ʾAbel ish-shughl · Before work. Rationale: This reverses the relationship to work.
- b (accepted): بعد الشغل · Baʿd ish-shughl · After work. Rationale: This places the visit after work finishes.
- c: بالشغل · Bish-shughl · At work. Rationale: This describes a location or work setting, not the requested sequence.

Feedback: This places the visit after work finishes.

Retry hint: Baʿd supplies “after.”

### e06-07

Instruction: Closing exchange, part 1: a new plan uses seven instead of six. Give the new time.

Roles: {}

Prompt: تمام. أي ساعة؟ · Tamām. Ayy sāʿa? · Okay. What time?

- a (accepted): الساعة سبعة. · Is-sāʿa sabʿa. · At seven o’clock.. Rationale: Use sabʿa to transfer the timing pattern to the revised plan.
- b: الساعة ستة. · Is-sāʿa sitte. · At six o’clock.. Rationale: This keeps the earlier time despite the change.
- c: بكرا · Bukra · Tomorrow. Rationale: This gives only the day.

Feedback: Use sabʿa to transfer the timing pattern to the revised plan.

Retry hint: The revised time is seven.

### e06-08

Instruction: Closing exchange, part 2: confirm tomorrow at seven with Fattoush. Say that you will drink tea together.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: نشرب شاي سوا بكرا؟ · Nishrab shāy sawa bukra? · Shall we drink tea together tomorrow?

- a: آه، اليوم الساعة سبعة نشرب شاي سوا. · Āh, il-yōm is-sāʿa sabʿa nishrab shāy sawa. · Yes, today at seven we’ll drink tea together.. Rationale: This changes tomorrow to today.
- b: تمام، بكرا الساعة ستة نزور أهلك. · Tamām, bukra is-sāʿa sitte nzūr ahlak. · Okay, tomorrow at six we’ll visit your family. (to Knafeh). Rationale: This repeats the previous visit plan at six instead of the revised tea plan at seven.
- c (accepted): آه، بكرا الساعة سبعة نشرب شاي سوا. · Āh, bukra is-sāʿa sabʿa nishrab shāy sawa. · Yes, tomorrow at seven we’ll drink tea together.. Rationale: This confirms the new day, time, and shared activity.

Feedback: This confirms the new day, time, and shared activity.

Retry hint: Keep all three details of the new arrangement.
