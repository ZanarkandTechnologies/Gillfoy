---
name: tech-impl-plan
version: 1.0.0
description: "Coding-focused implementation planning skill. Produces mini-PRD context, technical implementation steps, concrete user-observable test cases, strict testing todos, and yes/no execution handoff."
allowed-tools: Read, Glob, Grep
---

# Tech Impl Plan Skill

Use this for software implementation planning. It is coding-first and testing-detailed.

## Core Prompt Wording (Use Literally)

0a. Study `@docs/prd.md` to understand audience, outcomes, and constraints.  
0b. Study `@docs/specs/*` to learn application specifications.  
0c. Study `@docs/progress.md` to understand current ticket board and slice.  
0d. Study `@docs/MEMORY.md` to understand durable constraints.  
0e. Search the codebase before assuming anything is missing.

## Workflow (First-Load Contract)

1. Gather coding context and choose the next smallest executable slice.
2. Write mini-PRD context for the selected slice.
3. Map spec implications and affected technical surfaces.
4. Add a high-level change preview (architecture delta + stubbed touchpoints + before/after behavior).
5. Draft ordered implementation plan with dependencies.
6. Add user-story-linked acceptance tests with concrete, observable behavior.
7. Convert plan into strict execution todos including required tests.
8. Add execution assist matrix (skills + conditional subagent delegation).
9. Add one debt/inefficiency insight in touched code surface.
10. Run review criteria and final wow gate.
11. Return yes/no handoff and stop before implementation.

## Core Decision Branches

- **High ambiguity/risk** -> include deeper spec decomposition before implementation steps.
- **Low ambiguity/risk** -> proceed with concise spec mapping and implementation plan.
- **Task too large** -> split into phases and plan only next slice.

## Delegation Guardrails (Mandatory)

- Delegate only when it materially improves quality or speed.
- Do not include specialized QA delegation for docs-only, markdown-only, or rule-text-only work.
- Include `visual-qa` only when UI layout, styling, interaction, or visual behavior is in scope.
- If no delegation is needed, explicitly write `Not needed`.

## Top 3 Gotchas

1. Do not implement; this skill is plan-only.
2. Do not write generic tests; tests must be user-observable and concrete.
3. Do not ship plan without testing todos, change preview, and debt insight.

## Outcome Contract

Each output must include:

1. Mini-PRD context
2. High-Level Change Preview:
   - architecture delta (ASCII or mermaid)
   - stubbed interfaces or pseudocode for critical touchpoints
   - before -> after behavior bullets
3. Technical implementation plan
4. User stories
5. Concrete acceptance tests (step-by-step expected behavior)
6. Execution todo list with required testing tasks
7. Execution Assist Matrix:
   - in-session skills and why
   - delegated subagents (if needed), linked skill, and one-line reason
   - expected artifact from each delegated step
8. Debt/Optimization Insight:
   - one concrete inefficiency in touched surface
   - low-risk improvement recommendation and why now
9. Review/testing criteria + final wow gate
10. Yes/no approval handoff

## Prompt Entry

- [prompts/plan.md](prompts/plan.md)

## References

- [references/template.md](references/template.md)
- [references/examples.md](references/examples.md)
