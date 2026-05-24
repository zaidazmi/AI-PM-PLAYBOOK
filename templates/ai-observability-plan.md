# AI observability plan

Use this to define what you monitor after launch. Set this up before shipping, not after the first incident.

**Upstream:** metric targets come from the [AI PRD](ai-prd.md) and [cost model](ai-cost-model.md). **Downstream:** production signals trigger updates to the [eval plan](ai-eval-plan.md), launch gates, and roadmap decisions.

## Product signals

| Metric | Definition | Target | Alert threshold | How measured |
|--------|------------|--------|-----------------|--------------|
| Adoption | % of eligible users who triggered the AI feature this week | <!-- e.g., 40% by week 4 --> | <!-- e.g., drops below 20% --> | <!-- e.g., event tracking in product analytics --> |
| Task completion | % of AI-initiated tasks where the user reached their goal | <!-- e.g., >= 75% --> | <!-- e.g., < 60% for 3 consecutive days --> | |
| Accept rate | % of AI outputs accepted without edits | <!-- e.g., >= 65% --> | <!-- e.g., < 50% --> | |
| Edit rate | % of AI outputs accepted after user edits | <!-- e.g., < 25% --> | <!-- e.g., > 35% --> | |
| Reject rate | % of AI outputs rejected entirely | <!-- e.g., < 15% --> | <!-- e.g., > 25% --> | |
| Retry rate | % of tasks where user retried after initial output | <!-- e.g., < 10% --> | <!-- e.g., > 20% --> | |
| Escalation rate | % of tasks escalated to a human or support | <!-- e.g., < 5% --> | <!-- e.g., > 10% --> | |
| User-reported issues | Count of bug reports or complaints about AI output | <!-- e.g., < 3/week --> | <!-- e.g., > 5 in a day --> | |

## System signals

| Metric | Definition | Target | Alert threshold | How measured |
|--------|------------|--------|-----------------|--------------|
| Latency (p50) | Median response time for AI task | <!-- e.g., < 2s --> | <!-- e.g., > 4s --> | |
| Latency (p95) | 95th percentile response time | <!-- e.g., < 6s --> | <!-- e.g., > 12s --> | |
| Cost per task | Average model + retrieval cost per AI invocation | <!-- e.g., $0.04 --> | <!-- e.g., > $0.08 --> | |
| Cost per customer/month | Total AI cost attributed per paying customer | <!-- e.g., < $1.50 --> | <!-- e.g., > $3.00 --> | |
| Token usage per request | Average input + output tokens per AI call | <!-- e.g., 2,000 input, 500 output --> | <!-- e.g., > 2x baseline --> | |
| Error rate | % of requests returning errors, timeouts, or malformed responses | <!-- e.g., < 1% --> | <!-- e.g., > 2% sustained 1 hour --> | |
| Quality score | Automated eval score on sampled production outputs | <!-- e.g., >= 90% --> | <!-- e.g., < 85% --> | |
| Regression failures | Count of outputs that fail regression suite on production data | <!-- e.g., 0 --> | <!-- e.g., > 2 in a week --> | |

## Safety signals

<!-- AI-specific safety monitoring. These are separate from quality signals because safety failures require immediate response. -->

| Signal | Definition | Target | Alert threshold | Response |
|--------|------------|--------|-----------------|----------|
| PII leakage | Outputs containing detected PII patterns | 0 | Any single occurrence | <!-- e.g., immediate investigation, disable feature if confirmed --> |
| Prompt injection attempts | Inputs matching known injection patterns | Informational | <!-- e.g., > 10/day from single user --> | |
| Content policy violations | Outputs flagged by content safety filters | 0 | Any single occurrence | |
| Out-of-scope actions | Agent takes action outside defined boundaries | 0 | Any single occurrence | |

## Version tracking

<!-- When a quality dip happens, the first question is "did something change?" Track what is running in production. -->

| Component | Current version | Last changed | Change log |
|-----------|----------------|--------------|------------|
| Model | <!-- e.g., Claude Sonnet 4.6 --> | <!-- date --> | <!-- link to change record --> |
| System prompt | <!-- e.g., v2.3 --> | <!-- date --> | <!-- link to diff --> |
| Retrieval pipeline | <!-- e.g., v1.1 --> | <!-- date --> | |
| Eval suite | <!-- e.g., 100 examples, last run date --> | <!-- date --> | |

## Drift detection

<!-- Models degrade silently. Monitor for changes in output quality, distribution, and behavior over time. -->

