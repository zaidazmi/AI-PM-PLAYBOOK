# Before you vibe code

Use this before opening Cursor, Lovable, Bolt, Codex, or any other AI builder. It should take 10 minutes. If it takes longer, the idea probably isn't clear enough yet.

## The 8 questions

1. Who has this problem?
2. What do they do today without AI?
3. Why is AI better than rules, forms, search, or workflow automation?
4. What is the smallest useful version?
5. What should the AI never do?
6. How will you know when the AI is wrong?
7. Who reviews the output before it matters, and can they see enough evidence to catch a wrong answer?
8. What happens if the AI produces nothing?

## How to use the answers

| If this is unclear | Do this |
|--------------------|---------|
| Questions 1-4 | Do not build yet. Write an [opportunity brief](../templates/ai-opportunity-brief.md). |
| Questions 5-8 | Do not show it to real users yet. Write an [AI PRD](../templates/ai-prd.md), [eval plan](../templates/ai-eval-plan.md), and review workflow. |
| All 8 are clear | Build the smallest useful version, then gate it with the [launch checklist](../templates/launch-gate-checklist.md). |

## Quick example

Weak answer:

> "We need an AI assistant for sales reps."

Better answer:

> "Enterprise AEs forget to update next steps and competitor mentions after calls. The AI extracts five structured fields from call transcripts, shows transcript evidence, and waits for rep approval before writing to Salesforce. If consent is missing or confidence is low, it does nothing and asks the rep to update manually."

The second version is buildable. You can tell because it says who the user is, where the data comes from, what the output looks like, and what happens when something goes wrong.

## Rule of thumb

Vibe coding is great for demos. It can also make a PM over-trust a workflow because the happy path looks polished. Do not ship AI into real user consequences until review, fallback, evals, monitoring, and cost controls are explicit.
