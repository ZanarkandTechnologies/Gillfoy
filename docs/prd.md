# PRD: tmux session board TUI

## Problem / Context

The existing filesystem ticket board is a good source of truth for work state, but it is weak as an operator surface when multiple Codex sessions are active at once. A solo operator can lose track of which tmux session maps to which ticket, what each session is currently doing, which sessions need review attention, and what result was last written back to the ticket. The pain is not worktree isolation. The pain is low-visibility multi-session coordination inside a local directory workflow.

This repo already encodes a ticket lifecycle of `todo -> review -> building -> done`, with markdown tickets as the canonical artifact and `brute` as the automated build runner. The missing product surface is a fast local TUI that makes those states, sessions, and review actions visible and operable without bouncing between shell tabs, tmux panes, ticket files, and chat context.

## Audience

- Primary: solo coders running multiple local Codex/tmux sessions against the same repo workflow.
- Secondary: small teams that may adopt the same local ticket-first pattern later, but team support is not part of the first slice.

## JTBD

When I have multiple Codex sessions running in tmux against local tickets, I want to see a kanban-style board and a review-focused session view in one place, so I can tell what each session is doing, unblock planning quickly, and let approved build work continue autonomously.

## SLC Slice (Next Release)

Ship a filesystem-first tmux TUI that:

- renders the existing ticket board as the canonical kanban source
- treats one card as one Codex run attached to one ticket
- lets the operator name the tmux session and see that name on the board
- shows a dedicated review-focused session tab filtered to sessions that need human review attention
- supports configurable filtering/sorting and a visible cap on simultaneously surfaced sessions, defaulting to 6
- writes session status and end-of-turn summary back into the ticket so the ticket remains the durable resume surface
- automatically promotes newly created `todo` tickets into planning/review instead of leaving them stranded in backlog for the active flow

The first slice does not replace the markdown board, does not introduce a database, and does not try to solve generic team orchestration.

## Goals

- Make the current active workload legible at a glance from inside tmux.
- Reduce the operator cost of remembering which session maps to which ticket.
- Make `review` the main human attention queue and keep `build` work as automated as possible after approval.
- Keep markdown tickets as the canonical source of truth, with the TUI acting as an operator surface over the filesystem.
- Ensure each session leaves a durable “what it is doing / what happened last” write-back in the ticket.

## Non-Goals

- Multi-user collaboration, locking, or shared remote state.
- Replacing `tickets/` markdown files with a database or service.
- Replacing `brute` with a different autonomous runner in v1.
- Full worktree orchestration or repo isolation per session.
- Solving every board action in v1; review visibility and session identity are higher priority than broad ticket editing.
- Automatic plan acceptance for all ticket types without an explicit policy model.

## User Stories

### US-001: See the active board and attached sessions
**Description:** As a solo operator, I want a TUI board that shows tickets and their attached tmux/Codex sessions so I can immediately tell what is active and where my attention is needed.

**Acceptance Criteria:**
- [ ] The TUI renders the existing filesystem lanes `review`, `building`, and `done`, with optional `todo` visibility but not as the main active-work focus.
- [ ] Each visible card shows ticket id, short title, lane/status, attached tmux session name, and last known session summary/result.
- [ ] The TUI can filter cards by status and sort or cap visible sessions, with a default operator-friendly maximum of 6 surfaced sessions.
- [ ] If a session has no attached ticket or the ticket metadata is stale/missing, the TUI marks it clearly instead of silently guessing.
- [ ] Typecheck passes.

### US-002: Work the review queue first
**Description:** As a solo operator, I want a review-specific view of sessions that need my approval or unblock action so I can process planning quickly and keep builds flowing.

**Acceptance Criteria:**
- [ ] The TUI has a review-focused tab or mode that shows only sessions/tickets currently needing human review attention.
- [ ] Newly created tickets intended for active planning move automatically from `todo` into `review`.
- [ ] A planned ticket can be approved from the TUI and then handed off into automated build flow using the existing ticket-first runner contract.
- [ ] Sessions not requiring review do not clutter the review-focused view.
- [ ] Error states such as missing plan content or ambiguous ticket state are surfaced as review blockers.
- [ ] Typecheck passes.

