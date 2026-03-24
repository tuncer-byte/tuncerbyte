---
title: "I Built Free Unlimited S3-Compatible Storage Using Telegram as Backend"
date: "2026-03-24"
excerpt: "The Problem Cloud storage is expensive. S3, GCS, Azure Blob — they all charge per GB..."
tags: ["Gündem", "Dev.to", "typescript", "o", "p"]
category: "Gündem"
---

**The Problem Cloud storage is expensive. S3, GCS, Azure Blob — they all charge per GB...**

Cloud storage is expensive. S3, GCS, Azure Blob — they all charge per GB stored and per request. For personal projects, side hustles, or small teams, these costs add up fast.

I wanted something that was:
- Free (actually free, not free-tier-that-expires)
- S3-compatible (works with aws-cli, rclone, any S3 SDK)
- Serverless (no servers to maintain)
- Unlimited storage

I built [TG-S3](https://github.com/gps949/tg-s3) — an S3-compatible storage gateway that uses Telegram as the storage backend and runs on Cloudflare Workers (free tier).

1. Cloudflare CDN — cached content for fast reads
2. Cloudflare R2 — persistent cache for files up to 20MB
3. Telegram API — unlimited file storage (up to 2GB per file with VPS proxy)

Metadata lives in Cloudflare D1 (SQLite), and the S3 API gateway runs serverlessly on Cloudflare Workers.

## İçerik Başlıkları

- The Problem
- The Solution: TG-S3
- How It Works
- Features

---

**Kaynak:** Dev.to &nbsp;·&nbsp; **Yazar:** Young Gao &nbsp;·&nbsp; **Okuma süresi:** 2 dk

[Orijinal makaleyi oku](https://dev.to/young_gao/i-built-free-unlimited-s3-compatible-storage-using-telegram-as-backend-h30)

_Bu içerik otomatik olarak derlenmektedir. Kaynak bağlantıları orijinal yayıncılara aittir._