---
name: trader-train
description: Train LSTM, Transformer, or NBeats neural models on historical price data for a strategy. Use when creating a new model or retraining an existing one with fresh data.
argument-hint: "--strategy <name> --model lstm|transformer|nbeats [--epochs <n>] [--symbols <list>]"
allowed-tools: Bash(npx *)
---

Train neural models for trading strategies.

**Train LSTM model:**
```bash
npx neural-trader train --strategy my-strategy --model lstm --epochs 100
```

**Train Transformer model:**
```bash
npx neural-trader train --strategy my-strategy --model transformer --epochs 50 --symbols AAPL,MSFT,SPY
```

**Train NBeats (interpretable, good for trend decomposition):**
```bash
npx neural-trader train --strategy my-strategy --model nbeats --epochs 75
```

**Resume training from checkpoint:**
```bash
npx neural-trader train --strategy my-strategy --resume --epochs 50
```

## Model Types
| Model | Best For | Training Speed |
|-------|----------|---------------|
| LSTM | Sequential patterns, regime changes | Fast |
| Transformer | Long-range dependencies, multi-asset | Medium |
| NBeats | Interpretable trend/seasonality decomp | Medium |

## Resource Note
For large datasets (> 5 years, > 50 symbols), use `trader-cloud-backtest` to offload training to cloud containers via the Anthropic API to avoid local resource constraints.

Trained models are saved to `.claude/trader-models/<strategy>/` and loaded automatically during signal generation and backtesting.
