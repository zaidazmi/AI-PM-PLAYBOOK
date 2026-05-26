import { Container } from "./Container";
import type { CaseProduct, CaseUseCase } from "@/lib/content";

/**
 * The four facts about the case that should never make a reader hunt for
 * them: problem, AI's job, the non-AI alternative, and the expected
 * outcome. Plus a small owner/stage/users provenance strip.
 *
 * One bordered card, hairline-divided, editorial typography. No colored
 * surfaces, no icons — the typography carries it.
 */
export function UseCaseSummary({
  product,
  useCase,
}: {
  product: CaseProduct;
  useCase: CaseUseCase;
}) {
  const facts: { label: string; body: string }[] = [];
  if (useCase.problem) facts.push({ label: "The problem", body: useCase.problem });
  if (useCase.aiJob) facts.push({ label: "The AI's job", body: useCase.aiJob });
  if (useCase.nonAiAlternative)
    facts.push({
      label: "Without AI",
      body: useCase.nonAiAlternative,
    });
  if (useCase.expectedOutcome)
    facts.push({
      label: "Expected outcome",
      body: useCase.expectedOutcome,
    });

  if (facts.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-b border-border">
      <Container>
        <div className="max-w-[860px] mx-auto">
          <h2 className="text-[24px] tracking-tight font-medium mb-6">
            The case in four facts
          </h2>

          <div className="rounded-[28px] border border-border bg-surface overflow-hidden">
            {/* 2x2 grid of facts with hairline dividers between cells. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-border">
              {facts.map((f, i) => (
                <Fact
                  key={f.label}
                  label={f.label}
                  body={f.body}
                  index={i}
                  total={facts.length}
                />
              ))}
            </div>

            {/* Provenance strip — owner · stage · target users. Sits in
                a subtle band at the bottom of the same card. */}
            <ProvenanceStrip product={product} />
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * One fact cell. Borders use `sm:border-r` on the left column so we get
 * a clean 2x2 grid divider without divide-x interfering with rounding.
 */
function Fact({
  label,
  body,
  index,
  total,
}: {
  label: string;
  body: string;
  index: number;
  total: number;
}) {
  const isLeftCol = index % 2 === 0;
  const isTopRow = index < 2;
  // Single column on mobile: divide-y handles dividers. On desktop:
  // right border for left column cells, bottom border for top row.
  const borders = [
    isLeftCol ? "sm:border-r border-border" : "",
    isTopRow && total > 2 ? "sm:border-b border-border" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={`p-6 sm:p-7 ${borders}`}>
      <div className="text-[10.5px] uppercase tracking-[0.14em] text-foreground/50 mb-2.5">
        {label}
      </div>
      <p className="text-[14.5px] leading-relaxed text-foreground/85">{body}</p>
    </div>
  );
}

function ProvenanceStrip({ product }: { product: CaseProduct }) {
  const items: { label: string; value: string }[] = [];
  if (product.owner) items.push({ label: "Owner", value: product.owner });
  if (product.stage) items.push({ label: "Stage", value: product.stage });
  if (product.targetUsers.length > 0)
    items.push({
      label: product.targetUsers.length === 1 ? "User" : "Users",
      value: product.targetUsers.join(" · "),
    });
  if (items.length === 0) return null;
  return (
    <div className="border-t border-border bg-[#fbfaf6] px-6 sm:px-7 py-3.5">
      <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[12px] text-foreground/65">
        {items.map((it) => (
          <span key={it.label} className="inline-flex items-baseline gap-1.5">
            <span className="text-foreground/40 uppercase tracking-[0.12em] text-[10px]">
              {it.label}
            </span>
            <span className="text-foreground/85">{it.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
