# AI build brief

Use this to turn PM intent into engineering-ready work. Compatible with the [GRIT framework](https://github.com/zaidazmi/GRIT) for AI-assisted engineering delivery.

**Upstream:** pull the problem, AI job, and constraints from the [AI PRD](ai-prd.md). **Parallel:** reference the [eval plan](ai-eval-plan.md) for test requirements and the [launch gate checklist](launch-gate-checklist.md) for ship criteria.

## Premise check

**Problem:** <!-- One sentence. What user problem does this solve? -->

**Smallest useful version:** <!-- What is the narrowest scope that still delivers value? -->

**Does this already exist?** <!-- Have you checked if an off-the-shelf model, API, or existing feature already handles this? -->

**Null case:** <!-- What happens if the AI produces nothing? What does the user see? Is that acceptable? -->

## Behavioral contract

<!-- Describe what the AI must do, must not do, and how it handles uncertainty. This is the spec engineers build against. -->

**Must do:**
- 

**Must not do:**
- 

**When uncertain:**
- 

## Inputs and outputs

**Inputs:**

| Field | Type | Source | Required | Validation |
|-------|------|--------|----------|------------|
|       |      |        |          |            |

**Outputs:**

| Field | Type | Always present | Fallback |
|-------|------|----------------|----------|
|       |      |                |          |

## Edge cases

<!-- List the inputs and scenarios that will break naive implementations. Be specific. -->

| Case | Example input | Expected behavior |
|------|---------------|-------------------|
|      |               |                   |

## Non-goals

<!-- What should engineering explicitly not build in this iteration? -->

- 
- 

## Dependencies and prerequisites

<!-- What must exist before engineering can start? APIs, infrastructure, data pipelines, permissions, third-party access. -->

| Dependency | Status | Owner | Blocker if missing? |
|------------|--------|-------|---------------------|
|            |        |       |                     |

## Performance requirements

<!-- Pull from the PRD and make explicit for engineering. -->

- **Latency target:** <!-- e.g., p50 < 2s, p95 < 5s, hard timeout at 8s -->
- **Throughput:** <!-- e.g., must handle X concurrent requests -->
- **Cost ceiling:** <!-- e.g., < $0.05 per task -->

## Eval and test requirements

<!-- What evals must pass before merge? Reference the eval plan if one exists. -->

- Golden set accuracy: <!-- target -->
- Regression test: <!-- what specific behavior must not degrade? -->
- Adversarial test: <!-- what inputs should the AI handle gracefully? -->
- Safety test: <!-- what outputs are unacceptable regardless of other scores? -->

## Risk and hardening

<!-- What can go wrong and what safeguards are needed? -->

| Risk | Mitigation | Detection |
|------|------------|-----------|
|      |            |           |

## Launch gate

<!-- What must be true for this to ship? Link to the launch gate checklist if applicable. -->

- 
- 

## Open questions

<!-- What does engineering need answered before starting? What would change the approach? -->

- 
- 
