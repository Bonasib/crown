---
description: Show Ruflo system health, MCP server status, and active agents
---

Run diagnostics and display Ruflo system health:

```bash
npx @claude-flow/cli@latest doctor
npx @claude-flow/cli@latest status
```

To automatically fix identified issues:
```bash
npx @claude-flow/cli@latest doctor --fix
```

This checks MCP server connectivity, active agent count, memory backend status, and hook registration.
