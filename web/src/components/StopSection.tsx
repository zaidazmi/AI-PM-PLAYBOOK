import Link from "next/link";
import { OctagonX, ArrowUpRight } from "lucide-react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

const reasons = [
  "Evals are missing or hand-picked",
  "Human review is undefined",
  "Agent rollback is impossible",
  "Data permissioning is unclear",
  "Cost exceeds the business case",
  "Legal or security review hasn’t happened",
];

export function StopSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#0a0a0a] text-[#f5f3ef]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70">
                <span className="inline-block size-1.5 rounded-full bg-[#f1c9c9]" />
                <span>07 · When the playbook says stop</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl tracking-[-0.025em] leading-[1] max-w-[18ch]">
                “Do not launch”{" "}
                <span className="font-display italic text-white/70">
                  is a product decision.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/65">
                It is not a failure state. It is what you say when the blast
                radius is larger than the team's ability to measure, review,
                roll back, or operate the AI safely.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link
                href="/guides/launch-gates"
                className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-[#f5f3ef] text-[#0a0a0a] px-4 py-2.5 text-[13.5px] font-medium hover:bg-white transition-colors"
              >
                Read the launch gates guide
                <ArrowUpRight className="size-3.5" strokeWidth={2.2} />
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5 text-[12px] uppercase tracking-wider text-white/55">
                  <OctagonX className="size-4 text-[#f1c9c9]" strokeWidth={1.8} />
                  Stop or hold conditions
                </div>
                <ul className="divide-y divide-white/8">
                  {reasons.map((r, i) => (
                    <li
                      key={r}
                      className="flex items-baseline gap-4 py-4 text-[15.5px] leading-snug"
                    >
                      <span className="text-[12px] tabular-nums text-white/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-white/90">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
