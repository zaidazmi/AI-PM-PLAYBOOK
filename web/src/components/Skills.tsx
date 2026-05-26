import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, SectionLabel } from "./Container";
import { Reveal } from "./Reveal";
import { skills } from "@/data/content";

export function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-4 mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionLabel num="05" label="What an AI PM does" />
            <h2 className="mt-5 text-4xl sm:text-6xl tracking-[-0.025em] leading-[0.98]">
              The jobs that{" "}
              <span className="font-display italic">didn’t exist</span> three
              years ago.
            </h2>
          </div>
          <p className="max-w-md text-foreground/70 text-[15px] leading-relaxed">
            Most of these are PM jobs now. Each one has a template you can
            steal.
          </p>
        </div>

        <div className="card overflow-hidden divide-y divide-border">
          {skills.map((s, i) => (
            <Reveal key={s.skill} delay={i * 0.03}>
              <Link
                href={s.href}
                className="grid grid-cols-12 gap-6 px-7 sm:px-10 py-7 hover:bg-[#fbfaf6] transition-colors group"
              >
                <div className="col-span-12 sm:col-span-4 flex items-baseline gap-4">
                  <span className="text-[13px] tabular-nums text-foreground/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[17px] tracking-tight font-medium text-foreground">
                    {s.skill}
                  </span>
                </div>
                <p className="col-span-12 sm:col-span-5 text-[14.5px] leading-relaxed text-foreground/70">
                  {s.one}
                </p>
                <div className="col-span-12 sm:col-span-3 flex sm:justify-end items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-foreground/[0.05] px-3 py-1 text-[12px] text-foreground/75">
                    {s.artifact}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-foreground/30 transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
