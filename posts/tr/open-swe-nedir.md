---
title: "Open SWE: Şirket İçi Kodlama Agentları İçin Açık Kaynak Framework"
date: "2026-03-17"
excerpt: "Stripe, Ramp ve Coinbase kendi iç kodlama agentlarını geliştirdi. LangChain bu sistemlerin ortak mimarisini Open SWE adıyla açık kaynak olarak yayınladı."
tags: ["Open SWE", "LangChain", "Coding Agent", "LangGraph", "Deep Agents", "AI Mühendisliği"]
category: "Teknoloji"
---

Geçtiğimiz yıl birkaç büyük mühendislik organizasyonu, geliştirme ekiplerinin yanında çalışan şirket içi kodlama agentları inşa etti. Stripe **Minions**'ı geliştirdi, Ramp **Inspect**'i kurdu, Coinbase ise **Cloudbot**'u yarattı. Bu sistemlerin ortak noktası mühendislerden yeni bir arayüz benimsemelerini istemiyor olması — Slack, Linear ve GitHub üzerinden mevcut iş akışlarına entegre oluyorlar.

Üç sistem bağımsız geliştirilmiş olsa da benzer mimari kararlarda buluşmuş: izole bulut sandbox'ları, seçilmiş araç setleri, subagent orkestrasyonu ve geliştirici iş akışlarıyla entegrasyon. Bu yakınsama, üretim ortamlarında AI agent deploy etmek için bazı ortak gereksinimlerin var olduğuna işaret ediyor.

LangChain bugün bu pattern'ları özelleştirilebilir bir formda sunan **Open SWE**'yi yayınladı. Deep Agents ve LangGraph üzerine inşa edilen framework, şirket içi kodlama agentı kurmayı değerlendiren ekipler için bir başlangıç noktası sunuyor.

## Üretim Sistemlerindeki Ortak Pattern'lar

Stripe, Ramp ve Coinbase'in bu sistemleri nasıl inşa ettiğine bakıldığında şu mimari kararlar öne çıkıyor:

**İzole çalışma ortamları.** Her görev, sıkı sınırlar içinde tam yetkiye sahip ayrı bir bulut sandbox'ında çalışıyor. Her işlem için onay istemeden komut çalıştırabilirken olası bir hatanın production sistemlere etkisi sıfırlanıyor.

**Seçilmiş araç setleri.** Stripe'ın ekibine göre agentlarının yaklaşık 500 araça erişimi var — ama bunlar zamanla biriktirilmiş değil, özenle seçilmiş ve bakımı yapılmış. Araç kalitesi, araç miktarından daha önemli görünüyor.

**Slack öncelikli tetikleme.** Üç sistem de birincil arayüz olarak Slack'i kullanıyor. Yeni bir uygulama öğrenmek zorunda kalmadan, mevcut iletişim akışı içinde agenti çağırabiliyorsunuz.

**Başlangıçta zengin bağlam.** Agentlar çalışmaya başlamadan önce Linear issue'larından, Slack thread'lerinden veya GitHub PR'larından tam bağlamı çekiyor. Araç çağrıları yerine hazır bağlamla başlamak verimliliği artırıyor.

**Subagent orkestrasyonu.** Karmaşık görevler parçalanarak izole bağlam ve odaklanmış sorumluluklarla çalışan alt agentlara devrediliyor.

## Open SWE'nin Mimarisi

### 1. Agent Harness: Deep Agents Üzerine

Open SWE mevcut bir agentten fork almak ya da sıfırdan inşa etmek yerine Deep Agents framework'ü üzerine kurulu. Ramp'in Inspect'i OpenCode üzerine inşa etmesine benzer bir yaklaşım.

Bu yaklaşımın iki avantajı var. Birincisi **yükseltme yolu** — Deep Agents iyileştikçe (daha iyi bağlam yönetimi, daha verimli planlama, optimize token kullanımı) kendi özelleştirmelerinizi yeniden inşa etmeden bu iyileştirmeleri alabiliyorsunuz. İkincisi **fork etmeden özelleştirme** — organizasyona özgü araçları, prompt'ları ve iş akışlarını core agent mantığına dokunmadan konfigürasyon olarak yönetebiliyorsunuz.

```python
create_deep_agent(
    model="anthropic:claude-opus-4-6",
    system_prompt=construct_system_prompt(repo_dir, ...),
    tools=[
        http_request,
        fetch_url,
        commit_and_open_pr,
        linear_comment,
        slack_thread_reply
    ],
    backend=sandbox_backend,
    middleware=[
        ToolErrorMiddleware(),
        check_message_queue_before_model,
        ...
    ],
)
```

### 2. Sandbox: İzole Bulut Ortamları

Her görev kendi izole bulut sandbox'ında çalışıyor — tam shell erişimine sahip uzak bir Linux ortamı. Repo içeriye klonlanıyor, agent tam yetki alıyor, hatalar o ortamda kalıyor. Open SWE kutudan çıktığı haliyle Modal, Daytona, Runloop ve LangSmith sandbox provider'larını destekliyor. Kendi sandbox backend'inizi de uygulayabiliyorsunuz.

