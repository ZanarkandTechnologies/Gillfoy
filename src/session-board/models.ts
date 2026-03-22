/**
 * SESSION BOARD MODELS
 * ====================
 * Shared types for ticket discovery, tmux discovery, and derived board cards.
 *
 * KEY CONCEPTS:
 * - tickets stay canonical
 * - tmux attachment is explicit via ticket ids
 * - sync problems are first-class states, not hidden fallbacks
 *
 * USAGE:
 * - imported by discovery adapters and CLI proof mode
 *
 * MEMORY REFERENCES:
 * - MEM-0030
 */

export type TicketLane = "todo" | "review" | "building" | "done";
export type BoardView = "board" | "review";
export type LaneFilter = "all" | "active" | TicketLane;

export interface TicketSummary {
  id: string;
  title: string;
  lane: TicketLane;
  path: string;
  operatorResume: {
    sessionRecap: string;
    whatHappened: string;
    whatRemains: string;
  };
  runtimeState: {
    currentPhase: string;
    lastResult: string;
  };
}

export interface TmuxSessionSummary {
  name: string;
  attached: boolean;
  windows: number;
  ticketIds: string[];
  source: "tmux" | "fixture";
}

export type TicketSyncState = "attached" | "missing-session" | "ambiguous-session";

export interface TicketCard {
  kind: "ticket";
  ticketId: string;
  title: string;
  sessionTitle: string;
  shortDescription: string;
  lane: TicketLane;
  path: string;
  sessionName: string | null;
  sessionCount: number;
  syncState: TicketSyncState;
  currentPhase: string;
  lastResult: string;
  sessionRecap: string;
  whatHappened: string;
  whatRemains: string;
}

export interface OrphanSessionCard {
  kind: "orphan-session";
  sessionName: string;
  sessionTitle: string;
  shortDescription: string;
  lane: null;
  path: null;
  syncState: "orphan-session";
  attached: boolean;
  ticketIds: string[];
}

export type BoardCard = TicketCard | OrphanSessionCard;

export interface BoardState {
  generatedAt: string;
  ticketsRoot: string;
  tmuxSource: "tmux" | "fixture";
  tmuxAvailable: boolean;
  tickets: TicketSummary[];
  sessions: TmuxSessionSummary[];
  cards: BoardCard[];
}

export interface BoardDiscoveryOptions {
  cwd?: string | undefined;
  ticketsRoot?: string | undefined;
  tmuxFixturePath?: string | undefined;
}
