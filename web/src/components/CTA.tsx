import Link from "next/link";
import { ArrowUpRight, Star, ArrowRight } from "lucide-react";
import { Container } from "./Container";
import { GithubIcon } from "./GithubIcon";
import { Reveal } from "./Reveal";
import { REPO_URL } from "@/data/content";

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blob-peach opacity-80"
      />
      <Container className="relative">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl tracking-[-0.025em] leading-[0.98]">
              Take the playbook.{" "}
              <span className="font-display italic">Fork it.</span> Ship better
              AI.
            </h2>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-foreground/75">
              MIT licensed. Built in the open. If it makes your next AI review
              less hand-wavy, a GitHub star tells me it's worth maintaining.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-[14px] font-medium hover:bg-foreground/90 transition-colors"
              >
                <Star className="size-4" strokeWidth={2} />
                Star on GitHub
                <ArrowUpRight className="size-4" strokeWidth={2.2} />
              </a>
              <Link
                href="/playbook"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-surface/80 backdrop-blur px-5 py-3 text-[14px] font-medium text-foreground/85 hover:border-foreground/40 hover:text-foreground transition-colors"
              >
                Read the full playbook
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
