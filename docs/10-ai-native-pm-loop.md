# The AI-native PM loop

> **The failure this prevents:** the PM uses AI builders to create fast demos but keeps doing product work the old way. They ship faster, but they do not learn faster. AI-native PMs use agents, traces, evals, and human judgment to turn product taste into a repeatable improvement loop.

## Contents

- [What changes for PMs](#what-changes-for-pms)
- [The loop](#the-loop)
- [Start with an internal PM agent](#start-with-an-internal-pm-agent)
- [Trace everything](#trace-everything)
- [Build evals from traces](#build-evals-from-traces)
- [Calibrate PM taste](#calibrate-pm-taste)
- [Gate self-improvement](#gate-self-improvement)
- [Two-hour weekend exercise](#two-hour-weekend-exercise)
- [Next steps](#next-steps)

## What changes for PMs

When code gets cheaper, product taste matters more. The AI-native PM advantage is not that the PM becomes a full-time engineer. It is that the PM can move from user pain to working prototype to trace review to eval-driven improvement without waiting weeks between each step.

The best AI PMs are not just writing better PRDs. They are creating faster learning systems around the product.

The modern AI PM should be able to:

- Build or direct a small agent for a real workflow.
- Inspect traces to understand what the agent actually did.
- Turn repeated failures into eval cases.
- Calibrate evals with human judgment.
- Decide whether to improve the agent, the eval, the workflow, or the product scope.
- Add human review gates before any self-improving loop affects users.

This is product taste made observable.

## The loop

Use this loop for internal agents, prototype agents, and production AI workflows:

```text
1. Build the smallest useful agent or AI workflow.
2. Trace every meaningful step.
3. Review traces and label failures.
4. Convert repeated failures into evals.
5. Calibrate evals against human labels.
6. Improve the agent, prompt, retrieval, tool use, or workflow.
7. Re-run evals and inspect new traces.
8. Repeat with human review at every risky change.
```

The point is not to automate PM judgment away. The point is to give PM judgment more data, faster feedback, and a tighter path from observation to product decision.

## Start with an internal PM agent

Before shipping an agent to users, build one for your own PM workflow. Pick a repetitive job that consumes time every week:

- Summarizing GitHub issues, support tickets, or community feedback.
- Clustering user interview notes.
- Drafting release-note inputs from merged PRs.
- Scoring feature requests by pain, frequency, severity, and business impact.
- Finding traces where users rejected, edited, retried, or escalated AI output.

The output should be a decision artifact, not a novelty:

- Top user pain points.
- Top risks or bugs.
- Priority report.
- Failure categories.
- Suggested eval cases.
- Launch blocker summary.

Example weekly PM agent report:

```text
1. Top 5 user pain points
2. Top 5 bugs or risks
3. Repeated feedback themes
4. Suggested eval cases
5. Recommended next product decisions
```

If the agent cannot make your internal work meaningfully better, it is probably not ready to automate user-facing work.

## Trace everything

An agent report is not enough. PMs need to see how the agent reached it.

A PM does not need to instrument every span personally, but they should know what a useful trace must show.

A useful trace shows:

- Input source: issue, ticket, call transcript, user action, or product event.
- Retrieved context: documents, examples, prior conversations, data rows.
- Tool calls: search, database reads, writes, API calls, workflow actions.
- Intermediate decisions: classification, score, route, confidence, priority.
- Final output: report, draft, action, recommendation, or escalation.
- Human/user response: accepted, edited, rejected, retried, escalated, ignored.

Without traces, you can only judge the final answer. With traces, you can see whether the product failed because retrieval was bad, the scoring rule was wrong, the prompt ignored a constraint, the tool call failed, or the eval misunderstood the task.

## Build evals from traces

The best evals come from actual behavior. Start from traces whenever possible.

Trace-first eval design:

1. Sample traces from prototype or production behavior.
2. Label where the output was good, bad, or questionable.
3. Group failures into product-specific categories.
4. Pick the failures that are frequent, severe, or strategically important.
5. Write evals for those failures.
6. Add representative traces to the golden set.

For an internal priority agent, useful evals might include:

- Priority accuracy: did the agent score the issue the way a PM would?
- Groundedness: did the report cite real issues, tickets, or traces?
- Actionability: did the recommendation include a clear product next step?
- Recency handling: did recent critical issues outweigh stale low-impact requests?
- Bug severity: did customer-impacting bugs rank above nice-to-have features?

A first-pass "vibe eval" generated by an LLM can be useful to start the loop. It is not the finish line. Treat it as a draft that needs human calibration.

## Calibrate PM taste

AI-native PM work still depends on taste: what matters, what is urgent, what is risky, what is overbuilt, and what users will trust.

Calibrate evals against human judgment:

- Review examples where the eval says the agent failed.
- Decide whether the agent was wrong, the eval was wrong, or the rubric was unclear.
- Give concrete corrections: "This bug should be P0 because it blocks activation for paying customers."
- Update the rubric or judge prompt.
- Re-run on the same traces and check whether agreement improves.

Healthy evals should produce a useful mix of passes and failures. If everything passes, the eval may be too easy. If everything fails, the eval may be misaligned. The PM's job is to make the eval sharp enough to create product learning.

## Gate self-improvement

Self-improving agents are only useful when the improvement loop is constrained. Do not let an agent silently change production behavior because it found a pattern in traces.

Require human review for:

- Agent behavior changes.
- Eval rubric or judge-prompt changes.
- Tool permission changes.
- Prompt changes that affect safety, autonomy, output format, or user-facing tone.
- Workflow changes that alter who reviews, approves, or can roll back.
- Changes generated by an automated improvement loop.

Safe pattern:

```text
Trace failure -> eval failure -> suggested fix -> PR or change proposal -> human review -> eval run -> staged rollout -> monitoring
```

Unsafe pattern:

```text
Trace failure -> agent edits itself -> production behavior changes silently
```

The bigger the blast radius, the stricter the review. Internal PM agents can move fast. User-facing agents need launch gates, rollback, audit trails, and staged rollout.

## Two-hour weekend exercise

If you want to become stronger as an AI PM, do this in two hours:

1. Pick one repetitive PM workflow you do every week.
2. Build a tiny agent or script that helps with it.
3. Run it on real or realistic data.
4. Save the traces or step-by-step outputs.
5. Label 10 outputs: good, bad, questionable.
6. Write one eval from the failures you found.
7. Improve the agent or eval once.
8. Write down what still needs human review before you would trust it.

This exercise teaches the difference between "the agent works once" and "the product can improve safely."

## Next steps

- Define the product behavior in the [AI PRD template](../templates/ai-prd.md).
- Add trace-derived cases to the [Eval Plan template](../templates/ai-eval-plan.md).
- Set trace review cadence in the [Observability Plan template](../templates/ai-observability-plan.md).
- Gate agent and eval changes with the [Launch Gate Checklist template](../templates/launch-gate-checklist.md).
