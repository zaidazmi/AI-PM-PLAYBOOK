"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, RefreshCw, ArrowUpRight } from "lucide-react";
import { Container, SectionLabel } from "./Container";

type Step = {
  num: string;
  title: string;
  blurb: string;
  href: string;
};

type Phase = "Decide" | "Build" | "Ship" | "Operate";

type PhaseGroup = {
  phase: Phase;
  tagline: string;
  steps: Step[];
};

const groups: PhaseGroup[] = [
  {
    phase: "Decide",
    tagline: "Is AI actually the right tool here?",
    steps: [
      {
        num: "01",
        title: "Opportunity brief",
        blurb:
          "Align the user, the AI job, evidence, risk, and cost before any prototype.",
        href: "/templates/ai-opportunity-brief",
      },
    ],
  },
  {
    phase: "Build",
    tagline: "Spec the AI job and what 'good' means.",
    steps: [
      {
        num: "02",
        title: "AI PRD",
        blurb:
          "Define the AI job. The line every other artifact refers back to.",
        href: "/templates/ai-prd",
      },
      {
        num: "03",
        title: "Eval plan",
        blurb:
          "Define 'good' before trusting model output. Build the regression set.",
        href: "/templates/ai-eval-plan",
      },
      {
        num: "04",
        title: "Review workflow",
        blurb:
          "Who corrects, escalates, or blocks the AI before it acts on the user.",
        href: "/templates/human-review-workflow",
      },
    ],
  },
  {
    phase: "Ship",
    tagline: "Go / no-go with evidence, not vibes.",
    steps: [
      {
        num: "05",
        title: "Launch gate",
        blurb:
          "Pilot, production, or scale. Conditions, owners, and a reversal trigger.",
        href: "/templates/launch-gate-checklist",
      },
    ],
  },
  {
    phase: "Operate",
    tagline: "Catch drift, cost, and silent regressions weekly.",
    steps: [
      {
        num: "06",
        title: "Observability",
        blurb:
          "Traces, drift alerts, cost ceilings, and a weekly post-launch review.",
        href: "/templates/ai-observability-plan",
      },
    ],
  },
];

const phaseStyle: Record<
  Phase,
  { chipBg: string; chipText: string; dot: string; railClass: string }
> = {
  Decide: {
    chipBg: "bg-peach/55",
    chipText: "text-[#7a3b0d]",
    dot: "bg-[#d97c4a]",
    railClass: "bg-[#d97c4a]/35",
  },
  Build: {
    chipBg: "bg-lavender/55",
    chipText: "text-[#3f2a63]",
    dot: "bg-[#7a5fb5]",
    railClass: "bg-[#7a5fb5]/35",
  },
  Ship: {
    chipBg: "bg-mint/55",
    chipText: "text-[#1e4a30]",
    dot: "bg-[#3a7d5a]",
    railClass: "bg-[#3a7d5a]/35",
  },
  Operate: {
    chipBg: "bg-butter/55",
    chipText: "text-[#5b4a06]",
    dot: "bg-[#b58a1f]",
    railClass: "bg-[#b58a1f]/35",
  },
};

const itemVariants = (reduce: boolean | null): Variants =>
  reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: -8 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      };

export function TheLoop() {
  const reduce = useReducedMotion();

  return (
    <section id="start" className="relative py-24 sm:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-40 size-[520px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(189,165,222,0.30), transparent 70%)",
        }}
      />
      <Container className="relative">
        <div className="flex flex-col gap-4 mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel num="03" label="The PM loop" />
            <h2 className="mt-5 text-4xl sm:text-6xl tracking-[-0.025em] leading-[0.98]">
              Six artifacts.{" "}
              <span className="font-display italic">One loop.</span>
            </h2>
          </div>
          <p className="max-w-md text-foreground/70 text-[15px] leading-relaxed">
            Every serious AI product moves through this loop. Each step has a
            single decision it unlocks. Skip one and the next one breaks.
          </p>
        </div>

        {/* Phase-grouped timeline */}
        <div className="max-w-[860px] mx-auto">
          <ol className="relative">
            {groups.map((g, gi) => (
              <PhaseRow
                key={g.phase}
                group={g}
                index={gi}
                reduce={reduce}
                isLast={gi === groups.length - 1}
              />
            ))}
          </ol>

          {/* Loop close */}
          <LoopClose reduce={reduce} />
        </div>
      </Container>
    </section>
  );
}

