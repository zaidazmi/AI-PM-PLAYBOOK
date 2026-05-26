import { type ReactNode } from "react";
import { Container } from "./Container";
import { DocTOC } from "./DocTOC";
import type { TocEntry } from "@/lib/content";

type Props = {
  toc: TocEntry[];
  children: ReactNode;
  /** Optional content rendered below the sticky TOC in the sidebar (e.g. a
   * download button on template pages). Only shows when the sidebar shows. */
  sidebarFooter?: ReactNode;
  /** Min TOC entries to render the sticky sidebar (default 2). */
  minTocEntries?: number;
};

export function DocLayout({
  toc,
  children,
  sidebarFooter,
  minTocEntries = 2,
}: Props) {
  const showSidebar = toc.length >= minTocEntries || Boolean(sidebarFooter);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        {showSidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                {toc.length >= minTocEntries && <DocTOC items={toc} />}
                {sidebarFooter && (
                  <div
                    className={
                      toc.length >= minTocEntries
                        ? "mt-6 pt-5 border-t border-border"
                        : ""
                    }
                  >
                    {sidebarFooter}
                  </div>
                )}
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
