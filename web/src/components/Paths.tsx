import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionLabel } from "./Container";
import { Reveal } from "./Reveal";
import { paths } from "@/data/content";

const blobClass: Record<string, string> = {
  peach: "blob-peach",
  mint: "blob-mint",
  lavender: "blob-lavender",
  sand: "blob-sand",
};

export function Paths() {
  return (
    <section id="paths" className="relative py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-4 mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel num="01" label="Choose your path" />
            <h2 className="mt-5 text-4xl sm:text-6xl tracking-[-0.025em] leading-[0.98]">
              Four entry points,{" "}
              <span className="font-display italic">one operating loop.</span>
            </h2>
          </div>
          <p className="max-w-md text-foreground/70 text-[15px] leading-relaxed">
            Whether you're sketching an idea or operating in production, the
            artifacts feed the same decision: ship, hold, or stop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {paths.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <Link
                href={p.href}
                className={`group lift relative block overflow-hidden rounded-[28px] border border-border bg-surface min-h-[300px] sm:min-h-[340px]`}
              >
                <div
                  aria-hidden
                  className={`absolute inset-0 ${blobClass[p.blob]}`}
                />
                <div className="relative h-full flex flex-col justify-between p-7 sm:p-9">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur px-3 py-1 text-[12px] font-medium text-foreground/85 border border-white/60">
                      <span className={`size-2 rounded-full ${p.statusDot}`} />
                      {p.status}
                    </span>
                  </div>
                  <div className="space-y-4 max-w-[28ch]">
                    <h3 className="text-[34px] sm:text-[40px] leading-[1.02] tracking-[-0.025em] text-foreground">
                      {p.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed text-foreground/75">
                      {p.description}
                    </p>
                    <div className="pt-1 inline-flex items-center gap-2 text-[14px] font-medium text-foreground border-b border-foreground/30 pb-1 group-hover:border-foreground transition-colors">
                      {p.cta}
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-1"
                        strokeWidth={2.2}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
