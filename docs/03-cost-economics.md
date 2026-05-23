# AI cost and unit economics

> **The failure this prevents:** the team discovers cost per task after scaling to real users. A feature that looked viable at 100 users is losing money at 10,000 because nobody modeled how token costs compound with usage, caching misses, and agentic retries. This guide makes unit economics visible before that happens.

## Contents

- [Token-level COGS](#token-level-cogs)
- [Prompt caching](#prompt-caching)
- [Model routing](#model-routing)
- [Cost per task, user, and customer](#cost-per-task-user-and-customer)
- [The governance overhead](#the-governance-overhead)
- [Common cost surprises](#common-cost-surprises)
- [How to model costs](#how-to-model-costs)
- [When to optimize](#when-to-optimize)
- [Tools](#tools)
- [Product design levers that reduce cost](#product-design-levers-that-reduce-cost)
- [Next steps](#next-steps)

AI SaaS unit economics are structurally different from traditional SaaS. In traditional SaaS, your marginal cost per user is close to zero after infrastructure is provisioned. In AI SaaS, every API call has a variable cost. Every user action that triggers the model costs you money.

This means AI products can have negative unit economics at scale if you do not plan for it. The product that works great at 100 users can lose money at 10,000 users.

## Token-level COGS

Your cost of goods sold for AI features is measured in tokens. Every LLM call consumes input tokens (your prompt, context, system instructions) and output tokens (the model's response). Pricing differs by model, by provider, and between input and output.

Pricing changes frequently. Check your provider's current pricing page before building a cost model. Treat any number in a PRD as a dated assumption, not a durable fact. Smaller, faster models can be materially cheaper than frontier models for the same token volume, but the gap depends on provider, model family, region, and batch or cache settings.

Prices drop regularly, but usage tends to grow faster than prices fall. Do not count on price drops to fix bad unit economics. Always model costs using current pricing, not anticipated future pricing.

## Prompt caching

If your system prompt is long and repeated across many calls, prompt caching can cut cached input-token costs substantially, sometimes up to 90% depending on the provider and cache mode. Most major providers now support some form of caching.

How it works: the provider caches the static portion of your prompt (system instructions, few-shot examples, persona definitions). Subsequent calls that use the same cached prefix pay a fraction of the full input price. Check your provider's pricing page for exact cached token rates — most charge a small fraction of the standard input price.

When to use it:

- Your system prompt is longer than 1,000 tokens (most are)
- You make many calls with the same system prompt
- You are using RAG with a stable set of retrieved documents

When it does not help:

- Every call has a completely unique prompt
- Your system prompt changes frequently

This is not an engineering-only decision. PMs should ask whether caching is enabled, which parts of the prompt are cacheable, and how much it saves at expected traffic. If your team is not using caching and your system prompt is large and reused, you may be materially overpaying on input tokens.

## Model routing

Not every task needs your most expensive model. Model routing sends simple tasks to cheaper, faster models and reserves expensive models for complex ones.

Examples:

- Classification and intent detection: use a small, low-cost model
- Simple extraction and formatting: use a mid-tier model (Sonnet-class)
- Complex reasoning, nuanced writing, multi-step planning: use a frontier model (Opus-class)

A well-designed routing layer can dramatically reduce your average cost per task. The tradeoff is added complexity and the need to define what "simple" and "complex" mean for your use case.

The PM decision: which tasks can tolerate lower quality in exchange for lower cost? This is a product judgment, not a technical one. A customer-facing summary needs the best model. An internal log classification does not.

## Cost per task, user, and customer

Token costs are an input. What matters for business decisions is cost per unit of value delivered.

Calculate these three metrics:

**Cost per task**: total token cost plus tool call costs plus infrastructure overhead for one completed task. For an AI that summarizes support tickets, this is the cost of one summary. Include retries and failed attempts in the average.

**Cost per user per month**: average number of tasks per user multiplied by cost per task. This tells you whether your pricing covers your costs. If users pay $20/month and cost you $25/month in AI calls, you have a problem.

**Cost per customer per month**: aggregate cost across all users in a customer account. Enterprise customers with heavy usage can skew this dramatically. One customer running 10,000 agent tasks per day might cost you more than your next 50 customers combined.

## The governance overhead

Beyond API costs, running AI in production often requires tooling and process that can add meaningful annual cost depending on scale:

- Observability platform (Langfuse, LangSmith, Arize, or similar)
- Eval infrastructure and golden set maintenance: 1-2 engineer-months per year
- Safety and compliance review: legal and security team time
- Human review operations for high-risk outputs
- Incident response for AI-specific failures

PMs often forget to include these in the business case. They are real costs that need to be in the model.

## Common cost surprises

**Traffic spikes**: a feature goes viral or gets rolled out to a large customer. 10x traffic means 10x API costs. If your baseline is $5K/month, that is $50K in a single month. Set up cost alerts and circuit breakers.

**Agent loops**: an agent that retries on failure can enter a loop. Without a cost ceiling, a single stuck task can generate hundreds of API calls. This is not theoretical. It happens.

**Context window growth**: as conversations get longer, each subsequent call includes more tokens. A 10-turn conversation costs much more than 10 single-turn calls. Summarization or truncation strategies are necessary for multi-turn products.

**Embedding costs**: if your RAG pipeline re-embeds documents frequently, embedding costs add up. Embed once, store, and only re-embed when content changes.

## How to model costs

Build a spreadsheet with these inputs:

1. Number of active users per month
2. Average tasks per user per month
3. Average input tokens per task (measure this, do not guess)
4. Average output tokens per task
5. Model price per million tokens (input and output separately)
6. Prompt cache hit rate (if applicable)
7. Tool call costs per task (if using agents)
8. Retry rate (percentage of tasks that require re-processing)

Run three scenarios: baseline, 3x growth, and 10x growth. If 10x growth makes the product unprofitable, you need to address that before it happens, not after.

Sensitivity analysis matters. Which variable has the biggest impact on cost? Usually it is tasks per user per month or average tokens per task. Those are the levers you can influence through product design (shorter prompts, fewer unnecessary calls, smarter routing).

## When to optimize

Before scale, not after the bill arrives.

The time to set up model routing, prompt caching, and cost ceilings is during development, not when you get a $40K monthly invoice. By then, the architecture is set and changes are expensive.

Include cost targets in the PRD alongside quality targets. "This feature should cost less than $0.05 per task at Sonnet-class quality" gives engineering a clear constraint to design against.

## Tools

**TokenCost** estimates token counts and costs before you make API calls. Useful for planning and budgeting.

**LiteLLM** provides a unified interface across multiple LLM providers, making model routing simpler. It also normalizes cost tracking across providers.

**Langfuse** tracks cost per trace, per user, and per feature. This is the most useful tool for PMs because it connects cost data to product usage patterns.

## Product design levers that reduce cost

Cost optimization is not only an engineering problem. Product decisions have a bigger impact on AI costs than most PMs realize.

**Reduce unnecessary calls**: does every user action need an LLM call? If users frequently ask the same questions, cache the answers. If the system generates a summary every time a page loads, generate it once and store it until the underlying data changes.

**Shorten prompts**: a system prompt with 5,000 tokens of detailed instructions might not perform better than a 2,000-token version. Test this. Long prompts are often the result of accumulating instructions over time without pruning.

**Limit output length**: if you need a one-sentence classification, set the max output tokens accordingly. A model that generates a 500-token explanation when you only need a label is wasting money. Be explicit about output format and length in your prompt.

**Batch processing**: for non-interactive tasks, batch API calls reduce overhead. Most providers offer batch pricing at significant discounts over real-time calls. If your use case can tolerate a few hours of latency (overnight report generation, bulk document processing), batching cuts costs significantly.

**Smart defaults**: if 80% of users accept the first AI suggestion, invest in making that first suggestion better rather than offering re-generation. Each retry doubles the cost of that interaction.

These are product decisions. The PM should be asking "what is the cheapest way to deliver acceptable quality for this task?" alongside "what is the best quality we can achieve?"

## Next steps

- Build your cost projections using the [AI Cost Model template](../templates/ai-cost-model.md) to model token costs, routing savings, and break-even scenarios.
- Set up per-feature cost tracking in production using the [Observability guide](05-observability.md) so cost surprises surface in dashboards, not invoices.
