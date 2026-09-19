---
title: "Fintech Alanında Jev Kullanımı: Uygulama Alanları, Riskler ve Open Source Alternatifler"
date: "2026-09-19"
excerpt: "Jev'in payment, fraud, AML, KYC ve customer operations alanlarında nerede değer üretebileceğini; ne zaman kullanılmaması gerektiğini, risk/reward dengesini ve open source bir alternatif için gereken architecture'ı inceliyoruz."
tags: ["Jev", "Fintech", "Fraud Detection", "AML", "KYC", "Model Risk", "Open Source AI", "System One Model", "MLOps"]
category: "Teknik"
---

Önceki yazıda [TypeSafe AI ve Jev'in ne olduğunu](/tr/blog/typesafe-ai-jev-nedir-system-one-modeli) incelemiştik. Kısa hatırlatma: Jev, uzun metin üretmek yerine bir durum hakkında **typed decision**, **probability distribution** ve **confidence score** döndüren TypeSafe AI modelidir. Resmî dokümantasyondaki üç primitive `Noul` (0-1 arası truth value), `Choice` (fixed options arasından seçim) ve `Score` (tanımlı rubric'e göre puanlama) olarak geçer.

Bu yapı fintech için çekici görünür. Çünkü ödeme sistemlerinde kararların büyük bölümü bir paragraf yazmayı değil, milisaniyeler içinde şu sorulardan birini yanıtlamayı gerektirir:

- Bu transaction step-up authentication gerektiriyor mu?
- Bu alarm hangi inceleme kuyruğuna gitmeli?
- Bu belge hangi KYC sınıfına ait?
- Bu destek talebinin konusu ve önceliği ne?

Fakat finansal sistemlerde **hızlı karar**, tek başına **güvenli karar** demek değildir. Jev'i doğru konuma yerleştirmek için model çıktısı ile iş kararını birbirinden ayırmak gerekir.

> **Kısa cevap:** Jev; fraud, AML, KYC ve operations ekiplerinin önünde çalışan low-latency bir `triage`, `routing` veya `gating` layer olabilir. Credit rejection, account closure, suspicious transaction report ya da transfer'i geri döndürülemez biçimde durdurma gibi high-impact kararların tek decision maker'ı olmamalıdır.

![Jev tabanlı fintech decision pipeline: transaction data, deterministic rules, Jev evaluation ve üç farklı action path](/images/posts/jev-fintech/decision-pipeline.svg)

---

## 1. Jev Fintech'te Hangi Pozisyonda Durmalı?

Jev'i bir fraud engine'in, credit scoring model'in veya AML platformunun tamamı gibi düşünmek hatalıdır. Daha doğru konum, mevcut kontroller arasında çalışan **semantic decision layer**'dır.

Bir üretim hattında sorumluluklar şöyle ayrılabilir:

1. **Deterministic rules:** Regulatory limit, sanctions list matching, balance, signature ve schema validation gibi kesin kontrolleri yapar.
2. **Specialized models:** Transaction graph, device signal veya time series üzerinde eğitilmiş fraud/credit modelleri sayısal risk üretir.
3. **Jev decision model:** Açıklama, support message, merchant bilgisi ve alert context gibi semi-structured data'yı classify eder; uncertainty bilgisini döndürür.
4. **Policy engine:** Model probabilities, amount, customer segment ve regulatory rules değerlerini birleştirerek action'ı belirler.
5. **Human review:** Uncertain, high-impact veya appeal edilebilir kararları ele alır.

Bu ayrım kritiktir: **model bir signal üretir, policy engine karar verir.** Böylece model version değiştiğinde business rules görünmez biçimde değişmez.

## 2. Kullanım Alanları: Nerede, Ne Zaman, Nasıl?

