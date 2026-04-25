---
title: "DESIGN.md Nedir? Google'ın AI Kodlama Ajanslarına Tasarım Sistemi Öğreten Açık Format"
date: "2026-04-25"
excerpt: "Google Labs, 21 Nisan 2026'da DESIGN.md'yi açık kaynak yaptı. Tek bir dosya, AI kodlama ajanlarına projenizin görsel kimliğini kalıcı olarak öğretiyor. YAML token'lar kesin değerler için, Markdown proz 'neden' için. Claude Code, Cursor ve GitHub Copilot ile çalışıyor."
tags: ["DESIGN.md", "Google Labs", "AI Kodlama", "Tasarım Sistemi", "Design Tokens", "Claude Code", "Cursor", "GitHub Copilot", "Stitch", "Frontend Geliştirme", "CSS", "Tailwind"]
category: "Teknoloji"
---

Bir AI kodlama ajanından yeni bir bileşen eklemesini her isteyişinizde ajan **tahmin** ediyor. Bir buton rengi seçiyor, köşe yuvarlaklığı icat ediyor, font kalınlığı belirliyor — ve çıktı, her promptta tasarım sisteminizin tamamını yeniden anlatmadığınız sürece uygulamanızın geri kalanıyla nadiren uyuşuyor.

**DESIGN.md**, Google'ın bu probleme verdiği yanıt.

21 Nisan 2026'da Google Labs, DESIGN.md spesifikasyonunu açık kaynağa aldı — AI kodlama ajanlarına projenizin görsel kimliğini kalıcı, yapılandırılmış bir şekilde anlatan bir dosya formatı. README.md'nin kod için yaptığını, DESIGN.md görsel kimlik için yapıyor. Projede bir kez oluşturulduktan sonra ajanlar tahmin etmeyi bırakıp biliyor.

