"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Container } from "./Container";
import { GithubIcon } from "./GithubIcon";
import { REPO_URL } from "@/data/content";

const navLinks: { label: string; href: string }[] = [
  { label: "Playbook", href: "/playbook" },
  { label: "Guides", href: "/guides" },
  { label: "Templates", href: "/templates" },
  { label: "Case studies", href: "/examples" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="AI PM Playbook home"
        >
          <span className="relative inline-flex size-7 items-center justify-center rounded-lg bg-foreground text-background text-[11px] font-semibold tracking-tight">
            PM
          </span>
          <span className="text-[15px] font-medium tracking-tight">
            AI&nbsp;PM Playbook
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-foreground/70">
          {navLinks.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative transition-colors ${active ? "text-foreground" : "hover:text-foreground"}`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-[22px] h-[2px] bg-foreground" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] text-foreground/80 hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <GithubIcon className="size-3.5" />
            Star
          </a>
          <Link
            href="/playbook"
            className="hidden md:inline-flex items-center gap-1 rounded-full bg-foreground text-background px-3.5 py-1.5 text-[13px] font-medium hover:bg-foreground/90 transition-colors"
          >
            Read playbook
            <ArrowUpRight className="size-3.5" strokeWidth={2.2} />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface hover:border-foreground/30 transition-colors"
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? (
              <X className="size-4" strokeWidth={2} />
            ) : (
              <Menu className="size-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      <MobileDrawer open={open} pathname={pathname} onClose={() => setOpen(false)} />
    </header>
  );
}

function MobileDrawer({
  open,
  pathname,
  onClose,
}: {
  open: boolean;
  pathname: string;
  onClose: () => void;
}) {
  return (
    <>
      {/* Scrim */}
      <div
        aria-hidden
        onClick={onClose}
        className={`md:hidden fixed inset-0 top-16 bg-foreground/30 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Sheet */}
      <div
        id="mobile-nav-drawer"
        className={`md:hidden fixed inset-x-0 top-16 origin-top transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          open ? "translate-y-0" : "-translate-y-4 pointer-events-none"
        }`}
        style={{ visibility: open ? "visible" : "hidden" }}
      >
        <div className="mx-3 sm:mx-6 mt-2 rounded-3xl border border-border bg-surface shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)] overflow-hidden">
          <nav className="flex flex-col divide-y divide-border">
            {navLinks.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-6 py-5 ${
                    active ? "bg-[#fbfaf6]" : ""
                  } hover:bg-[#fbfaf6] transition-colors`}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={`text-[17px] tracking-tight ${active ? "text-foreground font-medium" : "text-foreground/85"}`}
                  >
                    {l.label}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-foreground/40"
                    strokeWidth={1.8}
                  />
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border px-6 py-4 flex items-center gap-3">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] text-foreground/80 hover:text-foreground transition-colors"
            >
              <GithubIcon className="size-3.5" />
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
