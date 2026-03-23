---
title: "CLAUDE.md Nedir? Claude Code Yapılandırma Rehberi"
date: "2026-03-23"
excerpt: "CLAUDE.md, Claude Code'a projeniz hakkında ne yapması ve nasıl davranması gerektiğini söyleyen talimat dosyasıdır. Bu rehberde .claude/ klasörünün tüm yapısını — rules, commands, skills, agents, settings.json — örneklerle açıklıyoruz."
tags: ["CLAUDE.md", "Claude Code", "Claude Code Yapılandırma", "AI", "Geliştirici Araçları", "Agent", "Üretkenlik"]
category: "Tools"
---

**CLAUDE.md**, Claude Code'a projeniz hakkında ne yapması gerektiğini anlatan bir talimat dosyasıdır. Her oturum başladığında Claude bu dosyayı okur ve içindeki kuralları, mimari bilgileri, komutları ve kısıtlamaları tüm konuşma boyunca uygular.

Kısacası: Claude'a kim olduğunuzu ve nasıl çalışmanız gerektiğini bu dosyada söylersiniz.

---

## CLAUDE.md nereye konur?

Proje kökünüze koyarsınız:

```
your-project/
├── CLAUDE.md       ← buraya
├── src/
└── package.json
```

Bu kadar. Claude Code bir oturum başlattığında bu dosyayı otomatik olarak bulur ve okur.

Ama aslında birden fazla yere koyabilirsiniz:

- **Proje kökü** (`./CLAUDE.md`) — takımla paylaşılan kurallar, git'e commit edilir
- **Alt dizinler** — yalnızca o klasörde geçerli olan özel kurallar
- **Global** (`~/.claude/CLAUDE.md`) — tüm projelerinizde geçerli kişisel tercihler

Claude hepsini bulur ve birleştirir.

---

## CLAUDE.md'ye ne yazılır?

Çoğu kişi ya çok fazla ya da çok az yazar. İşte işe yarayan yaklaşım:

**Yazın:**
- Derleme, test ve lint komutları (`npm run test`, `make build`)
- Mimari kararlar ("Turborepo ile monorepo kullanıyoruz")
- Göze çarpmayan tuzaklar ("TypeScript strict mode açık")
- Import kuralları, isimlendirme kalıpları, hata yönetimi stilleri

**Yazmayın:**
- Linter veya formatter config'ine ait şeyler
- Zaten link verebileceğiniz tam dokümantasyon
- Teoriyi açıklayan uzun paragraflar

**200 satırın altında tutun.** Daha uzun dosyalar fazla bağlam tüketir ve Claude'un talimatlara uyumu düşer.

### Minimal ama etkili bir CLAUDE.md örneği

```
# Proje: Acme API

## Komutlar
npm run dev    # Geliştirme sunucusu
npm run test   # Testler (Jest)
npm run lint   # ESLint + Prettier
npm run build  # Prodüksiyon derlemesi

## Mimari
- Express REST API, Node 20
- PostgreSQL, Prisma ORM üzerinden
- Tüm handler'lar src/handlers/ içinde
- Paylaşılan tipler src/types/ içinde

## Kurallar
- Her handler'da request doğrulaması için zod kullan
- Dönüş şekli her zaman { data, error }
- İstemciye asla stack trace gösterme
- console.log değil, logger modülünü kullan

## Dikkat et
- Testler gerçek yerel DB kullanır, mock değil
- Strict TypeScript: kullanılmayan import asla olmaz
```

Yaklaşık 20 satır. Claude'un bu projede sürekli açıklama istemeden çalışması için yeterli.

### CLAUDE.local.md: kişisel geçersiz kılmalar

Tüm takıma değil, yalnızca size özel bir tercih varsa `CLAUDE.local.md` oluşturun. Claude bunu ana `CLAUDE.md`'nin yanında okur ama otomatik olarak gitignore'a alındığından repoya girmez.

---

## .claude/ klasörü içinde neler var?

`CLAUDE.md` tek dosya değil. Projenizin `.claude/` klasörü aslında birkaç farklı bileşenden oluşur:

```
.claude/
├── settings.json       # İzinler ve yapılandırma
├── settings.local.json # Kişisel izin geçersiz kılmaları (gitignored)
├── commands/           # Özel slash komutları
├── rules/              # Modüler talimat dosyaları
├── skills/             # Otomatik tetiklenen iş akışları
└── agents/             # Uzman subagent personaları
```

Her birini açıklayalım.

---

## rules/: büyüyen takımlar için modüler talimatlar

Proje büyüdükçe CLAUDE.md şişer ve kimse güncel tutmaz. `rules/` klasörü bunu çözer.

`.claude/rules/` içindeki her markdown dosyası CLAUDE.md'nizle birlikte otomatik yüklenir:

