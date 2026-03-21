# Autonomous Testing Contract

## System Type

- Product type: workflow/skills repo
- Primary proof surfaces: local diff review, template/bootstrap verification, contract consistency checks
- Non-deterministic surfaces to control: none for this repo's current scope

## Main App Open Path

- Install: not needed
- Start: not needed
- Seed/reset: not needed
- Login/bootstrap: not needed
- Canonical route(s): repository files under `skills/`, `tickets/`, and `docs/`

## Deterministic Test Method

- Primary method: mixed
- Why this method is the source of truth: this repo primarily changes prompts, templates, and workflow contracts, so the safest proof is direct inspection of generated files plus targeted bootstrap/template checks rather than browser automation
- Required fixtures/accounts/data: existing repo files
- Required environment flags: none

## Agent Access Contract

- Open: read the touched skills/templates/contracts directly
- Stabilize: inspect current ticket and existing board/docs state before editing
- Inspect: verify required sections/phrases exist consistently across bootstrap, PRD, ticket, and testing layers
- Evidence capture: git diff plus ticket artifact links

## Agent Proof Contract

- Assert: confirm no layer still implies "figure QA out later"
- Artifact destination: git diff plus ticket artifact links
- Pass/fail rule: fail if project bootstrap, PRD, ticket, and testing layers disagree about how autonomous proof is defined

## Required Instrumentation

- Stable selectors: not applicable for this repo
- Keyboard shortcuts / deep links: not applicable for this repo
- Debug panels / overlays: not applicable for this repo
- Test-only state hooks: not applicable for this repo
- Event or animation logs: not applicable for this repo
- Multi-client harness: not applicable for this repo
- Screen manifest / ASCII layouts: use only when documenting app-facing contracts in templates or references

## Evidence Review Policy

- Reviewer: human reviewer or a judgment-only review instance such as `visual-qa`, depending on the surface
- Review input: git diff, command output, and ticket-linked artifacts captured during implementation
- Verdict artifact: ticket-linked QA report or review note
- Write-back target: `Review Findings` and `User Evidence` in the active ticket
