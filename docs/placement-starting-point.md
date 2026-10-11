# Placement starting point

F15.2 · October 11, 2026 · Implementation verified; owner-authorized frontend rollout
pending. [Release record](releases/2026-10-11.md). No curriculum publication.

Account → Find your starting point offers a skippable Palestinian Levantine check.
MSA and Quranic selections display unavailable assessments and modules explicitly.
No combined Arabic score is created. All courses remain accessible, and results do
not award completion, XP, mastery, or change the daily queue.

## Assessment and recommendation boundary

The flow fetches the first three non-demonstrative Levantine packages from the
published catalog in course order. It selects their first two contextual steps
only when provenance, accepted answer, option rationales and a correct explanation
are present. All three packages and six questions are required; missing packages
never produce a shorter assessment. No draft exercises or new Arabic are embedded
in the client. Current approved first-unit content remains owner-approved, not
native-expert-reviewed. Exercises are familiar course content, not a calibrated,
unseen assessment or evidence of spontaneous speaking ability.

The original dialogue is available above each question so tasks that refer to
earlier dialogue turns retain their context. Arabic is shown initially. Optional transliteration/meaning help applies to the
prompt and options and is recorded for that response. Each first response receives
the existing rationale and explanation before advancing. Retrying starts a fresh
check; core lesson retries remain unchanged. There are no timers or required audio.

The conservative default suggests the first sampled lesson containing an incorrect
response or use of help. If all six fit without help, it suggests the last sampled
lesson, never a level beyond tested content. This rule is an implementation default,
not an owner-approved proficiency scale. Opening the recommendation uses the normal
lesson flow; it does not skip or complete earlier lessons. Stored recommendations
record their version and invite a retry after content changes.

Reading-script and sound support are optional self-reported preferences, initially
selected. Results identify the requested support and clearly say bootcamp lessons
and reviewed sound support are not yet available. They do not test decoding,
pronunciation or sound recognition. F15 requires separate reviewed bootcamp content
and track-specific assessments before the parent can be complete.

## Offline and identity behavior

Online starts refresh the three packages and cache them with existing offline
storage. Offline starts use downloaded packages. A 403/404/410 response never falls
back to a cached withdrawn package. Incomplete downloads offer skip/reconnect.

The current result (including skipped state) is stored in IndexedDB snapshots keyed
by guest/account identity and track. It retains policy version, date, individual
first responses, help, lesson/step versions, source locators and support preferences.
Only the latest result is retained. Signing in does not migrate guest placement.
Results do not sync across devices; account study preferences retain their existing
sync behavior. Leaving during a check discards the unfinished attempt. A completed
result remains in memory if saving fails, with an explicit message. Identity changes
cancel asynchronous loads and reset the view before reading that identity's result.

## Verification

October 11 verification:

- Production frontend build passes; all 29 API tests pass.
- Four final placement checks pass, covering contextual selection/provenance,
  conservative recommendations, help and wrong answers, offline reload/retry,
  opening the recommendation, no completion rewards, skip persistence and real
  guest/account identity isolation, withdrawn content and unavailable tracks.
- Eight existing study-settings/navigation checks pass across the earlier targeted
  run (12 distinct checks in total). Mobile width is 320px; question/result screenshots
  visually inspected. The placement keyboard/offline check asserts no runtime errors.
- `git diff --check` passes. Initial feedback duplication and mobile focus/scroll
  issues were corrected before final verification. A skip/reload timing failure led
  to an explicit save-in-progress/saved message; the test waits for the saved state.
  The sandboxed server startup timed out; browser checks passed outside the sandbox.

 Tests use the approved portable first-unit packages
through mocked public lesson/catalog endpoints and real disposable account sessions;
they do not publish curriculum to any local or hosted owner database.

Implementation: `i-web/src/PlacementCheck.vue`, `placement.ts`, Account integration
in `App.vue`. Checks: `i-web/tests/placement.spec.ts`.

Real assistive-technology, supported-device evidence, learner calibration,
cross-device result sync and hosted verification are outside this slice. New module
content remains subject to source, validation and owner publication gates.
