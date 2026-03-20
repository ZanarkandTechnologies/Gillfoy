# TKT-025: design an observable executor loop for autonomous build runs

## Status

- state: review
- assignee: codex
- dependencies:
- blockers:
- spawned follow-ups:
- parallelizable after:

## Goal

Design the next-step executor loop for post-approval autonomous runs so ticket execution can continue with durable observability instead of relying on opaque long-lived chat sessions.

## Scope Decision

This ticket covers the first executable slice of the autonomous runner: a ticket-first bash loop design that drives `build -> prove -> review -> fix-review` with bounded retries and deterministic stop conditions. It does not implement the runner yet, and it does not replace tickets with a separate `IMPLEMENTATION_PLAN.md` source of truth.

## Implementation Plan

### Pitch

- Req: design a practical outer loop so post-approval Codex runs can continue without manual re-prompting and always include a review loop before closure.
- Bet: keep the ticket as the only durable state machine and let prompt files define phase behavior instead of copying Ralph's plan-file-first model.
- Win: you get Ralph's useful mechanics, fresh runs, bounded loops, durable state, backpressure, without losing the repo's stricter ticket discipline.

### B -> A

- Before: the repo requires review and proof before `done`, but no executor contract exists to enforce `build -> review -> fix` automatically across fresh Codex runs.
- After: the system will have a design for a bash-controlled executor that reads the active ticket, chooses the next phase prompt, records progress back into the ticket, and stops at `done`, `blocked`, or `follow-up spawned`.
- Outcome: bug-ticket execution becomes more autonomous while staying auditable, bounded, and ticket-first.

### Delta

- Touched areas in the proposed implementation:
  - `scripts/` or repo-root runner script such as `codex-loop.sh`
  - prompt files for `build`, `prove`, `review`, and `fix-review`
  - `AGENTS.md`
  - `tickets/templates/ticket.md`
  - `tickets/INDEX.md` only for state movement during execution
  - optional docs explaining how to start/observe the loop
- Keep:
  - ticket as source of truth
  - `review` and `building` board states
  - required review sweep before `done`
- Change:
  - formalize executor phases and retry budget
  - add explicit ticket fields for review-loop policy and runtime status
  - let bash own orchestration while prompts own phase behavior
- Delete:
  - implicit reliance on chat memory for multi-step autonomous execution

### Core Flow

```text
1. Operator selects an approved ticket in building.
2. Runner reads ticket state and current loop metadata.
3. Runner invokes Codex with the phase prompt for build/prove/review/fix-review.
4. Codex updates the same ticket with proof, findings, blockers, and next phase hints.
5. Runner re-reads the ticket and decides:
   - done -> exit success
   - blocked -> exit blocked
   - review findings in scope and retry budget remains -> run fix-review then review again
   - out-of-scope issue -> spawn follow-up and continue or stop per policy
6. Runner records the final exit reason for operator visibility.
```

### Proof

- The design should name the exact durable runtime fields the loop depends on so the ticket alone is enough to resume after a stopped run.
- The design should make review mandatory before `done`, not an optional best-effort step.
- The design should bound improvement behavior to ticket-linked findings instead of vague "make it better" recursion.
- The design should define observable exit reasons so an operator can tell whether the loop finished cleanly, exhausted retries, or hit a blocker.

- Main risk: if prompt responsibilities and runner responsibilities are not separated cleanly, the system will drift into duplicate logic and hard-to-debug behavior.
- Rollback: keep phase prompts thin and make the runner a read ticket -> choose prompt -> run -> inspect ticket controller rather than a smart planner.

### Plan Review

- Refs:
  - `/home/kenjipcx/.cursor/AGENTS.md`
  - `/home/kenjipcx/.cursor/tickets/templates/ticket.md`
  - `/home/kenjipcx/.cursor/tickets/INDEX.md`
  - `/home/kenjipcx/.cursor/tickets/done/TKT-024-ticket-first-tech-impl-plan.md`
  - `/home/kenjipcx/.cursor/tickets/done/TKT-026-harden-ticket-first-planning-contract.md`
  - `/home/kenjipcx/.codex/skills/tech-impl-plan/SKILL.md`
- Checks:
  - scope: one design ticket, no implementation hidden inside plan prose
  - proof: concrete and observable
  - guardrails: aligned with ticket-first repo contract and bounded automation
  - rollback: clear
- Fixes: reused the existing executor-loop ticket instead of creating a duplicate; narrowed the proposal to a first runnable executor contract rather than a generalized Ralph clone.

### Ask

- Ready: yes
- Next step after approval: implement the executor-loop contract in docs/template/prompt files, then add the first runnable bash loop and phase prompts in a follow-on build ticket or in this ticket if you want design + implementation combined.

### Delegation

- Not needed

### Ticket Move

- Keep in `tickets/review/` for approval.
- If approved, move to `tickets/building/` and implement the first runner slice from this plan.
- No follow-up ticket is required yet, but one may be spawned during implementation if prompt files and runner script should ship separately.

## Acceptance Criteria
- [ ] AC-1: The design names the runtime state that must be durable during an autonomous execution loop.
- [ ] AC-2: The design explains how an operator can observe current ticket, phase, command, artifact, retry budget, and exit reason.
- [ ] AC-3: The design defines when the loop should stop, escalate, or spawn follow-up tickets instead of continuing blindly.

## Agent Contract

- Open: `/home/kenjipcx/.cursor/AGENTS.md`, planning skill docs, and any executor-loop notes or follow-up references
- Test hook: design review by diff
- Stabilize: not needed
- Inspect: planning/build state machine, ticket lifecycle, and evidence/write-back requirements
- Key screens/states: not applicable
- Taste refs: none
- Expected artifacts: approval-ready design plan and any required follow-up tickets
- Delegate with: Not needed

## Evidence Checklist

- [ ] Screenshot: not needed
- [ ] Snapshot: not needed
- [ ] QA report linked: not needed for design-only planning

## Build Notes

Not started.

## QA Reconciliation
- AC-1: NOT PROVABLE
- Screen: NOT PROVABLE
- Evidence item: MISSING

## Artifact Links

- Parent request context: `/home/kenjipcx/.cursor/tickets/done/TKT-023-agent-loop-feedback-convergence.md`

## User Evidence

- Hero screenshot:
- Supporting evidence:
- QA report:
- Final verdict: Split out from prompt-contract work; ready for separate planning.