**Apache 2.0** lisansıyla [GitHub](https://github.com/google-labs-code/design.md)'da mevcut. Şu anda **alpha** aşamasında; 7,9 bin yıldız ve 633 fork.

---

## DESIGN.md Hangi Problemi Çözüyor?

Modern geliştirme ekipleri AI ajanlarını sürekli kullanıyor — Claude Code, Cursor, GitHub Copilot. Hepsi temiz, işlevsel kod yazabiliyor. Hiçbiri markanızın nasıl göründüğünü bilmiyor.

Bir tasarım sistemi dosyası olmadan her bileşen üretimi bir müzakereye dönüşüyor:

> "Metin için `#1A1C1E`, `Public Sans` 1rem, 8px köşe yarıçapı kullan..."

Ajan eğitmiyorsunuz — her mesajda sıfırdan öğretiyorsunuz. Bağlam oturumlar arasında kayboluyor. Farklı ajanlar aynı görev için farklı çıktılar üretiyor. Tasarım kayıyor.

DESIGN.md, ajanların bir kez okuyup her yerde uygulayabileceği bir gerçek kaynağı sunuyor.

---

## Format: İki Katman

Dosya iki tamamlayıcı katmanı bir arada barındırıyor:

**1. YAML ön bölümü** — makine tarafından okunabilir design token'lar. Ajanların deterministik biçimde ayrıştırabildiği, birbirleriyle doğrulayabildiği ve Tailwind ya da W3C DTCG formatına proz'a dokunmadan aktarabildiği kesin değerler.

**2. Markdown gövdesi** — insan tarafından okunabilir gerekçe. Her kararın arkasındaki *neden*. Bir token'ın doğrudan kapsamadığı bir durumda ajanın kendi başına karar vermesi için yeterli semantik bağlam.

Spec'in ifadesiyle: *"Token'lar ajanlara kesin değerleri verir. Proz ise bu değerlerin neden var olduğunu ve nasıl uygulanacağını öğretir."*

### Minimal Örnek

```markdown
---
name: Heritage

colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"

typography:
  h1:
    fontFamily: Public Sans
    fontSize: 3rem
    fontWeight: 700
  body-md:
    fontFamily: Public Sans
    fontSize: 1rem
    lineHeight: 1.5

spacing:
  sm: 8px
  md: 16px
  lg: 32px

rounded:
  sm: 4px
  md: 8px
  lg: 16px
---

## Renkler

**Primary (#1A1C1E):** Koyu antrasit — tüm metin ve yapısal öğelerin tabanı.
Yalnızca beyaz veya nötr arka planlarda kullanın. Koyu yüzeylerde asla kullanmayın.

**Tertiary (#B8422E):** Boston Clay — tek etkileşim sürücüsü. Eylem çağrısı
butonlarında, bağlantılarda ve aktif durumlarında kullanın. Başka hiçbir yerde değil.

## Tipografi

Public Sans, resmiyet olmaksızın editoryal netliği aktarır. H1 3rem'de
ana sayfa hiyerarşisini kurar. Body-md taban — okunabilir içerik için
asla 1rem'in altına inmeyin.
```

`#B8422E` hex kodu makineler için okunabilir. "Boston Clay — tek etkileşim sürücüsü" proz'u ise ajana bu rengi *ne zaman* uygulayacağını öğretiyor. Her iki katman da gerekli.

---

## Token Türleri

DESIGN.md tam bir design token sözlüğünü destekliyor:

### Renkler
Birincil, ikincil, üçüncül ve nötr paletler. Her renk, yalnızca hex değeriyle değil, kullanım amacını açıklayan semantik bir tanımla geliyor.

### Tipografi
Her metin rolü için (başlıklar, gövde, açıklamalar, etiketler) font ailesi, boyutu, kalınlığı, satır yüksekliği ve harf aralığı. Ajanlar bunları doğrudan CSS özel özelliklerine veya Tailwind sınıflarına eşleyebiliyor.

### Boşluk
Margin, padding ve gap kullanımı genelinde tutarlı, isimlendirilmiş boşluk ölçekleri (`sm`, `md`, `lg`, `xl`).

### Yuvarlama
Her boyut kademesi için köşe yarıçapı değerleri. Farklı oturumlarda üretilen bileşenler arasında `4px`, `6px` ve `8px` köşelerin karışmasını önlüyor.

### Bileşenler
Token referanslı bileşen tanımları, durum varyantlarıyla birlikte:

```yaml
components:
  button-primary:
    background: "{{ colors.tertiary }}"
    color: "#FFFFFF"
    borderRadius: "{{ rounded.md }}"
    padding: "{{ spacing.sm }} {{ spacing.md }}"
    states:
      hover:
        background: "#9E3022"
      disabled:
        opacity: 0.4
```

Token referansları (`{{ colors.tertiary }}`), bileşen tanımları ile ham değerler arasında açık bağlantılar kuruyor. Linter bu referansları doğruluyor — yeniden adlandırılan bir token anında kırık referans olarak yüzeye çıkıyor.

### Agent Prompt
Araç'a özel talimatlar için isteğe bağlı bölüm:

```yaml
agentPrompt: |
  CSS veya bileşen stilleri yazmadan önce her zaman DESIGN.md'yi kontrol edin.
  Değerleri izlenebilir kılmak için CSS yorumlarında token adlarını kullanın.
  colors bölümünde tanımlanmayan hiçbir rengi sisteme eklemeyin.
```

---

## CLI Araçları

`@google/design.md` CLI, doğrulama, karşılaştırma ve dışa aktarma işlemlerini yönetiyor.

### Kurulum

```bash
npm install @google/design.md
```

### Lint (Doğrulama)

Yapısal doğruluğu ve erişilebilirliği denetler:

```bash
npx @google/design.md lint DESIGN.md
```

Kontrol ettiği şeyler:
- Yapısal doğruluk (zorunlu alanlar mevcut mu, format geçerli mi)
- **WCAG kontrast oranı doğrulama** — AA veya AAA gereksinimlerini karşılamayan renk kombinasyonlarını yüzeye çıkarır
- Token referans bütünlüğü — kırık `{{ token.reference }}` bağlantıları
- Eksik primary renk tanımları
- Yapılandırılmış JSON çıktısı döndüren 7 lint kuralı

### Diff (Karşılaştırma)

Tasarım sistemi sürümleri arasındaki token düzeyindeki değişiklikleri tespit eder:

```bash
npx @google/design.md diff DESIGN.md DESIGN-next.md
```

Tasarım el teslimlerinde, sürüm incelemelerinde veya bir yeniden markalamanın ardından neyin değiştiğini denetlerken işe yarıyor. Gerilemeleri üretime ulaşmadan yakalar.

### Export (Dışa Aktarma)

DESIGN.md token'larını diğer formatlara dönüştürür:

```bash
# Tailwind CSS konfigürasyonu
npx @google/design.md export --format tailwind DESIGN.md

# W3C Design Token Community Group (DTCG) formatı
npx @google/design.md export --format dtcg DESIGN.md
```

Tailwind dışa aktarması, doğrudan `tailwind.config.js`'e ekleyebileceğiniz bir `theme.extend` bloğu üretiyor. DTCG dışa aktarması, W3C standardıyla uyumlu `tokens.json` dosyası üretiyor.

### Spec (Bağlam Enjeksiyonu)

```bash
npx @google/design.md spec --format json > design-spec-context.txt
```

Spesifikasyonu, AI prompt'larına doğrudan enjekte etmeye uygun bir formatta çıktılar.

---

## AI Kodlama Araçlarıyla Entegrasyon

### Claude Code

Proje köküne veya `CLAUDE.md` dosyasına bir referans ekleyin:

```markdown
CSS veya bileşen stilleri yazmadan önce proje kökündeki DESIGN.md'yi okuyun.
Yalnızca token değerlerini kullanın. Asla keyfi renkler, font boyutları
veya boşluk değerleri eklemeyin.
```

Claude Code, her oturumun başında dosyayı okuyacak ve token'ları ürettiği her bileşende tutarlı biçimde uygulayacak.

### Cursor

`.cursorrules` dosyasına ekleyin:

```
UI kodu yazmadan önce @DESIGN.md'yi okuyun.
Yalnızca token değerlerini kullanın — keyfi renkler, boşluklar veya
köşe yarıçapları yok. İzlenebilirlik için CSS yorumlarında token adlarını
referans gösterin.
```

### GitHub Copilot

Copilot dosyaları otomatik olarak okumaz. Bağlamı prompt'larınıza enjekte etmek için spec komutunu kullanın:

```bash
npx @google/design.md spec > design-spec-context.txt
```

Ardından içeriği Copilot Chat oturumunuza veya sistem prompt yapılandırmanıza dahil edin.

---

## Nasıl Başlanır?

Mevcut durumunuza göre üç yol:

### 1. Google Stitch ile Üretin (Önerilen)

[Stitch](https://withgoogle.com/stitch) kullanıyorsanız, görsel tasarım sisteminizden otomatik olarak DESIGN.md dosyası üretebiliyor. Dışa aktarın ve proje köküne ekleyin.

### 2. Şablon Kullanın

GitHub'daki `awesome-design-md` deposunda yaygın tasarım sistemleri için topluluk katkılı şablonlar yer alıyor. En yakın olanı klonlayıp markanıza göre uyarlayın.

### 3. Manuel Yazın

Yukarıdaki minimal örnekle başlayın, tasarım sisteminiz büyüdükçe bölümler ekleyin. YAML ön bölümü zor kısım; Markdown proz serbest biçimde.

---

## Pratik İş Akışı

DESIGN.md repo'nuzda var olduğunda iş akışı değişiyor:

**DESIGN.md'den önce:**
> "Birincil bir buton ekle — marka kırmızısı `#B8422E`, Public Sans bold, 8px köşe, 8px dikey / 16px yatay padding kullan."

**DESIGN.md'den sonra:**
> "Birincil bir buton ekle."

Ajan dosyayı okuyor, `button-primary` bileşen tanımını buluyor, token referanslarını çözüyor ve bileşeni üretiyor — her seferinde değerleri yeniden öğrenmeden.

Farklı AI araçları kullanan birden fazla geliştiriciden oluşan ekipler için bu, daha önce sıkı bir manuel inceleme süreci olmadan imkânsız olan bir tutarlılık yaratıyor.

---

## Sınırlılıklar

Kullanmadan önce bilinmesi gerekenler:

- **Alpha spesifikasyon.** Format aktif olarak gelişiyor. Alan adları ve yapı sürümler arasında değişebilir.
- **Çoğu araçta manuel prompt referansı gerekli.** Spec kendisini otomatik olarak enjekte etmiyor — her ajanı okuyacak şekilde yapılandırmanız gerekiyor.
- **Figma'nın yerini almıyor.** DESIGN.md, tasarım işbirliğini, izinleri veya görsel düzenlemeyi kapsıyor. Ajan tüketimi için kod bitişik bir format.
- **2K+ token'lı Stitch API çıktıları beta aşamasında** — karmaşık sistemler için manuel düzeltme gerekebilir.
- **Bileşen kütüphanesi yok.** Spec, token'ları ve bileşen kalıplarını tanımlıyor; önceden oluşturulmuş bileşen kodu değil.

---

## Neden Önemli?

DESIGN.md, tasarım sistemlerinin `package.json`'ı olmaya konumlanıyor — her projenin sahip olduğu, her aracın nasıl okuyacağını bildiği standart bir dosya. Geniş benimsemeye ulaşırsa:

- AI kodlama araçlarını değiştirmek, markanızı baştan anlatmak anlamına gelmeyecek
- DESIGN.md'deki tasarım sistemi değişiklikleri her araca otomatik yansıyacak
- Erişilebilirlik doğrulama otomatikleşecek, manuel olmaktan çıkacak
- Açık kaynak projeler, diğer katkıda bulunanların hemen kullanabileceği bir tasarım sistemiyle birlikte sunulabilecek

Apache 2.0 lisansı, herhangi bir editörün, IDE eklentisinin veya AI aracının kısıtlama olmaksızın DESIGN.md desteği uygulayabileceği anlamına geliyor. Bu, onu Google'a özgü bir format yerine potansiyel sektör geneli bir standart yapan şey.

**Depo:** [github.com/google-labs-code/design.md](https://github.com/google-labs-code/design.md)

**Stitch (DESIGN.md oluşturun):** [withgoogle.com/stitch](https://withgoogle.com/stitch)

Kaynaklar:
- [Stitch'in DESIGN.md formatı açık kaynak oldu — Google Blog](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/)
- [Google'ın açık kaynak DESIGN.md'si — The Decoder](https://the-decoder.com/googles-open-source-design-md-gives-ai-agents-a-prompt-ready-blueprint-for-brand-consistent-design/)
- [DESIGN.md Nedir? — MindWiredAI](https://mindwiredai.com/2026/04/23/design-md-is-now-open-source-googles-new-file-format-that-makes-ai-build-your-brand-correctly/)
- [Google DESIGN.md'yi açık kaynak yapıyor — Medium / Bootcamp](https://medium.com/design-bootcamp/google-makes-design-md-open-source-on-its-way-to-become-a-industry-standard-16119f2368dd)
- [DESIGN.md açık kaynak oluyor — Awesome Agents](https://awesomeagents.ai/news/google-design-md-open-source-spec/)
