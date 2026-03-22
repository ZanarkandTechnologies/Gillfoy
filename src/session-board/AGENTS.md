# `src/session-board/AGENTS.md`

Module contract for the session-board runtime.

## Purpose

Provide the local runtime and data-contract layer for the tmux session board.

## Invariants

- Markdown tickets remain canonical state.
- Tmux session attachment must be explicit, not guessed.
- Session names or fixture metadata must contain a ticket id such as `TKT-029`.
- Ambiguous or orphan tmux sessions must surface as sync states, not auto-resolve.

## Memory

- MEM-0030: explicit ticket-id-based tmux attachment; ambiguous/orphan sessions stay visible.

## Public Surface

- `discoverBoardState()` returns the canonical proof-mode board model.
- CLI proof mode should stay deterministic with fixture inputs.

## Proof

- Prefer fixture-backed CLI and integration tests before interactive UI work.
