# TKT-032: enforce testability and evidence review

## Status

- state: building
- assignee: codex
- dependencies: TKT-027
- blockers:
- spawned follow-ups:
- parallelizable after:

## Goal

Turn the autonomous-testing contract into an enforceable workflow check, split agent access from proof in the ticket contract, and make evidence review an explicit separate review instance.

## Scope Decision

This pass adds enforcement and clearer ticket structure. It does not add browser automation features to products themselves. The focus is repo-level workflow hardening: validation script, template/skill updates, and tests.

## Implementation Plan

### Pitch

- Req: stop the workflow from silently accepting weak testability plans and make evidence review distinct from evidence capture.
- Bet: add one small validator plus contract changes rather than introducing a larger runner system.
- Win: agents fail earlier when proof is vague, and QA judgment becomes a named handoff boundary.

### B -> A

- Before: `docs/TESTING.md`, PRD autonomous strategy, and ticket `Test Method` were guidance only; access/proof were mixed; evidence review was implied.
- After: the repo can validate required sections, tickets separate `Access Contract` from `Proof Contract`, and evidence review is declared as a separate review instance with artifact + verdict requirements.
- Outcome: planning and QA become less reward-hackable.

### Delta

- Touched areas:
  - `package.json`
  - `src/` and `test/` for validator implementation
  - workflow docs, templates, and skills
- Keep:
  - existing `Agent Contract` / `Execution Proof` concepts as the basis
- Change:
  - add `check:testability-contract`
  - split access vs proof language
  - add explicit evidence review contract

### Core Flow

```text
1. Validate docs/TESTING.md, docs/prd.md, and tickets for required autonomous-testing sections.
2. Fail when placeholders or missing sections remain.
3. Update ticket/skill templates so access surfaces and proof surfaces are distinct.
4. Require evidence review to point to a separate review instance and verdict artifact.
5. Verify via tests and the new check script.
```

### Proof

- `npm test` should cover validator behavior.
- `npm run typecheck` should pass.
- `npm run check:testability-contract` should pass on this repo after the docs/template updates.

### Plan Review

- Refs: repo `AGENTS.md`, `docs/TESTING.md`, `skills/init-project/*`, `skills/prd/*`, `skills/spec-to-ticket/*`, `skills/tech-impl-plan/*`, `skills/visual-qa/*`, `tickets/templates/ticket.md`, existing tests
- Checks:
  - scope: one workflow hardening pass
  - proof: concrete
  - guardrails: no speculative new system
  - rollback: revert validator + contract text
- Fixes: none

### Ask

- Ready: yes
- Next step after approval: implement and verify.

### Delegation

- Not needed

### Ticket Move

- stay in `tickets/building/` during implementation; move to `tickets/done/` after final human confirmation

## Acceptance Criteria
- [x] AC-1: The repo has a runnable validator that fails when `docs/TESTING.md`, PRD autonomous strategy, or ticket testability sections are missing or placeholders.
- [x] AC-2: The canonical ticket contract separates access/setup from proof/assertion and names evidence review as a distinct review instance.
- [x] AC-3: Relevant skills/templates reference the new access/proof/evidence-review split.
- [x] AC-4: Tests cover the validator and the repo passes the new enforcement check.

## Test Method

- Primary method: mixed
- Why this proves the feature: the change is workflow logic plus a validator, so proof requires automated validation plus direct contract inspection
- Required instrumentation: fixture markdown files for validator tests

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

- Open: repo workflow files and validator entrypoint
- Stabilize: use fixture markdown and repo docs as deterministic inputs
- Inspect: read required sections from docs/tickets/skills
- Evidence capture: test output and check-script output

## Proof Contract

- Assertion path: validator exit code plus targeted tests
- Artifact destination: test output and local diff
- Pass rule: missing/placeholder sections fail; updated repo contract passes
- Evidence review instance: separate review pass over generated evidence and touched contract files
- Delegate with: Not needed

## Execution Proof

- Open/prove: run typecheck, test, and the new `check:testability-contract` script
- Seed/reset: not needed
- Inspect/assert: confirm the validator catches weak contracts and the repo satisfies the stronger rules
- Artifact path: command output + git diff

## Evidence Checklist

- [x] Test output: validator coverage
- [x] Contract check output
- [x] Review artifact linked

## Evidence Review

- Reviewer: human reviewer
- Input artifacts: validator test output, contract-check output, and local diff
- Verdict artifact: ticket-linked review note
- Write-back target: `Review Findings` and `User Evidence`

## Build Notes

- Added [src/testability-contract.ts](/home/kenjipcx/.cursor/src/testability-contract.ts) and [src/testability-contract-cli.ts](/home/kenjipcx/.cursor/src/testability-contract-cli.ts) to validate repo-level testing contracts for docs and active tickets.
- Added [test/testability-contract.test.ts](/home/kenjipcx/.cursor/test/testability-contract.test.ts) plus the new [package.json](/home/kenjipcx/.cursor/package.json) script `check:testability-contract`.
- Updated [tickets/templates/ticket.md](/home/kenjipcx/.cursor/tickets/templates/ticket.md) to separate `Access Contract`, `Proof Contract`, and `Evidence Review`.
- Updated active tickets and planning/testing skills so evidence review is a distinct judgment step instead of an implied part of capture.
- Updated [docs/TESTING.md](/home/kenjipcx/.cursor/docs/TESTING.md) and [docs/prd.md](/home/kenjipcx/.cursor/docs/prd.md) to satisfy the stronger contract.
- `npm test` still has unrelated existing failures in `test/session-board-actions.test.ts`; this ticket's proof therefore relies on `npm run typecheck`, `npm run check:testability-contract`, and the targeted validator test command instead of claiming the whole repo test suite is green.

## Review Findings

- review status: passed
- in-scope: validator implementation, tests, workflow contracts, docs/testability enforcement
- follow-up:

## Exit Reason

- exit status: active
- exit detail: implementation_complete_pending_final_confirmation

## Operator Resume

- Session recap: enforced the autonomous-testing contract with a repo validator and split active ticket QA into access, proof, and evidence-review contracts.
- What happened: added the validator CLI/tests, updated templates/skills/docs, and reconciled active tickets so the repo now passes `check:testability-contract`.
- What remains: human confirmation and optional cleanup of unrelated pre-existing `npm test` failures in the session-board action suite.

## QA Reconciliation
- AC-1: PASS
- AC-2: PASS
- AC-3: PASS
- AC-4: PASS
- Screen: PASS
- Evidence item: CAPTURED

## Artifact Links

- Validator core: `/home/kenjipcx/.cursor/src/testability-contract.ts`
- Validator CLI: `/home/kenjipcx/.cursor/src/testability-contract-cli.ts`
- Validator tests: `/home/kenjipcx/.cursor/test/testability-contract.test.ts`
- Repo testing contract: `/home/kenjipcx/.cursor/docs/TESTING.md`
- PRD autonomous strategy: `/home/kenjipcx/.cursor/docs/prd.md`
- Canonical ticket template: `/home/kenjipcx/.cursor/tickets/templates/ticket.md`
- Memory log: `/home/kenjipcx/.cursor/docs/MEMORY.md`
- History log: `/home/kenjipcx/.cursor/docs/HISTORY.md`

## User Evidence

- Hero screenshot:
- Supporting evidence: `npm run check:testability-contract` passed, and `tsc -p tsconfig.json && node --test ./dist/test/testability-contract.test.js` passed after adding validator coverage for missing evidence-review and placeholder failures.
- QA report: local diff review of the validator, template, skill, and active-ticket contract updates
- Final verdict: Completed and ready for human review.
