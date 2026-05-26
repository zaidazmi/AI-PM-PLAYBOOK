"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  type Variants,
} from "motion/react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Container } from "./Container";

type CardKey = "weekly" | "verdict";

export function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<CardKey>("weekly");

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

          {/* Right: two swappable real-content cards */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:col-span-5 lg:justify-self-end w-full max-w-[480px]"
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
    <div className="flex flex-col gap-3">
      {/* Card tabs */}
      <div className="flex items-center gap-1 self-start">
        <CardTab
          label="Week 2 in production"
          active={active === "weekly"}
          onClick={() => setActive("weekly")}
        />
        <CardTab
          label="A 'do not launch' verdict"
          active={active === "verdict"}
          onClick={() => setActive("verdict")}
        />
      </div>

      <div className="relative">
        <BackPeek
          show={active === "weekly" ? "verdict" : "weekly"}
          onClick={() => setActive(active === "weekly" ? "verdict" : "weekly")}
          reduce={reduce}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            variants={cardVariants(reduce)}
            initial="enter"
            animate="active"
            exit="exit"
            className="relative"
          >
            {active === "weekly" ? <WeeklyReviewCard /> : <LaunchVerdictCard />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function CardTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1.5 rounded-full text-[12px] font-medium tracking-tight transition-colors ${
        active
          ? "bg-foreground text-background"
          : "text-foreground/55 hover:text-foreground"
      }`}
    >
      {label}
    </button>
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
      transition: { type: "spring", stiffness: 220, damping: 26 },
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
  const peek =
    show === "weekly"
      ? {
          eyebrow: "Operating loop · Week 2",
          tagline: "What the pilot actually did last week.",
        }
      : {
          eyebrow: "Launch gate · Gate 1",
          tagline: "Why the right call was 'do not launch.'",
        };
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={
        reduce
          ? { opacity: 0.55 }
          : { opacity: 0.55, rotate: 2.5, x: 12, y: 12, scale: 0.97 }
      }
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      whileHover={
        reduce
          ? { opacity: 0.8 }
          : { opacity: 0.8, rotate: 2.5, x: 14, y: 14, scale: 0.98 }
      }
      className="absolute inset-0 rounded-[28px] bg-surface border border-border text-left cursor-pointer overflow-hidden"
      aria-label={`Switch to ${peek.eyebrow}`}
    >
      <div className="p-7 sm:p-8 pointer-events-none">
        <div className="text-[10.5px] uppercase tracking-[0.16em] text-foreground/45 mb-3">
          {peek.eyebrow}
        </div>
        <div className="text-[14px] text-foreground/35 max-w-[26ch]">
          {peek.tagline}
        </div>
      </div>
    </motion.button>
  );
}

/* ------------------------- Card 1: weekly review ------------------------- */

type Status = "ok" | "watch" | "below";
type Metric = {
  label: string;
  value: string;
  target?: string;
  status: Status;
};

const WEEK_METRICS: Metric[] = [
  { label: "Drafts shown", value: "219", status: "ok" },
  { label: "Accept rate", value: "68%", target: ">= 70%", status: "below" },
  { label: "Edit rate", value: "24%", target: "< 25%", status: "ok" },
  { label: "Reject rate", value: "8%", target: "< 8%", status: "watch" },
  { label: "Hallucinated claims", value: "0", status: "ok" },
  { label: "p95 latency", value: "4.8s", target: "< 4s", status: "below" },
];

function WeeklyReviewCard() {
  return (
    <article className="relative rounded-[28px] border border-border bg-surface p-7 sm:p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-foreground/55">
          Operating loop · Week 2
        </span>
        <span className="font-display text-[13px] italic text-foreground/45">
          live snapshot
        </span>
      </div>

      <h3 className="text-[20px] tracking-[-0.015em] leading-[1.25] font-medium mb-1.5 max-w-[26ch]">
        Customer Support Copilot, week 2 of pilot.
      </h3>
      <p className="text-[13px] text-foreground/55 mb-5 max-w-[34ch]">
        The numbers a PM actually watches the morning after launch.
      </p>

      <ul className="rounded-2xl border border-border divide-y divide-border bg-[#fbfaf6] overflow-hidden mb-5">
        {WEEK_METRICS.map((m) => (
          <MetricRow key={m.label} metric={m} />
        ))}
      </ul>

      <div className="rounded-xl bg-foreground/[0.04] border border-foreground/[0.06] px-4 py-3 mb-6">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-foreground/55 mb-1">
          Decision
        </div>
        <p className="text-[13.5px] leading-snug text-foreground/85">
          Hold pilot at 8 agents. Add 18 failures to the eval set, ship the
          stale-KB fix, then revisit the accept-rate target.
        </p>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <span className="text-[11.5px] uppercase tracking-[0.14em] text-foreground/45">
          From the case study
        </span>
        <Link
          href="/examples/customer-support-copilot/post-launch-review-week-2"
          className="group inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground/85 hover:text-foreground transition-colors"
        >
          Read the full review
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2.2}
          />
        </Link>
      </div>
    </article>
  );
}

const statusStyle: Record<
  Status,
  { dot: string; label: string; text: string }
> = {
  ok: {
    dot: "bg-[#3a7d5a]",
    label: "ok",
    text: "text-[#1e4a30]",
  },
  watch: {
    dot: "bg-[#b58a1f]",
    label: "watch",
    text: "text-[#5b4a06]",
  },
  below: {
    dot: "bg-[#c45c1c]",
    label: "below",
    text: "text-[#7a3b0d]",
  },
};

function MetricRow({ metric }: { metric: Metric }) {
  const s = statusStyle[metric.status];
  return (
    <li className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-2.5 text-[13px]">
      <span className="text-foreground/75 truncate">{metric.label}</span>
      <span className="font-mono tabular-nums text-foreground font-medium">
        {metric.value}
      </span>
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-foreground/[0.04] px-2 py-0.5 text-[10.5px] uppercase tracking-[0.12em] ${s.text}`}
      >
        <span className={`inline-block size-1.5 rounded-full ${s.dot}`} />
        {s.label}
      </span>
    </li>
  );
}

