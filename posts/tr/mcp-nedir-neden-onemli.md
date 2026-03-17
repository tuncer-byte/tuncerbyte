---
title: "MCP Nedir ve Neden Önemli?"
date: "2025-01-20"
excerpt: "Model Context Protocol, AI asistanlarını gerçek dünya araçlarıyla buluşturuyor. Bu protokolün geleceği nasıl şekillendirecek?"
tags: ["MCP", "Model Context Protocol", "Yapay Zeka", "Claude", "AI Araçları"]
category: "Teknoloji"
---

2024 sonunda Anthropic, [Model Context Protocol (MCP)](https://modelcontextprotocol.io)'i açık kaynak olarak yayınladı. Başlangıçta sessiz sedasız çıkan bu protokol, kısa sürede AI ekosisteminin en önemli yapı taşlarından biri haline geldi.

## MCP Ne Değil?

Önce yanlış anlaşılmalar: MCP, bir AI modeli değil. Yeni bir LLM framework'ü de değil. MCP bir **iletişim protokolü** — AI asistanlar ile dış dünya arasındaki standardize edilmiş köprü.

## Ne Yapıyor?

Düşün: Claude'a "şu dosyayı oku" diyorsun. Claude tek başına dosya sistemine erişemiyor. Ama bir MCP sunucusu aracılığıyla:

- Dosya okuyabiliyor
- Veritabanına bağlanabiliyor
- API çağrısı yapabiliyor
- Tarayıcıyı kontrol edebiliyor

Bunların hepsi güvenli, izinli ve standart bir protokol üzerinden.

## Neden Önemli?

**Standartlaşma.** Daha önce her AI aracı kendi entegrasyon sistemini kuruyordu. MCP sayesinde bir kez yazılan sunucu tüm uyumlu istemcilerde (Claude, Cursor, VS Code GitHub Copilot, vb.) çalışıyor.

**Ekosistem.** Şu an binlerce MCP sunucusu mevcut. Veritabanından kod analiz araçlarına, tarayıcı otomasyonundan bellek yönetimine kadar her şey.

**Gelecek.** AI asistanların gerçekten faydalı olabilmesi için araçlara ihtiyacı var. MCP bu araçları sağlayan altyapı.

## Başlarken

Kendi MCP sunucunu yazmak için:

```bash
npm install @modelcontextprotocol/sdk
```

Sonra en basit sunucu:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "my-server", version: "1.0.0" }, {
  capabilities: { tools: {} }
});

// Araçlarını buraya ekle
```

Daha fazlası için [memory-bank-MCP kaynak koduma](https://github.com/tuncer-byte/memory-bank-MCP) bakabilirsin.