| Alan | Jev'in görevi | Uygun primitif | Ne zaman kullanılmalı? | Son karar |
|---|---|---|---|---|
| Card/payment fraud | Alert prioritization, transaction description classification | `Noul` + `Score` | Rules ve fraud model sonrasında ek semantic signal gerektiğinde | Policy engine / analyst |
| AML transaction monitoring | False-positive azaltma, alert queue seçimi | `Choice` + `Score` | Case context kısa ve categories fixed olduğunda | AML analyst |
| KYC/KYB | Document type, missing document ve review routing | `Choice` + `Noul` | OCR sonrası doğrulanabilir classification'da | KYC specialist / rule |
| Customer operations | Topic, urgency, complaint ve chargeback routing | `Choice` + `Score` | Yüksek hacimli ticket flow'da | Operations rule |
| Merchant onboarding | Business model ve prohibited activity signal | `Choice` + `Noul` | Website/description gibi textual context'te | Risk team |
| Credit application | File completeness veya manual review routing | `Noul` + `Choice` | Preparatory ve reversible task'lerde | Authorized scoring system / human |
| Transaction categorization | Merchant veya spend category | `Choice` | Fixed category set ve ölçülebilir error cost varsa | Automated, reversible |

### Fraud ve ödeme güvenliği

Jev'in en doğal rolü, mevcut fraud skoruna **metinsel ve bağlamsal bir ikinci görüş** eklemektir. Örneğin chargeback açıklaması, merchant adı, cihaz değişikliği özeti ve işlem geçmişinden üretilmiş kısa bir durum nesnesi aynı değerlendirmede kullanılabilir.

Burada iki kural uygulanmalıdır:

- Kart numarası, kimlik numarası veya ham cihaz izi gibi gereksiz kişisel veriyi modele göndermeyin; tokenleştirilmiş ve amaca uygun özellikler kullanın.
- “Fraud mu?” gibi birleşik bir soru yerine atomik sorular sorun: “Hesap ele geçirme sinyali var mı?”, “Merchant açıklaması işlem davranışıyla çelişiyor mu?” ve “Manuel inceleme önceliği nedir?”

### AML alarm önceliklendirme

AML sistemlerinde Jev; alarmı `structuring`, `rapid_movement`, `mule_activity`, `sanctions_context` veya `other` gibi kapalı bir tip kümesine yönlendirebilir. Ancak model çıktısı, doğrudan şüpheli işlem bildirimi oluşturmak veya vakayı kapatmak için yeterli kanıt değildir.

Doğru pattern şudur: Jev alert'i enrich eder ve rank eder; case management system evidence'ları korur; authorized analyst kararı verir. Böylece hız artarken explainability ve audit trail kaybolmaz.

### KYC ve KYB operasyonları

OCR ile çıkarılan belge metninin pasaport, vergi levhası, faaliyet belgesi veya adres kanıtı olarak sınıflandırılması; eksik sayfa ya da tutarsız alan sinyali üretilmesi iyi adaylardır. Buna karşılık kimlik doğrulamanın tamamını tek bir genel amaçlı karar modeline bırakmak uygun değildir. Belge güvenlik özellikleri, biyometri ve yaptırım kontrolleri kendi doğrulanmış sistemlerinde kalmalıdır.

### Kredi ve limit kararları

Creditworthiness, bireyin temel bir financial service'e erişimini etkiler. AB AI Act, gerçek kişilerin creditworthiness değerlendirmesinde kullanılan sistemleri belirli istisnalar dışında high-risk sayar. Bu nedenle Jev burada file completeness, product routing veya human review gereksinimi gibi **preparatory tasks** için kullanılmalıdır.

Modelin tek başına credit rejection, limit reduction veya pricing yapması; right to explanation, bias testing, data governance ve human oversight bakımından ciddi risk doğurur.

## 3. Confidence Score Nasıl Action'a Dönüşür?

Tek bir sabit eşik her işlem için doğru değildir. Eşik, hatanın maliyetine göre belirlenmelidir. Basit karar teorisiyle otomasyon ancak beklenen kayıp kabul edilebilir düzeydeyse çalıştırılır:

$$
L(a \mid x) = \sum_y P(y \mid x) \cdot C(a, y)
$$

Burada $P(y \mid x)$ model probability, $C(a,y)$ ise seçilen action yanlış olduğunda oluşacak cost'tur. 20 TL'lik bir transaction'ı gereksiz review'a göndermek ile maaş hesabını yanlışlıkla block etmek aynı threshold ile yönetilemez.

Örnek bir politika:

