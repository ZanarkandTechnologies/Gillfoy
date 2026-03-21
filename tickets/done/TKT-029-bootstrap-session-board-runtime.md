# TKT-029: bootstrap session board runtime

## Status

- state: done
- assignee: codex
- dependencies:
- blockers:
- spawned follow-ups:
  - TKT-030
  - TKT-031
- parallelizable after:

## Goal

Create the first executable slice for the tmux session board TUI: establish a local runtime, a ticket-plus-tmux discovery layer, and a canonical card model that maps one Codex run to one ticket-attached session.

## Scope Decision

This ticket is intentionally narrower than the full product. It covers only the foundational runtime and data contract needed before a usable TUI board can exist: bootstrap the app entrypoint, read the existing `tickets/` board, inspect tmux sessions, and derive an in-memory board/session model with clear sync and error states. It does not yet build the richer kanban layout, review-only operator actions, or durable end-of-turn write-back UX. Those ship as follow-up tickets once the discovery and model contract is stable.

## Implementation Plan

### Pitch

- Req: bootstrap the first executable slice of the tmux session board inside this repo without bypassing the existing `tickets/` and `brute` contracts.
- Bet: start with a minimal TypeScript/Node runtime plus a deterministic CLI proof mode that discovers tickets and tmux sessions and emits the derived card model before building the richer interactive board.
- Win: we validate the hardest contract first, namely session-to-ticket identity and sync/error handling, while avoiding early lock-in to a heavier TUI surface.

### B -> A

- Before: this repo has markdown tickets, tmux usage, and `brute`, but no runnable app surface that can inspect tmux state, map sessions to tickets, or render a canonical board/session model.
- After: the repo has a local runtime entrypoint, a ticket reader, a tmux discovery adapter, and a shared card model with explicit synced/unsynced/error states plus a non-interactive proof command.
- Outcome: follow-up UI tickets can build on a real runtime contract instead of inventing session identity, discovery rules, and error semantics inline.

### Delta

- Touched areas:
  - repo runtime bootstrap such as `package.json` and `tsconfig.json`
  - a new module area for the session board runtime
  - module docs/contracts for the new runtime directory
  - ticket/session discovery code and proof-oriented CLI entrypoint
  - README/docs only where launch/test instructions are needed
- Keep:
  - `tickets/` markdown as source of truth
  - `brute` as the post-approval execution runner
  - current ticket lifecycle semantics
- Change:
  - add a minimal app runtime to this repo
  - define the canonical card model for `ticket + tmux session + sync state`
  - add deterministic proof mode before interactive board rendering
- Delete:
  - implicit reliance on chat memory for knowing which tmux session maps to which ticket

### Core Flow

```text
1. Add a small local TypeScript/Node app scaffold for the session-board runtime.
2. Read ticket files from `tickets/` and derive ticket id, title, lane, and resume/result fields.
3. Query tmux for session metadata and normalize session names/attachment hints.
4. Match sessions to tickets using an explicit ticket-attached convention and derive sync/error states when missing or ambiguous.
5. Build one canonical in-memory card model for the future board UI.
6. Expose a non-interactive CLI mode that prints or snapshots the derived card model.
7. Document the module and launch/test path so TKT-030 can consume the runtime without redefining the contract.
```

### Proof

- Test method: integration
- Checks:
  - a deterministic command launches the runtime in proof mode from repo root
  - the proof mode reads ticket files and emits lane/title/resume data without a secondary state store
  - tmux discovery results are represented as attached, missing, or ambiguous instead of guessed silently
  - the derived card model can be reviewed from command output or a stored snapshot
- Main risk: session-to-ticket matching may be too implicit and produce flaky mappings.
- Rollback/containment: keep the matching contract explicit and local, and ship proof mode before any mutation or rich TUI behavior.

### Plan Review

- Refs:
  - `/home/kenjipcx/.cursor/AGENTS.md`
  - `/home/kenjipcx/.cursor/README.md`
  - `/home/kenjipcx/.cursor/docs/prd.md`
  - `/home/kenjipcx/.cursor/docs/MEMORY.md`
  - `/home/kenjipcx/.cursor/docs/TESTING.md`
  - `/home/kenjipcx/.cursor/tickets/templates/ticket.md`
  - `/home/kenjipcx/.cursor/tickets/INDEX.md`
  - `/home/kenjipcx/.cursor/tickets/todo/TKT-030-build-session-board-views.md`
  - `/home/kenjipcx/.cursor/tickets/todo/TKT-031-add-review-actions-and-ticket-writeback.md`
- Checks:
  - scope: one runtime/bootstrap slice only
  - proof: deterministic and observable before interactive UI
  - guardrails: keeps markdown tickets canonical and avoids premature TUI/framework sprawl
  - rollback: clear
- Fixes: narrowed the first ticket to runtime/bootstrap plus proof mode; pushed richer UI views and workflow mutations into explicit follow-up tickets.

### Ask

- Ready: yes
- Next step after approval: move this ticket to `tickets/building/` and implement the local runtime scaffold, ticket/tmux discovery, and proof-mode CLI.

### Delegation

Not needed

### Ticket Move

Implemented in `tickets/building/`; move to `tickets/done/` after human confirmation.

## Acceptance Criteria
- [x] AC-1: A local runtime entrypoint exists for the session board app and can be launched deterministically from this repo.
- [x] AC-2: The runtime reads markdown tickets from `tickets/` and derives lane/status metadata without introducing a second source of truth.
- [x] AC-3: The runtime inspects tmux sessions and maps one session attachment to one ticket-backed card model, including clear unsynced/error states.
- [x] AC-4: A deterministic test hook proves ticket discovery, tmux discovery, and card-model derivation without requiring the full interactive UI.
- [x] AC-5: The implementation leaves follow-up room for richer board rendering and review actions instead of hiding that scope in this ticket.

