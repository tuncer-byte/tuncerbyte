---
title: "Claude Code Channels: Control AI via Telegram or Discord"
date: "2026-03-20"
excerpt: "Channels lets you send messages to a running Claude Code session from Telegram or Discord and get replies back. Control your AI agent remotely."
tags: ["Claude Code", "AI Agent", "Telegram", "Discord", "MCP", "Automation", "Artificial Intelligence"]
category: "Technology"
---

Anthropic just shipped **Channels** for Claude Code. The short version: while Claude Code is running in your terminal, you can send it a message from Telegram or Discord and it will reply back on the same platform. You don't have to be at your desk.

This is a research preview — requires Claude Code v2.1.80+ and a claude.ai login. API key authentication isn't supported.

## What Channels Actually Does

Normal Claude Code: you're at the terminal, you type, Claude responds. Channels removes the requirement of being at the terminal.

You're away from your desk. You send a message to your Telegram bot: *"did the build pass?"* Claude runs the check, and the result comes back to Telegram. Some practical scenarios:

- A CI pipeline fails → Claude analyzes the error, sends a summary to Discord
- A teammate asks a question in a shared Discord channel → Claude answers
- A monitoring alert fires → Claude reads the logs, explains what happened
- You're on the couch and type *"merge that branch"* → it happens

Channels are two-way: a message comes in, Claude reads it and replies via a tool. In your terminal you see the incoming message and the tool call, but not the reply text — that goes straight to Telegram/Discord.

## Try It First with Fakechat

Before connecting a real platform, test the flow with `fakechat`. You need [Bun](https://bun.sh) installed:

```bash
bun --version  # if not found: bun.sh/docs/installation
```

Three steps:

```bash
# 1. Install the plugin
/plugin install fakechat@claude-plugins-official

# 2. Start Claude Code with channels enabled
claude --channels plugin:fakechat@claude-plugins-official

# 3. Open in browser
# http://localhost:8787
```

Messages you type in the browser arrive instantly in your Claude Code session, and Claude's reply shows up on screen. Good way to see the whole flow before touching real credentials.

## Setting Up Telegram

### 1. Create a bot

Go to [@BotFather](https://t.me/BotFather) on Telegram, send `/newbot`, pick a display name and a unique username ending in `bot`. Copy the token.

### 2. Install the plugin

```bash
/plugin install telegram@claude-plugins-official
```

### 3. Save your token

```bash
/telegram:configure <token>
```

This saves to `.claude/channels/telegram/.env` in your project. You can also set `TELEGRAM_BOT_TOKEN` as a shell environment variable before launching.

### 4. Start with channels enabled

```bash
claude --channels plugin:telegram@claude-plugins-official
```

### 5. Pair your account

Send any message to your bot on Telegram. It replies with a pairing code. Back in Claude Code:

```bash
/telegram:access pair <code>
/telegram:access policy allowlist
```

Only your account can now push messages to the session.

## Setting Up Discord

### 1. Create a bot

Go to the [Discord Developer Portal](https://discord.com/developers/applications), create a new application, and generate a bot token. Under **Privileged Gateway Intents**, enable **Message Content Intent**.

### 2. Invite the bot to your server

In **OAuth2 → URL Generator**, select the `bot` scope and grant these permissions: View Channels, Send Messages, Send Messages in Threads, Read Message History, Attach Files, Add Reactions. Open the generated URL and add the bot.

### 3. Install, configure, start

```bash
/plugin install discord@claude-plugins-official
/discord:configure <token>
claude --channels plugin:discord@claude-plugins-official
```

### 4. Pair your account

DM your bot on Discord. It sends a pairing code. Then:

```bash
/discord:access pair <code>
/discord:access policy allowlist
```

## The Security Model

Every channel plugin maintains a sender allowlist. Messages from IDs not on the list are silently dropped.

One important detail: having a server in `.mcp.json` is not enough to receive messages. The server must also be named explicitly in the `--channels` flag. If it's configured but not passed at startup, channel messages won't arrive.

## Running Unattended

If Claude hits a permission prompt while you're away, the session pauses and waits for you. To skip prompts entirely:

```bash
claude --channels plugin:telegram@claude-plugins-official --dangerously-skip-permissions
```

Only use this in environments you control and trust.

## Team / Enterprise Plans

Channels are disabled by default for Team and Enterprise organizations. An admin needs to enable them:

**claude.ai → Admin settings → Claude Code → Channels → Enable**

Or set `channelsEnabled: true` in managed settings. Individual Pro/Max users get channels by default — just opt in per session with `--channels`.

## Why This Matters

Claude Code has always been terminal-bound. Channels changes that. You can kick off a long-running task — a build, a test suite, a data migration — and step away. When it needs you, it reaches out. When it's done, it tells you.

This also opens up proper async workflows: have Claude watch a Discord channel, monitor a feed, or react to CI events without anyone being at a keyboard.

It's a research preview, so the API may change. For building your own custom channel, see the [Channels reference docs](https://code.claude.com/docs/en/channels-reference).
