---
title: "Model Context Protocol (MCP) 2026 Spesifikasyonu: Neler Değişti ve Geliştiriciler İçin Ne Anlama Geliyor?"
date: "2026-09-02"
excerpt: "Model Context Protocol (MCP) 2026 güncellemesi yayınlandı. Stateless çekirdek mimarisi, yerel Remote Server (HTTP/SSE) desteği, OAuth2 yetkilendirme ve akışlı araç çağrıları — detaylı teknik inceleme."
tags: ["Model Context Protocol", "MCP", "AI Agent", "Anthropic", "TypeScript", "Geliştirici Araçları", "Yapay Zeka Mimarisi"]
category: "Teknoloji"
---

Anthropic'in 2024 sonunda açık kaynak olarak başlattığı **Model Context Protocol (MCP)**, iki yıl içinde yapay zeka asistanlarının dış dünya ile etkileşim kurma biçimini kökten değiştirdi. Başlangıçta Claude Masaüstü ve yerel terminal ortamlarında çalışan deneysel bir arayüzken; bugün Cursor, VS Code, Zed, LangChain ve kurumsal AI agent platformlarının ortak haberleşme standardı haline geldi.

Geçtiğimiz haftalarda duyurulan **MCP 2026 spesifikasyonu** (2026-07-28 çekirdek sürümü), protokolü yerel bir geliştirici aracından bulut ölçeğinde dağıtık bir sistem omurgasına dönüştüren en kapsamlı revizyon oldu.

Kendi [memory-bank-MCP](https://github.com/tuncer-byte/memory-bank-MCP) sunucumu geliştirirken ve üretimdeki agent sistemlerinde MCP ile çalışırken edindiğim deneyimlerle, bu yeni sürümün getirdiği mimari kırılımları inceliyoruz.

> **Özet (TL;DR):**
> - **Stateless Çekirdek:** Sürekli açık kalan stdio süreçleri yerine, sunucusuz (serverless) bulut mimarilerine uygun durumsuz (stateless) istek-yanıt modeli standartlaştırıldı.
> - **Yerel Remote MCP:** HTTP POST ve Server-Sent Events (SSE) üzerinden çalışan uzak MCP sunucuları için standart OAuth2 ve token bazlı yetkilendirme katmanı geldi.
> - **Akışlı Araç Yürütme (Streaming Tool Execution):** Uzun süren sorgular için parça parça ara sonuç ve canlı ilerleme bildirimi (`progressToken`) eklendi.
> - **Dinamik Kaynak Abonelikleri:** Dosya sistemi ve veritabanı değişiklikleri artık yoklama (polling) yerine olay güdümlü (event-driven) bildirimlerle modele iletiliyor.

---

## 1. Neden Yeni Bir Spesifikasyona İhtiyaç Duyuldu?

Orijinal MCP spesifikasyonu temel olarak **yerel işlem (local process)** modeline dayanıyordu. AI istemcisi (örneğin Claude veya Cursor) bilgisayarınızda bir alt süreç (`stdio` üzerinden çalışan bir Node.js veya Python scripti) başlatıyor ve JSON-RPC ile konuşuyordu.

Ancak MCP kurumsal sistemlere taşındıkça üç kritik darboğaz ortaya çıktı:

1. **Bağlantı Kopması ve Süreç Yönetimi:** Yerel süreçlerin çökmesi veya uyku modunda bağlantının kopması tüm agent oturumunu kilitliyordu.
2. **Bulut ve Serverless Uyumsuzluğu:** AWS Lambda, Cloudflare Workers veya Vercel gibi sunucusuz ortamlarda sürekli açık kalan bir `stdio` borusu (pipe) tutmak imkansızdı.
3. **Güvenlik ve Kimlik Doğrulama Boşluğu:** Çok kullanıcılı kurumsal sistemlerde "bu araç çağrısını yapan kim ve hangi verilere erişim yetkisi var?" sorusunu çözecek standart bir yetkilendirme katmanı yoktu.

2026 spesifikasyonu bu darboğazları doğrudan adresliyor.

---

## 2. Mimari Değişiklikler: 2026 Spesifikasyonunun Getirdikleri

### A. Stateless Çekirdek (Stateless Core)
Yeni şartnamede protokolün çekirdeği tamamen durumsuz (stateless) çalışabilecek şekilde optimize edildi. Artık bir MCP istemcisi her araç çağrısında oturum durumunu taşımak zorunda değil; her çağrı kendi bağlamını ve kimlik doğrulama token'ını taşıyan bağımsız bir işlem olarak ele alınabiliyor.

Bu değişiklik, MCP sunucularının Kubernetes veya edge container kümelerinde yatayda (horizontal scaling) kolayca ölçeklenmesini sağlıyor.

### B. Remote MCP & Standardize OAuth2
Önceden uzak bir MCP sunucusuna bağlanmak için tünelleme araçları veya özel reverse-proxy katmanları gerekiyordu. 2026 sürümüyle birlikte:

- **Transport:** HTTP POST (komutlar için) ve Server-Sent Events (sunucudan istemciye bildirimler için) resmi standart oldu.
- **Auth:** RFC 6749 uyumlu OAuth2 Bearer Token desteği protokole dahil edildi. Model bir şirketin dahili GitHub, Jira veya PostgreSQL MCP sunucusuna erişirken kullanıcının kendi yetki kapsamını (scope) devralabiliyor.

### C. Akışlı Araç Çağrıları (Streaming & Progress Reporting)
Bir araç uzun süren bir işlem yaparken (örneğin 100 sayfalık bir PDF'i vektörize ederken veya bir CI/CD build'i beklerken) eski spesifikasyonda model işlem bitene kadar yanıtsız bekliyordu.

Yeni spesifikasyonda `tools/call` isteği sırasında istemci bir `progressToken` sağlayabiliyor. Sunucu, işlem devam ederken istemciye ara durum bildirimleri gönderiyor:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "job-98234",
    "progress": 65,
    "total": 100,
    "message": "Doküman parçaları vektör veritabanına indeksleniyor..."
  }
}
```

Model bu sayede kullanıcıya "Şu an %65 tamamlandı, devam ediyorum" şeklinde gerçek zamanlı geri bildirim verebiliyor.

---

## 3. Kod Örneği: Yeni 2026 Deseniyle Modern Bir MCP Sunucusu

Aşağıda `@modelcontextprotocol/sdk` kullanarak HTTP/SSE üzerinden çalışan modern bir TypeScript MCP sunucusu örneği yer alıyor:

```typescript
import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const app = express();
const server = new Server(
  { name: "cloud-analytics-mcp", version: "2.0.0" },
  { capabilities: { tools: { streaming: true }, resources: { subscribe: true } } }
);

