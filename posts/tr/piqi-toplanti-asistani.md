---
title: "Piqi: Toplantıda Ürün Sorularına Kaynaklı Cevap Veren macOS Asistanı"
date: "2026-10-17"
excerpt: "Müşteri toplantısında gelen teknik soruya, kendi dokümanlarından ve kodundan, kaynağıyla birlikte saniyeler içinde cevap hazırlayan açık kaynak macOS uygulamasını neden ve nasıl yaptım."
tags: ["Piqi", "macOS", "Yapay Zeka", "RAG", "Toplantı Asistanı", "Açık Kaynak"]
category: "Proje"
---

Müşteri toplantısındasın. Karşı taraf soruyor: "API'nizde rate limit kaç, aşılırsa ne oluyor?" Cevap bir yerlerde var: API dokümanının 14. sayfasında, bir Confluence sayfasında ya da doğrudan kodda. Ama o an aramaya başlarsan toplantının akışı kopuyor; "dönüp size yazarım" dersen de güven kaybediyorsun.

**Piqi** bu an için yaptığım bir macOS uygulaması. Toplantıyı dinliyor, ürünle ilgili bir soru geldiğinde kendi bilgi havuzunda arıyor ve kısa cevabı, kaynağıyla birlikte ekranın üstündeki küçük bir panelde gösteriyor. Cevabı sen veriyorsun; Piqi toplantıya katılan bir bot değil, sadece sana yardım ediyor.

![Piqi Island: yazılan bir soruya onaylı cevaptan, kaynağıyla birlikte akan cevap](/images/posts/piqi/island-ask.webp)

