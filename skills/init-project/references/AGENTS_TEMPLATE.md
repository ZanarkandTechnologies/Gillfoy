# Project AGENTS.md (Template)

This file is loaded every loop. Keep it operational and project-specific.

## Build & Run

- Install: `[your command]`
- Dev: `[your command]`

## Validation (Backpressure)

- Tests: `[your command]`
- Typecheck: `[your command]`
- Lint: `[your command]`
- Build: `[your command]`

## Docs State

- PRD: `docs/prd.md`
- Specs: `docs/specs/*`
- Plan: `docs/progress.md`
- History: `docs/HISTORY.md`
- Memory: `docs/MEMORY.md`

## Context First (Always)

- Read relevant specs/PRD before proposing edits.
- Read nearest module `README.md` + `AGENTS.md`.
- Search for existing patterns and inspect related files.
- Identify affected interfaces first.
- No blind edits.

## Operating Modes

- Planning mode: create/refresh plan first; get confirmation before implementation.
- Build mode: execute approved plan, then test/review.

## Delegation Guardrails

- Use specialized QA delegation only when corresponding surface changed.
- Docs/markdown/rule-text-only changes: `visual-qa` is not needed.
- If delegating, include one-line reason and expected artifact.

## Prototype-First Delivery

- Start smallest possible slice first.
- Ramp intentionally: `1 -> 10 -> 100`.
- Use dry-runs/checkpoints for risky or stateful operations.

## Notes

- Don’t assume not implemented: search first.
- Prefer local patterns, then docs, then external examples.