```typescript
type ReviewAction = "allow" | "step_up" | "manual_review";

function decidePaymentAction(
  fraudProbability: number,
  confidence: number,
  amount: number,
): ReviewAction {
  if (confidence < 0.88) return "manual_review";
  if (amount >= 50_000) return "manual_review";
  if (fraudProbability >= 0.93) return "step_up";
  if (fraudProbability <= 0.08 && confidence >= 0.97) return "allow";
  return "manual_review";
}
```

Bu örnekte model, doğrudan “payment reject” yetkisine sahip değildir. Low confidence veya high amount human review'a gider; high risk ise reversible bir step-up authentication başlatır.

## 4. Fintech İçin Önerilen Production Architecture

![Fintech için Jev reference architecture: data minimization, parallel decisions, policy engine, human review ve monitoring loop](/images/posts/jev-fintech/reference-architecture.svg)

Sağlam bir entegrasyonun yedi bileşeni vardır:

1. **Data minimization layer:** PII masking, tokenization, permission control ve feature contract uygular.
2. **Rule engine:** Regulatory ve deterministic kontrolleri model call'dan önce çalıştırır.
3. **Atomic questions:** Her biri tek bir olguyu ölçen `Noul`, `Choice` ve `Score` soruları parallel evaluation ile çalışır.
4. **Policy engine:** Model output'u customer impact ve error cost ile birleştirir.
5. **Fallback:** Low confidence durumunu specialized model'e veya authorized human'a route eder.
6. **Immutable audit trail:** Input feature version, model version, question version, probabilities, decision ve override reason saklanır.
7. **Feedback pipeline:** Kesinleşen fraud, chargeback ve analyst decisions calibration ve drift measurement'a döner.

### Shadow Mode'dan Production'a Geçiş

Jev ilk günden karar hattına bağlanmamalıdır. Önerilen geçiş sırası:

1. **Offline backtest:** Time-based split uygulanmış data üzerinde mevcut sistemle karşılaştırın.
2. **Shadow mode:** Üretim trafiğini aksiyon almadan değerlendirin.
3. **Champion/challenger:** Jev'i mevcut modelin karşısında sınırlı segmentte ölçün.
4. **Düşük etkili otomasyon:** Sadece kuyruk seçimi veya etiketleme gibi geri döndürülebilir işlemleri açın.
5. **Kademeli kapsam:** Kalibrasyon, adalet ve operasyon metrikleri stabil kaldıkça kapsamı artırın.

Başarı metriği yalnızca accuracy olmamalıdır. En az şu metrikler segment bazında izlenmelidir:

- Precision, recall, false-positive rate ve false-negative rate
- Brier skoru ve Expected Calibration Error (ECE)
- Manual review rate ve analyst başına handling time
- Fraud loss, chargeback ve false block cost
- Language, country, product ve customer segment bazında performance gap
- Drift, fallback oranı, gecikme ve servis erişilebilirliği

## 5. Ne Zaman Jev Kullanılmamalı?

Jev'in tipli çıktı vermesi, çıktının otomatik olarak doğru, adil veya mevzuata uygun olduğu anlamına gelmez. Şu durumlarda farklı bir çözüm seçilmelidir:

- Exact math, balance, limit veya regulatory rule gerekiyorsa deterministic code kullanın.
- Long-form reasoning, evidence synthesis veya explanation gerekiyorsa expert system, analyst ya da rationale üretebilen bir model kullanın.
- Real-time latency budget bir network call'u dahi kabul etmiyorsa local, task-specific model kullanın.
- Decision irreversible ve birey üzerinde high-impact ise Jev'i yalnızca auxiliary signal olarak tutun.
- Gerekli data third-party service'e gönderilemiyorsa on-prem deployment seçeneği olmadan kullanmayın.
- Yeni country, yeni fraud pattern veya underrepresented segment için yeterli validation data yoksa automation'ı kapalı tutun.

## 6. Risk/Reward Analysis

