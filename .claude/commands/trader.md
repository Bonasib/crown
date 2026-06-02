---
description: Neural trading strategy management — create, backtest, train models, scan signals, assess risk, optimize portfolios, and execute live trades
argument-hint: "create|backtest|train|signal|risk|portfolio|live|history [options]"
---

Neural trading system powered by the `neural-trader` npm package.

## Commands

**Create a strategy:**
```bash
/trader create --type momentum --model lstm --symbols AAPL,MSFT
/trader create --type mean-reversion --model transformer
```
Strategy types: `momentum` | `mean-reversion` | `pairs` | `adaptive`
Model types: `lstm` | `transformer` | `nbeats`

**Backtest (Rust/NAPI, 8-19x faster):**
```bash
/trader backtest --strategy my-strategy --start 2022-01-01 --end 2024-01-01
```

**Train neural model:**
```bash
/trader train --strategy my-strategy --epochs 100
```

**Scan for signals:**
```bash
/trader signal --symbols AAPL,GOOGL,TSLA --strategy anomaly
```

**Risk assessment:**
```bash
/trader risk --portfolio my-portfolio --var-confidence 0.95
```

**Portfolio optimization:**
```bash
/trader portfolio --optimize --risk-target 0.12
```

**Live trading (requires prior RiskDecision from risk-analyst):**
```bash
/trader live --strategy my-strategy --broker <broker> --size 3.0
```

**Circuit breakers:** 3% daily loss halt, 5% weekly size reduction.

**Trade history:**
```bash
/trader history --strategy my-strategy --days 30
```
