import { ImageResponse } from "next/og";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgFrame,
  loadGoogleFont,
} from "@/lib/og";
import { loadCaseArtifact, loadCaseStudies } from "@/lib/content";

export const alt = "AI PM Playbook case study artifact";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  const params: { slug: string; artifact: string }[] = [];
  for (const c of loadCaseStudies()) {
    for (const a of c.artifacts) {
      params.push({ slug: c.slug, artifact: a.slug });
    }
  }
  return params;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; artifact: string }>;
}) {
  const { slug, artifact } = await params;
  const a = loadCaseArtifact(slug, artifact);
  const [geistMedium, geistSemibold] = await Promise.all([
    loadGoogleFont("Geist", 500),
    loadGoogleFont("Geist", 600),
  ]);

  return new ImageResponse(
    (
      <OgFrame
        title={a?.title ?? "Artifact"}
        eyebrow={a?.case?.title ?? "Case study"}
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
