---
title: "GPT-5.5 Released: OpenAI's Fastest Reasoning Model Yet, Optimized for Agentic Work"
date: "2026-04-23"
excerpt: "OpenAI launched GPT-5.5 on April 23, 2026 — six weeks after GPT-5.4. The model delivers better results with fewer tokens, a 400K context window in Codex, and meaningful gains on scientific research and agentic coding. API pricing is 2x GPT-5.4. API access is coming soon."
tags: ["GPT-5.5", "OpenAI", "ChatGPT", "AI Model", "LLM", "Agentic AI", "Codex", "Large Language Model", "Machine Learning", "AI Release"]
category: "Technology"
---

April 23, 2026. OpenAI released **GPT-5.5** — six weeks after GPT-5.4, continuing the company's aggressive release cadence as frontier AI labs compete for enterprise customers.

The internal codename is **"Spud."** The public positioning is "a new class of intelligence for real work."

GPT-5.5 is available today for Plus, Pro, Business, and Enterprise subscribers in ChatGPT and Codex. API access is coming "very soon" but requires different safeguards that aren't ready at launch.

---

## What Changed from GPT-5.4

OpenAI describes GPT-5.5 as a "faster, sharper thinker for fewer tokens." The core improvement isn't a dramatic capability jump — it's efficiency. The model achieves better results than GPT-5.4 while using fewer tokens to get there.

Greg Brockman, OpenAI co-founder, described it as "a big step towards more agentic and intuitive computing" — the model understands intent faster and can carry more of the work itself with less user hand-holding.

Mark Chen, VP of Research at OpenAI, noted it "shows meaningful gains on scientific and technical research workflows" — specifically drug discovery and early-stage scientific work.

The combination: same intelligence tier as GPT-5.4, improved token efficiency, and better handling of multi-step autonomous tasks.

---

## Key Capabilities

### Agentic Task Handling

GPT-5.5 is primarily positioned for **multi-step workflows** — tasks that require planning, tool use, and self-checking across multiple iterations. It outperforms GPT-5.4 at:

- **Agentic coding** — writing, debugging, and verifying code across long sessions
- **Computer use** — operating software interfaces autonomously
- **Knowledge work** — research synthesis, document analysis, report generation
- **Scientific research** — particularly early-stage drug discovery and technical workflows

The improvement isn't a single capability — it's reduced friction across the full workflow: fewer clarifying questions needed, better task decomposition, more reliable self-correction.

### Codex: 400K Context Window

