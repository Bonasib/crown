---
description: CRUD memory operations — store, search (hybrid/graph-rag/dense), retrieve, list, consolidate, delete
argument-hint: "store|search|retrieve|list|delete|consolidate|bridge [options]"
---

Full CRUD interface for the Ruflo memory system.

## Operations

**Store:**
```bash
/ruflo-memory store key=auth-pattern value="JWT with refresh tokens" namespace=patterns
```

**Search (dense/hybrid/graph-rag):**
```bash
/ruflo-memory search query="authentication" mode=hybrid limit=5
/ruflo-memory search query="multi-hop reasoning" mode=graph-rag
```

**Retrieve by key:**
```bash
/ruflo-memory retrieve key=auth-pattern namespace=patterns
```

**List namespace:**
```bash
/ruflo-memory list namespace=solutions
```

**Delete:**
```bash
/ruflo-memory delete key=stale-pattern namespace=patterns
```

**Consolidate (deduplicate + prune stale entries):**
```bash
/ruflo-memory consolidate
```

**Bridge Claude Code auto-memory into AgentDB:**
```bash
/ruflo-memory bridge
```

Default namespace: `default`. Common namespaces: `patterns`, `tasks`, `solutions`, `feedback`, `security`, `claude-memories`.

When called with no arguments, defaults to listing the default namespace.
