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

Historical status (October 3): signed-in Azure portal inspected. Subscription inventory shows
0 of 0 and no alternative directories are listed. Free-account enrollment opened
for the owner; subscription activation and F0 verification are still required.
No resource, paid service or generated audio has been created. Owner explicitly
requires no paid services; do not upgrade to pay-as-you-go or use paid trial-credit
resources as a substitute for F0. Enrollment identity/card verification and legal
acceptance remain with the owner.

## Runner and resource verification — October 17, 2026

The owner resumed F19 implementation with their signed-in Safari Azure session.
Created `ismi-f19-audition` in the resource group of the same name, East US.
The post-deployment Speech inventory shows **F0 / Succeeded**. No S0 resource,
paid upgrade, application deployment or audio publication was performed.

`synthesize.py` validates the six pinned requests against the existing historical
approved package (not a claim that these are the latest hosted lesson versions).
Its default mode makes no network calls and reads no credentials:

```sh
python3 tools/azure-speech/prepare.py
python3 tools/azure-speech/synthesize.py
python3 -m unittest discover -s tools/azure-speech -p 'test_*.py'
```

After explicit permission to save authentication information, place this configuration
in ignored `.cache/resource.json`, set its permissions to `600`, and supply the real
resource key there. Never place it in chat, command arguments, tracked examples or
the learner application. `verifiedAt` records an actual portal F0 check, not an
automatic management API verification; recheck the resource before generating.

```json
{
  "tier": "F0",
  "region": "eastus",
  "verifiedAt": "2026-10-17",
  "key": "REPLACE_LOCALLY"
}
```

```sh
python3 tools/azure-speech/synthesize.py --generate
```

The runner checks regional availability of both voices, then sends six sequential
REST synthesis requests. It refuses redirects, S0 configuration, mismatched text,
unexpected audio formats, and nonempty output directories. It records an attempt
before each synthesis request so a timeout cannot silently trigger regeneration.
There are no automatic retries. A failed/ambiguous attempt requires inspection,
not blindly choosing another output directory. Portal verification is the authority
for the resource tier; the data-plane API does not return billing-tier evidence.

Each successful WAV has a JSON provenance sidecar, output hash/duration and pending
owner review. `outputs/azure-v1/index.html` is a local, offline listening comparison.
The key never enters the output directory or sidecars. Azure's model revision is
explicitly recorded as not exposed. Seven offline tests cover exact inputs,
tampered/duplicate requests, WAV format/truncation, paid-tier refusal, sequential
six-output generation, repeat refusal and failure-without-retry using mocked HTTP.
Test WAVs are disposable fixtures, not provider samples or pronunciation evidence.

The owner explicitly permitted local key storage and six-clip generation. All six
real WAVs were generated October 17 in `outputs/azure-v1/`, with sidecars and the
comparison page. Both regional voices were available; format/hash checks passed.
The browser comparison displayed all six controls and the first clip entered the
playing state. This is playback evidence, not pronunciation acceptance. The next
gate was actual owner listening acceptance. Subsequent owner feedback reports
material word errors: feminine “shoo amle” sounds like “amela,” and “biddik” sounds
like “bedke.” The audition is unsuitable for lesson integration; no clips accepted.
The owner did not identify which voice(s), so no voice-specific disposition is inferred.
Exact synthesis provenance, review feedback and hashes
are preserved in [the audition record](../../docs/azure-audition-2026-10-17.json).

To reopen the comparison, serve only its output directory (never the repo or
credential directory), then visit `http://127.0.0.1:8769`:

```sh
python3 -m http.server 8769 --bind 127.0.0.1 --directory tools/azure-speech/outputs/azure-v1
```

REST endpoint/header behavior rechecked against the
[Microsoft REST reference](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech)
on October 17. Production rights and core human-audio requirements remain separate.

## Pronunciation correction experiment — October 17

The owner authorized a correction test after reporting word errors. `correct.py`
bounds generation to e01-04/e01-06, both original Jordanian voices, and four methods:
unvowelled normal speed, experimental vowel marks at normal speed, vowel marks at
−20%, and experimental IPA at normal speed. Original requests/clips are preserved.
This is sixteen requests, not a course batch or changed curriculum. Synthesis hints
are stored separately from source transcripts; no learner text, participant mapping
or publication changes. Vowel-only variants preserve all base letters. Vowel marks
cannot express every desired dialect vowel; all hints are unreviewed proposals.

The pinned e01-06 script says **Biddak tirtāḥ?**; the owner's feedback referred to
**biddik**. This experiment retains the script target and flags that distinction.
No curriculum gender-target revision is inferred.

```sh
python3 tools/azure-speech/correct.py
python3 tools/azure-speech/correct.py --generate
```