## Test Method

- Primary method: integration
- Why this proves the feature: this slice is foundational runtime and discovery behavior, so the correct proof is deterministic CLI-level validation of ticket scanning, tmux session scanning, and derived card output.
- Required instrumentation: a local CLI/test hook that can print or snapshot the derived board/session model from repository files and tmux state

## Executor Policy

```yaml
executor: brute
codex_mode: full-auto
max_iterations: 5
max_review_loops: 3
```

## Runtime State

- current phase: done
- iterations used: 1
- review loops used: 0
- last prompt: `npm run session-board -- --proof --json`
- last result: fixture_and_live_proof_passed

## Access Contract

- Open: repo root plus the future session-board entrypoint/CLI from this repository
- Test hook: a local command that emits discovered tickets, discovered tmux sessions, and the derived card model
- Stabilize: use fixture-like local ticket files and a predictable tmux session naming/attachment convention for proof
- Inspect: derived lane, ticket id, session name, sync status, and error-state fields
- Evidence capture: command output or snapshot proving board/session discovery and mapping

## Proof Contract

- Assertion path: deterministic CLI/model output plus fixture-backed tests
- Artifact destination: command output, snapshots, and linked ticket artifacts
- Pass rule: explicit attached, missing, ambiguous, and orphan session states are represented without guessing
- Evidence review instance: human review over fixture proof output and live proof run
- Delegate with: Not needed

## Execution Proof

- Open/prove: run the runtime in a non-interactive proof mode that prints or snapshots the derived model
- Seed/reset: use existing repository tickets plus deterministic tmux fixtures or documented local session setup
- Inspect/assert: confirm ticket lanes, session names, mapping state, and unsynced/error cases are represented explicitly
- Artifact path: command output, snapshots, and linked ticket artifacts

## Evidence Checklist

- [x] Screenshot: not needed
- [x] Snapshot: derived board/session model
- [x] QA report linked: integration proof noted in ticket

## Evidence Review

- Reviewer: human reviewer
- Input artifacts: fixture proof output, live proof output, and test results
- Verdict artifact: ticket closeout and supporting evidence note
- Write-back target: `Review Findings` and `User Evidence`

## Build Notes

- Added a zero-install local TypeScript/Node runtime scaffold with [package.json](/home/kenjipcx/.cursor/package.json) and [tsconfig.json](/home/kenjipcx/.cursor/tsconfig.json).
- Added the new [session-board module](/home/kenjipcx/.cursor/src/session-board/README.md) with explicit discovery/model layers plus module-level contract docs.
- Implemented ticket discovery, tmux discovery, and canonical card derivation with explicit `attached`, `missing-session`, `ambiguous-session`, and `orphan-session` states.
- Added a proof-mode CLI in [src/session-board-cli.ts](/home/kenjipcx/.cursor/src/session-board-cli.ts) plus fixture-backed tests and fixtures under [test](/home/kenjipcx/.cursor/test/session-board.test.ts).
- Logged MEM-0030 so future UI work reuses explicit ticket-id-based attachment instead of guessing session ownership.

## Review Findings

- review status: passed
- in-scope: runtime scaffold, filesystem ticket discovery, tmux session discovery, explicit sync-state model, proof CLI, fixture-backed test
- follow-up:

## Exit Reason

- exit status: done
- exit detail: completed_and_superseded_by_working_product

## Operator Resume

- Session recap: implemented the first tmux session-board slice as a zero-install TypeScript/Node runtime with ticket discovery, tmux discovery, and proof-mode CLI output.
- What happened: added the runtime scaffold, session-board module, fixture-backed tests, explicit sync-state handling, and live proof-mode support against the repo’s real `tickets/` board and tmux server.
- What remains: no in-scope work remains; the working product continues in TKT-030 and TKT-031.

## QA Reconciliation
- AC-1: PASS
- AC-2: PASS
- AC-3: PASS
- AC-4: PASS
- AC-5: PASS
- Screen: PASS
- Evidence item: CAPTURED

## Artifact Links

- PRD: `/home/kenjipcx/.cursor/docs/prd.md`
- Runtime entrypoint: `/home/kenjipcx/.cursor/package.json`
- TypeScript config: `/home/kenjipcx/.cursor/tsconfig.json`
- CLI: `/home/kenjipcx/.cursor/src/session-board-cli.ts`
- Module index: `/home/kenjipcx/.cursor/src/session-board/index.ts`
- Ticket discovery: `/home/kenjipcx/.cursor/src/session-board/discoverTickets.ts`
- Tmux discovery: `/home/kenjipcx/.cursor/src/session-board/discoverTmux.ts`
- Card model: `/home/kenjipcx/.cursor/src/session-board/buildCards.ts`
- Module contract: `/home/kenjipcx/.cursor/src/session-board/AGENTS.md`
- Module docs: `/home/kenjipcx/.cursor/src/session-board/README.md`
- Fixture test: `/home/kenjipcx/.cursor/test/session-board.test.ts`
- Fixture tmux data: `/home/kenjipcx/.cursor/test/fixtures/session-board/tmux-sessions.json`

## User Evidence

- Hero screenshot:
- Supporting evidence: `npm run typecheck`, `npm test`, `npm run session-board -- --proof --json --tickets-root test/fixtures/session-board/tickets --tmux-fixture test/fixtures/session-board/tmux-sessions.json`, and `npm run session-board -- --proof --json` all passed; the fixture proof showed explicit attached, ambiguous, missing, and orphan sync states, and the live proof read the real repo ticket board plus current tmux sessions without crashing.
- QA report: local diff review plus deterministic fixture proof and live repo proof-mode run
- Final verdict: completed.
