# 3. Want tea or coffee? — release review

Unapproved October 3 candidate. Exact package: [03-lesson.json](03-lesson.json).

## Dialogue

**Knafeh → Fattoush**

بدك شاي ولا قهوة؟

Biddik shāy walla ʾahwe?

Do you want tea or coffee? (to Fattoush)

**Fattoush → Knafeh**

شاي، لو سمحت.

Shāy, law samaḥt.

Tea, please. (to Knafeh)

**Knafeh → Fattoush**

بدك سكر؟

Biddik sukkar?

Do you want sugar?

**Fattoush**

لا، بدون سكر، شكراً.

Laʾ, bidūn sukkar, shukran.

No, without sugar, thank you.

**Knafeh**

أنا بدي قهوة.

Ana biddi ʾahwe.

I want coffee.

**Fattoush**

بحب الشاي أكتر.

Baḥibb ish-shāy aktar.

I like tea more.

## Teaching cards

Read the unchanged [guided teaching review](../guided-teaching/03-review.md).

## Practice and feedback

### e03-01

Instruction: Offer a choice of drinks to Fattoush.

Roles: {"responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: شاي ولا قهوة؟ · Shāy walla ʾahwe? · Tea or coffee?

- a: بدك شاي ولا قهوة؟ · Biddak shāy walla ʾahwe? · Do you want tea or coffee? (to Knafeh). Rationale: Biddak addresses Knafeh, but Fattoush is the listener here.
- b (accepted): بدك شاي ولا قهوة؟ · Biddik shāy walla ʾahwe? · Do you want tea or coffee? (to Fattoush). Rationale: Biddik addresses Fattoush, and walla presents the two drinks as alternatives.
- c: بدك شاي وقهوة؟ · Biddik shāy w-ʾahwe? · Do you want tea and coffee? (to Fattoush). Rationale: W means “and”; this offers both together instead of a choice.

Feedback: Biddik addresses Fattoush, and walla presents the two drinks as alternatives.

Retry hint: Choose the feminine address and the word for “or.”

### e03-02

Instruction: Fattoush wants tea. Reply politely to Knafeh’s offer.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: بدك شاي ولا قهوة؟ · Biddik shāy walla ʾahwe? · Do you want tea or coffee? (to Fattoush)

- a: قهوة، لو سمحتي. · ʾAhwe, law samaḥti. · Coffee, please. (to Fattoush). Rationale: This selects coffee and addresses Fattoush, so both the preference and listener differ.
- b: لا، شكراً. · Laʾ, shukran. · No, thank you.. Rationale: This politely declines both drinks rather than accepting tea.
- c (accepted): شاي، لو سمحت. · Shāy, law samaḥt. · Tea, please. (to Knafeh). Rationale: This selects tea and uses law samaḥt for the male listener Knafeh.

Feedback: This selects tea and uses law samaḥt for the male listener Knafeh.

Retry hint: Choose tea and a request addressed to Knafeh.

### e03-03

Instruction: Fattoush does not want sugar. Respond to Knafeh.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: بدك سكر؟ · Biddik sukkar? · Do you want sugar? (to Fattoush)

- a (accepted): لا، بدون سكر، شكراً. · Laʾ, bidūn sukkar, shukran. · No, without sugar, thank you.. Rationale: This explicitly declines sugar while retaining the drink request.
- b: آه، مع سكر. · Āh, maʿ sukkar. · Yes, with sugar.. Rationale: This asks for sugar, the opposite of Fattoush’s preference.
- c: بحب الشاي أكتر. · Baḥibb ish-shāy aktar. · I like tea more.. Rationale: This expresses a drink preference but leaves the sugar question unanswered.

Feedback: This explicitly declines sugar while retaining the drink request.

Retry hint: Look for bidūn, “without.”

### e03-04

Instruction: Explain that you like tea more than coffee.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: ليش شاي؟ · Lēsh shāy? · Why tea?

- a: بحب القهوة أكتر. · Baḥibb il-ʾahwe aktar. · I like coffee more.. Rationale: This names coffee as the preferred drink.
- b: بدي شاي. · Biddi shāy. · I want tea.. Rationale: This repeats the request without expressing the comparison asked for.
- c (accepted): بحب الشاي أكتر. · Baḥibb ish-shāy aktar. · I like tea more.. Rationale: Baḥibb ish-shāy aktar gives a reason: tea is your preference.

Feedback: Baḥibb ish-shāy aktar gives a reason: tea is your preference.

Retry hint: The preferred drink comes after baḥibb.

### e03-05

Instruction: Knafeh offers Fattoush coffee later. She wants no drink now. Decline politely.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: بدك قهوة هلّق؟ · Biddik ʾahwe hallaʾ? · Do you want coffee now? (to Fattoush)

- a: آه، لو سمحت. · Āh, law samaḥt. · Yes, please. (to Knafeh). Rationale: This accepts the coffee.
- b (accepted): لا، شكراً. · Laʾ, shukran. · No, thank you.. Rationale: A short no plus thanks fits the requested refusal.
- c: شاي، لو سمحت. · Shāy, law samaḥt. · Tea, please. (to Knafeh). Rationale: This asks for a different drink; Fattoush wants no drink in this situation.

Feedback: A short no plus thanks fits the requested refusal.

Retry hint: You can decline without giving another order.

### e03-06

Instruction: You are Fattoush. Say what you yourself want, rather than asking Knafeh.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: بدك شاي ولا قهوة؟ · Biddik shāy walla ʾahwe? · Do you want tea or coffee? (to Fattoush)

- a (accepted): بدي شاي. · Biddi shāy. · I want tea.. Rationale: Biddi is the first-person form; the sentence states Fattoush’s own request.
- b: بدك شاي؟ · Biddak shāy? · Do you want tea? (to Knafeh). Rationale: This asks the listener instead of answering about yourself.
- c: بدها شاي. · Biddha shāy. · She wants tea.. Rationale: This reports another woman’s wish, not your own.

Feedback: Biddi is the first-person form; the sentence states Fattoush’s own request.

Retry hint: Use the ending for “I.”

### e03-07

Instruction: Closing exchange, part 1: Fattoush now hosts Knafeh. He chooses coffee. Respond as Knafeh to Fattoush.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: بدك شاي ولا قهوة؟ · Biddak shāy walla ʾahwe? · Do you want tea or coffee? (to Knafeh)

- a: شاي، لو سمحت. · Shāy, law samaḥt. · Tea, please. (to Knafeh). Rationale: This chooses tea and directs “please” to a man.
- b: لا، شكراً. · Laʾ, shukran. · No, thank you.. Rationale: This declines the offer instead of accepting coffee.
- c (accepted): قهوة، لو سمحتي. · ʾAhwe, law samaḥti. · Coffee, please. (to Fattoush). Rationale: Coffee matches Knafeh’s choice, and law samaḥti addresses Fattoush.

Feedback: Coffee matches Knafeh’s choice, and law samaḥti addresses Fattoush.

Retry hint: The person receiving “please” is Fattoush.

### e03-08

Instruction: Closing exchange, part 2: Knafeh wants his coffee without sugar. Answer Fattoush.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: بدك سكر؟ · Biddak sukkar? · Do you want sugar? (to Knafeh)

- a: آه، مع سكر. · Āh, maʿ sukkar. · Yes, with sugar.. Rationale: This changes the order to coffee with sugar.
- b (accepted): لا، بدون سكر، شكراً. · Laʾ, bidūn sukkar, shukran. · No, without sugar, thank you.. Rationale: This completes the order by stating without sugar and thanking Fattoush.
- c: بحب القهوة أكتر. · Baḥibb il-ʾahwe aktar. · I like coffee more.. Rationale: This says he prefers coffee, but does not settle the sugar choice.

Feedback: This completes the order by stating without sugar and thanking Fattoush.

Retry hint: Answer the specific follow-up, not the earlier drink choice.
