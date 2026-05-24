# Prompt craft for AI PMs

> **The failure this prevents:** the PRD defines the right behavior, but the production prompt drifts away from it. A tone tweak changes accuracy, a format change breaks downstream parsing, or a judge prompt becomes too forgiving. Nobody catches it because prompts were treated like copy instead of product behavior.

PMs do not need to be the person writing every production prompt. They do need to own the behavioral contract the prompt must satisfy.

## The PM job

Before engineering writes or changes a prompt, the PM should define:

- The AI job: the specific task, allowed inputs, expected output, and workflow.
- Boundaries: what the AI must never say, decide, reveal, or do.
- Ambiguity handling: ask a clarifying question, refuse, escalate, or make a bounded best effort.
- Output contract: format, fields, evidence, citation, length, and tone.
- Priority order: what wins when helpfulness conflicts with accuracy, safety, brevity, or policy.
- Eval cases: happy path, edge case, unacceptable output, safety boundary, and regression case.

If those are not written down, the prompt writer is guessing.

## What PMs should inspect

Prompt behavior is shaped by three product surfaces:

| Surface | PM question |
|---------|-------------|
| Knowledge | What sources can the AI use, how fresh are they, and what should happen when evidence is missing? |
| Tools | What actions can the AI take, which require confirmation, and what happens when a tool fails? |
| Instructions | What role, tone, constraints, reasoning style, and output format must the system follow? |

The PM does not need to approve every wording choice. The PM should approve behavior that affects user trust, scope, safety, cost, tool use, retrieval, or output format.

## Change discipline

Treat production prompts, judge prompts, retrieval instructions, and tool instructions as versioned product behavior.

Every meaningful change should have:

1. A reason tied to a trace, eval failure, user complaint, safety issue, cost issue, or product decision.
2. A contract check against the PRD, autonomy rules, safety boundaries, and output schema.
3. Eval results before and after the change.
4. Manual review of cases unrelated to the target change, because prompts regress sideways.
5. A rollout path: staging, shadow mode, canary, cohort, or full release.
6. A rollback trigger and owner.
7. Monitoring signals after release.

Small copy edits in disposable prototypes do not need ceremony. Anything that changes production behavior does.

## Failure patterns

Prompt changes often fail in non-obvious ways:

- **Tone change that hurts accuracy:** "friendlier" becomes hedged, verbose, and less direct.
- **Safety rule that blocks legitimate use:** a broad restriction causes frustrating refusals.
- **Format change that breaks integrations:** prose replaces structured fields consumed by another system.
- **Persona shift that changes judgment:** "helpful assistant" becomes too agreeable to push back on bad assumptions.
- **Judge prompt drift:** eval scores improve because the evaluator became more lenient, not because the product improved.
- **Tool instruction expansion:** a clarification quietly lets an agent act where it previously only suggested.

Every pattern above should be caught by evals before users see it.

## Prompt injection

Prompt injection is a product risk, not only a security topic. If user input can cause the system to ignore instructions, reveal hidden context, misuse tools, or leave the approved workflow, the product boundary is broken.

Include injection cases in the eval set:

- Requests to reveal system instructions.
- Instructions embedded inside documents, emails, tickets, or webpages.
- Attempts to access another user, tenant, account, or record.
- Attempts to call tools outside the workflow.
- Attempts to override safety, legal, financial, medical, or support policy.

Mitigation is layered: instruction hierarchy, input filtering, output validation, tool permissions, human review for risky actions, and monitoring for suspicious traces.

## The standard

A prompt is ready when:

- It implements the PRD's behavioral contract.
- It passes the eval suite at the required threshold.
- It handles known edge cases and unacceptable outputs.
- It is versioned and rollbackable.
- It has monitoring tied to product-quality signals.

Use the [AI PRD template](../templates/ai-prd.md) to define the contract, the [Eval Plan template](../templates/ai-eval-plan.md) to test behavior, and the [Prompt Change Record](../templates/prompt-change-record.md) only for meaningful production changes.
