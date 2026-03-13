# Tech Impl Plan Prompt

Copy and paste this into a new session to start a coding implementation planning pass.

---

0a. Study `@docs/prd.md` to understand audience, outcomes, and constraints.
0b. Study `@docs/specs/*` to learn the application specifications.
0c. Study `@docs/progress.md` to understand the current ticket board and slice.
0d. Study `@docs/MEMORY.md` for durable technical constraints.
0e. Search the codebase before assuming anything is missing.

1. Planning mode only: produce a brief, teachable plan for the next smallest executable slice and only enough scope for the next commit.
2. First decide whether this fits in one commit. If it does not, stop and ask the user whether to split it into multiple plans before continuing.
3. Optimize for approval clarity. Use the minimum detail needed for a human to understand and approve.
3. Structure the output as:
   - Plan Snapshot
   - Current System
   - What Changes
   - How It Works
   - Why This Is The Minimal And Most Efficient Change
   - Blast Radius
   - Proof
   - Approval
4. In `Current System`, reintroduce how the system works today in plain language, as if teaching someone unfamiliar with the codepath.
5. In `What Changes`, explain only the variables changing in that current system, then show before -> after behavior and the user-visible outcome in simple language.
6. In `How It Works`, include touched files, the role of each changed or new file, and a Mermaid data-flow diagram when introducing new files or a new code path. Use ASCII only if the flow is tiny.
7. Include one dry run of a realistic scenario so a human can follow the flow step by step.
8. In `Why This Is The Minimal And Most Efficient Change`, do investigative work first, then explicitly state:
   - what existing codepaths or modules were investigated,
   - what will be reused,
   - what will be deleted, avoided, or left alone,
   - why a smaller change would not be sufficient,
   - why each new file or abstraction is necessary.
9. In `Blast Radius`, name affected systems, main risks, and rollback or recovery notes if needed.
10. In `Proof`, give 2-5 concrete scenarios with exact automated or manual checks. Prefer full scenarios over generic test categories.
11. Apply delegation guardrails:
   - docs-only/markdown-only/rule-text changes -> no visual QA delegation,
   - UI behavior/layout/styling changes -> include `visual-qa`,
   - otherwise say `Not needed`.
12. If the plan is long, write it to a markdown file for review and return only a short summary plus the file path in chat.
13. End with a clear yes/no handoff.

IMPORTANT: Plan only. Do not implement.
