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

## Pillar One: Old Runtime Support 🦕

The likes of is-string still exist because somewhere, someone needs to cover ES3. Think IE6. Think early Node before they shimmed Array.forEach.

For that person, this makes sense. For the rest of us in evergreen land, downloading dead-weight we never actually wanted.

That's the thinking behind the idea that every function should be its own package. arrify turns a value into an array. slash replaces backslashes. is-windows checks if process.platform is win32.

## Pillar Two: Atomic Architecture 🧱

The promise is reusable lego bricks. The reality is one-consuming packages — written by the same person, for the same package.

Nuxt's dependency tree has two versions of is-docker, two versions of is-stream, and two versions of is-wsl. Each and every one of those could have been a three-liner.

The globalthis ponyfill is still being downloaded millions of times a week. Browsers have natively supported this for 7 years, since 2019.

## Pillar Three: Ponyfills That Won't Leave 👋

→ The average nodemodules folder for a modern framework project sits between 400 and 700 MB
→ The average JS project has 42 direct dependencies and 683 transitive ones (Sonatype)
→ That means for every package you actually chose, you got 16 you didn't

The e18e community, who's been quietly waging a cleanup initiative, has started solving the problem seriously. They're writing tools that will scan your dependency tree, flag known bloated packages, and suggest modern replacements, with their module-replacements tracking the worst offenders already.

pnpm's content-addressable store can cut nodemodules size by up to 89% by deduplicating across projects. Package managers now offer features like minimumReleaseAge to slow down supply chain attacks.

## The Numbers 📊

Perhaps the most promising development has been the most intangible. It's philosophical.

The next time you reach for npm install, open up the source and read the package. If the entire thing fits inside a tweet, perhaps just write the damn thing yourself.

What's the most ridiculous single-responsibility package in your dependency tree? 👇

## The Cleanup Has Started 🧹

---

[Orijinal makaleyi oku →](https://dev.to/adioof/a-single-regex-got-its-own-npm-package-it-gets-70-million-downloads-a-week-4h59)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._