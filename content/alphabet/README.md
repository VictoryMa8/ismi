# Alphabet inventory proposals — not publishable packs

October 17 update: the owner-revised F28 text-only completion now has
[full unreviewed draft packs](text-only/README.md). The technical proposals below
remain historical inputs; F30 tracks acceptance/release and F09 recordings.
The following October 16 zero-pack audit preceded the pinned preview publication.

October 16, 2026. The owner initially chose reviewed packs with human audio, then
subsequently directed publication despite absent human evidence. The exact
[inventory-only preview exception](inventory-preview/README.md) is now authorized;
these original inventory proposals remain unpublishable. The reviewed full-pack
route remains the F28 target. Fresh read-only inspection
found zero real packs locally or hosted. These files begin the missing authoring
work; none is a complete learning pack, accepted curriculum, recording script or
publication candidate.

| Context | Proposed technical scope | Still undecided/missing |
| --- | --- | --- |
| Palestinian Levantine | 28 base Arabic letters and Unicode joining probes | Fluent acceptance, authentic form words, learner names, contextual sounds, examples, rationales, source acceptance and recordings |
| MSA | Same exact technical Arabic inventory | Separate MSA teaching/audio; existing track publication controls |
| Quranic | Same exact technical Arabic inventory, no Quran text/excerpts | Approved reading-support scope, trusted resource IDs/rights, qualified review and track integrity controls |
| Khmer | 35 encoded consonant candidates for reviewer selection | Exact contemporary basic/support inventory, series/help, vowels/signs/subscripts, authentic examples and audio |
| French | A–Z and Unicode uppercase/lowercase mapping proposal | Reference variety, accents/cedilla/ligatures/combinations, names/contextual sounds, words and audio |

`drafts/*.pack.json` fit the current private-save contract. Reviewer and review
evidence fields are empty. Name/sound clip records have no URL, speaker or transcript
and explicitly say `humanRecording: false`; examples and practice are empty. Source
acceptance/rights-clearance flags remain false. Technical Unicode names are kept in
notes, never passed off as reviewed learner names or pronunciation help.

Khmer has **no declared basic inventory** yet. All 35 encoded consonants are technical
candidates, not a claim that all belong in a contemporary Cambodian beginner pack.
A fluent reviewer must classify/remove candidates and choose the full vowel/sign/
combination coverage. French variety/help also remains unset. Arabic joining probes
use U+200D only to inspect shaping; authentic reviewed words must replace/supplement
those probes before publication. No canonical Quran string, translation or
interpretation has been authored, copied or normalized.

## Source snapshots

Version-pinned technical data comes from Unicode, not an AI pronunciation model:

- [UnicodeData 17.0.0](https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt):
  exact code-point names and case mappings. Relevant original lines are retained in
  `sources/UnicodeData-17.0.0.selected.txt`.
- [ArabicShaping 17.0.0](https://www.unicode.org/Public/17.0.0/ucd/ArabicShaping.txt):
  joining types. Relevant original lines are retained in
  `sources/ArabicShaping-17.0.0.selected.txt`.
- [Unicode Arabic script FAQ](https://www.unicode.org/faq/arabic.html) and
  [Unicode 17 §16.4](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-16/)
  inform the technical/source boundaries; neither approves Ismi's linguistic content.
- The full retrieved [Unicode License V3](https://www.unicode.org/license.txt) is
  included as `sources/UNICODE-LICENSE-V3.txt`. `sources/provenance.json` pins the
  full downloads/excerpts with URLs, retrieval timestamps and SHA-256 hashes.

These sources cover character encoding/shaping data. They do not provide accepted
Ismi word examples, pronunciation conventions, human review or recording rights.
No generic source-license claim is substituted for those missing records.

Regenerate proposals without network or database changes:

```sh
python3 tools/alphabet/prepare_inventory_drafts.py
```

`readiness.json` records a check against the application's actual .NET validator:
each proposal is structurally bounded and **fails publication validation** with exact
missing evidence. This failure is expected and truthful. No test fixture, approval,
publication or human recording was created or imported. No application code changed.

## Route to publication

1. Designate fluent reviewers for each target model; keep the Quranic qualified-review
   and exact-resource requirements separate. No reviewer is designated by this task.
2. Have reviewers accept the exact inventory/help convention, learner-facing names,
   authentic forms, contextual sounds, 2–3 sourced examples per basic letter, all
   intended targets and structured activity explanations/rationales.
3. Prepare an exact-text recording/permission sheet from the accepted text. Capture
   human name, contextual-sound and word clips, with speaker/variety, transcripts,
   review and offline-distribution rights. No voice cloning or synthetic substitutes.
4. Save the exact candidates privately through the Alphabet console, upload actual
   recordings, validate, resolve every issue, and obtain final owner approval before
   publication. MSA/Quranic still need their separate platform controls.

No spending, hiring, reviewer contact or provider integration is performed. The
separate exact inventory-only preview exception does not complete these full packs. Content and human evidence are the current blocker;
publication remains requested and authorized once the selected requirements are met.
