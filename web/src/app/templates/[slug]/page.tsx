import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  DocBreadcrumb,
  DocHero,
  PrevNext,
} from "@/components/DocShell";
import { DocLayout } from "@/components/DocLayout";
import { DownloadButton } from "@/components/DownloadButton";
import { Markdown } from "@/components/Markdown";
import { RelatedReading } from "@/components/RelatedReading";
import {
  TEMPLATE_FILES,
  loadTemplateBySlug,
  relatedForTemplate,
} from "@/lib/content";
import path from "node:path";

function templateSlug(t: (typeof TEMPLATE_FILES)[number]): string {
  return t.slug ?? path.basename(t.file, ".md");
}

export function generateStaticParams() {
  return TEMPLATE_FILES.map((t) => ({ slug: templateSlug(t) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = loadTemplateBySlug(slug);
  if (!t) return { title: "Not found" };
  return { title: `${t.title} · AI PM Playbook` };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = loadTemplateBySlug(slug);
  if (!t) notFound();

  // Compute prev/next within the templates list (core first, optional after)
  const ordered = TEMPLATE_FILES.map((tf) => ({
    slug: templateSlug(tf),
    group: tf.group,
  }));
  const idx = ordered.findIndex((x) => x.slug === slug);
  const prevEntry = idx > 0 ? ordered[idx - 1] : null;
  const nextEntry =
    idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  const prev = prevEntry
    ? {
        href: `/templates/${prevEntry.slug}`,
        label:
          loadTemplateBySlug(prevEntry.slug)?.title ?? prevEntry.slug,
      }
    : undefined;
  const next = nextEntry
    ? {
        href: `/templates/${nextEntry.slug}`,
        label:
          loadTemplateBySlug(nextEntry.slug)?.title ?? nextEntry.slug,
      }
    : undefined;

  const related = relatedForTemplate(slug);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocHero
          eyebrow={
            <DocBreadcrumb
              crumbs={[
                { label: "Home", href: "/" },
                { label: "Templates", href: "/templates" },
                { label: t.group === "optional" ? "Optional" : "Core" },
              ]}
            />
          }
          title={t.title}
          meta={
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1 text-[11px] uppercase tracking-wider text-foreground/65">
              <span className="inline-block size-1.5 rounded-full bg-foreground/40" />
              {t.group === "optional" ? "Optional template" : "Core template"}
            </div>
          }
        />
        <DocLayout
          toc={t.toc}
          sidebarFooter={
            <DownloadButton
              href={`/templates/${slug}/download`}
              filename={t.filename}
              sizeBytes={t.sizeBytes}
            />
          }
        >
          <Markdown>{t.markdown}</Markdown>
        </DocLayout>
        <RelatedReading heading="Read alongside this template" items={related} />
        <PrevNext prev={prev} next={next} />
      </main>
      <Footer />
    </>
  );
}