| Boyut | Potansiyel getiri | Temel risk | Kontrol |
|---|---|---|---|
| Speed | High-volume, low-latency triage | Network latency ve service outage | Timeout, circuit breaker, local fallback |
| Cost | Büyük generative modellere göre düşük inference cost | Volume büyüdükçe vendor dependency | Unit economics test, budget limit |
| Structured output | Parser ve malformed JSON ihtiyacını azaltır | Schema doğru olsa da decision yanlış olabilir | Calibration ve task-based testing |
| Confidence score | Risk-based escalation sağlar | Confidence, distribution shift durumunda bozulabilir | Segment-based calibration ve drift alert |
| Operations | Analyst queue'yu azaltabilir | Automation bias | Mandatory override, sample audit |
| Data | Textual context'i kullanır | PII leakage, secondary use | Data minimization, masking, contract |
| Vendor | Hızlı integration | Closed weights, version ve pricing risk | Model abstraction, exit plan, shadow model |

En önemli risklerden biri **calibration'ın portable sanılmasıdır**. Sağlayıcının genel benchmark'ında `%95` confidence gösteren bir output, sizin Türkiye'deki KOBİ merchant data'nızda aynı accuracy'yi göstermeyebilir. Calibration her task, country, language ve time window için local data ile yeniden ölçülmelidir.

Bir başka risk **otomasyon yanlılığıdır**. Arayüz analiste yalnızca model kararını gösterirse insan, modeli doğrulayan bir operatöre dönüşür. Bunun yerine kanıtlar önce, model önerisi sonra gösterilebilir; override kolay olmalı ve override gerekçeleri izlenmelidir.

## 7. Open Source Bir Alternative İçin Neler Gerekir?

Jev'in resmî sitesi ürünü bir API ve early access service olarak sunuyor; model weights, training data ve RLCD implementation details yayımlanmış değil. Bu nedenle bugün birebir Jev clone yapmak mümkün değildir. Fakat aynı **functional contract** open source components ile kurulabilir.

### Minimum teknik mimari

| Layer | Requirement | Olası open source approach |
|---|---|---|
| Encoder | Metin ve yapılandırılmış bağlamı temsil etme | BERT/DeBERTa sınıfı encoder veya küçük açık ağırlıklı model |
| Karar başlıkları | Boolean, kategorik ve sıralı çıktı | Binary head, softmax head, ordinal regression head |
| Kalibrasyon | Olasılıkları gerçek başarıyla hizalama | Temperature scaling, isotonic regression, Platt scaling |
| Uncertainty | Out-of-distribution input'u fark etme | Ensemble, conformal prediction, abstention head |
| Serving | Düşük gecikmeli inference | ONNX Runtime, TensorRT veya vLLM tabanlı servis |
| Contract | Type-safe API | JSON Schema/OpenAPI + generated SDKs |
| Observability | Drift, quality ve cost tracking | OpenTelemetry + model monitoring stack |

Modelden daha zor olan parça **veri ve yönetişimdir**. Gerçek bir alternatif için şunlar gerekir:

- Fraud, AML, KYC ve operasyon görevleri için zaman damgalı, lisanslı ve temsil gücü yüksek veri
- Chargeback outcome, analyst decision veya verified identity gibi güvenilir ground truth
- Etiket tanımı, anlaşmazlık çözümü ve çift kör kalite kontrolü
- Customer ve time leakage'i engelleyen time-based train/validation/test split
- Country, language, product ve demographic group bazında bias evaluation
- Model card, data sheet, SBOM, open source license ve reproducible training pipeline
- Independent model validation team ve post-production incident process

### Eğitim hedefi

Sadece cross-entropy ile yüksek accuracy elde etmek yeterli değildir. Amaç; ayrım gücü, kalibrasyon ve gerektiğinde karar vermeme davranışını birlikte optimize etmektir:

$$
\mathcal{L} = \mathcal{L}_{task} + \lambda_{cal}\mathcal{L}_{calibration} + \lambda_{abs}\mathcal{L}_{abstention}
$$

Burada `abstention`, modelin belirsiz örnekleri insana bırakabilmesidir. Finansal kullanımda iyi model her soruya cevap veren değil, **hangi soruda susacağını bilen** modeldir.

### Ekip ve altyapı

