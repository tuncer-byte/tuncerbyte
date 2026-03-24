---
title: "I Built Free Unlimited S3-Compatible Storage Using Telegram as Backend"
date: "2026-03-24"
excerpt: "The Problem Cloud storage is expensive. S3, GCS, Azure Blob — they all charge per GB..."
tags: ["Gündem", "Dev.to", "typescript", "opensource", "cloudflare"]
category: "Gündem"
---

![I Built Free Unlimited S3-Compatible Storage Using Telegram as Backend](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Foiuwo077c1etr6td0b7l.png)

> **Kaynak:** Dev.to  &nbsp;·&nbsp;  **2 dk okuma**  &nbsp;·&nbsp;  **Yazar:** Young Gao

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

bash
git clone https://github.com/gps949/tg-s3.git
cd tg-s3
# Configure your Telegram bot token and chat ID
./deploy.sh

## Yazıda Neler Var?

- The Problem
- The Solution: TG-S3
- How It Works
- Features
- Cost

---

[Orijinal makaleyi oku →](https://dev.to/young_gao/i-built-free-unlimited-s3-compatible-storage-using-telegram-as-backend-h30)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._