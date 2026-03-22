---
title: "Claude Code Skills: What They Are, Why They Exist, and How to Use Them"
date: "2026-03-22"
excerpt: "Skills are instruction files that extend what Claude Code can do — automatically or on command. Here's how they work, why the concept matters, and how to start using them."
tags: ["Claude Code", "AI", "Developer Tools", "Productivity", "Agent", "Automation", "Skills"]
category: "Tools"
---

Claude Code has a feature called Skills. It's one of those things that sounds simple on the surface — "install an instruction file" — but the implications are significant once you understand what's actually happening.

Let me break it down.

---

## What Is a Skill?

A skill is a Markdown file named `SKILL.md` that you place in a specific directory. Claude reads it and adds the capability to its toolkit for that session.

You can invoke a skill directly with a slash command:

```
/skill-name
```

Or you can let Claude invoke it automatically when it determines the skill is relevant to what you're doing.

That's the core mechanic. Everything else builds on top of it.

---

## Why Do Skills Exist?

The problem skills solve is context. Claude is capable of a lot, but it doesn't know your project's deploy process, your team's code review standards, your API conventions, or how you like your commits written. You end up re-explaining the same things every session.

Skills solve this in two ways:

**1. They encode repeatable workflows.** A `/deploy` skill knows your exact steps: run tests, build, push to the target, verify. You stop re-explaining it every time you want to ship.

**2. They transfer expertise.** A skill doesn't have to be yours. Someone who has spent years thinking about design, security, or code review can encode that thinking into a `SKILL.md` file. You install it. Now Claude approaches those topics with that person's framework.

The second one is the less obvious but more powerful use case.

---

## How Skills Work Technically

Skills follow the [Agent Skills](https://agentskills.io) open standard, so they're compatible with Claude Code, Cursor, Codex, and other tools — not locked to one platform.

A skill lives in a directory. The directory name is the slash command name.

```
~/.claude/skills/
  explain-code/
    SKILL.md
  deploy/
    SKILL.md
    scripts/
      run-deploy.sh
```

The `SKILL.md` has two parts: YAML frontmatter and Markdown instructions.

```yaml
---
name: explain-code
description: Explains code with diagrams and analogies. Use when explaining how code works or when asked "how does this work?"
---

When explaining code:
1. Start with an analogy from everyday life
2. Draw an ASCII diagram showing the structure
3. Walk through what happens step by step
4. Call out a common gotcha
```

The `description` field is what Claude reads to decide whether to load the skill automatically. Write it like you're explaining to someone when they should use this — because that's exactly what it is.

---

## Where Skills Live

Skills at different locations have different scopes:

| Location | Path | Scope |
|----------|------|-------|
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<name>/SKILL.md` | This project only |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Where plugin is enabled |
| Enterprise | Managed settings | All org users |

Personal skills are the ones I reach for most. Write it once, use it everywhere.

---

## Controlling Who Invokes a Skill

By default, both you and Claude can invoke a skill. Two frontmatter fields let you restrict this:

**`disable-model-invocation: true`** — Only you can trigger it. Use this for anything with side effects. You don't want Claude deciding to deploy because your code looks ready.

**`user-invocable: false`** — Only Claude can invoke it. Use this for background knowledge that isn't a meaningful action. A `legacy-system-context` skill that explains how an old codebase works shouldn't appear in your slash command menu — Claude should just load it when relevant.

| Setting | You can invoke | Claude can invoke |
|---------|---------------|-------------------|
| Default | Yes | Yes |
| `disable-model-invocation: true` | Yes | No |
| `user-invocable: false` | No | Yes |

---

## Arguments

Skills accept arguments via `$ARGUMENTS`. When you type `/fix-issue 123`, the `$ARGUMENTS` placeholder in your skill gets replaced with `123`.

```yaml
---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---

Fix GitHub issue $ARGUMENTS following our coding standards.

1. Read the issue description
2. Implement the fix
3. Write tests
4. Create a commit
```

You can also access individual arguments by position with `$ARGUMENTS[0]`, `$ARGUMENTS[1]`, or the shorthand `$0`, `$1`.

---

## Dynamic Context Injection

The `` !`<command>` `` syntax executes a shell command before the skill runs, and injects the output directly into the prompt. Claude never sees the command itself — only the result.

```yaml
---
name: pr-summary
description: Summarize a pull request
context: fork
---

## Pull request context
- Diff: !`gh pr diff`
- Comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

Summarize this pull request concisely.
```

When this runs, the three shell commands execute first. Their output fills in the placeholders. Claude receives a prompt already loaded with real data.

This is genuinely useful. Instead of Claude having to fetch context itself (with all the round-trips that involves), you can pre-load it deterministically before the skill even starts.

---

## Running Skills in a Subagent

Add `context: fork` to run a skill in an isolated context — no access to your conversation history, clean slate.

```yaml
---
name: deep-research
description: Research a topic thoroughly
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:
1. Find relevant files using Glob and Grep
2. Read and analyze the code
3. Return findings with specific file references
```

The `agent` field specifies which subagent to use: `Explore`, `Plan`, `general-purpose`, or any custom agent you've defined. The skill content becomes the task. Results come back to your main conversation.

---

## Bundled Skills You Already Have

Claude Code ships with several skills out of the box:

| Skill | What it does |
|-------|-------------|
| `/batch <instruction>` | Decomposes large changes into parallel units, spawns one agent per unit in isolated git worktrees, opens a PR per unit |
| `/simplify` | Runs three review agents in parallel, aggregates findings, applies fixes to recently changed files |
| `/loop [interval] <prompt>` | Runs a prompt repeatedly on a schedule — useful for polling deploys or babysitting PRs |
| `/debug` | Reads your session debug log to troubleshoot issues |
| `/claude-api` | Loads Claude API reference for your language and activates automatically when you import the SDK |

`/batch` in particular is worth calling out. You describe a large migration or refactor, it researches the codebase, proposes a decomposition of 5–30 independent units, and — once you approve — spawns a parallel agent per unit. Each agent works in an isolated worktree, runs tests, and opens a pull request. That's a meaningful change in what one person can execute.

---

## Supporting Files

A skill isn't just the `SKILL.md`. The entire directory is yours to use.

```
my-skill/
├── SKILL.md          (required)
├── reference.md      (detailed docs — loaded when needed)
├── examples/
│   └── sample.md     (example output)
└── scripts/
    └── helper.py     (script Claude can run)
```

Reference supporting files from `SKILL.md` so Claude knows they exist and when to load them. The convention: keep `SKILL.md` under 500 lines. Move the heavy documentation into separate files that Claude pulls in only when relevant.

---

## The Bigger Picture

Custom commands in Claude Code already existed. Skills extend that concept in a few important ways: a dedicated directory for supporting files, frontmatter for controlling invocation, subagent execution support, and dynamic context injection.

But more importantly, skills standardize how agent expertise is packaged and shared. The same `SKILL.md` file works in Claude Code, Cursor, Codex. Someone who's great at security review or database schema design can encode that expertise once and distribute it. You install it. The knowledge is now part of your workflow.

That's the part I find interesting. Not just "write instructions for your own workflow" but "borrow someone else's hard-won expertise as a transferable file."

---

*Docs: [Claude Code Skills](https://code.claude.com/docs/en/skills) — [Agent Skills open standard](https://agentskills.io)*
