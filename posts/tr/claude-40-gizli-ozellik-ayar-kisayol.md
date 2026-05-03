---
title: "Çoğu Kullanıcının Bilmediği 40 Gizli Claude Özelliği, Ayarı ve Kısayolu"
date: "2026-05-03"
excerpt: "Claude'un Chat, Code ve Cowork arayüzlerinde gömülü, çoğu kullanıcının hiç keşfetmediği 40 özellik. Çalışma şeklini bugün değiştir."
tags: ["Claude", "Claude Code", "Claude Chat", "Claude Cowork", "Yapay Zeka", "Üretkenlik", "AI Araçları", "Anthropic", "Kısayollar", "İpuçları"]
category: "Araçlar"
---

Claude'un üç arayüzü var: **Chat**, **Cowork** ve **Code**.

Çoğu kişi birini kullanıyor. Neredeyse kimse üçünü birden keşfetmedi. Kullandıkları arayüzde bile mevcut işlevselliğin yalnızca %20'sine dokunuyorlar.

Yüzlerce saatlik kullanımın ardından derlediğim bu liste, Claude ekosisteminde gömülü ve keşfettiğin anda çalışma şeklini değiştiren 40 özellik, ayar ve kısayoldan oluşuyor.

---

## Claude Chat: Gizli Güç

### 01. Stiller

**Ayarlar → Stiller** bölümüne git. Claude'un hazır iletişim stilleri var: Öz, Açıklayıcı, Resmi ve daha fazlası. Özel stil de oluşturabilirsin. Kendi sesinle örtüşen bir stil kur — her konuşma otomatik olarak doğru tonla başlar.

### 02. Projeler

Çoğu kişi bunu tamamen atlıyor. Projeler, kendi talimatları ve dosyaları olan kalıcı çalışma alanları oluşturmanı sağlıyor. Proje içindeki her konuşma bağlamı otomatik olarak devralıyor. Her seferinde bağlam dosyası yapıştırmak yerine bir proje oluştur ve bağlamı bir kez ayarla.

### 03. Proje Bilgisi

Herhangi bir proje içinde referans belgeler yükle. Claude bunları her konuşmanın başında okuyor. Marka yönergelerin, ürün belgelerin, yazı örneklerin — her zaman yüklü, hiç unutulmuyor.

### 04. Özel Talimatlar

Proje ayarlarında her konuşma için sistem komutu gibi işlev gören özel talimatlar yazabilirsin:

> "Sen benim içerik stratejistimsin. Her zaman marka sesimle yanıt ver. Şu kelimeleri kullanma: [liste]. Her zaman şu formatta çıktı üret: [format]."

Bu her mesajın arkasında sessizce çalışır.

### 05. Artifaktlar

Claude kod, belge veya görsel çıktı ürettiğinde bunlar ayrı bir panelde işleniyor. Konuşmadan bağımsız olarak artifaktlar üzerinde çalışabilirsin. Sohbet bağlamını kaybetmeden düzenle, geliştir ve indir.

### 06. Hafıza

Claude artık konuşmalar arasında şeyleri hatırlıyor. Zamanla tercihlerini, projelerini ve iletişim tarzını öğreniyor. **Ayarlar → Hafıza** bölümünden Claude'un hatırladıklarını görüntüleyip düzenleyebilirsin. Bunu bir çalışanın işe başlama notlarını yönetir gibi düzenle.

### 07. Derin Araştırma

Herhangi bir sorgu için Derin Araştırma'yı açtığında Claude kapsamlı bir rapor üretmeden önce onlarca kaynağı okuyarak genişletilmiş aramalar yapıyor. Bir junior analistin 2 saatlik araştırmasını 2 dakikada almak gibi düşün.

### 08. Dosya Yükleme

PDF, resim, elektronik tablo, CSV, kod dosyası ve belgeler doğrudan sohbete yüklenebiliyor. Claude bunları yalnızca depolamıyor — okuyor ve anlıyor. 50 sayfalık bir rapor yükleyip 37. sayfa hakkında spesifik sorular sorabilirsin.

### 09. Görüntü Analizi

Herhangi bir görüntü yükle; Claude onu olağanüstü bir ayrıntıyla analiz ediyor. Hata ekran görüntüleri, beyaz tahta fotoğrafları, grafikler, diyagramlar, el yazısı notlar, fişler, kartvizitler. Görsel bilgi içeriyorsa Claude çıkarıp yorumlayabiliyor.

### 10. Canvas

Claude doğrudan sohbette görseller, diyagramlar ve etkileşimli bileşenler üretebiliyor. Sürecinin akış şemasını, karşılaştırma tablosunu, organizasyon şemasını veya basit bir hesap makinesini satır içinde oluşturabilir.

### 11. LaTeX Render

Matematik, istatistik veya teknik içerikle çalışıyorsan Claude LaTeX denklemlerini düzgün biçimde işliyor. Formüller, türetmeler veya istatistiksel çıktılar güzel biçimlendirilmiş olarak görüntüleniyor.

### 12. Konuşma Dallanması

