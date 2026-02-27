---
name: init-project
version: 2.1.0
description: "One-time setup workflow for new projects. Scaffold docs-first operating files and provide reusable plan/build prompts."
---

# Init Project Skill

One-time setup for new projects. This skill scaffolds a docs-first workflow and gives copy/paste prompts for planning and building sessions.

## What This Sets Up

- `PROJECT_RULES.md` (project-specific stack + commands + conventions)
- `AGENTS.md` (operational contract loaded every loop)
- `docs/` state (`prd.md`, `specs/`, `progress.md`, `HISTORY.md`, `MEMORY.md`)

## Common Stack Setup

### Convex + Next.js + Clerk (default)

```bash
pnpm create convex@latest . -- -t nextjs-clerk
```

- First `pnpm dlx convex@latest dev` cloud setup is interactive and must be run by a human.

### Plain Next.js

```bash
pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir
```

### Convex in an existing project

```bash
pnpm add convex
pnpm dlx convex@latest dev
```

## Bootstrap Workflow

### Fast path

```bash
bash ~/.cursor/skills/init-project/scripts/bootstrap.sh
```

### Manual steps

1. Copy `references/PROJECT_RULES_TEMPLATE.md` -> `PROJECT_RULES.md`.
2. Copy `references/AGENTS_TEMPLATE.md` -> `AGENTS.md`.
3. Create docs state:
   - `mkdir -p docs/specs`
   - `touch docs/prd.md docs/HISTORY.md docs/MEMORY.md docs/progress.md`
4. Use `prd` skill for requirements and PRD authoring (HITL loop).
5. Use `spec-to-ticket` skill to convert one SLC slice into actionable tickets in `docs/progress.md`.

## Why This Structure

- `PROJECT_RULES.md` centralizes stack details and backpressure commands.
- `AGENTS.md` stays operational and lightweight because it is loaded every loop.
- `docs/` is the canonical project state for planning and execution.
- Agents can find specs, plan, and validation commands without hunting through nested files.

## Planning Philosophy (Inherited Defaults)

The generated planning flow should follow these defaults:

- Context first before edits (specs, rules, related files, interfaces, memory state).
- Plan before build for feature/refactor work, with human confirmation before execution.
- Include a high-level change preview in plans (ASCII/mermaid + critical touchpoint stubs).
- Use conditional delegation only; avoid specialized QA delegation for docs-only/rule-text-only work.
- Add one debt/inefficiency insight for touched surfaces when planning implementation work.
- Keep prototype-first ramping explicit: 1 -> 10 -> 100, with dry-runs and checkpoints.

## Gotchas

- Do not hardcode stack specifics into `AGENTS.md`; put them in `PROJECT_RULES.md`.
- Keep progress notes out of `AGENTS.md`; put them in `docs/progress.md`.
- First Convex cloud setup is interactive; stop and ask the human to run it.

## Prompt Templates (Copy/Paste Ready)

- [prompts/plan.md](prompts/plan.md) - Planning session prompt.
- [prompts/build.md](prompts/build.md) - Build session prompt.

## Templates (Load On Demand)

- [PROJECT_RULES_TEMPLATE.md](references/PROJECT_RULES_TEMPLATE.md) - Project rules template.
- [AGENTS_TEMPLATE.md](references/AGENTS_TEMPLATE.md) - AGENTS template.
