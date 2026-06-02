---
name: monitor-stream
description: Stream and parse live swarm events from a running swarm. Use when you need real-time visibility into agent activity, task progress, or swarm health during an active run.
allowed-tools: Bash(npx *) Read
---

Stream live NDJSON events from a running swarm.

**Start streaming:**
```bash
npx @claude-flow/cli@latest swarm watch --stream
```

**Event types emitted:**
```json
{"type": "agent_spawn", "agent": "coder", "task": "implement auth"}
{"type": "task_update", "agent": "coder", "progress": 0.45, "status": "writing tests"}
{"type": "memory_write", "namespace": "patterns", "key": "jwt-refresh"}
{"type": "health_check", "agents_active": 6, "queue_depth": 3}
{"type": "task_complete", "agent": "reviewer", "result": "pass"}
{"type": "error", "agent": "architect", "message": "ADR conflict detected"}
```

**Parse events for specific types:**
```bash
npx @claude-flow/cli@latest swarm watch --stream --filter task_complete
```

**Combine with Monitor tool** to receive events as notifications in Claude Code without blocking.

For a point-in-time snapshot: `npx @claude-flow/cli@latest swarm status`
