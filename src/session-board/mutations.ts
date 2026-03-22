/**
 * SESSION BOARD MUTATIONS
 * =======================
 * Ticket moves, write-back updates, and session labeling helpers.
 *
 * KEY CONCEPTS:
 * - ticket markdown remains canonical
 * - index updates follow file moves
 * - operator actions stay explicit and reversible
 *
 * USAGE:
 * - used by CLI subcommands and interactive TUI key actions
 *
 * MEMORY REFERENCES:
 * - MEM-0030
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";

import { discoverBoardState } from "./index.js";
import type { TicketLane, TicketSummary } from "./models.js";

const INDEX_SECTION_NAMES = ["Todo", "Review", "Building", "Done"] as const;

function replaceBullet(markdown: string, label: string, value: string): string {
  const pattern = new RegExp(`(^-\\s+${label}:)[ \\t]*.*$`, "m");
  return markdown.match(pattern) ? markdown.replace(pattern, `$1 ${value}`) : markdown;
}

function updateOperatorResume(markdown: string, whatHappened: string, whatRemains: string): string {
  let nextMarkdown = replaceBullet(markdown, "What happened", whatHappened);
  nextMarkdown = replaceBullet(nextMarkdown, "What remains", whatRemains);
  return nextMarkdown;
}

function laneHeading(lane: TicketLane): (typeof INDEX_SECTION_NAMES)[number] {
  switch (lane) {
    case "todo":
      return "Todo";
    case "review":
      return "Review";
    case "building":
      return "Building";
    case "done":
      return "Done";
  }
}

function ticketLinkLine(ticketId: string, title: string, absolutePath: string): string {
  return `- [${ticketId}: ${title}](${absolutePath})`;
}

function updateIndexSection(markdown: string, sectionHeading: string, ticketId: string, ticketLine?: string): string {
  const pattern = new RegExp(`(##\\s+${sectionHeading}\\n\\n)([\\s\\S]*?)(?=\\n##\\s+|$)`);
  const match = markdown.match(pattern);
  if (!match) {
    return markdown;
  }

  const prefix = match[1];
  const sectionBody = match[2] ?? "";
  const lines = sectionBody
    .split("\n")
    .filter((line) => line.trim().length > 0);

  const nextLines = lines.filter((line) => !line.startsWith(`- [${ticketId}:`));
  if (ticketLine) {
    nextLines.push(ticketLine);
    nextLines.sort((left, right) => left.localeCompare(right));
  }

  return markdown.replace(pattern, `${prefix}${nextLines.join("\n")}\n`);
}

async function updateIndexForMove(
  cwd: string,
  ticketId: string,
  title: string,
  destinationLane: TicketLane,
  destinationPath: string
): Promise<void> {
  const indexPath = path.resolve(cwd, "tickets/INDEX.md");
  const current = await fs.readFile(indexPath, "utf8");
  const withoutTicketLinks = INDEX_SECTION_NAMES.reduce(
    (accumulator, sectionName) => updateIndexSection(accumulator, sectionName, ticketId),
    current
  );

  const withDestination = updateIndexSection(
    withoutTicketLinks,
    laneHeading(destinationLane),
    ticketId,
    ticketLinkLine(ticketId, title, destinationPath)
  );

  const referencePattern = new RegExp(`/home/kenjipcx/.cursor/tickets/(todo|review|building|done)/${ticketId}[^)]*\\.md`, "g");
  const normalized = withDestination.replace(referencePattern, destinationPath);
  await fs.writeFile(indexPath, normalized, "utf8");
}

async function readTicketById(cwd: string, ticketsRoot: string, ticketId: string): Promise<TicketSummary> {
  const boardState = await discoverBoardState({ cwd, ticketsRoot });
  const ticket = boardState.tickets.find((entry) => entry.id === ticketId);
  if (!ticket) {
    throw new Error(`Ticket not found: ${ticketId}`);
  }

  return ticket;
}

async function moveTicket(
  cwd: string,
  ticketsRoot: string,
  ticketId: string,
  destinationLane: TicketLane,
  lastResult: string,
  whatHappened: string,
  whatRemains: string
): Promise<void> {
  const ticket = await readTicketById(cwd, ticketsRoot, ticketId);
  const fileName = path.basename(ticket.path);
  const destinationPath = path.resolve(cwd, ticketsRoot, destinationLane, fileName);
  let markdown = await fs.readFile(ticket.path, "utf8");

  markdown = replaceBullet(markdown, "state", destinationLane);
  markdown = replaceBullet(markdown, "current phase", destinationLane === "building" ? "build" : destinationLane);
  markdown = replaceBullet(markdown, "last result", lastResult);
  markdown = updateOperatorResume(markdown, whatHappened, whatRemains);

  await fs.writeFile(ticket.path, markdown, "utf8");
  await fs.rename(ticket.path, destinationPath);
  await updateIndexForMove(cwd, ticketId, ticket.title, destinationLane, destinationPath);
}

export async function promoteTicketToReview(cwd: string, ticketsRoot: string, ticketId: string): Promise<void> {
  await moveTicket(
    cwd,
    ticketsRoot,
    ticketId,
    "review",
    "promoted_to_review",
    "promoted from todo to review from the session board.",
    "review the plan and approve or revise it."
  );
}

export async function approveReviewTicket(cwd: string, ticketsRoot: string, ticketId: string): Promise<void> {
  await moveTicket(
    cwd,
    ticketsRoot,
    ticketId,
    "building",
    "approved_from_session_board",
    "approved from review and moved into building from the session board.",
    "continue autonomous build work and write proof back into the ticket."
  );
}

export interface TicketWritebackInput {
  currentPhase?: string | undefined;
  lastResult?: string | undefined;
  sessionRecap?: string | undefined;
  whatHappened?: string | undefined;
  whatRemains?: string | undefined;
}

export async function writeTicketStatus(
  cwd: string,
  ticketsRoot: string,
  ticketId: string,
  writeback: TicketWritebackInput
): Promise<void> {
  const ticket = await readTicketById(cwd, ticketsRoot, ticketId);
  let markdown = await fs.readFile(ticket.path, "utf8");

  if (writeback.currentPhase) {
    markdown = replaceBullet(markdown, "current phase", writeback.currentPhase);
  }
  if (writeback.lastResult) {
    markdown = replaceBullet(markdown, "last result", writeback.lastResult);
  }
  if (writeback.sessionRecap) {
    markdown = replaceBullet(markdown, "Session recap", writeback.sessionRecap);
  }
  if (writeback.whatHappened) {
    markdown = replaceBullet(markdown, "What happened", writeback.whatHappened);
  }
  if (writeback.whatRemains) {
    markdown = replaceBullet(markdown, "What remains", writeback.whatRemains);
  }

  await fs.writeFile(ticket.path, markdown, "utf8");
}

function sanitizeLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function renameTmuxSession(
  sessionName: string,
  ticketId: string,
  label: string,
  dryRun = false
): Promise<string> {
  const nextName = `${ticketId.toUpperCase()}-${sanitizeLabel(label)}`;
  if (dryRun) {
    return nextName;
  }

  await new Promise<void>((resolve, reject) => {
    execFile("tmux", ["rename-session", "-t", sessionName, nextName], (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  return nextName;
}
