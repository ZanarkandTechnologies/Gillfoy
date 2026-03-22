# Session Board Runtime

## Purpose

Bootstrap the runtime and discovery contract for the tmux session board.

## Public API / Entrypoints

- `discoverBoardState()` in [index.ts](/home/kenjipcx/.cursor/src/session-board/index.ts)
- CLI proof mode via `npm run session-board -- --proof --json`
- interactive TUI via `npm run session-board -- --tui`
- workflow actions via `promote`, `approve`, `writeback`, and `rename-session`

## Minimal Example

```bash
npm run session-board -- --proof --json
```

Deterministic fixture mode:

```bash
npm run session-board -- --proof --json \
  --tickets-root test/fixtures/session-board/tickets \
  --tmux-fixture test/fixtures/session-board/tmux-sessions.json
```

Review snapshot:

```bash
npm run session-board -- --tui --once --view review \
  --tickets-root test/fixtures/session-board/tickets \
  --tmux-fixture test/fixtures/session-board/tmux-sessions.json
```

## How To Test

```bash
npm test
npm run typecheck
npm run session-board -- --proof --json --tickets-root test/fixtures/session-board/tickets --tmux-fixture test/fixtures/session-board/tmux-sessions.json
npm run session-board -- --tui --once --view review --tickets-root test/fixtures/session-board/tickets --tmux-fixture test/fixtures/session-board/tmux-sessions.json
```
