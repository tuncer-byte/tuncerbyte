---
title: "Claude Code ile Verimli Çalışmanın En İyi Yolları (2026)"
date: "2026-05-13"
excerpt: "Bağlam penceresini yönetmekten paralel oturumlara, CLAUDE.md yazmaktan otomasyon pipeline'larına kadar Claude Code'dan maksimum verim almanın kanıtlanmış yolları."
tags: ["Claude Code", "Yapay Zeka", "AI", "Geliştirici Araçları", "Prompt Engineering", "CLI", "Otomasyon", "Anthropic", "LLM", "Yazılım Geliştirme"]
category: "Teknoloji"
coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&q=80"
---

Claude Code, bir sohbet botu gibi sorulara cevap verip beklemez. Dosyalarınızı okur, komutlar çalıştırır, değişiklikler yapar ve siz izlerken, yön verirken ya da tamamen uzaktayken sorunları özerk biçimde çözer. Bu farklılık, birlikte çalışma şeklinizi de değiştirir.

Bu rehber, Anthropic'in kendi iç ekiplerinde ve çeşitli kod tabanlarında Claude Code kullanan mühendislerin deneyimlerine dayanıyor.

---

## Temel Kısıt: Bağlam Penceresi

Neredeyse tüm en iyi pratikler tek bir kısıttan kaynaklanır: **bağlam penceresi hızla dolabilir ve doldukça performans düşer.**

Claude'un bağlam penceresi konuşmanızdaki her şeyi tutar: her mesaj, her okunan dosya, her komut çıktısı. Tek bir hata ayıklama oturumu on binlerce token tüketebilir. Pencere dolmaya başladığında Claude önceki talimatları "unutmaya" ya da daha fazla hata yapmaya başlayabilir.

**Bağlam penceresini yönetmek, Claude Code'u verimli kullanmanın temelidir.**

---

## 1. Claude'a Kendi İşini Doğrulama Yolu Açın

Claude, testleri çalıştırabildiğinde, ekran görüntüsü karşılaştırabildiğinde ve çıktıları doğrulayabildiğinde dramatik biçimde daha iyi sonuçlar verir.

| Strateji | Zayıf prompt | Güçlü prompt |
|---|---|---|
| **Doğrulama kriteri** | "e-posta doğrulayan bir fonksiyon yaz" | "validateEmail fonksiyonu yaz. Test örnekleri: user@example.com → true, invalid → false. Sonra testleri çalıştır." |
| **UI değişikliklerini görsel doğrula** | "dashboard'u daha iyi göster" | "[ekran görüntüsü yapıştır] bu tasarımı uygula. Sonucu ekran görüntüsüyle karşılaştır, farkları listele ve düzelt." |
| **Kök nedeni bul** | "build başarısız" | "build şu hatayla başarısız oluyor: [hata mesajı]. Düzelt ve build'in başarılı olduğunu doğrula. Kök nedeni çöz, hatayı bastırma." |

Doğrulamanız bir test paketi, bir linter ya da çıktıyı kontrol eden bir Bash komutu olabilir.

---

## 2. Önce Keşfet, Sonra Planla, Sonra Yaz

Claude'un doğrudan koda atlamasına izin vermek yanlış problemi çözen kod üretebilir. **Plan modu** keşfi uygulamadan ayırmanızı sağlar.

**Önerilen döngü:**

**1. Keşif (Plan modunda)**
```
src/auth klasörünü oku ve oturum yönetimi ile girişi nasıl ele aldığımızı anla.
```

**2. Planlama (Plan modunda)**
```
Google OAuth eklemek istiyorum. Hangi dosyalar değişecek?
Oturum akışı ne olacak? Bir plan oluştur.
```

**3. Uygulama (Normal modda)**
```
Planından OAuth akışını uygula. Callback handler için testler yaz,
test paketini çalıştır ve başarısızlıkları düzelt.
```

**4. Commit**
```
Açıklayıcı bir mesajla commit yap ve PR aç.
```

> **Not:** Her görev için plan yapmak gerekmez. Yazım hatası düzeltmek, log satırı eklemek gibi küçük ve kapsamı belli işler için Claude'u doğrudan yönlendirin.

---

## 3. Promptlarınızı Spesifik Yazın

Claude niyetinizi çıkarsamaya çalışabilir ama zihninizi okuyamaz. Belirli dosyalara referans verin, kısıtlamaları belirtin ve örüntülere işaret edin.

