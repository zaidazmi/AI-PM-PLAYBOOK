import { ImageResponse } from "next/og";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgFrame,
  loadGoogleFont,
} from "@/lib/og";
import { TEMPLATE_FILES, loadTemplateBySlug } from "@/lib/content";
import path from "node:path";

export const alt = "AI PM Playbook template";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return TEMPLATE_FILES.map((t) => ({
    slug: t.slug ?? path.basename(t.file, ".md"),
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = loadTemplateBySlug(slug);
  const [geistMedium, geistSemibold] = await Promise.all([
    loadGoogleFont("Geist", 500),
    loadGoogleFont("Geist", 600),
  ]);

  return new ImageResponse(
    (
      <OgFrame
        title={t?.title ?? "Template"}
        eyebrow={t?.group === "optional" ? "Optional template" : "Core template"}
        category="Template"
      />
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistMedium, style: "normal", weight: 500 },
        { name: "Geist", data: geistSemibold, style: "normal", weight: 600 },
      ],
    },
  );
}
