import type { MetadataRoute } from "next";
import {
  GUIDE_FILES,
  TEMPLATE_FILES,
  guideToSlug,
  loadCaseStudies,
} from "@/lib/content";
import path from "node:path";

const SITE_URL = "https://ai-pm-playbook.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
    { path: "/playbook", priority: 0.9 },
    { path: "/guides", priority: 0.8 },
    { path: "/templates", priority: 0.8 },
    { path: "/examples", priority: 0.8 },
  ];
  for (const p of staticPages) {
    entries.push({
      url: `${SITE_URL}${p.path}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: p.priority,
    });
  }

  // Guides
  for (const g of GUIDE_FILES) {
    const slug = guideToSlug(path.basename(g.file, ".md"));
    entries.push({
      url: `${SITE_URL}/guides/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Templates
  for (const t of TEMPLATE_FILES) {
    const slug = t.slug ?? path.basename(t.file, ".md");
    entries.push({
      url: `${SITE_URL}/templates/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Case studies + their artifacts
  for (const c of loadCaseStudies()) {
    entries.push({
      url: `${SITE_URL}${c.href}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
    for (const a of c.artifacts) {
      entries.push({
        url: `${SITE_URL}${a.href}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
