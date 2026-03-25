---
title: "TurboQuant: How Google Compressed LLMs to 3 Bits Without Losing Accuracy"
date: "2026-03-25"
excerpt: "Google Research's TurboQuant compresses key-value caches to 3 bits with no accuracy loss and delivers an 8x speed boost on H100 GPUs — without any training or fine-tuning."
tags: ["AI", "LLM", "Quantization", "Google Research", "Efficiency", "Vector Search", "TurboQuant"]
category: "Technical"
---

**Google Research published three new compression algorithms — TurboQuant, QJL, and PolarQuant — that shrink large language model memory footprints to near-theoretical limits while preserving full accuracy.**

As models grow, so does the cost of running them. The bottleneck is usually the same: high-dimensional vectors. Every token a language model processes adds Key-Value (KV) pairs to the attention cache. That cache eats memory, saturates bandwidth, and directly slows down inference. Classical quantization methods help, but they come with a catch: each data block needs full-precision normalization constants stored alongside the compressed data. That's an extra 1–2 bits per number — small-sounding, but enormous at billions of vectors.

TurboQuant eliminates that hidden overhead entirely.

![TurboQuant overview animation](/images/posts/turboquant/hero.gif)

---

## Why the KV Cache Is a Problem

In a Transformer, every attention layer stores the Key and Value vectors for all previous tokens. As context length grows, this cache scales with it. A model operating at 128K tokens can have a KV cache larger than its weight matrices.

Standard practice is to quantize these vectors to 8-bit or 4-bit. But storing a separate scale factor and zero point for each block means you never actually reach the theoretical compression ratio. The overhead adds up.

---

## How TurboQuant Works

TurboQuant operates in two steps:

**Step 1 — High-quality compression with PolarQuant:** Vectors are first passed through a random rotation matrix. This flattens the data geometry and makes standard quantization nearly perfect. The vectors are then converted from Cartesian to polar coordinates — radius carries magnitude, angles carry direction (meaning). Because the dot products used in attention only depend on the angular component, the radius cancels out. Angles on a unit hypersphere are already bounded, so no normalization constant needs to be stored.

**Step 2 — Error correction with QJL at 1 bit:** The small residual error left by PolarQuant is corrected by QJL (Quantized Johnson-Lindenstrauss) using a single bit per value. QJL reduces each vector element to its sign (+1 or -1) using the Johnson-Lindenstrauss transform, which provably preserves distances between vectors in high-dimensional space. Memory overhead: zero.

Together, these two steps hit the theoretical compression limit with no training required.

---

## QJL: One Bit, Zero Overhead

QJL is worth understanding on its own. Reducing every vector element to a single sign bit looks like aggressive information loss. But the Johnson-Lindenstrauss lemma guarantees that with enough dimensions, the sign bits alone are sufficient to estimate the angle between two vectors to high accuracy.

Classical quantization stores a `scale` and `zero_point` for every data block. QJL stores nothing extra — the algorithm projects data into a space where normalization is implicit. This means 3-bit effective storage actually costs 3 bits. No hidden tax.

---

## PolarQuant: Angles Carry the Meaning

In Cartesian coordinates, quantizing `(x, y, z)` requires normalizing each axis separately. Those normalization coefficients have to go somewhere — they go into memory.

PolarQuant converts vectors to polar/hyperspherical coordinates instead. Radius (r) encodes magnitude; angles (θ₁, θ₂, ...) encode direction, which is what matters for dot product similarity. Since attention scores depend only on directional similarity, the radius cancels in the math. Angles live on a unit hypersphere, naturally bounded, no external normalization constant needed.

---

## Experiments

Tests ran on Gemma and Mistral across five benchmarks: LongBench, Needle In A Haystack, ZeroSCROLLS, RULER, and L-Eval.

![LongBench benchmark results](/images/posts/turboquant/longbench.png)

At 3-bit KV compression, TurboQuant matched baseline accuracy. The gap is negligible across all benchmarks — not a tradeoff, a genuine free lunch.

![Attention logits distortion comparison](/images/posts/turboquant/attention-logits.png)

In attention logit distortion (the measure of how much the compressed vectors deviate from the originals), TurboQuant significantly outperforms competing methods. The QJL bias-correction step is clearly visible here — it cuts distortion that PolarQuant alone would leave behind.

On H100 GPUs, TurboQuant achieved **8× throughput** compared to 32-bit unquantized keys. KV memory footprint dropped 6×. No training, no fine-tuning, no accuracy loss.

---

## Vector Search Results

TurboQuant isn't limited to LLM inference. The same algorithms were tested on vector search — storing and querying billions of high-dimensional embeddings.

![Vector search recall ratios](/images/posts/turboquant/recall-ratio.png)

Compared to Product Quantization (PQ) and RabbiQ, PolarQuant and TurboQuant achieved higher recall ratios while simultaneously reducing index-building time. That combination — better accuracy and faster indexing — is unusual. Most compression methods trade one for the other.

For semantic search systems at scale, this means smaller indices, faster queries, and better results.

---

## Why This Matters

Inference cost is a real constraint for large models. As context windows push toward 1M tokens, the KV cache can dominate GPU memory. Every byte saved there is directly convertible into longer context, larger batches, or cheaper serving.

TurboQuant changes the equation:

- Same hardware, longer context
- Less GPU memory, larger batch sizes
- Faster inference, lower serving cost

The math is clean, the implementation adds negligible runtime overhead, and there's no training involved. All three papers — TurboQuant, QJL, and PolarQuant — are being presented at ICLR 2026 and AISTATS 2026.

---

**Authors:** Amir Zandieh (Research Scientist) and Vahab Mirrokni (VP & Google Fellow), Google Research
**Source:** [Google Research Blog](https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/)
**Papers:** [TurboQuant](https://arxiv.org/abs/2504.19874) · [QJL](https://dl.acm.org/doi/10.1609/aaai.v39i24.34773) · [PolarQuant](https://arxiv.org/abs/2502.02617)
