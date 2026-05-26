# Customer support copilot

A medium-risk AI drafting workflow for Tier 1 support agents. The team has a working demo, leadership wants to ship next quarter, and the right answer is "pilot after blockers" — not "launch."

## The situation

Maya Patel is the PM for the Service Cloud at a 600-person B2B SaaS company. Tier 1 support handles 2,400 tickets a week, and a four-week time study showed agents spending 38% of their handle time drafting replies from a 400-article knowledge base. The top 50 intents cover 62% of volume. Templates were tried two years ago and adoption collapsed from 22% to 11% in three months because the templates were too generic to use as-is.

Eight weeks ago an engineer prototyped a draft generator on Claude Sonnet wired to the existing KB retrieval pipeline. The demo at the last leadership review was tight: a manager clicked an example ticket and watched a clean, on-brand reply appear in two seconds. The CRO asked if it could ship by end of quarter. Engineering said yes. The CFO asked what it costs. Maya said she'd come back with a real answer.

This case study is what Maya brought back.

## What's working

- **Problem fit is real and well-measured.** The time study is from twelve agents over a month, not a hand-wave. Top 10 intents alone cover 31% of volume — even a copilot that helps on those is meaningful.
- **The AI job statement is tight.** "Draft support responses using approved knowledge base articles for Tier 1 agents to review and send, subject to human approval before any customer-facing message." Scope is limited to the top 10 intents in v1. The autonomy level is "suggest" — humans send everything.
- **The workflow is sensible.** AI drafts, agent accepts/edits/rejects, agent sends. Integrates into the existing reply panel. Agents stay the decision-maker, which keeps blast radius bounded.
- **The cost model is in the right neighborhood.** $0.0094 per draft baseline, ~$51/month for the full team at the v1 intent scope. Not free, but easily justified by even a 10% handle-time reduction on supported intents.

## What's not yet ready

The PRD looks complete on paper. The operational scaffolding doesn't.

- **There is no eval set.** The plan defines a rubric and lists five golden examples — but five examples are an illustration, not a regression suite. Without a 100+ example labeled set, "the draft looks good" is the only quality signal the team has. That's how you ship a copilot that hallucinates the wrong cancellation policy on a Tuesday and finds out from a Reddit thread on Friday.
- **Observability is barely there.** Latency and API cost are logged. Accept / edit / reject events are not. No dashboard, no alerts. If draft quality silently drifts after launch, no one notices until the support manager mentions it in a 1:1 three weeks in.
- **Low-confidence fallback isn't implemented.** The prototype shows a draft regardless of model confidence. A confidence threshold and a "no draft this time" fallback are specified in the PRD but not built. This is the single highest-blast-radius gap: the moments where the model should stay quiet are exactly the moments it currently speaks loudest.
- **Legal sign-off on the AI disclosure language hasn't started.** Customer-facing messages need the right footer. Data retention and tenant handling for prompts and outputs aren't confirmed.

## The verdict, restated

**Pilot, after blockers close. Not now.** The case is genuinely strong on the dimensions that take quarters to build (problem, workflow, AI job). It's weak on the dimensions that take weeks to close (eval set, dashboard, fallback, legal sign-off). A two-week sprint to close the four pilot blockers is the right unlock for an 8-agent, 2-week pilot on the day shift.

Saying "yes" today would borrow trust the team hasn't earned yet. Saying "no forever" wastes a strong problem fit. The PM job here is to say "yes, with these four things first," and to make those four things small enough to be obviously worth doing.

## What would change the verdict

The team starts the pilot the moment all four of these are true:

1. A 100-example golden eval set exists, with labeled reference responses and a 0.7+ pass rate at the proposed launch threshold.
2. Accept / edit / reject events log to a dashboard, with an alert on a 7-day rolling accept-rate drop below 60%.
3. The low-confidence fallback ships and is tested against the 100-example set.
4. Legal confirms the disclosure language and the prompt/output retention policy.

If those four are not done by the pilot start date, the pilot moves. The decision criteria don't.
