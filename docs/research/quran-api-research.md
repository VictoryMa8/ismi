# Quran source and API research for Ismi

_Research date: 2026-09-02. Primary/first-party sources only. This is product and technical guidance, not legal advice; confirm content-specific rights in writing before launch._

## Recommendation in one paragraph

Use an immutable, versioned Quran-text source as the canonical text layer, with **Tanzil Quran Text v1.1** as the simplest self-hostable baseline and the **King Fahd Glorious Quran Printing Complex (KFGQPC)** data as an official comparison/rendering source. Use **Quran Foundation Content API v4** as the preferred managed source for named translations, word-by-word glosses, metadata, and licensed recitations, but keep it behind the ASP.NET backend, use Content Sync where permitted, and obtain production approval plus written confirmation for the exact translation/audio resource IDs used. Use **Quranic Arabic Corpus v0.4** only as a separately licensed, version-pinned morphology layer; it is not the canonical Quran text and its annotations can contain scholarly judgment. AI may create exercise drafts only from approved source-record IDs. It must never generate or rewrite Quran text, translations, tafsir, or morphology, and no exercise should publish without deterministic validation and human review.

## What each layer is—and is not

| Layer | Authority in Ismi | Suitable source | Important boundary |
|---|---|---|---|
| Quran text | Canonical, immutable source text | Tanzil v1.1 and/or directly licensed KFGQPC Hafs data; QF API for managed delivery | Never treat an LLM response, translation, tafsir, or morphological segmentation as the Quran text. Never normalize or silently alter the canonical string. |
| Structural metadata | Verse keys, surah/juz/page/hizb/ruku mappings | QF Content API; Tanzil metadata as an independently versioned comparison | Some metadata (page layout, revelation order, ruku) is edition- or tradition-dependent. Name the scheme/source. |
| Translation | A named human translation/edition | A specific QF translation resource with confirmed rights | A translation is not Quran text and should always show translator/edition. Do not ask AI to “improve” it. |
| Tafsir/explanation | A named scholarly work | A specific QF tafsir resource or separately licensed edition | Keep visually and logically separate from translation; interpretive claims need appropriate scholarly review. |
| Word gloss | A compact pedagogical aid | QF word-by-word resource | A gloss is context-sensitive and not a complete translation or morphological analysis. |
| Morphology | Linguistic annotation: segment, POS, lemma, root, features | Quranic Arabic Corpus v0.4 | It is expert-reviewed annotation built partly with AI, not revelation and not infallible. Pin its version and expose corrections separately. |
| Audio | A named reciter/recording and timing asset | Specific QF recitation resource, with recording rights confirmed | Recitation files remain copyright-sensitive recordings even though the Quran text itself is sacred content. Metadata or timestamp licenses do not automatically license the recording. |
| Exercise | Derived learning content | Deterministic templates and/or AI drafts grounded in approved records | Clearly label generated explanations; citations must resolve to stored source records. Human review is required before pre-generated content ships. |

## Source evaluation

### 1. Tanzil Quran Text — best simple self-hosted canonical baseline

**What it provides.** Tanzil publishes Uthmani and several simple/Imla'ei Unicode text forms. Its official download documentation identifies the latest text as **version 1.1**, and its change log dates v1.1 to 2021-02-12 and itemizes exact changes from earlier versions ([download documentation](https://tanzil.net/docs/download), [text updates](https://tanzil.net/updates/), [text types](https://tanzil.net/docs/quran_text_types)). Tanzil describes a multi-stage verification process using automatic comparison, rule-based checks, and manual comparison against the Medina Mushaf with letter/diacritic checksums and Quran specialists/Hafizes ([project and verification description](https://tanzil.net/docs/tanzil_project)).

