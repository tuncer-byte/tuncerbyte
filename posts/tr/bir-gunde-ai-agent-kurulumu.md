---
title: "Production'da Çalışan AI Agent Nasıl Kurulur"
date: "2026-03-18"
excerpt: "Demo'da çalışan değil, production'da gerçekten ayakta duran AI agent'lar nasıl kurulur? Yedi temel ilke, yaygın hatalar ve deploy öncesi kontrol listesi."
tags: ["AI Agent", "Yapay Zeka", "Mühendislik", "Production", "Yazılım Mimarisi"]
category: "Teknoloji"
---

Herkese merhaba, bugün herkesin dilinde olan ama kimsenin en net hali ile ne yapması gerektiğini bilmediği ai agent oluşturmadaki önemli konulardan bahsedeceğim.

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
3. Yanıt ya nihai bir cevap içerir ya da bir tool call
4. Tool call ise: aracı çalıştırırsınız, sonucu toplayıp modele yeni mesaj olarak geri gönderirsiniz
5. Model yeni bilgiyi değerlendirir ve tekrar karar verir: başka araç mu, yoksa bitir mi?
6. Model yeterli bilgiye sahip olduğuna karar verene kadar bu döngü devam eder

### Her Yeni Başlayanın Düştüğü Tuzak

Agent'ın bittiğini anlamak için modelin "Bittim" ya da "İşte son cevabım" dediğine bakmayın. API'den gelen `stop_reason: "end_turn"` sinyaline bakın.

Bu, yeni agent geliştiricilerin yaptığı bir numaralı hata. Completion'ı tespit etmek için modelin natural language output'unu parse etmeye çalışıyorlar. `stop_reason` alanı tam da bu belirsizliği ortadan kaldırmak için var.

**Hemen bırakmanız gereken üç anti-pattern:**

1. **Döngüyü durdurmak için natural language parse etmek** — modelin "Bittim" deyip demediğini kontrol etmek yanlış. `stop_reason` alanını kullanın.
2. **Rastgele iteration sınırı koymak** — "10 döngüden sonra dur" mantığı yanlış. Iteration sınırı olsa olsa bir safety net'tir, birincil mekanizma değil.
3. **Text output'a bakarak "bitti" demek** — model text ve tool call'ları aynı anda döndürebilir.

Agentic loop'u doğru kurarsanız geri kalanı inanılmaz derecede kolaylaşır. Yanlış kurarsanız haftalarca gizemli davranışları çözmeye çalışırsınız.

---

## Production Agent'larının 7 İlkesi

Gerçek production ortamlarında agent'lar kurarken öğrendiklerimi 7 ilkeye indirgedim. Bunlar birer öneri değil, zorunluluk. Herhangi birini atlarsanız agent'ınız eninde sonunda teşhis edilmesi güç ve maliyetli şekillerde bozulacak.

---

### İlke 1: Kodu Açmadan Önce Planla

En çok tökezlenen yer burası ve en önemli adım.

İnsanlar heyecanla editörü açıp hemen agent mantığını yazmaya başlıyorlar. Tool'ları kodluyor, sistem prompt'ları yazıyor, API'leri bağlıyorlar — agent'ın ne yapması gerektiğini net bir şekilde tanımlamadan önce.

Önce bir belge açın ve şu soruları cevaplayın:

**Agent'ın tam olarak ne yapması gerekiyor?** "Müşteri desteğine yardım etsin" gibi muğlak değil. "Sipariş durumunu, takip bilgilerini ve tahmini teslimat tarihlerini kontrol ederek müşteri kargo sorunlarını çözsün" gibi somut.

**Hangi tool'lara erişmesi gerekiyor?** Etkileşime gireceği her sistemi listeleyin. Read-only mu çalışacak, yoksa yazma ve silme yetkisi de olacak mı?

**"Başarı" nasıl görünüyor?** Başarıyı somut olarak tanımlayamazsanız, agent da tanımlayamaz.

**"Başarısızlık" nasıl görünüyor?** Tool boş dönerse? Veri eksikse? Kullanıcı scope dışı bir şey sorarsa?

**Ne zaman insan devreye girmeli?** "Tahmin etmek yerine insana sor" diyeceğiniz durumları önceden belirleyin — belli tutarın üzerindeki iadeler, hukuki sorumluluk içeren talepler, ürün güvenliğiyle ilgili şikayetler gibi.

Sade dilde agent'ın ne yapacağını tarif edemiyorsanız, agent bunu kendi başına çözemez. Muğlak spec, muğlak agent doğurur.

---

### İlke 2: Agent'a Sadece Gereken Tool'ları Ver

