# TKT-023: converge agent loop feedback into repo contracts

## Status

- state: done
- assignee: codex
- dependencies:
- blockers:
- spawned follow-ups: TKT-024, TKT-025

## Goal

Turn recent operator feedback about session handoff clarity, end-of-run upsell behavior, fragmented planning, and weak testability-first planning into a small set of repo and skill contract changes.

## Scope Decision

This umbrella ticket covers the contract-level prompt and workflow changes only. It explicitly splits deeper executor-loop observability design into a separate follow-up ticket instead of hiding it inside wording changes.

## Implementation Plan

- Use `TKT-024` for the ticket-first tech-impl-plan execution surface.
- Update repo contract, workflow docs, planning prompts, and ticket template together so the system does not drift between chat habits and file-based truth.
- Record durable decisions in memory/history and log the operator feedback in troubles.
- Split executor-loop observability into `TKT-025` rather than overloading this pass.

## Acceptance Criteria
- [x] AC-1: The system requires a compact session recap in final handoff so a returned operator can tell what the session was about.
- [x] AC-2: Final-answer guidance stops default upselling when the active ticket/scope is already exhausted.
- [x] AC-3: Planning docs explain the intended hierarchy between PRD, slice/spec, and tickets more clearly.
- [x] AC-4: Planning contracts push testability tooling/instrumentation decisions earlier and more explicitly.
- [x] AC-5: Any bigger executor-loop or observability redesign is split into follow-up ticket(s) instead of being hidden in prompt tweaks.

## Agent Contract

- Open: `/home/kenjipcx/.cursor/AGENTS.md`, skill `SKILL.md` files, and prompt docs under `skills/*` and `agents/*`
- Test hook: docs/rules review by diff
- Stabilize: not needed
- Inspect: repo contract, planning prompts, ticket template, and related skill guidance
- Key screens/states: not applicable
- Taste refs: none
- Expected artifacts: approval-ready split plan plus ticket write-back
- Delegate with: Not needed

## Evidence Checklist

- [x] Screenshot: not needed for docs/rules changes
- [x] Snapshot: not needed for docs/rules changes
- [x] QA report linked: satisfied by local diff review against touched files

## Build Notes

- Added final-handoff rules in `AGENTS.md` for session recap and anti-upsell closeout.
- Clarified planning-layer selection in `AGENTS.md` and `README.md` so the system prefers direct ticket -> `tech-impl-plan` for concrete work and only uses PRD/spec layers when the work genuinely needs them.
- Strengthened testability-first planning language in `AGENTS.md`, `skills/spec-to-ticket/SKILL.md`, and `skills/init-project/prompts/plan.md`.
- Split the deeper executor-loop observability idea into `TKT-025`.

## QA Reconciliation
- AC-1: PASS
- Screen: PASS (not applicable)
- Evidence item: CAPTURED

## Artifact Links

- Repo contract: `/home/kenjipcx/.cursor/AGENTS.md`
- Workflow overview: `/home/kenjipcx/.cursor/README.md`
- Ticket-first planning follow-up: `/home/kenjipcx/.cursor/tickets/done/TKT-024-ticket-first-tech-impl-plan.md`
- Spec-to-ticket guidance: `/home/kenjipcx/.cursor/skills/spec-to-ticket/SKILL.md`
- Init planning prompt: `/home/kenjipcx/.cursor/skills/init-project/prompts/plan.md`
- Durable memory: `/home/kenjipcx/.cursor/docs/MEMORY.md`
- Troubles log: `/home/kenjipcx/.cursor/docs/TROUBLES.md`
- Executor-loop follow-up: `/home/kenjipcx/.cursor/tickets/todo/TKT-025-observable-executor-loop-design.md`

## User Evidence

- Hero screenshot:
- Supporting evidence: final handoff rules, planning-layer selection, stronger proof-surface planning, and explicit follow-up splitting are now captured in repo contract + skill docs instead of left implicit in chat.
- QA report: local diff review of touched files
- Final verdict: Completed and ready to ship.
