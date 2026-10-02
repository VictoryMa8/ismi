# Ismi next-feature roadmap

Updated October 1, 2026. This consolidates the feature plan discussed with the
owner. The scope constraints in AGENTS.md are settled; the sequence below is a
recommendation, not an approved schedule or authorization to publish, deploy,
spend money, contact speakers, or select external providers.

## Recommended next implementation: review and checkpoints

Build a bounded Levantine review slice using the first unit’s source-linked
language. Learners should retrieve phrases in changed conversational contexts,
review mistakes with explanations, and retry freely. A checkpoint should sample
an exchange with less help than ordinary practice. Avoid concentrated recognition
drills and do not equate word-bank success with spontaneous conversation.

Inspect the existing Practice page, lesson completion records, structured answer
evaluation and offline storage before designing changes. Preserve free review,
optional translation help, keyboard access, mixed RTL/LTR, reduced motion, pinned
lesson controls and deterministic offline completion. Resolve consequential
mastery/scheduling decisions explicitly; routine implementation choices can
proceed within an authorized task.

## Feature sequence

1. **Finish the first unit.** Improve contextual practice and recall in the seven
   guided teaching packages. At the latest local inspection, lesson 1 v3 was
   owner-published and the other six guided revisions remained drafts. Inspect
   the target database rather than assuming local and hosted content match.
   Prepare reviewable drafts; the owner retains publication approval.
2. **Add reviewed Arabic recordings.** Use the existing WAV upload/provenance and
   offline playback workflow. No real speaker recordings currently ship.
   Recordings require actual supplied assets, permissions and human review;
   their absence should not block text-based implementation.
3. **Build spaced review and unit checkpoints.** This is the recommended next
   engineering feature, alongside first-unit refinement. Reuse language in
   varied contexts and provide useful mistake review. Validate delayed recall
   and learner performance before claiming educational outcomes.
4. **Add guided speaking.** Implement controlled scripted branches with feedback
   on meaning and intelligibility. Speech/AI providers and their privacy
   configurations remain unresolved. Do not silently choose them or retain raw
   voice after feedback; improvement-data collection needs separate opt-in.
5. **Expand the course paths.** Work toward twelve weeks of Levantine and four
   weeks each of MSA and Quranic Arabic. Keep the track-specific learning goals.
   Quranic authoring requires approved source/resource rights and deterministic
   integrity controls; the current console blocks MSA/Quranic publication.
6. **Prepare the invite-only beta.** Complete account recovery/deletion, real
   assistive-technology testing and supported-browser offline verification.
   Run a smaller observed pilot before the first-100 cohort. These release gates
   do not replace useful lesson development with additional pilot paperwork.

## Agent entry points and boundaries

- Read AGENTS.md for product constraints and docs/continue-in-another-chat.md
  for the current checkout, checks and deployment context.
- Read content/levantine/everyday-01/revisions/guided-teaching/README.md for the
  portable packages, source links, import workflow and historical draft status.
- docs/next-stage-handoff.md preserves implementation history. Its older
  pilot-first section is historical; this document records the newer feature
  recommendation. The owner prefers improving the lesson experience and likes
  Mango Languages: conversational context, explicit phrase blocks, concise
  teaching, recall before reveal and contextual reuse.
- The latest frontend was pushed as f1063d1 on codex/lesson-experience and its
  Vercel preview reached Ready. It uses the existing alwaysdata API; backend
  changes and local curriculum state were not deployed by that action.
- Start a feature only when the owner authorizes implementation. This roadmap
  records direction; it does not itself authorize all remaining work.

## October 1 implementation status

The owner authorized the next feature in this chat. A bounded review/checkpoint
slice is implemented: mixed published-context review, versioned mistake history,
free retries, offline practice, and unit checkpoints reporting first answers and
translation/choice use. History stays on the device. Scheduling remains manual
pending an explicit interval decision; no mastery policy was adopted. See
[review-and-checkpoints.md](review-and-checkpoints.md) for behavior and limits.
Content approval, recordings, deployment and external provider choices remain
separate.
