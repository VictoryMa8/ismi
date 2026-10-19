# Maintaining the Ismi roadmap

[ROADMAP.md](../ROADMAP.md) is the only current source of feature state, priorities,
next actions, authorization boundaries and delivery. It is ordinary Markdown; no
scheduler, separate task database or generated status service exists.

## Document responsibilities

| File | Owns |
| --- | --- |
| [ROADMAP.md](../ROADMAP.md) | Agent entry, work queues, delivery baseline and one current record per stable feature/child ID |
| [AGENTS.md](../AGENTS.md) | Durable product constraints, owner preferences and working rules |
| This workflow | State vocabulary, record schema and maintenance/verification rules |
| [Feature scope reference](planning/feature-scope-reference.md) | Detailed contracts, policies and links to supporting evidence; **no current work state or next-work authority** |
| Feature notes / release records | Implementation details, dated test results, exact content/version/hash and rollout/recovery evidence |
| [Historical handoff](next-stage-handoff.md) / old plans | Frozen context; never current priority, startup commands or permission |
| [README.md](../README.md) | Setup and runtime/hosting entry points |

Owner instructions override older documents. A planning update never authorizes
product implementation, a release, spending, provider choices or contacting people.
Existing authorization carries forward; do not repeatedly ask for permission already
given. Work directly on `main` and preserve unrelated local changes.

## Read the next gate, then the independent layers

Every feature and child has a **Work state**, **Readiness**, **Delivery**, **Scope**,
**Next action**, **Authorization** and **Completion gate / evidence** link.
Dependencies are explicit when applicable. A state describes the main next gate,
not every aspect of the feature and not whether an agent is running right now.

| Work state | Apply when |
| --- | --- |
| Partial | Some implementation/authoring exists, but defined implementation or authoring scope remains |
| Review pending | Inspectable candidate content/corrections exist and exact acceptance is the next gate |
| Input needed | The next step requires specific assets, rights, reviewer, account access or external evidence |
| Decision needed | A consequential scope, provider, policy or product choice remains unresolved |
| Verification pending | Relevant software/protocol exists, but required real-world, outcome or release evidence is missing |
| Planned | Defined work has not begun; dependency and authorization checks still apply |
| Delivery pending | Accepted implementation awaits its authorized commit/push/deployment or exact publication |
| Deferred | The owner explicitly paused this scope; record the reason and resumption trigger |
| Complete | All criteria of this exact bounded contract are satisfied and evidence is linked |
| Cancelled | The owner explicitly removed the scope; preserve the ID, reason and effects on dependencies |

Do not use generic “Active” or “Needs input” as a substitute for the precise gate.
Never infer Deferred from difficulty or missing assets. Cancelled/Delivery pending
queues can be omitted when empty; introduce them when a record needs them.

**Readiness** has three independent dimensions:

- **Implementation:** not started, partial, complete, or a specific prepared slice
  such as protocol/tooling ready. Say which software/authoring remains.
- **Content:** not authored, proposed sources, draft, partial, authored, approved,
  or N/A. Authored is structural completeness. Approved requires recorded exact
  human acceptance and never implies native-expert review. An unreviewed preview
  exception remains explicitly unreviewed even after publication.
- **Verification:** not run, partial, automated, or the precise human/field checks
  performed. Name unresolved failures separately from checks never run. Dated
  evidence in a linked note is not a fresh test or a live-host inspection.

**Delivery** names application delivery and content publication separately. State
local/uncommitted, committed, pushed, deployed, draft-only or exact publications as
applicable. Different frontend/API revisions are normal; record them independently.
Do not assume a Git push deployed the API or imported/published draft files.

No percentages, combined readiness scores, or automatic parent roll-ups. A parent
can be Verification pending while software children are Complete. An authoring child
can be Complete while its parent awaits review/publication. Full course depth,
human audio and beta gates stay open until their own criteria pass.

## Start a task

1. Read the roadmap's agent entry, delivery baseline, relevant work queue and feature
   record, plus AGENTS.md. Check `git status` and the actual implementation/evidence.
2. Match the owner's request by ID or behavior. Use current record → linked contract
   → feature note/source files. Do not infer that a parent state makes delivered
   software unfinished, or rebuild code from an old plan.
3. Read **Authorization** and **Next action**. Identify which actor can unblock the
   next step: agent, owner, reviewer, speaker or provider. Resolve facts available in
   the repo/primary sources before asking the owner.
4. For authorized implementation, define a bounded observable deliverable and put
   that child in Partial while work is underway. A new task can begin as Planned;
   change it to the actual gate when work starts. Do not mark a broad parent Complete
   because an initial slice shipped.
5. Resolve consequential choices explicitly, with a recommendation. Continue useful
   independent work within authority; never interpret elapsed time as approval.

