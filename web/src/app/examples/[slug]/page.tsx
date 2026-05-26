import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DocBreadcrumb, DocHero, ReadingTimePill } from "@/components/DocShell";
import { DocLayout } from "@/components/DocLayout";
import { Markdown } from "@/components/Markdown";
import { Container } from "@/components/Container";
import { ReadinessScoreCard } from "@/components/ReadinessScoreCard";
import { UseCaseSummary } from "@/components/UseCaseSummary";
import {
  VerdictCallout,
  BlockersAndAlternative,
} from "@/components/VerdictCallout";
import {
  loadCaseStudies,
  loadCaseStudyBySlug,
  type ArtifactPhase,
  type CaseArtifactMeta,
} from "@/lib/content";

import { caseStudies as landingCaseCopy } from "@/data/content";

const riskColor: Record<string, string> = {
  Low: "bg-[#cbe6d4] text-[#1e4a30]",
  Medium: "bg-[#f0e6b8] text-[#5b4a06]",
  High: "bg-[#f1c9c9] text-[#7a1e1e]",
};

export function generateStaticParams() {
  return loadCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = loadCaseStudyBySlug(slug);
  if (!c) return { title: "Not found" };
  return { title: `${c.title} · AI PM Playbook` };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = loadCaseStudyBySlug(slug);
  if (!c) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocHero
          eyebrow={
            <DocBreadcrumb
              crumbs={[
                { label: "Home", href: "/" },
                { label: "Case studies", href: "/examples" },
                { label: c.title },
              ]}
            />
          }
          title={c.title}
          meta={
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${riskColor[c.risk]}`}
              >
                {c.risk} risk
              </span>
              <ReadingTimePill
                minutes={c.readingTime.minutes}
                label="min full case"
              />
            </div>
          }
        />

        {/* The verdict and the rationale come first, so a reader who
            doesn't scroll past the fold still leaves with the answer. */}
        <VerdictCallout
          recommendation={c.recommendation}
          readiness={c.readiness}
        />

        {/* Business framing — problem, AI job, non-AI alternative,
            expected outcome — so the reader has full context before the
            scoring rolls in. */}
        {c.readiness ? (
          <UseCaseSummary
            product={c.readiness.product}
            useCase={c.readiness.useCase}
          />
        ) : null}

        {/* At-a-glance scoring across the 11 dimensions of the readiness
            model. Each row expands for evidence, risks, and next action. */}
        {c.readiness ? (
          <ReadinessScoreCard readiness={c.readiness} />
        ) : null}

        {/* Production blockers + alternative path, when applicable. */}
        {c.readiness ? (
          <BlockersAndAlternative readiness={c.readiness} />
        ) : null}

        {/* Narrative README (Recommendation prose + anything else the
            author wrote). Lives below the structured data now so the
            scannable facts come first and the prose elaborates. */}
        <DocLayout toc={c.toc}>
          <Markdown>{c.readme}</Markdown>
        </DocLayout>

        <ArtifactsTimeline artifacts={c.artifacts} />

        {/* Other case studies, so the page isn't a dead end */}
        <OtherCases currentSlug={slug} />
      </main>
      <Footer />
    </>
  );
}

const phaseStyle: Record<
  ArtifactPhase,
  { dot: string; chipBg: string; chipText: string; rail: string }
> = {
  Decide: {
    dot: "bg-[#d97c4a]",
    chipBg: "bg-peach/55",
    chipText: "text-[#7a3b0d]",
    rail: "bg-[#d97c4a]/30",
  },
  Build: {
    dot: "bg-[#7a5fb5]",
    chipBg: "bg-lavender/55",
    chipText: "text-[#3f2a63]",
    rail: "bg-[#7a5fb5]/30",
  },
  Ship: {
    dot: "bg-[#3a7d5a]",
    chipBg: "bg-mint/55",
    chipText: "text-[#1e4a30]",
    rail: "bg-[#3a7d5a]/30",
  },
  Operate: {
    dot: "bg-[#b58a1f]",
    chipBg: "bg-butter/55",
    chipText: "text-[#5b4a06]",
    rail: "bg-[#b58a1f]/30",
  },
};

function ArtifactsTimeline({
  artifacts,
}: {
  artifacts: CaseArtifactMeta[];
}) {
  // Sum reading time per phase so the reader can budget the case by
  // phase. YAML artifacts contribute 0 since they're structured data.
  const phaseTotals = new Map<ArtifactPhase, number>();
  for (const a of artifacts) {
    const m = a.readingTime?.minutes ?? 0;
    phaseTotals.set(a.phase, (phaseTotals.get(a.phase) ?? 0) + m);
  }
  const orderedPhases: ArtifactPhase[] = ["Decide", "Build", "Ship", "Operate"];

  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="max-w-[860px] mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-3">
            <div>
              <h2 className="text-[24px] tracking-tight font-medium">
                The artifacts, in order
              </h2>
              <p className="mt-1.5 text-[14px] text-foreground/65 max-w-[58ch]">
                Read top to bottom to follow this case from opportunity to
                operating decisions.
              </p>
            </div>
            <span className="text-[11px] uppercase tracking-[0.14em] text-foreground/50 tabular-nums shrink-0">
              {artifacts.length} files
            </span>
          </div>

          {/* Per-phase budget — what to expect at each stop on the rail. */}
          <div className="mt-5 mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            {orderedPhases
              .filter((p) => phaseTotals.has(p))
              .map((p) => {
                const minutes = phaseTotals.get(p) ?? 0;
                const style = phaseStyle[p];
                return (
                  <span
                    key={p}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${style.chipBg} ${style.chipText}`}
                  >
                    <span className={`size-1.5 rounded-full ${style.dot}`} />
                    {p}
                    <span className="opacity-70 normal-case tracking-normal tabular-nums">
                      · {minutes} min
                    </span>
                  </span>
                );
              })}
          </div>

          <ol className="relative mt-8">
            {/* The connecting rail */}
            <div
              aria-hidden
              className="absolute left-[7px] top-3 bottom-3 w-px bg-border"
            />
            {artifacts.map((a, i) => {
              const style = phaseStyle[a.phase];
              return (
                <li key={a.slug} className="relative pl-9 pb-3 last:pb-0">
                  <span
                    aria-hidden
                    className={`absolute left-0 top-[10px] inline-flex size-[14px] rounded-full border-[3px] border-background ${style.dot}`}
                  />
                  <Link
                    href={a.href}
                    className="group block rounded-2xl border border-border bg-surface px-5 py-4 hover:border-foreground/30 hover:bg-[#fbfaf6] transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-3 flex-wrap min-w-0">
                        <span className="text-[12px] tabular-nums font-mono text-foreground/40 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-[17px] tracking-tight font-medium text-foreground">
                          {a.title}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${style.chipBg} ${style.chipText}`}
                        >
                          {a.phase}
                        </span>
                        {a.kind === "yaml" ? (
                          <span className="inline-flex items-center rounded bg-foreground/[0.06] px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-foreground/65">
                            YAML
                          </span>
                        ) : null}
                      </div>
                      <ArrowUpRight
                        className="size-4 text-foreground/35 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0"
                        strokeWidth={1.8}
                      />
                    </div>
                    {a.description ? (
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/65">
                        {a.description}
                      </p>
                    ) : null}
                    {a.topFinding ? (
                      <div className="mt-3 pl-3 border-l-2 border-foreground/15">
                        <div className="text-[10.5px] uppercase tracking-[0.14em] text-foreground/50 mb-0.5">
                          Top finding
                        </div>
                        <p className="text-[13.5px] leading-relaxed text-foreground/85">
                          {a.topFinding}
                        </p>
                      </div>
                    ) : null}
                    {a.readingTime ? (
                      <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-foreground/55 tabular-nums">
                        <Clock className="size-3" strokeWidth={1.8} />
                        {a.readingTime.minutes} min read
                      </div>
                    ) : (
                      <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-foreground/45 uppercase tracking-[0.12em]">
                        Structured data
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function OtherCases({ currentSlug }: { currentSlug: string }) {
  const others = loadCaseStudies().filter((c) => c.slug !== currentSlug);
  if (others.length === 0) return null;
  // Pull the curated quote + persona from the landing-page copy so these
  // cards do the same teaching work the case-studies index does. The
  // landing-page entries are keyed by href, so derive the slug.
  const landingBySlug = new Map(
    landingCaseCopy.map((x) => [x.href.replace(/^\/examples\//, ""), x]),
  );
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="max-w-[860px] mx-auto">
          <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-border">
            <h2 className="text-[15px] font-medium tracking-tight">
              Other case studies
            </h2>
            <span className="text-[11px] uppercase tracking-wider text-foreground/45">
              {others.length} more
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {others.map((c) => {
              const landing = landingBySlug.get(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={c.href}
                  className="lift group block card p-6 h-full flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${riskColor[c.risk]}`}
                    >
                      {c.risk} risk
                    </span>
                    <ArrowUpRight
                      className="size-4 text-foreground/40 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.8}
                    />
                  </div>
                  <h3 className="text-[18px] tracking-tight font-medium mb-3 leading-snug">
                    {c.title}
                  </h3>
                  {landing?.quote ? (
                    <p className="text-[13px] leading-relaxed text-foreground/65 mb-5 line-clamp-3">
                      &ldquo;{landing.quote}&rdquo;
                    </p>
                  ) : null}
                  <div className="mt-auto pt-4 border-t border-border flex items-baseline justify-between gap-3">
                    <div>
                      <div className="text-[10.5px] uppercase tracking-[0.12em] text-foreground/45">
                        Verdict
                      </div>
                      <div className="text-[12.5px] font-medium text-foreground/85 mt-0.5 leading-snug">
                        {c.recommendation}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] text-foreground/55 tabular-nums shrink-0">
                      <Clock className="size-3" strokeWidth={1.8} />
                      {fullCaseMinutes(c.slug)} min full case
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Returns the aggregated reading time for a sibling case so the cards
 * can display "N min full case" without double-loading the markdown
 * already loaded above.
 */
function fullCaseMinutes(slug: string): number {
  return loadCaseStudyBySlug(slug)?.readingTime.minutes ?? 0;
}
