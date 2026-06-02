---
name: memory-search
description: State-of-the-art semantic memory retrieval. Use when searching agent memory with dense, hybrid (BM25+HNSW), or Graph RAG strategies. Delivers 20-49% better recall on hybrid queries and 30-60% improvement on reasoning tasks via Graph RAG.
argument-hint: "<query> [--mode dense|hybrid|graph-rag|smart] [--namespace <ns>] [--limit <n>]"
allowed-tools: Bash(npx *) Read
---

Search Ruflo's vector memory store with multiple retrieval strategies.

## Retrieval Pipeline
`query → HNSW ANN → optional BM25 fusion → RRF ranking → MMR reranking (>0.92 dedup) → recency boost → top-K`

## Modes

**Dense (default) — fast single-hop semantic matching:**
```bash
npx @claude-flow/cli@latest memory search "authentication patterns" --mode dense --limit 5
```

**Hybrid — BM25 + dense with RRF fusion (20-49% better):**
```bash
npx @claude-flow/cli@latest memory search "JWT refresh token" --mode hybrid
```

**Graph RAG — multi-hop traversal (30-60% better for reasoning):**
```bash
npx @claude-flow/cli@latest memory search "how does auth relate to session management" --mode graph-rag
```

**Smart — full pipeline: query expansion + RRF + recency + MMR + session round-robin:**
```bash
npx @claude-flow/cli@latest memory search "recent deployment issues" --mode smart
```

## Namespaces
`patterns` | `tasks` | `solutions` | `feedback` | `security` | `claude-memories`

Use `/recall <query>` for the quick command-line interface to this skill.
