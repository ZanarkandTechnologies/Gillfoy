/**
 * SESSION BOARD CLI
 * =================
 * Proof-mode CLI for the session board runtime.
 *
 * KEY CONCEPTS:
 * - proof mode is the deterministic v1 surface
 * - fixture inputs make integration checks stable
 * - human-readable output should expose sync problems clearly
 *
 * USAGE:
 * - npm run session-board -- --proof --json
 *
 * MEMORY REFERENCES:
 * - MEM-0030
 */

import { discoverBoardState } from "./session-board/index.js";
import { approveReviewTicket, promoteTicketToReview, renameTmuxSession, writeTicketStatus } from "./session-board/mutations.js";
import { getVisibleCards, renderBoardFrame } from "./session-board/render.js";
import type { BoardCard, BoardView, LaneFilter } from "./session-board/models.js";

interface CliOptions {
  command: "proof" | "tui" | "promote" | "approve" | "writeback" | "rename-session";
  proof: boolean;
  json: boolean;
  ticketsRoot?: string | undefined;
  tmuxFixturePath?: string | undefined;
  once: boolean;
  limit: number;
  view: BoardView;
  filter: LaneFilter;
  ticketId?: string | undefined;
  currentPhase?: string | undefined;
  lastResult?: string | undefined;
  sessionRecap?: string | undefined;
  whatHappened?: string | undefined;
  whatRemains?: string | undefined;
  sessionName?: string | undefined;
  label?: string | undefined;
  dryRun: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    command: "proof",
    proof: false,
    json: false,
    once: false,
    limit: 6,
    view: "board",
    filter: "all",
    dryRun: false
  };

  const commandCandidate = argv[0];
  if (
    commandCandidate === "tui" ||
    commandCandidate === "promote" ||
    commandCandidate === "approve" ||
    commandCandidate === "writeback" ||
    commandCandidate === "rename-session"
  ) {
    options.command = commandCandidate;
    argv = argv.slice(1);
  }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument) {
      continue;
    }

    if (argument === "--proof") {
      options.proof = true;
      options.command = "proof";
      continue;
    }

    if (argument === "--json") {
      options.json = true;
      continue;
    }

    if (argument === "--tui") {
      options.command = "tui";
      continue;
    }

    if (argument === "--tickets-root") {
      options.ticketsRoot = argv[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--tmux-fixture") {
      options.tmuxFixturePath = argv[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--once") {
      options.once = true;
      continue;
    }

    if (argument === "--limit") {
      options.limit = Number.parseInt(argv[index + 1] ?? "6", 10);
      index += 1;
      continue;
    }

    if (argument === "--view") {
      const nextView = argv[index + 1];
      if (nextView === "board" || nextView === "review") {
        options.view = nextView;
      }
      index += 1;
      continue;
    }

    if (argument === "--filter") {
      const nextFilter = argv[index + 1];
      if (
        nextFilter === "all" ||
        nextFilter === "active" ||
        nextFilter === "todo" ||
        nextFilter === "review" ||
        nextFilter === "building" ||
        nextFilter === "done"
      ) {
        options.filter = nextFilter;
      }
      index += 1;
      continue;
    }

    if (argument === "--ticket-id") {
      options.ticketId = argv[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--current-phase") {
      options.currentPhase = argv[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--last-result") {
      options.lastResult = argv[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--session-recap") {
      options.sessionRecap = argv[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--what-happened") {
      options.whatHappened = argv[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--what-remains") {
      options.whatRemains = argv[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--session") {
      options.sessionName = argv[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--label") {
      options.label = argv[index + 1];
      index += 1;
      continue;
    }

    if (argument === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (argument === "--help" || argument === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function formatCard(card: BoardCard): string {
  if (card.kind === "orphan-session") {
    return `orphan-session | ${card.sessionName} | attached=${card.attached} | ticketIds=${card.ticketIds.join(",") || "-"}`;
  }

  return [
    `${card.ticketId}`,
    `${card.lane}`,
    `${card.syncState}`,
    `session=${card.sessionName ?? "-"}`,
    `lastResult=${card.lastResult || "-"}`,
    `summary=${card.whatHappened || card.sessionRecap || "-"}`
  ].join(" | ");
}

function printHelp(): void {
  const lines = [
    "Usage:",
    "  npm run session-board -- --proof [--json] [--tickets-root <path>] [--tmux-fixture <path>]",
    "  npm run session-board -- --tui [--once] [--view board|review] [--filter all|active|todo|review|building|done] [--limit N]",
    "  npm run session-board -- promote --ticket-id TKT-030",
    "  npm run session-board -- approve --ticket-id TKT-027",
    "  npm run session-board -- writeback --ticket-id TKT-029 --last-result running --what-happened \"...\" --what-remains \"...\"",
    "  npm run session-board -- rename-session --session cryo --ticket-id TKT-029 --label runtime --dry-run",
    "",
    "Flags:",
    "  --proof              Run the non-interactive proof mode",
    "  --tui                Run the interactive terminal UI",
    "  --json               Emit JSON instead of text output",
    "  --once               Render one TUI frame and exit",
    "  --tickets-root PATH  Override the tickets root directory",
    "  --tmux-fixture PATH  Use fixture tmux data instead of live tmux"
  ];

  console.log(lines.join("\n"));
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const ticketsRoot = options.ticketsRoot ?? "tickets";

  if (options.command === "promote") {
    if (!options.ticketId) {
      throw new Error("--ticket-id is required for promote");
    }
    await promoteTicketToReview(process.cwd(), ticketsRoot, options.ticketId);
    console.log(`promoted ${options.ticketId} to review`);
    return;
  }

  if (options.command === "approve") {
    if (!options.ticketId) {
      throw new Error("--ticket-id is required for approve");
    }
    await approveReviewTicket(process.cwd(), ticketsRoot, options.ticketId);
    console.log(`approved ${options.ticketId} into building`);
    return;
  }

  if (options.command === "writeback") {
    if (!options.ticketId) {
      throw new Error("--ticket-id is required for writeback");
    }
    await writeTicketStatus(process.cwd(), ticketsRoot, options.ticketId, {
      currentPhase: options.currentPhase,
      lastResult: options.lastResult,
      sessionRecap: options.sessionRecap,
      whatHappened: options.whatHappened,
      whatRemains: options.whatRemains
    });
    console.log(`updated ${options.ticketId}`);
    return;
  }

  if (options.command === "rename-session") {
    if (!options.sessionName || !options.ticketId || !options.label) {
      throw new Error("--session, --ticket-id, and --label are required for rename-session");
    }
    const nextName = await renameTmuxSession(options.sessionName, options.ticketId, options.label, options.dryRun);
    console.log(nextName);
    return;
  }

  const boardState = await discoverBoardState({
    ticketsRoot,
    tmuxFixturePath: options.tmuxFixturePath
  });

  if (options.command === "proof" && options.json) {
    console.log(JSON.stringify(boardState, null, 2));
    return;
  }

  if (options.command === "proof") {
    if (!options.proof) {
      printHelp();
      process.exitCode = 1;
      return;
    }

    const lines = [
      `generatedAt=${boardState.generatedAt}`,
      `ticketsRoot=${boardState.ticketsRoot}`,
      `tmuxAvailable=${boardState.tmuxAvailable}`,
      `tmuxSource=${boardState.tmuxSource}`,
      `tickets=${boardState.tickets.length}`,
      `sessions=${boardState.sessions.length}`,
      "",
      ...boardState.cards.map(formatCard)
    ];

    console.log(lines.join("\n"));
    return;
  }

  if (options.command === "tui" && options.once) {
    console.log(
      renderBoardFrame(boardState, {
        view: options.view,
        filter: options.filter,
        limit: options.limit,
        selectedIndex: 0,
        statusMessage: "snapshot"
      })
    );
    return;
  }

  await runInteractiveTui(boardState, options);
}

function nextFilter(current: LaneFilter, key: string): LaneFilter {
  switch (key) {
    case "1":
      return "all";
    case "2":
      return "active";
    case "3":
      return "review";
    case "4":
      return "building";
    case "5":
      return "todo";
    case "6":
      return "done";
    default:
      return current;
  }
}

async function runInteractiveTui(initialBoardState: Awaited<ReturnType<typeof discoverBoardState>>, options: CliOptions): Promise<void> {
  let boardState = initialBoardState;
  const ticketsRoot = options.ticketsRoot ?? "tickets";
  let selectedIndex = 0;
  let view: BoardView = options.view;
  let filter: LaneFilter = options.filter;
  let limit = options.limit;
  let statusMessage = "ready";

  const render = (): void => {
    process.stdout.write("\x1b[2J\x1b[H");
    process.stdout.write(
      `${renderBoardFrame(boardState, { view, filter, limit, selectedIndex, statusMessage })}\n`
    );
  };

  const refresh = async (): Promise<void> => {
    boardState = await discoverBoardState({
      ticketsRoot: options.ticketsRoot,
      tmuxFixturePath: options.tmuxFixturePath
    });
    const visibleCards = getVisibleCards(boardState, { view, filter, limit, selectedIndex, statusMessage });
    if (visibleCards.length === 0) {
      selectedIndex = 0;
    } else {
      selectedIndex = Math.min(selectedIndex, visibleCards.length - 1);
    }
  };

  const selectedCard = (): BoardCard | undefined =>
    getVisibleCards(boardState, { view, filter, limit, selectedIndex, statusMessage })[selectedIndex];

  await refresh();
  render();

  process.stdin.setRawMode(true);
  process.stdin.resume();

  const cleanup = (): void => {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdout.write("\n");
  };

  process.stdin.on("data", async (input: Buffer) => {
    const key = input.toString("utf8");

    if (key === "q") {
      cleanup();
      process.exit(0);
    }

    if (key === "\t") {
      view = view === "board" ? "review" : "board";
      selectedIndex = 0;
      statusMessage = `switched to ${view}`;
    } else if (key === "j" || key === "\u001b[B") {
      selectedIndex += 1;
    } else if (key === "k" || key === "\u001b[A") {
      selectedIndex = Math.max(0, selectedIndex - 1);
    } else if (key === "+" || key === "=") {
      limit += 1;
      statusMessage = `limit=${limit}`;
    } else if (key === "-") {
      limit = Math.max(1, limit - 1);
      statusMessage = `limit=${limit}`;
    } else if (key === "r") {
      statusMessage = "refreshed";
    } else if (["1", "2", "3", "4", "5", "6"].includes(key)) {
      filter = nextFilter(filter, key);
      selectedIndex = 0;
      statusMessage = `filter=${filter}`;
    } else if (key === "p") {
      const card = selectedCard();
      if (card?.kind === "ticket" && card.lane === "todo") {
        await promoteTicketToReview(process.cwd(), ticketsRoot, card.ticketId);
        statusMessage = `promoted ${card.ticketId} to review`;
      } else {
        statusMessage = "select a todo ticket to promote";
      }
    } else if (key === "a") {
      const card = selectedCard();
      if (card?.kind === "ticket" && card.lane === "review") {
        await approveReviewTicket(process.cwd(), ticketsRoot, card.ticketId);
        statusMessage = `approved ${card.ticketId} into building`;
      } else {
        statusMessage = "select a review ticket to approve";
      }
    }

    await refresh();
    render();
  });
}

void main();
