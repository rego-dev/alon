"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Shared chart chrome                                                       */
/* -------------------------------------------------------------------------- */

export function ChartFrame({
  title,
  subtitle,
  legend,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  legend?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <figcaption className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{subtitle}</p> : null}
        </div>
        {action}
      </figcaption>
      {legend ? <div className="mb-4">{legend}</div> : null}
      {children}
    </figure>
  );
}

export function Legend({ items }: { items: Array<{ label: string; color: string; value?: string }> }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-xs">
          <span className="size-2.5 rounded-[3px]" style={{ background: item.color }} aria-hidden />
          <span className="text-[var(--muted-foreground)]">{item.label}</span>
          {item.value ? <span className="font-medium tabular-nums">{item.value}</span> : null}
        </li>
      ))}
    </ul>
  );
}

/** The relief for sub-3:1 marks in light mode, and the accessible fallback. */
export function TableView({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: Array<Array<string | number>>;
  caption: string;
}) {
  return (
    <div className="mt-4 max-h-64 overflow-auto rounded-lg border border-[var(--border)]">
      <table className="w-full text-xs">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 bg-[var(--surface-muted)]">
          <tr>
            {head.map((cell, i) => (
              <th
                key={cell}
                scope="col"
                className={cn(
                  "px-3 py-2 font-semibold text-[var(--muted-foreground)]",
                  i === 0 ? "text-left" : "text-right",
                )}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className={cn("px-3 py-1.5", j === 0 ? "text-left font-medium" : "text-right tabular-nums")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TableToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
    >
      {open ? "Hide table" : "Table view"}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tooltip                                                                    */
/* -------------------------------------------------------------------------- */

export function Tooltip({
  x,
  y,
  title,
  rows,
  containerWidth,
}: {
  x: number;
  y: number;
  title: string;
  rows: Array<{ label: string; value: string; color?: string }>;
  containerWidth: number;
}) {
  // Flip the tooltip when it would overflow the right edge.
  const flip = x > containerWidth * 0.62;
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-10 min-w-36 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-2.5 shadow-[var(--shadow-float)]"
      style={{ left: flip ? undefined : x + 12, right: flip ? containerWidth - x + 12 : undefined, top: Math.max(0, y - 12) }}
    >
      <p className="mb-1.5 text-xs font-semibold">{title}</p>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-2 text-xs">
            {row.color ? <span className="size-2 rounded-[2px]" style={{ background: row.color }} aria-hidden /> : null}
            <span className="text-[var(--muted-foreground)]">{row.label}</span>
            <span className="ml-auto font-medium tabular-nums">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
