"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  type Variants,
} from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "./Container";

const preflight = [
  "What is the AI's job in one sentence?",
  "What is the autonomy level (draft, suggest, act, autonomous)?",
  "What does 'good' actually mean (your eval bar)?",
  "What happens when the model has low confidence?",
  "What does one workflow cost, and at what scale does it break?",
];

type AutonomyLevel = {
  num: string;
  name: string;
  oneLiner: string;
  example: string;
  risk: "Low" | "Medium" | "High" | "Highest";
};

const autonomy: AutonomyLevel[] = [
  {
    num: "01",
    name: "Draft",
    oneLiner: "AI proposes, user decides before anything happens.",
    example: "A draft email, a suggested calendar invite.",
    risk: "Low",
  },
  {
    num: "02",
    name: "Suggest",
    oneLiner: "AI recommends with reasoning, user one-click approves.",
    example: "'Move this ticket to done. The PR merged 2h ago.'",
    risk: "Medium",
  },
  {
    num: "03",
    name: "Act",
    oneLiner: "AI acts and notifies, user can undo.",
    example: "'I moved 3 tickets to done based on merged PRs.'",
    risk: "High",
  },
  {
    num: "04",
    name: "Autonomous",
    oneLiner: "AI handles routine cases silently; only exceptions surface.",
    example: "Quietly handles the boring 80%.",
    risk: "Highest",
  },
];

type CardKey = "preflight" | "autonomy";

export function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<CardKey>("preflight");

  return (
    <section className="relative overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-24">
      {/* Soft mesh accents, restrained */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 size-[560px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(244,162,102,0.40), rgba(255,222,196,0.14) 60%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 -left-48 size-[640px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, rgba(189,165,222,0.28), rgba(225,215,240,0.10) 60%, transparent 80%)",
        }}
      />

      <Container className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: editorial copy */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start gap-7"
          >
            <span className="text-[11.5px] font-medium uppercase tracking-[0.18em] text-foreground/55">
              A working system for AI PMs
            </span>

            <h1 className="font-sans tracking-[-0.03em] text-[44px] sm:text-[60px] lg:text-[76px] leading-[0.98] max-w-[16ch] pb-1">
              From AI{" "}
              <span className="font-display italic text-foreground/85 leading-[1.1]">
                demo
              </span>{" "}
              to a product you can{" "}
              <span className="font-display italic text-foreground/85 leading-[1.1]">
                defend
              </span>
              .
            </h1>

            <p className="max-w-[44ch] text-[17px] leading-relaxed text-foreground/70">
              The artifacts, evals, and decision frames AI PMs use to ship
              features without breaking{" "}
              <span className="text-foreground font-medium">trust</span>.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
              <Link
                href="/guides/walkthrough"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-[14px] font-medium hover:bg-foreground/90 transition-colors"
              >
                Start the walkthrough
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.2}
                />
              </Link>
              <Link
                href="/templates"
                className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground/75 hover:text-foreground transition-colors border-b border-foreground/20 hover:border-foreground/60 pb-0.5"
              >
                Or browse the artifacts
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2.2}
                />
              </Link>
            </div>

            {/* Tiny learner-focused metadata strip */}
            <div className="flex flex-wrap items-baseline gap-x-7 gap-y-1 pt-2 text-[12.5px] text-foreground/60">
              <Stat number="10" label="templates" />
              <Stat number="12" label="guides" />
              <Stat number="3" label="worked case studies" />
              <Stat number="45 min" label="full read" />
            </div>
          </motion.div>

          {/* Right: swappable teach-first cards */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:col-span-5 lg:justify-self-end w-full max-w-[460px]"
          >
            <CardSwapper active={active} setActive={setActive} reduce={reduce} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function CardSwapper({
  active,
  setActive,
  reduce,
}: {
  active: CardKey;
  setActive: (k: CardKey) => void;
  reduce: boolean | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Stacked cards */}
      <div className="relative">
        {/* Back card (peek behind) */}
        <BackPeek
          show={active === "preflight" ? "autonomy" : "preflight"}
          onClick={() =>
            setActive(active === "preflight" ? "autonomy" : "preflight")
          }
          reduce={reduce}
        />

        {/* Active card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            variants={cardVariants(reduce)}
            initial="enter"
            animate="active"
            exit="exit"
            className="relative"
          >
            {active === "preflight" ? <PreflightCard /> : <AutonomyCard />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function cardVariants(reduce: boolean | null): Variants {
  if (reduce) {
    return {
      enter: { opacity: 1, rotate: -1.5 },
      active: { opacity: 1, rotate: -1.5 },
      exit: { opacity: 1, rotate: -1.5 },
    };
  }
  return {
    enter: { opacity: 0, rotate: 2, y: 12 },
    active: {
      opacity: 1,
      rotate: -1.5,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 220,
        damping: 26,
      },
    },
    exit: {
      opacity: 0,
      rotate: 4,
      y: -8,
      transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
    },
  };
}

function BackPeek({
  show,
  onClick,
  reduce,
}: {
  show: CardKey;
  onClick: () => void;
  reduce: boolean | null;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={false}
      animate={
        reduce
          ? { opacity: 0.55 }
          : { opacity: 0.55, rotate: 2.5, x: 12, y: 12, scale: 0.97 }
      }
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 26,
      }}
      whileHover={
        reduce
          ? { opacity: 0.8 }
          : { opacity: 0.8, rotate: 2.5, x: 14, y: 14, scale: 0.98 }
      }
      className="absolute inset-0 rounded-[28px] bg-surface border border-border text-left cursor-pointer overflow-hidden"
      aria-label={`Switch to ${show} card`}
    >
      {/* tiny peek of the other card title so it feels real */}
      <div className="p-7 sm:p-8 pointer-events-none">
        <div className="text-[10.5px] uppercase tracking-[0.16em] text-foreground/45 mb-3">
          {show === "preflight" ? "Before you vibe code" : "Agent autonomy"}
        </div>
        <div className="text-[14px] text-foreground/35 max-w-[24ch]">
          {show === "preflight"
            ? "5 questions before you write the PRD"
            : "The 4 levels that change what you're shipping"}
        </div>
      </div>
    </motion.button>
  );
}

