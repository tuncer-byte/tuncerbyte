---
title: "Başarılı Bir Rate Limiting Nasıl Kurgulanmalı?"
date: "2026-04-10"
excerpt: "Rate limiting nedir, hangi algoritmalar var ve hangisi sizin sisteminize uyar? Token Bucket'tan Sliding Window Log'a dört temel yaklaşım, fark ve trade-off'larıyla."
tags: ["Rate Limiting", "Backend", "Sistem Tasarımı", "Token Bucket", "Leaky Bucket", "Fixed Window", "Sliding Window", "API Güvenlik", "Mikroservis", "Yazılım Mimarisi"]
category: "Teknoloji"
---

Herkese merhaba,

![Rate Limiting Nedir?](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*GxVgJlmXB4k7iplu0wxoEw.png)

Son zamanlarda kod yazma kısmından uzaklaşıp bakış açımı genişletmeye yöneldim, bu kapsamda bildiklerimi ve deneyimlerimi parça parça aktarmak istiyorum. Bugünkü konumuz **rate limiting** — temelde herkesin az çok aşina olduğu bir yapı. Ne var ki bu konuda niye uzun uzadıya yazı yazdın derseniz biraz bekleyin.

Sistemlerde kimi zaman dakikalar içinde onlarca istek geliyor. Bunların kimisi doğal ve olağan, kimisi ise kötü niyetli kullanıcıların sistemi yormak için yaptığı istekler. Buna karşı alınabilecek önlemlerden biri de rate limit eklemek.

**Rate limit nedir?** Basitçe: x kullanıcısının sisteminize y zaman aralığında maksimum kadar istek atabilmesini sağlayan bir savunma mekanizması.

## Rate Limiting Her Sistemde Aynı Şekilde mi Kurgulanmalı?

Temel kısmı geçtik. Gelelim asıl soruya.

Her sistemin dinamikleri ve iç yapıları farklıdır. Kimi sistem binlerce isteğe günlerce izin verirken, kimi sistem dakikalar içinde bile istek sayısını kısıtlamak zorunda kalabilir. Sistemi geçtim — sistem içindeki mikro-servislerde bile bu yaklaşımlar farklılık gösterebilir ve göstermelidir.

Şimdi bunu somut bir senaryo ile ele alalım.

---

## Senaryo: Bir Bankanın Mikroservis Mimarisi

![Rate Limiting Senaryoları](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ndRwu4sBzJ4SZjRwdrnAsg.jpeg)

Diyelim ki bir bankada çalışıyorsunuz ve bankanızın temeli mikroservis mimarisine dayanıyor (inşallah). Birbirinden bağımsız servisleriniz var: kullanıcılar için giriş, dashboard, aktivite servisleri; altyapı tarafında loglama, monitoring, operasyonel işlemler ve benzerleri.

Şimdi bu sisteme rate limiting stratejisi kuralım. İlk durağımız Token Bucket Algoritması.

---

## 1. Token Bucket Algoritması

![Token Bucket Algoritması](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*CE5Cx7VxTfKImFPUANAvxQ.png)

Bu, anam babam usulü rate limiting yaklaşımı desem yeri var. Herkesin isteyerek ya da istemeyerek (AI yönlendirmesiyle) kimi zaman best practice, kimi zaman bad practice olarak uyguladığı bir yaklaşım.

Temeldeki mantık: **"Tuncer bu sisteme 1 dakika içinde 20 istek atabilir."**

Ben sisteme 10 istek attıktan sonra 10 hakkım kalır. Yeni bir dakikaya geçince hakkım otomatik olarak tekrar 20'ye çıkar. Kurgusu basit — herhangi bir araştırmayla ya da bir AI yardımıyla kolayca hayata geçirebilirsiniz. Spike'ları da kendi içinde absorbe eder (iyi mi kötü mü — ayrı tartışma konusu).

### Token Bucket Her Sisteme Uygun mu?

Pek değil.

Her servise aynı mantığı kurgularsak, örneğin loglama servisimizde de Token Bucket kullanırsak — x sisteminde spike olabilir diye log yapısına da harici bir yük bindirmiş oluruz. Kar-zarar dengesini kurmak burada kritik.

Sıradaki algoritmamız: **Leaky Bucket**.

---

## 2. Leaky Bucket Algoritması

![Leaky Bucket Algoritması](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZCdlRixKbZg2d_H2RksEPw.png)

Elimizde bir kova olsun, altına çiviyle bir delik açalım ve kovaya su doldurmaya başlayalım. Belirli bir noktadan sonra ben ne kadar su eklersem ekleyeyim — çivideki delikten damlayan su miktarı hep sabit kalacak.

Bunu yazılıma taşıyalım:

