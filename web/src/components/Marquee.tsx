const phrases = [
  "Define the AI job",
  "Specify what the AI must never do",
  "Decide what ‘good’ means",
  "Wire human review",
  "Set the launch gate",
  "Trace every step",
  "Label real failures",
  "Cost-per-workflow before scale",
  "Operate the model after launch",
];

export function Marquee() {
  return (
    <section
      aria-hidden
      className="marquee-container relative py-10 border-y border-border overflow-hidden select-none"
    >
      <div className="marquee-track flex gap-12 whitespace-nowrap will-change-transform">
        {[...phrases, ...phrases].map((p, i) => (
          <span
            key={i}
            className="text-[28px] sm:text-[40px] tracking-[-0.02em] font-display italic text-foreground/60 flex items-center gap-12"
          >
            {p}
            <span className="inline-block size-1.5 rounded-full bg-foreground/30" />
          </span>
        ))}
      </div>
    </section>
  );
}
