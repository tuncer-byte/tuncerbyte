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

Escolhi o Claude porque ele tá bem em alta agora e, na prática, é confiável, alucina menos do que eu esperava pra esse tipo de tarefa. Ele é um pouco menos criativo que o GPT nas recomendações, mas compensa sendo mais previsível no formato das respostas, o que importa bastante quando você tá parseando JSON.

Isso me custou algumas horas e sessões de debug. Vou detalhar porque tem várias camadas de problema e você provavelmente vai bater na mesma parede se estiver usando NextAuth v5 com Spotify.

## Yazıda Neler Var?

- TL;DR
- Índice
- A Ideia
- A Stack
- O Problema de Trabalhar com OAuth Localmente

---

[Orijinal makaleyi oku →](https://dev.to/leugarcez/construi-um-gerador-de-playlists-no-spotify-com-claude-18ge)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._