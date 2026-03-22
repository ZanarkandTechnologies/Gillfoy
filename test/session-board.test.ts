import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import { discoverBoardState } from "../src/session-board/index.js";
import type { BoardCard, TicketCard } from "../src/session-board/models.js";

const fixtureTicketsRoot = "test/fixtures/session-board/tickets";
const fixtureTmuxPath = "test/fixtures/session-board/tmux-sessions.json";

function requireTicketCard(cards: BoardCard[], ticketId: string): TicketCard {
  const card = cards.find((entry) => entry.kind === "ticket" && entry.ticketId === ticketId);
  assert.ok(card);
  if (!card || card.kind !== "ticket") {
    throw new Error(`Expected ticket card for ${ticketId}`);
  }

  return card;
}

test("discoverBoardState builds explicit sync states from fixtures", async () => {
  const boardState = await discoverBoardState({
    cwd: path.resolve("."),
    ticketsRoot: fixtureTicketsRoot,
    tmuxFixturePath: fixtureTmuxPath
  });

  assert.equal(boardState.tmuxSource, "fixture");
  assert.equal(boardState.tickets.length, 3);
  assert.equal(boardState.sessions.length, 4);

  const reviewCard = requireTicketCard(boardState.cards, "TKT-101");
  assert.equal(reviewCard.syncState, "attached");
  assert.equal(reviewCard.sessionName, "TKT-101-review-pass");

  const buildingCard = requireTicketCard(boardState.cards, "TKT-102");
  assert.equal(buildingCard.syncState, "ambiguous-session");
  assert.equal(buildingCard.sessionCount, 2);

  const doneCard = requireTicketCard(boardState.cards, "TKT-103");
  assert.equal(doneCard.syncState, "missing-session");

  const orphanCard = boardState.cards.find(
    (card) => card.kind === "orphan-session" && card.sessionName === "orphan-investigation"
  );
  assert.ok(orphanCard);
});
