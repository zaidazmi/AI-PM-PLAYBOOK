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
 * Generic helper: remove a named ## section and the bullet list that follows.
 * Used by stripInlineTOC and stripFilesSection.
 */
function stripH2Section(
  markdown: string,
  match: (heading: string) => boolean,
): string {
  const lines = markdown.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const m = /^##\s+(.+?)\s*$/.exec(lines[i]);
    if (m && match(m[1].trim())) {
      i++; // skip heading
      while (i < lines.length) {
        const t = lines[i].trim();
        if (t === "" || /^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t)) {
          i++;
          continue;
        }
        break;
      }
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  return out.join("\n");
}

/**
 * Strip in-body "## Contents" / "## Table of Contents" sections. The sticky
 * sidebar TOC renders this list already, so the body version is duplication.
 */
export function stripInlineTOC(markdown: string): string {
  return stripH2Section(markdown, (h) =>
    /^(contents|table of contents|toc)$/i.test(h),
  );
}

/**
 * Strip "## Files" sections from case-study READMEs. The Artifacts card grid
 * on the case-study landing page shows the same list more usably.
 */
export function stripFilesSection(markdown: string): string {
  return stripH2Section(markdown, (h) => /^files$/i.test(h));
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
  // Run TOC strip BEFORE extractToc so "Contents" doesn't end up in the sidebar.
  const cleaned = stripInlineTOC(stripGithubBadges(stripFirstH1(rawMd)));
  const toc = extractToc(cleaned);
  const processed = styleInlineLabels(transformHtmlCommentHints(cleaned));
  const markdown = rewriteMarkdownLinks(processed, sourceDir);
  return { markdown, toc };
}

/**
 * Convert author-facing HTML comments into styled fill-in guidance.
 *
 * - Comments that occupy their own line render as a block hint (a soft
 *   left-bordered note) and act as section-level guidance.
 * - Comments embedded inline inside a list item or paragraph render as
 *   inline italic placeholder text attached to that field.
 */
export function transformHtmlCommentHints(markdown: string): string {
  return markdown.replace(
    /<!--([\s\S]*?)-->/g,
    (match, body: string, offset: number) => {
      const trimmed = body.trim();
      if (!trimmed) return "";
      const escaped = trimmed
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // Is the comment alone on its line?
      const before = markdown.slice(0, offset);
      const after = markdown.slice(offset + match.length);
      const isBlock =
        (before === "" || /(?:^|\n)[ \t]*$/.test(before)) &&
        (after === "" || /^[ \t]*(?:\n|$)/.test(after));

      if (isBlock) {
        return `\n<aside class="md-hint">${escaped}</aside>\n`;
      }
      return ` <span class="md-hint-inline">${escaped}</span>`;
    },
  );
}

/**
 * Estimate reading time in minutes from raw markdown. We strip out code
 * fences, inline code, HTML tags, link/image syntax, emphasis, heading/list
 * markers and table pipes so the word count tracks the actual prose a
 * reader will see — not the markup. 225 wpm is the standard middle-ground
 * for technical reading (lower than blog defaults like 265, higher than
 * very-conservative 200).
 *
 * Returns `{ minutes, words }`. Minimum 1 minute so short docs don't show
 * "0 min".
 */
export type ReadingTime = { minutes: number; words: number };

const WORDS_PER_MINUTE = 225;

