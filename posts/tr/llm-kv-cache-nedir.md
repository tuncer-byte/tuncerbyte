---
title: "KV Cache Nedir? LLM'lerde Attention ve Önbellekleme Rehberi [2026]"
date: "2026-03-28"
updated: "2026-09-13"
excerpt: "KV Cache (Key-Value Cache) nedir? Transformer dikkat mekanizmasında K ve V tensörlerini önbelleğe alarak LLM inference gecikmesini O(n²)'den O(n)'e nasıl düşürdüğünü ve API maliyet tasarrufunu keşfedin."
tags: ["KV Cache", "LLM", "Transformer", "Yapay Zeka", "Performans", "Inference", "Attention Mekanizması", "Prompt Caching", "Büyük Dil Modelleri", "AI Optimizasyon"]
category: "Yapay Zeka"
---

Büyük dil modelleri (LLM) ile çalışırken karşılaşılan en kritik teknik optimizasyon kavramlarından biri **KV Cache** (Key-Value Cache) mekanizmasıdır. Model çıkarımını (inference) hızlandıran, API maliyetlerini %90'a varan oranda düşüren ve gerçek zamanlı yapay zeka uygulamalarında gecikmeyi (latency) en aza indiren bu mimariyi anlamak; hem yazılım mühendisleri hem de AI sistem mimarları için hayati önem taşır.

> **Özet (TL;DR):**
> - **Tanım:** KV Cache, transformer mimarisinin self-attention katmanında üretilen Key (Anahtar) ve Value (Değer) matrislerinin GPU belleğinde saklanmasıdır.
> - **Amaç:** Her yeni token üretildiğinde önceki token'ları tekrar tekrar hesaplama zorunluluğunu ortadan kaldırmak.
> - **Performans Kazanımı:** Hesaplama karmaşıklığını **O(n²)**'den **O(n)**'e indirir; yanıt süresini (Time to First Token & token/sn) katbekat hızlandırır.
> - **Maliyet:** Anthropic Claude, OpenAI ve Google Gemini gibi API'lerde **Prompt Caching** desteğiyle %80-90 maliyet tasarrufu sağlar.
> - **Darboğaz:** Yüksek GPU VRAM (bellek) tüketimi.

---

## KV Cache Nedir?

KV Cache (Key-Value Cache), transformer mimarisinde **dikkat (attention) mekanizması** sırasında her girdi token'ı için hesaplanan **Key (Anahtar)** ve **Value (Değer)** vektörlerinin GPU belleğinde (VRAM) saklanması işlemidir.

Büyük dil modellerinde (ChatGPT, Claude, Gemini, LLaMA) metin üretimi **otoregresif (autoregressive)** olarak gerçekleşir; yani model her adımda bir sonraki tek bir token'ı tahmin eder.

- **KV Cache olmadan:** 1000 kelimelik bir yanıtta 1001. kelime üretilirken, önceki 1000 kelimenin tamamı transformer katmanlarından tekrar geçirilir. Bu, adım başına hesaplama maliyetini kuadratik olarak (**O(n²)**) artırır.
- **KV Cache ile:** Önceki 1000 kelimenin Key ve Value temsilleri bellekte tutulur. Yalnızca yeni üretilen token için hesaplama yapılır ve hesaplama maliyeti doğrusal (**O(n)**) seviyede kalır.

---

## Transformer Attention Mekanizması ve KV Cache

Transformer mimarisinin kalbinde **Self-Attention (Öz-Dikkat)** mekanizması yer alır. Model, her bir token için üç temel vektör üretir:

- **Q (Query - Sorgu):** *"Bu token bağlamda ne arıyor?"*
- **K (Key - Anahtar):** *"Bu token diğer token'lara ne sunuyor?"*
- **V (Value - Değer):** *"Bu token'ın taşıdığı anlamsal içerik nedir?"*

Attention matematiksel olarak şu formülle hesaplanır:

```
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
```

Otoregresif üretim sürecinde iki ana aşama bulunur:

### 1. Prefill Aşaması (Prompt Processing)
Kullanıcının gönderdiği sistem promptu ve mesaj geçmişi tek seferde paralel olarak işlenir. Girişteki tüm token'ların K ve V vektörleri hesaplanır ve KV Cache tensörüne yazılır.

