# AI product canvas

Use this for a 30-60 minute workshop before writing a full opportunity brief or PRD. The canvas should expose whether the idea is coherent enough to pursue, prototype, or stop.

**Output:** pursue, prototype, defer, or reject.

## 1. User and problem

- Target user:
- Workflow where the problem happens:
- Current workaround:
- Cost of the problem today: <!-- time, money, errors, missed revenue, risk -->

## 2. Why AI

- What requires prediction, generation, classification, extraction, or judgment?
- Why rules, forms, search, or normal automation are insufficient:
- Simplest non-AI alternative:

## 3. AI job

> The AI [does what] using [inputs] to produce [outputs] for [user] inside [workflow], subject to [review or safety rule].

- Inputs:
- Outputs:
- Explicitly out of scope:

## 4. Human control

| AI action | HITL mode | Reviewer or monitor | Why this mode |
|-----------|-----------|---------------------|---------------|
|           | <!-- in / on / after / none --> | | |

HITL modes:

- **Human-in-the-loop:** human approval before output or action takes effect.
- **Human-on-the-loop:** AI acts, humans monitor and intervene when needed.
- **Human-after-the-loop:** humans review samples, incidents, or aggregate trends after the fact.
- **No human loop:** only for low-risk, reversible, well-measured actions.

## 5. Data and system behavior

- Data sources:
- Data quality concerns:
- Retrieval or tool dependencies:
- Fallback when data is missing, stale, or low confidence:

## 6. Evals

- Golden set source:
- Quality criteria:
- Safety or boundary criteria:
- Failure modes to test first:

## 7. Risk and launch

- Highest-severity risk:
- Legal, security, privacy, or compliance concern:
- What would make this a "do not launch" decision?
- Smallest safe release stage: <!-- prototype / pilot / limited production -->

## 8. Cost and business case

- Expected usage:
- Cost per task target:
- Agent/tool cost ceiling if relevant:
- Business metric this should improve:

## Decision

- [ ] Pursue: write the opportunity brief and PRD
- [ ] Prototype: time-box a spike to answer the unknowns
- [ ] Defer: revisit when evidence or timing changes
- [ ] Reject: do not pursue because <!-- reason -->

Open questions:

- 
