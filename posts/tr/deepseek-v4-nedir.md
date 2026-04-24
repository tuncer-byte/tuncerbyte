---
title: "DeepSeek V4 Yayınlandı: 1M Bağlam, Sınır Düzeyinde Kodlama, Ufak Fiyata"
date: "2026-04-24"
excerpt: "DeepSeek, 24 Nisan 2026'da V4-Pro ve V4-Flash modellerini duyurdu. İkisi de açık kaynak, MIT lisanslı, 1M token bağlam pencereli. V4-Pro, LiveCodeBench'te 93,5% ile tüm modelleri geçiyor. V4-Flash, GPT-5.4 Nano'dan daha ucuz. Eski modeller 24 Temmuz'da kapanıyor."
tags: ["DeepSeek", "DeepSeek V4", "DeepSeek V4-Pro", "DeepSeek V4-Flash", "Açık Kaynak LLM", "Yapay Zeka", "LLM", "Mixture of Experts", "1M Bağlam", "Ajansal AI"]
category: "Teknoloji"
---

24 Nisan 2026. DeepSeek, **V4-Pro** ve **V4-Flash** modellerini duyurdu. R1'in "Sputnik anı"ndan yaklaşık bir yıl sonra gelen bu modeller, kodlama kıyaslamalarında hızla öne çıkarken Batılı sınır modellerinin çok altında bir fiyatla sunuluyor.

Her ikisi de **MIT lisanslı** açık ağırlıklarla yayınlandı. Her ikisinde de **1 milyon token bağlam penceresi** standart olarak geliyor. Her ikisine de API üzerinden bugün erişilebilir.

---

## İki Model

### DeepSeek-V4-Pro

Amiral gemi. Sınır düzeyinde model olarak konumlandırılmış:

- **1,6 trilyon toplam parametre / 49 milyar aktif parametre** (Mixture of Experts)
- Hugging Face'te 865GB
- Ajansal kodlama, dünya bilgisi ve STEM akıl yürütmede öne çıkıyor
- DeepSeek, GPT-5.5 ve Gemini 3.1 Pro'dan "yaklaşık 3 ila 6 ay" geride olduğunu kabul ediyor

### DeepSeek-V4-Flash

Hızlı ve ekonomik alternatif — küçültülmüş bir sürüm değil:

- **284 milyar toplam parametre / 13 milyar aktif parametre** (Mixture of Experts)
- Hugging Face'te 160GB
- V4-Pro ile karşılaştırılabilir akıl yürütme, daha hızlı yanıt süresi
- "Hızlı, verimli ve ekonomik seçenek" olarak tanımlanıyor

Her iki model de üç akıl yürütme modu destekliyor: **standart**, **düşün** (think) ve **derin düşün** (think-max).

---

## Benchmark Sonuçları

### V4-Pro

| Benchmark | V4-Pro | Claude Opus 4.6 | GPT-5.4 | Gemini 3.1 Pro |
|-----------|--------|-----------------|---------|----------------|
| **LiveCodeBench** | **%93,5** | %88,8 | — | %91,7 |
| **Codeforces** | **3206** | — | 3168 | — |
| **SWE-bench Verified** | %80,6 | %80,8 | — | — |
| Terminal-Bench 2.0 | %67,9 | %65,4 | %75,1 | — |
| HLE (akıl yürütme) | %37,7 | %40,0 | %39,8 | **%44,4** |
| HMMT 2026 matematik | %95,2 | %96,2 | **%97,7** | — |
| SimpleQA-Verified | %57,9 | — | — | **%75,6** |

V4-Pro'nun öne çıktığı alan: **kodlama**. LiveCodeBench'te %93,5, değerlendirilen tüm modeller arasında en yüksek skor. Codeforces'ta 3206, GPT-5.4'ün 3168'ini geçiyor.

Geride kaldığı alanlar: genel bilgi geri çağırma (SimpleQA %57,9 vs Gemini'nin %75,6'sı) ve çok disiplinli akıl yürütme (HLE %37,7 — üç rakibin de altında).

SWE-bench'te %80,6, Claude Opus 4.6'nın %80,8'ine 0,2 puan yakın. Ancak her ikisi de geçen hafta çıkan Claude Opus 4.7'nin %87,6'sının oldukça gerisinde.

### V4-Flash

| Benchmark | V4-Flash | V4-Pro |
|-----------|----------|--------|
| SWE-bench Verified | %79,0 | %80,6 |
| LiveCodeBench | %91,6 | %93,5 |
| Terminal-Bench 2.0 | %56,9 | %67,9 |
| SimpleQA-Verified | %34,1 | %57,9 |

Flash, kodlama kıyaslamalarında Pro'dan 1-2 puan geride — devasa maliyet farkı düşünüldüğünde kayda değer bir yakınlık.

