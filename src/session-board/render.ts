/**
 * SESSION BOARD RENDER
 * ====================
 * Renders text frames for the terminal UI and snapshot mode.
 *
 * KEY CONCEPTS:
 * - board view groups cards by lane
 * - review view narrows attention to planning/review work
 * - rendering stays pure so tests can snapshot it cheaply
 *
 * USAGE:
 * - used by the interactive TUI loop and once-off render mode
 *
 * MEMORY REFERENCES:
 * - MEM-0030
 */

import type { BoardCard, BoardState, BoardView, LaneFilter, TicketLane } from "./models.js";

export interface RenderState {
  view: BoardView;
  filter: LaneFilter;
  limit: number;
  selectedIndex: number;
  statusMessage: string;
}

const BOARD_LANES: TicketLane[] = ["todo", "review", "building", "done"];
const ACTIVE_LANES: TicketLane[] = ["todo", "review", "building"];

function cardMatchesView(card: BoardCard, view: BoardView): boolean {
  if (view === "board") {
    return true;
  }

  if (card.kind !== "ticket") {
    return false;
  }

  return card.lane === "todo" || card.lane === "review";
}

function cardMatchesFilter(card: BoardCard, filter: LaneFilter): boolean {
  if (filter === "all") {
    return true;
  }

  if (filter === "active") {
    return card.kind === "ticket" ? ACTIVE_LANES.includes(card.lane) : true;
  }

  return card.kind === "ticket" ? card.lane === filter : false;
}

export function getVisibleCards(boardState: BoardState, renderState: RenderState): BoardCard[] {
  return boardState.cards
    .filter((card) => cardMatchesView(card, renderState.view))
    .filter((card) => cardMatchesFilter(card, renderState.filter))
    .slice(0, renderState.limit);
}

function formatTicketCard(card: Extract<BoardCard, { kind: "ticket" }>): string[] {
  return [
    `${card.sessionTitle} | ${card.ticketId} [${card.lane}]`,
    `sync=${card.syncState} session=${card.sessionName ?? "-"} phase=${card.currentPhase || "-"} result=${card.lastResult || "-"}`,
    `${card.shortDescription || "-"}`
  ];
}

function formatOrphanCard(card: Extract<BoardCard, { kind: "orphan-session" }>): string[] {
  return [
    `orphan | ${card.sessionTitle}`,
    `attached=${card.attached} ticketIds=${card.ticketIds.join(",") || "-"}`,
    `${card.shortDescription}`
  ];
}

function renderCard(card: BoardCard, selected: boolean): string[] {
  const prefix = selected ? ">" : " ";
  const body = card.kind === "ticket" ? formatTicketCard(card) : formatOrphanCard(card);
  return body.map((line, index) => `${index === 0 ? prefix : " "} ${line}`);
}

function renderLaneSection(
  lane: TicketLane,
  visibleCards: BoardCard[],
  selectionMap: Map<string, number>,
  selectedIndex: number
): string[] {
  const laneCards = visibleCards.filter((card) => card.kind === "ticket" && card.lane === lane);
  const lines = [`[${lane.toUpperCase()}] count=${laneCards.length}`];

  if (laneCards.length === 0) {
    lines.push("  -");
    return lines;
  }

  for (const card of laneCards) {
    const selectionIndex = selectionMap.get(card.kind === "ticket" ? card.ticketId : card.sessionName) ?? -1;
    lines.push(...renderCard(card, selectionIndex === selectedIndex));
  }

  return lines;
}

function renderOrphans(
  visibleCards: BoardCard[],
  selectionMap: Map<string, number>,
  selectedIndex: number
): string[] {
  const orphanCards = visibleCards.filter((card) => card.kind === "orphan-session");
  const lines = [`[ORPHANS] count=${orphanCards.length}`];
  if (orphanCards.length === 0) {
    lines.push("  -");
    return lines;
  }

  for (const card of orphanCards) {
    const selectionIndex = selectionMap.get(card.sessionName) ?? -1;
    lines.push(...renderCard(card, selectionIndex === selectedIndex));
  }

  return lines;
}

function selectionKey(card: BoardCard): string {
  return card.kind === "ticket" ? card.ticketId : card.sessionName;
}

export function renderBoardFrame(boardState: BoardState, renderState: RenderState): string {
  const visibleCards = getVisibleCards(boardState, renderState);
  const normalizedSelectedIndex = visibleCards.length === 0
    ? 0
    : Math.max(0, Math.min(renderState.selectedIndex, visibleCards.length - 1));
  const selectionMap = new Map<string, number>(
    visibleCards.map((card, index) => [selectionKey(card), index])
  );

  const lines = [
    "Session Board",
    `view=${renderState.view} filter=${renderState.filter} limit=${renderState.limit} visible=${visibleCards.length}/${boardState.cards.length}`,
    `tmux=${boardState.tmuxSource} available=${boardState.tmuxAvailable} generatedAt=${boardState.generatedAt}`,
    "keys: tab switch-view | j/k move | 1 all | 2 active | 3 review | 4 building | 5 todo | 6 done | +/- limit | r refresh | p promote todo | a approve review | q quit",
    `status: ${renderState.statusMessage || "ready"}`,
    ""
  ];

  const laneOrder = renderState.view === "review" ? (["todo", "review"] satisfies TicketLane[]) : BOARD_LANES;
  for (const lane of laneOrder) {
    lines.push(...renderLaneSection(lane, visibleCards, selectionMap, normalizedSelectedIndex));
    lines.push("");
  }

  lines.push(...renderOrphans(visibleCards, selectionMap, normalizedSelectedIndex));
  return lines.join("\n");
}
