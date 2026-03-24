---
title: "Transformer Mimarisi Nedir? Attention Mekanizması Uçtan Uca — Bölüm 2"
date: "2026-03-24"
excerpt: "Transformer mimarisi yapay zekanın temelini nasıl değiştirdi? Self-attention, multi-head attention, positional encoding ve encoder-decoder yapısını baştan sona anlattık."
tags: ["Transformer", "Attention Mekanizması", "Self-Attention", "Yapay Zeka", "LLM", "BERT", "GPT", "Derin Öğrenme", "AI Mühendisliği"]
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

Bir sonraki bölümde embeddings ve vektör uzayının ne olduğuna, modelin kelimeleri sayılara nasıl çevirdiğine ve bu vektörlerin neden bu kadar güçlü bir temsil biçimi olduğuna bakacağız. Sorularınız varsa her zaman iletişime geçebilirsiniz.
