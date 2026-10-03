# Maintaining the Ismi roadmap

[ROADMAP.md](../ROADMAP.md) is the only current feature-status and priority document.
It is ordinary Markdown: readable in Codex or GitHub, editable by the owner or an
agent. There is no background scheduler, generated dashboard or separate task database.

## Where information belongs

| File | Responsibility |
| --- | --- |
| [AGENTS.md](../AGENTS.md) | Settled constraints, unresolved product choices and mandatory working rules |
| [ROADMAP.md](../ROADMAP.md) | Quick view, stable IDs, status, scope, next action, completion criteria, evidence and delivery boundaries |
| This workflow | How to start, assess completion and update planning |
| Feature plans and implementation notes | Design detail, provenance, verification and limitations; linked from roadmap records |
| [next-stage-handoff.md](next-stage-handoff.md) | Frozen historical checkpoints; not a live task queue |
| [continue-in-another-chat.md](continue-in-another-chat.md) | Reusable entry prompts; no duplicate status inventory |
| [README.md](../README.md) | Project entry point and current development/hosting instructions |

Owner instructions and existing authorization take precedence. AGENTS.md defines
constraints; the roadmap defines current recommended work. Old plans/handoffs cannot
override either. If records conflict with code, tests or target database/host state,
inspect evidence and correct the roadmap with the date and scope of the inspection.
Do not treat older status prose as fresh verification.

## Start a task

1. Read AGENTS.md, the roadmap quick view, this workflow and the relevant feature
   record. Inspect `git status`/diff; preserve existing changes and work on `main`.
2. Match the request to a stable ID by name or behavior. The owner need not know an
   ID. Add one only for a distinct new scope; retain IDs across renames/reordering.
3. Inspect linked implementation/evidence before proposing work. If the requested
   behavior already satisfies its criteria, report it as done with concrete links.
4. For authorized implementation, set the bounded task Active and specify observable
   completion criteria before coding. Break broad items into children (F12.1, F12.2),
   each with scope, status, next action/decision, criteria and evidence.
5. Resolve consequential choices explicitly with a recommended answer. Continue
   independent authorized work. Priority is direction, not new authority to publish,
   deploy, spend, contact people or choose external providers.

Existing authorization carries forward. Do not ask again merely because a roadmap
record previously needed authorization; record the new state instead.
Planning edits, status audits and recommendation requests do not themselves start
unrequested product implementation.

## Decide whether something is done

Use the feature's stated scope and observable criteria, then check implementation
and relevant evidence. Run appropriate checks for changed behavior or an unresolved
concern; a planning-only edit does not require the application regression suite.

- **Done:** all criteria for the bounded scope are met and evidence is linked.
  Authored drafts can satisfy an authoring task; publication needs its own scope.
- **Partial:** keep the parent open and identify exact remaining criteria; mark
  completed children Done. Do not shrink the original promise to manufacture completion.
- **Already implemented:** acknowledge that directly and update stale planning.
  Do not rebuild it because an old plan said “next.” Separate an extension from
  the delivered baseline (for example F05 manual review versus F10 scheduling).
- **Unknown:** inspect first. If host/database/equipment access or owner input is
  missing, record uncertainty and next action without claiming a pass or regression.

For every Done record link implementation plus relevant verification or authored
manifest/audit evidence. State dates and distinguish today's checks from earlier
recorded results. Done means the defined deliverable is complete; it does not imply
committed, deployed, published, expert-reviewed or beta-ready unless those are criteria.

For a rollout, record target, app revision, verification date and result. Frontend,
backend and curriculum state are separate. Record published lesson IDs/versions and
audit evidence for a curriculum release. Do not include secrets or learner identities.

## Finish or hand off

Before the final response, update the roadmap in the same task:

1. Reconcile the quick-view row and feature record: status, exact remaining work,
   next action, dependencies/decisions, completion evidence and any delivery change.
2. Update Now/Recommended next/Waiting on if affected. Do not leave a completed item
   recommended as unimplemented work. Mark unfinished work honestly; use On hold
   only when the owner explicitly defers it.
3. Refresh the roadmap's Updated date and add a short dated change-log entry for
   a meaningful change (keep the latest five).
   Put detailed test results/design history in a linked feature note, not another handoff.
4. Update AGENTS.md only for changed durable constraints, preferences or working rules;
   update README only for changed setup/hosting. Keep current feature status in the roadmap.
5. Report the outcome, relevant ID and remaining limitation. No duplicate “continue”
   checklist is needed; the next agent starts from these same files.

## Easy owner prompts

- “Show me the roadmap and what's next.” — Read and summarize; do not start a feature.
- “Move guided speaking ahead of course expansion.” — Reorder recommendations and
  dependencies; preserve completed IDs and do not begin implementation.
- “Add [feature] to the roadmap.” — Add a scoped Planned record with recommended
  criteria; flag conflicts/open decisions without treating a proposal as adopted policy.
- “Is [feature] already done? Reconcile the roadmap.” — Audit criteria against
  evidence, report missing parts and update status without rebuilding the feature.
- “Implement [feature]. Keep the roadmap current.” — Use existing authorization,
  scope the deliverable, implement, verify and update its record.
- “Pause [feature]” / “Remove [feature].” — Record an explicit deferral or cancellation
  and its effect on dependencies; keep historical IDs and explain any settled beta
   requirement that would also need to change. Use On hold or Cancelled respectively;
   never silently delete a product commitment.
- “Refresh the roadmap from the current checkout.” — Audit scoped completion and
  local evidence. Hosted/publication claims require inspecting the named targets.

## Adding a feature

Use the next unused ID; never recycle a completed or cancelled ID. Add one row to
the quick-view table with its status and next action, then a matching record below.
Natural-language feature names work in owner prompts; IDs are only convenient handles.

```markdown
| [F19](#f19-feature-name) | Feature name | Planned | Concrete next action |

### F19 Feature name

**Outcome:** the learner/owner behavior this delivers; explicit scope boundaries.
**Next:** one concrete action, or the decision/input needed and a recommendation.
**Done when:** observable criteria that allow a future agent to verify completion.
**Depends on:** feature IDs, assets or unresolved choices; “none” if independent.
**Evidence:** implementation paths and relevant checks/results with dates.
**Delivery:** local/committed, publication and target deployment state as applicable.
```

Use the same shape for child records such as F12.1. Replace proposed criteria when
scope is agreed, preserving the broader parent commitment. Once complete, summarize
the delivered scope and evidence, with extensions/rollout tracked explicitly.
