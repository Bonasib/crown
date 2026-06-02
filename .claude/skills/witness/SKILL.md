---
name: witness
description: Manage cryptographically-signed fix manifests with temporal history (ADR-103). Use for initializing verification tracking, regenerating manifests on release, verifying codebase integrity, or querying regression history.
argument-hint: "init|regen|verify|history"
allowed-tools: Bash(npx *) Read Write
---

The witness system maintains cryptographically-signed manifests of fixes with full temporal history.

## Workflow

**One-time bootstrap:**
```bash
npx @claude-flow/cli@latest witness init
```
Creates `verification.md.json` and `verification-history.jsonl` at project root.

**On each release — regenerate and append history:**
```bash
npx @claude-flow/cli@latest witness regen
```

**Validate current state:**
```bash
npx @claude-flow/cli@latest witness verify
```

**Query history:**
```bash
npx @claude-flow/cli@latest witness history --summary
npx @claude-flow/cli@latest witness history --regressions
npx @claude-flow/cli@latest witness history --timeline --since 2026-01-01
```

## Anti-patterns
- Never skip the history append step during regen
- Never verify against a stale manifest (always regen first in CI)
- Never retroactively modify history entries
- Do not run verify before init
