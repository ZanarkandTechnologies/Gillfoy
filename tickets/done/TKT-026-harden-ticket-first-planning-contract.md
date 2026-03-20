# TKT-026: harden the ticket-first planning contract

## Status

- state: done
- assignee: codex
- dependencies: TKT-024
- blockers:
- spawned follow-ups:
- parallelizable after:

## Goal

Tighten the new ticket-first planning workflow so it is mechanically enforceable, not just a loose preference.

## Scope Decision

This pass hardens the existing contract. It does not introduce a new brainstorm or increment-PRD skill yet. The focus is enforcement: required plan headings, explicit todo -> review promotion before planning, a ticket-only `Scope Decision` stop for fuzzy but already product-aligned work, a stricter final handoff shape, and canonical execution-proof metadata for non-UI tickets.

## Implementation Plan

### Pitch

- Req: close the loopholes found in review so agents cannot satisfy the new workflow with vague prose or by planning from `todo/` without a proper review ticket.
- Bet: harden the ticket template and planning prompts before adding new skills.
- Win: better compliance now with lower surface area than inventing more planning modes immediately.

### B -> A

- Before: ticket-first planning exists, but key pieces are still comment-driven and easy to interpret loosely.
- After: the workflow names the exact intermediate states, required plan sections, preconditions for `tech-impl-plan`, final handoff shape, and canonical proof fields.
- Outcome: stronger ticket discipline and less behavioral drift across sessions.

### Delta

- Touched areas:
  - `AGENTS.md`
  - `README.md`
  - `skills/tech-impl-plan/SKILL.md`
  - `skills/tech-impl-plan/prompts/plan.md`
  - `skills/spec-to-ticket/SKILL.md`
  - `skills/init-project/prompts/plan.md`
  - `tickets/templates/ticket.md`
- Keep:
  - direct ticket -> `tech-impl-plan` for concrete work
  - review ticket as plan destination
- Change:
  - make required plan headings explicit
  - require `todo -> review` before full tech impl planning
  - add `Scope Decision only` as a valid stop
  - formalize final handoff packet
  - add `Execution Proof` and `parallelizable after`

### Core Flow

```text
1. If work is concrete, create/select ticket.
2. If ticket is in todo, move it to review before tech-impl-plan.
3. If scope is still fuzzy but product truth is stable, fill Scope Decision only and stop.
4. If scope is credible, write the required Implementation Plan headings into the review ticket.
5. Use Execution Proof for non-UI proof surfaces and Agent Contract for UI-specific access/QA.
6. Summarize the same plan in chat for approval.
```

### Proof

- The template should itself show the required plan headings.
- `tech-impl-plan` should no longer allow planning from `todo/` without first promoting the ticket.
- The system should have a documented middle state between broad PRD work and full tech impl planning.
- The README flow should match the hardened contract.

### Plan Review

- Refs: `AGENTS.md`, `README.md`, `skills/tech-impl-plan/*`, `skills/spec-to-ticket/SKILL.md`, `skills/init-project/prompts/plan.md`, `tickets/templates/ticket.md`
- Checks:
  - scope: one docs/rules pass
  - proof: concrete
  - guardrails: aligned
  - rollback: clear
- Fixes: none

### Ask

- Ready: yes
- Next step after approval: implement and reconcile the ticket.

### Delegation

- Not needed

### Ticket Move

- move to `tickets/done/` after implementation + evidence

## Acceptance Criteria
- [x] AC-1: The ticket template explicitly scaffolds the required `Implementation Plan` headings instead of relying on a comment only.
- [x] AC-2: `tech-impl-plan` requires a selected review ticket and tells the agent to promote `todo -> review` before full planning.
- [x] AC-3: The system documents a valid `Scope Decision only` stop for fuzzy but product-aligned work.
- [x] AC-4: Final handoff shape is tightened into an explicit packet rather than a vague anti-upsell rule.
- [x] AC-5: Non-UI tickets get a canonical place to declare proof surfaces, and multi-ticket work gets explicit parallelization metadata.

## Agent Contract

- Open: `/home/kenjipcx/.cursor/AGENTS.md`, `/home/kenjipcx/.cursor/README.md`, planning skill docs, and `/home/kenjipcx/.cursor/tickets/templates/ticket.md`
- Test hook: local diff review
- Stabilize: not needed
- Inspect: planning contract consistency across repo docs and ticket template
- Key screens/states: not applicable
- Taste refs: none
- Expected artifacts: hardened docs/template diff plus ticket reconciliation
- Delegate with: Not needed

## Execution Proof

- Open/prove: local diff of touched docs/templates
- Seed/reset: not needed
- Inspect/assert: verify required language exists in contract files and template sections
- Artifact path: git diff + ticket artifact links

## Evidence Checklist

- [x] Screenshot: not needed for docs/rules changes
- [x] Snapshot: not needed for docs/rules changes
- [x] QA report linked: satisfied by local diff review

## Build Notes

- Hardened `AGENTS.md` with explicit `Scope Decision` stop, review-ticket precondition, and final handoff packet.
- Updated `README.md` flow to reflect todo -> review promotion, `Scope Decision` stop, non-UI `Execution Proof`, and stricter closeout behavior.
- Tightened `tech-impl-plan` skill/prompt so full plans require a selected review ticket and canonical ticket subheadings.
- Updated `spec-to-ticket` and the ticket template with `parallelizable after` plus `Execution Proof`.

## QA Reconciliation
- AC-1: PASS
- Screen: PASS (not applicable)
- Evidence item: CAPTURED

## Artifact Links

- Repo contract: `/home/kenjipcx/.cursor/AGENTS.md`
- Workflow overview: `/home/kenjipcx/.cursor/README.md`
- Plan skill: `/home/kenjipcx/.cursor/skills/tech-impl-plan/SKILL.md`
- Plan prompt: `/home/kenjipcx/.cursor/skills/tech-impl-plan/prompts/plan.md`
- Spec-to-ticket: `/home/kenjipcx/.cursor/skills/spec-to-ticket/SKILL.md`
- Init prompt: `/home/kenjipcx/.cursor/skills/init-project/prompts/plan.md`
- Ticket template: `/home/kenjipcx/.cursor/tickets/templates/ticket.md`
- Memory log: `/home/kenjipcx/.cursor/docs/MEMORY.md`
- History log: `/home/kenjipcx/.cursor/docs/HISTORY.md`

## User Evidence

- Hero screenshot:
- Supporting evidence: the planning workflow is now harder to satisfy loosely because the template, plan skill, README flow, and repo contract all enforce the same review-ticket-first and scope-decision-first behavior.
- QA report: local diff review of touched files
- Final verdict: Completed and ready to ship.
