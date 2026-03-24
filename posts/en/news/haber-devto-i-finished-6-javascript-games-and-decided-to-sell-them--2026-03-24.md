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

## Why no frameworks?

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

## Challenges I ran into:

In one game I even used a fixed 600-particle pool to avoid garbage collection during gameplay.

Another annoying problem was loading assets locally which caused CORS issues. So I went for a different approach: convert everything to base64 and bundle it directly into the game.
Therefor, I built myself a small tool that:
- takes files (images/audio)
- converts them to base64
- generates an asset.js file
Then the game just imports that file and everything works offline, no requests.

I’m not a designer.
So instead of wasting time trying to make things "pretty", I used placeholders where possible so I can focuse on gameplay and systems.

## 1. Mobile performance (particles are evil and annoying but a must :) )

Some games even use:
- emojis as characters
- simple shapes
- procedural visuals

Instead of always using music files, I experimented with generating sound using the Web Audio API

For example:
- shooting sounds
- footsteps
- background noise (even music kind off...)

## 2. Assets and CORS issues

Of course an MP3 is easier and usually sounds better, but this was more about experimenting.

This was surprisingly one of the hardest parts.
Writing code for yourself is easy. Explaining it to someone else is not.
Especially if that someone is a beginner. So I tried to comment all important systems, explain "why" not just "what" - Still not perfect, but definitely better than nothing.

Here are a few things (you can find in the bundle) that might be useful if you're into game dev (learning how to or just use it elsewhere):

## 3. No design focus (placeholders everywhere)

Amoeba Survival
Infinite procedural map using chunk system
Only visible area is loaded → keeps memory low
Hero evolves through 8 different shapes
Everything is auto-fire → gameplay is about positioning
Also:
- enemies scale with score
- up to 200 enemies at the same time

Entire game is one JS file (~2000 lines)
Uses emojis as main graphics
One-button control system (tap & hold)

Interesting parts:
- procedural dungeon (rooms generated on the fly)
- only current room exists in memory
- explosion physics that push objects instead of damaging
- TTS voice lines on boss kills
- 32 achievements
- full run + stats saved in localStorage

## 4. Procedural audio (yes, really)

Void Invaders
Classic vertical shooter, but everything in a single JS file, 9:16 canvas → mobile friendly and ships with different stats (HP, damage, inertia)

Technical stuff:
- pre-rendered enemies and ships (offscreen canvas)
- parallax background
- procedural fallback music if audio files missing
- save system (continue run)
- scaling difficulty based on wave

Demos
For demos of each game please check the urls on the bundle page:
[PayHip](https://payhip.com/b/vxgFd) or [Itch](https://vmtbits.itch.io/vanilla-js-game-pack-2026)

## 5. Commenting the code (harder than coding)

That means:
- you can modify the code
- reuse systems
- sell your own versions
- do whatever you want
Once you buy it: it’s fully yours

I want to share this information not just to sell the bundle, but also to show that:
- you don’t need big engines
- you don’t need frameworks
- you don’t need perfect design

You just need: consistency + finishing what you start!
(Because honestly, the hardest part wasn’t coding, was finishing the projects...)

## What you can find

## Demos

---

[Orijinal makaleyi oku →](https://dev.to/modestus/i-finished-6-javascript-games-and-decided-to-sell-them-with-full-source-code-3dkm)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._