All sixteen real WAVs generated in `outputs/azure-correction-v1/`. The resource was
rechecked in Safari as **Free / Active** beforehand. Azure accepted all four IPA
requests; request compatibility does not establish pronunciation quality.
[Exact hints and request/output hashes](../../docs/azure-correction-audition-2026-10-17.json)
are preserved. All correction clips await listening review. Nine offline tests cover
baseline safeguards plus correction bounds/transcript separation and failed-attempt
preservation. Failures stop without retry; existing output cannot be regenerated.

The local page groups originals/new variants by phrase and voice; a phoneme clip
entered browser playback. Serve only its output directory:

```sh
python3 -m http.server 8770 --bind 127.0.0.1 --directory tools/azure-speech/outputs/azure-correction-v1
```

Controls were investigated using Microsoft's
[SSML pronunciation documentation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation).
No lexicon was hosted or additional Azure resource created.

## Focused ending probes — October 17

Owner feedback prefers phonemes, calls **biddak tirtāḥ** perfect, and hears
**shū ʿāmle** as **shoo am**. This accepts the phrase/method pronunciation as
feedback, without identifying an exact voice/hash; no expert review is inferred.
Existing biddak WAVs remain unchanged. The earlier sixteen-clip record now includes
this disposition rather than treating all listening as pending.

`endings.py` generates only six e01-04 probes: two voices, each with per-word
phoneme elements and syllable boundaries, explicit stress, or a more open final e.
The previous phrase-wide IPA instruction is a possible cause, not an established
diagnosis. Source text and learning targets remain unchanged. The candidates and
[six exact output/request hashes](../../docs/azure-ending-audition-2026-10-17.json)
are preserved; all new probes await listening. Each has a distinct output hash
within its voice and differs from the prior phrase-wide phoneme output. This does
not establish audible correctness. Ten offline checks pass, including per-word
phoneme structure and complete unchanged fallback text.

```sh
python3 tools/azure-speech/endings.py
python3 tools/azure-speech/endings.py --generate
python3 -m http.server 8771 --bind 127.0.0.1 --directory tools/azure-speech/outputs/azure-ending-v1
```

## Male cluster and spelling-hint probes — October 17

Owner identifies male **word-open-e** as closest but still hears **amel**, not
**amle**; it is not accepted. The exact reference hash is preserved in the updated
ending review and [cluster/alias evidence](../../docs/azure-cluster-audition-2026-10-17.json).
`cluster.py` first generated three male-only IPA candidates: continuous m–l,
alternate syllable boundary, and longer final e. Their identical frame counts and
approximately 0.00035 relative PCM RMS difference from the closest reference make
them nearly identical waveforms. This is evidence against useful control from those
IPA changes, even though requests succeed; it does not prove every IPA instruction
is ignored. Earlier distinct file hashes alone did not establish meaningful changes.

The runner's `--aliases` mode then generated three male-only SSML `sub` spelling
hints. These differ substantially at waveform level from the reference; audible
quality remains pending. They preserve “شو عاملة؟” as element fallback/source text
and store the altered synthesis alias separately. No spelling hint becomes learner
curriculum or a pronunciation standard. Biddak files remain unchanged. Twelve
offline checks pass, including alias/source separation and exact male-only scope.

```sh
python3 tools/azure-speech/cluster.py --aliases
python3 tools/azure-speech/cluster.py --aliases --generate
python3 -m http.server 8773 --bind 127.0.0.1 --directory tools/azure-speech/outputs/azure-alias-v1
```

The new page presents only three alias candidates with the closest reference,
avoiding another listening request for the nearly identical IPA diagnostics.

## Selected B and remaining lesson-one audition — October 17

Owner selected **Spelling hint B / final e approximation**, male Taim, as closest
and “not bad,” and directed continuation. Its exact output hash is now recorded as
selected for this audition in the cluster evidence. This is not expert review or
publication approval. The existing biddak phoneme files remain unchanged; the
owner's earlier phrase acceptance still did not specify an exact voice.

`lesson_batch.py` pins the approved F22 recall lesson-one package SHA-256
`e03c6db0d6cf6cb8bb9169283e6f78de6e797ab1443c3d009131214f791d35bc`, checks its
review manifest, and creates eight draft prompt mappings. Its prompt transcripts
and authored character roles match the historical audition inputs. The current
target database was not queried, and no new hosted/publication claim is made.
There are six unique prompts: selected amle B and the male biddak candidate are
preserved by exact hash, while four new unique male clips are synthesized with
bounded spelling hints. Repeated prompts reuse audio. The male-only audition
does not establish final character-to-voice assignments.

[Lesson-one evidence and eight mappings](../../docs/azure-lesson-one-audition-2026-10-17.json)
record current source hashes, authored characters, original transcripts, synthesis
aliases and review state. Thirteen offline checks pass, including new-request bounds,
current package/manifest pinning and unchanged fallback transcripts. All eight
local mapping/file hashes pass; four new unique clips and exact biddak voice
selection await owner review. No application integration or publication occurred.

