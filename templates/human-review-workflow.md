# Human review workflow

Define when and how humans review AI output — before building any UI. Skip this and you default to "ship it and see," which is how AI products lose user trust.

**Upstream:** autonomy levels and human review rules from the [AI PRD](ai-prd.md). **Downstream:** review failures and review-quality signals feed the PRD risk table, launch gate, and [weekly post-launch review](ai-observability-plan.md#weekly-post-launch-review).

## Review mode per action

Pick a mode per AI action. Different actions in one product can use different modes. Higher risk moves up the table.

| Mode | Human role | Use when |
|------|-----------|----------|
| Human-in-the-loop | Approves before the output or action takes effect | Customer-facing, high-impact, irreversible, or low-confidence |
| Human-on-the-loop | Monitors live, can intervene or roll back | Reversible, monitored, low-to-medium risk |
| Human-after-the-loop | Reviews samples and trends after the fact | Low risk, reversible, online metrics strong |
| No human loop | None | Low-risk, reversible, well-tested, and observable |

<!-- These map to the PRD autonomy levels: Draft and Suggest -> human-in-the-loop; Act -> human-on-the-loop with rollback; Autonomous -> no human loop (or human-after-the-loop for sampled review). -->

| AI action | Mode | Reviewer | Why this mode | Upgrade / downgrade trigger |
|-----------|------|----------|---------------|------------------------------|
|           |      |          |               |                              |

<!-- The trigger column is the point of this table: name the metric that moves an action to stricter or looser review. E.g. "downgrade to on-the-loop after 4 weeks above 95% accept rate; upgrade to in-the-loop if accept rate drops below 80%." -->

## Hard boundaries — actions AI must never take

<!-- The AI cannot perform these regardless of confidence or mode. Enforce in code, not in the prompt. -->

- 
- 

## Reversible auto-actions and rollback

<!-- For any action the AI takes before review (on-the-loop or no-loop), define how it is undone. No rollback path means no auto-action. -->

| Action | Rollback mechanism | Undo window | Who monitors |
|--------|--------------------|-------------|--------------|
|        |                    |             |              |

## Required review points

<!-- The specific moments review fires. Tie each trigger to a condition, not a judgment call. -->

| Review point | Trigger | Reviewer | What they check | If rejected |
|--------------|---------|----------|-----------------|-------------|
|              |         |          |                 |             |

## Reviewer capacity and SLA

<!-- Human-in-the-loop only works if humans keep up. If output arrival rate exceeds review capacity, review becomes a bottleneck or a rubber stamp. Do this math before launch, not after the backlog. -->

- Outputs needing review: <!-- per hour / day at target usage -->
- Review throughput per reviewer: <!-- items/hour at target quality, from a timed sample -->
- Reviewers staffed: <!-- count and coverage across shifts -->
- Review SLA: <!-- max time from output to decision -->
- Overflow behavior: <!-- when the queue exceeds SLA: hold output, fall back to suggest-only, page a lead -->

## Guarding against rubber-stamping

<!-- The dominant human-in-the-loop failure is automation bias: reviewers approve everything because the AI is usually right and the queue is long. A review step that approves ~100% is not a control. Monitor these as production signals in the observability plan. -->

- Review-quality signal: <!-- flag if approval rate > X% or median time-per-review < Y seconds -->
- Blind audit: <!-- a second reviewer re-checks a random N% of approvals; track disagreement rate -->
- Seeded checks: <!-- inject known-bad outputs at a low rate; a reviewer who approves them is not reviewing -->
- Reviewer calibration: <!-- expert domains: inter-reviewer agreement target before a reviewer works solo -->

## Review UI requirements

<!-- What the reviewer must see to decide well and fast. Missing or buried evidence is the top cause of rubber-stamping. -->

- Output shown: <!-- full, diff, or summary -->
- Evidence and sources shown: <!-- what the AI based its answer on, inline -->
- Confidence shown: <!-- and whether it is calibrated (see PRD) -->
- Edit in place: <!-- can the reviewer modify before approving -->
- Target time per review: <!-- ties to the capacity math above -->

## Escalation path

<!-- When the reviewer is unsure or the output is flagged. -->

1. Reviewer flags output as uncertain
2. <!-- who or what handles it next -->
3. <!-- resolution, and how it is recorded -->

## Audit trail

<!-- Logged for every AI action and review decision. Required for incident reconstruction and compliance. -->

- [ ] AI output (full), plus input and evidence used
- [ ] Reviewer identity
- [ ] Decision (approve / reject / edit) and edits made
- [ ] Confidence and mode at time of decision
- [ ] Timestamp

## Feedback captured from review

<!-- Review is your highest-quality eval data. Route it back. -->

| Feedback type | How captured | How used |
|---------------|--------------|----------|
| Rejection reason | dropdown + free text | added to eval set |
| Edit diff | stored automatically | correction patterns, fine-tuning data |