function PhaseRow({
  group,
  index,
  reduce,
  isLast,
}: {
  group: PhaseGroup;
  index: number;
  reduce: boolean | null;
  isLast: boolean;
}) {
  const style = phaseStyle[group.phase];
  return (
    <li className="relative grid grid-cols-1 sm:grid-cols-[190px_1fr] gap-x-8 gap-y-5 pb-12">
      {/* Left rail: phase header */}
      <div className="sm:pt-1.5">
        <div
          className={`inline-flex items-center gap-2 rounded-full ${style.chipBg} ${style.chipText} px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em]`}
        >
          <span className={`size-1.5 rounded-full ${style.dot}`} />
          {group.phase}
        </div>
        <p className="mt-3 text-[13px] leading-snug text-foreground/60 max-w-[22ch]">
          {group.tagline}
        </p>
      </div>

      {/* Right rail: vertical timeline of steps in this phase */}
      <div className="relative">
        {/* Connecting line down to the next phase (omit on last) */}
        {!isLast && (
          <span
            aria-hidden
            className={`absolute left-[7px] top-3 -bottom-12 w-px ${style.railClass}`}
          />
        )}
        <ul className="space-y-5">
          {group.steps.map((s, i) => (
            <motion.li
              key={s.num}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={itemVariants(reduce)}
              transition={{ delay: index * 0.06 + i * 0.04 }}
              className="relative pl-7"
            >
              {/* Node dot on the rail */}
              <span
                className={`absolute left-0 top-[6px] inline-flex size-[14px] items-center justify-center rounded-full border-[3px] border-background ${style.dot}`}
              />
              <Link
                href={s.href}
                className="group block rounded-2xl -mx-3 px-3 py-2 hover:bg-[#fbfaf6] transition-colors"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[12px] tabular-nums font-mono text-foreground/40">
                      {s.num}
                    </span>
                    <h3 className="text-[18px] tracking-tight font-medium">
                      {s.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    className="size-4 text-foreground/30 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0"
                    strokeWidth={1.8}
                  />
                </div>
                <p className="mt-1 text-[14px] leading-relaxed text-foreground/65 max-w-[56ch]">
                  {s.blurb}
                </p>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function LoopClose({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 sm:grid-cols-[190px_1fr] gap-x-8 -mt-4"
    >
      <div className="hidden sm:block" />
      <div className="relative pl-7">
        {/* Curved return path back to the top */}
        <svg
          aria-hidden
          width="40"
          height="64"
          viewBox="0 0 40 64"
          className="absolute -left-[2px] -top-4 text-foreground/35"
        >
          <path
            d="M9 -4 V 36 Q 9 56 30 56"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 4"
          />
          <path
            d="M24 50 L 30 56 L 24 62"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="ml-8 flex items-start gap-3">
          <RefreshCw
            className="size-4 text-foreground/55 mt-[3px] shrink-0"
            strokeWidth={1.7}
          />
          <div className="flex-1">
            <p className="text-[15px] leading-relaxed text-foreground/80 max-w-[56ch]">
              <span className="font-medium text-foreground">
                Observability feeds the next opportunity brief.
              </span>{" "}
              The loop is the product. Run it every cycle.
            </p>
            <Link
              href="/guides/ai-native-pm-loop"
              className="group inline-flex items-center gap-1.5 mt-3 text-[14px] font-medium text-foreground border-b border-foreground/30 hover:border-foreground transition-colors pb-0.5"
            >
              Read the loop guide
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.2}
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
