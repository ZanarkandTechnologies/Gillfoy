Proof phase for the active ticket.

1. Study the active ticket plus the repo validation guidance before running commands.
2. Run the most relevant proof commands for the current ticket slice. Prefer targeted proof first, then broader checks when justified.
3. Update the ticket with what you ran and what passed or failed:
   - `Build Notes`
   - `Execution Proof`
   - `Artifact Links`
   - `QA Reconciliation` when proof materially changes it
4. If proof fails because more in-scope implementation work is required, document it and end with:
   `BRUTE_RESULT: status=continue_build next=build`
5. If proof is sufficient and the work is ready for review, end with:
   `BRUTE_RESULT: status=ready_for_review next=review`
6. If proof reveals a blocker that should stop the loop, document it and end with:
   `BRUTE_RESULT: status=blocked next=none reason=<snake_case_reason>`
