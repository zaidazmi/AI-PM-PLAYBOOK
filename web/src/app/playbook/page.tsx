import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DocBreadcrumb, DocHero } from "@/components/DocShell";
import { Markdown } from "@/components/Markdown";
import { DocTOC } from "@/components/DocTOC";
import { WhereToNext } from "@/components/WhereToNext";
import { Container } from "@/components/Container";
import { loadPlaybook } from "@/lib/content";

export const metadata: Metadata = {
  title: "Full playbook · AI PM Playbook",
  description:
    "The full operating model, evidence hierarchy, readiness scoring, and decision framework.",
};

export default function PlaybookPage() {
  const { title, markdown, toc } = loadPlaybook();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocHero
          eyebrow={
            <DocBreadcrumb
              crumbs={[{ label: "Home", href: "/" }, { label: "Playbook" }]}
            />
          }
          title={title}
          lede="The full operating model, evidence hierarchy, readiness scoring, and decision framework for PMs building production AI products."
          meta={
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-[12.5px] text-foreground/60">
              <span>
                <span className="font-medium text-foreground tabular-nums">
                  {toc.length}
                </span>{" "}
                sections
              </span>
              <span>
                <span className="font-medium text-foreground">~ 45 min</span>{" "}
                cover to cover
              </span>
              <span>
                <span className="font-medium text-foreground">MIT</span>{" "}
                licensed
              </span>
            </div>
          }
        />

        {/* 2-column body: sticky TOC sidebar + content */}
        <section className="py-12 sm:py-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <DocTOC items={toc} />
                </div>
              </aside>
              <article className="min-w-0 max-w-[720px]">
                <Markdown>{markdown}</Markdown>
              </article>
            </div>
          </Container>
        </section>

        <WhereToNext />
      </main>
      <Footer />
    </>
  );
}
