# AI opportunity brief

Use this before committing any engineering time. Kill bad ideas here, not after a prototype.

**Next:** if you decide to pursue or prototype, write the [AI PRD](ai-prd.md). If the idea is not coherent across user, AI job, human control, evals, risk, and cost, stop here and sharpen it before building.

## Problem

<!-- What specific user problem are you solving? Who has it? How often? What does it cost them today (time, money, errors, missed opportunities)? -->

- Target user:
- Workflow where the problem happens:
- Current workaround:
- Cost of the problem today: <!-- time, money, errors, missed revenue, risk -->

## Current workflow

<!-- Walk through the exact steps a user takes today. Where do they get stuck or waste time? Number the steps so others can follow. -->

## Why AI, and why not deterministic software

<!-- What about this problem requires prediction, generation, or judgment? Why can't you solve it with rules, lookups, or traditional automation? Be honest — if a rules-based approach gets you 80% of the way, say so. -->

## Smallest useful version

<!-- What is the narrowest version that still solves the problem? One user type, one task, one input format. What is explicitly out of scope for v1? -->

## AI job draft

> The AI [does what] using [inputs] to produce [outputs] for [user] inside [workflow], subject to [constraints].

- Inputs:
- Outputs:
- Explicitly out of scope:

## Human control

<!-- What must a human approve, edit, reject, undo, or monitor before the AI output matters? If there is no human loop, explain why the action is low-risk, reversible, well-tested, and monitored. -->

| AI action | Review mode | Reviewer or monitor | Why this mode |
|-----------|-------------|---------------------|---------------|
|           | <!-- in / on / after / none --> | | |

## Data, eval, and operating assumptions

- Data sources:
- Data quality concerns:
- First eval cases to create:
- Cost per task target:
- Observability signals needed before pilot:

## Alternatives considered

<!-- What else could solve this? Buy vs. build, a simpler non-AI approach, a competitor's product, doing nothing. For each, explain why it falls short or why it might actually be sufficient. -->

| Alternative | Pros | Cons | Why not (or why maybe) |
|-------------|------|------|------------------------|
|             |      |      |                        |

## What happens if we do nothing

<!-- Will users find workarounds? Will a competitor ship this first? Will the problem get worse? Or is this actually fine to ignore? -->

## Risks already visible

<!-- List what could go wrong. Don't wait for a risk review to name the obvious ones. -->

| Risk | Scenario | Likelihood | Severity | Mitigation or next action | Owner |
|------|----------|------------|----------|---------------------------|-------|
|      |          |            |          |                           |       |

Highest-severity risk:

Legal, security, privacy, or compliance concern:

What would make this a "do not launch" decision?

## Prototype success criteria

<!-- If the decision is "Prototype," what specific questions must the prototype answer? What result would tell you to proceed, and what result would tell you to stop? Without this, prototypes become demos that always "succeed." -->

| Question the prototype must answer | Proceed if | Stop if |
|------------------------------------|------------|---------|
|                                    |            |         |

## Decision

- [ ] Pursue: commit to a PRD and eval plan
- [ ] Prototype: time-boxed spike to answer the questions above
- [ ] Defer: revisit in <!-- timeframe -->
- [ ] Reject: not worth pursuing because <!-- reason -->

**Decided by:** <!-- name -->
**Date:** <!-- YYYY-MM-DD -->
