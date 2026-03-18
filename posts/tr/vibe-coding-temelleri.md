---
title: "Vibe Coding: Fikri Ürüne Dönüştürmenin Yeni Mimarisi"
date: "2026-03-19"
excerpt: "Vibe coding nedir, nasıl çalışır ve production-ready bir uygulama inşa etmek için hangi temelleri bilmek gerekir? Scaffolding'den deployment'a eksiksiz rehber."
tags: ["Vibe Coding", "AI Coding", "Claude Code", "Yapay Zeka", "Uygulama Geliştirme", "Agent SDK", "Deployment", "SaaS", "No-Code", "Yazılım Geliştirme"]
category: "Teknoloji"
---

Andrej Karpathy 2025'in başında bir tweet attı. "Vibe coding" dedi. Doğal dille uygulamayı tanımla, AI yazsın, sen de sadece kabul et ya da reddet.

İnternet biraz güldü. Altı ay sonra ciddiye aldı.

Bugün yüzlerce geliştirici bu yöntemle production'da çalışan, gelir getiren ürünler çıkarıyor. Ama "AI'ya söyle, yaz" kadar basit değil. Arkasında gerçek bir mimari anlayışı var. Hangi aşamada ne yapılır, neden önemlidir, nerede insan müdahalesi şarttır — bunları bilmeden vibe coding bir playground aktivitesinden öteye geçemiyor.

Bu yazı o temelleri kapsıyor.

---

## Vibe Coding Nedir — ve Ne Değildir

Vibe coding, yazılım geliştirme sürecinde doğal dili birincil araç olarak kullanmak demek.

Ne yazmak istediğini söylüyorsun. AI yazıyor. Sen çalışıp çalışmadığını değerlendiriyor, bir sonraki adımı söylüyorsun.

Bu tanım doğru ama eksik. Vibe coding'i playground'dan ayıran şey şu: **sistemin nasıl inşa edileceğini bilmek**. AI'yı orkestra eden, doğru prompt'ları doğru sırada, doğru context ile yazan kişi sensin. Bunu yapamazsan AI seni döngüde döndürür. Aynı hatayı farklı kelimelerle düzeltmeye çalışır durursun.

Yani vibe coding, teknik bilgiyi ortadan kaldırmıyor — teknik bilginin nasıl kullanıldığını değiştiriyor.

---

## Phase 1 — Scaffolding ve Ortam Kurulumu

Her uygulama bir initial prompt ile başlar.

Bu prompt, uygulamanın ne yapacağını, hangi teknoloji stack'ini kullanacağını ve temel iş akışını tanımlar. Ne kadar net olursa, AI'nın ilk pass'i o kadar kullanışlı çıkar. "Bir todo uygulaması yap" ile "Kullanıcıların task oluşturup kategorilere atayabildiği, öncelik sırasına göre sıralayabildiği ve tamamlanan taskları arşivleyebildiği bir web uygulaması yap — React frontend, Node.js backend, PostgreSQL database" arasındaki fark, onlarca geri bildirim turuna eşittir.

İlk scaffold aşamasında çözülmesi gereken en önemli mimari karar **front-end ile back-end ayrımıdır.**

**Front-end** kullanıcının gördüğü katmandır: HTML, CSS, JavaScript, React veya benzeri bir framework. Tarayıcıda çalışır.

**Back-end** sunucu tarafıdır: API endpoints, business logic, authentication, database işlemleri. Kullanıcıdan gizlidir.

Bu ayrım vibe coding'de kritik bir öneme sahip çünkü AI modeli çağrıları her zaman back-end üzerinden yapılmalıdır. API key'leri front-end'e gömmek, kaynak kodunu inceleyen herkesin bu key'e ulaşması demektir. Güvenliğin temel prensibi: hassas veriler hiçbir zaman istemci tarafında yaşamaz.

