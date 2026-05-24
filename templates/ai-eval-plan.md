# AI eval plan

Use this to define what "good" means before you build. If you can't write this, you're not ready to build.

**Upstream:** the task definition and quality bar come from the [AI PRD](ai-prd.md). **Downstream:** eval results feed into the [launch gate checklist](launch-gate-checklist.md) and the [weekly post-launch review](ai-observability-plan.md#weekly-post-launch-review).

## Task definition

<!-- What specific task is the AI performing? One task per eval plan. Example: "Summarize a vendor contract into a structured risk report." -->

## Eval scope

<!-- For agentic or multi-step products, evaluate at multiple levels. Single-turn LLM features can skip the node and session rows. -->

| Level | What you measure | Example |
|-------|------------------|---------|
| Node | Individual step or tool call accuracy | Did the retrieval return relevant docs? Did the classifier pick the right category? |
| Session | End-to-end task completion | Did the agent complete the full workflow? Did it recover from a failed step? |
| System | Latency, cost, token efficiency across runs | p95 latency under 8s, cost per task under $0.05 |

<!-- Most multi-agent failures happen at agent boundaries, not within individual agents. Test handoffs explicitly. -->

## Evaluation dataset

<!-- Where does the eval data come from? How many examples? How are they selected? Who labeled them? -->

- Source: 
- Size: <!-- internal iteration: 5-10; prototype: 20-50; pilot: 50-100; production: 200+; larger for regulated/high-stakes domains -->
- Selection method: <!-- random sample, stratified by difficulty, adversarial, etc. -->
- Labeler: <!-- who created the ground truth? what were their instructions? -->

<!-- Smaller datasets help the team iterate quickly. Larger datasets increase confidence before pilot or production decisions. State which stage this eval supports. -->

- Stage: <!-- internal iteration / prototype validation / pilot readiness / production readiness -->

## Golden examples

<!-- Include at least these four. These are the examples you walk through in every review meeting. -->

### Happy path

**Input:** <!-- typical, well-formed input -->

**Expected output:** <!-- what good looks like -->

**Why this matters:** <!-- what it demonstrates about the AI's core capability -->

### Edge case

**Input:** <!-- unusual but valid input the AI must handle -->

**Expected output:** <!-- acceptable behavior -->

**Why this matters:** <!-- what breaks if this fails -->

### Unacceptable output

**Input:** <!-- input that could produce a bad result -->

**Unacceptable output:** <!-- the output you're testing against -->

**Why this is unacceptable:** <!-- user impact, trust damage, compliance issue -->

### Safety boundary

**Input:** <!-- input that tests a safety constraint -->

**Expected behavior:** <!-- refusal, escalation, or safe fallback -->

**Why this matters:** <!-- what goes wrong if the boundary isn't held -->

## Robustness and consistency

<!-- Accuracy alone is misleading. These two metrics catch problems that overall accuracy hides. -->

### Robustness: accuracy across input variations

<!-- Break accuracy down by input format, layout, language, or source. -->

| Input variant | Example | Accuracy target |
|---------------|---------|-----------------|
| <!-- e.g., clean PDF --> | | |
| <!-- e.g., scanned image --> | | |
| <!-- e.g., CSV with different column order --> | | |

### Consistency: same entity, same result

<!-- Does the system produce the same output for different representations of the same thing? -->

| Entity type | Variations to test | Target consistency |
|-------------|-------------------|-------------------|
| <!-- e.g., merchant names --> | <!-- e.g., "SQ", "Singapore Airlines", "Singapore Air" --> | |

## Quality rubric

<!-- How do you score an output? Use pass/fail for safety-critical criteria. If you use a 1-5 rubric for subjective quality, define the pass threshold. -->

| Criterion | Pass | Fail |
|-----------|------|------|
|           |      |      |

## Grading tiers

<!-- Use the cheapest reliable method at each tier. Reserve human review for calibration and edge cases. -->

| Tier | Method | When to use | Example |
|------|--------|-------------|---------|
| 1 | Code-based (deterministic) | Structured outputs, format checks, exact match | Schema validation, required fields present, no fabricated citations |
| 2 | LLM-as-judge | Subjective quality, tone, relevance, reasoning | Pass/fail judge for handoff failure, ignored intent, unsupported claim |
| 3 | Human review | Calibration, expert domains, disputed cases | Medical accuracy review, legal compliance check |

<!-- LLM-as-judge can be unreliable in expert domains such as medical, legal, and financial workflows. Calibrate it against human review before relying on it. -->

## Error analysis

<!-- Before automating evals, review traces and identify the product-specific failures worth measuring. -->

- Trace sample: <!-- e.g., 50 production traces, stratified by channel and user segment -->
- Reviewer: <!-- PM or domain expert who reviewed the traces -->
- Review date:

| Error category | Example trace or input | Frequency in sample | Severity | Fix path | Automate? |
|----------------|------------------------|---------------------|----------|----------|-----------|
| <!-- e.g., human handoff failure --> | | | <!-- low/med/high --> | <!-- prompt/retrieval/tool/product/policy --> | <!-- yes/no/later --> |

## LLM judge calibration

<!-- If you use an LLM-as-judge, prove that it agrees with human labels before relying on it. Prefer binary pass/fail judges for product-critical failures. -->

| Judge | Failure detected | Human-labeled sample size | Agreement | True positive rate | True negative rate | Approved for use? |
|-------|------------------|---------------------------|-----------|--------------------|--------------------|-------------------|
|       |                  |                           |           |                    |                    |                   |

## Non-deterministic eval strategy

<!-- LLM outputs vary across runs. A single eval pass can be misleading. High variance on a test case means the model is fragile on that input. -->

- Runs per eval: <!-- e.g., 3-5 runs per test case, aggregate scores -->
- Aggregation method: <!-- e.g., median score, majority vote on pass/fail -->
- Variance threshold: <!-- e.g., if pass/fail disagrees across runs, flag for human review -->

## Automated checks

<!-- What can you check without a human? These run on every model change. -->

- [ ] Output schema validation
- [ ] Required fields present
- [ ] No fabricated references or citations
- [ ] <!-- add task-specific checks -->

## Regression plan

<!-- How do you detect that a model update or code change broke something? -->

- Regression suite size: 
- Run frequency: <!-- on every deploy, daily, weekly -->
- Alert if: <!-- specific threshold, e.g., "accuracy drops > 2% vs. baseline" -->

## Online metrics

<!-- What do you measure in production to know if the AI is working for real users? -->

| Metric | Definition | Target | Alert threshold |
|--------|------------|--------|-----------------|
|        |            |        |                 |

<!-- User feedback is a signal, not ground truth. If user feedback conflicts with eval results, inspect traces and compare against the rubric before changing the product. -->

## Launch threshold

<!-- What eval results are required before shipping to users? -->

- 
- 

## Data flywheel

<!-- Production failures feed back into your eval set. Without this, evals go stale. -->

- Failure capture: <!-- e.g., user rejections, flagged outputs, support escalations logged -->
- Triage cadence: <!-- e.g., weekly review of new failures -->
- Eval set update: <!-- e.g., 5-10 new cases added per month from production -->

## Review cadence

<!-- How often do you re-run evals and review results after launch? -->

- Pre-launch: <!-- e.g., on every model or prompt change -->
- Post-launch: <!-- e.g., weekly for first month, then bi-weekly -->
