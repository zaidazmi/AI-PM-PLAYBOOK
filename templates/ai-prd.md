# AI product requirements document

Use this to define what you're building, how the AI behaves, and what "good" looks like. The AI job statement is the most important line in this document.

**Upstream:** this should follow an approved [opportunity brief](ai-opportunity-brief.md). **Downstream:** use this PRD to create the [eval plan](ai-eval-plan.md), [human review workflow](human-review-workflow.md), [cost model](ai-cost-model.md), [observability plan](ai-observability-plan.md), and [launch gate](launch-gate-checklist.md). If engineers or coding agents need a tighter handoff, use the optional [build brief](optional/ai-build-brief.md).

## Problem

<!-- What user problem does this solve? Include evidence: support tickets, user interviews, usage data. -->

## Goals

<!-- What outcomes will you measure? Be specific: "reduce manual review time from 20 min to under 5 min" not "improve efficiency." -->

- 
- 

## Non-goals

<!-- What are you explicitly not doing? This prevents scope creep mid-build. -->

- 
- 

## Target users

<!-- Who uses this first? Be narrow. "Enterprise compliance analysts reviewing vendor contracts" not "business users." -->

## Current workflow

<!-- Step-by-step: what does the user do today without this product? -->

1. 
2. 
3. 

## Proposed workflow

<!-- Step-by-step: what changes with AI in the loop? Where does the human still act? -->

1. 
2. 
3. 

## AI job statement

> The AI [does what] using [inputs] to produce [outputs] for [user] inside [workflow], subject to [constraints].

<!-- Fill this in. Example: "The AI drafts a contract summary using the uploaded PDF to produce a structured risk report for compliance analysts inside their review queue, subject to a 2% max hallucination rate on key terms and no fabricated clause references." -->

## Constraints and guardrails

<!-- Runtime boundaries the system enforces. Guardrails are preventive; the risk table below is what happens when one fails. Every "subject to [constraints]" clause in the AI job statement should appear here with a threshold and an owner. -->

| Guardrail | Hard limit | Enforced by | On violation | Monitored as (target) |
|-----------|------------|-------------|--------------|-----------------------|
| Input scope | <!-- only in-scope requests --> | <!-- intent classifier / router --> | <!-- decline + fallback --> | <!-- out-of-scope rate; router false-route rate --> |
| Prompt injection | <!-- ignore instructions inside user or retrieved content --> | <!-- system prompt + input sanitization --> | <!-- flag, do not act --> | <!-- flagged-input rate; missed-attack rate (FN) --> |
| Grounding | <!-- every factual claim traces to a cited source; no fabricated citations --> | <!-- output validator checks cited IDs exist --> | <!-- suppress output --> | <!-- ungrounded-output rate; fabrications passing validator (FN) --> |
| Output schema | <!-- matches the output contract --> | <!-- schema validation --> | <!-- fallback (see Failure behavior) --> | <!-- malformed-output rate --> |
| Action scope | <!-- no irreversible action without approval --> | <!-- autonomy map + approval gate --> | <!-- stop, escalate to human --> | <!-- blocked-action rate; false-block rate (FP) --> |
| Safety topics | <!-- refuse defined categories (self-harm, legal, etc.) --> | <!-- safety classifier --> | <!-- escalate to human --> | <!-- escalation rate; missed-trigger rate (FN) --> |
| Cost / rate ceiling | <!-- max tokens + retries per task --> | <!-- runtime budget cap --> | <!-- stop, fallback --> | <!-- cap-hit rate --> |

<!-- Each guardrail needs a metric or it's unverifiable: how often it fires, and how often the enforcer is wrong (false negatives = leaked failures, false positives = suppressed good output). Carry targets into the Quality bar and Observability. Grounding is the key guardrail for RAG, summarization, and extraction: ungrounded (a confident claim with no source) is a distinct failure from wrong. -->

## Model requirements

<!-- What model or provider are you using? What constraints apply? -->

| Parameter | Value | Notes |
|-----------|-------|-------|
| Model / provider | <!-- e.g., Claude Sonnet via Anthropic API --> | |
| Token budget per task | <!-- e.g., 2k input, 500 output --> | |
| Multi-model routing | <!-- e.g., cheap model for classification, expensive model for generation --> | |
| Context window needs | <!-- e.g., must handle 50-page documents --> | |

## System persona

<!-- How should the AI communicate? This is a product requirement, not an engineering detail. If you don't spec it, the model default ships. -->

- Tone: <!-- e.g., professional, direct, no hedging -->
- Constraints: <!-- e.g., never speculate beyond source material, always cite the document section -->
- Persona boundaries: <!-- e.g., does not give opinions, does not role-play -->

## Data provenance

<!-- What data does the AI use? Where does it come from? What are the privacy and compliance constraints? -->

- Retrieval sources: <!-- e.g., customer knowledge base, internal docs -->
- Data permissions: <!-- e.g., customer data processed under DPA, no cross-tenant access -->
- Retention policy: <!-- e.g., prompts and outputs logged for 30 days, then deleted -->

