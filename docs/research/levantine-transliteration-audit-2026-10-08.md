# Palestinian Levantine transliteration audit

October 8, 2026 · Desk research and complete text inventory · F12.2

## Result and limits

For the target Palestinian plural “they are good/fine,” **مناح / mnāḥ** is the better source-supported teaching default than the current **منيحين / mnīḥīn**. The friend's “mnah” corresponds to this form; “mnaeh” is an informal pronunciation approximation, not the proposed consistent display spelling. This is a lexical/morphological change, so changing only the Roman letters would leave Arabic and transliteration inconsistent. Lingualism's Palestinian adjective entry explicitly supplies the broken plural. This evidence establishes a preferred Palestinian teaching form; it does **not** establish that mnīḥīn is impossible in every speaker's dialect or context. [Lingualism, Adjectives in Palestinian Arabic](https://resources.lingualism.com/levantine-arabic/adjectives-3/).

**law samaḥt** is a supported transliteration. Read its **aw as in English “how”**, not as the vowel in English “law.” PalWeb gives لو as /law/ and identifies لو سمحت as a phrase containing it; Lingualism also uses law in its Palestinian request example. “lau” can make the intended sound clearer to some readers, but this is a spelling/help convention, not evidence of a different Arabic word or a universal sound correction. Retain law with an explicit pronunciation key, or approve a consistent au convention before replacing occurrences. Keep masculine samaḥt and feminine samaḥti distinct. [PalWeb, لو](https://palweb.app/library/terms/conjunction-law), [Lingualism, Food and Drink in Palestinian Arabic](https://resources.lingualism.com/levantine-arabic/food-and-drink-3/).

All 214 unique Arabic/transliteration pairs in the ten requested lesson packages were inventoried and text-screened, including prompts, answers, dialogues, teaching phrases and phrase chunks. **Inventory coverage is not pronunciation approval.** The desk check found one concrete preferred-form correction family, one pronunciation-help issue, and several speaker/model checks. It cannot verify the audio, prosody, stress, connected speech or every vowel. No new native review, recording, publication, database inspection or deployment was performed. No lesson or manifest was edited.

## October 9 remediation update

Owner-authorized correction candidates for lessons 3/5/7 are now prepared and
deterministically validated. See [exact packages, field reviews and verification](../../content/levantine/everyday-01/revisions/transliteration-audit/README.md).
The Lingualism adjective page was fully retrieved on October 9, confirming its
plural entry. The original October 8 inventory and its source-access limits below
remain historical evidence. No default/hosted publication changed; actual speaker
pronunciation review and owner wording approval remain outstanding.

## Coverage and method

The scan recursively selected every JSON object containing both `arabic` and `arabizi`, preserving exact strings, capitalization and punctuation. This yields **611 paired objects / 214 exact unique pairs** across seven Everyday pilot-release packages and three Plans drafts. Repeated pairs across layers still count as separate occurrences. The appendix retains every unique pair, its number of occurrences and all lesson-file identifiers. A complete scan means every pair was inspected for text-level consistency and the issue families below; it does not mean every phrase has independent external attestation.

| Package | Paired objects | Unique pairs within package |
| --- | ---: | ---: |
| E01 | 67 | 33 |
| E02 | 63 | 35 |
| E03 | 65 | 34 |
| E04 | 66 | 39 |
| E05 | 63 | 37 |
| E06 | 66 | 38 |
| E07 | 65 | 50 |
| P01 | 54 | 24 |
| P02 | 53 | 24 |
| P03 | 49 | 22 |

E01–E07 refer to `content/levantine/everyday-01/revisions/pilot-release/01-lesson.json` through `07-lesson.json`. P01–P03 refer to `content/levantine/plans-02/01-lesson.json` through `03-lesson.json`. The whole JSON wrapper was scanned, including source-adjacent objects if they contain a pair. Historical revisions, review manifests, old draft packages, published database snapshots and generated audio were excluded from this inventory. Exact input hashes appear below for reproducibility.

## Prioritized findings

| Code | Finding | Proposed disposition |
| --- | --- | --- |
| A | `mnīḥīn` occurs in two unique pairs, eight paired objects, in Everyday lessons 5 and 7. | Prepare a versioned lessons-5-and-7 correction using `مناح` / `mnāḥ` and `مناح، شكراً.` / `Mnāḥ, shukran.` across all teaching/dialogue/practice copies. Preserve old publication/history; amend explanation/source notes and regenerate review hashes. Do not silently replace a published payload. |
| B | `law` occurs in five unique pairs, fourteen paired objects, in Everyday lessons 3 and 7. English readers can read the spelling as the English word. | Add a consistent pronunciation key/help for **aw = how**. If owner prefers `lau`, choose it as a display convention and apply across all copies, with a guide explaining it denotes the same /aw/ sound. Keep Arabic لو unchanged. |
| C | `فتوش` maps to `Fattoush` in a teaching chunk. | Treat Fattoush as the character's brand/name spelling, not a pedagogical phonetic transcription. If taught as the food word, use a separate lexical display such as `فتّوش` / `fattūsh`; do not rename the character. Publisher food entry supplies fattūš. |
| D | Vowels and model variation: `mnīḥa`, `taʿbāne`, `jūʿāne`, `salaṭa`, `nākol/tākol`, `niʿmal`, `shughl`, `ishtaghalt`, `hallaʾ`, `ʾahwe`, `ʾabel`. | Targeted urban Palestinian speaker/audio confirmation remains. Do not normalize every feminine ending to e, every verb vowel to u, or every qāf to one pronunciation merely from a Gaza or pan-Palestinian reference. |
| E | Remaining pairs have no additional specific text-level discrepancy identified by this desk screen. | Keep pending speaker review. “No textual flag” is not an endorsement of all phonetic realizations or sentence naturalness. |

The name/food spelling is supported by Lingualism's food entry. Its same page supports salaṭa, sugar/tea/rice-related vocabulary and demonstrates the reference-model issue: its coffee form differs from Ismi's urban-style ʾahwe, and its eat forms use u where Ismi uses o. These contrasts warrant checking the intended speaker, not blind replacement. The source's request includes a helping vowel in samaḥit; PalWeb's phrase gives samaħt. The present evidence does not require inserting that vowel everywhere. [Lingualism, Palestinian food and drink](https://resources.lingualism.com/levantine-arabic/food-and-drink-3/), [PalWeb, لو](https://palweb.app/library/terms/conjunction-law).

The existing packages deliberately distinguish `biddak/biddik`, `ahlak/ahlik`, `inta/inti`, and `samaḥt/samaḥti` by addressed person. The same Arabic consonantal spelling can support different gender forms when vowels are not written. A duplicate-Arabic/different-transliteration scan must therefore retain character and meaning context instead of assuming every difference is a typo. These are observations about Ismi's authored content, not new independent linguistic approvals.

## First-party source basis

1. [Lingualism, Adjectives in Palestinian Arabic](https://resources.lingualism.com/levantine-arabic/adjectives-3/) — publisher's own vocabulary entry supplies mnīḥ and plural mnāḥ. Indexed content was retrieved; direct full-page fetch timed out during this task. No audio from the entry was auditioned.
2. [PalWeb, Dictionary entry لو](https://palweb.app/library/terms/conjunction-law) — site's own transcription /law/ and containing phrase law samaħt; entry attributes a sample to Mohammad Odeh, a Ramallah speaker. Indexed content was retrieved; dynamic direct-page extraction was empty. Attribution is to this reference sample, not a review of Ismi.
3. [Lingualism, Food and Drink in Palestinian Arabic](https://resources.lingualism.com/levantine-arabic/food-and-drink-3/) — full publisher page inspected, particularly request (line 93), coffee (112), tea (124), salad (206), fattoush (214), sugar (261). Consultation for linguistic facts; audio/example redistribution was not authorized or performed.
4. [Dibas et al., Maknuune: A Large Open Palestinian Arabic Lexicon (2022)](https://aclanthology.org/2022.wanlp-1.13/) — researchers' primary description explains separate conventional orthography and phonological transcription and inclusion of Palestinian subdialects. It supports the need to distinguish spelling from sound and not infer a single urban realization from pan-Palestinian data. [Maintainers' repository](https://github.com/CAMeL-Lab/maknuune_lexicon) and [lexicon site](https://sites.google.com/nyu.edu/palestine-lexicon/lexicon) inspected for provenance; no complete machine comparison against the lexicon was achieved in this task.

The lesson packages already cite a Maknuune v1.0.1 snapshot and entry IDs. Those prior consultation claims are historical provenance, not fresh entry-by-entry verification here. Publisher sample links in the packages could not be retrieved for a fresh page check. Search aggregators, generated phrase sites, crowdsourced reposts and forum comments were not used as authority for corrections.

## Remediation and actual pronunciation review

Prepare only bounded, source-linked corrections first: the lessons-5-and-7 plural and a pronunciation-help convention. Compare all teaching chunks, dialogues, prompts, alternatives, rationale text and source records before validating/hashing a candidate. Publishing a revised lesson requires the normal console approval and publication workflow; prior versions remain available for rollback. Browser-downloaded old versions remain a separate delivery concern.

For real pronunciation approval, use a complete phrase inventory mapped to an identified urban Palestinian speaker/model. Have the reviewer check the Arabic, meaning, address/gender, display transcription and a recording together; record accepted variants, stress and epenthetic vowels instead of collapsing them into one arbitrary spelling. Synthetic or browser speech does not establish this evidence. F09 reviewed recordings and F19 auditions retain their existing separate limits. This task did not create a hired-reviewer commitment or authorize spending/contact.

## Separate seed-fixture inspection

`i-api/Services/SeedCurriculum.cs` contains four reusable authored step definitions with **four prompt pairs and twelve answer pairs (16 exact pairs)**, reused across six demonstrative lessons. It also contains a separate word connection `يَوْم` / `yōm` (Levantine) / `yawm` (MSA). These are fixture/display content, not part of the ten-package count or evidence of launch curriculum completeness. All 16 constructor pairs were text-screened. The one exact shared pair with the ten-package inventory is `شو عملت اليوم؟` / `Shū ʿmilt il-yōm?`.

Fixture-specific consistency issue: the seeds use `bas` and `shway`, whereas the authored unit uses `bass` and `shwayy`. Align conventions in a future reviewed fixture update if these remain learner-facing; single versus doubled final letters should not accidentally teach conflicting pronunciation. Seed market `ʿa-s-sūq` also needs an urban qāf/model decision rather than mechanical conversion. `rāyeḥ`, `tiʿibt`, `aḥsan`, `tlāte`, `ḥilu` and future verb vowels await the same speaker check. The MSA word-connection form is outside this Levantine phonetic audit.

| Arabic | Existing transcription | Disposition |
| --- | --- | --- |
| كيف كان يومك؟ | Kīf kān yōmak? | No new textual flag; speaker check pending |
| كان منيح، بس طويل شوي. | Kān mnīḥ, bas ṭawīl shway. | Convention: bas/shway |
| أنا رايح عالسوق بكرا. | Ana rāyeḥ ʿa-s-sūq bukra. | Urban qāf/model check |
| إنت من وين؟ | Inta min wēn? | No new textual flag; speaker check pending |
| شو عملت اليوم؟ | Shū ʿmilt il-yōm? | No new textual flag; speaker check pending |
| اشتغلت وبعدين ارتحت بالبيت. | Ishtaghalt w-baʿdēn irtaḥt bil-bēt. | No new textual flag; speaker check pending |
| الجو حلو اليوم. | Il-jaww ḥilu il-yōm. | No new textual flag; speaker check pending |
| بكرا عندي شغل. | Bukra ʿindi shughl. | No new textual flag; speaker check pending |
| تعبت؟ | Tiʿibt? | No new textual flag; speaker check pending |
| آه، شوي، بس هلّق أحسن. | Āh, shway, bas hallaʾ aḥsan. | Convention: bas/shway |
| أنا من رام الله. | Ana min Rām Allāh. | No new textual flag; speaker check pending |
| الساعة تلاتة. | Is-sāʿa tlāte. | No new textual flag; speaker check pending |
| شو رح تعمل بكرا؟ | Shū raḥ tiʿmal bukra? | No new textual flag; speaker check pending |
| رح أزور أهلي بعد الشغل. | Raḥ azūr ahli baʿd ish-shughl. | No new textual flag; speaker check pending |
| كان يوم طويل. | Kān yōm ṭawīl. | No new textual flag; speaker check pending |
| بحب القهوة. | Baḥibb il-ʾahwe. | No new textual flag; speaker check pending |

## Exact package hashes

| Input | SHA-256 |
| --- | --- |
| E01 | `3fed30fbc3ad6f65355f4ce889e65e1a3e10f248a18b913d5e4544675d96fef1` |
| E02 | `fb0861235c902ce1d1f90a661c54c3e14b73c2a8dab184557051a504b1210e72` |
| E03 | `54823a42b60830ead78a2bc665655b3350e8d6be4d26bb5513a3dcc1495615fc` |
| E04 | `44528e782c1590902f866e6796cb2844ed9b7ab61ba5ff1cb450b9e2e363d4c9` |
| E05 | `d56f294d0a78017a14af5039fc0d6bf386b843e0d075708aec4ef39dfe4e78fa` |
| E06 | `621fb4e5fc0df800656234874716378711ca62a5062c90e6c3a25b2fea4e2ee4` |
| E07 | `392e49dc764aa1e996654098cccaf3c90b4544b32e02d31c25526b85ed8c3c0a` |
| P01 | `da92715926d9a4f443017cc09228c57e0f7780334e59e0fba1f21e3e97a224fa` |
| P02 | `e25f4e4b4830539d692337252a760ab94f82cee43cbb55448abacfbf5394be10` |
| P03 | `89f121d16f5afe1295bc25ac099ea5b7bc95064d61c0de348cc6a79d0a909e3b` |

## Complete package pair inventory

Codes A–E are screening dispositions from the table above. Every pair still needs actual pronunciation review. Counts include every repeated paired object; package labels identify all containing lesson files. Capitalization and punctuation differences intentionally remain separate rows.

| # | Arabic | Existing transcription | Occurrences | Packages | Disposition |
| ---: | --- | --- | ---: | --- | --- |
| 1 | آه | āh | 5 | E01, E02, E04, E05, E06 | E: no textual flag |
| 2 | آه، اليوم الساعة سبعة نشرب شاي سوا. | Āh, il-yōm is-sāʿa sabʿa nishrab shāy sawa. | 1 | E06 | E: no textual flag |
| 3 | آه، اليوم. | Āh, il-yōm. | 2 | E02 | E: no textual flag |
| 4 | آه، بدون سكر. | Āh, bidūn sukkar. | 1 | E04 | E: no textual flag |
| 5 | آه، بدون سكر، شكراً. | Āh, bidūn sukkar, shukran. | 1 | E04 | E: no textual flag |
| 6 | آه، بدي أرتاح شوي. | Āh, biddi artāḥ shwayy. | 4 | E01 | E: no textual flag |
| 7 | آه، بكرا الساعة سبعة نشرب شاي سوا. | Āh, bukra is-sāʿa sabʿa nishrab shāy sawa. | 6 | E06, P01, P02, P03 | E: no textual flag |
| 8 | آه، بكرا نزورها. | Āh, bukra nzūrha. | 2 | E05 | E: no textual flag |
| 9 | آه، خلّينا نعمل رز وسلطة. | Āh, khallīna niʿmal ruzz w-salaṭa. | 4 | E04, P02 | D: speaker/model check |
| 10 | آه، لو سمحت. | Āh, law samaḥt. | 1 | E03 | B: clarify aw |
| 11 | آه، مع سكر. | Āh, maʿ sukkar. | 2 | E03 | E: no textual flag |
| 12 | آه، وبعدين نشرب شاي. | Āh, w-baʿdēn nishrab shāy. | 1 | E07 | E: no textual flag |
| 13 | أرتاح | artāḥ | 1 | E01 | E: no textual flag |
| 14 | أكتر | aktar | 1 | E03 | E: no textual flag |
| 15 | أمي | immi | 1 | E02 | E: no textual flag |
| 16 | أنا | ana | 5 | E01, E04 | E: no textual flag |
| 17 | أنا بدي قهوة. | Ana biddi ʾahwe. | 1 | E03 | D: speaker/model check |
| 18 | أنا تعبان شوي. | Ana taʿbān shwayy. | 3 | E01, E04 | E: no textual flag |
| 19 | أنا تعبان كتير. | Ana taʿbān ktīr. | 1 | E01 | E: no textual flag |
| 20 | أنا تعبان كمان. | Ana taʿbān kamān. | 1 | E01 | E: no textual flag |
| 21 | أنا تعبانة شوي. | Ana taʿbāne shwayy. | 6 | E01 | D: speaker/model check |
| 22 | أنا تعبانة كتير. | Ana taʿbāne ktīr. | 1 | E01 | D: speaker/model check |
| 23 | أنا جوعان. | Ana jūʿān. | 8 | E04 | E: no textual flag |
| 24 | أنا جوعانة كمان. | Ana jūʿāne kamān. | 4 | E04 | D: speaker/model check |
| 25 | أنا جوعانة كمان. شو رأيك ناكل سوا؟ | Ana jūʿāne kamān. Shū raʾyak nākol sawa? | 1 | E04 | D: speaker/model check |
| 26 | أنا عندي شغل كتير. | Ana ʿindi shughl ktīr. | 1 | E05 | D: speaker/model check |
| 27 | أنا مش جوعان هلّق. | Ana mish jūʿān hallaʾ. | 4 | E04 | D: speaker/model check |
| 28 | أنا مش جوعانة. | Ana mish jūʿāne. | 1 | E04 | D: speaker/model check |
| 29 | أنا منيح. | Ana mnīḥ. | 7 | E01, E05, E07 | E: no textual flag |
| 30 | أنا منيح. وإنتِ؟ | Ana mnīḥ. W-inti? | 1 | E01 | E: no textual flag |
| 31 | أنا منيحة | ana mnīḥa | 1 | E07 | D: speaker/model check |
| 32 | أنا منيحة. | Ana mnīḥa. | 6 | E01, E02, E07 | D: speaker/model check |
| 33 | أنا منيحة. ارتحت وبعدين زرت أمي. | Ana mnīḥa. Irtaḥt w-baʿdēn zurt immi. | 1 | E07 | D: speaker/model check |
| 34 | أنا منيحة. زرت أمي وبعدين ارتحت. | Ana mnīḥa. Zurt immi w-baʿdēn irtaḥt. | 3 | E07 | D: speaker/model check |
| 35 | أهلك | ahlak | 1 | E05 | E: no textual flag |
| 36 | أهلك | ahlik | 1 | E05 | E: no textual flag |
| 37 | أهلي | ahli | 1 | E06 | E: no textual flag |
| 38 | أي ساعة | ayy sāʿa | 3 | E06, P01, P02 | E: no textual flag |
| 39 | ارتحت | irtaḥt | 2 | E02, E07 | E: no textual flag |
| 40 | ارتحت وبعدين اشتغلت. | Irtaḥt w-baʿdēn ishtaghalt. | 3 | E02, E07 | D: speaker/model check |
| 41 | اشتغلت | ishtaghalt | 2 | E02, E07 | D: speaker/model check |
| 42 | اشتغلت وبعدين ارتحت. | Ishtaghalt w-baʿdēn irtaḥt. | 6 | E01, E02, E04, E07 | D: speaker/model check |
| 43 | اشتغلت، وبعدين زرت أمي. | Ishtaghalt, w-baʿdēn zurt immi. | 7 | E02, E06, E07 | D: speaker/model check |
| 44 | الساعة | is-sāʿa | 2 | E06 | E: no textual flag |
| 45 | الساعة سبعة | is-sāʿa sabʿa | 5 | E06, E07, P01, P03 | E: no textual flag |
| 46 | الساعة سبعة. | Is-sāʿa sabʿa. | 8 | E06, E07, P01, P03 | E: no textual flag |
| 47 | الساعة ستة | is-sāʿa sitte | 4 | P01, P02, P03 | E: no textual flag |
| 48 | الساعة ستة. | Is-sāʿa sitte. | 5 | E06, P02 | E: no textual flag |
| 49 | الساعة ستة؟ | Is-sāʿa sitte? | 4 | P03 | E: no textual flag |
| 50 | الشاي | ish-shāy | 1 | E03 | E: no textual flag |
| 51 | اليوم | Il-yōm | 1 | E02 | E: no textual flag |
| 52 | اليوم | il-yōm | 2 | E02 | E: no textual flag |
| 53 | اليوم الساعة ستة نشرب شاي سوا. | Il-yōm is-sāʿa sitte nishrab shāy sawa. | 3 | P01, P02, P03 | E: no textual flag |
| 54 | اليوم زرت أمي. | Il-yōm zurt immi. | 2 | E05 | E: no textual flag |
| 55 | اليوم؟ | Il-yōm? | 2 | E02, P03 | E: no textual flag |
| 56 | بالشغل | Bish-shughl | 1 | E06 | D: speaker/model check |
| 57 | بحب | baḥibb | 1 | E03 | E: no textual flag |
| 58 | بحب الشاي أكتر. | Baḥibb ish-shāy aktar. | 5 | E03 | E: no textual flag |
| 59 | بحب القهوة أكتر. | Baḥibb il-ʾahwe aktar. | 3 | E03, E04 | D: speaker/model check |
| 60 | بدك | biddak | 1 | E01 | E: no textual flag |
| 61 | بدك | biddik | 1 | E03 | E: no textual flag |
| 62 | بدك ترتاح؟ | Biddak tirtāḥ? | 3 | E01 | E: no textual flag |
| 63 | بدك سكر؟ | Biddak sukkar? | 1 | E03 | E: no textual flag |
| 64 | بدك سكر؟ | Biddik sukkar? | 2 | E03 | E: no textual flag |
| 65 | بدك شاي مع الأكل؟ | Biddik shāy maʿ il-akel? | 2 | E04 | E: no textual flag |
| 66 | بدك شاي وقهوة؟ | Biddik shāy w-ʾahwe? | 1 | E03 | D: speaker/model check |
| 67 | بدك شاي ولا قهوة؟ | Biddak shāy walla ʾahwe? | 4 | E03, E04, E06 | D: speaker/model check |
| 68 | بدك شاي ولا قهوة؟ | Biddik shāy walla ʾahwe? | 7 | E03, E07 | D: speaker/model check |
| 69 | بدك شاي؟ | Biddak shāy? | 1 | E03 | E: no textual flag |
| 70 | بدك قهوة هلّق؟ | Biddik ʾahwe hallaʾ? | 1 | E03 | D: speaker/model check |
| 71 | بدها شاي. | Biddha shāy. | 1 | E03 | E: no textual flag |
| 72 | بدون | bidūn | 1 | E03 | E: no textual flag |
| 73 | بدي | biddi | 2 | E01, E03 | E: no textual flag |
| 74 | بدي شاي. | Biddi shāy. | 4 | E03, P03 | E: no textual flag |
| 75 | بس | bass | 1 | E05 | E: no textual flag |
| 76 | بعد الشغل | Baʿd ish-shughl | 1 | E06 | D: speaker/model check |
| 77 | بعد الشغل | baʿd ish-shughl | 1 | E06 | D: speaker/model check |
| 78 | بكرا | Bukra | 3 | E06 | E: no textual flag |
| 79 | بكرا | bukra | 8 | E05, E06, E07, P01, P02, P03 | E: no textual flag |
| 80 | بكرا الساعة سبعة | bukra is-sāʿa sabʿa | 1 | E07 | E: no textual flag |
| 81 | بكرا الساعة سبعة نزور أهلي. | Bukra is-sāʿa sabʿa nzūr ahli. | 5 | P02, P03 | E: no textual flag |
| 82 | بكرا الساعة ستة نشرب شاي سوا. | Bukra is-sāʿa sitte nishrab shāy sawa. | 11 | P01, P02, P03 | E: no textual flag |
| 83 | بكرا نزورها؟ | Bukra nzūrha? | 1 | E05 | E: no textual flag |
| 84 | ترتاح | tirtāḥ | 1 | E01 | E: no textual flag |
| 85 | تعبانة | taʿbāne | 1 | E01 | D: speaker/model check |
| 86 | تمام | tamām | 5 | E06, E07, P01, P02, P03 | E: no textual flag |
| 87 | تمام. أي ساعة؟ | Tamām. Ayy sāʿa? | 15 | E06, P01, P02 | E: no textual flag |
| 88 | تمام. نعمل رز وسلطة الساعة سبعة؟ | Tamām. Niʿmal ruzz w-salaṭa is-sāʿa sabʿa? | 1 | E07 | D: speaker/model check |
| 89 | تمام، اليوم الساعة سبعة. وبعدين نشرب شاي. | Tamām, il-yōm is-sāʿa sabʿa. W-baʿdēn nishrab shāy. | 1 | E07 | E: no textual flag |
| 90 | تمام، اليوم الساعة ستة نزور أهلك. | Tamām, il-yōm is-sāʿa sitte nzūr ahlak. | 1 | E06 | E: no textual flag |
| 91 | تمام، بكرا الساعة سبعة نزور أهلك. | Tamām, bukra is-sāʿa sabʿa nzūr ahlak. | 6 | E06, P03 | E: no textual flag |
| 92 | تمام، بكرا الساعة سبعة. وبعدين نشرب شاي. | Tamām, bukra is-sāʿa sabʿa. W-baʿdēn nishrab shāy. | 2 | E07 | E: no textual flag |
| 93 | تمام، بكرا الساعة ستة نزور أهلك. | Tamām, bukra is-sāʿa sitte nzūr ahlak. | 6 | E06, P03 | E: no textual flag |
| 94 | تمام، بكرا الساعة ستة. وبعدين نشرب قهوة. | Tamām, bukra is-sāʿa sitte. W-baʿdēn nishrab ʾahwe. | 1 | E07 | D: speaker/model check |
| 95 | جوعان | jūʿān | 2 | E04 | E: no textual flag |
| 96 | جوعان هلّق؟ | Jūʿān hallaʾ? | 1 | E04 | D: speaker/model check |
| 97 | جوعانة | jūʿāne | 1 | E04 | D: speaker/model check |
| 98 | خلّينا نعمل | khallīna niʿmal | 1 | E04 | D: speaker/model check |
| 99 | رح | raḥ | 1 | E06 | E: no textual flag |
| 100 | رح أشتغل بكرا. | Raḥ ashtaghel bukra. | 1 | E02 | E: no textual flag |
| 101 | رحت | ruḥt | 1 | E02 | E: no textual flag |
| 102 | رحت عالبيت وبعدين ارتحت. | Ruḥt ʿa-l-bēt w-baʿdēn irtaḥt. | 5 | E02 | E: no textual flag |
| 103 | رحت عالبيت. | Ruḥt ʿa-l-bēt. | 1 | E02 | E: no textual flag |
| 104 | رز | ruzz | 2 | E04, P01 | E: no textual flag |
| 105 | رز وسلطة | ruzz w-salaṭa | 3 | E04, E07, P01 | D: speaker/model check |
| 106 | زرت | zurt | 1 | E02 | E: no textual flag |
| 107 | زرت أمي | zurt immi | 1 | E07 | E: no textual flag |
| 108 | زرت أمي وبعدين ارتحت. | Zurt immi w-baʿdēn irtaḥt. | 2 | E07 | E: no textual flag |
| 109 | زرت أمي وبعدين اشتغلت. | Zurt immi w-baʿdēn ishtaghalt. | 1 | E02 | D: speaker/model check |
| 110 | سبعة | sabʿa | 1 | E06 | E: no textual flag |
| 111 | ستة | sitte | 1 | E06 | E: no textual flag |
| 112 | سكر | sukkar | 1 | E03 | E: no textual flag |
| 113 | سوا | sawa | 5 | E04, E06, P01, P02 | E: no textual flag |
| 114 | شاي | shāy | 3 | E03 | E: no textual flag |
| 115 | شاي ولا قهوة؟ | Shāy walla ʾahwe? | 1 | E03 | D: speaker/model check |
| 116 | شاي، لو سمحت. | Shāy, law samaḥt. | 7 | E03, E07 | B: clarify aw |
| 117 | شغل كتير | shughl ktīr | 1 | E05 | D: speaker/model check |
| 118 | شكراً | shukran | 2 | E03, E05 | E: no textual flag |
| 119 | شو | shū | 4 | E01, E02, E06 | E: no textual flag |
| 120 | شو بدك تاكل؟ | Shū biddak tākol? | 1 | E04 | D: speaker/model check |
| 121 | شو رأيك | shū raʾyak | 2 | E04, E07 | E: no textual flag |
| 122 | شو رأيك تاكل لحالك؟ | Shū raʾyak tākol laḥālak? | 1 | E04 | D: speaker/model check |
| 123 | شو رأيك ناكل سوا اليوم؟ | Shū raʾyak nākol sawa il-yōm? | 1 | E07 | D: speaker/model check |
| 124 | شو رأيك ناكل سوا بكرا؟ | Shū raʾyak nākol sawa bukra? | 2 | E07 | D: speaker/model check |
| 125 | شو رأيك ناكل سوا؟ | Shū raʾyak nākol sawa? | 4 | E04 | D: speaker/model check |
| 126 | شو رح نعمل بكرا؟ | Shū raḥ niʿmal bukra? | 12 | E06, P01, P02, P03 | D: speaker/model check |
| 127 | شو عامل؟ | Shū ʿāmel? | 9 | E01, E02, E06 | E: no textual flag |
| 128 | شو عاملة؟ | Shū ʿāmle? | 7 | E01, E07 | E: no textual flag |
| 129 | شو عملت اليوم؟ | Shū ʿmilt il-yōm? | 7 | E01, E02, E04, E06, E07 | E: no textual flag |
| 130 | شو عملتي اليوم؟ | Shū ʿmilti il-yōm? | 5 | E02, E05 | E: no textual flag |
| 131 | شو نعمل بكرا؟ | Shū niʿmal bukra? | 1 | E07 | D: speaker/model check |
| 132 | شو نعمل للأكل؟ | Shū niʿmal lal-akel? | 1 | E04 | D: speaker/model check |
| 133 | شوي | shwayy | 2 | E01 | E: no textual flag |
| 134 | عالبيت | ʿa-l-bēt | 1 | E02 | E: no textual flag |
| 135 | عامل | ʿāmel | 1 | E01 | E: no textual flag |
| 136 | عاملة | ʿāmle | 1 | E01 | E: no textual flag |
| 137 | عملتي | ʿmilti | 1 | E02 | E: no textual flag |
| 138 | عندها | ʿindha | 1 | E05 | E: no textual flag |
| 139 | فتوش | Fattoush | 1 | E01 | C: name spelling |
| 140 | قبل الشغل | ʾAbel ish-shughl | 1 | E06 | D: speaker/model check |
| 141 | قهوة | ʾahwe | 2 | E03 | D: speaker/model check |
| 142 | قهوة، لو سمحتي. | ʾAhwe, law samaḥti. | 4 | E03, E07 | B: clarify aw |
| 143 | كمان | kamān | 1 | E04 | E: no textual flag |
| 144 | كيف | kīf | 2 | E05 | E: no textual flag |
| 145 | كيف أهلك؟ | Kīf ahlak? | 8 | E05, E06 | E: no textual flag |
| 146 | كيف أهلك؟ | Kīf ahlik? | 2 | E05 | E: no textual flag |
| 147 | كيف أهلي؟ | Kīf ahli? | 2 | E05 | E: no textual flag |
| 148 | كيفك؟ | Kīfak? | 1 | E05 | E: no textual flag |
| 149 | كيفها | kīfha | 1 | E05 | E: no textual flag |
| 150 | لا | laʾ | 4 | E03, P03 | E: no textual flag |
| 151 | لا، الساعة سبعة. | Laʾ, is-sāʿa sabʿa. | 7 | P03 | E: no textual flag |
| 152 | لا، الساعة ستة. | Laʾ, is-sāʿa sitte. | 3 | P03 | E: no textual flag |
| 153 | لا، بدون سكر، شكراً. | Laʾ, bidūn sukkar, shukran. | 5 | E03 | E: no textual flag |
| 154 | لا، بدي رز بس. | Laʾ, biddi ruzz bass. | 1 | E04 | E: no textual flag |
| 155 | لا، بكرا. | Laʾ, bukra. | 5 | E02, P03 | E: no textual flag |
| 156 | لا، شكراً. | Laʾ, shukran. | 7 | E01, E03, E04, E05, E07 | E: no textual flag |
| 157 | لو سمحت | law samaḥt | 1 | E03 | B: clarify aw |
| 158 | لو سمحتي | law samaḥti | 1 | E03 | B: clarify aw |
| 159 | ليش شاي؟ | Lēsh shāy? | 1 | E03 | E: no textual flag |
| 160 | مش | mish | 1 | E04 | E: no textual flag |
| 161 | منيح | mnīḥ | 1 | E01 | E: no textual flag |
| 162 | منيح! بكرا نزورها؟ | Mnīḥ! Bukra nzūrha? | 1 | E05 | E: no textual flag |
| 163 | منيح! هلّق نرتاح سوا. | Mnīḥ! Hallaʾ nirtāḥ sawa. | 1 | E02 | D: speaker/model check |
| 164 | منيح. | Mnīḥ. | 1 | E02 | E: no textual flag |
| 165 | منيحة | mnīḥa | 1 | E05 | D: speaker/model check |
| 166 | منيحة. | Mnīḥa. | 5 | E02, E05, E07 | D: speaker/model check |
| 167 | منيحة. اليوم بالبيت. | Mnīḥa. Il-yōm bil-bēt. | 3 | E05 | D: speaker/model check |
| 168 | منيحة. شو رأيك ناكل سوا بكرا؟ | Mnīḥa. Shū raʾyak nākol sawa bukra? | 1 | E07 | D: speaker/model check |
| 169 | منيحة. وإنتَ، شو عملت؟ | Mnīḥa. W-inta, shū ʿmilt? | 1 | E02 | D: speaker/model check |
| 170 | منيحة، بس عندها شغل كتير. | Mnīḥa, bass ʿindha shughl ktīr. | 4 | E05 | D: speaker/model check |
| 171 | منيحة، بس عندها شغل كتير. وكيف أمك؟ | Mnīḥa, bass ʿindha shughl ktīr. W-kīf immik? | 1 | E05 | D: speaker/model check |
| 172 | منيحين | mnīḥīn | 1 | E05 | A: prefer mnāḥ |
| 173 | منيحين، شكراً. | Mnīḥīn, shukran. | 7 | E05, E07 | A: prefer mnāḥ |
| 174 | ناكل | nākol | 1 | E04 | D: speaker/model check |
| 175 | ناكل سوا | nākol sawa | 1 | E07 | D: speaker/model check |
| 176 | ناكل سوا بكرا الساعة سبعة؟ | Nākol sawa bukra is-sāʿa sabʿa? | 1 | E07 | D: speaker/model check |
| 177 | ناكل سوا بكرا؟ | Nākol sawa bukra? | 1 | E07 | D: speaker/model check |
| 178 | نزور | nzūr | 1 | E06 | E: no textual flag |
| 179 | نزور أهلك | nzūr ahlak | 1 | P03 | E: no textual flag |
| 180 | نزور أهلك بعد الشغل؟ | Nzūr ahlik baʿd ish-shughl? | 1 | E06 | D: speaker/model check |
| 181 | نزور أهلك وبعدين نشرب شاي. | Nzūr ahlak w-baʿdēn nishrab shāy. | 2 | P02 | E: no textual flag |
| 182 | نزور أهلي بعد الشغل؟ | Nzūr ahli baʿd ish-shughl? | 11 | E06, P01, P02, P03 | D: speaker/model check |
| 183 | نزورها | nzūrha | 1 | E05 | E: no textual flag |
| 184 | نشرب شاي | nishrab shāy | 7 | E06, E07, P01, P02 | E: no textual flag |
| 185 | نشرب شاي سوا بكرا؟ | Nishrab shāy sawa bukra? | 1 | E06 | E: no textual flag |
| 186 | نشرب شاي وبعدين نزور أهلك. | Nishrab shāy w-baʿdēn nzūr ahlak. | 1 | P02 | E: no textual flag |
| 187 | نشرب شاي وبعدين نعمل رز وسلطة. | Nishrab shāy w-baʿdēn niʿmal ruzz w-salaṭa. | 6 | P02 | D: speaker/model check |
| 188 | نعمل | niʿmal | 5 | E04, E06, E07, P01 | D: speaker/model check |
| 189 | نعمل رز وسلطة | niʿmal ruzz w-salaṭa | 3 | P02 | D: speaker/model check |
| 190 | نعمل رز وسلطة الساعة سبعة. | Niʿmal ruzz w-salaṭa is-sāʿa sabʿa. | 8 | E07, P01 | D: speaker/model check |
| 191 | نعمل رز وسلطة الساعة ستة. | Niʿmal ruzz w-salaṭa is-sāʿa sitte. | 3 | E07, P01 | D: speaker/model check |
| 192 | نعمل رز وسلطة وبعدين نشرب شاي. | Niʿmal ruzz w-salaṭa w-baʿdēn nishrab shāy. | 3 | P02 | D: speaker/model check |
| 193 | نعمل رز وسلطة؟ | Niʿmal ruzz w-salaṭa? | 12 | E04, P01, P02 | D: speaker/model check |
| 194 | نعمل رز ولا سلطة؟ | Niʿmal ruzz walla salaṭa? | 1 | E04 | D: speaker/model check |
| 195 | نعمل شاي الساعة سبعة. | Niʿmal shāy is-sāʿa sabʿa. | 1 | E07 | D: speaker/model check |
| 196 | نعمل شاي؟ | Niʿmal shāy? | 1 | E04 | D: speaker/model check |
| 197 | هلّق | hallaʾ | 1 | E04 | D: speaker/model check |
| 198 | وأختك | w-ukhtak | 1 | E05 | E: no textual flag |
| 199 | وأختك، كيفها؟ | W-ukhtak, kīfha? | 5 | E05 | E: no textual flag |
| 200 | وإنتَ؟ | W-inta? | 4 | E01, E05, E07 | E: no textual flag |
| 201 | وإنتِ | w-inti | 1 | E01 | E: no textual flag |
| 202 | وإنتِ؟ | W-inti? | 7 | E01, E02, E05, E07 | E: no textual flag |
| 203 | وبعدين | w-baʿdēn | 9 | E02, E07, P01, P02 | E: no textual flag |
| 204 | وبعدين ارتحت | w-baʿdēn irtaḥt | 1 | E07 | E: no textual flag |
| 205 | وبعدين نشرب شاي سوا. | W-baʿdēn nishrab shāy sawa. | 9 | E06, P01, P02, P03 | E: no textual flag |
| 206 | وبعدين نعمل رز وسلطة. | W-baʿdēn niʿmal ruzz w-salaṭa. | 6 | P01, P02 | D: speaker/model check |
| 207 | وبعدين؟ | W-baʿdēn? | 4 | E02 | E: no textual flag |
| 208 | وسلطة | w-salaṭa | 2 | E04, P01 | D: speaker/model check |
| 209 | وكيف أمك؟ | W-kīf immik? | 2 | E05 | E: no textual flag |
| 210 | وكيفك؟ | W-kīfik? | 2 | E02, E05 | E: no textual flag |
| 211 | وكيفها | w-kīfha | 2 | E02, E07 | E: no textual flag |
| 212 | وكيفها؟ | W-kīfha? | 13 | E01, E02, E05, E07 | E: no textual flag |
| 213 | ولا | walla | 1 | E03 | E: no textual flag |
| 214 | يومي كان هادي. | Yōmi kān hādi. | 1 | E01 | E: no textual flag |
