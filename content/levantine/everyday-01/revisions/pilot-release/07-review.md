# 7. Put it together — release review

Unapproved October 3 candidate. Exact package: [07-lesson.json](07-lesson.json).

## Dialogue

**Knafeh → Fattoush**

شو عاملة؟

Shū ʿāmle?

How are you doing? (casual check-in to Fattoush)

**Fattoush**

أنا منيحة. زرت أمي وبعدين ارتحت.

Ana mnīḥa. Zurt immi w-baʿdēn irtaḥt.

I’m well. I visited my mother and then rested.

**Knafeh**

وكيفها؟

W-kīfha?

And how is she?

**Fattoush → Knafeh**

منيحة. شو رأيك ناكل سوا بكرا؟

Mnīḥa. Shū raʾyak nākol sawa bukra?

She’s well. What do you think about eating together tomorrow?

**Knafeh**

تمام. نعمل رز وسلطة الساعة سبعة؟

Tamām. Niʿmal ruzz w-salaṭa is-sāʿa sabʿa?

Okay. Shall we make rice and salad at seven?

**Fattoush**

آه، وبعدين نشرب شاي.

Āh, w-baʿdēn nishrab shāy.

Yes, and then we’ll drink tea.

## Teaching cards

Read the unchanged [guided teaching review](../guided-teaching/07-review.md).

## Practice and feedback

### e07-01

Instruction: Fattoush is well. She visited her mother and then rested. Respond with her account.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: شو عاملة؟ · Shū ʿāmle? · How are you doing? (casual check-in to Fattoush)

- a: اشتغلت، وبعدين زرت أمي. · Ishtaghalt, w-baʿdēn zurt immi. · I worked, then visited my mother.. Rationale: This adds work and omits rest; it recalls an earlier lesson rather than this new scene.
- b (accepted): أنا منيحة. زرت أمي وبعدين ارتحت. · Ana mnīḥa. Zurt immi w-baʿdēn irtaḥt. · I’m well. I visited my mother and then rested.. Rationale: This preserves Fattoush’s self-description and the visit-before-rest order.
- c: أنا منيحة. ارتحت وبعدين زرت أمي. · Ana mnīḥa. Irtaḥt w-baʿdēn zurt immi. · I’m well. I rested and then visited my mother.. Rationale: This reverses the completed activities.

Feedback: Fattoush describes herself as mnīḥa, then preserves visiting before resting.

Retry hint: Keep Fattoush’s self-description and visit-before-rest order.

### e07-02

Instruction: Knafeh’s follow-up refers to Fattoush’s mother. Answer about her, not yourself.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: وكيفها؟ · W-kīfha? · And how is she?

- a: أنا منيحة. · Ana mnīḥa. · I’m well. (Fattoush speaking). Rationale: Ana changes the answer to Fattoush’s own condition.
- b: منيحين، شكراً. · Mnīḥīn, shukran. · They’re well, thank you.. Rationale: The plural answer is about several people, not one mother.
- c (accepted): منيحة. · Mnīḥa. · She’s well.. Rationale: The mother is the most recently named woman. The answer stays about her.

Feedback: The mother is the most recently named woman. The answer stays about her.

Retry hint: Keep the person referred to by -ha.

### e07-03

Instruction: Move from the completed day to an invitation for tomorrow. Address Knafeh.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: منيحة. · Mnīḥa. · She’s well.

- a (accepted): شو رأيك ناكل سوا بكرا؟ · Shū raʾyak nākol sawa bukra? · What do you think about eating together tomorrow? (to Knafeh). Rationale: This changes to a shared future meal and keeps Knafeh as the listener.
- b: شو عملت اليوم؟ · Shū ʿmilt il-yōm? · What did you do today? (to Knafeh). Rationale: This asks for another past activity report rather than inviting him.
- c: شو رأيك ناكل سوا اليوم؟ · Shū raʾyak nākol sawa il-yōm? · What do you think about eating together today? (to Knafeh). Rationale: This invites him for today, changing the agreed day.

Feedback: This changes to a shared future meal and keeps Knafeh as the listener.

Retry hint: The invitation needs tomorrow.

### e07-04

Instruction: Confirm the meal from the fresh dialogue: rice and salad at seven.

Roles: {}

Prompt: شو نعمل بكرا؟ · Shū niʿmal bukra? · What shall we make tomorrow?

