import Link from "next/link";
import { Container } from "./Container";
import { REPO_URL } from "@/data/content";

export function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <Container>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-foreground text-background text-[11px] font-semibold tracking-tight">
                PM
              </span>
              <span className="text-[14px] font-medium">AI PM Playbook</span>
            </div>
            <p className="mt-3 text-[13px] text-foreground/60 leading-relaxed max-w-xs">
              MIT licensed. Built by Zaid Azmi as a companion to GRIT for AI
              product work.
            </p>
          </div>

          <FooterCol
            title="Read"
            links={[
              { label: "Full playbook", href: "/playbook" },
              { label: "Guides", href: "/guides" },
              { label: "Templates", href: "/templates" },
              { label: "Case studies", href: "/examples" },
            ]}
          />

          <FooterCol
            title="Start"
            links={[
              {
                label: "Before you vibe code",
                href: "/guides/before-you-vibe-code",
              },
              { label: "Opportunity brief", href: "/templates/ai-opportunity-brief" },
              { label: "AI PRD", href: "/templates/ai-prd" },
              { label: "Eval plan", href: "/templates/ai-eval-plan" },
            ]}
          />

          <FooterCol
            title="Elsewhere"
            external
            links={[
              { label: "GitHub", href: REPO_URL },
              { label: "GRIT (engineering)", href: "https://github.com/zaidazmi/GRIT" },
              {
                label: "License",
                href: "https://github.com/zaidazmi/AI-PM-Playbook/blob/main/LICENSE",
              },
            ]}
          />
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-[12px] text-foreground/50">
          <span>© {new Date().getFullYear()} Zaid Azmi · MIT licensed</span>
          <span>Built with Next.js, Tailwind, and Motion.</span>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  external,
}: {
  title: string;
  links: { label: string; href: string }[];
  external?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-foreground/45 mb-3">
        {title}
      </div>
      <ul className="space-y-2">
        {links.map((l) =>
          external ? (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="text-[13.5px] text-foreground/75 hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-[13.5px] text-foreground/75 hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
