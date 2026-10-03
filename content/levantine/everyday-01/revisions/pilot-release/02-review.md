# 2. What did you do today? — release review

Unapproved October 3 candidate. Exact package: [02-lesson.json](02-lesson.json).

## Dialogue

**Knafeh → Fattoush**

شو عملتي اليوم؟

Shū ʿmilti il-yōm?

What did you do today? (to Fattoush)

**Fattoush**

اشتغلت، وبعدين زرت أمي.

Ishtaghalt, w-baʿdēn zurt immi.

I worked, then visited my mother.

**Knafeh**

وكيفها؟

W-kīfha?

And how is she?

**Fattoush → Knafeh**

منيحة. وإنتَ، شو عملت؟

Mnīḥa. W-inta, shū ʿmilt?

She’s well. And you, what did you do?

**Knafeh**

رحت عالبيت وبعدين ارتحت.

Ruḥt ʿa-l-bēt w-baʿdēn irtaḥt.

I went home and then rested.

**Fattoush**

منيح! هلّق نرتاح سوا.

Mnīḥ! Hallaʾ nirtāḥ sawa.

Good! Now let’s rest together.

## Teaching cards

Read the unchanged [guided teaching review](../guided-teaching/02-review.md).

## Practice and feedback

### e02-01

Instruction: Recall Fattoush’s two activities in the order she mentioned them.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: شو عملتي اليوم؟ · Shū ʿmilti il-yōm? · What did you do today? (to Fattoush)

- a: زرت أمي وبعدين اشتغلت. · Zurt immi w-baʿdēn ishtaghalt. · I visited my mother and then worked.. Rationale: Both activities belong in her story, but this reverses their order.
- b: رحت عالبيت وبعدين ارتحت. · Ruḥt ʿa-l-bēt w-baʿdēn irtaḥt. · I went home and then rested.. Rationale: This is Knafeh’s story; Fattoush described work and a visit.
- c (accepted): اشتغلت، وبعدين زرت أمي. · Ishtaghalt, w-baʿdēn zurt immi. · I worked, then visited my mother.. Rationale: Fattoush worked first and visited her mother afterwards; baʿdēn preserves that order.

Feedback: Fattoush worked first and visited her mother afterwards; baʿdēn preserves that order.

Retry hint: Identify Fattoush’s first action before choosing.

### e02-02

Instruction: Fattoush has said she visited her mother. Ask how her mother is.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: اشتغلت، وبعدين زرت أمي. · Ishtaghalt, w-baʿdēn zurt immi. · I worked, then visited my mother.

- a (accepted): وكيفها؟ · W-kīfha? · And how is she?. Rationale: The -ha refers to her mother and makes the follow-up relevant.
- b: وكيفك؟ · W-kīfik? · And how are you? (to Fattoush). Rationale: This asks about Fattoush herself, rather than the mother she just mentioned.
- c: شو عامل؟ · Shū ʿāmel? · How are you doing? (casual check-in to Knafeh). Rationale: This checks in with Knafeh rather than following up on Fattoush’s mother.

Feedback: The -ha refers to her mother and makes the follow-up relevant.

Retry hint: The follow-up is about “her,” not “you.”

### e02-03

Instruction: Answer about Fattoush’s mother: she is well.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: وكيفها؟ · W-kīfha? · And how is she?

- a: منيح. · Mnīḥ. · He is well.. Rationale: The masculine form does not match the mother in this scene.
- b (accepted): منيحة. · Mnīḥa. · She’s well.. Rationale: The feminine form fits the mother being discussed.
- c: أنا منيحة. · Ana mnīḥa. · I’m well. (Fattoush speaking). Rationale: Adding ana makes this about Fattoush, not her mother.

Feedback: The feminine form fits the mother being discussed.

Retry hint: Keep the answer about the mother.

### e02-04

Instruction: Ask Fattoush, rather than Knafeh, what she did today.

