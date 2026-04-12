---
title: "memory-bank-MCP: Giving AI Persistent Memory"
date: "2025-03-10"
excerpt: "Why and how I built the MCP server that lets Claude, Cursor and other AI tools remember project context across sessions."
tags: ["MCP", "memory-bank", "Claude", "Cursor", "Artificial Intelligence", "Open Source"]
category: "Projects"
---

The most frustrating problem when working with AI tools: having to start every session from scratch. Explain the project, provide context, describe what you're trying to do — and repeat it all over again next time.

**memory-bank-MCP** was born to solve this problem.

## The Problem

When working on a long-running project with Claude Code, Cursor or a similar AI coding assistant, the assistant doesn't know the project's history, the decisions you've made, or the architecture. Every conversation starts from zero.

This isn't just inefficient — it can be dangerous. The assistant may make suggestions without knowing why a particular approach was chosen.

## The Solution: Model Context Protocol

[MCP (Model Context Protocol)](https://modelcontextprotocol.io) is a standard developed by Anthropic for providing AI assistants with external tools and data sources.

memory-bank-MCP uses this protocol to:

- Store project context in structured Markdown files
- Automatically load that context at the start of every AI session
- Record important decisions, architecture choices, and progress

## How It Works

```typescript
// Load context when the server starts
const context = await readMemoryBank(projectPath);

// Provide context on every AI request
server.tool("get_project_context", async () => {
  return { context: await loadAllMemories() };
});

// Save important decisions
server.tool("save_decision", async ({ decision, reasoning }) => {
  await appendToMemory("decisions.md", { decision, reasoning, date: new Date() });
});
```

## Results

The project reached 100+ GitHub stars and approximately 20,000 visitors. It became one of the most-used servers in the global MCP ecosystem.

The biggest lesson: solving a well-defined problem with a simple solution is far more effective than trying to do everything.

Explore or contribute: [github.com/tuncer-byte/memory-bank-MCP](https://github.com/tuncer-byte/memory-bank-MCP)
