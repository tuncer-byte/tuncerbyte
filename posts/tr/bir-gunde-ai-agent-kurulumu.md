---
title: "Üretimde Çalışan AI Agent Nasıl Kurulur"
date: "2026-03-18"
excerpt: "Demo'da çalışan değil, üretimde gerçekten ayakta duran AI agent'lar nasıl kurulur? Yedi temel ilke, yaygın hatalar ve dağıtım öncesi kontrol listesi."
tags: ["AI Agent", "Yapay Zeka", "Mühendislik", "Üretim", "Yazılım Mimarisi"]
category: "Teknoloji"
---

Herkes AI agent kurmak istiyor. Neredeyse kimse gerçekten çalışan biri inşa etmiyor.

Her hafta aynı manzarayla karşılaşıyorum: Biri bir tutorial izliyor, birkaç satır kod kopyalıyor, 20 dakikada demoyu çalıştırıyor, bunu X'te paylaşıyor ve kendini "AI agent geliştirici" ilan ediyor. Sonra gerçek bir kullanıcı sisteme dokunuyor ve her şey dağılıyor.

- Agent aynı aracı tekrar tekrar çağırıp sonsuz döngüye giriyor
- Yanlış zamanda yanlış aracı seçiyor
- Bilmediğini söylemek yerine cevabı kafadan uyduruyor
- Demo girdisinde mükemmel çalışıyor ama başka her şeyle bozuluyor
- Hiçbir işe yaramadan devasa bir API faturası çıkarıyor

Sorun model değil. Sorun framework değil. Hangi API'yi kullandığın da değil.

Sorun şu: çoğu insan agent'ları tıpkı chatbot gibi tasarlıyor — oysa ikisi temelden farklı sistemler.

Chatbot bir konuşmadır. Agent bir çalışandır.

Bir çalışanı bir konuşma gibi tasarlarsanız, o çalışan er ya da geç çuvalayacak.

---

## Önce: Agent Aslında Ne Yapar?

Chatbot basit bir döngüdür: girdi alır, cevap üretir, biter. Agent bundan çok daha farklı çalışır. Bir hedef alır, o hedefi adımlara böler, bilgi toplamak ve eylem gerçekleştirmek için araçlardan yararlanır, kendi ilerlemesini değerlendirir, öğrendiklerine göre planını günceller ve ya hedefe ulaşır ya da ulaşamayacağına karar verir.

İkisi arasındaki asıl fark:

- **Chatbot:** girdi → çıktı
- **Agent:** girdi → düşün → eylem → gözlemle → düşün → eylem → gözlemle → ... → çıktı

Bu döngüye **agentic loop** deniyor ve her şeyin temeli burada yatıyor.

### Döngü Mekanik Olarak Nasıl İşliyor?

1. Messages API üzerinden modele bir istek gönderirsiniz
2. Model isteği işler ve yanıt verir
3. Yanıt ya nihai bir cevap içerir ya da bir araç çağrısı
4. Araç çağrısıysa: aracı çalıştırırsınız, sonucu toplayıp modele yeni mesaj olarak geri gönderirsiniz
5. Model yeni bilgiyi değerlendirir ve tekrar karar verir: başka araç mu, yoksa bitir mi?
6. Model yeterli bilgiye sahip olduğuna karar verene kadar bu döngü devam eder

### Her Yeni Başlayanın Düştüğü Tuzak

Agent'ın bittiğini anlamak için modelin "Bittim" ya da "İşte son cevabım" dediğine bakmayın. API'den gelen `stop_reason: "end_turn"` sinyaline bakın.

Bu, yeni agent geliştiricilerin yaptığı bir numaralı hata. Tamamlanmayı tespit etmek için modelin doğal dil çıktısını ayrıştırmaya çalışıyorlar. `stop_reason` alanı tam da bu belirsizliği ortadan kaldırmak için var.

**Hemen bırakmanız gereken üç anti-kalıp:**

1. **Döngüyü durdurmak için doğal dil ayrıştırmak** — modelin "Bittim" deyip demediğini kontrol etmek yanlış. `stop_reason` alanını kullanın.
2. **Rastgele yineleme sınırı koymak** — "10 döngüden sonra dur" mantığı yanlış. Yineleme sınırı olsa olsa bir güvenlik ağıdır, birincil mekanizma değil.
3. **Metin içeriğine bakarak "bitti" demek** — model metin ve araç çağrılarını aynı anda döndürebilir.

