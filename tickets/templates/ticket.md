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

## Agent Contract

<!--
UI-only execution contract.
This block exists so build and QA do not have to guess how to open, stabilize, inspect, and verify the feature.
-->

- Open:
- Test hook:
- Stabilize:
- Inspect:
- Key screens/states:
- Taste refs:
- Expected artifacts:
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

## Build Notes

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