Her yeni tool, modelin vermesi gereken fazladan bir karardır. Tool sayısı arttıkça yanlış seçim ihtimali yükselir, davranış öngörülemez hale gelir.

Maksimum 3-5 tool ile başlayın. Daha fazlasına ihtiyaç varsa muhtemelen tek agent yerine birden fazla uzmanlaşmış agent gerekiyor.

Her tool için dört şeyi net tanımlayın:

**İsim:** Açık, anlaşılır, hiç muğlaklık yok. `helper_function_2` değil, `search_product_database`. İsim tek bakışta ne yaptığını anlatmalı.

**Açıklama:** En kritik parça bu. Model, tool'u kullanıp kullanmamaya karar vermek için açıklamayı okuyor.

*Kötü açıklama:*
> "Şeyleri aramak için kullanışlı"

*İyi açıklama:*
> "Ürün veritabanını ürün adı veya SKU koduyla arar. Fiyat, stok durumu ve teknik özellik döndürür. Kullanıcı ürün detayı, fiyat veya stok sorusu sorduğunda kullanın. Sipariş geçmişi veya kargo durumu için **kullanmayın** — bunun için `check_order_status` kullanın."

Bu iki açıklama arasındaki fark, çalışan bir agent ile bozuk bir agent arasındaki farktır.

**Parametreler:** Katı JSON şeması tanımlayın. Required field'ları işaretleyin, data type'ları belirtin, her parametreye açıklama ekleyin.

**Return formatı:** Structured, tutarlı, işlenebilir. Her zaman bir status field ekleyin: `success`, `error`, `no_results`.

Agent kurmanın diğer tüm parçalarından daha çok zaman harcamanız gereken yer tool tasarımıdır. Tool'larınızın kalitesi, agent'ınızın kalitesini belirler.

---

### İlke 3: Hataları Production Ciddiyetiyle Ele Al

Agent'ınız production'da hatalarla karşılaşacak. Bu bir olasılık değil, kesinlik.

API'ler timeout'a uğrar. Veritabanları boş döner. Servisler çöker. Rate limit'ler aşılır.

Bunları önceden ele almazsanız model şunlardan birini yapacak: **cevabı uyduracak** ya da **sonsuz döngüye girecek**. Her ikisi de production'da felaket.

```python
# Kötü: model ne olduğuna dair hiçbir fikre sahip değil
def search_database(query):
    try:
        return db.search(query)
    except:
        return None  # Model bunu alır ve tahmin etmeye başlar

# İyi: actionable bilgi içeren structured error
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
            "message": "Sorgu 10 saniyede timeout'a uğradı.",
            "suggestion": "Sorguyu sadeleştir ya da tekrar dene."
        }
    except ConnectionError:
        return {
            "status": "error",
            "type": "connection_failed",
            "message": "Veritabanına bağlanılamıyor.",
            "suggestion": "Sistem sorunu. Kullanıcıya servisin geçici olarak kullanılamadığını bildir."
        }
```

Kötü versiyonla model `None` alır ve ne yapacağını bilemez. İyi versiyonla ne olduğunu ve ne yapması gerektiğini net olarak görür.

---

### İlke 4: Agent'ın Yetkisini Sert Sınırlarla Çerçevele

Production'daki en büyük risk agent'ların fail olması değil, yanlış şeyde başarılı olmalarıdır.

Onaylanmaması gereken bir iadeyi güvenle işleyen bir agent, error message ile çöken bir agent'tan çok daha fazla zarar verir.

Her agent için açık yetki sınırları belirleyin:

- **Serbest yapabilecekleri:** kimseye sormadan
- **Human approval gerekenler:** yapmadan önce danışılacak durumlar
- **Hiçbir koşulda yapılmayacaklar**

Ve işte ciddi geliştiricileri acemilerden ayıran kritik ders: **yüksek riskli sınırlar için sadece prompt talimatlarına güvenmeyin.**

Prompt talimatları öneridir. Model çoğu zaman uyar. Ama failure'ın bedelinin finansal, hukuki veya itibarla ilgili olduğu durumlarda "çoğu zaman" yetmez. Programmatic enforcement kullanın.

```python
def execute_tool(tool_name, params):
    # Hard gate: 100 dolar üzerindeki iadeler human approval gerektirir
    if tool_name == "process_refund" and params["amount"] > 100:
        return {
            "status": "blocked",
            "reason": "İade tutarı otomatik onay eşiğini aşıyor.",
            "action": "Bu iade human approval gerektiriyor. Manager queue'ya yönlendiriliyor."
        }
    # Hard gate: onaysız delete işlemi yok
    if tool_name == "delete_record":
        return {
            "status": "blocked",
            "reason": "Delete işlemleri explicit human confirmation gerektiriyor.",
            "action": "Kullanıcıdan bu kaydı silmek istediğini confirm etmesini isteyin."
        }
    return tool_registry[tool_name](params)
```

