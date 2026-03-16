---
title: "Claude Certified Architect: Sertifika Olmadan Bilmeniz Gereken Her Şey"
date: "2026-03-16"
excerpt: "Claude Certified Architect sınavı yalnızca Anthropic partner'larına açık. Arkasındaki bilgi herkese açık. Beş domain, gerçekten önemli olan her şey."
tags: ["Claude", "Claude Code", "MCP", "Agent SDK", "Claude API", "Agentic AI", "Production", "Mimari"]
---

Claude Certified Architect (Foundations) sınavı var. Claude Code, Agent SDK, Claude API ve Model Context Protocol'ü kapsıyor. Sınava girebilmek için Anthropic partner'ı olmanız gerekiyor.

Production-grade Claude uygulamaları geliştirmek için sertifikaya ihtiyacınız yok. Bilgiye ihtiyacınız var. Sınavın test ettiği konular — önemli olan kısımlar çıkarılmış haliyle.

---

## Beş Domain

| Domain | Ağırlık |
|--------|---------|
| Agentic Architecture & Orchestration | %27 |
| Claude Code Configuration & Workflows | %20 |
| Prompt Engineering & Structured Output | %20 |
| Tool Design & MCP Integration | %18 |
| Context Management & Reliability | %15 |

---

## Domain 1 — Agentic Architecture & Orchestration (%27)

En ağır domain. Hataların büyük çoğunluğu agentic döngünün nasıl çalıştığının yanlış anlaşılmasından kaynaklanıyor.

**Döngü:** İstek gönder → `stop_reason` alanını kontrol et → `tool_use` ise: aracı çalıştır, sonuçları ekle, devam et → `end_turn` ise: tamamlandı.

Sınavın özellikle test ettiği, hepsinin **yanlış** olduğu üç anti-pattern:

- Döngünün ne zaman biteceğini anlamak için doğal dili parse etmek
- Birincil durdurma mekanizması olarak keyfi iterasyon sınırı kullanmak
- `response.content[0].type == "text"` kontrolünü tamamlanma sinyali olarak kullanmak

`stop_reason` tam olarak bu iş için var. Kullanın.

**Multi-agent orchestration:** Coordinator merkezde yer alır. Subagent'lar etrafında konumlanır. Tüm iletişim coordinator üzerinden akar. Subagent'lar birbirleriyle doğrudan konuşmaz.

En yaygın yanlış anlama: **Subagent'lar coordinator'ın hafızasını paylaşmaz.** Konuşma geçmişini otomatik olarak devralmaz. Bir subagent'ın ihtiyaç duyduğu her bilgi prompt'unda açıkça geçirilmek zorunda.

**Enforcement:** Finansal veya güvenlik açısından kritik iş kuralları için prompt talimatları yeterli değildir. Bir prompt'un başarısız olma ihtimali sıfır değildir. Programatik hook'lar ve önkoşul kapıları her zaman çalışır. Tek bir hatanın maliyeti yüksekse, programatik enforcement kullanın.

**Görev ayrıştırma stratejileri:**

- *Sabit sıralı pipeline'lar* — önceden belirlenmiş adımlar, tutarlı ve güvenilir, yapılandırılmış görevler için ideal
- *Dinamik uyarlamalı ayrıştırma* — her adımda keşfedilene göre alt görevler oluşturulur, açık uçlu araştırma görevleri için ideal

Büyük kod tabanlarını işlerken dikkat dağılması gerçek bir sorundur. Büyük incelemeleri dosya bazlı yerel geçişler ve ayrı bir dosyalar-arası entegrasyon geçişi şeklinde bölün.

**Session yönetimi:** `--resume` ile önceki session'ı devam ettirin, `fork_session` ile paylaşılan bir noktadan dallanın, araç sonuçları eski kalmışsa veya dosyalar değiştiyse özet enjeksiyonuyla temiz başlangıç yapın.

**Ne geliştirmelisiniz:** İki subagent'lı bir coordinator, yapılandırılmış metadata ile düzgün context geçişi, programatik bir önkoşul kapısı ve bir `PostToolUse` normalleştirme hook'u. Bu tek alıştırma Domain 1'in büyük bölümünü kapsar.

---

## Domain 2 — Tool Design & MCP Integration (%18)

Araç açıklamaları tamamlayıcı değildir. Claude'un araç seçimi için kullandığı birincil mekanizmadır. Muğlak açıklamalar yanlış yönlendirmeye yol açar. Daha iyi açıklamalar neredeyse her zaman doğru ilk adımdır — few-shot örnekleri değil, routing classifier değil, araç birleştirme de değil.

**İyi bir araç açıklamasında bulunması gerekenler:**

- Aracın ne yaptığı (temel amaç)
- Beklenen girdiler — formatlar, tipler, kısıtlamalar
- İyi yönettiği örnek sorgular
- Ne zaman bu araç, ne zaman benzer araçlar kullanılmalı

**Araç yükü:** Bir agent'a 18 araç vermek seçim güvenilirliğini düşürür. Her subagent'ı kendi rolüyle ilgili 4–5 araçla sınırlayın.

