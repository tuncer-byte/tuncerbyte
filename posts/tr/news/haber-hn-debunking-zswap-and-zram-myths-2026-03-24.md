---
title: "Debunking Zswap and Zram Myths"
date: "2026-03-24"
excerpt: "zswap and zram are fundamentally different approaches with different philosophies. If in doubt, use zswap."
tags: ["Gündem", "Hacker News", "Developer"]
category: "Gündem"
---

![Debunking Zswap and Zram Myths](https://chrisdown.name/images/hnr.jpg)

> **Kaynak:** Hacker News  &nbsp;·&nbsp;  **Puan:** 152  &nbsp;·&nbsp;  **Yazar:** https://www.facebook.com/christopherdown

**zswap and zram are fundamentally different approaches with different philosophies. If in doubt, use zswap.**

If in doubt, prefer to use zswap. Only use zram if you have a highly specific reason to.

I recently received a question from a reader about compressed swap technologies on Linux:

I read your articles about memory management (swap) on Linux, finally some words from the expert :) instead of internet experts "you have 32GB - disable it".

It'd be nice to have a follow-up about zswap or zram … :) if they're good (on desktop with 32GB RAM or more), which one is better and why … I understand how they work (from descriptions), but it's difficult to measure it and compare in real life. Again, a lot of "internet experts" just say "zram - because you don't wear your SSD" …

Well, first of all, since I'm writing this article, clearly flattery will get you everywhere ;-)

It is true that there is a lot of confusion and misinformation on the internet about when to use zswap versus zram, and the tradeoffs between them. I've worked on kernel memory management and swap code for the better part of a decade now, and I've seen these technologies evolve and some of the common misconceptions that arise around them.

> I read your articles about memory management (swap) on Linux, finally some words from the expert :) instead of internet experts "you have 32GB - disable it". It'd be nice to have a follow-up about zswap or zram … :) if they're good (on desktop with 32GB RAM or more), which one…

## Yazıda Neler Var?

- Architectural differences
- zram's block device architecture
- zswap's memory management integration
- LRU inversion
- zram writeback and its limitations

---

[Orijinal makaleyi oku →](https://chrisdown.name/2026/03/24/zswap-vs-zram-when-to-use-what.html) &nbsp;·&nbsp; [Hacker News tartışması →](https://news.ycombinator.com/item?id=47500746)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._