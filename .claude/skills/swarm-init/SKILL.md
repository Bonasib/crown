---
name: swarm-init
description: Bootstrap a multi-agent swarm with the right topology, agent count, and strategy. Use when starting a complex task that benefits from parallel agent execution.
argument-hint: "[--topology hierarchical|mesh|hierarchical-mesh] [--max-agents <n>] [--strategy specialized|generalist|adaptive]"
allowed-tools: Bash(npx *) Read
---

Initialize a multi-agent swarm for parallel task execution.

**Standard hierarchical swarm (recommended for most tasks):**
```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

**Mesh topology (peer-to-peer, equal agents):**
```bash
npx @claude-flow/cli@latest swarm init --topology mesh --max-agents 6 --strategy generalist
```

**Adaptive topology (self-organizing):**
```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical-mesh --max-agents 10 --strategy adaptive
```

## After Init
- Agents spawn via Claude Code's Task tool with `run_in_background: true`
- Stream live events with `/watch`
- Check status with `/swarm status`
- See the `coordinator` agent for automated orchestration

## Sizing Guidelines
| Task Complexity | Agent Count | Topology |
|----------------|-------------|----------|
| Simple (1-3 files) | 3-4 | mesh |
| Medium (feature) | 6-8 | hierarchical |
| Large (multi-module) | 8-10 | hierarchical-mesh |
| Split into sub-swarms above 10 agents |
