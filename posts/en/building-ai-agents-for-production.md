---
title: "How to Build AI Agents That Actually Work in Production"
date: "2026-03-18"
excerpt: "Not agents that work in demos — agents that hold up when real users touch them. Seven principles, common failure modes, and a pre-deployment checklist."
tags: ["AI Agent", "Artificial Intelligence", "Engineering", "Production", "Software Architecture"]
category: "Technology"
---

Everyone wants to build AI agents. Almost nobody builds ones that actually work.

Every week I see the same pattern: someone watches a tutorial, copies a few lines of code, gets a demo running in 20 minutes, posts it on X, and calls themselves an AI agent developer. Then a real user touches the system and everything falls apart.

- The agent calls the same tool repeatedly and loops forever
- It picks the wrong tool at the wrong time
- It makes up answers instead of admitting it doesn't know
- It works perfectly on demo inputs but breaks on anything else
- It generates a massive API bill while accomplishing nothing

The problem isn't the model. It isn't the framework. It isn't which API you're using.

The problem is this: most people design agents like chatbots — and the two are fundamentally different systems.

A chatbot is a conversation. An agent is an employee.

Design an employee like a conversation, and that employee will eventually fail you.

---

## First: What Does an Agent Actually Do?

A chatbot is a simple loop: take input, produce output, done. An agent works very differently. It takes a goal, breaks it into steps, uses tools to gather information and take actions, evaluates its own progress, updates its plan as it learns, and either reaches the goal or decides it can't.

The core difference:

- **Chatbot:** input → output
- **Agent:** input → think → action → observe → think → action → observe → ... → output

This loop is called the **agentic loop**, and it's where everything starts.

### How the Loop Works Mechanically

1. You send a request to the model via the Messages API
2. The model processes it and responds
3. The response either contains a final answer or a tool call
4. If it's a tool call: you execute the tool, collect the result, and send it back as a new message
5. The model evaluates the new information and decides again: another tool, or done?
6. This continues until the model decides it has enough information to stop

### The Mistake Every Beginner Makes

Don't look for the model saying "I'm done" or "Here's my final answer" to know when an agent has finished. Look for `stop_reason: "end_turn"` from the API.

This is the number one mistake new agent developers make. They try to parse natural language output to detect completion — looking for words like "done," "finished," "final answer." But natural language is ambiguous. The model might say "I've finished the research phase" while planning to continue with analysis. The `stop_reason` field exists precisely to eliminate that ambiguity.

**Three anti-patterns to drop immediately:**

1. **Parsing natural language to stop the loop** — checking whether the model said "I'm done" is wrong. Use `stop_reason`.
2. **Setting an arbitrary iteration limit** — "stop after 10 loops" is wrong. An iteration limit is a safety net, not a primary mechanism.
3. **Treating text output as a completion signal** — the model can return text and tool calls simultaneously.

Get the agentic loop right and everything else becomes dramatically easier. Get it wrong and you'll spend weeks debugging mysterious behavior.

---

## 7 Principles of Production Agents

Seven things I've learned building agents in real production environments. These aren't suggestions — they're requirements. Skip any of them and your agent will eventually break in ways that are expensive and hard to diagnose.

---

### Principle 1: Plan Before You Open the Editor

This is where most people stumble, and it's the most important step.

People open their editor excited and immediately start writing agent logic. They code tools, write system prompts, wire up APIs — all before clearly defining what the agent is supposed to do.

Don't. Open a document first and answer these questions:

**What exactly does the agent need to do?** Not vague like "help with customer support." Specific like "resolve customer shipping issues by checking order status, tracking information, and estimated delivery dates."

**What tools does it need access to?** List every system, database, and API it will interact with. Will it be read-only, or does it need write and delete permissions?

**What does "success" look like?** A resolved ticket? A formatted report? If you can't define success concretely, the agent can't either.

**What does "failure" look like?** If a tool returns empty? If data is missing? If the user asks something out of scope?

**When should a human step in?** Define the situations where you want "ask a human instead of guessing." High-value refunds, requests with legal liability, product safety complaints.

If you can't describe what the agent will do in plain language, the agent can't figure it out on its own. Vague spec produces vague agents.

---

