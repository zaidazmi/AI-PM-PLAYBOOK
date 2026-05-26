# Before you vibe code

> **The failure this prevents:** the PM opens an AI builder before deciding whether AI is the right tool, what "good" looks like, or what happens when the model is wrong. The demo looks polished, the team commits to a roadmap, and the gaps only surface in production.

Use this preflight before opening Cursor, Lovable, Bolt, Codex, or any other AI builder. It should take 10 minutes. If it takes longer, the idea probably isn't clear enough yet. A polished demo will hide that from you.

## Contents

- [The 8 questions](#the-8-questions)
- [Why each question matters](#why-each-question-matters)
- [How to use the answers](#how-to-use-the-answers)
- [A worked example](#a-worked-example)
- [Common surprises](#common-surprises)
- [Rule of thumb](#rule-of-thumb)
- [Next steps](#next-steps)

## The 8 questions

1. Who has this problem?
2. What do they do today without AI?
3. Why is AI better than rules, forms, search, or workflow automation?
4. What is the smallest useful version?
5. What should the AI never do?
6. How will you know when the AI is wrong?
7. Who reviews the output before it matters, and can they see enough evidence to catch a wrong answer?
8. What happens if the AI produces nothing?

Answer in your own words. Out loud is fine. If a question stumps you for more than a minute, the idea isn't ready yet.

## Why each question matters

### 1. Who has this problem?

A good answer names a specific role and the workflow where the pain happens: "enterprise AE during deal review", not "sales people". If the answer is "everyone" or "knowledge workers", you don't yet know who the user is.

### 2. What do they do today without AI?

You're naming the baseline. If the workflow is fast and reliable today, AI has a high bar. If it's painful, slow, or error-prone, AI has something to beat. Either way you need to know what you're replacing.

### 3. Why is AI better than rules, forms, search, or workflow automation?

The single most-skipped question. Most "AI feature" ideas die here. If a regex, a form field, or an Airtable view solves it, the AI is the wrong tool. You're paying tokens, latency, and operating cost for no leverage.

A good answer names the property that makes AI the right choice: unstructured inputs, long-tail variation, soft judgement, summarization across many sources. Without one of those, deterministic software is cheaper and safer.

### 4. What is the smallest useful version?

Not the demo. The smallest thing a real user would actually use. If the smallest version still needs three model calls, retrieval, and a custom UI, it is too big.

A useful sharpening question: what is the one user action this changes? If you can't name it, you're scoping a feature set, not a product.

### 5. What should the AI never do?

The complement of the AI job. Examples: "never send the email itself", "never update the deal stage", "never modify medical records". Naming the boundary up front shapes the autonomy level (draft, suggest, act, autonomous) before you write the PRD. See the [agentic products guide](02-agentic-products.md) for the autonomy spectrum.

### 6. How will you know when the AI is wrong?

The eval question. If your answer is "the user will tell us", the product is unsafe to ship. You need a way to detect wrong answers before the user is harmed.

A good answer names the signal: an eval set, a labeled regression suite, a sampling rubric, a structured user-edit log. See [eval design](01-eval-design.md) for what each one looks like in practice.

### 7. Who reviews the output, and can they catch a wrong answer?

The human-in-the-loop question. The reviewer needs three things to be useful:

- **Time.** Not "in their existing workflow" if it doubles the workflow.
- **Evidence.** Source citations, confidence scores, transcript snippets, retrieved chunks.
- **Authority.** They can block, edit, or escalate without asking permission.

Missing any one and review is theatre.

### 8. What happens if the AI produces nothing?

The fallback question. The user is mid-workflow. The model timed out, hit a guardrail, or had low confidence. Does the user get a graceful "do it manually" path, or do they hit a dead end?

The honest answer is usually "we haven't designed for that yet". Designing for it before launch is cheaper than designing for it after the first production incident.

## How to use the answers

| If this is unclear | Do this |
|--------------------|---------|
| Questions 1-4 (problem, baseline, AI fit, MVP) | Do not build yet. Write an [opportunity brief](../templates/ai-opportunity-brief.md) and pressure-test the idea. |
| Questions 5-8 (boundaries, eval, review, fallback) | Do not show it to real users yet. Write an [AI PRD](../templates/ai-prd.md), [eval plan](../templates/ai-eval-plan.md), and [review workflow](../templates/human-review-workflow.md). |
| All 8 are clear | Build the smallest useful version, then gate it with the [launch checklist](../templates/launch-gate-checklist.md). |

If five or more of the questions are unclear, the right next step is not a builder. It is a 30-minute conversation with two real users.

## A worked example

**The idea (raw):** "We need an AI assistant for sales reps."

Run the 8 questions:

1. **Who has this problem?** Enterprise AEs who run 20+ discovery calls per week and forget to update CRM next steps before the call ends.
2. **What do they do today?** They batch-update Salesforce on Friday afternoons, often missing competitor mentions or commitments from earlier in the week.
3. **Why is AI better than alternatives?** Required fields don't capture nuance. Templates feel like a tax. The signal is buried in 30-minute call transcripts that no one re-reads. AI is good at extracting structured facts from long unstructured text.
4. **Smallest useful version?** Extract five structured fields from a single call transcript (next steps, competitors, commitments, blockers, stakeholders). Show transcript evidence per field. Let the AE approve or edit before save.
5. **What should the AI never do?** Never write to Salesforce without rep approval. Never modify deal stage, amount, or close date. Never act on calls flagged as personal or excluded by the rep.
6. **How will you know when it's wrong?** Sample 20 calls a week. Compare extracted fields to a ground-truth set labeled by a senior AE. Track extraction accuracy per field and fabrication rate (zero tolerance).
7. **Who reviews the output?** The AE who ran the call. They get a side-by-side: transcript snippet on the left, proposed update on the right. One click to accept, edit, or reject. Edits are logged as eval signal.
8. **What happens if the AI produces nothing?** The AE sees the original "update CRM" task with no AI suggestion. Behavior is unchanged. They don't get punished for the AI's silence.

The second version is buildable. You can tell because each answer is specific, falsifiable, and tied to a real user. Compare against the original "AI assistant for sales reps", which is none of those things.

## Common surprises

- **You'll discover the problem isn't AI-shaped.** Questions 2 and 3 kill more "AI feature" ideas than any review meeting. If the workflow is already fine, or if rules work, stop here. That is a successful preflight, not a failure.
- **The smallest useful version is smaller than you think.** First-draft scopes are usually 2-3x too big. Cut until the MVP is one model call triggered by one user action.
- **You'll learn what the AI must never do before you learn what it must do.** The boundary clarifies the job. Many "AI assistant" features are really "AI suggestion plus human approval"; spelling that out early shapes the whole product.
- **Question 6 changes the team you need.** "I'll know if it's wrong" is not eval. Real eval needs labeled data, a rubric, and someone who owns it. If no one on the team has done eval work before, plan for that headcount or learning curve now.
- **Question 8 reveals trust debt.** Most teams haven't designed for the AI being silent. The fallback often ships last, by which point it is an emergency feature. Design it on day one.

## Rule of thumb

Vibe coding is great for demos. It can also make a PM over-trust a workflow because the happy path looks polished. **Do not ship AI into real user consequences until review, fallback, evals, monitoring, and cost controls are explicit.**

If the team is excited and the demo works but you can't answer any one of the 8 questions, that excitement is the signal to slow down, not speed up.

## Next steps

Depending on where your answers land, the next artifact is:

- Idea still fuzzy → [Opportunity brief](../templates/ai-opportunity-brief.md)
- Idea clear, AI job needs spec → [AI PRD](../templates/ai-prd.md)
- AI job clear, quality bar undefined → [Eval plan](../templates/ai-eval-plan.md)
- Reviewing whether to ship → [Launch gate checklist](../templates/launch-gate-checklist.md)
- Already shipped, watching for drift → [Observability plan](../templates/ai-observability-plan.md)
