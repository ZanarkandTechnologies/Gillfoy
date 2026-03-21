# Implementation Plan Prompt (General)

Copy and paste this into a new session to start a coding implementation planning pass.

---

0a. Study `@docs/prd.md` to understand audience, outcomes, and constraints.
0b. Study `@docs/TESTING.md` to understand the project's autonomous proof path, instrumentation hooks, and artifact expectations.
0c. Study `@docs/specs/*` to learn the application specifications.
0d. Study the active ticket in `@tickets/review/*` first; if none exists, inspect `@tickets/todo/*`.
0e. Study `@docs/MEMORY.md` for durable technical constraints.
0f. Study `@docs/TROUBLES.md` for repeated failure patterns that should be avoided in this slice.
0g. If UI or UX is in scope, study `@docs/TASTE.md` for shared visual doctrine.
0h. Search the codebase before assuming anything is missing.
0i. Confirm affected interfaces and nearest module `README.md` + `AGENTS.md` before proposing changes.

1. First choose the smallest planning layer that fits:
   - direct ticket -> `tech-impl-plan` for concrete one-loop work,
   - PRD update when product truth is missing or changing,
   - spec/ticket decomposition when one phase needs multiple coordinated tickets.
2. If product truth is stable but the ticket boundary is still fuzzy, fill `Scope Decision` in the ticket and stop there before full tech impl planning.
3. Planning mode only: write the chosen plan into the selected ticket or planning artifact first; chat should summarize that file, not compete with it.
4. For technical implementation planning, use the selected review ticket as the default home for the plan.
5. If the ticket is still in `tickets/todo/`, move it to `tickets/review/` before writing the full plan.
6. Include a High-Level Change Preview:
   - architecture delta (ASCII or mermaid),
   - stubbed interface/pseudocode snippets for critical touchpoints,
   - before -> after behavior bullets.
7. Include touched files/interfaces, dependency order, validation strategy, and rollback notes if needed.
8. Add user stories and concrete acceptance tests with explicit observable behavior.
9. Convert to execution todos; final todos must include required testing and verification tasks.
10. Add an Execution Assist Matrix:
   - in-session skills and why,
   - delegated subagents only when justified,
   - expected artifact from each delegated step.
11. Apply delegation guardrails:
   - docs-only/markdown-only/rule-text changes -> no visual QA delegation,
   - UI behavior/layout/styling changes -> include `visual-qa` expected spec artifact path.
12. Add one Debt/Optimization Insight from touched code surface (low-risk improvement + rationale).
13. Preserve prototype-first strategy in the plan (1 -> 10 -> 100 ramp, dry-runs/checkpoints for risky changes).
14. Add review/testing criteria and final wow gate todos.
15. End with clear yes/no handoff.
16. Include explicit `Ticket Move` output:
   - move raw ticket from `tickets/todo/` to `tickets/review/` when planning starts,
   - move to `tickets/building/` only after human approval,
   - spawn follow-up tickets in `tickets/todo/` when scope splits.
17. For UI or autonomous workflows, decide the proof surface up front:
    - open path,
    - seed/reset path,
    - inspect hook,
    - assertion path,
    - artifact destination.
18. For every ticket, name the primary test method up front:
   - unit, integration, e2e, visual diff, runtime log assertion, eval, or mixed,
   - why it is deterministic enough for this feature,
   - which instrumentation work must exist first.

IMPORTANT: Plan only. Do not implement.
