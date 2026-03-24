---
title: "Claude Code Auto Mode Nedir? Otonom İzin Sistemi Tam Rehberi"
date: "2026-03-24"
excerpt: "Claude Code'un yeni Auto Mode özelliği, her araç çağrısını manuel onaylamak yerine bir sınıflandırıcıyla güvenli/tehlikeli ayrımı yaparak otonom kararlar alıyor. Nasıl çalışır, nasıl etkinleştirilir, sınırları nelerdir — detaylı inceleme."
tags: ["Claude Code", "Auto Mode", "AI Agent", "İzin Sistemi", "Otomasyon", "Yapay Zeka", "Anthropic", "Güvenlik"]
category: "Teknoloji"
---

Anthropic bugün Claude Code için **Auto Mode**'u duyurdu. Bu, şimdiye kadarki izin sistemlerinin arasındaki en büyük boşluğu dolduruyor: her adımda onay istemek ile `--dangerously-skip-permissions` ile tamamen gözetimsiz çalıştırmak arasında makul bir orta yol.

Şu an **Team planı** için research preview olarak yayında. Enterprise ve API kullanıcılarına önümüzdeki günlerde açılıyor.

## Sorun Ne?

Claude Code'u günlük kullanırken iki uçta sıkışıp kalıyorsunuz:

**1. Manuel izin modu:** Her dosya yazma, terminal komutu çalıştırma, web araması gibi işlemde "bunu yapayım mı?" diye soruyor. Uzun session'larda onaylama yorgunluğu gerçek bir problem. Siz zaten evet diyeceksiniz ama her seferinde terminal başında olmanız gerekiyor.

**2. Skip permissions modu:** `--dangerously-skip-permissions` ile her şeyi sormadan yapıyor. Hızlı ama riskli — kötü bir prompt veya yanlış yönlendirilmiş bir araç çağrısı dosyaları silebilir, hassas verileri dışarı sızdırabilir.

Auto Mode bu iki ucun ortasında çalışmak için tasarlandı.

## Auto Mode Nasıl Çalışır?

Sistem, her araç çağrısından önce devreye giren bir **sınıflandırıcı** (classifier) kullanıyor. Bu sınıflandırıcı şu soruyu soruyor: *"Bu işlem güvenli mi?"*

### Sınıflandırıcının Kararları

**Otomatik onaylananlar:** Dosya okuma, kod yazma, standart terminal komutları çalıştırma, web araması gibi normal geliştirme akışındaki işlemler.

**Otomatik bloklananlar:**
- Toplu dosya silme (`rm -rf` türü işlemler)
- Hassas veri sızdırma girişimleri
- Zararlı kod çalıştırma
- Kapsam dışı, potansiyel olarak yıkıcı eylemler

Bir işlem bloklandığında Claude durmak yerine **alternatif bir yaklaşım** arar. Eğer aynı bloklanan eylemi defalarca denemeye devam ederse — o noktada sizden manuel onay ister.

### Karar Akışı

```
Araç çağrısı → Sınıflandırıcı
                    ↓
         [Güvenli mi?]
          ↙         ↘
      Evet           Hayır
       ↓               ↓
  Otomatik         Alternatif
  onaylanır     yaklaşım dener
                      ↓
              [Hala bloklanıyor?]
                  ↓
            Manuel onay ister
```

## Etkinleştirme

### CLI Kullanıcıları

```bash
# Auto mode'u etkinleştir
claude --enable-auto-mode
```

Etkinleştirdikten sonra **Shift+Tab** ile izin modları arasında geçiş yapabilirsiniz:
- Normal mod (her şeyi sorar)
- Auto mod (sınıflandırıcı karar verir)
- Skip permissions (hiçbir şey sormaz)

### Desktop ve VS Code

`Settings → Claude Code → Permission Mode` açılır menüsünden **Auto** seçeneğini seçin.

### Yönetici Yapılandırması (Kurumsal)

Yöneticiler auto mode'u managed settings üzerinden devre dışı bırakabilir:

```json
{
  "disableAutoMode": "disable"
}
```

## Desteklenen Modeller

Auto mode yalnızca şu modellerle çalışıyor:
- **Claude Sonnet 4.6**
- **Claude Opus 4.6**

Eski modellerde auto mode seçeneği görünmez.

## Güvenlik Profili: Gerçekçi Beklentiler