// 1. Araç Listesi
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "query_metrics",
      description: "Üretim ortamındaki telemetri metriklerini çeker.",
      inputSchema: {
        type: "object",
        properties: {
          metricName: { type: "string" },
          durationMinutes: { type: "number", default: 60 }
        },
        required: ["metricName"]
      }
    }
  ]
}));

// 2. İlerleme Bildirimli Araç Yürütme
server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
  if (request.params.name === "query_metrics") {
    const { metricName } = request.params.arguments as { metricName: string };

    // İlerleme bildirimi gönder
    if (extra?.sendProgress) {
      await extra.sendProgress({ progress: 50, total: 100, message: "Veri ambarı sorgulanıyor..." });
    }

    // İşlem tamamlandı
    return {
      content: [{ type: "text", text: JSON.stringify({ status: "healthy", metric: metricName, latency_p99: "42ms" }) }]
    };
  }
  throw new Error("Bilinmeyen araç");
});

// SSE Endpoint'i (Remote MCP İstemcileri İçin)
app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  // Gelen RPC mesajlarını işle
});

app.listen(8080, () => console.log("MCP 2026 Remote Sunucu 8080 portunda aktif"));
```

---

## 4. MCP Ekosisteminde Sırada Ne Var?

1. **Ajanlar Arası İletişim (Agent-to-Agent MCP):** Önceden yalnızca tek bir istemci-sunucu ilişkisi varken, yeni modelde bir orchestrator agent başka bir uzman alt agent'ı bir MCP aracı olarak dinamik keşfedip çağırabiliyor.
2. **IDE Desteğinin Yaygınlaşması:** Cursor ve Claude Code'un ardından JetBrains ve Visual Studio resmi MCP istemci desteğini duyurdu.
3. **Güvenlik Politikaları (Sandboxing):** Araç yetkilerini sınırlandıran JSON Schema tabanlı izin şablonları sayesinde, geliştiriciler şirket ağında çalışırken güvenli MCP araç havuzları oluşturabiliyor.

---

## Sıkça Sorulan Sorular (FAQ)

### MCP 2026 spesifikasyonundaki en büyük değişiklik nedir?
En büyük değişiklik, protokolün çekirdeğinin durumsuz (stateless) hale getirilmesi ve HTTP/SSE üzerinden çalışan kurumsal Remote Server yapısının standart bir OAuth2 yetkilendirme katmanıyla entegre edilmesidir.

### Eski stdio tabanlı yerel MCP sunucuları çalışmaya devam edecek mi?
Evet. Geriye dönük uyumluluk korunmuştur. Bilgisayarınızdaki yerel `stdio` tabanlı MCP sunucuları aynı şekilde çalışmayı sürdürmektedir; yeni spesifikasyon mevcut yapıyı bozmadan uzaktan erişim ve akış yetenekleri eklemektedir.

### MCP ile standart bir REST API arasındaki fark nedir?
REST API'ler insan geliştiricilerin istemci yazması için tasarlanmıştır. MCP ise yapay zeka modellerinin araçları kendi kendine keşfetmesi (discovery), girdi şemalarını doğrulaması, kaynaklara abone olması ve bağlam penceresini aşmadan veri tüketmesi için optimize edilmiş iki yönlü bir protokoldür.

### Kendi projemde Remote MCP kullanmak için ne yapmalıyım?
`@modelcontextprotocol/sdk` kütüphanesinin güncel sürümünü yükleyip `SSEServerTransport` veya WebSocket taşıyıcısını kullanarak sunucunuzu deploy edebilir ve istemci konfigürasyonunuza sunucu URL'sini ekleyebilirsiniz.

---

## Sonuç

Model Context Protocol, yapay zekanın "yalnızca metin üreten bir sohbet kutusu" olmaktan çıkıp yazılım geliştiren, sunucuları yöneten ve veri tabanlarını sorgulayan otonom bir mühendise dönüşmesindeki en kritik köprüdür. 2026 spesifikasyonu ile birlikte MCP artık oyuncak bir betik kütüphanesi değil, kurumsal yazılım mimarilerinin kalıcı bir parçasıdır.
