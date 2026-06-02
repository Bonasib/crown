---
description: Manage cryptographically-signed fix manifests with temporal history tracking (ADR-103)
argument-hint: "init|regen|verify|history [--manifest <path>] [--history <path>]"
---

Manage verification manifests and history for the witness system.

## Commands

**Bootstrap (run once per project):**
```bash
npx @claude-flow/cli@latest witness init
```

**Regenerate manifest and append history (run each release):**
```bash
npx @claude-flow/cli@latest witness regen
```

**Validate manifest against live codebase:**
```bash
npx @claude-flow/cli@latest witness verify
```

**Query temporal history:**
```bash
npx @claude-flow/cli@latest witness history --summary
npx @claude-flow/cli@latest witness history --regressions
npx @claude-flow/cli@latest witness history --timeline
```

Default files: `verification.md.json` (manifest) and `verification-history.jsonl` (records) at project root. Override with `--manifest` and `--history` flags.

See `witness-curator` agent for automated manifest management within a swarm.
