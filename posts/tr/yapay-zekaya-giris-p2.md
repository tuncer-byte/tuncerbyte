---
title: "Transformer Mimarisi Nedir? Attention, Ölçek, Sampling ve Halüsinasyon — Bölüm 2"
date: "2026-03-24"
excerpt: "Transformer mimarisi yapay zekanın temelini nasıl değiştirdi? Self-attention, model ölçeği, örnekleme parametreleri ve halüsinasyonu anlattık."
tags: ["Transformer", "Attention Mekanizması", "Self-Attention", "Yapay Zeka", "LLM", "BERT", "GPT", "Derin Öğrenme", "AI Mühendisliği", "Halüsinasyon", "Sampling", "Model Ölçeği"]
category: "Teknik"
series: "yapay-zekaya-giris"
seriesTitle: "Yapay Zekaya Giriş"
---

**İçindekiler**

- [RNN Neden Yetmedi?](#rnn-neden-yetmedi)
- [Attention Is All You Need](#attention-is-all-you-need-2017)
- [Dikkat Mekanizması (Attention)](#dikkat-mekanizması-attention)
- [Self-Attention Nasıl Çalışır?](#self-attention-nasıl-çalışır)
- [Scaled Dot-Product Attention](#scaled-dot-product-attention)
- [Multi-Head Attention](#multi-head-attention)
- [Positional Encoding](#positional-encoding)
- [Encoder-Decoder Yapısı](#encoder-decoder-yapısı)
- [Decoder-Only ve Encoder-Only Modeller](#decoder-only-ve-encoder-only-modeller)
- [Transformer Bugün Nerede?](#transformer-bugün-nerede)
- [Model Ölçeği ve Scaling Laws](#model-ölçeği-ve-scaling-laws)
- [Örnekleme (Sampling)](#örnekleme-sampling)
- [Tutarsızlık ve Halüsinasyon](#tutarsızlık-ve-halüsinasyon)

---

[Bölüm 1'de](/blog/yapay-zekaya-giris-p1) dil modelinin temellerini ele aldık — token nedir, autoregressive ve masked modeller nasıl çalışır, self-supervised learning ve post-training süreci nedir. Bu bölümde bir seviye aşağı iniyoruz: **Transformer mimarisi**.

Bugün kullandığın her büyük dil modeli — GPT-4, Claude, Gemini, Llama — temelde aynı mimari üstüne inşa edilmiş. Bu mimarinin nasıl çalıştığını anlamak, LLM'lerin neden böyle davrandığını ve neden bazı şeylerde iyi olup bazılarında neden zorlandığını anlamanın anahtarı.

---

## RNN Neden Yetmedi?

Transformer'dan önce sıralı veriyi — metin, ses, zaman serisi — işlemek için **Recurrent Neural Network (RNN)** ve onun gelişmiş hali **LSTM (Long Short-Term Memory)** kullanılıyordu.

RNN'nin çalışma mantığı şu: bir metin dizisini soldan sağa okur, her adımda bir önceki durumu (hidden state) bir sonrakine taşır. Tren yolculuğu gibi düşün — her istasyonda önceki istasyondan gelen bilgiyi alır, yeni bilgiyle birleştirir, bir sonraki istasyona iletir.

![RNN ve LSTM Karşılaştırması](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Recurrent_neural_network_unfold.svg/1200px-Recurrent_neural_network_unfold.svg.png)

Bu yaklaşımın üç kritik sorunu vardı:

**1. Uzun bağlam problemi (Vanishing Gradient)** — Cümle uzadıkça, başlardaki bilgi giderek "unutulur". "Ahmet dün sabah erken kalktı, dişlerini fırçaladı, kahvaltı yaptı, işe gitti ve orada **o** bir toplantıya girdi" — bu cümlede "o" kimi işaret ediyor? RNN bunu Ahmet'e bağlamakta zorlanır. LSTM bunu kısmen çözdü ama tam değil.

**2. Paralelleştirme imkânsızlığı** — RNN sıralı işler: t=1 bitmeden t=2 başlayamaz. GPU'ların gücü paralelleştirmeden gelir. Sıralı yapı GPU'yu verimli kullanamaz.

**3. Ölçeklenme sorunu** — Yukarıdaki iki sorun birleşince trilyonlarca token üzerinde eğitim yapılması pratik olarak imkânsız hale gelir.

2017'ye kadar bu kısıtlar içinde çalışıldı. Sonra her şeyi değiştiren bir makale yayımlandı.

---

## Attention Is All You Need (2017)

Google Brain'den 8 araştırmacı "Attention Is All You Need" adlı makaleyi yayımladı. Başlık kasıtlı bir provokasyon — **"tek ihtiyacın attention"**.

![Orijinal Transformer Mimarisi — Vaswani et al. 2017](https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/The-Transformer-model-architecture.png/600px-The-Transformer-model-architecture.png)

Makale şunu öne sürdü: sıralı yapıyı tamamen at. Cümleyi bir bütün olarak al, her kelimenin diğer tüm kelimelerle ilişkisini *aynı anda* hesapla. Ne RNN ne LSTM. Sadece **attention**.

Bu yaklaşım üç şeyi aynı anda çözdü:
- Uzun bağlam: Her kelime her diğer kelimeyle doğrudan ilişkilendirilir, mesafe fark etmez
- Paralelleştirme: Tüm hesaplama aynı anda yapılır, GPU bunu sever
- Ölçeklenme: Artık trilyonlarca token üzerinde eğitim mümkün

Sonuç malum — bugünkü yapay zeka devrimi bu makalenin üstüne kurulu.

---

## Dikkat Mekanizması (Attention)

Attention mekanizmasını sezgisel olarak anlamak için bir analoji kullanacağım.

Bir kütüphanede arama yapıyorsun. Elinde bir **query** var (ne arıyorsun). Raflarda binlerce kitap var, her birinin **key** etiketi (konusu, yazarı). Bir kitabı açtığında içindeki bilgiye — **value** — ulaşırsın.

Kütüphaneci şöyle çalışır: senin query'ini alır, tüm key'lerle karşılaştırır, en uygun kitapları seçer ve onların value'larını sana getirir.

Attention da tam bu: **Query, Key, Value**.

```
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
```

Formülü adım adım açıkalım:
- **Q (Query)**: "Ne arıyorum?"
- **K (Key)**: "Hangi bilgiler var?"
- **V (Value)**: "O bilgilerin içeriği ne?"
- **QK^T**: Query ile her Key arasındaki benzerlik skoru
- **√d_k ile bölme**: Skorları ölçekle (patlamayı önlemek için)
- **Softmax**: Skorları 0-1 arasına getir, toplamları 1 olsun
- **× V**: Bu ağırlıklarla Value'ları birleştir

Çıktı: hangi bilgiye ne kadar dikkat etmen gerektiğini gösteren ağırlıklı bir toplam.

---

## Self-Attention Nasıl Çalışır?

Normal attention'da query başka bir diziden gelir (örneğin çeviride kaynak dil). **Self-attention**'da ise bir dizi *kendisine* bakarak dikkat hesaplar — her kelime diğer tüm kelimelerle ilişkisini değerlendirir.

Şu cümleyi ele al: **"Banka nehrin kenarındaydı"**

Self-attention "banka" kelimesini işlerken şunu sorar: bu cümledeki hangi kelimeler "banka"nın ne anlama geldiğini belirliyor? "Nehir" kelimesi güçlü bir sinyal — yüksek attention skoru alır. "Kenar" da alakalı. "Banka"nın para kurumunu değil nehir kıyısını ifade ettiğini self-attention sayesinde model çözer.

![Self-Attention Görselleştirmesi](https://jalammar.github.io/images/t/transformer_self-attention_visualization.png)

Matematiksel olarak şöyle işler:

Girdi: `[banka, nehrin, kenarındaydı]` — her token bir embedding vektörü

Her token için üç matris çarpımıyla Q, K, V oluşturulur:
```
Q = Token × W_Q
K = Token × W_K
V = Token × W_V
```

Bu matrisler eğitim sırasında öğrenilir — model hangi token'ın hangi token'a bakması gerektiğini veriden öğrenir.

Sonra her token için tüm diğer token'larla benzerlik skoru hesaplanır:
```
scores = Q × K^T / √d_k
weights = softmax(scores)
output = weights × V
```

Çıktı: her token için bağlamı içselleştirmiş yeni bir vektör. "Banka" artık "nehir" bilgisini taşıyan bir vektör.

---

## Scaled Dot-Product Attention

Formüldeki `√d_k` neden var?

d_k, key vektörünün boyutu. Vektörler büyüdükçe Q×K^T çarpımları çok büyük değerler üretir. Softmax bu büyük değerlere uygulandığında gradyanlar neredeyse sıfırlanır — "vanishing gradient" problemi geri döner.

√d_k ile bölerek değerleri makul bir aralıkta tutuyoruz. Bu küçük ama kritik bir detay.

---

## Multi-Head Attention

Tek bir attention "kafası" bağlamın tüm boyutlarını yakalayamaz. Bir cümlede hem sözdizimsel ilişkiler (özne-nesne) hem anlamsal ilişkiler (tema) hem de referans ilişkileri (zamir→isim) aynı anda önemli.

**Multi-head attention**: aynı girdiyi h farklı boyuta paralel olarak projeksiyonla. Her "kafa" farklı bir ilişki türünü öğrenir.

![Multi-Head Attention Diyagramı](https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/MultiHead_Attention.png/800px-MultiHead_Attention.png)

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) × W_O

where head_i = Attention(Q×W_Q_i, K×W_K_i, V×W_V_i)
```

8 kafa varsa, 8 farklı Q/K/V matris seti öğrenilir. Her kafa girdiye ayrı bir mercekten bakar. Sonunda tüm kafaların çıktıları birleştirilir ve bir projeksiyon matrisiyle dönüştürülür.

Pratikte ne anlama gelir? GPT gibi modellerde her kafa farklı dilbilgisel ya da anlamsal ilişkilere odaklanır. Bir kafa zamirleri referans ettikleri isimlere bağlarken, başka bir kafa fiil-özne uyumunu takip edebilir.

---

## Positional Encoding

Self-attention'ın bir kör noktası var: sıra bilgisi yok.

"Köpek kediye saldırdı" ile "Kedi köpeğe saldırdı" — token kümesi aynı, sıra farklı. Ama attention mekanizması sıraya bakmadan hesaplama yapar.

RNN bunu doğası gereği çözüyordu — soldan sağa işlediği için sıra zaten içindeydi. Transformer'da sırayı elle eklemek gerekiyor: **Positional Encoding**.

Her pozisyona özel bir vektör oluşturulur ve token embedding'ine eklenir:

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

Sin ve cos fonksiyonları neden? Çünkü:
1. Her pozisyona benzersiz bir imza verir
2. Farklı uzunluktaki dizilere genelleşir — eğitimde görmediği pozisyonlara bile çalışır
3. İki pozisyon arasındaki mesafe bilgisi matematiksel olarak kodlanmış olur

Modern modellerde **RoPE (Rotary Position Embedding)** veya **ALiBi** gibi gelişmiş pozisyon kodlamaları kullanılıyor. Bunlar özellikle bağlam uzunluğunu genişletmekte çok daha etkili.

---

## Encoder-Decoder Yapısı

Orijinal Transformer bir encoder-decoder mimarisidir — makine çevirisi için tasarlanmıştı.

![Encoder-Decoder Akış Diyagramı](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Transformer_architecture.png/800px-Transformer_architecture.png)

**Encoder** — girdi dizisini anlar:
1. Input Embedding + Positional Encoding
2. Multi-Head Self-Attention: her token diğer tüm token'lara bakarak bağlamını oluşturur
3. Add & Norm (Residual Connection + Layer Normalization)
4. Feed-Forward Network: her token ayrı ayrı işlenir
5. Add & Norm
6. Bu blok N kez tekrarlanır (orijinal makalede N=6)

Encoder'ın çıktısı: girdideki her token için zengin bağlamsal temsil vektörleri.

**Decoder** — çıktı dizisini üretir:
1. Output Embedding + Positional Encoding (şimdiye kadar üretilmiş çıktı)
2. **Masked** Multi-Head Self-Attention: gelecek token'lara bakamaz, sadece geçmişe
3. Add & Norm
4. **Cross-Attention**: encoder çıktısına (K, V) bakarak kaynak diziyle ilişki kurar, decoder'ın kendi çıktısı Query oluyor
5. Add & Norm
6. Feed-Forward
7. Add & Norm
8. Linear + Softmax → token olasılıkları

**Residual Connection neden önemli?** Her alt katmanın çıktısı girdiyle toplanır: `LayerNorm(x + SubLayer(x))`. Bu, gradyanların katmanlar boyunca düzgün akmasını sağlar. Olmasa çok katmanlı modeller eğitilemezdi.

**Feed-Forward Network neden var?** Self-attention ilişkileri yakalar ama her token'ı bağımsız olarak dönüştürme kapasitesi yoktur. FFN her token üzerinde bağımsız bir dönüşüm uygular — modelin "hesaplama" kapasitesini sağlar. Parametre sayısının büyük kısmı burada.

---

## Decoder-Only ve Encoder-Only Modeller

Orijinal Transformer encoder+decoder içeriyor. Ama araştırmacılar zamanla bu yapının bazı görevler için sadeleştirilebileceğini keşfetti.

**Encoder-Only (BERT ve türevleri)**

Sadece encoder bloklarından oluşur. Tüm cümle aynı anda işlenir — her token hem sol hem sağ komşulara bakabilir (bidirectional). Bölüm 1'de değindiğimiz masked dil modeli burada devreye girer: cümle içindeki maskelenmiş token'ı tahmin etmeyi öğrenir.

Nerede iyi?
- Metin sınıflandırma
- Named entity recognition (NER)
- Soru cevaplama (extract etme)
- Semantic similarity

Nerede zayıf?
- Metin üretme — doğası gereği üretici değil, anlayıcı

**Decoder-Only (GPT ve türevleri)**

Sadece decoder bloklarından oluşur ama cross-attention yok — sadece masked self-attention. Her token yalnızca kendinden önceki token'lara bakabilir (autoregressive). Bölüm 1'de anlattığımız "next token prediction" tam olarak bu.

Nerede iyi?
- Metin üretme
- Kod yazma
- Uzun formatlı içerik
- Genel amaçlı sohbet

GPT-1'den GPT-4'e, Claude'dan Llama'ya kadar bugün en yaygın kullanılan mimari bu.

**Encoder-Decoder (T5, BART)**

Her iki bileşeni birlikte kullanır. Özellikle çeviri, özetleme ve soru-cevap gibi "girdiyi anlayıp farklı bir şekilde üret" görevlerinde güçlü.

| Mimari | Örnekler | En iyi olduğu yer |
|---|---|---|
| Encoder-Only | BERT, RoBERTa | Anlama, sınıflandırma |
| Decoder-Only | GPT, Claude, Llama | Üretme, sohbet |
| Encoder-Decoder | T5, BART | Çeviri, özetleme |

---

## Transformer Bugün Nerede?

2017'deki orijinal Transformer çok büyük değişti — ama temel mekanizmalar aynı.

Modern LLM'lerin yaptığı başlıca değişiklikler:

**Pre-Norm yerine Post-Norm** — Layer Normalization bloğun başına alındı. Eğitim stabilitesini artırıyor.

**RoPE ve ALiBi** — Sinüs pozisyon kodlamasının yerini daha güçlü dönel/lineer kodlamalar aldı. Bu sayede modeller 128K, 200K, hatta 1M token bağlama ulaşabiliyor.

**SwiGLU Aktivasyon** — Klasik ReLU yerine daha iyi gradyan akışı sağlayan aktivasyon fonksiyonları (LLaMA, PaLM).

**Grouped Query Attention (GQA)** — Multi-head attention'da her kafa için ayrı K/V yerine bir grup kafa K/V'yi paylaşır. Çıkarımı önemli ölçüde hızlandırır.

**Flash Attention** — Standart attention O(n²) bellek kullanır. Flash Attention bu hesaplamayı yeniden düzenleyerek O(n) belleğe indirir. Uzun bağlamlarda hayat kurtarıcı.

Bölüm 1'de anlattığımız eğitim pipeline'ı düşünürsen — pre-training, SFT, RLHF — bunların hepsi bu Transformer bloğu üstüne uygulanıyor. Pre-training trilyonlarca token'la ağırlıkları öğretiyor, post-training aşamaları bu ağırlıkları davranışsal olarak şekillendiriyor.

---

---

## Model Ölçeği ve Scaling Laws

Transformer mimarisini anladıktan sonra akla şu soru gelir: modeli büyütünce ne olur? Parametre sayısını ikiye katlarsan iki kat mı iyi olur? Veri eklersen doğrusal mı iyileşir?

2020'de OpenAI'dan Kaplan ve arkadaşları bu soruyu ampirik olarak yanıtladı: **scaling laws** — ölçekleme yasaları.

Bir modelin performansı üç şeye bağlı:
- **N** — parametre sayısı
- **D** — eğitim verisi (token sayısı)
- **C** — hesaplama bütçesi (FLOPs = floating point operations)

Bu üçü arasında güçlü bir güç yasası ilişkisi var: birini sabit tutup diğerini artırırsan performans öngörülebilir biçimde iyileşir. Sürpriz yok, kaos yok — ölçeklenebilir.

**Chinchilla (2022) dönüm noktası**

2022'de DeepMind, "Training Compute-Optimal Large Language Models" makalesini yayımladı. Temel bulgular şaşırtıcıydı:

GPT-3 gibi dönemin büyük modelleri **yeterince eğitilmemişti**. 175 milyar parametreli GPT-3 yalnızca 300 milyar token gördü. Chinchilla yasası şunu söylüyor: **optimal eğitim için parametre başına yaklaşık 20 token gerekiyor**.

| Model | Parametre | Eğitim Verisi | Durum |
|---|---|---|---|
| GPT-3 | 175B | 300B token | Yetersiz eğitim |
| Chinchilla | 70B | 1.4T token | Optimal |
| Llama 3 | 8B–70B | 15T token | Aşırı eğitim (kasıtlı) |

Chinchilla, GPT-3'ün dörtte bir parametresiyle daha iyi performans gösterdi. Ders açık: **büyük model + az veri < küçük model + çok veri**.

Llama ailesinin aşırı eğitimi kasıtlı — model çıkarımda daha küçük ve hızlı olsun, eğitim maliyeti tek seferlik ödünsün diye.

**Emergent Abilities — Ortaya Çıkan Yetenekler**

Ölçek artışının ilginç bir yan etkisi var: belirli parametre eşiklerinde modelde daha önce hiç görülmemiş yetenekler aniden ortaya çıkıyor. Buna **emergent abilities** deniyor.

Az sayıda örnekle görev çözme (few-shot learning), adım adım akıl yürütme (chain-of-thought), aritmetik — bunların hiçbiri küçük modellerde yoktu; belirli bir ölçek atlayışıyla belirdi. Bu henüz tam anlaşılmış değil. Ölçek bir eşiği geçince model niteliksel olarak farklı davranmaya başlıyor.

---

## Örnekleme (Sampling)

Transformer çalışıyor, bir sonraki token için olasılık dağılımı hazır. Şimdi soru şu: **bu dağılımdan nasıl token seçilir?**

Model her çıktı adımında vocabulary'deki tüm token'lar için bir olasılık skoru üretir. "Paris" mi desin, "Lyon" mu, "Ankara" mı? Bu seçim mekanizmasına **sampling** deniyor ve sonucu doğrudan etkiliyor.

**Greedy Decoding**

En basit strateji: her adımda en yüksek olasılıklı token'ı seç.

```
"İstanbul Türkiye'nin..." → [başkenti: %0.60, en büyük: %0.25, tarihi: %0.10, ...]
greedy seçim → "başkenti"
```

Deterministik. Tutarlı. Ama ciddi bir sorunu var: **tekrar döngüleri**. Model bir kalıba girince oradan çıkamaz. Uzun metinlerde sonsuz döngüler oluşabilir.

**Temperature**

Temperature, model çıktısının "keskinliğini" kontrol eder. Softmax'tan önce logit'leri ölçekler:

```
logits_scaled = logits / temperature
```

- **T = 1.0**: Modelin ham çıktısı, değişmez
- **T < 1.0** (örn. 0.3): Dağılım keskinleşir, model daha az riskli seçimler yapar — tutarlı ama yaratıcılıktan uzak
- **T > 1.0** (örn. 1.5): Dağılım yayılır, düşük olasılıklı token'lar da seçilebilir — yaratıcı ama tutarsız
- **T → 0**: Greedy decoding'e yaklaşır

API kullanırken `temperature: 0` dersen model her seferinde aynı cevabı verir. `temperature: 1.2` dersen her çalıştırmada farklı bir metin üretir.

**Top-k Sampling**

Sadece en yüksek k olasılıklı token'ı havuzda tut, geri kalanı elimin:

```
k=50 → en olası 50 token havuzda kalır, geri kalan ~49.950 token elenip yalnızca bu 50 arasından örnekleme yapılır
```

k değeri sabit olduğu için farklı bağlamlarda sorun çıkabilir. Bazen ilk 50 token gerçekten olası seçeneklerdir; bazen %90 olasılık tek bir token'a yığılmışken kalan 49 slot boş doldurulur.

**Top-p (Nucleus) Sampling**

Top-k'nın bu sorununu çözmek için Holtzman et al. (2020) **nucleus sampling**'i önerdi.

Sabit bir sayı yerine, kümülatif olasılık toplamı p'ye ulaşana kadar token'ları al:

```
p=0.9 → En olası token'ları topla, toplamları %90'ı geçene kadar devam et
Eğer tek bir token %95 olasılığa sahipse → o token havuz
Eğer ilk 200 token %90'ı paylaşıyorsa → 200 token havuz
```

Dinamik bir pencere. Modelin o anki güven düzeyine göre genişler ya da daralır. GPT API'larında ve Anthropic Claude'da varsayılan örnekleme stratejisi budur.

**Parametreler pratikte ne ifade eder?**

| Parametre | Düşük Değer | Yüksek Değer | Kullanım |
|---|---|---|---|
| temperature | Tutarlı, öngörülebilir | Yaratıcı, beklenmedik | Kod için düşük, hikaye için yüksek |
| top-k | Dar seçim havuzu | Geniş seçim havuzu | Genellikle top-p ile birlikte |
| top-p | Güvenli çekirdek | Geniş nucleus | Genel amaç için 0.9–0.95 |

Bu parametreler birbirine bağımlı — temperature 0.2 iken top-p 0.95 koymak çok anlam taşımaz, dağılım zaten keskin. Gerçek sistemlerde genellikle temperature + top-p ikilisi kullanılır.

---

## Tutarsızlık ve Halüsinasyon

Transformer'ı, ölçeği ve örneklemeyi anladıktan sonra şu soruya gelebiliriz: **neden modeller bazen saçmalıyor?**

Bu sorunun iki ayrı boyutu var: **halüsinasyon** (var olmayan şeyleri uydurmak) ve **tutarsızlık** (aynı soruya farklı cevaplar vermek). İkisi de mimarinin yapısal özelliklerinden kaynaklanıyor — rastgele bir hata değil.

**Halüsinasyon neden oluşur?**

Model özünde bir **olasılık makinesidir**. Bir sonraki token'ı tahmin ederken şunu sormaz: "Bu bilgi doğru mu?" Şunu sorar: "Bu bağlamda istatistiksel olarak en olası token hangisi?"

Eğitim verisinde "X ödülünü Y aldı" kalıbı milyonlarca kez geçiyorsa, model X ödülü hakkında soru sorulduğunda bu kalıbı kullanmaya yönelir — gerçekte Y bu ödülü almamış olsa bile.

Somut nedenler:

**1. Bilgi sıkıştırma** — Model trilyonlarca token'ı milyarlarca parametre içine sıkıştırır. Bu kayıplı bir sıkıştırma. Detaylar, isimler, tarihler baskı altında bozulabilir. Model "hatırlamaya" çalışırken uydurur.

**2. Kesme tarihi (knowledge cutoff)** — Modelin bilgisi eğitim verisinin bittiği tarihe kadar. Sonrasındaki gelişmeler, sonuçlar, değişiklikler yok. Sorulduğunda ya "bilmiyorum" demeli ya da uydurur — ikincisi daha sık olur.

**3. Eğitim verisindeki yanlışlar** — İnternetteki her metin doğru değil. Model yanlış bilgiyi de istatistiksel ağırlığıyla içselleştirir.

**4. Güven kalibrasyonu eksikliği** — Model ne bilip ne bilmediğini net olarak ayırt edecek şekilde doğrudan optimize edilmez. Yüksek güven ifadesiyle yanlış bilgi üretebilir.

**Tutarsızlık neden oluşur?**

Sampling doğası gereği stokastik — aynı girdi farklı token dizileri üretebilir. Temperature ve top-p bu varyansı kontrol eder ama tam ortadan kaldırmaz.

Daha derin bir neden: **autoregressive üretimin küresel planlaması yok**.

Model bir cevabı üretirken cümle cümle, token token ilerler. Her adımda sadece o ana kadar ürettiklerine bakar. İnsan bir yazı yazarken kafasında genel bir taslak tutabilir, geri dönüp düzeltebilir. Model ileriye planlayamaz, geri dönemez — bir token yazdıktan sonra o token artık bağlamın parçasıdır.

Bu yüzden uzun metinlerde modeller:
- Başta söyledikleriyle çelişebilir
- Sayıları tutarsız kullanabilir
- Bir kişinin özelliklerini karıştırabilir

**Chain-of-Thought neden işe yarıyor?**

"Adım adım düşün" demen veya CoT prompt'ları modeli zımni bir planlama yapmaya yönlendirir. Ara adımlar bağlama yazıldığında model onlara bakarak devam edebilir — bu sıklıkla tutarsızlığı ve hata oranını düşürür. Ama temeldeki kısıtı ortadan kaldırmaz.

**Yapısal kısıt mı, çözülebilir sorun mu?**

İkisi de. Bazı halüsinasyonlar post-training ile azaltılabilir — RLHF ve DPO süreci modeli belirsizlikte daha ihtiyatlı olmaya yönlendirebilir. Retrieval-Augmented Generation (RAG) dış kaynaklarla çapraz kontrol imkânı verir. Ama "next token prediction" temeli üstünde halüsinasyonu sıfıra indirmek mümkün değil. Bu, mimarinin değil doğruluk sinyalinin bir sınırı.

---

Bir sonraki bölümde embeddings ve vektör uzayının ne olduğuna, modelin kelimeleri sayılara nasıl çevirdiğine ve bu vektörlerin neden bu kadar güçlü bir temsil biçimi olduğuna bakacağız. Sorularınız varsa her zaman iletişime geçebilirsiniz.
