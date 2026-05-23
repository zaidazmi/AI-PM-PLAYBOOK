# AI product requirements document: sales call CRM assistant

## Problem

Sales reps spend 45 min/day on post-call CRM updates. 30% of CRM fields are left empty or outdated. Pipeline forecasting accuracy is directly impacted.

Evidence:

- Time study across 23 reps over 2 weeks showed average 45 min/day on CRM entry.
- CRM audit of 1,200 opportunities showed 30% empty rate on key fields.
- Sales ops reports forecast accuracy at 62%, below the 80% target.

## Goals

- Reduce rep time spent on post-call CRM updates from 45 min/day to under 10 min/day.
- Increase CRM field completion rate from 70% to 95% on the five target fields.
- Zero fabricated evidence in production (no invented quotes or facts).

## Non-goals

- Changing deal stage automatically. Too high-risk for v1.
- Updating deal amount or close date without explicit rep confirmation through a dedicated approval flow.
- Replacing rep judgment on deal health or qualification.
- Processing calls without verified recording consent.
- Summarizing calls for management review. This is a CRM update tool, not a surveillance tool.

## Target users

Account Executives and SDRs who use Salesforce and have Gong or Chorus recording their calls. Starting with the Enterprise AE team (38 reps) who have the highest call volume and the worst CRM hygiene.

## Current workflow

1. Rep joins a sales call. Gong/Chorus records.
2. Rep takes notes during the call (inconsistent quality).
3. After the call, rep opens Salesforce opportunity record.
4. Rep manually updates fields from memory and notes.
5. Rep skips fields they cannot remember or do not prioritize.
6. Manager reviews pipeline with incomplete data.

## Proposed workflow

1. Rep joins a sales call. Gong/Chorus records and transcribes.
2. After the call, the system processes the transcript against the existing CRM record.
3. Rep receives a notification with proposed CRM updates.
4. Rep reviews each proposed update alongside the transcript evidence.
5. Rep accepts, edits, or rejects each field update.
6. Accepted updates are written to Salesforce.
7. Rejected or edited updates are logged for eval improvement.

## AI job statement

> The AI extracts structured CRM fields from sales call transcripts and presents them for rep approval before writing to Salesforce. It uses the call transcript, existing CRM record, and field definitions to produce proposed field updates with transcript evidence and per-field confidence scores.

## Input contract

| Input | Format | Required | Max size | Fallback if missing |
|-------|--------|----------|----------|---------------------|
| Call transcript | Text (from Gong/Chorus API) | Yes | 50,000 tokens | Do not process. Surface "no transcript available." |
| Existing CRM record | JSON (from Salesforce API) | Yes | 5 KB | Process transcript only, flag that existing record was unavailable. |
| Field definitions | JSON config | Yes | 2 KB | Use default field definitions. |
| Recording consent flag | Boolean | Yes | N/A | Do not process. Surface "recording consent not verified." |

## Output contract

| Output field | Type | Always present | Example |
|--------------|------|----------------|---------|
| next_steps | Array of {action, owner, deadline} | Yes (may be empty array) | [{action: "Send pricing proposal", owner: "rep", deadline: "Friday"}] |
| objections | Array of {objection, severity} | Yes (may be empty array) | [{objection: "Concerned about migration timeline", severity: "medium"}] |
| budget_discussed | {mentioned: bool, range: string, confidence: float, evidence: string} | Yes | {mentioned: true, range: "$50-75K", confidence: 0.85, evidence: "we're looking at the fifty to seventy-five thousand range"} |
| timeline_mentioned | {mentioned: bool, details: string, confidence: float, evidence: string} | Yes | {mentioned: true, details: "Decision by end of Q2", confidence: 0.92, evidence: "we need to have this decided before July"} |
| competitor_mentioned | Array of {name, context, evidence} | Yes (may be empty array) | [{name: "Acme Corp", context: "Currently evaluating", evidence: "we're also looking at Acme"}] |
| transcript_quality | {score: float, issues: array} | Yes | {score: 0.72, issues: ["cross-talk detected in minutes 12-15"]} |
| overall_confidence | Float 0-1 | Yes | 0.87 |

Every extracted field must include an `evidence` property containing the exact transcript quote. If the model cannot point to a specific quote, the field must be marked as inferred with confidence below 0.5.

