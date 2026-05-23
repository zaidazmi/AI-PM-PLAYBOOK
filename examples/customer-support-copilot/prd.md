# AI product requirements document: customer support copilot

## Problem

Tier 1 support agents spend 38% of handle time drafting responses from scattered knowledge base articles. Time studies across 12 agents show 3.1 minutes per ticket on drafting alone. The top 50 intents cover 62% of ticket volume, and these intents have stable, well-documented answers in the KB. Agents are doing repetitive lookup-and-rewrite work that scales linearly with ticket volume.

Evidence:

- 4-week time study across 12 agents, 2,400 tickets
- Template adoption declined from 22% to 11% over 3 months (templates don't handle variation)
- Agent satisfaction surveys cite "repetitive work" as top frustration
- Average handle time has not improved in 6 quarters despite KB improvements

## Goals

- Reduce average drafting time from 3.1 minutes to under 1.5 minutes for supported intents
- Achieve 75% draft accept rate (accepted with minor edits or no edits)
- Keep reject rate below 5% (agent discards draft entirely and writes from scratch)
- Zero hallucinated policy claims in production (any fabricated policy is a severity-1 issue)

## Non-goals

- Automating ticket routing or categorization (separate project)
- Handling Tier 2 or Tier 3 escalations
- Sending responses without agent review
- Replacing the knowledge base or authoring new KB articles
- Supporting intents outside the initial top 10 in v1

## Target users

Tier 1 support agents handling inbound customer tickets via the support platform. Team of 45 agents, 3 shifts, handling roughly 800 tickets per day across all intents. The pilot will start with 8 agents on the day shift.

## Current workflow

1. Agent picks up next ticket from the queue
2. Agent reads the customer message
3. Agent searches the KB using keywords
4. Agent reads 1-3 articles to find the relevant policy
5. Agent drafts a response from scratch, adapting KB content to the customer's situation
6. Agent reviews and sends the response
7. Agent categorizes the ticket

## Proposed workflow

1. Agent picks up next ticket from the queue
2. Agent reads the customer message
3. System displays an AI-drafted response alongside cited KB articles
4. Agent reviews the draft: accepts, edits, rejects, or escalates
5. Agent sends the response (their own or the edited draft)
6. Agent categorizes the ticket

The AI removes steps 3-5 of the current workflow for supported intents. The agent still reads every response before sending. The system never sends anything without agent action.

## AI job statement

> The AI drafts support responses using approved knowledge base articles for Tier 1 agents to review and send, subject to human approval before any customer-facing message.

## Input contract

| Input | Format | Required | Max size | Fallback if missing |
|-------|--------|----------|----------|---------------------|
| Customer ticket text | Plain text (latest message) | Yes | 4,000 chars | Show error, agent drafts manually |
| Conversation history | Array of previous messages | No | Last 10 messages | Draft based on latest message only |
| Customer account metadata | JSON (plan tier, tenure, region) | No | 1 KB | Draft without account-specific details |
| KB article corpus | Pre-indexed vector store | Yes | N/A (system dependency) | Feature unavailable, agent drafts manually |

## Output contract

| Output field | Type | Always present | Example |
|--------------|------|----------------|---------|
| Draft response | String | Yes | "Your billing cycle resets on the 1st of each month..." |
| Cited KB articles | Array of article IDs and titles | Yes | [{"id": "KB-1042", "title": "Billing cycle FAQ"}] |
| Confidence score | Float 0-1 | Yes | 0.82 |
| Intent classification | String | Yes | "billing_cycle_question" |
| Fallback flag | Boolean | Yes | false |

## Autonomy level

- [x] Draft: AI produces output, human reviews before anything happens
- [ ] Suggest: AI recommends an action, human accepts or rejects
- [ ] Act: AI takes action, human can undo
- [ ] Autonomous: AI takes action, no human in the loop

The AI produces a full draft response for the agent to review before anything happens. The agent decides whether to use it, edit it, or ignore it. No customer-facing message is ever sent without the agent pressing send. This is "draft" level, not "suggest," because the AI produces a complete output for review rather than recommending a discrete action. The right level because: (1) support responses go to real customers and errors damage trust, (2) agents are available to review every response since they're already handling the ticket, and (3) the cost of human review is low relative to the cost of a wrong answer.

## Human review rules

- Every AI-drafted response must be reviewed by the handling agent before sending
- Agents can accept the draft as-is, edit it, reject it and write their own, or escalate the ticket
- If the AI flags low confidence (below 0.6), the agent sees a clear visual indicator and the top 3 KB articles instead of a draft
- Agents cannot bulk-accept drafts or auto-send

## Quality bar

- 75% accept rate: agents accept the draft with no edits or minor edits (punctuation, small phrasing changes)
- Less than 5% reject rate: agents discard the draft entirely
- Zero hallucinated policy claims: every factual statement in the draft must be traceable to a current KB article
- Factual accuracy on golden eval set: 100% pass rate (binary, no partial credit)
- Citation relevance on golden eval set: average score above 3.5/5
- Tone appropriateness on golden eval set: average score above 3.5/5

## Latency target

- p50: draft appears within 2 seconds of ticket load
- p95: draft appears within 4 seconds
- Hard timeout: 6 seconds. If no draft within 6 seconds, show "Draft unavailable" and surface top 3 KB articles

## Cost constraint

- Under $0.03 per draft at current model pricing
- Under $1.50 per agent per day at expected usage (50 supported-intent tickets per agent per day)
- Monthly cost for full team (45 agents): under $2,000

Cost is estimated using Claude Sonnet with ~1,500 input tokens (ticket + context + KB snippets) and ~300 output tokens (draft response). This needs validation at actual usage patterns.

## Failure behavior

- On timeout (>6 seconds): show "Draft unavailable, here are possibly relevant articles" with top 3 KB matches. Agent drafts manually.
- On low confidence (<0.6): show "I couldn't find a strong match for this question" with top 3 KB articles. No draft shown. Agent drafts manually.
- On malformed output (missing required fields): log the error, show nothing to the agent, agent drafts manually. Alert engineering if error rate exceeds 1%.
- On safety trigger (self-harm, threats, legal demands): suppress the draft entirely. Show escalation prompt: "This ticket may need immediate escalation." Route to Tier 2 queue.
- On KB retrieval failure: show "Knowledge base temporarily unavailable." Agent drafts manually. Page on-call if retrieval is down for more than 5 minutes.

## Observability requirements

From day one, log and dashboard:

- Accept rate (draft used as-is)
- Edit rate (draft used with modifications) and edit distance
- Reject rate (draft discarded, agent wrote from scratch)
- Retry rate (agent requested a new draft)
- Escalation rate (ticket escalated to Tier 2)
- Confidence score distribution
- Low-confidence fallback rate
- Citation click rate (did the agent click through to the cited KB article?)
- Latency p50, p95, p99
- Cost per draft (actual, not estimated)
- Handle time delta (before vs. after, per intent)
- Error rate (malformed outputs, timeouts, retrieval failures)
- Agent-reported quality issues (thumbs down or free-text feedback)

## Launch gates

Before pilot (8 agents, 2 weeks):

- 80% of the 100-example golden eval set passes all automated checks
- Human grading average above 3.5/5 across all rubric dimensions
- Zero hallucinated policy claims in eval set
- Accept/edit/reject tracking is live and dashboarded
- Low-confidence fallback behavior is implemented and tested
- Safety escalation triggers are tested against 20 adversarial examples
- Agent training completed (30-minute session covering: how drafts work, how to report issues, what to do when drafts are wrong)

Before production (all agents):

- Pilot accept rate above 70%
- Pilot reject rate below 8%
- No severity-1 incidents during pilot
- Handle time reduction is measurable and positive
- Agent feedback is net positive
- Post-launch review cadence is scheduled (weekly for first month)

## Open questions

- How do we handle tickets that span two intents (e.g., billing question + cancellation request)? Do we draft for the primary intent only, or attempt both?
- Should the confidence threshold (0.6) be tunable per intent, or is a single global threshold sufficient for v1?
- How do we feed agent edits back into the system? Manual review of high-edit-distance drafts, or automated fine-tuning pipeline?
- What is the KB article refresh cadence, and who owns flagging outdated articles that the AI might cite?
