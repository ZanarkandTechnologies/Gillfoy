---
name: visual-qa
version: 0.1.0
description: "UI verification and visual debugging skill for agents. Enforces Expected UI Spec -> Observed Snapshot Report -> Diff Report -> Fix Plan, with geometry/layout assertions and evidence artifacts under docs/research/qa-testing/."
---

# Visual QA Skill

Use this when:

- You changed UI/UX and need confidence in both appearance and behavior.
- You need fast, repeatable QA with artifacts instead of ad-hoc click checks.
- You are debugging visual regressions, flaky interactions, or state/render mismatches.

## Core principle

Visual truth beats "it compiles." Always produce artifacts and a structured diff report.

## Non-negotiable output contract

For each changed screen, output all four sections:

1. **Expected UI Spec** (before interactions)
2. **Observed Snapshot Report** (what the UI actually shows)
3. **Diff Report + Verdict** (`PASS` or `FAIL`)
4. **Fix Plan** (exact directives at component/class/CSS level)

If any section is missing, QA is incomplete.

## Two-layer system

### 1) Planning phase (lightweight)

Define only:

- **Screen intent**: single job of the screen.
- **Components**: key regions and primary interactive elements.
- **UX goal**: what the user should notice and do first.

Do not do deep visual validation in planning.

### 2) Verification phase (QA enforcement)

Run the full verification loop:

- Generate Expected UI Spec
- Capture evidence (snapshot + screenshot)
- Compare expected vs observed
- Report diffs + verdict + fix directives

## Expected UI Spec (must answer explicitly)

- **Layout map**: Header / Body / Sidebar / Footer and relative positions.
- **Primary CTA**: location, label, size, default state.
- **Visual hierarchy**: first/second/third attention targets.
- **Spacing rhythm**: consistent paddings/margins, no cramped or floaty zones.
- **Typography**: heading/body scale, weights, line-length, truncation behavior.
- **Color and contrast**: readable text/icons, clear enabled vs disabled states.
- **Elevation**: shadow/hover-lift consistency.
- **Alignment**: pixel edge alignment and baseline consistency.
- **Responsiveness**: expected behavior at narrow viewport.

## Mandatory layout assertions

Layout assertions are required in every QA diff report. Most UI bugs are geometry.

Use percentage-based checks (viewport-relative):

- CTA region: expected `x/y` range and width/height range.
- Header/footer bounds: pinned to top/bottom with clear boundaries.
- Main content bounds: no unexpected clipping or overflow.
- Relative order: region A above/below or left/right of region B.

Example assertion format:

```json
{
  "element": "primaryCta",
  "expected_bbox_pct": { "x": [85, 100], "y": [5, 20], "w": [8, 20], "h": [5, 12] },
  "tolerance_pct": 2
}
```

## Verification checklist (snapshot-first, not click-first)

### A) Visual correctness

- Regions exist and are in expected positions.
- No overlap, clipping, broken centering, or unexplained whitespace.
- No broken UI signals: missing icons/fonts, unstyled defaults, wrong component skin.
- State rendering is valid: loading, empty, and error states are purposeful and readable.
- Affordance is honest: clickable items look clickable; static items do not.

### B) Interaction and state

For each interactive element (CTA, tabs, menus, inputs):

- Click/tap works reliably.
- Hover/focus/active states are visible.
- Action gives visible feedback within 300ms (spinner/toast/nav/state change).
- Keyboard tab reachability works and focus is visible.
- Modals/drawers trap focus and close properly (Esc/outside click when intended).

### C) Responsive behavior

- Narrow viewport keeps core task usable.
- No horizontal overflow, hidden CTA, or scroll traps.
- Sticky/fixed elements do not cover required controls.

## Command runbook

Use these commands as the default runbook.

### Minimum visual QA (always)

```bash
mkdir -p test-results
agent-browser snapshot -i -c --json > test-results/before.snapshot.json
agent-browser screenshot test-results/before.png

# Exercise changed UI using snapshot refs (prefer @e1 over CSS selectors)
agent-browser snapshot -i -c --json

agent-browser snapshot -i -c --json > test-results/after.snapshot.json
agent-browser screenshot test-results/after.png
```

### First-response debugging bundle (when behavior is surprising)

```bash
mkdir -p test-results
agent-browser snapshot -i -c --json > test-results/snapshot.json
agent-browser screenshot --full test-results/page-full.png
agent-browser console > test-results/console.txt || true
agent-browser errors > test-results/errors.txt || true
agent-browser network requests > test-results/network.txt || true
```

### Trace capture (timing/flake debugging)

```bash
mkdir -p test-results
agent-browser trace start test-results/trace.zip

# Reproduce issue
agent-browser snapshot -i -c --json

agent-browser trace stop test-results/trace.zip
agent-browser screenshot test-results/after.png
```

## Diff report format (required)

Use this exact structure:

- `Verdict`: `PASS` or `FAIL`
- `Top 3 visual diffs`: what, where, why it matters
- `Top 3 behavior diffs`: trigger, observed behavior, expected behavior
- `Severity`: `blocker | major | minor`
- `Fix directives`: exact implementation changes (component/class/CSS-level)
- `Artifacts`: paths to snapshots/screenshots/logs/traces

Write the report to:

- `docs/research/qa-testing/YYYY-MM-DD_visual-qa.md`

## PR enforcement guidance

- No screenshot + no diff report = QA incomplete.
- If geometry assertions are absent, treat QA as incomplete.
- For risky UI changes, include both baseline and after artifacts.

## Token-efficiency rules

- Prefer one canonical checklist over repeating variants.
- Use compact bullets and concrete diffs, not long narrative.
- Store raw evidence in `test-results/*`; summarize only high-signal findings.
- Escalate to references only for edge cases.

## References

- `agent-browser` -> `references/qa-workflows.md` (advanced refs, sessions, JSON outputs)
- `visual-qa` -> `references/workflows.md` (extended workflow variants)
- `visual-qa` -> `references/debugging.md` (debug escalation recipes)
- For animation-heavy landings: `cinematic-landing` -> `references/testing.md`
