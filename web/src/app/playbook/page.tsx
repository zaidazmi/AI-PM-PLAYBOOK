import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DocBreadcrumb, DocHero } from "@/components/DocShell";
import { Markdown } from "@/components/Markdown";
import { DocLayout } from "@/components/DocLayout";
import { JsonLd } from "@/components/JsonLd";
import { WhereToNext } from "@/components/WhereToNext";
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
      <JsonLd
        kind="article"
        url="/playbook"
        title={title}
        description="The full operating model, evidence hierarchy, readiness scoring, and decision framework for AI PMs."
        section="Playbook"
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Playbook", href: "/playbook" },
        ]}
      />
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

        <DocLayout toc={toc}>
          <Markdown>{markdown}</Markdown>
        </DocLayout>

        <WhereToNext />
      </main>
      <Footer />
    </>
  );
}
