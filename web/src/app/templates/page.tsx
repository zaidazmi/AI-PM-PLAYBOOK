import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  DocBreadcrumb,
  DocHero,
} from "@/components/DocShell";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { loadTemplates } from "@/lib/content";

export const metadata: Metadata = {
  title: "Templates · AI PM Playbook",
  description: "Ten PM artifacts you can copy and use today.",
};

export default function TemplatesIndex() {
  const templates = loadTemplates();
  const core = templates.filter((t) => t.group === "core");
  const optional = templates.filter((t) => t.group === "optional");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocHero
          eyebrow={
            <DocBreadcrumb
              crumbs={[{ label: "Home", href: "/" }, { label: "Templates" }]}
            />
          }
          title="Templates"
          lede="Seven core PM artifacts plus three optional templates for build handoff, review, and prompt change control. Copy what you need."
        />

        <section className="py-12 sm:py-16">
          <Container>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-[20px] tracking-tight font-medium">
                Core artifacts
              </h2>
              <span className="text-[12px] uppercase tracking-wider text-foreground/55">
                {core.length} templates
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {core.map((t, i) => (
                <Reveal key={t.slug} delay={(i % 6) * 0.04}>
                  <Link
                    href={t.href}
                    className="lift group block card p-7 h-full"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <span className="inline-flex items-center rounded-full bg-foreground/[0.06] px-2.5 py-1 text-[11px] uppercase tracking-wider text-foreground/70">
                        Template
                      </span>
                      <ArrowUpRight
                        className="size-4 text-foreground/40 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.8}
                      />
                    </div>
                    <h3 className="text-[22px] tracking-tight font-medium mb-2.5">
                      {t.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-foreground/65 line-clamp-3">
                      {t.blurb}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-12 sm:py-16 bg-[#efece5]">
          <Container>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-[20px] tracking-tight font-medium">
                Optional templates
              </h2>
              <span className="text-[12px] uppercase tracking-wider text-foreground/55">
                {optional.length} templates
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
              {optional.map((t, i) => (
                <Reveal key={t.slug} delay={i * 0.05}>
                  <Link
                    href={t.href}
                    className="lift group block card p-6 h-full"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <span className="inline-flex items-center rounded-full bg-foreground/[0.06] px-2.5 py-1 text-[11px] uppercase tracking-wider text-foreground/65">
                        Optional
                      </span>
                      <ArrowUpRight
                        className="size-4 text-foreground/40 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.8}
                      />
                    </div>
                    <h3 className="text-[17px] tracking-tight font-medium mb-2">
                      {t.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed text-foreground/65 line-clamp-3">
                      {t.blurb}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