```sh
python3 tools/azure-speech/lesson_batch.py
python3 tools/azure-speech/lesson_batch.py --generate
python3 -m http.server 8774 --bind 127.0.0.1 --directory tools/azure-speech/outputs/azure-lesson-one-v1
```

## Feminine ending repair and optional lighter word — October 17

Owner hears e01-02 as “ana maneeh,” requests **ana mnīḥa**, and calls everything
else pretty good. The seven other exact current mappings are retained as acceptable
local audition candidates. For e01-08 the m sounds heavy; the owner explicitly
permits the existing clip if a lighter version is difficult. No extra “ana” is added:
the repetition in the feedback is interpreted as typing repetition, with unchanged
approved “أنا منيحة.” as the target. This disposition is saved in the lesson record.

`polish.py` generated three e01-02 candidates: explicit feminine final-a spelling
alias, unmarked final-a alias, and the first alias with the word at +15% rate. A
fourth candidate applies +15% only to e01-08's mnīḥ. This is whole-word timing,
not a claim to halve the m independently. Final alif is synthesis-only; learner
text and authored roles remain unchanged. Existing clips are preserved.

[Four exact request/WAV hashes and settings](../../docs/azure-polish-audition-2026-10-17.json)
are recorded. Fourteen offline checks pass, including unchanged source/fallback,
one ana, and scope restricted to e01-02/e01-08. All four outputs pass saved-hash
checks; pronunciation and optional delivery improvement await owner listening.

```sh
python3 tools/azure-speech/polish.py
python3 tools/azure-speech/polish.py --generate
python3 -m http.server 8775 --bind 127.0.0.1 --directory tools/azure-speech/outputs/azure-polish-v1
```

## Selected eight-mapping asset package — October 17

Owner calls **male lighter** perfect and permits **female lighter** as fallback
if its m cannot match. Both exact polish outputs are selected. Female onset quality
is explicitly qualified, not called perfected. No additional synthesis was run;
current controls do not reliably provide an isolated m-only duration edit.

`selected_package.py` assembles the exact choices into six content-addressed WAVs
and eight source-pinned mappings, retaining all original transcripts and character
metadata. [Selected package evidence](../../docs/azure-selected-lesson-one-2026-10-17.json)
contains exact output hashes, source sidecars, generation settings and owner review
qualifications. The self-contained ZIP contains an HTML listening page, manifest
and six WAVs. All eight mappings resolve to hash-verified ZIP assets and the
manifest round-trips. This is offline archive evidence, not a PWA offline pass.

```sh
python3 tools/azure-speech/selected_package.py
python3 tools/azure-speech/selected_package.py --assemble
python3 -m http.server 8776 --bind 127.0.0.1 --directory tools/azure-speech/outputs/azure-selected-lesson-one-v1
```

The selected manifest is **not an application import payload**. The application
does not yet model synthetic provenance, and legacy recording UI assumes a human
speaker/recording. Next engineering work must add compatible synthetic metadata,
validation and honest labels before console draft integration. Do not attach these
as human recordings, bypass rights/publication gates, or alter published snapshots.
Redistribution rights remain pending; owner listening acceptance does not clear them.
F19 is therefore partial, not complete, despite all eight local draft audio choices.

## Application and private console integration — October 17

The owner authorized local integration after selecting the lighter/fallback clips.
`prepare_draft.py` now exports the selected source-pinned lesson with explicit
synthetic provenance and pending rights. `import_local_draft.py` uploads six WAVs
through normal owner endpoints and saves/readiness-checks eight mappings in an
isolated localhost fixture database. It never approves or publishes.

The application supports origin/provenance, separate rights and listening gates,
honest learner/review/glossary labels and console editing. All 55 API tests,
14 Python checks, the frontend build and five focused browser flows pass. Actual
selected audio plays in the private saved lesson preview. The bounded F19 local
contract is complete; F19.1 retains rights acceptance and any authorized release.

See [implementation, verification and isolated-preview commands](../../docs/f19-synthetic-audio.md).
Earlier dated notes above describe the intermediate stages; their missing-integration
statements are historical, not current work state. ROADMAP.md owns current state.

## Official references checked October 3, 2026

- [Free tier pricing](https://azure.microsoft.com/en-gb/pricing/details/speech/?cdn=disable):
  F0 neural allowance, separate from S0.
- [Voice availability](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts).
- [REST synthesis and authentication](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech).
- [SSML voice/prosody](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice).
- [Pronunciation controls](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation).

The audition tests feasibility and sound quality. Production redistribution,
offline-storage rights and provider terms need verification before publishing clips.
