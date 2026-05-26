import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, FolderOpen } from "lucide-react";
import { Container } from "./Container";
import { type RelatedItem } from "@/lib/content";

type Props = {
  heading?: string;
  items: RelatedItem[];
};

const kindLabel: Record<RelatedItem["kind"], string> = {
  guide: "Guide",
  template: "Template",
  case: "Case study",
  playbook: "Playbook",
};

function Icon({ kind }: { kind: RelatedItem["kind"] }) {
  const props = { className: "size-4 text-foreground/50", strokeWidth: 1.7 };
  if (kind === "guide") return <BookOpen {...props} />;
  if (kind === "template") return <FileText {...props} />;
  if (kind === "case") return <FolderOpen {...props} />;
  return <BookOpen {...props} />;
}

export function RelatedReading({ heading = "Related reading", items }: Props) {
  if (!items || items.length === 0) return null;
  return (
    <section className="pb-14 sm:pb-20">
      <Container>
        <div className="max-w-[760px]">
          <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-border">
            <h2 className="text-[15px] font-medium tracking-tight">
              {heading}
            </h2>
            <span className="text-[11px] uppercase tracking-wider text-foreground/45">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((item) => (
              <li key={`${item.kind}-${item.slug}`}>
                <Link
                  href={item.href}
                  className="lift group block card p-5 h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-foreground/55">
                      <Icon kind={item.kind} />
                      {kindLabel[item.kind]}
                    </span>
                    <ArrowUpRight
                      className="size-4 text-foreground/40 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.8}
                    />
                  </div>
                  <h3 className="text-[15.5px] tracking-tight font-medium mb-1.5 group-hover:text-foreground transition-colors">
                    {item.title}
                  </h3>
                  {item.blurb && (
                    <p className="text-[13px] leading-relaxed text-foreground/60 line-clamp-2">
                      {item.blurb}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
