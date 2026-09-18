---
title: "TypeSafe AI ve Jev Nedir? Metin Üretmeyen, Karar Veren 'System One' Modeli"
date: "2026-09-18"
excerpt: "TypeSafe AI'ın duyurduğu Jev modeli, LLM dünyasında yeni bir çağ açıyor. Metin yazmayan, yazılım için doğrudan tipli kararlar ve olasılıklar üreten System-1 model mimarisi, RLCD ve kullanım senaryoları rehberi."
tags: ["TypeSafe AI", "Jev", "System One Model", "RLCD", "AI Agent", "LLM", "Yazılım Mimarisi", "Pydantic AI", "LangChain"]
category: "Yapay Zeka"
---

Modern yazılım geliştirmede yapay zekanın en büyük ironilerinden biri şudur: Bir AI agent'ı veya backend servisi kurduğumuzda, çoğu zaman modele bir makale yazdırmak istemeyiz. İhtiyacımız olan şey basittir:
- *"Bu müşteri talebi acil mi?"* (True/False)
- *"Bu hata logu hangi servisten kaynaklandı?"* (Enum seçimi)
- *"Bu kod değişikliği güvenlik açığı içeriyor mu?"* (Skor ve olasılık)

Bunun için 70 milyar veya 400 milyar parametreli devasa bir dil modelini (Claude, GPT-4o) çağırırız. Model 2-3 saniye boyunca token üretir, `{"decision": true}` şeklinde JSON döndürmeye çalışır, bazen JSON sözdizimi bozulur ve sadece tek bir boolean değer için binlerce token parası öderiz.

Eylül 2026'da 40 milyon dolar tohum yatırımla stealth moddan çıkan **TypeSafe AI**, tam olarak bu probleme odaklanan ilk kamusal **"System One" modeli olan Jev'i (Jev 1.13)** duyurdu.

Jev bir dil modeli değil; yazılımın içine gömülebilen akıllı bir `if-else` karar motorudur.

> **Özet (TL;DR):**
> - **Jev Nedir?** TypeSafe AI tarafından geliştirilen; serbest metin üretmek yerine doğrudan tipli kararlar (typed decisions), olasılıklar ve güven skorları döndüren ilk kamusal System-1 yapay zeka modelidir.
> - **Çalışma Prensibi:** Model otoregresif olarak kelime kelime metin üretmez. Verilen bir bağlamı (kod, log, mesaj) analiz edip anında tipli karar vektörlerine dönüştürür.
> - **Hız ve Maliyet:** Geleneksel LLM'lere kıyasla **70 milisaniye** gibi inanılmaz düşük bir gecikmeyle (200 kata kadar daha hızlı) çalışır ve çıktı token maliyeti sıfırdır ($0/output tokens, ~$0.042/M input tokens).
> - **Eğitim Paradigması (RLCD):** İnsan sohbet tarzını taklit eden RLHF yerine, tahmin edilen olasılıkların matematiksel doğruluğunu optimize eden **Reinforcement Learning for Calibrated Decisions (RLCD)** ile eğitilmiştir.
> - **Temel Primitifler:** Noul (Boolean / Evet-Hayır), Choice (Kategorik Seçim / Enum) ve Score (Dereceli Değerlendirme).

---

## 1. Neden "System One" Modeli?

Daniel Kahneman'ın insan zihni için tanımladığı modelde:
- **System 2 (Yavaş ve Analitik):** Bir problemi adım adım düşünmek, hesaplama yapmak (önceki yazımızda incelediğimiz [Test-Time Compute ve Akıl Yürütme modelleri](/tr/blog/test-time-compute-inference-scaling-nedir)).
- **System 1 (Hızlı ve Sezgisel):** Bir tehlikeyi anında sezmek, bir nesneyi gördüğü anda tanımak, refleks geliştirmek.