## Input contract

<!-- What does the AI receive? Format, size limits, required fields, what happens if input is malformed. -->

| Input | Format | Required | Max size | Fallback if missing |
|-------|--------|----------|----------|---------------------|
|       |        |          |          |                     |

## Output contract

<!-- What does the AI produce? Structure, format, required fields. -->

| Output field | Type | Always present | Example |
|--------------|------|----------------|---------|
|              |      |                |         |

## Autonomy level

- [ ] Draft: AI produces output, human reviews before anything happens
- [ ] Suggest: AI recommends an action, human accepts or rejects
- [ ] Act: AI takes action, human can undo
- [ ] Autonomous: AI takes action, no human in the loop

<!-- Justify your choice. Higher autonomy requires higher quality bars and better failure handling. -->

<!-- Different actions in the same product can have different autonomy levels. Map each AI action below: -->

| AI action | Autonomy level | Justification |
|-----------|---------------|---------------|
| <!-- e.g., draft support response --> | <!-- e.g., draft --> | <!-- e.g., customer-facing, must be reviewed before sending --> |
| <!-- e.g., categorize incoming ticket --> | <!-- e.g., act --> | <!-- e.g., low risk, reversible --> |

## Agent tool boundaries

<!-- If this product uses agents (tool-calling, multi-step workflows), define what tools the agent can access and what it cannot do. Skip this section for single-turn LLM features. -->

| Tool / capability | Allowed | Constraints |
|-------------------|---------|-------------|
| <!-- e.g., read customer records --> | <!-- yes/no --> | <!-- e.g., read-only, current tenant only --> |
| <!-- e.g., send email --> | <!-- yes/no --> | <!-- e.g., draft only, requires human approval --> |
| <!-- e.g., modify database --> | <!-- yes/no --> | <!-- e.g., never --> |

Escalation: <!-- When the agent encounters something outside its scope, what happens? e.g., hand off to human, surface uncertainty, stop and ask. -->

## Example inputs and outputs

<!-- Include 2-3 examples to anchor alignment across PM, engineering, and design. At least one rejection case. -->

| Case | Input | Expected output |
|------|-------|-----------------|
| Happy path | <!-- typical input --> | <!-- what good looks like --> |
| Rejection | <!-- input the AI should refuse --> | <!-- e.g., refusal with escalation to human --> |
| Edge case | <!-- unusual but valid input --> | <!-- acceptable behavior --> |

## Human review rules

<!-- When must a human review AI output before it reaches the user or takes effect? -->

- 
- 

## Risks and mitigations

<!-- Name the risks that could block pilot, production, or scale. Any high-severity risk needs an owner and mitigation before launch. -->

| Risk | Scenario | User impact | Business impact | Likelihood | Severity | Mitigation | Detection signal | Owner |
|------|----------|-------------|-----------------|------------|----------|------------|------------------|-------|
| Incorrect output | <!-- plausible but wrong output --> | | | | | | | |
| Over-trust | <!-- user treats AI as authoritative --> | | | | | | | |
| Data leakage | <!-- wrong user/tenant sees data --> | | | | | | | |
| Permission failure | <!-- acts outside the user's authz scope --> | | | | | | | |
| Prompt injection | <!-- instructions in user/retrieved content hijack behavior --> | | | | | | | |
| Bias / unfair treatment | <!-- worse outcomes for a protected group --> | | | | | | | |
| Regulatory exposure | <!-- output or data handling breaches a rule --> | | | | | | | |
| Unsafe autonomy | <!-- AI takes action beyond scope --> | | | | | | | |
| Cost spike | <!-- usage or retries exceed budget --> | | | | | | | |
| Silent degradation | <!-- quality drops without alert --> | | | | | | | |

Agentic risks, if relevant:

| Risk | Scenario | Mitigation | Owner |
|------|----------|------------|-------|
| Goal hijacking | | | |
| Tool misuse | | | |
| Identity abuse | | | |
| Memory poisoning | | | |
| Error cascading | | | |

## Quality bar

<!-- Specific, measurable thresholds, scored across multiple runs for non-deterministic output. Example: "Precision >= 95% on golden eval set (n=200), measured over 3 runs with no single run below 92%. No fabricated citations. Structured fields match source in >= 98% of cases." -->

## Latency target

<!-- p50 and p95 targets. Example: "p50 < 3s, p95 < 8s for single-document summary." -->

## Cost constraint

<!-- Per-task and per-user-month budget. Example: "< $0.05 per summary, < $2/user/month at expected usage." -->

## Failure behavior

<!-- What does the product do when the AI fails, times out, or returns low-confidence output? -->

- On timeout: 
- On low confidence: 
- On malformed output: 
- On safety trigger: 

## Observability requirements

<!-- What must be logged and monitored from day one? -->

- 
- 

## Launch gates

<!-- What must be true before this ships to any user? Reference the launch gate checklist. -->

- 
- 

## Open questions

<!-- What do you still need to figure out? Be specific about what would change your plan. -->

- 
- 