Önemli davranışlar: her conversation thread kalıcı bir sandbox alıyor ve takip mesajlarında yeniden kullanıyor. Sandbox'lar ulaşılamazsa otomatik yeniden oluşturuluyor. Birden fazla görev paralel sandbox'larda çalışıyor.

### 3. Araçlar: Biriktirilmiş Değil, Seçilmiş

Open SWE odaklı bir araç setiyle geliyor. Bunlara ek olarak Deep Agents'ın dahili araçları da mevcut: `read_file`, `write_file`, `edit_file`, `ls`, `glob`, `grep`, `write_todos` ve subagent tetikleyen `task`.

Küçük ve özenle seçilmiş bir araç seti test etmesi, bakımı ve üzerinde muhakeme kurması daha kolay. Organizasyona özgü ek araçlara (internal API'lar, deployment sistemleri, test framework'leri) ihtiyaç duyduğunuzda bunları açıkça ekleyebiliyorsunuz.

### 4. Bağlam Mühendisliği: AGENTS.md + Kaynak Bağlamı

Open SWE iki kaynaktan bağlam topluyor. Reponuzun kökünde bir `AGENTS.md` dosyası varsa sandbox'tan okunup sistem prompt'una enjekte ediliyor — bu dosya her agent çalışmasının uyması gereken convention'ları, test gereksinimlerini ve mimari kararları kodlayabiliyor. Öte yandan görev başlamadan önce Linear issue'sunun veya Slack thread'inin tam içeriği toplanıp agente iletiliyor; ek araç çağrısı olmadan göreve özgü bağlam sağlanıyor.

### 5. Orkestrasyon: Subagentlar + Middleware

İki mekanizma birlikte çalışıyor. **Subagentlar** sayesinde ana agent, `task` aracı aracılığıyla bağımsız alt görevleri kendi middleware yığını, todo listesi ve dosya operasyonlarına sahip izole subagentlara devredebiliyor. **Middleware** ise agent döngüsünün belirli noktalarında deterministik mantık çalıştırıyor: `check_message_queue_before_model` agent çalışırken gelen Linear yorumlarını veya Slack mesajlarını bir sonraki model çağrısından önce enjekte ediyor; `open_pr_if_needed` agent bu adımı tamamlamazsa commit açıp PR oluşturuyor; `ToolErrorMiddleware` araç hatalarını yakalayıp düzgün ele alıyor.

### 6. Tetikleme: Slack, Linear ve GitHub

Slack'te botu herhangi bir thread'de etiketle; `repo:owner/name` sözdizimi hangi repoda çalışacağını belirtiyor ve agent thread içinde durum güncellemeleri ile PR linkleri paylaşıyor. Linear'da herhangi bir issue üzerinde `@openswe` yorumu yap; agent tam issue bağlamını okuyup 👀 ile onaylıyor ve sonuçları yorum olarak gönderiyor. GitHub'da agent tarafından açılan PR'lardaki yorumlarda `@openswe` etiketle; agent review geri bildirimini ele alıp aynı branch'e push ediyor.

### 7. Doğrulama: Prompt Odaklı + Güvenlik Ağları

Agent commit etmeden önce linter, formatter ve testleri çalıştırması için yönlendiriliyor. `open_pr_if_needed` middleware son güvence olarak işlev görüyor — agent PR açmadan bitirirse middleware bunu otomatik hallediyor.

## Neden Deep Agents?

Deep Agents bu mimariyi hem birleştirilebilir hem de sürdürülebilir kılan temeli sağlıyor.

Uzun süreli kodlama görevleri büyük miktarda ara veri üretebiliyor. Deep Agents dosya tabanlı bellek yönetimiyle büyük çıktıları conversation geçmişinde tutmak yerine dışarı aktarıyor — büyük kod tabanlarında bağlam taşmasını önlüyor. `write_todos` aracı karmaşık işleri yapılandırılmış biçimde parçalamak, ilerlemeyi takip etmek ve planları yeni bilgiler geldikçe uyarlamak için kullanılıyor. Ana agent bir subagent oluşturduğunda o subagent kendi izole bağlamını alıyor — farklı alt görevler birbirinin geçmişini kirletmiyor. Middleware sistemi agent döngüsünün belirli noktalarına deterministik mantık enjekte etmeyi sağlıyor. Deep Agents aktif olarak geliştirilen bağımsız bir kütüphane olduğundan bağlam sıkıştırma, prompt önbellekleme ve planlama verimliliğindeki iyileştirmeler kendi özelleştirmelerinizi yeniden inşa etmeden Open SWE'ye akıyor.

## Başlarken

Open SWE şu an GitHub'da mevcut.

Framework MIT lisanslı — fork edebilir, özelleştirebilir, şirket içinde deploy edebilirsiniz.

- Open SWE dene: [github.com/langchain-ai/open-swe](https://github.com/langchain-ai/open-swe)
- Deep Agents: [docs.langchain.com/oss/python/deepagents](https://docs.langchain.com/oss/python/deepagents)
- LangSmith Sandbox'ları: [blog.langchain.com](https://blog.langchain.com/introducing-langsmith-sandboxes-secure-code-execution-for-agents/)