Anthropic bu konuda şeffaf davranıyor — auto mode her şeyi çözmüyor.

**Sınıflandırıcı yanılabilir:** Bağlam belirsizse bazı riskli işlemlere izin verebilir. Bazı zararsız işlemleri de gereksiz yere bloklayabilir. Bu bir "güvenli bölge" garantisi değil.

**`--dangerously-skip-permissions`'dan daha güvenli:** Evet. Ama tamamen güvenli değil.

**Anthropic'in önerisi:** Auto mode bile olsa izole ortamlarda (container, sanal makine) çalıştırmak daha güvenli.

> "Auto mode reduces risk compared to skipping permissions entirely, but it does not eliminate it." — Anthropic

## Performans Etkisi

Her araç çağrısından önce sınıflandırıcı devreye giriyor. Bu şunları küçük ölçüde etkiliyor:

- **Token tüketimi:** Hafif artış
- **Maliyet:** Küçük fark
- **Gecikme (latency):** Araç çağrılarında minimal artış

Spesifik benchmark yok ama Anthropic "small impact" olarak tanımlıyor. Günlük kullanımda fark etmeniz pek olası değil.

## Normal Mod ile Karşılaştırma

| Özellik | Manuel Mod | Auto Mode | Skip Permissions |
|---------|-----------|-----------|-----------------|
| Her işlem için onay | Evet | Hayır | Hayır |
| Zararlı işlemleri engeller | Evet | Evet (sınıflandırıcı) | Hayır |
| Terminal başında olmak gerekir | Evet | Kısmen | Hayır |
| Güvenlik seviyesi | En yüksek | Orta | En düşük |
| Kullanım kolaylığı | Düşük | Yüksek | En yüksek |
| Sınıflandırıcı gecikmesi | Yok | Var (küçük) | Yok |

## Kimler İçin Uygun?

**Auto Mode ideal olanlar:**
- Uzun session'larda çalışan geliştiriciler (build pipeline'ları, veri işleme, refactoring)
- Zaten güvendiği prompt'larla çalışan ama her onayı vermek istemeyenler
- Kapalı, izole ortamlarda deploy eden ekipler

**Dikkatli olunması gerekenler:**
- Üretim (production) sistemlerine doğrudan erişimi olan session'lar
- Hassas müşteri verisiyle çalışılan ortamlar
- Güvenilirliği test edilmemiş MCP araçlarıyla kullanım

## Enterprise ve Ekip Kullanımı

Team ve Enterprise planlarında auto mode **varsayılan olarak açık** — yani yönetici devre dışı bırakmazsa çalışır. Bu, channels özelliğinden farklı (channels varsayılan kapalı geliyordu).

Enterprise yöneticileri managed settings üzerinden tüm organizasyon için auto mode politikasını merkezi olarak yönetebilir.

## Auto Mode + Channels Kombinasyonu

[Channels özelliği](/tr/claude-code-channels-nedir) ile auto mode'u birlikte kullanmak güçlü bir kombinasyon:

```bash
claude --channels plugin:telegram@claude-plugins-official --enable-auto-mode
```

Bu kombinasyonla:
- Telegram'dan görev veriyorsunuz
- Claude onu otonom olarak çalıştırıyor (auto mode sayesinde sürekli onay gerektirmeden)
- Bitince size Telegram'dan haber veriyor

Tamamen unattended çalışma istiyorsanız `--dangerously-skip-permissions` yerine auto mode çok daha sağlıklı bir seçenek.

## Ne Zaman Gelecek?

| Plan | Durum |
|------|-------|
| Team | Şu an research preview olarak mevcut |
| Enterprise | Önümüzdeki günlerde |
| API | Önümüzdeki günlerde |
| Pro/Max (bireysel) | Duyurulmadı |

## Özet

Auto mode, Claude Code'un izin sistemine gerçekten eksik olan katmanı ekliyor. "Her şeyi sor" ile "hiçbir şey sorma" arasında, bağlama göre karar veren bir sınıflandırıcı sistemi. Mükemmel değil — sınıflandırıcı yanılabilir, performansa küçük etkisi var — ama günlük geliştirme iş akışında ciddi sürtünmeyi azaltacak.

Team planı kullanıyorsanız şu an deneyebilirsiniz. `claude --enable-auto-mode` yeterli.

Daha fazla teknik detay için [Claude Code resmi dokümantasyonu](https://code.claude.com/docs)na bakabilirsiniz.