### Principle 2: Give the Agent Only the Tools It Needs

Every tool is an additional decision the model has to make.

"For this step, should I use A, B, C, D, E, or F?"

More tools means more decisions, higher probability of wrong choices, less predictable behavior. Start with a maximum of 3-5 tools. If you need more, you probably need multiple specialized agents rather than one overloaded one.

For every tool, define four things precisely:

**Name:** Clear, unambiguous, self-explanatory. Not `helper_function_2` — `search_product_database`. The name should communicate what it does at a glance.

**Description:** This is the most critical part. The model reads the description to decide whether to use the tool. Vague descriptions lead to random tool selection.

*Bad description:*
> "Useful for searching things"

*Good description:*
> "Searches the product database by product name or SKU code. Returns price, stock status, and specifications. Use when the user asks about product details, pricing, or availability. Do **not** use for order history or shipping status — use `check_order_status` for those."

The difference between those two descriptions is the difference between a working agent and a broken one.

**Parameters:** Define a strict JSON schema. Mark required fields, specify data types, add a description for every parameter.

**Return format:** Structural, consistent, actionable. Always include a status field: `success`, `error`, `no_results`.

Tool design is where you should spend more time than any other part of building an agent. The quality of your tools determines the quality of your agent.

---

### Principle 3: Handle Errors Like Production Code

Your agent will encounter errors in production. This isn't a possibility — it's a certainty.

APIs time out. Databases return empty. Services go down. Rate limits get hit. Data arrives corrupted.

Handle these upfront, or the model will do one of two things: **make up an answer** — acting as if no error occurred and generating plausible-sounding information — or **loop infinitely** — retrying the same failing operation over and over. Both are disasters in production.

```python
# Bad: model has no idea what happened
def search_database(query):
    try:
        return db.search(query)
    except:
        return None  # Model receives this and starts guessing

# Good: structural error with actionable information
def search_database(query):
    try:
        results = db.search(query)
        if not results:
            return {
                "status": "no_results",
                "message": f"No products found matching '{query}'.",
                "suggestion": "Try broader search terms or check for typos."
            }
        return {"status": "success", "results": results, "count": len(results)}
    except TimeoutError:
        return {
            "status": "error",
            "type": "timeout",
            "message": "Query timed out after 10 seconds.",
            "suggestion": "Simplify the query or try again."
        }
    except ConnectionError:
        return {
            "status": "error",
            "type": "connection_failed",
            "message": "Cannot connect to database.",
            "suggestion": "System issue. Inform the user that the service is temporarily unavailable."
        }
```

With the bad version, the model receives `None` and has no idea what happened. It starts guessing. With the good version, it sees exactly what went wrong and what to do next.

Error handling isn't glamorous. It isn't fun. But it's the difference between an agent that works in demos and one that works in production.

---

### Principle 4: Define Hard Boundaries on Agent Authority

The biggest risk in production isn't agents failing — it's agents succeeding at the wrong thing.

An agent that confidently processes a refund it shouldn't have approved does far more damage than one that throws an error message.

Define explicit authority limits for every agent:

- **What it can do freely:** without asking anyone
- **What requires human approval:** situations where it checks before acting
- **What it never does under any circumstances**

And here's the critical lesson that separates serious engineers from beginners: **don't rely on prompt instructions alone for high-stakes boundaries.**

Prompt instructions are suggestions. The model usually follows them. But when the cost of failure is financial, legal, or reputational, "usually" isn't good enough. Use programmatic enforcement.

```python
def execute_tool(tool_name, params):
    # Hard gate: refunds over $100 require human approval
    if tool_name == "process_refund" and params["amount"] > 100:
        return {
            "status": "blocked",
            "reason": "Refund amount exceeds automatic approval threshold.",
            "action": "This refund requires human approval. Routing to manager queue."
        }
    # Hard gate: no deletions without confirmation
    if tool_name == "delete_record":
        return {
            "status": "blocked",
            "reason": "Delete operations require explicit human confirmation.",
            "action": "Ask the user to confirm they want to delete this record."
        }
    return tool_registry[tool_name](params)
```

Prompts guide behavior. Code enforces limits. Use both.

---

### Principle 5: Build Multi-Agent Systems Correctly

