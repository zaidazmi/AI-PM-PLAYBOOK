"use client";

import { useEffect, useState } from "react";

/**
 * Mounts a tiny global click listener: clicking the heading-anchor wrapper
 * inside `.prose-doc` copies the canonical URL (origin + path + hash) to the
 * clipboard and shows a brief toast. The default behavior of following the
 * anchor still runs, so the URL bar also updates.
 */
export function HeadingLinkCopy() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const link = target.closest("a.heading-anchor") as HTMLAnchorElement | null;
      if (!link) return;
      // Modifier-clicks (cmd, ctrl, shift) keep their default browser behavior
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      const hash = (link.getAttribute("href") || "").replace(/^.*#/, "");
      if (!hash) return;
      const url = `${window.location.origin}${window.location.pathname}#${hash}`;
      if (navigator.clipboard && window.isSecureContext) {
        void navigator.clipboard.writeText(url).then(() => {
          setToast("Link copied");
          window.setTimeout(() => setToast(null), 1500);
        });
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-[13px] font-medium shadow-lg transition-all duration-200 ${
        toast
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"
      }`}
    >
      {toast ?? "Link copied"}
    </div>
  );
}
