# Observability for AI products

> **The failure this prevents:** the AI degrades gradually and nobody notices. Accept rates drop, users quietly stop trusting the feature, and adoption declines with no clear cause. By the time someone investigates, months of trust have been lost. This guide defines the product-quality signals that catch degradation before users give up.

## Contents

- [Two categories of signals](#two-categories-of-signals)
- [Semantic drift detection](#semantic-drift-detection)
- [Alert thresholds](#alert-thresholds)
- [Review cadence](#review-cadence)
- [Trace review](#trace-review)
- [Dashboard design](#dashboard-design)
- [Tools](#tools)
- [The gap nobody has filled](#the-gap-nobody-has-filled)
- [Setting up observability before launch](#setting-up-observability-before-launch)
- [What to do when metrics move](#what-to-do-when-metrics-move)
- [Next steps](#next-steps)

Technical logs tell you what happened. Observability tells you whether your product is working. For AI products, these are not the same thing.

A system can return 200 OK on every request while producing outputs that users reject, ignore, or work around. Without product-quality signals, you are flying blind. You will not know your AI is degrading until users stop using it or start complaining, and by then you have lost trust that takes months to rebuild.

## Two categories of signals

AI product observability splits into product signals and system signals. Most engineering teams set up system signals by default and stop there. PMs need to push for product signals because nobody else will.

### Product signals

These measure whether the AI is delivering value to users.

**Accept rate**: percentage of AI outputs that users accept without modification. This is your top-line quality metric. If accept rate drops from 72% to 65% over two weeks, something changed and you need to investigate.

**Edit rate**: percentage of outputs that users accept after modifying them. High edit rate means the AI is directionally useful but not accurate enough to use as-is. Track what users edit to find systematic gaps.

**Reject rate**: percentage of outputs users explicitly discard. Distinguish between "user clicked reject" and "user ignored the output entirely." The second is worse because it means the feature is becoming invisible.

**Retry rate**: how often users regenerate or re-request after seeing an output. High retry rate means the AI is unreliable. Users learn to double-check by asking again, which doubles your cost and signals low trust.

**Escalation rate**: how often the AI hands off to a human or the user bypasses the AI to reach a human. Some escalation is expected. Rising escalation rate means the AI is failing more often.

Track these per feature, per user segment, and over time. Aggregate numbers hide problems. If your overall accept rate is 75% but enterprise users are at 55%, you have an enterprise quality problem that the aggregate obscures.

### System signals

These measure whether the infrastructure is healthy.

**Latency**: time from request to response. For interactive features, anything over 3 seconds feels broken. For background processing, latency matters less but should still be tracked for anomalies.

**Cost per request**: total cost including tokens, tool calls, and compute. Track this at the feature level, not just the account level. A cost spike on one feature should not be hidden by stable costs elsewhere.

**Error rate**: percentage of requests that fail (API errors, timeouts, malformed responses). Even 2% error rate on a high-volume feature means hundreds of users per day hitting failures.

**Token usage**: input and output tokens per request. Token usage creeping up over time usually means context is growing (longer conversations, more retrieved documents) and needs attention.

## Semantic drift detection

Models do not degrade the way traditional software does. They do not throw errors. They silently change behavior.

Semantic drift is when the model's outputs shift in meaning, style, or quality without any change on your end. This happens when providers update models, when your RAG corpus changes, or when user input patterns shift.

Detection approaches:

- Run your eval set weekly against production. Compare scores to your baseline. Any sustained drop is drift.
- Embed a sample of production outputs and track the distribution over time. If the embedding distribution shifts, the outputs are changing.
- Monitor the vocabulary and structure of outputs. If responses suddenly get longer, shorter, or use different phrasing patterns, investigate.

Drift is subtle. A 2% weekly decline in accuracy compounds to an 18% decline over ten weeks. Catch it early.

## Alert thresholds

Set alerts for:

- Accept rate drops below X% (start with 10% below your baseline)
- Error rate exceeds 2% sustained over 1 hour
- P95 latency exceeds your target by 50%
- Cost per request exceeds 2x your baseline
- Retry rate exceeds 15%

The specific numbers depend on your product. The point is to set them before launch, not after the first incident. If you wait until something breaks to figure out what "broken" means, you are too late.

Avoid alert fatigue. Five well-chosen alerts that fire when something is genuinely wrong are better than fifty that fire constantly. Every alert should have a documented response: who gets paged, what they check first, and what actions they can take.

## Review cadence

First two weeks after launch: daily review of all signals. You are establishing baselines and catching early problems.

Weeks 3-8: three times per week. You are watching for drift and edge cases that did not appear in testing.

After week 8: weekly review unless metrics indicate a problem. Include a monthly deep dive where you sample 50-100 production outputs and grade them manually against your rubric.

After any model upgrade or prompt change: return to daily review for one week.

## Trace review

Dashboards tell you where to look. Traces tell you what happened.

PMs should review a sample of traces on a regular cadence, especially during prototype, pilot, and the first month after launch. A useful trace links the user input, retrieved context, tool calls, model output, system actions, and user response. Without that end-to-end view, the team can see that quality dropped but not why the product experience broke.

In the first pass, do not start with root-cause debugging. Read the trace and write short notes on product failures:

- Did the AI answer the user's actual intent?
- Did it use the right retrieved context?
- Did it call the right tool?
- Did it take an action twice or fail to modify an earlier action?
- Did it format the response correctly for the channel?
- Did it hand off to a human when the workflow required it?
- Did the user accept, edit, retry, abandon, or escalate?

Then group those notes into error categories and feed them back into the eval plan. This is the data flywheel in practice: production traces reveal failure modes, failure modes become eval cases, eval cases prevent regressions.

## Dashboard design

PMs and engineers need different dashboards.

The PM dashboard should show:

- Accept/edit/reject rates over time, by feature
- Cost per feature per week, with trend
- Escalation rate
- Top reject reasons (if users provide feedback)
- Eval scores from the most recent automated run

The engineering dashboard should show:

- Latency percentiles (p50, p95, p99)
- Error rates by type
- Token usage per request
- Model version and prompt version in use
- Infrastructure health (queue depth, cache hit rate)

Do not try to put everything on one dashboard. A dashboard that shows everything communicates nothing.

## Tools

**Langfuse** is the most complete open-source option. It provides tracing, cost tracking, eval integration, and prompt versioning in one platform. The trace view is genuinely useful for debugging individual requests. Cost tracking at the feature level is what makes it PM-relevant.

**LangSmith** is LangChain's observability platform. Strong tracing and eval integration. Tightly coupled to the LangChain ecosystem, which is a benefit if you use LangChain and a limitation if you do not.

**Arize** focuses on ML observability broadly, including drift detection and performance monitoring. More enterprise-oriented. Good if you need to monitor both traditional ML models and LLMs in one platform.

**Helicone** is the simplest to set up. It acts as a proxy for your LLM calls and captures cost, latency, and usage data with minimal code changes. Good for getting basic observability quickly. Less depth than Langfuse or Arize for advanced analysis.

## The gap nobody has filled

Many teams still lack a PM-friendly dashboard that connects cost data to feature-level ROI. You can often see that Feature A costs $12K/month and Feature B costs $3K/month, but connecting that to revenue impact, user retention, or task completion rate usually requires manual analysis.

This means PMs need to build the business case for AI features by stitching together data from multiple sources. It is tedious but necessary. The PM who can show "$12K/month in API costs generates $180K/month in retained revenue" wins every budget conversation.

## Setting up observability before launch

Do not wait until the product is live to add observability. Instrument during development and use the pilot phase to validate your signals.

Before pilot:

- Define the 5-8 metrics you will track (mix of product and system signals)
- Set up basic tracing so you can inspect individual requests end-to-end
- Establish baseline values from your eval runs

Before limited production:

- Build the PM dashboard with accept rate, cost, and escalation trends
- Set alert thresholds based on pilot baselines
- Confirm that cost tracking is per-feature, not just per-account
- Test the alerting pipeline (trigger a test alert and confirm it reaches the right person)

Before scale:

- Validate that dashboards remain performant at production volume
- Confirm drift detection is running on a schedule
- Set up weekly automated eval runs against the golden set
- Ensure you can slice all metrics by customer, user segment, and time period

Adding observability after launch is significantly more expensive than building it in from the start — you are retrofitting instrumentation into a running system while simultaneously investigating the problems that instrumentation would have caught. The period between launch and observability is the period where problems go undetected.

## What to do when metrics move

Metrics will move. The question is whether the movement signals a real problem or normal variance.

Rules of thumb:

- A one-day drop in accept rate is noise. A three-day sustained drop is a signal. Investigate.
- A sudden latency spike is usually infrastructure. A gradual latency increase is usually growing context windows.
- Cost per request creeping up by 5-10% over a month probably means prompt or context growth. Check token usage trends.
- Retry rate increasing while accept rate holds steady means users are getting acceptable results but having to work harder. This is a UX problem.

When a metric triggers an alert, the response is: identify the change, correlate with other metrics, check whether a recent deployment or model update explains it, and decide whether to act or monitor.

## Next steps

- Define your metrics, alert thresholds, and dashboard layout using the [Observability Plan template](../templates/ai-observability-plan.md).
- After launch stabilizes, capture lessons and metric baselines in a [Post-Launch Review](../templates/post-launch-review.md).
