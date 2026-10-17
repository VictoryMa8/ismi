# F28 alphabet explorer implementation

October 16, 2026. The owner authorized implementation, push and deployment, then
accepted the planned defaults: reviewed playback and unscored repeat-aloud practice,
no microphone access, device-local evidence, and private Khmer/French packs until
inventory/help/variety choices and fluent review are recorded.

**The application is implemented and deployed as `5bbf861`. F28 as a whole remains Active.** No real alphabet
pack has been authored, reviewed, imported, approved or published by this task.
All five learner contexts show their actual unavailable state. Full reviewed basic
inventories, 2–3 words per basic letter, cleared human recordings and real device/AT
and Safari offline evidence remain required. Deployment does not imply content
publication, beta readiness or completion of F15/F25/F26 reading modules.

## Application behavior

Practice has an Alphabet tile; Courses and reading/sound placement recommendations
link to `#/practice/alphabet`. Individual letters have entry-ID deep links within
the currently viewed course. Explicit Back controls, browser back/forward and reload
work. The course selector remains visible and also works when a dashboard request
fails. Alphabet availability is independent of conversation-course availability.

A published pack supplies authored order, search by character/name/help, categories,
basic/support counts, forms and contextual notes, separate **Play name** and **Play
sound** actions, exact word examples, source citations and a version. Target markers
use DOM Range rectangles over one unchanged text node. They do not split Arabic
joins, Khmer clusters or copied text. Practice spotting withholds markers until help
or feedback. Underlines and the explicit target/count description supplement color.

Four activities use authored questions, choices, accepted IDs, explanations and
rationales: shape recognition, listening recognition, word spotting and unscored
listen/repeat. Replay, help, retries, skips and exit remain available. Listening
requires actual complete playback before answering; skipped listening is not a pass.
Learners can use visual tasks without listening or speaking. Repeat records only a
self-check, never correctness or assessed pronunciation. Mixed sets include all four
kinds and favor entries with fewer recorded activities; distractors are never generated.

The native modal uses the existing fixed-height frame/one scrolling region and
scroll-more cue, keeps header/footer visible, traps focus and restores the opener on
exit. It has no mandatory timer or animation. Starting a lesson, changing course or
identity, navigation and hiding the document stop model audio. Object URLs are
revoked and late playback requests are canceled. App chimes stay suppressed during
model playback. No microphone, synthesis fallback, speech provider or spending.

Practice evidence and resumable sessions use identity/course/pack/version/hash keys.
They retain first answers, help, retries, recognition results, unscored self-checks
and dates. Snapshot writes are serialized; switching courses preserves browsing and
unfinished practice. A changed manifest does not inherit previous-version results.
Downloads are public content shared on this device; evidence remains separate for
guest and each account. None of these actions completes lessons, learns glossary
words, updates placement, gives XP or changes the primary course/daily queue.

## Content contract and owner workflow

- `AlphabetModels.cs`: script inventories with stable IDs/versions, basic coverage,
  authored forms, course-specific entries/examples/activities, source/review/rights
  records, clip transcripts/speakers/varieties and pinned fonts.
- `AlphabetValidator.cs`: bounded structures; unique IDs; exact inventory coverage;
  reviewed inventory/help/variety; two or three examples for each basic entry;
  grapheme-safe exact occurrences; complete source/version and text/adaptation/
  offline rights; human audio review/rights; all four activities and answer rationales.
- `AlphabetService.cs`: additive `AlphabetPacks` table, one stable pack per course,
  optimistic concurrency, immutable approved versions, audited draft/approve/publish/
  withdraw/rollback, exact recording byte hashes and missing-asset checks. Reusing
  an approved script inventory ID/version with changed content requires a new version.
