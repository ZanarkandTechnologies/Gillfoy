/**
 * TESTABILITY CONTRACT
 * ====================
 * Validates repo-level autonomous testing contracts for active work.
 *
 * KEY CONCEPTS:
 * - only active planning/execution artifacts should gate the workflow
 * - required sections must exist and carry non-placeholder content
 * - access, proof, and evidence review are separate contracts
 *
 * USAGE:
 * - import validation helpers in tests
 * - run via the CLI wrapper for repo checks
 *
 * MEMORY REFERENCES:
 * - MEM-0028
 */

import path from "node:path";
import { promises as fs } from "node:fs";

export interface ValidationIssue {
  filePath: string;
  message: string;
}

interface SectionRequirement {
  heading: string;
  labels?: string[];
}

const ACTIVE_TICKET_LANES = ["todo", "review", "building"] as const;

const TESTING_REQUIREMENTS: SectionRequirement[] = [
  { heading: "System Type" },
  {
    heading: "Main App Open Path",
    labels: ["Install", "Start", "Seed/reset", "Login/bootstrap", "Canonical route(s)"]
  },
  {
    heading: "Deterministic Test Method",
    labels: [
      "Primary method",
      "Why this method is the source of truth",
      "Required fixtures/accounts/data",
      "Required environment flags"
    ]
  },
  {
    heading: "Agent Access Contract",
    labels: ["Open", "Stabilize", "Inspect", "Evidence capture"]
  },
  {
    heading: "Agent Proof Contract",
    labels: ["Assert", "Artifact destination", "Pass/fail rule"]
  },
  { heading: "Required Instrumentation" },
  {
    heading: "Evidence Review Policy",
    labels: ["Reviewer", "Review input", "Verdict artifact", "Write-back target"]
  }
];

const PRD_REQUIREMENTS: SectionRequirement[] = [
  { heading: "Problem / Context" },
  { heading: "Audience" },
  { heading: "JTBD" },
  { heading: "Functional Requirements" },
  {
    heading: "Autonomous Test Strategy",
    labels: [
      "Main app proof method",
      "Why this method is deterministic enough",
      "Open/stabilize/inspect/assert path",
      "Required instrumentation before feature build",
      "Evidence artifacts",
      "Evidence review path"
    ]
  }
];

const ACTIVE_TICKET_REQUIREMENTS: SectionRequirement[] = [
  {
    heading: "Test Method",
    labels: ["Primary method", "Why this proves the feature", "Required instrumentation"]
  },
  {
    heading: "Access Contract",
    labels: ["Open", "Stabilize", "Inspect", "Evidence capture"]
  },
  {
    heading: "Proof Contract",
    labels: ["Assertion path", "Artifact destination", "Pass rule", "Evidence review instance"]
  },
  {
    heading: "Evidence Review",
    labels: ["Reviewer", "Input artifacts", "Verdict artifact", "Write-back target"]
  }
];

const PLACEHOLDER_PATTERNS = [
  /^to be completed.*$/i,
  /^tbd$/i,
  /^todo$/i,
  /^reserved$/i,
  /^delegated agent\/skill.*$/i,
  /^expected artifact.*$/i,
  /^write-back target:?\s*$/i,
  /^\[.*\]$/,
  /^<.*>$/
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeValue(rawValue: string): string {
  return rawValue.trim().replace(/`/g, "");
}

function isPlaceholderValue(rawValue: string): boolean {
  const value = normalizeValue(rawValue);
  if (value.length === 0) {
    return true;
  }

  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));
}

function getSection(markdown: string, heading: string): string | null {
  const escaped = escapeRegExp(heading);
  const regex = new RegExp(`^## ${escaped}\\s*$`, "m");
  const match = regex.exec(markdown);
  if (!match || match.index === undefined) {
    return null;
  }

  const sectionStart = match.index + match[0].length;
  const rest = markdown.slice(sectionStart);
  const nextHeadingMatch = /^##\s/m.exec(rest);
  const sectionBody = nextHeadingMatch ? rest.slice(0, nextHeadingMatch.index) : rest;
  return sectionBody.trim();
}

function getLabelValue(sectionContent: string, label: string): string | null {
  const escaped = escapeRegExp(label);
  const regex = new RegExp(`^- ${escaped}:[ \\t]*(.*)$`, "m");
  const match = sectionContent.match(regex);
  return match?.[1] ?? null;
}

function validateRequirements(
  filePath: string,
  markdown: string,
  requirements: SectionRequirement[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const requirement of requirements) {
    const sectionContent = getSection(markdown, requirement.heading);
    if (!sectionContent) {
      issues.push({
        filePath,
        message: `Missing section: ## ${requirement.heading}`
      });
      continue;
    }

    if (!requirement.labels) {
      if (sectionContent.trim().length === 0) {
        issues.push({
          filePath,
          message: `Section has placeholder-only content: ## ${requirement.heading}`
        });
      }
      continue;
    }

    for (const label of requirement.labels) {
      const value = getLabelValue(sectionContent, label);
      if (value === null) {
        issues.push({
          filePath,
          message: `Missing field in ## ${requirement.heading}: ${label}`
        });
        continue;
      }

      if (isPlaceholderValue(value)) {
        issues.push({
          filePath,
          message: `Placeholder or empty field in ## ${requirement.heading}: ${label}`
        });
      }
    }
  }

  return issues;
}

async function readUtf8(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

async function discoverActiveTickets(cwd: string): Promise<string[]> {
  const results: string[] = [];

  for (const lane of ACTIVE_TICKET_LANES) {
    const laneDir = path.join(cwd, "tickets", lane);
    let entries: string[];
    try {
      entries = await fs.readdir(laneDir);
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!/^TKT-\d+.*\.md$/.test(entry)) {
        continue;
      }

      results.push(path.join(laneDir, entry));
    }
  }

  return results.sort();
}

export async function validateTestabilityContract(cwd: string = process.cwd()): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  const testingPath = path.join(cwd, "docs", "TESTING.md");
  const prdPath = path.join(cwd, "docs", "prd.md");

  const testingMarkdown = await readUtf8(testingPath);
  issues.push(...validateRequirements(testingPath, testingMarkdown, TESTING_REQUIREMENTS));

  const prdMarkdown = await readUtf8(prdPath);
  issues.push(...validateRequirements(prdPath, prdMarkdown, PRD_REQUIREMENTS));

  const ticketPaths = await discoverActiveTickets(cwd);
  for (const ticketPath of ticketPaths) {
    const markdown = await readUtf8(ticketPath);
    issues.push(...validateRequirements(ticketPath, markdown, ACTIVE_TICKET_REQUIREMENTS));
  }

  return issues;
}
