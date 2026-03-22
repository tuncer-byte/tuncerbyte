---
title: "Claude Code Skills Nedir, Ne İşe Yarar, Neden Var?"
date: "2026-03-22"
excerpt: "Skill'ler, Claude Code'un yapabileceklerini genişleten talimat dosyaları — otomatik olarak ya da komutla çalışıyor. Nasıl çalıştıkları, neden var oldukları ve nasıl kullanmaya başlayabileceğin."
tags: ["Claude Code", "Yapay Zeka", "Geliştirici Araçları", "Üretkenlik", "Agent", "Otomasyon", "Skills"]
category: "Araçlar"
---

Claude Code'un Skills denen bir özelliği var. Yüzeysel bakınca basit görünüyor — "talimat dosyası yükle" — ama arkasında ne döndüğünü anladığında önemi daha net oturuyor.

Adım adım açıklayayım.

---

## Skill Nedir?

Skill, belirli bir dizine koyduğun `SKILL.md` adlı bir Markdown dosyası. Claude onu okuyor ve o oturum için araç setine ekliyor.

Doğrudan bir slash komutuyla çağırabilirsin:

```
/skill-adı
```

Ya da Claude'un ne yaptığını anlayıp ilgili skill'i otomatik yüklemesine bırakabilirsin.

Temel mekanik bu. Geri kalanı bunun üzerine kurulu.

---

## Skill'ler Neden Var?

Skill'lerin çözdüğü problem bağlam. Claude çok şey yapabiliyor ama senin projenin deploy sürecini, ekibinin code review standartlarını, API convention'larını veya commit'leri nasıl sevdiğini bilmiyor. Her oturumda aynı şeyleri yeniden açıklıyorsun.

Skill'ler bunu iki şekilde çözüyor:

**1. Tekrar eden iş akışlarını kodluyor.** Bir `/deploy` skill'i tam adımlarını biliyor: testleri çalıştır, build et, hedefe gönder, doğrula. Her seferinde yeniden açıklamak zorunda kalmıyorsun.

**2. Uzmanlık aktarıyor.** Bir skill'in senin olması gerekmiyor. Tasarım, güvenlik veya code review konusunda yıllarını harcamış biri o düşüncesini bir `SKILL.md` dosyasına kodlayabilir. Yüklüyorsun. Artık Claude o konulara o kişinin çerçevesiyle yaklaşıyor.

İkincisi daha az belirgin ama daha güçlü kullanım senaryosu.

---

## Skill'ler Teknik Olarak Nasıl Çalışıyor?

Skill'ler [Agent Skills](https://agentskills.io) açık standardını takip ediyor. Bu sayede Claude Code, Cursor, Codex ve diğer araçlarla uyumlu — tek bir platforma kilitli değil.

Her skill bir dizin içinde yaşıyor. Dizin adı slash komut adı oluyor.

```
~/.claude/skills/
  acikla/
    SKILL.md
  deploy/
    SKILL.md
    scripts/
      run-deploy.sh
```

`SKILL.md` iki parçadan oluşuyor: YAML frontmatter ve Markdown talimatlar.

```yaml
---
name: acikla
description: Kodu diyagramlar ve benzetmelerle açıklar. "Bu nasıl çalışıyor?" diye sorulduğunda ya da kod açıklamak gerektiğinde kullan.
---

Kod açıklarken:
1. Günlük hayattan bir benzetmeyle başla
2. Yapıyı gösteren ASCII diyagram çiz
3. Adım adım ne olduğunu anlat
4. Yaygın bir hataya dikkat çek
```

`description` alanı, Claude'un skill'i otomatik yükleyip yüklemeyeceğine karar verirken okuduğu şey. Birinin ne zaman kullanması gerektiğini açıklar gibi yaz — çünkü tam olarak bu.

---

## Skill'ler Nerede Yaşıyor?

Farklı konumlardaki skill'lerin farklı kapsamı var:

| Konum | Yol | Kapsam |
|-------|-----|--------|
| Kişisel | `~/.claude/skills/<ad>/SKILL.md` | Tüm projelerin |
| Proje | `.claude/skills/<ad>/SKILL.md` | Yalnızca bu proje |
| Plugin | `<plugin>/skills/<ad>/SKILL.md` | Plugin nerede aktifse |
| Kurumsal | Yönetilen ayarlar | Tüm kuruluş kullanıcıları |

Kişisel skill'ler en çok kullandığım kategori. Bir kez yaz, her yerde kullan.

---

## Kim Çağırır: Sen mi, Claude mi?

Varsayılan olarak hem sen hem Claude herhangi bir skill'i çağırabilir. İki frontmatter alanıyla bunu kısıtlayabilirsin:

**`disable-model-invocation: true`** — Yalnızca sen tetikleyebilirsin. Yan etkisi olan her şey için kullan. Claude'un "kod hazır görünüyor" diye deploy'a basmasını istemezsin.

**`user-invocable: false`** — Yalnızca Claude çağırabilir. Anlamlı bir eylem olmayan ama Claude'un otomatik yüklemesini istediğin arka plan bilgisi için kullan. Eski bir sistemin nasıl çalıştığını açıklayan bir skill slash komut menüsünde görünmesine gerek yok — Claude bunu sadece ilgili olduğunda yüklesin.

| Ayar | Sen çağırabilirsin | Claude çağırabilir |
|------|-------------------|-------------------|
| Varsayılan | Evet | Evet |
| `disable-model-invocation: true` | Evet | Hayır |
| `user-invocable: false` | Hayır | Evet |

---

## Argümanlar

