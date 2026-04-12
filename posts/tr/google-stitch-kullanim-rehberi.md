---
title: "Google Stitch Kullanım Rehberi: Doğru Prompttan Mükemmel Tasarıma"
date: "2026-03-20"
excerpt: "Google Stitch'i açtın ama nerede başlayacağın belli değil. Bu rehber tam bunun için: ilk prompttan production-ready tasarıma kadar her şey."
tags: ["Google Stitch", "Yapay Zeka", "UI Tasarımı", "Prompt", "Figma", "Gemini", "Araçlar", "Vibe Design"]
category: "Teknik"
---

[Geçen yazıda](/tr/blog/google-stitch-vibe-design) Google Stitch'in ne olduğunu ve neden önemli olduğunu anlattım. Bu yazı onun devamı — ama farklı bir açıdan. Araçla ilk kez tanışanlar için değil, "tamam açtım, şimdi ne yapacağım?" diye düşünenler için.

Stitch'i geçtiğimiz haftalarda ciddi şekilde kullandım. Şunu söyleyebilirim: doğru prompt'u bilmeden açmak, Figma'dan daha da sinir bozucu olabiliyor. Ama doğru alışkanlıkları edindikten sonra hız gerçekten farklı bir boyuta geçiyor.

## Önce Şunu Bil: Ne Yapıyorsun?

Stitch'e girince ilk soru geliyor: **Mobile App mi, Web App mı?**

Bu seçim görünenden daha önemli. Stitch, seçtiğin platforma göre tipografi hiyerarşisini, bileşen boyutlarını ve görselleri optimize ediyor. Mobil için seçersen dokunmatik hedef boyutları, web için seçersen masaüstü göz akışı ön plana çıkıyor.

Kural basit: Kullanıcılarının çoğu nerede? Oradan başla.

## Prompt Yazmak Bir Sanat

Çoğu insan Stitch'ten 7/10 çıktı alıyor çünkü prompt'larını yanlış yazıyor. İyi bir prompt üç katmandan oluşuyor:

**Fikir:** Ne yapmak istiyorsun? Asıl amacın ne?
**Tema:** Görsel ton nedir? Cesur mu, minimal mi, kurumsal mı?
**İçerik:** Kullanıcıyı ne yaptırmak istiyorsun?

Kötü prompt:
```
Bir e-ticaret sitesi yap
```

İyi prompt:
```
Japonya ilhamıyla tasarlanmış bir çay mağazası için ürün detay sayfası.
Bitkisel çaylar ve seramik kap satıyor. Nötr, minimal renkler, siyah butonlar.
Soft, zarif bir yazı tipi. Beyaz alan kullan, kalabalık olmayan bir düzen.
```

Fark net. Stitch bir tasarımcı değil, direktif beklenen bir motor. Ne kadar net anlatırsan o kadar net çıktı alırsın.

### Adım Adım Doğru Yaklaşım

**1. Önce genel, sonra detay**

İlk prompt'ta her şeyi tanımlamaya çalışma. Genel bir yönle başla, Stitch bir iskelet çıkarsın. Sonra ekrana ekrana in:

```
Login ekranındaki ana CTA butonunu büyüt ve marka için birincil mavi rengi kullan.
```

**2. Sıfatlar ton belirler**

Renk, font, hava — bunların hepsini sıfatlarla yönlendirebilirsin:

```
Canlı ve motive edici bir fitness takip uygulaması
```
```
Meditasyon için minimal ve odaklanmış bir uygulama
```

Aynı işlevsellik, tamamen farklı iki çıktı.

**3. Tema kontrolü doğrudan yap**

```
Ana rengi orman yeşiline çevir
```
```
Başlıklarda serif font kullan
```
```
Tüm butonları tam yuvarlak köşeli yap
```
```
Input alanlarına 2px siyah border ekle
```

Bunları birleştirebilirsin de:

```
Kitap keşif uygulaması: başlıklar için serif font, aksanlar için açık yeşil marka rengi.
```

## Hangi Modu Kullanmalısın?

Stitch'in arka tarafında birden fazla model çalışıyor. Menüde gizli olan bu modlar, ne yapmaya çalıştığına göre değişiyor:

**Thinking (3.1 Pro)** → Karmaşık dashboard'lar, üretim hazır sayfalar. Zaman alır, kredi yer. Ama fark önemli olduğunda değer.

**Redesign (Nano Banana Pro)** → Mevcut bir arayüzü estetik olarak yükseltmek için. Bento grid, Glassmorphism, Duotone gibi stil dönüşümleri burada yapılıyor.

**Fast** → Wireframe hızında çalışmak, Figma'ya hızlı export. Geliştirici olarak en çok bunu kullandım — yapıyı çabuk kur, detayı Figma'da bitir.