Agentic loop'u doğru kurarsanız geri kalanı inanılmaz derecede kolaylaşır. Yanlış kurarsanız haftalarca gizemli davranışları çözmeye çalışırsınız.

---

## Üretim Agent'larının 7 İlkesi

Gerçek üretim ortamlarında agent'lar kurarken öğrendiklerimi 7 ilkeye indirgedim. Bunlar birer öneri değil, zorunluluk. Herhangi birini atlarsanız agent'ınız eninde sonunda teşhis edilmesi güç ve maliyetli şekillerde bozulacak.

---

### İlke 1: Kodu Açmadan Önce Planla

En çok tökezlenen yer burası ve en önemli adım.

İnsanlar heyecanla editörü açıp hemen agent mantığını yazmaya başlıyorlar. Araçları kodluyor, sistem promptları yazıyor, API'leri bağlıyorlar — agent'ın ne yapması gerektiğini net bir şekilde tanımlamadan önce.

Önce bir belge açın ve şu soruları cevaplayın:

**Agent'ın tam olarak ne yapması gerekiyor?** "Müşteri desteğine yardım etsin" gibi muğlak değil. "Sipariş durumunu, takip bilgilerini ve tahmini teslimat tarihlerini kontrol ederek müşteri kargo sorunlarını çözsün" gibi somut.

**Hangi araçlara erişmesi gerekiyor?** Etkileşime gireceği her sistemi listeleyin. Salt okunur mu çalışacak, yoksa yazma ve silme yetkisi de olacak mı?

**"Başarı" nasıl görünüyor?** Başarıyı somut olarak tanımlayamazsanız, agent da tanımlayamaz.

**"Başarısızlık" nasıl görünüyor?** Araç boş dönerse? Veri eksikse? Kullanıcı kapsam dışı bir şey sorarsa?

**Ne zaman insan devreye girmeli?** "Tahmin etmek yerine insana sor" diyeceğiniz durumları önceden belirleyin — belli tutarın üzerindeki iadeler, hukuki sorumluluk içeren talepler, ürün güvenliğiyle ilgili şikayetler gibi.

Sade dilde agent'ın ne yapacağını tarif edemiyorsanız, agent bunu kendi başına çözemez. Muğlak spec, muğlak agent doğurur.

---

### İlke 2: Agent'a Sadece Gereken Araçları Ver

Her yeni araç, modelin vermesi gereken fazladan bir karardır. Araç sayısı arttıkça yanlış seçim ihtimali yükselir, davranış öngörülemez hale gelir.

Maksimum 3-5 araçla başlayın. Daha fazlasına ihtiyaç varsa muhtemelen tek agent yerine birden fazla uzmanlaşmış agent gerekiyor.

Her araç için dört şeyi net tanımlayın:

**İsim:** Açık, anlaşılır, hiç muğlaklık yok. `helper_function_2` değil, `search_product_database`. İsim tek bakışta ne yaptığını anlatmalı.

**Açıklama:** En kritik parça bu. Model, aracı kullanıp kullanmamaya karar vermek için açıklamayı okuyor.

*Kötü açıklama:*
> "Şeyleri aramak için kullanışlı"

*İyi açıklama:*
> "Ürün veritabanını ürün adı veya SKU koduyla arar. Fiyat, stok durumu ve teknik özellik döndürür. Kullanıcı ürün detayı, fiyat veya stok sorusu sorduğunda kullanın. Sipariş geçmişi veya kargo durumu için **kullanmayın** — bunun için `check_order_status` kullanın."

Bu iki açıklama arasındaki fark, çalışan bir agent ile bozuk bir agent arasındaki farktır.

**Parametreler:** Katı JSON şeması tanımlayın. Zorunlu alanları işaretleyin, veri tiplerini belirtin, her parametreye açıklama ekleyin.

**Dönüş formatı:** Yapısal, tutarlı, işlenebilir. Her zaman bir durum alanı ekleyin: `success`, `error`, `no_results`.

Agent kurmanın diğer tüm parçalarından daha çok zaman harcamanız gereken yer araç tasarımıdır. Araçlarınızın kalitesi, agent'ınızın kalitesini belirler.

---

### İlke 3: Hataları Üretim Ortamı Ciddiyetiyle Ele Al

Agent'ınız üretimde hatalarla karşılaşacak. Bu bir olasılık değil, kesinlik.

