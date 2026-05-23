# Launch gate: customer support copilot

## Summary

Product: Customer Support Copilot
Stage: Prototype (pre-pilot)
Assessment date: 2026-05-12
Assessor: Maya Patel, PM
Overall weighted score: 2.86 / 5.0
Recommendation: **Pilot candidate after blockers**

## Readiness assessment

### 1. Problem fit

**Score: 4 / 5**

Evidence:
- 4-week time study across 12 agents and 2,400 tickets confirms 38% of handle time spent on drafting
- Top 50 intents cover 62% of volume; top 10 cover 31%
- Template-based approach tried and failed (adoption dropped from 22% to 11%)
- Agent satisfaction surveys consistently cite repetitive drafting as a top frustration

Risks:
- The 38% figure is an average. Some agents draft faster. The benefit will be uneven across the team.
- Less useful for complex, low-volume tickets outside the top 50 intents

Next action: segment expected impact by intent tier to set realistic pilot expectations

Owner: PM

### 2. Workflow fit

**Score: 4 / 5**

Evidence:
- Clear human-in-the-loop model: AI drafts, agent reviews, agent sends
- Workflow integrates into the existing support platform (draft appears in the reply panel)
- Agent can accept, edit, reject, or escalate at every step
- No change to ticket routing, categorization, or escalation paths

Risks:
- If drafts are slow (>4s) agents may develop a habit of ignoring them and drafting manually, making the feature invisible
- Agents on high-pressure shifts may rubber-stamp drafts without reading them carefully

Next action: add a "draft is loading" indicator and measure time-to-first-interaction with the draft

Owner: Design

### 3. AI job definition

**Score: 4 / 5**

Evidence:
- AI job statement is specific and testable: "drafts support responses using approved KB articles for Tier 1 agents to review and send"
- Input contract, output contract, and autonomy level are defined
- Clear boundary: AI suggests, human decides and sends
- Scope limited to top 10 intents for v1

Risks:
- Multi-intent tickets (18% of volume) are acknowledged but handling is not fully specified
- Confidence threshold of 0.6 is a guess, not empirically validated

Next action: run the prototype against 50 multi-intent tickets and decide on a handling strategy before pilot

Owner: ML Lead

### 4. Data readiness

**Score: 3 / 5**

Evidence:
- Knowledge base exists with 400+ articles covering all supported intents
- Historical ticket data available for eval set creation (6 months, 100K+ tickets)
- Vector embedding pipeline for KB retrieval is functional in staging

Risks:
- 15% of KB articles are outdated based on a spot check. Outdated articles are the most likely source of factual errors.
- No automated freshness check or deprecation flag on KB articles
- Article quality is inconsistent. Some are clear and structured, others are rambling FAQs with buried answers.

Next action: audit and update KB articles for the top 10 intents before pilot. Flag deprecated articles in the retrieval index.

Owner: Support Lead + Engineering

### 5. Eval readiness

**Score: 2 / 5**

Evidence:
- Quality rubric drafted with 4 dimensions (factual accuracy, citation relevance, tone, completeness)
- 5 golden examples defined covering happy path, edge case, unacceptable output, safety boundary, and regression
- Automated checks specified (citation validity, PII detection, length bounds, confidence score presence)

Risks:
- No golden dataset built yet. The 5 examples are illustrative, not a scored eval set.
- No labeled reference responses from graders
- Regression suite has 5 cases. The target is 50 within 3 months, but the starting point is thin.
- Inter-rater reliability between graders is untested

Next action: build 100-example golden eval set with labeled reference responses. Run inter-rater reliability test with 3 graders on 20 examples.

Owner: ML Lead + Support Lead

### 6. System behavior

**Score: 3 / 5**

Evidence:
- Model selected (Claude Sonnet) with estimated token costs
- Retrieval pipeline functional in staging (vector search over KB articles)
- Latency targets defined (p50 <2s, p95 <4s, hard timeout 6s)
- Timeout behavior specified (show KB articles instead of draft)

Risks:
- Low-confidence fallback behavior is designed but not implemented. The prototype currently shows a draft regardless of confidence score.
- Safety trigger detection (self-harm, threats) is specified but not tested against adversarial inputs
- No load testing done. Latency under concurrent usage is unknown.

Next action: implement low-confidence fallback, test safety triggers against 20 adversarial examples, run load test at 2x expected concurrent usage

Owner: Engineering

### 7. Risk and safety

**Score: 3 / 5**

Evidence:
- Main risks identified: hallucinated policy claims, outdated KB citations, PII echo, safety-sensitive tickets
- Mitigation strategy defined for each: citation grounding, KB freshness audit, PII regex filter, safety trigger escalation
- Human review on every response is a strong backstop

Risks:
- No formal risk register with severity ratings and owners
- PII filtering relies on regex patterns, which will miss some formats
- Safety trigger detection has not been adversarially tested
- No process for handling incidents if a hallucinated claim reaches a customer

Next action: create formal risk register. Define incident response process for hallucination reports. Test PII filter against 50 examples with varied PII formats.

Owner: PM + Engineering

### 8. Regulatory readiness

**Score: 2 / 5**

Evidence:
- Customer-facing AI disclosure requirement identified
- PII handling risks listed in PRD and risk notes
- Human review required before any customer-facing message is sent

Risks:
- Prompt and output retention policy is not confirmed
- Customer-facing AI disclosure language has not been reviewed by legal
- Tenant data handling review is not complete

Next action: confirm disclosure, retention, and tenant data handling requirements before pilot

