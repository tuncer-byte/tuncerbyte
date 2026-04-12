---
title: "Claude Certified Architect: What You Actually Need to Know"
date: "2026-03-16"
excerpt: "The Claude Certified Architect exam is only available to Anthropic partners. The knowledge behind it is not. Five domains, everything that matters, no fluff."
tags: ["Claude", "Claude Code", "MCP", "Agent SDK", "Claude API", "Agentic AI", "Production", "Architecture"]
category: "Tools"
---

The Claude Certified Architect (Foundations) exam exists. It covers Claude Code, the Agent SDK, the Claude API, and Model Context Protocol. To take the exam you need to be an Anthropic partner.

You do not need the certificate to build production-grade Claude applications. You need the knowledge. Here is what the exam tests — distilled into what actually matters.

---

## The Five Domains

| Domain | Weight |
|--------|--------|
| Agentic Architecture & Orchestration | 27% |
| Claude Code Configuration & Workflows | 20% |
| Prompt Engineering & Structured Output | 20% |
| Tool Design & MCP Integration | 18% |
| Context Management & Reliability | 15% |

---

## Domain 1 — Agentic Architecture & Orchestration (27%)

The heaviest domain. Most mistakes here come from misunderstanding how the agentic loop actually works.

**The loop:** Send request → inspect `stop_reason` → if `tool_use`: execute, append results, loop → if `end_turn`: done.

Three anti-patterns the exam specifically tests — all wrong:

- Parsing natural language to detect loop termination
- Using arbitrary iteration caps as the primary stopping mechanism
- Checking whether `response.content[0].type == "text"` as a completion signal

`stop_reason` exists for exactly this purpose. Use it.

**Multi-agent orchestration:** The coordinator sits at the centre. Subagents are spokes. All communication routes through the coordinator. Subagents never talk to each other directly.

The single most commonly misunderstood principle: **subagents do not share memory with the coordinator**. They do not inherit conversation history. Every piece of information a subagent needs must be passed explicitly in its prompt.

**Enforcement:** For business rules with financial or security consequences, prompt instructions are not enough. A prompt has a non-zero failure rate. Programmatic hooks and prerequisite gates do not. When the cost of a single failure is high, use programmatic enforcement.

**Task decomposition strategies:**

- *Fixed sequential pipelines* — predetermined steps, consistent and reliable, best for structured tasks
- *Dynamic adaptive decomposition* — subtasks generated based on what is discovered, best for open-ended investigation

When processing large codebases, attention dilution is real. Split reviews into per-file local passes and a separate cross-file integration pass.

**Session management:** `--resume` to continue a prior session, `fork_session` to branch from a shared baseline, fresh start with summary injection when tool results are stale or files have changed.

**What to build:** A coordinator with two subagents, proper context passing with structured metadata, a programmatic prerequisite gate, and a `PostToolUse` normalisation hook. This one exercise covers most of Domain 1.

---

## Domain 2 — Tool Design & MCP Integration (18%)

Tool descriptions are not supplementary. They are the primary mechanism Claude uses for tool selection. Vague descriptions cause misrouting. Better descriptions is almost always the correct first fix — not few-shot examples, not routing classifiers, not tool consolidation.

**What a good tool description includes:**

- What the tool does (primary purpose)
- Expected inputs — formats, types, constraints
- Example queries it handles well
- When to use it versus similar tools

**Tool overload:** Giving an agent 18 tools degrades reliability. Scope each subagent to 4–5 tools relevant to its role.

**`tool_choice` options:**

- `"auto"` — model may return text or call a tool (default)
- `"any"` — model must call a tool, chooses which
- `{"type": "tool", "name": "..."}` — model must call this specific tool

**Error response structure** — four categories to distinguish:

- *Transient* — timeout, service unavailable. Retryable.
- *Validation* — invalid input. Fix input, retry.
- *Business* — policy violation. Not retryable. Needs alternative workflow.
- *Permission* — access denied. Needs escalation.

A valid empty result (tool reached the source, found nothing) is not an access failure. Do not retry it.

**MCP configuration scoping:**

- Project-level (`.mcp.json`) — version-controlled, shared with the team
- User-level (`~/.claude.json`) — personal, not shared

Use community MCP servers for standard integrations (GitHub, Jira, Slack). Only build custom servers for team-specific workflows that community servers cannot handle.

**Built-in tool distinction:**

- `Grep` — searches file *contents* for patterns
- `Glob` — matches file *paths* by naming patterns

Know which to reach for first.

---

## Domain 3 — Claude Code Configuration & Workflows (20%)

This domain separates people who use Claude Code from people who have configured it for a team.

**CLAUDE.md hierarchy:**

- *User-level* (`~/.claude/CLAUDE.md`) — applies only to you. Not version-controlled, not shared via git.
- *Project-level* (`.claude/CLAUDE.md`) — applies to everyone. Version-controlled. This is where team-wide standards live.
- *Directory-level* — applies when working in that specific directory.

The exam's favourite trap: a new team member is missing instructions because they live in user-level config instead of project-level.

**Path-specific rules** (`.claude/rules/`) with YAML frontmatter:

```yaml
---
paths: ["**/*.test.tsx"]
---
```