- **Eval cadence:** <!-- e.g., run golden set weekly against production, compare to baseline -->
- **Output sampling:** <!-- e.g., log and store 10% of production outputs for manual review -->
- **Distribution monitoring:** <!-- e.g., track output length, confidence score distribution, and vocabulary patterns week over week -->
- **Trigger for investigation:** <!-- e.g., any sustained metric movement > 5% from baseline over 3+ days -->

## Tracing and debugging

<!-- When something goes wrong, you need to reconstruct what happened for a specific request. -->

- **Trace ID:** <!-- e.g., every request gets a unique trace ID that links input, retrieval results, model call, output, and user action -->
- **Full request logging:** <!-- e.g., log 100% of requests for first 2 weeks, then sample 10% at steady state -->
- **Retention period:** <!-- e.g., 90 days for full traces, 1 year for aggregate metrics -->
- **Privacy constraints:** <!-- e.g., PII scrubbed before storage, access restricted to on-call engineers -->

## Trace review loop

<!-- Traces are how the team turns real behavior into better evals and product decisions. -->

| Question | Answer |
|----------|--------|
| Who reviews traces? | |
| Sampling cadence | <!-- e.g., daily first 2 weeks, weekly after --> |
| Sample size | <!-- e.g., 20-50 traces per review --> |
| Sampling method | <!-- random, high-risk only, rejected outputs, high-cost traces, escalations --> |
| What gets labeled? | <!-- output quality, retrieval quality, tool use, handoff, priority, cost, safety --> |
| Where labels go | <!-- eval set, PRD risk table, launch gate, support process --> |
| Eval update trigger | <!-- e.g., recurring failure appears 3+ times or any high-severity failure --> |

| Trace category | What to inspect | Action if recurring |
|----------------|-----------------|---------------------|
| Rejected or ignored outputs | Did the AI miss intent, evidence, tone, or policy? | Add eval case or change workflow |
| Edited outputs | What did the human correct? | Add correction pattern to golden set |
| Escalations | Should the AI have escalated earlier? | Update handoff rule or eval |
| High-cost traces | Did retries, context, or tools inflate cost? | Add cost guardrail |
| Safety flags | Did guardrails or review catch it? | Block launch or update risk mitigation |

## Alert routing

| Severity | Response time | Who gets paged | Example |
|----------|---------------|----------------|---------|
| Critical | <!-- e.g., 15 min --> | <!-- e.g., on-call engineer + PM --> | <!-- e.g., PII leakage, safety failure, data breach --> |
| High | <!-- e.g., 1 hour --> | <!-- e.g., on-call engineer --> | <!-- e.g., quality score below threshold, error rate spike --> |
| Medium | <!-- e.g., next business day --> | <!-- e.g., PM --> | <!-- e.g., accept rate declining, cost trending up --> |
| Low | <!-- e.g., next review meeting --> | <!-- e.g., PM --> | <!-- e.g., adoption below target, minor latency increase --> |

## Review cadence

- **Daily (first 2 weeks post-launch):** check product signals, review any alerts
- **Weekly:** sample 20 outputs for manual review, review cost trends
- **Monthly:** full eval re-run on production data, update quality baselines
- **On every model/prompt change:** run regression suite before deploy
- **After any incident:** add failure case to eval set, review related signals for missed warning signs
- **After any usage spike:** review cost and latency impact, check for degradation under load

## Weekly post-launch review

<!-- Use this section for the operating meeting after pilot or production launch. Fill it out before the meeting, not during. -->

**Feature:** <!-- name -->
**Week of:** <!-- YYYY-MM-DD -->
**Author:** <!-- name -->

### What changed

<!-- List prompt updates, model swaps, UI changes, guardrail additions, rollout changes, or major usage shifts. -->

-
-

### Metrics summary

| Metric | This week | Last week | Target | Status |
|--------|-----------|-----------|--------|--------|
| Active users | | | | |
| Tasks completed | | | | |
| Accept rate | | | | |
| Edit rate | | | | |
| Reject rate | | | | |
| Retry rate | | | | |
| Escalation rate | | | | |
| Cost per task | | | | |
| p95 latency | | | | |
| Automated eval score | | | | |
| Manual review score | | | | |

### Incidents and near misses

| Date | Description | Severity | Resolution | Follow-up |
|------|-------------|----------|------------|-----------|
|      |             |          |            |           |

### Top failure modes

<!-- What are the most common ways the AI failed this week? Add recurring failures to the eval set. -->

1.
2.

### Decisions and next actions

| Decision or action | Owner | Due | Reversal or review trigger |
|--------------------|-------|-----|----------------------------|
|                    |       |     |                            |