```
.claude/rules/
├── code-style.md
├── testing.md
├── api-conventions.md
└── security.md
```

Her dosya odaklı kalır. API kurallarına sahip çıkan kişi `api-conventions.md`'yi düzenler. Test standartları için sorumlu olan `testing.md`'yi. Kimse birbirinin ayağına basmaz.

Daha da güçlü olan **path kapsamlı kurallar**: YAML frontmatter ekleyin, dosya yalnızca belirli klasörlerde çalışırken devreye girsin:

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "src/handlers/**/*.ts"
---
# API Tasarım Kuralları
- Tüm handler'lar { data, error } şeklini döndürür
- Request body doğrulaması için zod kullan
- İstemcilere asla iç hata detaylarını açıklama
```

Claude bir React bileşenini düzenlerken bu dosyayı yüklemez. Yalnızca `src/api/` veya `src/handlers/` içinde çalışırken yükler.

---

## commands/: özel slash komutları

Claude Code'un yerleşik slash komutlarına (`/help`, `/compact`) ek olarak kendinizinkini ekleyebilirsiniz.

`.claude/commands/` içindeki her markdown dosyası bir slash komutuna dönüşür:
- `review.md` → `/project:review`
- `fix-issue.md` → `/project:fix-issue`

İşte gerçek bir örnek:

```markdown
---
description: Merge öncesi mevcut branch diff'ini sorunlar için incele
---

## Değişiklikler
!`git diff --name-only main...HEAD`

## Detaylı Diff
!`git diff main...HEAD`

Yukarıdaki değişiklikleri incele:
1. Kod kalitesi sorunları
2. Güvenlik açıkları
3. Eksik test kapsamı

Dosya bazında spesifik geri bildirim ver.
```

`!` backtick sözdizimi kabuk komutlarını çalıştırır ve çıktıyı prompt'a gömer. `/project:review` çalıştırdığınızda Claude gerçek git diff'i görür.

### Argüman geçmek: $ARGUMENTS

```markdown
---
description: Bir GitHub issue'sunu araştır ve düzelt
argument-hint: [issue-numarası]
---

Bu repodaki #$ARGUMENTS numaralı issue'ya bak.
!`gh issue view $ARGUMENTS`

Hatayı anla, kök nedenine in, düzelt ve test yaz.
```

`/project:fix-issue 234` çalıştırmak, 234 numaralı issue'yu doğrudan prompt'a besler.

Proje komutları git'e commit edilip takımla paylaşılır. Tüm projelerinizde kullanmak istedikleriniz `~/.claude/commands/` içine gider ve `/user:komut-adı` olarak görünür.

---

## skills/: Claude'un kendi başına tetikleyebileceği iş akışları

Komutlar siz çağırınca çalışır. **Skill'ler farklıdır: Claude konuşmayı izler ve görev açıklamayla eşleştiğinde kendi başına çağırır.**

"Bu PR'ı güvenlik açıkları için incele" dediğinizde `/security-review` yazmanıza gerek yok. Claude tanımı okur, eşleştiğini fark eder ve skill'i otomatik başlatır.

Her skill kendi alt dizininde yaşar:

```
.claude/skills/
├── security-review/
│   ├── SKILL.md
│   └── DETAILED_GUIDE.md
└── deploy/
    └── SKILL.md
```

```markdown
---
name: security-review
description: Kapsamlı güvenlik denetimi. Güvenlik açıkları için kod incelenirken veya kullanıcı güvenlikten bahsettiğinde kullan.
allowed-tools: Read, Grep, Glob
---

Codebase'i güvenlik açıkları için analiz et:
1. SQL injection ve XSS riskleri
2. Açıkta kalan credentials
3. Güvensiz yapılandırmalar

Bulguları önem derecesiyle raporla.
Standartlar için @DETAILED_GUIDE.md'ye başvur.
```

Skill'ler komutlardan farklı olarak yan dosyalar barındırabilir. `@DETAILED_GUIDE.md` referansı, `SKILL.md`'nin yanındaki ayrıntılı belgeyi çeker. Komutlar tek dosyadır; skill'ler bir pakettir.

---

## agents/: uzman subagent personaları

Karmaşık görevler için `.claude/agents/` içinde özel bir subagent tanımlayabilirsiniz. Her agent kendi sistem prompt'una, araç erişimine ve model tercihine sahip bir markdown dosyasıdır:

```markdown
---
name: code-reviewer
description: Uzman kod gözlemcisi. PR incelerken veya merge öncesi implementasyonları doğrularken PROAKTİF olarak kullan.
model: sonnet
tools: Read, Grep, Glob
---

Doğruluk ve sürdürülebilirliğe odaklanan kıdemli bir kod gözlemcisisiniz.