API'ler zaman aşımına uğrar. Veritabanları boş döner. Servisler çöker. Rate limit'ler aşılır.

Bunları önceden ele almazsanız model şunlardan birini yapacak: **cevabı uyduracak** ya da **sonsuza döngü kuracak**. Her ikisi de üretimde felaket.

```python
# Kötü: model ne olduğuna dair hiçbir fikre sahip değil
def search_database(query):
    try:
        return db.search(query)
    except:
        return None  # Model bunu alır ve tahmin etmeye başlar

# İyi: eyleme dönüştürülebilir bilgi içeren yapısal hata
def search_database(query):
    try:
        results = db.search(query)
        if not results:
            return {
                "status": "no_results",
                "message": f"'{query}' ile eşleşen ürün bulunamadı.",
                "suggestion": "Daha geniş terimle ara ya da yazım hatalarını kontrol et."
            }
        return {"status": "success", "results": results, "count": len(results)}
    except TimeoutError:
        return {
            "status": "error",
            "type": "timeout",
            "message": "Sorgu 10 saniyede zaman aşımına uğradı.",
            "suggestion": "Sorguyu sadeleştir ya da tekrar dene."
        }
    except ConnectionError:
        return {
            "status": "error",
            "type": "connection_failed",
            "message": "Veritabanına bağlanılamıyor.",
            "suggestion": "Sistem sorunu. Kullanıcıya hizmetin geçici olarak kullanılamadığını bildir."
        }
```

Kötü versiyonla model `None` alır ve ne yapacağını bilemez. İyi versiyonla ne olduğunu ve ne yapması gerektiğini net olarak görür.

---

### İlke 4: Agent'ın Yetkisini Sert Sınırlarla Çerçevele

Üretimdeki en büyük risk agent'ların başarısız olması değil, yanlış şeyde başarılı olmalarıdır.

Onaylanmaması gereken bir iadeyi güvenle işleyen bir agent, hata mesajıyla çöken bir agent'tan çok daha fazla zarar verir.

Her agent için açık yetki sınırları belirleyin:

- **Serbest yapabilecekleri:** kimseye sormadan
- **İnsan onayı gerekenler:** yapmadan önce danışılacak durumlar
- **Hiçbir koşulda yapılmayacaklar**

Ve işte ciddi geliştiricileri acemilerden ayıran kritik ders: **yüksek riskli sınırlar için sadece prompt talimatlarına güvenmeyin.**

Prompt talimatları öneridir. Model çoğu zaman uyar. Ama başarısızlığın bedelinin finansal, hukuki veya itibarla ilgili olduğu durumlarda "çoğu zaman" yetmez. Programatik uygulama kullanın.

```python
def execute_tool(tool_name, params):
    # Sert kapı: 100 dolar üzerindeki iadeler insan onayı gerektirir
    if tool_name == "process_refund" and params["amount"] > 100:
        return {
            "status": "blocked",
            "reason": "İade tutarı otomatik onay eşiğini aşıyor.",
            "action": "Bu iade insan onayı gerektiriyor. Yönetici kuyruğuna yönlendiriliyor."
        }
    # Sert kapı: onaysız silme işlemi yok
    if tool_name == "delete_record":
        return {
            "status": "blocked",
            "reason": "Silme işlemleri açık insan onayı gerektiriyor.",
            "action": "Kullanıcıdan bu kaydı silmek istediğini onaylamasını isteyin."
        }
    return tool_registry[tool_name](params)
```

Promptlar davranışı yönlendirir. Kod sınırları uygular. İkisini birlikte kullanın.

---

### İlke 5: Çok Agent'lı Sistemleri Doğru Kur

Agent'ınıza çok fazla farklı görev yüklemeniz gerekiyorsa, tek agent'a araç eklemeye devam etmeyin. Bir koordinatör tarafından yönetilen uzmanlaşmış alt agent'lara bölün.

Mimari merkez-ve-kollar şeklindedir:

- **Koordinatör** ortada durur. Genel hedefi anlar, hangi uzmanı çağıracağını belirler, sonuçları bir araya getirir.
- **Alt agent'lar** uzmandır. Biri araştırma, biri yazarlık, biri veri analizi için. Her birinin odaklanmış araç seti ve net bir alanı vardır.
- **Tüm iletişim koordinatör üzerinden akar.** Alt agent'lar birbirleriyle asla doğrudan konuşmaz.

Ama herkese yanlış gelen kritik bir nokta var. Çok agent'lı sistemlerdeki en yaygın bug:

**Alt agent'lar koordinatörün konuşma geçmişini otomatik olarak miras almaz.**

Alt agent'ların izole bağlamı vardır. Boş bir sayfayla başlarlar. Alt agent'ın ihtiyaç duyduğu her bilgi parçasının onun promptunda açıkça yer alması gerekir.

```
# Kötü: alt agent bağlamı bildiğini sanıyor
sub_agent_prompt = "Şimdi tartıştığımız verileri analiz et ve özet yaz."

# İyi: tüm gerekli bağlam açıkça iletiliyor
sub_agent_prompt = f"""
Sen bir veri analizi uzmanısın.
Aşağıdaki Q3 2026 satış verilerini analiz et ve yapısal bir özet rapor hazırla.

VERİ: {json.dumps(sales_data)}

ANALİZ GEREKSİNİMLERİ:
1. Bölgeye göre gelir eğilimleri (ay bazında karşılaştır)
2. Büyüme oranına göre ilk 5 ürün
3. Veri anomalileri veya aykırı değerler (>2 standart sapma)

ÖNCEKİ ANALİZDEN BAĞLAM:
Araştırma ekibi APAC bölgesinin olağandışı büyüme kalıpları gösterdiğini belirledi.
"""
```

İkinci versiyon daha uzun, evet. Ama çalışıyor.

---

### İlke 6: Hayal Edebileceğin En Kötü Girdilerle Test Et

Agent'ınız temiz, beklenen girdilerle mükemmel çalışıyor mu? Bu hiçbir şey ifade etmez.

Test paketiniz şunları içermeli:

- Boş girdiler (`""` veya `null`)
- Agent'ın tasarlanmadığı diller
- Kendi kendine çelişen girdiler ("siparişimi iptal et ve daha hızlı gönder")
- Kapsam dışına çıkarmaya çalışan girdiler
- Beklenenden 10 kat uzun girdiler
- Özel karakterler, kod enjeksiyonu girişimleri
- Var olmayan şeylere referans veren girdiler

Agent'ı her değiştirdiğinizde bu testi çalıştırın. Otomatize edin. Dağıtım sürecinizin parçası yapın.

Kötü girdilerle henüz bozulmadıysa, yeterince test etmediniz demektir. Bu şaka değil — her agent'ın başarısızlık modları vardır. Göreviniz bunları kullanıcılardan önce bulmak.

---

### İlke 7: Her Şeyi Kayıt Al, Her Şeyi Ölç

Üretimde bir gün şöyle bir hata raporu alacaksınız: "agent dün tuhaf bir şey yaptı."

Kapsamlı kayıt yoksa kör olarak hata ayıklıyorsunuzdur.

Her agent çalışması için şunları kayıt altına alın:

- Modele gönderilen her mesaj (tam içerik)
- Her araç çağrısı: hangi araç, hangi parametreler, hangi sonuç
- Tur başına token kullanımı
- Her araç için geçen süre, toplam çalışma süresi
- Karşılaşılan hatalar ve nasıl ele alındıkları

`print` ifadeleri değil, yapısal JSON kayıt kullanın.

```python
import json
import logging
from datetime import datetime

logger = logging.getLogger("agent")

def log_agent_event(event_type, data):
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "run_id": current_run_id,
        "data": data
    }
    logger.info(json.dumps(log_entry))

log_agent_event("tool_call", {
    "tool": "search_products",
    "params": {"query": "laptop"},
    "result_status": "success",
    "result_count": 12,
    "duration_ms": 340
})
log_agent_event("agent_complete", {
    "total_turns": 4,
    "total_tokens": 8200,
    "total_duration_ms": 12400,
    "outcome": "success"
})
```

Kayıt tutmak seçimlik bir yük değil. Sürekli iyileştirmenin temelidir.

---

## Önce Bunu Kur: Minimum Uygulanabilir Agent

5 agent, 20 araç ve karmaşık yönlendirme katmanıyla başlamayın.

**1 agent. 3 araç. 1 net hedef.**

Örnek: ürün kataloğu sorularını yanıtlayan bir agent.

- **`search_products`** — veritabanını ürün adı veya kategoriye göre sorgular
- **`get_product_details`** — belirli bir ürünün eksiksiz bilgisini getirir
- **`check_stock`** — belirli bir lokasyonda gerçek zamanlı envanter kontrolü yapar

