# Build Prompt

Copy and paste this into a new session to start a build pass.

---

0a. Study `@docs/prd.md` (if present) to understand audience, outcomes, and constraints.
0b. Study `@docs/specs/*` to learn the application specifications.
0c. Study `@docs/progress.md`.
0d. Study `@docs/MEMORY.md` (if present).
0e. For reference, the application source code is in the repo.

- Building mode: follow `@docs/progress.md` and choose work from the current SLC slice (one release slice at a time). Do not assume not implemented; search first.
  - Default: do one ticket.
  - You may do up to 3 tickets in parallel ONLY if they are truly independent (no shared files or ordering dependencies).

- Implement the ticket completely, then validate using the project backpressure commands (tests, lint, typecheck, build).

- If the ticket affects user-visible behavior (UI/layout/canvas rendering, interactions, auth flow, room join/create, routing), delegate to `qa-tester` for a browser smoke pass using `agent-browser`.

- Update `@docs/progress.md` with what changed and why.

- Capture the why in documentation, including test significance and implementation importance.
- Keep single sources of truth, no migrations/adapters. If tests unrelated to your work fail, resolve them as part of the increment.
- As soon as there are no build or test errors, create a git tag. If no git tags exist, start at `0.0.0` and increment patch by 1 (for example `0.0.1`).
- You may add extra logging if required to debug issues.
- Keep `@docs/progress.md` current with learnings to avoid duplicated efforts in future loops.
- When you learn something new about run commands, update `@AGENTS.md` briefly.
- For any bugs you notice, resolve or document them in `@docs/progress.md`, even if unrelated to the current ticket.
- Implement functionality completely. Placeholders and stubs waste effort.
- When `@docs/progress.md` becomes large, periodically clean completed items.
- If you find inconsistencies in `docs/specs/*`, update the specs.
- Keep `@AGENTS.md` operational only. Status updates and progress notes belong in `@docs/progress.md`.