These apply to matching files across the entire codebase. Directory-level CLAUDE.md only applies to its own directory. For test conventions spread across 50+ directories, path-specific rules win.

**Skills frontmatter options:**

- `context: fork` — runs in isolated sub-agent context. Verbose output stays contained. Use for analysis and brainstorming.
- `allowed-tools` — restricts which tools the skill can use. Prevents destructive actions.

**Plan mode vs direct execution:**

Use plan mode for: monolith restructuring, multi-file migration, library upgrades, architectural decisions.

Use direct execution for: single-file bug fixes, clear and well-understood changes.

**CI/CD:** The `-p` flag runs Claude Code in non-interactive (print) mode. Without it, a CI job will hang waiting for input. `--output-format json` with `--json-schema` produces machine-parseable structured output for automated PR comments.

An independent review instance catches more issues than self-review in the same session — the model retains reasoning context that makes it less likely to question its own decisions.

---

## Domain 4 — Prompt Engineering & Structured Output (20%)

Two words: be explicit.

"Be conservative" does not improve precision. "Only report high-confidence findings" does not reduce false positives. What works: defining exactly which issues to report versus skip, with concrete code examples for each severity level.

**Few-shot examples** are the highest-leverage technique in this domain. 2–4 targeted examples showing ambiguous-case handling, each with reasoning for why one action was chosen over plausible alternatives. More effective than additional prose instructions.

**`tool_use` with JSON schemas** eliminates syntax errors entirely. It does not prevent semantic errors (line items that do not sum to a total, values in wrong fields, fabricated values for required fields).

**Schema design principles:**

- Optional/nullable fields when source may not contain the information — this prevents fabrication
- `"unclear"` enum values for ambiguous cases
- `"other"` + freeform detail string for extensible categorisation

**Validation-retry loops:** Send back the original document, the failed extraction, and the specific validation error. Effective for format mismatches and structural errors. Not effective for information genuinely absent from the source.

**Message Batches API:**

- 50% cost savings
- Up to 24-hour processing window
- No guaranteed latency SLA
- Does not support multi-turn tool calling within a single request

Rule: synchronous API for blocking workflows (pre-merge checks). Batch API for latency-tolerant workflows (overnight reports, nightly test generation).

---

## Domain 5 — Context Management & Reliability (15%)

Smallest weighting. Mistakes here cascade everywhere.

**Progressive summarisation trap:** Condensing conversation history turns "customer wants a refund of $247.83 for order #8891 placed on March 3rd" into "customer wants a refund for a recent order." Fix: extract transactional facts into a persistent "case facts" block. Include in every prompt. Never summarise it.

**"Lost in the middle" effect:** Models process the beginning and end of long inputs reliably. Key findings buried in the middle get missed. Place summaries at the beginning and use explicit section headers.

**Valid escalation triggers (three):**

1. Customer explicitly requests a human — honour immediately, do not attempt to resolve first
2. Policy gaps — the request falls outside documented policy
3. Inability to make meaningful progress

**Unreliable triggers the exam will tempt you with:**

- Sentiment analysis — frustration does not correlate with case complexity
- Self-reported confidence scores — the model is often incorrectly confident on hard cases

**Error propagation done right:**

Structured context: failure type, what was attempted, partial results gathered, potential alternatives.

Anti-patterns to avoid: silently suppressing errors (prevents recovery) and terminating the entire workflow on a single failure (throws away partial results).

**Context degradation in long sessions:** The model starts referencing "typical patterns" instead of specific classes it found earlier. Mitigations: scratchpad files for key findings, subagent delegation for specific investigations, `/compact` when context fills with verbose discovery output.

---

## Where to Learn This

These are Anthropic's own resources, in order of relevance per domain:

**Domain 1 — Agentic Architecture**
- [Agent SDK Overview](https://anthropic.com) — agentic loop mechanics and subagent patterns
- [Building Agents with the Claude Agent SDK](https://anthropic.com) — hooks, orchestration, sessions

**Domain 2 — Tool Design & MCP**
- [MCP Integration for Claude Code](https://anthropic.com) — server scoping, environment variable expansion
- [MCP specification and community servers](https://modelcontextprotocol.io)

**Domain 3 — Claude Code Configuration**
- [Claude Code official docs](https://docs.anthropic.com/en/docs/claude-code) — CLAUDE.md hierarchy, rules directory, slash commands
- [Claude Code CLI Reference](https://docs.anthropic.com/en/docs/claude-code)

**Domain 4 — Prompt Engineering**
- [Anthropic Prompt Engineering docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Tool Use documentation](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)

**Domain 5 — Context Management**
- [Building Agents with the Claude Agent SDK](https://anthropic.com) — escalation, error propagation

---

## The Build Path

You do not study this material by reading it. You study it by building:

1. A multi-tool agent with stop_reason handling, a PostToolUse normalisation hook, and a tool call interception hook
2. A coordinator with two subagents — proper context passing, structured metadata, a programmatic prerequisite gate
3. A project with CLAUDE.md hierarchy, `.claude/rules/` glob patterns, a skill using `context: fork`, CI script with `-p` flag
4. An extraction pipeline using `tool_use` with required, optional, and nullable fields — with a validation-retry loop and batch processing

Four builds. Most of the exam covered.

---

The certificate requires partner access. The knowledge does not.
