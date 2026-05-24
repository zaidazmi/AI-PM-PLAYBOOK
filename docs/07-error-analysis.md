# Error analysis for AI PMs

> **The failure this prevents:** the team jumps from a good demo to generic eval metrics without looking at what users actually experience. The dashboard says quality is fine, but production traces show ignored intent, bad handoffs, duplicate actions, and channel-specific failures. Error analysis turns messy traces into the evals and fixes that matter.

## Contents

- [What error analysis is](#what-error-analysis-is)
- [When to do it](#when-to-do-it)
- [The trace review loop](#the-trace-review-loop)
- [What to look for](#what-to-look-for)
- [From notes to error categories](#from-notes-to-error-categories)
- [Prioritize what to fix](#prioritize-what-to-fix)
- [Decide what to automate](#decide-what-to-automate)
- [Who should do it](#who-should-do-it)
- [Common mistakes](#common-mistakes)
- [Next steps](#next-steps)

Error analysis is the practice of reading real AI interactions, writing down what went wrong, grouping those failures into actionable categories, and using those categories to improve the product.

It comes before polished evals. You cannot design useful evals until you know what failures your product actually has.

## What error analysis is

Error analysis is not root-cause debugging. The first pass is observational.

You are not trying to answer "which line of code caused this?" You are trying to answer:

- What did the user want?
- What did the AI do?
- Where did the experience break?
- Would a user trust the product more or less after this interaction?

The output is a list of concrete failure notes and categories, not a perfect taxonomy.

## When to do it

Run error analysis:

- Before writing your first serious eval suite
- After a prototype has enough traces to inspect
- Before pilot launch
- Weekly during the first month after launch
- After any major prompt, model, retrieval, or tool change
- After any production incident or surprising metric movement

For a prototype, review 30-50 traces. For a pilot or production feature, review 50-100 traces per cycle. If usage is high, sample by user segment, channel, workflow, and failure signal.

## The trace review loop

1. Pull a sample of traces.
2. Open one trace at a time.
3. Skim the system prompt, user input, retrieved context, tool calls, model output, and user response.
4. Write short notes for anything that felt wrong.
5. Move on quickly.
6. Group notes into categories after the review, not during it.
7. Count frequency and estimate severity.
8. Decide which failures need product fixes, prompt fixes, data fixes, or automated evals.

Perfection is not the goal. A PM can learn a lot from 60 minutes of focused trace review.

## What to look for

Good trace review catches product failures that generic scores miss.

| Failure type | What it looks like |
|--------------|--------------------|
| Ignored intent | User asks for a constraint, exception, or preference; AI answers a nearby but different question |
| Bad handoff | User asks for a human, or policy requires escalation, but AI continues alone |
| Wrong channel behavior | Output format does not fit the surface, such as markdown in SMS or long paragraphs in chat |
| Duplicate action | AI schedules, sends, updates, or books something twice instead of modifying the original action |
| Tool mismatch | AI calls a tool that cannot satisfy the user's request |
| Stale context | AI uses an old date, old policy, deprecated document, or previous state that no longer applies |
| Conversation flow issue | AI gives a technically plausible answer that leaves the user stuck |
| Retrieval miss | Retrieved context is irrelevant, incomplete, outdated, or missing the source needed to answer |
| Boundary failure | AI does something the PRD says it should never do |
| Confidence mismatch | AI sounds certain while evidence is weak or missing |

These categories should be adapted to the product. A leasing assistant, support copilot, healthcare intake assistant, and finance analyst should not share the exact same error taxonomy.

## From notes to error categories

Start with raw notes. These are open observations:

- "User asked for a same-day tour; AI booked it instead of handing off."
- "AI used markdown bullets in an SMS response."
- "User asked to reschedule; AI created a second booking."
- "Answer cited a policy that was not in retrieved context."

Then group notes into actionable categories:

- Human handoff failure
- Channel formatting failure
- Action modification failure
- Unsupported claim

Good categories are specific enough that someone could label another trace consistently. Avoid vague buckets like "quality issue," "bad answer," or "context problem." Those hide the work.

## Prioritize what to fix

Do not rank failures by frequency alone. Rank by frequency and severity.

| Signal | Question |
|--------|----------|
| Frequency | How often does this happen in the reviewed sample? |
| Severity | What happens if the user trusts this output? |
| Detectability | Can the system or user notice the failure before harm occurs? |
| Fix path | Is this a prompt, retrieval, product, policy, or tool problem? |
| Eval value | Would an automated check catch future regressions? |

A rare human handoff failure can matter more than a frequent tone issue. PM judgment belongs here.

## Decide what to automate

Not every error category needs an automated eval.

Use code-based checks when the failure is deterministic:

- JSON schema validity
- Required fields present
- Markdown forbidden in SMS
- Citation IDs exist in retrieved context
- Confidence score is between 0 and 1

Use LLM-as-judge when the failure requires judgment:

- User intent was ignored
- Human handoff should have happened
- Conversation flow left the user stuck
- Answer was misleading despite being factually plausible

Use human review when the stakes are high or the rubric is not stable:

- Medical, legal, financial, or compliance judgment
- New error categories
- Disagreements between automated checks and user feedback

Automate the failures that are important, recurring, and likely to regress.

## Who should do it

The PM or domain expert should own error analysis. Engineering should help expose traces, explain tool behavior, and fix root causes, but product judgment cannot be outsourced to the team that implemented the system.

For AI products, reading traces is product discovery after launch. It is where the PM sees what the system is really doing for users.

## Common mistakes

**Starting with vendor metrics:** helpfulness, relevance, or hallucination scores can be useful later, but they rarely reveal the product-specific failures that make users lose trust.

**Doing root cause analysis too early:** first observe and label the failure. Debug after the pattern is clear.

**Making categories too vague:** "bad quality" does not tell the team what to fix or what eval to write.

**Outsourcing the review completely:** labelers can help at scale, but the PM or domain expert needs to inspect enough traces to build product intuition.

**Automating everything:** some failures should be fixed immediately. Some need a policy decision. Some need a human review workflow. Evals are not the only output.

**Trusting an LLM judge without calibration:** compare judge output to human labels. If the judge cannot reliably find a failure on a small labeled sample, it should not be used as a production metric.

## Next steps

- Use the [Eval Design guide](01-eval-design.md) to turn priority failure categories into code-based checks, LLM judges, and human review.
- Use the [Operating AI Products guide](03-operating-ai-products.md) to make sure traces are logged, sampled, and reviewed after launch.
- Add recurring failures to the [Eval Plan template](../templates/ai-eval-plan.md) so the eval set evolves with production behavior.