**Context management** bu aşamada devreye giren bir diğer kavram. AI coding agent'ı (Claude Code, Cursor veya benzeri), tüm konuşma geçmişini bir context window içinde tutar. Bu sayede "şunu düzelt" dediğinde, projenin o anki durumunu ve önceki talimatları referans alarak hareket eder. Context uzadıkça ve karmaşıklaştıkça bu hafıza kirlenebilir — bunu yönetmek, özellikle büyük projelerde süreci etkileyebilen bir beceri.

---

## Phase 2 — Data Persistence ve Kullanıcı Yönetimi

İlk çalışan ekranı gördükten sonra gelen en önemli soru şu olur: veriler nerede yaşıyor?

Stateless bir uygulama — yani sayfayı yenileyince her şeyin sıfırlandığı bir yapı — production'da işe yaramaz. Kullanıcıların hesap açabilmesi, verilerinin kaydedilmesi ve bir dahaki oturumda kaldığı yerden devam edebilmesi için iki şey gerekir: **authentication** ve **database**.

**Authentication (Auth)** kimlik doğrulama mekanizmasıdır. Klasik e-posta/şifre kombinasyonu, Google/GitHub ile OAuth, ya da link tabanlı "magic link" sistemleri bu kategori altında düşünülebilir. Auth, session management'ı da kapsar: kullanıcı giriş yaptıktan sonra her sayfada tekrar kimliğini kanıtlamak zorunda kalmaması için bir token veya session ID üretilir ve bu durum yönetilir.

**Database** verilerin kalıcı olarak depolandığı sistemdir. Vibe coding sürecinde çoğu zaman Supabase, PlanetScale veya Neon gibi managed servisler tercih edilir — kendi sunucunu kurmak yerine hazır bir altyapıya bağlanırsın.

Database'in nasıl yapılandırıldığı **schema** ile belirlenir. Schema, hangi tablonun hangi sütunlara sahip olduğunu, bu sütunların hangi veri türlerini tuttuğunu ve tablolar arasındaki ilişkilerin nasıl tanımlandığını ortaya koyar. Örneğin:

- `users` tablosu: `id`, `email`, `created_at`
- `tasks` tablosu: `id`, `user_id`, `title`, `status`, `due_date`
- `tasks.user_id` → `users.id` ilişkisi (foreign key)

AI'ya "kullanıcılar task oluşturabilsin" dediğinde aslında bu ilişkiyi tanımlamasını istiyorsun. Schema'yı anlamak, AI'nın ne yaptığını takip edebilmeni sağlar.

Son olarak **seed data**: geliştirme sırasında gerçek kullanıcı verisi olmadan UI'ı test etmek için kullanılan yapay verilerdir. Dashboard'unu tasarlarken tablonun boş görünmemesi için birkaç sahte kayıt yüklemek, hem geliştirme deneyimini hızlandırır hem de edge case'leri erken görmenizi sağlar.

---

## Phase 3 — API Entegrasyonu ve Model Yönetimi

Uygulama artık veri saklıyor ve kullanıcıları tanıyor. Şimdi gerçek zamanlı yetenekler eklenecek — bu da external API entegrasyonuna giriyor.

**API (Application Programming Interface)** uygulamanın dış servislerle konuşma protokolüdür. OpenAI GPT'yi kullanmak, Google Gemini'ye istek atmak, Stripe ile ödeme almak — bunların hepsi API aracılığıyla gerçekleşir.

API çağrılarının back-end üzerinden yapılması gerektiğini Phase 1'de belirtmiştik. Bunun pratik nedeni API key güvenliği ama başka bir nedeni de var: rate limiting, caching ve error handling gibi kontrolü back-end'de merkezileştirmek çok daha kolaydır.

Gelişmiş projelerde **multi-model switching** devreye girer. Tek bir AI modeline bağlı kalmak yerine, göreve göre farklı modeller kullanılır: hız gerektiren bir işlem için daha küçük/hızlı bir model, derin analiz gerektiren bir işlem için daha güçlü bir model. Bu seçimi back-end route'ları üzerinden yönetmek, kullanıcıya kesintisiz bir deneyim sunarken altyapıyı esnek tutar.

