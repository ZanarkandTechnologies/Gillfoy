# TKT-001: Title

<!--
Canonical ticket shape.
Keep this small enough that planning, build, QA, and human review can all work from the same file.
-->

## Status

<!--
Minimal control fields only.
These exist to support board movement and follow-up discovery, not to recreate a full issue tracker schema.
-->

- state: todo | review | building | done
- assignee:
- dependencies:
- blockers:
- spawned follow-ups:
- parallelizable after:

## Goal

## Scope Decision

<!--
Required when planning or splitting work.
Explain why this ticket boundary is the chosen execution unit and what was intentionally left out.
-->

## Implementation Plan

<!--
The selected review ticket is the default home for the approval-ready tech impl plan.
Keep it compact: Pitch, B -> A, Delta, Core Flow, Proof, Plan Review, Ask, Delegation, Ticket Move.
-->

### Pitch

### B -> A

### Delta

### Core Flow

### Proof

### Plan Review

### Ask

### Delegation

### Ticket Move

## Acceptance Criteria
- [ ] AC-1:
- [ ] AC-2:

## Test Method

<!--
Every ticket must say how the feature will be proved before build starts.
If this is vague, agents will reward-hack browser steps instead of producing deterministic evidence.
-->

- Primary method: unit | integration | e2e | visual diff | runtime log assertion | eval | mixed
- Why this proves the feature:
- Required instrumentation:

## Executor Policy

<!--
Optional machine-readable runner policy.
Keep durable workflow policy in the ticket; put only volatile runtime metadata in sidecars.
-->

```yaml
executor: brute
codex_mode: full-auto
max_iterations: 5
max_review_loops: 3
```

## Runtime State

<!--
Durable execution state for staged runners such as `brute`.
The runner may mirror this into a sidecar file, but the ticket remains canonical.
-->

- current phase: build | prove | review | fix-review | done | blocked
- iterations used: 0
- review loops used: 0
- last prompt:
- last result:

## Access Contract

<!--
Access/setup contract.
This block exists so build and QA do not have to guess how to reach and inspect the feature before proof begins.
-->

- Open:
- Test hook:
- Stabilize:
- Inspect:
- Evidence capture:
- Key screens/states:
- Taste refs:

## Proof Contract

<!--
Proof/judgment contract.
This block states what actually decides pass/fail after access/setup is solved.
-->

- Assertion path:
- Artifact destination:
- Pass rule:
- Evidence review instance:
- Delegate with: delegated agent/skill + ticket path/section + expected artifact + write-back target

## Execution Proof

<!--
Default proof surface for non-UI tickets.
Use this when the work does not need the UI-specific Agent Contract, or alongside it when non-UI proof matters too.
-->

- Open/prove:
- Seed/reset:
- Inspect/assert:
- Artifact path:

## Evidence Checklist

<!--
Declared proof targets.
Keep this short and concrete so QA knows exactly which artifacts must exist before the ticket can close.
-->

- [ ] Screenshot:
- [ ] Snapshot:
- [ ] QA report linked:

## Evidence Review

<!--
Evidence review should be a separate review instance from capture/execution whenever judgment is required.
-->

- Reviewer:
- Input artifacts:
- Verdict artifact:
- Write-back target:

## Build Notes

## Review Findings

- review status: not-reviewed | passed | failed
- in-scope:
- follow-up:

## Exit Reason

- exit status: active | done | blocked
- exit detail:

## Operator Resume

<!--
Compact human resume packet for staged runners such as `brute`.
Keep this current enough that a returning operator can recover context quickly.
-->

- Session recap:
- What happened:
- What remains:

## QA Reconciliation
- AC-1: PASS | FAIL | NOT PROVABLE
- Screen: PASS | FAIL | NOT PROVABLE
- Evidence item: CAPTURED | MISSING

## Artifact Links

## User Evidence

<!--
Human handoff packet.
This is the smallest set of proof links a reviewer should need to understand whether the ticket is done.
-->

- Hero screenshot:
- Supporting evidence:
- QA report:
- Final verdict:
