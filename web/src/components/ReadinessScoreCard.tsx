import { Container } from "./Container";
import type { ReadinessAssessment, ReadinessDimension } from "@/lib/content";

/**
 * Score-band colors for the dimension bars. The scale runs 1 (red) → 5
 * (green). Color carries the meaning — we deliberately avoid extra chips
 * or labels per row so the 11-dimension grid stays scannable.
 */
function barColorFor(score: number): string {
  if (score >= 4) return "bg-[#3a7d5a]";
  if (score >= 3) return "bg-[#b58a1f]";
  if (score >= 2) return "bg-[#c45c1c]";
  return "bg-[#7a1e1e]";
}

const LEVEL_COPY: Record<
  string,
  { label: string; chipBg: string; chipText: string; dot: string }
> = {
  production_candidate: {
    label: "Production candidate",
    chipBg: "bg-[#cbe6d4]",
    chipText: "text-[#1e4a30]",
    dot: "bg-[#3a7d5a]",
  },
  pilot_candidate: {
    label: "Pilot candidate",
    chipBg: "bg-[#f0e6b8]",
    chipText: "text-[#5b4a06]",
    dot: "bg-[#b58a1f]",
  },
  prototype_only: {
    label: "Prototype only",
    chipBg: "bg-[#f1c9c9]",
    chipText: "text-[#7a1e1e]",
    dot: "bg-[#c45c1c]",
  },
  stop: {
    label: "Do not launch",
    chipBg: "bg-[#f1c9c9]",
    chipText: "text-[#7a1e1e]",
    dot: "bg-[#7a1e1e]",
  },
};

function levelCopy(level: string) {
  return (
    LEVEL_COPY[level] ?? {
      label: level.replace(/_/g, " "),
      chipBg: "bg-foreground/[0.06]",
      chipText: "text-foreground/75",
      dot: "bg-foreground/40",
    }
  );
}

export function ReadinessScoreCard({
  readiness,
}: {
  readiness: ReadinessAssessment;
}) {
  const level = levelCopy(readiness.recommendationLevel);
  const score = readiness.weightedScore;
  const pct = Math.max(0, Math.min(100, (score / 5) * 100));

  // The dimensions that genuinely matter for the verdict — anything
  // scored 2 or below. These are the items a PM should act on. We pull
  // them into their own panel rather than burying details in 11 separate
  // expandable rows.
  const focusAreas = readiness.dimensions
    .filter((d) => d.score <= 2)
    .sort((a, b) => a.score - b.score);

  return (
    <section className="py-12 sm:py-16 border-b border-border">
      <Container>
        <div className="max-w-[860px] mx-auto">
          <h2 className="text-[24px] tracking-tight font-medium mb-6">
            Readiness at a glance
          </h2>

          <div className="rounded-[28px] border border-border bg-surface p-6 sm:p-8">
            {/* Headline: big score + level + rationale */}
            <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-7 lg:gap-10 items-start">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-sans text-[64px] leading-none tracking-[-0.04em] tabular-nums">
                    {score.toFixed(2)}
                  </span>
                  <span className="text-[16px] text-foreground/45 tabular-nums">
                    / 5
                  </span>
                </div>
                <div
                  className="mt-3 h-1.5 w-full rounded-full bg-foreground/[0.06] overflow-hidden"
                  aria-hidden
                >
                  <div
                    className={`h-full rounded-full ${level.dot}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${level.chipBg} ${level.chipText}`}
                  >
                    <span className={`size-1.5 rounded-full ${level.dot}`} />
                    {level.label}
                  </span>
                </div>
              </div>

              <p className="text-[15px] leading-relaxed text-foreground/80">
                {readiness.rationale}
              </p>
            </div>

            {/* Hairline divider */}
            <div className="border-t border-border my-7" />

            {/* Compact dimension grid — just name + bar + score, two columns.
                No chips, no expansion. The bars do the work. */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3.5">
              {readiness.dimensions.map((d) => (
                <DimensionLine key={d.key} dim={d} />
              ))}
            </ul>
          </div>

          {/* Focus areas — only the dimensions worth talking about,
              with the top risk and the next action. If everything's
              above 2, this section omits itself. */}
          {focusAreas.length > 0 ? (
            <div className="mt-5 rounded-[28px] border border-border bg-[#fbfaf6] p-6 sm:p-8">
              <div className="flex items-baseline justify-between mb-5">
                <h3 className="text-[15px] font-medium tracking-tight">
                  Where the score lands
                </h3>
                <span className="text-[11px] uppercase tracking-[0.12em] text-foreground/45">
                  {focusAreas.length}{" "}
                  {focusAreas.length === 1 ? "dimension" : "dimensions"} to fix
                </span>
              </div>
              <ul className="space-y-5">
                {focusAreas.map((d) => (
                  <FocusItem key={d.key} dim={d} />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function DimensionLine({ dim }: { dim: ReadinessDimension }) {
  const bar = barColorFor(dim.score);
  const fillPct = Math.max(0, Math.min(100, (dim.score / 5) * 100));
  return (
    <li className="flex items-baseline gap-3">
      <span className="text-[13.5px] text-foreground/85 shrink-0 w-[160px] sm:w-[150px] truncate">
        {dim.label}
      </span>
      <div className="flex-1 h-[5px] rounded-full bg-foreground/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full ${bar}`}
          style={{ width: `${fillPct}%` }}
          aria-hidden
        />
      </div>
      <span className="text-[11.5px] tabular-nums font-mono text-foreground/55 shrink-0 w-7 text-right">
        {dim.score}/5
      </span>
    </li>
  );
}

/**
 * One focus-area row: the dimension that scored low, its top risk
 * (just the first one — the rest live in the launch-gate artifact),
 * and the concrete next action.
 */
function FocusItem({ dim }: { dim: ReadinessDimension }) {
  const dot = barColorFor(dim.score);
  const topRisk = dim.risks[0];
  return (
    <li className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-x-6 gap-y-2">
      <div className="flex items-baseline gap-2 min-w-0">
        <span className={`mt-[2px] size-1.5 rounded-full ${dot} shrink-0`} />
        <span className="text-[14px] font-medium text-foreground truncate">
          {dim.label}
        </span>
        <span className="text-[11px] tabular-nums font-mono text-foreground/45 shrink-0">
          {dim.score}/5
        </span>
      </div>
      <div className="min-w-0 space-y-2">
        {topRisk ? (
          <p className="text-[13.5px] leading-relaxed text-foreground/80">
            {topRisk}
          </p>
        ) : null}
        {dim.nextAction ? (
          <p className="text-[12.5px] leading-relaxed text-foreground/60">
            <span className="uppercase tracking-[0.12em] text-foreground/45 mr-2">
              Next
            </span>
            {dim.nextAction}
          </p>
        ) : null}
      </div>
    </li>
  );
}
