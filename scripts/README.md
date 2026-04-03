# Scripts

Purpose: repo-local automation entrypoints and helpers.

Entrypoints:

- `scripts/sync-codex.sh`: sync maintained repo skills/agents into `~/.codex`
- `scripts/brute.sh`: staged Codex runner for ticket-first autonomous build/review loops

Brute reliability defaults:

- one active ticket in `tickets/building/`
- durable runtime state in the ticket first
- proof before `done`
- explicit operator resume packet in the ticket

Minimal example:

```bash
bash ./brute TKT-025 --dry-run
bash ./brute TKT-025 --max-iterations 5
```

How to test:

- `bash -n scripts/brute.sh`
- `bash ./brute --help`
- `bash ./brute TKT-025 --dry-run`
