#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_ROOT="$ROOT/.brute/state"
LOG_ROOT="$ROOT/.brute/logs"

BUILD_PROMPT="$ROOT/scripts/brute-build.md"
PROVE_PROMPT="$ROOT/scripts/brute-prove.md"
REVIEW_PROMPT="$ROOT/scripts/brute-review.md"
FIX_PROMPT="$ROOT/scripts/brute-fix-review.md"

MAX_ITERATIONS=""
PHASE_OVERRIDE=""
DRY_RUN=0
TICKET_INPUT=""

usage() {
  cat <<'EOF'
Usage: bash ./brute TKT-025 [--max-iterations N] [--phase build|prove|review|fix-review] [--build FILE] [--prove FILE] [--review FILE] [--fix FILE] [--dry-run]

Run the ticket-first Codex executor loop for one active ticket.

Defaults:
- prompt files live under scripts/brute-*.md
- runtime state is mirrored into the ticket and optionally cached under .brute/state/
- Codex mode defaults to the ticket policy value or full-auto

Ticket contract:
- `## Executor Policy` fenced yaml block
- `## Runtime State` bullet fields
- `## Review Findings`
- `## Exit Reason`
EOF
}

die() {
  printf 'brute: %s\n' "$*" >&2
  exit 1
}

trim() {
  sed 's/^[[:space:]]*//; s/[[:space:]]*$//'
}

resolve_ticket() {
  local input="$1"
  local matches

  if [[ -f "$input" ]]; then
    printf '%s\n' "$input"
    return 0
  fi

  matches="$(find "$ROOT/tickets" -type f -name "${input}*.md" | sort)"
  if [[ -z "$matches" ]]; then
    die "ticket not found for '$input'"
  fi

  if [[ "$(printf '%s\n' "$matches" | wc -l | tr -d ' ')" != "1" ]]; then
    printf 'ambiguous ticket selector %s:\n%s\n' "$input" "$matches" >&2
    exit 2
  fi

  printf '%s\n' "$matches"
}

get_ticket_bullet() {
  local label="$1"
  local default_value="${2:-}"
  local value

  value="$(awk -F': ' -v label="- $label" '$0 ~ "^" label ":" {print substr($0, length(label) + 3); exit}' "$TICKET_PATH" | trim)"
  if [[ -n "$value" ]]; then
    printf '%s\n' "$value"
    return 0
  fi
  printf '%s\n' "$default_value"
}

set_ticket_bullet() {
  local label="$1"
  local value="$2"

  BRUTE_LABEL="$label" BRUTE_VALUE="$value" perl -0pi -e '
    my $label = $ENV{"BRUTE_LABEL"};
    my $value = $ENV{"BRUTE_VALUE"};
    my $pattern = qr/^\Q- $label:\E.*$/m;
    die "missing ticket label: $label\n" if $_ !~ $pattern;
    s/$pattern/- $label: $value/m;
  ' "$TICKET_PATH"
}

get_policy_scalar() {
  local key="$1"
  local default_value="${2:-}"
  local value

  value="$(
    awk '
      /^## Executor Policy$/ { in_section=1; next }
      in_section && /^## / { exit }
      in_section && /^```yaml$/ { in_yaml=1; next }
      in_section && in_yaml && /^```$/ { exit }
      in_section && in_yaml { print }
    ' "$TICKET_PATH" \
    | awk -F':[[:space:]]*' -v key="$key" '$1 == key { print $2; exit }' \
    | trim
  )"

  if [[ -n "$value" ]]; then
    value="${value#\"}"
    value="${value%\"}"
    printf '%s\n' "$value"
    return 0
  fi
  printf '%s\n' "$default_value"
}

json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

write_state_file() {
  mkdir -p "$STATE_ROOT"
  cat >"$STATE_FILE" <<EOF
{
  "ticketId": "$(json_escape "$TICKET_ID")",
  "ticketPath": "$(json_escape "$TICKET_PATH")",
  "currentPhase": "$(json_escape "$CURRENT_PHASE")",
  "iterationsUsed": $ITERATIONS_USED,
  "reviewLoopsUsed": $REVIEW_LOOPS_USED,
  "lastPrompt": "$(json_escape "$LAST_PROMPT")",
  "lastResult": "$(json_escape "$LAST_RESULT")",
  "exitStatus": "$(json_escape "$EXIT_STATUS")",
  "exitDetail": "$(json_escape "$EXIT_DETAIL")"
}
EOF
}

mark_blocked() {
  local reason="$1"

  CURRENT_PHASE="blocked"
  EXIT_STATUS="blocked"
  EXIT_DETAIL="$reason"
  LAST_RESULT="BRUTE_RESULT: status=blocked next=none reason=$reason"

  if [[ "$DRY_RUN" -eq 0 ]]; then
    set_ticket_bullet "current phase" "$CURRENT_PHASE"
    set_ticket_bullet "last result" "$LAST_RESULT"
    set_ticket_bullet "exit status" "$EXIT_STATUS"
    set_ticket_bullet "exit detail" "$EXIT_DETAIL"
    write_state_file
  fi
}

