---
title: "What’s !important #7: random(), Folded Corners, Anchored Container Queries, and More"
date: "2026-03-24"
excerpt: "For this issue of What’s !important , we have a healthy balance of old CSS that you might’ve missed and new CSS that you don’t want to miss. This includes random() , random-item() , folded corners using clip-path ,…"
tags: ["Gündem", "CSS-Tricks", "Frontend", "CSS", "Web"]
category: "Gündem"
---

![What’s !important #7: random(), Folded Corners, Anchored Container Queries, and More](https://i0.wp.com/css-tricks.com/wp-content/uploads/2026/03/wi7.png)

> **Kaynak:** CSS-Tricks

**For this issue of What’s !important , we have a healthy balance of old CSS that you might’ve missed and new CSS that you don’t want to miss. This includes random() , random-item() , folded corners…**

For this issue of What’s !important , we have a healthy balance of old CSS that you might’ve missed and new CSS that you don’t want to miss. This includes random() , random-item() , folded corners using clip-path , backdrop-filter , font-variant-numeric: tabular-nums , the Popover API, anchored container queries, anchor positioning in general, DOOM in CSS, customizable <select> , :open , scroll-triggered animations, <toolbar> , and somehow, more.

Alvaro Montoro explains how the random() and random-item() CSS functions work . As it turns out, they’re actually quite complex:

width: random(--w element-shared, 1rem, 2rem); color: random-item(--c, red, orange, yellow, darkkhaki); Creating folded corners using clip-path My first solution to folded corners involved actual images. Not a great solution, but that was the way to do it in the noughties. Since then we’ve been able to do it with box-shadow , but Kitty Giraudel has come up with a CSS clip-path solution that clips a custom shape (hover the kitty to see it in action):

Stuart Robson talks about backdrop-filter . It’s not a new CSS property, but it’s very useful and hardly ever talked about. In fact, up until now, I thought that it was for the ::backdrop pseudo-element, but we can actually use it to create all kinds of background effects for all kinds of elements, like this:

font-variant-numeric: tabular-nums is another one. This property and value prevents layout shift when numbers change dynamically, as they do with live clocks, counters, timers, financial tables, and so on. Amit Merchant walks you through it with this demo:

Godstime Aburu does a deep dive on the Popover API , a new(ish) but everyday web platform feature that simplifies tooltip and tooltip-like UI patterns, but isn’t without its nuances.

> DOOM fully rendered in CSS. Every surface is a <div> that has a background image, with a clipping path with 3D transforms applied. Of course CSS does not have a movable camera, so we rotate and translate the scene around the user. [image or embed] Niels Leenheer ( @html5test.com…

## Yazıda Neler Var?

- Understanding random() and random-item()
- Revisiting backdrop-filter and font-variant-numeric: tabular-nums
- Getting started with the Popover API
- Building dynamic toggletips using anchored container queries

---

[Orijinal makaleyi oku →](https://css-tricks.com/whats-important-7/)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._