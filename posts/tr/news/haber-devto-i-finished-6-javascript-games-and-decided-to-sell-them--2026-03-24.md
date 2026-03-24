---
title: "I finished 6 JavaScript games… and decided to sell them (with full source code)"
date: "2026-03-24"
excerpt: "For a long time I had multiple small game projects sitting around at like 70–80% done. You probably..."
tags: ["Gündem", "Dev.to", "javascript", "javascript", "gamedev"]
category: "Gündem"
---

![I finished 6 JavaScript games… and decided to sell them (with full source code)](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F27af6ice1t4wsmli9zrh.jpg)

> **Kaynak:** Dev.to  &nbsp;·&nbsp;  **3 dk okuma**  &nbsp;·&nbsp;  **Yazar:** Modest Ticu

**For a long time I had multiple small game projects sitting around at like 70–80% done. You probably...**

For a long time I had multiple small game projects sitting around at like 70–80% done.

You probably know this situation where the core idea works, gameplay is there, but polish, fixes, and "final push" never happens ...
And since I have some times on my hands I said ok… lets finish them and if I still finish them anyway… why not also sell the source code?
So that’s what I did.

One important rule I gave myself from the start: Everything must be written in <u>pure Vanilla JS</u>. No frameworks.

Yes, I know — using a framework would make some things easier: asset loading or state management or rendering helpers.
But the goal here was different.
I wanted to prove (mostly to myself) that you can build full games in the browser with your own mini-engine, no dependencies.
The only APIs I used: Web Audio API (for sound) and TSS (only in one game)
That’s it.

One of the biggest problems I ran into was too many particles on screen = mobile devices struggle.

Solutions I used:
- pre-render particles to offscreen canvas where possible
- reduce opacity / brightness on mobile
- limit particle pools (no dynamic allocation)

## Yazıda Neler Var?

- Why no frameworks?
- Challenges I ran into:
- 1. Mobile performance (particles are evil and annoying but a must :) )
- 2. Assets and CORS issues
- 3. No design focus (placeholders everywhere)

---

[Orijinal makaleyi oku →](https://dev.to/modestus/i-finished-6-javascript-games-and-decided-to-sell-them-with-full-source-code-3dkm)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._