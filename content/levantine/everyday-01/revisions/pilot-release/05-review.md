# 5. How's your family? — release review

Unapproved October 3 candidate. Exact package: [05-lesson.json](05-lesson.json).

## Dialogue

**Fattoush → Knafeh**

كيف أهلك؟

Kīf ahlak?

How’s your family? (to Knafeh)

**Knafeh**

منيحين، شكراً.

Mnīḥīn, shukran.

They’re well, thank you.

**Fattoush → Knafeh**

وأختك، كيفها؟

W-ukhtak, kīfha?

And your sister, how is she? (to Knafeh)

**Knafeh → Fattoush**

منيحة، بس عندها شغل كتير. وكيف أمك؟

Mnīḥa, bass ʿindha shughl ktīr. W-kīf immik?

She’s well, but she has a lot of work. And how’s your mother?

**Fattoush**

منيحة. اليوم بالبيت.

Mnīḥa. Il-yōm bil-bēt.

She’s well. Today she’s at home.

**Knafeh**

منيح! بكرا نزورها؟

Mnīḥ! Bukra nzūrha?

Good! Shall we visit her tomorrow?

## Teaching cards

Read the unchanged [guided teaching review](../guided-teaching/05-review.md).

## Practice and feedback

### e05-01

Instruction: Ask Knafeh about his family, rather than about your own.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: وإنتَ؟ · W-inta? · And you? (to Knafeh)

- a: كيف أهلي؟ · Kīf ahli? · How is my family?. Rationale: Ahli refers to the speaker’s family instead of Knafeh’s.
- b (accepted): كيف أهلك؟ · Kīf ahlak? · How’s your family? (to Knafeh). Rationale: Ahlak means Knafeh’s family when he is the listener.
- c: كيفك؟ · Kīfak? · How are you? (to Knafeh). Rationale: This asks about Knafeh himself, not his family.

Feedback: Ahlak means Knafeh’s family when he is the listener.

Retry hint: The ending should mean “your” to Knafeh.

### e05-02

Instruction: Knafeh says the family members are well. Respond as Knafeh.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: كيف أهلك؟ · Kīf ahlak? · How’s your family? (to Knafeh)

- a: منيحة. · Mnīḥa. · She’s well.. Rationale: This refers to one woman, not the family group.
- b: أنا منيح. · Ana mnīḥ. · I’m well. (Knafeh speaking). Rationale: This updates only Knafeh’s condition.
- c (accepted): منيحين، شكراً. · Mnīḥīn, shukran. · They’re well, thank you.. Rationale: Mnīḥīn refers to the family members as a group.

Feedback: Mnīḥīn refers to the family members as a group.

Retry hint: Answer about the group of people.

### e05-03

Instruction: Follow up specifically about Knafeh’s sister.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: منيحين، شكراً. · Mnīḥīn, shukran. · They’re well, thank you.

- a (accepted): وأختك، كيفها؟ · W-ukhtak, kīfha? · And your sister, how is she? (to Knafeh). Rationale: Naming the sister gives kīfha a clear referent.
- b: كيف أهلك؟ · Kīf ahlak? · How’s your family? (to Knafeh). Rationale: This repeats the general family question instead of following up about his sister.
- c: وكيف أمك؟ · W-kīf immik? · And how’s your mother? (to Fattoush). Rationale: This asks Fattoush about her mother; both the listener and relative change.

Feedback: Naming the sister gives kīfha a clear referent.

Retry hint: Name the sister before asking how she is.

### e05-04

Instruction: The sister is well but has much work. Give that update.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: وأختك، كيفها؟ · W-ukhtak, kīfha? · And your sister, how is she? (to Knafeh)

- a: منيحة. اليوم بالبيت. · Mnīḥa. Il-yōm bil-bēt. · She’s well. Today she’s at home.. Rationale: Being home today is a different detail; it does not express the sister’s workload.
- b: أنا عندي شغل كتير. · Ana ʿindi shughl ktīr. · I have a lot of work.. Rationale: This changes the person from the sister to the speaker.
- c (accepted): منيحة، بس عندها شغل كتير. · Mnīḥa, bass ʿindha shughl ktīr. · She’s well, but she has a lot of work.. Rationale: Both the positive condition and the work detail match the scenario.

