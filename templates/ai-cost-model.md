# AI cost model

Use this to make unit economics visible before launch. Update it monthly after launch. If you can't fill this out, you don't understand your product's economics.

**Upstream:** model requirements and cost constraints from the [AI PRD](ai-prd.md). **Downstream:** cost per task feeds into the [launch gate checklist](launch-gate-checklist.md) and [observability plan](ai-observability-plan.md).

## Inputs

| Parameter | Value | Source/assumption |
|-----------|-------|-------------------|
| Model / provider | <!-- e.g., Claude Sonnet via Anthropic API --> | |
| Input cost | <!-- e.g., $3.00 / 1M input tokens --> | |
| Output cost | <!-- e.g., $15.00 / 1M output tokens --> | |
| Avg input tokens per task | <!-- e.g., 2,000 tokens --> | <!-- measured or estimated --> |
| Avg output tokens per task | <!-- e.g., 500 tokens --> | <!-- measured or estimated --> |
| Retrieval cost per task | <!-- e.g., $0.002 for embedding lookup --> | |
| Guardrail / judge cost per task | <!-- e.g., $0.001 for a safety classifier, grounding check, or LLM-as-judge run per request --> | |
| Cache hit rate | <!-- e.g., 30% of requests use cached prompt --> | |
| Cache savings rate | <!-- e.g., 90% saved on cached input tokens, if cache reads cost 10% of base input price --> | |
| Tasks per user per day | <!-- e.g., 8 --> | |
| Active users per customer | <!-- e.g., 5 --> | |
| Working days per month | <!-- e.g., 22 --> | |
| Gross margin target | <!-- e.g., 70% --> | |
| Pricing assumption | <!-- e.g., $50/user/month --> | |

## Calculated costs

### Cost per task

```
Input cost:     [avg input tokens] x [input price per token]   = $___
Output cost:    [avg output tokens] x [output price per token] = $___
Retrieval:      [retrieval cost per task]                       = $___
Guardrail/judge:[safety, grounding, or judge inference per task] = $___
Cache saving:   [input cost] x [cache hit rate] x [cache savings rate] = -$___

Cost per task = $___
```

### Cost per user per month

```
[cost per task] x [tasks per user per day] x [working days] = $___
```

### Cost per customer per month

```
[cost per user per month] x [active users per customer] = $___
```

### Break-even usage

```
[pricing assumption] x (1 - [gross margin target]) = max total COGS per user per month
max total COGS / [cost per task] = max tasks per user per month (if AI is the only COGS)
max tasks / [working days] = max tasks per user per day
```

## Sensitivity analysis

<!-- What happens if your assumptions are wrong? Fill in the scary scenarios. -->

| Scenario | Changed assumption | Cost per task | Cost per customer/month | Still viable? |
|----------|--------------------|---------------|------------------------|---------------|
| Baseline | As above | $___ | $___ | Yes |
| Heavy user (3x tasks) | Tasks per user = <!-- 3x baseline --> | | | |
| Longer outputs (2x) | Avg output tokens = <!-- 2x baseline --> | | | |
| No caching | Cache hit rate = 0% | | | |
| Model price increase | Input/output cost +50% | | | |

## Agentic cost multiplier

<!-- Agentic workflows can consume many more tokens than single-turn interactions because of tool calls, retries, and growing context. Measure the multiplier from real traces. Skip for non-agent products. -->

| Factor | Multiplier |
|--------|------------|
| Tool calls per task | <!-- e.g., 3-5 calls average --> |
| Retries on failure | <!-- e.g., 1.2x --> |
| Context accumulation | <!-- e.g., 2x by step 5 --> |
| **Total agentic multiplier** | <!-- e.g., 8x single-turn baseline --> |

## Multi-model routing

<!-- Can you save money by routing simple tasks to a cheaper model? -->

| Task type | Model | Cost per task | % of traffic |
|-----------|-------|---------------|--------------|
| <!-- e.g., classification, simple extraction --> | <!-- e.g., Haiku --> | | |
| <!-- e.g., generation, complex reasoning --> | <!-- e.g., Sonnet --> | | |
| Blended cost per task | | | |

## Worked example (illustrative)

Numbers below are illustrative and will vary by provider and model. Run 20 representative tasks through your model to get real token counts before using this for decisions.

**Scenario:** support copilot that drafts responses from knowledge base articles.

| Parameter | Value |
|-----------|-------|
| Model | Claude Sonnet at $3/1M input, $15/1M output |
| Avg input tokens per task | 2,000 (system prompt + KB context + ticket) |
| Avg output tokens per task | 400 (draft response) |
| Retrieval cost per task | $0.002 (embedding lookup) |
| Cache hit rate | 30% |
| Cache savings rate | 90% saved on cached input tokens |
| Tasks per user per day | 25 |
| Active users per customer | 10 |
| Working days per month | 22 |
| Pricing | $50/user/month |
| Gross margin target | 70% |

**Cost per task:**
```
Input cost:     2,000 / 1M x $3.00                             = $0.0060
Cache saving:   $0.0060 x 0.30 x 0.90                          = -$0.0016
Output cost:    400 / 1M x $15.00                              = $0.0060
Retrieval:                                                       $0.0020
Guardrail/judge: none run per request in this example          = $0.0000

Cost per task = $0.0124
```

<!-- Add the guardrail/judge line once you run a safety classifier, grounding check, or LLM-as-judge on every request: a small per-call model can still add 5-15% to cost per task. -->


**Cost per user per month:** $0.0124 x 25 x 22 = **$6.82**

**Cost per customer per month:** $6.82 x 10 = **$68.20**

**Break-even:** at a 70% gross margin target, max total COGS per user = $50 x 0.30 = $15/month. AI cost is $6.82, leaving $8.18 for other COGS (infrastructure, support, etc.). AI cost alone is 14% of revenue.

**Sensitivity:** if heavy users run 75 tasks/day (3x), AI cost per user rises to $20.46 — exceeds the $15 COGS ceiling on its own, requiring a pricing tier for high-volume users or model routing to a cheaper tier for simple tasks.

**Agentic multiplier:** if this were an agent making 4 tool calls per task with 1.3x context growth, the per-task cost would be roughly $0.0124 x 4 x 1.3 = $0.065. The total agentic multiplier in practice varies by workflow — the table above uses 8x as a placeholder because retries and growing context across multi-step chains compound beyond the per-call estimate.

## Notes

<!-- Anything else that affects cost: batch processing discounts, volume tiers, prompt caching strategies, off-peak pricing. -->
