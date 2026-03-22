/**
 * SESSION BOARD CARDS
 * ===================
 * Builds the canonical card model from tickets and tmux sessions.
 *
 * KEY CONCEPTS:
 * - one ticket card per canonical ticket
 * - orphan sessions stay visible
 * - ambiguous matches become explicit sync states
 *
 * USAGE:
 * - used by discoverBoardState() and proof-mode CLI
 *
 * MEMORY REFERENCES:
 * - MEM-0030
 */

import type { BoardCard, OrphanSessionCard, TicketCard, TicketSummary, TmuxSessionSummary } from "./models.js";

function humanizeSessionLabel(rawLabel: string): string {
  return rawLabel
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function deriveSessionTitle(ticket: TicketSummary, matchingSessions: TmuxSessionSummary[]): string {
  if (matchingSessions.length === 1) {
    const rawName = matchingSessions[0]?.name ?? "";
    const withoutTicketId = rawName.replace(new RegExp(`^${ticket.id}[-_]*`, "i"), "");
    const normalized = humanizeSessionLabel(withoutTicketId);
    return normalized.length > 0 ? normalized : ticket.title;
  }

  if (matchingSessions.length > 1) {
    return `${matchingSessions.length} sessions`;
  }

  return ticket.title;
}

function deriveShortDescription(ticket: TicketSummary, matchingSessions: TmuxSessionSummary[]): string {
  if (ticket.operatorResume.whatHappened) {
    return ticket.operatorResume.whatHappened;
  }

  if (ticket.operatorResume.sessionRecap) {
    return ticket.operatorResume.sessionRecap;
  }

  if (ticket.operatorResume.whatRemains) {
    return ticket.operatorResume.whatRemains;
  }

  if (matchingSessions.length > 1) {
    return "multiple attached tmux sessions require review";
  }

  if (matchingSessions.length === 0) {
    return "no attached tmux session found";
  }

  return "session attached";
}

function buildTicketCard(ticket: TicketSummary, matchingSessions: TmuxSessionSummary[]): TicketCard {
  const syncState =
    matchingSessions.length === 0
      ? "missing-session"
      : matchingSessions.length === 1
        ? "attached"
        : "ambiguous-session";

  return {
    kind: "ticket",
    ticketId: ticket.id,
    title: ticket.title,
    sessionTitle: deriveSessionTitle(ticket, matchingSessions),
    shortDescription: deriveShortDescription(ticket, matchingSessions),
    lane: ticket.lane,
    path: ticket.path,
    sessionName: matchingSessions.length === 1 ? matchingSessions[0]?.name ?? null : null,
    sessionCount: matchingSessions.length,
    syncState,
    currentPhase: ticket.runtimeState.currentPhase,
    lastResult: ticket.runtimeState.lastResult,
    sessionRecap: ticket.operatorResume.sessionRecap,
    whatHappened: ticket.operatorResume.whatHappened,
    whatRemains: ticket.operatorResume.whatRemains
  };
}

function buildOrphanSessionCard(session: TmuxSessionSummary): OrphanSessionCard {
  const normalizedTitle = humanizeSessionLabel(session.name);
  return {
    kind: "orphan-session",
    sessionName: session.name,
    sessionTitle: normalizedTitle.length > 0 ? normalizedTitle : session.name,
    shortDescription: session.attached ? "attached tmux session without ticket" : "unattached tmux session without ticket",
    lane: null,
    path: null,
    syncState: "orphan-session",
    attached: session.attached,
    ticketIds: session.ticketIds
  };
}

export function buildBoardCards(tickets: TicketSummary[], sessions: TmuxSessionSummary[]): BoardCard[] {
  const cards: BoardCard[] = [];
  const matchedSessionNames = new Set<string>();

  for (const ticket of tickets) {
    const matchingSessions = sessions.filter((session) => session.ticketIds.includes(ticket.id));
    for (const session of matchingSessions) {
      matchedSessionNames.add(session.name);
    }

    cards.push(buildTicketCard(ticket, matchingSessions));
  }

  const orphanSessions = sessions.filter((session) => !matchedSessionNames.has(session.name));
  for (const orphanSession of orphanSessions) {
    cards.push(buildOrphanSessionCard(orphanSession));
  }

  return cards.sort((left, right) => {
    const leftKey = left.kind === "ticket" ? `${left.lane}:${left.ticketId}` : `zz:${left.sessionName}`;
    const rightKey = right.kind === "ticket" ? `${right.lane}:${right.ticketId}` : `zz:${right.sessionName}`;
    return leftKey.localeCompare(rightKey);
  });
}
