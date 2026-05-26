# Healthcare intake assistant

A high-risk patient-facing workflow where the right product decision is not to launch AI yet — and where a smart digital form likely beats the AI version on every dimension that matters. The hardest PM job in this case is saying "no" with enough evidence that "no" survives the next leadership meeting.

## The situation

James Rodriguez is VP Product at a regional outpatient clinic network — fourteen clinics, ~180,000 patient visits a year. After watching a conversational-AI intake demo at the last HIMSS conference, the CEO and Chief Medical Officer both came back asking what it would take to roll something like it across the network. Front desk staff spend roughly 20 minutes per patient on intake. 12% of forms have errors that cause billing rework at $15-25 per claim. The pain is real.

James spent six weeks scoping. He built a prototype on synthetic patient data, ran a HIPAA gap analysis, talked to legal, talked to two BAA-eligible AI providers, and modeled total cost of ownership including compliance, security audit, and incident response. He came back with two recommendations the leadership team did not expect.

First: do not pilot conversational AI with patient data. Not in six months, not in twelve. Keep the prototype alive on synthetic data only, as a hedge.

Second: build a well-designed digital intake form with validation rules and direct EHR integration. It likely captures most of the value of the AI version at a small fraction of the risk and total cost.

This case study is the evidence behind both.

## What's working

There is enough product definition to learn from, even without launching.

- **The problem is well-quantified.** A four-week time study confirms 19.7 minute mean intake time. The 12% error rate is verified against billing rework data. Patient satisfaction is low on the intake step specifically.
- **The AI job, on paper, is appropriately scoped.** Demographics and insurance information only — no clinical questions, no symptoms, no medication history. Hard boundaries. Escalation to human staff on any out-of-scope question. The team has thought carefully about what the AI must never do.
- **The fallback workflow is real.** Paper forms remain available. Staff still review every AI-collected record before EHR entry. If the AI is disabled, intake continues without disruption.

## What's not yet ready — and the gap is structural, not tactical

The dimensions that are weak are not the ones a two-sprint blocker close fixes. They are quarter-long or year-long investments.

- **No eval set exists.** Zero of the 200 planned scenarios have been built. Without a labeled scenario set covering benign cases, ambiguous cases, and adversarial inputs, "the prototype works on synthetic data" is not a measurement, it's an anecdote. The team cannot answer "how often does the AI ask something it shouldn't?" because they have not asked the AI anything they could check.
- **HIPAA compliance work has not started.** A formal HIPAA risk analysis takes 3-6 months. A signed BAA with an AI provider takes weeks of legal negotiation. Tenant data isolation requirements need engineering. None of this is in flight.
- **Total cost of ownership is dramatically understated.** API cost of $0.10/session looks attractive. Compliance setup ($50-100K+), annual security audit, BAA legal review, incident response retainer, and ongoing monitoring infrastructure are unestimated. The financial case against the digital form alternative collapses when these are included.
- **The incremental benefit over a digital form is unproven.** Nobody on the team has run a comparison study. The conversational AI's only proven advantage is the demo video. The digital form's advantages — predictable behavior, no PHI in an LLM, lower cost, faster shipping, real EHR integration — are all measurable and ordinary product work.

## The verdict, restated

**Do not launch. Build the digital form instead. Keep the AI prototype alive on synthetic data only.**

The instinct to say yes here is strong. The CEO wants it, the demo is good, and patient intake is genuinely painful. But the readiness model is doing exactly what it's supposed to do: every dimension that gates a launch in regulated workflows — evals, regulatory readiness, observability, incident response — is at a 1 or a 2. Five-month worth of work would be needed before this product could even legitimately be called a pilot candidate.

In the meantime, a competent digital intake form with validation rules and EHR integration is a 6-8 week build, captures most of the workflow benefit, eliminates the PHI-in-LLM compliance question, and does not require any of the infrastructure above. The non-AI alternative is not a consolation prize. It is the better product for this workflow.

The job of the PM here is not to refuse AI. It is to make sure the team builds the product that actually serves patients, and to use the prototype as a hedge in case the regulatory and tooling landscape shifts enough in 12-18 months to make the AI version viable.

## What would change the verdict

The "prototype only" recommendation moves to "pilot candidate" only when all six are true:

1. HIPAA compliance program is in place, including a signed BAA with the AI provider and a completed third-party security audit.
2. An eval set of 200+ scenarios exists, covering benign / ambiguous / adversarial cases, with measured pass rates against the safety boundaries.
3. PHI-grade observability infrastructure exists: full audit log, no plaintext PHI in dashboards, alerting on boundary violations.
4. A formal incident response plan exists, with a 24-hour on-call rotation specifically for health data incidents and defined patient/regulator notification procedures.
5. A head-to-head comparison study between the digital form and the AI conversational version shows the AI version meaningfully outperforms the form on intake time, error rate, or patient satisfaction — not just matches it.
6. Total cost of ownership including compliance, audit, and incident response is modeled at 18-month and 36-month horizons, and the AI version pencils out at a clear margin over the digital form.

If any of the six is missing, the answer remains "no." Not "not yet, with a date." Just "no."
