---
title: "DeepSeek V4 Released: 1M Context, Frontier Coding, at a Fraction of the Price"
date: "2026-04-24"
excerpt: "DeepSeek released V4-Pro and V4-Flash on April 24, 2026 — both open-source, MIT licensed, with 1M token context windows. V4-Pro tops LiveCodeBench at 93.5% and costs 7x less than Claude Opus. V4-Flash undercuts GPT-5.4 Nano on price. Legacy models retire July 24."
tags: ["DeepSeek", "DeepSeek V4", "DeepSeek V4-Pro", "DeepSeek V4-Flash", "Open Source LLM", "AI Model", "LLM", "Mixture of Experts", "1M Context", "Agentic AI"]
category: "Technology"
---

April 24, 2026. DeepSeek released **V4-Pro** and **V4-Flash** — two new open-source models that arrive roughly a year after the R1 "Sputnik moment" and immediately stake a claim on coding benchmarks while pricing themselves far below Western frontier models.

Both are released under the **MIT license** with open weights. Both carry a **1 million token context window** as standard. Both are available via API today.

---

## The Two Models

### DeepSeek-V4-Pro

The flagship. Positioned as a frontier-class model with competitive coding performance:

- **1.6 trillion total parameters / 49 billion active** (Mixture of Experts)
- 865GB on Hugging Face
- Targets agentic coding, world knowledge, and STEM reasoning
- DeepSeek says it trails GPT-5.5 and Gemini 3.1 Pro by "approximately 3 to 6 months"

### DeepSeek-V4-Flash

The fast and cheap alternative — not a stripped-down version:

- **284 billion total parameters / 13 billion active** (Mixture of Experts)
- 160GB on Hugging Face
- Comparable reasoning to V4-Pro with faster response times
- Positioned as "the fast, efficient, and economical choice"

Both models support three reasoning effort modes: **standard**, **think**, and **think-max** (the equivalent of thinking on/off/extended).

---

## Benchmark Results

### V4-Pro

| Benchmark | V4-Pro | Claude Opus 4.6 | GPT-5.4 | Gemini 3.1 Pro |
|-----------|--------|-----------------|---------|----------------|
| **LiveCodeBench** | **93.5%** | 88.8% | — | 91.7% |
| **Codeforces** | **3206** | — | 3168 | — |
| **SWE-bench Verified** | 80.6% | 80.8% | — | — |
| Terminal-Bench 2.0 | 67.9% | 65.4% | 75.1% | — |
| HLE (reasoning) | 37.7% | 40.0% | 39.8% | **44.4%** |
| HMMT 2026 math | 95.2% | 96.2% | **97.7%** | — |
| SimpleQA-Verified | 57.9% | — | — | **75.6%** |

Where V4-Pro leads: **coding**. LiveCodeBench 93.5% is the highest score among all evaluated models. Codeforces 3206 beats GPT-5.4's 3168.

