# Bad to good AI PRD

Most weak AI PRDs do not fail because they are short. They fail because the AI job is vague, quality is undefined, and failure behavior is missing.

## Bad PRD

> Build an AI assistant that helps support agents answer customer questions faster.

### Why this is weak

It says the product should be "AI" and "faster," but not what the AI actually does, what data it can use, what output is acceptable, who reviews it, or what happens when it is wrong.

That gives engineering permission to guess. The first demo may look good, but no one can tell whether the product is safe, measurable, or ready to launch.

## Better PRD Slice

### Problem

Tier 1 support agents spend 3.1 minutes per supported ticket drafting responses from approved KB articles. The top 10 intents account for 31% of ticket volume and have stable policy answers.

### AI Job

The AI drafts support responses for the top 10 Tier 1 support intents using the customer ticket, recent conversation history, account metadata, and approved KB articles. It produces a draft response, cited KB article IDs, an intent label, and a confidence score for the handling agent to review before sending.

### Non-Goals

- No auto-send.
- No Tier 2 or Tier 3 escalations.
- No unsupported intents.
- No new KB article authoring.
- No policy claims that are not grounded in current KB articles.

### Input Contract

| Input | Required | Fallback |
|-------|----------|----------|
| Latest customer message | Yes | Do not draft |
| Recent conversation history | No | Draft from latest message only |
| Account metadata | No | Avoid account-specific claims |
| Current KB articles | Yes | Show KB search results, no draft |

### Output Contract

| Output | Requirement |
|--------|-------------|
| Draft response | Grounded in cited KB articles |
| Citations | Article IDs must exist and be current |
| Confidence score | `0-1`, calibrated against human review |
| Fallback flag | True when no safe draft should be shown |

### Human Review

Every draft must be reviewed by the handling agent before sending. If confidence is below `0.6`, suppress the draft and show the top 3 KB articles instead.

### Quality Bar

- Zero fabricated policy claims.
- 75% accept rate during pilot.
- Reject rate below 8%.
- Safety-trigger tickets produce escalation, not drafts.
- p95 draft latency below 4 seconds.
- Cost below `$0.03` per draft.

### Launch Gate

Pilot can start only when:

- 100-example eval set is labeled.
- Low-confidence fallback is implemented.
- Accept/edit/reject tracking is live.
- Safety escalation tests pass.
- Legal and security approve disclosure, retention, and tenant data handling.

## What Changed

| Bad PRD | Better PRD |
|---------|------------|
| "AI assistant" | Specific drafting task |
| "Helps agents" | Named user and workflow |
| "Faster" | Accept rate, reject rate, latency, cost |
| No boundaries | Top 10 intents only |
| No source of truth | Approved KB articles |
| No review rule | Agent reviews before sending |
| No failure behavior | Suppress draft below confidence threshold |
| No launch criteria | Pilot blockers and eval requirements |

The better PRD is still short. The difference is that it gives the team a behavioral contract they can build, test, review, and gate.
