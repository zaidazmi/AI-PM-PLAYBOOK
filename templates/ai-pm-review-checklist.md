# AI PM 5-minute review gate

Use this in roadmap, design, engineering, legal/security, or launch syncs. It is a fast blocker check, not a full artifact review. If any hard-blocker answer is "no," the decision is hold or do not launch.

**Inputs:** AI PRD, eval plan, risk register, human review workflow, cost model, observability plan, and launch gate checklist as needed.

**Output:** proceed, hold until blocker is closed, or do not launch at this stage.

## Meeting context

- Feature:
- Review type: <!-- roadmap / design / engineering / legal / launch -->
- Decision needed:
- Owner:
- Date:

## The 5-minute gate

| Area | Hard-blocker question | Answer |
|------|------------------------|--------|
| Problem | Do we know the user, workflow, and current non-AI alternative? | <!-- yes/no --> |
| AI job | Is the AI task narrow enough to evaluate and explain? | <!-- yes/no --> |
| Autonomy | Are autonomy levels mapped by action, including what AI must never do? | <!-- yes/no --> |
| Evals | Do we have a golden set, quality bar, or trace-based error analysis for this stage? | <!-- yes/no --> |
| Risk | Are high-severity risks named, owned, and mitigated or explicitly blocking? | <!-- yes/no --> |
| Human review | Are high-impact or irreversible actions reviewed before they matter? | <!-- yes/no --> |
| Rollback | Can AI actions be undone, stopped, or safely escalated? | <!-- yes/no --> |
| Cost | Is there a cost target or ceiling for the workflow? | <!-- yes/no --> |
| Operations | Is observability defined for quality, cost, latency, and user feedback? | <!-- yes/no --> |
| Launch | Is the requested stage clear: prototype, pilot, limited production, or scale? | <!-- yes/no --> |

## Meeting-specific pressure test

Use the row that matches the meeting.

| Meeting | One question that must be answered |
|---------|------------------------------------|
| Roadmap | What evidence says this is worth AI instead of a simpler product path? |
| Design | Where does the user review, edit, reject, undo, or escalate AI output? |
| Engineering | What are the input/output contracts, tool boundaries, and failure states? |
| Legal/security | What data, permissions, retention, user disclosure, or compliance issue could block launch? |
| Launch | What evidence says this stage is safe, and what would trigger rollback? |

Answer:

<!-- One or two sentences. -->

## Automatic hold conditions

Hold the decision if any of these are true:

- [ ] The AI task is too broad to evaluate.
- [ ] There is no quality bar for the requested stage.
- [ ] A high-severity risk has no owner.
- [ ] A human is required but the review workflow is undefined.
- [ ] The AI can take an action that cannot be reviewed, stopped, or rolled back.
- [ ] Data permissioning, legal, security, or compliance review is unclear.
- [ ] Cost can grow without a ceiling or alert.
- [ ] No one owns post-launch monitoring.

## Decision

- [ ] Proceed: evidence is sufficient for the requested stage.
- [ ] Hold until blocker is closed: blocker is specific, assigned, and reversible.
- [ ] Do not launch at this stage: risk, eval, review, compliance, cost, or operations gaps are too large.

Blocker or evidence that mattered most:

<!-- One sentence. -->

Owner:

Reversal condition:

<!-- What would change this decision? -->
