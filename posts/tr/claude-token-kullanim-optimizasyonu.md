---
title: "Claude Token Limitine Bir Daha Takılmayacaksın: 5 Adımda Tam Optimizasyon Rehberi"
date: "2026-05-03"
excerpt: "Claude'u yanlış kullanıyorsun. Güncel token limitleri, model seçimi ve 5 pratik adımla hem üretkenliğini artır hem de planını optimize et."
tags: ["Claude", "Claude Code", "Token Optimizasyonu", "Anthropic", "Yapay Zeka", "Üretkenlik", "AI", "Claude Opus", "Claude Sonnet", "Prompt Mühendisliği"]
category: "Araçlar"
---

Dürüst olalım: Claude'un kullanım limitleri gerçekten can sıkıcı.

Yoğun bir prompting seansının ortasındasın ve birden birkaç saatliğine kullanım limitine takılıyorsun. Bu durum aylık 200 dolarlık Anthropic planında bile oluyor. Rate limitler üretkenliğini ciddi şekilde kesen bir darboğaz haline geliyor.

Ama şu an anlayacağın şey şu: **Aslında Claude'u tamamen yanlış kullanıyordun.**

Bu yazıda Claude'un gerçekte nasıl çalıştığını, güncel token limitlerinin ne durumda olduğunu ve 5 somut adımla bu sorunu nasıl kökten çözeceğini açıklıyorum. Sonunda bir de tüm ipuçlarını özetleyen best practices bölümü var.

---

## Claude 2026: Güncel Model ve Limit Tablosu

Başlamadan önce mevcut durumu netleştirelim. Anthropic'in model ailesinde şu an üç ana seviye var:

| Model | Kullanım Amacı | Hız | Maliyet |
|-------|---------------|-----|---------|
| **Claude Haiku 4.5** | Hafif işler, sınıflandırma, özet | En hızlı | En ucuz |
| **Claude Sonnet 4.6** | Genel kullanım, dengeli görevler | Hızlı | Orta |
| **Claude Opus 4.7** | Karmaşık akıl yürütme, final kalite | Daha yavaş | En pahalı |

### Claude.ai Abonelik Seviyeleri ve Token Limitleri

**Free Plan:** Günlük mesaj limiti var. Sonnet'e sınırlı erişim, Opus'a erişim yok.

**Pro ($20/ay):** Standart kullanım limiti. Claude.ai'da Opus dahil tüm modellere erişim. Yoğun kullanımda sınıra takılma ihtimali yüksek.

**Max Plan (~$100/ay):** Pro'nun 5 katı veya 20 katı kullanım limiti (tercihine göre). Ağır kullanıcılar için tasarlanmış.

**Team / Enterprise:** Kurumsal limitler, yönetilen politikalar.

**Claude Code:** Claude.ai aboneliğini veya direkt API'yi kullanır. Claude Code içinde `/usage` komutuyla anlık kullanımını görebilirsin.

> **Önemli:** Anthropic, token limitlerini tam olarak yayınlamıyor. Sistem kullanım yoğunluğuna göre dinamik biçimde ayarlanıyor. Yani sabah 09:00'daki limit akşam 23:00'daki limitten farklı olabilir.

---

## Adım 1: Planlama — Token'ların Büyük Bölümü Burada Heba Oluyor

Claude'a tek bir prompt göndermeden önce tam olarak ne istediğini bilmelisin.

Çoğu hesabı denetlesek ciddi miktarda prompt israfının **beyin fırtınası aşamasında** olduğunu görürüz. Claude brainstorming için güçlü bir araç ama Opus ile brainstorming yapmak ciddi kaynak israfı.

### Neden?

Brainstorming doğası gereği iteratif ve keşifsel bir süreçtir. Her turda yeniden açıklarsın, geri dönüş alırsın, yeniden yönlendirirsin. Bu sürecin her adımı token tüketir. Ama bu adımların çoğu gerçekte ucuz bir modelle de aynı kalitede çalışır.

### Çözüm: Model Katmanlama

```
Brainstorming / Planlama → Haiku
Orta karmaşıklık / Taslak → Sonnet  
Final üretim / Kritik karar → Opus
```

### Somut Örnek

İki kişi bir finans takip uygulaması geliştiriyor:

**Kişi A:**
- 2 dakika planlama, Opus ile direkt üretim
- Yanlış çıktı → baştan yapıyor
- Toplamda 3 kez yeniden yapıyor