If you find yourself loading too many different responsibilities onto a single agent, stop adding tools and split into specialized sub-agents managed by a coordinator.

The architecture is hub-and-spoke:

- **The coordinator** sits in the center. It understands the overall goal, decides which specialist to call, and assembles results.
- **Sub-agents** are specialists. One for research, one for writing, one for data analysis, one for customer communication. Each has a focused toolset and a clearly defined domain.
- **All communication flows through the coordinator.** Sub-agents never talk to each other directly.

But here's the thing everyone gets wrong. The most common bug in multi-agent systems:

**Sub-agents don't automatically inherit the coordinator's conversation history.**

Let me say that again because it really matters.

Sub-agents have isolated context. They start with a blank slate. Every piece of information the sub-agent needs has to be explicitly present in its prompt.

The coordinator has had a long conversation, gathered research, made decisions. Now it spins up a sub-agent to write a report. If you say "write the report based on our discussion," the sub-agent has no idea what "our discussion" contained. It wasn't there for it. It was just created.

```
# Bad: sub-agent assumes it knows the context
sub_agent_prompt = "Now analyze the data we discussed and write a summary."

# Good: all required context passed explicitly
sub_agent_prompt = f"""
You are a data analysis specialist.
Analyze the Q3 2026 sales data below and produce a structured summary report.

DATA: {json.dumps(sales_data)}

ANALYSIS REQUIREMENTS:
1. Revenue trends by region (month-over-month comparison)
2. Top 5 products by growth rate
3. Data anomalies or outliers (>2 standard deviations)

CONTEXT FROM PRIOR ANALYSIS:
The research team identified that the APAC region is showing unusual growth patterns.
The marketing team confirmed they launched an enterprise-focused campaign in August.
"""
```

The second version is longer, yes. But it works.

---

### Principle 6: Test With the Worst Inputs You Can Imagine

Your agent works perfectly on clean, expected inputs? That means nothing.

Real users send things you'd never expect. They find edge cases you didn't think were possible. They discover creative ways to break your assumptions.

Your test suite should include:

- Empty inputs (`""` or `null`)
- Languages the agent wasn't designed for
- Self-contradictory inputs ("cancel my order and ship it faster")
- Inputs trying to push the agent out of scope
- Inputs 10x longer than expected
- Special characters, code injection attempts, formatting that could break parsing
- References to things that don't exist ("find order #99999999")
- Rapid sequential inputs to test rate limiting
- Emotionally loaded or adversarial inputs

Run this test every time you change the agent. Automate it. Make it part of your deployment process.

If your agent hasn't broken yet on bad inputs, you haven't tested enough. This isn't a figure of speech — every agent has failure modes. Your job is to find them before your users do.

---

### Principle 7: Log Everything, Measure Everything

One day in production you'll receive a bug report: "the agent did something weird yesterday."

Without comprehensive logging, you're debugging blind. You can't reconstruct what happened, why it happened, or how to prevent it.

For every agent run, log:

- Every message sent to the model (full content, untruncated)
- Every tool call: which tool, which parameters, which result
- Token usage per turn (input and output)
- Time per tool call, total run time
- Final output
- Every error encountered and how it was handled

Use structured JSON logging, not `print` statements. You'll need to query these logs programmatically.

```python
import json
import logging
from datetime import datetime

logger = logging.getLogger("agent")

def log_agent_event(event_type, data):
    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "run_id": current_run_id,
        "data": data
    }
    logger.info(json.dumps(log_entry))

log_agent_event("tool_call", {
    "tool": "search_products",
    "params": {"query": "laptop"},
    "result_status": "success",
    "result_count": 12,
    "duration_ms": 340
})
log_agent_event("agent_complete", {
    "total_turns": 4,
    "total_tokens": 8200,
    "total_duration_ms": 12400,
    "outcome": "success"
})
```

This data is invaluable. It tells you which tools get called most, where agents spend the most time, where errors cluster, and how behavior shifts with changes.

Logging isn't optional overhead. It's the foundation of continuous improvement.

---

## Start Here: Minimum Viable Agent

Don't start with 5 agents, 20 tools, and a complex routing layer.

**1 agent. 3 tools. 1 clear goal.**

Example: an agent that answers product catalog questions.