function PreflightCard() {
  return (
    <article
      data-card-peek="preflight"
      className="relative rounded-[28px] border border-border bg-surface p-7 sm:p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-foreground/55">
          Before you vibe code
        </span>
        <span className="font-display text-[13px] italic text-foreground/45">
          5 questions
        </span>
      </div>

      <h3 className="text-[20px] tracking-[-0.015em] leading-[1.25] font-medium mb-2 max-w-[26ch]">
        If you can't answer these, the AI feature isn't ready for a PRD yet.
      </h3>
      <p className="text-[13px] text-foreground/55 mb-6 max-w-[32ch]">
        The preflight that kills bad ideas before they consume engineering
        time.
      </p>

      <ol className="space-y-3.5 mb-7">
        {preflight.map((q, i) => (
          <li key={i} className="flex items-start gap-3 text-[13.5px]">
            <span className="mt-[2px] inline-flex size-5 items-center justify-center rounded-full border border-foreground/15 text-[10.5px] tabular-nums font-mono text-foreground/55 shrink-0">
              {i + 1}
            </span>
            <span className="text-foreground/80 leading-relaxed">{q}</span>
          </li>
        ))}
      </ol>

      <div className="pt-5 border-t border-border flex items-center justify-between">
        <span className="text-[11.5px] uppercase tracking-[0.14em] text-foreground/45">
          Guide · 4 min read
        </span>
        <Link
          href="/guides/before-you-vibe-code"
          className="group inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground/85 hover:text-foreground transition-colors"
        >
          Run the full preflight
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2.2}
          />
        </Link>
      </div>
    </article>
  );
}

function AutonomyCard() {
  return (
    <article
      data-card-peek="autonomy"
      className="relative rounded-[28px] border border-border bg-surface p-7 sm:p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-foreground/55">
          Agent autonomy
        </span>
        <span className="font-display text-[13px] italic text-foreground/45">
          4 levels
        </span>
      </div>

      <h3 className="text-[20px] tracking-[-0.015em] leading-[1.25] font-medium mb-2 max-w-[26ch]">
        The single PRD decision that changes what you're shipping.
      </h3>
      <p className="text-[13px] text-foreground/55 mb-6 max-w-[32ch]">
        One prompt, four very different products. Most PMs guess. Pick
        deliberately.
      </p>

      <ul className="space-y-2.5 mb-6">
        {autonomy.map((lv) => (
          <AutonomyRow key={lv.num} level={lv} />
        ))}
      </ul>

      <div className="pt-5 border-t border-border flex items-center justify-between">
        <span className="text-[11.5px] uppercase tracking-[0.14em] text-foreground/45">
          Guide · 7 min read
        </span>
        <Link
          href="/guides/agentic-products"
          className="group inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground/85 hover:text-foreground transition-colors"
        >
          Read agentic products
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2.2}
          />
        </Link>
      </div>
    </article>
  );
}

const riskBar: Record<AutonomyLevel["risk"], string> = {
  Low: "w-1/4 bg-[#3a7d5a]",
  Medium: "w-2/4 bg-[#b58a1f]",
  High: "w-3/4 bg-[#c45c1c]",
  Highest: "w-full bg-[#7a1e1e]",
};

const riskLabelColor: Record<AutonomyLevel["risk"], string> = {
  Low: "text-[#1e4a30]",
  Medium: "text-[#5b4a06]",
  High: "text-[#7a3b0d]",
  Highest: "text-[#7a1e1e]",
};

function AutonomyRow({ level }: { level: AutonomyLevel }) {
  return (
    <li className="rounded-xl border border-border bg-[#fbfaf6] px-3.5 py-3">
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[10.5px] tabular-nums font-mono text-foreground/40">
            {level.num}
          </span>
          <span className="text-[14px] font-medium text-foreground">
            {level.name}
          </span>
        </div>
        <span
          className={`text-[10.5px] uppercase tracking-[0.12em] ${riskLabelColor[level.risk]}`}
        >
          {level.risk} risk
        </span>
      </div>
      <p className="text-[12.5px] leading-snug text-foreground/65 mb-2">
        {level.oneLiner}
      </p>
      <div
        aria-hidden
        className="h-1 w-full rounded-full bg-foreground/[0.06] overflow-hidden"
      >
        <div className={`h-full rounded-full ${riskBar[level.risk]}`} />
      </div>
    </li>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-medium text-foreground tabular-nums">{number}</span>
      <span className="text-foreground/55">{label}</span>
    </span>
  );
}
