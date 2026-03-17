---
title: "memory-bank-MCP: Yapay Zekaya Kalıcı Bellek Kazandırmak"
date: "2025-03-10"
excerpt: "Claude, Cursor ve diğer AI araçlarının proje bağlamını session'lar arasında hatırlamasını sağlayan MCP sunucusunu neden ve nasıl yaptım."
tags: ["MCP", "memory-bank", "Claude", "Cursor", "Yapay Zeka", "Açık Kaynak"]
category: "Proje"
---

Yapay zeka araçlarıyla çalışırken en can sıkıcı problem şu: her oturumu sıfırdan başlatmak zorunda kalmak. Projeni anlat, bağlamı ver, ne yapmak istediğini açıkla... ve her seferinde aynı şeyi tekrar et.

**memory-bank-MCP** bu problemi çözmek için doğdu.

## Problem

Claude Code, Cursor veya benzeri bir AI coding asistanıyla uzun soluklu bir proje üzerinde çalışırken asistan projenin geçmişini, aldığın kararları ve mimariyi bilmiyor. Her sohbet sıfırdan başlıyor.

Bu sadece verimsiz değil — bazen tehlikeli. Asistan daha önce neden belirli bir yaklaşımı seçtiğini bilmeden öneride bulunabiliyor.

## Çözüm: Model Context Protocol

[MCP (Model Context Protocol)](https://modelcontextprotocol.io), AI asistanlarına harici araçlar ve veri kaynakları sağlamak için Anthropic'in geliştirdiği bir standart.

memory-bank-MCP bu protokolü kullanarak:

- Proje bağlamını yapılandırılmış Markdown dosyalarında saklıyor
- AI asistanın her oturumda bu bağlamı otomatik okumasını sağlıyor
- Önemli kararları, mimariyi ve ilerlemeyi kayıt altına alıyor

## Nasıl Çalışıyor

```typescript
// Sunucu başladığında bağlamı yükle
const context = await readMemoryBank(projectPath);

// AI her istek yaptığında bağlamı sağla
server.tool("get_project_context", async () => {
  return { context: await loadAllMemories() };
});

// Önemli kararları kaydet
server.tool("save_decision", async ({ decision, reasoning }) => {
  await appendToMemory("decisions.md", { decision, reasoning, date: new Date() });
});
```

## Sonuç

Proje 100'den fazla GitHub yıldızına ve yaklaşık 20.000 ziyaretçiye ulaştı. Global MCP ekosisteminin en çok kullanılan sunucuları arasına girdi.

En büyük öğrenim: iyi tanımlanmış bir problemi sade bir çözümle ele almak, her şeyi yapmaya çalışmaktan çok daha etkili.

Projeyi incelemek veya katkıda bulunmak için: [github.com/tuncer-byte/memory-bank-MCP](https://github.com/tuncer-byte/memory-bank-MCP)
