# Tech Implementation Plan Template

## Mini-PRD Context

- **Goal:**
- **User Outcome:**
- **Constraints:**
- **Risks:**
- **Success Criteria:**

## High-Level Change Preview

- **Architecture Delta (ASCII or Mermaid):**

```text
[Current]
  A -> B
[Planned]
  A -> C -> B
```

- **Stubbed Touchpoints (interfaces/pseudocode):**

```ts
// Example only; adapt to touched surfaces
export function performAction(input: Input): Output {
  // step 1
  // step 2
}
```

- **Before -> After Behavior:**

  - Before:
  - After:

## User Stories

- As a [user], I want [action], so that [benefit].
- As a [user], I want [action], so that [benefit].

## Technical Implementation Plan

- **Scope (this slice only):**
- **Touched Files/Interfaces/Systems:**
- **Dependency Order:**
  1. Step 1
  2. Step 2
  3. Step 3
- **Validation Strategy:**
- **Rollback/Safety Notes:**

## Acceptance Tests (Concrete, User-Observable)

- **Test Case 1**
  - Given:
  - When:
  - Then:
  - Observable assertion:
- **Test Case 2**
  - Given:
  - When:
  - Then:
  - Observable assertion:

Example style:

- When I log in, I should see a big apple.
- When I click Enter, it opens a panel asking for information about my week.

## Execution Todo List (Mandatory)

- [ ] Implement Step 1
- [ ] Implement Step 2
- [ ] Implement Step 3
- [ ] Run required tests for Test Case 1
- [ ] Run required tests for Test Case 2
- [ ] Verify observable assertions manually or via automation

## Execution Assist Matrix

- **In-Session Skills**
  - `skill-name`: why needed for this slice
- **Delegated Subagents**
  - `subagent-name` + linked skill: one-line justification
  - Expected artifact:
- **Delegation Guardrail Check**
  - Docs/markdown/rule-text only? If yes -> `visual-qa: Not needed`
  - UI layout/styling/interaction changed? If yes -> `visual-qa` artifact path:

## Debt/Optimization Insight

- **Observed inefficiency in touched surface:**
- **Low-risk improvement recommendation:**
- **Why now:**

## Review/Test Criteria

- **Correctness:** does this solve the right problem?
- **Completeness:** are dependencies and edge cases covered?
- **Usability:** do users get clear expected behavior?
- **Observability:** are outcomes directly measurable/visible?
- **Risk Control:** can we safely roll back or recover?

## Final Wow Gate

- [ ] Will this make the user happy given their user story?
- [ ] What would make it better?
- [ ] Can I implement that improvement now to wow them?

## Approval Handoff

Say exactly what is prepared and ask for yes/no approval to execute.