**Environment variables (ENV)** bu aşamanın en kritik güvenlik pratiğidir. API key'ler, database bağlantı bilgileri ve benzeri hassas veriler asla doğrudan koda yazılmaz. `.env` dosyasında tutulur, `.gitignore` ile repository dışında bırakılır ve production ortamında servis provider'ın (Vercel, Railway vb.) environment variables paneline girilir. Bu basit önlem, kodu paylaşırken veya open source yayınlarken kritik bilgilerin sızdırılmasını önler.

---

## Phase 4 — Agentic Mimari: Uygulamanın "Beyni"

En ileri teknik seviye burası.

Standart bir AI entegrasyonunda akış şöyledir: kullanıcı input girer → uygulama bunu API'ya gönderir → cevap döner → kullanıcıya gösterilir. Bu tek yönlü, stateless bir döngü.

**Agentic mimari** bunu değiştirir. Agent, bir hedefe ulaşmak için bağımsız kararlar alabilir, araçları kullanabilir ve sonuçlara göre bir sonraki adımı planlayabilir.

**Agent loop** bu bağımsız karar alma döngüsüdür:
1. Hedefe bak
2. Hangi tool kullanılacağına karar ver
3. Tool'u çalıştır
4. Sonucu değerlendir
5. Hedefe ulaşıldıysa dur, ulaşılmadıysa 2'ye dön

Bu döngüde kullanılan araçlara **tool** denir. Web araması yapabilmek, dosya okuyup yazabilmek, database'e sorgu çekebilmek, dış API'lara istek atmak — bunların hepsi birer tool'dur. **Claude Agent SDK** gibi framework'ler bu tool'ları tanımlamayı ve agent'a sunmayı kolaylaştırır.

**Agent skills** ise bu tool'ların üzerine inşa edilmiş, daha yüksek seviyeli, tekrar kullanılabilir yeteneklerdir. Örneğin: "Slack'e bildirim gönder" bir skill olabilir. Agent bu skill'i kullanmak istediğinde, skill'in arkasındaki kod Slack API'ını çağırır, mesajı formatlar ve iletir. Skill bir kez tanımlandıktan sonra agent istediği zaman tetikleyebilir.

Bu mimari, uygulamana gerçek anlamda otonom bir arka plan beyni kazandırır.

---

## Phase 5 — Real-time Bağlantılar ve Webhook'lar

Uygulamanızın başka sistemlerle gerçek zamanlı konuşabilmesi için iki temel mekanizma var.

**Webhook**, olay tabanlı bir bildirim sistemidir. Sen bir API'ya "şu olay gerçekleştiğinde beni şu adrese bildir" diyorsun. Olay gerçekleştiğinde, dış servis uygulamanın bir endpoint'ine otomatik olarak HTTP POST isteği atıyor.

Somut örnek: Stripe ile ödeme sistemi kurduğunda, kullanıcı ödeme yaptığında Stripe senin `/webhook/stripe` adresine bir istek atar. Bu isteği yakalayan kod, kullanıcının hesabını premium'a yükseltir. Polling yapmana — "ödeme geldi mi?" diye saniyede bir sorgulamana — gerek kalmaz. Sistem seni bilgilendirir.

**Queue management** ise agent tabanlı sistemlerde devreye girer. Agent bir işlem yaparken gelen yeni istekler bir kuyruğa alınır ve sırayla işlenir. Bu, birden fazla kullanıcının aynı anda istek gönderdiği senaryolarda kaynak çakışmasını önler ve sistemi kararlı tutar.

---

## Phase 6 — Debugging ve İleri Sorun Giderme

Vibe coding sürecinde en çok zaman harcanan yer burasıdır.

AI mükemmel kod üretmez. Üretilen kod çalışmayabilir, beklenmedik edge case'lerde patlayabilir ya da performans sorunları çıkarabilir. Bu aşamada geliştirici, AI'ya ne değiştirmesi gerektiğini anlatan kişidir — ama bunun için önce ne olduğunu anlamak gerekir.

