import { Download } from "lucide-react";

type Props = {
  href: string;
  filename: string;
  /** Bytes (will be shown rounded to KB). Optional. */
  sizeBytes?: number;
};

export function DownloadButton({ href, filename, sizeBytes }: Props) {
  return (
    <a
      href={href}
      download={filename}
      className="group flex items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 hover:border-foreground/30 hover:bg-[#fbfaf6] transition-colors"
    >
      <Download
        className="size-4 text-foreground/55 mt-0.5 shrink-0 group-hover:text-foreground transition-colors"
        strokeWidth={1.8}
      />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium tracking-tight text-foreground">
          Download template
        </div>
        <div className="text-[11.5px] text-foreground/55 tabular-nums truncate">
          {filename}
          {typeof sizeBytes === "number" ? (
            <>
              {" "}
              <span className="text-foreground/40">
                · {Math.max(1, Math.round(sizeBytes / 1024))} KB
              </span>
            </>
          ) : null}
        </div>
      </div>
    </a>
  );
}
