---
title: "Update: my Claude Code token optimizer now blocks redundant reads. Here's the data from 107 sessions."
date: "2026-03-24"
excerpt: "Two weeks ago I posted I tracked where my Claude Code tokens actually go. 37% were wasted. — a plugin..."
tags: ["Gündem", "Dev.to", "opensource", "a", "i"]
category: "Gündem"
---

**Two weeks ago I posted I tracked where my Claude Code tokens actually go. 37% were wasted. — a plugin...**

Two weeks ago I posted [I tracked where my Claude Code tokens actually go. 37% were wasted.](https://dev.to/egorfedorov/i-tracked-where-my-claude-code-tokens-actually-go-37-were-wasted-2gll) — a plugin that tracks where your tokens go and shows you the waste.

> "The real unlock for me was getting a live counter visible all session instead of only doing post-mortems, because it changes behavior in the moment before waste happens." — @henrygodnick

So I built v3.1 — and the plugin now actively blocks wasted reads instead of just reporting them.

The #1 waste pattern I found in 107 sessions: Claude re-reads the same file multiple times.

page.tsx — read 189 times across my sessions. 60 of those were pure duplicates. That's 130K tokens burned on a file Claude already had.

## İçerik Başlıkları

- The big one: Smart Read Cache
- It's not dumb about it
- Real numbers: 107 sessions analyzed
- What else is new in v3.1

---

**Kaynak:** Dev.to &nbsp;·&nbsp; **Yazar:** Egor Fedorov &nbsp;·&nbsp; **Okuma süresi:** 3 dk

[Orijinal makaleyi oku](https://dev.to/egorfedorov/update-my-claude-code-token-optimizer-now-blocks-redundant-reads-heres-the-data-from-107-27lj)

_Bu içerik otomatik olarak derlenmektedir. Kaynak bağlantıları orijinal yayıncılara aittir._