# Launch gate checklist

Use this to decide if the product can enter or advance beyond each release stage. Three gates: pilot entry, limited production entry, and scale-up entry. Do not skip gates.

**Inputs:** scores and evidence come from the [eval plan](ai-eval-plan.md), [risk register](ai-risk-register.md), [cost model](ai-cost-model.md), [observability plan](ai-observability-plan.md), and [human review workflow](human-review-workflow.md). **Output:** a go/no-go decision documented in the [stakeholder decision record](stakeholder-decision-record.md).

---

## Gate 1: pilot entry

<!-- Before internal users or a small, hand-picked group. Goal: validate that the AI is safe and measurable enough to learn from real workflow usage. -->

### Pass/fail criteria

| Criterion | Target | Actual | Pass? |
|-----------|--------|--------|-------|
| Eval accuracy on golden set | <!-- e.g., >= 90% --> | | |
| Failure behavior tested | All failure modes documented and handled | | |
| Human review workflow functional | Reviewers can approve/reject/edit | | |
| Latency | <!-- e.g., p95 < 10s --> | | |
| Cost per task | <!-- e.g., < $0.10 --> | | |
| Safety boundaries hold | Adversarial eval passes | | |
| Observability in place | Logs, metrics, alerts configured | | |

### Staged rollout plan

<!-- How will you ramp this to real users? Pick one or combine. -->

- [ ] **Shadow mode:** production requests duplicated to AI path, outputs logged but not shown to users
- [ ] **Canary:** 1% of traffic, gated ramp (1% -> 5% -> 20% -> full), rollback criteria defined
- [ ] **Cohort-based:** specific user segment or geography first

Rollback trigger: <!-- e.g., quality score drops > 5%, cost per task > 2x budget, any safety incident -->

### Regulatory compliance

<!-- Required for products subject to AI-specific regulation, privacy law, security commitments, or sector-specific rules. -->

- [ ] Risk classification and compliance path determined
- [ ] Data provenance documented (training data sources, retrieval sources, retention policy)
- [ ] Transparency requirements met (users informed they are interacting with AI)
- [ ] System card or model card drafted (which models, prompts, tools, retrieval sources, human review points)
- [ ] Vendor due diligence complete for third-party model providers

### Required pass conditions

<!-- Any unchecked item = do not advance, regardless of other scores. -->

- [ ] No unmitigated high-severity risks in risk register
- [ ] No data leakage between users/tenants
- [ ] Failure behavior does not expose raw model output to users

### Decision

- [ ] Start pilot
- [ ] Advance with conditions: <!-- list conditions -->
- [ ] Hold: <!-- what needs to change -->
- [ ] Do not launch: <!-- reason -->

**Decided by:** <!-- name -->
**Date:** <!-- YYYY-MM-DD -->

---

## Gate 2: limited production entry

<!-- Before real users in a limited rollout (percentage, cohort, or geography). Goal: validate quality and economics from pilot before expanding blast radius. -->

### Pass/fail criteria

| Criterion | Target | Actual | Pass? |
|-----------|--------|--------|-------|
| Eval accuracy on production sample | <!-- e.g., >= 92% --> | | |
| User task completion rate | <!-- e.g., >= 80% --> | | |
| Accept rate | <!-- e.g., >= 60% --> | | |
| Reject/escalation rate | <!-- e.g., < 15% --> | | |
| User-reported issues | <!-- e.g., < 5 per week --> | | |
| Cost per task (production) | <!-- e.g., < $0.08 --> | | |
| Latency (production) | <!-- e.g., p95 < 8s --> | | |
| No regression vs. pilot | Quality metrics stable or improving | | |

### Required pass conditions

- [ ] No unresolved incidents from pilot
- [ ] No systematic bias detected in output quality across user segments
- [ ] Cost trajectory within budget at projected scale
- [ ] Regulatory requirements from Gate 1 still met (no scope changes that alter risk classification)

### Decision

- [ ] Advance to limited production
- [ ] Advance with conditions: <!-- list conditions -->
- [ ] Hold: <!-- what needs to change -->
- [ ] Do not launch: <!-- reason -->

**Decided by:** <!-- name -->
**Date:** <!-- YYYY-MM-DD -->

---

## Gate 3: scale-up entry

<!-- Full rollout. Goal: confirm the product works for everyone and economics hold. -->

### Pass/fail criteria

| Criterion | Target | Actual | Pass? |
|-----------|--------|--------|-------|
| Quality metrics stable for >= 2 weeks | <!-- specific metrics --> | | |
| Cost per customer within margin target | <!-- e.g., < $X/customer/month --> | | |
| Support ticket volume | <!-- e.g., < baseline + 10% --> | | |
| Rollback plan tested | Can disable AI path in < 15 min | | |
| Monitoring and alerting validated | Alerts fire correctly on synthetic failures | | |

### Required pass conditions

- [ ] No open high-severity incidents
- [ ] Rollback plan tested and documented
- [ ] On-call runbook reviewed by ops team
- [ ] Incident response process tested (at least one simulated incident)
- [ ] Near-miss capture process in place (not just incidents, but close calls)

### Decision

- [ ] Ship to all users
- [ ] Advance with conditions: <!-- list conditions -->
- [ ] Hold: <!-- what needs to change -->
- [ ] Do not launch: <!-- reason -->

**Decided by:** <!-- name -->
**Date:** <!-- YYYY-MM-DD -->