render_prompt() {
  local prompt_file="$1"
  cat "$prompt_file"
  cat <<EOF

Execution context:
- Repo root: $ROOT
- Active ticket: $TICKET_PATH
- Ticket id: $TICKET_ID
- Current phase: $CURRENT_PHASE
- Iterations used: $ITERATIONS_USED / $MAX_ITERATIONS
- Review loops used: $REVIEW_LOOPS_USED / $MAX_REVIEW_LOOPS

Control contract:
- Do the repo work first.
- Update the active ticket before you finish.
- Do not stop at suggestions or upsell language; either keep working in-scope for this phase or transition cleanly.
- Emit exactly one final line at the very end, after all work and ticket updates, with this format:
  BRUTE_RESULT: status=<status> next=<phase-or-none> [reason=<snake_case>] [findings=<count>]
- Never emit more than one BRUTE_RESULT line.
EOF
}

parse_result_field() {
  local line="$1"
  local key="$2"
  printf '%s\n' "$line" | sed -n "s/.*$key=\\([^ ]*\\).*/\\1/p"
}

run_phase() {
  local prompt_file="$1"
  local prompt_name
  local temp_prompt
  local last_message_file
  local log_file
  local codex_mode
  local -a codex_cmd

  prompt_name="${prompt_file#$ROOT/}"
  LAST_PROMPT="$prompt_name"
  temp_prompt="$(mktemp)"
  last_message_file="$(mktemp)"
  mkdir -p "$LOG_ROOT"
  log_file="$LOG_ROOT/${TICKET_ID}-${CURRENT_PHASE}.log"

  render_prompt "$prompt_file" >"$temp_prompt"

  codex_mode="$(get_policy_scalar codex_mode full-auto)"
  codex_cmd=(codex exec --skip-git-repo-check --cd "$ROOT" -o "$last_message_file")
  case "$codex_mode" in
    bypass)
      codex_cmd+=(--dangerously-bypass-approvals-and-sandbox)
      ;;
    full-auto)
      codex_cmd+=(--full-auto)
      ;;
    *)
      die "unsupported codex_mode '$codex_mode' in ticket policy"
      ;;
  esac
  codex_cmd+=(-)

  printf 'ticket: %s\n' "$TICKET_ID"
  printf 'phase: %s\n' "$CURRENT_PHASE"
  printf 'prompt: %s\n' "$prompt_name"
  printf 'codex mode: %s\n' "$codex_mode"

  if [[ "$DRY_RUN" -eq 1 ]]; then
    printf '[dry-run] would run: %s\n' "${codex_cmd[*]}"
    printf '[dry-run] prompt source: %s\n' "$temp_prompt"
    rm -f "$temp_prompt" "$last_message_file"
    return 0
  fi

  if ! "${codex_cmd[@]}" <"$temp_prompt" | tee "$log_file"; then
    rm -f "$temp_prompt"
    mark_blocked "codex_exec_failed"
    die "codex exec failed during phase '$CURRENT_PHASE'"
  fi
  rm -f "$temp_prompt"

  RESULT_LINE="$(rg '^BRUTE_RESULT:' "$last_message_file" | tail -n 1 || true)"
  rm -f "$last_message_file"
  if [[ -z "$RESULT_LINE" ]]; then
    mark_blocked "missing_result_line"
    die "missing BRUTE_RESULT line for phase '$CURRENT_PHASE'"
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --max-iterations)
      [[ $# -ge 2 ]] || die "--max-iterations requires a value"
      MAX_ITERATIONS="$2"
      shift 2
      ;;
    --phase)
      [[ $# -ge 2 ]] || die "--phase requires a value"
      PHASE_OVERRIDE="$2"
      shift 2
      ;;
    --build)
      [[ $# -ge 2 ]] || die "--build requires a value"
      BUILD_PROMPT="$2"
      shift 2
      ;;
    --prove)
      [[ $# -ge 2 ]] || die "--prove requires a value"
      PROVE_PROMPT="$2"
      shift 2
      ;;
    --review)
      [[ $# -ge 2 ]] || die "--review requires a value"
      REVIEW_PROMPT="$2"
      shift 2
      ;;
    --fix)
      [[ $# -ge 2 ]] || die "--fix requires a value"
      FIX_PROMPT="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    -*)
      die "unknown arg '$1'"
      ;;
    *)
      if [[ -n "$TICKET_INPUT" ]]; then
        die "unexpected positional arg '$1'"
      fi
      TICKET_INPUT="$1"
      shift
      ;;
  esac
done

[[ -n "$TICKET_INPUT" ]] || {
  usage >&2
  exit 2
}

TICKET_PATH="$(resolve_ticket "$TICKET_INPUT")"
TICKET_ID="$(basename "$TICKET_PATH" | sed -n 's/^\(TKT-[0-9][0-9]*\).*/\1/p')"
STATE_FILE="$STATE_ROOT/$TICKET_ID.json"

MAX_ITERATIONS="${MAX_ITERATIONS:-$(get_policy_scalar max_iterations 5)}"
MAX_REVIEW_LOOPS="$(get_policy_scalar max_review_loops 3)"
CURRENT_PHASE="${PHASE_OVERRIDE:-$(get_ticket_bullet "current phase" "build")}"
ITERATIONS_USED="$(get_ticket_bullet "iterations used" "0")"
REVIEW_LOOPS_USED="$(get_ticket_bullet "review loops used" "0")"
LAST_RESULT="$(get_ticket_bullet "last result" "not_run")"
LAST_PROMPT="$(get_ticket_bullet "last prompt" "none")"
EXIT_DETAIL="$(get_ticket_bullet "exit detail" "")"
EXIT_STATUS="$(get_ticket_bullet "exit status" "active")"

[[ "$CURRENT_PHASE" != "done" ]] || die "ticket '$TICKET_ID' is already marked done"
[[ "$CURRENT_PHASE" != "blocked" ]] || die "ticket '$TICKET_ID' is blocked; inspect the ticket before retrying"

if [[ "$ITERATIONS_USED" =~ ^[0-9]+$ ]] && (( ITERATIONS_USED >= MAX_ITERATIONS )); then
  mark_blocked "max_iterations_exhausted"
  die "max iterations exhausted for '$TICKET_ID'"
fi

case "$CURRENT_PHASE" in
  build)
    PROMPT_FILE="$BUILD_PROMPT"
    ;;
  prove)
    PROMPT_FILE="$PROVE_PROMPT"
    ;;
  review)
    PROMPT_FILE="$REVIEW_PROMPT"
    ;;
  fix-review)
    PROMPT_FILE="$FIX_PROMPT"
    ;;
  *)
    die "unsupported phase '$CURRENT_PHASE'"
    ;;
esac

if [[ "$DRY_RUN" -eq 1 ]]; then
  run_phase "$PROMPT_FILE"
  exit 0
fi

set_ticket_bullet "current phase" "$CURRENT_PHASE"
set_ticket_bullet "last prompt" "${PROMPT_FILE#$ROOT/}"
set_ticket_bullet "exit status" "active"
set_ticket_bullet "exit detail" ""

run_phase "$PROMPT_FILE"

ITERATIONS_USED=$((ITERATIONS_USED + 1))
STATUS_VALUE="$(parse_result_field "$RESULT_LINE" status)"
NEXT_VALUE="$(parse_result_field "$RESULT_LINE" next)"
REASON_VALUE="$(parse_result_field "$RESULT_LINE" reason)"
LAST_RESULT="$STATUS_VALUE"
EXIT_STATUS="active"
EXIT_DETAIL=""

case "$STATUS_VALUE" in
  continue_build)
    CURRENT_PHASE="build"
    ;;
  ready_for_prove)
    CURRENT_PHASE="prove"
    ;;
  ready_for_review)
    CURRENT_PHASE="review"
    ;;
  review_failed)
    REVIEW_LOOPS_USED=$((REVIEW_LOOPS_USED + 1))
    if (( REVIEW_LOOPS_USED >= MAX_REVIEW_LOOPS )); then
      CURRENT_PHASE="blocked"
      EXIT_STATUS="blocked"
      EXIT_DETAIL="review_loop_budget_exhausted"
    else
      CURRENT_PHASE="fix-review"
    fi
    ;;
  done)
    CURRENT_PHASE="done"
    EXIT_STATUS="done"
    EXIT_DETAIL="review_passed"
    ;;
  blocked)
    CURRENT_PHASE="blocked"
    EXIT_STATUS="blocked"
    EXIT_DETAIL="${REASON_VALUE:-blocked}"
    ;;
  *)
    CURRENT_PHASE="blocked"
    EXIT_STATUS="blocked"
    EXIT_DETAIL="invalid_result_status"
    ;;
esac

if [[ -n "$NEXT_VALUE" && "$NEXT_VALUE" != "none" && "$EXIT_STATUS" == "active" ]]; then
  CURRENT_PHASE="$NEXT_VALUE"
fi

set_ticket_bullet "current phase" "$CURRENT_PHASE"
set_ticket_bullet "iterations used" "$ITERATIONS_USED"
set_ticket_bullet "review loops used" "$REVIEW_LOOPS_USED"
set_ticket_bullet "last prompt" "${PROMPT_FILE#$ROOT/}"
set_ticket_bullet "last result" "$RESULT_LINE"
set_ticket_bullet "exit status" "$EXIT_STATUS"
set_ticket_bullet "exit detail" "$EXIT_DETAIL"

write_state_file

printf '%s\n' "$RESULT_LINE"
if [[ "$EXIT_STATUS" == "blocked" ]]; then
  exit 1
fi
