#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ERRORS: list[str] = []
WARNINGS: list[str] = []


def fail(message: str) -> None:
    ERRORS.append(message)


def warn(message: str) -> None:
    WARNINGS.append(message)


def read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception as exc:
        fail(f"cannot read {path.relative_to(ROOT)}: {exc}")
        return ""


# Required files
required = [
    "README.md",
    "START_PROMPT.md",
    "implementation_plan.md",
    "AGENTS.md",
    "PRISM_MASTER_SPEC.md",
    ".agents/mcp_config.json",
    "database/schema.sql",
    "database/seed.sql",
    "docs/15_ACCEPTANCE_CRITERIA.md",
    "docs/19_ZERO_COST_INFRASTRUCTURE_PLAN.md",
]
for rel in required:
    if not (ROOT / rel).is_file():
        fail(f"missing required file: {rel}")

# JSON syntax
for path in sorted(ROOT.rglob("*.json")):
    if any(part in {"vendor", "node_modules"} for part in path.parts):
        continue
    try:
        json.loads(read(path))
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON in {path.relative_to(ROOT)}: {exc}")

# Skill metadata
skill_dirs = sorted((ROOT / ".agents" / "skills").glob("*/SKILL.md"))
if len(skill_dirs) < 6:
    fail(f"expected at least 6 skills, found {len(skill_dirs)}")
for path in skill_dirs:
    text = read(path)
    match = re.match(
        r"\A---\s*\nname:\s*([^\n]+)\ndescription:\s*([^\n]+)\n---\s*\n",
        text,
    )
    if not match:
        fail(f"invalid skill frontmatter: {path.relative_to(ROOT)}")
        continue
    name = match.group(1).strip()
    description = match.group(2).strip()
    if name != path.parent.name:
        fail(f"skill name mismatch in {path.relative_to(ROOT)}: {name}")
    if len(description) < 40:
        warn(f"short skill description: {path.relative_to(ROOT)}")

# Antigravity rule and workflow limits
for folder in [ROOT / ".agents" / "rules", ROOT / ".agents" / "workflows"]:
    for path in sorted(folder.glob("*.md")):
        chars = len(read(path))
        if chars > 12000:
            fail(f"Antigravity customization exceeds 12000 chars: {path.relative_to(ROOT)}")

# START_PROMPT referenced local files
start = read(ROOT / "START_PROMPT.md")
for rel in sorted(set(re.findall(r"`([^`]+\.(?:md|json|sql))`", start))):
    if rel.startswith(".agents/rules/") and rel.endswith("/"):
        continue
    if "*" in rel or rel.endswith("/"):
        continue
    if not (ROOT / rel).exists():
        fail(f"START_PROMPT references missing file: {rel}")

# Schema invariants
schema = read(ROOT / "database" / "schema.sql")
required_schema_markers = [
    "uq_visitors_key_hash",
    "uq_topic_votes_topic_visitor",
    "uq_vote_events_once_per_type",
    "uq_comment_recommendations_comment_visitor",
    "uq_comment_reports_comment_visitor",
    "attributed_comment_id BIGINT UNSIGNED NULL",
    "initial_option <> current_option",
]
for marker in required_schema_markers:
    if marker not in schema:
        fail(f"schema invariant marker missing: {marker}")

create_tables = re.findall(r"CREATE TABLE(?: IF NOT EXISTS)?\s+([a-z_]+)", schema, re.I)
if len(create_tables) < 10:
    fail(f"expected at least 10 tables, found {len(create_tables)}")

# Seed topics
seed = read(ROOT / "database" / "seed.sql")
seed_count = len(re.findall(r"INSERT INTO topics", seed, re.I))
if seed_count != 10:
    fail(f"expected 10 seed topics, found {seed_count}")
if seed.count("'PUBLISHED'") != 5:
    warn("expected 5 published seed topic status markers")

# Safety checks
if (ROOT / ".env").exists():
    fail(".env must not be included in the starter pack")
for path in ROOT.rglob("*"):
    if not path.is_file():
        continue
    if any(part in {"vendor", "node_modules"} for part in path.parts):
        continue
    if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".zip"}:
        continue
    text = read(path)
    if re.search(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----", text):
        fail(f"private key material found in {path.relative_to(ROOT)}")

# Master spec should contain all numbered docs.
master = read(ROOT / "PRISM_MASTER_SPEC.md")
for path in sorted((ROOT / "docs").glob("*.md")):
    first_heading = next((line for line in read(path).splitlines() if line.startswith("# ")), "")
    if first_heading and first_heading not in master:
        fail(f"master spec missing {path.name}")

# Print deterministic summary.
print(f"skills={len(skill_dirs)}")
print(f"tables={len(create_tables)}")
print(f"seed_topics={seed_count}")
print(f"docs={len(list((ROOT / 'docs').glob('*.md')))}")
for message in WARNINGS:
    print(f"WARNING: {message}")
if ERRORS:
    for message in ERRORS:
        print(f"ERROR: {message}", file=sys.stderr)
    sys.exit(1)
print("starter validation OK")
