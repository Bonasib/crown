---
description: Initialize, monitor, and manage multi-agent swarms
argument-hint: "init|status|health|shutdown [--topology <type>] [--max-agents <n>] [--strategy <type>]"
---

Manage multi-agent swarm lifecycle.

## Subcommands

**Initialize a swarm:**
```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```
Topologies: `hierarchical` | `mesh` | `hierarchical-mesh`
Strategies: `specialized` | `generalist` | `adaptive`

**Check swarm status:**
```bash
npx @claude-flow/cli@latest swarm status
```

**Monitor swarm health:**
```bash
npx @claude-flow/cli@latest swarm health
```

**Gracefully shut down:**
```bash
npx @claude-flow/cli@latest swarm shutdown
```

After `init`, agents spawn via Claude Code's Task tool with `run_in_background: true`. Use `/watch` to stream live events. See `coordinator` agent for automated swarm management.
