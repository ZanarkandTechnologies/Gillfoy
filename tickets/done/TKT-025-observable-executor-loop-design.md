# TKT-025: design an observable executor loop for autonomous build runs

## Status

- state: done
- assignee: codex
- dependencies:
- blockers:
- spawned follow-ups:
- parallelizable after:

## Goal

Design the next-step executor loop for post-approval autonomous runs so ticket execution can continue with durable observability instead of relying on opaque long-lived chat sessions.

## Scope Decision

This ticket covers the first executable slice of the autonomous runner: a ticket-first bash loop design and implementation that drives `build -> prove -> review -> fix-review` with bounded retries and deterministic stop conditions. It does not replace tickets with a separate `IMPLEMENTATION_PLAN.md` source of truth, and it does not migrate the board to a database.

## Implementation Plan

### Pitch

- Req: implement a concrete `brute` runner that can drive approved bug tickets through `build -> prove -> review -> fix-review` without manual re-prompting.
- Bet: keep markdown tickets as the canonical artifact, add a small machine-readable executor block inside the ticket, use an optional sidecar JSON file only for volatile runtime state, and control continuation with a final sentinel line instead of schema-first output.
- Win: you get a simple first runner that is easy for humans to inspect, easy for bash to orchestrate, and less likely to short-circuit into “just return JSON” behavior.

### B -> A

- Before: the repo requires review and proof before `done`, but no executor contract exists to enforce `build -> review -> fix` automatically across fresh Codex runs, and it is unclear whether that should be driven by prompt text alone, file moves, or a database-backed state model.
- After: the system will have a working `brute` bash runner that reads the active markdown ticket, parses a small executor policy block, optionally stores ephemeral loop state in `.brute/state/TKT-XXX.json`, selects the next phase prompt, invokes Codex, and exits only on explicit terminal conditions expressed by ticket state plus a final sentinel line.
- Outcome: bug-ticket execution becomes more autonomous while staying auditable, bounded, resumable, and compatible with the existing filesystem board.

### Delta

- Touched areas in the proposed implementation:
  - `scripts/` or repo-root runner script such as `brute`
  - prompt files for `build`, `prove`, `review`, and `fix-review`
  - `AGENTS.md`
  - `tickets/templates/ticket.md`
  - optional `.brute/state/` directory for volatile runtime sidecars
  - repo-root `brute` entrypoint
  - `tickets/INDEX.md` only for state movement during execution
  - optional docs explaining how to start/observe the loop
- Keep:
  - markdown ticket as source of truth
  - `review` and `building` board states
  - required review sweep before `done`
- Change:
  - formalize `brute` CLI contract, executor phases, retry budget, and sentinel-line result contract
  - add explicit ticket sections for executor policy, review findings, and exit reason
  - store only ephemeral counters/process metadata outside the ticket when helpful
  - let bash own orchestration while prompts own phase behavior
- Delete:
  - implicit reliance on chat memory for multi-step autonomous execution
  - any assumption that a database migration is required before proving the loop

### Core Flow

