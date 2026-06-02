---
name: trader-portfolio
description: Mean-variance portfolio optimization with rebalancing. Use when optimizing asset allocation across multiple positions to achieve a target risk level or maximize Sharpe ratio.
argument-hint: "--portfolio <name> [--risk-target <pct>] [--rebalance] [--optimize]"
allowed-tools: Bash(npx *)
---

Optimize portfolio allocation using mean-variance optimization.

**Optimize for maximum Sharpe ratio:**
```bash
npx neural-trader portfolio --portfolio my-portfolio --optimize
```

**Optimize for a specific risk target (annualized volatility):**
```bash
npx neural-trader portfolio --portfolio my-portfolio --optimize --risk-target 0.12
```

**Rebalance to current optimal weights:**
```bash
npx neural-trader portfolio --portfolio my-portfolio --rebalance
```

**Show current allocation and drift:**
```bash
npx neural-trader portfolio --portfolio my-portfolio --status
```

## Output
```json
{
  "weights": {"AAPL": 0.12, "MSFT": 0.18, "SPY": 0.40, "cash": 0.30},
  "expected_return": 0.142,
  "expected_volatility": 0.118,
  "sharpe_ratio": 1.02,
  "rebalance_trades": [...]
}
```

Rebalancing trades require `RiskDecision` approval from the risk-analyst before execution.
