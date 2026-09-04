# Arabic text-to-speech options for Ismi

_Research date: 2026-09-02. Primary/first-party sources only. Prices and voice catalogs change; verify them before committing to a provider._

## Recommendation

Yes—Ismi can add audible Arabic now. For a bounded beta experiment, use **Azure AI Speech** behind the ASP.NET API and test its two Jordanian voices (`ar-JO-SanaNeural` and `ar-JO-TaimNeural`) against a short, reviewer-approved Palestinian/Jordanian evaluation set. Azure is the strongest first experiment because it has explicit Jordanian and Lebanese Arabic voices, browser-friendly output formats, real-time and batch synthesis, and unusually clear documentation that real-time input text and output audio are not retained. It does **not** offer a Palestinian TTS voice: `ar-PS` appears in Azure's speech-to-text catalog, not its text-to-speech voice table.

Use that integration as a preview/fallback and authoring aid, not as launch curriculum authority. Pre-generate approved clips on the server, review every clip for meaning, stress, vowels, dialect, and register, package accepted audio with downloadable lessons, and keep the provider replaceable. Core Levantine lessons must continue to use recordings from multiple reviewed Palestinian speakers; do not relabel a Jordanian, Lebanese, generic Arabic, Gulf, or prompted multilingual voice as Palestinian. For MSA, compare Azure with **Google Cloud TTS `ar-XA`**, which Google explicitly identifies as Modern Standard Arabic. For Quranic content, use a separately licensed, named human recitation—not general TTS—as the recitation source.

## At-a-glance comparison

| Provider | Documented Arabic fit | Delivery and formats | Published price relevant to a beta | Privacy/data note | Ismi judgment |
|---|---|---|---|---|---|
| Azure AI Speech | Explicit voices for Jordan (`ar-JO`), Lebanon (`ar-LB`), Syria, Saudi Arabia, Egypt, and many other locales; no `ar-PS` TTS voice | Real-time SDK/REST; async batch; MP3, RIFF/WAV PCM, raw PCM, Ogg/WebM Opus, and telephony formats | Microsoft currently uses **$15 per 1M characters** for standard TTS cost estimates; billing is per successfully processed character | Microsoft says prebuilt real-time TTS stores neither input text nor output audio | **Best first Levantine-adjacent prototype**, subject to human evaluation; also viable for MSA testing |
| Google Cloud TTS | `ar-XA`, explicitly documented as **Modern Standard Arabic**; no Palestinian/Levantine locale | Sync; preview bidirectional streaming for Chirp 3 HD; async long audio; LINEAR16/WAV, MP3, Ogg Opus, μ-law, A-law | Standard $4/1M; WaveNet/Neural2 $16/1M; Chirp 3 HD $30/1M, after stated free allowances | Google says Cloud TTS is stateless/resourceless and logs no customer TTS text or audio | **Best explicitly labeled MSA candidate**; poor fit for Palestinian dialect |
| OpenAI TTS | Arabic is accepted, but built-in voices are optimized for English and have no documented Arabic locale identity | Real-time chunked streaming; MP3, Opus, AAC, FLAC, WAV, PCM | `gpt-4o-mini-tts`: $0.60/1M input text tokens + $12/1M output audio tokens; `tts-1`: $15/1M characters | API data is not used for training by default; default abuse-monitoring logs can retain content up to 30 days; approved customers may obtain modified or zero data retention | Flexible for experiments and dynamic speech, but **not the first choice for controlled Arabic pedagogy** without extensive evaluation |
| Amazon Polly | One generic Arabic standard voice (`arb`, Zeina) and two Gulf Arabic neural voices (`ar-AE`, Hala and Zayd); no Palestinian, Jordanian, Levantine, or explicit MSA locale | Request/response audio stream; async long synthesis to S3; MP3, Ogg Vorbis/Opus, PCM, μ-law, A-law | Standard $4/1M; neural $16/1M; published free tier/credits may apply | AWS warns that data entered into services may be included in diagnostic logs and recommends excluding sensitive identifying information | Technically simple and inexpensive, but the **weakest dialect match** for Ismi's flagship track |

## Provider details

### Azure AI Speech

Azure's current voice catalog lists female and male voices for Jordan (`ar-JO-SanaNeural`, `ar-JO-TaimNeural`) and Lebanon (`ar-LB-LaylaNeural`, `ar-LB-RamiNeural`), as well as locale-specific voices for Egypt, Iraq, Saudi Arabia, Syria, and other Arabic regions. The same Microsoft page lists `ar-PS` under speech-to-text locales, but the TTS voice table has no `ar-PS` entry. Microsoft also says each standard voice supports a specific language and dialect and recommends matching the selected voice and SSML locale ([language and voice support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support)).

That makes `ar-JO` a useful **candidate approximation** for Ismi's deliberately labeled Jordanian variants, not evidence that the model speaks urban Palestinian. Ismi should evaluate concrete items rather than assuming geographic proximity guarantees the right realization. A useful test set should cover at least `ق`, `ك`, `ج`, interdental consonants, feminine/masculine endings, clitics, negation, unstressed-vowel reduction, proper names, numbers, and sentences with and without diacritics. Record the exact voice ID, SSML, source text, provider date, and reviewer decision with every accepted asset.

