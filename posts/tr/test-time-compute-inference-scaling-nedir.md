---
title: "Test-Time Compute ve Inference Scaling Nedir? LLM'lerde Akıl Yürütme Devrimi"
date: "2026-09-08"
excerpt: "Yapay zeka sektörü model büyütme yarışından (pre-training) çıkarım anında düşünme yarışına (test-time compute) geçti. Inference scaling laws, Process Reward Modelleri (PRM) ve akıl yürütme mimarisi tam rehberi."
tags: ["Test-Time Compute", "Inference Scaling", "LLM", "Akıl Yürütme", "Reasoning Models", "Yapay Zeka", "Process Reward Models", "Yapay Zeka Mimarisi"]
category: "Yapay Zeka"
---

2020'den 2025'e kadar yapay zeka sektörünün tek bir ana kuralı vardı: **Scaling Laws (Ölçekleme Yasaları)**. Modeli büyüt (daha fazla parametre), eğitim verisini artır (trilyonlarca token) ve daha fazla GPU kümesi kur. GPT-3'ten GPT-4'e giden yolu bu ön-eğitim (pre-training) ölçeklemesi açtı.

Ancak 2026 itibarıyla sektör devasa bir duvara çarptı: **İnternetteki kaliteli insan verisi tükendi.**

Veri duvarına karşı geliştirilen yeni paradigma ise yapay zekanın yönünü tamamen değiştirdi: **Test-Time Compute (Inference-Time Scaling)** — yani modeli eğitirken değil, soruya yanıt üretirken modelin "düşünmesine" daha fazla hesaplama gücü ayırmak.

OpenAI'ın akıl yürütme (reasoning) modelleri, Anthropic'in Claude düşünme mimarisi ve DeepSeek'in açık kaynak araştırmalarıyla birlikte, yapay zekada "System 1"den "System 2" düşünce yapısına geçişi inceliyoruz.

> **Özet (TL;DR):**
> - **Test-Time Compute Nedir?** Modelin bir soruya anında (sezgisel) yanıt vermek yerine, yanıtı üretmeden önce kendi içinde hipotezler üretmesi, adımları doğrulaması ve arama yapması için ekstra hesaplama gücü harcamasıdır.
> - **Inference Scaling Laws:** Tıpkı ön-eğitimde olduğu gibi, çıkarım anında modele verilen düşünme süresi ve token bütçesi arttıkça problem çözme başarısı logaritmik olarak artar.
> - **Process Reward Models (PRM):** Modelin sadece nihai sonuca değil, çözüm yolundaki her bir mantıksal adıma ayrı ayrı puan veren doğrulama mekanizmalarıdır.
> - **Maliyet ve Hız:** Yanıt başına maliyet ve gecikme (latency) artsa da, önceden 500 milyar parametreli modellerin çözemediği karmaşık matematik, kodlama ve mimari tasarım problemleri 8B-70B'lik modeller tarafından çözülebilir hale gelir.

---

## 1. System 1 ve System 2 Düşünce Modeli

Nobel ödüllü ekonomist Daniel Kahneman'ın insan zihni için tanımladığı iki sistem, bugünkü LLM ayrımını mükemmel açıklar:

- **System 1 (Hızlı, Otomatik, Sezgisel):** *"2 + 2 kaç eder?"* diye sorulduğunda düşünmeden "4" dersiniz. Klasik LLM'ler (GPT-4o, Claude 3.5 Sonnet standart mod) tamamen bu şekilde çalışır: bir sonraki en olası kelimeyi tahmin ederler.
- **System 2 (Yavaş, Analitik, Planlı):** *"17 × 28 kaç eder?"* dediğimizde durur, zihninizde alt alta çarpar, basamakları toplar ve kontrol edersiniz.

Eski dil modelleri mimarileri gereği durup düşünemiyordu. Karmaşık bir yazılım hatasını çözmeye çalışırken bile ilk token'dan itibaren doğrusal olarak yazmaya başlamak zorundaydılar. Bir kez yanlış yola girdiklerinde ise otoregresif yapı nedeniyle o hatayı rasyonelleştirmeye devam ediyorlardı (halüsinasyon).

**Test-Time Compute**, LLM'lere işte bu System 2 yeteneğini kazandırdı.

---

## 2. Test-Time Compute Nasıl Çalışır? (İç Mekanizma)

Model bir soruyla karşılaştığında arka planda üç temel strateji devreye girer:

### A. Düşünme Token'ları (Reasoning Tokens & Chain-of-Thought)
Model kullanıcıya nihai cevabı göstermeden önce kendi iç bağlamında binlerce gizli token üretir:
1. Problemi parçalara böler.
2. Olası çözüm yollarını listeler.
3. Çelişkileri tespit eder (*"Bu yaklaşım bellek sınırını aşar, alternatif deneyelim"*).
4. Doğru mantık zincirini kurduktan sonra temiz sonucu kullanıcıya aktarır.

### B. Arama ve Dallanma (Tree Search & Best-of-N)
Karmaşık bir problem tek bir doğrusal akışla çözülemez. Model satranç motorlarına (Stockfish) benzer şekilde alternatif düşünce dalları oluşturur:
- **Monte Carlo Tree Search (MCTS):** Farklı kodlama stratejileri dallandırılır.
- **Best-of-N Sampling:** Model N farklı çözüm taslağı üretir ve en yüksek güvenilirlik puanını alanı seçer.

