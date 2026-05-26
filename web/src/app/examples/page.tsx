import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  DocBreadcrumb,
  DocHero,
} from "@/components/DocShell";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { loadCaseStudies } from "@/lib/content";

const blobClass: Record<string, string> = {
  "customer-support-copilot": "blob-butter",
  "sales-call-crm-assistant": "blob-sky",
  "healthcare-intake-assistant": "blob-rose",
};

const riskColor: Record<string, string> = {
  Low: "bg-[#cbe6d4] text-[#1e4a30]",
  Medium: "bg-[#f0e6b8] text-[#5b4a06]",
  High: "bg-[#f1c9c9] text-[#7a1e1e]",
};

export const metadata: Metadata = {
  title: "Case studies · AI PM Playbook",
  description:
    "Three worked examples. Each has an opportunity brief, PRD, eval plan, launch gate, and readiness recommendation.",
};

export default function ExamplesIndex() {
  const cases = loadCaseStudies();
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocHero
          eyebrow={
            <DocBreadcrumb
              crumbs={[{ label: "Home", href: "/" }, { label: "Case studies" }]}
            />
          }
          title="Case studies"
          lede="Three worked examples. Each one includes an opportunity brief, PRD, eval plan, launch gate, and a scored readiness recommendation."
        />
        <section className="py-14 sm:py-20">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7">
              {cases.map((c, i) => (
                <Reveal key={c.slug} delay={i * 0.08}>
                  <Link
                    href={c.href}
                    className="lift group relative block overflow-hidden rounded-[28px] border border-border bg-surface min-h-[380px]"
                  >
                    <div
                      aria-hidden
                      className={`absolute inset-0 ${blobClass[c.slug] ?? "blob-sand"} opacity-90`}
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
                        <h3 className="text-[26px] sm:text-[30px] leading-[1.05] tracking-[-0.02em] text-foreground max-w-[22ch]">
                          {c.title}
                        </h3>
                        <p className="text-[14.5px] leading-relaxed text-foreground/75 max-w-[34ch] line-clamp-4">
                          {c.blurb}
                        </p>
                      </div>
                      <div className="mt-8 flex items-end justify-between gap-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-foreground/45">
                            Verdict
                          </div>
                          <div className="text-[13px] font-medium leading-snug text-foreground/85 mt-1 max-w-[24ch]">
                            {c.recommendation}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                          Open
                          <ArrowRight className="size-3.5" strokeWidth={2.2} />
                        </span>
                      </div>
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
