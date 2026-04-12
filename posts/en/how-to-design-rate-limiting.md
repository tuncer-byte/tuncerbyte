---
title: "How to Design Rate Limiting That Actually Works"
date: "2026-04-10"
excerpt: "Token Bucket, Leaky Bucket, Fixed Window, Sliding Window — four rate limiting algorithms explained with their trade-offs so you can pick the right one."
tags: ["Rate Limiting", "Backend", "System Design", "Token Bucket", "Leaky Bucket", "Algorithm", "API", "Security", "Architecture"]
category: "Technology"
---

Every so often I step back from writing code to think about the bigger picture.

Modern systems handle dozens — sometimes hundreds — of requests per minute. Some are legitimate: real users doing real things. Others are malicious: probing for vulnerabilities, scraping data, or simply trying to exhaust your resources.

**Rate limiting** is one of the most effective defenses against these threats. In plain terms: it defines the maximum number of requests a user can make to a system within a given time window.

But there's a critical question worth asking first.

## Does One Approach Fit Every System?

No.

Every system has different dynamics and internal constraints. Some allow thousands of requests per day; others need to throttle within minutes. Even different microservices inside the same system may require different strategies.

There is no single "best" rate limiting strategy. The right one depends on what your system needs to protect, and how it needs to behave under load.

Here are the four foundational algorithms.

## 1. Token Bucket

The most common approach — and the easiest to reason about.

The idea: every user gets a fixed pool of "tokens" within a time window. Each request consumes one token. When the window resets, the pool refills. If a user runs out of tokens, requests are rejected.

**Example:** "Tuncer can make 20 requests per minute."

**How it works:**
- Each user gets a token bucket
- Each request deducts one token
- After the defined window, the bucket refills
- No tokens → `429 Too Many Requests`

**Advantages:**
- Simple to implement
- Absorbs short bursts — if there are tokens available, spikes go through

**Disadvantage:**
- Under heavy load, if everyone has tokens simultaneously, the system can still get overwhelmed

---

## 2. Leaky Bucket

Built on a physical metaphor: imagine a bucket with a small hole at the bottom.

No matter how fast you pour water in, the bucket drains at a constant rate. If it overflows, water is lost — requests are dropped.

In system terms: regardless of how fast requests arrive, the system processes them at a fixed rate. If the queue fills up, new requests are rejected.

```
Token Bucket  → Accept spikes, process all of them
Leaky Bucket  → Absorb spikes, process at a constant rate
```

**Where this shines:**

Consider a logging service writing to Elasticsearch. Under normal load, everything is fine. Then traffic spikes 10x.

- **Token Bucket**: "Sure, come on in." Elasticsearch gets overwhelmed.
- **Leaky Bucket**: "I'll write at my usual pace." The downstream system is protected.

Critical logs (ERROR, WARN) always make it to the queue. Low-priority logs (INFO, DEBUG) get dropped when the queue is full.

**Advantage:** Protects downstream systems; output is predictable and stable

**Disadvantage:** Cuts legitimate spikes too — not suitable for systems that need to absorb sudden bursts

---

## 3. Fixed Window

This is the approach you encounter in banking and finance.

"You can make a maximum of 5 wire transfers per day." That's Fixed Window.

**How it works:**
- Time is divided into equal windows (hour, day, month, year)
- Requests are counted within each window
- Exceed the limit → requests are rejected for the remainder of the window
- New window starts → counter resets

**The problem: Boundary Exploitation**

There's a meaningful security gap here.

Say your limit is 100 requests per day. A user sends 100 requests at 11:59 PM, then 100 more at 12:01 AM. The system treats these as separate days — all 200 pass.

200 requests in 2 minutes. Limit was 100.

This is called **boundary exploitation**. It's the biggest weakness of Fixed Window.

---

## 4. Sliding Window Log

Developed specifically to close the gap in Fixed Window.

The difference: instead of a fixed starting point, the window is calculated backwards from each request.

**Example:** Your limit is 100 requests per day. You make your first request at 4:00 PM. Your window now resets at 4:00 PM tomorrow — not at midnight.

Each new request slides the window forward. Boundary exploitation becomes impossible.

**Advantage:** 100% accuracy. Time boundaries can never be gamed.

**Disadvantage:** Every request requires storing a timestamp. At 1 million, 10 million, or 100 million operations, this creates significant storage overhead. In-memory solutions like Redis help, but don't eliminate the cost.

---

## Which Algorithm Should You Use?

| Algorithm | Implementation | Spike Tolerance | Accuracy | Memory Cost |
|---|---|---|---|---|
| Token Bucket | ✅ Easy | ✅ High | Medium | Low |
| Leaky Bucket | Medium | ❌ None | Medium | Low |
| Fixed Window | ✅ Easy | Medium | ⚠️ Low | Low |
| Sliding Window Log | Complex | Medium | ✅ High | ⚠️ High |

The answer depends on your system:

- **General API rate limits** → Token Bucket is usually sufficient
- **Protecting downstream services** → Leaky Bucket
- **Banking / compliance rules** → Fixed Window (simplicity is the priority)
- **Security-critical systems requiring exact accuracy** → Sliding Window Log

---

## Final Thought

What matters here is properly analyzing the need and choosing a structure that fits your system.

The question "which algorithm is best?" is the wrong question. The right question is: which algorithm fits your specific problem?

Every solution has benefits and costs. Being able to make that decision consciously — seeing all the trade-offs and choosing deliberately — is what engineering actually looks like.