- **`search_products`** — queries the database by product name or category, returns matching products
- **`get_product_details`** — fetches complete information for a specific product: price, specs, stock status
- **`check_stock`** — checks real-time inventory at a specific location

The agent's job: answer product questions using these tools. If you can't find an answer, say so honestly. Never fabricate information.

Run this until it works perfectly:

- Test with 50+ different queries
- Verify it handles errors gracefully
- Confirm it uses the right tool at the right time
- Make sure it doesn't make things up when information is missing

**Only then** add complexity. A fourth tool, a second agent, an orchestration layer.

Complexity earned through iteration is manageable. Complexity imposed from the start is a nightmare.

---

## The 5 Most Common Production Problems

**1. Infinite loop** — The agent keeps calling the same tool without progressing. Usually caused by the tool returning results the model can't interpret. Add iteration tracking; if the same tool is called with the same parameters more than 3 times, inject a message forcing a different approach.

**2. Wrong tool selection** — Caused by overlapping or ambiguous descriptions. Rewrite tool descriptions to be mutually exclusive. Add explicit directives: "use this for X, use that for Y."

**3. Hallucination under uncertainty** — When a tool returns empty or errors, the model makes up an answer instead of admitting it doesn't know. Add a clear directive to the system prompt: "If a tool returns no results or an error, communicate this honestly. Do not fabricate information."

**4. Context overflow** — In long conversations the agent loses track of earlier information and produces inconsistent responses. Implement context summarization: every N turns, have the model summarize the key facts and decisions so far and use that as ongoing context.

**5. Scope creep** — The agent goes outside its defined scope because the user asked it to. Explicitly list what the agent doesn't do in the system prompt. When a user requests something out of scope, the agent should acknowledge the request and clearly explain its limitations.

---

## Pre-Deployment Checklist

Before putting any agent in front of real users, run through every item on this list. No exceptions.

**Architecture**
- [ ] Is the agentic loop implemented correctly using `stop_reason`?
- [ ] Are all tools defined with clear names, detailed descriptions, strict parameter schemas, and consistent return formats?
- [ ] Is there a maximum iteration limit as a safety net?

**Error handling**
- [ ] Does every tool return a structured error message with type, description, and suggested next step?
- [ ] Is there a retry limit for every tool?
- [ ] Is there a fallback plan for every failure scenario?
- [ ] Are API timeouts, empty results, corrupted data, and auth failures handled?

**Security**
- [ ] Are high-stakes operations gated programmatically, not just via prompt instructions?
- [ ] Are all tools defined with minimum required permissions?
- [ ] Does the agent refuse to expose internal system details?
- [ ] Are delete and write operations behind confirmation gates?

**Testing**
- [ ] Have at least 50 different queries been tested?
- [ ] Have empty, corrupted, contradictory, and adversarial inputs been tested?
- [ ] Has the full multi-tool workflow been tested end-to-end?
- [ ] Has the agent been tested with external services offline or slow?

**Observability**
- [ ] Are all messages, tool calls, results, errors, and token counts logged in structured JSON?
- [ ] Can any agent run be fully reconstructed from logs alone?
- [ ] Is there an alerting mechanism for anomalous behavior?

---

## The Real Skill Is Systems Thinking

Building AI agents isn't about writing prompts. It isn't about choosing the right framework. It isn't about which model you use.

**It's about designing systems that can handle ambiguity gracefully.**

The model will sometimes make bad decisions. Tools will fail. Users will ask things you didn't expect. Context windows will fill up. APIs will go down. Data will arrive inconsistent.

Engineers who build great agents are the engineers who account for all of this in advance. They design for failure cases, not just the happy path. They add observability at every layer. They test relentlessly. They iterate based on real production data.

Engineers who build bad agents are the ones who get the demo running and ship it.

Start small. Build the minimum viable agent. Test it ruthlessly. Break it with the worst inputs you can imagine. Log everything — you can't improve what you can't measure. Iterate continuously. The first version is never the last.

The gap between "I built a demo" and "I built a production system" is enormous. Real AI engineering lives in that gap.

Demand for people who can build agents that work in production is high and growing fast. Supply is extremely low, because most people stop at the demo stage.

Don't be most people.
