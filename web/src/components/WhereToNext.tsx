import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, FolderOpen } from "lucide-react";
import { Container } from "./Container";

type NextStep = {
  href: string;
  label: string;
  blurb: string;
  kind: "guide" | "template" | "case";
};

const steps: NextStep[] = [
  {
    href: "/guides",
    label: "Read a guide",
    blurb: "Twelve opinionated explanations on the parts most teams get stuck.",
    kind: "guide",
  },
  {
    href: "/templates",
    label: "Steal a template",
    blurb: "Ten artifacts you can copy and use today. MIT licensed.",
    kind: "template",
  },
  {
    href: "/examples",
    label: "See a case scored",
    blurb: "Three worked examples with readiness recommendations and verdicts.",
    kind: "case",
  },
];

function Icon({ kind }: { kind: NextStep["kind"] }) {
  const cn = "size-4 text-foreground/55";
  const sw = 1.7;
  if (kind === "guide") return <BookOpen className={cn} strokeWidth={sw} />;
  if (kind === "template") return <FileText className={cn} strokeWidth={sw} />;
  return <FolderOpen className={cn} strokeWidth={sw} />;
}

export function WhereToNext() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="max-w-[760px]">
          <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-border">
            <h2 className="text-[15px] font-medium tracking-tight">
              Where to next
            </h2>
            <span className="text-[11px] uppercase tracking-wider text-foreground/45">
              3 paths
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {steps.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="lift group block card p-5 h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon kind={s.kind} />
                  <ArrowUpRight
                    className="size-4 text-foreground/40 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="text-[16px] tracking-tight font-medium mb-1.5">
                  {s.label}
                </h3>
                <p className="text-[13px] leading-relaxed text-foreground/60">
                  {s.blurb}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
