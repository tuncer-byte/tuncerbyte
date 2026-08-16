---
title: "Claude Fable 5 Neden 18 Gün Boyunca Kullanılamadı? İhracat Kontrolü Krizinin Perde Arkası"
date: "2026-07-01"
excerpt: "Anthropic'in yeni nesil modeli Claude Fable 5, lansmanından sadece üç gün sonra dünya genelinde çevrimdışı kaldı. İşte ihracat kontrolü krizinin baştan sona hikayesi ve modelin nasıl geri döndüğü."
tags: ["Claude Fable 5", "Anthropic", "İhracat Kontrolü", "Yapay Zeka Güvenliği", "Claude Code", "Yapay Zeka Haberleri", "Teknoloji Gündemi"]
category: "Teknoloji"
---

9 Haziran 2026'da Anthropic, "Mythos sınıfı" olarak tanımladığı **Claude Fable 5** ve **Claude Mythos 5**'i büyük bir coşkuyla duyurmuştu. Ama bu coşku uzun sürmedi: model, piyasaya çıkışından sadece üç gün sonra, 12 Haziran'da dünya genelinde erişime kapatıldı ve tam **18 gün** boyunca çevrimdışı kaldı. Bu, bir yapay zeka şirketinin kendi amiral gemisi modelini, ABD hükümetinin ihracat kontrolü kuralları yüzünden tamamen durdurduğu en dramatik örneklerden biri oldu.

![Claude Fable 5 Agentic Kod Geçişi](/images/posts/claude-fable-5-mythos-5/agentic-code.png)

---

## Kriz Nasıl Başladı?

Fable 5'in çevrimdışı kalmasının fitilini ateşleyen olay, **Amazon'un rapor ettiği bir jailbreak** oldu. Amazon'un güvenlik araştırmacıları, doğru şekilde yönlendirildiğinde Fable 5'in gerçek yazılım güvenlik açıklarını **tespit edip somut olarak gösterebildiğini**, hatta en az bir vakada bu açığı kullanan **çalışan bir exploit kodu yazabildiğini** ortaya çıkardı. Normal şartlarda bu, bir modelin savunma amaçlı güvenlik araştırmaları için ne kadar değerli olduğunu gösteren bir yetenekti — ama aynı zamanda kötüye kullanıldığında ciddi bir silah da olabilirdi.

Bu keşif, ABD'nin ihracat kontrolü mevzuatını devreye soktu. Sorun şuydu: Anthropic, Fable 5'i kullanan her bireysel kullanıcının uyruğunu **gerçek zamanlı olarak doğrulayamıyordu**. Kurallar, bu tür gelişmiş siber güvenlik yeteneklerine sahip modellere yabancı uyrukluların erişiminin kısıtlanmasını gerektiriyordu. Anthropic, uyumluluk riskini göze alamayacağını değerlendirerek radikal bir karar aldı: Fable 5 ve Mythos 5'i **dünyadaki herkes için** kapattı — sadece belirli ülkelerdeki kullanıcılar için değil. (İlginç bir ayrıntı: kimi kaynaklarda kesintinin süresi 18, kimilerinde ise başlangıç ve bitiş günleri dahil edilerek 19 gün olarak geçiyor — Anthropic'in resmi zaman çizelgesi 12 Haziran akşamından 1 Temmuz'a kadar süren bir kesintiyi tarif ediyor.)

## Claude Code Kullanıcıları Ne Yaşadı?

Fable 5'i günlük iş akışına entegre etmiş geliştiriciler için bu ani kesinti büyük bir şoktu. Claude Code, model erişimi kesilir kesilmez otomatik olarak bir önceki nesil model olan **Claude Opus 4.8**'e geri döndü. Bu, iş sürekliliğini korumak için önemli bir yumuşak iniş sağladı, ama yine de Fable 5'in sunduğu ekstra kapasiteye alışmış ekipler için gözle görülür bir performans kaybı anlamına geliyordu.

18 gün boyunca sektör, "acaba model hiç geri dönmeyecek mi" sorusunu tartıştı. Bazı analistler bunu, hızla ilerleyen yapay zeka yeteneklerinin düzenleyici çerçevelerin önüne geçtiğinin bir kanıtı olarak yorumladı.

![Claude Fable 5 Benchmark Karşılaştırmaları](/images/posts/claude-fable-5-mythos-5/benchmarks.png)

---

## Çözüm: 30 Haziran'da İhracat Kontrolü Kaldırıldı