Önceki herhangi bir mesajı düzenle — Claude o noktadan itibaren yanıtı yeniden oluşturarak yeni bir dal açıyor. Orijinal konuşma dizisini kaybetmeden alternatif yaklaşımları keşfedebilirsin.

---

## Claude Code: Güçlü Özellikler

### 13. CLAUDE.md Hiyerarşisi

Çoğu kullanıcının bir CLAUDE.md'si vardır. Güçlü kullanıcıların üç seviyesi vardır:

| Seviye | Yol | Kapsam |
|--------|-----|--------|
| Kullanıcı | `~/.claude/CLAUDE.md` | Kişisel tercihler |
| Proje | `.claude/CLAUDE.md` | Ekip standartları |
| Dizin | İlgili dizin içinde | Modüle özgü kurallar |

Bunlar basamaklanır ve en spesifik seviye kazanır.

### 14. Yola Özgü Kurallar

`.claude/rules/` içinde glob deseni belirten YAML ön koşullu dosyalar oluştur. `paths: ["**/*.test.*"]` içeren bir kural, kod tabanındaki her test dosyasına otomatik uygulanıyor. Ana CLAUDE.md'yi karmaşıklaştırmadan farklı dosya türleri için farklı standartlar.

### 15. Plan Modu

`Shift+Tab` ile plan moduna geç. Claude adım adım bir plan oluşturuyor, onayın için gösteriyor ve yalnızca sen kabul ettikten sonra çalıştırıyor. Birden fazla dosyaya dokunan her görev için vazgeçilmez. Temiz yürütme ile hata ayıklama kaosu arasındaki fark.

### 16. /compact

Bağlam uzadığında konuşmayı sıkıştırıyor. Claude önemli ayrıntıları saklıyor ama bağlam penceresi alanını serbest bırakıyor. Claude hataları tekrarlamaya veya önceki kararları takip etmeyi kaybetmeye başladığında kullan.

### 17. /memory

Claude Code'un bu oturum için hangi hafıza dosyalarını yüklediğini tam olarak gösteriyor. Claude tutarsız davranıyorsa doğru bağlamın gerçekten aktif olup olmadığını kontrol etmek için çalıştır.

### 18. Özel Slash Komutları

`.claude/commands/` (proje) veya `~/.claude/commands/` (global) içinde yeniden kullanılabilir komutlar oluştur:

```markdown
# .claude/commands/review.md
Kodu şu kriterlere göre incele:
1. Güvenlik açıkları
2. Performans sorunları
3. Test kapsamı
```

Bir kez yaz, `/review` ile her seferinde çalıştır.

### 19. Git Entegrasyonu

Claude Code yerel git farkındalığına sahip. Commit yapabiliyor, push edebiliyor, dal oluşturabiliyor ve hatta yaptığı değişikliklere göre commit mesajları yazabiliyor. "Her şeyi açıklayıcı bir mesajla commit et" gerçekten işe yarıyor.

### 20. Çoklu Dosya Düzenleme

Claude Code tek bir işlemde birden fazla dosyayı okuyup düzenleyebiliyor. Tüm kod tabanında bir fonksiyon yeniden adlandırma, tüm importları güncelleme, bir bileşeni refactor edip her kullanımını güncelleme — hepsi tek seferinde.

### 21. Test Üretimi

Claude Code'u herhangi bir fonksiyon veya modüle yönlendir: *"Bunun için kapsamlı testler yaz."* Projenin test kurallarını izleyen, uç durumlar ve hata senaryoları dahil test dosyaları üretiyor.

### 22. `-p` Bayrağı

Claude Code'u etkileşimsiz, başsız modda çalıştırıyor. CI/CD pipeline'ları için vazgeçilmez. Onsuz CI işin sonsuza kadar kullanıcı girişi bekler. Onunla Claude özerk çalışıyor ve yapılandırılmış çıktı döndürüyor.

### 23. `--output-format json`

`--json-schema` ile birlikte Claude Code makine tarafından ayrıştırılabilir yapılandırılmış çıktı döndürüyor. CI pipeline'ın bulguları otomatik olarak ayrıştırıp satır içi PR yorumları olarak gönderebiliyor.

### 24. Bağımsız İnceleme Oturumları

Kod yazan Claude Code oturumu, inceleme yaparken kendi kararlarına karşı önyargılı. Kod incelemesi için her zaman ayrı, taze bir oturum kullan. Daha nesnel sonuçlar alırsın.

---

## Claude Cowork: Gizli İşlevsellik

### 25. Alt-Ajan Paralel İşleme

Cowork büyük bir görev aldığında aynı anda çalışan birden fazla alt-ajan başlatabiliyor. 20 dosyayı işlemesini söyle — bunları paralel çalışan 4-5 alt-ajan arasında bölüyor. Sıralı olarak 30 dakika süren şey 6 dakikada bitiyor.

### 26. /schedule

Tekrarlayan görevler ayarla. Günlük brifingleri, haftalık temizlikler, aylık finansal işlemler. Bilgisayarın açık ve Claude Desktop'ın çalışıyor olması gerekiyor ama görevler katılımsız çalışıyor. Uyku sırasında çalışması planlanan görevler, bilgisayar açıldığında otomatik başlıyor.

