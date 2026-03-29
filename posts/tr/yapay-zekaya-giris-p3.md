---
title: "Foundation Model Değerlendirmesi: Metrikler, Embedding ve AI Hakemliği — Bölüm 3"
date: "2026-03-29"
excerpt: "Bir modeli nasıl değerlendirirsin? Entropy'den perplexity'ye, exact match'ten embedding tabanlı metriklere, AI hakemliğinden karşılaştırmalı sıralamaya — foundation model değerlendirmesinin tüm boyutlarını ele aldık."
tags: ["Yapay Zeka", "LLM", "Foundation Model", "Değerlendirme", "Perplexity", "Entropy", "Embedding", "AI Judge", "BERTScore", "AI Mühendisliği"]
category: "Teknik"
series: "yapay-zekaya-giris"
seriesTitle: "Yapay Zekaya Giriş"
---

**İçindekiler**

- [Foundation Model Değerlendirmenin Zorlukları](#foundation-model-değerlendirmenin-zorlukları)
- [Dil Modeli Metrikleri](#dil-modeli-metrikleri)
- [Entropy](#entropy)
- [Cross Entropy](#cross-entropy)
- [Bits-per-Character ve Bits-per-Byte](#bits-per-character-ve-bits-per-byte)
- [Perplexity](#perplexity)
- [Perplexity Yorumlama ve Kullanım Senaryoları](#perplexity-yorumlama-ve-kullanım-senaryoları)
- [Tam Eşleşme Değerlendirmesi](#tam-eşleşme-değerlendirmesi)
- [Fonksiyonel Doğruluk](#fonksiyonel-doğruluk)
- [Referans Veriye Karşı Benzerlik Ölçümleri](#referans-veriye-karşı-benzerlik-ölçümleri)
- [Embedding'e Giriş](#embeddingemge-giriş)
- [Hakem Olarak Yapay Zeka](#hakem-olarak-yapay-zeka)
- [Karşılaştırmalı Değerlendirme ile Model Sıralama](#karşılaştırmalı-değerlendirme-ile-model-sıralama)
- [Özet](#özet)

[Bölüm 1'de](/blog/yapay-zekaya-giris-p1) dil modelinin temellerini işledik — token nedir, self-supervised learning nasıl çalışır, post-training nedir. [Bölüm 2'de](/blog/yapay-zekaya-giris-p2) Transformer mimarisinin içine girdik — attention mekanizması, scaling laws, örnekleme stratejileri, halüsinasyon. Bu bölümde farklı bir perspektife geçiyoruz: **bir modeli nasıl değerlendirirsin?**

Kulağa basit geliyor. Ama değil.

---

## Foundation Model Değerlendirmenin Zorlukları

Bir modeli test etmek istediğinde ilk soru şu: neyi ölçüyorsun?

"İyi bir dil modeli" çok geniş bir kavram. Doğru bilgi mi üretiyor? Kodun çalışıyor mu? Soruyu anlıyor mu? Güvenli mi? Tutarlı mı? Bunların hepsi farklı ölçümler, farklı yöntemler.

İkinci sorun: **benchmark kirlenmesi (contamination)**. Bir model değerlendirme veri setiyle eğitilmişse testin hiçbir anlamı yok. Test soruları eğitim verisine sızdıysa model cevabı ezberlemiş olabilir, gerçekten öğrenmemiş. GPT-4 gibi büyük modellerin eğitim verisi kamuya açık değil, dolayısıyla hangi benchmark'larla örtüşüp örtüşmediğini doğrulamak mümkün değil.

Üçüncü sorun: **ölçüm gerçek kullanımı yansıtmıyor**. Bir model MMLU'da yüksek puan alabilir ama pratikte işine yaramayabilir. Akademik benchmark'lar genellikle çoktan seçmeli ya da kısa cevaplı — oysa gerçek dünyada model uzun, açık uçlu, bağlamlı sorularla karşılaşıyor.

Dördüncü sorun: **insan değerlendirmesi pahalı ve tutarsız**. "Bu cevap iyi mi?" sorusuna iki farklı insan farklı yanıt verebilir. Ölçek açısından da imkânsız — milyonlarca çıktıyı insanların değerlendirmesi mümkün değil.

Bütün bunlar bir araya gelince karşımıza çıkan tablo şu: mükemmel bir değerlendirme yöntemi yok. Her yaklaşımın körlükleri var. Bu bölümde yaygın kullanılan yöntemlerin ne ölçtüğünü, ne ölçemediğini ve nerede kullanılması gerektiğini tartışacağız.

---

## Dil Modeli Metrikleri

Model performansını sayısal olarak ifade etmek için önce bir zemin kavramına ihtiyaç var: **bilgi teorisi**. Bölüm 2'de modelin her adımda bir olasılık dağılımı ürettiğini konuşmuştuk. Şimdi bu dağılımın kalitesini nasıl ölçeceğimize bakacağız.

### Entropy

1948'de Claude Shannon, "A Mathematical Theory of Communication" adlı makalesinde şu soruyu sordu: bir olasılık dağılımındaki belirsizliği sayısal olarak nasıl ifade edebiliriz?

Cevabı **entropy** oldu:

```
H(X) = -∑ p(x) · log₂ p(x)
```

Sezgisel olarak anlayalım. Adil bir madeni para fırlatıyorsun — yazı mı tura mı, ikisi de %50. Bu sonucu tahmin etmek zor. Entropy yüksek: **1 bit**. Şimdi manyetik bir para al — her zaman yazı geliyor, olasılık %100. Hiç belirsizlik yok, sonuç zaten biliniyor. Entropy sıfır.

Daha karmaşık bir örnek: dört eşit olası seçenek — A, B, C, D, her biri %25. Bu durumda:

```
H = -(4 × 0.25 × log₂(0.25))
H = -(4 × 0.25 × (-2))
H = 2 bit
```

İki bit bilgi gerekiyor — yani iki evet/hayır sorusuyla sonucu daraltabilirsin.

Dil modeliyle bağlantısı şurada: eğer bir sonraki token'ı seçmek, 50.000'lik vocabulary üzerinde düzgün dağılım gibi davransaydı, entropy çok yüksek olurdu. Gerçek dilde bazı token'lar çok daha olası, dağılım yoğunlaşmış — entropy daha düşük. İyi bir dil modeli bu dağılımı gerçeğe ne kadar yakın tahmin edebilir?

### Cross Entropy

Entropy tek bir dağılımın belirsizliğini ölçüyor. Peki ya iki dağılım arasındaki farkı?

Elimizde gerçek dağılım **p** var (metindeki gerçek token'lar) ve modelin tahmin ettiği dağılım **q** var. **Cross entropy** şunu ölçüyor: p dağılımından örnekleme yaparken q dağılımına göre kodlama yaparsan ne kadar bilgi gerekir?

```
H(p, q) = -∑ p(x) · log₂ q(x)
```

Dil modellemesinde p gerçek tokenlar, q ise modelin her adımdaki tahmini. Gerçek metinde her konumdaki token belirli — yani o pozisyon için p aslında tek bir token üzerinde yoğunlaşmış (dirac delta). Bu durumda formül sadeleşiyor:

```
H(p, q) = -log₂ q(gerçek_token)
```

Her adımda: modelin gerçek token'a verdiği olasılığın negatif logaritması. Bu değeri tüm token'lar üzerinde ortalamasını alırsın — bu sayı ne kadar düşükse model o kadar iyi.

Örnek: gerçek token "İstanbul", model bu token'a 0.6 olasılık vermiş.

```
-log₂(0.6) ≈ 0.74 bit
```

Başka bir durumda aynı token için 0.01 olasılık vermiş:

```
-log₂(0.01) ≈ 6.64 bit
```

Düşük olasılık → yüksek cross entropy → kötü tahmin. Mantıklı.

### Bits-per-Character ve Bits-per-Byte

Cross entropy token başına hesaplanıyor. Ama farklı tokenizer'lar aynı metni farklı sayıda token'a böler. GPT-4'ün tokenizer'ı "Merhaba" kelimesini farklı sayıda parçaya ayırabilirken Llama'nın tokenizer'ı farklı kesebilir. Bu yüzden token başına cross entropy değerlerini farklı modeller arasında karşılaştırmak yanıltıcı.

Çözüm: **Bits-per-Character (BPC)** ya da **Bits-per-Byte (BPB)**.

```
BPC = cross entropy (nats cinsinden) / (ln(2) × karakter sayısı)
BPB = cross entropy (nats cinsinden) / (ln(2) × byte sayısı)
```

Tokenizer'dan bağımsız, karakter ya da byte başına düşen bit sayısını verir. İki farklı model mimarisi ya da iki farklı tokenizer kullanan modeli bu metrikle adil bir zemine taşıyabilirsin. BPB özellikle multimodal ve karakter düzeyindeki modellerin karşılaştırılmasında standart haline geldi.

Düşük BPC/BPB → model metni daha iyi sıkıştırıyor → daha iyi öğrenmiş demek.

### Perplexity

Cross entropy anlamlı ama sezgisel değil. "0.74 bit cross entropy" derken aklında ne canlanıyor? Pek bir şey canlanmıyor.

**Perplexity** bunu daha anlaşılır bir ölçüye dönüştürür:

```
PPL = 2^H  (bit cinsinden cross entropy kullanıldığında)
PPL = exp(H)  (nat cinsinden)
```

Ya da doğrudan:

```
PPL = exp(-1/N · ∑ log p(xᵢ))
```

Perplexity'nin sezgisel yorumu şu: **model her adımda ortalama kaç eşit olasılıklı seçenek arasında kalmış gibi davranıyor?**

PPL = 10 ise model her token seçiminde sanki 10 eşit olasılıklı seçenek var gibi kararsız. PPL = 1 ise her adımda tek bir seçenek var demek — mükemmel tahmin. PPL = 50.000 ise modelin vocabulary kadar şaşkın olduğu anlamına geliyor, yani rastgelelikten farksız.

Somut referans noktaları:
- **GPT-2** (2019): Penn Treebank üzerinde ~29 PPL
- **GPT-3** (2020): WikiText-103 üzerinde ~20 PPL
- **Modern büyük modeller**: genel İngilizce metinlerde <10 PPL

### Perplexity Yorumlama ve Kullanım Senaryoları

Perplexity'nin güçlü olduğu yerler var, zayıf olduğu yerler var.

**Kullanıma uygun senaryolar:**

*Aynı model, farklı versiyonlar karşılaştırması.* Bir checkpoint'ten diğerine perplexity düştüyse model gerçekten ilerlemiş. Aynı tokenizer kullanıldığı sürece güvenilir bir sinyal.

*Hiperparametre ayarı.* Eğitim sırasında validation perplexity'yi izlemek, learning rate ya da batch size gibi kararlar için sağlam bir referans noktası.

*Domain uyarlaması.* Genel amaçlı model tıbbi metinler üzerinde yüksek PPL veriyorsa, o alana özel fine-tuning'in ne kadar etki ettiğini PPL ile ölçebilirsin.

**Dikkat edilmesi gerekenler:**

*Farklı tokenizer'lar arasında karşılaştırma yapma.* GPT-4'ün perplexity'si ile Llama'nın perplexity'sini direkt karşılaştıramazsın. Aynı metni farklı sayıda token'a böldükleri için rakamlar farklı ölçekten geliyor.

*Yüksek PPL her zaman kötü model değildir.* Bir model belirsiz, yaratıcı metinlerde yüksek PPL verebilir — çünkü bu metinlerin birçok olası devamı var. Kısıtlı, formüle edilmiş metinlerde PPL çok daha düşük çıkar.

*PPL, kullanışlılığı ölçmez.* Sürekli yaygın kelimeler tahmin eden bir model düşük PPL alır ama hiçbir işe yaramaz. Değerlendirme yalnızca PPL'e bırakılırsa model "güvenli" ama sıkıcı bir dile yönelir.

---

## Tam Eşleşme Değerlendirmesi

Metrik tabanlı değerlendirmeden davranışsal değerlendirmeye geçiyoruz. İlk yöntem hem en basiti hem en kırılganı: **exact match (tam eşleşme)**.

Mantık açık: modelin verdiği cevap, beklenen cevapla birebir aynı mı?

Soru: "Türkiye'nin başkenti neresidir?" → Beklenen: "Ankara" → Model: "Ankara" → ✓

Nerelerde iyi çalışır? Kısa, net cevap gerektiren sorularda. Matematiksel hesaplamalar, belirli tarihler, ülke başkentleri gibi sorularda exact match makul bir ölçüt.

Ama gerçek dünyada neredeyse her zaman kırılır. Şu alternatifleri düşün:

```
Beklenen:   "New York City"
Model çıktı: "New York"        → Yanlış (exact match'e göre)
Model çıktı: "NYC"             → Yanlış
Model çıktı: "New York City."  → Yanlış (nokta yüzünden)
```

Hepsinin cevabı aynı. Ama exact match hepsini başarısız sayıyor.

Bu sorunu kısmen çözmek için **normalized exact match** kullanılıyor: küçük harfe çevir, noktalama işaretlerini kaldır, gereksiz kelimeleri (the, a, an) sil, sonra karşılaştır. SQuAD gibi benchmark'lar bu yöntemi standart haline getirdi.

Ama sorun daha derin. Açık uçlu sorularda — "Bu kodu açıkla", "Bu konuyu özetle", "Şu kararda ne düşünüyorsun" — exact match'in hiçbir anlamı yok. Cevap biçimi serbest, doğru cevap yüzlerce farklı şekilde ifade edilebilir. Exact match burada tamamen çöküyor.

Özet: exact match, nesnel ve kısa cevaplı görevler için makul bir baseline. Başka hiçbir şey için değil.

---

## Fonksiyonel Doğruluk

Kod değerlendirmesine özgü, exact match'ten çok daha anlamlı bir yaklaşım: **fonksiyonel doğruluk (functional correctness)**.

Soru basit: model yazdığı kod çalışıyor mu ve testleri geçiyor mu?

Kodun exact match'e göre değerlendirilmesi saçmadır. Aynı işlevi yapan iki fonksiyon şöyle görünebilir:

```python
# Versiyon 1
def is_even(n):
    return n % 2 == 0

# Versiyon 2
def is_even(n):
    if n % 2 == 0:
        return True
    return False
```

Exact match: başarısız. Fonksiyonel doğruluk: her ikisi de başarılı.

Bu yaklaşımın standardı **Pass@k** metriği:

```
Pass@k = olasılık (k denemeden en az biri tüm testleri geçer)
```

Pass@1 — tek denemede çalışıyor mu? Pass@10 — on denemede bir kez olsun çalışıyor mu? Pass@100 — en az bir kez üretebiliyor mu?

Pratikte: modelden k kez çıktı al (genellikle temperature > 0 ile), her birini test suite'e karşı çalıştır, kaçı geçiyor say. İstatistiksel tarafsızlık için Chen et al.'in önerdiği unbiased estimator kullanılıyor:

```
Pass@k = 1 - C(n-c, k) / C(n, k)
```

n = toplam deneme sayısı, c = geçen deneme sayısı.

Önemli benchmark'lar:
- **HumanEval** (OpenAI, 2021): 164 Python fonksiyonu, her birinin unit testleri var
- **MBPP**: 374 programlama görevi
- **LiveCodeBench**: Contamination sorununu önlemek için yeni sorular sürekli ekleniyor

Fonksiyonel doğruluk yaklaşımının da sınırı var — unit testleri mükemmel yazılmış olmalı, edge case'leri kapsamalı. Zayıf test suite'i olan bir problem, gerçekte hatalı kodu kabul edebilir.

---

## Referans Veriye Karşı Benzerlik Ölçümleri

Kod değerlendirmesinde testler var. Peki çeviri, özetleme, soru-cevap gibi açık uçlu görevlerde ne yapacağız?

Burada standart yaklaşım: elinde bir **referans çıktı** var (doğru ya da iyi kabul edilen bir örnek), modelin ürettiği metni bununla karşılaştırıyorsun.

**BLEU (Bilingual Evaluation Understudy)**

Makine çevirisi değerlendirmesi için geliştirildi (2002). Temel fikir: model çıktısı ile referans arasında ortak n-gram'ları say.

```
BLEU = BP × exp(∑ wₙ × log pₙ)
```

BP = brevity penalty (kısa cevapları cezalandırır), pₙ = n-gram precision.

Sezgisel olarak: model "The cat sat on the mat" ürettiyse, referans "The cat sat on the mat" ise BLEU = 1. Ama "The the the the the the" ürettiyse ve referans hepsini içeriyorsa unigram precision yüksek çıkar — BLEU naif kullanımda aldatılabilir.

Daha temel bir sorun: BLEU kelimelerin aynı sırada geçip geçmediğine bakıyor, anlamına değil. "İstanbul'a uçtum" ile "İstanbul'a gittim" — farklı kelimeler, benzer anlam. BLEU skoru düşük. Oysa çeviri veya özetleme açısından her ikisi de kabul edilebilir.

**ROUGE (Recall-Oriented Understudy for Gisting Evaluation)**

Özetleme değerlendirmesi için geliştirildi. BLEU'dan farkı: precision değil **recall** odaklı. Referanstaki içerik modelin çıktısında ne kadar karşılandı?

- **ROUGE-1**: unigram örtüşmesi
- **ROUGE-2**: bigram örtüşmesi
- **ROUGE-L**: en uzun ortak alt dizi (word-order sensitive)

Özetleme değerlendirmesinde ROUGE-L genellikle tercih edilir — hem içerik hem sıra bilgisini bir arada değerlendiriyor.

**N-gram metriklerinin ortak sorunu:**

Hem BLEU hem ROUGE anlamsallığa kör. İki cümle şöyle düşün:

```
Referans:     "Polis militanlara ateş açtı çünkü onlar saldırgandı."
Model çıktı:  "Polis militanlara ateş açtı çünkü onlar korktuydu."
```

BLEU skoru çok yüksek — kelime örtüşmesi neredeyse tam. Ama anlam tamamen farklı. Bu tür semantik hatalar n-gram metriklerinden geçiyor.

---

## Embedding'e Giriş

Bölüm 2'de token embedding'lerden bahsetmiştik — her token modelin içinde bir vektöre dönüşüyor. O bağlamda embedding'ler modelin iç temsil mekanizmasıydı. Burada farklı bir perspektiften bakacağız: **anlam benzerliğini ölçmek için embedding kullanımı**.

Temel fikir şu: anlamsal olarak benzer metinler, bir vektör uzayında birbirine yakın noktalara karşılık gelecek şekilde temsil edilebilir.

"İstanbul'a gittim" ile "İstanbul'a uçtum" aynı anlam etrafında toplanmış iki cümle. Bunları bir embedding modeline verirsen, çıkan iki vektör birbirine yakın olacak. "Kuantum fiziği hakkında ne düşünüyorsun?" ile "Ayak bileklerim ağrıyor" ise çok farklı anlamlar — vektörler uzak.

Benzerliği ölçmek için **cosine similarity** kullanılıyor:

```
cosine_similarity(A, B) = (A · B) / (||A|| × ||B||)
```

1'e yakın → çok benzer. 0 → alakasız. -1 → zıt anlam.

**Embedding türleri:**

*Statik embedding'ler (Word2Vec, GloVe)* — her kelime için sabit bir vektör. "Banka" kelimesi nehir kenarı anlamında da para kurumu anlamında da aynı vektörü alır. Bağlam yok.

*Bağlamsal embedding'ler (BERT ve türevleri)* — aynı kelime, cümle içindeki konumuna göre farklı vektörler üretir. "Banka nehrin kenarındaydı" ile "Bankaya para yatırdım" cümlelerinde "banka" farklı vektörler alır. Çok daha güçlü.

*Cümle embedding'leri (Sentence Transformers)* — tüm cümleyi tek bir vektöre indirgeyecek şekilde eğitilmiş modeller. Semantik benzerlik, arama, clustering görevlerinde kullanılıyor.

**BERTScore — embedding ile değerlendirme:**

Bağlamsal embedding'leri değerlendirme metriğine dönüştüren ilk önemli çalışma BERTScore (Zhang et al., 2019). Fikir şu: exact n-gram eşleşmesi yerine, token embedding'lerini kullanarak semantik örtüşmeyi ölç.

Referans ve model çıktısının her token'ı için bağlamsal embedding üret. Sonra greedy matching ile her token'ı karşı taraftaki en benzer token'la eşleştir. Cosine similarity skoru al, F1 hesapla.

```
Referans:  "İstanbul Türkiye'nin en büyük şehridir"
Model:     "İstanbul Türkiye'deki en kalabalık kenttir"
BLEU: düşük (kelimeler farklı)
BERTScore: yüksek (anlam benzer, embedding'ler yakın)
```

BERTScore, BLEU ve ROUGE'a kıyasla insan yargısıyla çok daha iyi örtüşüyor — özellikle paraphrase içeren durumlarda.

Hangi embedding modelleri kullanılıyor? Değerlendirmede genellikle `roberta-large`, `deberta-xlarge-mnli` gibi güçlü encoder modelleri tercih ediliyor. Daha geniş bağlamda ise OpenAI text-embedding modelleri ya da open-source Sentence Transformers de kullanılabiliyor.

Embedding tabanlı değerlendirme hâlâ mükemmel değil — model cümle anlamını doğru yakalamış ama yanlış bir olguyu güzel bir şekilde ifade etmiş olabilir. Semantik benzerlik, olgusal doğruluk anlamına gelmiyor. Bu sınır önemli.

---

## Hakem Olarak Yapay Zeka

Şimdiye kadar baktığımız yöntemlerin ortak sorunu var: ya çok dar ölçüyorlar (exact match), ya anlamsız (BLEU), ya da değerlendirmek istedikleri şeyi tam yakalayamıyorlar (BERTScore). Peki gerçekten "bu cevap iyi mi kötü mü?" sorusunu otomatik ve güvenilir biçimde yanıtlayabilir miyiz?

Bu soruya verilen güncel cevap: **başka bir dil modeli sorsun**.

### Neden AI as a Judge?

İnsan değerlendirmesi altın standart sayılır. Ama pratikte uygulamak zor:

- Binlerce çıktıyı değerlendirmek için onlarca saat insan emeği gerekiyor
- Değerlendirmeciler arasında tutarsızlık kaçınılmaz — biri "tatmin edici" dediğine diğeri "yetersiz" diyebilir
- Ölçek imkânsız: milyonlarca promptun çıktısını insanlar değerlendiremez
- Çok dilli, çok alanlı değerlendirme için farklı uzmanlıklar gerekiyor

GPT-4, Claude gibi frontier modeller artık değerlendirme konusunda insan değerlendirmecilerle yüksek korelasyon gösteriyor. Modelin kalitesini, tutarlılığını, yardımcılığını ya da belirli bir kritere uygunluğunu değerlendirmek için başka bir model kullanmak giderek standart hale geldi.

Bu yaklaşım hem hızlı hem ucuz hem de tutarlı (aynı prompt → aynı yargı). Değerlendirmek istediğin her şeyi prompt'ta tanımlayabilirsin — rubric yaz, örnek ver, ağırlıklandır.

### Nasıl Kullanılır?

Üç temel kullanım biçimi var:

**Pointwise (mutlak puanlama):** Modele tek bir çıktı ver, belirli bir rubric'e göre puan iste.

```
Aşağıdaki cevabı 1-5 arasında değerlendir.
Kriter: doğruluk, açıklık, eksiksizlik.

Soru: [soru]
Cevap: [model çıktısı]

Puan ve gerekçe:
```

**Pairwise (ikili karşılaştırma):** İki çıktıyı yan yana ver, hangisi daha iyi?

```
Aşağıdaki iki cevabı karşılaştır ve hangisinin daha iyi olduğuna karar ver.
Gerekçeni açıkla. Sadece A ya da B yaz.

Soru: [soru]
Cevap A: [çıktı 1]
Cevap B: [çıktı 2]
```

**Referanslı değerlendirme:** Altın standart bir cevap var, model çıktısının buna ne kadar uyduğunu değerlendir.

```
Referans cevap: [doğru cevap]
Model cevabı: [model çıktısı]
Bu cevap referansla tutarlı mı? Kaçırılan veya fazladan bilgi var mı?
```

Hangi yöntemin seçileceği bağlama göre değişiyor. Modelleri karşılaştırıyorsan pairwise daha sağlam. Tek bir modeli belirli kriterlere göre puanlamak istiyorsan pointwise pratik. Doğruluk odaklıysan referanslı.

### Sınırlamalar

AI as a judge'ın ciddi sınırları var — bunları bilmeden bu yaklaşıma güvenmek tehlikeli.

**Pozisyon yanlılığı (Position bias):** Pairwise değerlendirmede hakem model cevap A'yı gördüğünde mi B'yi gördüğünde mi daha çok beğeniyor? Araştırmalar gösteriyor ki birçok model sistematik olarak ilk sunulan ya da ikinci sunulan cevabı tercih ediyor — içerikten bağımsız olarak. Bununla başa çıkmak için değerlendirmeyi iki kez yap: bir kez A-B, bir kez B-A sırasıyla.

**Uzunluk yanlılığı (Verbosity bias):** Modeller uzun, ayrıntılı cevapları kısa ama öz cevaplara tercih ediyor. Daha uzun = daha iyi izinimi yaratıyor, gerçekte olmasa da. Bu yanlılık pek çok benchmark'ı bozuyor.

**Öz-tercih yanlılığı (Self-enhancement bias):** GPT-4 ile değerlendirme yapıyorsan, GPT-4'ün kendi üretim tarzına benzer çıktıları beğenme eğilimi var. Aynı şekilde Claude, Claude benzeri cevapları — daha uzun, daha nuanslı, daha ihtiyatlı — daha iyi buluyor olabilir.

**Olgusal doğruluk kör noktası:** Hakem modelin değerlendirdiği bilgiyi kendi eğitiminden bilmiyorsa, yanlış ama güvenli görünen bir cevabı kabul edebilir. Özellikle güncel bilgi gerektiren konularda ve uzmanlaşmış alanlarda AI hakem güvenilir değil.

**Maliyet ve gecikme:** İnsan değerlendirmesinden hızlı, ama her değerlendirme bir API çağrısı demek. Büyük ölçekli test suite'lerinde maliyet birikebilir.

### Hangi Modeller Hakem Olabilir?

Değerlendirme için kullanılacak modelde aranan özellikler: güçlü talimat takibi, tutarlı akıl yürütme, düşük öz-tercih yanlılığı.

Günümüzde en yaygın kullanılanlar:
- **GPT-4o** — MT-Bench ve benzeri benchmark'larda yüksek insan korelasyonu gösteriyor
- **Claude 3.5/3.7 Sonnet** — özellikle kod ve teknik içerik değerlendirmesinde güçlü
- **Gemini 1.5/2.0 Pro** — çok uzun bağlamlı değerlendirmelerde avantajlı

Open source tarafta ise:
- **Llama 3.1 70B / 405B** — makul değerlendirme kalitesi, kendi altyapında çalıştırabilirsin
- **Prometheus / JudgeLM** — özellikle değerlendirme görevi için ince ayar yapılmış modeller; öz-tercih yanlılığı daha düşük

Genel kural: değerlendirdiğin modelden açıkça daha güçlü bir model hakem seçmeye çalış. Eş güçte modeller birbirini değerlendirdiğinde sonuçlar güvenilmez.

---

## Karşılaştırmalı Değerlendirme ile Model Sıralama

Şimdiye kadar ele aldığımız yöntemlerin çoğu bir modeli izole olarak değerlendiriyor — ya belirli bir metrik üzerinden ya da bir hakemin notuna göre. Ama pratikte sormak istediğimiz soru genellikle farklı: **bu iki model arasında hangisi daha iyi?**

Buna **karşılaştırmalı değerlendirme (comparative evaluation)** deniyor ve en güvenilir model sıralama yöntemlerinden biri.

Fikir satranç dünyasından geliyor: **ELO derecelendirmesi**. İki oyuncu oynuyor, biri kazanıyor. Galip mü beklenenin çok üzerindeydi? Derecelendirmesi hızla yükseliyor. Beklenen galip mi kazandı? Az değişiyor. Binlerce maç sonunda gerçek gücü yansıtan bir sıralama ortaya çıkıyor.

Bunu LLM değerlendirmesine taşıyan en etkili platform **Chatbot Arena** (LMSYS). Kullanıcılar iki anonim modele aynı soruyu soruyor, hangisinin cevabı daha iyi olduğunu seçiyor. Milyonlarca gerçek kullanıcı, gerçek sorular, anonim modeller — bu, en güvenilir genel amaçlı model sıralamasını üretiyor.

### Karşılaştırmalı Değerlendirmenin Zorlukları

**İstatistiksel anlam için büyük ölçek gerekiyor.** Çok sayıda karşılaştırma yapmadan iki modelin gerçekten farklı mı yoksa rastgele varyasyon mu gösterdiğini söylemek zor. Özellikle yakın performanslı modelleri ayırt etmek için on binlerce karşılaştırma gerekebilir.

**Görev dağılımı gerçeği yansıtmıyor olabilir.** Chatbot Arena'daki sorular chat odaklı — ama kod üretimi, matematiksel akıl yürütme ya da spesifik domain sorularında aynı sıralama geçerli olmayabilir. Genel ELO, genel amaçlı kullanımı yansıtıyor; uzmanlaşmış bir görev için farklı bir sıralama çıkabilir.

**Model kirlenmesi.** Bazı modellerin arena'daki diyaloglar üzerinde fine-tune edildiği ya da bu tür prompt'lara özel olarak optimize edildiği iddia ediliyor. Değerlendirme veri seti kamuya açık oldukça bu risk kaçınılmaz.

**Tercih ≠ kalite.** Kullanıcılar kendinden emin, akıcı, uzun cevapları genellikle daha çok tercih ediyor — cevap yanlış bile olsa. Belirsizliği net ifade eden doğru bir cevap, güvenli görünen yanlış bir cevabı kaybedebilir. Bu ELO'yu özellikle olgusal görevlerde yanıltıcı yapıyor.

**MT-Bench ve AlpacaEval** gibi alternatifler bu ölçek sorununu çözmek için AI hakemleri kullanıyor — binlerce insan karşılaştırması yerine GPT-4 gibi bir model değerlendiriyor. Hızlı ve ucuz, ama hakemin yanlılıklarını miras alıyor.

### Karşılaştırmalı Değerlendirmenin Geleceği

Şu an tek bir genel ELO puanı var. Ama "genel olarak iyi" giderek daha az anlam ifade ediyor — farklı görevler için farklı modeller gerçekten farklı performans gösteriyor.

Bunun farkında olan araştırmacılar alan özelleşmiş değerlendirme platformlarına yöneliyor: yalnızca kod soruları için arena, yalnızca matematik için, yalnızca uzun belge analizi için. Bu sayede "Python yazarken en iyi model" ile "hukuki metin özetlerken en iyi model" ayrışıyor.

Bir diğer yön: **otomatik kırmızı takım (automated red-teaming)**. Modeli kasıtlı olarak zor, edge-case ya da adversarial sorgularla test eden sistemler. Contamination riskini azaltmak için dinamik benchmark üretimi — her değerlendirmede yeni sorular oluşturuluyor, böylece modeller test setini ezberleyemiyor.

Uzun vadede değerlendirme tek boyutlu olmaktan çıkacak. Yardımcılık, doğruluk, güvenlik, verimlilik, maliyet — bunlar ayrı ayrı ölçülecek ve görevin gerektirdiğine göre ağırlıklandırılacak. "En iyi model" yerine "bu görev için en uygun model" sorusu merkeze gelecek.

---

## Özet

Bu bölümde model değerlendirmesinin farklı katmanlarını gezdik. Bunları bir tablo olarak toparlayalım:

| Yöntem | Ne ölçüyor | Güçlü yönü | Zayıf yönü |
|---|---|---|---|
| Perplexity | Dil modelleme kalitesi | Eğitim sürecini izlemek | Tokenizer bağımlı, kullanışlılığı ölçmüyor |
| BPC / BPB | Karakter/byte başına bit | Tokenizer bağımsız karşılaştırma | Yine de kullanışlılıkla ilişkisi yok |
| Exact Match | Doğruluğu | Basit, hızlı | Paraphrase'e kör, açık uçlu görevlerde işlevsiz |
| Pass@k | Kodun çalışması | Gerçek fonksiyonel doğruluk | Test kalitesine bağımlı |
| BLEU / ROUGE | Yüzey n-gram örtüşmesi | Hızlı, referans tabanlı | Semantik anlama kör |
| BERTScore | Semantik benzerlik | Paraphrase'i yakalamak | Olgusal doğruluk garantisi yok |
| AI as a Judge | Genel kalite, tutarlılık | Ölçeklenebilir, esnek rubric | Pozisyon/uzunluk/öz-tercih yanlılığı |
| Comparative / ELO | Göreli tercih | Gerçek kullanıcı tercihleri | Büyük ölçek gerekiyor, tercih ≠ kalite |

Tek bir değerlendirme yöntemi hiçbir zaman yetmez. Pratikte birden fazlasını kombine ediyorsun: perplexity ile eğitim sürecini izle, Pass@k ile kod kalitesini ölç, BERTScore ile anlam benzerliğini kontrol et, AI hakem ile genel kaliteyi değerlendir, arena ile son kıyaslamayı yap.

Bir sonraki bölümde retrieval-augmented generation (RAG) — dış bilgiye erişim, hafıza ve bağlam yönetimi konularına geçeceğiz. Sorularınız varsa her zaman iletişime geçebilirsiniz.