Owner: Legal + Security

### 9. Cost and business case

**Score: 3 / 5**

Evidence:
- Estimated cost per draft: $0.03 (based on Claude Sonnet pricing, ~1,500 input tokens, ~300 output tokens)
- Estimated monthly cost for full team (45 agents): under $2,000
- Expected business value: 1.6 minute reduction in drafting time per supported ticket, roughly 15% handle time reduction on supported intents

Risks:
- Cost estimate is based on assumed token counts, not measured. Retrieval-augmented prompts with multiple KB articles could push input tokens higher.
- Business case relies on handle time reduction, which has not been measured in practice
- No analysis of cost scaling if we expand beyond top 10 intents

Next action: measure actual token usage on 200 prototype runs. Model cost at 50-intent and full-coverage scenarios.

Owner: PM + Engineering

### 10. Observability

**Score: 2 / 5**

Evidence:
- Latency logging is live in staging
- API cost tracking is functional
- Metric definitions exist for accept/edit/reject/retry/escalation rates

Risks:
- Accept/edit/reject tracking is not implemented. The agent review UI exists but does not emit events.
- Citation click tracking is not implemented
- No dashboard exists. Metrics are defined on paper but not visible to the team.
- No alerting configured for any threshold

Next action: implement accept/edit/reject event logging. Build a dashboard with the 8 key online metrics. Configure alerts for reject rate and hallucination reports.

Owner: Engineering

### 11. Launch and operations

**Score: 2 / 5**

Evidence:
- Pilot group identified (8 agents on day shift)
- Pilot duration planned (2 weeks)
- Post-launch review cadence mentioned in the eval plan (weekly for month 1)

Risks:
- No written pilot plan with specific success criteria, rollback triggers, or escalation paths
- No agent training plan or materials
- No defined process for reviewing pilot results and making the go/no-go decision for production
- Post-launch quality review owner is not assigned

Next action: write pilot plan with success criteria, rollback triggers, and go/no-go decision process. Create 30-minute agent training session. Assign post-launch review owner.

Owner: PM + Support Lead

## Score summary

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Problem fit | 4 | 1.1 | 4.40 |
| Workflow fit | 4 | 1.1 | 4.40 |
| AI job definition | 4 | 1.2 | 4.80 |
| Data readiness | 3 | 1.2 | 3.60 |
| Eval readiness | 2 | 1.5 | 3.00 |
| System behavior | 3 | 1.0 | 3.00 |
| Risk and safety | 3 | 1.4 | 4.20 |
| Regulatory readiness | 2 | 1.3 | 2.60 |
| Cost and business case | 3 | 1.0 | 3.00 |
| Observability | 2 | 1.3 | 2.60 |
| Launch and operations | 2 | 1.2 | 2.40 |
| **Overall** | | **Total weight: 13.3** | **38.00 / 13.3 = 2.86 weighted avg** |

Weighted average: 2.86. The score is not rounded up because eval readiness, regulatory readiness, observability, and launch operations are below the pilot bar.

## Recommendation: pilot candidate after blockers

This product is a strong pilot candidate, but it is not ready to start the pilot today. The team should close the four pre-pilot blockers below, then run a limited pilot with close monitoring. It is not ready for production launch.

### Why not reject or prototype only

The problem is real and well-measured. The workflow fit is strong: AI drafts, human reviews, human sends. The AI job is specific enough to evaluate. These three things together mean the team should prepare a real pilot rather than keep exploring indefinitely. Agent review on every response limits the blast radius of quality issues once the pilot controls are in place.

Dropping to "prototype only" would be overly cautious given the strength of the problem evidence and the clear human review model. The team does not need more internal exploration to know this is worth trying with real agents on a narrow set of supported intents.

### Why not pilot today

Four gaps block the pilot:

1. **No golden eval set.** The rubric and golden examples exist, but the 100-example scored dataset does not. Without it, there's no baseline to measure quality against and no regression suite to catch degradation. This is the single biggest gap.

2. **No accept/edit/reject tracking.** The team cannot measure the most important product metric (did the agent use the draft?) without this instrumentation. Flying blind on adoption makes it impossible to know if the pilot is working.

3. **Low-confidence fallback is not implemented.** The design says "show KB articles instead of a draft when confidence is below 0.6." The prototype shows a draft every time. Without the fallback, low-confidence drafts will reach agents, get rejected, and erode trust in the tool.

4. **Regulatory and data handling review is incomplete.** The feature handles customer messages and may process PII. Before the pilot, the team needs legal and security sign-off on disclosure language, retention, and tenant data handling.

These four blockers are all closable within 2-3 weeks of focused work. None of them require rethinking the product. They are execution gaps, not strategy gaps.

### Blockers before pilot

1. Build 100-example golden eval set with labeled reference responses (owner: ML Lead, target: 2 weeks)
2. Implement accept/edit/reject event logging and build a basic dashboard (owner: Engineering, target: 1 week)
3. Implement low-confidence fallback behavior (owner: Engineering, target: 1 week)
4. Confirm disclosure, retention, and tenant data handling requirements (owner: Legal + Security, target: 1 week)

### Blockers before production

All pilot blockers, plus:

5. Pilot runs for at least 2 weeks with online metrics meeting targets
6. No confirmed hallucination reports during pilot
7. Agent feedback is net positive
8. Formal risk register with incident response process
9. 250-example eval set passes at pilot thresholds
10. Load testing completed at 2x expected concurrent usage
11. Safety triggers tested against adversarial inputs
