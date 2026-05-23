# AI opportunity brief: customer support copilot

## Problem

Tier 1 support agents spend 38% of their time drafting replies to customers. The drafting process involves searching a knowledge base with 400+ articles, reading the relevant ones, and writing a response from scratch. This happens on every ticket, even when the same question has been answered hundreds of times.

Time studies across 12 agents over 4 weeks show:

- Average handle time per ticket: 8.2 minutes
- Time spent searching and reading KB articles: 1.8 minutes
- Time spent drafting the response: 3.1 minutes (38% of handle time)
- Top 50 intents cover 62% of total ticket volume
- Top 10 intents alone cover 31% of ticket volume

Agents are not slow. The work is repetitive. An agent answering a billing cycle question for the 40th time this week is doing the same cognitive work every time: find the right article, adapt it to the customer's specific situation, write it in a professional tone. The variation is in customer language and context, not in the underlying answer.

## Current workflow

1. Agent receives ticket in the support queue
2. Agent reads customer message and identifies the intent
3. Agent searches the knowledge base using keywords
4. Agent reads 1-3 articles to find the relevant policy or procedure
5. Agent drafts a response, pulling language from the articles and adapting it to the customer's situation
6. Agent reviews their own draft and sends it
7. Agent categorizes the ticket and moves to the next one

Steps 3-5 take roughly 5 minutes combined. For high-frequency intents, the agent is essentially doing the same lookup and rewrite loop dozens of times per shift.

## Why AI, and why not deterministic software

The obvious alternative is canned responses or templates. We tried this. Template usage peaked at 22% adoption and declined to 11% over three months. The reason: customer messages vary enough that templates require significant editing to sound natural and address the specific situation. Agents said templates felt robotic and often didn't match the customer's exact question.

This is a good fit for grounded generation. The answers exist in the knowledge base. The AI's job is to find the right source material and draft a response that fits the customer's specific language and context. The variation in customer phrasing and situational details is exactly what makes templates fail and LLMs useful.

Key constraints that make this tractable:

- The source material is bounded (approved KB articles, not the open internet)
- The output is reviewed by a human before sending
- Quality is measurable (did the agent accept, edit, or reject the draft?)
- The cost of a bad draft is low (agent just rewrites it)

## Smallest useful version

AI drafts responses for the top 10 intents only. These 10 intents account for 31% of ticket volume. The agent sees the draft with cited KB articles, reviews it, edits if needed, and sends. Everything outside the top 10 intents works exactly as it does today.

This is deliberately narrow. It covers enough volume to measure impact but limits the surface area for quality problems. If the AI can't handle billing cycle questions well, it won't handle complex account recovery questions either.

## What happens if we do nothing

Handle time stays flat at 8.2 minutes per ticket. Agent turnover on Tier 1 continues at current rates (34% annual), driven partly by the repetitive nature of the work. Competitors with AI-assisted support will pull ahead on response time. None of this is urgent in the next quarter, but the gap compounds.

The bigger risk is doing nothing and then doing something rushed later. A poorly launched copilot that hallucinates policy claims will damage agent trust and take months to recover from.

## Risks already visible

- KB articles are not all current. A spot check found 15% of articles have outdated information. If the AI cites a deprecated article, it produces a confidently wrong answer.
- Agent trust is fragile. If early drafts are bad, agents will stop reading them and the feature becomes shelfware. First impressions matter disproportionately.
- Some ticket intents look similar but have different correct answers depending on account type or plan tier. The AI needs to distinguish these or it will produce plausible but wrong responses.
- Customers occasionally include sensitive information (account numbers, personal details) in tickets. The AI must not echo this back or include it in drafts.

## Decision

- [x] Pursue: commit to a build brief and eval plan
- [ ] Prototype: time-boxed spike to answer specific unknowns
- [ ] Defer: revisit in Q1
- [ ] Reject: not worth pursuing

**Decided by:** Maya Patel, PM
**Date:** 2026-01-27
