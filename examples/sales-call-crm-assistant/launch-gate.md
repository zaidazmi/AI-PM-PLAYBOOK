# Launch gate: sales call CRM assistant

## Readiness scores

| Dimension | Score | Evidence | Key risk |
|-----------|-------|----------|----------|
| Problem fit | 4 | Time study (23 reps, 2 weeks) confirms 45 min/day on CRM. 30% field empty rate verified by CRM audit. Reps actively want this. | Problem is real but reps may not change behavior if review UX is clunky. |
| Workflow fit | 4 | Fits existing post-call workflow: reps already open Salesforce after each call. No new tools required. Rep review step designed with accept/edit/reject per field. | Review step adds friction. If reps find it faster to just type, adoption fails. |
| AI job definition | 4 | AI job is specific: extract 5 fields from transcript, present with evidence for approval. No ambiguity about scope. | Scope pressure to add more fields or auto-write will come quickly. Must hold the line on v1 scope. |
| Data readiness | 2 | Transcripts available via Gong API. Salesforce API access confirmed. Consent flag exists but not consistently populated. | Consent flag coverage is 82%. 18% of calls have no consent verification, meaning those calls cannot be processed. No automated consent check or transcript quality filtering in place. |
| Eval readiness | 3 | 200-example golden set is designed and labeling is in progress. 50 examples complete. Quality rubric defined. Automated evidence verification built. Prototype eval on the 50 labeled examples shows 87% field accuracy (see eval plan, regression plan section). | Only 50 of 200 examples are labeled. 87% on a 50-example sample has a confidence interval wide enough that true accuracy could be below the 85% production threshold. Full set needed before production. |
| System behavior | 2 | Prompt pipeline built and tested on 50 examples. Confidence scoring implemented but not calibrated against ground truth. Transcript quality detection prototyped on 12 transcripts. | Confidence scores may mislead reps if not validated against actual accuracy. Quality scoring needs 50+ manually-rated transcripts. No load testing done. |
| Risk and safety | 3 | Consent flow designed. Fabrication detection automated. Privacy controls specified. | Consent verification flow is designed but not built. This is a hard blocker for production. Pilot can proceed with manual consent verification. |
| Regulatory readiness | 3 | Legal review of recording consent requirements completed. Data retention policy specified. Consent flag exists in call metadata. | Automated consent verification and retention/export controls are not verified in staging. |
| Cost and business case | 4 | $0.03 per call in testing (under the $0.05 target). 12-rep pilot at ~$32/month. Full team (38 reps) at ~$100/month. API cost is low enough that the pilot can focus on whether extracting five target fields measurably reduces CRM update effort. | Total time savings are not yet proven because v1 excludes stage, amount, and close-date updates. Need pilot measurement before claiming broad CRM-time reduction. |
| Observability | 2 | Logging spec complete. Dashboard mockups reviewed by sales ops. Alerting rules defined. | Dashboards not built. Logging in dev only, not staging. No alerting configured. Fabrication events would go undetected without manual review. Must be live before pilot. |
| Launch and operations | 3 | Rollback plan documented. Pilot cohort identified (12 reps from Enterprise team). Success criteria defined. | No rep training yet. Training materials drafted but not reviewed by sales enablement. |

## Overall score

**3.07 / 5.0**

Weighted calculation:

- Problem fit: 4 x 1.1 = 4.4
- Workflow fit: 4 x 1.1 = 4.4
- AI job definition: 4 x 1.2 = 4.8
- Data readiness: 2 x 1.2 = 2.4
- Eval readiness: 3 x 1.5 = 4.5
- System behavior: 2 x 1.0 = 2.0
- Risk and safety: 3 x 1.4 = 4.2
- Regulatory readiness: 3 x 1.3 = 3.9
- Cost and business case: 4 x 1.0 = 4.0
- Observability: 2 x 1.3 = 2.6
- Launch and operations: 3 x 1.2 = 3.6

Weighted total: 40.8 / 13.3 = **3.07**

## Key risks

### Consent, privacy, and retention

The consent verification flow is the single biggest risk. 18% of calls lack consent flags today. Processing those calls would create legal exposure. The flow is designed but not implemented. For a pilot, we can manually verify consent for the 12-rep cohort. For production, the automated flow must be built and tested, and retention/export controls must be verified in staging.

### Data quality

Transcript quality varies significantly. Cross-talk, poor phone audio, and heavy accents degrade transcription accuracy. When the transcript is bad, the extraction will be bad. The transcript quality scoring exists in prototype but is not calibrated against enough examples to trust.

### Over-trust

The most subtle risk. If reps start auto-approving every suggestion without reading, we have replaced "reps skip CRM updates" with "reps approve wrong CRM updates." The review UX must make it easy to scan evidence, and we need to monitor the time reps spend on review. If median review time drops below 10 seconds per extraction, reps are not reading.

## Recommendation

**Pilot candidate after blockers.**

This product is worth preparing for a 12-rep pilot, but it should not start the pilot yet. The problem is real, the AI job is narrow, and the workflow keeps humans in control; however, data permissioning, confidence calibration, observability, and training need to be ready before real call transcripts enter the pilot.

### Blockers before pilot

1. Consent verification: define and execute consent verification for all pilot calls. Automate before production.
2. Observability: dashboards and alerting must be live before the pilot starts. The team cannot learn from a pilot they cannot observe.
3. Confidence and transcript quality calibration: calibrate confidence scoring and transcript quality scoring against 50+ manually-rated examples.
4. Rep training: complete a 30-minute training session with the pilot cohort covering how to review suggestions, what the confidence scores mean, and why they should not auto-approve.
5. Data controls: verify transcript retention and export controls for pilot data.

### Why not full production

Additional gaps keep this out of production:

1. The consent verification flow is designed but not built. A controlled pilot can use a narrow verification process. Production cannot.
2. The eval set is 25% complete. We need the full set to have confidence in accuracy claims across transcript types, call lengths, and audio quality levels.
3. Transcript retention and export controls must be verified in staging. Production needs proof that call data handling matches policy.
4. Load testing has not been completed.

### Pilot success criteria

- Field accuracy above 85% based on manual review of a sample of pilot extractions.
- Rep acceptance rate above 70%.
- Zero fabricated evidence incidents.
- Reps report net time savings (measured by survey and CRM update timestamps).
- No consent-related incidents.

### Timeline

- Pilot preparation: 1-2 weeks to close the pre-pilot blockers.
- Pilot: 4 weeks with 12 reps after blockers close.
- Production decision: end of pilot, contingent on closing the four gaps above.
- Production launch: 2-3 weeks after pilot conclusion, if gaps are closed.

**Reviewed by:** Sarah Chen (VP Product), Marcus Webb (Sales Ops), Priya Sharma (Legal)
**Date:** 2026-02-19
