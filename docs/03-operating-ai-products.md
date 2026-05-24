# Operating AI products

> **The failure this prevents:** the AI works in a demo but fails as a product. Costs creep up, users rubber-stamp risky outputs, quality drifts, and nobody notices until trust is already damaged. This guide covers the operating system PMs need before pilot, production, and scale.

## Contents

- [The operating question](#the-operating-question)
- [Human control](#human-control)
- [Safety and governance](#safety-and-governance)
- [Observability](#observability)
- [Cost and unit economics](#cost-and-unit-economics)
- [The weekly operating loop](#the-weekly-operating-loop)
- [Stage gates](#stage-gates)
- [Next steps](#next-steps)

AI product management does not end when the model produces a good answer. A vibe-coded prototype can make the AI feel more capable than the product actually is. The real work is deciding when the system can act, who reviews it, what must never happen, how the team detects degradation, and whether the economics still work at scale.

The PM should be able to answer four operating questions before launch:

1. Who controls the AI when stakes are high?
2. What risks are blocked, reviewed, or monitored?
3. What signals prove the product is working or degrading?
4. What does each successful task cost?

## The operating question

Every AI workflow needs a clear operating posture:

| Area | PM decision | Artifact |
|------|-------------|----------|
| Human control | Which actions require approval, review, undo, or escalation? | [Human Review Workflow](../templates/human-review-workflow.md) |
| Safety | What can go wrong, how bad is it, and who owns mitigation? | [Risk Register](../templates/ai-risk-register.md) |
| Observability | Which product and system signals tell us whether the AI is working? | [Observability Plan](../templates/ai-observability-plan.md) |
| Cost | What is cost per task, user, and customer at baseline, 3x, and 10x usage? | [Cost Model](../templates/ai-cost-model.md) |
| Launch | Can this move to pilot, production, or scale with evidence? | [Launch Gate Checklist](../templates/launch-gate-checklist.md) |

If one of these areas is missing, the product is not ready for customer-facing launch. A strong demo does not compensate for missing control, missing monitoring, or unknown cost.

## Human control

Human-in-the-loop is not a safety slogan. It is the difference between "the LLM can generate this" and "the product is allowed to put this in front of a user or take action on it."

PMs who build quickly with AI can get pulled into a dangerous shortcut: the model handles five happy-path examples beautifully, so the team treats the workflow as launch-ready. That is not product readiness. LLMs are persuasive even when they are wrong, and vibe-coded flows often skip the unglamorous parts: review queues, audit trails, fallback states, escalation paths, permission checks, and post-launch monitoring.

The human loop protects three things:

- **Users:** someone accountable catches errors before they affect money, health, legal exposure, identity, access, safety, or external communication.
- **The business:** reviewers prevent avoidable incidents, policy violations, customer trust loss, and regulatory surprises.
- **The product:** edits, rejects, and escalations become the data that improves evals, prompts, retrieval, workflow design, and launch decisions.

The goal is not to keep humans in every workflow forever. The goal is to earn autonomy with evidence. Start with human control where consequences matter, measure what humans correct, and only reduce review when evals and production signals show the AI is reliable in the real workflow.

Choose the review mode by action, not by product:

| Mode | Use when |
|------|----------|
| Human-in-the-loop | The action is customer-facing, regulated, financial, legal, health-related, irreversible, or low-confidence. |
| Human-on-the-loop | The AI can act, but the action is reversible, observable, and humans can intervene quickly. |
| Human-after-the-loop | The action is low-risk and humans review samples, incidents, and metrics after the fact. |
| No human loop | The action is low-risk, reversible, well-tested, and monitored. |

Require human review for irreversible actions, external communication, money movement, health or safety decisions, legal exposure, identity, permissions, or anything where a user would reasonably expect a human to be accountable.

Do not route production decisions from raw LLM self-confidence. Confidence scores must be calibrated against human judgment on your own data. Start stricter, measure, then relax review only where evals and production signals prove reliability.

Ask this before shipping any AI-generated output or action:

- If the AI is wrong, who notices before the user is harmed?
- Can the reviewer see the evidence needed to make a fast, correct decision?
- Can the user or reviewer undo the action?
- Are reviewer edits captured and fed back into evals?
- What happens when the review queue is overloaded?

If these answers are missing, the product should stay in prototype, internal pilot, or human-only mode.

Design review so humans can actually do the job:

- Show the AI output beside the user input, retrieved evidence, tool calls, and prior context.
- Let reviewers approve, edit, reject, or escalate in one place.
- Capture reviewer edits and reasons so corrections feed back into evals.
- Measure review time, approval rate, edit rate, and canary detection.

Watch for review theater. If complex outputs are approved in under 10 seconds, approval rate is above 98%, reviewers never edit, or feedback is always blank, the human loop is probably not providing the safety guarantee the launch plan assumes.

## Safety and governance

Safety is a product requirement. The PM does not need to be legal counsel, but the PM does need to know the risk tier, the review path, and the product behavior required to reduce harm.

Plan for these failure modes:

- Incorrect output: evals, confidence thresholds, review, and fallback.
- Over-trust: UX friction, visible uncertainty, and review before high-stakes actions.
- Data leakage: permission checks, tenant isolation, redaction, and audit trails.
- Prompt injection: input filtering, instruction hierarchy, output validation, and limited tool scope.
- Unsafe autonomy: tool permissions, action boundaries, rollback, and escalation.
- Bias or uneven quality: segmented evals and production monitoring.
- Regulatory exposure: legal mapping before product definition is complete.

Before any customer-facing release, confirm:

- Eval suite passes at the target threshold.
- Guardrails are live and tested.
- Human review is operational where required.
- Audit logging captures input, output, actions, reviewer, timestamp, and outcome.
- Legal/security reviewed data use, disclosure, retention, and compliance needs.
- Incident response and rollback are documented and tested.

Red team the product before every stage transition. For pilot-stage products, three people spending half a day trying to break the workflow is enough to find useful failures. For high-risk production launches, consider external review.

## Observability

Technical logs tell you whether the system ran. AI observability tells you whether the product is still useful, trusted, safe, and affordable.

Track product signals:

- Accept rate: users accept output without modification.
- Edit rate: users accept after modifying.
- Reject or ignore rate: users discard or stop engaging.
- Retry rate: users regenerate, re-ask, or work around the AI.
- Escalation rate: the workflow routes to a human or the user bypasses AI.
- User-reported issue rate: complaints, flags, and support tickets.

Track system signals:

- Latency by p50, p95, and p99.
- Error and timeout rate.
- Token usage per request.
- Cost per request, feature, customer, and account.
- Model, prompt, retrieval, and tool versions.

Aggregate metrics hide product failures. Slice by customer, user segment, workflow, intent, geography, and model/prompt version. If overall accept rate is 75% but enterprise users are at 55%, you have an enterprise quality problem.

Set alert thresholds before launch:

- Accept rate drops materially below baseline.
- Error rate exceeds the agreed threshold.
- P95 latency breaches the product target.
- Cost per request exceeds the baseline multiple.
- Retry, reject, or escalation rate rises for multiple days.

Dashboards point you to the problem. Traces explain it. A useful trace shows the user input, retrieved context, tool calls, model output, system action, and user response. Review traces regularly and turn recurring failures into eval cases.

## Cost and unit economics

AI products have variable cost per use. Every model call, retrieved context, tool call, retry, and long conversation can increase cost.

Model three numbers:

- Cost per task: tokens, tool calls, retries, infrastructure, and human review if required.
- Cost per user per month: average tasks per user multiplied by cost per task.
- Cost per customer per month: aggregate usage across the account.

Run baseline, 3x, and 10x scenarios. If the 10x scenario breaks margin, pricing, or infrastructure, decide before scale how the product will constrain usage or reduce cost.

Common surprises:

- Traffic spikes multiply API spend immediately.
- Agent loops can create hundreds of calls from one stuck task.
- Long conversations grow context windows and cost.
- RAG pipelines can waste money by re-embedding unchanged documents.
- Human review and compliance work are real operating costs.

Product levers matter:

- Cache stable prompts and repeated answers.
- Route simple tasks to cheaper models.
- Limit output length when the product only needs a label or short answer.
- Batch non-interactive work.
- Avoid unnecessary regeneration.
- Set cost ceilings, rate limits, and circuit breakers.

Include cost targets in the PRD alongside quality targets. "Less than $0.05 per completed task at pilot quality" is clearer than "keep cost low."

## The weekly operating loop

After launch, run a weekly AI product review:

1. Review product signals: accept, edit, reject, retry, escalation, complaints.
2. Review system signals: latency, errors, cost, token usage, version changes.
3. Inspect traces behind any metric movement.
4. Label new failure modes and add them to the eval set.
5. Decide whether to continue, hold expansion, roll back, or change the workflow.

Use tighter cadence during launch:

- First two weeks: daily signal review.
- Weeks 3-8: three times per week.
- After week 8: weekly, plus monthly trace sampling.
- After model, prompt, retrieval, or tool changes: daily review for one week.

## Stage gates

Block pilot if:

- The AI job is unclear.
- There is no eval set or rubric for the pilot scope.
- Human review is required but undefined.
- Observability cannot track accept, edit, reject, escalation, cost, and failure signals.
- Low-confidence fallback is missing for customer-facing or high-risk workflows.

Block production if:

- Eval readiness is below launch threshold.
- Data permissions, legal, security, or regulatory path is unclear.
- Human review is not operational for high-impact actions.
- No rollback, incident response, or audit trail exists.
- Cost per task is unknown at expected usage.

Block scale if:

- Pilot metrics were not reviewed.
- Cost is materially above plan.
- Users are bypassing, ignoring, or heavily correcting outputs.
- Regression checks are missing for model, prompt, retrieval, or tool changes.
- No near-miss or incident process is running.

## Next steps

- Define control points in the [Human Review Workflow template](../templates/human-review-workflow.md).
- Track risks and owners in the [Risk Register template](../templates/ai-risk-register.md).
- Set production signals with the [Observability Plan template](../templates/ai-observability-plan.md).
- Model economics with the [AI Cost Model template](../templates/ai-cost-model.md).
- Make stage decisions with the [Launch Gate Checklist template](../templates/launch-gate-checklist.md).
