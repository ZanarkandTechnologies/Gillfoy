# Autonomous Testing Contract

Fill this before feature work starts. The goal is to make the main app testable by an agent without guesswork.

## System Type

- Product type: CRUD web | AI app | canvas | realtime | multiplayer | media | mixed
- Primary proof surfaces:
- Non-deterministic surfaces to control:

## Main App Open Path

- Install:
- Start:
- Seed/reset:
- Login/bootstrap:
- Canonical route(s):

## Deterministic Test Method

- Primary method: unit | integration | e2e | visual diff | runtime log assertion | eval | mixed
- Why this method is the source of truth:
- Required fixtures/accounts/data:
- Required environment flags:

## Agent Access Contract

- Open:
- Stabilize:
- Inspect:
- Evidence capture:

## Agent Proof Contract

- Assert:
- Artifact destination:
- Pass/fail rule:

## Required Instrumentation

- Stable selectors:
- Keyboard shortcuts / deep links:
- Debug panels / overlays:
- Test-only state hooks:
- Event or animation logs:
- Multi-client harness:
- Screen manifest / ASCII layouts:

## Evidence Review Policy

- Reviewer:
- Review input:
- Verdict artifact:
- Write-back target:

## Notes

- If any critical flow cannot be proved deterministically, create instrumentation work before building the feature that depends on it.
