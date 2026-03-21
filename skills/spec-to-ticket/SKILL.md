---
name: spec-to-ticket
version: 1.4.0
description: "Phase-2 Ralph skill: convert one approved multi-ticket slice into raw tickets under tickets/todo/, including dependencies, parallelization hints, and testability-first execution contracts."
---

# Spec-to-Ticket Skill

Use this after PRD/spec truth exists and the work is large enough to need multiple coordinated tickets.

<!--
This skill is where product intent becomes executable ticket truth.
It should front-load testability and proof requirements so build and QA do not have to improvise later.
-->

## Job

Given `docs/specs/*.md`, pick exactly one approved multi-ticket slice and convert it into actionable raw ticket files under `tickets/todo/`.

## Rules

1. One SLC slice per planning pass.
2. One ticket = one build loop (default).
3. Dependency order: schema -> backend -> UI -> integration.
4. No implementation in this phase.
5. Write ticket files to `tickets/todo/`; do not use `docs/progress.md` as the primary board.
6. If the slice includes any UI, the ticket must define agent testability and QA shape before build starts.
7. If a UI flow is hard for an agent to access or stabilize, add testability instrumentation work into the slice instead of leaving QA to improvise.
8. Every non-trivial ticket should declare a `Test hook`; if none is needed, say `none needed` explicitly.
9. Every ticket should declare a primary `Test method` before build starts.
10. Mark dependency edges and note which tickets are parallelizable once their prerequisites are met.
11. Do not use this skill when the work is already small and concrete enough for direct ticket -> `tech-impl-plan`.

## Inputs

- `docs/specs/*.md`
- optionally `docs/prd.md` for slice intent
- optionally `docs/TASTE.md` for shared UI doctrine
- `tickets/templates/ticket.md`

## Output

- `tickets/todo/*.md` ticket files with:
  - goal
  - acceptance criteria
  - `Test method`
  - dependencies
  - `parallelizable after`
  - assignee
  - required evidence/backpressure
  - `Execution Proof` for non-UI tickets
  - control fields for state movement
  - for UI-bearing tickets: `Access Contract` + `Proof Contract` + `Evidence checklist` + `Evidence Review`
  - `User Evidence` placeholders

## UI-bearing Ticket Contract

<!--
Access and proof should be separate.
If access is vague, QA cannot reach the feature; if proof is vague, QA can reach it but still reward-hack the verdict.
-->

For any ticket that changes UI, canvas rendering, user-visible flows, or browser interaction, add compact `Access Contract`, `Proof Contract`, and `Evidence Review` blocks.

`Access Contract` required fields:

- `Open`: launch path or command, plus stable route/deeplink if available
- `Test hook`: the cheapest deterministic proof surface, such as a CLI command, seed/reset path, debug route, fixture loader, sanity script, or `none needed`
- `Stabilize`: reset/seed path plus shortcuts/debug controls if determinism matters
- `Inspect`: required hooks, selectors, overlays, or DOM mirrors
- `Evidence capture`: how artifacts are gathered once the target state is reached
- `Key screens/states`: the important surfaces QA must reach and compare
- `Taste refs`: the relevant visual doctrine from `docs/TASTE.md`, plus any local exception

`Proof Contract` required fields:

- `Assertion path`: the source of truth, such as visual diff, DOM/state assertion, runtime log assertion, or mixed
- `Artifact destination`: where proof artifacts are stored
- `Pass rule`: what decides pass/fail once evidence exists
- `Evidence review instance`: the separate judgment surface, for example `visual-qa`, `code-review`, or human review
- `Delegate with`: ticket ID, ticket file path/section, recommended assignee, expected output artifact

`Test method` still belongs in the top-level ticket section and should explain why the chosen proof path is deterministic enough.

Add a compact `Evidence checklist` plus `Evidence Review` block below the access/proof contract for UI-bearing tickets.

<!--
Evidence should be declared up front so QA knows which artifacts must exist before the ticket can close.
Keep the list short; over-declaring proof makes the loop noisy.
-->

Good checklist items are concrete proof artifacts, for example:

- `Screenshot: default screen`
- `Screenshot: empty state`
- `Screenshot: modal open`
- `Snapshot: interaction state`
- `QA report linked`

The checklist should stay short and only include proof the ticket actually needs.

If the UI is hard to test without extra controls, turn those controls into explicit ticket work. Typical examples:

- local CLI smoke commands or sanity scripts,
- pause/resume or step controls for games,
- debug overlays or DOM mirrors for canvas state,
- stable panel shortcuts,
- CLI helpers for repetitive launch/setup paths.

Default UI doctrine should live in `docs/TASTE.md`. Tickets should reference taste briefly instead of repeating long style prose. Only add ASCII when screen structure itself is hard to explain in words.

## Workflow

<!--
The core planning loop here is:
pick one slice, split it, add proof/testability, then write real ticket files into tickets/todo/.
-->

1. Read `docs/specs/*.md` and pick exactly one SLC slice.
2. Split the slice into dependency-ordered tickets.
3. For each ticket, write concrete acceptance criteria, control fields, evidence requirements, dependencies, `parallelizable after`, and a `Test hook`.
4. For each ticket, declare the primary `Test method` and the instrumentation it depends on.
5. For each UI-bearing ticket, add compact `Access Contract`, `Proof Contract`, `Evidence checklist`, and `Evidence Review` blocks.
6. For each non-UI ticket, add `Execution Proof` with open/prove, seed/reset, inspect/assert, and artifact path.
7. If agentic testing looks weak, add instrumentation work into the ticket now instead of hoping QA can discover a path later.
8. Note which tickets can run in parallel after dependencies are satisfied.
9. If the slice is too large, split it into multiple smaller tickets in `tickets/todo/` immediately.
10. Write the finished raw tickets into `tickets/todo/` using the ticket template.
11. Before handoff, read `references/review.md` and tighten the ticket set until it passes those checks.

## Top 3 Gotchas

1. Do not let UI tickets say "verify in browser" without stating how the agent reaches and inspects the screen.
2. Do not defer missing testability controls to QA if you can already see they are needed.
3. Do not leave testability implicit; a ticket should say what the agent runs or opens to prove the feature.
4. Do not write vague visual criteria like "looks good"; encode the key screens, states, and expected proof artifacts.
4. Do not hide overflow scope in prose; spawn a follow-up ticket instead.

## Templates

- Spec structure: `references/spec-template.md`
- Ticket structure: `references/ticket-template.md`
- SLC framing: `references/story-map-slc.md`
- Review guide: `references/review.md`
