import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Container, SectionLabel } from "./Container";
import { Reveal } from "./Reveal";
import { guides as allGuides, type Guide } from "@/data/content";

type GroupName = "Foundations" | "Building" | "Operating" | "Advanced";

type Group = {
  name: GroupName;
  tagline: string;
  slugs: string[]; // matches href without /guides/
};

// Group definitions — each grouping aligns to a phase of the PM loop
const groups: Group[] = [
  {
    name: "Foundations",
    tagline: "Decide whether AI is the right tool, and what ‘good’ looks like.",
    slugs: ["before-you-vibe-code", "walkthrough", "bad-to-good-ai-prd"],
  },
  {
    name: "Building",
    tagline: "Spec the AI job, design evals, and treat prompts as product.",
    slugs: ["eval-design", "agentic-products", "prompt-craft", "agent-pm-starter-pack"],
  },
  {
    name: "Operating",
    tagline: "Run the system after the demo works.",
    slugs: ["operating-ai-products", "launch-gates", "error-analysis"],
  },
  {
    name: "Advanced",
    tagline: "Tie it all together. Build the loop into your team.",
    slugs: ["artifact-flow-map", "ai-native-pm-loop"],
  },
];

function bySlug(href: string): string {
  return href.replace(/^\/guides\//, "");
}

export function Guides() {
  // Index guides by slug for quick lookup
  const map = new Map<string, Guide>();
  for (const g of allGuides) map.set(bySlug(g.href), g);

  return (
    <section id="guides" className="relative py-24 sm:py-32 bg-[#efece5]">
      <Container>
        <div className="flex flex-col gap-4 mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel num="06" label="Guides" />
            <h2 className="mt-5 text-4xl sm:text-6xl tracking-[-0.025em] leading-[0.98]">
              Twelve guides,{" "}
              <span className="font-display italic">grouped by phase.</span>
            </h2>
          </div>
          <p className="max-w-md text-foreground/70 text-[15px] leading-relaxed">
            Jump to where you are in the loop. Each guide is opinionated, with
            examples and decision frames.
          </p>
        </div>

        <div className="space-y-14">
          {groups.map((group, gi) => (
            <Reveal key={group.name} delay={gi * 0.05}>
              <div>
                <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-border">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[11px] tabular-nums font-mono text-foreground/40">
                      0{gi + 1}
                    </span>
                    <h3 className="text-[22px] tracking-tight font-medium">
                      {group.name}
                    </h3>
                    <span className="hidden sm:inline text-[13px] text-foreground/60">
                      · {group.tagline}
                    </span>
                  </div>
                  <span className="text-[12px] uppercase tracking-wider text-foreground/45">
                    {group.slugs.length} guides
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {group.slugs.map((slug, i) => {
                    const g = map.get(slug);
                    if (!g) return null;
                    return (
                      <Reveal key={slug} delay={(i % 3) * 0.04}>
                        <Link
                          href={g.href}
                          className="lift group block card p-6 h-full"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <span className="text-[12px] tabular-nums font-mono text-foreground/40">
                              {g.num}
                            </span>
                            <ArrowUpRight
                              className="size-4 text-foreground/40 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              strokeWidth={1.8}
                            />
                          </div>
                          <h4 className="text-[17px] tracking-tight font-medium mb-1.5 group-hover:text-foreground transition-colors">
                            {g.title}
                          </h4>
                          <p className="text-[13px] leading-relaxed text-foreground/60 line-clamp-3">
                            {g.blurb}
                          </p>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/guides"
            className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground border-b border-foreground/30 pb-0.5 hover:border-foreground transition-colors"
          >
            See all 12 guides on one page
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.2}
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