Skill'ler `$ARGUMENTS` üzerinden argüman alıyor. `/sorun-duzelt 123` yazdığında, skill içindeki `$ARGUMENTS` yeri `123` ile dolduruluyor.

```yaml
---
name: sorun-duzelt
description: GitHub issue'su düzelt
disable-model-invocation: true
---

GitHub issue $ARGUMENTS'ı kodlama standartlarımıza göre düzelt.

1. Issue açıklamasını oku
2. Düzeltmeyi uygula
3. Test yaz
4. Commit oluştur
```

Konuma göre tek tek argümana da ulaşabilirsin: `$ARGUMENTS[0]`, `$ARGUMENTS[1]`, ya da kısa haliyle `$0`, `$1`.

---

## Dinamik Bağlam Enjeksiyonu

`` !`<komut>` `` sözdizimi, skill çalışmadan önce bir shell komutu çalıştırıp çıktısını doğrudan prompt'a yerleştiriyor. Claude komutu görmüyor — yalnızca sonucu görüyor.

```yaml
---
name: pr-ozet
description: Pull request'i özetle
context: fork
---

## PR bağlamı
- Diff: !`gh pr diff`
- Yorumlar: !`gh pr view --comments`
- Değişen dosyalar: !`gh pr diff --name-only`

Bu pull request'i kısa özetle.
```

Bu çalıştığında önce üç shell komutu çalışıyor. Çıktıları yer tutucuların yerine geçiyor. Claude'a zaten gerçek veriyle dolu bir prompt geliyor.

Pratikte çok işe yarıyor. Claude bağlamı kendisi çekmek yerine (bütün gidip gelmeleriyle birlikte), sen deterministik biçimde önceden yüklüyorsun.

---

## Skill'i Subagent İçinde Çalıştırmak

`context: fork` ekle — skill izole bir bağlamda çalışsın, konuşma geçmişine erişimi olmasın, temiz sayfa.

```yaml
---
name: derin-arastirma
description: Bir konuyu kapsamlı araştır
context: fork
agent: Explore
---

$ARGUMENTS'ı kapsamlı araştır:
1. Glob ve Grep ile ilgili dosyaları bul
2. Kodu oku ve analiz et
3. Spesifik dosya referanslarıyla bulgularını döndür
```

`agent` alanı hangi subagent'ın kullanılacağını belirliyor: `Explore`, `Plan`, `general-purpose` veya tanımladığın herhangi bir özel agent. Skill içeriği görev oluyor. Sonuçlar ana konuşmana dönüyor.

---

## Zaten Sahip Olduğun Bundled Skill'ler

Claude Code bazı skill'lerle hazır geliyor:

| Skill | Ne yapıyor |
|-------|-----------|
| `/batch <talimat>` | Büyük değişikliği paralel birimlere böler, her birim için izole git worktree'de agent başlatır, birim başına PR açar |
| `/simplify` | Üç review agent'ı paralel çalıştırır, bulguları birleştirir, değişen dosyalara düzeltmeleri uygular |
| `/loop [aralık] <prompt>` | Bir prompt'u belirli aralıklarla tekrar çalıştırır — deploy izlemek ya da PR takibi için kullanışlı |
| `/debug` | Oturum debug log'unu okuyarak sorunları tespit eder |
| `/claude-api` | Dilin için Claude API referansını yükler ve SDK import ettiğinde otomatik devreye girer |

`/batch` özellikle dikkat çekici. Büyük bir migration ya da refactor tarif ediyorsun, kod tabanını inceliyor, 5–30 bağımsız birime bölünmüş bir plan öneriyor ve onay verince her birim için paralel agent başlatıyor. Her agent izole worktree'de çalışıyor, testleri çalıştırıyor ve PR açıyor. Tek kişinin yapabileceklerini ciddi ölçüde genişleten bir şey.

---

## Destekleyici Dosyalar

Skill yalnızca `SKILL.md`'den ibaret değil. Tüm dizin kullanımına açık.

```
skill-adim/
├── SKILL.md          (zorunlu)
├── referans.md       (detaylı doküman — gerektiğinde yükleniyor)
├── ornekler/
│   └── ornek.md      (beklenen çıktı örneği)
└── scripts/
    └── helper.py     (Claude'un çalıştırabileceği script)
```

Destekleyici dosyalara `SKILL.md`'den referans ver — Claude neyin ne için olduğunu bilsin. Kural olarak: `SKILL.md`'yi 500 satırın altında tut. Ağır dokümantasyonu Claude'un yalnızca gerektiğinde çektiği ayrı dosyalara taşı.

---

## Büyük Resim

Claude Code'da özel komutlar zaten vardı. Skill'ler o kavramı birkaç önemli şekilde genişletiyor: destekleyici dosyalar için özel dizin, invocation kontrolü için frontmatter, subagent çalıştırma desteği ve dinamik bağlam enjeksiyonu.

Ama daha önemlisi, skill'ler agent uzmanlığının nasıl paketlenip paylaşılacağını standartlaştırıyor. Aynı `SKILL.md` dosyası Claude Code'da, Cursor'da, Codex'te çalışıyor. Güvenlik review'ı ya da veritabanı tasarımı konusunda iyi biri o uzmanlığını bir kez kodlayıp dağıtabiliyor. Yüklüyorsun. O bilgi artık iş akışının parçası.

Bunu ilginç bulduğum taraf bu. Yalnızca "kendi iş akışın için talimat yaz" değil, "başkasının yıllar içinde edindiği uzmanlığı aktarılabilir bir dosya olarak ödünç al."

---

*Kaynak: [Claude Code Skills Docs](https://code.claude.com/docs/en/skills) — [Agent Skills açık standardı](https://agentskills.io)*
