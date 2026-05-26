"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

type Props = {
  /** Pixels of scrollY past which the button shows. Default 800. */
  threshold?: number;
};

export function BackToTop({ threshold = 800 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground/70 hover:text-foreground hover:border-foreground/40 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <ArrowUp className="size-4" strokeWidth={1.8} />
    </button>
  );
}
