# Safety and governance for AI PMs

> **The failure this prevents:** the product ships without defining what the model must never do. The first serious incident — a hallucinated policy claim, a data leak across tenants, an unreviewed action with legal consequences — forces a reactive pull from production. This guide makes safety a launch requirement, not a post-incident cleanup.

## Contents

- [Current regulatory landscape](#current-regulatory-landscape)
- [Risk categories PMs must own](#risk-categories-pms-must-own)
- [Plan for misuse before launch](#plan-for-misuse-before-launch)
- [Model release checklist](#model-release-checklist)
- [Guardrails as product requirements](#guardrails-as-product-requirements)
- [When to involve legal](#when-to-involve-legal)
- [Audit trails](#audit-trails)
- [Risk tiering](#risk-tiering)
- [Red team testing](#red-team-testing)
- [Incident response for AI products](#incident-response-for-ai-products)
- [What PMs actually need to do](#what-pms-actually-need-to-do)
- [Next steps](#next-steps)

Most AI project failures are organizational, not technical. The model works. The product fails because nobody defined what the model should not do, who reviews edge cases, or what happens when it gets something wrong.

Safety and governance are not compliance checkboxes. They are product requirements. A PM who treats them as someone else's problem will ship a product that gets pulled from production after the first serious incident.

## Current regulatory landscape

Three frameworks matter most:

**NIST AI RMF** is the US framework for AI risk management. It is voluntary but increasingly referenced in federal procurement and industry standards. It organizes AI risk management into four functions: Govern, Map, Measure, Manage. NIST continues to release sector-specific profiles and guidance documents that build on the core framework. PMs should care because enterprise customers will ask whether your product aligns with NIST AI RMF, and "we haven't looked at it" is a deal-killer.

**EU AI Act** applies progressively and classifies AI systems by risk tier. If your product is placed on the EU market, used in the EU, or its outputs are used in the EU, legal should map whether the AI Act applies and which deadlines matter. Processing EU personal data may also trigger GDPR obligations, but AI Act risk tiering is driven by use case, not merely by data residency. The prohibited tier bans certain uses outright. The high-risk tier can require conformity assessment, technical documentation, human oversight, and post-market monitoring. Many enterprise AI products will be limited-risk or minimal-risk; products in healthcare, employment, credit, education, safety, law enforcement, migration, or critical infrastructure may fall into high-risk categories.

**Singapore IMDA Model AI Governance Framework for Agentic AI** is an early major framework focused on agentic AI. It covers bounding agent powers, meaningful human accountability, technical controls, and end-user responsibility. If you are building agentic products, read this even if you do not operate in Singapore, because it previews the governance questions other markets are likely to ask.

You do not need to be a regulatory expert. You do need to know which tier your product falls in and what that tier requires. Ask legal to map your product to the relevant frameworks early, not after the product is built.

## Risk categories PMs must own

These are the failure modes you need to plan for. Each one should have a mitigation in your PRD.

**Incorrect output**: the model says something wrong. This ranges from minor (awkward phrasing) to severe (incorrect medical information, wrong financial figures). Mitigation: evals, confidence thresholds, human review for high-stakes domains.

**Over-trust**: users treat the model's output as authoritative without checking. This is a design problem, not a model problem. Mitigation: surface confidence indicators, add friction before high-stakes actions, never present AI output as verified fact unless it has been verified.

**Data leakage**: the model exposes training data, context from other users, or internal system prompts. Mitigation: input/output filtering, session isolation, prompt injection defense.

**Prompt injection**: adversarial inputs that cause the model to ignore its instructions and do something else. This is a real attack vector, not a theoretical one. Mitigation: input sanitization, instruction hierarchy, output validation, sandboxed tool execution.

**Unsafe autonomy**: an agent takes actions beyond its intended scope. Mitigation: explicit permission boundaries, tool-level access controls, human checkpoints for irreversible actions.

**Bias**: the model produces systematically different quality or outcomes for different demographic groups. Mitigation: disaggregated eval across user segments, bias-specific test cases in the golden set, ongoing monitoring.

**Regulatory exposure**: the product operates in a way that violates applicable regulations. Mitigation: regulatory mapping at product definition, compliance review before launch, audit trails.

## Plan for misuse before launch

For any model endpoint that accepts user input, especially images, files, freeform text, URLs, or tool instructions, assume users will test the boundaries early. Some will do it by accident. Some will do it deliberately. Your launch plan should not depend on users behaving exactly as intended.

The lesson: guardrails must be in place before the endpoint goes live, not after the first incident. Test for adversarial inputs, unsafe requests, off-topic behavior, policy bypass attempts, sensitive data extraction, and outputs that would be embarrassing or harmful if screenshotted. If you can think of a failure mode during product review, add it to the eval set before launch.

## Model release checklist

Before any model or AI feature goes to users, even in beta, run through this checklist:

- Eval suite passes at the target threshold across all dimensions
- Red team testing completed with findings addressed
- Guardrails (input validation, output filtering) are live and tested
- Confidence thresholds and fallback behavior are implemented
- Human review workflow is operational for high-risk actions
- Audit logging is recording all inputs, outputs, and actions
- Incident response plan is written with on-call owners assigned
- Legal has reviewed the product for regulatory compliance
- Cost ceilings and rate limits are in place
- Rollback plan is documented and tested (how to disable the feature in minutes)

This is not optional for production launches. For prototypes and internal betas, use a lighter version: evals, basic guardrails, and an audit log at minimum.

## Guardrails as product requirements

Guardrails are not an afterthought. They are product features that protect users and the business.

Input validation: check what goes into the model before it gets there. Block PII, filter adversarial patterns, enforce input length limits, reject inputs outside the product's scope.

Output filtering: check what comes out of the model before users see it. Block toxic content, redact PII, validate factual claims against known data, enforce format requirements.

Layered defense: no single guardrail is sufficient. Use input validation AND output filtering AND human review AND monitoring. Each layer catches things the others miss.

Write guardrail requirements in the PRD the same way you write feature requirements. "The system must not reveal the system prompt in any response" is a requirement. "The system must redact credit card numbers from all outputs" is a requirement. These are testable. Include them in your eval set.

## When to involve legal

Involve legal early. Specifically:

- When defining what data the model can access or process
- When the product makes recommendations in regulated domains (health, credit, lending, insurance, legal)
- When the product takes autonomous actions on behalf of users
- When the product processes data from EU residents
- When the product will be marketed with claims about accuracy or reliability
- Before any public launch, not after

"Legal slows us down" is the most expensive shortcut in AI product development.

## Audit trails

If your AI product takes actions, you need an audit trail that records:

- What input triggered the action
- What the model decided and why (the reasoning trace, if available)
- What action was taken
- What the outcome was
- Whether a human reviewed or approved the action
- Timestamps for all of the above

This is not just a compliance requirement. It is how you debug failures, investigate incidents, and demonstrate due diligence. Without audit trails, when something goes wrong, and it will, you are reconstructing events from memory and log fragments.

## Risk tiering

The EU AI Act formalizes risk tiers, but the concept is useful regardless of jurisdiction.

**Unacceptable risk**: applications that manipulate human behavior, exploit vulnerabilities, or enable mass surveillance. Do not build these.

**High risk**: applications in healthcare, creditworthiness or credit scoring, life and health insurance risk assessment or pricing, education, employment, law enforcement, critical infrastructure. These require conformity assessments, documentation, human oversight, and ongoing monitoring.

**Limited risk**: applications with transparency obligations. Users must be informed they are interacting with AI. Deepfakes and synthetic content must be labeled.

**Minimal risk**: applications with no specific obligations beyond general consumer protection law. Most internal tools and low-stakes consumer features fall here.

Map your product to a tier early. The tier determines your compliance obligations, your testing requirements, and your human review needs. Aiming for minimal risk when your product is actually high risk is not a strategy. It is a liability.

## Red team testing

Before launch, try to break your own product. Red team testing means deliberately probing for failure modes that your standard evals will not catch.

What to test:

- Prompt injection: can a user get the model to ignore its system instructions?
- Data extraction: can a user get the model to reveal its system prompt, other users' data, or internal documentation?
- Scope violation: can a user get the model to perform actions outside its intended scope?
- Bias probing: does the model produce systematically different quality for different demographic inputs?
- Adversarial tool use: for agentic products, can a user trick the agent into calling tools in unintended ways?

You do not need a formal red team for pilot-stage products. Have three people spend half a day trying to break it. Document what they find. Add the failure cases to your eval set.

For production launches in high-risk domains, consider hiring an external red team. The people who built the product have blind spots about how it can fail.

## Incident response for AI products

AI incidents are different from traditional software incidents. The system does not crash. It produces bad output and keeps running. This means incidents can go undetected for hours or days.

Your incident response plan should define:

- How incidents are detected (monitoring alerts, user reports, review queue patterns)
- Who is on call and how they are notified
- Triage criteria: what severity level is "model hallucinated a policy number" vs "model shared PII"
- Immediate response options: disable the feature, switch to human-only mode, tighten confidence thresholds
- Post-incident review: add the failure case to evals, determine root cause, update guardrails
- Communication: who needs to know and when (users, customers, regulators for high-risk products)

Write the plan before your first incident. During an incident is not the time to figure out who is responsible.

## What PMs actually need to do

1. Map your product to regulatory frameworks before writing the PRD
2. Define risk categories and mitigations as product requirements
3. Include guardrail requirements in the PRD and eval set
4. Involve legal before product definition is complete
5. Build audit trails from day one
6. Determine the risk tier and design accordingly
7. Run red team testing before every stage transition
8. Write an incident response plan and keep it current
9. Review safety and governance quarterly, not just at launch

## Next steps

- Document risks, mitigations, and owners using the [Risk Register template](../templates/ai-risk-register.md).
- Verify that safety requirements are met before each stage transition using the [Launch Gate Checklist template](../templates/launch-gate-checklist.md).
