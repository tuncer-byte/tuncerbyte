---
title: "Unity AI Nedir? Oyun Geliştiriciler İçin Kapsamlı Rehber (2026)"
date: "2026-05-05"
excerpt: "Unity nedir, Unity AI ne yapıyor, Assistant, Generators ve Inference Engine nasıl çalışıyor — güncel fiyatlandırma ve pratik kullanım rehberiyle tam açıklama."
tags: ["Unity", "Unity AI", "Oyun Geliştirme", "Yapay Zeka", "Game Development", "Unity Muse", "Unity Sentis", "AI Araçları", "Indie Game", "C#"]
category: "Teknoloji"
---

Unity, dünyada en çok kullanılan oyun motorlarından biri. Peki son yıllarda Unity'nin yapay zeka tarafında neler oluyor? Unity AI tam olarak ne, ne değişti ve nasıl kullanılıyor?

Bu yazıda önce Unity'nin ne olduğunu kısaca özetleyip ardından Unity AI'yi — tarihçesiyle, güncel bileşenleriyle ve pratik kullanımıyla — ayrıntılı inceliyoruz.

---

## Unity Nedir?

Unity, Unity Technologies tarafından geliştirilen çapraz platform bir oyun motorudur. İlk kez 2005 yılında Apple WWDC'de Mac OS X oyun motoru olarak tanıtıldı. Bugün 2D, 3D, VR/AR ve etkileşimli simülasyon projelerinin vazgeçilmez araçlarından biri.

**Öne çıkan özellikler:**

- Mobil oyun geliştirmede piyasa lideri (iOS ve Android)
- VR/AR projelerinde baskın motor
- Unreal Engine ile birlikte oyun motoru pazarının yaklaşık %51'ini kontrol ediyor
- 2023 itibarıyla mevcut oyunların yaklaşık %27'si Unity ile yapılmış

**Unity ile yapılmış tanınan oyunlar:** Pokémon Go, Monument Valley, Call of Duty: Mobile, Beat Saber, Cuphead.

Unity'nin temel felsefesi "oyun geliştirmeyi demokratize etmek." Büyük bütçeli stüdyolardan indie geliştiricilere, öğrencilerden profesyonellere kadar geniş bir kitleye hitap etmesi bu anlayışın ürünü.

---

## Unity AI Nedir?

Unity AI, Unity 6.2 ile birlikte (Ağustos 2025) editörün içine entegre edilen yapay zeka araçları setidir. Önceki bağımsız ürünler olan **Muse** ve **Sentis**'in yerini almış, her şeyi tek çatı altında toplamıştır.

Üç ana bileşenden oluşuyor:

1. **Assistant** — Editör içi ajansal yapay zeka asistanı
2. **Generators** — Üretici yapay zeka ile içerik oluşturma araçları
3. **Inference Engine** — Cihaz üzerinde çalışan sinir ağı çıkarım motoru

---

## 1. Bileşen: Assistant

Assistant, eski **Muse Chat**'in geliştirilmiş versiyonu. Ama artık sadece bir chatbot değil — projeyi gerçekten anlayan, sahne içindeki nesneleri inceleyebilen ve doğrudan editörde adım atan bir ajan.

**Neler yapabiliyor:**

- Sahnenizi, GameObject'lerinizi ve bileşenlerinizi anlayarak bağlama duyarlı yanıtlar veriyor
- C# kodu yazıp doğrudan çalıştırabiliyor
- Asset toplu yeniden adlandırma gibi tekrarlayan görevleri otomatikleştiriyor
- Dokümantasyon sorularını yanıtlıyor
- Editör eylemlerini tetikleyip değişiklikleri doğrulayabiliyor

**Eğitim altyapısı:** 20+ yıllık Unity bilgisi ve best practice'leri üzerine eğitilmiş.

**Pratik kullanım örneği:**

> "Bu sahnede tüm ışık nesnelerini bul ve baked lighting'e geçir."

Assistant sahneyi tarar, ilgili nesneleri listeler, değişikliği yapar ve sonucu raporlar. Terminal veya manuel arama yok.

---

## 2. Bileşen: Generators

Generators, metin açıklamalarından oyun içi asset üreten araçlar setidir. Unity Cloud üzerinde çalışır, sonuçlar doğru Unity formatında editöre iner.

**Üretebileceklerin:**