### 2. Decode Aşaması (Token Generation)
Model kelime kelime yanıt üretmeye başlar. Üretilen her yeni token için sadece tek bir **Q (Query)** vektörü hesaplanır. K ve V değerleri ise doğrudan önbellekten okunur ve yeni token'ın K/V değerleri önbelleğe eklenir.

Bu sayede her adımda yüz binlerce matris çarpımı yapmak yerine yalnızca bellekten okuma gerçekleştirilir.

---

## KV Cache Ne Zaman ve Hangi Modellerde Kullanılır?

KV Cache modern yapay zeka modellerinin neredeyse tamamında standart olarak kullanılır:

### 1. Autoregressive Metin Üretimi
ChatGPT (GPT-4o, GPT-5), Claude (Claude 3.5 Sonnet, Opus 4.6) ve Google Gemini gibi modellerin sohbet arayüzlerinde veya API'lerinde kelime kelime yanıt verdiği her senaryoda KV Cache aktiftir.

### 2. Uzun Bağlamlı Modeller (Long-Context LLMs)
100K, 200K hatta 1M-2M token bağlam penceresine sahip modern modellerde KV Cache olmadan çıkarım yapmak imkansızdır. Bir kitap boyutundaki dokümanı her kelimede baştan işlemek saniyeler süren gecikmelere yol açardı.

### 3. Çok Turlu (Multi-Turn) Sohbetler
Kullanıcı ile yapay zeka arasındaki diyalog uzadıkça, geçmiş konuşmanın KV önbelleği bellekte tutularak sonraki her sorunun saniyesinde yanıtlanması sağlanır.

### 4. API Düzeyinde Prompt Caching (Prefix Caching)
Anthropic Claude API, OpenAI API ve Google Gemini Context Caching servisleri, aynı sistem talimatını veya referans dokümanını içeren isteklerde KV Cache'i sunucu tarafında yeniden kullanarak faturalandırılan token maliyetlerini ciddi oranda düşürür.

---

## KV Cache'in Faydaları

1. **Yüksek Çıkarım Hızı (Throughput):** Decode aşamasında kuadratik O(n²) hesaplama yükünü doğrusal O(n) seviyesine çekerek saniyedeki üretilen token sayısını (tokens per second) katlar.
2. **Düşük Gecikme (Low TTFT & Latency):** Özellikle canlı ses asistanları, IDE kod tamamlama araçları ve anlık müşteri hizmetleri botlarında ilk token'ın üretilme süresini (Time to First Token) minimuma indirir.
3. **Maliyet Avantajı:** Claude API'de önbelleğe alınmış token okumaları standart giriş fiyatına göre **%90 indirimli**, OpenAI'da ise %50 indirimlidir.
4. **Altyapı Ölçeklenebilirliği:** vLLM, TensorRT-LLM ve TGI gibi inference motorları PagedAttention ve KV Caching ile aynı sunucuda 4-8 kat daha fazla eşzamanlı kullanıcıya hizmet verebilir.

---

## KV Cache'in Sınırlamaları ve Bellek (VRAM) Darboğazı

KV Cache muazzam bir hız kazandırsa da beraberinde donanımsal kısıtlamalar getirir:

- **GPU VRAM Tüketimi:** KV Cache doğrudan hızlı GPU belleğinde (HBM / VRAM) tutulur. Model parametrelerinin kendisi kadar, hatta uzun bağlamlarda modelden daha fazla yer kaplayabilir. (Örn. 70B modelde 128K bağlam için onlarca gigabayt VRAM gerekir).
- **Bağlam Sırasına Duyarlılık:** Token sırası değiştiği anda (örneğin kullanıcı geçmiş bir mesajı düzenlediğinde) önbellek geçersiz kalır ve yeniden hesaplanması gerekir.
- **Bellek Parçalanması (Fragmentation):** Klasik bellek tahsisinde uzun bağlamlar GPU belleğini parçalayabilir. Bu sorunu çözmek için modern motorlar sanal bellek sayfalamasına benzeyen **PagedAttention** (vLLM) mimarisini geliştirmiştir.

