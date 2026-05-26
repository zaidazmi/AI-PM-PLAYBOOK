"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/content";

type Props = {
  items: TocEntry[];
};

export function DocTOC({ items }: Props) {
  const [active, setActive] = useState<string | null>(null);

  // Highlight the heading currently nearest the top of the viewport
  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;

    const headings = items
      .map((i) => document.getElementById(i.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="text-[12.5px] leading-relaxed"
    >
      <div className="text-[10.5px] uppercase tracking-[0.16em] text-foreground/45 mb-3">
        On this page
      </div>
      <ol className="space-y-1.5 border-l border-border">
        {items.map((entry) => {
          const isActive = active === entry.slug;
          return (
            <li key={entry.slug}>
              <a
                href={`#${entry.slug}`}
                className={`block -ml-px pl-4 py-0.5 border-l-2 transition-colors ${
                  isActive
                    ? "border-foreground text-foreground font-medium"
                    : "border-transparent text-foreground/55 hover:text-foreground/85"
                }`}
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
