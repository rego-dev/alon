import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { Block } from "@/types/content";
import { DataTable, Td, Th } from "@/components/ui/primitives";
import { slugify } from "@/lib/utils";

const CALLOUT = {
  info: { Icon: Info, className: "border-[var(--primary)]/35 bg-[var(--primary-soft)]", iconClass: "text-[var(--primary)]" },
  success: { Icon: CircleCheck, className: "border-[var(--success)]/35 bg-[var(--success-soft)]", iconClass: "text-[var(--success)]" },
  warning: { Icon: TriangleAlert, className: "border-[var(--warning)]/40 bg-[var(--warning-soft)]", iconClass: "text-[var(--warning)]" },
  danger: { Icon: CircleAlert, className: "border-[var(--danger)]/40 bg-[var(--danger-soft)]", iconClass: "text-[var(--danger)]" },
} as const;

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-[16.5px] leading-[1.75] text-[var(--muted-foreground)]">{block.text}</p>;

    case "h2":
      return (
        <h2 id={block.id ?? slugify(block.text)} className="scroll-mt-28 pt-6 text-2xl font-semibold">
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3 id={block.id ?? slugify(block.text)} className="scroll-mt-28 pt-3 text-lg font-semibold">
          {block.text}
        </h3>
      );

    case "ul":
      return (
        <ul className="space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-[var(--muted-foreground)]">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
              {item}
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="space-y-2">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-[var(--muted-foreground)]">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--primary-soft)] text-xs font-semibold text-[var(--primary)]">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );

    case "steps":
      return (
        <ol className="space-y-4">
          {block.items.map((step, i) => (
            <li key={step.title} className="relative rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 pl-14">
              <span className="absolute left-5 top-5 grid size-7 place-items-center rounded-full bg-[var(--primary)] text-xs font-semibold text-[var(--primary-foreground)]">
                {i + 1}
              </span>
              <p className="font-medium">{step.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">{step.text}</p>
            </li>
          ))}
        </ol>
      );

    case "code":
      return (
        <figure>
          <pre className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-[13px] leading-relaxed">
            <code className={`language-${block.lang} font-mono`}>{block.code}</code>
          </pre>
          {block.caption ? (
            <figcaption className="mt-2 text-xs text-[var(--muted-foreground)]">{block.caption}</figcaption>
          ) : null}
        </figure>
      );

    case "callout": {
      const { Icon, className, iconClass } = CALLOUT[block.tone];
      return (
        <aside className={`flex gap-3 rounded-[var(--radius-card)] border p-5 ${className}`}>
          <Icon className={`mt-0.5 size-5 shrink-0 ${iconClass}`} aria-hidden />
          <div>
            <p className="font-medium">{block.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{block.text}</p>
          </div>
        </aside>
      );
    }

    case "table":
      return (
        <DataTable>
          <table className="w-full">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
              <tr>
                {block.head.map((cell) => (
                  <Th key={cell}>{cell}</Th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <Td key={j} className={j === 0 ? "font-medium" : "whitespace-normal text-[var(--muted-foreground)]"}>
                      {cell}
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-[var(--primary)] pl-5 text-lg italic leading-relaxed">
          {block.text}
          {block.cite ? (
            <cite className="mt-2 block text-sm not-italic text-[var(--muted-foreground)]">— {block.cite}</cite>
          ) : null}
        </blockquote>
      );
  }
}

/** Extracts h2/h3 blocks for an on-page table of contents. */
export function tableOfContents(blocks: Block[]) {
  return blocks
    .filter((b): b is Extract<Block, { type: "h2" | "h3" }> => b.type === "h2" || b.type === "h3")
    .map((b) => ({ id: b.id ?? slugify(b.text), text: b.text, level: b.type === "h2" ? 2 : 3 }));
}