Bunu mükemmel çalıştırana kadar devam edin. 50'den fazla farklı sorguyla test edin. Hataları zarif ele aldığını doğrulayın. Bilgi eksikken uydurmadığından emin olun.

**Ancak bundan sonra** karmaşıklık ekleyin.

Yineleme yoluyla kazanılan karmaşıklık yönetilebilir. Baştan dayatılan karmaşıklık kabus olur.

---

## Üretimde En Sık Karşılaşılan 5 Sorun

**1. Sonsuz döngü** — Agent aynı aracı sürekli çağırıp ilerlemiyor. Yineleme takibi ekleyin; aynı araç aynı parametreyle 3'ten fazla çağrılırsa zorla farklı yol dene mesajı enjekte edin.

**2. Yanlış araç seçimi** — Örtüşen ya da muğlak açıklamalardan kaynaklanır. Araç açıklamalarını birbirini dışlayacak şekilde yeniden yazın.

**3. Uydurmaya kaçma** — Araç boş dönünce model "bilmiyorum" demek yerine cevap uyduruyor. Sistem promptuna net direktif ekleyin: "Araç sonuç vermezse bunu dürüstçe ilet. Bilgi uydurma."

**4. Bağlam taşması** — Uzun konuşmalarda agent önceki bilgileri kaybedip tutarsız yanıtlar üretiyor. Her N turda bir modele şimdiye kadarki temel gerçekleri özetletip ilerleyen bağlam olarak kullanın.

**5. Kapsam kayması** — Agent tanımlı kapsamın dışına çıkıyor. Sistem promptunda ne yapmadığını da açıkça listeleyin.

---

## Dağıtım Öncesi Kontrol Listesi

Herhangi bir agent'ı gerçek kullanıcıların önüne koymadan önce bu listedeki her maddeyi geçin. İstisna yok.

**Mimari**
- [ ] Agentic loop `stop_reason` kullanılarak doğru uygulandı mı?
- [ ] Tüm araçlar net isim, ayrıntılı açıklama, katı parametre şeması ve tutarlı dönüş formatıyla tanımlı mı?
- [ ] Güvenlik ağı olarak maksimum yineleme sınırı var mı?

**Hata yönetimi**
- [ ] Her araç yapısal hata mesajı döndürüyor mu?
- [ ] Her araç için yeniden deneme sınırı var mı?
- [ ] Her başarısızlık senaryosu için geri dönüş planı var mı?

**Güvenlik**
- [ ] Yüksek riskli işlemler programatik olarak geçitlenmiş mi?
- [ ] Tüm araçlar minimum gerekli izinlerle tanımlanmış mı?
- [ ] Silme ve yazma işlemleri onay kapısının arkasında mı?

**Test**
- [ ] En az 50 farklı sorgu test edildi mi?
- [ ] Boş, bozuk, çelişkili ve kötü niyetli girdiler test edildi mi?
- [ ] Dış servisler çevrimdışı olduğundaki durum test edildi mi?

**Gözlemlenebilirlik**
- [ ] Tüm mesajlar, araç çağrıları, sonuçlar ve token sayıları yapısal JSON'da kayıt altına alınıyor mu?
- [ ] Herhangi bir agent çalışması yalnızca kayıtlardan yeniden oluşturulabilir mi?

---

## Sonuç

AI agent kurmak prompt yazmakla ilgili değil. Doğru framework'ü seçmekle de değil.

**Belirsizliği zarif biçimde kaldırabilen sistemler tasarlamakla ilgili.**

Model zaman zaman kötü kararlar verecek. Araçlar başarısız olacak. Kullanıcılar beklemediğiniz şeyler soracak. Bağlam pencereleri dolacak. API'ler çökecek.

Harika agent'lar kuran mühendisler, tüm bunları önceden hesaba katan mühendislerdir. Sadece iyi senaryo için değil, başarısızlık durumları için de tasarlarlar. Her katmana gözlemlenebilirlik eklerler. Amansızca test ederler.

Kötü agent'lar kuran mühendisler ise demoyu çalıştıran ve gönderenlerdir.

Küçük başlayın. Minimum uygulanabilir agent'ı kurun. Acımasızca test edin. Her şeyi kayıt altına alın — ölçemediğiniz şeyi iyileştiremezsiniz.

"Demo kurdum" ile "üretim sistemi kurdum" arasındaki uçurum devasa. Gerçek AI mühendisliği tam da o uçurumda yaşıyor.
