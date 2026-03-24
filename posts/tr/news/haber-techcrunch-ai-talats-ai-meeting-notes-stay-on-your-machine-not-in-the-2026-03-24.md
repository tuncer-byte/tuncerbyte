---
title: "Talat's AI meeting notes stay on your machine, not in the cloud"
date: "2026-03-24"
excerpt: "The subscription-free AI meeting notes app is a local-first twist on notetaking tools like Granola."
tags: ["Gündem", "TechCrunch AI", "AI", "Teknoloji"]
category: "Gündem"
---

![Talat's AI meeting notes stay on your machine, not in the cloud](https://techcrunch.com/wp-content/uploads/2026/03/talat-app-at-2.11.22-PM.jpg?w=1086)

> **Kaynak:** TechCrunch AI  &nbsp;·&nbsp;  **Yazar:** Sarah Perez

**The subscription-free AI meeting notes app is a local-first twist on notetaking tools like Granola.**

The AI-powered notetaking app Granola, valued at $250 million , has become a popular tool among tech industry founders and VCs . But one developer believes there's demand for a more private, local-only alternative that's available for a one-time fee and without a subscription. That's led to the creation of a new Mac app called Talat .

Yorkshire, England-based developer Nick Payne , a self-described computer nerd, says the idea to build a local AI notetaker came about mostly because of a series of happy accidents.

I think Granola is awesome; it's a shining example of what you can do with an Electron app [a framework for building desktop applications] given enough love and care, he told TechCrunch. When I first tried it, I was fascinated that it managed to record system audio on my Mac without recording video, which was the standard workaround at the time. That led to a ton of research, discovering a relatively new and poorly documented Apple API.

To make it easier to work with that API (Core Audio Taps, which lets developers tap into a Mac's audio streams), Payne decided to create an open source audio library, AudioTee .

During that time, I was slowly piecing together a toolkit, but I never found anything that felt like it could stand on its own as a product rather than just a cool tech demo, Payne said. The state-of-the-art hosted transcription models the same providers folks like Granola use are incredible, and it's viscerally cool to see your speech unfurled onscreen in near real time. But it always nagged me that the trade-off required providing not just my data, but my audio data; my actual voice, he added.

He then stumbled upon a software toolkit called FluidAudio , a Swift framework that enables fully local, low-latency audio AI on Apple devices. It lets you run small, fast transcription models directly on the Mac's Neural Engine Apple's dedicated hardware for AI processing.

---

[Orijinal makaleyi oku →](https://techcrunch.com/2026/03/24/talats-ai-meeting-notes-stay-on-your-machine-not-in-the-cloud/)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._