Fix-review phase for the active ticket.

1. Study the ticket's `Review Findings` section first.
2. Fix only in-scope review findings for this ticket. Do not silently widen scope.
3. Update the ticket after fixes:
   - `Build Notes`
   - `Execution Proof`
   - `Review Findings`
   - `Artifact Links`
4. When fixes are ready for another review pass, end with:
   `BRUTE_RESULT: status=ready_for_review next=review`
5. If you hit a blocker or the findings require a follow-up ticket instead of more local fixes, document it and end with:
   `BRUTE_RESULT: status=blocked next=none reason=<snake_case_reason>`
