---
title: "Tell HN: Litellm 1.82.7 and 1.82.8 on PyPI are compromised"
date: "2026-03-24"
excerpt: "[LITELLM TEAM] - For updates from the team, please see: #24518 [Security]: CRITICAL: Malicious litellm_init.pth in litellm 1.82.8 PyPI package — credential stealer Summary The litellm==1.82.8 wheel..."
tags: ["Gündem", "Hacker News", "Developer"]
category: "Gündem"
---

**[LITELLM TEAM] - For updates from the team, please see: #24518 [Security]: CRITICAL: Malicious litellm_init.pth in litellm 1.82.8 PyPI package — credential stealer Summary The litellm==1.82.8 wheel...**

BerriAI / litellm Public Uh oh! There was an error while loading. Please reload this page .

Notifications You must be signed in to change notification settings Fork 6.7k Star 40.2k [Security]: CRITICAL: Malicious litellm_init.pth in litellm 1.82.8 — credential stealer #24512 New issue Copy link New issue Copy link Open Open [Security]: CRITICAL: Malicious litellm_init.pth in litellm 1.82.8 — credential stealer #24512 Copy link Labels llm translation potential-duplicate Description isfinne opened on Mar 24, 2026 Issue body actions [LITELLM TEAM] - For updates from the team, please see: #24518 [Security]: CRITICAL: Malicious litellm_init.pth in litellm 1.82.8 PyPI package — credential stealer Summary The litellm==1.82.8 wheel package on PyPI contains a malicious .pth file ( litellm_init.pth , 34,628 bytes) that automatically executes a credential-stealing script every time the Python interpreter starts — no import litellm required.

This is a supply chain compromise. The malicious file is listed in the package's own RECORD :

litellm_init.pth,sha256=ceNa7wMJnNHy1kRnNCcwJaFjWX3pORLfMh7xGL8TUjg,34628 Reproduction pip download litellm==1.82.8 --no-deps -d /tmp/check python3 -c " import zipfile, os whl = '/tmp/check/' + [f for f in os.listdir('/tmp/check') if f.endswith('.whl')][0] with zipfile.ZipFile(whl) as z: pth = [n for n in z.namelist() if n.endswith('.pth')] print('PTH files:', pth) for p in pth: print(z.read(p)[:300]) " You will see litellm_init.pth containing:

import os , subprocess , sys ; subprocess . Popen ([ sys . executable , "-c" , "import base64; exec(base64.b64decode('...'))" ]) Malicious Behavior (full analysis) The payload is double base64-encoded . When decoded, it performs the following:

## İçerik Başlıkları

- Uh oh!
- Description
- [LITELLM TEAM] - For updates from the team, please see: #24518
- Summary

---

**Kaynak:** Hacker News &nbsp;·&nbsp; **Puan:** 163

[Orijinal makaleyi oku](https://github.com/BerriAI/litellm/issues/24512) &nbsp;·&nbsp; [Hacker News tartışması](https://news.ycombinator.com/item?id=47501426)

_Bu içerik otomatik olarak derlenmektedir. Kaynak bağlantıları orijinal yayıncılara aittir._