---
title: "Claude Code Auto Mode: The Autonomous Permission System"
date: "2026-03-24"
excerpt: "Auto Mode sits between manual approval and full bypass. A classifier decides what's safe to run autonomously. How it works, how to enable it, and its limits."
tags: ["Claude Code", "Auto Mode", "AI Agent", "Permission System", "Automation", "Artificial Intelligence", "Anthropic", "Security"]
category: "Technology"
---

Anthropic just shipped **Auto Mode** for Claude Code — and it fills the gap that's frustrated power users since the tool launched. Instead of choosing between approving every single action or skipping permissions entirely, you now have a third option: let a classifier decide what's safe to run automatically.

Currently available as a **research preview for Team plan** users. Enterprise and API rollout follows in the coming days.

## The Problem Auto Mode Solves

Anyone who's run a long Claude Code session knows the tension:

**Manual approval mode** asks for confirmation before every file write, terminal command, or web search. Fine for exploratory work, exhausting for anything involving dozens of sequential steps. You end up rubber-stamping approvals anyway — but you have to be at the keyboard for each one.

**`--dangerously-skip-permissions`** runs everything without asking. Fast, but the name says it all. A poorly phrased prompt or a misdirected tool call can delete files, exfiltrate data, or execute unintended code.

Auto Mode is the engineered middle ground.

## How the Classifier Works

Every tool call gets reviewed by a classifier before execution. The classifier answers one question: *"Is this safe to proceed with?"*

### What Gets Approved Automatically

Standard development operations proceed without interruption:
- Reading and writing files
- Running terminal commands that fit normal dev workflows
- Web searches and API calls
- Code execution within expected scope

### What Gets Blocked

The classifier specifically flags:
- **Mass file deletion** — `rm -rf` style operations that could wipe large portions of a codebase
- **Sensitive data exfiltration** — attempts to read and transmit credentials, secrets, or private data
- **Malicious code execution** — patterns that suggest unintended or harmful behavior
- **Out-of-scope destructive actions** — operations that exceed what the current task plausibly requires

### What Happens on a Block

When an action is blocked, Claude doesn't stop — it looks for an **alternative approach** that achieves the same goal within safe bounds. If it keeps hitting the same block repeatedly, it surfaces a manual approval prompt rather than failing silently.

```
Tool call → Classifier
                ↓
         [Safe to run?]
          ↙         ↘
       Yes            No
        ↓              ↓
   Auto-approve    Try alternative
                        ↓
               [Still blocked?]
                        ↓
               Ask for manual approval
```

## Enabling Auto Mode

### CLI

```bash
claude --enable-auto-mode
```

Once enabled, cycle between permission modes with **Shift+Tab**:
1. Normal mode (asks for approval)
2. Auto mode (classifier decides)
3. Skip permissions (no prompts)

### Desktop and VS Code

`Settings → Claude Code → Permission Mode` — select **Auto** from the dropdown.

### Admin Configuration (Enterprise)

Admins can disable auto mode organization-wide via managed settings:

```json
{
  "disableAutoMode": "disable"
}
```

## Compatible Models

Auto mode only works with:
- **Claude Sonnet 4.6**
- **Claude Opus 4.6**

Older model versions won't show the auto mode option.

## Honest Look at the Safety Profile

Anthropic is upfront about what auto mode does and doesn't guarantee.

**The classifier can be wrong in both directions.** With ambiguous context, it may allow some risky actions through. It may also block legitimate, harmless operations. This is not a security guarantee — it's a risk-reduction layer.

**It is meaningfully safer than `--dangerously-skip-permissions`.** The classifier catches a real class of dangerous patterns. But it's not a substitute for environment isolation.

**Anthropic's recommendation still stands:** run Claude Code in isolated environments (containers, VMs) regardless of which permission mode you use.

> "Auto mode reduces risk compared to skipping permissions entirely, but it does not eliminate it." — Anthropic

## Performance Impact

The classifier adds a step to every tool call. Expect minor effects on:

- **Token usage:** Small increase
- **Cost:** Marginal
- **Latency:** Minimal per tool call

Anthropic describes this as "a small impact" — no specific benchmarks provided, but in practice it's unlikely to be noticeable in normal sessions.

## Mode Comparison

| Feature | Manual | Auto Mode | Skip Permissions |
|---------|--------|-----------|-----------------|
| Approval required per action | Yes | No | No |
| Blocks dangerous operations | Yes | Yes (classifier) | No |
| Requires keyboard presence | Yes | Partially | No |
| Safety level | Highest | Medium | Lowest |
| Workflow friction | High | Low | Minimal |
| Classifier overhead | None | Small | None |

## Who Should Use Auto Mode

**Good fit:**
- Long-running sessions (builds, data pipelines, large refactors)
- Developers who trust their prompts but don't want to approve every step
- Teams deploying in isolated, controlled environments

**Use with caution:**
- Sessions with direct access to production systems
- Environments containing sensitive customer data
- Workflows using unvetted MCP tools

## Team and Enterprise Plans

Unlike [Channels](/en/claude-code-channels) (which ships disabled by default for organizations), Auto Mode is **available by default** on Team and Enterprise plans. Admins can restrict it, but users don't need an admin to turn it on.

Enterprise admins can set organization-wide policy centrally through managed settings.

## Combining Auto Mode with Channels

Auto Mode pairs naturally with [Claude Code Channels](/en/claude-code-channels). Running both lets you hand off tasks from your phone while Claude works autonomously:

```bash
claude --channels plugin:telegram@claude-plugins-official --enable-auto-mode
```

With this setup:
- You send a task via Telegram
- Claude executes it autonomously (auto mode handles the permission layer)
- Claude notifies you on Telegram when done

This is a much better alternative to `--dangerously-skip-permissions` for unattended async workflows.

## Rollout Timeline

| Plan | Status |
|------|--------|
| Team | Research preview — available now |
| Enterprise | Rolling out in the coming days |
| API | Rolling out in the coming days |
| Pro/Max (individual) | Not announced |

## The Bottom Line

Auto Mode is the layer Claude Code has been missing. It adds a classifier-driven middle ground between "approve everything" and "approve nothing" — letting you stay in flow on routine work while retaining a safety check for genuinely risky operations.

It's not perfect. The classifier makes mistakes in both directions. There's a small performance cost. But for day-to-day development sessions, it removes real friction without meaningfully increasing risk.

If you're on Team plan, you can try it right now: `claude --enable-auto-mode`.

For deeper technical detail on classifier behavior and configuration options, see the [Claude Code documentation](https://code.claude.com/docs).
