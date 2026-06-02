---
name: ruflo-doctor
description: Diagnose and auto-fix Ruflo installation issues — MCP server connectivity, hook registration, memory backend, and agent configuration. Use when ruflo commands fail or the system seems misconfigured.
argument-hint: "[--fix]"
allowed-tools: Bash(npx *) Read
---

Diagnose Ruflo system health and optionally auto-fix issues.

**Run full diagnostics:**
```bash
npx @claude-flow/cli@latest doctor
```

**Auto-fix detected issues:**
```bash
npx @claude-flow/cli@latest doctor --fix
```

**What it checks:**
- MCP server registration and connectivity
- Hook registration (PreToolUse, PostToolUse)
- Memory backend (HNSW index integrity)
- Agent file validity
- Plugin installation integrity (verifies `.claude/plugins.json` against installed files)
- Node.js and npx version compatibility

**Common fixes applied automatically:**
- Re-registers missing MCP server
- Recreates corrupted HNSW index
- Restores missing hook entries in `.claude/settings.json`

Run `/ruflo-status` for a quick health summary without the full diagnostic scan.
