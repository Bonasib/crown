---
name: trader-regime
description: Detect current market regime (bull trending, bear trending, sideways, volatile) using LSTM/Transformer models and macro indicators. Use to gate strategy selection based on regime context.
argument-hint: "[--symbols <list>] [--model lstm|transformer] [--output verdict|full]"
allowed-tools: Bash(npx *)
---

Detect market regime to guide strategy selection.

**Current regime detection:**
```bash
npx neural-trader regime --output verdict
```

**Full regime analysis with macro indicators:**
```bash
npx neural-trader regime --output full
```

**Regime for a specific symbol set:**
```bash
npx neural-trader regime --symbols AAPL,MSFT,SPY --model transformer
```

## Regime Types and Strategy Mapping
| Regime | Indicators | Preferred Strategy |
|--------|-----------|-------------------|
| `bull_trending` | Higher highs, rising volume, low VIX | Momentum |
| `bear_trending` | Lower lows, rising VIX | Mean-reversion, reduced size |
| `sideways` | Range-bound, low volume | Mean-reversion |
| `volatile` | High VIX, fat tails, gap opens | Reduced sizing, cash |

## Output Format (verdict)
```json
{
  "regime": "bull_trending",
  "confidence": 0.82,
  "vix": 14.2,
  "trend_strength": 0.71,
  "recommended_strategy_type": "momentum"
}
```

The market-analyst agent uses this skill to generate `RegimeVerdict` messages for the trading-strategist.