| Araç | Ne Üretiyor |
|------|-------------|
| Sprite Generator | 2D metinden sprite |
| Texture Generator | 3D modeller için yüksek kaliteli doku |
| Material Generator | Materyal ve shader |
| Animation Generator | Karakter animasyonları |
| Sound Generator | Ses efektleri ve ambient ses |

**Üretim akışında nasıl kullanılıyor:**

Çoğu geliştirici Generators'ı iki aşamada kullanıyor: prototipleme sırasında hızla placeholder asset oluşturmak için, ilerleyen süreçte ise üretilen asset'lar takip edilerek sanatçı yapımı olanlarla değiştiriliyor. Unity bu takibi otomatik yapıyor.

---

## 3. Bileşen: Inference Engine (eski adı: Sentis)

Inference Engine, Unity'nin en teknik ama en güçlü bileşeni. Sinir ağı modellerini doğrudan cihazda, internet bağlantısı olmadan, gerçek zamanlı çalıştırıyor.

**Çalışma prensibi:**

```
1. ONNX formatında model yükle
2. Model için giriş verisi oluştur
3. Worker (çıkarım motoru örneği) oluştur
4. Modeli çalıştır
5. Çıktıyı al ve oyun mantığında kullan
```

**Desteklenen backend'ler:**
- CPU (tüm platformlar)
- GPU (GPUCompute — donanım hızlandırmalı)

**Platform desteği:** Unity'nin desteklediği tüm platformlar — mobil, Nintendo Switch, PlayStation dahil.

**Kullanım senaryoları:**

- **Akıllı NPC davranışı:** Sinir ağı tabanlı karar mekanizmaları
- **Gerçek zamanlı poz ve jest algılama:** XR uygulamalar için
- **Nesne tanıma:** Kamera görüntüsünden gerçek zamanlı sınıflandırma
- **Prosedürel içerik üretimi:** Oyun içi dinamik içerik
- **Görüntü işleme:** Runtime sırasında görsel analiz

**Önemli fark:** Inference Engine Unity Points tüketmiyor. Tamamen yerel çalıştığı için bulut maliyeti yok.

**Hugging Face entegrasyonu:** Hugging Face'teki hazır modelleri doğrudan Unity Inference Engine'e entegre edebiliyorsun. Binlerce açık kaynaklı model, Unity projene birkaç adımda giriyor.

---

## Unity AI'nin Tarihi: Muse ve Sentis

### Unity Muse (2023 – Ekim 2025)

Unity'nin ilk yapay zeka abonelik ürünü. 2023'te tanıtıldı, **Ekim 2025'te tamamen kapatıldı.**

| Araç | Açıklama |
|------|----------|
| Muse Chat | Editör içi AI chatbot |
| Muse Sprite | Metinden 2D sprite |
| Muse Texture | Yüksek kalite doku üretimi |
| Muse Animate | Doğal dille NPC animasyonu |
| Muse Code | Kod tamamlama ve öneri |

Fiyatlandırma: aylık 30 dolar bağımsız abonelik.

### Unity Sentis (2023 – Ağustos 2025)

Cihaz üzerinde sinir ağı çıkarım kütüphanesi. Unity 6.2 ile **Inference Engine** adını alarak Unity AI'nin bir parçası oldu.

---

## Unity AI Nasıl Kullanılır?

### Kurulum

Unity AI, Unity 6 ve üzeri ile birlikte geliyor. Aktif etmek için:

1. Unity 6 Hub üzerinden güncel sürümü yükle
2. Editor içinde **Window → Unity AI** yolunu takip et
3. Unity hesabıyla giriş yap
4. Open Beta kapsamında kullanıma başla

### Assistant ile Kod Yazma

Sahne bağlamını anlayan bir asistan olarak kullanabilirsin:

```
"Bu player controller için double jump ekle.
Zemin temas kontrolü mevcut fizik sistemini bozmadan çalışsın."
```

Assistant mevcut kodu okur, double jump mantığını ekler, test eder ve değişiklikleri özetler.

### Generators ile Asset Üretimi

```
"Piksel sanatı tarzında, yeşil zemin üzerinde kırmızı öfkeli mantar karakteri — 
32x32 piksel, şeffaf arka plan"
```

Saniyeler içinde sprite üretilip editöre iner.

### Inference Engine ile Model Entegrasyonu

