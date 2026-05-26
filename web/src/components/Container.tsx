import { type ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionLabel({
  num,
  label,
}: {
  num: string;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1 text-[11px] font-medium tracking-wide text-foreground/70 uppercase">
      <span className="inline-block size-1.5 rounded-full bg-foreground/40" />
      <span>
        {num} · {label}
      </span>
    </div>
  );
}
