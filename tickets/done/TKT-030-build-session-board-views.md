# TKT-030: build session board views

## Status

- state: done
- assignee: codex
- dependencies: TKT-029
- blockers:
- spawned follow-ups:
- parallelizable after: TKT-029

## Goal

Build the first interactive tmux TUI views for the session board: a kanban-style active-work board plus a review-focused session view with filtering, sorting, and a configurable visible-session cap.

## Scope Decision

This ticket assumes the runtime, ticket discovery, tmux discovery, and card model already exist. It covers the interactive presentation layer only: board layout, review-focused filtering, keyboard navigation, status filtering, sort order, and the visible-session limit. It does not yet implement review approval actions or durable end-of-turn ticket write-back mutations.

## Implementation Plan

### Pitch

To be completed in review.

### B -> A

To be completed in review.

### Delta

To be completed in review.

### Core Flow

To be completed in review.

### Proof

To be completed in review.

### Plan Review

To be completed in review.

### Ask

To be completed in review.

### Delegation

Not needed

### Ticket Move

Implemented and moved to `tickets/done/`.

## Acceptance Criteria
- [x] AC-1: The TUI renders the active lanes needed for the operator workflow and shows one card per ticket-attached Codex session.
- [x] AC-2: Each card shows ticket id, short title, lane/status, attached tmux session name, and last known summary/result from ticket data.
- [x] AC-3: The TUI exposes a review-focused mode/tab that only shows sessions needing human review attention.
- [x] AC-4: The TUI supports status filtering, sort order, and a configurable visible-session cap with a default of 6.
- [x] AC-5: Unsynced or invalid session/ticket mappings are visible in the UI instead of being silently hidden.

## Test Method

- Primary method: mixed
- Why this proves the feature: the slice is UI-bearing, so proof needs both deterministic data fixtures and interactive verification that the right cards and review-only subsets render.
- Required instrumentation: a launch command for the TUI plus a deterministic fixture/debug mode for board data

## Executor Policy

```yaml
executor: brute
codex_mode: full-auto
max_iterations: 5
max_review_loops: 3
```

## Runtime State

- current phase: build
- iterations used: 1
- review loops used: 0
- last prompt: `npm run session-board -- --tui --once --view review --tickets-root test/fixtures/session-board/tickets --tmux-fixture test/fixtures/session-board/tmux-sessions.json`
- last result: tui_snapshot_and_interactive_smoke_passed

## Access Contract

- Open: launch the session-board TUI from repo root using the runtime created in TKT-029
- Test hook: a launch command and a deterministic debug/fixture mode that renders known board/session states
- Stabilize: seed the app with fixture ticket/session data or a documented local tmux setup before opening the UI
- Inspect: rendered lanes, card contents, review-only filtering, sort order, session-cap behavior, and unsynced state markers
- Evidence capture: screenshots or terminal snapshots of the default board, review-only view, and filtered/capped states
- Key screens/states: default board view, review-only view, filtered board state, capped-session state, unsynced/error card state
- Taste refs: terminal-first, dense but readable operator UI; optimize for fast triage over decorative chrome

## Proof Contract

- Assertion path: mixed fixture-based proof plus interactive TUI verification
- Artifact destination: screenshots, terminal snapshots, and ticket-linked QA notes
- Pass rule: declared board states render correctly and the review-only/capped/error states are observable from captured artifacts
- Evidence review instance: `visual-qa` or human review against the captured artifact pack
- Delegate with: delegated agent/skill + `/home/kenjipcx/.cursor/tickets/todo/TKT-030-build-session-board-views.md#evidence-review` + expected artifact: UI verification report + write-back target: `Review Findings`

## Execution Proof

- Open/prove: launch the TUI in deterministic fixture/debug mode
- Seed/reset: load stable board/session fixtures or document the tmux setup used
- Inspect/assert: confirm visible cards, filters, review-only behavior, cap behavior, and unsynced markers
- Artifact path: screenshots, terminal snapshots, and ticket-linked QA notes

## Evidence Checklist

- [x] Screenshot: default board view
- [x] Screenshot: review-only view
- [x] Snapshot: filtered or capped board state
- [x] QA report linked:

## Evidence Review

- Reviewer: `visual-qa`
- Input artifacts: default board screenshot, review-only screenshot, filtered/capped snapshot, and any supporting logs
- Verdict artifact: `docs/research/qa-testing/YYYY-MM-DD_visual-qa.md`
- Write-back target: `Review Findings` and `User Evidence`

## Build Notes

- Added the board and review views plus keyboard navigation in the session-board CLI.
- Added snapshot rendering for deterministic proof and TTY smoke testing.
- Added filter shortcuts and configurable visible-session limits.

## Review Findings

- review status: passed
- in-scope: board/review views, snapshot mode, interactive TTY rendering, filter and limit controls
- follow-up:

## Exit Reason

- exit status: done
- exit detail: board_view_complete

## Operator Resume

- Session recap: implemented the first working board and review views for the session-board TUI.
- What happened: added interactive TTY rendering, snapshot mode, filter controls, and review-focused board output.
- What remains: no in-scope UI-view work remains; workflow mutation work continues in TKT-031.

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
- Dependency: `/home/kenjipcx/.cursor/tickets/done/TKT-029-bootstrap-session-board-runtime.md`
- Render layer: `/home/kenjipcx/.cursor/src/session-board/render.ts`
- CLI: `/home/kenjipcx/.cursor/src/session-board-cli.ts`
- Snapshot/action tests: `/home/kenjipcx/.cursor/test/session-board-actions.test.ts`

## User Evidence

- Hero screenshot:
- Supporting evidence: `npm run session-board -- --tui --once --tickets-root test/fixtures/session-board/tickets --tmux-fixture test/fixtures/session-board/tmux-sessions.json`, `npm run session-board -- --tui --once --view review --tickets-root test/fixtures/session-board/tickets --tmux-fixture test/fixtures/session-board/tmux-sessions.json`, and a live TTY smoke run of `npm run session-board -- --tui --tickets-root test/fixtures/session-board/tickets --tmux-fixture test/fixtures/session-board/tmux-sessions.json` all succeeded.
- QA report: snapshot review plus live interactive smoke test
- Final verdict: completed.
