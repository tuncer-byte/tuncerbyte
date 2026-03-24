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

## Understanding random() and random-item()

Stuart Robson talks about backdrop-filter . It’s not a new CSS property, but it’s very useful and hardly ever talked about. In fact, up until now, I thought that it was for the ::backdrop pseudo-element, but we can actually use it to create all kinds of background effects for all kinds of elements, like this:

font-variant-numeric: tabular-nums is another one. This property and value prevents layout shift when numbers change dynamically, as they do with live clocks, counters, timers, financial tables, and so on. Amit Merchant walks you through it with this demo:

Godstime Aburu does a deep dive on the Popover API , a new(ish) but everyday web platform feature that simplifies tooltip and tooltip-like UI patterns, but isn’t without its nuances.

## Revisiting backdrop-filter and font-variant-numeric: tabular-nums

Just another anchor positioning quirk , this time from Chris Coyier. These quirks have been piling up for a while now. We’ve talked about them time and time again , but the thing is, they’re not bugs. Anchor positioning works in a way that isn’t commonly understood, so Chris’ article is definitely worth a read, as are the articles that he references.

In this walkthrough, I demonstrate how to build dynamic toggletips using anchored container queries . Also, I ran into an anchor positioning quirk, so if you’re looking to solidify your understanding of all that, I think the walkthrough will help with that too.

DOOM fully rendered in CSS. Every surface is a <div> that has a background image, with a clipping path with 3D transforms applied. Of course CSS does not have a movable camera, so we rotate and translate the scene around the user. [image or embed]

## Getting started with the Popover API

Also, <toolbar> is coming along according to Luke Warlow . This is akin to <focusgroup> , which we can actually test in Chrome 146 with the “Experimental Web Platform features” flag enabled.

P.S. Congratulations to Kevin Powell for making it to 1 million YouTube subs !

## Building dynamic toggletips using anchored container queries

> DOOM fully rendered in CSS. Every surface is a <div> that has a background image, with a clipping path with 3D transforms applied. Of course CSS does not have a movable camera, so we rotate and translate the scene around the user. [image or embed] Niels Leenheer ( @html5test.com…

---

[Orijinal makaleyi oku →](https://css-tricks.com/whats-important-7/)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._