**Kişi B:**
- 20 dakika Haiku ile planlama ve seçenekleri keşfetme
- Netleşince Opus'a geçip tek seferde yapıyor

**Sonuç:** Kişi B bu görevde yaklaşık %67 token tasarrufu sağlıyor.

### Claude Code'da Plan Mode

Claude Code kullanıyorsan özel **Plan Mode** var:

- `Shift + Tab` tuşuna iki kez bas
- Ya da doğrudan `/plan` yaz

Plan Mode'da Claude kod yazmak yerine önce ne yapacağını açıklar, onayını bekler. Yanlış yönde giden uzun bir session'dan çok daha az token harcar.

**Kısaca: Daha fazla planla, brainstorming için ucuz model kullan, inşa aşamasına Opus ile gir.**

---

## Adım 2: Sohbet Uzunluğu — Sessiz Token Katili

Aynı görev için sürekli tek bir sohbet kullanıyorsan şunu anlamalısın:

**Uzun bir sohbet = Claude'a sürekli eski bağlamı tekrar okutmak demektir.**

Her yeni mesajda Claude o sohbetin tamamını bağlam olarak işlemek zorundadır. 50 mesajlık bir sohbet varsa Claude 51. mesajın cevabını üretmek için önce 50 mesajı okumak zorunda. Bu:

- Daha fazla token harcar
- Yanıt süresini uzatır
- Gereksiz bağlamla çıktı kalitesini düşürür

### Çözüm 1: Projects Kullan

Tek bir uzun sohbet yerine **Project** oluştur.

Örnek yapı:

```
Proje: X-Writing
├── Sohbet: Blog İçeriği — Nisan
├── Sohbet: Sosyal Medya — Mayıs
└── Sohbet: Newsletter — Mayıs
```

Yeni bir içerik yazacağın zaman aynı uzun sohbeti sürdürmek yerine yeni bir sohbet açarsın. Proje talimatlarını bir kez yazarsın, her sohbette geçerli olur.

**Project talimatlarına şunu ekle:**

> "Hesap kullanımımı azaltmaya çalışıyorum. Kısa ve öz yanıt ver. Gerektiğinde yeni sohbet açmamı veya token kullanımını azaltacak diğer yöntemleri öner."

### Çözüm 2: Mega Prompt Yöntemi

Uzun bir sohbet biriktirdiysen ve devam etmek istiyorsan:

Claude'a şunu söyle:
> "Yeni bir sohbete geçiyorum. Bu oturumu, tüm bağlamı koruyarak yeniden başlatmamı sağlayacak bir prompt hazırla."

Claude mevcut sohbetin sıkıştırılmış özetini ve devam için gereken tüm bağlamı içeren bir prompt yazar. Bunu yeni sohbette kullanırsın.

**Altın kural: 3 kısa sohbet, 1 aşırı uzun sohbetten her zaman daha iyidir.**

---

## Adım 3: Doğru Hafıza Sistemi — Kendini Tekrar Etmeyi Bırak

Claude'un en büyük sorunlarından biri **bağlamı unutmasıdır.**

Bu da seni sürekli aynı şeyleri yeniden açıklamaya zorlar. Her açıklama token, her token para demek.

### Hızlı Çözüm: İki Markdown Dosyası

Masaüstünde veya bir klasörde iki markdown dosyası oluştur:

#### 1. Instructions.md

Claude'a temel kurallarını anlat:

```markdown
## Kimim
[Kısa tanıtım — Claude'un seni tanıması için]

## Ne yapıyorum
[Ana iş/proje açıklaması]

## Kurallar
- Em dash kullanma
- Türkçe yaz
- Kısa cümleler kur
- [Diğer tercihler]

## Önemli
Update Memory.md with my preferences over time.
```

Son satır kritik. Claude'a ikinci dosyayı sürekli güncellemesini söylüyor.

#### 2. Memory.md

Bu Claude'un "beyni" gibi çalışır:

```markdown
## Öğrenilen Tercihler
- Em dash kullanmayı sevmiyor
- Başlıklarda soru işareti tercih ediyor
- Kısa cümleler istiyor
- Teknik terimler için İngilizce-Türkçe karma kullanıyor

## Düzeltmeler
- 2026-04: "Sonuç olarak" ile başlama
- 2026-04: Listeleri numaralarla değil madde işaretiyle ver
```

