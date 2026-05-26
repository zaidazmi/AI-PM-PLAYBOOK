import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  DocBreadcrumb,
  DocHero,
  DocBody,
} from "@/components/DocShell";
import { Markdown } from "@/components/Markdown";
import { WhereToNext } from "@/components/WhereToNext";
import { loadPlaybook } from "@/lib/content";

export const metadata: Metadata = {
  title: "Full playbook · AI PM Playbook",
  description:
    "The full operating model, evidence hierarchy, readiness scoring, and decision framework.",
};

export default function PlaybookPage() {
  const { title, markdown } = loadPlaybook();

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
        />
        <DocBody>
          <Markdown>{markdown}</Markdown>
        </DocBody>
        <WhereToNext />
      </main>
      <Footer />
    </>
  );
}
