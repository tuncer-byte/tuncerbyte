---
title: "40 Hidden Claude Features, Settings, and Shortcuts Most Users Don't Know About"
date: "2026-05-03"
excerpt: "After hundreds of hours across Claude's three interfaces — Chat, Code, and Cowork — here are 40 features buried in plain sight that will change how you work."
tags: ["Claude", "Claude Code", "Claude Chat", "Claude Cowork", "AI", "Productivity", "AI Tools", "Anthropic", "Shortcuts", "Tips"]
category: "Tools"
---

Claude has three interfaces: **Chat**, **Cowork**, and **Code**.

Most people use one. Almost no one has explored all three. And even within the interface they do use, they're touching maybe 20% of what's actually there.

After hundreds of hours across all three, here are 40 features buried inside the Claude ecosystem that change how you work the moment you discover them.

---

## Claude Chat: Hidden Power

### 01. Styles

Go to **Settings → Styles**. Claude has built-in communication styles you can switch between: Concise, Explanatory, Formal, and more. You can also create custom styles. Build one that matches your voice — every conversation starts in the right tone automatically.

### 02. Projects

Most people skip this entirely. Projects let you create persistent workspaces with their own instructions and files. Every conversation inside a project automatically inherits that context. Instead of pasting your context file every single time, create a project and set the context once.

### 03. Project Knowledge

Inside any project, upload reference documents. Claude reads them at the start of every conversation. Your brand guidelines. Product docs. Writing samples. Always loaded. Never forgotten.

### 04. Custom Instructions

In project settings, you can write custom instructions that function like a system prompt for every conversation:

> "You are my content strategist. Always respond in my brand voice. Never use these words: [list]. Always produce output in this format: [format]."

This runs silently behind every message.

### 05. Artifacts

When Claude produces code, documents, or visual output, they appear in a separate panel. You can work on artifacts independently of the conversation — edit, iterate, and download without losing conversation context.

### 06. Memory

Claude now remembers things across conversations. It learns your preferences, projects, and communication style over time. Go to **Settings → Memory** to view and edit what Claude remembers. Manage this like onboarding notes for a new team member.

### 07. Deep Research

Enable Deep Research for any query and Claude performs extended searches — reading dozens of sources before producing a comprehensive research report. Think of it as two hours of a junior analyst's research delivered in two minutes.

### 08. File Upload Intelligence

PDFs, images, spreadsheets, CSVs, code files, and documents can all be uploaded directly into a conversation. Claude doesn't just store them — it reads and understands them. Upload a 50-page report and ask specific questions about page 37.

### 09. Image Analysis

Upload any image and Claude sees it in remarkable detail. Error screenshots, whiteboard photos, charts, diagrams, handwritten notes, receipts, business cards. If it contains visual information, Claude can extract and interpret it.

### 10. Canvas

Claude can produce visuals, diagrams, and interactive components directly in chat. A flowchart of your process, a comparison table, an org chart, a simple calculator — rendered inline and interactive.

### 11. LaTeX Rendering

For anyone working with math, statistics, or technical content: Claude renders LaTeX equations beautifully. Ask for formulas, derivations, or statistical output and they display with proper formatting.

### 12. Conversation Branching

Edit any previous message and Claude regenerates the response from that point, opening a new branch. This lets you explore alternative approaches without losing the original conversation thread.

---

## Claude Code: Power Features

### 13. CLAUDE.md Hierarchy

Most users have one CLAUDE.md. Power users have three levels:

| Level | Path | Scope |
|-------|------|-------|
| User | `~/.claude/CLAUDE.md` | Personal preferences |
| Project | `.claude/CLAUDE.md` | Team standards |
| Directory | Inside relevant directory | Module-specific rules |

These cascade — the most specific level wins.

### 14. Path-Specific Rules

Create files inside `.claude/rules/` with YAML frontmatter specifying a glob pattern. A rule with `paths: ["**/*.test.*"]` automatically applies to every test file in your codebase. Different standards for different file types without cluttering the main CLAUDE.md.

### 15. Plan Mode

Hit `Shift+Tab` to enter Plan Mode. Claude builds a step-by-step plan, shows it to you for approval, and only executes once you confirm. Essential for any task that touches multiple files. The difference between clean execution and debugging chaos.

### 16. /compact

Compresses your conversation when context gets long. Claude preserves important details but frees up context window space. Use this when Claude starts repeating errors or losing track of earlier decisions.

### 17. /memory

Shows exactly which memory files Claude Code has loaded for this session. Run this when Claude is behaving inconsistently — to confirm whether the right context is actually active.

### 18. Custom Slash Commands

Create reusable commands inside `.claude/commands/` (project) or `~/.claude/commands/` (global):

```markdown
# .claude/commands/review.md
Review the code against these criteria:
1. Security vulnerabilities
2. Performance issues
3. Test coverage
```

Write it once, run it every time with `/review`.

### 19. Git Integration

