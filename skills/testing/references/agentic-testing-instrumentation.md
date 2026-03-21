## Agentic Testing Instrumentation (Make the app testable)

Agents can’t “understand” a UI the way humans do. When testing is hard, the fix is often to add *testability features*.

## 0) Decide the primary test method first
- Name the source of truth up front: `unit`, `integration`, `e2e`, `visual diff`, `runtime log assertion`, `eval`, or `mixed`.
- If the feature cannot be proved deterministically with the current product surface, the next work item is instrumentation, not "try harder in the browser".

### 1) Always add stable selectors
- Add `data-testid` for any critical interactive element and any assertion target.
- Prefer `getByTestId`, `getByRole`, `getByLabel` in Playwright.

### 1b) Add deterministic navigation paths
- Provide stable deep links for important screens or states.
- Add keyboard shortcuts for opening hard-to-reach panels, drawers, inspectors, and debug surfaces.
- If navigation is long or nested, provide a test-only command palette entry or shortcut to jump directly to the target state.

### 2) Add a debug overlay for complex UIs
For canvas/diagram/video/complex layouts, add a debug overlay in dev/test modes:
- Draw bounding boxes around focus objects
- Render labels/IDs
- Expose the selected object ID as text in the DOM (so the agent can assert it)

If the layout itself is hard to infer, also expose a simple screen manifest:
- ASCII layout or region map stored in docs or rendered in a debug panel
- region IDs and expected labels
- critical CTA names and their expected relative positions

### 3) Add “stepper” controls for animations / timelines
If the UI is animated (video, canvas animation, transitions), create a deterministic test mode:
- Pause/step forward one frame or one logical tick at a time
- Expose current time/frame/tick as DOM text
- Make progression explicit so agents can assert intermediate states
- Persist key animation events to a queryable log if visual timing bugs matter

### 4) Expose internal state in a test-only way
Add a test-only API (guarded by env flag) such as:
- `window.__TEST__ = { getState, setState, seed, reset }`
- Or a `/test/seed` endpoint for fixtures
- Or a hidden debug panel enabled only in `NODE_ENV=test`

Good additions:
- `openPanel(name)`
- `setAnimationTick(n)`
- `getVisibleScreen()`
- `dumpAssertions()`

### 5) Multiplayer: always provide a multi-client harness
Agents must be able to run two (or more) clients simultaneously.
Recommended patterns:
- In Playwright: launch two browser contexts/pages (`pageA`, `pageB`) and drive both.\n
- Add “join room by code” flows that work deterministically.\n
- Expose room ID and player IDs in the DOM.\n
- Provide a fast “bot mode” or scripted input mode for one side if needed.\n

### 6) Observability-as-backpressure
If a behavior is hard to assert visually, assert via instrumentation:
- event logs rendered in DOM for key events\n
- counters/metrics displayed in DOM\n
- serialized state snapshots in DOM\n

Prefer logs that are both human-readable and machine-queryable:
- append-only event feed with timestamps and correlation IDs
- filtered log view for one scenario or actor
- downloadable JSON artifact stored under a known path

### 7) Make evidence comparable, not just collectible
- Define the expected artifacts before build: screenshots, snapshots, traces, logs, DOM dumps.
- Decide who reviews the evidence separately from whoever captured it when judgment is subjective or visual.
- If visual truth matters, produce a canonical screenshot plus a second comparison artifact:
  - image diff against baseline,
  - another agent's structured comparison report,
  - or a DOM/snapshot geometry check when pixels are too unstable.
- For evidence submission flows, make one form or command gather the exact artifacts QA expects instead of relying on ad-hoc file hunting.

### 8) Treat screen identity as first-class data
- Give each important screen/state a stable name.
- Keep a short screen manifest in docs or fixtures: route, shortcuts, expected controls, required artifacts.
- Use ASCII only when it clarifies structure faster than prose. Do not use it as a substitute for selectors or overlays.

### Golden rule
If the agent can’t reliably assert it, add instrumentation until it can.
