import { ImageResponse } from "next/og";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgFrame,
  loadGoogleFont,
} from "@/lib/og";
import { loadCaseStudies, loadCaseStudyBySlug } from "@/lib/content";

export const alt = "AI PM Playbook case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return loadCaseStudies().map((c) => ({ slug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = loadCaseStudyBySlug(slug);
  const [geistMedium, geistSemibold] = await Promise.all([
    loadGoogleFont("Geist", 500),
    loadGoogleFont("Geist", 600),
  ]);

  return new ImageResponse(
    (
      <OgFrame
        title={c?.title ?? "Case study"}
        eyebrow={c ? `${c.risk} risk · ${c.recommendation}` : "Case study"}
        category="Case study"
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
