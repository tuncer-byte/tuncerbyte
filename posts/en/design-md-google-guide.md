---
title: "DESIGN.md: Google's Open-Source Format That Teaches AI Agents Your Design System"
date: "2026-04-25"
excerpt: "Google Labs open-sourced DESIGN.md on April 21, 2026 — a single file that gives AI coding agents a persistent, structured understanding of your visual identity. YAML tokens for exact values, markdown prose for the why. Works with Claude Code, Cursor, and GitHub Copilot."
tags: ["DESIGN.md", "Google Labs", "AI Coding", "Design System", "Design Tokens", "Claude Code", "Cursor", "GitHub Copilot", "Stitch", "Frontend Development", "CSS", "Tailwind"]
category: "Technology"
---

Every time you ask an AI coding agent to add a new component, it guesses. It picks a button color, invents a border-radius, chooses a font weight — and the output rarely matches the rest of your app unless you re-describe your entire design system in every single prompt.

**DESIGN.md** is Google's answer to that problem.

On April 21, 2026, Google Labs open-sourced the DESIGN.md specification — a file format that gives AI coding agents a persistent, structured understanding of your design system. Think of it as README.md, but for your visual identity. Once it exists in your project, agents stop guessing and start knowing.

Available on [GitHub](https://github.com/google-labs-code/design.md) under the **Apache 2.0** license. Currently in **alpha**, with 7.9k stars and 633 forks.

---

## The Problem DESIGN.md Solves

Modern development teams use AI agents constantly — Claude Code, Cursor, GitHub Copilot. Each one can write clean, functional code. None of them know what your brand looks like.

Without a design system file, every component generation becomes a negotiation:

> "Use `#1A1C1E` for text, `Public Sans` at 1rem, 8px border radius..."

You're not prompting an agent — you're teaching it from scratch on every message. Context gets lost between sessions. Different agents produce different outputs for the same task. The design drifts.

DESIGN.md gives agents a source of truth they can read once and apply everywhere.

---

## The Format: Two Layers

The file pairs two complementary layers:

**1. YAML front matter** — machine-readable design tokens. Exact values that agents can parse deterministically, validate against each other, and export to Tailwind or W3C DTCG format without touching the prose.

**2. Markdown body** — human-readable rationale. The *why* behind each decision. Enough semantic context for agents to make judgment calls when a token doesn't directly cover a case.

As the spec puts it: *"Tokens give agents exact values. Prose tells them why those values exist and how to apply them."*

### A Minimal Example

```markdown
---
name: Heritage

colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"

typography:
  h1:
    fontFamily: Public Sans
    fontSize: 3rem
    fontWeight: 700
  body-md:
    fontFamily: Public Sans
    fontSize: 1rem
    lineHeight: 1.5

spacing:
  sm: 8px
  md: 16px
  lg: 32px

rounded:
  sm: 4px
  md: 8px
  lg: 16px
---

## Colors

**Primary (#1A1C1E):** Deep charcoal — the base for all text and structural elements.
Keep it on white or neutral backgrounds only. Never use on dark surfaces.

**Tertiary (#B8422E):** Boston Clay — the sole interaction driver. Use for
call-to-action buttons, links, and active states. Nowhere else.

## Typography

Public Sans communicates editorial clarity without formality. H1 at 3rem sets
hierarchy for landing pages. Body-md is the floor — never go below 1rem for
readable content.
```

The hex code `#B8422E` is machine-readable. The prose "Boston Clay — the sole interaction driver" teaches the agent *when* to apply it. Both layers are necessary.

---

## Token Types

DESIGN.md supports a full design token vocabulary:

### Colors
Primary, secondary, tertiary, and neutral palettes. Each color gets a semantic description explaining its intended use — not just the hex value.

### Typography
Font families, sizes, weights, line heights, and letter spacing for each text role (headings, body, captions, labels). Agents can map these directly to CSS custom properties or Tailwind classes.

### Spacing
Named spacing scales (`sm`, `md`, `lg`, `xl`) in px, em, or rem. Consistent across margin, padding, and gap usage throughout the project.

### Rounding
Border radius values for each size tier. Prevents the inconsistency of mixing `4px`, `6px`, and `8px` corners across components built in different sessions.

### Components
Token-referenced component definitions with state variants:

```yaml
components:
  button-primary:
    background: "{{ colors.tertiary }}"
    color: "#FFFFFF"
    borderRadius: "{{ rounded.md }}"
    padding: "{{ spacing.sm }} {{ spacing.md }}"
    states:
      hover:
        background: "#9E3022"
      disabled:
        opacity: 0.4
```

Token references (`{{ colors.tertiary }}`) create explicit links between component definitions and raw values. The linter validates these references — a renamed token surfaces as a broken reference immediately.

### Agent Prompt
An optional section for tool-specific instructions:

```yaml
agentPrompt: |
  Always check DESIGN.md before writing CSS or component styles.
  Use token names in comments to make values traceable.
  Never introduce a color not defined in the colors section.
```

---

## The CLI

The `@google/design.md` CLI handles validation, comparison, and export.

### Install

```bash
npm install @google/design.md
```

### Lint

Validates structural correctness and accessibility:

```bash
npx @google/design.md lint DESIGN.md
```

What it checks:
- Structural correctness (required fields present, valid format)
- **WCAG contrast ratio validation** — surfaces any color combinations that fail AA or AAA requirements
- Token reference integrity — broken `{{ token.reference }}` links
- Missing primary color definitions
- Seven linting rules total, returning structured JSON output

### Diff

Detects token-level changes between design system versions:

```bash
npx @google/design.md diff DESIGN.md DESIGN-next.md
```

Useful during design handoffs, version reviews, or when auditing what changed after a rebrand. Catches regressions before they reach production.

### Export

Converts your DESIGN.md tokens to other formats:

```bash
# Tailwind CSS config
npx @google/design.md export --format tailwind DESIGN.md

# W3C Design Token Community Group (DTCG) format
npx @google/design.md export --format dtcg DESIGN.md
```

The Tailwind export generates a `theme.extend` block you can drop directly into `tailwind.config.js`. The DTCG export produces `tokens.json` compatible with the W3C standard — useful for style-dictionary pipelines or design tool integrations.

### Spec (for context injection)

```bash
npx @google/design.md spec --format json > design-spec-context.txt
```

Outputs the specification in a format suitable for injecting into AI prompts directly.

---

## Integration with AI Coding Tools

### Claude Code

Add a reference in your project root or `CLAUDE.md`:

```markdown
Before writing any CSS or component styles, read DESIGN.md in the project root.
Use token values only. Never introduce arbitrary colors, font sizes, or spacing values.
```

Claude Code will read the file at the start of each session and apply tokens consistently across every component it generates.

### Cursor

Add to `.cursorrules`:

```
Before writing UI code, read @DESIGN.md.
Use token values only — no arbitrary colors, spacing, or border radii.
Reference token names in CSS comments for traceability.
```

### GitHub Copilot

Copilot doesn't read files automatically. Use the spec command to inject context into your prompts:

```bash
npx @google/design.md spec > design-spec-context.txt
```

Then include the content in your Copilot Chat session or system prompt configuration.

---

## How to Get Started

Three paths, depending on your current setup:

### 1. Generate from Google Stitch (Recommended)

If you're using [Stitch](https://withgoogle.com/stitch), it can generate a DESIGN.md file automatically from your visual design system. Export it and commit it to your project root.

### 2. Use a Template

The `awesome-design-md` repository on GitHub contains community-contributed templates for common design systems. Clone the nearest match and adapt it to your brand.

### 3. Write Manually

Start with the minimal example above. Add sections as your design system grows. The spec is readable enough to follow without tooling — the YAML front matter is the hard part; the markdown prose is free-form.

---

## Practical Workflow

Once DESIGN.md exists in your repo, the workflow changes:

**Before DESIGN.md:**
> "Add a primary button — use our brand red `#B8422E`, Public Sans bold, 8px radius, 8px vertical / 16px horizontal padding."

**After DESIGN.md:**
> "Add a primary button."

The agent reads the file, finds the `button-primary` component definition, resolves the token references, and generates the component — without being taught the values every time.

For teams with multiple developers all using different AI tools, this creates consistency that was previously impossible without a strict manual review process.

---

## Limitations

Worth knowing before you commit:

- **Alpha specification.** The format is actively evolving. Field names and structure may change between releases.
- **Manual prompt referencing required** in most tools. The spec doesn't automatically inject itself — you need to configure each agent to read it.
- **Not a Figma replacement.** DESIGN.md doesn't handle design collaboration, permissions, or visual editing. It's a code-adjacent format for agent consumption.
- **V4-Pro-scale outputs still in beta** — Stitch API outputs above 2K tokens are in beta; complex systems may need manual cleanup.
- **No component library.** The spec describes tokens and component patterns, not pre-built component code.

---

## Why It Matters

DESIGN.md is positioning itself as the `package.json` of design systems — a standard file every project has, that every tool knows how to read. If it reaches broad adoption:

- Switching AI coding tools won't mean re-explaining your brand from scratch
- Design system changes in DESIGN.md propagate to every tool automatically
- Accessibility validation becomes automated, not manual
- Open-source projects can ship a design system other contributors can use immediately

The Apache 2.0 license means any editor, IDE plugin, or AI tool can implement DESIGN.md support without restrictions. That's what makes this a potential industry-wide standard rather than a Google-proprietary format.

**Repository:** [github.com/google-labs-code/design.md](https://github.com/google-labs-code/design.md)

**Stitch (generate your DESIGN.md):** [withgoogle.com/stitch](https://withgoogle.com/stitch)

Sources:
- [Stitch's DESIGN.md format is now open-source — Google Blog](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/)
- [Google's open-source DESIGN.md — The Decoder](https://the-decoder.com/googles-open-source-design-md-gives-ai-agents-a-prompt-ready-blueprint-for-brand-consistent-design/)
- [What Is DESIGN.md? — MindWiredAI](https://mindwiredai.com/2026/04/23/design-md-is-now-open-source-googles-new-file-format-that-makes-ai-build-your-brand-correctly/)
- [Google makes DESIGN.md open source — Medium / Bootcamp](https://medium.com/design-bootcamp/google-makes-design-md-open-source-on-its-way-to-become-a-industry-standard-16119f2368dd)
- [DESIGN.md goes open source — Awesome Agents](https://awesomeagents.ai/news/google-design-md-open-source-spec/)
