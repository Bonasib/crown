---
name: init-project
description: Initialize a new Ruflo project with MCP tools, hooks, and agent configuration. Use when setting up Ruflo for the first time in a project.
argument-hint: "[--preset standard|minimal|full]"
allowed-tools: Bash(npx *) Read Write Edit
---

Run `npx @claude-flow/cli@latest init --wizard` to set up the project interactively, or `npx @claude-flow/cli@latest init --preset standard` for defaults.

This creates `CLAUDE.md`, `.claude/settings.json`, and `.claude-flow/` config with MCP server registration for the `ruflo` MCP tools.

**Presets:**
- `minimal` — core MCP server + 3 agents, no hooks
- `standard` — MCP server + hooks + 15 agents + memory backend (recommended)
- `full` — all 33 plugins, 98 agents, daemon workers, full hook suite

**After init, register the MCP server:**
```bash
claude mcp add ruflo -- npx ruflo@latest mcp start
```

**Verify the installation:**
```bash
bash plugins/ruflo-core/scripts/smoke.sh
```