Azure supports real-time synthesis through its SDK or REST API and asynchronous batch synthesis for longer material ([TTS overview](https://learn.microsoft.com/en-us/azure/ai-services/Speech-Service/text-to-speech), [batch synthesis properties](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/batch-synthesis-properties)). Its SDK exposes MP3, RIFF/WAV PCM, raw PCM, Ogg Opus, WebM Opus, A-law, μ-law, AMR-WB, and G.722 variants at several sample rates ([.NET output-format reference](https://learn.microsoft.com/en-us/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisoutputformat?view=azure-dotnet)). MP3 or WebM/Ogg Opus would be reasonable delivery formats for downloaded PWA assets; archive a lossless master when possible.

Microsoft documents TTS billing per successfully processed character and currently uses **$15 per million characters** in its standard-TTS cost-estimation example ([pricing note and quotas](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-services-quotas-and-limits), [billable-character definition](https://learn.microsoft.com/en-us/azure/ai-services/Speech-Service/text-to-speech#pricing-note)). Region, agreement, and product tier can affect the actual invoice, so the Azure calculator remains the source of truth at purchase time.

For prebuilt real-time synthesis, Microsoft says neither input text nor output audio is stored in Microsoft logs. Batch scripts and results are stored to process the job and can be deleted; custom-voice data has separate retention and consent rules ([Azure TTS data, privacy, and security](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/text-to-speech/data-privacy-security)). This is a good privacy fit for the beta, especially if Ismi sends only approved curriculum text rather than learner data.

### Google Cloud Text-to-Speech

Google documents its Arabic `ar-XA` catalog as **Modern Standard Arabic (usually `ar-001`)**. It offers several voice families, including Chirp 3 HD, WaveNet, Standard, and Neural2 voices, but it does not publish a Palestinian or other Levantine locale in that catalog ([supported voices and languages](https://cloud.google.com/text-to-speech/docs/voices)). This makes it a clean MSA evaluation candidate and a poor basis for claiming Palestinian pronunciation.

The regular API synthesizes a complete request synchronously. Bidirectional streaming is available in preview and currently requires Chirp 3 HD voices; it can receive text while returning audio. Long Audio Synthesis runs asynchronously and writes output to Cloud Storage ([streaming quickstart](https://docs.cloud.google.com/text-to-speech/docs/create-audio-text-streaming), [long-audio API](https://docs.cloud.google.com/text-to-speech/docs/reference/rest/v1/projects.locations/synthesizeLongAudio)). Output encodings include LINEAR16 with a WAV header, MP3, Ogg Opus, μ-law, and A-law ([audio encoding reference](https://docs.cloud.google.com/text-to-speech/docs/reference/rest/v1/AudioEncoding)).

Current list pricing is character-based: Standard voices are **$4 per million characters**, WaveNet and Neural2 **$16 per million**, and Chirp 3 HD **$30 per million**, each after its documented monthly free usage allowance ([Google Cloud TTS pricing](https://cloud.google.com/text-to-speech/pricing/)). Google states that Cloud TTS is stateless and resourceless and that it does not log customer TTS text or audio ([Cloud TTS data logging](https://docs.cloud.google.com/text-to-speech/docs/data-logging)).

### OpenAI text-to-speech

OpenAI's speech endpoint accepts Arabic input and supports prompting `gpt-4o-mini-tts` for attributes such as accent, intonation, speed, and tone. However, OpenAI explicitly says its built-in voices are optimized for English; the documentation does not promise Palestinian, Levantine, Jordanian, MSA, or Quranic locale fidelity. Arabic support therefore means the model can produce Arabic audio, not that it is pedagogically reliable for a named variety ([OpenAI TTS guide](https://developers.openai.com/api/docs/guides/text-to-speech)).

The Speech API supports chunked-transfer streaming so playback can begin before the full file is ready. It returns MP3, Opus, AAC, FLAC, WAV, or 24 kHz 16-bit PCM. `gpt-4o-mini-tts` supports instructions; `tts-1` favors latency and `tts-1-hd` quality ([TTS guide](https://developers.openai.com/api/docs/guides/text-to-speech), [speech endpoint](https://platform.openai.com/docs/api-reference/audio/createSpeech)). The guide documents direct response/file streaming, but not a dedicated asynchronous long-audio job comparable to Azure Batch, Google Long Audio, or Polly's S3 task.

Current `gpt-4o-mini-tts` list pricing is **$0.60 per million input text tokens plus $12 per million output audio tokens** ([model page](https://developers.openai.com/api/docs/models/gpt-4o-mini-tts)); `tts-1` is **$15 per million characters** and `tts-1-hd` is listed at $30 per million ([TTS-1 model page](https://developers.openai.com/api/docs/models/tts-1)). These units are not directly comparable without measuring representative Arabic samples.

OpenAI says API inputs and outputs are not used to train models unless the organization opts in. Default abuse-monitoring logs may include prompts and responses and are retained for up to 30 days; eligible approved customers can configure Modified Abuse Monitoring or Zero Data Retention ([OpenAI API data controls](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint)). OpenAI also requires clear disclosure that a generated voice is AI rather than human ([TTS guide](https://developers.openai.com/api/docs/guides/text-to-speech)). For Ismi, sending only fixed curriculum strings greatly reduces privacy risk; dynamic learner-authored text needs a separate data-flow review.

### Amazon Polly

Polly's published Arabic catalog is narrow: Zeina is a standard `arb` Arabic voice, while Hala and Zayd are neural `ar-AE` Gulf Arabic voices. The catalog does not list Palestinian, Jordanian, Lebanese, Syrian, Levantine, or an explicitly named MSA locale ([available voices](https://docs.aws.amazon.com/polly/latest/dg/available-voices.html)). It is therefore easy to trial but poorly aligned with Ismi's flagship variety. A generic `arb` label should not be interpreted as a reviewed MSA or Quranic voice without provider documentation and human testing.

`SynthesizeSpeech` returns an audio stream in near real time. `StartSpeechSynthesisTask` handles up to 100,000 billable characters asynchronously and writes the result to an S3 bucket. Output options include MP3, Ogg Vorbis, Ogg Opus, PCM, μ-law, and A-law ([request/response synthesis comparison](https://docs.aws.amazon.com/polly/latest/dg/bidirectional-streaming-choosing.html), [asynchronous synthesis](https://docs.aws.amazon.com/polly/latest/dg/asynchronous.html), [SynthesizeSpeech API](https://docs.aws.amazon.com/polly/latest/APIReference/API_SynthesizeSpeech.html)). Polly's newer bidirectional streaming requires the generative engine, while its documented Arabic voices are standard or neural, so that feature does not solve Arabic streaming for this use case.

AWS prices standard voices at **$4 per million characters** and neural voices at **$16 per million characters**. Its pricing page also documents free-tier allowances/credits and says generated speech can be cached and replayed at no additional Polly cost ([Amazon Polly pricing](https://aws.amazon.com/polly/pricing/)). AWS's Polly security guide recommends excluding sensitive identifying information because data entered into services can be included in diagnostic logs ([data protection in Polly](https://docs.aws.amazon.com/polly/latest/dg/data-protection.html)).

## Track-specific limits

### Urban Palestinian Levantine

None of these providers documents a Palestinian TTS voice. Azure's Jordanian voices are the closest named candidates and are also directly relevant to Ismi's labeled Jordanian variants, but only reviewed Palestinian speakers can establish whether a generated clip is suitable for a Palestinian teaching target. TTS should cover temporary demos, low-stakes UI speech, authoring previews, and perhaps clearly labeled fallback playback—not the core acoustic model learners are asked to imitate.

### Modern Standard Arabic

Google's `ar-XA` is the clearest documented match because Google explicitly calls it MSA. Azure's Arabic voices may also read formal Arabic well, but locale-specific quality must be tested. Diacritics, case endings, pause forms, numbers, abbreviations, and mixed Arabic/English text should all be included in the evaluation. Choose by blinded listening review, not provider marketing language.

### Quranic Arabic

General TTS is not a substitute for Quran recitation. The four APIs do not document tajwid-grade or named-riwayah recitation, and generated audio can mis-vowel or otherwise realize ambiguous undiacritized text incorrectly. Ismi's canonical Quran text must never be rewritten or normalized to improve a TTS result. Use a rights-cleared recording by a named reciter for Quran audio, preserve its provenance separately from text and translations, and use TTS only for separately reviewed non-canonical teaching prose if needed.

## Suggested beta experiment

1. Put the provider adapter in `i-api`; never expose a provider credential to `i-web`.
2. Start with Azure `ar-JO-SanaNeural` and `ar-JO-TaimNeural`, plus Google `ar-XA` as the MSA comparator. Generate only a small fixed evaluation pack—not the full curriculum.
3. Have a qualified speaker score each clip for intelligibility, naturalness, target variety/register, vowel accuracy, consonants, stress, phrasing, and teaching suitability. Keep the source text, diacritized rendering, voice ID, settings, provider model/version date, and scores.
4. Store approved files as versioned lesson assets and include them in the existing downloadable lesson package. Playback must continue offline and must expose a transcript/caption; synthesis itself need not run on the learner's device.
5. Label synthesized clips as AI-generated and never describe them as native-speaker recordings. Prefer reviewed human recordings for core dialogues and model pronunciation.
6. Hide the implementation behind a provider-neutral interface so a voice can be replaced without changing lesson records. A lesson should reference an approved audio asset and provenance record, not a live TTS request.

## Decision

**Recommended now:** approve a small Azure proof of concept for reviewed, pre-generated Jordanian-adjacent demo audio, with Google `ar-XA` included in the MSA bake-off. Defer any production provider commitment until native/reviewer listening results exist. Do not use OpenAI or Polly merely because integration is convenient, and do not use any of the four as the sole source of core Levantine or Quranic audio.
