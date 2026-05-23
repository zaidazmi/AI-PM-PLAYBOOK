# Launch gate: healthcare intake assistant

## Readiness scores

| Dimension | Score | Evidence | Key risk |
|-----------|-------|----------|----------|
| Problem fit | 3 | Time study confirms 19.7 min/patient mean intake time. 12% error rate verified. Patient satisfaction is low. | A well-designed web form captures most of this value without AI risk. The incremental benefit of conversational AI over a digital form is unproven. |
| Workflow fit | 3 | Proposed workflow is sensible: AI collects, staff confirms, staff writes to EHR. Paper form fallback included. | Workflow design is reasonable but untested. No usability testing with patients or staff. |
| AI job definition | 3 | AI job is clearly scoped: demographics and insurance only. Hard boundaries defined. | Scope is well-defined on paper. No testing of whether the boundaries hold under real patient interactions. |
| Data readiness | 2 | Required field definitions exist. Insurance provider lists available. | No synthetic eval data created. No real patient data pipeline designed. HIPAA-compliant infrastructure not provisioned. |
| Eval readiness | 1 | Eval plan written with quality rubric and golden examples defined on paper. | No eval set exists. Zero of 200 scenarios created. Cannot measure anything. This is the biggest gap. |
| System behavior | 2 | Prompt design drafted. Boundary enforcement approach outlined (input/output filters + topic classification). | Nothing built. No prototype. Boundary enforcement is designed but not implemented or tested. |
| Risk and safety | 2 | Risk categories identified. Boundary rules defined. Emergency escalation behavior specified. | HIPAA compliance review not started. No security review. No legal review. No BAA with AI provider. No incident response plan. All the work that matters is not done. |
| Regulatory readiness | 1 | The team has identified that the product handles PHI and needs a formal compliance path. | Compliance path, BAA, consent flow, and legal review are not started. |
| Cost and business case | 2 | Cost estimate of $0.10/session is affordable at the API level. Staff time savings are real. | API cost is not the issue. Total cost of ownership — HIPAA compliance ($50K-100K+), security audit, legal review, ongoing monitoring, incident response — is unestimated. The ROI case is incomplete without compliance costs. A digital form may deliver most of the value at materially lower total cost. |
| Observability | 1 | Observability requirements listed in the PRD. | No monitoring designed. No dashboards. No alerting. No logging infrastructure. The list of what to observe is not the same as the ability to observe it. |
| Launch and operations | 2 | Pilot clinic identified. Rollback approach conceptualized (disable AI, revert to paper forms). | No staff training plan. No incident response plan. No on-call rotation for health data issues. No escalation path defined for real incidents. |

## Overall score

**1.95 / 5.0**

Weighted calculation:

- Problem fit: 3 x 1.1 = 3.3
- Workflow fit: 3 x 1.1 = 3.3
- AI job definition: 3 x 1.2 = 3.6
- Data readiness: 2 x 1.2 = 2.4
- Eval readiness: 1 x 1.5 = 1.5
- System behavior: 2 x 1.0 = 2.0
- Risk and safety: 2 x 1.4 = 2.8
- Regulatory readiness: 1 x 1.3 = 1.3
- Cost and business case: 2 x 1.0 = 2.0
- Observability: 1 x 1.3 = 1.3
- Launch and operations: 2 x 1.2 = 2.4

Weighted total: 25.9 / 13.3 = **1.95**

The score of 1.95 technically falls in the "not ready" range (0.0-1.9). The prototype-only recommendation reflects a judgment call: the team has enough problem understanding and job definition to build and learn from a synthetic-data prototype, even though the weighted score is borderline. This is an appropriate use of PM judgment — the scoring model is a guide, not a bright line.

## Hard blockers

These are not "areas for improvement." These are reasons the product cannot see patient data.

### 1. No eval set exists (eval readiness: 1)

We have an eval plan. We have golden examples on paper. We have zero implemented scenarios. We cannot measure field accuracy, boundary compliance, or emergency escalation reliability. Without measurement, every other quality claim is a guess.

Building the eval set is the first thing that should happen. It is also the cheapest and lowest-risk work item. If the team cannot create 200 synthetic patient scenarios and get them labeled, the product is not ready for any stage.

### 2. Regulatory and compliance path not started (regulatory readiness: 1)

HIPAA compliance for a patient-facing AI system that handles PHI is not a checkbox. It requires:

- Security risk assessment.
- Technical safeguards (encryption, access controls, audit logging).
- Administrative safeguards (policies, training, incident procedures).
- Physical safeguards (if applicable to infrastructure).
- Business Associate Agreement with any third-party AI provider.
- Documentation that satisfies an auditor.

This can take months and significant legal and security resources. It has not started.

### 3. No observability infrastructure (observability: 1)

The PRD lists what should be observed. Nothing is built. For a product handling health data, observability is not a nice-to-have. It is a compliance requirement. You must be able to demonstrate who accessed what data, when, and what the system did with it.

### 4. No incident response plan

If patient data is exposed, mishandled, or if the AI provides medical advice, what happens? Who is notified? What is the timeline? What is the reporting obligation? These questions do not have answers yet. For health data, the answer to "what is our incident response plan" cannot be "we'll figure it out."

## Recommendation

**Prototype only. Do not pilot. Do not launch.**

This product is not ready to see patient data in any form. The gap between current state and pilot readiness is too large for a "conditions" approach. This is not a case of "close but needs a few things." The foundational work (eval set, regulatory path, security review, legal review, observability) has not started.

### What the prototype should answer

The prototype should use synthetic data only and focus on three questions:

1. Does conversational intake feel natural enough that patients would prefer it to a form? Test with 10-15 staff members role-playing as patients. If they uniformly prefer the form, stop here.
2. Do the boundary enforcement mechanisms hold under adversarial testing? Have the team deliberately try to get the AI to discuss symptoms, medications, and diagnoses. If boundaries break in internal testing, they will break with patients.
3. What is the realistic timeline and cost for HIPAA compliance? Get a concrete estimate from legal and security before committing further resources.

### What must be true before a pilot

All of the following, with no exceptions:

- HIPAA compliance review completed and passed.
- Security penetration testing completed with no critical or high findings.
- Legal review of patient-facing AI liability completed.
- BAA executed with AI provider.
- Consent flow for AI-assisted intake reviewed and approved by legal.
- 200-scenario eval set created and passing at quality bar.
- 100% pass rate on boundary and safety tests.
- Incident response plan documented, reviewed, and tested.
- Observability infrastructure built and verified.
- Staff trained on the system and on incident procedures.
- Patient consent flow reviewed and approved by legal.

This is a long list. That is the point. Health data products have a higher bar, and this product is nowhere near it.

### The harder question

Before investing in the compliance and infrastructure work above, the team should answer: does a well-designed web form with smart validation rules get most of the value at materially lower risk and cost?

If the answer is yes, build the web form. Save the AI conversational layer for a future where the compliance infrastructure already exists and the incremental benefit is clearly worth the incremental risk.

This is the most important recommendation in this case study. Knowing when not to build an AI product is as valuable as knowing how to build one well.

**Reviewed by:** James Rodriguez (VP Product), Dr. Lisa Park (Chief Medical Officer), David Kim (CISO), Rachel Torres (General Counsel)
**Date:** 2026-04-28