```csharp
// Hugging Face'ten indirilen ONNX modelini yükle
var model = ModelLoader.Load("Assets/Models/pose_detection.onnx");
var worker = WorkerFactory.CreateWorker(BackendType.GPUCompute, model);

// Kamera görüntüsünden tensor oluştur
var input = TextureConverter.ToTensor(cameraTexture);
worker.Execute(input);

// Sonucu al
var output = worker.PeekOutput("output");
```

---

## Geliştiricilerin Unity AI'den Beklentileri Nasıl Karşılanıyor?

**Animasyon üretimi:** AI araçları animasyon kliplerini yaklaşık **%75 oranında** azaltırken durum makinelerini yaklaşık %30 sadeleştiriyor.

**Prototipleme hızı:** Placeholder asset üretimi sayesinde prototip aşaması önemli ölçüde hızlanıyor.

**Öğrenme eğrisi:** Assistant, 20+ yıllık Unity dokümantasyonuna dayandığı için yeni başlayanlar için güçlü bir yardımcı.

**Endişeler:** Agentic özellikler hâlâ beta aşamasında. Telif hakkı konusunda Unity, üretilen içeriklerin sorumluluğunu kullanıcıya bırakıyor.

---

## Fiyatlandırma (2026)

| Plan | Unity AI Erişimi |
|------|----------------|
| Personal (Ücretsiz) | Sınırlı deneme sürümü; sonrasında ~10 dolar/ay |
| Pro | Aboneliğe dahil; aylık 1.000 AI kredisi |
| Enterprise / Industry | Dahil; daha yüksek kredi limiti |

- Assistant ve Generators **Unity Points/Kredi** tüketiyor
- Inference Engine yerel çalıştığı için **kredi tüketmiyor**
- 2025 beta puanları Ocak 2026'da sıfırlandı

---

## 2025–2026 Önemli Gelişmeler

**Ağustos 2025 — Unity 6.2:** Unity AI editöre entegre edildi. Muse kullanımdan kaldırıldı, Sentis Inference Engine adını aldı.

**Ekim 2025 — Muse tamamen kapatıldı.**

**Ocak 2026 — Unity AI Beta 2026:** Ajansal yetenekler büyük ölçüde geliştirildi. Ajan artık tüm proje bağlamını anlıyor, assetları indeksleyebiliyor ve çok adımlı eylemler alabiliyor.

**GDC 2026:** Unity CEO'su Unity AI'nin geliştiricilerin **"yalnızca doğal dille tam casual oyunlar"** üretmesini sağlayacağını açıkladı.

**Yakında: Unity AI Gateway:** Cursor, GitHub Copilot ve özel MCP sunucuları gibi üçüncü taraf yapay zeka ajanlarının Unity Editor'a güvenli bağlanmasını sağlayacak resmi köprü.

**MCP Sunucu Desteği:** Unity artık MCP (Model Context Protocol) destekliyor. Claude, Copilot, Gemini ve Cursor gibi dış yapay zeka araçları Unity Editor'a doğrudan bağlanabiliyor.

---

## Unity AI'nin Gelecekte Oyun Geliştirmeyi Nasıl Etkileyeceği

**Indie geliştirici için:** Tek kişilik stüdyolar artık daha küçük asset bütçesiyle daha geniş içerik üretebiliyor. Placeholder-to-final pipeline hızlanıyor.

**Profesyonel stüdyo için:** Tekrarlayan görevler (asset adlandırma, animasyon state machine düzenleme, QA testleri) otomasyona açılıyor.

**Öğrenci için:** Dokümantasyon bilgisiyle desteklenen Assistant, öğrenme sürecinde güçlü bir yardımcı.

**Dikkat edilmesi gereken:** Agentic yetenekler hâlâ beta aşamasında ve zaman zaman hata yapıyor. Kritik üretim kararlarında insan denetimi şart.

---

## Sonuç

Unity AI, oyun geliştirme araçlarının doğal dil ve üretici yapay zeka ile entegrasyonunun en kapsamlı örneklerinden biri. Sadece bir chatbot değil — kod yazıyor, sahne bağlamını anlıyor, asset üretiyor ve cihazda sinir ağı çalıştırıyor.

Şu an açık beta aşamasında ve aktif geliştirme sürecinde. Unity 6 kullanıyorsan denemeye başlamak için doğru an.

---

*Kaynak: [Unity AI Resmi Sayfası](https://unity.com/features/ai) — [Unity Docs](https://docs.unity3d.com) — [Unity Discussions](https://discussions.unity.com)*