---

## Fiyatlandırma: Asıl Fark Burada

| Model | Girdi (önbelleksiz) | Girdi (önbellekli) | Çıktı |
|-------|---------------------|-------------------|-------|
| **V4-Flash** | $0,28 / 1M | $0,028 / 1M | $0,28 / 1M |
| **V4-Pro** | $1,74 / 1M | $0,145 / 1M | $3,48 / 1M |
| GPT-5.4 | $2,50 / 1M | $0,25 / 1M | $15,00 / 1M |
| GPT-5.5 | $5,00 / 1M | $0,50 / 1M | $30,00 / 1M |
| Claude Opus 4.6 | $5,00 / 1M | — | $25,00 / 1M |

Öne çıkan karşılaştırmalar:

- **V4-Flash, GPT-5.4 Nano'yu** ($0,20/$1,25 girdi/çıktı) girdi maliyetinde geçiyor
- **V4-Pro, Claude Opus 4.6'dan 7 kat daha ucuz** — girdi maliyetinde, SWE-bench'te ise neredeyse aynı
- **V4-Pro çıktısı GPT-5.4'ten 4,3 kat, GPT-5.5'ten ise yaklaşık 9 kat daha ucuz**
- V4-Flash çıktısı $0,28/1M ile **Claude Opus 4.6'dan 89 kat daha ucuz**

MIT lisansıyla açık kaynak ağırlıklar bu fiyatlandırmaya eklenince DeepSeek V4'ün neden önemli olduğu netleşiyor: model tam anlamıyla sınırda değil, ama yeterince yakın — ve fiyatı üretim dağıtımlarının hesabını tamamen değiştirecek düzeyde.

---

## Mimari: Üç Temel Yenilik

### 1. Hibrit Dikkat — CSA + DSA

V4, token bazlı sıkıştırma içeren **Compressed Sparse Attention (CSA)** ile **DeepSeek Sparse Attention (DSA)**'yı birleştiren yeni bir dikkat mekanizması kullanıyor. V3.2'ye kıyasla:

- V4-Pro: **tek token çıkarımı için yalnızca %27 FLOP**, KV önbelleği boyutunun %10'u
- V4-Flash: **tek token çıkarımı için yalnızca %10 FLOP**, KV önbelleği boyutunun %7'si

1M bağlam penceresi bu verimlilik sayesinde teorik değil, pratik olarak kullanışlı hale geliyor.

### 2. Manifold-Constrained Hyper-Connections (mHC)

1,6T parametreli bir modeli bu ölçekte eğitmek gradyan kararlılığı sorunlarını çözmeyi gerektiriyor. mHC, sinyal amplifikasyonunu **3.000 kattan 1,6 kata** indirerek bu parametre sayısında kararlı eğitim oturumlarını mümkün kılıyor.

### 3. Muon Optimizer

Her iki model de AdamW yerine Muon ile eğitildi; daha hızlı yakınsama ve daha yüksek eğitim kararlılığı sağlıyor:

- V4-Pro: **33 trilyon token** üzerinde eğitildi
- V4-Flash: **32 trilyon token** üzerinde eğitildi

---

## Erişim ve Entegrasyon

### Sohbet Arayüzü

