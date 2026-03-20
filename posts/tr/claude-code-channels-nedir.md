---
title: "Claude Code Channels: Telegram ve Discord'dan AI Agent'ını Yönet"
date: "2026-03-20"
excerpt: "Claude Code'un yeni Channels özelliği, terminalde çalışan AI session'ına Telegram veya Discord üzerinden mesaj gönderip yanıt almana izin veriyor. Kurulum, güvenlik ve pratik kullanım."
tags: ["Claude Code", "AI Agent", "Telegram", "Discord", "MCP", "Otomasyon", "Yapay Zeka"]
category: "Teknoloji"
---

Dün Anthropic, Claude Code için yeni bir özellik duyurdu: **Channels**. Kısaca şunu yapıyor — terminalde açık olan Claude Code session'ına dışarıdan (Telegram, Discord, CI/CD pipeline'ı, webhook...) mesaj gönderebiliyorsun, Claude yanıtlıyor ve yanıt doğrudan o platforma gidiyor.

Henüz research preview aşamasında, Claude Code v2.1.80+ gerekiyor ve claude.ai hesabıyla giriş yapmış olman lazım.

## Channels Ne Yapıyor?

Klasik Claude Code kullanımında terminal başındasın, bir şey soruyorsun, Claude cevap veriyor. Channels bu sınırı kaldırıyor.

Session açıkken telefonundan Telegram'a yazıyorsun: *"build başarılı mı?"* Claude terminalde komutu çalıştırıyor, sonucu Telegram'a gönderiyor. Sen zaten masada bile değilsin.

Kullanım senaryoları:
- CI pipeline'ından hata bildirimi → Claude analiz edip Telegram'a özet atar
- Discord kanalından ekip arkadaşın soru sorar → Claude cevaplar
- Monitoring alarmı tetiklenir → Claude log'lara bakar, ne olduğunu açıklar
- Telefonda yatarken *"şu branch'i merge et"* yazarsın → olur

Channels iki yönlü: mesaj gelir, Claude okur, araçla cevap gönderir. Terminal'de gelen mesajı görürsün ama yanıt metnini görmezsin — yanıt direkt Telegram/Discord'a gider.

## Fakechat ile Önce Dene

Gerçek bir platform kurmadan önce `fakechat` ile test et. Bun gerekiyor:

```bash
bun --version  # yoksa bun.sh/docs/installation
```

Kurulum üç adım:

```bash
# 1. Plugin'i yükle
/plugin install fakechat@claude-plugins-official

# 2. Channels açık Claude Code'u başlat
claude --channels plugin:fakechat@claude-plugins-official

# 3. Tarayıcıda aç
# http://localhost:8787
```

Tarayıcıda yazdığın mesaj anında Claude Code session'ına ulaşıyor, yanıt ekrana dönüyor. Gerçek akışı görmek için ideal.

## Telegram Kurulumu

### 1. Bot Oluştur

Telegram'da [@BotFather](https://t.me/BotFather)'a git, `/newbot` yaz. Bir isim ver, `bot` ile biten bir kullanıcı adı seç. Token'ı kopyala.

### 2. Plugin Kur

```bash
/plugin install telegram@claude-plugins-official
```

### 3. Token'ı Kaydet

```bash
/telegram:configure <token>
```

Bu, `.claude/channels/telegram/.env` dosyasına kaydeder. İstersen shell'de `TELEGRAM_BOT_TOKEN` environment variable olarak da tanımlayabilirsin.

### 4. Channels Flagiyle Başlat

```bash
claude --channels plugin:telegram@claude-plugins-official
```

### 5. Hesabını Eşleştir

Telegram'da botuna herhangi bir mesaj gönder. Bot sana bir eşleştirme kodu döner. Claude Code terminalinde:

```bash
/telegram:access pair <kod>
```

Ardından güvenlik için allowlist moduna geç:

```bash
/telegram:access policy allowlist
```

Bu noktadan sonra sadece senin hesabın mesaj gönderebilir.

## Discord Kurulumu

### 1. Bot Oluştur

[Discord Developer Portal](https://discord.com/developers/applications)'a gir, **New Application** oluştur. **Bot** sekmesinde token oluştur ve kopyala. **Privileged Gateway Intents** altında **Message Content Intent**'i aktif et.

### 2. Botu Sunucuya Ekle

**OAuth2 → URL Generator** sekmesinde `bot` scope'u seç. Şu izinleri ver:
- View Channels
- Send Messages
- Send Messages in Threads
- Read Message History
- Attach Files
- Add Reactions

Oluşturulan URL ile botu sunucuna ekle.

### 3. Plugin ve Konfigürasyon

```bash
/plugin install discord@claude-plugins-official
/discord:configure <token>
```

### 4. Başlat ve Eşleştir

```bash
claude --channels plugin:discord@claude-plugins-official
```

Discord'da botuna DM at. Bot eşleştirme kodu gönderir.

```bash
/discord:access pair <kod>
/discord:access policy allowlist
```

## Güvenlik Modeli

Her channel plugin'i bir **sender allowlist** tutar. Listede olmayan biri mesaj gönderirse sessizce görmezden gelinir — hata mesajı bile üretilmez.

Önemli bir detay: `.mcp.json`'da kayıtlı olması yetmiyor. Sunucunun `--channels` flagiyle açıkça isimlendirilmesi gerekiyor. Yani config'de tanımlı ama `--channels`'ta belirtilmemişse mesaj gelmiyor.

## Gözetimsiz Kullanım

Session açıkken bir izin dialogu çıkarsa Claude durur, senin onayını bekler. Tamamen gözetimsiz (unattended) kullanmak istiyorsan:

```bash
claude --channels plugin:telegram@claude-plugins-official --dangerously-skip-permissions
```

Bunu sadece güvendiğin, izole ortamlarda kullan.

## Şirkette Kullanıyorsan

Team / Enterprise planlarında channels varsayılan olarak **kapalı**. Yöneticinin şunu yapması lazım:

**claude.ai → Admin settings → Claude Code → Channels → Enable**

Veya managed settings'de `channelsEnabled: true` olarak ayarlamak.

Pro/Max bireysel kullanıcılarda channels zaten açık, sadece `--channels` flagiyle opt-in gerekiyor.

## Neden Önemli?

Claude Code şimdiye kadar terminalden ayrılamayan bir araçtı. Channels ile bu değişiyor. Uzun süren bir build, test suite'i veya analiz işlemi başlatıp telefona geçebilirsin — bitince Telegram'da bildirim alırsın, sorularını oradan sorabilirsin.

Daha güçlü kullanım için Anthropic'in [Channels referans dökümanı](https://code.claude.com/docs/en/channels-reference)na bakabilirsin — kendi channel'ını yazmak da mümkün.