### US-003: Resume context from the ticket, not memory
**Description:** As a solo operator, I want each session to write back a compact durable summary so I can return later and know what it was doing without rereading the whole chat.

**Acceptance Criteria:**
- [ ] At the end of a session turn, the system writes a compact status/result back into the ticket.
- [ ] The write-back updates `Operator Resume` and a compact “last result / current status” field or equivalent ticket-owned section.
- [ ] The TUI reads those ticket fields as the canonical resume surface.
- [ ] If write-back fails, the operator can see that the session is out of sync and which ticket/session pair needs correction.
- [ ] Typecheck passes.

## Functional Requirements

- FR-1: The TUI must use the existing `tickets/` filesystem board as the canonical workflow source.
- FR-2: The TUI must map one board card to one Codex run attached to one ticket, even if tmux naming differs.
- FR-3: The TUI must support naming tmux sessions and showing those names alongside ticket metadata.
- FR-4: The TUI must expose a kanban board view of active work with status filtering and configurable sort/cap behavior.
- FR-5: The TUI must expose a dedicated review-attention view that surfaces only review-relevant sessions/tickets.
- FR-6: The system must treat `review` as the main human intervention lane and keep `building` aligned with the automated `brute` flow.
- FR-7: The system must automatically promote active newly created tickets from `todo` to `review` when they enter planning flow.
- FR-8: The system must read/write durable session summaries from ticket markdown rather than inventing a separate canonical runtime store.
- FR-9: The system must make session/ticket desynchronization visible as an operator-facing problem.
- FR-10: The first release may use simple local metadata conventions for tmux session labeling, but those conventions must remain subordinate to ticket markdown.
- FR-11: Approval policy design must be informed by the current `brute` contract, which automates execution after approval rather than auto-approving planning by default.
- FR-12: If plan auto-acceptance is added, it must be policy-based and tiered rather than implicit blanket approval.

## Autonomous Test Strategy

- Main app proof method: mixed
- Why this method is deterministic enough: the session-board product needs both fixture-driven runtime assertions and separate evidence review for UI/operator surfaces, so deterministic data-mode checks and evidence judgments together are the correct proof source
- Open/stabilize/inspect/assert path: open the board in fixture or proof mode, stabilize tickets/tmux inputs with fixtures or documented local setup, inspect card lanes/session mappings/review-only subsets/write-back state, and assert via command output plus captured UI evidence
- Required instrumentation before feature build: stable fixture/debug launch paths, predictable ticket/session fixtures, explicit access shortcuts for operator views, and reviewable artifacts for session board states
- Evidence artifacts: proof-mode JSON or CLI output, terminal snapshots/screenshots for board states, markdown diffs for ticket write-back, and review reports
- Evidence review path: evidence capture happens in the implementation/QA run, then a separate review instance such as `visual-qa` or human review judges the artifacts and writes the verdict back into the ticket

## Constraints

- Security/privacy: local-first; no remote service required for v1; avoid leaking repo or ticket data outside the local machine.
- Performance: should remain usable with multiple active sessions; the review view and board refresh should feel immediate for a small solo workload.
- Platform: tmux-first terminal workflow on a local machine; filesystem board remains canonical.
- Budget/time: first slice should stay narrow and prove the operator workflow before any broader orchestration features.
- Workflow: must not conflict with existing `tickets/`, `review`, `building`, `done`, `Operator Resume`, and `brute` contracts.

## Risks / Unknowns

- The exact ticket write-back shape for “last result / current status” may need a small ticket template update if current fields are insufficient.
- The mapping between tmux session identity and ticket identity may drift unless session attach/rename rules are explicit.
- Automatically moving `todo` to `review` could create noise if backlog tickets and active planning tickets are not clearly distinguished.
- A review-only surface may still be insufficient if the operator also needs lightweight visibility into blocked or stale build sessions.
- Plan auto-acceptance policy is still unresolved; current repo rules assume human approval in `review`, so any automation here must be intentionally constrained.

## Backpressure / Evidence to Ship

- Tests: integration-oriented proof for filesystem scan, session-to-ticket mapping, filters, and ticket write-back behavior.
- QA: terminal/manual validation that the TUI correctly shows board state, review-only sessions, configurable limits, and end-of-turn ticket summaries.
- Perf checks: basic responsiveness with several active sessions and at least the default 6-session visible cap.
