# AI opportunity brief: healthcare intake assistant

## Problem

Front desk staff at outpatient clinics spend an average of 20 minutes per patient collecting intake information. This adds up. A clinic processing 40 patients per day burns over 13 staff-hours on intake alone.

12% of intake forms contain errors that cause downstream billing issues. Common errors: wrong insurance ID format, missing group number, misspelled provider names, transposed digits in dates of birth. These errors are caught later by billing staff, creating rework loops that cost roughly $15-25 per corrected claim.

The patient experience is also poor. Patients fill out the same information on paper, then watch a staff member re-enter it into the EHR. They notice when this takes 10 minutes. They notice more when they are asked to repeat information they already wrote down.

## Current workflow

1. Patient arrives and receives a paper or PDF intake form.
2. Patient fills out the form in the waiting room. Handwriting quality varies. Fields are skipped.
3. Front desk staff collects the form and manually enters data into the EHR (Epic, Cerner, or similar).
4. Staff asks the patient to clarify illegible fields, missing fields, or inconsistencies.
5. Data is entered. Errors are not caught until billing review, typically 24-72 hours later.
6. Billing staff flags errors. Front desk or billing staff corrects them, often by calling the patient.

The bottleneck is the paper-to-EHR transcription in steps 3-4, and the error rate that results from it.

## Why AI, and why not deterministic software

A digital form (patient fills out a web form directly) would solve most of the transcription error problem without AI. That should be the first question: do we need AI here, or do we need a web form?

A web form solves:

- Legibility issues (no handwriting).
- Data validation (format checks on insurance IDs, required fields).
- Direct EHR integration (no re-entry).

A conversational AI adds:

- Guidance for patients who struggle with forms (elderly, low literacy, non-native speakers).
- Dynamic follow-up questions based on answers ("You selected Medicare. Is this Medicare Advantage or Original Medicare?").
- Potentially faster and more complete data collection for some patient populations.

The honest assessment: a well-designed web form may capture most of the value here. The AI conversational layer adds incremental benefit for specific populations but comes with significantly higher risk.

The risk profile is the issue. This product handles protected health information (PHI). It interacts with patients directly. It operates under HIPAA. Any failure with health data has legal, financial, and reputational consequences that are qualitatively different from a CRM update error.

## Smallest useful version

AI collects demographics and insurance information only:

- Full name, date of birth, address, phone, email.
- Insurance provider, policy number, group number.
- Primary care physician name.
- Emergency contact.

Hard exclusions from v1 (and possibly from any version):

- No symptoms.
- No medical history.
- No medication lists.
- No clinical information of any kind.
- No triage or urgency assessment.

This is intentionally narrow. The smallest version that tests whether patients will engage with conversational intake without introducing clinical risk.

## What happens if we do nothing

- Error rates stay at 12%. Billing rework continues.
- Staff time stays at 20 min/patient. Staffing costs remain high.
- Patient experience during intake remains mediocre.
- No new risk is introduced.

The "do nothing" outcome is stable. The clinic is not in crisis. The intake process is inefficient and error-prone, but it works. Patients get seen. Bills get processed, eventually.

This matters for the decision. When "do nothing" is stable and the proposed alternative introduces significant new risk (PHI exposure, HIPAA compliance, patient-facing AI), the bar for "pursue" is higher.

## Risks already visible

- HIPAA compliance: any system handling PHI must meet HIPAA security and privacy requirements. This is not negotiable and not fast.
- Patient-facing AI: patients interacting directly with AI in a healthcare context creates trust and liability risks that do not exist in internal tools.
- Data storage: where does the conversational data live? Who has access? How long is it retained? These questions require legal and compliance answers before development.
- Vulnerable populations: elderly patients, patients in pain, patients with low tech literacy may not be well-served by a conversational AI. The tool must not become a barrier to care.
- Scope creep into clinical territory: the pressure to add "just one more field" will eventually push into symptoms and medical history. The boundary must be enforced at the product level, not left to the model.
- Emergency handling: a patient might describe an emergency during intake. The system must immediately transfer to a human. Failure here is a patient safety issue.

## Decision

- [ ] Pursue: commit to a build brief and eval plan
- [x] Prototype: time-boxed spike to answer specific unknowns
- [ ] Defer: revisit in Q4
- [ ] Reject: not worth pursuing

The prototype should answer:

1. Will patients engage with conversational intake, or do they prefer forms?
2. Can the system reliably stay within the demographics/insurance boundary?
3. What does the HIPAA compliance path look like (timeline and cost)?

The prototype must not use real patient data. Use synthetic data only.

**Decided by:** James Rodriguez, VP Product
**Date:** 2026-04-20
