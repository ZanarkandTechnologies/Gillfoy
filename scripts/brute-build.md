Build phase for the active ticket.

1. Study the active ticket, nearby repo contract files, and the affected code before editing.
2. Implement approved in-scope ticket work only. Do not stop at optional “next things I could do” language if more in-scope build work is still obviously required.
3. Update the ticket while you work:
   - `Build Notes`
   - `Execution Proof`
   - `Artifact Links`
   - `Operator Resume`
   - `Runtime State` if the phase meaningfully changes
4. If more in-scope implementation work remains for a fresh loop, end with:
   `BRUTE_RESULT: status=continue_build next=build`
5. If implementation is ready for proof, end with:
   `BRUTE_RESULT: status=ready_for_prove next=prove`
6. If you hit a real blocker, document it in the ticket and end with:
   `BRUTE_RESULT: status=blocked next=none reason=<snake_case_reason>`
7. If the blocker is scope ambiguity rather than execution failure, write that distinction explicitly in the ticket instead of disguising it as a build failure.
