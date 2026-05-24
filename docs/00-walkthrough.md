# A week with the AI PM Playbook

This walkthrough follows Priya, a PM at a mid-stage B2B SaaS company, as she evaluates and specs an AI feature using the playbook artifacts in sequence. The company, product, and people are fictional. The workflow, tradeoffs, and decisions are realistic.

## Context

Priya's company sells a contract management platform to mid-market legal teams. The VP of Product wants to ship an AI feature that summarizes uploaded contracts and flags risky clauses. The CEO saw a demo at an offsite. Everyone is excited. Nobody has defined what "good" means.

Priya has one week before the roadmap review. She needs to walk in with a recommendation: build, prototype, or pass.

## Monday: the opportunity brief

Priya opens the [opportunity brief](../templates/ai-opportunity-brief.md) template. She resists the urge to jump into a PRD.

She fills in the problem: legal analysts spend 45 minutes per contract on initial review, and 60% of that time is spent locating standard clauses across inconsistent formats. She documents the current workflow step by step — upload, manual read-through, copy key terms into a spreadsheet, flag items for attorney review.

The hardest section is "Why AI, and why not deterministic software." She realizes that clause extraction from standardized templates could be handled by regex and rules. The AI is only needed for non-standard contracts where clause language varies. She narrows the scope: AI summarization for non-standard contracts only. Standard templates keep the existing rules-based extraction.

She marks the decision as **Prototype** — time-boxed to two weeks to test whether the model can reliably identify the 8 clause types that matter most to their customers.

> **What the playbook did:** forced Priya to articulate why AI is the right tool before anyone writes code. The narrowed scope — non-standard contracts only — would not have surfaced without the "why not deterministic software" prompt.

## Tuesday: the PRD

The prototype decision means Priya needs to define the AI job clearly enough for engineering to build a throwaway spike. She opens the [AI PRD](../templates/ai-prd.md).

The AI job statement takes three drafts:

> The AI summarizes non-standard contracts by extracting values for 8 defined clause types from uploaded PDFs, producing a structured clause report for legal analysts to review inside the contract workspace, subject to human approval before any clause status changes.

She sets the autonomy level to **Draft** — the AI produces output, the analyst reviews before anything happens. She fills in the input contract (PDF upload, max 50 pages, English only) and output contract (structured JSON with clause type, extracted value, source page, and confidence score).

The failure behavior section makes her think through what happens when the AI cannot find a clause. She decides: if the model has low confidence on a clause, it marks the field as "not found — manual review required" rather than guessing.

She skips the agent tool boundaries section — this is a single-turn extraction, not an agent.

> **What the playbook did:** the cross-reference line at the top ("Downstream: use this PRD to create the eval plan, risk register, and build brief") told Priya exactly which artifacts come next. The AI job statement format forced specificity — "8 defined clause types" instead of "summarizes contracts."

## Wednesday: the eval plan

Priya opens the [eval plan](../templates/ai-eval-plan.md) and immediately hits the hardest question: what does "good" look like?

She defines four golden examples:

- **Happy path:** a 12-page vendor agreement with clear indemnification language. The model should extract the indemnification clause accurately with high confidence.
- **Edge case:** a 40-page contract where the limitation of liability is split across two non-adjacent sections. The model should flag both locations.
- **Unacceptable output:** a contract with no non-compete clause. The model fabricates one, citing a page that contains unrelated terms. This is the highest-severity failure — an analyst acting on a fabricated clause could advise a client incorrectly.
- **Safety boundary:** a contract that contains employee PII (social security numbers in an exhibit). The model should extract clause data without reproducing PII in the output.

She sets the launch threshold: 90% extraction accuracy on the 8 clause types across a 50-contract golden set, zero fabricated clauses.

For grading, she uses tiered evaluation: code-based checks for output schema compliance and PII detection, LLM-as-judge for extraction quality on a 1-5 rubric, human review for the first 20 contracts to calibrate the automated graders.

> **What the playbook did:** the four required golden example types (happy path, edge case, unacceptable output, safety boundary) gave Priya a minimum viable eval in one sitting. Without the template, she would have built 50 happy-path examples and missed the fabrication failure mode entirely.

## Thursday: risk register and cost model

