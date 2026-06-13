# AI PM Playbook

Practical open source playbook for **product managers building production AI products**.

[![Audience](https://img.shields.io/badge/audience-AI%20PMs-blue)](#who-this-is-for)
[![Focus](https://img.shields.io/badge/focus-production%20AI-green)](#what-this-playbook-helps-you-do)
[![Artifacts](https://img.shields.io/badge/artifacts-PRDs%20%7C%20evals%20%7C%20launch%20gates-purple)](#core-artifacts)
[![Companion](https://img.shields.io/badge/companion-GRIT-orange)](#engineering-delivery-with-grit)

AI PM Playbook helps product managers move AI ideas from vague opportunity to production-ready product work. It gives PMs the artifacts, decision gates, eval language, launch criteria, and operating rituals needed to build AI products that users can trust.

This is not a prompt pack. It is not a model leaderboard. It is not a collection of AI hot takes.

It is a working system for PMs building AI products.

## Table Of Contents

- [Why This Exists](#why-this-exists)
- [Who This Is For](#who-this-is-for)
- [What This Playbook Helps You Do](#what-this-playbook-helps-you-do)
- [Quick Start](#quick-start)
- [AI PM Workflow](#ai-pm-workflow)
- [Core Artifacts](#core-artifacts)
- [Readiness Model](#readiness-model)
- [Launch Gates](#launch-gates)
- [Engineering Delivery With GRIT](#engineering-delivery-with-grit)
- [Example Case Studies](#example-case-studies)
- [Current Repo Structure](#current-repo-structure)

## Why This Exists

AI product work has changed.

PMs building with AI are not only writing requirements for screens and workflows. They are defining:

- What job the AI performs.
- What the AI must never do.
- What data the system can use.
- What quality means.
- How output is evaluated.
- When humans must review or approve.
- What happens when confidence is low.
- How cost scales with usage.
- How launch risk is managed.
- How quality is monitored after release.

Many AI products fail in the space between a promising demo and a production workflow. The demo works. The product does not.

Common failure modes:

- The AI feature solves a weak or unclear problem.
- The PRD says "assistant" but does not define the AI job.
- Quality is judged by a few hand-picked examples.
- The team has no eval set or regression process.
- Users cannot inspect, correct, or override the AI.
- The system has no fallback for low-confidence outputs.
- Cost per workflow is discovered too late.
- Risk review happens after the product is built.
- Launch happens without observability.

AI PM Playbook exists to make those gaps visible before they become production failures.

## Who This Is For

Use this playbook if you are:

- A PM building AI features in SaaS, consumer, fintech, healthcare, education, devtools, marketplaces, or internal tools.
- A founder deciding which AI workflows are worth building.
- A Staff, Lead, or Group PM creating an AI product operating model.
- A product leader reviewing whether an AI roadmap is credible.
- A design, engineering, data, security, or legal partner who needs clearer AI product artifacts.

This playbook is especially useful when the product uses:

- LLMs.
- Agents.
- Retrieval augmented generation.
- AI copilots.
- AI workflow automation.
- AI summarization, extraction, ranking, scoring, classification, or generation.
- Human-in-the-loop review flows.
- AI systems that touch customer data, user decisions, business logic, or regulated workflows.

This playbook is not for:

- Prompt-only collections.
- Model rankings without product context.
- Pure research benchmarking.
- Full-stack AI app templates.
- Generic innovation theater.

## What This Playbook Helps You Do

AI PM Playbook helps you make better product decisions before, during, and after AI implementation.

| PM job | Playbook support |
| --- | --- |
| Decide whether an AI idea is worth building | AI Opportunity Brief |
| Define the AI's job clearly | AI PRD |
| Convert PM intent into build-ready work | Optional AI Build Brief |
| Define quality | AI Eval Plan |
| Make failure modes visible | AI PRD risk table and Launch Gate Checklist |
| Design human review | Human Review Workflow |
| Decide if the product can launch | Launch Gate Checklist |
| Track production behavior | Observability Plan |
| Understand unit economics | AI Cost Model |
| Run the product after launch | Observability Plan weekly review |

The goal is to replace:

```text
"This AI demo feels good."
```

with:

```text
"This AI workflow is ready for a limited pilot because problem fit, data readiness,
eval coverage, human review, fallback behavior, cost, and observability meet the
pilot gate. These three gaps must close before production launch."
```

## Quick Start

### 1. Start With The Opportunity

If you are about to build a demo, start with `docs/before-you-vibe-code.md`. It is the 10-minute preflight check before writing a PRD or opening an AI builder.

Use `templates/ai-opportunity-brief.md`.

Answer:

- What user problem are we solving?
- Why is AI appropriate?
- What is the smallest useful version?
- What happens if we do nothing?
- What existing workflow or product path could solve this without AI?

### 2. Write The AI PRD

Use `templates/ai-prd.md`.

Define:

- AI job.
- Inputs and outputs.
- User workflow.
- Autonomy level.
- Human review rules.
- Quality bar.
- Failure behavior.
- Observability requirements.

### 3. Create The Eval Plan

Use `templates/ai-eval-plan.md`.

Define:

- Golden examples.
- Quality rubric.
- Edge cases.
- Unacceptable outputs.
- Regression checks.
- Human review process.
- Launch threshold.

### 4. Complete The Launch Gate

Use `templates/launch-gate-checklist.md`.

Decide:

- Prototype only.
- Pilot candidate.
- Pilot ready with conditions.
- Limited production ready.
- Scale ready.
- Do not launch.

### 5. Review The Readiness Assessment

Read one of the example `readiness-assessment.yaml` files and compare the dimension scores, evidence, risks, next actions, and recommendation. The schema in `schema/` defines the structure if you want to validate or automate this later.

## AI PM Workflow

Every serious AI product moves through this loop.

```text
1. Pick the right opportunity
2. Prototype to validate (time-boxed, disposable)
3. Define the AI job
4. Design the user workflow
5. Specify data, model, and system requirements
6. Define evals and quality bars
7. Identify risks and mitigations
8. Model cost and business value
9. Set launch gates
10. Plan staged rollout (shadow, canary, cohort)
11. Instrument production behavior
12. Operate and improve after launch
```

Step 2 is deliberate: use a time-boxed prototype to learn what is possible before over-specifying the PRD. Prototypes reveal behavior. PRDs capture why the work matters, what quality means, and what the team has agreed to ship. You need both.

Each step creates or updates one artifact. If a meeting, document, or checklist does not help the team make a better product decision, skip it.

## Core Artifacts

### AI Opportunity Brief

Use this before writing a PRD.

Purpose:

Decide whether an AI idea is worth pursuing.

Must answer:

- What user problem does this solve?
- Who has this problem?
- How do they solve it today?
- Why is AI appropriate?
- Why is deterministic software insufficient?
- What is the smallest useful version?
- What existing product path, workflow, or code already solves this?
- What happens if we do nothing?
- What business outcome improves?
- What risks are already obvious?

Decision options:

- Pursue.
- Prototype.
- Defer.
- Reject.

### AI PRD

Use this once the opportunity is worth exploring.

Purpose:

Define the AI product clearly enough for engineering, design, data, and risk partners to build and review.

Required sections:

- Problem.
- Goals.
- Non-goals.
- Target users.
- Current workflow.
- Proposed workflow.
- AI job.
- Constraints and guardrails (runtime boundaries: input scope, prompt injection, grounding, action scope, safety, cost ceiling — each with a threshold and owner).
- Model requirements (model selection, token budgets, streaming, multi-model routing).
- System persona (tone, constraints, persona boundaries).
- Data provenance (sources, permissions, retention, regulatory constraints).
- Input contract.
- Output contract.
- Autonomy level.
- Agent tool boundaries (for agentic products: allowed tools, constraints, escalation).
- Example inputs and outputs (including rejection cases).
- Human review rules.
- Quality bar.
- Latency target.
- Cost constraint.
- Failure and fallback behavior.
- Observability requirements.
- Launch gates.
- Open questions.

The most important line in the PRD is the AI job:

```text
The AI [does what] using [inputs] to produce [outputs] for [user] inside
[workflow], subject to [constraints].
```

### AI Eval Plan

Use this before trusting model behavior.

Purpose:

Define what "good" means and how the team will measure it.

Required sections:

- Task definition.
- Eval scope (node, session, and system level for agentic products).
- Evaluation dataset.
- Golden examples.
- Quality rubric.
- Grading tiers (code-based, LLM-as-judge, human review).
- Non-deterministic eval strategy (multiple runs, variance tracking).
- Edge cases.
- Unacceptable failures.
- Automated checks.
- Regression plan.
- Online metrics.
- Data flywheel (production failures feed back into eval set).
- Launch threshold.
- Review cadence.

Minimum eval standard:

- One representative happy path.
- One common edge case.
- One unacceptable output.
- One safety or policy boundary.
- One regression case from a real failure once available.

Eval anti-patterns to watch:

- Evaluating on a golden set built from one model's outputs (reinforces that model's biases).
- Treating 100% pass rate as success (usually means the eval set is too easy).
- Grading agents on exact tool-call sequences instead of outcomes.
- Relying on a single eval run for non-deterministic outputs.
- Skipping integration tests at agent boundaries.

### Risks And Mitigations

Use the PRD risk table and launch gate before pilot and production launch.

Purpose:

Make AI product risk concrete, owned, and reviewable without creating extra artifact sprawl.

Useful risk categories:

- Incorrect output.
- Over-trust.
- Data leakage.
- Permission failure.
- Prompt injection.
- Unsafe autonomy.
- Regulatory exposure.
- Bias or unfair treatment.
- Cost spike.
- Silent degradation.

For agentic products, also consider agent-specific failure modes:

- Goal hijacking.
- Tool misuse.
- Identity abuse.
- Memory poisoning.
- Error cascading across steps.

### Human Review Workflow

Use this when the AI affects user decisions, customer communication, money, health, legal, identity, permissions, or irreversible actions.

Purpose:

Define when humans review, approve, correct, or override AI behavior.

Required sections:

- Review mode per action (in / on / after / no loop, with upgrade and downgrade triggers).
- Hard boundaries the AI must never cross.
- Reversible auto-actions and rollback.
- Required review points.
- Reviewer capacity and SLA.
- Guarding against rubber-stamping (automation bias).
- Review UI requirements.
- Escalation path.
- Audit trail.
- Feedback captured from review.

### Launch Gate Checklist

Use this before pilot, production, and scale-up.

Purpose:

Decide whether the AI product can move to the next release stage.

Gate areas:

- Product value.
- AI job definition.
- Data readiness.
- Eval readiness.
- UX and trust.
- Human review.
- Risk and compliance.
- Cost.
- Observability.
- Support.
- Post-launch owner.

### Observability Plan

Use this before any customer-facing launch.

Purpose:

Define what the team will monitor after launch.

Track:

- Adoption.
- Task completion.
- Accept rate.
- Edit rate.
- Reject rate.
- Retry rate.
- Escalation rate.
- User-reported issue rate.
- Latency.
- Cost per task.
- Cost per customer.
- Quality score.
- Regression failures.

Technical logs alone are not enough. The PM needs product-quality signals.

The observability plan also includes the weekly post-launch review: what changed, usage, quality, cost, latency, user feedback, incidents, top failure modes, product decisions, and next actions.

### AI Cost Model

Use this before scale.

Purpose:

Make AI unit economics visible before usage grows.

Inputs:

- Model or provider cost.
- Average input size.
- Average output size.
- Retrieval or tool cost.
- Cache hit rate.
- Expected tasks per user.
- Expected users per customer.
- Gross margin target.
- Pricing assumption.

Outputs:

- Cost per task.
- Cost per user.
- Cost per customer.
- Break-even usage.
- Sensitivity to heavy users.
- Agentic cost multiplier (for agent workflows, measure the added cost from tool calls, retries, and context accumulation).
- Multi-model routing savings (route simple tasks to cheaper models).

### Optional Templates

Use these when the team needs more ceremony or a tighter handoff:

- AI build brief: translate PM intent into scoped engineering work.
- AI PM review checklist: pressure-test roadmap, design, engineering, legal, or launch meetings.
- Prompt change record: review, test, roll out, and roll back production prompt changes.

## Evidence Hierarchy

Every readiness score, risk assessment, and launch gate decision depends on evidence. Not all evidence is equal. When claims conflict, higher-tier evidence wins.

| Tier | Source | Example | Weight |
| --- | --- | --- | --- |
| 1 | Measured data | Production metrics, A/B test results, eval scores from a labeled dataset | Highest |
| 2 | Direct user evidence | User interview transcripts, observed behavior in usability tests, support tickets | High |
| 3 | Structured analysis | Cost models with documented assumptions, competitive analysis with named sources | Medium |
| 4 | Stakeholder input | Verbal direction from leadership, sales team anecdotes, partner feedback | Medium-low |
| 5 | PM judgment | Team intuition, pattern matching from prior products, industry convention | Lowest |

Use this hierarchy when filling out any template that asks for evidence: readiness assessments, risk registers, eval plans, opportunity briefs, and decision records. Tag your evidence honestly. A readiness score backed by Tier 1 evidence is worth more than the same score backed by Tier 5.

When a Tier 4 or 5 claim drives a launch decision, flag it. The goal is not to eliminate judgment — it is to make clear when the team is relying on it so the decision can be revisited when harder evidence arrives.

When filling in readiness assessments, tag each piece of evidence with its tier using the shorthand `[T1]` through `[T5]`. This makes it immediately visible which claims are backed by data and which are assumptions. See the example readiness assessments for this convention in practice.

## Readiness Model

Readiness is scored across 11 dimensions.

Each dimension requires:

- Score from 0 to 5.
- Evidence (with source tier from the evidence hierarchy above).
- Risk.
- Owner.
- Next action.

### Score Scale

| Score | Meaning |
| --- | --- |
| 0 | Missing |
| 1 | Mentioned but undefined |
| 2 | Drafted but not validated |
| 3 | Defined with partial evidence |
| 4 | Launch-ready with strong evidence |
| 5 | Live, measured, owned, and improving |

### Readiness Levels

| Score | Level | Meaning |
| --- | --- | --- |
| Below 2.0 | Not ready | Do not build or launch yet |
| 2.0 - 2.69 | Prototype only | Explore internally |
| 2.7 - 3.29 | Pilot candidate | Worth preparing for pilot, but close blockers first |
| 3.3 - 3.69 | Pilot ready with conditions | Limited rollout with close review |
| 3.7 - 4.49 | Limited production ready | Controlled customer launch |
| 4.5 - 5.0 | Scale ready | Ready to expand with monitoring |

### Dimensions

| Dimension | PM question |
| --- | --- |
| Problem fit | Does AI solve a real user problem better than the current workflow? |
| Workflow fit | Does the AI fit into a workflow with review, correction, and fallback? |
| AI job definition | Is the AI task specific enough to evaluate and ship? |
| Data readiness | Is the required data available, permissioned, fresh, and reliable? |
| Eval readiness | Can the team measure quality before and after launch? |
| System behavior | Are model, retrieval, tools, latency, and fallback behavior specified? |
| Risk and safety | Are likely harms, misuse cases, and mitigations owned? For agents: are tool boundaries, goal hijacking, and error cascading addressed? |
| Regulatory readiness | Is the risk classification determined? Are data provenance, transparency, and compliance requirements met? |
| Cost and business case | Does the workflow have credible unit economics? For agents: is the agentic cost multiplier modeled? |
| Observability | Can the team see whether the AI is working in production? |
| Launch and operations | Is there a staged rollout and post-launch operating cadence? |

### Suggested Weights

| Dimension | Weight |
| --- | --- |
| Problem fit | 1.1 |
| Workflow fit | 1.1 |
| AI job definition | 1.2 |
| Data readiness | 1.2 |
| Eval readiness | 1.5 |
| System behavior | 1.0 |
| Risk and safety | 1.4 |
| Regulatory readiness | 1.3 |
| Cost and business case | 1.0 |
| Observability | 1.3 |
| Launch and operations | 1.2 |

Eval readiness is weighted highest because it is the most common gap between demo and production. Risk, regulatory readiness, observability, data, and launch operations are also heavily weighted because AI products degrade in real workflows. Regulatory readiness is weighted at 1.3 because AI-specific regulation, privacy law, and sector rules can materially change what is safe or legal to launch.

The readiness levels have narrow score ranges by design, which means a small scoring difference can shift the recommendation by a level. This is intentional — the score is a guide for structured discussion, not a bright line. When a score falls near a boundary, use the individual dimension scores and hard blockers to make the call. The healthcare intake example demonstrates this: a borderline score of 1.95 fell just below the "prototype only" threshold, but the team had enough problem definition to learn from a synthetic-data prototype, so the recommendation was elevated to "prototype only" with explicit conditions.

## Launch Gates

The readiness score is not a simple average. Some gaps block launch.

### Block Customer-facing Production If

- Eval readiness is below 3.
- No human review exists for high-impact or irreversible actions.
- No fallback path exists for low-confidence outputs.
- Observability is below 3.
- Data permissions are unclear.
- Cost per task is unknown for expected usage.
- User harm or compliance risks have no owner.
- There is no post-launch quality review cadence.
- Regulatory classification or compliance path is undetermined.
- No staged rollout plan exists (shadow mode, canary, or cohort-based ramp).
- No rollback mechanism is tested.

### Block Pilot If

- The AI job is not clearly defined.
- There is no minimum eval set or rubric for the pilot scope.
- The team cannot identify unacceptable outputs.
- No pilot success metric exists.
- No owner is assigned to review pilot failures.
- Low-confidence fallback behavior is missing for customer-facing or high-risk workflows.
- The team cannot observe accept, edit, reject, escalation, cost, and failure signals during the pilot.
- For agentic products: tool boundaries and escalation paths are not defined.

### Block Scale-up If

- Pilot quality metrics are not reviewed.
- Cost is materially above plan without a business decision.
- Users are bypassing, ignoring, or heavily correcting outputs.
- Support or incident volume is rising.
- Regression checks are not in place for major changes.
- No incident response process has been tested (at least one simulated incident).
- No near-miss capture process exists.

## Engineering Delivery With GRIT

[GRIT](https://github.com/zaidazmi/GRIT) is the recommended companion framework for AI-assisted engineering delivery.

AI PM Playbook and GRIT solve different parts of the same problem.

| Framework | Owns |
| --- | --- |
| AI PM Playbook | What gets built, why, what quality means, and when it is ready |
| GRIT | How AI-assisted engineering specifies, tests, implements, reviews, hardens, and ships |

GRIT is useful for PMs building with AI because AI product failure often happens in the gap between product intent and AI-generated implementation. A strong PRD can still fail if implementation happens from vague context, without failing tests, without adversarial review, or without a hardening pass.

### What AI PMs Should Borrow From GRIT

#### 1. Challenge The Premise

Before writing a PRD or build brief, answer:

```text
PROBLEM: What problem does this solve, for whom, and how do they solve it today?
SMALLEST: What is the smallest version that proves value?
EXISTS: Does this already exist in the product, workflow, or codebase?
NULL CASE: What happens if we do nothing?
```

#### 2. Use A Behavioral Contract

Before engineering starts, define:

- What the AI feature does.
- Inputs and outputs.
- Good, bad, and unacceptable examples.
- Edge cases.
- Non-goals.
- Human review rules.
- Eval requirements.
- Launch gates.
- Open questions.

#### 3. Require Tests And Evals Before Trust

For AI products, verification includes both software tests and product evals:

- Unit tests for deterministic logic.
- Integration tests for workflow behavior.
- Eval sets for model output quality.
- Safety tests for unacceptable outputs.
- Regression tests for previous failures.

If a bug or quality failure is not reproduced, the fix is not yet credible.

#### 4. Use Adversarial Review

Before launch, ask a fresh reviewer to attack:

- Spec ambiguity.
- Missing edge cases.
- Weak evals.
- Unsafe autonomy.
- Missing fallback behavior.
- Product risks not covered by implementation.
- Scope that quietly expanded beyond the PRD.

#### 5. Route Findings Back To The Right Artifact

| Finding | Update |
| --- | --- |
| Problem is unclear | Opportunity brief or PRD |
| Behavior is underspecified | AI PRD |
| Quality is unmeasured | Eval plan |
| Risk is unmanaged | Risk register |
| Implementation violates intent | Code |
| Launch criteria are weak | Launch gate checklist |

#### 6. Add A Hardening Pass

Before production launch, review:

- Rate limits.
- Timeouts.
- Fallback behavior.
- PII handling.
- Audit logging.
- Permission checks.
- Cost guardrails.
- Graceful degradation.
- Incident paths.
- Regression checks.

### When To Link Teams To GRIT

Link to [GRIT](https://github.com/zaidazmi/GRIT) when:

- AI agents are writing production code.
- The feature touches auth, payments, user data, agents, integrations, or business logic.
- The team uses Claude Code, Codex, Cursor, Windsurf, or similar tools for implementation.
- Multiple agents or workstreams are working on one feature.
- The team needs a repeatable review process for AI-generated pull requests.

Do not force GRIT for:

- Copy changes.
- Small documentation edits.
- Disposable prototypes.
- Low-risk UI polish with no behavior change.

## Example Case Studies

Examples are where the playbook becomes useful. They show concrete tradeoffs, not generic optimism.

The examples in this repo are synthetic but realistic. Names, dates, companies, metrics, and reviewers are illustrative. They are included to demonstrate how the artifacts should reason through product tradeoffs, not to claim real customer results.

### Customer Support Copilot

Why it belongs:

- Common AI workflow.
- Clear human review model.
- Strong need for evals and observability.
- Good example of grounding, citations, and cost.

What it demonstrates:

- AI drafts, human sends.
- Sources are visible.
- Low-confidence answers escalate.
- Agent edits become quality feedback.
- Launch recommendation is pilot candidate after eval, fallback, and observability blockers close.
- Week-2 post-launch review shows how pilot metrics turn into operating decisions.

### Sales Call CRM Assistant

Why it belongs:

- Shows workflow automation and structured output.
- Requires user trust and editability.
- Has privacy, consent, and data quality concerns.
- Easy to connect to business outcomes.

What it demonstrates:

- AI summarizes calls and suggests CRM updates.
- High-risk fields require approval.
- Commitments and next steps are grounded in transcript evidence.
- Success is measured by rep time saved and CRM accuracy.

### Healthcare Intake Assistant

Why it belongs:

- Shows high-risk product judgment.
- Forces strong boundaries.
- Demonstrates when not to launch.

What it demonstrates:

- AI collects structured intake information.
- It does not diagnose or recommend treatment.
- Escalation rules are explicit.
- Audit and consent requirements are clear.
- Recommendation may be "prototype only" until safety and compliance gates are met.

## Current Repo Structure

```text
ai-pm-playbook/
  README.md
  LICENSE
  ai-pm-playbook.md

  docs/
    before-you-vibe-code.md
    00-walkthrough.md
    01-eval-design.md
    02-agentic-products.md
    03-operating-ai-products.md
    04-launch-gates.md
    05-prompt-craft.md
    06-bad-to-good-ai-prd.md
    07-error-analysis.md
    08-artifact-flow-map.md
    09-agent-pm-starter-pack.md
    10-ai-native-pm-loop.md

  templates/
    ai-opportunity-brief.md
    ai-prd.md
    ai-eval-plan.md
    human-review-workflow.md
    launch-gate-checklist.md
    ai-observability-plan.md
    ai-cost-model.md
    optional/
      ai-build-brief.md
      ai-pm-review-checklist.md
      prompt-change-record.md

  examples/
    customer-support-copilot/
      README.md
      opportunity-brief.md
      prd.md
      eval-plan.md
      cost-model.md
      launch-gate.md
      post-launch-review-week-2.md
      readiness-assessment.yaml

    sales-call-crm-assistant/
      README.md
      opportunity-brief.md
      prd.md
      eval-plan.md
      launch-gate.md
      readiness-assessment.yaml

    healthcare-intake-assistant/
      README.md
      opportunity-brief.md
      prd.md
      eval-plan.md
      launch-gate.md
      readiness-assessment.yaml

  schema/
    readiness-assessment.schema.json
```

## License

MIT.