- `AlphabetEndpoints.cs`: `/api/alphabet` complete availability catalog,
  `/api/alphabet/packs/{id}` public manifest, owner-only `/api/admin/alphabet` list,
  detail, saved-version preview, save, validate and workflow commands. Writes require
  the existing owner approver and CSRF checks. Existing recording upload is reused;
  learners can fetch only recordings referenced by a current lesson or alphabet
  publication. Private rights/reviewer evidence, actors, drafts and audits do not
  enter public projections.

The curriculum console has an **Alphabet** section with course selection, JSON
creation/import/editing, private save/preview, validation issues, separate exact
approval/publication actions, WAV upload, version selection, withdrawal/restoration
and audit history. Saving approved content creates a new draft and leaves the
existing publication intact. Engineering fixtures cannot be approved or published.
Empty drafts are saveable; they cannot pass review or become learner packs.

MSA and Quranic publication remains blocked until their track-specific source and
integrity controls exist. This implementation neither generates scripture nor
relaxes the five-exact-lesson Khmer exception. French variety and Khmer exact
inventory/help/reviewer remain explicit decisions, followed by actual source/audio
clearance and human acceptance. Fields record evidence; they cannot manufacture it.
The owner must approve exact saved content through the console before publication.

## Downloads and integrity

`alphabetOffline.ts` uses a dedicated IndexedDB database. It verifies the projected
manifest hash, each content-addressed WAV, and the pinned Khmer font. Arabic/French
use the app's existing system-font fallbacks; Khmer uses the bundled OFL font.
The PWA precaches the app shell and local font. A final online catalog check prevents
committing a pack whose publication changed during download. All text, exercises and
audio commit in one transaction only after required assets pass. Failed updates keep
the preceding complete version and expose an error. Explicit removal and known
withdrawals remove access and garbage-collect unreferenced alphabet audio.

Hash input sorts object keys ordinally, preserves array order, uses an empty
`contentHash`, and escapes each string-value UTF-16 code unit as uppercase
`\uXXXX`. This makes .NET/browser hashes identical for Arabic, Khmer, combining
text and supplementary characters without normalizing stored/displayed text.

A complete successful catalog reconciles withdrawn/missing publications; failed
refreshes can use an existing complete download. Offline clients cannot learn of
new withdrawals until reconnection. Historical evidence stays versioned after a
withdrawal and does not restore learning access. Interrupted or obsolete downloads
do not count as a current complete pack. Storage errors are visible.

## Verification

- All **47 API tests** pass, including six new alphabet tests for owner/CSRF/privacy,
  missing review/rights/audio, blocked tracks, exact Unicode targets/coverage,
  concurrent writes, version/hash changes, recording access, withdrawal/rollback,
  and immutable approved inventory versions.
- Vue/TypeScript/Vite/PWA production build passes.
- All **12 alphabet Chromium browser checks** pass across final runs: real API manifests/console,
  search/forms/word text and target overlays, first/help/retry evidence, all four
  activities with actual playback of synthetic test WAVs, mixed sets, complete
  download/offline reload, failed update retaining old bytes, known withdrawal,
  guest/account isolation, course/browse/session separation and fixed modal height,
  keyboard/Escape/focus and 320 px enlarged layouts in Arabic, Khmer and French.
- **21 navigation/course/palette/placement regression checks** pass, including offline course
  switching, started lessons, queue allocation and existing Arabic compatibility.
- API/browser fixtures are explicitly synthetic. Browser tests change their fixture
  flag solely to exercise owner approval in a disposable test DB; their review and
  silence are not linguistic/human-audio evidence. Normal startup does not load them.
  No fixture is imported into local owner or hosted curriculum.

The resume check initially caught unordered snapshot saves; writes are now serialized
and awaited before restoring. Early failed browser assertions also assumed the wrong
account-scope prefix, ignored retained deep links, or omitted owner test authentication;
these were corrected. Final checks above pass. Real VoiceOver/TalkBack, physical devices,
Safari offline/reconnection and actual linguistic/audio quality remain unverified.

[Application rollout and recovery](releases/2026-10-16-alphabet.md).
