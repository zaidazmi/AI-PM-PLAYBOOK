import { Container } from "./Container";
import type { ReactNode } from "react";
import type { ReadinessAssessment } from "@/lib/content";

/**
 * Level identity lives in two places — a thin vertical accent rule on
 * the left, and the small-caps label string. No icons, no chips, no
 * surface fill. The editorial layout itself carries the moment.
 */
type LevelStyle = {
  label: string;
  rule: string;
  accent: string;
};

const LEVEL_STYLES: Record<string, LevelStyle> = {
  production_candidate: {
    label: "Production candidate",
    rule: "bg-[#3a7d5a]",
    accent: "text-[#1e4a30]",
  },
  pilot_candidate: {
    label: "Pilot candidate",
    rule: "bg-[#b58a1f]",
    accent: "text-[#5b4a06]",
  },
  prototype_only: {
    label: "Prototype only",
    rule: "bg-[#7a1e1e]",
    accent: "text-[#7a1e1e]",
  },
  stop: {
    label: "Do not launch",
    rule: "bg-[#7a1e1e]",
    accent: "text-[#7a1e1e]",
  },
};

function styleFor(level: string): LevelStyle {
  return LEVEL_STYLES[level] ?? LEVEL_STYLES.pilot_candidate;
}

/**
 * The verdict is a HEADLINE MOMENT in the case, not another bordered
 * card. Editorial layout: thin vertical accent rule on the left, the
 * verdict statement in display serif italic (the site's editorial
 * voice), and a mono-numbered "what would change this" list below.
 *
 * No surface fill, no icons, no pills. The colored rule carries level
 * identity; the typography carries the weight.
 */
export function VerdictCallout({
  recommendation,
  readiness,
}: {
  recommendation: string;
  readiness: ReadinessAssessment | null;
}) {
  const level = readiness?.recommendationLevel ?? "pilot_candidate";
  const style = styleFor(level);

  const isStop = level === "prototype_only" || level === "stop";
  const changeList = isStop
    ? readiness?.conditions ?? []
    : readiness?.blockersBeforePilot ?? [];
  const changeListLabel = isStop
    ? "Conditions for any prototype work"
    : "What would unlock the pilot";

  return (
    <section className="py-12 sm:py-16 border-b border-border">
      <Container>
        <div className="max-w-[860px] mx-auto">
          {/* Two-column asymmetric grid: thin accent rule, then content.
              The rule extends top-to-bottom and is the only visual
              decoration — no card, no border, no surface. */}
          <div className="grid grid-cols-[3px_1fr] gap-6 sm:gap-8">
            <div
              aria-hidden
              className={`${style.rule} rounded-full`}
            />
            <div className="min-w-0">
              {/* Eyebrow row: "THE VERDICT" + the level label, separated
                  by a thin dot. The level label sits in the accent color
                  so the band signal lands in the title bar too. */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-5 sm:mb-6">
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-foreground/45 font-medium">
                  The verdict
                </span>
                <span aria-hidden className="text-foreground/25">·</span>
                <span
                  className={`text-[10.5px] uppercase tracking-[0.18em] font-medium ${style.accent}`}
                >
                  {style.label}
                </span>
              </div>

              {/* The recommendation statement, in display serif italic.
                  This is the editorial moment — large, leading, italic.
                  Matches the site's voice (the same italic used for
                  emphasis in hero / section headers). */}
              <h2 className="font-display italic text-[34px] sm:text-[44px] lg:text-[52px] leading-[1.05] tracking-[-0.02em] text-foreground max-w-[22ch]">
                {recommendation}
              </h2>

              {/* Conditions list — mono numerals, hairline divider above,
                  tight typography. Reads like a structured note, not a
                  bulleted card. */}
              {changeList.length > 0 ? (
                <ChangeList
                  label={changeListLabel}
                  items={changeList}
                  accent={style.accent}
                />
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ChangeList({
  label,
  items,
  accent,
}: {
  label: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="mt-10 sm:mt-12 pt-6 border-t border-border">
      <div className={`text-[10.5px] uppercase tracking-[0.18em] mb-5 ${accent}`}>
        {label}
      </div>
      <ol className="divide-y divide-border">
        {items.map((item, i) => (
          <li
            key={i}
            className="grid grid-cols-[42px_1fr] items-baseline gap-x-4 py-3.5"
          >
            <span className="text-[12px] tabular-nums font-mono text-foreground/40">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[14.5px] leading-relaxed text-foreground/85">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* =====================================================================
 * BlockersAndAlternative — production blockers + alternative path. Same
 * editorial language as the verdict above: hairline dividers, mono
 * numerals, no shouting surface fills.
 * ===================================================================== */

export function BlockersAndAlternative({
  readiness,
}: {
  readiness: ReadinessAssessment;
}) {
  const isStop =
    readiness.recommendationLevel === "prototype_only" ||
    readiness.recommendationLevel === "stop";

  const showProductionBlockers =
    !isStop && readiness.blockersBeforeProduction.length > 0;
  const showAlternative = Boolean(readiness.alternativeRecommendation);

  if (!showProductionBlockers && !showAlternative) return null;

  return (
    <section className="py-10 sm:py-14 border-b border-border">
      <Container>
        <div className="max-w-[860px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {showProductionBlockers ? (
            <EditorialPanel
              eyebrow="And before production"
              title={`${readiness.blockersBeforeProduction.length} more gates after the pilot`}
            >
              <ol className="divide-y divide-border">
                {readiness.blockersBeforeProduction.map((b, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[36px_1fr] items-baseline gap-x-3 py-3"
                  >
                    <span className="text-[12px] tabular-nums font-mono text-foreground/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13.5px] leading-relaxed text-foreground/80">
                      {b}
                    </span>
                  </li>
                ))}
              </ol>
            </EditorialPanel>
          ) : null}

          {showAlternative ? (
            <EditorialPanel
              eyebrow="Alternative path"
              title="What the team could do instead"
            >
              <p className="text-[14.5px] leading-relaxed text-foreground/80">
                {readiness.alternativeRecommendation}
              </p>
            </EditorialPanel>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function EditorialPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[0.18em] text-foreground/45 mb-2">
        {eyebrow}
      </div>
      <h3 className="font-display italic text-[22px] sm:text-[26px] leading-[1.15] tracking-[-0.015em] text-foreground max-w-[26ch] mb-5">
        {title}
      </h3>
      {children}
    </div>
  );
}
