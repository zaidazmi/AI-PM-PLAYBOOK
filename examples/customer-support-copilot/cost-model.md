# AI cost model: customer support copilot

## Inputs

| Parameter | Value | Source/assumption |
|-----------|-------|-------------------|
| Model / provider | Claude Sonnet via Anthropic API | Selected for quality/cost balance on support drafting |
| Input cost | $3.00 / 1M input tokens | Anthropic API pricing (as of assessment date) |
| Output cost | $15.00 / 1M output tokens | Anthropic API pricing (as of assessment date) |
| Avg input tokens per task | 1,500 (system prompt + KB snippets + ticket + conversation history) | Estimated. Needs validation on 200 prototype runs. |
| Avg output tokens per task | 300 (draft response) | Estimated based on typical support response length |
| Retrieval cost per task | $0.002 (vector embedding lookup against KB index) | Based on embedding model pricing |
| Cache hit rate | 40% (system prompt and few-shot examples are stable across calls) | Estimated. System prompt is ~800 tokens, reused on every call. |
| Cache savings rate | 90% saved on cached input tokens | Cached input tokens are assumed to cost 10% of the base input price |
| Tasks per agent per day | 5.5 supported-intent tickets per agent per day | 800 tickets/day across all intents x 31% in top 10 intents / 45 agents |
| Active agents (pilot) | 8 | Day shift pilot cohort |
| Active agents (full team) | 45 | Full Tier 1 team across 3 shifts |
| Working days per month | 22 | Standard |
| Gross margin target | 70% | Company standard |
| Pricing assumption | Not applicable (internal tool; cost justified by handle time savings) | |

## Calculated costs

### Cost per draft

```
Input cost:    1,500 / 1M x $3.00                              = $0.0045
Cache saving:  $0.0045 x 0.40 x 0.90                           = -$0.0016
Output cost:   300 / 1M x $15.00                                = $0.0045
Retrieval:                                                        $0.0020

Cost per draft = $0.0094
```

Rounded estimate used in planning: **$0.01 per draft**. The PRD uses a conservative estimate of $0.03 as the upper bound target to account for longer tickets, multi-article retrieval, and measurement error.

### Cost per agent per month

```
$0.0094 x 5.5 tasks/day x 22 days = $1.14/agent/month
```

### Monthly cost by scenario

| Scenario | Agents | Monthly cost |
|----------|--------|-------------|
| Pilot (8 agents, day shift) | 8 | $9 |
| Full team (45 agents, all shifts) | 45 | $51 |

### Break-even analysis

This is an internal productivity tool, not a revenue feature. ROI is measured in time savings.

```
Handle time saved per agent: 1.6 min/ticket x 5.5 supported-intent tickets/day = 8.8 min/day
Fully loaded agent cost: ~$35/hour
Value of time saved: 8.8 min x ($35/60) = $5.14/day per agent
Monthly value per agent: $5.14 x 22 = $113

Monthly AI cost per agent: $1.14
ROI: $113 / $1.14 = 99x return on AI cost alone
```

Even at a conservative 50% realization rate (not all saved time converts to productive work), the ROI is ~50x. The absolute savings are modest for the top-10-intent v1, so the pilot business case should be framed as proving quality, workflow fit, and expansion potential rather than claiming a large immediate labor-savings pool.

## Sensitivity analysis

| Scenario | Changed assumption | Cost per draft | Monthly (full team) | Still viable? |
|----------|--------------------|---------------|---------------------|---------------|
| Baseline | As above | $0.0094 | $51 | Yes |
| Longer tickets (2x input) | 3,000 input tokens | $0.0123 | $67 | Yes |
| Multi-article retrieval (3x retrieval) | $0.006 retrieval cost | $0.0134 | $73 | Yes |
| No caching | Cache hit rate = 0% | $0.0110 | $60 | Yes |
| Model price increase (+50%) | Input $4.50, output $22.50 | $0.0131 | $71 | Yes |
| Expanded coverage (top 50 intents) | Supported volume doubles to 62% of tickets | $0.0094 | $103 | Yes |
| All cost scenarios combined | Worst per-draft cost, top-10 volume | $0.0262 | $143 | Yes |

The product is cost-resilient in every modeled scenario. For v1, the bigger business question is not API spend; it is whether a narrow top-10-intent scope creates enough measurable workflow value to justify continued investment. If costs trend upward as coverage expands, the first mitigation lever is model routing — using a cheaper model for simple intents and reserving Sonnet for complex ones.

## Cost monitoring triggers

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Cost per draft exceeds target | > $0.03 | Investigate token usage patterns. Check for context window growth. |
| Monthly cost exceeds budget | > $100 for top-10-intent v1, or > $500 after top-50 expansion | Review whether scope expanded beyond plan. Check for retry loops. |
| Token usage per request growing | > 2x baseline over 2 weeks | Likely KB snippet count increasing. Review retrieval pipeline. |
| Retry rate contributing to cost | > 15% of drafts trigger retry | Fix quality rather than absorbing the cost. |

## Notes

- Token count estimates need validation against 200 real prototype runs before pilot. The input token estimate of 1,500 assumes 1-2 KB articles retrieved per ticket. Multi-intent tickets may retrieve 3-4 articles, pushing input tokens to 2,500+.
- If the product expands beyond the top 10 intents to 50 intents, the KB retrieval set grows but per-draft cost stays similar. The main cost driver is volume, not complexity.
- Batch pricing is not applicable here — drafts are generated in real time during agent workflow.
- Consider model routing if the product expands: simple intent classification could use a smaller model (Haiku-class) before the draft generation call, adding ~$0.001 per task but enabling routing logic.
