# `AGENTS.md` (Code Contract)

> Repo-wide contract rules. Module-level `AGENTS.md` files can be stricter. More specific rules win.

---

## -1) Definition of Done (Enforced Before Merge)

A task is not complete until all applicable items pass:

* Plan exists for feature/refactor work and follows `skills/tech-impl-plan` output contract.
* Tests are written and passing.
* TypeScript strict passes (no `any`).
* Lint and format checks are clean.
* `docs/HISTORY.md` is updated.
* Durable decisions are promoted to `docs/MEMORY.md`.
* Major logic files include the required header block.
* New invariants are logged and referenced (`MEM-####`).
* Review loop is completed (UI review only when UI changed).
* Changes are pushed to GitHub.

If any required item is missing, the task is incomplete.

---

## 0) Contract Boundary (What Lives Here vs Skills)

This file defines non-negotiable guardrails and quality bars.

Detailed planning format, implementation sequencing, and review runbooks live in skills:

* `skills/tech-impl-plan` for planning output structure.
* `skills/prd` for requirement shaping when needed.
* `skills/spec-to-ticket` for slice-to-ticket conversion when needed.
* `skills/runtime-debugging` for reproducible bugs, flaky failures, regressions, and runtime investigations that need evidence before a fix.
* `skills/visual-qa` only when UI surface changed.
* `skills/code-review` for final quality review.

Do not duplicate skill internals in this file.

---

## 1) Context First (Always)

Before writing or changing code, gather context first:

* Read relevant specs or PRDs.
* Read nearest module `README.md` and `AGENTS.md`.
* Search for existing patterns before introducing new ones.
* Inspect related files that participate in the flow.
* Identify affected interfaces and contracts.
* Bootstrap memory context from `docs/progress.md`, `docs/prd.md`, and relevant `docs/specs/*`.

No blind edits.

---

## 2) High-Level Operating Modes

You will usually be tasked with either planning or execution.

### Planning mode (human-confirmed before execution)

* Start with `prd` when requirements are unclear or not yet sliced.
* Use `spec-to-ticket` to break approved SLC scope into smaller executable tickets when needed.
* Use `tech-impl-plan` to plan one selected ticket/SLC for implementation.
* Planning output should call out which skills are needed and which subagents (if any) are justified.

### Build mode (execute an approved plan)

Flow:

* Build according to the approved plan.
* Use `runtime-debugging` before speculative fixes when the bug is reproducible but the cause is not obvious from reading code.
* Test, then run visual QA workflow only if UI changed.
* Run review workflow before completion.

---

## 3) Philosophy

* **Delete > accumulate.**
* **Modular by default.**
* **Code is source of truth.**
* No speculative abstractions.

---

## 4) Required Module Scaffolding

When creating or modifying a module lacking these, add:

1. `MODULE/AGENTS.md` - boundaries, invariants, tests, conventions.
2. `MODULE/README.md` - usage only:
   * Purpose
   * Public API / entrypoints
   * Minimal example
   * How to test

Internal reasoning belongs in code and memory IDs, not long prose docs.

---

## 5) Observational Memory (Mandatory)

Deterministic. Grep-first. Immutable history.

### Files

* `docs/HISTORY.md` (append-only)
* `docs/MEMORY.md` (curated constraints)

### Types

`discovery | decision | problem | solution | pattern | warning | success | refactor | bugfix | feature`

### Format

`YYYY-MM-DD HH:mm Z | TYPE | MEM-#### | tags | text`

### Log When

* New invariant
* API change
* Data model change
* Behavioral change
* Performance constraint
* Security constraint
* Migration
* Architecture shift

Promote durable constraints to `docs/MEMORY.md`.

Reference IDs in code:

```ts
// MEM-0042 decision: adapters own side-effects; core stays pure
```

---

## 6) MVP-First Execution (Non-Negotiable)

* Smallest possible slice first.
* Prove before scaling.
* Ramp intentionally: 1 -> 10 -> 100.
* No large fetches or migrations pre-MVP.
* Use dry-runs, limits, and checkpoints.
* Log scale-up approval as a `decision`.

---

## 7) Documentation Standard (In-Code)

Major logic files must begin with:

```ts
/**
 * MODULE NAME
 * ===========
 * Purpose
 *
 * KEY CONCEPTS:
 * -
 *
 * USAGE:
 * -
 *
 * MEMORY REFERENCES:
 * - MEM-####
 */
```

---

## 8) Engineering Standards

* TypeScript strict.
* No `any`.
* Explicit return types for exported APIs.
* Side-effects at edges; pure core preferred.
* Tests colocated within modules.
* Modules should stay extractable into packages.

---

## 9) Agent Contract

* Suggest structural improvements when relevant.
* If introducing an invariant:
  1. Log memory
  2. Update nearest `AGENTS.md`
  3. Reference `MEM-####` in code
* For long-running tickets, close with a brief reminder of:
  * what the ticket was about,
  * before state,
  * after state.

---

## 10) Delegation Guardrails

Delegation is conditional, not default. Use one-layer delegation only when it materially improves outcomes.

### Required triggers

* Reproducible runtime bug, flaky failure, regression, performance issue, or root-cause investigation where code reading alone is insufficient -> include `runtime-debugging`. See `MEM-0001`.
* UI layout/interaction/visual behavior changed -> include `visual-qa`.
* Broad cross-module exploration needed -> use `explore`.
* Final implementation quality sweep -> use `code-review`.

### Anti-triggers

* Obvious stack-trace or straightforward error with a clear direct fix -> do not force `runtime-debugging`.
* Docs-only, markdown-only, or rule-text updates -> do not run `visual-qa`.
* Small local edits with clear scope -> do not delegate unnecessarily.

### Delegation note requirement

Any plan that delegates must include:

* delegated agent,
* corresponding skill,
* one-line justification,
* expected output artifact.

If no delegation is needed, state `Not needed`.

---

## 11) Standard Tech Stack Defaults

* Frontend: Next.js (App Router)
* Backend: Convex
* State: Zustand
* AI: Vercel AI SDK
* Core: TypeScript + Node.js

---

## 12) Stop Conditions

Halt and ask for clarification when:

* Scope is unclear or conflicting.
* Interface/API contract is ambiguous.
* Migration is risky and rollback strategy is missing.
* Circular dependency appears in the plan.

No silent architectural drift.