Status/audit/reorganization requests do not start unrequested implementation. Report
already delivered scope and reconcile stale status instead of rebuilding it.

## Record schema

Retain stable IDs/headings to preserve links. The next unused top-level ID is F31
at this revision; check the actual roadmap before assigning it. Add new bounded
children only for distinct deliverables, without silently changing their parent's
promise. Every ID needs a queue row and exactly one current record.

```markdown
### F31 Example feature

- **Work state:** Review pending.
- **Readiness:** Implementation — complete; content — draft; verification — automated, real-device checks missing.
- **Delivery:** Application — deployed at recorded revision; content publication — unpublished.
- **Scope:** One concrete deliverable; identify what it does and its limits.
- **Next action:** Owner/reviewer: accept the exact candidate. Agent: resolve recorded issues and revalidate changed text.
- **Authorization:** Implementation authorized; exact publication and participant contact remain separate.
- **Completion gate / evidence:** [Full contract and linked evidence](planning/feature-scope-reference.md#f31-example-feature).
- **Dependencies:** IDs/inputs required for this bounded scope; none if independent.
```

From ROADMAP.md the scope reference link is `docs/planning/feature-scope-reference.md`;
the example above is relative to this workflow. In real records use the correct
relative path and keep scope links resolvable. Contracts can live in an existing
feature note if that is clearer; avoid a second current status inventory.

For an unfinished record, **Next action** must name one concrete step/input and its
actor, rather than “continue,” “finish everything,” or “wait for review.” Include the
exact missing review/assets/decision/device evidence. Authorization should identify
permitted work and the remaining publication/provider/contact/spend boundary.
Complete records say no work remains in that bounded scope and point to the owner
of any extension/gate; avoid using them as a miscellaneous backlog.

## Evidence and delivery rules

Use the feature's actual observable contract. Keep app deployment, curriculum
publication, linguistic/source acceptance, human recordings, human accessibility,
learner evidence and beta eligibility distinct.

- Link implementation plus meaningful checks or exact authored manifests for Complete
  records. Do not shrink the contract to manufacture completion.
- If the owner explicitly revises scope, record date/decision and move any retained
  obligations to named follow-ups. F28/F30 is an explicit exception; it is not
  authority to narrow other features.
- Verify the named target/database before making a new hosted/publication claim.
  Record web/API revisions, exact content IDs/versions, audit/recovery evidence and
  verification date. Local/hosted DB IDs are separate namespaces.
- Retain failed/unknown checks honestly. A WebKit engine error is not a Safari pass;
  automated keyboard checks are not real screen-reader or physical-device evidence.
- Do not store secrets, voice recordings, learner identities or raw participant
  observations in Git. Keep private evidence outside the repo; link aggregate results.
- A roadmap-only change needs document consistency/link checks, not an application
  regression suite. Run application checks when implementation changed or an actual
  unresolved concern justifies them.

## Finish a task

Before finishing a fix or feature implementation, apply the [application versioning rule](../AGENTS.md#application-versioning): add 0.0.1 per completed fix/feature, align package/lock metadata, verify the displayed version and record it in the feature evidence. Extra commits, documentation-only work and deployment retries do not add increments.

1. Update the feature record's state, each readiness layer, delivery, actor/next action,
   authorization, dependencies and evidence as affected. Preserve unrelated changes.
2. Move/update its row in the matching work queue. Do not leave it under the old gate.
   Update the delivery baseline only for verified delivery/content changes.
3. Reconcile related parent/child dependency wording. Complete children do not close
   a parent. Reuse delivered foundations rather than treating them as future work.
4. Update the roadmap date; keep at most five short meaningful change entries. Put
   detailed tests, release history and designs in linked notes, not the entry section.
5. Run `python3 scripts/check-roadmap.py` from the repository root to validate unique
   IDs, queue/record agreement, required fields and local links/anchors. Review the
   diff separately for retained scope; the checker does not prove factual accuracy.
   Update the scope reference only when a contract, policy or evidence reference
   changes. Update AGENTS.md only for durable working/product rules.
6. Report the completed scope and precise remaining gate. Explicitly distinguish
   local documentation/code from committed, pushed, deployed and published work.

## Common owner requests

| Request | Action |
| --- | --- |
| “What's left for F24?” | Read layers and contract; identify the missing next gates, not merely “Active” |
| “Overhaul / refresh the roadmap” | Audit/reconcile documentation and evidence; do not implement product work |
| “Move X ahead of Y” | Change dependency/priority guidance without starting work or issuing release authority |
| “Implement X” | Reuse existing authority, bound work, implement/verify and maintain all state layers |
| “Pause / remove X” | Record explicit Deferred/Cancelled reason and dependency effects; retain history/ID |
| “Push and deploy” | Verify exact candidate and target authority; record app delivery separately from content publication |
