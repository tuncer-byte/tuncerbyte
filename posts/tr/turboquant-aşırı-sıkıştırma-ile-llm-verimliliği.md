---
title: "TurboQuant: Sıkıştırarak Hızlanmak — LLM'leri 8 Kat Hızlandıran Algoritma"
date: "2026-03-25"
excerpt: "Google Research'ün yeni TurboQuant algoritması, büyük dil modellerini ve vektör arama motorlarını doğruluk kaybı olmadan 3 bit'e sıkıştırıyor ve H100 GPU'larda 8 kat hız artışı sağlıyor."
tags: ["Yapay Zeka", "LLM", "Quantization", "Google Research", "Verimlilik", "Vektör Arama", "TurboQuant"]
category: "Teknik"
---

**Google Research, büyük dil modellerinin bellek darboğazını çözmek için üç yeni sıkıştırma algoritması yayımladı: TurboQuant, QJL ve PolarQuant.**

Modeller büyüdükçe onları çalıştırmanın maliyeti de büyüyor. Sorunun kökü genellikle aynı yerde: yüksek boyutlu vektörler. Bir dil modeli her token işlediğinde Key-Value (KV) önbelleğinde vektörler birikir. Bu önbellek hem belleği hem bant genişliğini tüketir, hem de çıkarım hızını doğrudan etkiler. Klasik sıkıştırma yöntemleri bu vektörleri küçültmeye çalışırken bir soruna takılır: her veri bloğu için tam hassasiyetli normalleştirme sabitleri saklamak gerekir. Bu sabitler veri başına 1-2 ekstra bit anlamına gelir — küçük görünür ama milyarlarca vektörde ciddi bir yük oluşturur.

TurboQuant bu gizli ek yükü sıfıra indirmeyi hedefliyor.

![TurboQuant genel bakış animasyonu](/images/posts/turboquant/hero.gif)

---

## KV Önbelleği Neden Sorun?

Transformer mimarisinde her katman, dikkat (attention) hesaplaması için tüm önceki token'ların Key ve Value vektörlerini saklar. Bağlam uzunluğu artıkça bu önbellek katlanarak büyür. 128K token bağlamında çalışan bir modelde KV önbelleği, ağırlık matrislerinden çok daha fazla yer kaplayabiliyor.

Standart yaklaşım bu vektörleri 8-bit veya 4-bit'e quantize etmek. Ama her blok için ayrı bir ölçekleme sabiti (scale factor) tutmak gerekir — ve bu sabitler de yer kaplar. Teorik sıkıştırma oranına hiçbir zaman tam ulaşılamıyor.

---

## TurboQuant Nasıl Çalışıyor?

TurboQuant iki adımda çalışır:

**Adım 1 — PolarQuant ile yüksek kaliteli sıkıştırma:** Vektörler önce rastgele bir rotasyon matrisiyle döndürülür. Bu dönüşüm verinin geometrisini düzleştirir ve klasik quantization'ı neredeyse mükemmel hale getirir. Ardından vektörler Kartezyen koordinatlar yerine polar koordinatlara (yarıçap ve açı) çevrilir. "Güç" bilgisi yarıçapta, "anlam" bilgisi açıda taşınır. Bu ayrım sayesinde normalleştirme sabitine gerek kalmaz — çember üzerindeki açılar zaten normalleştirilmiş durumdadır.

**Adım 2 — QJL ile hata düzeltme:** PolarQuant'ın bıraktığı küçük artık hatalar QJL (Quantized Johnson-Lindenstrauss) algoritmasıyla yalnızca 1 bit kullanılarak düzeltilir. QJL'nin matematiksel dayanağı, vektörün her elemanını +1 veya -1'e indirgerken Johnson-Lindenstrauss dönüşümünü kullanmasıdır. Bu dönüşüm, yüksek boyutlu uzaydaki mesafeleri korurken bellek ek yükünü tamamen sıfırlar.

Sonuç: ek bellek yükü sıfır, sıkıştırma oranı ise teorik sınıra yakın.

---

## QJL: 1 Bit, Sıfır Ek Yük

QJL başlı başına dikkat çekici bir fikir. Her vektör elemanını tek bir işaret bitine (+1/-1) indirgemek ilk bakışta bilgi kaybı gibi görünür. Ama Johnson-Lindenstrauss teoremi şunu söylüyor: yeterli sayıda boyuta sahip bir uzayda, rastgele bir projeksiyon işaret bitlerini kullanarak iki vektör arasındaki açıyı yüksek doğrulukla tahmin edebilir.

