# Learned-word glossary — F20

Implemented October 8, 2026. Local code only; no commit, push, deployment or
curriculum publication is part of this task.

The free glossary lives in **Practice → Learned words**. A completed lesson adds
its explicitly taught words and expressions. Attempting a lesson, previewing a
draft, doing review or downloading a lesson does not add entries. “Learned” means
encountered in a completed lesson, not mastered.

## Inclusion, identity and synchronization

The owner selected **follow synced account progress**. Eligibility comes from the
existing dashboard's completed lessons. Signed-in learners get the same inclusion
on another online device after progress synchronizes, with packages fetched and
cached there. There is no separate glossary-edit, search-preference, word-mastery
or review-history synchronization. Guests use their own dashboard and pending
completions. An offline device shows its last scoped progress and downloaded
lesson versions until it reconnects. Existing completion records identify lessons,
not the exact historical vocabulary seen. Online refresh shows current published
wording and its version in context, including later approved additions/corrections;
it is not an exact-version exposure history or evidence that new wording is mastered.

Pending completions now carry their originating guest/account scope; both local
replay and API synchronization filter on that scope. Signing in does not import
a guest's pending completions into an account. Legacy events without a scope are
treated as guest events because their original account cannot be established.
Dashboard identity is checked before glossary eligibility is exposed, and request
generations prevent a previous identity's outstanding fetch from displaying words.

Records have stable vocabulary and sense IDs, explicit word/expression kind,
exact Arabic/transliteration/English, track, dialect/register, optional authored
forms, usage notes, provenance locators and a teaching-card index. Deduplication
retains all contexts for a sense, while keeping differing meanings,
transliterations, dialects, registers and authored form sets distinct.

## Source boundary and older publications

`LessonResponse.vocabulary` is optional so older publications still deserialize.
Absent metadata is omitted on serialization, preserving old payload/importer shape.
New entries go through the existing draft/validation/approval/publication console.
Validation requires IDs, a supported dialect, metadata, supplied source records,
nonblank supplied forms and an exact text/meaning match to the referenced teaching
phrase or chunk. Null arrays/entries, duplicate senses, missing sources and invalid
card references fail validation. An explicit empty array suppresses fallback.

The seven owner-approved October 3 Everyday packages predate vocabulary metadata.
The catalog contains 43 teaching cards, 159 explicit occurrences and 123 distinct
word/expression senses.
The checked-in compatibility catalog copies their exact structured teaching phrases,
building blocks, notes and source locators. It excludes answer distractors,
unpublished Plans drafts, dialogue-only text and demonstrative seed fixtures.
The generator records input paths and SHA-256 hashes and creates deterministic IDs;
it performs no AI extraction, translation or morphological inference. These are
copies of approved lesson records, not newly approved dictionary definitions or
native-expert review.

At runtime a compatibility card must still match the Arabic/transliteration,
meaning, note, chunks and source locators exactly. Changed cards do not inherit
obsolete vocabulary metadata. Author a new validated vocabulary record when
changing the teaching text. This can leave an older or revised lesson with no
matching records; the interface says so explicitly. Local seed lessons therefore
have no glossary entries unless vocabulary is authored for them.

Additional grammatical paradigms are **not supplied** by the existing packages.
The interface displays authored forms when present, and otherwise says they are
missing and shows the existing usage/gender/grammar notes. It does not guess forms.
F12.2's unresolved plural is flagged without rewriting published Arabic or
transliteration; `law` gets the audit's pronunciation help and the Fattoush name
gets its spelling caveat. Full speaker/pronunciation review remains under F09/F12.2.

Regenerate compatibility data, only after reviewing its approved input boundary:

```sh
python3 tools/glossary/build-catalog.py
```

## Offline, version and audio behavior

Completed packages are fetched online and saved with the existing atomic,
recording-hash-verified download path. Offline search and filtering use these
packages plus the scoped dashboard; the build also precaches the compatibility
catalog with the application. Missing packages and failed storage are reported.
Online refresh replaces the cached version. A definitive 403/404/410 removes a
cached lesson and hides its glossary entries; transient failures may use the last
complete package. Withdrawal cannot be discovered while a device is offline.

Audio is offered only when a publication's exercise prompt has recording metadata
and exactly matches the entry's Arabic, transliteration and meaning. Chunks do not
borrow whole-phrase audio. Missing reviewed recordings are labeled explicitly;
there is no browser-voice substitution. Cached bytes play offline; playback stops
on filter changes, context opening, page change or unmount. Audio metadata remains
visible with the context. Playback failures preserve text access.

## Interface and verification

Search covers Arabic, English, transliteration and supplied forms, ignoring
Arabic vowel marks/tatweel and Latin diacritics. Track, dialect and word/expression
filters do not depend on the selected study plan. Results paginate at twenty
entries. Arabic has `lang="ar"` and `dir="rtl"`; English/transliteration use LTR
layout, sources use isolated direction, and controls/details work from the
keyboard with visible focus. Context buttons reopen the exact teaching card in
free lesson practice without awarding another completion.

Implementation: [glossary model](../i-web/src/glossary.ts),
[learner interface](../i-web/src/LearnedWords.vue),
[API schema](../i-api/Models/LessonModels.cs),
[publication validation](../i-api/Services/CurriculumValidator.cs).
Checks: [browser coverage](../i-web/tests/glossary.spec.ts),
[API coverage](../i-tests/CurriculumApiTests.cs).

Verification on October 8: production frontend build and all 28 API tests pass;
all six F20 browser checks pass. Chromium screenshots at mobile/desktop sizes were
inspected, and 320px layout with enlarged text has no glossary overflow. The final
55-test browser run passed 52 checks; the keyboard-startup check needed to wait for
the asynchronous app, and the two late curriculum runs hit the shared test server's
authentication rate limit. The final isolated run passed all 10 checks: both course-loop checks, all six
F20 checks, the complete seven-lesson Everyday walkthrough and the Plans-unit
walkthrough. All 55 distinct browser checks therefore have passing evidence
across the broad and final focused runs. Test-only fixes also wait for completed signup navigation, handle initial
IndexedDB creation and restore the currently published recording-test version,
instead of an arbitrary older/superseded version. Automated keyboard,
layout and offline checks do not establish real screen-reader or Safari beta gates;
those remain under F18. Transport-fixture audio tests do not establish pronunciation
quality or supply any reviewed curriculum audio.
