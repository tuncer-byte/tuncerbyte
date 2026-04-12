---
title: "Başarılı Bir Rate Limiting Nasıl Kurgulanmalı?"
date: "2026-04-10"
excerpt: "Rate limiting nedir, hangi algoritmalar var ve sisteminize hangisi uyar? Token Bucket'tan Sliding Window'a dört temel yaklaşım, fark ve trade-off'larıyla."
tags: ["Rate Limiting", "Backend", "Sistem Tasarımı", "Token Bucket", "Leaky Bucket", "Algoritma", "API", "Güvenlik", "Mimari"]
category: "Teknoloji"
---

Zaman zaman kod yazma sürecinden bir adım geri atıp daha geniş bir perspektiften bakmaya çalışıyorum.

Günümüzde sistemler dakikalar içinde onlarca, hatta yüzlerce isteği işlemek zorunda. Bu isteklerin bir kısmı meşru — gerçek kullanıcılar, gerçek işlemler. Bir kısmı ise kötü niyetli: sistemi yormak, bozmak ya da veri çalmak amacıyla gönderilmiş istekler.

**Rate limiting**, bu tehditlere karşı korunmanın en etkili yollarından biri. Basit tanımıyla: bir kullanıcının belirli bir zaman aralığında sisteme atabileceği maksimum istek sayısını belirler.

Ama burada kritik bir soru var.

## Her Sistem için Aynı Yaklaşım Uygun mu?

Hayır.

Her sistemin dinamikleri ve iç yapıları farklıdır. Bazı sistemler günde binlerce isteğe izin verirken, diğerleri dakikalar içinde kısıtlamaya gider. Hatta aynı sistem içindeki mikro-servisler bile farklı stratejiler gerektirebilir.

Dolayısıyla "en iyi rate limiting stratejisi" diye bir şey yok. Doğru strateji, ihtiyacınıza ve sisteminizin yapısına göre değişir.

Şimdi dört temel algoritmaya bakalım.

## 1. Token Bucket Algoritması

En yaygın ve anlaşılması en kolay yaklaşım.

Mantığı basit: Kullanıcıya belirli bir zaman diliminde sabit sayıda "token" verilir. Her istek bir token tüketir. Süre dolunca token havuzu yenilenir. Token bitmişse istek reddedilir.

**Örnek:** "Tuncer bu sisteme 1 dakika içinde 20 istek atabilir."

**Nasıl çalışır:**
- Her kullanıcıya bir token havuzu atanır
- Her istek bir token düşürür
- Belirlenen süre bitince havuz yenilenir
- Token yoksa istek `429 Too Many Requests` döner

**Avantajları:**
- Uygulanması basit
- Anlık spike'ları absorbe eder — token havuzunda yeterli token varsa

**Dezavantajı:**
- Yüksek trafik spike'larında sistem aşırı yüklenebilir. Herkesin tokeni varsa, aynı anda hepsi istek atar

---

## 2. Leaky Bucket Algoritması

Fiziksel bir metafor üzerine kurulu: Bir kova düşünün, altında küçük bir delik var.

Ne kadar hızlı su dökersen dök — kova sabit bir hızda boşalır. Kova dolarsa yeni su taşar, yani reddedilir.

Sisteme çevirirsek: İstekler ne kadar hızlı gelirse gelsin, sistem onları sabit bir hızda işler. Kuyruk dolarsa yeni istekler reddedilir.

```
Token Bucket  → Spike'ları kabul et, tümünü işle
Leaky Bucket  → Spike'ları sınırla, sabit hızda işle
```

**Nerede kullanışlı?**

Örneğin, bir loglama sistemi düşünün. ElasticSearch'e bağlı bir servis. Normal zamanlarda sorunsuz. Ama bir anda trafik 10 katına çıktı.

- **Token Bucket** şöyle davranır: "Tamam, geç." Ve ElasticSearch bunalır.
- **Leaky Bucket** şöyle davranır: "Ben yine aynı hızda yazarım." Ve sistemi korur.