Bu iki dosyayı **Claude Code'un CLAUDE.md sistemine** veya **Projects talimatlarına** bağla. Bir kez kurduğunda geri dönmek istemezsin.

### Claude Code'da Memory Sistemi

Claude Code zaten yerleşik bir memory sistemi sunuyor:

- `~/.claude/CLAUDE.md` → global tercihler
- `.claude/CLAUDE.md` → proje bazlı tercihler
- `/memory` komutu → hafızaya yeni şeyler ekle

---

## Adım 4: Model Seçimi ve Katmanlama — Her İş İçin Doğru Model

Her şey için Opus 4.7 kullanmak tam anlamıyla israf.

Görevlerin **%90'ı** için daha ucuz modeller aynı kalitede çıktı üretir.

### Escalate Sistemi

```
Haiku 4.5     →  Sonnet 4.6   →   Opus 4.7
(Hafif işler)    (Orta işler)     (Ağır işler / final)
```

**Haiku için uygun görevler:**
- Metin sınıflandırma
- Özet çıkarma
- Basit soru-cevap
- Format dönüştürme
- Brainstorming ve keşif

**Sonnet için uygun görevler:**
- Blog yazısı taslağı
- Kod yazma ve debug
- Araştırma ve analiz
- Çeviri

**Opus için uygun görevler:**
- Karmaşık mimari kararlar
- Uzun form içerik — final versiyon
- Kritik hata analizi
- Yüksek riskli kod değişiklikleri

### Ekstra Token Tasarruf İpuçları

**1. Extended / Adaptive Thinking'i Kapat**

Bu özellik Claude'un yanıt vermeden önce uzun süre "düşünmesini" sağlar. Çoğu görev için gerekli değil ve ciddi token harcar. Varsayılan olarak kapalı tut, yalnızca gerçekten karmaşık problemlerde aç.

**2. Concise Style Seç**

Claude.ai ana sayfasında "Styles" bölümünden **Concise** modunu seç. Claude yanıtlarını otomatik olarak kısaltır.

**3. Claude Code'da Low Effort**

Claude Code içinde çoğu görev için **Low** effort seviyesini seç. Ara adımlar ve gereksiz açıklamalar azalır, doğrudan sonuca gider.

**4. Sadece Claude Kullanmak Zorunda Değilsin**

Bazı görevler için açık kaynaklı veya farklı modeller daha mantıklı:

- **Kimi / DeepSeek V4:** Araştırma ve veri işleme için güçlü ve ucuz seçenekler
- **Yerel modeller (Ollama):** Tekrarlayan, standart görevler için API maliyeti yok
- **Özel araçlar:** Haber scraping, RSS okuma gibi işlemler için Claude şart değil

---

## Adım 5: Araç Bölme ve Optimizasyon — Hangi Araç Ne İçin?

Birçok kişi Claude araçlarının farklı kullanım parametrelerine sahip olduğunu bilmiyor.

### Claude Araç Ekosistemi

| Araç | Kullanım Limiti | En İyi Kullanım |
|------|----------------|-----------------|
| **Claude.ai Chat** | Abonelik planına bağlı | Genel sohbet, araştırma |
| **Claude Code** | Abonelik veya API | Kod geliştirme, dosya işlemleri |
| **Claude API** | Token bazlı ücretlendirme | Uygulama entegrasyonu |

**Kritik nokta:** Claude Code tokenlerini görsel tasarım için harcama. Eğer Claude Design veya başka bir araçta ayrı kullanım hakkın varsa, araçları amaçlarına göre kullan.

### Claude Code'da Kullanım Takibi

```bash
/usage
```

Bu komut mevcut kullanım istatistiklerini gösterir. Limite yaklaştığında davranışını değiştirerek kalanı verimli kullanabilirsin.

### Ekstra Kredi vs Plan Yükseltme

Ara ara limit sorunun varsa plan yükseltmek yerine **ekstra kredi almak** daha mantıklı olabilir.

Sürekli yoğun kullanıcıyssan Max plan hesabını. Ama ayda 3-4 kez yoğun kullanım yaşıyorsan, yıllık plan yerine o dönemler için ekstra kredi almak daha ekonomik.

### Claude Skills ile Otomasyon

Tekrarlayan görevleri otomatikleştirmek için **Skills** kullan:

```yaml
---
name: blog-yaz
description: Blog yazısı taslağı oluştur
---
Şu konuda 800 kelimelik blog yazısı taslağı hazırla: $ARGUMENTS
Format: H2 başlıklar, kısa paragraflar, sonuç bölümü
Dil: Türkçe, SEO uyumlu
```

Bir kez yazarsın, her seferinde `/blog-yaz "konu başlığı"` ile çağırırsın. Aynı talimatları tekrar tekrar yazmak yerine tutarlı ve kısa promptlar kullanırsın.

---

## Güncel Claude Durumu: 2026'da Neredeyiz?

Bu rehberi okurken aklında bulunması gereken bazı bağlamlar:

**Anthropic'in son adımları:**
- **Claude claude-sonnet-4-6** şu an ana model olarak geniş kullanımda
- **Claude Opus 4.7** en kapsamlı model, Fast Mode ile Opus hızında çalışabiliyor
- **Claude Haiku 4.5** hız/maliyet dengesinde en iyi seçenek

**Claude Code gelişmeleri:**
- Auto Mode ile izin onayları otomatikleşti
- Skills sistemi açık standartla genişledi (agentskills.io)
- MCP entegrasyonları araç ekosistemini genişletiyor

**Önemli gerçek:** Anthropic token maliyetlerini düşürüyor ama kullanım miktarı da artıyor. Optimizasyon alışkanlıkları zamanla daha değerli hale geliyor, değersizleşmiyor.

---

## En Sonunda: Tüm İpuçları İçin Best Practices

Tüm adımları uyguladıktan sonra bile optimize etmeye devam etmeni sağlayacak ilkeler:

### Planlama ve Hazırlık

- [ ] Her oturum öncesi ne istediğini 2-3 cümleyle netleştir
- [ ] Brainstorming için Haiku veya Sonnet kullan, Opus'u finale sakla
- [ ] Claude Code'da `/plan` ile başla, onayladıktan sonra üretimi başlat
- [ ] Uzun projeler için önce CLAUDE.md veya project talimatları yaz

### Sohbet Yönetimi

- [ ] Görev değiştiğinde yeni sohbet aç, eski sohbeti taşıma
- [ ] Uzun sohbet biriktirdiysen "mega prompt" yöntemiyle sıkıştır
- [ ] Project yapısını kullan — aynı uzun sohbet yerine konu bazlı alt sohbetler
- [ ] Sohbet başına 20-30 turdan fazla gitme, verimlilik düşer

### Model Seçimi

- [ ] "Bu görev Haiku'ya düşer mi?" diye sor önce
- [ ] Sonnet'i varsayılan olarak kullan, gerçekten gerekmedikçe Opus'a geçme
- [ ] Extended Thinking'i varsayılan olarak kapalı tut
- [ ] Claude.ai'da Concise modu aktif et

### Hafıza ve Bağlam

- [ ] Instructions.md + Memory.md ikiliyi kur ve güncel tut
- [ ] Tekrar ettiğin şeyleri fark ettiğinde skill veya talimat yaz
- [ ] CLAUDE.md'ye sık kullandığın kuralları ekle
- [ ] Correction yaptığında Memory.md'yi güncelle

### Araç Kullanımı

- [ ] `/usage` komutuyla düzenli kullanım takibi yap
- [ ] Araçları amaçlarına göre kullan — Code için kod, Chat için sohbet
- [ ] Tekrarlayan görevler için Skills yaz
- [ ] Her görev için en uygun aracı seç, Claude her şeyin cevabı değil

### Ekonomi

- [ ] Plan yükseltme vs ekstra kredi kararını kullanım sıklığına göre ver
- [ ] API kullanıyorsan prompt caching'i aktif et — tekrarlayan bağlam maliyetini %90'a kadar düşürür
- [ ] Yüksek hacimli tekrarlayan görevler için Batch API değerlendir

---

## Sonuç

Bu beş adım birlikte çalıştığında fark büyük oluyor. Daha iyi planlıyorsun, daha kısa sohbetler yürütüyorsun, doğru model seçimi yapıyorsun ve gereksiz bağlam taşımıyorsun.

Token limitlerine takılmak çoğu zaman teknik bir sorun değil — kullanım alışkanlığı sorunudur. Ve alışkanlıklar değişir.

---

*İlham: Miles Deutscher — [agentskills.io](https://agentskills.io) — [Anthropic Docs](https://docs.anthropic.com)*
