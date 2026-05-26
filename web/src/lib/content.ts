import fs from "node:fs";
import path from "node:path";

// repoRoot is one level above `web/`
const repoRoot = path.resolve(process.cwd(), "..");

export function readRepoFile(relativePath: string): string {
  const full = path.join(repoRoot, relativePath);
  return fs.readFileSync(full, "utf8");
}

export function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

/**
 * Extract the first-level heading (`# Title`) from markdown.
 * Falls back to the slug.
 */
export function extractTitle(markdown: string, fallback: string): string {
  const m = markdown.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1] : fallback;
}

/**
 * Strip the first `# Title` heading from the markdown body so the page header
 * can render it once with our own typography.
 */
export function stripFirstH1(markdown: string): string {
  return markdown.replace(/^#\s+.+\n+/, "");
}

/**
 * Strip GitHub shields.io badge image links. They render as inline images
 * inside the doc body, which looks out of place in a designed page.
 */
export function stripGithubBadges(markdown: string): string {
  return markdown
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      const badgePattern =
        /^(\[!\[[^\]]*\]\(https:\/\/img\.shields\.io[^)]*\)\]\([^)]*\)\s*)+$/;
      return !badgePattern.test(trimmed);
    })
    .join("\n");
}

/**
 * Wrap inline section labels like "Purpose:", "Must answer:", "Decision options:"
 * into a styled element so doc sub-sections have visible rhythm.
 */