For subscribers using **Codex** (OpenAI's AI coding environment), GPT-5.5 ships with a **400K token context window** — large enough to hold entire codebases in context.

Codex also gains a **Fast mode**: 2.5x the cost, 1.5x faster token generation. Useful for latency-sensitive development workflows where waiting on each step becomes a bottleneck.

### Benchmark Performance

GPT-5.5 outperforms its predecessors and current competitors across multiple benchmarks:

- Beats **GPT-5.4** across agentic coding, knowledge work, and scientific research
- Beats **Gemini 3.1 Pro** on the same categories
- Beats **Claude Opus 4.5** on core benchmarks (notably, Anthropic shipped Claude Opus 4.7 one week earlier — GPT-5.5 will need to be tested directly against it)

OpenAI hasn't published a full benchmark table at launch — unlike Anthropic's detailed comparisons at the Opus 4.7 release last week.

---

## Availability by Tier

| Plan | GPT-5.5 | GPT-5.5 Pro | GPT-5.5 Thinking |
|------|---------|-------------|------------------|
| **Free** | — | — | — |
| **Plus** ($20/mo) | Yes | — | Yes |
| **Pro** ($200/mo) | Yes | Yes | Yes |
| **Business** | Yes | Yes | Yes |
| **Enterprise** | Yes | Yes | Yes |

**GPT-5.5 Pro** is the highest-capability variant, available only on Pro, Business, and Enterprise plans.

**GPT-5.5 Thinking** provides extended reasoning — available from Plus and above.

**API access:** Not available at launch. OpenAI says it's coming "very soon" but requires additional safeguards review before release.

---

## API Pricing (When Available)

Pricing is set at **2x the cost of GPT-5.4**:

| Token Type | GPT-5.5 | GPT-5.4 |
|------------|---------|---------|
| **Input** | $5.00 / 1M tokens | $2.50 / 1M tokens |
| **Cached Input** | $0.50 / 1M tokens | $0.25 / 1M tokens |
| **Output** | $30.00 / 1M tokens | $15.00 / 1M tokens |

The doubling reflects both the model's capability improvements and OpenAI's positioning of GPT-5.5 as an enterprise-tier model. Developers building cost-sensitive applications may want to evaluate whether GPT-5.4 or a lighter model serves their use case better before switching.

---

## Safety

GPT-5.5 launches with what OpenAI calls its "strongest set of safeguards to date." The process included:

- Internal red-teaming
- External red-teaming
- Feedback from **nearly 200 early-access partners** before release

The delayed API launch is explicitly tied to safety review. OpenAI stated that API deployments "require different safeguards" and that those aren't ready yet — a notable public acknowledgment given the usual pressure to ship.

---

## Context: OpenAI's Release Pace

GPT-5.5 shipped six weeks after GPT-5.4. The timeline matters because it signals a fundamental change in how OpenAI is developing and releasing models — away from large infrequent jumps toward continuous incremental updates.

This creates a moving target for competitors. Anthropic shipped Claude Opus 4.7 one week ago. Google's Gemini 3.1 Pro is the current third-party benchmark baseline. All three companies are shipping on timelines measured in weeks rather than months.

OpenAI's broader strategic direction with GPT-5.5 is toward a **"superapp"** — a unified platform combining ChatGPT, Codex, and an AI browser into a single enterprise service. GPT-5.5 is described as one step toward that goal.

Chief Scientist Jakub Pachocki noted in internal communications that recent progress has been "surprisingly slow" — suggesting the team believes there's significantly more headroom and that the current pace is not the ceiling.

---

## How It Compares: GPT-5.5 vs Claude Opus 4.7

| | GPT-5.5 | Claude Opus 4.7 |
|--|---------|-----------------|
| **Release date** | April 23, 2026 | April 16, 2026 |
| **Input price** | $5.00/1M | $5.00/1M |
| **Output price** | $30.00/1M | $25.00/1M |
| **Context window** | Standard (Codex: 400K) | 200K |
| **Vision** | Standard | 3.75MP (3× upgrade) |
| **Thinking / Extended reasoning** | Yes | Yes (xhigh effort level) |
| **API availability** | Coming soon | Available now |
| **Benchmarks (agentic coding)** | Strong | 87.6% SWE-bench Verified |
| **Document reasoning** | Strong | 80.6% OfficeQA Pro |

The models are closely matched at the top tier. GPT-5.5 wins on Codex context window; Claude Opus 4.7 has a published benchmark table and cheaper output tokens. Direct head-to-head data will emerge as independent benchmarks run.

---

## Bottom Line

GPT-5.5 is an efficiency upgrade more than a capability leap — the same intelligence tier as GPT-5.4, but faster, more token-efficient, and better tuned for autonomous multi-step work.

For ChatGPT subscribers already on Plus or above, it's available now in ChatGPT and Codex. For developers building on the API, the wait continues — but "very soon" suggests days to weeks, not months.

The 2x pricing is the main friction point. Teams currently running GPT-5.4 in production should evaluate whether the efficiency gains offset the cost increase before migrating.

**ChatGPT access:** [chatgpt.com](https://chatgpt.com) — Plus and above, available now.

**API:** Not yet available. Monitor [platform.openai.com](https://platform.openai.com) for the release announcement.

Sources:
- [OpenAI upgrades ChatGPT and Codex with GPT-5.5 — 9to5Mac](https://9to5mac.com/2026/04/23/openai-upgrades-chatgpt-and-codex-with-gpt-5-5-a-new-class-of-intelligence-for-real-work/)
- [OpenAI releases GPT-5.5 — TechCrunch](https://techcrunch.com/2026/04/23/openai-chatgpt-gpt-5-5-ai-model-superapp/)
- [OpenAI announces GPT-5.5 — CNBC](https://www.cnbc.com/2026/04/23/openai-announces-latest-artificial-intelligence-model.html)
- [OpenAI launches GPT-5.5 — Fortune](https://fortune.com/2026/04/23/openai-releases-gpt-5-5/)
