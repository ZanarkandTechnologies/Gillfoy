---
name: tech-impl-plan
version: 1.1.0
description: "Concise implementation planning skill. Produces a brief, teachable plan with why/what/how, data flow, blast radius, concrete proof scenarios, efficiency checks against existing code, and a clear yes/no handoff."
allowed-tools: Read, Glob, Grep
---

# Tech Impl Plan Skill

Use this for software implementation planning. Optimize for human approval clarity, not exhaustiveness.

## Core Prompt Wording (Use Literally)

0a. Study `@docs/prd.md` to understand audience, outcomes, and constraints.  
0b. Study `@docs/specs/*` to learn application specifications.  
0c. Study `@docs/progress.md` to understand current ticket board and slice.  
0d. Study `@docs/MEMORY.md` to understand durable constraints.  
0e. Search the codebase before assuming anything is missing.

## Workflow (First-Load Contract)

1. Gather coding context and choose the next smallest executable slice.
2. Explain the change in simple terms: why it exists, what changes, and what the user gets.
3. Show how it works with touched files, file roles, and a data-flow diagram when new files or paths are introduced.
4. Dry-run one realistic scenario through the planned flow so a human can follow it step by step.
5. Call out blast radius, risks, and rollback or recovery notes if needed.
6. Add concrete proof scenarios with observable outcomes and the exact tests or checks that validate them.
7. Investigate the existing codepath and explain why this is the minimal and most efficient change that fits the current system.
8. If the task is too large, stop and split it into smaller tickets or phases instead of producing one large plan.
9. Return a clear yes/no handoff and stop before implementation.

## Core Decision Branches

- **High ambiguity/risk** -> spend more space on teachability, dry run, and risk control; keep implementation detail brief.
- **Low ambiguity/risk** -> keep the plan short and direct.
- **Task too large** -> split into smaller tickets or phases and plan only the next slice.

## Delegation Guardrails (Mandatory)

- Delegate only when it materially improves quality or speed.
- Do not include specialized QA delegation for docs-only, markdown-only, or rule-text-only work.
- Include `visual-qa` only when UI layout, styling, interaction, or visual behavior is in scope.
- If no delegation is needed, explicitly write `Not needed`.

## Top 3 Gotchas

1. Do not implement; this skill is plan-only.
2. Do not write generic tests; tests must be user-observable and concrete.
3. Do not invent new files, abstractions, or systems without proving why existing code cannot carry the change.

## Outcome Contract

Each output must include:

1. Plan Snapshot:
   - change
   - why now
   - confidence
   - size: small / medium / too big, needs split
2. What Changes:
   - before -> after behavior
   - user-visible outcome
3. How It Works:
   - touched files
   - role of each new or changed file
   - data-flow diagram when introducing new files or a new path
   - one dry run in simple language
4. Why This Is The Minimal And Most Efficient Change:
   - existing code investigated
   - what will be reused, avoided, deleted, or left unchanged
   - why a smaller change would not be sufficient
   - justification for each new file or abstraction
5. Blast Radius:
   - affected systems
   - main risks
   - rollback or recovery note when relevant
6. Proof:
   - 2-5 concrete scenarios
   - exact automated or manual checks for each scenario
7. Delegation Note:
   - skills or subagents only if needed
   - `Not needed` if none
8. Approval Handoff:
   - ready or not ready
   - what happens after approval

## Efficiency Rules

- Investigate the relevant existing code before proposing structural changes.
- Prefer reusing and extending existing modules over adding new ones.
- Prefer deleting or simplifying code over layering new abstractions on top.
- Every new file must have a one-line purpose.
- Every new abstraction must explain why the existing shape is insufficient.
- If the plan cannot explain the fit with existing code, it is not ready for approval.

## Prompt Entry

- [prompts/plan.md](prompts/plan.md)

## References

- [references/template.md](references/template.md)
- [references/examples.md](references/examples.md)