export function styleInlineLabels(markdown: string): string {
  return markdown.replace(
    /^([A-Z][A-Za-z][A-Za-z\s'\-]{0,28}):\s*$/gm,
    (_m, label) => `\n<p class="md-inline-label">${label}</p>\n`,
  );
}

/**
 * Extract H2 headings for a doc page TOC sidebar. Slug matches rehype-slug.
 */
export type TocEntry = { text: string; slug: string };

export function extractToc(markdown: string): TocEntry[] {
  const lines = markdown.split("\n");
  const out: TocEntry[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      const text = m[1].replace(/`/g, "").trim();
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      out.push({ text, slug });
    }
  }
  return out;
}

/**
 * One shared pipeline used by every doc-style page (playbook, guides,
 * templates, case studies, artifacts). Returns the rendered-ready markdown
 * AND a TOC of H2 headings so the page can render a sticky sidebar.
 *
 * - Strips first H1 (rendered separately as DocHero)
 * - Strips GitHub shields.io badges
 * - Transforms HTML comment hints into styled callouts
 * - Wraps inline labels ("Purpose:", "Must answer:") as small-caps
 * - Rewrites repo-relative .md links to site routes
 * - Extracts TOC from H2 headings (before transforms, so the slugs match)
 */
export function processDocMarkdown(
  rawMd: string,
  sourceDir: string,
): { markdown: string; toc: TocEntry[] } {
  const cleaned = stripGithubBadges(stripFirstH1(rawMd));
  const toc = extractToc(cleaned);
  const processed = styleInlineLabels(transformHtmlCommentHints(cleaned));
  const markdown = rewriteMarkdownLinks(processed, sourceDir);
  return { markdown, toc };
}

/**
 * Convert author-facing HTML comments (used as "fill in this section" hints
 * inside templates) into styled callouts. Without this they leak as literal
 * text because react-markdown does not parse raw HTML by default.
 */
export function transformHtmlCommentHints(markdown: string): string {
  return markdown.replace(
    /<!--([\s\S]*?)-->/g,
    (_full, body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return "";
      const escaped = trimmed
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `\n\n<aside class="md-hint" data-hint="true">${escaped}</aside>\n\n`;
    },
  );
}

/**
 * Extract a short "lede" — the first paragraph that isn't a blockquote or list.
 */
export function extractLede(markdown: string, max = 220): string {
  const body = stripFirstH1(markdown);
  const lines = body.split("\n");
  let buf: string[] = [];
  for (const ln of lines) {
    const trim = ln.trim();
    if (!trim) {
      if (buf.length) break;
      continue;
    }
    if (
      trim.startsWith("#") ||
      trim.startsWith(">") ||
      trim.startsWith("-") ||
      trim.startsWith("*") ||
      trim.startsWith("|") ||
      trim.startsWith("```") ||
      /^\d+\.\s/.test(trim)
    ) {
      if (buf.length) break;
      continue;
    }
    buf.push(trim);
  }
  let para = buf.join(" ");
  // Strip markdown emphasis/links
  para = para
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
  if (para.length > max) {
    para = para.slice(0, max).replace(/\s+\S*$/, "") + "…";
  }
  return para;
}

/**
 * Rewrite repo-relative markdown links to their site routes.
 *
 * Examples
 *   docs/04-launch-gates.md           -> /guides/launch-gates
 *   templates/ai-prd.md               -> /templates/ai-prd
 *   templates/ai-prd.md#risks         -> /templates/ai-prd#risks
 *   templates/optional/ai-build-brief.md -> /templates/optional-ai-build-brief
 *   examples/customer-support-copilot/ -> /examples/customer-support-copilot
 *   examples/customer-support-copilot/eval-plan.md -> /examples/customer-support-copilot/eval-plan
 *   ai-pm-playbook.md                 -> /playbook
 *   ../templates/x.md                 -> /templates/x
 *   ./before-you-vibe-code.md         -> /guides/before-you-vibe-code (when source is in docs/)
 */
export function rewriteMarkdownLinks(
  markdown: string,
  sourceDir: string,
): string {
  return markdown.replace(
    /(\[[^\]]*\]\()([^)\s]+)(\))/g,
    (whole, open, href: string, close) => {
      if (/^(https?:|mailto:|tel:|#)/i.test(href)) return whole;
      const [rawPath, hash = ""] = href.split("#");
      const resolved = path
        .normalize(path.join(sourceDir, rawPath))
        .replace(/\\/g, "/");
      const route = resolveToRoute(resolved);
      if (!route) return whole;
      return `${open}${route}${hash ? "#" + hash : ""}${close}`;
    },
  );
}

function resolveToRoute(repoRelativePath: string): string | null {
  // strip leading ./ and trailing slash
  const p = repoRelativePath.replace(/^\.\//, "").replace(/\/$/, "");

  if (p === "ai-pm-playbook.md") return "/playbook";

  // Guides
  const guideMatch = p.match(/^docs\/(.+)\.md$/);
  if (guideMatch) {
    const slug = guideToSlug(guideMatch[1]);
    return `/guides/${slug}`;
  }

  // Templates (optional sub-folder)
  const optionalTplMatch = p.match(/^templates\/optional\/(.+)\.md$/);
  if (optionalTplMatch) return `/templates/optional-${optionalTplMatch[1]}`;
  const tplMatch = p.match(/^templates\/(.+)\.md$/);
  if (tplMatch) return `/templates/${tplMatch[1]}`;

  // Examples
  // index file
  const exIndexMatch = p.match(/^examples\/([^/]+)\/README\.md$/);
  if (exIndexMatch) return `/examples/${exIndexMatch[1]}`;
  // folder
  const exFolderMatch = p.match(/^examples\/([^/]+)$/);
  if (exFolderMatch) return `/examples/${exFolderMatch[1]}`;
  // artifact within folder
  const exArtMatch = p.match(/^examples\/([^/]+)\/(.+)\.(md|yaml|yml)$/);
  if (exArtMatch) {
    return `/examples/${exArtMatch[1]}/${exArtMatch[2]}`;
  }

  return null;
}

export function guideToSlug(filename: string): string {
  // 04-launch-gates -> launch-gates ; before-you-vibe-code stays
  return filename.replace(/^\d+-/, "");
}

export type GuideMeta = {
  slug: string;
  num: string;
  file: string;
  title: string;
  blurb: string;
  href: string;
};

export const GUIDE_FILES: { num: string; file: string; titleOverride?: string }[] = [
  { num: "Pre", file: "docs/before-you-vibe-code.md", titleOverride: "Before you vibe code" },
  { num: "00", file: "docs/00-walkthrough.md", titleOverride: "A week with the playbook" },
  { num: "01", file: "docs/01-eval-design.md" },
  { num: "02", file: "docs/02-agentic-products.md" },
  { num: "03", file: "docs/03-operating-ai-products.md" },
  { num: "04", file: "docs/04-launch-gates.md" },
  { num: "05", file: "docs/05-prompt-craft.md" },
  { num: "06", file: "docs/06-bad-to-good-ai-prd.md" },
  { num: "07", file: "docs/07-error-analysis.md" },
  { num: "08", file: "docs/08-artifact-flow-map.md" },
  { num: "09", file: "docs/09-agent-pm-starter-pack.md" },
  { num: "10", file: "docs/10-ai-native-pm-loop.md" },
];

export function loadGuides(): GuideMeta[] {
  return GUIDE_FILES.map(({ num, file, titleOverride }) => {
    const md = readRepoFile(file);
    const filename = path.basename(file, ".md");
    const slug = guideToSlug(filename);
    return {
      slug,
      num,
      file,
      title: titleOverride ?? extractTitle(md, slug),
      blurb: extractLede(md),
      href: `/guides/${slug}`,
    };
  });
}

export function loadGuideBySlug(slug: string) {
  const entry = GUIDE_FILES.find(
    (g) => guideToSlug(path.basename(g.file, ".md")) === slug,
  );
  if (!entry) return null;
  const md = readRepoFile(entry.file);
  const filename = path.basename(entry.file, ".md");
  const { markdown, toc } = processDocMarkdown(md, "docs");
  return {
    slug,
    num: entry.num,
    title: entry.titleOverride ?? extractTitle(md, filename),
    markdown,
    toc,
    file: entry.file,
  };
}

export type TemplateMeta = {
  slug: string;
  file: string;
  title: string;
  blurb: string;
  group: "core" | "optional";
  href: string;
};

export const TEMPLATE_FILES: { file: string; group: "core" | "optional"; slug?: string }[] = [
  { file: "templates/ai-opportunity-brief.md", group: "core" },
  { file: "templates/ai-prd.md", group: "core" },
  { file: "templates/ai-eval-plan.md", group: "core" },
  { file: "templates/human-review-workflow.md", group: "core" },
  { file: "templates/launch-gate-checklist.md", group: "core" },
  { file: "templates/ai-observability-plan.md", group: "core" },
  { file: "templates/ai-cost-model.md", group: "core" },
  { file: "templates/optional/ai-build-brief.md", group: "optional", slug: "optional-ai-build-brief" },
  { file: "templates/optional/ai-pm-review-checklist.md", group: "optional", slug: "optional-ai-pm-review-checklist" },
  { file: "templates/optional/prompt-change-record.md", group: "optional", slug: "optional-prompt-change-record" },
];

function templateSlug(file: string, override?: string): string {
  if (override) return override;
  return path.basename(file, ".md");
}

export function loadTemplates(): TemplateMeta[] {
  return TEMPLATE_FILES.map(({ file, group, slug }) => {
    const md = readRepoFile(file);
    const finalSlug = templateSlug(file, slug);
    return {
      slug: finalSlug,
      file,
      title: extractTitle(md, finalSlug),
      blurb: extractLede(md),
      group,
      href: `/templates/${finalSlug}`,
    };
  });
}

export function loadTemplateBySlug(slug: string) {
  const entry = TEMPLATE_FILES.find(
    (t) => templateSlug(t.file, t.slug) === slug,
  );
  if (!entry) return null;
  const md = readRepoFile(entry.file);
  const sourceDir = path.dirname(entry.file);
  const { markdown, toc } = processDocMarkdown(md, sourceDir);
  return {
    slug,
    file: entry.file,
    group: entry.group,
    title: extractTitle(md, slug),
    markdown,
    toc,
  };
}

export type CaseStudyMeta = {
  slug: string;
  folder: string;
  title: string;
  recommendation: string;
  risk: "Low" | "Medium" | "High";
  blurb: string;
  href: string;
  artifacts: CaseArtifactMeta[];
};

export type CaseArtifactMeta = {
  slug: string;
  file: string;
  title: string;
  kind: "doc" | "yaml";
  href: string;
};

const CASES: {
  slug: string;
  folder: string;
  title: string;
  risk: "Low" | "Medium" | "High";
  recommendation: string;
}[] = [
  {
    slug: "customer-support-copilot",
    folder: "examples/customer-support-copilot",
    title: "Customer Support Copilot",
    risk: "Medium",
    recommendation: "Pilot after blockers resolved",
  },
  {
    slug: "sales-call-crm-assistant",
    folder: "examples/sales-call-crm-assistant",
    title: "Sales Call CRM Assistant",
    risk: "Medium",
    recommendation: "Pilot after blockers resolved",
  },
  {
    slug: "healthcare-intake-assistant",
    folder: "examples/healthcare-intake-assistant",
    title: "Healthcare Intake Assistant",
    risk: "High",
    recommendation: "Prototype only. Do not launch",
  },
];

const ARTIFACT_TITLES: Record<string, string> = {
  "opportunity-brief": "Opportunity brief",
  "prd": "AI PRD",
  "eval-plan": "Eval plan",
  "launch-gate": "Launch gate",
  "cost-model": "Cost model",
  "post-launch-review-week-2": "Post-launch review (week 2)",
  "readiness-assessment": "Readiness assessment (YAML)",
};

const ARTIFACT_ORDER = [
  "opportunity-brief",
  "prd",
  "eval-plan",
  "cost-model",
  "launch-gate",
  "readiness-assessment",
  "post-launch-review-week-2",
];

export function loadCaseStudies(): CaseStudyMeta[] {
  return CASES.map((c) => {
    const readme = readRepoFile(`${c.folder}/README.md`);
    const files = fs
      .readdirSync(path.join(repoRoot, c.folder))
      .filter((f) => f !== "README.md")
      .filter((f) => /\.(md|ya?ml)$/.test(f));

    const artifacts: CaseArtifactMeta[] = files
      .map((f) => {
        const isYaml = /\.ya?ml$/.test(f);
        const baseName = f.replace(/\.(md|ya?ml)$/, "");
        const title = ARTIFACT_TITLES[baseName] ?? baseName;
        return {
          slug: baseName,
          file: `${c.folder}/${f}`,
          title,
          kind: (isYaml ? "yaml" : "doc") as "doc" | "yaml",
          href: `/examples/${c.slug}/${baseName}`,
        };
      })
      .sort((a, b) => {
        const ai = ARTIFACT_ORDER.indexOf(a.slug);
        const bi = ARTIFACT_ORDER.indexOf(b.slug);
        if (ai === -1 && bi === -1) return a.slug.localeCompare(b.slug);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });

    return {
      slug: c.slug,
      folder: c.folder,
      title: c.title,
      risk: c.risk,
      recommendation: c.recommendation,
      blurb: extractLede(readme),
      href: `/examples/${c.slug}`,
      artifacts,
    };
  });
}

export function loadCaseStudyBySlug(slug: string) {
  const all = loadCaseStudies();
  const c = all.find((x) => x.slug === slug);
  if (!c) return null;
  const readme = readRepoFile(`${c.folder}/README.md`);
  const { markdown, toc } = processDocMarkdown(readme, c.folder);
  return {
    ...c,
    readme: markdown,
    toc,
  };
}

export function loadCaseArtifact(caseSlug: string, artifactSlug: string) {
  const c = CASES.find((x) => x.slug === caseSlug);
  if (!c) return null;
  const candidates = [
    `${c.folder}/${artifactSlug}.md`,
    `${c.folder}/${artifactSlug}.yaml`,
    `${c.folder}/${artifactSlug}.yml`,
  ];
  const found = candidates.find(fileExists);
  if (!found) return null;
  const raw = readRepoFile(found);
  const isYaml = /\.ya?ml$/.test(found);
  const processed = isYaml
    ? { markdown: raw, toc: [] as TocEntry[] }
    : processDocMarkdown(raw, c.folder);
  return {
    caseSlug,
    artifactSlug,
    case: c,
    file: found,
    kind: (isYaml ? "yaml" : "doc") as "doc" | "yaml",
    title: ARTIFACT_TITLES[artifactSlug] ?? artifactSlug,
    body: processed.markdown,
    toc: processed.toc,
  };
}

export function loadPlaybook() {
  const md = readRepoFile("ai-pm-playbook.md");
  const { markdown, toc } = processDocMarkdown(md, ".");
  return {
    title: extractTitle(md, "AI PM Playbook"),
    markdown,
    toc,
  };
}

export function loadVibeCodeChecklist() {
  return readRepoFile("docs/before-you-vibe-code.md");
}

/* =====================================================================
 * Related-reading map: cross-links between templates, guides, and case
 * artifacts so a reader never hits a dead end.
 * ===================================================================== */

export type RelatedItem = {
  kind: "guide" | "template" | "case" | "playbook";
  slug: string;
  title: string;
  href: string;
  blurb: string;
};

const TEMPLATE_TO_GUIDES: Record<string, string[]> = {
  "ai-opportunity-brief": ["before-you-vibe-code", "walkthrough"],
  "ai-prd": ["bad-to-good-ai-prd", "agentic-products"],
  "ai-eval-plan": ["eval-design", "error-analysis"],
  "human-review-workflow": ["operating-ai-products"],
  "launch-gate-checklist": ["launch-gates"],
  "ai-observability-plan": ["operating-ai-products", "error-analysis"],
  "ai-cost-model": ["operating-ai-products", "agent-pm-starter-pack"],
  "optional-ai-build-brief": ["bad-to-good-ai-prd"],
  "optional-ai-pm-review-checklist": ["artifact-flow-map"],
  "optional-prompt-change-record": ["prompt-craft"],
};

const GUIDE_TO_TEMPLATES: Record<string, string[]> = {
  "before-you-vibe-code": ["ai-opportunity-brief"],
  "walkthrough": [
    "ai-opportunity-brief",
    "ai-prd",
    "ai-eval-plan",
    "launch-gate-checklist",
  ],
  "eval-design": ["ai-eval-plan"],
  "agentic-products": ["ai-prd"],
  "operating-ai-products": [
    "ai-observability-plan",
    "human-review-workflow",
    "ai-cost-model",
  ],
  "launch-gates": ["launch-gate-checklist"],
  "prompt-craft": ["optional-prompt-change-record"],
  "bad-to-good-ai-prd": ["ai-prd", "optional-ai-build-brief"],
  "error-analysis": ["ai-eval-plan", "ai-observability-plan"],
  "artifact-flow-map": [],
  "agent-pm-starter-pack": ["ai-prd", "ai-cost-model"],
  "ai-native-pm-loop": ["ai-eval-plan", "ai-observability-plan"],
};

/** Artifact basename → canonical template slug it implements. */
const ARTIFACT_TO_TEMPLATE: Record<string, string> = {
  "opportunity-brief": "ai-opportunity-brief",
  "prd": "ai-prd",
  "eval-plan": "ai-eval-plan",
  "launch-gate": "launch-gate-checklist",
  "cost-model": "ai-cost-model",
};

const GUIDE_TITLES: Record<string, string> = {
  "before-you-vibe-code": "Before you vibe code",
  walkthrough: "A week with the playbook",
  "eval-design": "Eval design",
  "agentic-products": "Agentic products",
  "operating-ai-products": "Operating AI products",
  "launch-gates": "Launch gates",
  "prompt-craft": "Prompt craft",
  "bad-to-good-ai-prd": "Bad to good AI PRD",
  "error-analysis": "Error analysis",
  "artifact-flow-map": "Artifact flow map",
  "agent-pm-starter-pack": "Agent PM starter pack",
  "ai-native-pm-loop": "AI-native PM loop",
};

const TEMPLATE_TITLES: Record<string, string> = {
  "ai-opportunity-brief": "Opportunity brief",
  "ai-prd": "AI PRD",
  "ai-eval-plan": "Eval plan",
  "human-review-workflow": "Human review workflow",
  "launch-gate-checklist": "Launch gate checklist",
  "ai-observability-plan": "Observability plan",
  "ai-cost-model": "Cost model",
  "optional-ai-build-brief": "AI build brief (optional)",
  "optional-ai-pm-review-checklist": "AI PM review checklist (optional)",
  "optional-prompt-change-record": "Prompt change record (optional)",
};

const GUIDE_BLURBS: Record<string, string> = {
  "before-you-vibe-code":
    "The 10-minute preflight before writing a PRD or opening an AI builder.",
  walkthrough:
    "One PM, one product, five artifacts. From opportunity brief to roadmap review.",
  "eval-design":
    "Building evals that catch real failures, including the ones you miss in demos.",
  "agentic-products":
    "How to spec agents vs chatbots vs copilots. Autonomy levels and tool boundaries.",
  "operating-ai-products":
    "Human review, safety, observability, and cost discipline after the demo works.",
  "launch-gates":
    "How to say 'do not launch' with evidence. And what would change your mind.",
  "prompt-craft":
    "Treating prompts as product surfaces. Versioning, regression, and ownership.",
  "bad-to-good-ai-prd":
    "Turning a vague AI assistant brief into a buildable PRD slice.",
  "error-analysis":
    "Reading traces, labeling failures, and deciding which evals are worth automating.",
  "artifact-flow-map":
    "What artifact comes when, who owns it, and what decision it unlocks.",
  "agent-pm-starter-pack":
    "Tool boundaries, autonomy, rollback, trajectory evals, cost ceilings, handoff.",
  "ai-native-pm-loop":
    "Build small PM agents, trace behavior, create evals from traces, improve safely.",
};

const TEMPLATE_BLURBS: Record<string, string> = {
  "ai-opportunity-brief":
    "Kill bad ideas here, not after a prototype. Decide whether AI is worth building.",
  "ai-prd":
    "Define what you're building, how the AI behaves, and what 'good' looks like.",
  "ai-eval-plan": "Define 'good' before trusting model output. Build a regression set.",
  "human-review-workflow":
    "Who validates, corrects, escalates, or blocks AI output before it matters.",
  "launch-gate-checklist":
    "Make a go/no-go call for pilot, production, or scale, with evidence.",
  "ai-observability-plan":
    "Monitor quality, drift, and cost in production with a weekly review.",
  "ai-cost-model":
    "Cost per workflow and margin impact at scale, with sensitivity analysis.",
  "optional-ai-build-brief":
    "When engineers or coding agents need a tighter spec than the PRD provides.",
  "optional-ai-pm-review-checklist":
    "What to ask before signing off on someone else's AI PRD.",
  "optional-prompt-change-record":
    "Track prompt diffs and their behavioral consequences over time.",
};

/** Template slug → one representative case-study artifact route. */
const TEMPLATE_TO_CASE_ARTIFACT: Record<
  string,
  { caseSlug: string; caseTitle: string; artifact: string } | undefined
> = {
  "ai-opportunity-brief": {
    caseSlug: "customer-support-copilot",
    caseTitle: "Customer Support Copilot",
    artifact: "opportunity-brief",
  },
  "ai-prd": {
    caseSlug: "customer-support-copilot",
    caseTitle: "Customer Support Copilot",
    artifact: "prd",
  },
  "ai-eval-plan": {
    caseSlug: "healthcare-intake-assistant",
    caseTitle: "Healthcare Intake Assistant",
    artifact: "eval-plan",
  },
  "launch-gate-checklist": {
    caseSlug: "healthcare-intake-assistant",
    caseTitle: "Healthcare Intake Assistant",
    artifact: "launch-gate",
  },
  "ai-cost-model": {
    caseSlug: "customer-support-copilot",
    caseTitle: "Customer Support Copilot",
    artifact: "cost-model",
  },
  "ai-observability-plan": undefined,
  "human-review-workflow": undefined,
  "optional-ai-build-brief": undefined,
  "optional-ai-pm-review-checklist": undefined,
  "optional-prompt-change-record": undefined,
};

export function relatedForTemplate(slug: string): RelatedItem[] {
  const guides = TEMPLATE_TO_GUIDES[slug] ?? [];
  const items: RelatedItem[] = guides.map((g) => ({
    kind: "guide",
    slug: g,
    title: GUIDE_TITLES[g] ?? g,
    href: `/guides/${g}`,
    blurb: GUIDE_BLURBS[g] ?? "",
  }));
  const caseLink = TEMPLATE_TO_CASE_ARTIFACT[slug];
  if (caseLink) {
    items.push({
      kind: "case",
      slug: `${caseLink.caseSlug}/${caseLink.artifact}`,
      title: `${caseLink.caseTitle}: ${ARTIFACT_TITLES[caseLink.artifact] ?? caseLink.artifact}`,
      href: `/examples/${caseLink.caseSlug}/${caseLink.artifact}`,
      blurb: "A worked example of this template filled in for a real case.",
    });
  }
  return items;
}

export function relatedForGuide(slug: string): RelatedItem[] {
  const templates = GUIDE_TO_TEMPLATES[slug] ?? [];
  return templates.map((t) => ({
    kind: "template",
    slug: t,
    title: TEMPLATE_TITLES[t] ?? t,
    href: `/templates/${t}`,
    blurb: TEMPLATE_BLURBS[t] ?? "",
  }));
}

export function templateForArtifact(artifactSlug: string): RelatedItem | null {
  const tSlug = ARTIFACT_TO_TEMPLATE[artifactSlug];
  if (!tSlug) return null;
  return {
    kind: "template",
    slug: tSlug,
    title: TEMPLATE_TITLES[tSlug] ?? tSlug,
    href: `/templates/${tSlug}`,
    blurb: TEMPLATE_BLURBS[tSlug] ?? "",
  };
}
