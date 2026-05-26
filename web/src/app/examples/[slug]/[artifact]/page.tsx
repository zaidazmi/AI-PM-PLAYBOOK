import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  DocBreadcrumb,
  DocHero,
  DocBody,
  PrevNext,
} from "@/components/DocShell";
import { DocLayout } from "@/components/DocLayout";
import { Markdown, YamlBlock } from "@/components/Markdown";
import { RelatedReading } from "@/components/RelatedReading";
import {
  loadCaseArtifact,
  loadCaseStudies,
  templateForArtifact,
} from "@/lib/content";

export function generateStaticParams() {
  const params: { slug: string; artifact: string }[] = [];
  for (const c of loadCaseStudies()) {
    for (const a of c.artifacts) {
      params.push({ slug: c.slug, artifact: a.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; artifact: string }>;
}): Promise<Metadata> {
  const { slug, artifact } = await params;
  const a = loadCaseArtifact(slug, artifact);
  if (!a) return { title: "Not found" };
  return { title: `${a.title} · ${a.case.title}` };
}

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ slug: string; artifact: string }>;
}) {
  const { slug, artifact } = await params;
  const a = loadCaseArtifact(slug, artifact);
  if (!a) notFound();

  const cases = loadCaseStudies();
  const caseMeta = cases.find((c) => c.slug === slug);
  const idx = caseMeta?.artifacts.findIndex((x) => x.slug === artifact) ?? -1;
  const prev =
    caseMeta && idx > 0
      ? {
          href: caseMeta.artifacts[idx - 1].href,
          label: caseMeta.artifacts[idx - 1].title,
        }
      : undefined;
  const next =
    caseMeta && idx >= 0 && idx < caseMeta.artifacts.length - 1
      ? {
          href: caseMeta.artifacts[idx + 1].href,
          label: caseMeta.artifacts[idx + 1].title,
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
                { label: "Case studies", href: "/examples" },
                { label: a.case.title, href: `/examples/${slug}` },
                { label: a.title },
              ]}
            />
          }
          title={a.title}
          meta={
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1 text-[11px] uppercase tracking-wider text-foreground/65">
              <span className="inline-block size-1.5 rounded-full bg-foreground/40" />
              {a.case.title}
            </div>
          }
        />
        {a.kind === "yaml" ? (
          <DocBody>
            <YamlBlock>{a.body}</YamlBlock>
          </DocBody>
        ) : (
          <DocLayout toc={a.toc}>
            <Markdown>{a.body}</Markdown>
          </DocLayout>
        )}
        {(() => {
          const tpl = templateForArtifact(artifact);
          if (!tpl) return null;
          return (
            <RelatedReading
              heading="Use this template to write your own"
              items={[tpl]}
            />
          );
        })()}
        <PrevNext prev={prev} next={next} />
      </main>
      <Footer />
    </>
  );
}
