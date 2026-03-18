# Ticket Board

<!--
Filesystem kanban semantics only.
Keep this file focused on lane meaning and move rules; ticket structure lives in the template.
-->

Filesystem board with four states:

- `todo/`: backlog and split follow-up work
- `review/`: planning and human approval
- `building/`: approved execution and QA
- `done/`: implemented, verified, user-confirmed

Rules:

<!--
These rules exist so the board can be trusted without chat context.
State changes, blockers, and new work should all become filesystem changes.
-->

- ticket file is the source of truth
- QA writes proof back into the ticket file
- blocked execution stays in `building/`
- planning ambiguity moves the ticket back to `review/`
- newly discovered work becomes a new ticket in `todo/`
- every ticket move should also update `tickets/INDEX.md`

Use [templates/ticket.md](/home/kenjipcx/.cursor/tickets/templates/ticket.md) as the canonical shape.
Use [INDEX.md](/home/kenjipcx/.cursor/tickets/INDEX.md) as the lightweight board view; ticket files remain the source of truth.
