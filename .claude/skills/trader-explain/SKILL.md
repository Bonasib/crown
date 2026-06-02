---
name: trader-explain
description: Generate regulator-grade feature attribution for trading signals using SHAP values and attention visualization. Use when you need to explain why a neural model generated a specific signal or trade decision.
argument-hint: "--strategy <name> --signal <id> [--method shap|attention|both]"
allowed-tools: Bash(npx *)
---

Explain neural model trading decisions with feature attribution.

**Explain a specific signal using SHAP:**
```bash
npx neural-trader explain --strategy my-strategy --signal sig-abc123 --method shap
```

**Attention visualization for Transformer models:**
```bash
npx neural-trader explain --strategy my-strategy --signal sig-abc123 --method attention
```

**Full explanation report (SHAP + attention):**
```bash
npx neural-trader explain --strategy my-strategy --signal sig-abc123 --method both --output report
```

**Batch explain recent signals:**
```bash
npx neural-trader explain --strategy my-strategy --recent 10 --method shap
```

## Output
```json
{
  "signal_id": "sig-abc123",
  "top_features": [
    {"feature": "14d_momentum", "shap_value": 0.42, "direction": "positive"},
    {"feature": "vix_level", "shap_value": -0.18, "direction": "negative"},
    {"feature": "volume_ratio", "shap_value": 0.15, "direction": "positive"}
  ],
  "confidence_explanation": "High momentum with low volatility context",
  "regulator_summary": "Signal driven primarily by 14-day price momentum (42% contribution)"
}
```

Explanations are stored in the `security` namespace for audit purposes.
