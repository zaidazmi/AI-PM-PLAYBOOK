import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionLabel } from "./Container";
import { Reveal } from "./Reveal";
import { guides as allGuides, type Guide } from "@/data/content";

type GroupName = "Foundations" | "Building" | "Operating" | "Advanced";

type Group = {
  name: GroupName;
  slugs: string[];
  dot: string;
};

// Group definitions — each grouping aligns to a phase of the PM loop.
// The label is structural only; we don't surface "grouped by phase" in copy.
const groups: Group[] = [
  {
    name: "Foundations",
    dot: "bg-[#d97c4a]",
    slugs: ["before-you-vibe-code", "walkthrough", "bad-to-good-ai-prd"],
  },
  {
    name: "Building",
    dot: "bg-[#7a5fb5]",
    slugs: [
      "eval-design",
      "agentic-products",
      "prompt-craft",
      "agent-pm-starter-pack",
    ],
  },
  {
    name: "Operating",
    dot: "bg-[#3a7d5a]",
    slugs: ["operating-ai-products", "launch-gates", "error-analysis"],
  },
  {
    name: "Advanced",
    dot: "bg-[#b58a1f]",
    slugs: ["artifact-flow-map", "ai-native-pm-loop"],
  },
];

function bySlug(href: string): string {
  return href.replace(/^\/guides\//, "");
}

export function Guides() {
  const map = new Map<string, Guide>();
  for (const g of allGuides) map.set(bySlug(g.href), g);

  return (
    <section id="guides" className="relative py-24 sm:py-32 bg-[#efece5]">
      <Container>
        <div className="flex flex-col gap-4 mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel num="06" label="Guides" />
            <h2 className="mt-5 text-4xl sm:text-6xl tracking-[-0.025em] leading-[0.98]">
              Twelve guides.{" "}
              <span className="font-display italic">Read in any order.</span>
            </h2>
          </div>
          <p className="max-w-md text-foreground/70 text-[15px] leading-relaxed">
            Each one is short, opinionated, and uses real examples. Pick the
            phase you're in and start there.
          </p>
        </div>

        {/* Editorial reading list, divided by phase */}
        <div className="max-w-[920px] mx-auto space-y-12">
          {groups.map((group) => (
            <Reveal key={group.name}>
              <PhaseSection group={group} map={map} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function PhaseSection({
  group,
  map,
}: {
  group: Group;
  map: Map<string, Guide>;
}) {
  const items = group.slugs
    .map((s) => map.get(s))
    .filter((g): g is Guide => Boolean(g));

  return (
    <div>
      {/* Phase header: simple hairline divider with the phase name */}
      <div className="flex items-baseline justify-between gap-3 mb-2 pb-3 border-b border-foreground/15">
        <h3 className="flex items-baseline gap-2.5 text-[15px] font-medium tracking-tight text-foreground">
          <span className={`inline-block size-1.5 rounded-full ${group.dot}`} />
          {group.name}
        </h3>
        <span className="text-[11px] uppercase tracking-[0.14em] text-foreground/45 tabular-nums">
          {items.length} {items.length === 1 ? "guide" : "guides"}
        </span>
      </div>

      {/* Editorial row-list, with hairline dividers and tight rhythm */}
      <ul>
        {items.map((g, idx) => (
          <li
            key={g.href}
            className={idx === items.length - 1 ? "" : "border-b border-border"}
          >
            <Link
              href={g.href}
              className="group block py-5 px-2 -mx-2 rounded-xl hover:bg-[#fbfaf6] transition-colors"
            >
              <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-1">
                <span className="text-[12px] tabular-nums font-mono text-foreground/40 self-start mt-1">
                  {g.num}
                </span>
                <div className="min-w-0">
                  <h4 className="text-[17px] tracking-tight font-medium text-foreground transition-colors mb-1">
                    {g.title}
                  </h4>
                  <p className="text-[13.5px] leading-relaxed text-foreground/60 max-w-[60ch]">
                    {g.blurb}
                  </p>
                </div>
                <ArrowUpRight
                  className="size-4 text-foreground/30 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 self-start mt-1"
                  strokeWidth={1.8}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
