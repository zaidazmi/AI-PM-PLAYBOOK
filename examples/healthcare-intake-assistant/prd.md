# AI product requirements document: healthcare intake assistant

This PRD describes the target product. The current recommendation is prototype only. This document exists to define what we would need to build and to make the gaps between current state and launch readiness visible. It is not a commitment to build.

## Problem

Front desk staff spend 20 min/patient on intake data entry. 12% of forms contain errors causing billing rework at $15-25 per corrected claim. Patients dislike the process.

Evidence:

- Time study across 3 clinics, 450 patient visits: mean intake time 19.7 minutes.
- Billing audit of 2,000 claims: 12.3% required corrections traceable to intake errors.
- Patient satisfaction survey: intake process rated 2.8/5, lowest of any pre-visit touchpoint.

## Goals

- Reduce intake data entry errors from 12% to under 3%.
- Reduce staff time per patient intake from 20 min to under 8 min.
- Maintain or improve patient satisfaction with the intake process.
- Zero exposure of PHI outside HIPAA-compliant infrastructure.

## Non-goals

- Collecting any clinical information (symptoms, medical history, medications, allergies).
- Triage or urgency assessment.
- Diagnosis suggestion of any kind.
- Medical advice of any kind.
- Replacing front desk staff. This augments their workflow.
- Supporting walk-in emergencies. This is for scheduled appointments only.

## Target users

Patients with scheduled appointments at outpatient clinics. Starting with a single clinic (Main Street Family Practice, 40 patients/day) if the product ever moves beyond prototype.

Secondary users: front desk staff who review and confirm AI-collected data before EHR entry.

## Current workflow

1. Patient arrives for scheduled appointment.
2. Patient receives paper/PDF intake form.
3. Patient fills out form (5-10 min).
4. Staff enters data into EHR (10-15 min per patient).
5. Errors caught 24-72 hours later by billing.
6. Corrections require patient callbacks.

## Proposed workflow

1. Patient arrives or checks in via kiosk/tablet.
2. Patient is offered a choice: conversational AI intake or paper form. Paper form is always available.
3. If AI intake: patient interacts with conversational interface to provide demographics and insurance information.
4. AI presents collected information back to patient for confirmation.
5. Staff reviews AI-collected data on their screen. Staff confirms or corrects before EHR entry.
6. Confirmed data is entered into EHR.

The patient always has the option to stop and switch to a paper form at any point.

## AI job statement

> The AI collects structured patient demographics and insurance information through a conversational interface. It uses a predefined set of required fields and validation rules to guide the conversation, producing a structured data record for staff review before EHR entry. It must never collect clinical information, suggest diagnoses, or provide medical advice.

## Input contract

| Input | Format | Required | Max size | Fallback if missing |
|-------|--------|----------|----------|---------------------|
| Patient consent acknowledgment | Boolean (confirmed via UI) | Yes | N/A | Do not start AI intake. Offer paper form. |
| Appointment context | JSON (appointment type, provider name) | No | 1 KB | Proceed without appointment context. |
| Required field definitions | JSON config | Yes | 2 KB | Use default demographics + insurance field set. |
| Insurance provider list | JSON (valid providers for this clinic) | Yes | 50 KB | Accept free-text but flag for staff review. |

## Output contract

| Output field | Type | Always present | Example |
|--------------|------|----------------|---------|
| patient_name | {first: string, middle: string, last: string} | Yes | {first: "Maria", middle: "L", last: "Santos"} |
| date_of_birth | ISO date string | Yes | "1985-03-14" |
| address | {street, city, state, zip} | Yes | Standard US address format |
| phone | string (E.164 format) | Yes | "+14155551234" |
| email | string | No | "maria.santos@email.com" |
| insurance_provider | string | Yes | "Blue Cross Blue Shield" |
| policy_number | string | Yes | "BCB123456789" |
| group_number | string | If applicable | "GRP-5678" |
| primary_care_physician | string | No | "Dr. Sarah Kim" |
| emergency_contact | {name, relationship, phone} | Yes | Standard format |
| completion_status | enum: complete, partial, abandoned | Yes | "complete" |
| fields_needing_review | array of field names | Yes (may be empty) | ["group_number", "primary_care_physician"] |

## Autonomy level

- [x] Suggest: AI collects information and presents it for staff confirmation

Every field requires staff review and confirmation before EHR entry. The AI never writes to the EHR directly. There is no auto-approve, no batch approve, no "trust the AI" shortcut.

This is not negotiable for health data.

## Hard boundaries

These are not guidelines. They are absolute constraints that must be enforced at the system level, not just the prompt level.

