---
title: "LLM'lerde KV Cache Nedir? Ne İşe Yarar, Ne Zaman Kullanılır?"
date: "2026-03-28"
excerpt: "KV Cache büyük dil modellerinde nedir, nasıl çalışır ve performansa nasıl katkı sağlar? Transformer mimarisinden pratik kullanıma kapsamlı bir rehber."
tags: ["KV Cache", "LLM", "Transformer", "Yapay Zeka", "Performans", "Inference", "Attention Mekanizması", "Büyük Dil Modelleri", "AI Optimizasyon"]
category: "Yapay Zeka"
---

Büyük dil modelleri (LLM) ile çalışırken karşılaşılan en önemli teknik kavramlardan biri **KV Cache** (Key-Value Cache) mekanizmasıdır. Model inference'ını hızlandıran, maliyeti düşüren ve gerçek zamanlı uygulamalarda kritik rol oynayan bu yapıyı anlamak; hem uygulama geliştirici hem de model optimizasyonu yapanlar için büyük önem taşır.

## KV Cache Nedir?

KV Cache, transformer mimarisinde **dikkat (attention) mekanizması** sırasında hesaplanan **Key (Anahtar)** ve **Value (Değer)** matrislerinin bellekte saklanması işlemidir.

Transformer modellerinde her token üretilirken, modelin önceki tüm token'ları yeniden hesaplaması gerekmez. Bunun yerine, önceden hesaplanmış Key ve Value vektörleri önbellekte tutulur; yeni gelen token yalnızca bu mevcut önbellekle etkileşime girer.

Basitçe söylemek gerekirse:

> **KV Cache olmadan:** Her yeni token üretildiğinde, tüm bağlam yeniden hesaplanır.
> **KV Cache ile:** Önceki hesaplamalar saklanır, yalnızca yeni token için hesaplama yapılır.

## Transformer Attention Mekanizması ve KV Cache

Transformer'ların kalbinde **Self-Attention** mekanizması yatar. Her token için üç vektör üretilir:

- **Q (Query):** "Bu token ne arıyor?"
- **K (Key):** "Bu token ne sunuyor?"
- **V (Value):** "Bu token ne içeriyor?"

Attention hesabı şöyle yapılır:

```
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
```

Bir metin üretimi (generation) sürecinde:

1. **Prefill aşaması:** Tüm giriş metni (prompt) bir kez işlenir; tüm K ve V vektörleri hesaplanıp önbelleğe alınır.
2. **Decode aşaması:** Her yeni token üretilirken yalnızca o token'ın Q vektörü hesaplanır; K ve V değerleri önbellekten okunur.

Bu sayede gereksiz hesaplama ortadan kalkar.

## KV Cache Ne Zaman Kullanılır?

KV Cache birkaç farklı bağlamda devreye girer:

### 1. Autoregressive Metin Üretimi

ChatGPT, Claude, Gemini gibi modellerin kelime kelime yanıt ürettiği her durumda KV Cache aktif olarak kullanılır. Cevabın uzun olduğu durumlarda önbelleğin önemi daha da artar.

### 2. Uzun Bağlamlarla Çalışma

100K, 200K hatta 1M token bağlam penceresi sunan modellerde, KV Cache olmadan her token için tüm bağlamı yeniden hesaplamak pratikte imkânsız olurdu.

### 3. Çok Turlu Sohbet Uygulamaları

Kullanıcıyla süregelen bir sohbette önceki mesajların önbellekte tutulması, her turda tekrar hesaplama yapmayı engeller.

### 4. Sistem Promptu Paylaşımı (Prefix Caching)

Aynı sistem promptunu kullanan birden fazla istek olduğunda, bu sabit kısmın KV önbelleği tüm istekler arasında paylaşılabilir. Anthropic ve OpenAI gibi sağlayıcılar bu özelliği **Prompt Caching** adıyla sunmaktadır.

## KV Cache'in Faydaları

### Hız

Decode aşamasında her token için yapılan hesaplama O(n²) yerine O(n) seviyesine iner (n = bağlam uzunluğu). Uzun bağlamlarda bu fark çarpıcı biçimde hissedilir.

### Maliyet Azaltma

API sağlayıcıları önbellekten okunan token'ları genellikle daha düşük fiyatla faturalandırır. Anthropic'in Claude modellerinde önbellekten okunan token'lar %90'a varan indirimle işlenir.

### Düşük Gecikme (Latency)

Gerçek zamanlı uygulamalarda — sesli asistanlar, anlık sohbet botları, canlı kod önerileri — KV Cache sayesinde ilk token'ın ekrana gelmesi (TTFT: Time to First Token) önemli ölçüde hızlanır.

### Ölçeklenebilirlik

Sunucu tarafında aynı sistem promptunu kullanan binlerce eşzamanlı istek, önbelleği paylaşarak GPU belleğini ve hesaplama gücünü çok daha verimli kullanır.

## KV Cache'in Sınırlamaları

Her teknoloji gibi KV Cache'in de bazı kısıtları vardır:

**Bellek tüketimi:** Önbellek büyüdükçe GPU/CPU bellek kullanımı artar. Bağlam penceresi genişledikçe bu sorun derinleşir.

**Bağlam değiştiğinde geçersizleşme:** Kullanıcı geçmiş bir mesajı düzenlediğinde veya sohbet sırası değiştiğinde önbellek kısmen ya da tamamen geçersiz hale gelir.

**Sıra bağımlılığı:** KV Cache yalnızca token sırası değişmediğinde geçerlidir. Aynı içerik farklı sırada gelirse önbellekten yararlanılamaz.

## Pratik Kullanım: Prompt Caching API'leri

Anthropic Claude API'de prefix caching şöyle etkinleştirilir:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "Sen yardımcı bir asistansın...",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": "Merhaba!"}]
)
```

Bu örnekte sistem promptu önbelleğe alınır; sonraki isteklerde aynı içerik tekrar hesaplanmaz.

## KV Cache ile Çalışırken Dikkat Edilmesi Gerekenler

- **Sistem promptunu sabit tutun:** Değişen bir sistem promptu önbelleği her seferinde bozar.
- **Önbelleği ısıtın (warm-up):** İlk istek her zaman tam hesaplama yapar; sonraki istekler önbellekten yararlanır.
- **Bağlam sıralamasına dikkat edin:** Önbelleklenebilir içeriği (sistem promptu, dokümanlar) her zaman mesaj geçmişinin önüne koyun.
- **Token sayısını izleyin:** API yanıtlarındaki `cache_read_input_tokens` ve `cache_creation_input_tokens` değerlerini takip ederek önbellek etkinliğini ölçün.

## Sonuç

KV Cache, büyük dil modellerinin pratikte kullanılabilir olmasını sağlayan temel optimizasyonlardan biridir. Transformer mimarisinin doğasından gelen hesaplama yükünü dramatik biçimde azaltır; uzun bağlamlar, çok turlu sohbetler ve yüksek trafikli API servisleri için vazgeçilmezdir.

Bir LLM uygulaması geliştiriyorsanız, prefix caching özelliğini aktif kullanmak hem maliyet hem de yanıt hızı açısından ölçülebilir kazanımlar sağlayacaktır.
