---
name: trader-cloud-backtest
description: Offload compute-intensive tasks (parameter sweeps, Monte Carlo simulations, model training) to managed cloud containers via the Anthropic API. Use when local compute is insufficient for large datasets or parameter optimization.
argument-hint: "--task backtest|train|sweep|montecarlo --strategy <name> [--cloud-budget <usd>]"
allowed-tools: Bash(npx *)
---

Offload heavy computation to cloud containers via the Anthropic API.

**Cloud backtest (large dataset):**
```bash
npx neural-trader cloud --task backtest --strategy my-strategy --start 2018-01-01 --end 2024-12-31
```

**Parameter sweep (grid search over hyperparameters):**
```bash
npx neural-trader cloud --task sweep --strategy my-strategy --param-grid trader.sweep.json
```

**Monte Carlo simulation (10,000 runs):**
```bash
npx neural-trader cloud --task montecarlo --strategy my-strategy --runs 10000
```

**Cloud model training:**
```bash
npx neural-trader cloud --task train --strategy my-strategy --model transformer --epochs 500
```

## When to Use Cloud vs Local
| Task | Data Size | Use Cloud When |
|------|-----------|---------------|
| Backtest | Any | > 10 years or > 100 symbols |
| Training | Any | > 500 epochs or NLP features |
| Monte Carlo | Any | > 5,000 runs |
| Parameter sweep | Any | > 50 parameter combinations |

**Requires** `ANTHROPIC_API_KEY` in environment. Costs are shown before execution (use `--dry-run` to preview).

Results are downloaded to `.claude/cloud-results/` on completion.
