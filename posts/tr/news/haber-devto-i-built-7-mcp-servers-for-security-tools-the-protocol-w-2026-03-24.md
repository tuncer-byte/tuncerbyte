---
title: "I Built 7 MCP Servers for Security Tools. The Protocol Was the Easy Part."
date: "2026-03-24"
excerpt: "I wanted my AI agent to talk directly to my security stack. Not through copy-pasted log snippets. Not..."
tags: ["Gündem", "Dev.to", "opensource", "a", "i"]
category: "Gündem"
---

**I wanted my AI agent to talk directly to my security stack. Not through copy-pasted log snippets. Not...**

I wanted my AI agent to talk directly to my security stack. Not through copy-pasted log snippets. Not through screenshots of dashboards. Actual tool calls against live data.

So I built seven MCP servers. Wazuh. Suricata. Zeek. TheHive. Cortex. MISP. MITRE ATT&CK. All open source, all on [my GitHub](https://github.com/solomonneas). Project page: [https://solomonneas.dev/projects/security-mcp-servers](https://solomonneas.dev/projects/security-mcp-servers).

The protocol layer took a weekend. The context engineering took weeks. That ratio surprised me.

API-based servers talk directly to running services. Wazuh MCP hits the manager's REST API on port 55000 for alerts, agent status, vulnerability scans, and file integrity events. TheHive and Cortex connect to their respective APIs for case management and observable analysis. MISP pulls threat intelligence feeds and IOC lookups.

Log-based servers parse files on disk. Zeek MCP reads from a log directory (JSON or TSV format), letting you query connection logs, DNS, HTTP, SSL, and file analysis data. Suricata MCP reads EVE JSON logs for IDS alerts, flow data, and protocol metadata.

## İçerik Başlıkları

- What I Actually Built
- Testing Against Live Infrastructure
- Context Design Is the Real Engineering
- Where It Gets Interesting

---

**Kaynak:** Dev.to &nbsp;·&nbsp; **Yazar:** Solomon Neas &nbsp;·&nbsp; **Okuma süresi:** 3 dk

[Orijinal makaleyi oku](https://dev.to/solomonneas/i-built-7-mcp-servers-for-security-tools-the-protocol-was-the-easy-part-4137)

_Bu içerik otomatik olarak derlenmektedir. Kaynak bağlantıları orijinal yayıncılara aittir._