Claude Code has native git awareness. It can commit, push, create branches, and even write commit messages based on the changes it made. "Commit everything with a descriptive message" actually works.

### 20. Multi-File Editing

Claude Code can read and edit multiple files in a single operation. Rename a function across the entire codebase. Update an import path in every file that references it. Refactor a component and update every file that uses it — all at once.

### 21. Test Generation

Point Claude Code at any function or module: "Write comprehensive tests for this." It generates test files following your project's testing conventions (if set in CLAUDE.md or path rules), including edge cases and error scenarios.

### 22. The `-p` Flag

Runs Claude Code in non-interactive, headless mode. Essential for CI/CD pipelines. Without it, your CI job waits forever for user input. With it, Claude runs autonomously and returns structured output.

### 23. `--output-format json`

Combined with `--json-schema`, Claude Code returns machine-parseable structured output. Your CI pipeline can automatically parse findings and post them as inline PR comments.

### 24. Independent Review Sessions

A Claude Code session that wrote the code is biased against its own decisions when reviewing. Always use a separate, fresh session for code review. You get more objective results.

---

## Claude Cowork: Hidden Functionality

### 25. Sub-Agent Parallel Processing

When Cowork receives a large task, it can spin up multiple sub-agents running simultaneously. Tell it to process 20 files — it splits them across 4-5 parallel sub-agents. Something that would take 30 minutes sequentially finishes in 6.

### 26. /schedule

Set up recurring tasks. Daily briefings, weekly cleanups, monthly financial operations. Your computer needs to be on and Claude Desktop running, but tasks execute unattended. Scheduled tasks that run while the laptop is asleep execute automatically when it wakes.

### 27. Connector Chaining

Combine multiple connectors in a single workflow:

> "Read my Gmail, check my calendar, pull relevant files from Drive, and create a meeting prep document."

Four connectors. One instruction. Zero tab switching.

### 28. Plugin Marketplace

Verified plugins at `claude.com/plugins` offer pre-built capabilities for specific roles: product management, marketing, finance, legal. Each plugin adds slash commands and skills specific to that function.

### 29. Folder Instructions

Place a markdown file with instructions inside any folder. When Cowork works on files in that folder, it reads those instructions first. Different rules for different projects. Different formatting for different clients. Automatic context switching.

### 30. Sandbox Security

Everything Cowork does runs inside a sandboxed Linux VM. It can't access files outside the folders you've explicitly granted access to. You control the blast radius — this is why Cowork is safe for production work.

### 31. Browser Bridge

When Claude in Chrome is loaded alongside Cowork, the two work together. Cowork can delegate web research to Chrome, process the results locally, and continue the workflow. Best of both worlds.

### 32. Session History

Every Cowork session is recorded with full details: which actions were taken, which files were modified, what the output was. Review any past session to understand exactly what happened. Indispensable for debugging failed automations.

### 33. Token Usage Awareness

Cowork tasks consume 3-5x more tokens than regular chat. Batch related tasks into single sessions. Be specific to avoid back-and-forth clarification. Schedule heavy tasks during off-peak hours where throughput is reportedly higher.

### 34. Plugin Chaining

Combine multiple plugins in a single workflow. Your research plugin feeds into your analysis plugin, which feeds into your report plugin. Multi-step, multi-capability workflows triggered by a single command.

---

## Platform-Wide Settings

### 35. Usage Dashboard

Check your token consumption and usage patterns. If you're hitting limits, this shows you exactly where your tokens are going so you can optimize.

### 36. Model Selection

| Model | Best For |
|-------|----------|
| Haiku 4.5 | Fast, simple tasks |
| Sonnet 4.6 | Speed-quality balance |
| Opus 4.7 | Complex reasoning, final quality |

Match the model to the task. Using Opus for everything is unnecessary consumption.

### 37. API Access

Your Claude subscription includes API credits. Build custom integrations, connect Claude to your own tools, or automate workflows the standard interfaces don't support.

### 38. Team Sharing

On Team and Enterprise plans, you can share projects, skills, and configurations with your team. Everyone gets the same context, the same standards, and the same capabilities. Consistency across the entire organization.

### 39. Privacy Controls

You can opt out of having your conversations used for training. Check **Settings → Privacy**. For sensitive business work, verify your data handling preferences are configured correctly.

### 40. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+/` | Show all shortcuts |
| `Ctrl+Shift+O` | Open new conversation |
| `Ctrl+Shift+C` | Copy last response |

These small efficiencies compound across hundreds of daily interactions.

---

## Where to Start

40 features. All hidden in plain sight. 99% of users know maybe 10 of them.

Claude isn't a single tool — it's three interfaces, each with layers of functionality most users have never discovered. The people who find these features don't just save time; they operate at a fundamentally different level.

**Recommended starting point:** Pick 5 features from this list that are most relevant to your work and try them today. Each one unlocks a workflow you didn't know was possible.

---

*Source: Khairallah AL-Awady — [Anthropic Docs](https://docs.anthropic.com)*