Uygulama açık kaynak: [github.com/tuncer-byte/piqi](https://github.com/tuncer-byte/piqi). Bu yazıda nasıl çalıştığını ve neden böyle tasarladığımı anlatıyorum.

## Nasıl çalışıyor

![Piqi toplantıda bir soruyu nasıl cevaplar: toplantı sesi, yazıya dökme, soru algılama, yerel arama, kaynaklı cevap ya da doküman eksiği](/images/posts/piqi/tr/piqi-how-it-works.svg)

1. **Toplantıyı algılar.** Teams, Zoom, Webex, Slack, FaceTime ya da tarayıcıdaki bir görüşme mikrofonu açtığında Piqi bunu fark ediyor ve dinlemeye başlamak isteyip istemediğini soruyor (istersen kendiliğinden başlatıyor). Bunun için ekran kaydı izni ya da pencere başlığı gerekmiyor; macOS'un hangi uygulamanın mikrofonu kullandığını söyleyen ses süreci bilgisi yetiyor. Görüşme bitince dinleme de duruyor.
2. **Sesi Mac'te yazıya döker.** Senin sesin ve karşı tarafın sesi iki ayrı kanal olarak alınıyor; konuşma tanıma Apple'ın cihaz üzerindeki motoruyla çalışıyor. Ham ses Mac'ten çıkmıyor, diske de yazılmıyor. Karşı tarafta kaç kişi konuştuğu da cihaz üzerinde ayırt ediliyor.
3. **Soruyu yerelde algılar.** Karşı tarafın her cümlesi model çağrılmadan inceleniyor. "Beni duyuyor musunuz?" ya da "Ekranımı görebiliyor musunuz?" gibi cümleler atlanıyor; boşuna token harcanmıyor ve panel boşuna açılmıyor.
4. **Bilgi havuzunda arar.** Arama tamamen yerel: SQLite FTS5 üzerinde BM25, ardından sorudaki kavramların ne kadarını karşıladığına göre yeniden sıralama. "Hız sınırı" ile "rate limit" aynı kavram sayılıyor; Türkçe soru İngilizce dokümanı ya da kodu bulabiliyor.
5. **Kaynaklı cevap hazırlar ya da susar.** Güçlü bir kaynak varsa seçtiğin model kısa bir cevap yazıyor ve Island'da kaynağıyla birlikte gösteriliyor. Kaynakta karşılığı yoksa Piqi model çağırmıyor; soruyu "Doküman eksikleri" listesine yazıyor.

## Bilgi havuzu: doküman, kod ve görsel

Piqi'nin cevapları yalnızca senin eklediğin kaynaklar kadar iyi. Bu yüzden kaynak eklemeyi olabildiğince kolay tuttum: PDF, DOCX, PPTX, XLSX, Markdown, HTML, kod reposu (yerel klasör ya da Git adresi), web sayfası, Confluence, Notion ve onaylı soru-cevaplar.

![Kod reposu ekleme: algılanan klasörler, kategorileri, dil dağılımı ve tahmini parça sayısı](/images/posts/piqi/add-code.png)

Kod reposu eklerken Piqi klasör ağacını tarıyor, `.gitignore`'a uyuyor ve klasörleri kaynak kod, doküman, test gibi kategorilere ayırıyor. Kod, fonksiyon ve sınıf sınırlarından parçalanıyor; böylece cevapta "src/auth/RateLimiter.ts:42" gibi satırına kadar kaynak gösterilebiliyor.

**Görseller** de kaynak olabiliyor: mimari diyagramlar, ekran görüntüleri, grafikler, fotoğrafı çekilmiş tablolar. Görsel önce küçültülüyor, sonra seçtiğin model içindeki metni, bileşenleri ve aralarındaki ilişkileri, grafik değerlerini yazıya döküyor. Çıkan metin diğer belgeler gibi aranabiliyor ve görsel değişmedikçe yeniden analiz edilmiyor.

![Kaynaklar ekranı: dokümanlar, kod reposu ve onaylı cevaplar](/images/posts/piqi/sources.png)

## Hız ve token: modele ne kadar az gönderirsen o kadar hızlı

Toplantıda cevabın birkaç saniye geç gelmesi bile işe yaramaz hale getiriyor. Gecikmenin ve maliyetin büyük kısmı da modele gönderilen bağlamdan geliyor. Bu yüzden arama katmanında üç şey yaptım:

- **Zayıf eşleşmeleri eliyorum.** En iyi sonuca göre zayıf kalan parçalar modele hiç gitmiyor. Eskiden her soruda sabit 6 parça gidiyordu; şimdi ortalama 3,7.
- **Parçanın ilgili kısmını gönderiyorum.** Parçanın ilk N karakteri yerine, soruyla en çok örtüşen kesiti seçiyorum; kodda sınıf ya da fonksiyon imzası da korunuyor.
- **Cevap türüne göre bütçe koyuyorum.** Sesli kısa cevap, yazılı kısa cevap ve detaylı cevap için ayrı karakter sınırları var.

Projenin kendi dokümanları ve koduyla yaptığım ölçümde, soru başına modele giden kaynak metni yaklaşık 7.400 karakterden 3.400 karaktere indi.

## Öğrenen döngü

![Öğrenen döngü: karşı tarafın sorusu, doküman eksikleri, onaylı cevap ve bir dahaki sefere anında cevap](/images/posts/piqi/tr/piqi-learning-loop.svg)

Bence Piqi'nin en değerli kısmı bu. Kaynakta karşılığı olmayan, kaynaksız cevaplanan ya da olumsuz geri bildirim alan her soru "Doküman eksikleri" sayfasında toplanıyor; hangisinin kaç kez sorulduğu da görünüyor. Oradan bir kez onaylı cevap yazınca soru SSS'ye ekleniyor. Island'da beğendiğin bir cevabı da tek tıkla SSS'ye ekleyebiliyorsun.

Aynı soru bir dahaki sefere geldiğinde Piqi model çağırmıyor: onaylı cevabı anında gösteriyor. Yani ekip ne kadar çok toplantı yaparsa Piqi o kadar hızlı ve o kadar ucuz hale geliyor.

## Toplantıdan sonra

Dinleme bitince toplantı, Toplantılar sayfasına kaydediliyor: transkript ve Piqi'nin toplantı sırasında hazırladığı cevaplar. Seçtiğin model de bir özet çıkarıyor: kısa bir genel bakış, alınan kararlar, kimin ne yapacağı, cevaplanamayan sorular ve karşı tarafa gönderebileceğin bir takip e-postası taslağı. Kayıtlar yalnızca bu Mac'te tutuluyor ve seçtiğin süre (7, 30 ya da 90 gün) dolunca siliniyor.

## Gizlilik ve kurumsal kullanım

Piqi'yi bankacılık gibi veri hassasiyeti yüksek ortamları düşünerek tasarladım:

![Gizlilik ve uyum: veri politikası ve hangi verinin nereye gittiği](/images/posts/piqi/privacy.png)

- **Kişisel veri maskeleme.** Buluta giden metinde TCKN, VKN, IBAN, kart numarası, telefon ve e-posta, sağlama algoritmalarıyla doğrulanarak belirteçlere çevriliyor; cevap yalnızca Mac'te gerçek değerlere geri çevriliyor.
- **Kurum içi model.** Anthropic, Google Gemini ve OpenAI uyumlu her uç nokta destekleniyor; Ollama ya da vLLM gibi kurum içi sunucularla tamamen kurum ağı içinde çalışabiliyor.
- **Yönetilen politika.** BT ekibi MDM ile dağıttığı bir politika dosyasıyla bulut modellerini kapatabiliyor, izinli sağlayıcıları belirleyebiliyor.
- **Denetim kaydı.** Her model çağrısı içeriksiz olarak kaydediliyor: zaman, sağlayıcı, model, karakter sayısı ve maskelenen veri türleri. Soru ve cevap metni kayda yazılmıyor.

![Ses ayarları: toplantıyı otomatik algılama modu](/images/posts/piqi/meeting-detection.png)

## Teknik yığın

- **Arayüz:** Electron, React ve Tailwind. Island, ekranın üstünde duran ve ekran paylaşımında gizlenebilen küçük bir panel.
- **Ses yardımcısı (Swift):** Core Audio process tap ile toplantı uygulamasının sesi, mikrofonla birlikte iki kanal halinde alınıyor; konuşma tanıma Apple Speech, konuşmacı ayrımı FluidAudio ile cihaz üzerinde.
- **Seslendirme (Rust):** Türkçe sesli cevaplar için cihaz üzerinde çalışan EMA Lightning.
- **Bilgi bankası:** Node'un yerleşik SQLite'ı ve FTS5; gömme (embedding) modeli ya da ayrı bir veritabanı sunucusu gerekmiyor.

## Kurulum

Son sürümü [Releases sayfasından](https://github.com/tuncer-byte/piqi/releases/latest) indirip `Piqi` uygulamasını Uygulamalar klasörüne sürüklemen yeterli. macOS 14.4 ve sonrası, Apple silicon gerekiyor. Sürüm henüz Apple tarafından notarize edilmediği için ilk açılışta macOS uyarı veriyor; **Sistem Ayarları → Gizlilik ve Güvenlik → Yine de Aç** ile açabilirsin. Sonra Ayarlar'dan bir model sağlayıcısı ekleyip ilk kaynağını eklemen yeterli.

## Sırada ne var

- Developer ID ile imzalı ve notarize edilmiş sürüm, otomatik güncelleme
- Kendi dokümanlarından oluşturulan bir "altın soru seti" ile arama kalitesini ölçmek
- Anlam tabanlı (embedding) aramayı mevcut yerel aramayla birleştirmek

Piqi'yi denersen ya da katkı vermek istersen GitHub'da issue açabilir veya doğrudan bana yazabilirsin.
