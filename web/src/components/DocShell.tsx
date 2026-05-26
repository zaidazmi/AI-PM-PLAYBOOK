import Link from "next/link";
import { ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { type ReactNode } from "react";
import { Container } from "./Container";

type Crumb = { label: string; href?: string };

export function DocBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-foreground/55">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {c.href ? (
            <Link
              href={c.href}
              className="hover:text-foreground transition-colors"
            >
              {c.label}
            </Link>
          ) : (
            <span className="text-foreground/75">{c.label}</span>
          )}
          {i < crumbs.length - 1 && (
            <ChevronRight className="size-3.5 text-foreground/30" strokeWidth={1.8} />
          )}
        </span>
      ))}
    </nav>
  );
}

export function DocHero({
  eyebrow,
  title,
  lede,
  meta,
}: {
  eyebrow: ReactNode;
  title: string;
  lede?: string;
  meta?: ReactNode;
}) {
  return (
    <header className="pt-12 sm:pt-16 pb-10 sm:pb-14 border-b border-border">
      <Container>
        <div className="mb-6">{eyebrow}</div>
        <h1 className="text-4xl sm:text-6xl lg:text-[72px] tracking-[-0.025em] leading-[1] max-w-[20ch]">
          {title}
        </h1>
        {lede && (
          <p className="mt-6 max-w-2xl text-[17px] sm:text-[18px] leading-relaxed text-foreground/70">
            {lede}
          </p>
        )}
        {meta && <div className="mt-8">{meta}</div>}
      </Container>
    </header>
  );
}

export function DocBody({ children }: { children: ReactNode }) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="max-w-[760px]">{children}</div>
      </Container>
    </section>
  );
}

export function PrevNext({
  prev,
  next,
}: {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  if (!prev && !next) return null;
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="max-w-[760px] grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={prev.href}
              className="lift group card p-5 flex items-center gap-3 text-left"
            >
              <ArrowLeft
                className="size-4 text-foreground/50 transition-transform group-hover:-translate-x-0.5"
                strokeWidth={1.8}
              />
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-foreground/45">
                  Previous
                </span>
                <span className="block text-[15px] mt-0.5">{prev.label}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={next.href}
              className="lift group card p-5 flex items-center justify-end gap-3 text-right"
            >
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-foreground/45">
                  Next
                </span>
                <span className="block text-[15px] mt-0.5">{next.label}</span>
              </span>
              <ArrowRight
                className="size-4 text-foreground/50 transition-transform group-hover:translate-x-0.5"
                strokeWidth={1.8}
              />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </Container>
    </section>
  );
}
