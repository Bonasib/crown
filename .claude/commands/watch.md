---
description: Live-stream swarm events and agent activity in real time
---

Stream NDJSON swarm events as they occur (no polling needed):

```bash
npx @claude-flow/cli@latest swarm watch --stream
```

Each line is a JSON event: agent spawn, task update, memory write, health check, error, or completion.

For a point-in-time snapshot instead of a stream:
```bash
npx @claude-flow/cli@latest swarm status
```

Use with the Monitor tool to surface events in Claude Code. Events arrive immediately without polling.
