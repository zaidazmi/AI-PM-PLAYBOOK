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
import { Markdown } from "@/components/Markdown";
import { RelatedReading } from "@/components/RelatedReading";
import {
  GUIDE_FILES,
  guideToSlug,
  loadGuideBySlug,
  relatedForGuide,
} from "@/lib/content";
import path from "node:path";

export function generateStaticParams() {
  return GUIDE_FILES.map((g) => ({
    slug: guideToSlug(path.basename(g.file, ".md")),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = loadGuideBySlug(slug);
  if (!guide) return { title: "Not found" };
  return {
    title: `${guide.title} · AI PM Playbook`,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = loadGuideBySlug(slug);
  if (!guide) notFound();

  const all = GUIDE_FILES.map((g) => ({
    slug: guideToSlug(path.basename(g.file, ".md")),
    file: g.file,
    num: g.num,
    titleOverride: g.titleOverride,
  }));
  const idx = all.findIndex((g) => g.slug === slug);
  const prev =
    idx > 0
      ? {
          href: `/guides/${all[idx - 1].slug}`,
          label: all[idx - 1].titleOverride ?? all[idx - 1].slug,
        }
      : undefined;
  const next =
    idx >= 0 && idx < all.length - 1
      ? {
          href: `/guides/${all[idx + 1].slug}`,
          label: all[idx + 1].titleOverride ?? all[idx + 1].slug,
        }
      : undefined;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <DocHero
          eyebrow={
            <DocBreadcrumb
              crumbs={[
                { label: "Home", href: "/" },
                { label: "Guides", href: "/guides" },
                { label: `Guide ${guide.num}` },
              ]}
            />
          }
          title={guide.title}
          meta={
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1 text-[11px] uppercase tracking-wider text-foreground/65">
              <span className="inline-block size-1.5 rounded-full bg-foreground/40" />
              Guide {guide.num}
            </div>
          }
        />
        <DocLayout toc={guide.toc}>
          <Markdown>{guide.markdown}</Markdown>
        </DocLayout>
        <RelatedReading
          heading="Templates that apply this guide"
          items={relatedForGuide(slug)}
        />
        <PrevNext prev={prev} next={next} />
      </main>
      <Footer />
    </>
  );
}