### 27. Bağlayıcı Zincirleme

Birden fazla bağlayıcıyı tek bir iş akışında birleştir:

> "Gmail'imi oku, takvime bak, Drive'dan ilgili dosyaları çek ve bir toplantı hazırlık belgesi oluştur."

Dört bağlayıcı, bir talimat, sıfır sekme değiştirme.

### 28. Eklenti Pazarı

`claude.com/plugins` adresindeki doğrulanmış eklentiler belirli roller için önceden oluşturulmuş yetenekler sunuyor: Ürün yönetimi, pazarlama, finans, hukuk. Her eklenti o işleve özel slash komutları ve beceriler ekliyor.

### 29. Klasör Talimatları

Herhangi bir klasörün içine talimatlar içeren bir markdown dosyası yerleştir. Cowork o klasördeki dosyalar üzerinde çalışırken önce bu talimatları okuyor. Farklı projeler için farklı kurallar, otomatik bağlam değiştirme.

### 30. Sandbox Güvenliği

Cowork'un yaptığı her şey korumalı bir Linux VM içinde çalışıyor. Açıkça izin verdiğin klasörler dışındaki dosyalara erişemiyor. Etki alanını sen kontrol ediyorsun — üretim çalışması için güvenli olmasının nedeni bu.

### 31. Tarayıcı Köprüsü

Chrome'daki Claude, Cowork'un yanında yüklendiğinde ikisi birlikte çalışıyor. Cowork web araştırmasını Chrome'a devredebiliyor, sonuçları yerel olarak işleyebiliyor ve iş akışını sürdürebiliyor.

### 32. Oturum Geçmişi

Her Cowork oturumu; hangi eylemlerin gerçekleştirildiği, hangi dosyaların değiştirildiği ve çıktının ne olduğuna dair tam ayrıntılarla kaydediliyor. Başarısız otomasyonların hata ayıklaması için vazgeçilmez.

### 33. Token Kullanım Farkındalığı

Cowork görevleri normal sohbetten 3-5 kat daha fazla token tüketiyor. İlgili görevleri tek oturumlarda toplu olarak yap. Ağır görevleri, verimin daha yüksek olduğu bildirilen yoğun olmayan saatlere zamanla.

### 34. Eklenti Zincirleme

Birden fazla eklentiyi tek bir iş akışında birleştir. Araştırma eklentin analiz eklentine, o da rapor eklentine besleniyor. Tek bir komutla tetiklenen çok adımlı, çok yetenekli iş akışları.

---

## Platform Geneli Ayarlar

### 35. Kullanım Panosu

Token tüketimini ve kullanım kalıplarını kontrol et. Sınırlara ulaşıyorsan tokenların nereye gittiğini görerek optimize edebilirsin.

### 36. Model Seçimi

| Model | En İyi Kullanım |
|-------|----------------|
| Haiku 4.5 | Hızlı, basit görevler |
| Sonnet 4.6 | Hız ve kalite dengesi |
| Opus 4.7 | Karmaşık akıl yürütme, final kalite |

Modeli göreve göre eşleştir — her şey için Opus kullanmak gereksiz tüketim.

### 37. API Erişimi

Claude aboneliğin API kredileri içeriyor. Özel entegrasyonlar oluştur, Claude'u kendi araçlarına bağla veya standart arayüzlerin desteklemediği iş akışlarını otomatikleştir.

### 38. Ekip Paylaşımı

Takım ve Kurumsal planlarda projeleri, becerileri ve yapılandırmaları ekibinle paylaşabilirsin. Herkes aynı bağlamı, aynı standartları ve aynı yetenekleri alıyor. Tüm organizasyon genelinde tutarlılık.

### 39. Veri Gizliliği Kontrolleri

Konuşmalarının eğitim için kullanılmasından vazgeçebilirsin. **Ayarlar → Gizlilik**'i kontrol et. Hassas iş çalışmaları için veri işleme tercihlerinin doğru ayarlandığını doğrula.

### 40. Klavye Kısayolları

| Kısayol | Eylem |
|---------|-------|
| `Ctrl+/` | Tüm kısayolları göster |
| `Ctrl+Shift+O` | Yeni konuşma aç |
| `Ctrl+Shift+C` | Son yanıtı kopyala |

Bu küçük verimlilikler yüzlerce günlük etkileşimde birikerek büyük fark yaratıyor.

---

## Nereden Başlamalısın?

40 özellik. Hepsi gözlerinin önünde gizlenmiş. Kullanıcıların %99'u belki 10'unu biliyor.

Claude tek bir araç değil — her biri çoğu kullanıcının hiç keşfetmediği işlevsellik katmanlarına sahip üç arayüz.

**Önerilen başlangıç noktası:** İşinle en alakalı 5 özelliği bu listeden seç ve bugün dene. Her biri daha önce mümkün olduğunu bilmediğin bir iş akışının kilidini açıyor.

---

*Kaynak: Khairallah AL-Awady — [Anthropic Docs](https://docs.anthropic.com)*
