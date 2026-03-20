# System

This repo is a skill system, not just a pile of prompts.

<!--
System overview only.
Keep this file human-readable and broad.
Execution-time agents should rely on AGENTS.md plus the active ticket.
-->

## System Map

```mermaid
flowchart TD
    subgraph BOOT["Bootstrap + Source Docs"]
        A[init-project]
        B[docs/prd.md]
        C[docs/TASTE.md]
        D[AGENTS.md / PROJECT_RULES.md]
        T[tickets/todo review building done]
        IDX[tickets/INDEX.md]
    end

    subgraph PLAN["Planning + Ticket Shaping"]
        E[prd]
        F[docs/prd.md]
        G[spec-to-ticket]
        H[tickets/todo]
        R[tickets/review]
        I[tech-impl-plan]
    end

    subgraph BUILD["Build + Verification Loop"]
        BLD[tickets/building]
        K[code changes + tests]
        L[qa-tester]
        M[visual-qa]
        N[runtime-debugging]
        O[docs/research/qa-testing/*]
        DN[tickets/done]
    end

    subgraph LEARN["History + Feedback"]
        P[docs/HISTORY.md]
        Q[docs/MEMORY.md]
        TR[docs/TROUBLES.md]
        FB[weekly feedback pass]
    end

    A --> B
    A --> C
    A --> D
    A --> T
    A --> IDX

    B --> E
    E --> F
    F --> G
    C --> G
    G --> H

    H --> R
    R --> I
    I --> R
    F --> I
    I --> BLD
    H --> IDX
    R --> IDX
    BLD --> IDX
    DN --> IDX

    BLD --> K
    BLD --> L
    C --> L
    L --> M
    C --> M
    BLD --> M

    K --> L
    K --> N

    L --> O
    M --> O
    O --> BLD
    BLD --> DN

    K --> P
    K --> Q
    K --> TR
    N --> P
    N --> Q
    N --> TR
    O --> P
    O --> Q
    O --> TR
    TR --> FB
    FB --> D
    FB --> E
    FB --> G

    classDef boot fill:#1f2937,stroke:#f59e0b,color:#f9fafb,stroke-width:1.5px;
    classDef plan fill:#0f3d3e,stroke:#2dd4bf,color:#ecfeff,stroke-width:1.5px;
    classDef build fill:#3b1f4a,stroke:#c084fc,color:#faf5ff,stroke-width:1.5px;
    classDef learn fill:#3f2a12,stroke:#fbbf24,color:#fffbeb,stroke-width:1.5px;
    classDef board fill:#111827,stroke:#94a3b8,color:#e5e7eb,stroke-width:1.5px;

    class A,B,C,D boot;
    class E,F,G,I plan;
    class K,L,M,N,O build;
    class P,Q,TR,FB learn;
    class T,IDX,H,R,BLD,DN board;

    style BOOT fill:#111827,stroke:#f59e0b,stroke-width:1px,color:#f9fafb
    style PLAN fill:#0b2f31,stroke:#2dd4bf,stroke-width:1px,color:#ecfeff
    style BUILD fill:#2c1537,stroke:#c084fc,stroke-width:1px,color:#faf5ff
    style LEARN fill:#33240f,stroke:#fbbf24,stroke-width:1px,color:#fffbeb
```

## Core Flow

1. `init-project`
   - bootstrap project docs, rules, shared taste, and filesystem ticket board
   - outputs: `AGENTS.md`, `PROJECT_RULES.md`, `docs/*`, `tickets/*`
2. `prd`
   - clarify requirements and first SLC slice
   - output: `docs/prd.md`
3. `spec-to-ticket`
   - convert one multi-ticket slice into executable raw tickets
   - output: `tickets/todo/*`
4. `tech-impl-plan`
   - refine one selected ticket in `tickets/review/` until it is approval-ready
   - if the ticket is still in `tickets/todo/`, promote it to `tickets/review/` first
   - output: implementation plan written into the ticket, with chat used only as a compact summary + approval ask
5. build
   - implement the approved ticket from `tickets/building/`
   - output: code + tests + ticket updates
6. `qa-tester` + `visual-qa`
   - verify behavior and UI against the ticket contract
   - output: QA artifacts under `docs/research/qa-testing/` plus links back into the ticket
7. memory + history
   - log durable rules and notable changes
   - outputs: `docs/HISTORY.md`, `docs/MEMORY.md`
