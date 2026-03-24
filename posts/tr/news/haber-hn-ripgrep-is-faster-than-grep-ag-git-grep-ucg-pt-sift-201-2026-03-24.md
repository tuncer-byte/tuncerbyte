---
title: "Ripgrep is faster than grep, ag, git grep, ucg, pt, sift (2016)"
date: "2026-03-24"
excerpt: "I blog mostly about my own programming projects."
tags: ["Gündem", "Hacker News", "Developer"]
category: "Gündem"
---

**I blog mostly about my own programming projects.**

In this article I will introduce a new command line search tool, ripgrep , that combines the usability of The Silver Searcher (an ack clone) with the raw performance of GNU grep. ripgrep is fast, cross platform (with binaries available for Linux, Mac and Windows) and written in Rust .

We will attempt to do the impossible: a fair benchmark comparison between several popular code search tools. Specifically, we will dive into a series of 25 benchmarks that substantiate the following claims:

As someone who has worked on text search in Rust in their free time for the last 2.5 years, and as the author of both ripgrep and the underlying regular expression engine , I will use this opportunity to provide detailed insights into the performance of each code search tool. No benchmark will go unscrutinized!

Target audience : Some familiarity with Unicode, programming and some experience with working on the command line.

NOTE : I m hearing reports from some people that rg isn t as fast as I ve claimed on their data. I d love to help explain what s going on, but to do that, I ll need to be able to reproduce your results. If you file an issue with something I can reproduce, I d be happy to try and explain it.

## İçerik Başlıkları

- Screenshot of search results
- Table of Contents
- Introducing ripgrep
- Pitch

---

**Kaynak:** Hacker News &nbsp;·&nbsp; **Puan:** 280

[Orijinal makaleyi oku](https://burntsushi.net/ripgrep/) &nbsp;·&nbsp; [Hacker News tartışması](https://news.ycombinator.com/item?id=47499245)

_Bu içerik otomatik olarak derlenmektedir. Kaynak bağlantıları orijinal yayıncılara aittir._