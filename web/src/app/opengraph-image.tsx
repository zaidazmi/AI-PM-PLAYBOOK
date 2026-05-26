import { ImageResponse } from "next/og";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgFrame,
  loadGoogleFont,
} from "@/lib/og";

export const alt = "AI PM Playbook · Ship AI features you can put your name on";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const [geistMedium, geistSemibold] = await Promise.all([
    loadGoogleFont("Geist", 500),
    loadGoogleFont("Geist", 600),
  ]);

  return new ImageResponse(
    (
      <OgFrame
        title="Ship AI features you can put your name on."
        eyebrow="A working system for AI PMs"
        category="Home"
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
