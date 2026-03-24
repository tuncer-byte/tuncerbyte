---
title: "Construí um gerador de playlists no Spotify com Claude"
date: "2026-03-24"
excerpt: "Eu queria digitar “noite chuvosa, meio melancólica” e receber uma playlist perfeita. Então eu..."
tags: ["Gündem", "Dev.to", "ai", "a", "i"]
category: "Gündem"
---

**Eu queria digitar “noite chuvosa, meio melancólica” e receber uma playlist perfeita. Então eu...**

> Eu queria digitar “noite chuvosa, meio melancólica” e receber uma playlist perfeita. Então eu construí isso.

- Eu construí um gerador de playlists com IA usando Claude + Spotify API
- Você descreve um humor → ele gera 50 músicas → salva direto no Spotify
- O maior problema foi OAuth local com NextAuth (sim, foi um inferno)
- Claude funciona bem, mas precisa de bastante controle pra não inventar músicas
- Streaming com SSE melhorou muito a UX

Links:
- [Demo] (https://moodify.com.br)
- [GitHub] (https://github.com/LeoGarcez/moodify)
- [Playlist de exemplo](https://open.spotify.com/playlist/0L2bStHbYyfiGJFZfB1CDO?si=a93194d73eec484c)

- [A Ideia](#a-ideia)
- [A Stack](#a-stack)
- [O Problema de Trabalhar com OAuth Localmente](#o-problema-de-trabalhar-com-oauth-localmente)
- [Endpoints Deprecated do Spotify](#endpoints-deprecated-do-spotify)
- [Spotify em Produção](#spotify-em-producao)
- [Fazendo o Claude Obedecer](#fazendo-o-claude-obedecer)
- [Prompt Engineering Anti-Alucinação](#prompt-engineering-anti-alucinacao)
- [Modo Related Artists](#modo-related-artists)
- [Construindo o Perfil Musical](#construindo-o-perfil-musical)
- [Streaming com SSE](#streaming-com-sse)
- [O Que Aprendi](#o-que-aprendi)

Fazer um gerador de playlists que realmente entendesse vibes, não só tags de gênero. Algo tipo: você digita "tarde fria num apartamento vazio" e recebe uma playlist boa de verdade, já salva no seu Spotify.

## İçerik Başlıkları

- TL;DR
- Índice
- A Ideia
- A Stack

---

**Kaynak:** Dev.to &nbsp;·&nbsp; **Yazar:** Leo Garcez &nbsp;·&nbsp; **Okuma süresi:** 12 dk

[Orijinal makaleyi oku](https://dev.to/leugarcez/construi-um-gerador-de-playlists-no-spotify-com-claude-18ge)

_Bu içerik otomatik olarak derlenmektedir. Kaynak bağlantıları orijinal yayıncılara aittir._