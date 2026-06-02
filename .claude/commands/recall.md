---
description: Quick semantic search across memory namespaces using HNSW vector search with MMR diversity reranking
argument-hint: "[query] [--limit <n>] [--hybrid] [--namespace <ns>]"
---

Search memory for relevant knowledge.

**Quick search (top 5 results):**
```bash
/recall authentication patterns
```

**With hybrid search (BM25 + dense, 20-49% better):**
```bash
/recall database migration --hybrid
```

**Limit results:**
```bash
/recall error handling --limit 10
```

**Search a specific namespace:**
```bash
/recall deployment steps --namespace tasks
```

If no query is given, shows the 10 most recent memory entries.

Scores are computed as: `cosine_similarity × MMR_diversity × recency_decay`

Namespaces searched by default: `patterns`, `tasks`, `solutions`, `feedback`, `security`, `claude-memories`