/* ----------------------- Card 2: launch gate verdict ---------------------- */

type Dim = { label: string; score: number; note: string };

const DIMENSIONS: Dim[] = [
  { label: "Eval readiness", score: 1, note: "Zero of 200 scenarios built." },
  {
    label: "Regulatory readiness",
    score: 1,
    note: "HIPAA, BAA, legal review not started.",
  },
  { label: "Observability", score: 1, note: "Nothing built. Nothing logged." },
  { label: "AI job definition", score: 3, note: "Scoped on paper." },
];

function LaunchVerdictCard() {
  return (
    <article className="relative rounded-[28px] border border-border bg-surface p-7 sm:p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-foreground/55">
          Launch gate · Gate 1
        </span>
        <span className="font-display text-[13px] italic text-[#7a1e1e]">
          do not launch
        </span>
      </div>

      <h3 className="text-[20px] tracking-[-0.015em] leading-[1.25] font-medium mb-1.5 max-w-[26ch]">
        Healthcare Intake Assistant.
      </h3>
      <p className="text-[13px] text-foreground/55 mb-5 max-w-[34ch]">
        The readiness scorecard that made the right call obvious.
      </p>

      {/* Score */}
      <div className="rounded-2xl border border-border bg-[#fbfaf6] px-4 py-4 mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-foreground/55 mb-1">
            Weighted readiness
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[42px] tracking-[-0.02em] leading-none text-foreground tabular-nums">
              1.95
            </span>
            <span className="text-[13px] text-foreground/55 tabular-nums">/ 5.0</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1c9c9] text-[#7a1e1e] px-2.5 py-1 text-[11px] font-medium">
            <X className="size-3" strokeWidth={2.6} />
            Not ready
          </span>
          <span className="mt-1.5 text-[10.5px] uppercase tracking-[0.14em] text-foreground/45">
            High risk · PHI
          </span>
        </div>
      </div>

      {/* Hard blockers */}
      <ul className="space-y-2 mb-5">
        {DIMENSIONS.map((d) => (
          <DimensionRow key={d.label} dim={d} />
        ))}
      </ul>

      <div className="rounded-xl bg-foreground/[0.04] border border-foreground/[0.06] px-4 py-3 mb-6">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-foreground/55 mb-1">
          Recommendation
        </div>
        <p className="text-[13.5px] leading-snug text-foreground/85">
          Prototype only, synthetic data. Do not pilot with patient data until
          evals, HIPAA review, and incident response are ready.
        </p>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <span className="text-[11.5px] uppercase tracking-[0.14em] text-foreground/45">
          From the case study
        </span>
        <Link
          href="/examples/healthcare-intake-assistant/launch-gate"
          className="group inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground/85 hover:text-foreground transition-colors"
        >
          Read the launch gate
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2.2}
          />
        </Link>
      </div>
    </article>
  );
}

function DimensionRow({ dim }: { dim: Dim }) {
  // Score color: 1=red, 2=orange, 3=yellow, 4=mint, 5=green
  const color =
    dim.score <= 1
      ? "bg-[#c45c1c]"
      : dim.score <= 2
      ? "bg-[#b58a1f]"
      : dim.score <= 3
      ? "bg-[#7a5fb5]"
      : "bg-[#3a7d5a]";
  return (
    <li className="flex items-baseline gap-3 text-[13px]">
      {/* Score pip group */}
      <div aria-hidden className="flex items-center gap-[2px] shrink-0 mt-[3px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`block size-[6px] rounded-full ${
              i < dim.score ? color : "bg-foreground/[0.08]"
            }`}
          />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-foreground/80 font-medium tracking-tight">
            {dim.label}
          </span>
          <span className="text-[11px] text-foreground/45 tabular-nums">
            {dim.score} / 5
          </span>
        </div>
        <p className="mt-0.5 text-[12px] leading-snug text-foreground/55">
          {dim.note}
        </p>
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