Prompt'lar davranışı yönlendirir. Kod sınırları uygular. İkisini birlikte kullanın.

---

### İlke 5: Multi-Agent Sistemleri Doğru Kur

Agent'ınıza çok fazla farklı görev yüklemeniz gerekiyorsa, tek agent'a tool eklemeye devam etmeyin. Bir coordinator tarafından yönetilen uzmanlaşmış sub-agent'lara bölün.

Mimari hub-and-spoke şeklindedir:

- **Coordinator** ortada durur. Genel hedefi anlar, hangi uzmanı çağıracağını belirler, sonuçları bir araya getirir.
- **Sub-agent'lar** uzmandır. Biri araştırma, biri yazarlık, biri veri analizi için. Her birinin odaklanmış tool seti ve net bir domain'i vardır.
- **Tüm iletişim coordinator üzerinden akar.** Sub-agent'lar birbirleriyle asla doğrudan konuşmaz.

Ama herkese yanlış gelen kritik bir nokta var. Multi-agent sistemlerdeki en yaygın bug:

**Sub-agent'lar coordinator'ın conversation history'sini otomatik olarak inherit etmez.**

Sub-agent'ların izole context'i vardır. Boş bir sayfayla başlarlar. Sub-agent'ın ihtiyaç duyduğu her bilgi parçasının onun prompt'unda açıkça yer alması gerekir.

```
# Kötü: sub-agent context'i bildiğini sanıyor
sub_agent_prompt = "Şimdi tartıştığımız verileri analiz et ve özet yaz."

# İyi: tüm gerekli context açıkça pass ediliyor
sub_agent_prompt = f"""
Sen bir veri analizi uzmanısın.
Aşağıdaki Q3 2026 satış verilerini analiz et ve structured bir özet rapor hazırla.

VERİ: {json.dumps(sales_data)}

ANALİZ GEREKSİNİMLERİ:
1. Bölgeye göre revenue trend'leri (ay bazında karşılaştır)
2. Growth rate'e göre ilk 5 ürün
3. Veri anomalileri veya outlier'lar (>2 standart sapma)

ÖNCEKİ ANALİZDEN CONTEXT:
Araştırma ekibi APAC bölgesinin olağandışı growth pattern'ları gösterdiğini belirledi.
"""
```

İkinci versiyon daha uzun, evet. Ama çalışıyor.

---

### İlke 6: Hayal Edebileceğin En Kötü Input'larla Test Et

Agent'ınız temiz, beklenen input'larla mükemmel çalışıyor mu? Bu hiçbir şey ifade etmez.

Test suite'iniz şunları içermeli:

- Boş input'lar (`""` veya `null`)
- Agent'ın tasarlanmadığı diller
- Kendi kendine çelişen input'lar ("siparişimi iptal et ve daha hızlı gönder")
- Scope dışına çıkarmaya çalışan input'lar
- Beklenenden 10 kat uzun input'lar
- Özel karakterler, code injection girişimleri
- Var olmayan şeylere referans veren input'lar

Agent'ı her değiştirdiğinizde bu testi çalıştırın. Otomatize edin. Deploy pipeline'ınızın parçası yapın.

Kötü input'larla henüz bozulmadıysa, yeterince test etmediniz demektir. Bu şaka değil — her agent'ın failure mode'ları vardır. Göreviniz bunları kullanıcılardan önce bulmak.

---

### İlke 7: Her Şeyi Log'la, Her Şeyi Ölç

Production'da bir gün şöyle bir bug report alacaksınız: "agent dün tuhaf bir şey yaptı."

Kapsamlı log yoksa kör olarak debug ediyorsunuzdur.

Her agent run'ı için şunları kayıt altına alın:

- Modele gönderilen her mesaj (tam içerik)
- Her tool call: hangi tool, hangi parametreler, hangi sonuç
- Token kullanımı (her turn için input + output)
- Her tool için latency, toplam run süresi
- Karşılaşılan error'lar ve nasıl handle edildikleri

`print` ifadeleri değil, structured JSON logging kullanın.

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

Log tutmak opsiyonel bir yük değil. Sürekli iyileştirmenin temelidir.

---

## Önce Bunu Kur: Minimum Viable Agent

5 agent, 20 tool ve karmaşık routing layer ile başlamayın.

