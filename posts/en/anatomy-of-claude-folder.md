---
title: "What Is CLAUDE.md? The Complete Claude Code Configuration Guide"
date: "2026-03-23"
excerpt: "CLAUDE.md is the instruction file that tells Claude Code how to behave in your project — your rules, architecture, and conventions loaded automatically every session. This guide covers the entire .claude/ folder: rules, commands, skills, agents, and settings.json."
tags: ["CLAUDE.md", "Claude Code", "Claude Code Configuration", "AI", "Developer Tools", "Agent", "Productivity"]
category: "Tools"
---

**CLAUDE.md is an instruction file that tells Claude Code how to behave in your project.** Every time you start a session, Claude reads this file and applies its rules, architectural context, and constraints throughout the entire conversation.

In short: this is where you tell Claude who you are and how you work.

---

## Where does CLAUDE.md go?

Place it in your project root:

```
your-project/
├── CLAUDE.md       ← here
├── src/
└── package.json
```

That's it. Claude Code finds and reads this file automatically when a session starts.

You can also put it in multiple places:

- **Project root** (`./CLAUDE.md`) — team-shared rules, committed to git
- **Subdirectories** — folder-specific rules that only apply in that context
- **Global** (`~/.claude/CLAUDE.md`) — personal preferences across all your projects

Claude finds all of them and combines them.

---

## What goes in CLAUDE.md?

Most people write too much or too little. Here's what actually works:

**Write:**
- Build, test, and lint commands (`npm run test`, `make build`)
- Key architectural decisions ("we use a monorepo with Turborepo")
- Non-obvious gotchas ("TypeScript strict mode is on, unused variables are errors")
- Import conventions, naming patterns, error handling styles

**Don't write:**
- Anything that belongs in a linter or formatter config
- Full documentation you can already link to
- Long paragraphs explaining theory

**Keep it under 200 lines.** Files longer than that eat too much context and Claude's instruction adherence actually drops.

### A minimal but effective CLAUDE.md

```
# Project: Acme API

## Commands
npm run dev    # Start dev server
npm run test   # Run tests (Jest)
npm run lint   # ESLint + Prettier check
npm run build  # Production build

## Architecture
- Express REST API, Node 20
- PostgreSQL via Prisma ORM
- All handlers in src/handlers/
- Shared types in src/types/

## Conventions
- Use zod for request validation in every handler
- Return shape is always { data, error }
- Never expose stack traces to the client
- Use the logger module, not console.log

## Watch out for
- Tests use a real local DB, not mocks
- Strict TypeScript: no unused imports, ever
```

About 20 lines. Enough for Claude to work productively in this codebase without constant clarification.

### CLAUDE.local.md for personal overrides

If you have a preference specific to you — not the whole team — create `CLAUDE.local.md` in the project root. Claude reads it alongside the main `CLAUDE.md`, and it's automatically gitignored so your personal tweaks never land in the repo.

---

## What else is inside the .claude/ folder?

`CLAUDE.md` is just one piece. The full `.claude/` folder looks like this:

```
.claude/
├── settings.json       # Permissions and config
├── settings.local.json # Personal permission overrides (gitignored)
├── commands/           # Custom slash commands
├── rules/              # Modular instruction files
├── skills/             # Auto-invoked workflows
└── agents/             # Specialized subagent personas
```

Let's walk through each one.

---

## rules/: modular instructions that scale

As projects grow, `CLAUDE.md` gets bloated and nobody maintains it. The `rules/` folder fixes this.

Every markdown file inside `.claude/rules/` loads alongside your `CLAUDE.md` automatically:

```
.claude/rules/
├── code-style.md
├── testing.md
├── api-conventions.md
└── security.md
```

Each file stays focused. The person who owns API conventions edits `api-conventions.md`. The person who owns testing standards edits `testing.md`. Nobody steps on each other.

The real power is **path-scoped rules** — add YAML frontmatter to a rule file and it only activates when Claude is working in matching directories:

```markdown
---
paths:
  - "src/api/**/*.ts"
  - "src/handlers/**/*.ts"
---
# API Design Rules
- All handlers return { data, error } shape
- Use zod for request body validation
- Never expose internal error details to clients
```

Claude won't load this file when editing a React component. Only when working inside `src/api/` or `src/handlers/`. Rules without a `paths` field load unconditionally every session.

---

## commands/: custom slash commands

Claude Code ships with built-in slash commands like `/help` and `/compact`. The `commands/` folder lets you add your own.

Every markdown file in `.claude/commands/` becomes a slash command:
- `review.md` → `/project:review`
- `fix-issue.md` → `/project:fix-issue`

Here's a real example:

```markdown
---
description: Review the current branch diff for issues before merging
---

## Changes to Review
!`git diff --name-only main...HEAD`

## Detailed Diff
!`git diff main...HEAD`

Review the above changes for:
1. Code quality issues
2. Security vulnerabilities
3. Missing test coverage

Give specific, actionable feedback per file.
```

The `!` backtick syntax runs shell commands and embeds the output. Running `/project:review` gives Claude the real git diff — not saved text, actual live data.

### Passing arguments: $ARGUMENTS

```markdown
---
description: Investigate and fix a GitHub issue
argument-hint: [issue-number]
---

Look at issue #$ARGUMENTS in this repo.
!`gh issue view $ARGUMENTS`

Understand the bug, trace it to root cause, fix it, and write a test.
```