**Logs**, uygulamanın çalışırken arka planda ürettiği kayıtlardır. Bir istek geldiğinde, bir hata oluştuğunda, bir işlem tamamlandığında — bunlar log satırlarına düşer. Problemi anlamak için ilk bakılacak yer burasıdır.

**Debugging** bu logları inceleyerek hatanın kaynağını bulmak ve düzeltmek sürecidir. AI ile çalışırken hata mesajını olduğu gibi kopyalayıp yapıştırmak çoğu zaman işe yarar. Ama daha iyi bir yaklaşım: hatanın hangi koşulda oluştuğunu, hangi input ile tetiklendiğini ve beklenen davranışın ne olduğunu birlikte vermek.

**Hot reloading** geliştirme hızını artıran bir özellik. Kodda değişiklik yapıldığında uygulama state'ini sıfırlamadan tarayıcıda anlık güncellenme sağlar. Küçük bir şey gibi görünür, ama yavaş reload döngüleriyle çalışmak geliştirme motivasyonunu ciddi ölçüde etkiler.

**Clear context** ise AI hafızasını sıfırlamaktır. Uzun bir geliştirme oturumunda context kirlenir: önceki denemeler, düzeltilen ama hâlâ hafızada kalan hatalar, geçersiz hale gelen kararlar. Yeni bir özelliğe geçmeden önce context'i temizlemek, AI'nın önceki gürültüden etkilenmeden taze bir bakışla başlamasını sağlar.

---

## Phase 7 — Deployment ve SaaS Yaşam Döngüsü

Uygulama çalışıyor. Şimdi dünyaya açılma zamanı.

**Deployment** kodun yerel ortamdan (localhost) production sunucusuna taşınması işlemidir. Vercel, Railway, Render gibi platformlar bu süreci birkaç tıkla gerçekleştirmenizi sağlar. GitHub repository'nizi bağlarsınız, her push'ta otomatik deploy tetiklenir.

**Hosting** uygulamanın üzerinde yaşadığı altyapıdır. Sunucu kapasitesi, coğrafi dağılım, uptime garantisi gibi faktörler hosting kararını etkiler. Küçük projeler için serverless platformlar (Vercel, Netlify) yeterlidir. Daha yüksek trafik ve kontrol ihtiyacı için VPS veya container tabanlı çözümler devreye girer.

**Domain management** uygulamanın bir adrese bağlanmasıdır: `uygulama.com`, `app.sirket.com`. DNS kayıtları güncellenerek domain, hosting sağlayıcıya yönlendirilir.

**SaaS (Software as a Service)** bu sürecin son halkasıdır. Uygulamayı bir ürün olarak paketlemek, kullanıcı planları tanımlamak, paywall eklemek ve gelir modeline dönüştürmek. Stripe entegrasyonu, abonelik yönetimi, kullanım bazlı fiyatlandırma — bunlar SaaS yaşam döngüsünün bileşenleridir.

---

## Temeli Bilmeden Orkestra Edilmez

Vibe coding'in popüler anlatısı şöyle: "AI'ya söyle, o yazsın, sen kullan."

Bu anlatı kısmen doğru. Ama üretken vibe coding pratiği şunu gerektiriyor: hangi aşamada ne yapıldığını, neden yapıldığını ve ne zaman müdahale edilmesi gerektiğini bilmek.

Scaffold → Persistence → Integration → Agentic Architecture → Real-time → Debugging → Deployment

Her aşama bir sonrakinin üstüne inşa edilir. Birini atladığında ya da yanlış kurduğunda, birkaç adım sonra çözen bir şeyle karşılaşırsın ve kaynağı bulmak için başa dönmen gerekir.

Vibe coding, yazılım geliştirmeyi demokratikleştiriyor. Ama demokratikleşmesi için önce bu temellerin anlaşılması gerekiyor. AI mükemmel bir çalışma arkadaşı olabilir — ama yönlendirme sende.
