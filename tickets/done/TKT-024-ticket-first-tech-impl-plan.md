# TKT-024: make tech impl plans ticket-first instead of chat-first

## Status

- state: done
- assignee: codex
- dependencies:
- blockers:
- spawned follow-ups:

## Goal

Make the ticket file the default approval surface for technical implementation plans so planning context persists in the filesystem instead of living primarily in chat.

## Scope Decision

This ticket covers the docs/rules/template changes needed to make the selected review ticket the plan source of truth. It does not redesign the broader PRD/spec lifecycle beyond clarifying when direct ticket -> `tech-impl-plan` is valid.

## Implementation Plan

### Pitch

- Req: make tech impl plans live in the ticket by default instead of mainly in chat, while preserving quick approval flow.
- Bet: keep chat as a concise mirror of the plan, not the source of truth.
- Win: when you return to a session later, the ticket already contains scope, reasoning, proof, and next move without requiring chat archaeology.

### B -> A

- Before: a ticket may exist, but the real plan is often produced in chat first and only partially reflected back into the ticket.
- After: once a ticket enters `review/`, the tech impl plan is written into that ticket as the approval artifact; chat only summarizes the same plan and asks for approval.
- Outcome: planning becomes durable, resumable, and easier to scan across many concurrent sessions.

### Delta

- Touched areas:
  - `AGENTS.md`
  - `README.md`
  - `skills/tech-impl-plan/SKILL.md`
  - `skills/tech-impl-plan/prompts/plan.md`
  - `skills/init-project/prompts/plan.md`
  - `tickets/templates/ticket.md`
- Keep:
  - ticket board state machine
  - `review/` as the approval state
  - compact chat approval loop
- Change:
  - define the ticket as the default plan destination
  - add a ticket section for `Scope Decision` and `Implementation Plan`
  - clarify that chat is a summary, not a second competing plan surface
- Delete:
  - implicit chat-first planning behavior

### Core Flow

```text
1. User request creates or selects a ticket.
2. If scope is fuzzy, do discovery first and write the stabilized scope into the ticket.
3. When the ticket is in review, run tech-impl-plan against that ticket.
4. Write Pitch, B -> A, Delta, Core Flow, Proof, Plan Review, Ask, Delegation, Ticket Move into the ticket.
5. Send a short chat summary that points back to the ticket and asks for approval.
6. After approval, move the same ticket to building and execute from that file.
```

### Proof

- A reviewer should be able to open one ticket and understand the planned change without reading prior chat.
- The chat response should be shorter because it only mirrors the ticket plan.
- A concrete small task should still be able to go directly from ticket creation to `tech-impl-plan` without requiring PRD/spec work.
- Multi-ticket or fuzzy work should still split before implementation planning starts.

- Main risk: stuffing too much product discovery into the ticket plan section could bloat small review tickets.
- Rollback: keep the plan section compact and move broad discovery to PRD/spec or a future dedicated brainstorm/increment skill.

### Plan Review

- Refs:
  - `AGENTS.md`
  - `tickets/templates/ticket.md`
  - `skills/tech-impl-plan/SKILL.md`
  - `skills/init-project/prompts/plan.md`
  - `skills/spec-to-ticket/SKILL.md`
  - `skills/prd/SKILL.md`
- Checks:
  - scope: one docs/rules pass
  - proof: concrete and observable
  - guardrails: aligned with ticket-first repo contract
  - rollback: clear
- Fixes: split broader executor-loop observability into a separate follow-up ticket.

### Ask

- Ready: yes
- Next step after approval: implement the docs/rules/template changes so future planning sessions write the plan into the selected review ticket by default.

### Delegation

- Not needed

### Ticket Move

- Move to `tickets/done/` after implementation.
- No spawned follow-up tickets required for this specific docs/rules pass.

## Acceptance Criteria
- [x] AC-1: Planning guidance says the selected review ticket is the primary home for the tech implementation plan.
- [x] AC-2: `tech-impl-plan` output shape is adapted so the same plan can be written directly into the ticket without losing approval clarity.
- [x] AC-3: The repo contract clarifies when chat should be used only as a compact summary of the ticket-hosted plan.
- [x] AC-4: The workflow still allows direct ticket -> tech-impl-plan for concrete small changes without forcing PRD/spec work first.

## Agent Contract

- Open: `/home/kenjipcx/.cursor/AGENTS.md`, `skills/tech-impl-plan/*`, `skills/init-project/prompts/plan.md`, and `tickets/templates/ticket.md`
- Test hook: docs/rules review by diff
- Stabilize: not needed
- Inspect: plan-writing rules, ticket lifecycle rules, and current ticket template sections
- Key screens/states: not applicable
- Taste refs: none
- Expected artifacts: one review ticket containing the approval-ready plan plus any follow-up ticket/template changes needed for implementation
- Delegate with: Not needed

## Evidence Checklist

- [x] Screenshot: not needed for docs/rules changes
- [x] Snapshot: not needed for docs/rules changes
- [x] QA report linked: satisfied by local diff review against touched files

## Build Notes

- Implemented the ticket-first planning rule in `AGENTS.md`, `README.md`, `skills/tech-impl-plan/SKILL.md`, `skills/tech-impl-plan/prompts/plan.md`, `skills/init-project/prompts/plan.md`, and `tickets/templates/ticket.md`.
- Verified by reviewing the local diff to ensure the rule is consistent across repo contract, user-facing workflow docs, and planning prompts.

## QA Reconciliation
- AC-1: PASS
- Screen: PASS (not applicable)
- Evidence item: CAPTURED

## Artifact Links

- Repo contract: `/home/kenjipcx/.cursor/AGENTS.md`
- Workflow overview: `/home/kenjipcx/.cursor/README.md`
- Plan skill: `/home/kenjipcx/.cursor/skills/tech-impl-plan/SKILL.md`
- Plan prompt: `/home/kenjipcx/.cursor/skills/tech-impl-plan/prompts/plan.md`
- Init prompt: `/home/kenjipcx/.cursor/skills/init-project/prompts/plan.md`
- Ticket template: `/home/kenjipcx/.cursor/tickets/templates/ticket.md`

## User Evidence

- Hero screenshot:
- Supporting evidence: the repo contract, plan skill, plan prompt, and ticket template now all point to the selected review ticket as the default implementation-plan destination, with chat reduced to a compact approval summary.
- QA report: local diff review of touched files
- Final verdict: Completed and ready to ship.
