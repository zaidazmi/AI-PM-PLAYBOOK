import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  DocBreadcrumb,
  DocHero,
} from "@/components/DocShell";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { loadGuides } from "@/lib/content";

export const metadata: Metadata = {
  title: "Guides · AI PM Playbook",
  description:
    "Twelve guides on the parts of AI product management where most teams get stuck.",
};

export default function GuidesIndex() {
  const guides = loadGuides();
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocHero
          eyebrow={
            <DocBreadcrumb
              crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }]}
            />
          }
          title="Guides"
          lede="Twelve guides on the parts of AI product management where most teams get stuck. Eval design, launch gates, agentic products, prompt craft, error analysis."
        />
        <section className="py-14 sm:py-20">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {guides.map((g, i) => (
                <Reveal key={g.slug} delay={(i % 6) * 0.04}>
                  <Link
                    href={g.href}
                    className="lift group block card p-6 sm:p-7 h-full"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <span className="text-[12px] tabular-nums font-mono text-foreground/40">
                        {g.num}
                      </span>
                      <ArrowUpRight
                        className="size-4 text-foreground/40 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.8}
                      />
                    </div>
                    <h3 className="text-[18px] tracking-tight font-medium mb-2 group-hover:text-foreground transition-colors">
                      {g.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed text-foreground/65 line-clamp-4">
                      {g.blurb}
                    </p>
                    <div className="mt-5 pt-4 border-t border-border inline-flex items-center gap-1.5 text-[11.5px] text-foreground/55 tabular-nums">
                      <Clock className="size-3" strokeWidth={1.8} />
                      {g.readingTime.minutes} min read
                    </div>
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
