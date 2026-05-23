<p align="center">
  <img src="images/banner.png" alt="AI PM Playbook — a working system for PMs building production AI products" width="100%" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href="#what-an-ai-pm-actually-does"><img src="https://img.shields.io/badge/templates-11-purple" alt="Templates"></a>
  <a href="#guides"><img src="https://img.shields.io/badge/guides-10-green" alt="Guides"></a>
  <a href="#case-studies"><img src="https://img.shields.io/badge/case%20studies-3-orange" alt="Case Studies"></a>
</p>

Vibe-coding gets you to a demo fast. This playbook helps you figure out whether that demo should become a product, how to define quality, where humans need to stay in the loop, and when to say "not yet."

Built for PMs working with LLMs, agents, copilots, RAG, and workflow automation.

> **New here?** Start with [A week with the AI PM Playbook](docs/00-walkthrough.md) — a walkthrough of one PM using these artifacts on an actual product, from opportunity brief to roadmap review.

## Quick start

1. [AI opportunity brief](templates/ai-opportunity-brief.md) — decide if AI is worth pursuing
2. [AI PRD](templates/ai-prd.md) — define what the AI does, its quality bar, and what happens when it fails
3. [Eval plan](templates/ai-eval-plan.md) — define "good" before trusting model output
4. [Launch gate checklist](templates/launch-gate-checklist.md) — gate pilot, production, and scale-up decisions
5. [Healthcare intake example](examples/healthcare-intake-assistant/) — see what a "do not launch" recommendation looks like

The [full playbook](ai-pm-playbook.md) has the operating model, evidence hierarchy, readiness scoring, and decision framework.

## Who this is for

- PMs shipping AI features from prototype to production
- Founders deciding which AI workflows are worth building
- Product leaders reviewing whether an AI roadmap is credible
- Engineering, design, and legal partners who want clearer AI product artifacts

This is not a prompt pack or a strategy deck. There are no starter apps.

## What an AI PM actually does

Most of these jobs didn't exist three years ago. Each one has a template.

| Skill | What it means | Artifact |
|-------|---------------|----------|
| Opportunity assessment | Decide whether AI is worth pursuing for a given problem | [Opportunity Brief](templates/ai-opportunity-brief.md) |
| AI job definition | Specify what the AI does, its constraints, and its fallback behavior | [AI PRD](templates/ai-prd.md) |
| Eval design | Define "good" before trusting model output | [Eval Plan](templates/ai-eval-plan.md) |
| Build handoff | Turn PM intent into scoped, buildable work | [Build Brief](templates/ai-build-brief.md) |
| Risk management | What can go wrong, how bad is it, what do we do about it | [Risk Register](templates/ai-risk-register.md) |
| Human-in-the-loop design | Decide when and how humans validate AI output | [Review Workflow](templates/human-review-workflow.md) |
| Unit economics | Cost per workflow and margin impact at scale | [Cost Model](templates/ai-cost-model.md) |
| Launch gating | Go/no-go calls using evidence | [Launch Gate Checklist](templates/launch-gate-checklist.md) |
| Observability | Monitor quality, drift, and cost in production | [Observability Plan](templates/ai-observability-plan.md) |
| Post-launch review | What actually happened vs. what we expected | [Post-Launch Review](templates/post-launch-review.md) |

Plus a [Stakeholder Decision Record](templates/stakeholder-decision-record.md) for documenting decisions and why they were made.

## Guides

Ten guides on the parts of AI product management where most teams get stuck.

| Guide | What it covers |
|-------|----------------|
| [Walkthrough](docs/00-walkthrough.md) | A week with the playbook: one PM, one product, five artifacts |
| [Eval Design](docs/01-eval-design.md) | Building evals that catch real failures, including the ones you miss in demos |
| [Agentic Products](docs/02-agentic-products.md) | How to spec agents vs. chatbots vs. copilots |
| [Cost Economics](docs/03-cost-economics.md) | AI SaaS unit economics and margin modeling |
| [Safety & Governance](docs/04-safety-governance.md) | Defining what the model must never do |
| [Observability](docs/05-observability.md) | Monitoring AI quality when uptime dashboards aren't enough |
| [Human-in-the-Loop](docs/06-human-in-the-loop.md) | When and how humans validate AI output |
| [Launch Gates](docs/07-launch-gates.md) | How to say "do not launch" with evidence |
| [Prompt Craft](docs/08-prompt-craft.md) | Treating prompts as product surfaces |
| [Bad to Good AI PRD](docs/09-bad-to-good-ai-prd.md) | Turning a vague AI assistant brief into a buildable PRD slice |

## Case studies

Three worked examples. Each one includes an opportunity brief, PRD, eval plan, launch gate assessment, and a scored readiness recommendation. The customer support example also includes a week-2 post-launch review to show the operating loop after pilot launch.

| Case study | Risk | Recommendation |
|-----------|------|----------------|
| [Customer Support Copilot](examples/customer-support-copilot/) | Medium | Pilot after blockers resolved |
| [Sales Call CRM Assistant](examples/sales-call-crm-assistant/) | Medium | Pilot after blockers resolved |
| [Healthcare Intake Assistant](examples/healthcare-intake-assistant/) | High | Prototype only |

The examples are synthetic but realistic. They show how the artifacts reason through tradeoffs rather than filling in blanks.

## Portfolio interview prompts

Use these artifacts to answer common AI PM interview questions with concrete examples.

| Interview question | Where to point |
|--------------------|----------------|
| How do you decide if an AI feature is worth building? | [Opportunity Brief](templates/ai-opportunity-brief.md) + [Healthcare Intake opportunity](examples/healthcare-intake-assistant/opportunity-brief.md) |
| How do you define quality for LLM output? | [Eval Plan](templates/ai-eval-plan.md) + [Customer Support eval](examples/customer-support-copilot/eval-plan.md) |
| How do you handle hallucination risk? | [Risk Register](templates/ai-risk-register.md) + [Customer Support launch gate](examples/customer-support-copilot/launch-gate.md) |
| How do you decide not to launch? | [Launch Gates guide](docs/07-launch-gates.md) + [Healthcare Intake launch gate](examples/healthcare-intake-assistant/launch-gate.md) |
| How do you operate after launch? | [Observability Plan](templates/ai-observability-plan.md) + [Week-2 post-launch review](examples/customer-support-copilot/post-launch-review-week-2.md) |

## Repo structure

```
ai-pm-playbook.md          # Full playbook: operating model, scoring, gates
templates/                  # 11 fill-in PM artifacts
docs/                       # 10 reference guides (including walkthrough)
examples/                   # 3 scored case studies, plus one post-launch review example
schema/                     # JSON schema for readiness assessments
```

## Companion framework

[GRIT](https://github.com/zaidazmi/GRIT) covers the engineering side: how AI-assisted code gets specified, tested, and reviewed. This playbook covers the product side: what gets built, why, and when it is ready.

## License

[MIT](LICENSE)