## Variations: Tasarım Kararlarının Hızlı Testi

Stitch'in en güçlü özelliklerinden biri bu. Tek bir promptla 5 farklı yön üretebilirsin. Sonra en yakın olanı seçip "Refined" (düşük sapma) veya "Creative" (tam overhaul) slider'ıyla ince ayar yapıyorsun.

Ne zaman kullanmalısın?

- Bir noktada takıldığında ve ne değiştireceğini bilmiyorken
- Müşteriye 3 farklı yön göstermen gerektiğinde
- Tüm vibi tek seferde değiştirmek istediğinde

## Az Bilinen 4 Özellik

### Instant Prototype
Tek bir ekrandan yola çıkıp Stitch, kullanıcı akışındaki mantıksal sonraki ekranı otomatik üretiyor. Tüm siteyi wireframe'lemeden önce akışı test etmek için kullanışlı.

### Live Mode
Input kutusunun yanındaki bu butona tıklayınca sesle tasarım yapabiliyorsun. Konuştukça ekran değişiyor. İlk gördüğümde şaşırdım.

### Marka Kitini Web Sitenden İçe Aktar
Eğer var olan bir sitenin renklerini ve fontlarını almak istiyorsan:

**Design Systems → + → Import from website**

URL'i yapıştır, Stitch sitenin tasarım sistemini çekiyor — renkler, Google Fonts üzerindeyse fontlar, bileşen stilleri. Sıfırdan marka rengi tanımlamakla uğraşmak zorunda değilsin.

### Figma'ya Export
Bu benim için en etkileyicisi oldu. Çıktıyı Figma dosyası olarak export edince düzenlenebilir katmanlar ve Auto Layout ile geliyor. Stitch'in çıktısını Figma'da rafine edip geliştiriciye verebiliyorsun.

## Gerçek Kullanım Senaryoları

### Müşteri Pitch Sunumları
Klasik problem: Slaydar sıradan görünüyordu, Gemini ile saniyede üretilen sunumlar bile fark yaratmıyordu.

```
10 ekranlık B2B pitch deck UI tasarla. Büyüme odaklı bir pazarlama ajansı için.
Estetik: temiz, modern, yüksek güven hissi veren. Beyaz arka plan, bold sans-serif
başlıklar, güçlü tipografi hiyerarşisi.

Ekranlar:
1. Şirket adı ve tagline ile kapak
2. Yönetici özeti
3. Problem
4. Çözüm
5. Nasıl çalışır (3 adım)
6. Case study / Sosyal kanıt (logo, sonuç, müşteri isimleri)
7. Fiyatlandırma ve paketler
8. 30/60/90 günlük onboarding takvimi
9. Başarı metrikleri
10. CTA ve iletişim

Variations kaydet.
```

İlk taslak: 15 dakika.

### Landing Page Kampanyaları
Her kampanya yeni bir sayfa demekti — 3-4 saat geliştirme, 2 saat revizyon. Haftalık.

```
Büyüme pazarlama ajansı için kampanya landing page. Temiz, modern, güven hissi.
Hero: başlık + CTA, sosyal kanıt şeridi (logo'lar), hizmet seviyeleri, 3 adımlı
nasıl çalışır bölümü, fiyatlandırma, metriklerle müşteri sonuçları, footer CTA.
Variations kaydet.
```

Brief tamamlanır tamamlanmaz sayfa o gün yayına girebilir hale geliyor.

### Dashboard ve Raporlar
İç metrik raporları her hafta aynı şekilde hazırlanıyordu: Google Sheet, ekran görüntüsü. Veri doğruydu, sunum yanlıştı.

```
Pazarlama performans dashboard. Haftalık görünüm. Koyu mod, kart tabanlı düzen.
Metrikler: yerleştirme sayısı, aktif müşteri, yetenek pipeline'ı, müşteri tutma oranı,
hizmet katmanına göre gelir, yerleştirme süresi. Bar chart, trend line, KPI tile gibi
veri görselleştirme bileşenleri. Yönetici sunumuna hazır.
```

## Sonuç

Stitch bir tasarımcının yerini almıyor — başlangıç süresini dramatik şekilde kısaltıyor. Figma hâlâ iyi; bitirmek için kullan. Başlamak için Stitch kullan.

MCP entegrasyonu sayesinde Cursor ve Gemini CLI ile doğrudan bağlanabiliyor olması ayrıca dikkat çekici — bu, tasarımdan koda geçişin önündeki duvarın inceldiği anlamına geliyor. [MCP'nin ne olduğunu](/tr/blog/mcp-nedir-neden-onemli) ve bu entegrasyonun neden önemli olduğunu ayrıca yazdım.

Denemek için tek gereken bir Gmail hesabı: [stitch.withgoogle.com](https://stitch.withgoogle.com)