## Autonomy level

- [x] Suggest: AI recommends an action, human accepts or rejects

All five target fields use suggest-only autonomy. The rep must explicitly approve each field update before it writes to Salesforce.

High-risk fields that are out of scope for v1 but relevant for future versions:

- Deal amount changes: would require a dedicated confirmation UI with the old value, new value, and evidence side-by-side.
- Stage changes: would require explicit approval with a "are you sure" confirmation step.
- Close date changes: same as deal amount.

These are not in v1 because the trust relationship with reps has not been established yet.

## Human review rules

- Every proposed CRM update must be reviewed by the rep before writing to Salesforce.
- If overall confidence is below 0.6, surface a warning: "Low confidence extraction. Please review carefully."
- If transcript quality score is below 0.5, surface: "Transcript quality too low for reliable extraction. Manual review recommended."
- If any individual field confidence is below 0.4, visually distinguish it from high-confidence fields.
- Reps can edit any extracted value before approving.

## Quality bar

- 85% field accuracy on the golden eval set (n=200). Field accuracy means the extracted value is correct or an acceptable variation of the correct value.
- Zero fabricated evidence. Every quote in the evidence field must exist verbatim in the transcript.
- False positive rate below 5%. If the model says a competitor was mentioned and no competitor was mentioned, that is a false positive.
- Transcript quality scoring must correctly flag poor-quality transcripts at least 90% of the time.

## Latency target

- p50 under 15 seconds for full extraction (all five fields).
- p95 under 30 seconds.
- Reps are not waiting synchronously. The system processes after the call ends and notifies when ready. Latency matters for freshness, not for blocking the rep.

## Cost constraint

- Target: under $0.05 per call processed. Prototype testing shows $0.03 actual.
- At 38 reps averaging 4 calls/day and 22 working days/month: $0.03 x 38 x 4 x 22 = $100/month at current cost, $167/month at cap.
- At scale (200 reps): $528/month at current cost, $880/month at cap. Well within budget for the CRM accuracy improvement.

## Failure behavior

- On timeout: retry once. If second attempt fails, notify rep that extraction is unavailable and they should update manually.
- On low confidence: present results with clear visual warning. Do not suppress low-confidence results; let the rep decide.
- On malformed output: log the error, skip the extraction, notify the rep. Do not write partial or malformed data to Salesforce.
- On safety trigger: if the transcript contains content flagged by safety filters, skip processing and log the event. Do not surface the flagged content.
- On missing consent: do not process. Surface "Recording consent not verified for this call."
- On poor transcript quality (score below 0.3): surface "Transcript quality too low for reliable extraction" and skip automated extraction.

## Consent and privacy

- Recording consent must be verified before any transcript is processed. The system checks for the consent flag from Gong/Chorus.
- Transcripts are processed but not stored permanently. Extracted fields and evidence quotes are stored; full transcripts are not retained by our system.
- Extracted data inherits the access controls of the Salesforce opportunity record.
- No transcript data is used for model training without explicit opt-in.

## Observability requirements

- Log every extraction: input size, output fields, confidence scores, latency, cost.
- Log every rep action: accept, edit, reject per field.
- Track acceptance rate by field, by rep, and by confidence level.
- Track edit rate (accepted but modified) as a signal of partial accuracy.
- Alert if acceptance rate drops below 70% over a rolling 7-day window.
- Alert if fabricated evidence is detected in any production extraction.
- Weekly report: field accuracy by type, rep adoption rate, time saved estimate.

## Launch gates

- Golden eval set (n=200) passes at 85% field accuracy.
- Zero fabricated evidence on eval set.
- Consent verification flow is implemented and tested.
- Transcript quality scoring is calibrated against 50 manually-rated transcripts.
- Rep training materials are complete and training is scheduled.
- Observability dashboards are live and alerting is configured.
- Rollback plan is documented: ability to disable extraction per rep or globally within 5 minutes.

## Open questions

- How do we handle multi-party calls where the rep is not the primary speaker? Do we still extract, or does this degrade quality enough to skip?
- Should we support languages other than English in v1? Three of the 38 reps conduct calls in Spanish.
- What is the right UX for "partially confident" results? Do we show them inline with a warning, or in a separate "review needed" section?
- How do we handle calls that span multiple opportunities? The rep may discuss several deals in one call.
