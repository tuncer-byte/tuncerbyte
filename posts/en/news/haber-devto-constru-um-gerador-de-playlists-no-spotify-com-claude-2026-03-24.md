---
title: "Construí um gerador de playlists no Spotify com Claude"
date: "2026-03-24"
excerpt: "Eu queria digitar “noite chuvosa, meio melancólica” e receber uma playlist perfeita. Então eu..."
tags: ["Gündem", "Dev.to", "ai", "ai", "api"]
category: "Gündem"
---

![Construí um gerador de playlists no Spotify com Claude](https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fgsm6huj6mrvze5smiyw8.png)

> **Kaynak:** Dev.to  &nbsp;·&nbsp;  **12 dk okuma**  &nbsp;·&nbsp;  **Yazar:** Leo Garcez

**Eu queria digitar “noite chuvosa, meio melancólica” e receber uma playlist perfeita. Então eu...**

Links:
- [Demo] (https://moodify.com.br)
- [GitHub] (https://github.com/LeoGarcez/moodify)
- [Playlist de exemplo](https://open.spotify.com/playlist/0L2bStHbYyfiGJFZfB1CDO?si=a93194d73eec484c)

Fazer um gerador de playlists que realmente entendesse vibes, não só tags de gênero. Algo tipo: você digita "tarde fria num apartamento vazio" e recebe uma playlist boa de verdade, já salva no seu Spotify.

1. Usuário descreve um humor
2. Claude retorna 50 músicas em JSON
3. App busca cada faixa no Spotify
4. Cria e salva a playlist na conta do usuário

plaintext
Next.js 14 (App Router)
NextAuth v5 beta
Anthropic Claude API (claude-sonnet-4-6)
Spotify Web API
Supabase (PostgreSQL)
TypeScript + Tailwind CSS + Framer Motion

## TL;DR

Escolhi o Claude porque ele tá bem em alta agora e, na prática, é confiável, alucina menos do que eu esperava pra esse tipo de tarefa. Ele é um pouco menos criativo que o GPT nas recomendações, mas compensa sendo mais previsível no formato das respostas, o que importa bastante quando você tá parseando JSON.

Isso me custou algumas horas e sessões de debug. Vou detalhar porque tem várias camadas de problema e você provavelmente vai bater na mesma parede se estiver usando NextAuth v5 com Spotify.

O Spotify [proíbe localhost como redirect URI](https://developer.spotify.com/documentation/web-api/concepts/redirecturi) pra URIs de loopback. A solução é usar 127.0.0.1. Cadastrei http://127.0.0.1:3000/api/auth/callback/spotify no dashboard e setei AUTHURL=http://127.0.0.1:3000 no .env.local.

O Next.js, independente do host que você passa pra next dev -H, normaliza req.url e req.nextUrl.href de volta pra localhost em desenvolvimento. Isso não é bug documentado — é comportamento interno do framework.

## Índice

O NextAuth v5 tem um utilitário chamado reqWithEnvURL que tenta corrigir exatamente isso, mas falha silenciosamente:

ts
// Dentro do next-auth — simplificado
function reqWithEnvURL(req: NextRequest): NextRequest {
  const url = process.env.AUTHURL ?? req.url;
  return new NextRequest(url, req); // ← o construtor normaliza de volta pra localhost
}

Mesmo passando 127.0.0.1 explicitamente, o construtor do NextRequest sobrescreve. A "correção" não funciona.

1. Requisição de autorização — a URL do Spotify onde o usuário loga. O redirecturi aqui vem dos seus params de configuração, então você pode hardcodar 127.0.0.1 na config do provider. Isso funcionou.

## A Ideia

2. Troca de token — quando o Spotify manda o código de volta, o @auth/core envia um POST pra trocar o código por tokens. O redirecturi nessa requisição vem de provider.callbackUrl, que é derivado de params.url.origin — ou seja, da URL da requisição de callback. Se essa URL ainda diz localhost, a troca falha com invalidgrant: Invalid redirect URI.

O sintoma era desconcertante: a URL de autorização mostrava 127.0.0.1 corretamente, mas a troca de token continuava falhando. Fui atrás do código do @auth/core pra entender o que tava acontecendo.

Objetos Request nativos do browser/Node não normalizam URLs. A correção é contornar os route handlers do NextAuth e chamar Auth() do @auth/core diretamente, passando um Request nativo com a URL já corrigida:

ts
// src/app/api/auth/[...nextauth]/route.ts
import { Auth } from "@auth/core";
import { authConfig } from "../../../../../auth";
import { NextRequest } from "next/server";

## A Stack

function buildRequest(req: NextRequest): Request {
  const authOrigin = process.env.AUTHURL ?? http://${req.headers.get("host")};
  const fixedUrl = req.url.replace(/^https?:\/\/[^/]+/, authOrigin);

const hasBody = req.method !== "GET" && req.method !== "HEAD";
  return new Request(fixedUrl, {
    method: req.method,
    headers: req.headers,
    body: hasBody ? req.body : undefined,
    // duplex necessário para streaming de body no Node.js
    ...(hasBody && ({ duplex: "half" } as object)),
  });
}

const handler = (req: NextRequest) =>
  Auth(buildRequest(req), authConfig as Parameters<typeof Auth>[1]);

Versão do @auth/core: ao usar Auth() diretamente, instale a versão exata que o next-auth usa internamente:

## O Problema de Trabalhar com OAuth Localmente

bash
npm ls @auth/core  # veja qual versão o next-auth requer
npm install @auth/core@0.41.0 --save-exact

Configuração explícita no auth.ts: ao contornar os handlers do NextAuth, setEnvDefaults não roda mais. Configure basePath, secret e redirecturi explicitamente:

ts
// auth.ts
export const authConfig: NextAuthConfig = {
  trustHost: true,
  basePath: "/api/auth",
  secret: process.env.AUTHSECRET,
  providers: [
    Spotify({
      clientId: process.env.AUTHSPOTIFYID,
      clientSecret: process.env.AUTHSPOTIFYSECRET,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: SPOTIFYSCOPES,
          showdialog: true,
          redirecturi: ${process.env.AUTHURL}/api/auth/callback/spotify,
        },
      },
    }),
  ],
  // ... callbacks e pages como antes
};

Mesmo com tudo acima, pode acontecer mais uma falha: se o usuário acessa http://localhost:3000, o navegador seta o cookie PKCE pro domínio localhost. Quando o Spotify redireciona de volta pra http://127.0.0.1:3000/..., o navegador não envia o cookie — domínios diferentes — e o codeverifier some. A troca falha de novo.

## O Spotify não aceita `localhost`

A correção é garantir que localhost:3000 nunca apareça pro usuário, redirecionando via next.config.mjs:

js
async redirects() {
  return [
    {
      source: "/:path",
      has: [{ type: "host", value: "localhost:3000" }],
      destination: "http://127.0.0.1:3000/:path",
      permanent: false,
    },
    {
      source: "/",
      has: [{ type: "host", value: "localhost:3000" }],
      destination: "http://127.0.0.1:3000/",
      permanent: false,
    },
  ];
},

Com isso, todo o fluxo de auth fica em 127.0.0.1 e os cookies PKCE chegam onde precisam chegar.

A migração /tracks → /items está documentada, mas é fácil de perder se você seguiu um tutorial de 2022. Audio features e recomendações sumindo foi mais chato — tive que construir contexto de energia de outra forma, mais sobre isso abaixo.

## O `NextRequest` normaliza URLs pra `localhost`

Tem uma limitação que eu não vi muito discutida: no modo de desenvolvimento, o Spotify permite apenas 5 usuários autenticados E eles precisam ser adicionados manualmente via allowlist no dashboard.

Pra ir além disso, você precisa solicitar Extended Quota Mode. E o processo atual é bem pesado:

Na prática, isso significa que se você tá construindo algo novo como indie dev, vai ficar travado em modo de desenvolvimento. Você consegue testar e mostrar pra até 4 pessoas além de você — e só. Vale saber disso antes de planejar algum lançamento público.

O system prompt instrui o Claude a retornar apenas um array JSON, sem markdown, sem explicações. Essa parte é direta. O problema mais difícil é conseguir 50 faixas que realmente existam.

## Dois momentos onde o redirect URI importa

Incluir uma conversa de exemplo completa (usuário + assistente) antes do request real reduziu bastante os erros de formato, especialmente com artistas não-ingleses:

ts
messages: [
  {
    role: "user",
    content: "Create a playlist for this mood/vibe: late night drive, nostalgic",
  },
  {
    role: "assistant",
    content: JSON.stringify([
      { title: "Drive", artist: "The Cars", reason: "Synth-pop clássico com energia perfeita de madrugada" },
      { title: "Running Up That Hill", artist: "Kate Bush", reason: "Art-pop etéreo, emocionalmente assombroso" },
      // ...
    ]),
  },
  { role: "user", content: actualUserMessage },
],

Mesmo com prompting cuidadoso, modelos eventualmente jogam texto de introdução. Sempre extraia o array:

ts
const match = raw.match(/\[[\s\S]\]/);
if (!match) throw new Error("Nenhum array JSON encontrado");
const suggestions = JSON.parse(match[0]);

## A solução: `Auth()` direto com `Request` nativo

Descobri que quanto mais músicas você pede, mais o modelo inventa títulos.

Pedindo 70 músicas, o Claude começa a criar faixas com nomes plausíveis que não existem. Com 50 e restrições explícitas, fica bem melhor.

plaintext
EXISTÊNCIA NO SPOTIFY — CRÍTICO:
Cada música DEVE existir no Spotify. Antes de incluir uma faixa, pergunte:
"Tenho certeza que esta música existe no Spotify com este título e artista exatos?"
Se houver qualquer dúvida, escolha outra música que você tem certeza.

REGRAS DE FORMATO DO TÍTULO:
- Use apenas o título canônico limpo do lançamento
- SEM sufixos: sem "- Remastered", "- Live at...", "- Radio Edit"
- Use o nome do lançamento mais conhecido, não compilações

## Bônus: problema de domínio do cookie PKCE

ARMADILHAS COMUNS DE ALUCINAÇÃO:
- Não invente títulos de músicas que parecem plausíveis mas podem não existir
- Não confunda dois artistas com nomes similares
- Não sugira deep cuts que você não tem certeza

Também removi a abordagem de duas etapas "gerar 70, refinar pra 50". Era cara em tempo e custo, e uma única geração de 50 com boas instruções performa melhor.

Each item:
- "title": string — the canonical Spotify title, nothing else
- "artist": string — the primary artist exactly as listed on Spotify
- "reason": string — max 10 words

SPOTIFY EXISTENCE — CRITICAL:
Every song MUST exist on Spotify. Before including a track, ask yourself:
"Am I certain this song exists on Spotify under this exact title and artist?"
If there is any doubt, pick a different song you are certain about.

## Endpoints Deprecated do Spotify

TITLE FORMAT RULES:
- Use the clean, canonical release title only
- NO suffixes: no "- Remastered", "- Live at...", "- Radio Edit", "- feat. X"
- NO parentheticals unless part of the official title
- Use the most well-known release name, not compilations or bonus versions

COMMON HALLUCINATION TRAPS TO AVOID:
- Do not invent song titles that sound plausible but may not exist
- Do not confuse two artists with similar names
- Do not suggest deep cuts you are uncertain about
- Do not suggest songs only released in specific regions unavailable globally

DISTRIBUTION:
- 50% recognizable hits (high confidence they exist)
- 40% lesser-known but confirmed tracks
- 10% deep cuts you are fully certain about

DIVERSITY:
- At least 2 genres
- At least 3 decades
- Non-English tracks welcome if you are certain they are on Spotify

## Spotify em Produção

Curiosidade: o prompt tá em inglês mesmo que o usuário escreva em português. O Claude entende o humor no idioma que vier e retorna os dados no formato esperado sem problema.

Mesmo com um bom prompt, algumas faixas voltam com títulos ou artistas levemente errados. Três ajustes no lado da busca:

1. Buscar 10 candidatos em vez de 1
Em vez de limit=1, buscar limit=10 e escolher o melhor match.

2. Filtro de popularidade
Pular resultados com popularity < 30 — evita gravar versões ao vivo obscuras quando a faixa correta não é encontrada:

## Fazendo o Claude Obedecer

ts
const POPULARITYFLOOR = 30;
const aboveFloor = candidates.filter(t => t.popularity >= POPULARITYFLOOR);
const pool = aboveFloor.length > 0 ? aboveFloor : candidates;

3. Fuzzy matching + seleção por popularidade
Normalizar strings e verificar correspondência bidirecional de substring, depois escolher o match com maior popularidade:

ts
function fuzzyMatch(candidate: SpotifyTrack, suggestion: ClaudeTrackSuggestion): boolean {
  const trackName = normalizeStr(candidate.name);
  const artistName = normalizeStr(candidate.artists[0]?.name ?? "");
  const sugTitle = normalizeStr(suggestion.title);
  const sugArtist = normalizeStr(suggestion.artist);
  const titleMatch = trackName.includes(sugTitle) || sugTitle.includes(trackName);
  const artistMatch = artistName.includes(sugArtist) || sugArtist.includes(artistName);
  return titleMatch && artistMatch;
}

Playlists geradas por IA alucinam mais quando o humor é específico de artista — tipo "algo como Radiohead". Nesses casos, o grafo de artistas do próprio Spotify é mais confiável que o Claude.

## One-shot prompting

Adicionei detecção automática: uma chamada rápida ao Claude Haiku (~0,5s) classifica o prompt antes da geração principal:

ts
// Retorna { mode: "ai" | "related", artists: ["Radiohead", "Nick Cave"] }
const detected = await detectPlaylistMode(mood);

Se artistas são detectados, o app:
1. Os resolve no Spotify
2. Busca artistas relacionados (GET /artists/{id}/related-artists)
3. Pega top tracks de cada artista relacionado
4. Monta uma playlist com dados reais do Spotify, sem depender do Claude pra nada

ts
if (detected.mode === "related" && detected.artists.length > 0) {
  const { suggestions, resolvedSeeds } = await buildRelatedArtistsPlaylist(
    detected.artists,
    accessToken,
    energy
  );
  if (suggestions.length > 0) {
    return NextResponse.json({ suggestions, mode: "related", seedArtists: resolvedSeeds });
  }
  // fallthrough para modo AI se não encontrou nada
}

## Extração de JSON como fallback

O app deixa usuários escolher uma playlist de referência ou seus top artistas do Spotify (último mês / 6 meses / histórico completo). Esse contexto é passado pro Claude como uma impressão digital musical.

Mandar nomes de faixas brutos confunde o modelo. Em vez disso, agregue num perfil:

ts
// Contar frequência de artistas em todas as faixas da playlist
const artistFreq = new Map<string, { name: string; count: number }>();
for (const track of tracks) {
  const a = track.artists[0];
  const prev = artistFreq.get(a.id);
  artistFreq.set(a.id, { name: a.name, count: (prev?.count ?? 0) + 1 });
}

Pra playlists, também busco dados de gênero dos artistas principais via GET /artists/{id} (5 chamadas paralelas), já que os itens de playlist não retornam gêneros nativamente.

## Prompt Engineering Anti-Alucinação

Mesmo sem seleção de referência explícita, o app passa os top artistas e gêneros baseline do usuário como contexto suave pra cada geração.

A instrução no prompt mudou de "não recomende esses artistas" pra algo mais útil:

plaintext
→ Biase as recomendações em direção a este DNA musical: tempo, humor e estilo de produção similar.
→ Descubra artistas com som SIMILAR — não necessariamente os mesmos artistas.
→ NÃO repita faixas já listadas acima.

O fluxo original: buscar todas as 50 faixas em paralelo, retornar tudo de uma vez, mostrar um spinner.

## O system prompt atual completo

O problema é que o usuário ficava olhando "Salvando no Spotify..." por 5-10 segundos sem nenhum feedback. Server-Sent Events resolve isso — cada faixa é emitida conforme resolve:

ts
// Na rota da API
const stream = new ReadableStream({
  async start(controller) {
    const send = (data: object) =>
      controller.enqueue(encoder.encode(data: ${JSON.stringify(data)}\n\n));

await Promise.all(
      suggestions.map(async (suggestion) => {
        const track = await searchTrack(suggestion, accessToken);
        if (track) {
          foundTracks.push({ track, suggestion });
          send({ type: "track", track, suggestion }); // emitido imediatamente
        }
      })
    );

// Criar playlist depois que todas as buscas terminam
    const playlist = await createPlaylist(...);
    send({ type: "done", playlist, found: foundTracks.length });
    controller.close();
  },
});

## Melhor resolução de busca no Spotify

return new Response(stream, {
  headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
});

A busca paralela continua na velocidade máxima. Mas agora o cliente vê cada faixa aparecer com album art conforme resolve, com uma barra de progresso ao vivo — em vez de um spinner em branco por 10 segundos.

Sobre prompt engineering:
- Menos é mais (50 > 70)
- Exemplos one-shot (par de mensagens usuário + assistente) são mais confiáveis que instruções de formato detalhadas.
- Dizer o que não fazer funciona muito bem
- Contexto de perfil funciona melhor como guia de DNA musical, não como lista de restrições.

Sobre a API do Spotify:
- Sempre verifique se o endpoint ainda é atual. /tracks → /items, audio features sumiu, recomendações sumiram.
- GET /artists/{id}/related-artists funciona bem pra descoberta e quase ninguém usa.
- O score de popularidade nas faixas é um bom proxy pra "essa faixa existe como esperado."

## Modo Related Artists

Sobre streaming no Next.js:
- ReadableStream + text/event-stream funciona limpo no App Router.
- Promise.all + emit-on-resolve te dá paralelismo real com UI progressiva de graça.

Sobre Next.js + OAuth:
- NextRequest normaliza URLs pra localhost em desenvolvimento, mesmo que você passe 127.0.0.1 explicitamente. Use Request nativo quando a URL importa.
- O NextAuth v5 tem um utilitário reqWithEnvURL que tenta corrigir isso mas usa new NextRequest() internamente — que normaliza de novo. A correção do framework não funciona.
- O OAuth tem dois momentos onde o redirecturi é verificado: na requisição de autorização e na troca de token. Você precisa garantir que os dois mostrem 127.0.0.1.
- provider.callbackUrl é derivado da URL da requisição de callback — não da sua config. Se a URL da requisição ainda diz localhost, a troca falha com invalidgrant.
- Ao usar Auth() do @auth/core diretamente, pin a versão exata que o next-auth requer. Versões diferentes causam conflitos de tipo em runtime.
- Cookies PKCE são scopados por domínio. Se o usuário começa em localhost e o callback chega em 127.0.0.1, o codeverifier some. Redirecione todo o tráfego de localhost pra 127.0.0.1 no next.config.mjs.
- NextAuth v5 é poderoso mas a documentação beta é bem escassa. Ler o código-fonte do @auth/core foi necessário pra entender o que estava acontecendo.

O app se chama Moodify. Está OpenSource no [GitHub] (https://github.com/LeoGarcez/moodify). Se você tá fazendo algo parecido, espero que ajude um pouco.

Como vocês melhorariam esse prompt? Se alguém já passou por algo parecido ou tiver ideias, comenta aí

## Construindo o Perfil Musical

Construído com Next.js, Claude API, Spotify Web API e Supabase. Deploy no Vercel.

## Streaming com SSE

## O Que Aprendi

## Teste Você Mesmo

---

[Orijinal makaleyi oku →](https://dev.to/leugarcez/construi-um-gerador-de-playlists-no-spotify-com-claude-18ge)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._