Running `/project:fix-issue 234` feeds issue 234's full content directly into the prompt.

Project commands in `.claude/commands/` are committed and shared with your team. Commands you want everywhere go in `~/.claude/commands/` and show up as `/user:command-name`.

---

## skills/: workflows Claude can trigger itself

Commands run when you call them. **Skills are different: Claude watches the conversation and invokes them automatically when the task matches the skill's description.**

When you say "review this PR for security issues," Claude reads the skill description, recognizes the match, and invokes it — no slash command needed. You can still call it explicitly with `/security-review`.

Each skill lives in its own subdirectory:

```
.claude/skills/
├── security-review/
│   ├── SKILL.md
│   └── DETAILED_GUIDE.md
└── deploy/
    └── SKILL.md
```

```markdown
---
name: security-review
description: Comprehensive security audit. Use when reviewing code for vulnerabilities, before deployments, or when the user mentions security.
allowed-tools: Read, Grep, Glob
---

Analyze the codebase for security vulnerabilities:
1. SQL injection and XSS risks
2. Exposed credentials or secrets
3. Insecure configurations

Report findings with severity ratings and remediation steps.
Reference @DETAILED_GUIDE.md for our security standards.
```

Unlike commands, skills can bundle supporting files alongside them. The `@DETAILED_GUIDE.md` reference pulls in a detailed document that lives right next to `SKILL.md`. Commands are single files. Skills are packages.

---

## agents/: specialized subagent personas

For tasks complex enough to benefit from a dedicated specialist, define a subagent persona in `.claude/agents/`. Each agent has its own system prompt, tool access, and model preference:

```markdown
---
name: code-reviewer
description: Expert code reviewer. Use PROACTIVELY when reviewing PRs, checking for bugs, or validating implementations before merging.
model: sonnet
tools: Read, Grep, Glob
---

You are a senior code reviewer focused on correctness and maintainability.

When reviewing code:
- Flag bugs, not just style issues
- Suggest specific fixes, not vague improvements
- Check for edge cases and error handling gaps
- Note performance concerns only when they matter at scale
```

When Claude needs a code review, it spawns this agent in its own isolated context window. The agent does its work and reports back. Your main session doesn't get cluttered with thousands of tokens of intermediate exploration.

The `tools` field restricts what the agent can do — a security auditor has no business writing files. The `model` field lets you use a cheaper, faster model for focused read-only tasks and save Sonnet for the work that actually needs it.

---

## settings.json: permissions and security

`.claude/settings.json` controls what Claude is and isn't allowed to do:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Read",
      "Write",
      "Edit"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

- **allow** — runs without asking for confirmation
- **deny** — blocked entirely, no exceptions
- **Neither list** — Claude asks before proceeding

The `$schema` line enables autocomplete and inline validation in VS Code and Cursor. Always include it.

For permission changes you don't want committed, create `.claude/settings.local.json` — it's auto-gitignored.

---

## The global ~/.claude/ folder

Alongside your project `.claude/`, there's one in your home directory. The distinction:

| | `.claude/` (project) | `~/.claude/` (global) |
|---|---|---|
| Scope | This project only | All projects |
| Git | Committed | Never |
| Use for | Team rules | Personal preferences |

`~/.claude/CLAUDE.md` loads into every session across all your projects. Your personal coding principles and style preferences go here.

`~/.claude/projects/` stores session transcripts and auto-memory per project. Claude automatically saves notes as it works — commands it discovers, patterns it observes, architecture insights. These persist across sessions. Browse them with `/memory`.

---

## Where to start

**Step 1.** Run `/init` inside Claude Code. It generates a starter `CLAUDE.md` by reading your project. Edit it down to the essentials.

**Step 2.** Add `.claude/settings.json` with allow/deny rules for your stack. At minimum, allow your run commands and deny `.env` reads.

**Step 3.** Create one or two commands for your most frequent workflows — code review and issue fixing are good starting points.

**Step 4.** As your `CLAUDE.md` gets crowded, start splitting into `.claude/rules/` files scoped by path.

**Step 5.** Add `~/.claude/CLAUDE.md` with your personal preferences.

That covers 95% of projects. Skills and agents come in when you have recurring complex workflows worth packaging up.

---

## Frequently asked questions

### Does Claude Code work without CLAUDE.md?

Yes. But you end up managing the conversation manually — Claude learns your project, rules, and preferences from scratch every time. CLAUDE.md makes that learning happen once.

### What's the difference between CLAUDE.md and .cursorrules?

Both apply the same idea: giving your AI editor project context. `.cursorrules` is Cursor-specific; CLAUDE.md is for Claude Code. Claude Code also supports the `.cursor/rules` format if you're migrating.

### Can CLAUDE.md be a security risk?

Potentially — a malicious CLAUDE.md could contain harmful instructions. A good habit: read the CLAUDE.md before starting a session in a cloned repository you don't own. The deny list in `settings.json` adds a second layer of protection.

### How many CLAUDE.md files can I have?

As many as you need. Project root, subdirectories, and `~/.claude/CLAUDE.md` all work together. Claude reads and merges all of them.

### What language should CLAUDE.md be written in?

Whatever Claude understands — which includes most major languages. English is common in team settings since everyone can read it, but there's no technical requirement.
