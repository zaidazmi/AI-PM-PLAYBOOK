import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, FileText, FileJson } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  DocBreadcrumb,
  DocHero,
  DocBody,
} from "@/components/DocShell";
import { Markdown } from "@/components/Markdown";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { loadCaseStudies, loadCaseStudyBySlug } from "@/lib/content";

const riskColor: Record<string, string> = {
  Low: "bg-[#cbe6d4] text-[#1e4a30]",
  Medium: "bg-[#f0e6b8] text-[#5b4a06]",
  High: "bg-[#f1c9c9] text-[#7a1e1e]",
};

export function generateStaticParams() {
  return loadCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = loadCaseStudyBySlug(slug);
  if (!c) return { title: "Not found" };
  return { title: `${c.title} · AI PM Playbook` };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = loadCaseStudyBySlug(slug);
  if (!c) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocHero
          eyebrow={
            <DocBreadcrumb
              crumbs={[
                { label: "Home", href: "/" },
                { label: "Case studies", href: "/examples" },
                { label: c.title },
              ]}
            />
          }
          title={c.title}
          meta={
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${riskColor[c.risk]}`}
              >
                {c.risk} risk
              </span>
              <span className="inline-flex items-center rounded-full bg-foreground/[0.06] px-3 py-1 text-[11px] text-foreground/75">
                Verdict: {c.recommendation}
              </span>
            </div>
          }
        />

        <DocBody>
          <Markdown>{c.readme}</Markdown>
        </DocBody>

        <section className="pb-20 sm:pb-28">
          <Container>
            <div className="max-w-[760px]">
              <h2 className="text-[22px] tracking-tight font-medium mb-5">
                Artifacts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {c.artifacts.map((a, i) => (
                  <Reveal key={a.slug} delay={(i % 4) * 0.04}>
                    <Link
                      href={a.href}
                      className="lift group block card p-5 h-full"
                    >
                      <div className="flex items-start justify-between mb-3">
                        {a.kind === "yaml" ? (
                          <FileJson
                            className="size-4 text-foreground/45"
                            strokeWidth={1.7}
                          />
                        ) : (
                          <FileText
                            className="size-4 text-foreground/45"
                            strokeWidth={1.7}
                          />
                        )}
                        <ArrowUpRight
                          className="size-4 text-foreground/40 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          strokeWidth={1.8}
                        />
                      </div>
                      <h3 className="text-[15.5px] tracking-tight font-medium">
                        {a.title}
                      </h3>
                      <p className="mt-1 text-[12.5px] text-foreground/55">
                        {a.kind === "yaml" ? "Structured readiness data" : "Markdown artifact"}
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Other case studies, so the page isn't a dead end */}
        <OtherCases currentSlug={slug} />
      </main>
      <Footer />
    </>
  );
}

function OtherCases({ currentSlug }: { currentSlug: string }) {
  const others = loadCaseStudies().filter((c) => c.slug !== currentSlug);
  if (others.length === 0) return null;
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="max-w-[760px]">
          <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-border">
            <h2 className="text-[15px] font-medium tracking-tight">
              Other case studies
            </h2>
            <span className="text-[11px] uppercase tracking-wider text-foreground/45">
              {others.length} more
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={c.href}
                className="lift group block card p-5 h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${riskColor[c.risk]}`}
                  >
                    {c.risk} risk
                  </span>
                  <ArrowUpRight
                    className="size-4 text-foreground/40 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </div>
                <h3 className="text-[15.5px] tracking-tight font-medium mb-1">
                  {c.title}
                </h3>
                <p className="text-[12.5px] text-foreground/55">
                  Verdict: {c.recommendation}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
