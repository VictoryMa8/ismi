# F28 text-only draft packs

October 17, 2026. Owner-authorized completion scope: text-only implementation and
full unreviewed drafts; recordings, human acceptance and release evidence are
separate follow-ups. Metropolitan French is the selected alphabet reference. This
does not define the entire French course or approve these candidates for publication.

These five JSON files are **private, AI-assisted authoring candidates**, not published
curriculum or accepted linguistic guidance. Their inventories are explicitly proposed.
Every basic entry has two original candidate word examples; every supporting entry
has at least one word or explicitly labeled constructed demonstration. Each entry
has shape recognition and word spotting with structured answers, explanations and
rationales. Nothing claims a listening result, speaking assessment, native review,
source acceptance or cleared distribution rights. Review/evidence fields remain
empty, source disposition flags false and audio URLs empty. The approved-source
publication boundary still applies; these drafts cannot pass normal approval.

| Course context | Basic | Support | Coverage |
| --- | ---: | ---: | --- |
| Palestinian Levantine | 28 | 17 | Basic Arabic letters; hamza/carriers, endings, vowel marks and lam-alif; formal reading support labeled separately |
| MSA | 28 | 17 | Same script coverage with separate careful-reading guidance |
| Quranic course | 28 | 17 | Ordinary Arabic decoding support only; no canonical Quran text, quotations, translations or interpretation |
| Khmer | 33 | 49 | Proposed modern consonants, a/o series, dependent and extended independent vowels, signs/composites and eight common subscript contexts |
| French | 26 | 32 | Case pairs, accents/diaereses/cedilla/ligatures, selected combinations and silent-letter support |

Rare/formal Khmer words are identified in their glosses. Independent vowels include
extended candidates for reviewer selection (the obsolete QUK ligature is explicitly
grouped as historical reference) rather than a claim that every encoded
vowel belongs in beginner instruction. Khmer romanized labels are draft identifiers;
the accepted pronunciation-help convention remains a review decision. There is no
mandatory alphabet gate. Some Arabic forms retain labeled Unicode shaping probes;
whole-word contexts accompany them without presenting probes as vocabulary.

Examples, glosses, letter names and contextual notes were drafted for Ismi here;
they are not copied dictionary definitions, canonical scripture or approved source
records. The `draft-authoring` source explicitly records this origin and pending
acceptance. Technical context was checked against [Unicode 17 chapter 16](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-16/)
for Khmer registers/clusters and [OQLF capital diacritics guidance](https://vitrinelinguistique.oqlf.gouv.qc.ca/21438/la-typographie/majuscules/regles-generales-demploi-de-la-majuscule/accents-tremas-et-cedilles-aux-lettres-majuscules)
for French case treatment. Those references are not lexical acceptance or a license
for this curriculum. Existing pinned Unicode technical sources remain in `../sources`.

`manifest.json` records exact file hashes, coverage and zero-recording/unpublished
status. Rebuild with `python3 tools/alphabet/prepare_text_drafts.py`; the API test
suite independently checks all exact target occurrences with .NET grapheme rules,
coverage, draft preview/privacy and rejection of unreviewed approval.

To inspect locally, import a JSON file into the owner's Alphabet console, save a
private draft and choose Preview alphabet. Saving a new draft leaves any current
publication intact. Do not authorize these files through the exact-five inventory
preview exception: their text differs, so that exception rejects them.

F30 tracks human acceptance, source dispositions, track-specific publication
controls, physical-device/assistive-technology/Safari evidence and any separately
authorized release. F09 retains human recording work. Existing five public v1
inventory-only previews are unchanged.
