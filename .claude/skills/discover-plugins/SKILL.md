---
name: discover-plugins
description: Browse and search the ruflo plugin catalog. Use when the user wants to see available plugins, find a plugin by capability, or get details about a specific plugin before installing it.
argument-hint: "[search query or plugin name]"
allowed-tools: Bash(npx *) Read
---

Browse the ruflo plugin catalog to find and evaluate plugins.

**List all available plugins:**
```bash
npx @claude-flow/cli@latest plugins list
```

**Search by capability:**
```bash
npx @claude-flow/cli@latest plugins search "vector memory"
npx @claude-flow/cli@latest plugins search "trading"
```

**Get details about a specific plugin:**
```bash
npx @claude-flow/cli@latest plugins info ruflo-swarm
```

**Show installed plugins:**
```bash
cat .claude/plugins.json
```

The catalog covers 33 plugins across: Core & Orchestration, Memory & Knowledge, Intelligence & Learning, Architecture & Methodology, Quality & Security, Development Tools, and Domain-Specific categories.

To install a found plugin: `/plugin install <name>@ruflo`