Kod incelerken:
- Yalnızca stil sorunlarını değil, hataları işaretle
- Spesifik düzeltmeler öner
- Uç durumları ve hata yönetimi boşluklarını kontrol et
```

Claude bir inceleme yapması gerektiğinde bu agent'ı kendi yalıtılmış bağlam penceresinde başlatır. Agent işini yapar ve geri bildirir. Ana oturumunuz binlerce token'lık ara keşifle dolmaz.

`tools` alanı agent'ın yapabileceklerini kısıtlar. Güvenlik denetçisinin dosya yazması için hiçbir nedeni yok — bu kısıtlama kasıtlıdır. `model` alanıyla odaklı görevler için daha ucuz ve hızlı bir model kullanabilirsiniz.

---

## settings.json: izinler ve güvenlik

`.claude/settings.json` Claude'un nelere izinli nelere yasak olduğunu kontrol eder:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Read",
      "Write",
      "Edit"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

- **allow** listesi → Claude onay istemeden çalıştırır
- **deny** listesi → tamamen engellenir, ne olursa olsun
- **İkisinde de olmayanlar** → Claude devam etmeden önce sorar

`$schema` satırı VS Code ve Cursor'da otomatik tamamlama sağlar, her zaman ekleyin.

Kişisel izin değişiklikleri için `.claude/settings.local.json` oluşturun — commit edilmez, gitignore'a alınır.

---

## Global ~/.claude/ klasörü

Proje `.claude/`'nun yanı sıra ana dizininizde de bir `.claude/` vardır. Fark şu:

| | `.claude/` (proje) | `~/.claude/` (global) |
|---|---|---|
| Kapsam | Yalnızca bu proje | Tüm projeler |
| Git | Commit edilir | Edilmez |
| Kullanım | Takım kuralları | Kişisel tercihler |

`~/.claude/CLAUDE.md` — tüm projelerde her oturuma yüklenir. Kişisel kodlama ilkeleriniz buraya gider.

`~/.claude/projects/` — oturum transkriptleri ve otomatik bellek. Claude çalışırken kendine notlar kaydeder: keşfettiği komutlar, mimari içgörüler. `/memory` ile görüntüleyebilirsiniz.

---

## Nereden başlamalı?

**1. Adım:** Claude Code içinde `/init` çalıştırın. Projenizi okuyarak başlangıç `CLAUDE.md` oluşturur. Özüne indirin.

**2. Adım:** `.claude/settings.json` ekleyin. En azından çalıştırma komutlarınıza izin verin, `.env` okumalarını engelleyin.

**3. Adım:** En sık yaptığınız iş akışları için bir iki komut oluşturun. Kod incelemesi ve issue düzeltme iyi başlangıçtır.

**4. Adım:** CLAUDE.md kalabalıklaşınca `.claude/rules/` dosyalarına bölün. Path'e göre kapsamlandırın.

**5. Adım:** Kişisel tercihleriniz için `~/.claude/CLAUDE.md` ekleyin.

Projelerin büyük çoğunluğu için bu kadar yeterli. Skill'ler ve agent'lar, tekrarlayan karmaşık iş akışlarınız olduğunda devreye girer.

---

## Sık sorulan sorular

### CLAUDE.md olmadan Claude Code çalışır mı?

Evet, çalışır. Ama siz konuşmayı yönetmek zorunda kalırsınız — Claude projenizi, kurallarınızı ve tercihlerinizi her seferinde sıfırdan öğrenir. CLAUDE.md bu öğrenmeyi bir kez yapmanızı sağlar.

### CLAUDE.md ile .cursorrules arasındaki fark nedir?

İkisi de aynı fikri uygular: AI'ya proje bağlamı vermek. `.cursorrules` Cursor'a özeldir, CLAUDE.md ise Claude Code'a. Claude Code aynı zamanda `.cursor/rules` formatını da destekler.

### CLAUDE.md güvenlik açığı oluşturur mu?

Potansiyel olarak evet — kötü niyetli bir CLAUDE.md tehlikeli talimatlar içerebilir. Bu yüzden başkasının oluşturduğu bir projeyi klonladıktan sonra CLAUDE.md'yi açıp okumak iyi bir alışkanlıktır. `settings.json`'daki deny listesi ek bir güvenlik katmanı sağlar.

### Kaç tane CLAUDE.md dosyası kullanabilirim?

İstediğiniz kadar. Proje kökü, alt dizinler ve global `~/.claude/CLAUDE.md` birlikte çalışır. Claude hepsini okur ve birleştirir.

### CLAUDE.md'yi başka dilde yazabilir miyim?

Evet. Claude, Türkçe CLAUDE.md'yi anlayıp uygular. Ama ekipte herkesin okuması için İngilizce tercih edilir.
