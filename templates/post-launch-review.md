# Post-launch review

Use this template for weekly quality reviews after launching an AI feature. Fill it out before the meeting, not during.

**Inputs:** pull metrics from the [observability plan](ai-observability-plan.md). **Outputs:** new failure modes update the [eval plan](ai-eval-plan.md) and [risk register](ai-risk-register.md). Gate decisions go through the [launch gate checklist](launch-gate-checklist.md).

**Feature:** <!-- name -->
**Week of:** <!-- YYYY-MM-DD -->
**Author:** <!-- name -->

## What shipped

<!-- List changes deployed this week: prompt updates, model swaps, UI changes, guardrail additions. -->

- 
- 

## Usage

| Metric | This week | Last week | Trend |
|--------|-----------|-----------|-------|
| Active users | | | |
| Tasks completed | | | |
| Accept rate | | | |
| Edit rate | | | |
| Reject rate | | | |
| Retry rate | | | |

## Quality

| Metric | This week | Target | Status |
|--------|-----------|--------|--------|
| Automated eval score | | <!-- target --> | <!-- on track / below / above --> |
| Manual review score (n=<!-- sample size -->) | | <!-- target --> | |
| Regression failures | | 0 | |

## Cost

| Metric | This week | Budget | Status |
|--------|-----------|--------|--------|
| Cost per task | | <!-- budget --> | |
| Cost per customer | | <!-- budget --> | |
| Total AI spend | | <!-- budget --> | |

## Latency

| Metric | This week | Target | Status |
|--------|-----------|--------|--------|
| p50 | | <!-- target --> | |
| p95 | | <!-- target --> | |

## User feedback summary

<!-- 2-3 sentences. What are users saying? Pull from support tickets, feedback forms, usage patterns. -->

## Incidents

<!-- List any incidents, near-misses, or escalations. If none, write "None." -->

| Date | Description | Severity | Resolution | Follow-up |
|------|-------------|----------|------------|-----------|
|      |             |          |            |           |

## Top failure modes

<!-- What are the most common ways the AI fails this week? Include examples if possible. -->

1. 
2. 

## Signals requiring response

<!-- What changed this week that needs a product decision? Check customer signals, market signals, and system signals. -->

| Signal | Source | Implication | Proposed response |
|--------|--------|-------------|-------------------|
| <!-- e.g., competitor launched similar feature --> | <!-- e.g., market --> | <!-- e.g., differentiation at risk --> | <!-- e.g., accelerate eval coverage for unique capabilities --> |
| <!-- e.g., reject rate spiked for intent X --> | <!-- e.g., product metrics --> | <!-- e.g., model regression or new user pattern --> | <!-- e.g., add to golden set, investigate root cause --> |

## Decisions made

<!-- What did the team decide this week based on the data above? -->

- 
- 

## Next actions

| Action | Owner | Due |
|--------|-------|-----|
|        |       |     |