- a: نعمل رز وسلطة الساعة ستة. · Niʿmal ruzz w-salaṭa is-sāʿa sitte. · We’ll make rice and salad at six.. Rationale: This keeps the dishes but imports six from the previous lesson.
- b: نعمل شاي الساعة سبعة. · Niʿmal shāy is-sāʿa sabʿa. · We’ll make tea at seven.. Rationale: Tea comes afterwards; it is not the meal being confirmed.
- c (accepted): نعمل رز وسلطة الساعة سبعة. · Niʿmal ruzz w-salaṭa is-sāʿa sabʿa. · We’ll make rice and salad at seven.. Rationale: Both dishes and the new time match the dialogue.

Feedback: Both dishes and the new time match the dialogue.

Retry hint: Keep both the foods and the new clock time.

### e07-05

Instruction: Fattoush asks for the drink mentioned after the meal. Ask Knafeh politely for that drink.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: بدك شاي ولا قهوة؟ · Biddik shāy walla ʾahwe? · Do you want tea or coffee? (to Fattoush)

- a: قهوة، لو سمحتي. · ʾAhwe, law samaḥti. · Coffee, please. (to Fattoush). Rationale: This selects coffee and directs the request to Fattoush.
- b (accepted): شاي، لو سمحت. · Shāy, law samaḥt. · Tea, please. (to Knafeh). Rationale: Tea matches the new dialogue, and law samaḥt addresses Knafeh.
- c: لا، شكراً. · Laʾ, shukran. · No, thank you.. Rationale: This refuses the drink rather than requesting the one in the plan.

Feedback: Tea matches the new dialogue, and law samaḥt addresses Knafeh.

Retry hint: Recall the last turn of the dialogue.

### e07-06

Instruction: You are Knafeh. After answering about yourself, return the check-in to Fattoush.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: أنا منيح. · Ana mnīḥ. · I’m well. (Knafeh speaking)

- a (accepted): وإنتِ؟ · W-inti? · And you? (to Fattoush). Rationale: W-inti returns the check-in to Fattoush without introducing a different topic.
- b: وإنتَ؟ · W-inta? · And you? (to Knafeh). Rationale: This addresses a man; Fattoush is the listener.
- c: وكيفها؟ · W-kīfha? · And how is she?. Rationale: This asks about a woman already mentioned rather than directly returning the check-in.

Feedback: W-inti returns the check-in to Fattoush without introducing a different topic.

Retry hint: Address Fattoush directly.

### e07-07

Instruction: Closing exchange, part 1: in a new conversation, you worked and then rested. Tell that story without changing the order.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: شو عملت اليوم؟ · Shū ʿmilt il-yōm? · What did you do today? (to Knafeh)

- a: ارتحت وبعدين اشتغلت. · Irtaḥt w-baʿdēn ishtaghalt. · I rested and then worked.. Rationale: This reverses the requested order.
- b: زرت أمي وبعدين ارتحت. · Zurt immi w-baʿdēn irtaḥt. · I visited my mother and then rested.. Rationale: This repeats Fattoush’s earlier story instead of the new work scenario.
- c (accepted): اشتغلت وبعدين ارتحت. · Ishtaghalt w-baʿdēn irtaḥt. · I worked and then rested.. Rationale: You reuse the sequence pattern for work followed by rest, rather than copying Fattoush’s visit story.

Feedback: You reuse the sequence pattern for work followed by rest, rather than copying Fattoush’s visit story.

Retry hint: Check the activity before baʿdēn.

### e07-08

Instruction: Closing exchange, part 2: confirm the whole new arrangement: tomorrow at seven, a shared meal, then tea.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: ناكل سوا بكرا الساعة سبعة؟ · Nākol sawa bukra is-sāʿa sabʿa? · Shall we eat together tomorrow at seven?

- a: تمام، اليوم الساعة سبعة. وبعدين نشرب شاي. · Tamām, il-yōm is-sāʿa sabʿa. W-baʿdēn nishrab shāy. · Okay, today at seven. And afterwards we’ll drink tea.. Rationale: Only the day changes, but that would create a different arrangement.
- b (accepted): تمام، بكرا الساعة سبعة. وبعدين نشرب شاي. · Tamām, bukra is-sāʿa sabʿa. W-baʿdēn nishrab shāy. · Okay, tomorrow at seven. And afterwards we’ll drink tea.. Rationale: The confirmation preserves the day and time and adds the requested follow-on activity.
- c: تمام، بكرا الساعة ستة. وبعدين نشرب قهوة. · Tamām, bukra is-sāʿa sitte. W-baʿdēn nishrab ʾahwe. · Okay, tomorrow at six. And afterwards we’ll drink coffee.. Rationale: This changes both the time and the drink.

Feedback: The confirmation preserves the day and time and adds the requested follow-on activity.

Retry hint: Check day, time, and the activity afterwards.