**1 agent. 3 tool. 1 net hedef.**

Örnek: ürün kataloğu sorularını yanıtlayan bir agent.

- **`search_products`** — veritabanını ürün adı veya kategoriye göre sorgular
- **`get_product_details`** — belirli bir ürünün eksiksiz bilgisini getirir
- **`check_stock`** — belirli bir lokasyonda real-time stok kontrolü yapar

Bunu mükemmel çalıştırana kadar devam edin. 50'den fazla farklı sorguyla test edin. Error'ları düzgün handle ettiğini doğrulayın. Bilgi eksikken hallucinate etmediğinden emin olun.

**Ancak bundan sonra** karmaşıklık ekleyin.

Iteration yoluyla kazanılan karmaşıklık yönetilebilir. Baştan dayatılan karmaşıklık kabus olur.

---

## Production'da En Sık Karşılaşılan 5 Sorun

**1. Infinite loop** — Agent aynı tool'u sürekli çağırıp ilerlemiyor. Iteration tracking ekleyin; aynı tool aynı parametreyle 3'ten fazla çağrılırsa zorla farklı yol dene mesajı inject edin.

**2. Yanlış tool seçimi** — Örtüşen ya da muğlak açıklamalardan kaynaklanır. Tool açıklamalarını birbirini dışlayacak şekilde yeniden yazın.

**3. Hallucination** — Tool boş dönünce model "bilmiyorum" demek yerine cevap uyduruyor. Sistem prompt'una net direktif ekleyin: "Tool sonuç vermezse bunu dürüstçe ilet. Bilgi uydurma."

**4. Context overflow** — Uzun konuşmalarda agent önceki bilgileri kaybedip tutarsız yanıtlar üretiyor. Her N turn'de modele şimdiye kadarki temel gerçekleri özetletip ilerleyen context olarak kullanın.

**5. Scope creep** — Agent tanımlı scope'un dışına çıkıyor. Sistem prompt'unda ne yapmadığını da açıkça listeleyin.

---

## Deploy Öncesi Kontrol Listesi

Herhangi bir agent'ı gerçek kullanıcıların önüne koymadan önce bu listedeki her maddeyi geçin. İstisna yok.

**Mimari**
- [ ] Agentic loop `stop_reason` kullanılarak doğru implement edildi mi?
- [ ] Tüm tool'lar net isim, ayrıntılı açıklama, katı parametre şeması ve tutarlı return formatıyla tanımlı mı?
- [ ] Safety net olarak maksimum iteration sınırı var mı?

**Error Handling**
- [ ] Her tool structured error message döndürüyor mu?
- [ ] Her tool için retry sınırı var mı?
- [ ] Her failure senaryosu için fallback planı var mı?

**Güvenlik**
- [ ] Yüksek riskli işlemler programmatic olarak gate'lenmiş mi?
- [ ] Tüm tool'lar minimum gerekli permission'larla tanımlanmış mı?
- [ ] Delete ve write işlemleri confirmation gate'inin arkasında mı?

**Test**
- [ ] En az 50 farklı sorgu test edildi mi?
- [ ] Boş, bozuk, çelişkili ve adversarial input'lar test edildi mi?
- [ ] External servisler offline olduğundaki durum test edildi mi?

**Observability**
- [ ] Tüm mesajlar, tool call'lar, sonuçlar ve token sayıları structured JSON'da log'lanıyor mu?
- [ ] Herhangi bir agent run'ı yalnızca log'lardan yeniden oluşturulabilir mi?

---

## Sonuç

AI agent kurmak prompt yazmakla ilgili değil. Doğru framework seçmekle de değil.

**Belirsizliği zarif biçimde handle edebilen sistemler tasarlamakla ilgili.**

Model zaman zaman kötü kararlar verecek. Tool'lar fail olacak. Kullanıcılar beklemediğiniz şeyler soracak. Context window'lar dolacak. API'ler çökecek.

Harika agent'lar kuran mühendisler, tüm bunları önceden hesaba katan mühendislerdir. Sadece happy path için değil, failure case'ler için de tasarlarlar. Her layer'a observability eklerler. Amansızca test ederler.

Kötü agent'lar kuran mühendisler ise demoyu çalıştıran ve ship eden'lerdir.

Küçük başlayın. Minimum viable agent'ı kurun. Acımasızca test edin. Her şeyi log'layın — ölçemediğiniz şeyi iyileştiremezsiniz.

"Demo kurdum" ile "production sistemi kurdum" arasındaki uçurum devasa. Gerçek AI mühendisliği tam da o uçurumda yaşıyor.
