/**
 * SESSION BOARD TMUX
 * ==================
 * Collects tmux session metadata from live tmux or fixtures.
 *
 * KEY CONCEPTS:
 * - fixtures make proof mode deterministic
 * - missing tmux server is a valid non-crashing state
 * - ticket ids are extracted explicitly from session names
 *
 * USAGE:
 * - used by discoverBoardState() after ticket discovery
 *
 * MEMORY REFERENCES:
 * - MEM-0030
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type { TmuxSessionSummary } from "./models.js";

const execFileAsync = promisify(execFile);
const TICKET_ID_PATTERN = /TKT-\d+/gi;

interface FixtureShape {
  sessions: Array<{
    name: string;
    attached: boolean;
    windows: number;
  }>;
}

function extractTicketIds(sessionName: string): string[] {
  const matches = sessionName.match(TICKET_ID_PATTERN) ?? [];
  return Array.from(new Set(matches.map((match) => match.toUpperCase()))).sort();
}

function normalizeSession(name: string, attached: boolean, windows: number, source: "tmux" | "fixture"): TmuxSessionSummary {
  return {
    name,
    attached,
    windows,
    ticketIds: extractTicketIds(name),
    source
  };
}

async function discoverFromFixture(cwd: string, fixturePath: string): Promise<TmuxSessionSummary[]> {
  const absolutePath = path.resolve(cwd, fixturePath);
  const raw = await fs.readFile(absolutePath, "utf8");
  const parsed = JSON.parse(raw) as FixtureShape;

  return parsed.sessions.map((session) =>
    normalizeSession(session.name, session.attached, session.windows, "fixture")
  );
}

async function discoverFromTmux(): Promise<TmuxSessionSummary[]> {
  const { stdout } = await execFileAsync("tmux", [
    "list-sessions",
    "-F",
    "#{session_name}\t#{session_attached}\t#{session_windows}"
  ]);

  return stdout
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0)
    .map((line: string) => {
      const [name, attachedRaw, windowsRaw] = line.split("\t");
      const windows = Number.parseInt(windowsRaw ?? "0", 10);
      return normalizeSession(name ?? "", attachedRaw === "1", Number.isNaN(windows) ? 0 : windows, "tmux");
    });
}

export async function discoverTmuxSessions(
  cwd: string,
  tmuxFixturePath?: string
): Promise<{ sessions: TmuxSessionSummary[]; tmuxAvailable: boolean; tmuxSource: "tmux" | "fixture" }> {
  if (tmuxFixturePath) {
    return {
      sessions: await discoverFromFixture(cwd, tmuxFixturePath),
      tmuxAvailable: true,
      tmuxSource: "fixture"
    };
  }

  try {
    return {
      sessions: await discoverFromTmux(),
      tmuxAvailable: true,
      tmuxSource: "tmux"
    };
  } catch {
    return {
      sessions: [],
      tmuxAvailable: false,
      tmuxSource: "tmux"
    };
  }
}
