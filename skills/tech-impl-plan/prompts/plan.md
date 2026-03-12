# Tech Impl Plan Prompt

Copy and paste this into a new session to start a coding implementation planning pass.

---

0a. Study `@docs/prd.md` to understand audience, outcomes, and constraints.
0b. Study `@docs/specs/*` to learn the application specifications.
0c. Study `@docs/progress.md` to understand the current ticket board and slice.
0d. Study `@docs/MEMORY.md` for durable technical constraints.
0e. Search the codebase before assuming anything is missing.

1. Planning mode only: produce a brief, teachable plan for the next smallest executable slice.
2. Optimize for approval clarity. Use the minimum detail needed for a human to understand and approve.
3. Structure the output as:
   - Plan Snapshot
   - What Changes
   - How It Works
   - Why This Is The Minimal And Most Efficient Change
   - Blast Radius
   - Proof
   - Approval
4. In `What Changes`, explain why this exists, before -> after behavior, and the user-visible outcome in simple language.
5. In `How It Works`, include touched files, the role of each changed or new file, and a data-flow diagram when introducing new files or a new code path.
6. Include one dry run of a realistic scenario so a human can follow the flow step by step.
7. In `Why This Is The Minimal And Most Efficient Change`, do investigative work first, then explicitly state:
   - what existing codepaths or modules were investigated,
   - what will be reused,
   - what will be deleted, avoided, or left alone,
   - why a smaller change would not be sufficient,
   - why each new file or abstraction is necessary.
8. In `Blast Radius`, name affected systems, main risks, and rollback or recovery notes if needed.
9. In `Proof`, give 2-5 concrete scenarios with exact automated or manual checks. Prefer full scenarios over generic test categories.
10. Apply delegation guardrails:
   - docs-only/markdown-only/rule-text changes -> no visual QA delegation,
   - UI behavior/layout/styling changes -> include `visual-qa`,
   - otherwise say `Not needed`.
11. If the task is too large, do not write one large plan. Split it into smaller tickets or phases and plan only the next slice.
12. End with a clear yes/no handoff.

IMPORTANT: Plan only. Do not implement.
