# Human review workflow

Use this to define when humans review AI output. Fill this out before building any UI. If you skip this, you'll end up with a "just ship it and see" approach to AI autonomy.

**Upstream:** autonomy levels and human review rules from the [AI PRD](ai-prd.md) define what goes here. **Downstream:** review point failures feed into the [risk register](ai-risk-register.md) and [post-launch review](post-launch-review.md).

## HITL mode

Pick the review mode per AI action. Different actions in the same product can use different modes.

| Mode | What it means | Use when | Example |
|------|---------------|----------|---------|
| Human-in-the-loop | Human approves before the AI output or action takes effect | Customer-facing, high-impact, irreversible, or low-confidence work | Agent drafts an email; support rep reviews before sending |
| Human-on-the-loop | AI acts, humans monitor and can intervene or roll back | Action is reversible, monitored, and low-to-medium risk | AI categorizes tickets; ops reviews alerts and samples |
| Human-after-the-loop | Humans review samples, incidents, and aggregate trends after the fact | Risk is low, action is reversible, and online metrics are strong | Weekly review of accepted summaries and rejection reasons |
| No human loop | AI acts without human review | Only for low-risk, reversible, well-tested actions with observability | Internal formatting cleanup or low-stakes enrichment |

Mode map:

| AI action | HITL mode | Why this mode | Upgrade or downgrade trigger |
|-----------|-----------|---------------|------------------------------|
|           |           |               |                              |

## Actions AI can take alone

<!-- These are low-risk, reversible, or well-validated actions. The AI acts without waiting for a human. -->

- 
- 

## Actions AI can take with rollback

<!-- Maps to the PRD "Act" autonomy level: the AI takes action before review, but the action is reversible, logged, and easy for a human to undo. Define the rollback path before allowing this. -->

| Action | Rollback mechanism | Undo window | Who monitors |
|--------|--------------------|-------------|--------------|
|        |                    |             |              |

## Actions AI can suggest only

<!-- The AI produces a recommendation or draft. A human must approve before the action takes effect. -->

| Action | Who reviews | Max review latency | What reviewer sees |
|--------|-------------|--------------------|--------------------|
|        |             |                    |                    |

## Actions AI must never take

<!-- Hard boundaries. The AI cannot perform these regardless of confidence. -->

- 
- 

## Required review points

<!-- Specific moments in the workflow where a human must inspect AI output before proceeding. -->

| Review point | Trigger | Reviewer | What they check | What happens if rejected |
|--------------|---------|----------|-----------------|-------------------------|
|              |         |          |                 |                         |

## Review UI requirements

<!-- What does the reviewer need to see to make a good decision quickly? -->

- AI output displayed: <!-- full output, diff, summary? -->
- Source/evidence shown: <!-- does the reviewer see what the AI based its answer on? -->
- Confidence indicator: <!-- is confidence shown? how? -->
- Edit capability: <!-- can the reviewer modify the output before approving? -->
- Time to review target: <!-- how long should a single review take? -->

## Escalation path

<!-- What happens when the reviewer is unsure, or the AI output is flagged? -->

1. Reviewer flags output as uncertain
2. <!-- next step -->
3. <!-- resolution -->

## Audit trail

<!-- What is logged for every AI action and review decision? -->

- [ ] AI output (full)
- [ ] Reviewer identity
- [ ] Review decision (approve/reject/edit)
- [ ] Edits made by reviewer
- [ ] Timestamp
- [ ] <!-- add product-specific fields -->

## Feedback captured from review

<!-- What reviewer actions feed back into improving the AI? -->

| Feedback type | How captured | How used |
|---------------|-------------|----------|
| Rejection reason | <!-- e.g., dropdown + free text --> | <!-- e.g., added to eval set --> |
| Edit diff | <!-- e.g., stored automatically --> | <!-- e.g., fine-tuning data --> |
|               |             |          |
