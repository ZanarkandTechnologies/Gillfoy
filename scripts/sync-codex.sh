#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CURSOR_HOME="${CURSOR_HOME:-$ROOT}"
AGENTS_HOME="${AGENTS_HOME:-$HOME/.agents}"
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
RENDERER="$ROOT/scripts/render_codex_agent.py"

DRY_RUN=0
SYNC_ROOT=1
SYNC_SKILLS=1
SYNC_AGENTS=1
QA_TESTER_ONLY=0

usage() {
  cat <<'EOF'
Usage: scripts/sync-codex.sh [--dry-run] [--skills-only] [--agents-only] [--qa-tester-only]

Sync maintained skills and agent configs into ~/.codex without touching Codex system files.
EOF
}

run_cmd() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    printf '[dry-run] %s\n' "$*"
    return 0
  fi
  "$@"
}

sync_root_file() {
  local source_file="$1"
  local target_file="$2"
  printf 'sync file: %s -> %s\n' "$source_file" "$target_file"
  run_cmd mkdir -p "$(dirname "$target_file")"
  run_cmd cp -a "$source_file" "$target_file"
}

sync_skill_dir() {
  local source_dir="$1"
  local name
  name="$(basename "$source_dir")"
  local target_dir="$CODEX_HOME/skills/$name"
  printf 'sync skill: %s -> %s\n' "$source_dir" "$target_dir"
  run_cmd rm -rf "$target_dir"
  run_cmd mkdir -p "$CODEX_HOME/skills"
  run_cmd cp -a "$source_dir" "$target_dir"
}

sync_agent_file() {
  local source_file="$1"
  local name
  name="$(basename "${source_file%.md}")"
  local target_file="$CODEX_HOME/agents/$name.toml"
  printf 'render agent: %s -> %s\n' "$source_file" "$target_file"
  run_cmd mkdir -p "$CODEX_HOME/agents"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    return 0
  fi
  "$RENDERER" "$source_file" "$target_file"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      ;;
    --skills-only)
      SYNC_ROOT=0
      SYNC_AGENTS=0
      ;;
    --agents-only)
      SYNC_ROOT=0
      SYNC_SKILLS=0
      ;;
    --qa-tester-only)
      QA_TESTER_ONLY=1
      SYNC_ROOT=0
      SYNC_SKILLS=0
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      printf 'unknown arg: %s\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

if [[ "$SYNC_ROOT" -eq 1 ]]; then
  sync_root_file "$CURSOR_HOME/AGENTS.md" "$CODEX_HOME/AGENTS.md"
fi

if [[ "$SYNC_SKILLS" -eq 1 ]]; then
  declare -A seen_skill=()
  for root_dir in "$CURSOR_HOME/skills" "$AGENTS_HOME/skills"; do
    [[ -d "$root_dir" ]] || continue
    while IFS= read -r -d '' skill_dir; do
      skill_name="$(basename "$skill_dir")"
      if [[ -n "${seen_skill[$skill_name]:-}" ]]; then
        continue
      fi
      seen_skill["$skill_name"]=1
      sync_skill_dir "$skill_dir"
    done < <(find "$root_dir" -mindepth 1 -maxdepth 1 -type d -print0 | sort -z)
  done
fi

if [[ "$SYNC_AGENTS" -eq 1 ]]; then
  while IFS= read -r -d '' agent_file; do
    agent_name="$(basename "$agent_file")"
    if [[ "$QA_TESTER_ONLY" -eq 1 && "$agent_name" != "qa-tester.md" ]]; then
      continue
    fi
    sync_agent_file "$agent_file"
  done < <(find "$CURSOR_HOME/agents" -mindepth 1 -maxdepth 1 -type f -name '*.md' -print0 | sort -z)
fi
