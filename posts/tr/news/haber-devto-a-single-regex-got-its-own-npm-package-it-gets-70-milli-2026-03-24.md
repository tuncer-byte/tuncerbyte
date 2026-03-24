---
title: "A Single Regex Got Its Own npm Package. It Gets 70 Million Downloads a Week."
date: "2026-03-24"
excerpt: "A regular expression was popular enough to warrant its own npm package. It's downloaded 70 million..."
tags: ["Gündem", "Dev.to", "javascript", "javascript", "webdev"]
category: "Gündem"
---

![A Single Regex Got Its Own npm Package. It Gets 70 Million Downloads a Week.](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Ffiles.catbox.moe%2Fcth35p.png)

> **Kaynak:** Dev.to  &nbsp;·&nbsp;  **2 dk okuma**  &nbsp;·&nbsp;  **Yazar:** Aditya Agarwal

**A regular expression was popular enough to warrant its own npm package. It's downloaded 70 million...**

A regular expression was popular enough to warrant its own npm package. It's downloaded 70 million times a week.

Seriously, there's one line of actual code there. One line wrapped in a package, published to npm, and unwittingly linked into millions of projects by way of their dependency trees.

In a blog post that hit 379 points on Hacker News this week, James Garbutt lays out what he refers to as the three pillars of JavaScript bloat. And honestly, it puts words to something every JS dev has known in their gut for years but never quite been able to articulate.

The likes of is-string still exist because somewhere, someone needs to cover ES3. Think IE6. Think early Node before they shimmed Array.forEach.

For that person, this makes sense. For the rest of us in evergreen land, downloading dead-weight we never actually wanted.

That's the thinking behind the idea that every function should be its own package. arrify turns a value into an array. slash replaces backslashes. is-windows checks if process.platform is win32.

## Yazıda Neler Var?

- Pillar One: Old Runtime Support 🦕
- Pillar Two: Atomic Architecture 🧱
- Pillar Three: Ponyfills That Won't Leave 👋
- The Numbers 📊
- The Cleanup Has Started 🧹

---

[Orijinal makaleyi oku →](https://dev.to/adioof/a-single-regex-got-its-own-npm-package-it-gets-70-million-downloads-a-week-4h59)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._