# Build Prompt

Copy and paste this into a new session to start a build pass.

<!--
Keep this prompt execution-only.
High-frequency build actions stay here; rationale and policy stay in AGENTS.md and skills.
-->

---

0a. Read the active ticket in `@tickets/building/*`.
0b. Read `@docs/TESTING.md` so the main app's autonomous proof contract stays the baseline.
0c. Read `@docs/MEMORY.md` and `@docs/TROUBLES.md` if present.
0d. If UI is in scope, read `@docs/TASTE.md`.
0e. Search the code before assuming missing work.

Build rules:

<!--
This block is the build closeout loop:
finish implementation, validate it, write back into the ticket, then move board state.
-->

- complete one active ticket by default
- validate with the project backpressure commands: tests, lint, typecheck, build
- do not improvise QA paths when deterministic proof is missing; add or track instrumentation first
- if the ticket changes user-visible behavior, delegate to `qa-tester`
- update the ticket with:
  - what changed
  - blockers
  - artifact links
  - user evidence
- update project records when applicable:
  - `docs/HISTORY.md`
  - `docs/MEMORY.md`
  - `docs/TROUBLES.md`
- if new scope is discovered, create a linked follow-up ticket in `tickets/todo/`
- if blocked by execution, keep the ticket in `tickets/building/`
- if blocked by planning ambiguity, move the ticket back to `tickets/review/`
- when implementation, QA, evidence, and human confirmation are complete, move the ticket to `tickets/done/` and update `tickets/INDEX.md`
