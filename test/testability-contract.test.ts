import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";

import { validateTestabilityContract } from "../src/testability-contract.js";

async function withFixtureRepo(
  files: Record<string, string>,
  fn: (cwd: string) => Promise<void>
): Promise<void> {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "testability-contract-"));
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const fullPath = path.join(cwd, relativePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content, "utf8");
    }

    await fn(cwd);
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
}

const VALID_TESTING_MD = `# Autonomous Testing Contract

## System Type

- Product type: workflow repo
- Primary proof surfaces: validator plus ticket review
- Non-deterministic surfaces to control: none

## Main App Open Path

- Install: npm install
- Start: npm run check:testability-contract
- Seed/reset: not needed
- Login/bootstrap: not needed
- Canonical route(s): docs and tickets

## Deterministic Test Method

- Primary method: mixed
- Why this method is the source of truth: validator plus markdown inspection catch weak contracts early
- Required fixtures/accounts/data: repo markdown files
- Required environment flags: none

## Agent Access Contract

- Open: read docs and active tickets
- Stabilize: keep repo state fixed
- Inspect: required sections and labels
- Evidence capture: command output and diff

## Agent Proof Contract

- Assert: validator exits zero only when all required contracts are present
- Artifact destination: terminal output and git diff
- Pass/fail rule: fail on missing or placeholder content

## Required Instrumentation

- Stable selectors: not applicable
- Keyboard shortcuts / deep links: not applicable

## Evidence Review Policy

- Reviewer: visual-qa or human reviewer depending on surface
- Review input: validator output and declared artifacts
- Verdict artifact: qa report markdown
- Write-back target: ticket User Evidence section
`;

const VALID_PRD_MD = `# PRD: Example

## Problem / Context

We need deterministic proof.

## Audience

- Operators

## JTBD

When I ship workflow changes, I want explicit proof rules so QA is not improvised.

## Functional Requirements

- FR-1: Require testability contracts.

## Autonomous Test Strategy

- Main app proof method: mixed
- Why this method is deterministic enough: command checks plus artifact review are stable for this repo
- Open/stabilize/inspect/assert path: open docs, stabilize repo state, inspect sections, assert validator output
- Required instrumentation before feature build: validator script and ticket contract fields
- Evidence artifacts: command output and ticket-linked artifacts
- Evidence review path: separate visual-qa or human review pass over captured evidence
`;

const VALID_TICKET = `# TKT-999: Example

## Status

- state: building
- assignee: codex
- dependencies:
- blockers:
- spawned follow-ups:
- parallelizable after:

## Goal

Example.

## Scope Decision

Narrow contract change.

## Implementation Plan

### Pitch

Done.

### B -> A

Done.

### Delta

Done.

### Core Flow

Done.

### Proof

Done.

### Plan Review

Done.

### Ask

Done.

### Delegation

Not needed

### Ticket Move

Stay in building.

## Acceptance Criteria
- [ ] AC-1: Example

## Test Method

- Primary method: mixed
- Why this proves the feature: validator plus review checks prove the workflow hardening
- Required instrumentation: fixture markdown and artifact paths

## Access Contract

- Open: read the target workflow files
- Stabilize: use fixture markdown
- Inspect: required contract sections
- Evidence capture: command output and diff artifacts

## Proof Contract

- Assertion path: validator output plus targeted tests
- Artifact destination: test output and diff
- Pass rule: all required sections are present and non-placeholder
- Evidence review instance: separate review pass over captured evidence

## Execution Proof

- Open/prove: run the validator
- Seed/reset: not needed
- Inspect/assert: check exit code and messages
- Artifact path: command output

## Evidence Checklist

- [ ] Test output: validator run
- [ ] Contract check output
- [ ] Review artifact linked

## Evidence Review

- Reviewer: visual-qa or human reviewer
- Input artifacts: validator output and ticket artifacts
- Verdict artifact: docs/research/qa-testing/example.md
- Write-back target: User Evidence
`;

test("validateTestabilityContract passes on a repo with complete contracts", async () => {
  await withFixtureRepo(
    {
      "docs/TESTING.md": VALID_TESTING_MD,
      "docs/prd.md": VALID_PRD_MD,
      "tickets/building/TKT-999-example.md": VALID_TICKET
    },
    async (cwd) => {
      const issues = await validateTestabilityContract(cwd);
      assert.deepEqual(issues, []);
    }
  );
});

test("validateTestabilityContract reports missing evidence review and placeholders", async () => {
  await withFixtureRepo(
    {
      "docs/TESTING.md": VALID_TESTING_MD.replace(
        "- Verdict artifact: qa report markdown",
        "- Verdict artifact:"
      ),
      "docs/prd.md": VALID_PRD_MD.replace(
        "- Evidence review path: separate visual-qa or human review pass over captured evidence",
        "- Evidence review path: To be completed in review."
      ),
      "tickets/review/TKT-999-example.md": VALID_TICKET.replace(
        "## Evidence Review",
        "## Review Evidence"
      )
    },
    async (cwd) => {
      const issues = await validateTestabilityContract(cwd);
      assert.ok(
        issues.some((issue) => issue.message.includes("Placeholder or empty field in ## Evidence Review Policy: Verdict artifact"))
      );
      assert.ok(
        issues.some((issue) => issue.message.includes("Placeholder or empty field in ## Autonomous Test Strategy: Evidence review path"))
      );
      assert.ok(issues.some((issue) => issue.message.includes("Missing section: ## Evidence Review")));
    }
  );
});
