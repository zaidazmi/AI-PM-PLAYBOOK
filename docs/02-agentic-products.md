# Building agentic products

> **The failure this prevents:** PMs spec agents the way they spec chatbots — defining what the AI says instead of what it does. The product ships, the agent takes an irreversible action it should not have, and there is no rollback. This guide covers autonomy levels, tool boundaries, and safety constraints that prevent that outcome.

## Contents

- [Autonomy levels](#autonomy-levels)
- [Tool use decisions](#tool-use-decisions)
- [MCP as a platform decision](#mcp-as-a-platform-decision)
- [Multi-agent vs single-agent](#multi-agent-vs-single-agent)
- [Agent eval](#agent-eval)
- [Cost](#cost)
- [Safety boundaries](#safety-boundaries)
- [Frameworks PMs should know about](#frameworks-pms-should-know-about)
- [The agent loop: what PMs need to understand](#the-agent-loop-what-pms-need-to-understand)
- [Known agent limitations PMs should design around](#known-agent-limitations-pms-should-design-around)
- [Common mistakes PMs make with agents](#common-mistakes-pms-make-with-agents)
- [Next steps](#next-steps)

Agents are one of the defining AI product patterns. An agent is an AI system that takes actions, not just generates text. It reads data, calls APIs, makes decisions, and executes multi-step workflows. Many PMs building agent-based products are speccing them wrong because they are applying chatbot-era thinking to a fundamentally different product shape.

The difference matters: a chatbot produces an output. An agent produces a side effect. Side effects are harder to undo, harder to test, and harder to explain to users.

## Autonomy levels

Every agent feature sits somewhere on an autonomy spectrum. Getting this wrong is the most common PM mistake in agentic products. Too much autonomy and users lose trust. Too little and the product is just a fancy autocomplete.

Four levels, in increasing order of risk:

- **Draft**: the agent produces output for the user to review before anything happens. A draft email, a proposed code change, a suggested calendar invite. The user sees everything before it takes effect. Low risk, low friction.
- **Suggest**: the agent recommends an action and explains why. "I recommend moving this ticket to 'done' because the PR was merged 2 hours ago." The user approves or rejects with one click. Medium trust required.
- **Act**: the agent takes action and notifies the user. "I moved 3 tickets to 'done' based on merged PRs." The user can undo. High trust required. Needs audit trail.
- **Autonomous**: the agent takes action without notification for routine cases. The user only hears about exceptions. This is appropriate for low-stakes, high-volume tasks where the cost of a mistake is low. Requires robust monitoring.

Your PRD should specify the autonomy level for each action the agent can take. A single agent might operate at different levels for different actions. Filing a JIRA ticket might be "act." Sending a customer email should be "draft."

A useful mental model for classifying your own PM tasks (and your product's tasks) across the autonomy spectrum: let AI do the first pass on generative work (drafting, summarizing, clustering data, generating edge cases). Use AI as a thought partner for augmentation work (reviewing PRDs, brainstorming features, analyzing competitive data). Keep final decisions, compliance commitments, and KPI sign-offs as human-only work. This same classification applies to the AI features you build for users.

## Tool use decisions

An agent's capabilities are defined by which tools it can call. This is a product decision, not an engineering one.

Each tool you give the agent expands what it can do and expands what can go wrong. A support agent with read access to the knowledge base is one thing. The same agent with write access to customer accounts is a different product with different risk.

For each tool, document:

- What the tool does
- What data it can access
- What side effects it produces
- What the blast radius is if the agent uses it incorrectly
- Whether the action is reversible

Tools with irreversible side effects (sending emails, processing payments, deleting records) need human checkpoints or confirmation flows. This is not optional.

## MCP as a platform decision

Model Context Protocol (MCP) is becoming a common open standard for connecting AI agents to external tools and data sources. For PMs, MCP matters because it shapes how your agent integrates with the rest of the product ecosystem.

If you adopt MCP, you get a standardized interface between your agent and tools. This means third-party tools that support MCP work with your agent without custom integration. It also means your agent's tool use is more inspectable and auditable.

If you build custom tool interfaces instead, you have more control but more maintenance burden and less interoperability.

The decision depends on your ecosystem. If your product connects to many external services that already support MCP, use it. If you are building a closed system with a small number of tightly controlled tools, custom interfaces may be simpler.

## Multi-agent vs single-agent

Multi-agent systems use multiple specialized agents that coordinate with each other. A planning agent breaks down the task, a research agent gathers information, a writing agent produces output, a review agent checks quality.

Single-agent systems use one model with multiple tools and a single reasoning loop.

Multi-agent sounds architecturally clean. In practice, it introduces coordination overhead, error propagation between agents, and debugging complexity. When agent A passes bad context to agent B, which passes a bad decision to agent C, figuring out what went wrong requires tracing across all three.

Use multi-agent when:

- The task genuinely requires different capabilities that perform better with specialized prompts
- You need different trust levels for different parts of the workflow (one agent reads, another writes)
- The workflow has natural handoff points where one agent's output is another's input

Use single-agent when:

- The task is linear
- A single prompt can handle the full scope
- You want simpler debugging and lower latency
- Cost matters (multi-agent multiplies your LLM calls)

Most products should start with a single agent and split into multiple agents only when you hit a concrete quality or capability wall.

## Agent eval

Evaluating agents is harder than evaluating chatbots because the output is not just text. It is a sequence of decisions and actions.

Two levels of eval:

Output-level: did the agent produce the right final result? This is necessary but not sufficient. An agent can get the right answer through a dangerous path (accessing data it should not have, making unnecessary API calls, retrying in a tight loop).

Trajectory-level: did the agent take the right steps in the right order? This means evaluating the full trace of tool calls, reasoning steps, and decisions. A good trajectory is efficient (minimal unnecessary steps), safe (no out-of-bounds actions), and correct (each step logically follows from the prior one).

Build eval cases that test both. Include scenarios where the right answer is "I cannot do this" or "I need to ask the user for clarification."

## Cost

Agent runs have variable cost because the number of LLM calls and tool invocations varies per task. A simple lookup might cost $0.01. A complex research task with 15 tool calls might cost $2.50.

PMs must set cost ceilings per action. If an agent task exceeds $X, it should stop, report what it has so far, and ask the user whether to continue. Without cost ceilings, a single runaway agent loop can burn through your monthly API budget in hours.

Track cost per task, not just cost per API call. This is the metric that matters for unit economics.

## Safety boundaries

Agents that take real-world actions need explicit permission boundaries:

- What the agent can do without asking (low risk, reversible)
- What requires user confirmation (medium risk or irreversible)
- What the agent must never do (high risk, out of scope)

These boundaries should be defined in the PRD, enforced in code, and tested in evals. "The agent should be helpful" is not a safety spec.

Rollback capability matters. If the agent takes a wrong action, can you undo it? If not, that action needs a human checkpoint. No exceptions.

## Frameworks PMs should know about

You do not need to understand the code, but framework choice constrains your product in ways PMs should weigh in on.

**LangGraph** gives you explicit control over the agent's decision flow as a graph. Good for complex workflows where you need predictable routing. The tradeoff is more upfront design work.

**CrewAI** is designed for multi-agent coordination. If your product genuinely needs specialized agents working together, it reduces the orchestration code. Adds complexity if you only need one agent.

**OpenAI Agents SDK** is simplest when you are already using OpenAI models and the Responses API path. It also supports non-OpenAI providers through provider integrations and adapters, but those paths can have feature differences. If model flexibility matters to your product strategy, validate the non-OpenAI path before committing.

**Claude Agent SDK** provides agents with access to a computer environment (terminal, filesystem, shell) rather than just API-level tool calling. Suited for developer tools, automation workflows, and tasks that require operating in a local computing environment.

The framework decision is a product decision because it constrains your autonomy model, your failure modes, and your scaling path. Push back if engineering picks a framework without discussing these tradeoffs with product.

## The agent loop: what PMs need to understand

Every agent product, regardless of framework, runs the same loop: plan, call a tool, check the result, decide the next step, repeat until done. Understanding this loop changes how you write requirements.

The planning step is where the LLM decides what to do. This is where bad context produces bad plans. If your agent's context is missing relevant files, outdated, or poorly structured, the plan will be wrong and every subsequent tool call will waste time and money.

The tool-calling step is where side effects happen. Each tool call is a potential failure point. The agent might call the wrong tool, pass wrong parameters, or interpret results incorrectly.

The verification step is where the agent checks whether the tool call succeeded. For visual tasks, agents take screenshots and use LLM-as-judge to verify. For data tasks, they check output structure. Weak verification means the agent proceeds on bad assumptions.

The loop termination is where agents struggle most. In practice, agents working on complex multi-step tasks will try to hand work back to the user after hitting a few failures, even when the task is doable. They also run slowly on multi-step workflows. A task that takes a human 10 minutes might take an agent 45 minutes because each step requires an LLM call, a tool call, and a verification check.

For PMs, this means: design your agent features around tasks where the speed-to-quality tradeoff works. Agents are good at tasks you don't want to do at all (overnight batch processing, background research, monitoring). They are less good at tasks where you'd be faster doing it yourself and checking the result.

## Known agent limitations PMs should design around

Current agents still have concrete limitations that affect product design:

- Agents are slow on multi-step tasks. A 10-step workflow with browser interaction can take 30-60 minutes. Design UX around async completion, not real-time response
- Agents lack persistent memory across sessions. Context must be re-provided each time, or stored in files the agent can read. Design for this in your data architecture
- Agents negotiate with the user. When a task gets hard, agents will propose a simpler plan and ask the user to do the hard parts. Your prompt engineering and system instructions need to handle this
- Agents have variable reliability on the same task. The same prompt can produce different action sequences across runs. Eval must account for path variation, not just outcome

## Common mistakes PMs make with agents

**Treating agents like chatbots**: speccing an agent the same way you spec a conversational feature. Agents take actions with consequences. Your PRD needs to define what happens when those actions fail, not just what happens when they succeed.

**Autonomy level mismatch**: setting the autonomy level based on what is technically possible rather than what users trust. Users need to build trust gradually. Start at "draft" and earn your way to "act." Launching at full autonomy because the model can handle it ignores the human side.

**Missing cost ceilings**: letting agent runs consume unlimited resources. A single complex task can generate 50+ LLM calls. Without a ceiling, one edge case can cost more than your entire daily budget.

**No trajectory testing**: testing only whether the agent got the right answer, not whether it took the right path. An agent that produces a correct expense report by accessing a database it should not have access to is a security incident, not a success.

**Over-engineering with multi-agent**: splitting a straightforward workflow across three agents because the architecture diagram looks cleaner. Each agent boundary adds latency, cost, and debugging complexity. Use the simplest architecture that works.

**Ignoring rollback**: shipping agent actions that cannot be undone. If the agent sends an email, you cannot unsend it. If it updates a database record and you have no change log, you cannot revert. Every irreversible action needs either human confirmation or robust rollback infrastructure.

## Next steps

- Define autonomy levels, tool boundaries, and safety constraints in your PRD using the agent-specific sections of the [AI PRD template](../templates/ai-prd.md).
- Catalog failure modes and mitigations for each tool the agent can call using the [Risk Register template](../templates/ai-risk-register.md).