Kritik loglar (ERROR, WARN) her zaman kuyruğa alınır. Düşük öncelikli loglar (INFO, DEBUG) kuyruk dolunca düşürülür.

**Avantajı:** Downstream sistemleri aşırı yükten korur, sabit ve tahmin edilebilir bir çıktı sağlar

**Dezavantajı:** Meşru spike'ları da kesiyor — yüksek anlık yük gereken sistemler için uygun değil

---

## 3. Fixed Window (Sabit Pencere) Algoritması

Bankacılık sektöründe sıkça karşılaştığınız yaklaşım budur.

"Günde maksimum 5 EFT talebi oluşturabilirsiniz." Bu kural Fixed Window'dur.

**Nasıl çalışır:**
- Zaman eşit pencerelere bölünür (saat, gün, ay, yıl)
- Her pencerede istek sayısı sayılır
- Limit aşılırsa o pencere boyunca istekler reddedilir
- Yeni pencere başlayınca sayaç sıfırlanır

**Sorun: Boundary Exploitation**

Bu algoritmada ciddi bir güvenlik açığı var.

Diyelim ki günlük 100 istek limitiniz var. Gece 23:59'da 100 istek attınız, hemen 00:01'de 100 istek daha attınız. Sistem bu iki grubu farklı günler olarak görür — ve hepsi geçer.

2 dakikada 200 istek. Limit 100'dü.

Bu soruna **boundary exploitation** denir. Fixed Window'un en büyük zayıflığı budur.

---

## 4. Sliding Window Log Algoritması

Fixed Window'un açığını kapatmak için geliştirilmiş yöntem.

Fark şu: Zaman penceresi sabit başlangıç noktasından değil, her istekten geriye doğru hesaplanır.

**Örnek:** Günlük 100 istek limitiniz var. İlk isteği 16:00'de attınız. O limitin sıfırlanma süresi artık ertesi gün 16:00'dir — gece yarısı değil.

Her yeni istek için pencere "kayar." Boundary exploitation mümkün değil.

**Avantajı:** %100 doğruluk. Zaman sınırları asla istismar edilemez.

**Dezavantajı:** Her işlemle birlikte timestamp tutmak gerekir. 1 milyon, 10 milyon, 100 milyon işlemde bu devasa bir depolama ihtiyacı yaratır. Redis gibi in-memory çözümler bu yükü hafiflетir ama yok etmez.

---

## Hangi Algoritmayı Seçmeli?

| Algoritma | Uygulama Kolaylığı | Spike Toleransı | Doğruluk | Bellek Maliyeti |
|---|---|---|---|---|
| Token Bucket | ✅ Kolay | ✅ Yüksek | Orta | Düşük |
| Leaky Bucket | Orta | ❌ Yok | Orta | Düşük |
| Fixed Window | ✅ Kolay | Orta | ⚠️ Düşük | Düşük |
| Sliding Window Log | Zor | Orta | ✅ Yüksek | ⚠️ Yüksek |

Cevap sisteme göre değişir:

- **Genel API limitleri için** → Token Bucket yeterli
- **Downstream sistemi korumak için** → Leaky Bucket
- **Bankacılık / compliance kuralları için** → Fixed Window (basitlik önceliktir)
- **Kesin doğruluk gereken güvenlik sistemleri için** → Sliding Window Log

---

## Sonuç

Burada önemli olan, ihtiyacı iyi analiz edip sisteme uygun yapıyı kurmak.

Hangi algoritmanın "en iyi" olduğu sorusu yanlış soru. Doğru soru: hangi algoritma sizin spesifik probleminize uyuyor?

Her çözümün faydaları ve maliyetleri var. Doğru seçimi yapabilmek — bütün bu trade-off'ları görüp bilinçli karar vermek — gerçek mühendislik becerisidir.
