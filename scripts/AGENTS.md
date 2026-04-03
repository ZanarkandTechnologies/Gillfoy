# `scripts/AGENTS.md`

Purpose: shell entrypoints and helpers that operate on the repo itself.

Rules:

- keep scripts deterministic and local-first
- prefer repo files as durable state; use sidecars only for volatile runtime metadata
- fail loudly on missing inputs or malformed ticket state
- use `--dry-run` for orchestration verification paths when possible
- enforce one active building ticket for staged runners when the workflow requires it
- prefer explicit completion/blocker checks over trusting prompt wording alone

Validation:

- `bash -n <script>`
- script `--help`
- targeted dry-run against a real ticket before live execution
