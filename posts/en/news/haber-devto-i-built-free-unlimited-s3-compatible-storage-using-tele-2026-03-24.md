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

## The Problem

I built [TG-S3](https://github.com/gps949/tg-s3) — an S3-compatible storage gateway that uses Telegram as the storage backend and runs on Cloudflare Workers (free tier).

1. Cloudflare CDN — cached content for fast reads
2. Cloudflare R2 — persistent cache for files up to 20MB
3. Telegram API — unlimited file storage (up to 2GB per file with VPS proxy)

## The Solution: TG-S3

Metadata lives in Cloudflare D1 (SQLite), and the S3 API gateway runs serverlessly on Cloudflare Workers.

bash
git clone https://github.com/gps949/tg-s3.git
cd tg-s3
# Configure your Telegram bot token and chat ID
./deploy.sh

## How It Works

bash
aws s3 ls s3://my-bucket --endpoint-url https://your-worker.workers.dev
aws s3 cp ./photo.jpg s3://my-bucket/photos/ --endpoint-url https://your-worker.workers.dev

ini
[tg-s3]
type = s3
provider = Other
endpoint = https://your-worker.workers.dev
accesskeyid = your-key
secretaccesskey = your-secret

## Features

The system is built with TypeScript, uses AWS SigV4 for authentication, and deploys via Wrangler v3. The Telegram Bot API handles file upload/download, while Cloudflare's edge network handles caching and CDN.

Cloudflare Tunnel integration is available for secure VPS connectivity when large file support is needed.

## Cost

Telegram offers unlimited cloud storage for files up to 2GB, with a generous API. Files stored on Telegram are persistent, encrypted, and accessible globally. By using Telegram as a storage backend and wrapping it with an S3-compatible API, we get the best of both worlds.

TG-S3 is fully open source. Check it out, star it, and let me know what you think!

## Quick Start

## Architecture

## Why Telegram?

## Open Source

---

[Orijinal makaleyi oku →](https://dev.to/young_gao/i-built-free-unlimited-s3-compatible-storage-using-telegram-as-backend-h30)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._