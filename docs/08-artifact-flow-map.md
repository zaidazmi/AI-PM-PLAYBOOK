# Artifact flow map

Use this when you need to know which artifact comes next. The playbook is a decision system: each artifact should unlock a specific product decision or make a blocker visible.

| Phase | Artifact | Owner | Decision unlocked | Next step |
|-------|----------|-------|-------------------|-----------|
| Idea screening | [Before you vibe code](before-you-vibe-code.md) | PM | Is the idea clear enough to investigate? | If unclear, write an opportunity brief. If clear, define the AI job. |
| Opportunity assessment | [AI opportunity brief](../templates/ai-opportunity-brief.md) | PM with cross-functional partners | Is AI worth pursuing, and is the idea coherent across user, AI job, data, evals, risk, cost, and human control? | If yes, write the PRD. If no, use a non-AI path or stop. |
| Product definition | [AI PRD](../templates/ai-prd.md) | PM with design and engineering | What does the AI do, for whom, under what constraints and risks? | Create the eval plan, review workflow, cost model, observability plan, and launch gate. |
| Engineering handoff | [Optional AI build brief](../templates/optional/ai-build-brief.md) | PM with engineering lead | Is the work scoped enough to build or prototype? | Build the smallest useful version or spike. |
| Quality definition | [AI eval plan](../templates/ai-eval-plan.md) | PM with domain expert and ML/engineering | How will the team know whether output is good? | Run baseline evals and update the launch gate. |
| Failure discovery | [Error analysis](07-error-analysis.md) | PM or domain expert | What is actually going wrong in traces? | Add recurring failures to evals and risk register. |
| Risk ownership | [AI PRD risk table](../templates/ai-prd.md#risks-and-mitigations) | PM with legal, security, design, engineering | What could go wrong, how bad is it, and who owns it? | Mitigate high-severity risks before launch gates. |
| Human control | [Human review workflow](../templates/human-review-workflow.md) | PM with design and operations | Where must humans approve, edit, reject, or undo AI output? | Design review UI and audit trail. |
| Unit economics | [AI cost model](../templates/ai-cost-model.md) | PM with engineering and finance | Is the workflow economically viable at expected usage? | Set cost ceilings and observability targets. |
| Prompt management | [Optional prompt change record](../templates/optional/prompt-change-record.md) | PM with engineering or AI lead | Is a prompt change justified, tested, reviewed, and rollbackable? | Roll out through staging, shadow mode, canary, or production. |
| Meeting review | [Optional AI PM review checklist](../templates/optional/ai-pm-review-checklist.md) | PM | Are roadmap, design, engineering, legal, or launch concerns blocking progress? | Proceed, hold, or recommend do not launch. |
| Launch decision | [Launch gate checklist](../templates/launch-gate-checklist.md) | PM with accountable approvers | Can the product enter pilot, limited production, or scale? | Document the decision and conditions. |
| Production monitoring | [AI observability plan](../templates/ai-observability-plan.md) | PM with engineering/data | How will the team detect drift, cost spikes, failures, and user trust loss? | Review signals on cadence and feed failures back into evals. |
| Operating loop | [Weekly post-launch review](../templates/ai-observability-plan.md#weekly-post-launch-review) | PM with product team | Did the product perform as expected after launch? | Continue, roll back, hold expansion, or update the roadmap. |

## Two common routes

**From idea to pilot:** preflight -> opportunity brief -> PRD -> eval plan -> human review workflow -> cost model -> observability plan -> launch gate.

**From prototype to confidence:** error analysis -> eval plan -> PRD risk table -> observability plan -> optional AI PM review checklist -> launch gate.

## Rule of thumb

If an artifact does not help the team make a better decision, skip it. If a decision feels subjective or political, add the missing artifact that would make the evidence visible.