export function computeReadingTime(markdown: string): ReadingTime {
  const plain = markdown
    // fenced code blocks
    .replace(/```[\s\S]*?```/g, " ")
    // indented code blocks (4-space)
    .replace(/(^|\n)( {4}|\t)[^\n]*/g, " ")
    // inline code
    .replace(/`[^`]*`/g, " ")
    // html tags (keep text content, drop tags)
    .replace(/<[^>]+>/g, " ")
    // images: ![alt](url) → drop entirely (alt rarely meaningful to reader)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    // links: [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // emphasis / strikethrough markers
    .replace(/[*_~]+/g, " ")
    // heading / blockquote / list / table markers at line start
    .replace(/^\s*[>#\-*+]+\s*/gm, " ")
    .replace(/^\s*\d+\.\s+/gm, " ")
    // table pipes
    .replace(/\|/g, " ")
    // collapse whitespace
    .replace(/\s+/g, " ")
    .trim();

  const words = plain ? plain.split(" ").length : 0;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return { minutes, words };
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
  readingTime: ReadingTime;
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
      readingTime: computeReadingTime(stripFirstH1(md)),
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
    readingTime: computeReadingTime(stripFirstH1(md)),
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
    filename: path.basename(entry.file),
    sizeBytes: Buffer.byteLength(md, "utf8"),
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

export type ArtifactPhase = "Decide" | "Build" | "Ship" | "Operate";

export type CaseArtifactMeta = {
  slug: string;
  file: string;
  title: string;
  kind: "doc" | "yaml";
  href: string;
  /** One-line summary parsed from the README's Files section. */
  description?: string;
  /** PM loop phase this artifact belongs to. */
  phase: ArtifactPhase;
  /** Reading time. `null` for YAML artifacts (structured data). */
  readingTime: ReadingTime | null;
  /** Hand-curated top finding for this artifact, if available. */
  topFinding?: string;
};

/**
 * Readiness assessment, parsed from each case study's
 * `readiness-assessment.yaml`. This data drives the at-a-glance scoring
 * card and the verdict callout — it's the single most valuable structured
 * artifact the case study produces and should not be hidden in the YAML
 * subpage.
 */
export type RecommendationLevel =
  | "production_candidate"
  | "pilot_candidate"
  | "prototype_only"
  | "stop"
  | string;

export type ReadinessDimension = {
  key: string;
  /** Human-readable label, e.g. "Eval readiness". */
  label: string;
  /** Score on the 1-5 readiness scale. */
  score: number;
  /** Evidence items the score is based on. */
  evidence: string[];
  /** Open risks at this score. */
  risks: string[];
  /** The single concrete next action the owner should take. */
  nextAction?: string;
  /** Who owns moving this dimension forward. */
  owner?: string;
};

export type CaseProduct = {
  name?: string;
  stage?: string;
  owner?: string;
  targetUsers: string[];
};

export type CaseUseCase = {
  problem?: string;
  aiJob?: string;
  nonAiAlternative?: string;
  expectedOutcome?: string;
};

export type ReadinessAssessment = {
  product: CaseProduct;
  useCase: CaseUseCase;
  dimensions: ReadinessDimension[];
  /** 1-5 weighted average across dimensions. */
  weightedScore: number;
  recommendationLevel: RecommendationLevel;
  /** A short paragraph explaining the verdict. */
  rationale: string;
  blockersBeforePilot: string[];
  blockersBeforeProduction: string[];
  /**
   * Constraints that apply for "prototype only / do not launch" cases — the
   * conditions any prototype work must respect even though pilot/production
   * are off the table.
   */
  conditions: string[];
  /** Optional alternative path the team could take instead. */
  alternativeRecommendation?: string;
};

const DIMENSION_LABELS: Record<string, string> = {
  problem_fit: "Problem fit",
  workflow_fit: "Workflow fit",
  ai_job_definition: "AI job definition",
  data_readiness: "Data readiness",
  eval_readiness: "Eval readiness",
  system_behavior: "System behavior",
  risk_and_safety: "Risk & safety",
  regulatory_readiness: "Regulatory readiness",
  cost_and_business_case: "Cost & business case",
  observability: "Observability",
  launch_and_operations: "Launch & ops",
};

const DIMENSION_ORDER = Object.keys(DIMENSION_LABELS);

/* =====================================================================
 * YAML parsing for readiness-assessment.yaml
 *
 * The schema is regular and shallow (2-/4-/6-space indents, lists as
 * `- "value"`). Rather than add a YAML dependency, we operate on the raw
 * text with a small set of helpers. The parsers below are tolerant of
 * trailing spaces and quoted/unquoted string values.
 * ===================================================================== */

/** Strip a leading and trailing `"` (or `'`) if present. */
function unquote(s: string): string {
  return s.trim().replace(/^["']|["']$/g, "").trim();
}

/**
 * Extract the body of a top-level block (`product:`, `use_case:`,
 * `recommendation:`, etc.) along with the indent level used inside it.
 * Returns null if the block isn't present.
 */
function topLevelBlock(yaml: string, name: string): string | null {
  const re = new RegExp(`(^|\\n)${name}:\\s*\\n([\\s\\S]+?)(?=\\n[a-z_][a-z0-9_]*:\\s*\\n|\\n*$)`);
  const m = re.exec(yaml);
  return m ? m[2] : null;
}

/**
 * Extract a sub-block (e.g. `problem_fit:`) nested inside a parent block
 * (e.g. the body returned from `topLevelBlock("dimensions")`). The parent
 * block's children are indented two extra spaces, so the sub-block label
 * sits at the parent's child indent (4 spaces from the top of file).
 */
function subBlock(
  parentBody: string,
  name: string,
  childIndent: number,
): string | null {
  const indent = " ".repeat(childIndent);
  const re = new RegExp(
    `(^|\\n)${indent}${name}:\\s*\\n([\\s\\S]+?)(?=\\n${indent}[a-z_][a-z0-9_]*:|\\n*$)`,
  );
  const m = re.exec(parentBody);
  return m ? m[2] : null;
}

/** Extract `key: value` scalar at a known indent. */
function scalarAt(
  body: string,
  key: string,
  indent: number,
): string | undefined {
  const re = new RegExp(`^ {${indent}}${key}:\\s*(.*)$`, "m");
  const m = re.exec(body);
  if (!m) return undefined;
  const v = unquote(m[1]);
  return v.length ? v : undefined;
}

/**
 * Extract a `key:` followed by a YAML list at a known indent. Items are
 * `- "..."` or `- ...` at `indent + 2`. The list ends at the first line
 * that is not blank and not a list item at the expected indent.
 */
function listAt(body: string, key: string, indent: number): string[] {
  const headerRe = new RegExp(`^ {${indent}}${key}:\\s*$`, "m");
  const m = headerRe.exec(body);
  if (!m) return [];
  const after = body.slice(m.index + m[0].length + 1);
  const itemIndent = indent + 2;
  const itemRe = new RegExp(`^ {${itemIndent}}-\\s*(.*)$`);
  const items: string[] = [];
  for (const line of after.split("\n")) {
    const im = itemRe.exec(line);
    if (im) {
      items.push(unquote(im[1]));
      continue;
    }
    if (line.trim() === "") continue;
    break;
  }
  return items;
}

const DIMENSION_LABELS_INTERNAL = DIMENSION_LABELS;

export function parseReadinessAssessment(
  yaml: string,
): ReadinessAssessment | null {
  // --- product ---
  const productBody = topLevelBlock(yaml, "product") ?? "";
  const product: CaseProduct = {
    name: scalarAt(productBody, "name", 2),
    stage: scalarAt(productBody, "stage", 2),
    owner: scalarAt(productBody, "owner", 2),
    targetUsers: listAt(productBody, "target_users", 2),
  };

  // --- use_case ---
  const ucBody = topLevelBlock(yaml, "use_case") ?? "";
  const useCase: CaseUseCase = {
    problem: scalarAt(ucBody, "problem", 2),
    aiJob: scalarAt(ucBody, "ai_job", 2),
    nonAiAlternative: scalarAt(ucBody, "non_ai_alternative", 2),
    expectedOutcome: scalarAt(ucBody, "expected_outcome", 2),
  };

  // --- dimensions ---
  const dimsBody = topLevelBlock(yaml, "dimensions") ?? "";
  const dimensions: ReadinessDimension[] = [];
  for (const key of DIMENSION_ORDER) {
    const dimBody = subBlock(dimsBody, key, 2);
    if (!dimBody) continue;
    const scoreRaw = scalarAt(dimBody, "score", 4);
    if (!scoreRaw) continue;
    dimensions.push({
      key,
      label: DIMENSION_LABELS_INTERNAL[key],
      score: Number(scoreRaw),
      evidence: listAt(dimBody, "evidence", 4),
      risks: listAt(dimBody, "risks", 4),
      nextAction: scalarAt(dimBody, "next_action", 4),
      owner: scalarAt(dimBody, "owner", 4),
    });
  }
  if (dimensions.length === 0) return null;

  // --- recommendation ---
  const recBody = topLevelBlock(yaml, "recommendation") ?? "";
  const weighted = scalarAt(recBody, "weighted_score", 2);
  const level = scalarAt(recBody, "level", 2);
  const rationale = scalarAt(recBody, "rationale", 2);
  const alt = scalarAt(recBody, "alternative_recommendation", 2);

  return {
    product,
    useCase,
    dimensions,
    weightedScore: weighted ? Number(weighted) : 0,
    recommendationLevel: level ?? "pilot_candidate",
    rationale: rationale ?? "",
    blockersBeforePilot: listAt(recBody, "blockers_before_pilot", 2),
    blockersBeforeProduction: listAt(recBody, "blockers_before_production", 2),
    conditions: listAt(recBody, "conditions", 2),
    alternativeRecommendation: alt || undefined,
  };
}

const ARTIFACT_PHASE: Record<string, ArtifactPhase> = {
  "opportunity-brief": "Decide",
  prd: "Build",
  "eval-plan": "Build",
  "cost-model": "Build",
  "launch-gate": "Ship",
  "readiness-assessment": "Ship",
  "post-launch-review-week-2": "Operate",
};

/**
 * Hand-curated "top finding" per artifact, keyed by `${caseSlug}/${artifactSlug}`.
 * Surfaced on the artifact timeline cards so a reader sees the killer line from
 * each file without clicking. The convention is: ONE sentence, the punchy fact
 * a senior PM would tell another senior PM in the hallway about that artifact.
 *
 * If an artifact isn't in this map, the card just shows the description from
 * the README's Files section (or nothing).
 */
const ARTIFACT_TOP_FINDING: Record<string, string> = {
  // --- Customer Support Copilot ---
  "customer-support-copilot/opportunity-brief":
    "Top 10 intents alone cover 31% of ticket volume — even a v1 limited to those is meaningful.",
  "customer-support-copilot/prd":
    "Autonomy locked at 'suggest'. Humans send every customer-facing message in v1.",
  "customer-support-copilot/eval-plan":
    "Five golden examples drafted, but no labeled regression set. Quality signal is 'looks good' until that closes.",
  "customer-support-copilot/cost-model":
    "$0.0094 per draft. ~$51/month at v1 scope. Cost is not the bottleneck; eval and observability are.",
  "customer-support-copilot/launch-gate":
    "Weighted score 2.86 / 5. Four pilot blockers — eval set, accept/edit logging, low-confidence fallback, legal sign-off.",
  "customer-support-copilot/post-launch-review-week-2":
    "Week 2 of the pilot: accept rate, edit rate, hallucination count, and what the data tells the team to change.",
  "customer-support-copilot/readiness-assessment":
    "The structured scoring input that drives the verdict callout and dimensions above.",

  // --- Sales Call CRM Assistant ---
  "sales-call-crm-assistant/opportunity-brief":
    "45 min/day per rep on CRM updates. 30% of pipeline fields go stale within five days of a call.",
  "sales-call-crm-assistant/prd":
    "Five extracted fields, schema-typed, every value cited to a transcript span or left blank.",
  "sales-call-crm-assistant/eval-plan":
    "Extraction accuracy AND evidence checks. A correct value without a transcript citation still fails.",
  "sales-call-crm-assistant/launch-gate":
    "Score 3.07. Pilot moves only after consent flag coverage and confidence calibration close.",
  "sales-call-crm-assistant/readiness-assessment":
    "The structured scoring input. Eleven dimensions, blockers, the Gong-only fallback path.",

  // --- Healthcare Intake Assistant ---
  "healthcare-intake-assistant/opportunity-brief":
    "The non-AI alternative — a smart digital form — likely captures most of the value without the compliance cost.",
  "healthcare-intake-assistant/prd":
    "AI job locked to demographics and insurance only. Hard escalation on any clinical question.",
  "healthcare-intake-assistant/eval-plan":
    "200 synthetic scenarios planned across benign / ambiguous / adversarial. Zero of 200 built today.",
  "healthcare-intake-assistant/launch-gate":
    "Score 1.95. Recommendation: do not launch. Build the form. Keep the AI prototype alive on synthetic data only.",
  "healthcare-intake-assistant/readiness-assessment":
    "The structured scoring input. Eleven dimensions, the prototype conditions, the alternative-path rationale.",
};

export function topFindingFor(
  caseSlug: string,
  artifactSlug: string,
): string | undefined {
  return ARTIFACT_TOP_FINDING[`${caseSlug}/${artifactSlug}`];
}

/**
 * Parse the README's "## Files" section into a map of filename-without-extension
 * to description. The case-study landing page renders the Files content as
 * artifact cards, so descriptions enrich the cards.
 */
function parseFilesDescriptions(readme: string): Map<string, string> {
  const out = new Map<string, string>();
  const lines = readme.split("\n");
  let inFiles = false;
  for (const line of lines) {
    if (/^##\s+files\s*$/i.test(line)) {
      inFiles = true;
      continue;
    }
    if (!inFiles) continue;
    if (/^##\s/.test(line)) break;
    const m = /^-\s*`([^`]+)`\s*[:.]\s*(.+)$/.exec(line.trim());
    if (m) {
      const base = m[1].replace(/\.(md|ya?ml)$/, "");
      out.set(base, m[2].trim().replace(/\.$/, "") + ".");
    }
  }
  return out;
}

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
    const descriptions = parseFilesDescriptions(readme);
    const files = fs
      .readdirSync(path.join(repoRoot, c.folder))
      .filter((f) => f !== "README.md")
      .filter((f) => /\.(md|ya?ml)$/.test(f));

    const artifacts: CaseArtifactMeta[] = files
      .map((f) => {
        const isYaml = /\.ya?ml$/.test(f);
        const baseName = f.replace(/\.(md|ya?ml)$/, "");
        const title = ARTIFACT_TITLES[baseName] ?? baseName;
        const filePath = `${c.folder}/${f}`;
        const body = readRepoFile(filePath);
        return {
          slug: baseName,
          file: filePath,
          title,
          kind: (isYaml ? "yaml" : "doc") as "doc" | "yaml",
          href: `/examples/${c.slug}/${baseName}`,
          description: descriptions.get(baseName),
          phase: ARTIFACT_PHASE[baseName] ?? "Build",
          readingTime: isYaml ? null : computeReadingTime(stripFirstH1(body)),
          topFinding: ARTIFACT_TOP_FINDING[`${c.slug}/${baseName}`],
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
  const raw = readRepoFile(`${c.folder}/README.md`);
  // Strip the "## Files" section: the Artifacts card grid renders it more usably.
  const readme = stripFilesSection(raw);
  const { markdown, toc } = processDocMarkdown(readme, c.folder);

  // Reading time for a case study covers the README PLUS every artifact a
  // reader is meant to walk through (opportunity brief, PRD, eval plan,
  // launch gate, etc.). Summing per-file words and converting once is more
  // accurate than rounding each file's minutes up and summing those.
  let totalWords = computeReadingTime(stripFirstH1(readme)).words;
  for (const a of c.artifacts) {
    const body = readRepoFile(a.file);
    totalWords += computeReadingTime(stripFirstH1(body)).words;
  }
  const totalMinutes = Math.max(1, Math.round(totalWords / WORDS_PER_MINUTE));

  // Parse the readiness-assessment.yaml if present so the page can render
  // the scoring card and verdict callout from structured data.
  const yamlPath = `${c.folder}/readiness-assessment.yaml`;
  const readiness = fileExists(yamlPath)
    ? parseReadinessAssessment(readRepoFile(yamlPath))
    : null;

  return {
    ...c,
    readme: markdown,
    toc,
    readingTime: { minutes: totalMinutes, words: totalWords } as ReadingTime,
    readiness,
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
    // Reading time only makes sense for prose. YAML is structured data.
    readingTime: isYaml ? null : computeReadingTime(stripFirstH1(raw)),
  };
}

export function loadPlaybook() {
  const md = readRepoFile("ai-pm-playbook.md");
  const { markdown, toc } = processDocMarkdown(md, ".");
  return {
    title: extractTitle(md, "AI PM Playbook"),
    markdown,
    toc,
    readingTime: computeReadingTime(stripFirstH1(md)),
  };
}

export function loadVibeCodeChecklist() {
  return readRepoFile("docs/before-you-vibe-code.md");
}

/* =====================================================================
 * Search index: a flat, build-time list of every page's title, blurb and
 * plain-text body. Served as a static JSON file and filtered client-side.
 * ===================================================================== */

export type SearchKind = "Playbook" | "Guide" | "Template" | "Case study";

export type SearchDoc = {
  title: string;
  href: string;
  kind: SearchKind;
  blurb: string;
  /** Plain-text body (headings + prose + fill-in hints), capped for size. */
  text: string;
};

/** Strip markdown to searchable plain text. Comment delimiters are dropped
 * but the guidance text inside them is kept (it describes each field). */
function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<!--|-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every heading (H1–H6) in a doc, joined. Section names are high-signal and
 * cheap, so we index all of them regardless of how deep they sit. */
function extractHeadingsText(md: string): string {
  const out: string[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^#{1,6}\s+(.+?)\s*$/.exec(line);
    if (m) out.push(m[1].replace(/[`*_]/g, "").trim());
  }
  return out.join(" · ");
}

