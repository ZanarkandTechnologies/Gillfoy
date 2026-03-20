# Tech Impl Plan Prompt

<!--
Approval-first planning prompt.
Keep this focused on the next commit and the next ticket move, not on implementation detail.
-->

0a. Study `@docs/prd.md`.
0b. Study `@docs/specs/*`.
0c. Study the selected ticket in `@tickets/review/*`. If the target ticket is still in `@tickets/todo/*`, move it to `review/` before writing the full plan.
0d. Study `@docs/MEMORY.md`.
0e. Study `@docs/TROUBLES.md` if present.
0f. Search the codebase first.

Plan only. Target the next commit.

Rules:

1. First decide: `one commit` or `split`.
2. If split, stop and ask before planning deeper.
3. If the work is still broad discovery or product shaping, stop and route to PRD/spec/ticket-splitting instead of forcing a tech impl plan.
4. If product truth is stable but the ticket boundary is still fuzzy, update `Scope Decision` only and stop before full implementation planning.
5. Write the full plan into the selected ticket in `@tickets/review/*` first.
6. Optimize for fast approval, not exhaustive explanation.
7. Put the highest-signal content first.
8. Use compact wording, symbols, and short labels where they improve scan speed.
9. Add appendix detail only if risk or novelty justifies it.
10. Before final handoff, run a plan-quality pass and tighten the plan until it passes.

Output shape:

<!--
This shape is intentionally short so the user can approve quickly.
If a plan needs a long appendix to make sense, the slice is probably too big or too risky.
-->

- `Pitch`
  - `Req`
  - `Bet`
  - `Win`
- `B -> A`
- `Delta`
- `Core Flow`
- `Proof`
- `Plan Review`
- `Ask`

Requirements:

- the selected review ticket is the default plan destination
- the ticket must already be in `review/` before a full plan is written
- use the canonical `Implementation Plan` subsections from the ticket template
- `B -> A` must appear near the top.
- `Core Flow` defaults to short pseudocode.
- Diagram only for new or risky paths.
- Proof must use concrete checks, not generic test categories.
- `Plan Review` must state:
  - which references were actually used,
  - whether scope is still one commit,
  - whether proof/risk/rollback are concrete enough,
  - any fixes made before handoff.
- `Delegation: Not needed` unless justified.
- If delegation is used, include:
  - exact ticket file path
  - delegated agent/skill
  - short task note
  - expected artifact
  - required write-back section in the ticket
- End with `Ready: yes/no`.
- Include `Ticket Move`:
  - where the ticket should live after planning,
  - whether any follow-up tickets should be spawned,
  - whether the ticket stays in `review/` or is ready for `building/`.
- After updating the ticket, use chat only to summarize the same plan and ask for approval.

Do not implement.
