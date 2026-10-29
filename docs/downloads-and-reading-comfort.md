# Downloads and reading comfort implementation contracts

Prepared October 22, 2026 from the owner's selected brainstorm items 1 and 4.
Current states, priority, next actions and authority live only in
[ROADMAP.md](../ROADMAP.md#f32-downloads-and-recovery-center). This document defines
bounded implementation and acceptance contracts. The original October 22 request
created a plan. F33 implementation was subsequently authorized October 27; see
[implementation evidence](reading-comfort-implementation.md). No physical-device
pass or deployment is implied. F32 remains a separate planned scope.

## F32 Downloads and recovery center

### Outcome and first-release boundary

Learners can tell which core learning packages are usable offline, deliberately
download/update/retry them, and reclaim their downloaded-content storage without
losing progress. Entry is **Account → Downloads**, with contextual links from an
offline/unavailable lesson or failed download. Retain the existing main navigation
and keep normal sync information in Account.

V1 manages existing published lesson packages and their attached recordings, plus
published alphabet packs and their attached recordings. Group by course name;
keep stable `msa` and `quranic` identities distinct under the MSA umbrella. Show
published availability and unreviewed/text-only status honestly. Unpublished full
alphabet drafts or private console packages must never become downloadable through
this surface. No curriculum authoring or publication is required.

Stories/cultural metadata, PWA shell/font caches, whole-course bulk downloads,
background/OS transfers, automatic space eviction and progress export are outside
this first contract. Label any content-size total as managed downloads rather than
all storage used by Ismi. Browser storage estimates are approximate, optional and
must fall back to “Unavailable”; saved content is not guaranteed against browser
or OS removal.

### F32.1 Inventory and safe transfer lifecycle

Reuse [offline.ts](../i-web/src/offline.ts) and
[alphabetOffline.ts](../i-web/src/alphabetOffline.ts), including existing hash
checks and atomic complete-package writes. Add an inventory abstraction over the
two stores rather than copying packages into another cache. A row identifies type,
course, stable package ID, saved version, last successful availability check and
the disposition of its required assets. Keep saved-version time and server-check
time distinct. Deduplicate shared recordings when estimating bytes; do not count
their size in full against every referencing lesson.

Define deterministic transitions for not saved, downloading, saved, update
available, failed and unavailable. Transfer failure is distinct from an older
complete saved version: a failed update leaves that version usable. A complete
intentional text-only preview is labeled “Saved · text only,” not failed or
sound-ready. Unknown online availability is distinct from confirmed withdrawal.

Retry/update must be idempotent, bounded and safe across two tabs, identity/course
changes and reloads. A reload re-derives package availability from durable caches;
it does not leave a permanent “Downloading” marker. Preserve the prior package on
network interruption, rejected/hash-mismatched audio, quota/storage error or failed
transaction. On confirmed forbidden/missing/withdrawn publication, reuse the
existing removal behavior and never serve a private package as fallback. Offline
users can only see the last known availability; state that limitation when relevant.

**Acceptance:** inventory agrees with actual complete packages; partial audio never
produces a saved claim; failed updates retain the prior version; shared-asset totals
are not duplicated; reload and overlapping operations converge without corrupting
packages, completion queues or learning evidence.

### F32.2 Learner controls and recovery

Provide **Download**, **Retry**, **Update** and **Remove download** where applicable.
Retain successful items when another item fails and offer a targeted retry. Show
the specific affected package and an actionable error, with announced state changes
and no dependency on color. Existing automatic downloads continue within their
current scope; manually removing a package suppresses immediate automatic
re-download until the learner explicitly downloads or opens it again. Persist that
intent and test its interaction with dashboard refresh, reconnection and two tabs.

Show storage used by managed packages and honest known audio availability. A scoped
pending-completion count can link to **Retry sync**; reuse idempotent synchronization
and retain queued events on failure. Show only the current identity's learning/sync
details. Published-content bytes can remain device-shared; label that scope rather
than promising account-private downloads or showing another account's history.

Removing a package deletes only its content and unreferenced associated blobs.
Preserve completions, queued sync, review/recall/can-do evidence, reports, placement,
preferences and started-lesson positions. Do not delete bytes still needed by other
saved packages or an open lesson. For a paused lesson explain that its saved position
remains but re-downloading is required to resume offline. Coordinate with active
playback and concurrent transfers. Do not add a destructive “clear all site data”
shortcut. A removed lesson may also remove its offline Words/grammar examples;
explain that content consequence without claiming the learning history is lost.

**Acceptance:** course grouping and empty states match real availability; removing
one package does not remove another's audio, any learning evidence or queued work;
retry/update/sync produce accurate accessible results; manual removal survives
refresh/reload without a silent automatic reversal.

### F32.3 Verification and application delivery

Automate successful lesson/alphabet downloads and offline reopen; intentional
text-only previews; interrupted transfers; missing/corrupt audio; failed storage
writes; failed updates with older saved packages; confirmed withdrawal versus
transient network failure; shared-blob removal; two-tab races; reload recovery;
identity/course isolation; pending-sync preservation/idempotency and manual-removal
intent. Inspect mobile and desktop layouts and keyboard/focus/status behavior.

Record actual iOS Safari and Android browser/PWA download → offline reload → lesson
completion → reconnection evidence separately from engine automation. Include a
VoiceOver or TalkBack run for discovery, transfer/error announcements, retry and
removal. Record unsupported storage estimates honestly. Use disposable data for
fault injection; retain aggregate results without learner identities in Git.

**Acceptance:** F32.1/F32.2 contracts and automated plus named real-device/access
checks pass; increment the application version for each distinct completed
implementation under AGENTS.md, verify the displayed version and record evidence.
Record the software candidate separately from an owner-authorized app rollout on
the existing development preview. Parent completion requires the verification and
authorized application delivery; it grants no content publication or beta opening.

## F33 Reading comfort and mobile lesson ergonomics

### Outcome and first-release boundary

Learners can adjust target-language text and pronunciation-help presentation and
retain those choices per course, without changing lesson content, assessment
semantics, progress or daily allocation. Add **Reading comfort** in Account and an
accessible lesson control opening the same settings with an immediate preview.
Closing it restores the exact trigger and lesson position/response.

The V1 persistence design is device-local, scoped by current guest/account identity
and stable course ID. Keep it separate from synchronized daily-goal/course-selection
settings; explain “On this device.” No new server preference API or account migration
is required. Defaults preserve current behavior. Ordinary accessibility remains
required at defaults; users must not need to enable a setting to obtain core access.

### F33.1 Preference model and controls

Use a versioned device snapshot with validated defaults and bounded values: target
text size **100%, 125%, 150%, 200%**, line spacing **Standard / Spacious**, and authored
pronunciation help **Shown / Tap to show**. Help uses each course's existing label:
Transliteration or Pronunciation help. Support Arabic, Khmer and French target text;
do not manufacture help or audio where packages contain none.

Persist changes and restore them after offline reload and returning to a course.
Switching `msa`/`quranic`, guest/account or two signed-in identities must not reuse
another scope's choices. Reset applies only to this course's reading preferences;
it cannot reset progress or account/study settings. Handle malformed/old snapshots,
storage denial and two-tab changes predictably; failed persistence leaves current
reading usable with an honest “not saved” notice. Do not silently copy guest values
into an account. Use existing text or interface samples for the preview; never
generate or normalize canonical Quran text.

**Acceptance:** all controls have accessible names, selection state and a visible
preview; preferences round-trip offline, scopes/reset are isolated, invalid values
fall back safely, and storage errors never block learning.

### F33.2 Rendering and mobile input integration

Apply shared display tokens to authored target text in teaching/dialogues,
anatomy/grammar, Words, feedback, review/recall, stories, alphabet and applicable
placement content. Do not scale sprite cells or the entire app indiscriminately.
Preserve course language tags, bidi isolation, Arabic joining, Khmer marks and
existing authored strings. No package/hash/approval changes follow from styling.

Pronunciation-help preferences apply to eligible reading surfaces. They never
reveal answers, translations or model responses in a graded prompt before its
existing reveal point. Explicit help during an assessed activity retains existing
help-used evidence; showing a persistent reading preference cannot silently turn a
helped response into independent mastery. Preserve script-first MSA/Quranic and
optional-script Khmer teaching semantics. Local temporary reveals need not change
the saved default.

Retain the fixed-height lesson frame and single internal content scroller; no
animated dialog/card resizing. Keep header, stage and lesson navigation reachable
when text is enlarged, the mobile keyboard opens, orientation changes or browser
chrome changes the usable viewport. Insets/layout may respond to that viewport
without height animation. Do not put an extra scroller inside the comfort panel.
Preserve typed answers, IME composition, selection and focus through preference
changes; keep focused fields and actionable errors visible without scroll jumps.
Respect reduced motion and existing Scroll for more behavior.

**Acceptance:** settings affect all named reading surfaces consistently; course
switching and lesson resume preserve content/state; assessment/help evidence is
unchanged; text/controls are neither clipped nor unreachable at the supported
sizes and mobile viewport states, including combined user browser enlargement.

### F33.3 Verification and application delivery

Automate preference persistence/reset/scope isolation, malformed snapshots, storage
failure and two-tab updates; representative Arabic/Khmer/French rendering; unchanged
package pins; keyboard/focus restoration; help/reveal/assessment evidence; lesson
resume and offline reload. Cover 320/390px mobile and desktop, portrait/landscape,
200% target text, 200% browser text enlargement, their combination, reduced motion
and long phrases. Check the inner scroller for clipping, not just dialog bounds.

Record actual iOS Safari/VoiceOver and Android browser/TalkBack results for reading
controls, announcements, real keyboard/IME, focus/selection, enlarged mixed-script
content, orientation and offline restoration. Preview fixtures can verify software
without human linguistic acceptance; they cannot satisfy F24's accepted-content or
course-outcome gates. Record any checks not run or blocked separately from failures.

**Acceptance:** F33.1/F33.2 contracts plus automated and named physical-device/access
checks pass; apply application versioning, verify its displayed value, document
candidate/recovery evidence and complete separately authorized app delivery on the
existing preview. No new curriculum publication, review claim or beta inclusion.

### Relationship to existing work

[F24.2](../ROADMAP.md#f242-language-aware-learner-presentation) retains acceptance
of the already-delivered language-aware renderer; its checks can proceed now.
F33 adds preference controls and deliberate layout/input hardening rather than
rebuilding that foundation. Any existing defect found during F24.2/F17.5 checks
can be fixed under that feature's actual scope without waiting for F33. F33's own
new behavior needs its own evidence and does not close those broader gates.

## Implementation sequence and technical entry points

Within each feature, implement **.1 → .2 → .3**. The two features are independent;
neither waits for new recordings, unpublished curriculum or the deferred F18.1
pilot to start software work after authorization. Actual device sessions and app
rollout remain explicit completion inputs. Current priority belongs to the roadmap.

| Existing entry point | Planned use |
| --- | --- |
| [App.vue](../i-web/src/App.vue), [offline.ts](../i-web/src/offline.ts) | Automatic caching, account entry, scoped sync, lesson lifecycle and package/audio safety |
| [alphabetOffline.ts](../i-web/src/alphabetOffline.ts) | Alphabet inventory, verified downloads, shared-asset removal and withdrawal |
| [lessonSessions.ts](../i-web/src/lessonSessions.ts), [recallStorage.ts](../i-web/src/recallStorage.ts) | Preserve started sessions and private evidence; do not erase them with content |
| [useStudySettings.ts](../i-web/src/useStudySettings.ts), [courses.ts](../i-web/src/courses.ts) | Reuse identity/course conventions; keep reading choices separate from daily allocation |
| [LessonTeaching.vue](../i-web/src/LessonTeaching.vue), [LessonScroll.vue](../i-web/src/LessonScroll.vue), [style.css](../i-web/src/style.css) | Shared typography/help integration, stable frame, viewport and keyboard resilience |
| [grammar.spec.ts](../i-web/tests/grammar.spec.ts), [lesson-layout.spec.ts](../i-web/tests/lesson-layout.spec.ts) | Extend existing reflow/focus/frame checks; add fault and preference tests where behavior changes |
