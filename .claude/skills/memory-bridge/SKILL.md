---
name: memory-bridge
description: Import Claude Code's native auto-memory into the Ruflo AgentDB for cross-session and cross-agent access. Use when agents need to access memories created by Claude Code's built-in memory system.
allowed-tools: Bash(npx *) Read Write
---

Bridge Claude Code's auto-memory into Ruflo's AgentDB with ONNX vector embeddings.

**Import all Claude Code memories:**
```bash
npx @claude-flow/cli@latest memory bridge --import
```

**Import from a specific project:**
```bash
npx @claude-flow/cli@latest memory bridge --import --project /path/to/project
```

**Export Ruflo memory back to Claude Code format:**
```bash
npx @claude-flow/cli@latest memory bridge --export --namespace patterns
```

**Status — show what's in each system:**
```bash
npx @claude-flow/cli@latest memory bridge --status
```

## What Gets Bridged
Claude Code stores memories in `~/.claude/memories/` as markdown files. The bridge:
1. Reads each memory file
2. Generates ONNX embeddings via the ruvector adapter
3. Upserts into AgentDB under the `claude-memories` namespace
4. Makes them searchable via `/recall` and `/ruflo-memory search`

TTL for bridged entries: 24h (short-term) and 30d (long-term), matching Claude Code's retention policy.