**`tool_choice` seçenekleri:**

- `"auto"` — model metin dönebilir veya araç çağırabilir (varsayılan)
- `"any"` — model mutlaka bir araç çağırmalı, hangisini kendisi seçer
- `{"type": "tool", "name": "..."}` — model mutlaka bu belirli aracı çağırmalı

**Hata yanıtı yapısı** — dört kategori:

- *Geçici* — timeout, servis kullanılamıyor. Yeniden denenebilir.
- *Doğrulama* — geçersiz girdi. Girdiyi düzeltin, tekrar deneyin.
- *İş kuralı* — politika ihlali. Yeniden denenemez. Alternatif iş akışı gerekir.
- *Yetki* — erişim reddedildi. Escalation veya farklı kimlik bilgisi gerekir.

Geçerli bir boş sonuç (araç kaynağa ulaştı, hiçbir şey bulamadı) bir erişim hatası değildir. Yeniden denemeyin.

**MCP yapılandırma kapsamı:**

- Proje düzeyi (`.mcp.json`) — sürüm kontrolünde, takımla paylaşılan
- Kullanıcı düzeyi (`~/.claude.json`) — kişisel, paylaşılmayan

Standart entegrasyonlar için community MCP server'larını kullanın (GitHub, Jira, Slack). Yalnızca community server'larının karşılayamadığı takıma özel iş akışları için özel server geliştirin.

**Dahili araç farkı:**

- `Grep` — dosya *içeriklerinde* pattern arar
- `Glob` — dosya *yollarını* adlandırma kalıplarıyla eşleştirir

Hangisine ne zaman uzanacağınızı bilin.

---

## Domain 3 — Claude Code Configuration & Workflows (%20)

Bu domain, Claude Code kullananlarla onu takım için yapılandıranları ayıran noktadır.

**CLAUDE.md hiyerarşisi:**

- *Kullanıcı düzeyi* (`~/.claude/CLAUDE.md`) — yalnızca size uygulanır. Sürüm kontrolünde değil, git üzerinden paylaşılmaz.
- *Proje düzeyi* (`.claude/CLAUDE.md`) — herkese uygulanır. Sürüm kontrolünde. Takım genelindeki standartlar burada yaşar.
- *Dizin düzeyi* — yalnızca o dizinde çalışırken uygulanır.

Sınavın en sevdiği tuzak: Yeni bir takım üyesinin talimatları almaması, çünkü talimatlar proje düzeyi yerine kullanıcı düzeyinde tanımlanmış.

**Path-specific rules** (`.claude/rules/`) YAML frontmatter ile:

```yaml
---
paths: ["**/*.test.tsx"]
---
```

Bu kurallar tüm kod tabanında eşleşen dosyalara uygulanır. Dizin düzeyindeki CLAUDE.md yalnızca kendi dizinine uygulanır. 50'den fazla dizine yayılmış test dosyaları için path-specific rules kazanır.

**Skill frontmatter seçenekleri:**

- `context: fork` — izole bir sub-agent context'inde çalışır. Uzun çıktılar ana konuşmayı kirletmez. Analiz ve beyin fırtınası için kullanın.
- `allowed-tools` — skill'in kullanabileceği araçları kısıtlar. Skill çalışırken yıkıcı işlemleri önler.

**Plan modu vs doğrudan çalıştırma:**

Plan modunu kullanın: monolith yeniden yapılandırma, çok dosyalı migration, kütüphane yükseltme, mimari kararlar.

Doğrudan çalıştırmayı kullanın: tek dosya hata düzeltmeleri, kapsamı net ve iyi anlaşılmış değişiklikler.

**CI/CD:** `-p` flag'i Claude Code'u non-interactive (print) modda çalıştırır. Bu olmadan bir CI görevi girdi beklerken askıda kalır. `--output-format json` ve `--json-schema` ile otomatik PR yorumları için makine tarafından okunabilir çıktı üretir.

Bağımsız bir review instance, aynı session'da self-review'dan daha fazla sorun yakalar — model kendi kararlarını sorgulamayı zorlaştıran reasoning bağlamını elinde tutar.

---

## Domain 4 — Prompt Engineering & Structured Output (%20)

İki kelime: açık olun.

"Muhafazakâr ol" hassasiyeti artırmaz. "Yalnızca yüksek güvenilirlikli bulguları raporla" false positive'leri azaltmaz. İşe yarayan şey: her önem düzeyi için somut kod örnekleriyle hangi sorunları raporlayıp hangilerini geçeceğinizi tam olarak tanımlamak.

**Few-shot örnekleri** bu domain'in en yüksek kaldıraçlı tekniğidir. Belirsiz durumlar için 2–4 hedefli örnek, her biri neden bir eylem makul alternatiflere tercih edildi sorusunu yanıtlayan gerekçesiyle. Ek açıklama talimatlarından daha etkili.

**`tool_use` ve JSON şemaları** sözdizimi hatalarını tamamen ortadan kaldırır. Semantik hataları önlemez (toplam tutmayan kalemler, yanlış alanlara konan değerler, zorunlu alanlar için üretilen değerler).

