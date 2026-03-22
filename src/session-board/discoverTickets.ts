/**
 * SESSION BOARD TICKETS
 * =====================
 * Reads canonical markdown tickets from the filesystem board.
 *
 * KEY CONCEPTS:
 * - only lane directories are scanned
 * - markdown fields are parsed conservatively
 * - missing fields degrade to empty strings, not guessed values
 *
 * USAGE:
 * - used by discoverBoardState() before tmux matching
 *
 * MEMORY REFERENCES:
 * - MEM-0030
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import type { TicketLane, TicketSummary } from "./models.js";

const TICKET_FILENAME_PATTERN = /^TKT-\d+/i;
const TICKET_LANES: TicketLane[] = ["todo", "review", "building", "done"];

function parseTitle(markdown: string, fallbackName: string): string {
  const match = markdown.match(/^#\s+(TKT-\d+:\s+)?(.+)$/m);
  return match?.[2]?.trim() ?? fallbackName;
}

function extractTicketId(fileName: string, markdown: string): string {
  const fromHeading = markdown.match(/^#\s+(TKT-\d+):/m)?.[1];
  const fromName = fileName.match(/^(TKT-\d+)/i)?.[1];
  return (fromHeading ?? fromName ?? fileName.replace(/\.md$/i, "")).toUpperCase();
}

function extractBulletValue(sectionBody: string, label: string): string {
  const pattern = new RegExp(`^-\\s+${label}:\\s*(.*)$`, "mi");
  return sectionBody.match(pattern)?.[1]?.trim() ?? "";
}

function extractSection(markdown: string, heading: string): string {
  const headingMarker = `## ${heading}`;
  const startIndex = markdown.indexOf(headingMarker);
  if (startIndex < 0) {
    return "";
  }

  const bodyStartIndex = markdown.indexOf("\n", startIndex);
  if (bodyStartIndex < 0) {
    return "";
  }

  const nextHeadingIndex = markdown.indexOf("\n## ", bodyStartIndex + 1);
  const sectionBody =
    nextHeadingIndex < 0
      ? markdown.slice(bodyStartIndex + 1)
      : markdown.slice(bodyStartIndex + 1, nextHeadingIndex);

  return sectionBody.trim();
}

function parseTicket(markdown: string, absolutePath: string, lane: TicketLane): TicketSummary {
  const fileName = path.basename(absolutePath);
  const operatorResume = extractSection(markdown, "Operator Resume");
  const runtimeState = extractSection(markdown, "Runtime State");

  return {
    id: extractTicketId(fileName, markdown),
    title: parseTitle(markdown, fileName.replace(/\.md$/i, "")),
    lane,
    path: absolutePath,
    operatorResume: {
      sessionRecap: extractBulletValue(operatorResume, "Session recap"),
      whatHappened: extractBulletValue(operatorResume, "What happened"),
      whatRemains: extractBulletValue(operatorResume, "What remains")
    },
    runtimeState: {
      currentPhase: extractBulletValue(runtimeState, "current phase"),
      lastResult: extractBulletValue(runtimeState, "last result")
    }
  };
}

async function readLaneTickets(cwd: string, ticketsRoot: string, lane: TicketLane): Promise<TicketSummary[]> {
  const lanePath = path.resolve(cwd, ticketsRoot, lane);
  let entries: string[];
  try {
    entries = await fs.readdir(lanePath);
  } catch {
    return [];
  }

  const ticketFiles = entries
    .filter((entry) => entry.endsWith(".md"))
    .filter((entry) => TICKET_FILENAME_PATTERN.test(entry))
    .sort((left, right) => left.localeCompare(right));

  const tickets = await Promise.all(
    ticketFiles.map(async (ticketFile) => {
      const absolutePath = path.resolve(lanePath, ticketFile);
      const markdown = await fs.readFile(absolutePath, "utf8");
      return parseTicket(markdown, absolutePath, lane);
    })
  );

  return tickets;
}

export async function discoverTickets(cwd: string, ticketsRoot: string): Promise<TicketSummary[]> {
  const discoveredByLane = await Promise.all(
    TICKET_LANES.map((lane) => readLaneTickets(cwd, ticketsRoot, lane))
  );

  return discoveredByLane.flat();
}
