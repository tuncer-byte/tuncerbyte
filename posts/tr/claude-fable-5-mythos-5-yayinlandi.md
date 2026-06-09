---
title: "Claude Fable 5 ve Claude Mythos 5: Mythos Sınıfı Modellerle Yapay Zekada Yeni Eşik"
date: "2026-06-09"
excerpt: "Anthropic, bugüne kadarki en güçlü modelleri olan Claude Fable 5 ve Mythos 5'i duyurdu. 50 milyon satırlık kod göçü, vision tabanlı Pokémon başarısı ve bilimsel keşiflerde devrim niteliğinde yetenekler."
tags: ["Claude", "Claude Fable 5", "Claude Mythos 5", "Anthropic", "Yapay Zeka", "AI Agent", "LLM", "Yazılım Geliştirme", "Bilimsel Araştırma"]
category: "Teknoloji"
---

9 Haziran 2026. Bugün, genel kullanım için güvenli hale getirdiğimiz ilk **Mythos sınıfı** modelimiz olan **Claude Fable 5**'i kullanıma sunuyoruz.

Fable 5'in yetenekleri, şimdiye kadar genel erişime açtığımız tüm modellerin ötesine geçiyor. Yazılım mühendisliği, bilgi işçiliği, görüntü işleme (vision), bilimsel araştırma ve daha birçok alanda test edilen neredeyse tüm benchmark'larda dünya lideri (state-of-the-art) performans sergiliyor. Görev ne kadar uzun ve karmaşık olursa, Fable 5'in diğer modellerimize olan üstünlüğü o kadar artıyor.

![Claude 5 Kelebekleri](/images/posts/claude-fable-5-mythos-5/hero.webp)

## Güvenlik ve Koruma Önlemleri

Bu denli yetenekli bir modeli piyasaya sürmek belirli riskleri de beraberinde getiriyor. Koruma önlemleri olmasaydı, Fable 5'in siber güvenlik gibi alanlardaki yetenekleri ciddi zararlara yol açabilecek şekilde kötüye kullanılabilirdi. Bu nedenle, modeli koruma kalkanlarıyla birlikte yayına aldık. Bazı hassas konulardaki sorgular, Fable 5 yerine bir alt seviyedeki en güçlü modelimiz olan **Claude Opus 4.8** tarafından yanıtlanacaktır.