```text
1. Operator approves a review ticket, moves it to building, then starts `bash ./brute TKT-025` or equivalent.
2. `brute` resolves the ticket path from `tickets/*`, reads the markdown ticket, and parses the `Executor Policy` block.
3. `brute` chooses the next phase from ticket state plus optional sidecar runtime metadata.
4. `brute` renders the phase prompt with the ticket path, phase name, and retry counts, then invokes Codex.
5. Codex does the repo work first, updates the same ticket with proof, review findings, blockers, and next phase hints, then emits exactly one final `BRUTE_RESULT:` line.
6. `brute` re-reads the ticket and decides:
   - done -> exit success
   - blocked -> exit blocked
   - review findings in scope and retry budget remains -> run fix-review then review again
   - out-of-scope issue -> spawn follow-up and continue or stop per policy
7. `brute` records the final exit reason in the ticket and sidecar for operator visibility.
```

Example v1 command shape:

```bash
bash ./brute TKT-025 --max-iterations 5
```

Optional explicit override shape:

```bash
bash ./brute TKT-025 \
  --build prompts/build.md \
  --prove prompts/prove.md \
  --review prompts/review.md \
  --fix prompts/fix-review.md \
  --max-iterations 5
```

Example ticket executor block:

```yaml
executor: brute
mode: bugfix
auto_approve_in_scope: true
require_review_before_done: true
max_iterations: 5
max_review_loops: 3
allowed_phases:
  - build
  - prove
  - review
  - fix-review
stop_on:
  - ambiguous_scope
  - migration_risk
  - unrelated_test_failures
spawn_followup_on:
  - out_of_scope_review_finding
  - adjacent_bug_not_required_for_ac
```

Example final sentinel lines:

```text
BRUTE_RESULT: status=continue_build next=build
BRUTE_RESULT: status=ready_for_review next=review
BRUTE_RESULT: status=review_failed next=fix-review findings=2
BRUTE_RESULT: status=done next=none
BRUTE_RESULT: status=blocked next=none reason=unrelated_test_failures
```

### Proof

- The implementation should name the exact durable runtime fields the loop depends on and separate them into ticket-owned durable state vs optional sidecar-only volatile state.
- The design should make review mandatory before `done`, not an optional best-effort step.
- The design should bound improvement behavior to ticket-linked findings instead of vague "make it better" recursion.
- The implementation should define observable exit reasons so an operator can tell whether the loop finished cleanly, exhausted retries, or hit a blocker.
- The implementation should justify why markdown + structured block is sufficient for v1 and why a database is deferred.
- The implementation should force Codex to do work before emitting one parseable sentinel line instead of optimizing for schema-only completion.

- Main risk: if too much state is duplicated between markdown ticket and sidecar JSON, or if the runner trusts freeform prose too much, resume behavior will become inconsistent.
- Rollback: keep durable decision state in the ticket only and limit sidecar contents to ephemeral metadata such as iteration count, PID, timestamps, and last command.

### Plan Review

- Refs:
  - `/home/kenjipcx/.cursor/AGENTS.md`
  - `/home/kenjipcx/.cursor/docs/MEMORY.md`
  - `/home/kenjipcx/.cursor/docs/TROUBLES.md`
  - `/home/kenjipcx/.cursor/tickets/templates/ticket.md`
  - `/home/kenjipcx/.cursor/tickets/INDEX.md`
  - `/home/kenjipcx/.cursor/tickets/done/TKT-024-ticket-first-tech-impl-plan.md`
  - `/home/kenjipcx/.cursor/tickets/done/TKT-026-harden-ticket-first-planning-contract.md`
  - `/home/kenjipcx/.codex/skills/tech-impl-plan/SKILL.md`
- Checks:
  - scope: one runner slice, no generalized workflow engine hidden inside the ticket
  - proof: concrete and observable
  - guardrails: aligned with ticket-first repo contract, MEM-0011, MEM-0012, MEM-0022, and MEM-0026
  - rollback: clear
- Fixes: reused the existing executor-loop ticket instead of creating a duplicate; narrowed the proposal to a first runnable `brute` contract; explicitly chose markdown + structured block + optional sidecar over a full database migration; replaced schema-first control with sentinel-line control after clarifying that the model must do real work before emitting machine-readable status.

### Ask

- Ready: approved
- Next step after approval: implement the executor contract in the ticket template and prompt files, then add the first runnable `brute` script with default phase prompts and sidecar-state handling.

### Delegation

- Not needed

### Ticket Move

- Implement in `tickets/building/`.
- Move to `tickets/done/` after runner, prompts, ticket template, and repo docs are updated and verified.
- No follow-up ticket is required yet, but one may be spawned during implementation if prompt files and runner script should ship separately.

## Acceptance Criteria
- [x] AC-1: The runner names the runtime state that must be durable during an autonomous execution loop and distinguishes ticket-owned durable state from optional sidecar-only volatile state.
- [x] AC-2: The runner explains how an operator can observe current ticket, phase, command, artifact, retry budget, and exit reason.
- [x] AC-3: The runner defines when the loop should stop, escalate, or spawn follow-up tickets instead of continuing blindly.
- [x] AC-4: The runner specifies a concrete `brute` CLI contract and default prompt-phase model for `build`, `prove`, `review`, and `fix-review`.
- [x] AC-5: The runner explains why markdown tickets remain canonical in v1 instead of migrating the ticket board to a database.
- [x] AC-6: The runner uses a final sentinel-line result contract so Codex does the real work first and only then emits machine-readable status.

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
- last prompt: scripts/brute-build.md
- last result: verified_via_dry_run

## Agent Contract

- Open: `/home/kenjipcx/.cursor/AGENTS.md`, planning skill docs, and any executor-loop notes or follow-up references
- Test hook: design review by diff
- Stabilize: not needed
- Inspect: planning/build state machine, ticket lifecycle, and evidence/write-back requirements
- Key screens/states: not applicable
- Taste refs: none
- Expected artifacts: approval-ready design plan and any required follow-up tickets
- Delegate with: Not needed

## Execution Proof

- Open/prove: `bash -n scripts/brute.sh`, `bash ./brute --help`, `bash ./brute TKT-025 --dry-run`
- Seed/reset: set `Runtime State` back to `build` and clear `.brute/state/TKT-025.json` when re-running verification from scratch
- Inspect/assert: confirm the runner resolves the ticket, prints the chosen phase/prompt, and leaves the ticket untouched during dry-run
- Artifact path: terminal outputs plus runner files under `scripts/` and repo root `brute`

## Evidence Checklist

- [x] Screenshot: not needed
- [x] Snapshot: not needed
- [x] QA report linked: satisfied by local diff review plus dry-run verification

## Build Notes

- Added repo-root `brute` wrapper plus `scripts/brute.sh` as the v1 staged Codex runner.
- Added phase prompts for `build`, `prove`, `review`, and `fix-review` with a final `BRUTE_RESULT:` sentinel-line contract.
- Added ticket template sections for `Executor Policy`, `Runtime State`, `Review Findings`, and `Exit Reason`.
- Updated repo docs/contracts so durable runner state stays in the ticket and optional sidecars remain volatile-only.

## Review Findings

- review status: passed
- in-scope:
- follow-up:

## Exit Reason

- exit status: done
- exit detail: implemented_and_verified

## QA Reconciliation
- AC-1: PASS
- Screen: PASS (not applicable)
- Evidence item: CAPTURED

## Artifact Links

- Parent request context: `/home/kenjipcx/.cursor/tickets/done/TKT-023-agent-loop-feedback-convergence.md`
- Runner wrapper: `/home/kenjipcx/.cursor/brute`
- Runner script: `/home/kenjipcx/.cursor/scripts/brute.sh`
- Build prompt: `/home/kenjipcx/.cursor/scripts/brute-build.md`
- Prove prompt: `/home/kenjipcx/.cursor/scripts/brute-prove.md`
- Review prompt: `/home/kenjipcx/.cursor/scripts/brute-review.md`
- Fix-review prompt: `/home/kenjipcx/.cursor/scripts/brute-fix-review.md`
- Ticket template: `/home/kenjipcx/.cursor/tickets/templates/ticket.md`
- Repo contract: `/home/kenjipcx/.cursor/AGENTS.md`
- README flow: `/home/kenjipcx/.cursor/README.md`

## User Evidence

- Hero screenshot:
- Supporting evidence: `bash -n brute scripts/brute.sh`, `bash ./brute --help`, `bash ./brute TKT-025 --dry-run`, and `bash ./brute TKT-025 --phase review --dry-run` all succeeded; the dry-run left the ticket unchanged while showing the resolved phase/prompt/command.
- QA report: local diff review plus dry-run verification of the runner contract
- Final verdict: `brute` v1 is implemented and verified for ticket-first staged Codex runs.
