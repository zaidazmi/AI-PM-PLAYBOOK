export const REPO_URL = "https://github.com/zaidazmi/AI-PM-Playbook";

export type PathCard = {
  status: string;
  statusDot: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  blob: "peach" | "mint" | "lavender" | "sand";
};

export const paths: PathCard[] = [
  {
    status: "Start here",
    statusDot: "bg-[#d97c4a]",
    title: "I have an idea",
    description:
      "The problem is still fuzzy. Decide whether AI is worth building at all before opening a PRD or an AI builder.",
    cta: "Run the preflight",
    href: "/guides/before-you-vibe-code",
    blob: "peach",
  },
  {
    status: "Already prototyped",
    statusDot: "bg-[#2f2f2f]",
    title: "I built a prototype",
    description:
      "The demo works. You don't yet know if it is safe, measurable, affordable, or ready for users. Close the gaps with evidence.",
    cta: "Audit the demo",
    href: "/guides/error-analysis",
    blob: "sand",
  },
  {
    status: "Operating in prod",
    statusDot: "bg-[#7a5fb5]",
    title: "I'm live and nervous",
    description:
      "The pilot is in users' hands. You need traces, weekly reviews, drift alerts, and cost ceilings before something breaks quietly.",
    cta: "Wire observability",
    href: "/templates/ai-observability-plan",
    blob: "lavender",
  },
  {
    status: "Reviewing roadmaps",
    statusDot: "bg-[#3a7d5a]",
    title: "I review AI work",
    description:
      "You sign off on AI products others build. Use the readiness model and launch gates to ask the questions that actually matter.",
    cta: "Read the gates",
    href: "/guides/launch-gates",
    blob: "mint",
  },
];

export type QuickStep = {
  num: string;
  title: string;
  blurb: string;
  href: string;
};

export const quickSteps: QuickStep[] = [
  {
    num: "01",
    title: "Before you vibe code",
    blurb: "Eight questions to answer before turning an AI idea into a demo.",
    href: "/guides/before-you-vibe-code",
  },
  {
    num: "02",
    title: "AI opportunity brief",
    blurb: "Decide if AI is worth pursuing. Align user, job, control, evals, risk, and cost.",
    href: "/templates/ai-opportunity-brief",
  },
  {
    num: "03",
    title: "AI PRD",
    blurb: "Define what the AI does, its quality bar, the risks, and what happens when it fails.",
    href: "/templates/ai-prd",
  },
  {
    num: "04",
    title: "Eval plan",
    blurb: "Define ‘good’ before trusting model output. Build the regression set.",
    href: "/templates/ai-eval-plan",
  },
  {
    num: "05",
    title: "Human review workflow",
    blurb: "Decide who validates, corrects, escalates, or blocks AI output before it matters.",
    href: "/templates/human-review-workflow",
  },
  {
    num: "06",
    title: "Launch gate checklist",
    blurb: "Make a go/no-go call for pilot, production, or scale, with evidence.",
    href: "/templates/launch-gate-checklist",
  },
];

export type Skill = {
  skill: string;
  artifact: string;
  one: string;
  href: string;
};

export const skills: Skill[] = [
  {
    skill: "Opportunity assessment",
    artifact: "Opportunity Brief",
    one: "Decide if AI is worth pursuing. Align user, AI job, human control, evals, risk, and cost.",
    href: "/templates/ai-opportunity-brief",
  },
  {
    skill: "AI job definition",
    artifact: "AI PRD",
    one: "Specify what the AI does, its constraints, and its fallback behavior.",
    href: "/templates/ai-prd",
  },
  {
    skill: "Eval design",
    artifact: "Eval Plan",
    one: "Define ‘good’ before trusting model output. Build a regression set.",
    href: "/templates/ai-eval-plan",
  },
  {
    skill: "Risk management",
    artifact: "PRD risk table + Launch Gate",
    one: "Surface what can go wrong, how bad it is, and what you'll do about it.",
    href: "/templates/ai-prd",
  },
  {
    skill: "Human-in-the-loop design",
    artifact: "Review Workflow",
    one: "Who validates, corrects, escalates, or blocks AI output before it matters.",
    href: "/templates/human-review-workflow",
  },
  {
    skill: "Unit economics",
    artifact: "Cost Model",
    one: "Cost per workflow and margin impact at scale, with sensitivity analysis.",
    href: "/templates/ai-cost-model",
  },
  {
    skill: "Launch gating",
    artifact: "Launch Gate Checklist",
    one: "Make go/no-go calls using evidence, not vibes.",
    href: "/templates/launch-gate-checklist",
  },
  {
    skill: "Observability",
    artifact: "Observability Plan",
    one: "Monitor quality, drift, and cost continuously after launch.",
    href: "/templates/ai-observability-plan",
  },
];

