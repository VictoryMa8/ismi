# Azure F0 three-phrase audition

Owner authorized this alternative on October 3, 2026, after both Chatterbox
variants retained pronunciation errors. This is an audition, not a provider choice
for production or a change to F09's human-audio requirement.

## Prepared scope

Six requests: e01-01, e01-04, e01-06 in `ar-JO-SanaNeural` and
`ar-JO-TaimNeural`. Exact approved Arabic; SSML rate `-20%`; target output
`riff-24khz-16bit-mono-pcm`. No pronunciation spellings, diacritics or phonemes have
been substituted. Both voices are compared on all phrases; this is not a final
character-to-voice assignment. Jordanian locale does not certify Palestinian dialect.

`python3 tools/azure-speech/prepare.py` verifies the source package/hash, transcripts
and roles using the existing standard-library validation, then creates six SSML
files and a request manifest. It makes no network calls and needs no credentials.

## Next steps after account access

1. Inspect the signed-in account for an existing **Speech F0** resource. If absent,
   prepare a free Speech resource; verify F0 before synthesis. Do not select S0,
   upgrade billing or accept new legal terms on the owner's behalf.
2. Check the regional voice list for both exact voice IDs. Keep keys out of chat,
   tracked files, command-line arguments and browser-served directories.
3. Submit the six prepared SSML requests once, sequentially, or use Speech Studio's
   supported SSML editor. Stop on quota/auth/provider failure; no automatic paid fallback.
4. Save WAVs and sidecars under ignored `outputs/`. Record voice/provider, region,
   request hash, synthesis date, output hash/format/duration and pending review.
   Azure service model revisions may not be exposed: do not invent a model pin or
   promise identical regeneration. Saved output hashes identify actual artifacts.
5. Present a comparison with exact transcripts. Judge ʿayn, endings and speech rate.
   No batch expansion, published content or application integration before acceptance.

Status (October 3): signed-in Azure portal inspected. Subscription inventory shows
0 of 0 and no alternative directories are listed. Free-account enrollment opened
for the owner; subscription activation and F0 verification are still required.
No resource, paid service or generated audio has been created. Owner explicitly
requires no paid services; do not upgrade to pay-as-you-go or use paid trial-credit
resources as a substitute for F0. Enrollment identity/card verification and legal
acceptance remain with the owner.

## Official references checked October 3, 2026

- [Free tier pricing](https://azure.microsoft.com/en-gb/pricing/details/speech/?cdn=disable):
  F0 neural allowance, separate from S0.
- [Voice availability](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts).
- [REST synthesis and authentication](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech).
- [SSML voice/prosody](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice).
- [Pronunciation controls](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation).

The audition tests feasibility and sound quality. Production redistribution,
offline-storage rights and provider terms need verification before publishing clips.
