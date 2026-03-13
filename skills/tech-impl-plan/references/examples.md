# Tech Impl Plan Examples

## Positive Example

> Change: Simplify the planning skill output so humans can approve plans faster.
>
> Plan includes:
>
> - short snapshot of the change and why it exists,
> - simple reintroduction of how the current system works today,
> - only the variables changing from that current system,
> - before -> after behavior in plain English,
> - touched files and one-line role for each,
> - Mermaid data-flow diagram because a new plan path is being introduced,
> - one realistic dry run that teaches the human how the plan will behave,
> - investigative section naming what existing skill structure was checked and why this is the smallest change that still solves the problem,
> - concrete proof scenarios such as:
>   - when a plan adds a new file, I can see what that file does in the data flow,
>   - when a plan is too large, it gets split into smaller tickets instead of one giant plan,
> - simple approval handoff with yes / no readiness,
> - markdown file output if the plan is too long for comfortable chat review.
>
> Ends with: "Ready to implement: yes. If you approve, next step is to edit the skill files."

## Docs-Only Example (No Visual QA)

> Task: Update markdown docs and rule wording only.
>
> Plan includes:
>
> - before -> after wording summary,
> - touched files and file roles,
> - proof scenarios based on readable output examples,
> - `Delegation Note: Not needed` because no UI surface changed.

## Negative Example

> We should improve the skill and make the plans better. We can figure out the details during implementation.

Why bad:

- no clear why/what/how,
- no simple explanation of the current system,
- no data flow or dry run,
- no investigation of existing code or explanation of why this is the minimal change,
- no concrete proof scenarios,
- no split decision or ask-first behavior for oversized work,
- no yes/no execution-ready handoff.