const SEARCH_PROSE_CAP = 1500;

/** Searchable body: all headings (full doc) + a capped prose excerpt. */
function buildSearchText(md: string, isYaml = false): string {
  const prose = toPlainText(isYaml ? md : stripFirstH1(md));
  const capped =
    prose.length > SEARCH_PROSE_CAP ? prose.slice(0, SEARCH_PROSE_CAP) : prose;
  if (isYaml) return capped;
  const headings = extractHeadingsText(md);
  return headings ? `${headings} ${capped}` : capped;
}

export function loadSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  const pb = readRepoFile("ai-pm-playbook.md");
  docs.push({
    title: extractTitle(pb, "AI PM Playbook"),
    href: "/playbook",
    kind: "Playbook",
    blurb: extractLede(pb),
    text: buildSearchText(pb),
  });

  for (const g of loadGuides()) {
    docs.push({
      title: g.title,
      href: g.href,
      kind: "Guide",
      blurb: g.blurb,
      text: buildSearchText(readRepoFile(g.file)),
    });
  }

  for (const t of loadTemplates()) {
    docs.push({
      title: t.title,
      href: t.href,
      kind: "Template",
      blurb: t.blurb,
      text: buildSearchText(readRepoFile(t.file)),
    });
  }

  for (const c of loadCaseStudies()) {
    docs.push({
      title: c.title,
      href: c.href,
      kind: "Case study",
      blurb: c.blurb,
      text: buildSearchText(readRepoFile(`${c.folder}/README.md`)),
    });
    for (const a of c.artifacts) {
      docs.push({
        title: `${c.title}: ${a.title}`,
        href: a.href,
        kind: "Case study",
        blurb: a.description ?? "",
        text: buildSearchText(readRepoFile(a.file), a.kind === "yaml"),
      });
    }
  }

  return docs;
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
