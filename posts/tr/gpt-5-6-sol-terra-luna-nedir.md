---
title: "GPT-5.6 Nedir? Sol, Terra ve Luna: OpenAI'nin Beyaz Saray Onayından Geçen Model Ailesi"
date: "2026-07-09"
excerpt: "OpenAI'nin yeni model ailesi GPT-5.6, piyasaya çıkmadan önce Beyaz Saray'ın incelemesinden geçen ilk model oldu. Sol, Terra ve Luna arasındaki farklar ve genel kullanıma açılış süreci."
tags: ["GPT-5.6", "OpenAI", "ChatGPT", "Codex", "GitHub Copilot", "Yapay Zeka Haberleri", "LLM"]
category: "Teknoloji"
---

OpenAI'nin yeni model ailesi **GPT-5.6**, 9 Temmuz 2026'da ChatGPT, API, Codex ve GitHub Copilot üzerinden genel kullanıma açıldı. Ama bu modelin hikayesi, sıradan bir lansmandan çok daha ilginç bir yerden başlıyor: piyasaya çıkmadan önce **Beyaz Saray'ın incelemesinden geçmesi gereken ilk yapay zeka modeli** oldu.

![OpenAI](https://upload.wikimedia.org/wikipedia/commons/a/af/OpenAI_logo_2025_%28wordmark%29.svg)

---

## Önce Hükümet, Sonra Halk

GPT-5.6'nın hikayesi 26 Haziran 2026'da başlıyor. OpenAI, modeli o gün **sadece hükümet tarafından onaylanmış ortaklara** sınırlı bir önizleme olarak sundu. Bu talep, Beyaz Saray'ın **Ulusal Siber Direktörlüğü Ofisi** ve **Bilim ve Teknoloji Politikası Ofisi**'nden geldi; gerekçe ise modelin gelişmiş siber güvenlik yetenekleriydi.

Bu, ABD hükümetinin bir Amerikan yapay zeka şirketinden — nominal olarak gönüllülük esasına dayansa da — bir modelin lansmanını piyasaya çıkmadan önce sınırlamasını istediği **ilk örnek** oldu. 12 günlük bu "kapalı kapı" testinin ardından, 9 Temmuz'da model genel kullanıma açıldı.

## Üç Model, Üç Farklı İhtiyaç

GPT-5.6, tek bir model değil, üç farklı katmandan oluşan bir aile olarak geldi:

*   **Sol** — Amiral gemi model. En yüksek performansı sunuyor ve Cerebras donanımı üzerinde saniyede **750 token** hızına ulaşabiliyor. En yoğun akıl yürütme ve kodlama görevleri için tasarlandı.
*   **Terra** — Günlük kullanım için dengelenmiş orta seviye model. Çoğu iş akışı için yeterli performansı makul bir maliyetle sunuyor.
*   **Luna** — En uygun maliyetli, hafif seçenek. Yüksek hacimli, basit görevler için optimize edildi.

Bu üçlü yapı, OpenAI'nin artık tek bir "en iyi model" stratejisinden, kullanım senaryosuna göre fiyat/performans seçimi sunan bir portföy stratejisine geçtiğinin açık bir göstergesi.

---

## Benchmark Sonuçları: Sol Gerçekten Ne Kadar İyi?

OpenAI'nin iddiaları güçlü ama benchmark tablosu biraz daha karmaşık bir tablo çiziyor:

*   **Artificial Analysis Coding Agent Index**'te Sol, maksimum akıl yürütme modunda **80 puanla** yeni bir rekor kırdı — bu, Claude Fable 5'in üzerinde **2,8 puan** anlamına geliyor.
*   Ama **SWE-bench Pro**'da Sol sadece **%64,6** skorladı — bu, aynı dönemdeki diğer öncü modellerin gerisinde kalan bir sonuç. Yani Sol her benchmark'ta lider değil; güçlü olduğu alanlar ile zayıf kaldığı alanlar arasında belirgin bir fark var.
*   **ARC-AGI** testlerinde ilginç bir hikaye yaşandı: Sol, lansmanının hemen ardından bu görsel akıl yürütme testinde beklenenden düşük performans gösterdi. OpenAI araştırma ekibi sorunu inceledi ve modelin kullandığı "harness"in (çalışma iskeletinin) önceki öğrendiklerini hatırlamasına izin vermediğini keşfetti. İki API ayarını etkinleştirerek (bağlamı koruma ve sıkıştırma) skorları **üç katına**, kullanılan çıktı token sayısını ise **6 kat azaltmayı** başardılar. Bu düzeltmenin ardından Sol, ARC-AGI-3'te **%29,3**, ARC-AGI-2'de ise **%92,5** skoruna ulaştı ve bir ARC-AGI-3 halka açık oyununu kazanan ilk model oldu.

Bu detay aslında önemli bir dersi gösteriyor: modern öncü modellerin ham zekası kadar, onları çalıştıran "harness" ve API ayarları da nihai performansı büyük ölçüde belirliyor.

---

## Neden Önemli?

GPT-5.6'nın hükümet incelemesi süreci, yaz boyunca tekrar eden bir örüntünün ilk halkalarından biri oldu. Birkaç hafta önce Anthropic'in Claude Fable 5'i ihracat kontrolü nedeniyle 18 gün çevrimdışı kalmıştı; şimdi OpenAI, modelini piyasaya sürmeden önce benzer bir denetimden geçiyordu. Bu iki olay birlikte, sektörde yeni bir normun oluştuğunu gösteriyor: **belirli bir yetenek eşiğini geçen modeller, artık rutin olarak devlet incelemesinden geçiyor.**

GPT-5.6, ChatGPT, API, Codex ve GitHub Copilot entegrasyonlarıyla geniş bir kullanıcı kitlesine ulaştı ve aynı hafta piyasaya çıkan Meta'nın Muse Spark 1.1'i ile birlikte, 2026 yazının en yoğun model lansmanı haftalarından birini oluşturdu.
