import { ImageResponse } from "next/og";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgFrame,
  loadGoogleFont,
} from "@/lib/og";
import { GUIDE_FILES, guideToSlug, loadGuideBySlug } from "@/lib/content";
import path from "node:path";

export const alt = "AI PM Playbook guide";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return GUIDE_FILES.map((g) => ({
    slug: guideToSlug(path.basename(g.file, ".md")),
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = loadGuideBySlug(slug);
  const [geistMedium, geistSemibold] = await Promise.all([
    loadGoogleFont("Geist", 500),
    loadGoogleFont("Geist", 600),
  ]);

  return new ImageResponse(
    (
      <OgFrame
        title={guide?.title ?? "Guide"}
        eyebrow={`Guide ${guide?.num ?? ""}`.trim()}
        category="Guide"
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
