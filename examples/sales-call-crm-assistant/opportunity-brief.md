# AI opportunity brief: sales call CRM assistant

## Problem

Sales reps spend roughly 45 minutes per day on post-call CRM updates. This is not a guess. We timed 23 reps across three teams over two weeks.

The bigger problem is not the time. It is the data quality. 30% of CRM fields are left empty or outdated because reps skip them. When fields are filled, they are often stale by the time the rep gets around to updating. Pipeline forecasting runs on this data, so forecast accuracy suffers directly.

Specific gaps:

- Next steps are missing on 41% of open opportunities after calls.
- Competitor mentions go unrecorded 60% of the time.
- Budget signals are captured in free-text notes but not in structured fields.
- Stage changes lag behind actual deal progression by 3-5 days on average.

## Current workflow

1. Rep joins a sales call. Gong or Chorus records and transcribes.
2. Rep takes their own notes during the call (quality varies wildly).
3. After the call, rep opens Salesforce and manually updates opportunity fields.
4. Rep either fills fields from memory, skips them, or copies fragments from their notes.
5. Manager reviews pipeline weekly using incomplete data.
6. Forecasting team builds models on fields that are 30% empty.

The bottleneck is step 3-4. Reps know they should update CRM. They do not enjoy it, they postpone it, and the data degrades.

## Why AI, and why not deterministic software

The call transcripts already contain the information we need. Next steps, objections, budget ranges, timelines, competitor mentions. This information is scattered across a 30-60 minute conversation in natural language. It is not in a structured format.

Deterministic extraction (regex, keyword matching) fails here because:

- Budget signals come in many forms ("we're looking at the 50-75k range", "that's above what we budgeted", "we'd need to get finance involved for anything over six figures").
- Objections are contextual, not keyword-based.
- Next steps are often implied rather than stated explicitly.

Pattern extraction from unstructured conversational text is a strong LLM use case. The model does not need to generate creative content or make decisions. It needs to find structured information that already exists in the transcript and surface it.

This is extraction, not generation. That distinction matters for the risk profile.

## Smallest useful version

Auto-extract five fields from call transcripts:

1. Next steps (what was agreed, by whom, by when)
2. Objections raised (specific concerns the prospect mentioned)
3. Budget discussed (any budget signals, ranges, or constraints)
4. Timeline mentioned (decision timeline, implementation timeline, urgency signals)
5. Competitor mentioned (any competitor names or comparisons)

Present extracted fields to the rep for approval before writing anything to Salesforce. The rep sees the proposed updates alongside the transcript evidence (highlighted quotes) and can accept, edit, or reject each field.

No auto-write. No stage changes. No deal amount updates. Those come later if this works.

## What happens if we do nothing

- CRM data quality stays at current levels. 30% of fields remain empty.
- Pipeline forecasting remains unreliable. Sales leadership continues to distrust the numbers.
- Reps continue spending 45 min/day on a task they dislike and do poorly.
- A competitor (Clari, Gong, or a startup) ships this capability and we lose a differentiation opportunity.
- Nothing catastrophic happens. The business survives with bad CRM data, as it has for years. But the opportunity cost is real.

## Risks already visible

- Recording consent: not all calls have verified recording consent. Processing transcripts without consent creates legal exposure.
- Transcript quality: cross-talk, poor audio, and accents can produce unreliable transcripts. Garbage in, garbage out.
- Over-trust: reps might auto-approve AI suggestions without reading them, which defeats the purpose of human review and could introduce errors.
- Privacy: transcripts may contain sensitive information (pricing, internal discussions) that should not be stored or processed without appropriate controls.
- Fabrication: the model could invent a competitor mention or budget figure that was not in the transcript. This is the highest-severity failure mode.

## Decision

- [x] Pursue: commit to a build brief and eval plan
- [ ] Prototype: time-boxed spike to answer specific unknowns
- [ ] Defer: revisit in Q1
- [ ] Reject: not worth pursuing

**Decided by:** Sarah Chen, VP Product
**Date:** 2026-01-15