- **Kova** → sabit boyutlu kuyruk (queue)
- **Kovaya dökülen su** → uygulamadan gelen istekler / log mesajları
- **Çivideki delik** → sabit hızda kuyruğu tüketen consumer servisler
- **Taşan su** → kuyruk dolunca reddedilen fazla istekler

Örneğimize dönelim. Uygulamamıza 10x spike geldi, log satırı sayısı da 10 katına çıktı. Token Bucket bu spike'a "tamam geç" dedi ve ElasticSearch'ü bunalttı.

Leaky Bucket ne yapar?

> "Kaç istek gelirse gelsin, ben ElasticSearch'e sabit hızda yazarım. Kuyruk doluysa yeni logları reddederim."

Yani kova ne kadar hızlı doldurulursa doldurulsun, alttan akan su hep aynı hızda akar.

### Reddedilen Loglar Ne Olur?

![Log Önceliklendirme](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*5EvfNcTi90LkTEcx.png)

Gerçek sistemler burada akıllı davranır:

- `ERROR` / `WARN` logları → öncelikli, her zaman kuyruğa alınır
- `INFO` / `DEBUG` logları → kuyruk dolunca ilk atılan bunlar olur

Kritik bilgiyi kaybetmeden sistemi korumuş olursunuz.

---

## 3. Fixed Window (Sabit Pencere) Algoritması

Bankacılık sektöründe bazı işlemler katı kurallarla sınırlıdır: aylık maksimum 300.000 TL transfer veya günde maksimum 5 EFT isteği gibi. 5'ten fazla EFT talebi oluşturulmaması ve bu servisin gereksiz yere meşgul edilmemesi gerekir. İşte burada Fixed Window devreye girer.

### Fixed Window Nasıl Çalışır?

- Zaman eşit süreli pencerelere bölünür (saat, gün, ay, yıl)
- Her pencerede kaynak erişim sayısı sayılır
- Limit aşılırsa → o pencere boyunca ek istekler reddedilir
- Yeni pencere başladığında sayaç sıfırlanır

![Fixed Window Algoritması](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*eHo1xVUXCAZ6ky94y3hkdw.png)

### Fixed Window'un Güvenlik Açığı Nedir?

Burada ufak ama önemli bir zafiyet var.

Diyelim ki günlük 100 TL transferi limitli para transferi API'niz var. Uyanık bir kullanıcı gece **23:59'da** bir istek atıyor, hemen ardından **00:01'de** bir istek daha. Neden geçiyor? Çünkü Fixed Window algoritması gün bitti görür ve yeni gün başladığı için hak sıfırlanır.

2 dakikada limit 2 kez aşılmış olur. Buna **boundary exploitation** denir.

Developer yiğitler bu soruna karşı da bir çözüm geliştirmiş tabii.

---

## 4. Sliding Window Log Algoritması

Bu algoritmanın mantığı şu: Bir işlemi x zaman aralığında y kadar yapabilecek şekilde tanımlandıysan, x penceresi sürekli "sliding" yaparak kendini öteliyor.

Türkçesiyle: **Günlük 100 TL atma limitin varsa ve bunu saat 16:00'da kullandıysan, o limitin sıfırlanma süresi bir sonraki gün saat 16:00'dır.** Gece yarısı değil. Bu sayede gerçekten bir günlük boşluk oluşur ve boundary exploitation mümkün olmaz.

### Sliding Window Log'un Dezavantajı Nedir?

Bu yöntem %100 doğruluk sunar — ama her güzelin bir kusuru vardır.

%100 doğruluk sağlamak için sistem, işlem bilgisiyle birlikte `transaction-date` değerini de bünyesinde tutmak zorundadır. Her işlemde fazladan bir veri saklanır. Küçük ölçekte önemsiz görünen bu maliyet, 1 milyon, 10 milyon, 100 milyon işlemde devasa boyutlara ulaşabilir.

---

## Hangi Rate Limiting Algoritmasını Seçmeli?

Bunlar dışında da rate limiting taktikleri ve yaklaşımları bulunuyor. Burada önemli olan ihtiyacı iyi analiz edip sisteme uygun bir yapı kurmak.

"Bu bayağı iyiymiş, bu fena, uçarız kaçarız" demek yerine — "buna ihtiyacımız var, o yüzden kullanalım" diyebilmek mühendisliktir.

| Algoritma | Uygulama | Spike Toleransı | Doğruluk | Bellek Maliyeti |
|---|---|---|---|---|
| Token Bucket | ✅ Kolay | ✅ Yüksek | Orta | Düşük |
| Leaky Bucket | Orta | ❌ Yok | Orta | Düşük |
| Fixed Window | ✅ Kolay | Orta | ⚠️ Düşük | Düşük |
| Sliding Window Log | Zor | Orta | ✅ Yüksek | ⚠️ Yüksek |

Bir sonraki yazıda görüşmek üzere.