### C. Process Reward Models (PRM) ile Adım Adım Doğrulama
Geleneksel pekiştirmeli öğrenmede (RLHF) model sadece sonuca göre ödüllendirilir (Outcome Reward Model - ORM). Örneğin bir kod testi geçiyorsa +1, geçmiyorsa 0. Ancak kod tesadüfen çalışmış veya gizli bir mantık hatası barındırıyor olabilir.

**PRM (Süreç Ödül Modeli)** ise düşünce zincirindeki her bir cümleyi tek tek puanlar:
- Adım 1: Doğru formül seçildi mi? (Doğrulandı: +1.0)
- Adım 2: Değişken dönüşümü yapıldı mı? (Doğrulandı: +1.0)
- Adım 3: Sayısal işlem hatası var mı? (Hata tespit edildi: -1.0 → Bu daldan vazgeç ve geri dön).

---

## 3. Inference Scaling: Küçük Model, Büyük Akıl

Test-Time Compute'un yazılım dünyası için en sarsıcı sonucu şudur:

> **Yeterli çıkarım süresi ve arama bütçesi verilen 14 milyar parametreli bir model, tek seferde yanıt vermeye zorlanan 400 milyar parametreli bir dev modelden çok daha doğru sonuçlar üretebilir.**

Bu, veri merkezi yatırımlarını ve yazılım mimarilerini derinden etkiliyor:

| Kriter | Pre-Training Scaling (Eski) | Test-Time Compute (Yeni) |
|---|---|---|
| **Kaynak Tüketimi** | Model eğitilirken tek seferlik devasa maliyet | Kullanıcı soru sorduğunda dinamik maliyet |
| **Gecikme (Latency)** | Hızlı (1-3 saniye) | Göreve göre değişken (10-90 saniye) |
| **Hata Türü** | Kendine aşırı güvenen halüsinasyon | Aşırı düşünme (overthinking) riski |
| **İdeal Kullanım** | Sohbet, özetleme, metin düzeltme | Karmaşık mimari analiz, refactoring, matematik |

---

## 4. Geliştiriciler İçin Ne Anlama Geliyor?

Bir yazılım mühendisi olarak bu yeni paradigmaya nasıl yaklaşmalıyız?

1. **Token Bütçesi Yönetimi (Thinking Budget):** Modern API'ler artık `max_thinking_tokens` parametresi sunuyor. Basit bir JSON formatlama görevi için düşünme bütçesi 0 tutulmalı; karmaşık bir concurrency bug'ını analiz ederken 16.000 token'a kadar izin verilmelidir.
2. **Asenkron İş Akışları:** 60 saniye boyunca düşünen bir model için web arayüzlerinde klasik HTTP request-response döngüsü yetersiz kalır; WebSocket ve background job kuyrukları zorunlu hale gelir.
3. **Prompt Mühendisliğinin Değişimi:** Eski yöntemlerde modele *"Adım adım düşün"* (Chain-of-Thought) demek gerekiyordu. Akıl yürütme modellerinde ise probleme dair kısıtları ve doğrulama kriterlerini net vermek, düşünme sürecini modele bırakmak en yüksek başarıyı getiriyor.

---

## Sıkça Sorulan Sorular (FAQ)

### Test-Time Compute tam olarak ne demektir?
Test-Time Compute (Çıkarım Zamanı Hesaplaması), dil modelinin kullanıcıdan gelen soruya anında ilk bulduğu kelimelerle yanıt vermek yerine; cevabı oluşturmadan önce kendi içinde hipotezler kurarak, adımları doğrulayarak ve alternatif yolları tarayarak ekstra işlemci gücü ve zaman harcamasıdır.

### Akıl yürütme modelleri neden daha yavaş yanıt verir?
Çünkü model nihai yanıtı ekrana yazdırmadan önce arka planda binlerce "düşünme token'ı" (reasoning tokens) üretir, mantık zincirini kontrol eder ve hatalı adımları kendi kendine düzeltir. Bu süreç 10 ila 60 saniye sürebilir.

### Bütün görevler için akıl yürütme modelleri mi kullanılmalı?
Hayır. E-posta yazma, metin özetleme, çeviri veya basit veri dönüştürme gibi sezgisel (System 1) görevlerde standart modeller çok daha hızlı ve ucuzdur. Akıl yürütme modelleri karmaşık algoritmalar, güvenlik açığı denetimleri ve çok adımlı mantık gerektiren durumlar için ayrılmalıdır.

### Overthinking (Aşırı Düşünme) problemi nedir?
Modele basit bir soru sorulduğunda gereğinden fazla düşünme token'ı harcaması ve gereksiz alternatifler arasında kaybolarak basit bir mantığı karmaşıklaştırıp yanlış sonuca ulaşması riskine aşırı düşünme denir. Bu durum token bütçesinin doğru ayarlanmasıyla yönetilir.

---

## Sonuç

Yapay zeka sektörü, sadece devasa veri merkezlerinde trilyonlarca kelime ezberleyen devasa hafıza modellerinden; her bir problemi dikkatle analiz eden, doğruluğunu test eden ve kendi hatasını düzeltebilen rasyonel problem çözücülere doğru evriliyor. Test-Time Compute, önümüzdeki yıllarda otonom yazılım mühendisliği sistemlerinin en güçlü motoru olmaya devam edecek.
