# AI risk register

Use this to make risk concrete and trackable. Review it before every launch gate and at least monthly after launch.

**Upstream:** risks surface from the [AI PRD](ai-prd.md) and [eval plan](ai-eval-plan.md). **Downstream:** unmitigated high-severity risks block the [launch gate checklist](launch-gate-checklist.md).

## Risk scoring

Use likelihood and severity to prioritize. Any risk that is high likelihood AND high severity is a launch blocker until mitigated.

| | Low severity | Medium severity | High severity |
|---|---|---|---|
| **High likelihood** | Monitor | Mitigate before pilot | Block launch |
| **Medium likelihood** | Accept | Mitigate before production | Mitigate before pilot |
| **Low likelihood** | Accept | Monitor | Mitigate before production |

## Risk table

| # | Risk | Scenario | User impact | Business impact | Likelihood | Severity | Mitigation | Detection signal | Owner | Status |
|---|------|----------|-------------|-----------------|------------|----------|------------|------------------|-------|--------|
| 1 | Incorrect output | AI produces a plausible but wrong answer, user acts on it | <!-- e.g., user makes a bad decision based on fabricated data --> | <!-- e.g., customer churn, liability --> | <!-- low/med/high --> | <!-- low/med/high --> | <!-- e.g., confidence scoring, human review for high-stakes actions --> | <!-- e.g., user correction rate, flagged outputs --> | <!-- name --> | <!-- open/mitigated/accepted --> |
| 2 | Over-trust | User stops checking AI output because it's usually right | <!-- e.g., errors go unnoticed, compounding damage --> | <!-- e.g., quality incidents at scale --> | | | | | | |
| 3 | Data leakage | AI exposes data from one user/tenant to another | <!-- e.g., confidential information visible to wrong user --> | <!-- e.g., breach notification, regulatory fine --> | | | | | | |
| 4 | Permission failure | AI takes an action the user didn't authorize or can't undo | <!-- e.g., sent email, deleted record, changed setting --> | <!-- e.g., trust loss, support escalation --> | | | | | | |
| 5 | Prompt injection | Malicious input causes the AI to ignore instructions or leak context | <!-- e.g., AI follows attacker instructions instead of system prompt --> | <!-- e.g., data exfiltration, reputational damage --> | | | | | | |
| 6 | Unsafe autonomy | AI acts beyond its intended scope without human check | <!-- e.g., AI auto-approves something that needed review --> | <!-- e.g., compliance violation --> | | | | | | |
| 7 | Regulatory exposure | AI feature violates current or upcoming regulation | <!-- e.g., non-compliant automated decision --> | <!-- e.g., fine, forced feature removal --> | | | | | | |
| 8 | Bias | AI produces systematically unfair outputs across groups | <!-- e.g., different quality of service for different demographics --> | <!-- e.g., legal liability, PR crisis --> | | | | | | |
| 9 | Cost spike | Usage pattern causes AI costs to exceed budget | <!-- e.g., none directly, but feature gets killed --> | <!-- e.g., margin erosion, emergency throttling --> | | | | | | |
| 10 | Silent degradation | AI quality drops gradually, no alert fires | <!-- e.g., users slowly stop trusting the feature --> | <!-- e.g., adoption decline with no clear cause --> | | | | | | |

## Agentic risks

<!-- If your product uses agents (tool-calling, multi-step workflows, autonomous actions), review these common agentic risk patterns. Skip for single-turn LLM features. -->

| # | Risk | Scenario | User impact | Business impact | Likelihood | Severity | Mitigation | Detection signal | Owner | Status |
|---|------|----------|-------------|-----------------|------------|----------|------------|------------------|-------|--------|
| A1 | Goal hijacking | Malicious input redirects the agent to pursue a different goal | <!-- e.g., agent takes unintended actions on user's behalf --> | <!-- e.g., data exfiltration, reputational damage --> | | | | | | |
| A2 | Tool misuse | Agent calls a tool in an unintended way or with unsafe parameters | <!-- e.g., agent deletes records instead of reading them --> | <!-- e.g., data loss, compliance violation --> | | | | | | |
| A3 | Identity abuse | Agent inherits user permissions and acts beyond what the user intended | <!-- e.g., agent accesses data the user didn't mean to share --> | <!-- e.g., privacy breach --> | | | | | | |
| A4 | Memory poisoning | Adversarial content in agent memory or context corrupts future behavior | <!-- e.g., agent gives bad advice based on poisoned context --> | <!-- e.g., systematic quality degradation --> | | | | | | |
| A5 | Error cascading | Flawed output in step 2 propagates silently through steps 3-5 | <!-- e.g., user receives confident but wrong final output --> | <!-- e.g., trust loss, downstream decisions based on bad data --> | | | | | | |

## Additional risks

<!-- Add product-specific risks below. -->

| # | Risk | Scenario | User impact | Business impact | Likelihood | Severity | Mitigation | Detection signal | Owner | Status |
|---|------|----------|-------------|-----------------|------------|----------|------------|------------------|-------|--------|
|   |      |          |             |                 |            |          |            |                  |       |        |

## Review log

| Date | Reviewer | Changes made |
|------|----------|--------------|
|      |          |              |
