#!/usr/bin/env python3
"""
Render a Cursor-style agent markdown file into a Codex agent TOML file.
"""

from __future__ import annotations

import sys
from pathlib import Path


MODEL_MAP = {
    "gpt-5.3-codex": ("gpt-5.3-codex", None, "unchanged"),
    "gemini-3-pro": ("gpt-5.3-codex", None, "remapped from gemini-3-pro -> gpt-5.3-codex"),
    "gemini-3.1-pro": ("gpt-5.3-codex", None, "remapped from gemini-3.1-pro -> gpt-5.3-codex"),
    "gemini-3-flash": ("gpt-4.1", None, "remapped from gemini-3-flash -> gpt-4.1"),
    "claude-4.6-sonnet-medium-thinking": (
        "gpt-5.4",
        "high",
        "remapped from claude-4.6-sonnet-medium-thinking -> gpt-5.4 + high reasoning",
    ),
    "claude-4.6-opus-high-thinking": (
        "gpt-5.4",
        "high",
        "remapped from claude-4.6-opus-high-thinking -> gpt-5.4 + high reasoning",
    ),
}

SANDBOX_BY_NAME = {
    "asset-generator": "workspace-write",
    "bash-operator": "workspace-write",
    "code-reviewer": "read-only",
    "convex-builder": "workspace-write",
    "deep-researcher": "read-only",
    "documentation-maintainer": "workspace-write",
    "documentation-searcher": "workspace-write",
    "explore": "read-only",
    "frontend-designer": "workspace-write",
    "librarian": "workspace-write",
    "memory": "read-only",
    "planner-agent": "workspace-write",
    "qa-tester": "workspace-write",
}


def parse_frontmatter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---\n"):
        return {}, text
    parts = text.split("---\n", 2)
    if len(parts) < 3:
        return {}, text
    _, frontmatter, body = parts
    meta: dict[str, str] = {}
    for raw_line in frontmatter.splitlines():
        line = raw_line.strip()
        if not line or ":" not in line:
            continue
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip()
    return meta, body.lstrip("\n")


def titleize(name: str) -> str:
    return " ".join(part.capitalize() for part in name.split("-"))


def toml_escape_multiline(text: str) -> str:
    return text.replace('"""', '\\"\\"\\"')


def render(md_path: Path, toml_path: Path) -> None:
    text = md_path.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(text)
    name = meta.get("name") or md_path.stem
    source_model = meta.get("model", "gpt-5.4")
    description = meta.get("description", "")
    mapped_model, reasoning, note = MODEL_MAP.get(
        source_model,
        (source_model, None, f"model unchanged ({source_model})"),
    )
    sandbox_mode = SANDBOX_BY_NAME.get(name, "workspace-write")
    title = titleize(name)

    lines = [
        f"# {title} — {note}",
        f'model = "{mapped_model}"',
    ]
    if reasoning:
        lines.append(f'model_reasoning_effort = "{reasoning}"')
    lines.extend(
        [
            f'sandbox_mode = "{sandbox_mode}"',
            "",
            'developer_instructions = """',
            toml_escape_multiline(body.rstrip()),
            '"""',
            "",
        ]
    )
    if description:
        lines.insert(0, f"# Description: {description}")
    toml_path.parent.mkdir(parents=True, exist_ok=True)
    toml_path.write_text("\n".join(lines), encoding="utf-8")


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: render_codex_agent.py <source.md> <target.toml>", file=sys.stderr)
        return 2
    render(Path(argv[1]), Path(argv[2]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