Priya opens the risk table in the [AI PRD](../templates/ai-prd.md#risks-and-mitigations) in the morning. She fills in the top risks:

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Fabricated clause | High | Zero-tolerance eval check, human review on every output |
| PII in output | High | Output-side PII filter, no raw text passthrough for exhibits |
| Over-trust | Medium | Confidence scores visible, "not found" for low-confidence clauses |
| Silent degradation | Medium | Weekly sample review of 20 outputs post-launch |

She uses the [evidence hierarchy](../ai-pm-playbook.md#evidence-hierarchy) to tag her risk mitigations honestly. The fabrication risk is backed by Tier 1 evidence (she measured 3 fabrication cases in 15 prototype runs). The over-trust risk is Tier 5 — PM judgment based on patterns from other products.

In the afternoon, she opens the [cost model](../templates/ai-cost-model.md) and works through the numbers. A 15-page non-standard contract averages about 18,000 input tokens (the contract text plus the system prompt with clause definitions and few-shot examples). Output is roughly 1,500 tokens for the structured clause report. Using a Sonnet-class model at $3 per million input tokens and $15 per million output tokens, the cost per extraction is $0.077. Her average customer processes 200 contracts per month across 5 analysts. Monthly AI cost per customer: $15.40. Against a $500/month contract price, that is 3.1% of revenue — well within margin targets.

She runs the sensitivity analysis: if contracts average 40 pages instead of 15, input tokens grow to roughly 48,000 and cost per extraction hits $0.17. Monthly cost per customer jumps to $34, or 6.8% of revenue. Still viable, but she flags it as a monitoring trigger and adds a cost alert at $50/customer/month.

> **What the playbook did:** the evidence hierarchy made Priya label her over-trust mitigation as judgment rather than fact. When she presents Thursday's work, stakeholders can see which risks are backed by data and which are assumptions that need validation.

## Friday: launch gate and recommendation

Priya opens the [launch gate checklist](../templates/launch-gate-checklist.md) and fills in Gate 1 (pilot entry). She scores each criterion against the work she has done this week.

Two items fail: the golden eval set has only 15 examples (she needs 50), and observability is not instrumented. She marks the gate as **Hold** with two conditions: complete the eval set and wire up accept/edit/reject tracking before starting the pilot.

She documents the recommendation in the [launch gate checklist](../templates/launch-gate-checklist.md): prototype approved, pilot blocked until eval and observability gaps close.

The reversal condition: "If the 50-contract eval shows accuracy below 80% on any of the 8 clause types, revisit whether AI extraction is the right approach for non-standard contracts."

> **What the playbook did:** the launch gate gave Priya a structured way to say "not yet" with evidence. Instead of walking into the roadmap review with "I think we need more time," she walks in with two specific blockers, a cost model, a risk register, and a reversal condition that tells the team exactly what would change her mind.

## What Priya walks into the roadmap review with

Five artifacts, built in five days:

1. **Opportunity brief** — why AI, why not rules, and the narrowed scope
2. **PRD** — the AI job, input/output contracts, autonomy level, failure behavior
3. **Eval plan** — 4 golden examples, quality rubric, launch threshold
4. **Risk register** — 4 risks with severity, mitigations, and evidence tiers
5. **Decision record** — prototype approved, pilot conditions, reversal trigger

She did not build a slide deck. She did not write a strategy memo. She built the artifacts that the team needs to make a decision and to build the product if they say yes. The optional [build brief](../templates/optional/ai-build-brief.md) comes next — once the pilot gate conditions are met and engineering is ready to start, Priya will translate the PRD and eval plan into a scoped engineering handoff.

The VP of Product reads the opportunity brief, sees the "non-standard contracts only" scope, and says: "I assumed we'd do all contracts." Priya shows the "why not deterministic software" section. Standard contracts are already handled by rules. The AI adds value only where clause language varies. The VP agrees.

The CEO asks about cost. Priya shows the cost model: $15.40/customer/month, 3.1% of revenue, viable even at 3x the expected contract length.

Engineering asks when they can start. Priya points to the launch gate: after the eval set is complete and observability is wired up. Two weeks, not two months.

The roadmap review ends with a clear plan, shared understanding of the risks, and a reversal condition everyone agreed to. No one had to guess what "good" means.
