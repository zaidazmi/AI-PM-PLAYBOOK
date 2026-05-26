import { TEMPLATE_FILES, readRepoFile } from "@/lib/content";
import path from "node:path";

export const dynamic = "force-static";

function slugFor(entry: (typeof TEMPLATE_FILES)[number]): string {
  return entry.slug ?? path.basename(entry.file, ".md");
}

export function generateStaticParams() {
  return TEMPLATE_FILES.map((t) => ({ slug: slugFor(t) }));
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const entry = TEMPLATE_FILES.find((t) => slugFor(t) === slug);
  if (!entry) {
    return new Response("Not found", { status: 404 });
  }
  const md = readRepoFile(entry.file);
  // Use the source filename so downloads land as e.g. ai-prd.md
  const filename = path.basename(entry.file);
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
