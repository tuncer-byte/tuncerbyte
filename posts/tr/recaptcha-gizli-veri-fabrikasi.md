---
title: "reCAPTCHA: Google'ın 15 Yıllık Ücretsiz Veri Fabrikası"
date: "2026-03-18"
excerpt: "15 yıl boyunca her gün 200 milyon insan Google'ın yapay zeka veri setini etiketledi. Hiçbiri bunun farkında değildi. Waymo bugün 45 milyar dolar değerinde."
tags: ["reCAPTCHA", "Google", "Yapay Zeka", "Veri Etiketleme", "Waymo", "Google Maps", "AI Tarihi", "Veri Gizliliği", "Street View"]
category: "Teknoloji"
---

15 yıl boyunca, her tek gün, 200 milyon insan Google'ın yapay zekasını eğitti.

Hiçbiri bunu yapmak için işe alınmadı. Hiçbirine ödeme yapılmadı. Neredeyse hiçbiri ne yaptığını bilmiyordu.

Bankalarına erişmek istediler. E-postalarını kontrol etmek istediler. Online alışveriş yapmak istediler. Bunların hepsi için önce bir sınav geçmeleri gerekiyordu.

O sınav reCAPTCHA'ydı. Ve hiçbir zaman gerçekten bir sınav değildi.

---

## Başlangıç: Akıllı Bir Fikir

2000'lerin başında internet bot problemiyle boğuşuyordu.

Forum sayfaları spam'e gömülüyordu. E-posta servisleri otomatik kayıt botlarıyla doluyordu. Web siteleri insanları makinelerden ayırt edebilecek bir mekanizmaya ihtiyaç duyuyordu.

Carnegie Mellon profesörü **Luis von Ahn** bu sorunu çözdü. CAPTCHA'yı icat etti: yalnızca insan gözünün okuyabileceği şekilde çarpıtılmış kelimeler. Botlar başarısız oluyordu. İnsanlar geçiyordu.

Ama von Ahn'ın kafasında daha büyük bir şey vardı.

Her gün milyonlarca insan bu küçük görsel bulmacalara zihinsel emek harcıyordu. Bu emek sadece "insan mı bot mu?" sorusunu cevaplamaktan fazlasını yapabilirdi.

2007'de **reCAPTCHA**'yı piyasaya sürdü. Fark şuydu: sisteme anlamsız karalamaları göstermek yerine gerçek kitaplardan taranmış kelimeler gösteriyordu. Bilgisayarların henüz okuyamadığı, optik karakter tanıma (OCR) sistemlerinin çözemediği kelimeler.

Kullanıcı iki kelimeyi yazıyordu. Birincisini sistem zaten biliyordu — bu insanı doğrulamak içindi. İkincisi ise bir kitaptan gelen gerçek bir kelimeydi ve kullanıcının cevabı o kelimenin dijitalleşmesine katkıda bulunuyordu.

Kayıt olduğunuzu sandınız. Aslında dünyanın en büyük dijital kütüphanesini inşa ediyordunuz.

Kitaplar **New York Times arşivinden** ve **Google Books projesinden** geliyordu. 130 milyon kitaplık bir koleksiyon.

Google, 2009'da reCAPTCHA'yı satın aldı.

---

## Google Oyunu Değiştirdi

2012 civarında kıvrık metin dönemi sona erdi.

Google'ın artık farklı bir problemi vardı. Street View arabaları yeryüzündeki her yolu fotoğraflıyordu. Ama fotoğraflar ham veriydi. Yapay zekanın bu veriyi kullanabilmesi için içindeki nesneleri anlaması gerekiyordu: trafik işaretleri, yaya geçitleri, trafik ışıkları, iş yerleri.

Bu "anlama" işlemine **etiketleme** deniyor. Ve etiketleme, 2010'ların başında inanılmaz derecede pahalıydı.

Google, reCAPTCHA v2'yi tasarladı. Artık çarpıtılmış metin yoktu. Fotoğraf ızgaraları vardı. "Trafik ışığı olan tüm kareleri seçin." "Her yaya geçidini işaretleyin." "Mağaza önlerini belirleyin."

Bu fotoğraflar doğrudan Google Street View'dan geliyordu.

Tıklamalarınız etiketlerdi. Her seçim Google'ın bilgisayarla görme modeline şunu söylüyordu: bu piksel kümesi trafik ışığı. Bu şekil yaya geçidi. Bu yapı bir eczane.

Bir sınav geçmiyordunuz. Bir veri seti inşa ediyordunuz.

---

## Kimsenin Konuşmadığı Ölçek

Zirve döneminde günde **200 milyon** reCAPTCHA çözülüyordu.

Her biri ortalama 10 saniye sürüyordu.

Bu, günde **2 milyar saniye** insan emeği demek. Günde **500.000 saat**.

Ücretli veri etiketleme saatte 10 ila 50 dolar arasında değişiyor. En düşük fiyatla hesaplarsak: günde **5 milyon dolar** değerinde ücretsiz emek.

