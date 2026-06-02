---
name: trader-signal
description: Scan for trading signals using Z-score anomaly detection and neural models across a symbol watchlist. Use when looking for entry/exit opportunities matching a strategy type.
argument-hint: "--symbols <AAPL,MSFT,...> [--strategy <type>] [--threshold <z>]"
allowed-tools: Bash(npx *)
---

Scan for trading signals across a symbol list.

**Anomaly scan (default, Z-score based):**
```bash
npx neural-trader signal --symbols AAPL,GOOGL,TSLA,MSFT --threshold 2.0
```

**Strategy-specific signal scan:**
```bash
npx neural-trader signal --symbols AAPL,MSFT --strategy momentum
npx neural-trader signal --symbols SPY,QQQ --strategy mean-reversion
```

**Custom strategy signal:**
```bash
npx neural-trader signal --symbols AAPL --strategy my-custom-strategy
```

## Signal Output Format
```json
{
  "symbol": "AAPL",
  "signal": "long",
  "z_score": 2.4,
  "confidence": 0.74,
  "strategy": "momentum",
  "timestamp": "2026-06-02T10:30:00Z"
}
```

Signals with confidence < 0.6 are filtered by default. Use `--min-confidence 0.5` to lower the threshold.

Generated signals flow to the trading-strategist → risk-analyst pipeline before execution.
