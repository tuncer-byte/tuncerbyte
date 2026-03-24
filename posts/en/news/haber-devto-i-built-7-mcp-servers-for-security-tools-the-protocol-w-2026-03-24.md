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

## What I Actually Built

Log-based servers parse files on disk. Zeek MCP reads from a log directory (JSON or TSV format), letting you query connection logs, DNS, HTTP, SSL, and file analysis data. Suricata MCP reads EVE JSON logs for IDS alerts, flow data, and protocol metadata.

Knowledge-base servers work offline. The MITRE ATT&CK server downloads STIX 2.1 bundles and lets you query techniques, tactics, groups, software, and mitigations without hitting any external API.

Each server exposes a focused set of tools. Wazuh has getalerts, listagents, getvulnerabilities, getfimevents. Zeek has queryconnections, searchdns, getsslcerts. Suricata has getalerts, getflowstats, searchprotocols.

Every tool does one thing with predictable output. Full code and docs at [github.com/solomonneas](https://github.com/solomonneas).

## Testing Against Live Infrastructure

Every server got tested against real running services on my home infrastructure.

Wazuh MCP was tested against my Wazuh 4.14.1 instance running on Proxmox. I queried live alerts, pulled agent status for my connected machines, ran vulnerability scan results, and verified file integrity monitoring events. The agent reconnection workflow got tested end-to-end: listing disconnected agents, checking last keep-alive, triggering restarts.

Zeek and Suricata servers were tested against actual captured traffic. Real log files through both parsers, connection correlation across source/destination pairs, DNS query lookups, and stress-tested time-window filtering with large log directories. Edge cases like malformed log entries and mixed JSON/TSV formats got handled explicitly.

TheHive and Cortex were tested against their APIs with sample cases and observables. MISP was tested with real IOC lookups. The MITRE ATT&CK server was verified against the full STIX 2.1 enterprise bundle.

## Context Design Is the Real Engineering

The goal was not just "does the tool call succeed." It was "does the model get back data it can actually reason about for a real investigation."

Security telemetry is exactly the kind of data language models handle poorly. It's verbose, repetitive, and full of fields that matter sometimes and are noise the rest of the time.

Take Wazuh alerts. A single alert has 40+ fields. Dump all of that into a model and ask it to "analyze the situation." You'll get a vague summary that touches everything and understands nothing.

My first versions returned raw API responses. The model would pick whatever fields were easiest to talk about instead of whatever actually mattered.

## Where It Gets Interesting

So I started designing the context layer. For Wazuh, I filter to severity 8+ by default and return a focused subset: timestamp, rule description, agent name, source IP, and MITRE technique. For Zeek, I pre-aggregate by source/destination pair and surface unusual patterns first. For Suricata, I separate IDS alerts from flow metadata. Detections first, network context second.

A Wazuh alert fires for a suspicious process. The model checks Zeek for that host's network activity. Finds outbound connections to an unusual IP. Queries ATT&CK for technique mapping. Checks MISP for threat intel on the destination.

That correlation chain used to take 15 minutes of clicking through interfaces. Now it takes one question.

I'm not replacing analysts. I'm killing the mechanical evidence-gathering that burns time before a human reaches the real decisions.

## The Lesson

The protocol is a solved problem. MCP works. The bottleneck is what happens between raw data and the model's context window. Filtering, ordering, scoping, pre-summarizing. That's where analysis quality is determined.

A model with access to every field in every log is worse off than one that sees the right 15 fields in the right order.

Seven servers. All open source. All tested against live infrastructure. Code at [github.com/solomonneas](https://github.com/solomonneas). The protocol was a weekend. The context design is ongoing. That's the ratio that matters.

---

[Orijinal makaleyi oku →](https://dev.to/solomonneas/i-built-7-mcp-servers-for-security-tools-the-protocol-was-the-easy-part-4137)

_Bu içerik otomatik olarak derlenmektedir. Tüm haklar orijinal yayıncıya aittir._