import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Clock } from "lucide-react";
import { Container, SectionLabel } from "./Container";
import { Reveal } from "./Reveal";

type FeaturedTemplate = {
  slug: string;
  title: string;
  blurb: string;
  excerpt: string;
  time: string;
  stage: string;
  accent: "peach" | "lavender" | "mint";
};

const featured: FeaturedTemplate[] = [
  {
    slug: "ai-opportunity-brief",
    title: "Opportunity brief",
    blurb:
      "Kill bad ideas here, not after a prototype. Decide whether AI is worth building before anyone writes a line of code.",
    excerpt:
      "If the idea is not coherent across user, AI job, human control, evals, risk, and cost, stop here and sharpen it before building.",
    time: "30–60 min",
    stage: "Stage 1 · Decide",
    accent: "peach",
  },
  {
    slug: "ai-prd",
    title: "AI PRD",
    blurb:
      "Define what you're building, how the AI behaves, and what 'good' looks like. The AI job statement is the most important line.",
    excerpt:
      "Upstream of the eval plan, human review workflow, cost model, observability plan, and launch gate. The PRD makes them coherent.",
    time: "2–3 hrs",
    stage: "Stage 2 · Build",
    accent: "lavender",
  },
  {
    slug: "launch-gate-checklist",
    title: "Launch gate",
    blurb:
      "Make a go/no-go call for pilot, production, or scale, with evidence, not vibes. Three gates. Do not skip gates.",
    excerpt:
      "Output: a go/no-go decision with rationale, conditions, owner, and a reversal trigger you'd accept.",
    time: "1–2 hrs",
    stage: "Stage 3 · Ship",
    accent: "mint",
  },
];

const accentClass: Record<string, string> = {
  peach: "bg-peach text-[#7a3b0d]",
  lavender: "bg-lavender text-[#3f2a63]",
  mint: "bg-mint text-[#1e4a30]",
};

const dotClass: Record<string, string> = {
  peach: "bg-[#d97c4a]",
  lavender: "bg-[#7a5fb5]",
  mint: "bg-[#3a7d5a]",
};

export function FeaturedTemplates() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#efece5]">
      <Container>
        <div className="flex flex-col gap-4 mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel num="02" label="Start here" />
            <h2 className="mt-5 text-4xl sm:text-6xl tracking-[-0.025em] leading-[0.98]">
              The three artifacts you'll{" "}
              <span className="font-display italic">actually use</span> on day
              one.
            </h2>
          </div>
          <p className="max-w-md text-foreground/70 text-[15px] leading-relaxed">
            If you only steal three things from this playbook, take these.
            Opportunity → PRD → Launch gate. Everything else hangs off them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {featured.map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.08}>
              <Link
                href={`/templates/${t.slug}`}
                className="lift group block card p-7 h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${accentClass[t.accent]}`}
                  >
                    <span className={`size-1.5 rounded-full ${dotClass[t.accent]}`} />
                    {t.stage}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-foreground/30 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="text-[26px] tracking-[-0.02em] leading-[1.1] font-medium mb-3">
                  {t.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-foreground/70 mb-5">
                  {t.blurb}
                </p>

                <blockquote className="relative pl-4 my-5 border-l-2 border-foreground/15 text-[13.5px] leading-relaxed text-foreground/60 italic">
                  <span className="font-display not-italic text-foreground/30 text-2xl absolute -left-1 -top-1 leading-none">
                    “
                  </span>
                  {t.excerpt}
                </blockquote>

                <div className="mt-6 pt-5 border-t border-border flex items-center justify-between text-[12px] text-foreground/60">
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="size-3.5" strokeWidth={1.8} />
                    Template
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" strokeWidth={1.8} />
                    {t.time}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/templates"
            className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground border-b border-foreground/30 pb-0.5 hover:border-foreground transition-colors"
          >
            See all 10 templates
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.2}
            />
          </Link>
          <span className="text-[13px] text-foreground/55">
            MIT licensed · copy, edit, ship
          </span>
        </div>
      </Container>
    </section>
  );
}