8. troubles feedback
   - log repeated misses, user corrections, and preventable failures
   - outputs: `docs/TROUBLES.md`, then periodic promotion back into `AGENTS.md` and skills

## Source Of Truth

- Repo contract: [AGENTS.md](/home/kenjipcx/.cursor/AGENTS.md)
- Project taste: [docs/TASTE.md](/home/kenjipcx/.cursor/docs/TASTE.md)
- Requirements: [docs/prd.md](/home/kenjipcx/.cursor/docs/prd.md)
- Specs: `docs/specs/*`
- Ticket board: [tickets/README.md](/home/kenjipcx/.cursor/tickets/README.md)
- Board index: [tickets/INDEX.md](/home/kenjipcx/.cursor/tickets/INDEX.md)
- Active work: `tickets/review/*` and `tickets/building/*`
- Durable rules: [docs/MEMORY.md](/home/kenjipcx/.cursor/docs/MEMORY.md)
- Change log: [docs/HISTORY.md](/home/kenjipcx/.cursor/docs/HISTORY.md)
- Failure log: [docs/TROUBLES.md](/home/kenjipcx/.cursor/docs/TROUBLES.md)

## Skill Roles

- `init-project`: scaffold the operating system
- `prd`: turn fuzzy goals into product truth
- `spec-to-ticket`: turn product truth into ticket truth
- `tech-impl-plan`: plan one commit-sized change
- `runtime-debugging`: handle unclear repro/runtime issues
- `visual-qa`: do ticket-first, taste-aware UI comparison
- `qa-tester`: execute QA and produce evidence
- `code-review`: final quality sweep

## Routing

- unclear feature request -> `prd`
- accepted PRD/spec, need one multi-ticket slice -> `spec-to-ticket`
- small concrete change -> create/select ticket directly, then run `tech-impl-plan`
- product truth is stable but the ticket boundary is still fuzzy -> fill `Scope Decision` in the ticket and stop there
- picked ticket needs planning/approval -> `tech-impl-plan` in `tickets/review/`
- building user-visible UI -> `qa-tester` and `visual-qa`
- repro bug with unclear cause -> `runtime-debugging`
- final quality pass -> `code-review`

## Planning Layers

- `docs/prd.md` is product truth. Use it when the product direction, audience, JTBD, or phase intent is missing or changing.
- `docs/specs/*` is slice truth. Use it when one approved phase needs to be broken into multiple coordinated tickets.
- `tickets/*` is execution truth. Use it for concrete one-loop work and as the default home for implementation plans.
- The system should prefer the smallest sufficient layer. Do not force PRD/spec work for a small concrete ticket.

## Ticket Contract

<!--
Ticket shape is intentionally centralized in tickets/templates/ticket.md.
README should explain the role of the ticket, not duplicate mutable field lists.
-->

Follow the canonical ticket shape in [tickets/templates/ticket.md](/home/kenjipcx/.cursor/tickets/templates/ticket.md).

In practice:

- review tickets should carry the scope decision and implementation plan
- non-UI tickets should carry an `Execution Proof` block for open/prove/inspect/artifact paths
- UI-bearing tickets carry a compact `Agent Contract`
- tickets carry minimal status/control fields for board movement, including `parallelizable after` when relevant
- tickets end with a compact `User Evidence` packet for human review

## Final Handoff

The default closeout packet should be:

- `Session recap`
- `Outcome`
- `Current ticket state`
- `Only if applicable: blocker or spawned follow-up`

The system should not add speculative “next things I could also do” unless they are explicitly requested or required by the ticket state.

Planning, build, and QA should all work from that one ticket file instead of restating ticket structure elsewhere.

## Design Doctrine

Shared UI doctrine lives in [docs/TASTE.md](/home/kenjipcx/.cursor/docs/TASTE.md).

Tickets should reference taste briefly, not restate long style prose.
QA should restate taste before judging screens.

## Boundary

<!--
These boundaries matter because the same concepts appear across docs, skills, and agents.
If this separation drifts, prompts get noisy and agents reload too much context.
-->

- `AGENTS.md` = contract and guardrails
- skills = workflow logic
- agents = execution roles
- `docs/*` = project state and memory
- `docs/TROUBLES.md` = raw failure feedback loop for future system tuning
- `tickets/*` = execution board and ticket source of truth

If those drift apart, the system gets noisy fast.
