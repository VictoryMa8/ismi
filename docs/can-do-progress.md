# Can-do progress — F17.6

October 13, 2026. The owner authorized implementation and explicitly approved the
recommended first-response, distinct-situation and 24-hour due-review policy.
This is a bounded Everyday conversations written-recall feature on `main`.
After local implementation/verification, the owner authorized commit, push and
deployment on October 13. Application release `7b80136` is pushed and Vercel Ready;
the stable Practice route is live-verified. [Rollout evidence](releases/2026-10-13-can-do.md).
No API update, database migration or curriculum publication was needed.

## Delivered behavior

Practice contains three source-versioned outcome cards, tied to the existing F22
published targets in Everyday lessons 1/3/6:

- Accept a break and ask for a little rest (`rest-a-little`).
- Request tea politely (`request-tea`).
- State the arranged time: seven (`confirm-seven`).

Each card shows its state, the lesson version and dialect/register, supporting
dates and a targeted practice button. Expand “Attempts and sources” for the
current source locators, situation IDs, first outcome, help, retry count, input
mode, date, repeated exposure and historical versions. Core lesson completion
alone leaves the card **Not yet practiced**. Targets without an available,
completed, non-demonstrative published/downloaded package cannot open practice.

These facts cover written Arabic/Arabizi production on this device. They do not
assess listening or speaking, assign CEFR levels, infer proficiency, or validate
the thirty-day course outcomes. No XP, lesson completions, daily minutes or new
habit credit are awarded by this feature.

## Approved evidence policy

Policy ID: `everyday-written-v1`. Evidence derives from F22 attempt records;
the classifier does not reinterpret tile exercises or old lesson completions.

| State | Evidence |
| --- | --- |
| Not yet practiced | No current-version response |
| Practiced — try independently | A response exists, but no accepted independent first response or assisted attempt |
| Practiced with help | Help or an assisted retry exists, with no independent success |
| Demonstrated independently | An authored accepted first response without hint/model or retry |
| Demonstrated again later | Two independent successes in different authored situations; the later situation was shown when review was due and at least 24 elapsed hours after the earlier independent response |

An independent success checks both the immutable first-result/help fields and
the first actual attempt. Feedback displays models, so later retries in that
session stay assisted. Incorrect and uncertain first responses cannot be
promoted by an accepted retry. Repeated exposures remain visibly identified;
repetition of the same situation cannot satisfy the different-situation rule.

F22 now records the target's prior review deadline at prompt exposure, before
answer submission changes the schedule. A later demonstration needs that actual
deadline and an exposure at/after it. Waiting on an early opened prompt does not
qualify. Delay is 86,400,000 UTC milliseconds from the earlier **response**, not
its exposure, and does not depend on midnight/timezone or daylight saving.
F10's existing 1/3/7/14-day intervals remain unchanged. The due indicator refreshes
once a minute; returning to the tab refreshes current packages/evidence.

Older F22 first-response facts may demonstrate independent written recall, but
records without the new prior-deadline fact cannot establish a later due-review
demonstration. No deadlines or learning evidence are backfilled.

## Outcome achievement, revisions and storage

When all three current targets are demonstrated again later, the optional display
shows **Everyday responses — demonstrated again later**, its evidence-derived
award date and the supporting lesson versions/demonstration dates. Its stored
certificate includes the six supporting attempt IDs and policy ID. One certificate
per exact three-target version bundle prevents repeated practice/tabs from farming
awards. Certificates retain their original evidence; new versions may earn a new
version-specific certificate after fresh demonstrations.

“Show outcome achievements” is a persistent guest/account-scoped display choice;
hiding it does not delete practice evidence or restrict learning. Becoming due
again does not erase demonstrations or certificates. Revised content starts fresh
current evidence, preserves older attempts/certificates, and explicitly explains
that this does not mean the learner lost ability. An unavailable/withdrawn target
cannot support a current achievement; historical certificates remain labeled.

Evidence stays under F22's `recall-evidence-v1:<scope>` snapshot; settings and
certificates use `can-do-v1:<scope>`. IndexedDB read/modify/write transactions
prevent concurrent append loss and duplicate certificates. Guest and account
histories/settings remain separate. Cross-device evidence synchronization is
outside this scope. The feature adds no raw responses, microphone recordings,
analytics provider, backend endpoint or database migration.

Online practice refresh uses current public packages; explicit 403/404/410
withdrawal removes the cached lesson rather than falling back. Network failures
can use valid downloads. Offline progress and awards work after reload; an offline
device cannot learn of a server withdrawal until reconnection. Storage failures
produce an explicit error rather than claim an unsaved certificate.

## Verification

- Production TypeScript/Vite/PWA build passes, including the final browser-run build.
- Eighteen distinct Playwright checks pass across focused runs: three evidence-policy
  checks, eight existing F22 checks, two integrated F17.6 flows and five scheduled-
  review regressions. The final F17.6/F22 run passes all thirteen checks after the
  asynchronous prompt-saving identity guard; the five scheduling checks passed
  in the preceding run and their implementation is unchanged.
- Policy checks cover help/retry/uncertainty/missing facts, exact 24-hour and deadline
  boundaries, waiting on early exposures, distinct contexts, version/identity
  separation, unavailable content and repeat-resistant certificate IDs.
- Integrated checks use actual published test packages and typed first responses,
  early repetition, offline due review/achievement, reload and display preference,
  repeat due dates, two-tab certificate deduplication, revised/withdrawn packages,
  history, keyboard focus, 320px with 200% text, reduced motion and account isolation.
- Mobile render inspected. A caught focus-restoration defect was fixed by preserving
  card DOM during refresh; a caught preference-reload race was fixed by keeping
  display controls disabled until current package/settings loading finishes.
- `git diff --check` passes.

Browser fixtures publish packages only into disposable test databases and advance
the browser clock; these are software checks, not production publication or observed
learner evidence. Real screen-reader, supported-device and learner calibration
checks remain F18 release gates.

Implementation: [classifier](../i-web/src/canDo.ts),
[storage](../i-web/src/canDoStorage.ts),
[cards](../i-web/src/CanDoProgress.vue),
[recall integration](../i-web/src/RecallPractice.vue).
Checks: [policy boundaries](../i-web/tests/can-do-policy.spec.ts),
[F22 and integrated F17.6 flows](../i-web/tests/recall.spec.ts).
