---
title: "Dropdowns Inside Scrollable Containers: Why They Break And How To Fix Them Properly"
date: "2026-03-24"
excerpt: "The scenario is almost always the same, which is a data table inside a scrollable container. Every row has an action menu, a small dropdown with some options, like Edit , Duplicate , and Delete . You build it, it seems to work…"
tags: ["Gündem", "Smashing Magazine", "Frontend", "UX", "Web"]
category: "Gündem"
---

![Dropdowns Inside Scrollable Containers: Why They Break And How To Fix Them Properly](https://files.smashing.media/articles/dropdowns-scrollable-containers-why-break-how-fix/dropdowns-scrollable-containers-why-break-how-fix.jpg)

> **Kaynak:** Smashing Magazine  &nbsp;·&nbsp;  **Yazar:** https://www.smashingmagazine.com/author/godstime-aburu/

**The scenario is almost always the same, which is a data table inside a scrollable container. Every row has an action menu, a small dropdown with some options, like Edit , Duplicate , and Delete . You…**

The scenario is almost always the same, which is a data table inside a scrollable container. Every row has an action menu, a small dropdown with some options, like Edit , Duplicate , and Delete . You build it, it seems to work perfectly in isolation, and then someone puts it inside that scrollable div and things fall apart. I’ve seen this exact bug in three different codebases: the container, the stack, and the framework, all different. The bug, though, is totally identical.

The dropdown gets clipped at the container’s edge. Or it shows up behind content that should logically be below it. Or it works fine until the user scrolls, and then it drifts. You reach for z-index: 9999 . Sometimes it helps, but other times it does absolutely nothing. That inconsistency is the first clue that something deeper is happening.

The reason it keeps coming back is that three separate browser systems are involved, and most developers understand each one on its own but never think about what happens when all three collide: overflow , stacking contexts , and containing blocks .

Once you understand how all three interact, the failure modes stop feeling random. In fact, they become predictable.

When you set overflow: hidden , overflow: scroll , or overflow: auto on an element, the browser will clip anything that extends beyond its bounds, including absolutely positioned descendants.

.scroll-container { overflow: auto; height: 300px; /* This will clip the dropdown, full stop */ } .dropdown { position: absolute; /* Doesn't matter -- still clipped by .scroll-container */ } That surprised me the first time I ran into it. I’d assumed position: absolute would let an element escape a container’s clipping. It doesn’t.

## Yazıda Neler Var?

- The Overflow Problem
- CSS Anchor Positioning: Where I Think This Is Heading
- Sometimes The Fix Is Just Moving The Element
- Further Reading

---

[Orijinal makaleyi oku →](https://smashingmagazine.com/2026/03/dropdowns-scrollable-containers-why-break-how-fix/)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._