# Eval design for PMs

> **The failure this prevents:** teams build evals at launch, run them once, and never update them. Six months later, the model has drifted, the eval set is stale, and nobody knows whether quality is improving or degrading. This guide is structured around making evals continuous, not ceremonial.

## Contents

- [What evals actually are](#what-evals-actually-are)
- [The golden eval set](#the-golden-eval-set)
- [Beyond accuracy: robustness and consistency](#beyond-accuracy-robustness-and-consistency)
- [Quality bars depend on domain](#quality-bars-depend-on-domain)
- [Quality rubrics](#quality-rubrics)
- [Automated vs human grading](#automated-vs-human-grading)
- [LLM-as-judge](#llm-as-judge)
- [Calibrating LLM judges](#calibrating-llm-judges)
- [Regression testing](#regression-testing)
- [When to run evals](#when-to-run-evals)
- [Tools PMs should know about](#tools-pms-should-know-about)
- [How to start](#how-to-start)
- [Common eval mistakes](#common-eval-mistakes)
- [Next steps](#next-steps)

Many generative AI pilots fail to deliver measurable business impact. The most common reason is not bad models or weak prompts. It is missing evals. Teams ship AI features with no definition of "good," no way to detect regression, and no baseline to improve against.

Evals are the single most important artifact an AI PM owns. More important than the PRD. More important than the prompt. If you only do one thing well, make it evals.

## What evals actually are

An eval is a repeatable test that measures whether your AI system produces acceptable output for a known input. That is it. Not a demo. Not a vibe check. Not "the CEO tried it and liked it."

An eval has three parts:

1. A set of test inputs (the golden set)
2. Expected outputs or quality criteria for each input
3. A scoring method that produces a number

If you cannot describe all three, you do not have evals. You have opinions.

## The golden eval set

Your golden set is a curated collection of input-output pairs that represent the full range of what your AI feature handles. This includes easy cases, hard cases, edge cases, and adversarial cases.

Start with 20 examples. That is not a typo. Twenty well-chosen examples with carefully written expected outputs will catch more problems than a thousand randomly selected ones. Expand to 50-100 as you learn what breaks.

Where golden examples come from:

- Real user inputs from production or user research
- Known failure cases from QA or customer support
- Adversarial inputs designed to expose weaknesses
- Edge cases identified by domain experts
- Inputs that previous model versions handled differently

Each example needs a human-verified expected output. This is tedious. Do it anyway. The expected output is the ground truth your entire quality system depends on.

The golden set is a living document. As you change models, update prompts, or modify retrieval pipelines, the golden set is what catches regression. Add new examples whenever you find a failure in production. Remove examples that no longer represent real usage. A stale golden set creates false confidence.

## Beyond accuracy: robustness and consistency

Accuracy on a golden set is necessary but misleading on its own. Two more metrics matter:

**Robustness** is accuracy across different input formats, layouts, and conditions. If your product handles PDF uploads, measure accuracy on PDFs, CSVs, images, and different column layouts separately. A system that scores 95% on clean PDFs but 40% on scanned images is not 95% accurate in production. Weight by the actual distribution of input formats your users send.

**Consistency** is how reliably the system handles the same entity across variations. If your product categorizes merchants in financial data, test whether it correctly identifies "SQ", "Singapore Airlines", and "Singapore Air" as the same airline across multiple runs. Inconsistent entity resolution erodes user trust faster than occasional inaccuracy.

A PM pitfall from practice: a credit card analyzer kept categorizing "Singapore" (a merchant code for Singapore Airlines) as a government payment. The system was 90% accurate overall, but inconsistently handled merchant name variations, which made the product feel broken.

## Quality bars depend on domain

70% accuracy means different things in different products. A travel photo recognition app that identifies landmarks at 80% accuracy is useful and fun. A fintech product that categorizes transactions at 70% accuracy is unusable.

Before setting your quality bar, answer: what happens when the AI is wrong? If the user loses a few seconds correcting a suggestion, lower accuracy is acceptable. If the user makes a financial decision based on wrong data, you need near-perfect accuracy on the dimensions that matter.

Set different accuracy targets for different dimensions of the same product. A support copilot might tolerate 80% on tone matching but require 99% on policy accuracy.

## Quality rubrics

Not every AI output is pass/fail. Most require judgment across multiple dimensions. A quality rubric defines those dimensions and what each score means.

For a customer support response, your rubric might include:

- Accuracy: does the response contain correct information? (1-5)
- Completeness: does it address all parts of the question? (1-5)
- Tone: does it match the brand voice? (1-3)
- Safety: does it avoid making promises or sharing restricted info? (pass/fail)

The rubric should reflect what users actually care about. Talk to users. Look at complaint patterns. If users never mention tone but frequently complain about missing information, weight completeness higher than tone.

Hard rule: safety dimensions should be pass/fail, not scored. A response that leaks PII should fail regardless of how accurate it is.

## Automated vs human grading

Human grading is the gold standard but does not scale. Automated grading scales but misses nuance. You need both.

Use automated grading for:

- Factual accuracy against known answers
- Format compliance (JSON structure, required fields)
- Safety checks (PII detection, blocked content categories)
- Regression testing on every prompt or model change

Use human grading for:

- Tone and style assessment
- Complex correctness that requires domain knowledge
- Calibrating automated graders
- Evaluating new categories of output

The ratio shifts over time. Early in development, you are 80% human grading. At scale, you should be 80% automated with human spot-checks.

## LLM-as-judge

Using one LLM to evaluate another LLM's output is now standard practice. It works surprisingly well for subjective quality dimensions like helpfulness and clarity. It works poorly for factual accuracy unless you give the judge model access to ground truth.

Tradeoffs PMs should understand:

- LLM judges are biased toward longer, more verbose outputs. A concise correct answer often scores lower than a wordy one. You can mitigate this with explicit rubric instructions.
- LLM judges show position bias. If you present two outputs for comparison, the judge favors whichever appears first. Always randomize order.
- LLM judges are inconsistent across runs. The same input can get different scores. Run each judgment 3-5 times and average, or use majority voting.
- Cost adds up. If your eval set is 200 examples and you run each through a judge model 3 times, that is 600 LLM calls per eval run.

LLM-as-judge is good enough for development iteration. It is not good enough as your only quality gate before production launch. Pair it with human review of a sample.

For many product decisions, prefer binary judge outputs over 1-5 scores. "Did the assistant fabricate a policy claim?" and "Should this have escalated to a human?" are easier to calibrate as pass/fail than as subjective rating scales. Binary outputs also map cleanly to product decisions: block, ship, escalate, or fix.

## Calibrating LLM judges

Do not trust an LLM judge just because it returns a score. Calibrate it against human labels.

Start with a small labeled set from error analysis:

1. Review production traces manually.
2. Label whether a specific failure exists in each trace.
3. Write an LLM judge prompt for that failure.
4. Run the judge on the same traces.
5. Compare judge output to the human labels.

Track three numbers:

- **Agreement:** how often the judge matches the human label overall.
- **True positive rate:** when the failure is present, how often the judge catches it.
- **True negative rate:** when the failure is absent, how often the judge correctly ignores it.

Agreement alone is a trap. If only 5% of traces have a handoff failure, a judge that always says "no failure" will look 95% accurate while catching nothing useful. Look at positives and negatives separately.

Once a judge is calibrated, use it to scan a larger sample of traces and monitor that failure category over time. Recalibrate when the prompt, model, workflow, or failure definition changes.

## Regression testing

Every prompt change, model upgrade, or RAG pipeline modification should trigger an eval run against your golden set. No exceptions.

This is regression testing. You are checking whether the change improved the target metric without degrading others. A prompt edit that improves accuracy by 5% but degrades safety compliance by 2% is a net negative.

Set a regression threshold. If any dimension drops more than X% from baseline, the change does not ship until reviewed. What X is depends on the dimension. Safety might be 0% (any regression blocks). Tone might be 5%.

## When to run evals

- Before launch: full eval suite against golden set, human review of a sample
- After every prompt change: automated regression run
- After model upgrades: full eval suite (model behavior changes between versions, sometimes dramatically)
- Weekly in production: sample production outputs and grade them to detect drift
- After incidents: add the failure case to the golden set and re-run

## Tools PMs should know about

You do not need to code evals yourself, but you need to understand what tools your team is using and what they measure.

**promptfoo** is the most PM-accessible eval tool. It uses YAML config files to define test cases and assertions. You can read and edit the configs without writing code. It supports LLM-as-judge, regex matching, and custom scoring functions. Open source.

**deepeval** provides pre-built evaluation metrics for common use cases: faithfulness, answer relevancy, hallucination detection, toxicity. Useful when you want standard metrics without building custom rubrics from scratch.

**ragas** focuses on RAG evaluation specifically. If your product retrieves documents and generates answers from them, ragas measures retrieval quality separately from generation quality. This distinction matters because a bad answer might be caused by retrieving the wrong documents, not by the model generating poorly.

## How to start

If you have zero evals today:

1. Pick your highest-risk AI feature
2. Review 30-50 real or realistic traces and write down the failures you see
3. Group the failures into product-specific error categories
4. Collect 20 real inputs that represent the full range of usage
5. Write expected outputs for each one (or define pass/fail criteria)
6. Run your current system against those 20 inputs
7. Grade the outputs manually
8. Record the scores. This is your baseline
9. Run the same eval after every change

This takes a PM about two days. It will save you months of shipping broken things and not knowing.

## Common eval mistakes

**Testing only the happy path**: your golden set is full of well-formed, reasonable inputs. Real users send typos, ambiguous questions, multi-part requests, and inputs in unexpected languages. Include messy inputs.

**Treating eval as a one-time activity**: running evals once before launch and never again. Eval is continuous. Models change, user behavior changes, your data changes. An eval set that was comprehensive six months ago has gaps today.

**Optimizing for the eval set**: if you keep tweaking the prompt to score higher on the same 20 examples, you are overfitting. Periodically add new examples from production that the team has not seen before.

**Ignoring disagreement between graders**: if two human graders score the same output differently, your rubric is ambiguous. Fix the rubric, do not just average the scores. Disagreement is a signal that your quality definition is unclear.

**Scoring everything on the same scale**: accuracy and safety should not be averaged into a single number. A response that scores 5/5 on accuracy and 1/5 on safety is not a 3/5 response. It is a safety failure. Report dimensions separately and set hard thresholds on critical dimensions.

**No baseline measurement**: teams add evals after months of development and have no idea whether quality is improving or degrading. Measure your baseline on day one, even if the numbers are embarrassing. The baseline is what makes progress visible.

**Skipping error analysis**: teams pick generic metrics before reading real traces. Review traces first, label the failures, then write evals for the errors that actually matter.

## Next steps

- Use the [Eval Plan template](../templates/ai-eval-plan.md) to define your golden set, scoring method, and regression cadence.
- Use the [Error Analysis guide](10-error-analysis.md) before automating evals, especially when you do not yet know the main failure modes.
- Once evals are running, set up production monitoring using the [Observability guide](05-observability.md) to detect drift between eval runs.