Feedback: Both the positive condition and the work detail match the scenario.

Retry hint: The work belongs to her: ʿindha.

### e05-05

Instruction: Fattoush has just mentioned her mother. Ask a short follow-up about the mother.

Roles: {"speakerId": "fattoush", "addresseeId": "knafeh", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: اليوم زرت أمي. · Il-yōm zurt immi. · Today I visited my mother.

- a: وكيفك؟ · W-kīfik? · And how are you? (to Fattoush). Rationale: This asks about Fattoush rather than her mother.
- b (accepted): وكيفها؟ · W-kīfha? · And how is she?. Rationale: Kīfha refers back to the mother Fattoush has just named.
- c: شو عملتي اليوم؟ · Shū ʿmilti il-yōm? · What did you do today? (to Fattoush). Rationale: This asks broadly about Fattoush’s activities instead of following up on her mother.

Feedback: Kīfha refers back to the mother Fattoush has just named.

Retry hint: The short ending should refer to “her.”

### e05-06

Instruction: Knafeh wants to ask Fattoush about her family. Choose the address to Fattoush.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "knafeh", "responseAddresseeId": "fattoush"}

Prompt: وإنتِ؟ · W-inti? · And you? (to Fattoush)

- a (accepted): كيف أهلك؟ · Kīf ahlik? · How’s your family? (to Fattoush). Rationale: Ahlik is the selected feminine address; Arabic script alone may not show the short-vowel difference.
- b: كيف أهلك؟ · Kīf ahlak? · How’s your family? (to Knafeh). Rationale: Ahlak is addressed to Knafeh, not Fattoush.
- c: كيف أهلي؟ · Kīf ahli? · How is my family?. Rationale: This asks about the speaker’s own family.

Feedback: Ahlik is the selected feminine address; Arabic script alone may not show the short-vowel difference.

Retry hint: Follow the transliteration: ahlik.

### e05-07

Instruction: Closing exchange, part 1: today Fattoush’s mother is well and at home. Reply as Fattoush.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: وكيف أمك؟ · W-kīf immik? · And how’s your mother? (to Fattoush)

- a: منيحة، بس عندها شغل كتير. · Mnīḥa, bass ʿindha shughl ktīr. · She’s well, but she has a lot of work.. Rationale: This introduces a heavy workload, which the new scene does not give.
- b: منيحين، شكراً. · Mnīḥīn, shukran. · They’re well, thank you.. Rationale: This answers about several people, not the mother.
- c (accepted): منيحة. اليوم بالبيت. · Mnīḥa. Il-yōm bil-bēt. · She’s well. Today she’s at home.. Rationale: This gives the mother’s condition and today’s location without inventing extra detail.

Feedback: This gives the mother’s condition and today’s location without inventing extra detail.

Retry hint: Keep the referent singular and the detail about home.

### e05-08

Instruction: Closing exchange, part 2: agree to the proposed visit tomorrow.

Roles: {"speakerId": "knafeh", "addresseeId": "fattoush", "responseSpeakerId": "fattoush", "responseAddresseeId": "knafeh"}

Prompt: بكرا نزورها؟ · Bukra nzūrha? · Shall we visit her tomorrow?

- a: اليوم زرت أمي. · Il-yōm zurt immi. · Today I visited my mother.. Rationale: This reports a past visit today; it does not agree to tomorrow’s visit.
- b (accepted): آه، بكرا نزورها. · Āh, bukra nzūrha. · Yes, let’s visit her tomorrow.. Rationale: This agrees to the future shared visit and keeps the same person and day.
- c: لا، شكراً. · Laʾ, shukran. · No, thank you.. Rationale: This declines rather than accepting the invitation.

Feedback: This agrees to the future shared visit and keeps the same person and day.

Retry hint: Accept the invitation and preserve tomorrow.