Where it trails: general knowledge recall (SimpleQA 57.9% vs Gemini's 75.6%) and multidisciplinary reasoning (HLE 37.7% — below all three competitors).

SWE-bench at 80.6% is within 0.2 points of Claude Opus 4.6's 80.8% — and both are well below Claude Opus 4.7's 87.6% shipped last week.

### V4-Flash

| Benchmark | V4-Flash | V4-Pro |
|-----------|----------|--------|
| SWE-bench Verified | 79.0% | 80.6% |
| LiveCodeBench | 91.6% | 93.5% |
| Terminal-Bench 2.0 | 56.9% | 67.9% |
| SimpleQA-Verified | 34.1% | 57.9% |

Flash sits 1–2 points behind Pro on coding benchmarks — significant parity given the massive cost difference.

---

## Pricing: The Defining Story

| Model | Input (cache miss) | Input (cache hit) | Output |
|-------|-------------------|-------------------|--------|
| **V4-Flash** | $0.28 / 1M | $0.028 / 1M | $0.28 / 1M |
| **V4-Pro** | $1.74 / 1M | $0.145 / 1M | $3.48 / 1M |
| GPT-5.4 | $2.50 / 1M | $0.25 / 1M | $15.00 / 1M |
| GPT-5.5 | $5.00 / 1M | $0.50 / 1M | $30.00 / 1M |
| Claude Opus 4.6 | $5.00 / 1M | — | $25.00 / 1M |

Key comparisons:

- **V4-Flash undercuts GPT-5.4 Nano** ($0.20/$1.25 input/output) on input price — comparable output cost
- **V4-Pro is 7x cheaper than Claude Opus 4.6** on input, while matching it on SWE-bench
- **V4-Pro output is 4.3x cheaper than GPT-5.4** — and nearly 9x cheaper than GPT-5.5
- V4-Flash output at $0.28/1M is **89x cheaper than Claude Opus 4.6**

This pricing, combined with the MIT license, is what makes DeepSeek V4 disruptive. The model isn't quite at the frontier — but it's close enough, at a price that changes the math for production deployments.

---

## Architecture: Three Core Innovations

### 1. Hybrid Attention — CSA + DSA

V4 introduces "Novel Attention" combining **Compressed Sparse Attention (CSA)** with **DeepSeek Sparse Attention (DSA)**, featuring token-wise compression. The result vs V3.2:

- V4-Pro: **only 27% of single-token FLOPs**, 10% of KV cache size
- V4-Flash: **only 10% of single-token FLOPs**, 7% of KV cache size

The 1M context window becomes practical (not just theoretical) because the KV cache costs are dramatically reduced.

### 2. Manifold-Constrained Hyper-Connections (mHC)

Training a 1.6T parameter model at this scale requires solving gradient stability problems. mHC reduces signal amplification from **3,000x down to 1.6x** — enabling stable training runs that wouldn't converge at this parameter count otherwise.

### 3. Muon Optimizer

Both models trained with Muon instead of AdamW, delivering faster convergence and greater training stability:

- V4-Pro trained on **33 trillion tokens**
- V4-Flash trained on **32 trillion tokens**

---

## Access and Integration

### Chat Interface

- [chat.deepseek.com](https://chat.deepseek.com)
- **Expert Mode** → V4-Pro
- **Instant Mode** → V4-Flash

### API

Available immediately at `api.deepseek.com`. Two compatibility modes:

```python
# OpenAI-compatible
from openai import OpenAI
client = OpenAI(api_key="your-key", base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-v4-pro",   # or deepseek-v4-flash
    messages=[{"role": "user", "content": "..."}],
)
```

```python
# Anthropic-compatible
import anthropic
client = anthropic.Anthropic(api_key="your-key", base_url="https://api.deepseek.com")

message = client.messages.create(
    model="deepseek-v4-pro",
    max_tokens=1024,
    messages=[{"role": "user", "content": "..."}],
)
```

Compatible with Claude Code, OpenClaw, and OpenCode agentic systems as drop-in replacements.

### Open Weights (Hugging Face)

Both models available for self-hosting under MIT license:
- V4-Pro: 865GB — requires H100/H200 infrastructure
- V4-Flash: 160GB — more accessible for teams with A100 clusters

**Note:** No Jinja-format chat template at launch — use the Python encoding scripts from the Hugging Face repository.

### Legacy Model Retirement

Models `deepseek-chat` and `deepseek-reasoner` retire on **July 24, 2026**. Update your `model` parameter to `deepseek-v4-pro` or `deepseek-v4-flash` before that date.

---

## Limitations

Honest assessment of the gaps:

- **General knowledge recall is weak.** SimpleQA-Verified at 57.9% trails Gemini 3.1 Pro's 75.6% significantly.
- **Multidisciplinary reasoning trails.** HLE at 37.7% is below GPT-5.4 (39.8%), Claude Opus 4.6 (40.0%), and Gemini (44.4%).
- **Preview status.** Further post-training refinements are expected — these are not final-quality releases.
- **China-based API infrastructure.** Data sovereignty is a real consideration for regulated industries.
- **Self-hosting V4-Pro is resource-heavy.** 865GB and H100/H200 requirements put it out of reach for most teams.
- **No Jinja chat template.** Minor but requires workaround at launch.

---

## How It Compares at a Glance

| | V4-Pro | V4-Flash | GPT-5.5 | Claude Opus 4.7 |
|--|--------|----------|---------|-----------------|
| **Parameters (active)** | 49B | 13B | Undisclosed | Undisclosed |
| **Context window** | 1M | 1M | Standard | 200K |
| **License** | MIT (open) | MIT (open) | Closed | Closed |
| **Input price** | $1.74/M | $0.28/M | $5.00/M | $5.00/M |
| **Output price** | $3.48/M | $0.28/M | $30.00/M | $25.00/M |
| **LiveCodeBench** | **93.5%** | 91.6% | — | — |
| **SWE-bench** | 80.6% | 79.0% | — | **87.6%** |
| **HLE** | 37.7% | — | — | 54.7% |
| **API now** | Yes | Yes | Coming soon | Yes |

---

## Bottom Line

DeepSeek V4 isn't frontier-of-frontier. By DeepSeek's own admission, it trails GPT-5.5 and Gemini 3.1 Pro by 3–6 months in capability. On knowledge recall and general reasoning, the gap is real.

But on **coding** — the benchmark that matters most for developer and agentic use cases — V4-Pro leads the pack on LiveCodeBench and matches Claude on SWE-bench at a fraction of the price. V4-Flash delivers near-Pro coding performance at costs that make it viable as a default inference model in production.

For teams where budget matters and the primary use case is code, V4 is now the most interesting open-weight option available. For teams that need strong factual grounding or broad reasoning depth, the gaps in SimpleQA and HLE are worth weighing carefully.

**API access:** [api.deepseek.com](https://api.deepseek.com) — available now.

**Chat:** [chat.deepseek.com](https://chat.deepseek.com) — Expert Mode (Pro) or Instant Mode (Flash).

**Open weights:** Hugging Face — MIT license, self-hosting available.

Sources:
- [DeepSeek V4 Preview Release — DeepSeek API Docs](https://api-docs.deepseek.com/news/news260424)
- [DeepSeek V4 — almost on the frontier, a fraction of the price — Simon Willison](https://simonwillison.net/2026/Apr/24/deepseek-v4/)
- [DeepSeek V4-Pro Review: Benchmarks, Pricing & Architecture — BuildFastWithAI](https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026)
- [DeepSeek V4-Pro vs V4-Flash — Lushbinary](https://lushbinary.com/blog/deepseek-v4-pro-vs-flash-benchmarks-pricing-comparison/)
- [DeepSeek V4-Pro delivers GPT-5.4 level at fraction of price — OfficeChai](https://officechai.com/ai/deepseek-v4-pro-deepseek-v4-flash-benchmarks-pricing/)
