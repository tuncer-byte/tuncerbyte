---
title: "I Built 7 MCP Servers for Security Tools. The Protocol Was the Easy Part."
date: "2026-03-24"
excerpt: "I wanted my AI agent to talk directly to my security stack. Not through copy-pasted log snippets. Not..."
tags: ["Gündem", "Dev.to", "opensource", "ai", "mcp"]
category: "Gündem"
---

![I Built 7 MCP Servers for Security Tools. The Protocol Was the Easy Part.](https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F2paijk9fowt28i9v5i1p.png)

> **Kaynak:** Dev.to  &nbsp;·&nbsp;  **3 dk okuma**  &nbsp;·&nbsp;  **Yazar:** Solomon Neas

**I wanted my AI agent to talk directly to my security stack. Not through copy-pasted log snippets. Not...**

I wanted my AI agent to talk directly to my security stack. Not through copy-pasted log snippets. Not through screenshots of dashboards. Actual tool calls against live data.

So I built seven MCP servers. Wazuh. Suricata. Zeek. TheHive. Cortex. MISP. MITRE ATT&CK. All open source, all on [my GitHub](https://github.com/solomonneas). Project page: [https://solomonneas.dev/projects/security-mcp-servers](https://solomonneas.dev/projects/security-mcp-servers).

The protocol layer took a weekend. The context engineering took weeks. That ratio surprised me.

API-based servers talk directly to running services. Wazuh MCP hits the manager's REST API on port 55000 for alerts, agent status, vulnerability scans, and file integrity events. TheHive and Cortex connect to their respective APIs for case management and observable analysis. MISP pulls threat intelligence feeds and IOC lookups.

Log-based servers parse files on disk. Zeek MCP reads from a log directory (JSON or TSV format), letting you query connection logs, DNS, HTTP, SSL, and file analysis data. Suricata MCP reads EVE JSON logs for IDS alerts, flow data, and protocol metadata.

Knowledge-base servers work offline. The MITRE ATT&CK server downloads STIX 2.1 bundles and lets you query techniques, tactics, groups, software, and mitigations without hitting any external API.

## Yazıda Neler Var?

- What I Actually Built
- Testing Against Live Infrastructure
- Context Design Is the Real Engineering
- Where It Gets Interesting
- The Lesson

---

[Orijinal makaleyi oku →](https://dev.to/solomonneas/i-built-7-mcp-servers-for-security-tools-the-protocol-was-the-easy-part-4137)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._