ABD Ticaret Bakanlığı, 30 Haziran 2026'da ihracat kontrolü kararını kaldırdı. Anthropic, ertesi gün — **1 Temmuz 2026**'da — Fable 5 ve Mythos 5'i dünya genelinde yeniden kullanıma açtı. Ancak bu geri dönüş, krizden önceki haline basit bir "eski haline getirme" değildi. Anthropic üç önemli değişiklik yaptı:

*   **Yeni bir sınıflandırıcı** devreye alındı. Bu sistem, Amazon'un tespit ettiği spesifik jailbreak yöntemini **%99'un üzerinde bir oranda** engelliyor.
*   **Güvenlik araştırma ekibi ikiye katlandı.** Anthropic, benzer risklerin gelecekte daha hızlı tespit edilip kapatılabilmesi için bu alana ciddi yatırım yaptığını açıkladı.
*   **Sektöre yönelik yeni bir "jailbreak şiddet çerçevesi"** duyuruldu — modellerin ne tür güvenlik açıklarını hangi koşullarda gösterebileceğini sınıflandıran bir sistem.

Aynı gün Anthropic, ilgisiz görünse de aslında güven inşa etme stratejisinin bir parçası olan başka bir duyuru daha yaptı: **Claude Voice Mode** güncellemesi. Sesli asistan artık Opus, Sonnet veya Haiku üzerinde çalışabiliyor, konuşma sırasında Gmail, Slack ve Canva'ya bağlanabiliyor ve 11 dilde hizmet verebiliyor.

---

## CJS Çerçevesi: Sektörün İlk Ortak "Jailbreak Şiddet" Standardı

Anthropic'in 30 Haziran'da bahsettiği "jailbreak şiddet çerçevesi", 2 Temmuz 2026'da somut bir isimle kamuoyuna sunuldu: **Cyber Jailbreak Severity (CJS) Framework**. Bu çerçeve, Anthropic'in tek başına değil, **Amazon, Microsoft ve Google** ile birlikte geliştirdiği, sektör çapında ortak bir standart olması hedeflenen bir sistem.

CJS, bir jailbreak'in ne kadar tehlikeli olduğunu **CJS-0'dan CJS-4'e** kadar beş kademeli, üstel bir ölçekte derecelendiriyor. Değerlendirme dört eksen üzerinden yapılıyor:

*   **Yetenek kazancı (capability gain)** — jailbreak, kullanıcıyı mevcut araçların ne kadar ötesine taşıyor?
*   **Yetenek kazancının genişliği (breadth)** — kaç farklı saldırı görevini açığa çıkarıyor?
*   **Silahlandırma kolaylığı (ease of weaponization)** — bu yeteneği gerçek bir saldırıya dönüştürmek ne kadar kolay?
*   **Keşfedilebilirlik (discoverability)** — bu jailbreak yöntemini başka birinin bağımsız olarak bulması ne kadar olası?

Bu ortak standardın kabul görmesi, gelecekte benzer bir olayın Anthropic'i değil de OpenAI, Google veya bir başka sağlayıcıyı vurması durumunda, sektörün "her seferinde sıfırdan panik" yerine ortak bir dille ve ortak bir hız/şiddet değerlendirmesiyle hareket edebileceği anlamına geliyor. Anthropic ayrıca, güvenlik araştırmacılarının benzer açıkları sorumlu şekilde bildirebilmesi için **HackerOne üzerinden özel bir program** başlattığını duyurdu — amaç, bir sonraki jailbreak'in bir güvenlik araştırmacısı tarafından kontrollü şekilde bulunup bildirilmesini, kamuya sızıp bir krize dönüşmesinden daha olası hale getirmek.

---

## Bu Kriz Neden Önemli?

Fable 5 vakası, yapay zeka sektöründe yeni bir gerçekliğin habercisi oldu: **modeller belirli bir yetenek eşiğini geçtiğinde, devletler artık doğrudan müdahale ediyor.** Bu, sadece Anthropic'e özgü bir durum değildi — birkaç hafta sonra OpenAI'nin GPT-5.6 modeli de benzer bir hükümet incelemesinden geçmek zorunda kalacaktı.

Girişimler ve kurumsal kullanıcılar için çıkarılacak ders açık: tek bir modele aşırı bağımlı olmak, düzenleyici bir kararla bir gecede ortadan kalkabilecek bir risk taşıyor. Anthropic'in Claude Code'u otomatik olarak Opus 4.8'e yönlendirmesi, bu riskin en azından kısmen nasıl yönetilebileceğine dair iyi bir örnek oldu.

Fable 5 şu anda tam kapasiteyle ve önceki güvenlik açıklarına karşı güçlendirilmiş şekilde hizmet veriyor — ama bu 18 günlük kesinti, yapay zeka endüstrisinin artık teknoloji kadar jeopolitik bir mesele olduğunu bir kez daha gösterdi.
