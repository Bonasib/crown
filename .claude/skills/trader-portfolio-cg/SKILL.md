---
name: trader-portfolio-cg
description: Conjugate Gradient portfolio optimization — higher precision than standard mean-variance for large universes (50+ assets). Use when standard portfolio optimization is too slow or imprecise for your asset count.
argument-hint: "--portfolio <name> --assets <count> [--iterations <n>] [--tolerance <float>]"
allowed-tools: Bash(npx *)
---

High-precision portfolio optimization using Conjugate Gradient descent.

**CG optimization for large portfolios:**
```bash
npx neural-trader portfolio-cg --portfolio large-portfolio --assets 100
```

**Custom convergence settings:**
```bash
npx neural-trader portfolio-cg --portfolio my-portfolio --iterations 1000 --tolerance 1e-8
```

**Benchmark against standard mean-variance:**
```bash
npx neural-trader portfolio-cg --portfolio my-portfolio --benchmark
```

## When to Use CG vs Standard
| Scenario | Recommended |
|----------|-------------|
| < 50 assets | `trader-portfolio` (standard) |
| 50-500 assets | `trader-portfolio-cg` (CG) |
| > 500 assets | `trader-cloud-backtest` (cloud compute) |

## Performance
CG converges in O(n) iterations vs O(n²) for matrix inversion. Especially effective for sparse covariance matrices with many near-zero correlations.

Results are validated against the same risk limits as standard portfolio optimization.