**License and commercial use.** The official notice calls the text Creative Commons Attribution 3.0, permits it in any website or application, and requires clear Tanzil attribution and a link to its update page. It also says verbatim copying is allowed but changing the Quran text is not, and the notice must accompany verbatim copies or works containing a substantial portion ([Tanzil text license](https://tanzil.net/docs/Text_License)). This makes self-hosting feasible for an application, including a paid application, provided the exact text is preserved and the stated notice/attribution obligations are followed.

**Safeguards and versioning.** Store the original downloaded artifact unchanged, its Tanzil version, retrieval date, file hash, script variant, and full copyright notice. Generate search-normalized strings into a separate, clearly non-canonical column. Monitor the official update page rather than silently accepting changes.

**Limitations.** Tanzil is a carefully verified project, not a government printing authority. Its downloaded **translations are a separate product with separate terms**: Tanzil explicitly says its translations are for non-commercial use unless permission is obtained from the translator or publisher, disclaims guaranteed authenticity/accuracy, and requires named conditions for reuse ([Tanzil translations repository](https://tanzil.net/trans/)). Therefore, do **not** take English translations from Tanzil for a commercial Ismi launch without direct permission.

### 2. King Fahd Glorious Quran Printing Complex — strongest accountable official comparison/data source

**What it provides.** The Complex's official developer platform offers Hafs Uthmanic text/font packages and files for developers in formats including CSV, SQL, XML, and JSON. Its page publishes integrity hashes and update information: the regular Unicode Hafs package reports **update 13.0** (last modified 2023-09-19), while the smart-device package reports **update 6.0** (last modified 2022-06-30). The latter documents corrections to spacing, Imla'ei fields, juz metadata, and encoding. Because the package/update naming is not entirely intuitive, record the displayed update number, download date, filename, and archive hash together. The platform describes some content as trusted/approved by the Complex and intended for applications, educational products, websites, researchers, and publishing houses ([KFGQPC developer platform](https://qurancomplex.gov.sa/en/techquran/dev/)). QF's own font/source table identifies KFGQPC as the provider for multiple Hafs/Uthmani Mushaf and font IDs ([QF Mushaf fonts and images](https://api-docs.quran.com/legal/mushaf-fonts-and-images/)).

**License and self-hosting caution.** The developer page demonstrates an intent to distribute developer files and supplies hashes, so local hosting is technically possible. However, it does not present a sufficiently explicit open/Creative-Commons license or blanket commercial redistribution grant for every dataset, font, and asset. The Complex's site policy says its content is protected except services/files/tools specifically declared for public use ([official usage policy](https://policy.qurancomplex.gov.sa/?Lan=en)); a separate desktop-publishing program manual requires written permission for commercial use of that program ([official program manual](https://nashr.qurancomplex.gov.sa/download/Generalhelp.pdf)). That manual should not be projected onto unrelated archives, but it is strong reason not to assume commercial rights. QF also says its Content Sync permission does not grant rights to third-party KFGQPC fonts/images. Obtain written permission or archive the exact package license/user manual before bundling or redistributing a font, page image, or data package commercially. Contacts published by the Complex include `info@qurancomplex.gov.sa` and `developer@qurancomplex.gov.sa`.

**Recommended role.** Use the latest official KFGQPC Hafs dataset as an independent comparison in an ingestion test, and consider it as the production canonical source only after the exact package terms are archived and approved. Do not merge character sequences from Tanzil and KFGQPC into a hybrid “corrected” text; choose a canonical edition and retain comparisons as audit evidence.

### 3. Quran Foundation / Quran.com Content API v4 — best managed integration

**Coverage.** The v4 Content API exposes Quran text in multiple named scripts, chapters/verses, structural metadata, translations, tafsir, word-by-word translations/transliterations, recitation resources, audio, and timing endpoints. Verse responses can include named translation and tafsir resource IDs plus word audio/gloss/transliteration; the text endpoint supports Uthmani, QPC Hafs, Imla'ei and other explicit script identifiers ([Content API overview](https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/content-apis/), [Quran text by script](https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/quran-verses-by-script/), [verses by chapter](https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/verses-by-chapter-number/), [translation resources](https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/translations/), [audio timestamp endpoint](https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/audio-reciter-timestamp/)). It cleanly distinguishes translation and tafsir resources by ID, which Ismi should preserve.

**Authentication and C# fit.** QF now requires OAuth2 Client Credentials with `content` scope, a 3,600-second access token, and both `x-auth-token` and `x-client-id` on each request. Client secrets must stay on the backend. QF recommends raw HTTP for non-JavaScript stacks, so an ASP.NET `HttpClient`/typed-client integration is fully compatible; no JS SDK is required ([Content API quickstart](https://api-docs.quran.foundation/docs/quickstart/)). New clients begin in pre-live and need production permissions.

**Commercial use and content rights.** QF's developer terms, last updated 2026-08-26, permit charging for an app, subscriptions, in-app purchases, ads, donations, or freemium access when QF content is part of the end-user experience, is not sold/sublicensed/redistributed as raw data, and source-specific licenses are honored. Selling or redistributing QF content/raw API data as a dataset, API, feed, or content package requires a separate written commercial license. The Quran text may not be modified, and snippets must preserve context and meaning ([QF Developer Terms](https://api-docs.quran.foundation/legal/developer-terms/)).

This is **not a blanket license for every translation or recording**. Before locking content, submit the exact resource IDs, in-app use, storage model, monetization, and attribution to `developers@quran.foundation`; archive the response. Credit “Quran data provided by Quran Foundation,” and also name each translation, tafsir edition, and reciter/recording wherever surfaced ([QF FAQ](https://api-docs.quran.foundation/docs/tutorials/faq/), [Connected Apps content and attribution requirements](https://api-docs.quran.foundation/docs/connected-apps/)).

**Caching, self-hosting, and freshness.** Ordinary QF content may not be stored more than one week without permission. The exception is content available through **Content Sync**, currently including mushafs, translations, word-by-word translations, tafsirs, recitations, and articles; an app using the exception must sync at least every seven days and apply all changes. Content Sync provides bootstrap snapshots plus incremental tokens and is explicitly designed for a local database/cache ([Content Sync overview](https://api-docs.quran.com/docs/tutorials/content-sync/getting-started/), [offline cache pattern](https://api-docs.quran.com/docs/tutorials/content-sync/offline-cache-patterns/)). It does not grant local rights to third-party fonts/images.

This is local caching/synchronization, **not full independent self-hosting of QF's service**. The official SDK is open source/MIT, and a legacy API codebase exists, but the legacy repository states that the complete database dump is private. Do not base continuity plans on rebuilding QF from its public code.

**Reliability, rate limits, and versioning.** The API is explicitly v4 and exposes `429`, `500`, `502`, `503`, and `504` failures. Official guidance requires bounded exponential backoff with jitter, not blind retries ([first API call/error handling](https://api-docs.quran.foundation/docs/quickstart/first-api-call/)). No public universal numeric quota was found; the terms refer to published/assigned quotas, and non-public rate-limit values are confidential. QF may modify or discontinue an API and says it will ordinarily provide about 30 days' notice for breaking changes. Its service/content are provided “as is,” so there is no public uptime SLA in the reviewed terms ([QF Developer Terms](https://api-docs.quran.foundation/legal/developer-terms/)). Ismi should therefore read from its valid local Content Sync cache, alert on missed seven-day syncs, and retain an export-free degraded mode rather than depending on live API calls per lesson.

### 4. Quranic Arabic Corpus (QAC) v0.4 — useful morphology, not canonical text

**What it provides.** The official download is **Quranic Arabic Corpus morphology version 0.4 (2011)**. It supplies syntactic/morphological annotations built on Tanzil's verified Arabic text. The current project describes POS tagging and linguistic data as initially AI-generated and then manually reviewed by human experts/community; it also states that the syntactic treebank remains incomplete ([official v0.4 download/terms](https://corpus.quran.com/download/), [current project repository](https://github.com/kaisdukes/quranic-corpus)). JQuranTree provides an open-source Java access library for Quran text/analysis, but it is not a hosted REST service ([official Java API page](https://corpus.quran.com/java/)).

**License and self-hosting.** The download page requires a contact email and acceptance of the GNU license. Its embedded terms permit verbatim copying/distribution, prohibit changing the file, require clear QAC attribution and a link so users can track changes, and require the notice in verbatim/substantial derived copies. This makes local parsing/self-hosting technically feasible, but the combination of GPL labeling and additional “do not change” data terms deserves legal review before distributing transformed morphology data in a closed-source client. The conservative design is to keep the original file unmodified in a backend ingestion vault, store parsed annotations in a server-only database, reproduce the notice/attribution, and avoid shipping the raw/derived corpus in the app until counsel confirms obligations.

**Version risk.** v0.4 is old and its underlying Quran text predates Tanzil v1.1. The QAC repository records an open issue noting that the corpus used the 2008 Tanzil Uthmani text and that Tanzil's 2021 changes can affect token boundaries and lemmatization ([official repository issue on Tanzil update](https://github.com/kaisdukes/quranic-corpus/issues/52)). Never join morphology to a modern canonical text by raw character offsets alone. Join through explicit `(surah, ayah, word/segment)` mappings, maintain exception tables, and human-review all mismatches.

### 5. Audio/recitation

QF is the best single managed interface because recitation resources and Content Sync include named ayah/chapter audio, while the timestamp endpoint can return chapter, verse, or word ranges in milliseconds ([Content Sync supported recitations](https://api-docs.quran.com/docs/tutorials/content-sync/getting-started/), [timestamp endpoint](https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/audio-reciter-timestamp/)). However, recordings have their own rights. QF's terms allow paid apps only subject to source-specific licenses, and QF's Connected Apps page specifically warns that hosting or redistributing licensed recitations may require a separate written content license ([Connected Apps](https://api-docs.quran.foundation/docs/connected-apps/)).

Do not assume that the open-source license of the QuranicAudio website code licenses its MP3 catalog; the public repository does not publish a content license for the recordings. A useful corroborating open dataset, Qur'anic Universal Audio, explicitly licenses its own timestamps/metadata as CC BY 4.0 while stating that recordings remain the property of reciters/upstream sources—an example of why timing-data rights and recording rights must be tracked separately ([project repository](https://github.com/Wider-Community/quranic-universal-audio)). For launch, select one QF recitation resource, ask QF to confirm streaming/caching rights for a commercial learning app, attribute the reciter and source, and do not mirror MP3s outside the permitted sync/storage model.

## Conservative Ismi architecture

### Data model and ingestion

1. **Immutable source artifacts.** Save each authorized download/API snapshot with `provider`, `source_url`, `provider_resource_id`, `edition/script/riwayah`, `upstream_version`, `retrieved_at`, `license_snapshot_url`, and SHA-256. Never overwrite; supersede with a new version.
2. **Canonical verse records.** Store `verse_key`, canonical Unicode string, script/riwayah, source artifact ID, and checksum. Database permissions should prevent application and AI services from updating these rows.
3. **Separate derived tables.** Keep search-normalized text, named translations, tafsir, word glosses, morphology, audio, and structural metadata in different tables, each with its own source/version/license ID. Do not collapse them into one “meaning” field.
4. **Alignment layer.** Map QAC segments and QF words to canonical verse/word IDs through an audited mapping table. Record mismatches instead of auto-correcting source text.
5. **Content Sync worker.** An ASP.NET background service performs QF sync at least every seven days, applies snapshots transactionally, retains the last valid cache on failure, and alerts before the compliance window is missed.

### AI boundary

```text
approved source records (read-only)
        -> constrained exercise specification
        -> AI draft (no source mutation)
        -> deterministic validators
        -> human curriculum review
        -> published exercise + resolvable provenance
```

The generator receives only approved record IDs and the minimum retrieved fields needed for one exercise. Its structured output must include those IDs, question type, answer, distractors, and a plain-language rationale. It cannot supply Quran text, translation, root, lemma, POS, or tafsir values; those fields are copied by application code from the source tables after generation.

Deterministic publication gates should verify:

- every displayed Arabic span is byte-for-byte from an approved canonical record;
- each answer and distractor references an existing approved word/translation/morphology record;
- verse keys, word order, audio resource IDs, and citations resolve;
- no answer depends on an unapproved translation or a stale/removed QF resource;
- generated text cannot be rendered in the UI style reserved for Quran text, translation, or tafsir;
- interpretive/theological claims are rejected or routed to qualified review;
- source versions and reviewer identity are frozen with the published exercise.

QF's current Connected Apps rules closely support this boundary: retrieved source material must be visually separated from AI output; generated explanations must be labeled; Quranic/scholarly claims need genuine resolvable citations; pre-generated AI content must be human-reviewed before publication; and substantive interpretive, legal, theological, or sectarian claims require review proportionate to risk, including qualified scholarly review when needed ([QF Connected Apps AI requirements](https://api-docs.quran.foundation/docs/connected-apps/)). QF also prohibits using its content to build machine-learning models without written consent. If QF content is sent to an external inference provider, obtain QF confirmation, use a no-training/no-retention configuration, disclose the processor, and minimize prompts.

For launch, prefer AI for low-risk variations—distractors, ordering, cloze placement, and feedback wording—while source facts and correct answers are assembled deterministically. Do not enable free-form Quran interpretation.

## Practical source choice for the first three-surah milestone

- **Canonical Arabic:** self-host Tanzil Uthmani v1.1 unchanged, or KFGQPC Hafs only after its exact package license is confirmed. Cross-check the three selected surahs against the other source during ingestion.
- **English direct meaning:** one named QF translation resource whose exact commercial/end-user-display rights QF confirms in writing. Do not use a downloaded Tanzil translation without translator/publisher permission.
- **Word-level learning:** QF word-by-word translation/transliteration plus QAC v0.4 morphology as independent fields. Treat alignment disagreements as review tasks.
- **Audio:** one named QF recitation resource, streamed or synced only within confirmed terms; store reciter, resource ID, and rights evidence.
- **Tafsir:** omit from the MVP unless the curriculum actually needs interpretation. If added, make it a named, separately attributed source and require qualified review for derivative claims.
- **AI:** batch-generate drafts; require deterministic validation and recorded human approval before release.

## Decisions/permissions to obtain before coding content ingestion

1. Ask Quran Foundation to approve production access and confirm the precise translation, word-by-word, recitation, and audio resource IDs, commercial model, Content Sync storage, AI-inference use, and attribution placement.
2. Choose either Tanzil v1.1 or a specifically licensed KFGQPC Hafs package as the canonical Unicode string; document the riwayah/script and do not mix sources.
3. Have counsel review QAC v0.4's GPL-plus-verbatim terms before distributing any parsed morphology to clients.
4. Record licenses and upstream notices as versioned artifacts; make the content pipeline fail closed if rights evidence or required attribution is missing.
5. Name a qualified Quranic Arabic reviewer for morphology-sensitive and interpretive exercises even though AI remains the drafting engine.