Bir proof of concept için ML engineer, backend engineer ve domain expert yeterli olabilir. Production system için bunlara data engineer, MLOps/platform engineer, model validation, security, privacy ve compliance sorumluları eklenmelidir. Ayrıca GPU training, secure data lake, feature registry, experiment tracking, model registry, canary deployment ve 7/24 observability gerekir.

“Open source” yalnızca GitHub'a inference code koymak değildir. Kullanıcının modeli inceleyebilmesi ve sürdürebilmesi için weights, architecture, usage terms, evaluation results ve mümkün olan ölçüde data provenance açıklanmalıdır.

## 8. Regulation ve Model Risk Management

AB AI Act 2 Ağustos 2026'dan itibaren genel olarak uygulanıyor. Creditworthiness ve life/health insurance risk assessment gibi bazı financial use case'ler high-risk kapsamındadır. High-risk systems için risk management, data governance, technical documentation, logging, human oversight, accuracy, robustness ve cybersecurity yükümlülükleri bulunur. Open source kullanmak, high-risk bir deployment'ın sorumluluğunu ortadan kaldırmaz.

ABD Federal Reserve ve OCC'nin SR 11-7 model risk yaklaşımı da iki temel kaynağa dikkat çeker: modelin temel tasarım hataları ve modelin yanlış/uygunsuz kullanımı. Sağlam geliştirme, bağımsız validation ve güçlü yönetişim birlikte gereklidir.

NIST AI RMF ise süreci dört sürekli fonksiyonla çerçeveler: **Govern, Map, Measure, Manage**. Jev entegrasyonuna uyarlarsak:

- **Govern:** Owner, approval authority, risk appetite ve override authority tanımla.
- **Map:** Affected customers, failure scenarios ve data flow'u çıkar.
- **Measure:** Calibration, fairness, security, drift ve business impact'i test et.
- **Manage:** Threshold, fallback, incident, rollback ve revalidation süreçlerini işlet.

Bu yazı hukuki tavsiye değildir; ülke, ürün ve lisans türüne göre yetkili hukuk ve uyum ekipleriyle değerlendirme yapılmalıdır.

## 9. Uygulama Kontrol Listesi

- [ ] Use case tek ve atomic bir decision'a indirgenebiliyor mu?
- [ ] Model output ile final business decision ayrıldı mı?
- [ ] False-positive ve false-negative cost tanımlandı mı?
- [ ] PII minimization ve data processing basis belirlendi mi?
- [ ] Local data üzerinde calibration ve segment tests yapıldı mı?
- [ ] Low confidence, outage ve drift için fallback var mı?
- [ ] Model, question, feature ve policy versions loglanıyor mu?
- [ ] Human override authority gerçek ve kullanılabilir mi?
- [ ] Appeal, explanation ve decision correction process var mı?
- [ ] Vendor change veya on-prem alternative'a geçiş planlandı mı?

## Sonuç

Jev'in fintech'teki değeri, core banking system'i ya da fraud platform'unu değiştirmesinde değil; high-volume decision flow'ların önüne hızlı, typed ve uncertainty-aware bir layer eklemesindedir. En yüksek reward; ticket routing, document classification, alert prioritization ve reversible step-up authentication gibi alanlarda elde edilir.

Doğru architecture **Jev → decision** değildir. Doğru architecture **data minimization → rules and models → Jev signal → policy engine → human/fallback → continuous measurement** şeklindedir. Open source alternative geliştirmek de yalnızca model training değil; calibration, data governance, independent validation, low-latency serving ve auditable operations system kurmaktır.

---

## Kaynaklar

- [TypeSafe AI — Jev ve System One Models](https://typesafe.ai/)
- [TypeSafe AI Documentation — Introduction](https://docs.typesafe.ai/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [European Union — AI Act, Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng)
- [Federal Reserve — SR 11-7: Guidance on Model Risk Management](https://www.federalreserve.gov/supervisionreg/srletters/sr1107a1.pdf)
- [OCC — Model Risk Management, Bulletin 2011-12](https://www.occ.treas.gov/news-issuances/bulletins/2011/bulletin-2011-12.html)

*Son güncelleme: 19 Eylül 2026. Ürün özellikleri ve mevzuat değişebileceği için üretim kararı öncesinde güncel resmî kaynakları kontrol edin.*