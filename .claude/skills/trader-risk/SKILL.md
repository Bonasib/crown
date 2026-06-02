---
name: trader-risk
description: Calculate VaR, position sizing, and drawdown limits for a portfolio. Use when assessing whether a trade or portfolio allocation is within risk tolerances before execution.
argument-hint: "--portfolio <name> [--var-confidence 0.95|0.99] [--position <symbol> --size <pct>]"
allowed-tools: Bash(npx *)
---

Assess and manage portfolio risk using Value at Risk and position sizing.

**Portfolio VaR assessment:**
```bash
npx neural-trader risk --portfolio my-portfolio --var-confidence 0.95
npx neural-trader risk --portfolio my-portfolio --var-confidence 0.99
```

**Position sizing check:**
```bash
npx neural-trader risk --position AAPL --size 3.5 --portfolio my-portfolio
```

**Full risk report:**
```bash
npx neural-trader risk --portfolio my-portfolio --full-report
```

## Default Risk Limits
| Limit | Default |
|-------|---------|
| Max single position | 5% of portfolio |
| Max sector concentration | 20% |
| Daily VaR (95%) | 1.5% |
| Max drawdown tolerance | 15% |

## Circuit Breakers (automatic)
- **3% daily loss**: halts all trading for the day
- **5% weekly drawdown**: reduces all position sizes by 5%

Override limits in `trader.config.json`. The risk-analyst agent uses this skill to issue `RiskDecision` approvals.
