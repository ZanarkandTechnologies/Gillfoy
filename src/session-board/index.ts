/**
 * SESSION BOARD INDEX
 * ===================
 * High-level discovery API for the session board runtime.
 *
 * KEY CONCEPTS:
 * - markdown tickets are canonical
 * - discovery composes ticket state and tmux state
 * - proof mode consumes the same board model as future UI work
 *
 * USAGE:
 * - import discoverBoardState() from CLI or future TUI
 *
 * MEMORY REFERENCES:
 * - MEM-0030
 */

import path from "node:path";

import { buildBoardCards } from "./buildCards.js";
import { discoverTickets } from "./discoverTickets.js";
import { discoverTmuxSessions } from "./discoverTmux.js";
import type { BoardDiscoveryOptions, BoardState } from "./models.js";

export async function discoverBoardState(options: BoardDiscoveryOptions = {}): Promise<BoardState> {
  const cwd = options.cwd ?? process.cwd();
  const ticketsRoot = options.ticketsRoot ?? "tickets";
  const resolvedTicketsRoot = path.resolve(cwd, ticketsRoot);

  const [tickets, tmuxState] = await Promise.all([
    discoverTickets(cwd, ticketsRoot),
    discoverTmuxSessions(cwd, options.tmuxFixturePath)
  ]);

  return {
    generatedAt: new Date().toISOString(),
    ticketsRoot: resolvedTicketsRoot,
    tmuxSource: tmuxState.tmuxSource,
    tmuxAvailable: tmuxState.tmuxAvailable,
    tickets,
    sessions: tmuxState.sessions,
    cards: buildBoardCards(tickets, tmuxState.sessions)
  };
}
