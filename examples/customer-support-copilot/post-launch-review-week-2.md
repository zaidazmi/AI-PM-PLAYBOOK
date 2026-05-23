# Post-launch review: customer support copilot

**Feature:** Customer Support Copilot  
**Pilot week:** Week 2  
**Dates:** 2026-03-04 to 2026-03-10  
**Author:** Maya Patel, PM

## Summary

The pilot is useful, but not ready to expand beyond the top 10 intents. Agents like drafts when KB coverage is strong. Quality drops on multi-intent tickets and older KB articles, so the next move is quality cleanup, not broader rollout.

## What shipped

- Low-confidence fallback now suppresses drafts below `0.6` and shows the top 3 KB articles.
- Accept, edit, reject, escalation, latency, and cost events are live in the dashboard.
- Added 18 pilot failures to the regression set.

## Metrics

| Metric | Week 2 | Target | Status |
|--------|--------|--------|--------|
| Active pilot agents | 8 | 8 | On track |
| Drafts shown | 219 | N/A | Informational |
| Accept rate | 68% | >= 70% | Slightly below |
| Edit rate | 24% | < 25% | On track |
| Reject rate | 8% | < 8% | Watch |
| Low-confidence fallback rate | 14% | 10-20% | On track |
| Escalation rate | 4% | < 5% | On track |
| Hallucinated policy claims | 0 | 0 | On track |
| p95 latency | 4.8s | < 4s | Below |
| Cost per draft | $0.011 | < $0.03 | On track |

## Quality Review

Manual review sample: 40 draft-vs-sent pairs.

| Finding | Count | Notes |
|---------|-------|-------|
| Accurate and sent with minor edits | 27 | Strongest on billing and plan-change intents |
| Missing secondary question | 6 | Mostly multi-intent tickets |
| Tone too generic | 4 | Agents edited before sending |
| Cited stale KB article | 3 | All from cancellation policy articles |

No confirmed hallucinations. The main issue is incompleteness, not fabrication.

## User Feedback

Agents say the drafts save time on routine tickets, but they do not trust the feature for multi-topic tickets yet. Two agents asked for clearer visual separation between “ready to edit” drafts and “use KB only” fallback states.

## Incidents

None.

## Top Failure Modes

1. **Multi-intent tickets:** the draft answers the first issue and misses the second.
2. **Stale KB retrieval:** old cancellation articles still appear in retrieval results.
3. **Latency spikes:** p95 misses target during morning queue peaks.

## Decisions

- Do not expand to top 50 intents yet.
- Keep the pilot on the current 8-agent cohort for one more week.
- Treat multi-intent handling and KB freshness as blockers before production.

## Next Actions

| Action | Owner | Due |
|--------|-------|-----|
| Add 25 multi-intent examples to eval set | ML Lead | 2026-03-14 |
| Remove deprecated cancellation articles from retrieval index | Support Lead | 2026-03-12 |
| Investigate p95 latency during morning peak | Engineering | 2026-03-13 |
| Update review UI state labels for draft vs fallback | Design | 2026-03-16 |
| Re-run full eval after KB cleanup | PM + ML Lead | 2026-03-17 |
