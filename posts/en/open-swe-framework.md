---
title: "Open SWE: Open-Source Framework for Coding Agents"
date: "2026-03-17"
excerpt: "Stripe, Ramp, and Coinbase each built their own internal coding agents. LangChain just open-sourced the architectural patterns they all converged on."
tags: ["Open SWE", "LangChain", "Coding Agent", "LangGraph", "Deep Agents", "AI Engineering"]
category: "Technology"
---

Over the past year, a few major engineering organizations built internal coding agents that work alongside their development teams. Stripe built **Minions**, Ramp built **Inspect**, and Coinbase built **Cloudbot**. What they share: none of them ask engineers to adopt a new interface. They integrate into Slack, Linear, and GitHub — where developers already are.

These systems were built independently, yet they converged on similar architectural decisions: isolated cloud sandboxes, curated toolsets, subagent orchestration, and tight integration with developer workflows. That convergence is a signal — some requirements are essentially universal when deploying AI agents in production engineering environments.

LangChain just released **Open SWE**, an open-source framework that captures those patterns in a customizable form. Built on Deep Agents and LangGraph, it's designed as a starting point for teams exploring this approach.

## What Production Systems Have in Common

Looking at how Stripe, Ramp, and Coinbase built their agents, the same architectural decisions keep showing up:

**Isolated execution environments.** Tasks run in dedicated cloud sandboxes with full permissions inside strict boundaries. The agent can execute commands without an approval prompt for each action, while any mistakes stay contained and away from production systems.

**Curated toolsets.** Stripe's team reportedly gives their agents access to around 500 tools — but these are carefully selected and maintained, not accumulated over time. Tool quality matters more than tool quantity.

**Slack-first invocation.** All three systems use Slack as the primary interface. Developers trigger the agent where they already communicate, with no context switch to a new application.

**Rich context at startup.** Before doing any work, agents pull full context from Linear issues, Slack threads, or GitHub PRs. Starting with assembled context beats discovering requirements through tool calls.

**Subagent orchestration.** Complex tasks get broken down and delegated to specialized child agents, each with isolated context and focused responsibilities.

## Open SWE's Architecture

### 1. Agent Harness: Built on Deep Agents

Rather than forking an existing agent or building from scratch, Open SWE composes on Deep Agents — similar to how Ramp built Inspect on top of OpenCode.

Two advantages to this approach: an **upgrade path** (as Deep Agents improves its context management, planning, and token usage, those improvements flow through without rebuilding your customizations) and **customization without forking** (org-specific tools, prompts, and workflows live as configuration, not as modifications to core agent logic).

```python
create_deep_agent(
    model="anthropic:claude-opus-4-6",
    system_prompt=construct_system_prompt(repo_dir, ...),
    tools=[
        http_request,
        fetch_url,
        commit_and_open_pr,
        linear_comment,
        slack_thread_reply
    ],
    backend=sandbox_backend,
    middleware=[
        ToolErrorMiddleware(),
        check_message_queue_before_model,
        ...
    ],
)
```

### 2. Sandbox: Isolated Cloud Environments

Each task runs in its own isolated cloud sandbox — a remote Linux environment with full shell access. The repo is cloned in, the agent gets full permissions, and any errors stay contained to that environment.

Open SWE supports Modal, Daytona, Runloop, and LangSmith out of the box. You can also implement your own sandbox backend for internal infrastructure requirements.

Key behaviors: each conversation thread gets a persistent sandbox reused across follow-up messages. Sandboxes auto-recreate if they become unreachable. Multiple tasks run in parallel, each in its own sandbox.

### 3. Tools: Curated, Not Accumulated

Open SWE ships with a focused toolset, plus the built-in Deep Agents tools: `read_file`, `write_file`, `edit_file`, `ls`, `glob`, `grep`, `write_todos`, and `task` (subagent spawning).

A smaller, curated toolset is easier to test, maintain, and reason about. When you need additional tools — internal APIs, deployment systems, custom testing frameworks — you add them explicitly.

### 4. Context Engineering: AGENTS.md + Source Context

Two context sources. If your repository has an `AGENTS.md` file at the root, it's read from the sandbox and injected into the system prompt — encoding conventions, testing requirements, architectural decisions, and team-specific patterns that every agent run should follow. The full Linear issue, GitHub PR, or Slack thread history is assembled and passed to the agent before it starts, providing task-specific context without additional tool calls.

### 5. Orchestration: Subagents + Middleware

Two mechanisms working together. **Subagents**: the main agent can delegate independent subtasks via the `task` tool to child agents with their own middleware stack, todo list, and file operations. **Middleware**: deterministic hooks run around the agent loop — `check_message_queue_before_model` injects follow-up Slack or Linear messages before the next model call; `open_pr_if_needed` commits and opens a PR if the agent didn't do it; `ToolErrorMiddleware` catches and handles tool errors gracefully.

The separation between model-driven and middleware-driven orchestration helps balance flexibility with reliability.

### 6. Invocation: Slack, Linear, and GitHub

Mention the bot in any Slack thread, optionally using `repo:owner/name` syntax to specify the repository. On Linear, comment `@openswe` on any issue — the agent reads full context, reacts with 👀, and posts results as comments. On GitHub, tag `@openswe` in PR comments on agent-created PRs to address review feedback and push fixes to the same branch.

Each invocation generates a deterministic thread ID, so follow-up messages on the same issue or thread route to the same running agent.

### 7. Validation: Prompt-Driven + Safety Nets

The agent is instructed to run linters, formatters, and tests before committing. The `open_pr_if_needed` middleware acts as a backstop — if the agent finishes without opening a PR, the middleware handles it automatically. You can extend this layer by adding CI checks, visual verification, or review gates as additional middleware.

## Why Deep Agents

Long-running coding tasks produce large amounts of intermediate data. Deep Agents handles this through file-based memory, offloading large results rather than keeping everything in conversation history — preventing context overflow on larger codebases. The built-in `write_todos` tool structures complex work into trackable steps, adapting as new information emerges. When the main agent spawns a subagent via `task`, that subagent gets its own isolated context — different subtasks don't pollute each other's reasoning. And because Deep Agents is actively developed as a standalone library, improvements to context compression, prompt caching, and planning efficiency flow to Open SWE without requiring you to rebuild your customizations.

## Getting Started

Open SWE is MIT-licensed — fork it, customize it, deploy it internally.

- Try Open SWE: [github.com/langchain-ai/open-swe](https://github.com/langchain-ai/open-swe)
- Deep Agents: [docs.langchain.com/oss/python/deepagents](https://docs.langchain.com/oss/python/deepagents)
- LangSmith Sandboxes: [blog.langchain.com](https://blog.langchain.com/introducing-langsmith-sandboxes-secure-code-execution-for-agents/)
