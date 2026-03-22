import test from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import { discoverBoardState } from "../src/session-board/index.js";
import { approveReviewTicket, promoteTicketToReview, writeTicketStatus } from "../src/session-board/mutations.js";
import { renderBoardFrame } from "../src/session-board/render.js";

const indexTemplate = `# Ticket Index

## Todo

- add ticket links here as they are created
- [TKT-030: build session board views](/tmp/TKT-030.md)

## Review

- add ticket links here while planning / approval is active
- [TKT-031: add review actions and ticket write-back](/tmp/TKT-031.md)

## Building

- add ticket links here while execution is active

## Done

- add ticket links here after final confirmation

## Blockers

- list blocked tickets and short cause

## Spawned Follow-Ups

- link parent -> child tickets when scope splits or new work is discovered
`;

function ticketFixture(ticketId: string, title: string, lane: string): string {
  return `# ${ticketId}: ${title}

## Status

- state: ${lane}

## Runtime State

- current phase: ${lane === "review" ? "review" : "build"}
- iterations used: 0
- review loops used: 0
- last prompt:
- last result:

## Operator Resume

- Session recap: ${ticketId} recap
- What happened: ${ticketId} happened
- What remains: ${ticketId} remains
`;
}

async function createWorkflowFixture(): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "session-board-"));
  await fs.mkdir(path.join(root, "tickets", "todo"), { recursive: true });
  await fs.mkdir(path.join(root, "tickets", "review"), { recursive: true });
  await fs.mkdir(path.join(root, "tickets", "building"), { recursive: true });
  await fs.mkdir(path.join(root, "tickets", "done"), { recursive: true });

  await fs.writeFile(path.join(root, "tickets", "INDEX.md"), indexTemplate, "utf8");
  await fs.writeFile(
    path.join(root, "tickets", "todo", "TKT-030-build-session-board-views.md"),
    ticketFixture("TKT-030", "build session board views", "todo"),
    "utf8"
  );
  await fs.writeFile(
    path.join(root, "tickets", "review", "TKT-031-add-review-actions-and-ticket-writeback.md"),
    ticketFixture("TKT-031", "add review actions and ticket write-back", "review"),
    "utf8"
  );

  return root;
}

test("renderBoardFrame shows review-focused snapshot", async () => {
  const boardState = await discoverBoardState({
    cwd: path.resolve("."),
    ticketsRoot: "test/fixtures/session-board/tickets",
    tmuxFixturePath: "test/fixtures/session-board/tmux-sessions.json"
  });

  const frame = renderBoardFrame(boardState, {
    view: "review",
    filter: "all",
    limit: 6,
    selectedIndex: 0,
    statusMessage: "snapshot"
  });

  assert.ok(frame.includes("view=review"));
  assert.ok(frame.includes("[REVIEW] count=1"));
  assert.ok(frame.includes("review pass | TKT-101 [review]"));
  assert.ok(frame.includes("waiting in review"));
});

test("promote and approve actions move ticket files and update index", async () => {
  const root = await createWorkflowFixture();

  try {
    await promoteTicketToReview(root, "tickets", "TKT-030");
    await approveReviewTicket(root, "tickets", "TKT-031");

    const promotedBoard = await discoverBoardState({ cwd: root, ticketsRoot: "tickets" });
    const promotedTicket = promotedBoard.tickets.find((ticket) => ticket.id === "TKT-030");
    const approvedTicket = promotedBoard.tickets.find((ticket) => ticket.id === "TKT-031");

    assert.ok(promotedTicket);
    assert.ok(approvedTicket);
    assert.equal(promotedTicket?.lane, "review");
    assert.equal(approvedTicket?.lane, "building");

    const indexMarkdown = await fs.readFile(path.join(root, "tickets", "INDEX.md"), "utf8");
    assert.ok(indexMarkdown.includes("tickets/review/TKT-030-build-session-board-views.md"));
    assert.ok(indexMarkdown.includes("tickets/building/TKT-031-add-review-actions-and-ticket-writeback.md"));
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test("writeTicketStatus updates operator resume and runtime fields", async () => {
  const root = await createWorkflowFixture();

  try {
    await writeTicketStatus(root, "tickets", "TKT-031", {
      currentPhase: "prove",
      lastResult: "reviewing",
      sessionRecap: "new recap",
      whatHappened: "new happened",
      whatRemains: "new remains"
    });

    const markdown = await fs.readFile(
      path.join(root, "tickets", "review", "TKT-031-add-review-actions-and-ticket-writeback.md"),
      "utf8"
    );

    assert.ok(markdown.includes("- current phase: prove"));
    assert.ok(markdown.includes("- last result: reviewing"));
    assert.ok(markdown.includes("- Session recap: new recap"));
    assert.ok(markdown.includes("- What happened: new happened"));
    assert.ok(markdown.includes("- What remains: new remains"));
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
