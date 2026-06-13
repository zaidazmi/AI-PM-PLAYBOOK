"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search as SearchIcon, CornerDownLeft, X } from "lucide-react";
import type { SearchDoc, SearchKind } from "@/lib/content";

const KIND_BADGE: Record<SearchKind, string> = {
  Playbook: "bg-sand text-foreground/80",
  Guide: "bg-sky text-foreground/80",
  Template: "bg-mint text-foreground/80",
  "Case study": "bg-lavender text-foreground/80",
};

const KIND_ORDER: Record<SearchKind, number> = {
  Playbook: 0,
  Template: 1,
  Guide: 2,
  "Case study": 3,
};

function scoreDoc(doc: SearchDoc, terms: string[]): number {
  const title = doc.title.toLowerCase();
  const blurb = doc.blurb.toLowerCase();
  const text = doc.text.toLowerCase();
  let total = 0;
  for (const t of terms) {
    let s = 0;
    if (title.includes(t)) s += title.startsWith(t) ? 14 : 9;
    if (blurb.includes(t)) s += 3;
    if (text.includes(t)) s += 1;
    if (s === 0) return 0; // every term must match somewhere
    total += s;
  }
  return total;
}

export function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const cache = useRef<SearchDoc[] | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  // Close if the route changes while open (the navbar stays clickable).
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Global shortcut: Cmd/Ctrl+K toggles, "/" opens when not already typing.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      const t = e.target as HTMLElement | null;
      const typing =
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable);
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Load the index once, on first open; focus the field when it expands.
  useEffect(() => {
    if (!open) return;
    if (cache.current) {
      setDocs(cache.current);
    } else {
      fetch("/search-index.json")
        .then((r) => r.json())
        .then((d: SearchDoc[]) => {
          cache.current = d;
          setDocs(d);
        })
        .catch(() => setDocs([]));
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [open]);

  // Click-away closes (there is no scrim — this is an inline header control).
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, close]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!docs || terms.length === 0) return [];
    return docs
      .map((doc) => ({ doc, score: scoreDoc(doc, terms) }))
      .filter((r) => r.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          KIND_ORDER[a.doc.kind] - KIND_ORDER[b.doc.kind] ||
          a.doc.title.localeCompare(b.doc.title),
      )
      .slice(0, 20)
      .map((r) => r.doc);
  }, [docs, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = useCallback(
    (doc: SearchDoc | undefined) => {
      if (!doc) return;
      close();
      router.push(doc.href);
    },
    [close, router],
  );

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  const showDropdown = open && query.trim() !== "";

  return (
    // Stable footprint so the neighbouring nav buttons never shift.
    <div ref={wrapRef} className="relative h-9 w-9 sm:w-32">
      {/* The control itself: animates width from pill to full field. It is
          absolutely anchored to the right and grows leftward over the nav. */}
      <div
        className={`absolute right-0 top-0 z-20 flex h-9 items-center overflow-hidden rounded-full border bg-surface transition-[width,box-shadow] duration-300 ease-out ${
          open
            ? "w-[min(34rem,78vw)] border-foreground/25 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]"
            : "w-9 sm:w-32 border-border"
        }`}
      >
        {open ? (
          <>
            <SearchIcon
              className="ml-3 size-4 shrink-0 text-foreground/40"
              strokeWidth={2}
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKey}
              placeholder="Search templates, guides, case studies…"
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-[14px] text-foreground placeholder:text-foreground/40 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={close}
              aria-label="Close search"
              className="mr-1.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Search"
            aria-expanded={false}
            className="flex h-full w-full items-center justify-center gap-2 text-foreground/70 transition-colors hover:text-foreground sm:justify-start sm:px-3"
          >
            <SearchIcon className="size-4 shrink-0" strokeWidth={2} />
            <span className="hidden sm:inline text-[13px]">Search</span>
            <kbd className="ml-auto hidden sm:inline-flex items-center rounded border border-border bg-background px-1.5 font-mono text-[10px] text-foreground/50">
              ⌘K
            </kbd>
          </button>
        )}
      </div>

      {/* Results — a slim dropdown attached to the field, only while typing. */}
      {showDropdown && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[min(34rem,78vw)] overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_60px_-24px_rgba(0,0,0,0.3)]">
          <div ref={listRef} className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-6 text-center text-[13px] text-foreground/45">
                No matches for “{query.trim()}”.
              </p>
            ) : (
              <ul role="listbox" className="flex flex-col gap-0.5">
                {results.map((doc, i) => (
                  <li
                    key={`${doc.href}-${i}`}
                    role="option"
                    aria-selected={i === active}
                  >
                    <button
                      data-idx={i}
                      onClick={() => go(doc)}
                      onMouseMove={() => setActive(i)}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        i === active ? "bg-foreground/[0.05]" : ""
                      }`}
                    >
                      <span
                        className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${KIND_BADGE[doc.kind]}`}
                      >
                        {doc.kind}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] text-foreground">
                          {doc.title}
                        </span>
                        {doc.blurb ? (
                          <span className="block truncate text-[12px] text-foreground/50">
                            {doc.blurb}
                          </span>
                        ) : null}
                      </span>
                      {i === active ? (
                        <CornerDownLeft
                          className="size-3.5 shrink-0 text-foreground/30"
                          strokeWidth={2}
                        />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {results.length > 0 && (
            <div className="flex items-center gap-3 border-t border-border px-4 py-2 text-[11px] text-foreground/40">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
