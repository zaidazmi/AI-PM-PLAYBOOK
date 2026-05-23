# Launch gates and staged rollout

> **The failure this prevents:** a stakeholder overrides the readiness assessment because the demo looked good. The product ships without eval coverage, observability, or fallback behavior. The first production incident has no runbook, no rollback plan, and no owner. This guide gives you the evidence structure to say "not yet" and make it stick.

## Contents

- [Three stages](#three-stages)
- [Hard blockers](#hard-blockers)
- [How to run a pilot](#how-to-run-a-pilot)
- [When to recommend "do not launch"](#when-to-recommend-do-not-launch)
- [The scoring model](#the-scoring-model)
- [How to use the scores](#how-to-use-the-scores)
- [Staged rollout mechanics](#staged-rollout-mechanics)
- [Next steps](#next-steps)

The hardest PM judgment call in AI products is not what to build. It is when to say "do not launch." Every AI product has pressure to ship, and the readiness score exists to make that decision based on evidence, not optimism.

The readiness score is not a simple average. Some gaps block launch entirely. An AI product with excellent accuracy but no human review for high-impact actions should not go to production, full stop.

## Three stages

AI products move through three stages, each with higher stakes and stricter requirements.

### Pilot

Internal users or a small group of friendly external users. The goal is to learn, not to scale.

- 5-20 users maximum
- Duration: 2-4 weeks
- All outputs reviewed by the team
- Success is measured by whether the AI handles real inputs acceptably, not by adoption metrics
- Kill criteria: if more than 30% of outputs require major human correction, stop and fix before continuing

### Limited production

Real users, real data, real consequences, but limited blast radius.

- 50-500 users, or one customer segment, or one region
- Duration: 4-8 weeks
- Human review required for high-impact actions
- Monitoring active with defined alert thresholds
- Success is measured by accept rate, escalation rate, and cost per task

### Scale

Full production. All users have access.

- Only after limited production validates quality and economics
- Observability and alerting fully operational
- Escalation and review processes proven under load
- Cost model validated against actuals

## Hard blockers

Certain gaps block advancement regardless of how strong other dimensions are.

**Pilot to limited production blockers:**

- Eval readiness below 3/5 (no golden set, no automated regression testing)
- No defined confidence thresholds or escalation policy
- No cost model

**Limited production to scale blockers:**

- No human review process for high-impact actions
- Eval readiness below 4/5
- No observability dashboard with defined alerts
- Cost per task exceeds target by more than 2x
- Safety eval failures above 1%
- No audit trail for agent actions

These are not negotiable. "We will add monitoring after launch" is the AI product equivalent of "we will write tests later." It does not happen, and the gap creates risk that compounds.

## How to run a pilot

A well-run pilot answers specific questions. Before starting, write down:

1. What questions will this pilot answer? (e.g., "Can the model accurately classify support tickets into our 12 categories?")
2. What metrics define success? (e.g., "Classification accuracy above 85% with less than 2% critical misclassification")
3. What metrics trigger a kill? (e.g., "Any PII leakage" or "accuracy below 60%")
4. How long will the pilot run? (2-4 weeks for most features)
5. Who reviews outputs during the pilot? (named individuals, not "the team")
6. How frequently will you review pilot data? (daily for the first week, then every other day)

During the pilot, resist the urge to fix problems by expanding scope. If the model struggles with edge cases, do not add more tools or capabilities. Fix the core quality first.

At the end of the pilot, write a one-page recommendation: proceed to limited production, extend the pilot with changes, or do not launch.

## When to recommend "do not launch"

This is the hardest and most important judgment call. You will face pressure from stakeholders who have invested time and budget. The PM who recommends "do not launch" when the evidence supports it earns more credibility than the PM who ships and hopes.

Recommend "do not launch" when:

- The product handles high-stakes decisions (health, finance, legal) and accuracy is below 90%
- The cost per task makes the unit economics unsustainable at target scale
- The product requires human review but no viable review process exists
- Safety evals reveal failure modes that cannot be mitigated with guardrails
- The pilot shows users do not trust the output enough to use it

The healthcare intake example illustrates this well. An AI-powered patient intake system might handle 80% of demographic and insurance fields correctly, which sounds good until you consider that the remaining 20% can create billing errors, privacy exposure, staff rework, and patient confusion. In healthcare, "prototype only" is the right answer until accuracy, privacy controls, observability, compliance review, and human review are strong enough for patient data.

## The scoring model

Rate your product across 11 dimensions, each scored 0-5.

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Eval readiness | 1.5x | Golden set quality, automated regression, LLM-judge calibration |
| Risk and safety | 1.4x | Risk identification, mitigation strategies, safety testing, incident response |
| Regulatory readiness | 1.3x | Risk classification, data provenance, compliance path, legal review |
| Observability | 1.3x | Product signals, system signals, alerting, dashboards |
| AI job definition | 1.2x | Clarity of what the AI does, input/output contracts, autonomy level |
| Data readiness | 1.2x | Data availability, quality, freshness, access pipelines |
| Launch and operations | 1.2x | Rollback plan, training, pilot design, on-call rotation |
| Problem fit | 1.1x | Evidence the problem is real, measured, and suited for AI |
| Workflow fit | 1.1x | How well the AI integrates into existing user workflows |
| System behavior | 1.0x | Edge case handling, confidence thresholds, fallback behavior, latency |
| Cost and business case | 1.0x | Unit economics modeled, cost ceilings set, ROI justification |

Eval readiness is weighted highest (1.5x) because it is the foundation everything else depends on. Without good evals, you cannot measure safety, you cannot calibrate confidence thresholds, you cannot detect regression, and you cannot validate that guardrails work. Every other dimension relies on your ability to measure quality.

Risk and safety is weighted second highest (1.4x) because safety failures have outsized consequences. A latency regression is annoying. A safety failure makes the news.

## How to use the scores

Calculate the weighted score for each dimension (score times weight). Sum the weights to get the maximum possible total, then divide weighted total by weight sum to get a weighted average out of 5.

More important than the total: look at the individual scores.

- Any dimension below 2: hard blocker for any customer-facing use. Keep it internal or synthetic-data-only.
- Any launch-critical dimension below 3: pilot candidate at best. Close the blocker before pilot if it affects evals, fallback, human review, data permissioning, or observability.
- Weighted score around 3 with no pre-pilot blockers: eligible for a limited pilot with conditions.
- All dimensions at 3 or above plus successful pilot evidence: eligible for limited production consideration.
- All dimensions at 4 or above plus stable production evidence: eligible for scale consideration.

The weighted average is useful for tracking progress over time and comparing readiness across features. But never let a high average override a critically low individual score. A product that averages 4.0 overall but has a 1/5 on safety should not launch.

## Staged rollout mechanics

When moving from one stage to the next:

1. Run the full eval suite and confirm scores meet the threshold
2. Review the last 2 weeks of observability data for trends
3. Confirm human review processes are staffed and functioning
4. Validate cost actuals against the model
5. Get sign-off from safety/legal/compliance as applicable
6. Document the decision and rationale
7. Set a review date for 2 weeks after stage transition

Keep the option to roll back. If limited production reveals problems the pilot missed, you need the ability to pull back to pilot without a fire drill. Design the rollout so that reverting is a planned operation, not an emergency.

## Next steps

- Score your product and track stage-gate decisions using the [Launch Gate Checklist template](../templates/launch-gate-checklist.md).
- Record each go/no-go decision and its rationale in a [Stakeholder Decision Record](../templates/stakeholder-decision-record.md).
