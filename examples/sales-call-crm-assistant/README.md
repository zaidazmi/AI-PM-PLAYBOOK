# Sales call CRM assistant

A medium-risk structured extraction workflow that updates Salesforce from sales call transcripts. The model accuracy is the easy part. The trust envelope around it — consent, calibration, and pilot scoping — is the actual PM job.

## The situation

Sarah Chen is VP Product at a mid-market revenue tooling company. Her team's flagship integration sits in Salesforce. The CRO has been complaining for two quarters that pipeline forecasts are unreliable because reps don't keep their opportunities current. A time-tracking study on 40 AEs showed 45 minutes a day of post-call CRM updates, and audits showed 30% of pipeline fields were empty or stale within five days of a call.

The team prototyped an extractor on Claude Sonnet that reads Gong and Chorus transcripts and proposes updates to five fields: stage, next step, decision criteria, competitor mentioned, and budget signal. The rep sees the proposed updates inside Salesforce, accepts or edits, and the writes go through. The prototype is accurate enough at first glance that the CRO is asking when she can roll it out to "all 80 reps next month."

Sarah brought back a scoped 12-rep, 6-week pilot proposal instead. This case study is the reasoning.

## What's working

- **The problem is real and recurring.** 45 minutes a day per rep is 250+ hours a week across the org. Forecast accuracy improvements would compound quarterly.
- **The workflow is suggest-only with a human in the loop.** Reps approve every write to Salesforce. No silent overwrites of pipeline data — the highest-blast-radius failure mode in a system like this — is structurally impossible in v1.
- **The AI job is sharp.** Five named fields, schema-typed outputs, evidence requirement (every extraction must cite a transcript span). When the model has nothing to cite, the field stays blank instead of being guessed.
- **Cost is small for a sales tool.** Per-call extraction comes in well under $0.10. At the pilot scale, the unit economics are not the question.

## What's not yet ready

The model behaves well in the demo room. The pilot envelope around it has gaps you don't notice until you turn it on for 12 real reps with real customers.

- **Consent flagging is incomplete.** The pilot will process recorded calls; the recording consent flag in Gong is reliable but the Chorus pipeline has 18% missing consent flags during the audit window. Processing a call without a verified consent flag is the kind of unforced error that becomes a legal write-up. Either restrict to Gong-native sources for v1 or do not start.
- **Calibration is unproven.** The model returns a confidence score for each extraction, but the calibration of that score against true accuracy has not been measured. A 0.6 in this model may not mean what a 0.6 means in the next prompt revision. Without a calibration study, the "low confidence → suppress" rule is theatre.
- **Observability misses the only metric that matters.** Acceptance is logged. Edits are not. A rep silently editing every extraction is materially different from accepting them as-is — that's how you find out the model is wrong in a way the accept rate hides.
- **Training is undefined.** A rep who doesn't understand the evidence requirement will treat the proposals as facts. The pilot needs a 20-minute training session and a one-page job aid before day one.

## The verdict, restated

**Pilot, scoped, after blockers close. Not org-wide. Not in four weeks.** The product is good enough that a 12-rep, 6-week controlled pilot is the right learning vehicle. The four blockers above are small but non-negotiable. Skipping them turns the pilot into a pilot of "did we get sued" instead of "did we save time."

The CRO's framing — "all 80 reps next month" — is a reasonable instinct from someone whose job is moving fast. The PM job is to translate that into the smallest experiment that actually decides whether to roll out. That experiment is 12 reps, six weeks, three success metrics, and one consent constraint.

## What would change the verdict

A green light to scale beyond the 12-rep pilot requires all five:

1. Consent flag coverage is verified at 95%+ across the data sources in scope, OR the pilot is restricted to Gong-native sources only.
2. A 50-call calibration study shows the confidence score correlates with extraction accuracy at r > 0.6.
3. The dashboard tracks `accept_no_edit`, `accept_with_edit`, and `reject` separately, with a weekly review.
4. The 12-rep pilot completes 6 weeks with: edit rate < 25% on accepted extractions, zero confirmed bad writes to Salesforce, net-positive rep sentiment.
5. Sales operations signs off on the rollout plan, the training plan, and the rollback procedure.

If any of the five misses, the pilot extends. The decision to scale doesn't move just because the calendar does.
