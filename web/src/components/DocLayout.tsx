import { type ReactNode } from "react";
import { Container } from "./Container";
import { DocTOC } from "./DocTOC";
import type { TocEntry } from "@/lib/content";

type Props = {
  toc: TocEntry[];
  children: ReactNode;
  /** Min TOC entries to render the sticky sidebar (default 2). Shorter docs
   * fall back to a single centered column. */
  minTocEntries?: number;
};

/**
 * Standard two-column body for every doc-style page (playbook, guides,
 * templates, case studies, artifacts). Sticky TOC sidebar on the left,
 * article column on the right, capped at a comfortable reading width.
 *
 * If the TOC is too short, the sidebar slot collapses and the article
 * remains naturally centered for narrower content.
 */
export function DocLayout({ toc, children, minTocEntries = 2 }: Props) {
  const showTOC = toc.length >= minTocEntries;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        {showTOC ? (
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <DocTOC items={toc} />
              </div>
            </aside>
            <article className="min-w-0 max-w-[720px]">{children}</article>
          </div>
        ) : (
          <article className="min-w-0 max-w-[760px]">{children}</article>
        )}
      </Container>
    </section>
  );
}
