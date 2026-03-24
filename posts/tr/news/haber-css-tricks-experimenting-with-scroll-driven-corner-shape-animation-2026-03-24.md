---
title: "Experimenting With Scroll-Driven corner-shape Animations"
date: "2026-03-24"
excerpt: "Over the last few years, there’s been a lot of talk about and experimentation with scroll-driven animations . It’s a very shiny feature for sure, and as soon as it’s supported in Firefox (without a flag), it’ll be baseline. It’s…"
tags: ["Gündem", "CSS-Tricks", "Frontend", "CSS", "Web"]
category: "Gündem"
---

![Experimenting With Scroll-Driven corner-shape Animations](https://i0.wp.com/css-tricks.com/wp-content/uploads/2026/02/corner-shape-animation.webp)

> **Kaynak:** CSS-Tricks

**Over the last few years, there’s been a lot of talk about and experimentation with scroll-driven animations . It’s a very shiny feature for sure, and as soon as it’s supported in Firefox (without a…**

Over the last few years, there’s been a lot of talk about and experimentation with scroll-driven animations . It’s a very shiny feature for sure, and as soon as it’s supported in Firefox (without a flag), it’ll be baseline. It’s part of Interop 2026 , so that should be relatively soon. Essentially, scroll-driven animations tie an animation timeline’s position to a scroll position , so if you were 50% scrolled then you’d also be 50% into the animation, and they’re surprisingly easy to set up too.

I’ve been seeing significant interest in the new CSS corner-shape property as well, even though it only works in Chrome for now. This enables us to create corners that aren’t as rounded, or aren’t even rounded at all, allowing for some intriguing shapes that take little-to-no effort to create. What’s even more intriguing though is that corner-shape is mathematical, so it’s easily animated.

Hence, say hello to scroll-driven corner-shape animations (requires Chrome 139+ to work fully):

But what’s this superellipse() function all about? Well, basically, these keyword values are the result of this function. For example, superellipse(2) creates corners that aren’t quite squared but aren’t quite rounded either (the squircle ”). Whether you use a keyword or the superellipse() function directly, a mathematical equation is used either way, which is what makes it animatable. With that in mind, let’s dive into that demo above.

The demo isn’t too complicated, so I’ll start off by dropping the CSS here, and then I’ll explain how it works line-by-line:

@keyframes bend-it-like-beckham { from { corner-shape: superellipse(notch); /* or */ corner-shape: superellipse(-infinity); } to { corner-shape: superellipse(square); /* or */ corner-shape: superellipse(infinity); } } body::before { /* Fill viewport */ content: ""; position: fixed; inset: 0; /* Enable click-through */ pointer-events: none; /* Invert underlying layer */ mix-blend-mode: difference; background: white; /* Don’t forget this! */ border-bottom-left-radius: 100%; /* Animation settings */ animation: bend-it-like-beckham; animation-timeline: scroll(); } /* Added to cards */ .no-filter { isolation: isolate; } In the code snippet above, body::before combined with content: "" creates a pseudo-element of the <body> with no content that is then fixed to every edge of the viewport. Also, since this animating shape will be on top of the content, pointer-events: none ensures that we can still interact with said content.

## Yazıda Neler Var?

- corner-shape in a nutshell
- Animating corner-shape
- Animating corner-shape … revisited
- Adding more scroll features
- “Masking” with corner-shape

---

[Orijinal makaleyi oku →](https://css-tricks.com/experimenting-with-scroll-driven-corner-shape-animations/)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._