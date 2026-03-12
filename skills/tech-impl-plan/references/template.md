# Tech Implementation Plan Template

## Plan Snapshot

- **Change:**
- **Why now:**
- **Confidence:**
- **Size:** `small` / `medium` / `too big, needs split`

## What Changes

- **Before:**
- **After:**
- **User-visible outcome:**

## How It Works

- **Touched files:**
- **New or changed file roles:**
  - `path/to/file.ts`: one-line role
  - `path/to/other.ts`: one-line role
- **Data flow:** include when introducing new files or a new path

```text
User action
  -> file A (receives input)
  -> file B (transforms / decides)
  -> file C (persists / renders)
  -> visible result
```

- **Dry run:**
  1. User does X
  2. File/module Y receives it
  3. Decision or transformation Z happens
  4. Result is rendered, returned, or stored

## Why This Is The Minimal And Most Efficient Change

- **Investigated existing code:**
- **Reuse:** what existing code will be extended or reused
- **Do not add:** what code, abstraction, or file should be avoided
- **Delete or simplify:** any code that should be removed or flattened
- **Why not smaller:** why a smaller change would fail or be incomplete
- **Justification for new files or abstractions:**

## Blast Radius

- **Affected systems:**
- **Main risks:**
- **Rollback or recovery note:**

## Proof

- **Scenario 1**
  - Steps:
  - Expected result:
  - How we test it:
- **Scenario 2**
  - Steps:
  - Expected result:
  - How we test it:

Example style:

- I create a new project and immediately see the simpler approval-friendly plan format.
- I review a plan that adds a new file and can see exactly what that file does in the data-flow section.
- I review a plan for a large change and the planner splits it into smaller tickets instead of dumping one giant plan.

## Delegation Note

- **Skills or subagents:** `Not needed` unless justified
- **Why:**
- **Expected artifact:**

## Approval

- **Ready to implement:** yes / no
- **Next step after approval:**
- **If not ready, split into:**
