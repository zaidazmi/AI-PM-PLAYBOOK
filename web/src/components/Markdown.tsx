import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import { type ComponentProps } from "react";

type Props = {
  children: string;
  className?: string;
};

function InternalLink({ href, ...props }: ComponentProps<"a">) {
  if (!href) return <a {...props} />;
  const isExternal = /^(https?:|mailto:|tel:)/i.test(href);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props} />
    );
  }
  // internal route
  return <Link href={href} {...props} />;
}

export function Markdown({ children, className = "" }: Props) {
  return (
    <div className={`prose-doc ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: { className: "heading-anchor" },
            },
          ],
        ]}
        components={{
          a: ({ node: _node, ...props }) => <InternalLink {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function YamlBlock({ children }: { children: string }) {
  return (
    <div className="rounded-3xl border border-foreground/10 bg-[#0a0a0a] text-[#f5f3ef] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <span className="text-[11px] uppercase tracking-wider text-white/55">
          readiness-assessment.yaml
        </span>
        <span className="text-[11px] text-white/45">YAML</span>
      </div>
      <pre className="px-5 py-5 overflow-x-auto bg-transparent border-0">
        <code className="font-mono text-[12.5px] leading-[1.75] whitespace-pre text-[#f5f3ef]">
          {children}
        </code>
      </pre>
    </div>
  );
}
