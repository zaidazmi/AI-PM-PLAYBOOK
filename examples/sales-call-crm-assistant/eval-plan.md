# AI eval plan: sales call CRM assistant

## Task definition

Extract five structured CRM fields (next steps, objections, budget discussed, timeline mentioned, competitor mentioned) from a sales call transcript. Each extracted field must include evidence in the form of a verbatim transcript quote.

## Evaluation dataset

- Source: 200 real call transcripts from Gong, sampled from the Enterprise AE team. Anonymized (company names replaced, but structure preserved).
- Size: 200 examples for production launch. 50 examples for prototype validation.
- Selection method: stratified by call type (discovery, demo, negotiation, follow-up), transcript quality (clean, moderate, poor), and call length (under 15 min, 15-45 min, over 45 min).
- Labeler: two senior AEs independently labeled each transcript. Disagreements resolved by sales ops lead. Labeling instructions specified exact field values and the transcript quote that supports each value.

## Golden examples

### Happy path: clean budget extraction

**Input:** 42-minute discovery call transcript. Prospect says: "We've allocated between fifty and seventy-five thousand for this initiative, but we'd need to see ROI within six months to justify that spend."

**Expected output:**
```json
{
  "budget_discussed": {
    "mentioned": true,
    "range": "$50-75K",
    "confidence": 0.92,
    "evidence": "We've allocated between fifty and seventy-five thousand for this initiative, but we'd need to see ROI within six months to justify that spend."
  },
  "timeline_mentioned": {
    "mentioned": true,
    "details": "ROI expected within 6 months",
    "confidence": 0.88,
    "evidence": "we'd need to see ROI within six months to justify that spend"
  }
}
```

**Why this matters:** this is the core capability. If the model cannot reliably extract explicit budget and timeline signals with accurate evidence, the product does not work.

### Edge case: implied budget, not stated directly

**Input:** 28-minute call. Prospect says: "I'd need to loop in our CFO for anything in that ballpark" after the rep mentions a $100K price point. No explicit budget number from the prospect.

**Expected output:**
```json
{
  "budget_discussed": {
    "mentioned": true,
    "range": "Requires CFO approval at ~$100K level",
    "confidence": 0.45,
    "evidence": "I'd need to loop in our CFO for anything in that ballpark"
  }
}
```

**Why this matters:** the model should flag implied budget signals but with low confidence. If it confidently reports "$100K budget" that is wrong. The prospect did not state a budget. The model needs to distinguish between explicit and inferred information, and the confidence score must reflect that distinction.

### Unacceptable output: fabricated competitor

**Input:** 35-minute demo call. No competitor is mentioned at any point in the transcript. The prospect asks general questions about differentiation but does not name any alternative.

**Unacceptable output:**
```json
{
  "competitor_mentioned": [
    {
      "name": "Salesforce Einstein",
      "context": "Prospect is evaluating",
      "evidence": "We're also looking at what Salesforce offers natively"
    }
  ]
}
```
Where the evidence quote does not exist in the transcript.

**Why this is unacceptable:** fabricated evidence is the highest-severity failure. If a rep sees a competitor mention backed by a quote that looks real, they will update their deal strategy based on false information. This erodes trust in the tool permanently and could lead to wrong competitive responses. Zero tolerance.

### Safety boundary: missing recording consent

**Input:** call transcript where the recording consent disclaimer is absent. The call begins mid-conversation without the standard "this call is being recorded" notice.

**Expected behavior:** the system checks the consent flag. If consent is not verified, it refuses to process the transcript and surfaces: "Recording consent not verified for this call. Transcript not processed."

**Why this matters:** processing calls without verified recording consent creates legal liability. Some jurisdictions require all-party consent. The system must not extract data from calls where consent is unclear, regardless of how useful the extraction would be.

## Quality rubric

| Criterion | Pass | Fail |
|-----------|------|------|
| Field accuracy | Extracted value matches ground truth or is an acceptable variation (e.g., "$50-75K" vs "$50,000-$75,000") | Extracted value is materially wrong, missing when present, or present when absent |
| Evidence grounding | Quoted text exists verbatim in the transcript | Quote is paraphrased, truncated to change meaning, or fabricated |
| Confidence calibration | High-confidence extractions (>0.8) are correct >90% of the time. Low-confidence (<0.5) are correct <60% of the time | Confidence scores do not correlate with actual accuracy |
| False positive rate | Less than 5% of fields report information that is not in the transcript | More than 5% of fields contain information not supported by the transcript |
| Consent enforcement | System refuses to process when consent flag is false | System processes transcript despite missing consent |
| Transcript quality detection | Poor transcripts (cross-talk, garbled audio) are flagged >90% of the time | Poor transcripts are processed without warning |

## Automated checks

- [x] Output schema validation (all required fields present, correct types)
- [x] Evidence verification: every evidence string must be a substring match against the source transcript
- [x] Confidence range validation: all confidence scores between 0.0 and 1.0
- [x] Empty array validation: fields with no data must return empty arrays, not null or omitted
- [x] Consent flag check: extraction must not produce output when consent is false
- [x] Fabrication detection: cross-reference all competitor names and budget figures against transcript text

## Prototype eval results

Prototype eval on the first 50 labeled examples (stratified across call types and transcript quality levels): 87% field accuracy. Zero fabricated evidence detected. Confidence calibration not yet tested. This result is directional, not launch-grade. The sample is too small and too skewed toward clean transcripts to extrapolate to production. Full 200-example eval required before any production decision.

## Regression plan

- Regression suite size: 50 examples (subset of the full 200, covering all edge case categories)
- Run frequency: on every prompt change, model change, or pipeline code change
- Alert if: field accuracy drops more than 3% vs. baseline, or any fabricated evidence is detected

## Online metrics

| Metric | Definition | Target | Alert threshold |
|--------|------------|--------|-----------------|
| Field acceptance rate | % of proposed fields accepted by reps without edits | >75% | Below 70% over 7 days |
| Field edit rate | % of proposed fields accepted with modifications | <20% | Above 30% over 7 days |
| Field rejection rate | % of proposed fields rejected entirely | <10% | Above 15% over 7 days |
| Fabricated evidence rate | % of extractions where evidence does not match transcript | 0% | Any single instance |
| Extraction latency p50 | Time from transcript available to extraction complete | <15s | Above 25s |
| Cost per extraction | Total model cost per call processed | <$0.05 | Above $0.08 |
| Rep adoption rate | % of eligible reps who review extractions within 4 hours | >80% | Below 60% |
| Transcript quality flag rate | % of transcripts flagged as poor quality | Informational | Above 30% (indicates systemic audio issues) |

## Launch threshold

- 85% field accuracy on the full 200-example golden set.
- Zero fabricated evidence on the full golden set.
- Evidence verification automated check passes on 100% of outputs.
- Confidence calibration meets the rubric criteria above.
- False positive rate below 5%.
- Consent enforcement passes on all consent-related test cases.

## Review cadence

- Pre-launch: run full eval on every prompt or model change. Run regression suite on every code change.
- Post-launch week 1-4: review online metrics daily. Sample 20 extractions per week for manual quality review.
- Post-launch month 2-3: review online metrics weekly. Sample 10 extractions per week for manual review.
- Post-launch month 4+: review online metrics bi-weekly. Sample 10 extractions per week. Re-run full eval monthly or on any model/prompt change.
