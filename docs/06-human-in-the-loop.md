# Human-in-the-loop design

> **The failure this prevents:** the team adds human review as a checkbox but nobody actually reads the outputs. Reviewers rubber-stamp AI suggestions under time pressure, errors compound silently, and when a serious mistake surfaces, the "human review" that was supposed to catch it was theater. This guide covers how to design review that works under real conditions.

## Contents

- [When to require human review](#when-to-require-human-review)
- [Confidence thresholds](#confidence-thresholds)
- [Escalation policy design](#escalation-policy-design)
- [Review UX](#review-ux)
- [Feedback loops](#feedback-loops)
- [Review theater](#review-theater)
- [Measuring review quality](#measuring-review-quality)
- [Next steps](#next-steps)

A major driver of user trust in AI products is whether a human validated the output when stakes are high. Users do not see your eval scores. They see whether someone they trust checked the work.

Human-in-the-loop is not a fallback for bad AI. It is a product design pattern that determines when humans review, how they review, and what happens with their feedback.

## When to require human review

Require human review when the action meets any of these criteria:

- Irreversible: the action cannot be undone. Sending an email, submitting a legal filing, publishing content, processing a payment.
- Customer-facing: the output goes directly to a customer or external party. Internal drafts can tolerate more autonomy than external communication.
- Financial: the action involves money. Creating invoices, adjusting pricing, approving expenses, generating financial reports.
- Health or safety: the output could affect someone's health, safety, or physical wellbeing. Medical advice, safety protocols, equipment recommendations.
- Legal: the output could create legal obligations or exposure. Contract clauses, compliance statements, regulatory submissions.
- Identity or permissions: the action changes who has access to what. Account creation, permission changes, credential management.

If you are unsure whether something needs human review, it needs human review. The cost of unnecessary review is time. The cost of missing necessary review is incidents.

## Confidence thresholds

Not every output needs the same level of review. Confidence thresholds let you route outputs based on the model's certainty.

The approach:

- Above the high threshold (e.g., 0.95): auto-approve only for low-risk, reversible actions where eval data proves reliability. For customer-facing, regulated, financial, legal, health, identity, or irreversible actions, use expedited human review rather than full auto-approval.
- Between high and low thresholds (e.g., 0.75-0.95): human review required. The model is uncertain enough that a human should check.
- Below the low threshold (e.g., 0.75): auto-reject or escalate. The model is not confident enough to produce useful output. Route to a human to handle from scratch.

Setting these thresholds requires data. Start with human review on everything, measure the model's confidence scores alongside human judgments, and calibrate the thresholds based on where the model is reliably correct vs unreliable.

Important: confidence scores from LLMs are often poorly calibrated. A model that says it is 90% confident might only be correct 70% of the time. Calibrate against your actual data, not the model's self-reported confidence.

## Escalation policy design

An escalation policy answers: who reviews, how fast, and what happens when the queue backs up.

Components:

**Reviewer assignment**: who reviews what? Match reviewers to the domain. A customer support lead should review support responses. A legal analyst should review contract outputs. Generic review by anyone who is available produces low-quality review.

**SLA targets**: how quickly must a review happen? For customer-facing outputs, 15-30 minutes might be required. For internal reports, same-day might be fine. Define SLAs by output type, not globally.

**Queue management**: what happens when the review queue grows faster than reviewers can clear it? Options: route overflow to a secondary reviewer pool, auto-hold outputs until reviewed (accept slower output over unreviewed output), temporarily raise the confidence threshold to reduce the volume entering review.

**Escalation path**: what happens when a reviewer is unsure? They need a clear path to escalate to a subject matter expert or manager. Without this, uncertain reviewers either approve everything (dangerous) or reject everything (wasteful).

Document all of this. A verbal agreement about "the team will review stuff" is not an escalation policy.

## Review UX

The review interface determines whether reviewers are effective or just clicking buttons. Fast, well-designed review UX matters more than most PMs realize.

What makes review fast:

- Show the AI output alongside the relevant context (the user's question, retrieved documents, prior conversation) so reviewers do not have to hunt for information
- Highlight changes from the original input or from previous versions
- Provide one-click approve and reject buttons with optional feedback fields
- Let reviewers edit the output inline rather than rejecting and rewriting from scratch
- Show the confidence score and what drove it

What makes review painful:

- Forcing reviewers to switch between multiple systems to see context
- Requiring lengthy justifications for every approve/reject decision
- Making edit harder than rewrite
- Not showing why the AI produced this particular output
- Queuing items without priority or categorization

Measure review time per item. If reviews average 3 minutes each and you have 200 per day, that is 10 hours of reviewer time daily. Product design decisions that cut review time from 3 minutes to 1 minute save you 6.5 hours per day.

## Feedback loops

Reviewer corrections are the highest-quality training signal you have. When a reviewer edits an AI output before approving it, the diff between the original and edited version tells you exactly what the model got wrong.

Capture:

- The original AI output
- The reviewer's edits
- The reviewer's reason for editing (if provided)
- The final approved output

Use this data to:

- Add failure cases to your eval set
- Identify systematic errors (the model always gets X wrong)
- Fine-tune or adjust prompts to address recurring corrections
- Track whether the model improves on the issues reviewers flag

This creates a virtuous cycle: the model gets better, reviewers have less to correct, review time drops, and you can expand automation only where the risk model allows it.

Without this feedback loop, you are paying for human review without getting the learning benefit. That is expensive and static.

## Review theater

The most dangerous anti-pattern in human-in-the-loop design is review theater. This is when humans are nominally reviewing AI outputs but not actually reading them carefully.

Signs of review theater:

- Average review time under 10 seconds for complex outputs
- Approval rate above 98% sustained over weeks
- Reviewers approve items faster than they could read them
- No edits, ever
- Reviewer feedback is always empty

Review theater happens when:

- The review interface is tedious and reviewers take shortcuts
- Reviewers are overloaded and rushing
- Reviewers believe the AI is always right and stop checking
- There are no consequences for approving bad outputs
- Review quality is not measured

Countermeasures:

- Inject known-bad outputs into the review queue periodically (canary items). If reviewers approve them, you know review quality has degraded.
- Measure review time and flag items approved suspiciously fast
- Audit a random sample of approved items weekly
- Set a maximum approval rate threshold. If approval rate exceeds 99%, either the AI is perfect (unlikely) or reviewers are rubber-stamping.
- Rotate reviewers to prevent automation complacency

## Measuring review quality

Track these metrics:

- Review accuracy: percentage of reviewer decisions that match a senior reviewer's judgment on a sample
- Inter-reviewer agreement: do different reviewers make the same decision on the same item?
- Canary detection rate: percentage of injected bad items that reviewers correctly reject
- Review time distribution: look for bimodal distributions (some items reviewed carefully, others rubber-stamped)
- Correction rate: percentage of items that reviewers edit before approving

If review accuracy drops below 85%, your human-in-the-loop system is not providing the safety guarantee you think it is. Fix the process before expanding the product's autonomy.

## Next steps

- Design your review workflow, reviewer assignments, and SLAs using the [Human Review Workflow template](../templates/human-review-workflow.md).
- Feed reviewer corrections back into your eval set as described in the [Eval Design guide](01-eval-design.md) to close the feedback loop.