export type Guide = {
  num: string;
  title: string;
  blurb: string;
  href: string;
};

export const guides: Guide[] = [
  {
    num: "Pre",
    title: "Before you vibe code",
    blurb: "The 10-minute preflight before writing a PRD or opening an AI builder.",
    href: "/guides/before-you-vibe-code",
  },
  {
    num: "00",
    title: "A week with the playbook",
    blurb: "One PM, one product, five artifacts. From opportunity brief to roadmap review.",
    href: "/guides/walkthrough",
  },
  {
    num: "01",
    title: "Eval design",
    blurb: "Building evals that catch real failures, including the ones you miss in demos.",
    href: "/guides/eval-design",
  },
  {
    num: "02",
    title: "Agentic products",
    blurb: "How to spec agents vs. chatbots vs. copilots. Autonomy levels and tool boundaries.",
    href: "/guides/agentic-products",
  },
  {
    num: "03",
    title: "Operating AI products",
    blurb: "Human review, safety, observability, and cost discipline after the demo works.",
    href: "/guides/operating-ai-products",
  },
  {
    num: "04",
    title: "Launch gates",
    blurb: "How to say ‘do not launch’ with evidence. And what would change your mind.",
    href: "/guides/launch-gates",
  },
  {
    num: "05",
    title: "Prompt craft",
    blurb: "Treating prompts as product surfaces. Versioning, regression, and ownership.",
    href: "/guides/prompt-craft",
  },
  {
    num: "06",
    title: "Bad to good AI PRD",
    blurb: "Turning a vague AI assistant brief into a buildable PRD slice.",
    href: "/guides/bad-to-good-ai-prd",
  },
  {
    num: "07",
    title: "Error analysis",
    blurb: "Reading traces, labeling failures, deciding which evals are worth automating.",
    href: "/guides/error-analysis",
  },
  {
    num: "08",
    title: "Artifact flow map",
    blurb: "What artifact comes when, who owns it, and what decision it unlocks.",
    href: "/guides/artifact-flow-map",
  },
  {
    num: "09",
    title: "Agent PM starter pack",
    blurb: "Tool boundaries, autonomy, rollback, trajectory evals, cost ceilings, handoff.",
    href: "/guides/agent-pm-starter-pack",
  },
  {
    num: "10",
    title: "AI-native PM loop",
    blurb: "Build small PM agents, trace behavior, create evals from traces, improve safely.",
    href: "/guides/ai-native-pm-loop",
  },
];

export type CaseStudy = {
  title: string;
  risk: "Low" | "Medium" | "High";
  recommendation: string;
  quote: string;
  who: string;
  role: string;
  href: string;
  blob: "butter" | "sky" | "rose";
};

export const caseStudies: CaseStudy[] = [
  {
    title: "Customer Support Copilot",
    risk: "Medium",
    recommendation: "Pilot after blockers resolved",
    quote:
      "AI drafts replies for Tier 1 agents. Strong job definition, but evals, observability, and a low-confidence fallback have to land before pilot.",
    who: "Priya",
    role: "PM, B2B SaaS",
    href: "/examples/customer-support-copilot",
    blob: "butter",
  },
  {
    title: "Sales Call CRM Assistant",
    risk: "Medium",
    recommendation: "Pilot after blockers resolved",
    quote:
      "Auto-summarize calls and update CRM fields. The risk is silent over-writes, so we need accept/edit telemetry and a rollback path before scale.",
    who: "Marcus",
    role: "Group PM, Revenue",
    href: "/examples/sales-call-crm-assistant",
    blob: "sky",
  },
  {
    title: "Healthcare Intake Assistant",
    risk: "High",
    recommendation: "Prototype only. Do not launch",
    quote:
      "Patient intake is the highest-blast-radius workflow in the product. Evidence does not support a pilot. The recommendation is to stop and rescope.",
    who: "Dana",
    role: "Director of Product",
    href: "/examples/healthcare-intake-assistant",
    blob: "rose",
  },
];

export type Stat = { label: string; value: string };

export const stats: Stat[] = [
  { label: "Templates", value: "10" },
  { label: "Guides", value: "12" },
  { label: "Case studies", value: "3" },
  { label: "Open source", value: "MIT" },
];