**Şema tasarım ilkeleri:**

- Kaynakta bilgi bulunmayabileceğinde optional/nullable alanlar — bu fabrication'ı önler
- Belirsiz durumlar için `"unclear"` enum değerleri
- Genişletilebilir kategorizasyon için `"other"` + serbest metin alanı

**Validation-retry döngüleri:** Orijinal belgeyi, başarısız çıkarımı ve spesifik doğrulama hatasını geri gönderin. Format uyumsuzlukları ve yapısal hatalar için etkili. Kaynakta gerçekten bulunmayan bilgiler için değil.

**Message Batches API:**

- %50 maliyet tasarrufu
- 24 saate kadar işlem süresi
- Gecikme garantisi yok
- Tek bir istekte multi-turn araç çağrısını desteklemez

Kural: Senkron API — bloklayan iş akışları için (pre-merge kontroller). Batch API — gecikmeye toleranslı iş akışları için (gece raporları, test üretimi).

---

## Domain 5 — Context Management & Reliability (%15)

En düşük ağırlık. Buradaki hatalar her yere yayılır.

**Progressive summarization tuzağı:** Konuşma geçmişini özetlemek "Müşteri 3 Mart'ta #8891 siparişi için 247,83 TL iade istiyor" bilgisini "müşteri yakın tarihli bir sipariş için iade istiyor" haline getirir. Çözüm: işlemsel gerçekleri kalıcı bir "case facts" bloğuna çıkarın. Her prompt'a ekleyin. Asla özetlemeyin.

**"Ortada kaybolma" etkisi:** Modeller uzun girdilerin başını ve sonunu güvenilir biçimde işler. Ortaya gömülü bulgular gözden kaçabilir. Önemli özetleri başa koyun ve açık bölüm başlıkları kullanın.

**Geçerli escalation tetikleyicileri (üç tane):**

1. Müşteri açıkça insan istiyor — hemen yerine getirin, önce çözmeye çalışmayın
2. Politika boşlukları — istek belgelenmiş politikanın dışında kalıyor
3. Anlamlı ilerleme sağlayamama

**Sınavın sizi kandırmaya çalışacağı güvenilmez tetikleyiciler:**

- Sentiment analizi — hayal kırıklığı vaka karmaşıklığıyla orantılı değil
- Self-reported güven skorları — model zor durumlarda aşırı, kolay durumlarda az güvenli olabiliyor

**Doğru hata yayılımı:**

Yapılandırılmış bağlam: hata türü, ne denendiği, toplanan kısmi sonuçlar, potansiyel alternatifler.

Kaçınılması gereken anti-pattern'lar: hataları sessizce bastırmak (kurtarmayı engeller) ve tek bir hata nedeniyle tüm iş akışını sonlandırmak (kısmi sonuçları çöpe atmak).

**Uzun session'larda bağlam bozulması:** Model daha önce keşfettiği belirli sınıflar yerine "tipik pattern'lar"a atıfta bulunmaya başlar. Hafifletmeler: önemli bulgular için scratchpad dosyaları, belirli araştırmalar için subagent delegasyonu, bağlam dolduğunda `/compact`.

---

## Nereden Öğrenirsiniz

Anthropic'in kendi kaynakları, domain'e göre sıralanmış:

**Domain 1 — Agentic Architecture**
- Agent SDK Overview — agentic döngü mekaniği ve subagent pattern'ları
- Building Agents with the Claude Agent SDK — hook'lar, orchestration, session'lar

**Domain 2 — Tool Design & MCP**
- [MCP Integration for Claude Code](https://docs.anthropic.com) — server kapsama, ortam değişkeni genişletme
- [Model Context Protocol specification](https://modelcontextprotocol.io)

**Domain 3 — Claude Code Configuration**
- [Claude Code resmi dokümantasyonu](https://docs.anthropic.com/en/docs/claude-code) — CLAUDE.md hiyerarşisi, rules dizini, slash commands

**Domain 4 — Prompt Engineering**
- [Anthropic Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Tool Use dokümantasyonu](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)

**Domain 5 — Context Management**
- Building Agents with the Claude Agent SDK — escalation, hata yayılımı

---

## Geliştirme Yolu

Bu materyali okuyarak öğrenmezsiniz. Geliştirerek öğrenirsiniz:

1. `stop_reason` yönetimi, `PostToolUse` normalleştirme hook'u ve araç çağrısı kesme hook'u olan çok araçlı bir agent
2. İki subagent'lı coordinator — yapılandırılmış metadata ile context geçişi, programatik önkoşul kapısı
3. CLAUDE.md hiyerarşisi, glob pattern'lı `.claude/rules/`, `context: fork` kullanan bir skill, `-p` flag'li CI script'i olan proje
4. Zorunlu, opsiyonel ve nullable alanlı `tool_use` extraction pipeline'ı — validation-retry döngüsü ve batch işleme

Dört geliştirme. Sınavın büyük bölümü kapsanmış.

---

Sertifika partner erişimi gerektirir. Bilgi gerektirmez.