Roles: {"responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: اليوم · Il-yōm · Today

- a (accepted): شو عملتي اليوم؟ · Shū ʿmilti il-yōm? · What did you do today? (to Fattoush). Rationale: The final -i in ʿmilti marks the question to Fattoush.
- b: شو عملت اليوم؟ · Shū ʿmilt il-yōm? · What did you do today? (to Knafeh). Rationale: This question uses masculine singular address in this scene.
- c: شو عامل؟ · Shū ʿāmel? · How are you doing? (casual check-in to Knafeh). Rationale: This is a casual check-in to Knafeh, not a request for Fattoush’s completed activities.

Feedback: The final -i in ʿmilti marks the question to Fattoush.

Retry hint: Listen for the final -i in the verb addressed to Fattoush.

### e02-05

Instruction: Your story is work first, rest second. Choose the matching sequence.

Roles: {}

Prompt: وبعدين؟ · W-baʿdēn? · And then?

- a: ارتحت وبعدين اشتغلت. · Irtaḥt w-baʿdēn ishtaghalt. · I rested and then worked.. Rationale: This puts rest first, changing the sequence.
- b: رح أشتغل بكرا. · Raḥ ashtaghel bukra. · I’ll work tomorrow.. Rationale: This is a future plan, not two completed activities.
- c (accepted): اشتغلت وبعدين ارتحت. · Ishtaghalt w-baʿdēn irtaḥt. · I worked and then rested.. Rationale: Work comes before rest, with baʿdēn marking the second action.

Feedback: Work comes before rest, with baʿdēn marking the second action.

Retry hint: The activity after baʿdēn must be rest.

### e02-06

Instruction: Knafeh went home. Ask for the next event in his story.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: رحت عالبيت. · Ruḥt ʿa-l-bēt. · I went home.

- a: وكيفها؟ · W-kīfha? · And how is she?. Rationale: This asks about a woman’s condition; no woman has been mentioned in this short story.
- b (accepted): وبعدين؟ · W-baʿdēn? · And then?. Rationale: “And then?” invites the next event without replacing the topic.
- c: وإنتِ؟ · W-inti? · And you? (to a woman). Rationale: This returns a question to a woman instead of asking Knafeh what followed.

Feedback: “And then?” invites the next event without replacing the topic.

Retry hint: Ask what came afterwards.

### e02-07

Instruction: Closing exchange, part 1: today Knafeh rested first and then worked. Tell that new story.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: شو عملت اليوم؟ · Shū ʿmilt il-yōm? · What did you do today? (to Knafeh)

- a (accepted): ارتحت وبعدين اشتغلت. · Irtaḥt w-baʿdēn ishtaghalt. · I rested and then worked.. Rationale: This transfers the sequence pattern to the new order, rather than repeating the dialogue.
- b: اشتغلت وبعدين ارتحت. · Ishtaghalt w-baʿdēn irtaḥt. · I worked and then rested.. Rationale: This reverses the required order.
- c: رحت عالبيت وبعدين ارتحت. · Ruḥt ʿa-l-bēt w-baʿdēn irtaḥt. · I went home and then rested.. Rationale: This substitutes going home for working.

Feedback: This transfers the sequence pattern to the new order, rather than repeating the dialogue.

Retry hint: Start with the activity that happened first: rest.

### e02-08

Instruction: Closing exchange, part 2: Fattoush asks whether those activities were today. Confirm today.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: اليوم؟ · Il-yōm? · Today?

- a: لا، بكرا. · Laʾ, bukra. · No, tomorrow.. Rationale: Tomorrow changes the time and cannot describe activities already completed today.
- b: منيحة. · Mnīḥa. · She’s well.. Rationale: This answers a health check about a woman, not the time question.
- c (accepted): آه، اليوم. · Āh, il-yōm. · Yes, today.. Rationale: The reply directly confirms the time of the completed activities.

Feedback: The reply directly confirms the time of the completed activities.

Retry hint: Confirm the time word Fattoush used.