---

## Pratik Kullanım: Claude ve OpenAI Prompt Caching API Örneği

Anthropic Claude API'de KV / Prefix Caching kullanımı:

```python
import anthropic

client = anthropic.Anthropic()

# 1024 token ve üzeri sistem promptu veya dokümanlar otomatik önbelleğe alınır
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "Sen bir yazılım mimarisisin... [büyük dokümantasyon]",
            "cache_control": {"type": "ephemeral"}  # KV Cache'e yaz/oku
        }
    ],
    messages=[{"role": "user", "content": "Bu mimarideki güvenlik açıklarını listele."}]
)

# Token kullanımını inceleyin
print(f"Önbelleğe yazılan: {response.usage.cache_creation_input_tokens}")
print(f"Önbellekten okunan (%90 indirimli): {response.usage.cache_read_input_tokens}")
```

---

## KV Cache ile İlgili Sıkça Sorulan Sorular (FAQ)

### KV Cache'in temel amacı nedir?
KV Cache'in temel amacı, büyük dil modellerinde otoregresif metin üretimi (decode aşaması) sırasında önceki token'ların Key ve Value temsillerini bellekte saklayarak her adımda tüm bağlamın baştan hesaplanmasını engellemek ve çıkarım süresini hızlandırmaktır.

### KV Cache ile normal web önbelleği (Redis, Memcached) arasındaki fark nedir?
Geleneksel web önbellekleri (Redis, Memcached veya Semantik Cache) kullanıcı sorgularının ve tam metin yanıtlarının uygulama katmanında saklanmasıdır. KV Cache ise transformer modelinin içindeki matris ve tensör seviyesinde çalışan, GPU belleğine doğrudan bağlı matematiksel bir önbellekleme tekniğidir.

### Hangi yapay zeka modelleri KV Cache kullanır? (Claude, ChatGPT, Gemini, LLaMA)
Tüm modern autoregressive transformer tabanlı modeller KV Cache kullanır. Buna Anthropic Claude, OpenAI ChatGPT / GPT-4 / GPT-5, Google Gemini, Meta LLaMA, Mistral ve DeepSeek dahildir.

### Prompt Caching ile KV Cache aynı şey midir?
Prompt Caching, KV Cache teknolojisinin API seviyesine taşınmış ticari bir uygulamasıdır. Sistem promptu veya büyük referans dokümanları bir kez işlenip KV Cache olarak sunucu belleğinde saklanır; aynı prefix'e sahip sonraki istekler bu önbellekten %90 indirimli ve çok daha hızlı yanıt alır.

### KV Cache'in en büyük dezavantajı ve darboğazı nedir?
En büyük darboğaz GPU VRAM (bellek) tüketimidir. Uzun bağlam pencerelerinde (128K+ token) KV Cache boyutu model ağırlıklarını aşabilir ve sunucu belleğinde yer kalmamasına (OOM - Out of Memory) yol açabilir. Bu durum Grouped-Query Attention (GQA) ve PagedAttention gibi optimizasyon teknikleriyle dengelenmeye çalışılır.

### Transformer mimarisinde dikkat (attention) mekanizması KV Cache ile nasıl çalışır?
Transformer'da her token için Query (Q), Key (K) ve Value (V) üretilir. Prefill aşamasında prompttaki tüm token'ların K ve V tensörleri önbelleğe yazılır. Decode aşamasında üretilen her yeni kelime için sadece tek bir Q vektörü hesaplanır ve önbellekteki mevcut K ve V vektörleriyle dikkat matrisi oluşturularak hızlıca bir sonraki token belirlenir.

---

## Sonuç

KV Cache, büyük dil modellerinin laboratuvar ortamından çıkıp milyonlarca insanın saniyeler içinde yanıt aldığı ticari ürünlere dönüşmesini sağlayan en temel yapı taşıdır. Uygulama geliştirirken prefix caching ve prompt optimizasyonu tekniklerini kullanmak, hem kullanıcı deneyimini iyileştirecek hem de API giderlerinizi çarpıcı biçimde azaltacaktır.
