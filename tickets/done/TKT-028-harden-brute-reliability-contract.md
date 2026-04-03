# TKT-028: harden brute reliability contract

## Status

- state: done
- assignee: codex
- dependencies:
- blockers:
- spawned follow-ups:
- parallelizable after:

## Goal

Make `brute` more reliable by tightening the active-ticket contract, stop conditions, proof requirements, and operator resume behavior across the runner, prompt files, and repo docs.

## Scope Decision

This pass hardens the Brute runner and its contract surfaces. It does not build a new runtime UI or replace the ticket-first execution model. The focus is enforcing a single active building ticket, clearer stop/retry semantics, stronger proof-before-done behavior, and a compact resume packet for operators returning later.

## Implementation Plan

### Pitch

- Req: make Brute less likely to drift, spin, or finish opaquely when many sessions are running.
- Bet: improve enforcement and observability in the existing runner before adding bigger runtime surfaces.
- Win: higher trust in autonomous loops with a small, auditable patch.

### B -> A

- Before: Brute has phases and budgets, but still relies heavily on prompt discipline for some critical behaviors.
- After: the runner/docs enforce one active building ticket, stronger finish conditions, explicit resume state, and a cleaner operator handoff.
- Outcome: less ambiguity, less silent looping, and easier recovery when returning to a finished or blocked run.

### Delta

- Touched areas:
  - `AGENTS.md`
  - `README.md`
  - `tickets/templates/ticket.md`
  - `scripts/brute.sh`
  - `scripts/brute-*.md`
  - `scripts/AGENTS.md`
  - `scripts/README.md`
  - `docs/MEMORY.md`
  - `docs/HISTORY.md`
- Keep:
  - ticket-first execution
  - phase-based Brute loop
  - existing max iteration / review loop budgets
- Change:
  - enforce single active building ticket
  - require proof before `done`
  - require operator resume packet in ticket
  - tighten phase prompts to distinguish scope blocker vs execution blocker
  - reject placeholder-only proof/resume sections when evaluating completion

### Core Flow

```text
1. Brute starts only if the selected ticket is the single active ticket in building.
2. Brute updates durable runtime state and operator resume in the ticket as it works.
3. Build/prove/review prompts require proof and explicit blocker classification.
4. Review can only end as done if evidence and reconciliation are present.
5. Ticket becomes the operator resume surface when the user returns later.
```

### Proof

- `brute.sh` should fail fast on ambiguous active-ticket state.
- The prompts should explicitly prohibit scope drift and require blocker classification.
- The ticket template should expose operator resume fields.
- README/AGENTS should describe the stricter Brute behavior clearly.

### Plan Review

- Refs: `AGENTS.md`, `README.md`, `tickets/templates/ticket.md`, `scripts/brute.sh`, `scripts/brute-*.md`, `scripts/README.md`, `docs/MEMORY.md`
- Checks:
  - scope: one docs/script pass
  - proof: concrete
  - guardrails: ticket-first
  - rollback: revert script/docs changes
- Fixes:
  - hardened completion checks so placeholder bullets do not count as proof or operator resume content

### Ask

- Ready: yes
- Next step after approval: implement and verify with shell validation + dry-run.

### Delegation

- Not needed

### Ticket Move

- move to `tickets/done/` after implementation + evidence

## Acceptance Criteria
- [x] AC-1: Brute enforces a single active building ticket before execution.
- [x] AC-2: Brute prompts and/or contract explicitly distinguish scope blockers from execution blockers.
- [x] AC-3: Brute requires proof/reconciliation before a run can end as done.
- [x] AC-4: Tickets expose a compact operator resume packet for returning users.
- [x] AC-5: README/AGENTS/scripts docs reflect the hardened Brute flow.

## Test Method

- Primary method: integration
- Why this proves the feature: the contract is only reliable if the actual runner enforces the documented state model and completion requirements under dry-run validation.
- Required instrumentation: shell entrypoint plus ticket files under `tickets/building/`

## Executor Policy

```yaml
executor: brute
codex_mode: full-auto
max_iterations: 5
max_review_loops: 3
```

## Runtime State

- current phase: done
- iterations used: 0
- review loops used: 0
- last prompt: `scripts/brute-build.md`
- last result: validated one-active-ticket gating and dry-run prompt generation

## Agent Contract

