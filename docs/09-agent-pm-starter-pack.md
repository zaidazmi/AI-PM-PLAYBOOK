# Agent PM starter pack

Use this when the AI can call tools, take actions, or run multi-step workflows. Agents need stricter product definition than chatbots because they create side effects.

## The starter checklist

| Question | Artifact |
|----------|----------|
| What actions can the agent take, and at what autonomy level? | [AI PRD](../templates/ai-prd.md) |
| Which tools can it call, with what constraints? | [AI PRD](../templates/ai-prd.md) |
| What can the agent never do? | [AI PRD](../templates/ai-prd.md) + [Operating AI Products](03-operating-ai-products.md) |
| Which actions require approval, rollback, or audit trail? | [Human Review Workflow](../templates/human-review-workflow.md) |
| How will trajectory quality be evaluated? | [Eval Plan](../templates/ai-eval-plan.md) + [Agentic Products](02-agentic-products.md) |
| What is the cost ceiling per task? | [Cost Model](../templates/ai-cost-model.md) |
| What happens when the agent gets stuck or confidence is low? | [AI PRD](../templates/ai-prd.md) + [Launch Gate Checklist](../templates/launch-gate-checklist.md) |

## 1. Map autonomy by action

Do not assign one autonomy level to the whole agent. Assign a level to each action:

| Action | Recommended starting level | Why |
|--------|----------------------------|-----|
| Draft content | Draft | User can review before anything happens |
| Recommend a next step | Suggest | User approves or rejects |
| Update reversible internal state | Act | Requires audit trail and rollback |
| Send external communication | Draft or Suggest | Customer-facing mistakes damage trust |
| Process money, permissions, identity, legal, health, or deletion | Human-only unless proven otherwise | High-severity harm or irreversible action |

Start lower than you think. Let reliability, user trust, and operations earn higher autonomy over time.

## 2. Define tool boundaries

For every tool, document:

- What data it can read
- What data it can write
- Which tenants, accounts, or objects it can access
- Whether the action has side effects
- Whether the action is reversible
- What happens when the tool fails

If a tool can send, delete, charge, approve, publish, or change permissions, it needs confirmation or rollback.

## 3. Design rollback before action

An agent should not take an action unless the team knows how to undo it or has decided the action must be reviewed first.

| Action type | Required control |
|-------------|------------------|
| Reversible internal update | Change log, undo path, monitoring owner |
| Customer-visible output | Human approval or safe draft state |
| Irreversible action | Human approval before action |
| Tool failure or partial completion | Stop, report state, and ask for review |
| Repeated failed attempts | Cost ceiling and loop termination |

Rollback is part of the product design, not an implementation detail.

## 4. Evaluate the trajectory, not only the outcome

For agents, a correct final answer can still be a product failure if the path was unsafe.

Evaluate:

- Tool calls: did the agent use only allowed tools?
- Parameters: did it pass safe and correct arguments?
- Sequence: did each step follow from the prior state?
- Efficiency: did it avoid unnecessary retries and loops?
- Boundary handling: did it stop or escalate when out of scope?
- Final output: did the result satisfy the user goal?

Add trajectory failures to the eval plan and error analysis loop.

## 5. Set cost ceilings

Agent costs compound through tool calls, retries, and growing context. Define:

- Maximum cost per task
- Maximum number of tool calls
- Maximum retries per tool
- Timeout or stop condition
- User-facing behavior when the ceiling is hit

If the agent reaches the ceiling, it should stop, summarize progress, and ask whether to continue or hand off.

## 6. Make handoff explicit

The agent needs a clear path when it cannot safely continue:

- Hand off to a human reviewer
- Ask the user for missing information
- Produce a draft instead of taking action
- Show uncertainty and stop
- Fall back to the existing non-AI workflow

"Try again" is not an escalation policy.

## Launch blockers for agents

Do not launch an agent beyond internal testing if:

- Tool boundaries are not defined
- Any high-impact action has no approval or rollback path
- Trajectory evals do not exist
- Cost ceilings are missing
- There is no audit trail for tool calls and actions
- The human handoff path is not staffed or tested

Use the [Launch Gates guide](04-launch-gates.md) when deciding whether the agent can move from prototype to pilot, limited production, or scale.
