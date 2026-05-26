"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Container, SectionLabel } from "./Container";

type LoopStep = {
  num: string;
  title: string;
  blurb: string;
  href: string;
  phase: "Decide" | "Build" | "Ship" | "Operate";
};

const steps: LoopStep[] = [
  {
    num: "01",
    title: "Opportunity brief",
    blurb: "Is AI actually the right tool here?",
    href: "/templates/ai-opportunity-brief",
    phase: "Decide",
  },
  {
    num: "02",
    title: "AI PRD",
    blurb: "Define the AI job. The line everyone refers back to.",
    href: "/templates/ai-prd",
    phase: "Build",
  },
  {
    num: "03",
    title: "Eval plan",
    blurb: "Define ‘good’ before trusting model output.",
    href: "/templates/ai-eval-plan",
    phase: "Build",
  },
  {
    num: "04",
    title: "Review workflow",
    blurb: "Who corrects, escalates, or blocks the AI.",
    href: "/templates/human-review-workflow",
    phase: "Build",
  },
  {
    num: "05",
    title: "Launch gate",
    blurb: "Go / no-go with evidence. Reversal triggers named.",
    href: "/templates/launch-gate-checklist",
    phase: "Ship",
  },
  {
    num: "06",
    title: "Observability",
    blurb: "Catch drift, cost, and silent regressions weekly.",
    href: "/templates/ai-observability-plan",
    phase: "Operate",
  },
];

const phaseColor: Record<LoopStep["phase"], string> = {
  Decide: "text-[#d97c4a]",
  Build: "text-[#7a5fb5]",
  Ship: "text-[#3a7d5a]",
  Operate: "text-[#2f2f2f]",
};

const phaseBg: Record<LoopStep["phase"], string> = {
  Decide: "bg-peach/60",
  Build: "bg-lavender/60",
  Ship: "bg-mint/60",
  Operate: "bg-sand",
};

export function TheLoop() {
  const reduce = useReducedMotion();

  return (
    <section id="start" className="relative py-24 sm:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-40 size-[520px] rounded-full opacity-50"
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

        {/* Loop grid: 3 cols on top, arrow turns down, 3 cols on bottom flowing right-to-left */}
        <div className="card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {steps.slice(0, 3).map((s, i) => (
              <LoopNode
                key={s.num}
                step={s}
                index={i}
                reduce={reduce}
                arrow={i < 2 ? "right" : "down"}
              />
            ))}
            {steps
              .slice(3)
              .slice()
              .reverse()
              .map((s, i) => (
                <LoopNode
                  key={s.num}
                  step={s}
                  index={i + 3}
                  reduce={reduce}
                  arrow={i < 2 ? "left" : "up"}
                />
              ))}
          </div>
          {/* Final loop-close note */}
          <div className="border-t border-border bg-[#efece5] px-6 sm:px-9 py-5 flex items-center justify-between text-[12.5px] text-foreground/65 flex-wrap gap-2">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-foreground/40" />
              Observability feeds the next opportunity brief. Keep the loop running.
            </span>
            <Link
              href="/guides/ai-native-pm-loop"
              className="group inline-flex items-center gap-1.5 font-medium text-foreground/85 hover:text-foreground transition-colors"
            >
              Read the loop guide
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.2}
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

function LoopNode({
  step,
  index,
  reduce,
  arrow,
}: {
  step: LoopStep;
  index: number;
  reduce: boolean | null;
  arrow: "right" | "down" | "left" | "up";
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.2, 0.7, 0.2, 1],
      }}
      className="relative border-b md:border-b-0 md:border-r border-border last:border-r-0 group"
    >
      <Link
        href={step.href}
        className="block h-full p-7 sm:p-8 hover:bg-[#fbfaf6] transition-colors"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-[13px] tabular-nums font-mono text-foreground/40">
            {step.num}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider ${phaseBg[step.phase]} ${phaseColor[step.phase]}`}
          >
            {step.phase}
          </span>
        </div>
        <h3 className="text-[20px] tracking-tight font-medium mb-1.5">
          {step.title}
        </h3>
        <p className="text-[13.5px] leading-relaxed text-foreground/60">
          {step.blurb}
        </p>
        <div className="mt-5 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground/80 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all">
          Open template
          <ArrowRight className="size-3.5" strokeWidth={2.2} />
        </div>
      </Link>
      {/* Directional arrow */}
      <LoopArrow direction={arrow} />
    </motion.div>
  );
}

function LoopArrow({ direction }: { direction: "right" | "down" | "left" | "up" }) {
  // Show small arrow ornaments at the joints — only visible on md+ where the grid actually flows
  if (direction === "right") {
    return (
      <span
        aria-hidden
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 size-6 items-center justify-center rounded-full bg-background border border-border text-foreground/60 z-10"
      >
        <ArrowRight className="size-3.5" strokeWidth={1.8} />
      </span>
    );
  }
  if (direction === "left") {
    return (
      <span
        aria-hidden
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 size-6 items-center justify-center rounded-full bg-background border border-border text-foreground/60 z-10"
      >
        <ArrowRight className="size-3.5 rotate-180" strokeWidth={1.8} />
      </span>
    );
  }
  if (direction === "down") {
    return (
      <span
        aria-hidden
        className="hidden md:flex absolute right-7 -bottom-3 size-6 items-center justify-center rounded-full bg-background border border-border text-foreground/60 z-10"
      >
        <ArrowRight className="size-3.5 rotate-90" strokeWidth={1.8} />
      </span>
    );
  }
  // up — placed on first cell of second row, but only the loop-close hint is needed.
  return null;
}
