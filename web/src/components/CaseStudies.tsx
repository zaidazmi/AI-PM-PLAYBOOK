"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Container, SectionLabel } from "./Container";
import { caseStudies } from "@/data/content";

const MotionLink = motion.create(Link);

const blobClass: Record<string, string> = {
  butter: "blob-butter",
  sky: "blob-sky",
  rose: "blob-rose",
};

const riskColor: Record<string, string> = {
  Low: "bg-[#cbe6d4] text-[#1e4a30]",
  Medium: "bg-[#f0e6b8] text-[#5b4a06]",
  High: "bg-[#f1c9c9] text-[#7a1e1e]",
};

// staggered translate offsets to recreate the Teamway "Strategic Plan" feel
const yOffsets = ["sm:translate-y-0", "sm:translate-y-16", "sm:translate-y-6"];

export function CaseStudies() {
  const reduce = useReducedMotion();

  return (
    <section id="cases" className="relative py-24 sm:py-36">
      <Container>
        <div className="flex flex-col gap-4 mb-16 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel num="04" label="Case studies" />
            <h2 className="mt-5 text-4xl sm:text-6xl tracking-[-0.025em] leading-[0.98]">
              Three worked examples,{" "}
              <span className="font-display italic">scored.</span>
            </h2>
          </div>
          <p className="max-w-md text-foreground/70 text-[15px] leading-relaxed">
            Each one includes an opportunity brief, PRD, eval plan, launch gate
            assessment, and a scored readiness recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-7">
          {caseStudies.map((c, i) => (
            <MotionLink
              key={c.title}
              href={c.href}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.2, 0.7, 0.2, 1],
              }}
              className={`lift group relative block overflow-hidden rounded-[28px] border border-border bg-surface min-h-[420px] ${yOffsets[i]}`}
            >
              <div
                aria-hidden
                className={`absolute inset-0 ${blobClass[c.blob]} opacity-90`}
              />
              <div className="relative h-full flex flex-col justify-between p-7 sm:p-8">
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${riskColor[c.risk]}`}
                    >
                      {c.risk} risk
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-foreground/45">
                      Case {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-[26px] sm:text-[30px] leading-[1.05] tracking-[-0.02em] text-foreground max-w-[20ch]">
                    {c.title}
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-foreground/75 max-w-[28ch]">
                    “{c.quote}”
                  </p>
                </div>

                <div className="mt-10 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[14px] font-medium text-foreground">
                      {c.who}
                    </div>
                    <div className="text-[12px] text-foreground/60">
                      {c.role}
                    </div>
                  </div>
                  <div className="text-right max-w-[14ch]">
                    <div className="text-[10px] uppercase tracking-wider text-foreground/45">
                      Verdict
                    </div>
                    <div className="text-[12.5px] font-medium leading-snug text-foreground/85 mt-1">
                      {c.recommendation}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-7 right-7 sm:bottom-8 sm:right-8 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-foreground opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all">
                  Open case
                  <ArrowRight className="size-3.5" strokeWidth={2.2} />
                </div>
              </div>
            </MotionLink>
          ))}
        </div>
      </Container>
    </section>
  );
}