1. The AI must never ask about symptoms, pain, medical conditions, medications, allergies, or any clinical information.
2. The AI must never suggest a diagnosis, possible condition, or treatment.
3. The AI must never provide medical advice, even if asked directly by the patient.
4. The AI must never access, reference, or reveal another patient's information.
5. The AI must never store conversational data outside HIPAA-compliant infrastructure.
6. The AI must never continue a conversation after a patient describes an emergency. It must immediately display: "Please speak with our staff right away" and alert the front desk.
7. The AI must never make the patient feel that using the AI is required. The paper form alternative must be clearly available at all times.

Enforcement: these boundaries must be tested with adversarial inputs as part of the eval plan. Prompt-level instructions alone are insufficient. System-level guardrails (input/output filters, topic classification) are required.

## Human review rules

- Every field collected by the AI must be reviewed by front desk staff before EHR entry.
- Staff must confirm patient identity against a government ID (not delegated to AI).
- If the AI flags any field for review, staff must verify directly with the patient.
- If the patient abandons the AI intake, staff must complete intake manually via paper form.
- Staff can override any AI-collected value.

## Quality bar

- Field accuracy: 95% match between AI-collected data and patient-verified ground truth on the eval set (n=200 synthetic patients).
- Boundary compliance: 100% pass rate on boundary test cases. The AI must never cross into clinical territory.
- Emergency handling: 100% correct escalation on emergency test cases.
- Completion rate: at least 80% of patients who start AI intake should complete it without abandoning.

## Latency target

- Conversational response time: under 2 seconds per turn.
- Total intake time: under 5 minutes for a complete demographics + insurance collection.

## Cost constraint

- Under $0.10 per patient intake session.
- At 40 patients/day, roughly $4/day or $80/month per clinic.
- Cost is not the constraint here. Risk is.

## Failure behavior

- On timeout: display "We're experiencing a delay. You can continue waiting or switch to a paper form." Offer paper form link/button.
- On low confidence: flag the field for staff review. Do not guess.
- On malformed output: do not present to patient. Log the error. Offer paper form.
- On clinical boundary violation attempt: display a scripted response ("I can only help with your contact and insurance information. For medical questions, please speak with your care team.") and redirect the conversation.
- On emergency mention: immediately display escalation message and alert front desk staff. Do not continue the conversation.
- On patient frustration or confusion: offer to switch to paper form. Do not persist.

## Consent and privacy

- Explicit patient consent is required before AI interaction begins. The consent screen must explain: what data will be collected, that it is AI-assisted, that a paper form is available as an alternative, and how the data will be used.
- All data must be processed and stored within HIPAA-compliant infrastructure.
- Conversational logs are retained only as long as required for the intake session and immediate staff review. Retention policy must be defined with legal.
- No conversational data is used for model training.
- Business Associate Agreement (BAA) required with any third-party AI provider.

## Regulatory requirements

- HIPAA Privacy Rule and Security Rule compliance.
- State-specific health data privacy laws (vary by jurisdiction).
- ADA compliance for the patient-facing interface.
- Security review and penetration testing before any patient data flows through the system.
- Legal review of liability for AI-collected intake data.

## Observability requirements

- Log every intake session: start time, end time, completion status, fields collected, fields flagged for review.
- Log every boundary test: if the patient asks about symptoms or clinical information, log that the boundary was triggered and the AI's response.
- Log every emergency escalation.
- Track completion rate, abandonment rate, and abandonment point (which question was the patient on when they stopped).
- Track staff correction rate per field.
- Track patient satisfaction (optional post-intake survey).
- Alert on any boundary violation (AI provides clinical information, diagnosis, or advice).
- Alert on any data storage outside compliant infrastructure.

## Launch gates

Before any patient interaction (even a pilot):

- HIPAA compliance review completed and passed.
- Security review and penetration testing completed.
- Legal review of patient-facing AI liability completed.
- BAA executed with AI provider.
- Eval set of 200 synthetic patient scenarios completed and passing at quality bar.
- 100% pass rate on boundary and safety test cases.
- Incident response plan for health data breaches documented and reviewed.
- Staff training completed.
- Patient consent flow reviewed by legal and implemented.
- ADA compliance review completed.

## Open questions

- Is the incremental benefit of conversational AI over a well-designed web form sufficient to justify the HIPAA compliance cost and ongoing risk?
- What is the realistic timeline and cost for HIPAA compliance if we use a third-party LLM provider?
- How do we handle patients who speak limited English? Is multilingual support in scope, and does it change the risk profile?
- What is our liability if a patient provides clinical information to the AI despite boundaries, and that information is not acted upon?
- Would a digital form with smart validation rules capture most of the benefit at materially lower risk? This question should be answered before investing in the AI approach.
