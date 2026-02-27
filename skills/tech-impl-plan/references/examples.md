# Tech Impl Plan Examples

## Positive Example

> User story: As a returning user, I want to log in and immediately see my weekly panel so I can continue planning.
>
> Plan includes:
>
> - high-level architecture preview with an ASCII flow delta,
> - stubbed touchpoint changes for login/session dashboard wiring,
> - touched files and dependency order,
> - explicit UI behavior assertions,
> - acceptance tests:
>   - When I log in, I should see a big apple on the dashboard.
>   - When I click Enter, a panel opens asking for information about my week.
> - required testing todos before approval,
> - execution assist matrix with:
>   - in-session skills listed,
>   - `visual-qa` delegation justified because UI changed,
>   - expected artifact path for expected spec report,
> - one debt insight on duplicated dashboard state logic.
>
> Ends with: "I already prepared this plan with tests. If you say yes, I execute."

## Docs-Only Example (No Visual QA)

> Task: Update markdown docs and rule wording only.
>
> Plan includes:
>
> - high-level preview (document structure before/after),
> - touched files and validation checks,
> - execution assist matrix stating:
>   - in-session skills only,
>   - `visual-qa: Not needed` because no UI surface changed.

## Negative Example

> We should improve the login flow and dashboard experience. We can test it later.

Why bad:

- no high-level change preview,
- no user stories,
- no observable behavior assertions,
- no required testing todos,
- no execution assist matrix or delegation guardrail check,
- no yes/no execution-ready handoff.