| Strateji | Zayıf | Güçlü |
|---|---|---|
| **Kapsamı belirtin** | "foo.py için test ekle" | "kullanıcının çıkış yaptığı kenar durumu için foo.py'ye mock kullanmadan bir test yaz" |
| **Kaynağa yönlendirin** | "ExecutionFactory neden bu kadar garip bir API'a sahip?" | "ExecutionFactory'nin git geçmişine bak ve API'ın nasıl geliştiğini özetle" |
| **Mevcut örüntüleri gösterin** | "bir takvim widget'ı ekle" | "ana sayfadaki mevcut widget uygulamalarına bak. HotDogWidget.php iyi bir örnek. Aynı örüntüyle, kullanıcının ay seçip yıl için ileri/geri sayfalandırabildiği bir takvim widget'ı ekle." |
| **Semptomu tanımlayın** | "giriş hatasını düzelt" | "kullanıcılar oturum zaman aşımından sonra girişin başarısız olduğunu bildiriyor. src/auth/ içindeki auth akışını, özellikle token yenilemeyi incele. Sorunu yeniden üreten başarısız bir test yaz, sonra düzelt." |

**Zengin içerik sağlayın:**
- `@` ile dosyalara referans verin
- Doğrudan görüntü yapıştırın
- Dokümantasyon URL'leri verin
- `cat error.log | claude` ile veri pipe edin

---

## 4. Ortamınızı Yapılandırın

### Etkili bir CLAUDE.md yazın

CLAUDE.md, Claude'un her konuşmanın başında okuduğu özel bir dosyadır. Bash komutlarını, kod stilini ve iş akışı kurallarını içermelidir.

```markdown
# Kod stili
- ES modülleri kullan (import/export), CommonJS değil (require)
- Mümkünse destructure imports kullan

# İş akışı
- Bir seri kod değişikliğinden sonra typecheck yap
- Tüm test paketini değil, tekil testleri çalıştırmayı tercih et
```

**CLAUDE.md'ye ne ekleyin, ne eklemeyin:**

| ✅ Ekle | ❌ Ekleme |
|---|---|
| Claude'un tahmin edemeyeceği Bash komutları | Claude'un koddan çıkarabileceği her şey |
| Varsayılandan farklı kod stili kuralları | Standart dil konvansiyonları |
| Test talimatları ve tercih edilen test runner'lar | Ayrıntılı API dokümantasyonu (linki ver) |
| Repository etiği (branch adlandırma, PR kuralları) | Sık değişen bilgiler |
| Projeye özel mimari kararlar | Uzun açıklamalar veya öğreticiler |

> Dosya çok uzarsa Claude önemli kuralları görmezden gelebilir. Her satır için: "bunu kaldırsam Claude hata yapar mı?" sorusunu sorun. Hayırsa, silin.

### Permissions yapılandırın

Varsayılan olarak Claude Code, sisteminizi değiştirebilecek her eylem için izin ister. Üç yöntemle bu tekrarları azaltabilirsiniz:

- **Auto mode:** Bir sınıflandırıcı model komutları inceler, yalnızca riskli görünenleri engeller
- **İzin listesi:** `npm run lint` veya `git commit` gibi güvenli araçlara izin verin
- **Sandbox:** Dosya sistemi ve ağ erişimini kısıtlayan OS düzeyinde izolasyon

### CLI araçlarını kullanın

`gh`, `aws`, `gcloud`, `sentry-cli` gibi CLI araçları, harici servislerle etkileşimin en bağlam-verimli yoludur. GitHub için `gh` CLI'yi yükleyin; Claude PR oluşturma, issue açma ve yorum okuma için nasıl kullanacağını bilir.

### MCP server bağlayın

MCP server'larla Claude'dan Notion, Figma, veritabanı ve benzeri araçlarda özellik uygulaması, veri sorgulama ve iş akışı otomasyonu yapmasını isteyebilirsiniz.

### Hook'lar kurun

Hook'lar Claude'un iş akışındaki belirli noktalarda otomatik olarak çalışır. CLAUDE.md talimatlarının aksine, hook'lar deterministik ve garantilidir:

```
Her dosya düzenlemesinden sonra eslint çalıştıran bir hook yaz.
```

### Skill'ler oluşturun

Skill'ler Claude'un bilgisini projenize, ekibinize veya alana özgü bilgilerle genişletir. `.claude/skills/` altına `SKILL.md` ekleyin:

```markdown
---
name: api-conventions
description: Servislerimiz için REST API tasarım kuralları
---
# API Kuralları
- URL path'lerinde kebab-case kullan
- JSON özelliklerinde camelCase kullan
- Liste endpoint'lerinde her zaman pagination ekle
```

---

## 5. Oturumunuzu Yönetin

### Erken ve sık düzeltin

En iyi sonuçlar sıkı geri bildirim döngülerinden çıkar:

- **`Esc`**: Claude'u durdurun, bağlam korunur, yeniden yönlendirin
- **`Esc + Esc` veya `/rewind`**: Önceki konuşma ve kod durumunu geri yükleyin
- **`/clear`**: İlgisiz görevler arasında bağlamı sıfırlayın