- [chat.deepseek.com](https://chat.deepseek.com)
- **Uzman Modu** → V4-Pro
- **Anlık Mod** → V4-Flash

### API

`api.deepseek.com` üzerinden bugün itibarıyla erişilebilir. İki uyumluluk modu:

```python
# OpenAI uyumlu
from openai import OpenAI
client = OpenAI(api_key="anahtar", base_url="https://api.deepseek.com")

response = client.chat.completions.create(
    model="deepseek-v4-pro",   # ya da deepseek-v4-flash
    messages=[{"role": "user", "content": "..."}],
)
```

```python
# Anthropic uyumlu
import anthropic
client = anthropic.Anthropic(api_key="anahtar", base_url="https://api.deepseek.com")

message = client.messages.create(
    model="deepseek-v4-pro",
    max_tokens=1024,
    messages=[{"role": "user", "content": "..."}],
)
```

Claude Code, OpenClaw ve OpenCode ajansal sistemleriyle bırak-yerleştir uyumlu.

### Açık Ağırlıklar (Hugging Face)

Her iki model de MIT lisansıyla kendi altyapında çalıştırılabilir:
- V4-Pro: 865GB — H100/H200 altyapısı gerektirir
- V4-Flash: 160GB — A100 kümelerine sahip ekipler için daha erişilebilir

**Not:** Lansmanda Jinja format chat template yok — Hugging Face deposundaki Python kodlama scriptlerini kullanmak gerekiyor.

### Eski Model Kullanım Sonu

`deepseek-chat` ve `deepseek-reasoner` modelleri **24 Temmuz 2026**'da kullanımdan kalkıyor. Bu tarihten önce `model` parametresini `deepseek-v4-pro` veya `deepseek-v4-flash` olarak güncellemek gerekiyor.

---

## Sınırlılıklar

Dürüst bir değerlendirme:

- **Genel bilgi geri çağırma zayıf.** SimpleQA'da %57,9, Gemini 3.1 Pro'nun %75,6'sının önemli ölçüde gerisinde.
- **Çok disiplinli akıl yürütme geride.** HLE'de %37,7, GPT-5.4 (%39,8), Claude Opus 4.6 (%40,0) ve Gemini (%44,4)'nin altında.
- **Önizleme sürümü.** Daha fazla post-training iyileştirmesi bekleniyor; bu sürümler nihai kalitede değil.
- **Çin merkezli API altyapısı.** Düzenlenmiş sektörler için veri egemenliği gerçek bir değerlendirme noktası.
- **V4-Pro'yu kendi altyapında çalıştırmak kaynak yoğun.** 865GB ve H100/H200 gereksinimi çoğu ekibin erişim alanı dışında.
- **Jinja chat template yok.** Küçük ama lansmanı için geçici çözüm gerektiriyor.

---

## Özet Karşılaştırma

| | V4-Pro | V4-Flash | GPT-5.5 | Claude Opus 4.7 |
|--|--------|----------|---------|-----------------|
| **Aktif parametre** | 49B | 13B | Kapalı | Kapalı |
| **Bağlam penceresi** | 1M | 1M | Standart | 200K |
| **Lisans** | MIT (açık) | MIT (açık) | Kapalı | Kapalı |
| **Girdi fiyatı** | $1,74/M | $0,28/M | $5,00/M | $5,00/M |
| **Çıktı fiyatı** | $3,48/M | $0,28/M | $30,00/M | $25,00/M |
| **LiveCodeBench** | **%93,5** | %91,6 | — | — |
| **SWE-bench** | %80,6 | %79,0 | — | **%87,6** |
| **HLE** | %37,7 | — | — | %54,7 |
| **API erişimi** | Var | Var | Yakında | Var |

---

## Sonuç

DeepSeek V4, sınırın en tepesinde değil. DeepSeek'in kendi kabulüyle GPT-5.5 ve Gemini 3.1 Pro'dan 3–6 ay geride. Bilgi geri çağırma ve genel akıl yürütmede fark gerçek.

Ama **kodlamada** — geliştirici ve ajansal kullanım için en önemli kıyaslama — V4-Pro LiveCodeBench'te tüm modelleri geçiyor, Claude Opus 4.6 ile SWE-bench'te omuz omuza çalışıyor ve bunu sınır modellerin küçük bir bölümü fiyatına yapıyor. V4-Flash ise Pro düzeyine yakın kodlama performansını üretim ortamlarında varsayılan çıkarım modeli olarak kullanmayı ekonomik hale getirecek maliyetle sunuyor.

Bütçenin önemli olduğu ve birincil kullanım senaryosunun kod olduğu ekipler için V4, şu anda mevcut en ilgi çekici açık ağırlık seçeneği. Güçlü olgusal zemin veya geniş akıl yürütme derinliği gerektiren ekipler içinse SimpleQA ve HLE'deki boşluklar dikkatle değerlendirilmeli.

**API erişimi:** [api.deepseek.com](https://api.deepseek.com) — şu anda mevcut.

**Sohbet:** [chat.deepseek.com](https://chat.deepseek.com) — Uzman Modu (Pro) veya Anlık Mod (Flash).

**Açık ağırlıklar:** Hugging Face — MIT lisansı, kendi altyapında çalıştırılabilir.

Kaynaklar:
- [DeepSeek V4 Önizleme Sürümü — DeepSeek API Belgeleri](https://api-docs.deepseek.com/news/news260424)
- [DeepSeek V4 — neredeyse sınırda, fiyatın küçük bir bölümüne — Simon Willison](https://simonwillison.net/2026/Apr/24/deepseek-v4/)
- [DeepSeek V4-Pro İncelemesi — BuildFastWithAI](https://www.buildfastwithai.com/blogs/deepseek-v4-pro-review-2026)
- [DeepSeek V4-Pro vs V4-Flash — Lushbinary](https://lushbinary.com/blog/deepseek-v4-pro-vs-flash-benchmarks-pricing-comparison/)
- [DeepSeek V4-Pro, GPT-5.4 düzeyinde performans sunuyor — OfficeChai](https://officechai.com/ai/deepseek-v4-pro-deepseek-v4-flash-benchmarks-pricing/)
