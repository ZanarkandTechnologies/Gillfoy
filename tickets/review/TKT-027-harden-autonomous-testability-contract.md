# TKT-027: harden autonomous testability contract

## Status

- state: review
- assignee: codex
- dependencies:
- blockers:
- spawned follow-ups:
- parallelizable after:

## Goal

Make autonomous testability a required design input at project bootstrap, PRD/spec planning, and ticket execution so agents do not have to improvise browser QA paths after the feature is built.

## Scope Decision

This pass hardens repo workflow docs, templates, and skills. It does not add a new browser runner or runtime harness implementation. The focus is enforcing earlier testability contracts and documenting deterministic proof patterns agents can rely on.

## Implementation Plan

### Pitch

- Req: ensure the workflow answers "how will an AI prove this works?" before feature work starts.
- Bet: strengthen existing init/planning/ticket contracts instead of adding another separate process.
- Win: lower QA drift, fewer flaky browser-only checks, and clearer instrumentation work when deterministic proof is missing.

### B -> A

- Before: testability-first guidance exists mostly in `spec-to-ticket` and testing references, but project bootstrap and PRD phases do not consistently force a project-level autonomous testing plan.
- After: bootstrap templates, PRD/spec/ticket contracts, planning prompts, and testing references all require an explicit autonomous test strategy plus per-ticket proof method.
- Outcome: agents must declare open/stabilize/inspect/assert/artifact paths early and can add instrumentation work before build when needed.

### Delta

- Touched areas:
  - `skills/init-project/*`
  - `skills/prd/*`
  - `skills/spec-to-ticket/*`
  - `skills/tech-impl-plan/*`
  - `skills/testing/*`
  - repo ticket template / root contract / docs logs
- Keep:
  - existing `Agent Contract` and `Execution Proof` pattern
- Change:
  - require project-level autonomous test strategy
  - require per-ticket test method selection
  - document deterministic instrumentation patterns more concretely

### Core Flow

```text
1. Bootstrap projects with an explicit autonomous-testing document/template.
2. Require PRDs to define how the main app can be proved by an agent.
3. Require tickets/plans to name the exact proof method per feature.
4. Expand instrumentation guidance for keyboard access, screen manifests, logs, overlays, and comparable evidence.
5. Update memory/history so the contract is durable.
```

### Proof

- `init-project` should scaffold and reference project-level autonomous testing guidance.
- `prd` should require a main-app testability strategy before spec/ticket handoff.
- Ticket/planning contracts should require a per-feature proof method.
- Testing references should explicitly cover deterministic browser/runtime instrumentation patterns.

### Plan Review

- Refs: root `AGENTS.md`, `tickets/templates/ticket.md`, relevant skills/templates/references, `docs/MEMORY.md`, `docs/HISTORY.md`
- Checks:
  - scope: docs/contracts only
  - proof: concrete and reviewable
  - guardrails: reuse existing ticket-first workflow
  - rollback: straightforward doc revert
- Fixes: none

### Ask

- Ready: yes
- Next step after approval: implement the contract changes and update logs.

### Delegation

- Not needed

### Ticket Move

- move to `tickets/building/` during implementation; move to `tickets/done/` after final human confirmation

## Acceptance Criteria
- [x] AC-1: `init-project` bootstrapping requires a project-level autonomous testability artifact or equivalent contract for how the main app is proved by an agent.
- [x] AC-2: `prd` requires explicit autonomous test strategy content before spec/ticket handoff.
- [x] AC-3: ticket/planning contracts require a per-feature test method, not just generic verification language.
- [x] AC-4: testing references document deterministic instrumentation patterns for difficult browser/UI/runtime flows.
- [x] AC-5: repo memory/history are updated to preserve the new invariant.

## Test Method

- Primary method: mixed
- Why this proves the feature: this change is contract/docs work, so direct artifact inspection plus consistency checks across workflow files are the correct proof source
- Required instrumentation: local diff review and linked workflow artifacts

## Executor Policy

```yaml
executor: brute
codex_mode: full-auto
max_iterations: 5
max_review_loops: 3
```

## Runtime State

- current phase: build
- iterations used: 0
- review loops used: 0
- last prompt:
- last result:

## Access Contract

- Open: repo workflow files and skill references
- Test hook: local diff review
- Stabilize: not needed
- Inspect: enforce autonomous testability language across bootstrap, PRD, ticket, and testing layers
- Evidence capture: git diff plus ticket artifact links

## Proof Contract

- Assertion path: direct contract inspection plus bootstrap/template verification
- Artifact destination: git diff plus ticket artifact links
- Pass rule: required project-level and ticket-level autonomous-proof fields exist and are no longer vague or deferred
- Evidence review instance: human review over the touched workflow artifacts
- Delegate with: Not needed

## Execution Proof

- Open/prove: inspect touched docs/templates and verify the new fields/rules exist
- Seed/reset: not needed
- Inspect/assert: confirm the workflow now answers project-level and ticket-level autonomous proof questions explicitly
- Artifact path: git diff + ticket artifact links

## Evidence Checklist

- [x] Screenshot: not needed for docs/rules changes
- [x] Snapshot: not needed for docs/rules changes
- [x] QA report linked: satisfied by local diff review

## Evidence Review

- Reviewer: human reviewer
- Input artifacts: local diff review of touched workflow files plus memory/history entries
- Verdict artifact: ticket closeout and linked review notes
- Write-back target: `Review Findings` and `User Evidence`

## Build Notes

- Added `docs/TESTING.md` as the project-level autonomous testing contract for this repo.
- Updated `init-project` to scaffold and reference `docs/TESTING.md`, including the bootstrap script and templates.
- Updated `prd`, `spec-to-ticket`, `tech-impl-plan`, and the canonical ticket template so autonomous proof is declared earlier and every ticket names a `Test Method`.
- Expanded testing references with deterministic instrumentation guidance for shortcuts, screen manifests, comparable evidence, and queryable logs.

## Review Findings

- review status: passed
- in-scope: workflow docs, templates, references, repo testing contract
- follow-up:

## Exit Reason

- exit status: active
- exit detail: implementation_complete_pending_final_confirmation

## QA Reconciliation
- AC-1: PASS
- AC-2: PASS
- AC-3: PASS
- AC-4: PASS
- AC-5: PASS
- Screen: PASS
- Evidence item: CAPTURED

## Artifact Links

- Repo testing contract: `/home/kenjipcx/.cursor/docs/TESTING.md`
- Repo memory log: `/home/kenjipcx/.cursor/docs/MEMORY.md`
- Repo history log: `/home/kenjipcx/.cursor/docs/HISTORY.md`
- Init project skill: `/home/kenjipcx/.cursor/skills/init-project/SKILL.md`
- PRD skill: `/home/kenjipcx/.cursor/skills/prd/SKILL.md`
- Spec-to-ticket skill: `/home/kenjipcx/.cursor/skills/spec-to-ticket/SKILL.md`
- Tech impl plan skill: `/home/kenjipcx/.cursor/skills/tech-impl-plan/SKILL.md`
- Testing guidance: `/home/kenjipcx/.cursor/skills/testing/references/agentic-testing-instrumentation.md`
- Ticket template: `/home/kenjipcx/.cursor/tickets/templates/ticket.md`

## User Evidence

- Hero screenshot:
- Supporting evidence: bootstrap, PRD, planning, ticket, and testing layers now all require autonomous proof to be named earlier, with project-level `docs/TESTING.md` plus per-ticket `Test Method` fields.
- QA report: local diff review against touched workflow files
- Final verdict: Completed and ready for human review.