> Aynı konuda Claude'u iki kez düzelttiyseniz, bağlam başarısız yaklaşımlarla dolmuştur. `/clear` çalıştırın ve öğrendiklerinizi içeren daha spesifik bir promptla baştan başlayın.

### Bağlamı aktif yönetin

- `/clear` ile görevler arasında bağlamı sıfırlayın
- `/compact <talimatlar>` ile önemli şeylere odaklanın (örn. `/compact API değişikliklerine odaklan`)
- Hızlı sorular için `/btw` kullanın — yanıt geçici bir katmanda görünür, bağlama girmez

### Araştırma için subagent kullanın

Bağlam temel kısıtınız olduğundan subagent'lar en güçlü araçlardan biridir. Claude bir kod tabanını araştırırken çok sayıda dosya okur ve bunların hepsi bağlamınızı tüketir. Subagent'lar ayrı bağlam pencerelerinde çalışır ve özetlerle geri bildirim yapar:

```
Auth sistemimizin token yenilemeyi nasıl ele aldığını ve
yeniden kullanabileceğim OAuth yardımcı programları olup olmadığını
araştırmak için subagent'lar kullan.
```

### Checkpoint'lerle geri alın

Claude her değişiklikten önce otomatik olarak checkpoint alır. `Esc + Esc` veya `/rewind` ile geri sarma menüsünü açabilirsiniz. Riskyeni şeyleri deneyip işe yaramazsa geri alabilirsiniz — checkpoint'ler oturumlar arasında devam eder.

---

## 6. Otomatize Edin ve Ölçeklendirin

### Non-interactive mod

```bash
# Tek seferlik sorgular
claude -p "Bu projenin ne yaptığını açıkla"

# Script'ler için yapılandırılmış çıktı
claude -p "Tüm API endpoint'lerini listele" --output-format json

# Gerçek zamanlı işleme için streaming
claude -p "Bu log dosyasını analiz et" --output-format stream-json
```

### Paralel Claude oturumları

- **Worktree'ler:** Düzenlemeler çakışmasın diye izole git checkout'larında ayrı CLI oturumları çalıştırın
- **Yazar/Gözden Geçiren örüntüsü:** Bir oturum özelliği uygular, diğeri edge case'ler ve tutarsızlıklar için inceler

### Dosyalar genelinde fan-out

Büyük migrationlar veya analizler için işi paralel çağrılara dağıtın:

```bash
for file in $(cat files.txt); do
  claude -p "$file dosyasını React'tan Vue'ya migrate et. OK veya FAIL döndür." \
    --allowedTools "Edit,Bash(git commit *)"
done
```

### Auto mode ile özerk çalıştırın

```bash
claude --permission-mode auto -p "tüm lint hatalarını düzelt"
```

---

## 7. Yaygın Hata Örüntülerinden Kaçının

- **Her şeyi tek oturuma tıkmak:** Bir görevden diğerine atlarsanız bağlam alakasız bilgilerle dolar.
  > **Çözüm:** İlgisiz görevler arasında `/clear` kullanın.

- **Tekrarlayan düzeltmeler:** Claude yanlış yapıyor, düzeltiyorsunuz, hâlâ yanlış. Bağlam başarısız yaklaşımlarla kirleniyor.
  > **Çözüm:** İki başarısız düzeltmeden sonra `/clear` ve daha iyi bir prompt.

- **Şişirilmiş CLAUDE.md:** Çok uzun bir CLAUDE.md'de Claude önemli kuralları görmezden gelir.
  > **Çözüm:** Acımasızca budayın. Claude bir şeyi zaten doğru yapıyorsa talimatı silin veya hook'a dönüştürün.

- **Doğrulama yapmadan göndermek:** Makul görünen ama edge case'leri karşılamayan uygulamalar.
  > **Çözüm:** Her zaman doğrulama sağlayın (testler, scriptler, ekran görüntüleri).

- **Sonsuz keşif:** Kapsamı belirtmeden "araştır" demek, Claude'un yüzlerce dosya okumasına ve bağlamı doldurmasına yol açar.
  > **Çözüm:** Araştırmaları daraltın veya subagent kullanın.

---

## Sonuç

Bu rehberdeki örüntüler kanıtlanmış başlangıç noktaları olmakla birlikte donmuş kurallar değil. Bazen karmaşık bir problemin ortasındaysanız bağlamın birikmesine izin vermek mantıklıdır. Bazen plan yapmayı atlayıp Claude'un keşfetmesini beklemek en doğru seçimdir.

Ne işe yaradığına dikkat edin. Harika çıktı aldığınızda ne yaptığınızı not edin. Claude zorlandığında neden olduğunu sorun. Zamanla bu rehberin yakalayamayacağı bir sezgi geliştirirsiniz.

---

*Kaynak: [Claude Code Resmi Dokümantasyonu](https://code.claude.com/docs/en/best-practices)*