Bugüne kadar yapay zeka sektörü System 2 yeteneklerini (akıl yürütme, düşünme token'ları) geliştirmek için trilyonlarca dolar harcadı. Ancak üretimdeki yazılımların ve otonom agent döngülerinin %90'ı akıl yürütmeye değil; **hızlı, hatasız ve deterministik karar vermeye** ihtiyaç duyar.

TypeSafe AI'ın kurucuları manifestolarında durumu şöyle özetliyor:
> *"Büyük dil modelleri insanlar için kelimeler üretir. Jev ise yazılımlar için tipli kararlar üretir. Jev metin yazmaz; kod gibi davranır: güvenilir, hızlı, kendi içinde tutarlı ve tip güvenli (type-safe)."*

---

## 2. Jev'in Üç Temel Karar Primitifi


Jev'e herhangi bir serbest prompt yazamazsınız. Bir girdi bağlamı (state) verirsiniz ve modelden üç temel primitiften birini yanıtlamasını istersiniz:

```
                          ┌───────────────────────────┐
                          │   GİRDİ BAĞLAMI (STATE)   │
                          │ (Hata Logu, Kod, Mesaj)  │
                          └─────────────┬─────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
   ┌───────────────┐            ┌───────────────┐            ┌───────────────┐
   │ 1. NOUL (Bool)│            │2. CHOICE(Enum)│            │3. SCORE(Skor) │
   ├───────────────┤            ├───────────────┤            ├───────────────┤
   │ True / False  │            │ Seçenek A,B,C │            │ Düşük/Orta/Yük│
   │ + Olasılık    │            │ + Dağılım     │            │ + Güven Skoru │
   └───────────────┘            └───────────────┘            └───────────────┘
```

### A. Noul (Boolean / Evet-Hayır)
Bir durumun doğru olup olmadığını test eder. Model sadece "Evet" demez; bunun gerçekleşme olasılığını kalibre edilmiş biçimde döndürür:
- **Soru:** *"Bu gelen destek talebi bir veri sızıntısı şüphesi içeriyor mu?"*
- **Yanıt:** `result: true`, `probability: 0.984`, `confidence: 0.991`

### B. Choice (Kategorik Seçim / Enum)
Önceden tanımladığınız sabit bir liste içerisinden en uygun seçeneği belirler. Her bir seçenek için ayrık olasılık dağılımını hesaplar:
- **Seçenekler:** `["frontend_bug", "database_timeout", "auth_failure", "network_glitch"]`
- **Yanıt:** `choice: "database_timeout"`, `probabilities: { database_timeout: 0.89, network_glitch: 0.08, ... }`

### C. Score (Dereceli Puanlama)
Bir girdiyi sıralı seviyelere göre (örneğin low, medium, high veya 1-10) değerlendirir:
- **Soru:** *"Bu kod değişikliğinin karmaşıklık seviyesi nedir?"*
- **Yanıt:** `score: "medium"`, `numeric_value: 0.68`, `confidence: 0.94`

---

## 3. RLCD: Kalibre Edilmiş Kararlar İçin Pekiştirmeli Öğrenme

Jev'i geleneksel modellerden ayıran en büyük teknik devrim eğitim metodolojisindedir: **RLCD (Reinforcement Learning for Calibrated Decisions)**.

Klasik dil modelleri RLHF (İnsan Geri Bildirimiyle Pekiştirmeli Öğrenme) ile eğitilir. RLHF, modelin kulağa hoş gelen ve ikna edici metinler yazmasını hedefler; ancak modelin kendi kendine güvenini bozar (overconfidence). LLM'ler yanlış olduklarında bile %99 emin gibi davranırlar.

RLCD ise **olasılık kalibrasyonunu (probability calibration)** optimize eder:
- Eğer Jev bir karara `%80 olasılık` veriyorsa, bu seviyedeki 100 farklı kararın tam olarak 80 tanesi doğru, 20 tanesi yanlış olmak zorundadır.
- Bu matematiksel güvenilirlik sayesinde, yazılımınız modelin çıktısına göre otomasyon kuralları işletebilir:
  - `if confidence > 0.95`: İşlemi otomatik onayla ve çalıştır.
  - `if confidence < 0.80`: İnsan operatöre yönlendir veya pahalı bir LLM'e eskalasyon yap.

---

## 4. Kod Örneği: Hibrit Fallback Mimarisi (Jev + Claude)

Yazılım mimarisinde Jev'in en güçlü kullanım şekli, pahalı bir LLM ile kurulan **Kademeli Karar (Cascaded / Tiered Evaluation)** yapısıdır:

```typescript
import { JevClient } from "@typesafe/sdk";
import Anthropic from "@anthropic-ai/sdk";

const jev = new JevClient({ apiKey: process.env.TYPESAFE_API_KEY });
const anthropic = new Anthropic();

async function triageCustomerIssue(userMessage: string) {
  // 1. ADIM: Jev ile 70 ms'de ve neredeyse sıfır maliyetle analiz et
  const decision = await jev.evaluate({
    state: userMessage,
    question: {
      type: "noul",
      prompt: "Bu mesaj acil müdahale gerektiren kritik bir güvenlik açığı mı?"
    }
  });

  console.log(`Jev Kararı: ${decision.value} (Güven: ${decision.confidence})`);

  // 2. ADIM: Yüksek güvenilirlikte anında aksiyon al
  if (decision.confidence >= 0.92) {
    if (decision.value === true) {
      await notifySecurityTeam(userMessage);
    }
    return { status: "processed_by_jev", isCritical: decision.value };
  }

  // 3. ADIM: Jev emin değilse (< 0.92), pahalı System 2 modeline eskalasyon yap
  console.log("Jev güven eşiğinin altında kaldı. Claude 3.5 Sonnet'e devrediliyor...");
  const llmResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    messages: [{ role: "user", content: `Aşağıdaki mesajı güvenlik açısından derinlemesine analiz et: ${userMessage}` }]
  });

  return { status: "escalated_to_llm", analysis: llmResponse.content[0] };
}
```

Bu mimari sayesinde gelen isteklerin %85-90'ı **70 milisaniye içinde ve 400 kat daha ucuza** çözülür; pahalı frontier modeller ise yalnızca gerçekten belirsiz olan uç vakalara saklanır.

---

## 5. OpenAI Structured Outputs ile Jev Arasındaki Fark

Geliştiricilerin en sık sorduğu soru: *"Biz zaten OpenAI veya Claude'un Structured Outputs / JSON Mode özelliğini kullanıyoruz, Jev'e neden gerek var?"*

| Özellik | LLM + Structured Outputs | TypeSafe AI Jev |
|---|---|---|
| **Mekanizma** | Metin üretir, JSON şemasına gramerle kısıtlar | Metin üretmez, doğrudan karar tensörü üretir |
| **Gecikme (Latency)** | 1.500 ms – 4.000 ms | **50 ms – 90 ms** |
| **Maliyet** | Standart LLM token tarifesi ($2.5 - $15 / 1M token) | **$0.042 / 1M input, $0 çıktı** |
| **Çıktı Biçimi** | JSON String | Doğrudan tipli veri + kalibre olasılık dağılımı |
| **Olasılık Kalibrasyonu** | Yok (logprobs sadece kelime düzeyindedir) | **Tam matematiksel güven kalibrasyonu (RLCD)** |
| **İdeal Kullanım** | Karmaşık veri çıkarma, uzun JSON oluşturma | Yönlendirme (routing), sınıflandırma, gating, filtreleme |

---

## Sıkça Sorulan Sorular (FAQ)

### Jev bir büyük dil modeli (LLM) midir?
Hayır. Jev metin üretimi yapmaz. Bir dil modeli gibi geniş dünya bilgisine ve anlamsal kavrayışa sahiptir ancak çıktısı serbest cümleler değil; doğrudan yazılımların tüketebileceği tipli kararlar, olasılıklar ve boolean/enum değerleridir.

### Jev hangi framework ve platformları destekliyor?
Jev lansmanıyla birlikte OpenRouter (`typesafe/jev-1.13`), Cloudflare Workers AI (`typesafe/jev`), Pydantic AI (`TypeSafeModel`), LangChain, CrewAI ve Vercel AI SDK entegrasyonlarını duyurmuştur.

### Jev nerede kullanılmamalıdır?
Serbest metin yazımı, e-posta taslağı oluşturma, kod yazma veya yaratıcı içerik üretimi gereken yerlerde Jev kullanılamaz. Jev sadece karar verme, sınıflandırma, güvenlik kapıları (guardrails) ve agent yönlendirme görevleri için optimize edilmiştir.

### RLCD (Reinforcement Learning for Calibrated Decisions) nedir?
RLCD, modelin verdiği kararlara atadığı güven ve olasılık değerlerinin gerçek dünyadaki başarı oranıyla birebir örtüşmesini sağlayan yeni bir pekiştirmeli öğrenme tekniğidir. Modelin aşırı özgüvenli halüsinasyonlar üretmesini engeller.

---

## Sonuç

Yapay zeka ekosistemi, "her işi tek bir devasa sohbet modeliyle çözme" evresini geride bırakıyor. Önümüzdeki dönemde yazılım mimarileri; hızlı ve deterministik kararlar için **Jev gibi System-1 modelleri**, karmaşık planlama ve kod üretimi için ise **Claude veya GPT gibi System-2 modellerini** bir arada kullanan çok katmanlı hibrit sistemler üzerine kurulacak.