Bu koruma önlemlerini, modeli hem güvenli hem de hızlı bir şekilde sunabilmek adına başlangıçta muhafazakar bir şekilde yapılandırdık. Bu durum bazen zararsız isteklerin de engellenmesine neden olabilir (oturumların ortalama %5'inden azında tetiklenmektedir). Önümüzdeki aylarda daha güçlü modeller geldikçe bu korumaları geliştirmeye ve hatalı engellemeleri (false positive) azaltmaya devam edeceğiz.

## Claude Mythos 5 ve Project Glasswing

Küçük bir siber savunma ve altyapı sağlayıcısı grubu için **Claude Mythos 5**'i de duyuruyoruz. Bu model, Fable 5 ile aynı temel mimariye sahip olsa da, belirli alanlardaki koruma sınırları esnetilmiştir. Mythos 5, başlangıçta ABD hükümetiyle iş birliği içinde yürütülen **Project Glasswing** aracılığıyla, Mythos Preview sürümünün bir üst versiyonu olarak sunulacaktır. Dünyadaki en güçlü siber güvenlik yeteneklerine sahip olan bu modele erişimi yakında daha geniş bir güvenilir erişim programı ile genişletmeyi planlıyoruz.

---

## Claude Fable 5 ve Mythos 5 Değerlendirmesi

Aşağıdaki tablo, Fable 5 ve Mythos 5'in yeteneklerini diğer lider modellerle karşılaştırmaktadır:

![Benchmark Tablosu](/images/posts/claude-fable-5-mythos-5/benchmarks.webp)

Fable 5 ve Mythos 5, önceki tüm Claude modellerinden daha uzun süre otonom (bağımsız) çalışabilir. İşte öne çıkan alanlar:

### Yazılım Mühendisliği
Erken test aşamasında **Stripe**, Fable 5'in aylar süren mühendislik işlerini günlere indirdiğini raporladı. 50 milyon satırlık bir Ruby kod tabanında, bir ekibin elle yapması iki aydan fazla sürecek olan kod göçü (migration) işlemini model sadece bir günde tamamladı. Ayrıca Fable 5, önceki modellere göre daha token-verimlidir.

### Bilgi İşçiliği ve Analiz
Fable 5, karmaşık analitik görevlerde çok güçlü bir performans sergiliyor. **Hebbia’nın Finans Benchmark** testinde, kıdemli düzeyde muhakeme, doküman tabanlı akıl yürütme, grafik/tablo yorumlama ve problem çözme alanlarında en yüksek skoru elde etti. **IMC**, modelin finansal analiz testlerinde (kök neden analizi, beklenen değer analizi vb.) neredeyse her alanda tam puan aldığını belirtti.

### Vision (Görüntü İşleme) ve Pokémon Deneyi
Fable 5, görüntüleme içeren görevlerde yeni liderdir. Karmaşık bilimsel şekillerden hassas veriler çıkarabilir ve sadece ekran görüntülerinden bir web uygulamasının kaynak kodunu yeniden inşa edebilir.

En dikkat çekici örneklerden biri: Önceki modeller *Pokémon FireRed* oyununu oynamakta zorlanırken, Fable 5 herhangi bir harita veya navigasyon yardımı olmadan, sadece ham ekran görüntülerini izleyerek oyunu baştan sona bitirmeyi başardı.

### Bellek ve Uzun Bağlam
Fable 5, milyonlarca token boyunca odağını koruyabilir ve kendi notlarını kullanarak çıktılarını iyileştirebilir. *Slay the Spire* oyununda yapılan testlerde, kalıcı dosya tabanlı bellek kullanımı sayesinde modelin performansı Opus 4.8'e göre üç kat artmıştır.

---

## Yaşam Bilimleri ve Bilimsel Keşifler

Mythos 5'in yetenekleri bilim dünyasında yeni bir çığır açıyor:

*   **İlaç Tasarımı:** Dahili protein tasarım uzmanlarımız, Mythos 5 kullanarak ilaç tasarım sürecinin belirli aşamalarını yaklaşık 10 kat hızlandırdı. Model; bağlanma bölgelerini seçme, tasarım araçlarını çalıştırma ve hatalardan ders çıkarma gibi bilim insanlarının yaptığı tüm görevleri otonom olarak yerine getirebiliyor.
*   **Moleküler Biyolojide Yeni Hipotezler:** Mythos 5, tutarlı bir şekilde özgün bilimsel hipotezler üretebilen ilk modelimizdir. Uzmanlarımız, Mythos'un hipotezlerini Opus sınıfı modellere göre %80 oranında daha başarılı bulmuştur. Hatta bir Mythos hipotezi, bağımsız bir laboratuvarın çalışmasıyla doğrulanmıştır.
*   **Genomik Araştırmalar:** Mythos 5, bir haftadan fazla süren otonom çalışma ile 138 hayvan türüne ait milyonlarca hücre verisini bir araya getirdi ve hücreleri tanımlamak için özel bir makine öğrenmesi modeli eğitti. Mythos 5 tarafından eğitilen bu model, *Science* dergisinde yayınlanan güncel bir modelden (100 kat daha küçük olmasına rağmen) daha iyi performans gösterdi.

---

## Güvenlik Sınıflandırıcıları ve "Fallback" Mekanizması

Fable 5, kötüye kullanımı önlemek için yeni nesil yapay zeka sınıflandırıcıları ile donatılmıştır:

1.  **Siber Güvenlik:** Modelin yazılım açıklarını bulma ve siber saldırı planlama yetenekleri, bu sınıflandırıcılar tarafından izlenir.
2.  **Biyoloji ve Kimya:** Tehlikeli biyolojik araştırmalarda "uplift" (kolaylaştırıcı etki) yaratabilecek sorgular engellenir. Özellikle Dyno Therapeutics tarafından geliştirilen adeno-associated virus (AAV) tasarımı gibi çift kullanımlı (hem tedavi hem risk içeren) alanlarda hassas korumalar devrededir.
3.  **Damıtma (Distillation):** Fable 5'in yeteneklerinin başka modelleri eğitmek için çalınmasına yönelik girişimler tespit edilir.

**Önemli:** Sınıflandırıcılar bir risk tespit ettiğinde, sistem otomatik olarak **Claude Opus 4.8** modeline geçiş yapar. Kullanıcılar bu durum hakkında bilgilendirilir. Verilerimize göre oturumların %95'inden fazlasında herhangi bir geçiş (fallback) yaşanmamaktadır.

---

## Fiyatlandırma ve Erişilebilirlik

*   **Fiyat:** Milyon girdi tokenı başına 10 dolar, milyon çıktı tokenı başına 50 dolar (Mythos Preview fiyatının yarısından az).
*   **Claude API:** Geliştiriciler bugünden itibaren `claude-fable-5` modelini kullanabilirler.
*   **Abonelik Planları:** Fable 5; Pro, Max, Team ve Enterprise planlarına **22 Haziran 2026** tarihine kadar ek ücret ödemeden dahil edilmiştir. 23 Haziran'dan itibaren bu planlarda kullanım kredisi gerekecektir (kapasiteye göre bu süre uzatılabilir).

Anthropic olarak, gelişmiş yapay zeka yeteneklerini olabildiğince hızlı ve güvenli bir şekilde tüm dünyaya ulaştırma yolunda bir adım daha atmış bulunuyoruz.