Üstelik reCAPTCHA tek bir uygulamada değildi. Her bankada vardı. Her devlet portalında. Her e-ticaret sitesinde. İnternetteki her giriş sayfasında. Seçim hakkınız yoktu. Hesabınıza erişmek mi istiyorsunuz? Önce veri setini etiketleyin.

Google sormadı. Ödemedi. Hatta söylemedi bile.

---

## Bu Emek Neyi İnşa Etti?

Toplanan veriler doğrudan iki ürüne aktı.

**Google Maps.** Dünyanın en çok kullanılan navigasyon aracı. Yol işaretlerini okuyabilmesi, işletmeleri tanımlayabilmesi, kentsel coğrafyayı anlayabilmesi — bunların önemli bir bölümü, internette gezinmeye çalışan milyarlarca insanın etiketleme çalışmasıyla mümkün oldu.

Ve **Waymo.**

Waymo, Google'ın otonom araç projesi. 2016'da bağımsız bir şirket olarak ayrıldı. Güvenli bir şekilde seyahat edebilmesi için bir sürücüsüz aracın binlerce görsel kalıbı neredeyse mükemmel doğrulukla tanıması gerekiyor. Trafik ışıkları. Yaya geçitleri. Yayalar. Dur işaretleri.

Bu tanıma için gereken "ground truth" eğitim verisi? Websitelerine erişmeye çalışan milyonlarca insan tarafından, bilgileri olmadan, reCAPTCHA aracılığıyla etiketlendi.

Waymo 2024'te **4 milyonun üzerinde ücretli yolculuk** tamamladı. San Francisco, Los Angeles ve Phoenix'te faaliyet gösteriyor. Her ay yeni şehirlere genişliyor.

Bugünkü değeri: **45 milyar dolar.**

Temel; hiçbir şeyden haberi olmayan, e-postasını açmaya çalışan ücretsiz internet kullanıcıları tarafından inşa edildi.

---

## Neden Kimse Bunu Kopyalayamadı?

Veri etiketleme pahalıdır. **Scale AI**, **Appen**, **Labelbox** gibi şirketler tam olarak bu problemi çözmek için var oldu. Bazen saatte bir doların altında ücret alan yüz binlerce çalışanı istihdam ediyorlar.

Google bunu farklı çözdü.

Etiketlemeyi zorunlu kıldı. Ücret ödemeden. Rıza almadan. İnternetteki her sitenin giriş şartı olarak dayattı.

Sonuç: milyarlarca etiketlenmiş görüntü. Global kapsam. Her hava koşulu. Günün her saati. Yeryüzündeki her şehir.

Hiçbir etiketleme şirketi bunu inşa edemezdi. İnternetin kendisi fabrikaydı. Üzerindeki her kullanıcı, hiçbir zaman sözleşme imzalamayan bir çalışandı.

---

## Hâlâ Devam Eden Süreç

2018'de piyasaya sürülen **reCAPTCHA v3** size hiçbir şey göstermiyor.

Farenizi nasıl hareket ettirdiğinizi izliyor. Nasıl kaydırdığınızı. Ne kadar süre beklediğinizi. Davranışsal parmak iziniz, bot mu insan mı olduğunuzu belirliyor.

Bu davranışsal veri de Google'ın yapay zeka sistemlerine geri akıyor.

Hiçbir zaman onay vermediniz. İşaretleyecek bir kutu yoktu. Ve büyük ihtimalle şu an ziyaret ettiğiniz sitelerin çoğunda bunu hâlâ yapıyorsunuz.

---

## Herkesi Rahatsız Etmesi Gereken İroni

Luis von Ahn'ın orijinal vizyonu dahiceydi: insanların spam filtrelerine zaten harcadığı bilişsel emeği yeniden yönlendirmek. Dünyanın kitaplarını dijitalleştirmek. Gerçek bir sorunu çözmek.

Google'ın bu vizyonla yaptığı şey bambaşkaydı.

Kullanıcıların başka seçeneği olmadığı bir güvenlik mekanizmasını aldılar, tüm internete yaydılar ve çıktıyı onlarca milyar dolar değerinde ticari ürünler inşa etmek için topladılar.

Kullanıcılar hiçbir şey almadı. Farkındalık bile.

En derin ironi şu: yıllarca insan olduğunuzu kanıtlamak için uğraştınız. Yapay zekanın henüz yapamadığı görsel tanıma işini yaparak. Bu iş, öğrenildiğinde insan görsel etiketlemesini gereksiz kıldı.

İnsan olduğunuzu kanıtladınız. Kendinizi değiştirilebilir kılarak.

---

reCAPTCHA tek bir anekdot değil. İnternetin nasıl çalıştığını anlatan bir şablon.

Platformlar kullanıcı davranışını ürüne dönüştürür. Çoğu zaman açıkça. Çoğu zaman gönüllü olarak. Ama bazen — bu hikayede olduğu gibi — tam anlamıyla görünmez bir şekilde.

Bir dahaki sefere "Robot değilim" kutusunu tıkladığınızda, bunun tam olarak ne anlama geldiğini biliyorsunuz artık.
