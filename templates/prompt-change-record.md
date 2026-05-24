# Prompt change record

Use this before changing a production prompt, system instruction, judge prompt, tool instruction, or retrieval instruction. A prompt change is a product change.

**Upstream:** behavioral contract from the [AI PRD](ai-prd.md), quality bar from the [eval plan](ai-eval-plan.md), production signals from the [observability plan](ai-observability-plan.md). **Downstream:** approved changes feed into the [post-launch review](post-launch-review.md).

## Change summary

- Feature:
- Prompt or instruction changed:
- Current version:
- Proposed version:
- Owner:
- Date:

## Why this change

<!-- What problem are you trying to fix? Link to trace review, eval failure, user feedback, support issue, or product decision. -->

- Trigger:
- Target behavior:
- Non-goals:

## Behavioral contract check

<!-- Confirm the change still matches the PRD. If it changes product behavior, update the PRD first. -->

- [ ] AI job still matches the PRD.
- [ ] Output contract is unchanged or PRD is updated.
- [ ] Safety boundaries are unchanged or risk register is updated.
- [ ] Human review and fallback behavior are unchanged or templates are updated.

## Eval evidence

| Eval dimension | Baseline | Proposed | Pass? |
|----------------|----------|----------|-------|
|                |          |          |       |

- Eval suite version:
- Golden set size:
- Regressions found:
- Manual review sample:

## Rollout plan

- [ ] Staging only
- [ ] Shadow mode
- [ ] Canary
- [ ] Full rollout

Rollout notes:

<!-- Include traffic %, cohort, duration, and owner. -->

## Rollback plan

- Rollback version:
- Rollback trigger:
- Who can roll back:
- Expected rollback time:

## Monitoring

<!-- What will you watch after the change ships? -->

| Signal | Baseline | Alert threshold | Owner |
|--------|----------|-----------------|-------|
|        |          |                 |       |

## Decision

- [ ] Ship
- [ ] Hold
- [ ] Reject

Decision rationale:

<!-- One or two sentences. -->