- Open: repo contract, ticket template, and Brute script/prompt files
- Test method: integration via shell validation and dry-run runner checks
- Test hook: `bash -n scripts/brute.sh`, `bash ./brute --help`, `bash ./brute TKT-028 --dry-run`
- Stabilize: not needed
- Inspect: active-ticket enforcement, proof/done conditions, and operator resume behavior
- Key screens/states: not applicable
- Taste refs: none
- Expected artifacts: script/docs diffs plus validation output
- Delegate with: Not needed

## Execution Proof

- Open/prove: `bash -n scripts/brute.sh` passed after the runner guard changes.
- Seed/reset: moved `TKT-027` back to `tickets/review/` so `TKT-028` is the sole active building ticket during validation.
- Inspect/assert: `bash ./brute --help` now lists `Execution Proof` and `Operator Resume` as required ticket contract sections.
- Inspect/assert: initial `bash ./brute TKT-028 --dry-run` failed with `brute requires exactly one active ticket in tickets/building/`, proving the single-ticket gate is live.
- Inspect/assert: after restoring one active building ticket, `bash ./brute TKT-028 --dry-run` succeeded and produced the expected build-phase prompt path.
- Artifact path: local shell output, git diff, and ticket artifact links

## Evidence Checklist

- [x] Screenshot: not needed
- [x] Snapshot: not needed
- [x] QA report linked: shell validation + diff review

## Build Notes

- Added Brute-specific repo rules covering one active building ticket, blocker classification, proof-before-done, and operator resume expectations.
- Updated the README flow and scripts docs so Brute’s stricter lifecycle is visible outside the runner implementation.
- Added `Operator Resume` to the canonical ticket template and extended Brute phase prompts to keep it current.
- Hardened `scripts/brute.sh` so `done` requires meaningful `Execution Proof`, meaningful `Operator Resume`, and `review status: passed`.
- Fixed a verification hole in `section_has_meaningful_content()` so placeholder labels alone no longer satisfy completion checks.
- Restored the board invariant by returning `TKT-027` to `tickets/review/`.

## Review Findings

- review status: passed
- in-scope: Brute docs, prompt files, runner enforcement, ticket resume contract
- follow-up:

## Exit Reason

- exit status: done
- exit detail: validation_complete

## Operator Resume

- Session recap: hardened the Brute reliability contract so the runner is stricter about active-ticket state, proof, and resume context.
- What happened: updated repo docs, ticket template, phase prompts, and the shell runner; then validated the gating with syntax/help/dry-run checks and fixed a placeholder-content loophole discovered during verification.
- What remains: no in-scope work remains on this ticket.

## QA Reconciliation
- AC-1: PASS
- AC-2: PASS
- AC-3: PASS
- AC-4: PASS
- AC-5: PASS
- Screen: PASS
- Evidence item: CAPTURED

## Artifact Links

- Repo contract: `/home/kenjipcx/.cursor/AGENTS.md`
- Workflow overview: `/home/kenjipcx/.cursor/README.md`
- Ticket template: `/home/kenjipcx/.cursor/tickets/templates/ticket.md`
- Runner script: `/home/kenjipcx/.cursor/scripts/brute.sh`
- Build prompt: `/home/kenjipcx/.cursor/scripts/brute-build.md`
- Prove prompt: `/home/kenjipcx/.cursor/scripts/brute-prove.md`
- Review prompt: `/home/kenjipcx/.cursor/scripts/brute-review.md`
- Fix-review prompt: `/home/kenjipcx/.cursor/scripts/brute-fix-review.md`
- Scripts contract: `/home/kenjipcx/.cursor/scripts/AGENTS.md`
- Scripts README: `/home/kenjipcx/.cursor/scripts/README.md`
- Memory log: `/home/kenjipcx/.cursor/docs/MEMORY.md`
- History log: `/home/kenjipcx/.cursor/docs/HISTORY.md`

## User Evidence

- Hero screenshot:
- Supporting evidence: Brute now rejects ambiguous multi-ticket build runs, requires meaningful proof and operator resume content before `done`, and exposes that contract in repo docs and the canonical ticket template.
- QA report: `bash -n scripts/brute.sh`; `bash ./brute --help`; `bash ./brute TKT-028 --dry-run` before and after restoring a single active building ticket
- Final verdict: Completed and verified.