Klasik quantization'da her blok için bir `scale` ve `zero_point` değeri saklamak gerekir. QJL'de bu yok. Veri bloğunun kendisi normalleştirme bilgisini barındırıyor çünkü algoritma veriyi doğrudan normalize bir uzaya projelıyor.

Bu özellik KV önbelleğinde belirgin bir kazanım sağlıyor: 3 bit'lik efektif depolama gerçekten 3 bit demek — gizli ek maliyeti yok.

---

## PolarQuant: Açı Her Şeyi Söyler

Kartezyen koordinatlarda bir vektörün `(x, y, z)` bileşenlerini quantize etmek istersen her ekseni ayrı ayrı normalize etmen gerekir. Bu normalleştirme katsayıları belleğe yazılmak zorunda.

PolarQuant bunun yerine vektörü polar/hipersfere koordinatlara çevirir. Yarıçap (r) vektörün büyüklüğünü taşır; açılar (θ₁, θ₂, ...) ise yönü — yani anlamı. Attention mekanizması için önemli olan nokta çarpımı hesaplarken yarıçap zaten iptal olur, geriye yalnızca açı kalır. Açılar birim çember üzerinde doğal olarak sınırlı bir aralıkta bulunduğundan dışsal bir normalleştirme sabitine gerek kalmaz.

---

## Deneyler

Testler Gemma ve Mistral ailesindeki açık kaynaklı modeller üzerinde yapıldı. Kullanılan kıyaslama setleri: LongBench, Needle In A Haystack, ZeroSCROLLS, RULER ve L-Eval.

![LongBench kıyaslama sonuçları](/images/posts/turboquant/longbench.png)

TurboQuant, 3 bit KV önbelleğiyle çalışırken doğruluk kayıpsız skor aldı. Baz modelle karşılaştırıldığında fark ihmal edilebilir düzeyde.

![Attention logits karşılaştırması](/images/posts/turboquant/attention-logits.png)

Dikkat puanlarındaki sapma (attention logit distortion) grafiğinde TurboQuant, rakip yöntemlere göre belirgin şekilde daha düşük hata üretiyor. Özellikle 1-bit QJL'nin bias düzeltme etkisi burada açıkça görülüyor.

H100 GPU'larda yapılan hız testinde TurboQuant, 32-bit quantize edilmemiş anahtarlara kıyasla **8 kat** hız artışı sağladı. KV belleği kullanımı ise 6 kat küçüldü — eğitim veya fine-tuning gerektirmeden.

---

## Vektör Arama Sonuçları

TurboQuant yalnızca LLM çıkarımıyla sınırlı değil. Milyarlarca vektörün depolanıp sorgulandığı vektör arama motorları için de test edildi.

![Vektör arama geri çağırma oranları](/images/posts/turboquant/recall-ratio.png)

PQ (Product Quantization) ve RabbiQ gibi mevcut yöntemlerle karşılaştırıldığında PolarQuant ve TurboQuant üstün geri çağırma (recall) oranları elde etti. Bununla birlikte indeks oluşturma süresi de önemli ölçüde kısaldı.

Bu, semantik arama sistemlerinde hem doğruluğu hem hızı aynı anda iyileştirmek anlamına geliyor.

---

## Neden Önemli?

Büyük modeller için çıkarım maliyeti gerçek bir engeldir. Bağlam uzunluğu artıkça KV önbelleği doğrusal değil, daha hızlı büyür. Şu anda 128K-1M token bağlamlı modeller yaygınlaşıyor — bu bağlamlarda KV önbelleği belleğin büyük bölümünü tüketebilir.

TurboQuant gibi yöntemler bu denklemi değiştiriyor:

- Aynı donanımda daha uzun bağlam
- Daha az GPU belleğiyle daha büyük batch size
- Daha hızlı çıkarım, daha düşük servis maliyeti

Üç makale de ICLR 2026 ve AISTATS 2026'da sunulacak. Kod ve modeller açık kaynak olarak yayımlanacak.

---

**Yazarlar:** Amir Zandieh (Research Scientist) ve Vahab Mirrokni (VP & Google Fellow), Google Research
**Kaynak:** [Google Research Blog](https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/)
**Makaleler:** [TurboQuant](https://arxiv.org/abs/2504.19874) · [QJL](https://dl.acm.org/doi/10.1609/aaai.v39i24.34773) · [PolarQuant](https://arxiv.org/abs/2502.02617)
