---
name: trader-backtest
description: Run walk-forward backtests on trading strategies using the Rust/NAPI engine (8-19x faster than Python). Use when validating strategy performance with Sharpe ratio, max drawdown, and win rate metrics.
argument-hint: "--strategy <name> --start <date> --end <date> [--walk-forward] [--monte-carlo]"
allowed-tools: Bash(npx *)
---

Run strategy backtests using the neural-trader Rust/NAPI engine.

**Basic backtest:**
```bash
npx neural-trader backtest --strategy my-strategy --start 2022-01-01 --end 2024-12-31
```

**Walk-forward validation (6-month in-sample, 1-month out-of-sample):**
```bash
npx neural-trader backtest --strategy my-strategy --walk-forward --window-in 180 --window-out 30
```

**Monte Carlo simulation (1000 runs):**
```bash
npx neural-trader backtest --strategy my-strategy --monte-carlo --runs 1000
```

## Key Metrics Reported
| Metric | Rejection Threshold |
|--------|-------------------|
| Sharpe ratio | < 0.5 |
| Max drawdown | > 25% |
| Win rate | < 40% |
| OOS degradation | > 40% vs in-sample |

## Cost Model
- Slippage: 0.05% per trade
- Commission: 0.1% per trade
- Minimum 2 years of history required for validation

Results are stored in `.claude/backtest-results/` and can be reviewed by the backtest-engineer agent.
