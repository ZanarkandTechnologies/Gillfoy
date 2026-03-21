Review phase for the active ticket.

1. Review against the active ticket, acceptance criteria, recorded proof, and changed code. Focus on bugs, regressions, and missing verification.
2. Write findings into the ticket:
   - `Review Findings`
   - `QA Reconciliation`
   - `Artifact Links` when needed
3. Mark findings as in-scope fixes vs follow-up material where possible.
4. If review passes cleanly, end with:
   `BRUTE_RESULT: status=done next=none`
5. If review finds in-scope issues that should be fixed now, end with:
   `BRUTE_RESULT: status=review_failed next=fix-review findings=<count>`
6. If review finds a real blocker or out-of-scope issue that should stop the loop, document it and end with:
   `BRUTE_RESULT: status=blocked next=none reason=<snake_case_reason>`
