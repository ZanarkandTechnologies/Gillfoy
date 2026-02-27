# Visual QA workflow extensions

Canonical workflow and output contract live in `../SKILL.md`.
Use this file only for variants that are not needed every run.

## Variant: Snapshot-driven bug reproduction

Use this when you already know the failing state and need a compact repro bundle.

```bash
mkdir -p test-results
agent-browser snapshot -i -c --json > test-results/repro.snapshot.json
agent-browser screenshot test-results/repro.png
agent-browser console > test-results/console.txt || true
agent-browser errors > test-results/errors.txt || true
```

Report repro steps plus artifact paths in `docs/research/qa-testing/YYYY-MM-DD_visual-qa.md`.

## Variant: Multi-user flows with sessions

Use separate browser sessions when layout/state depends on two roles or users.

```bash
agent-browser --session A open http://localhost:3000
agent-browser --session B open http://localhost:3000
agent-browser --session A snapshot -i -c --json
agent-browser --session B snapshot -i -c --json
# ...drive both sides...
agent-browser --session A screenshot test-results/sessionA.png
agent-browser --session B screenshot test-results/sessionB.png
agent-browser --session A close
agent-browser --session B close
```

## Variant: Scroll-driven or animation-heavy pages

For long narrative pages, timeline scrubbing, and animation validation:

- Use `cinematic-landing` -> `references/testing.md`
- Reuse the same `Expected UI Spec -> Observed Snapshot Report -> Diff Report -> Fix Plan` format from `../SKILL.md`
