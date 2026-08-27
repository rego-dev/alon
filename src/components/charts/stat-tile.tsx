import { CircleAlert, CircleCheck, TrendingDown, TrendingUp, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Stat tile — the right form when the number IS the answer and there is no
 * distribution worth plotting. The delta gets an arrow glyph as well as colour.
 */
export function StatTile({
  label,
  value,
  change,
  changeLabel = "vs last month",
  invertChange = false,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  /** For metrics where down is good (churn, expiries). */
  invertChange?: boolean;
  icon?: LucideIcon;
  className?: string;
}) {
  const positive = change === undefined ? null : invertChange ? change < 0 : change > 0;

  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
        {Icon ? <Icon className="size-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden /> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{value}</p>
      {change !== undefined ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs">
          {positive ? (
            <TrendingUp className="size-3.5 text-[var(--viz-good)]" aria-hidden />
          ) : (
            <TrendingDown className="size-3.5 text-[var(--viz-critical)]" aria-hidden />
          )}
          <span className={cn("font-medium tabular-nums", positive ? "text-[var(--viz-good)]" : "text-[var(--viz-critical)]")}>
            {change > 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
          <span className="text-[var(--muted-foreground)]">{changeLabel}</span>
        </p>
      ) : null}
    </div>
  );
}

const STATUS_META = {
  good: { color: "var(--viz-good)", Icon: CircleCheck, label: "Healthy" },
  warning: { color: "var(--viz-warning)", Icon: TriangleAlert, label: "Attention" },
  serious: { color: "var(--viz-serious)", Icon: TriangleAlert, label: "At risk" },
  critical: { color: "var(--viz-critical)", Icon: CircleAlert, label: "Critical" },
  neutral: { color: "var(--viz-ink-muted)", Icon: CircleCheck, label: "Inactive" },
} as const;

export type StatusKey = keyof typeof STATUS_META;

/**
 * State breakdown. Status colours are reserved and always paired with an icon
 * and a label, so state never depends on hue alone.
 */
export function StatusBreakdown({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; count: number; status: StatusKey }>;
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <figure className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
      <figcaption className="mb-4 text-sm font-semibold">{title}</figcaption>

      {/* Proportional bar with a 2px gap between segments */}
      <div className="mb-5 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden>
        {items.map((item) => (
          <span
            key={item.label}
            style={{ width: `${(item.count / total) * 100}%`, background: STATUS_META[item.status].color }}
          />
        ))}
      </div>

      <ul className="space-y-2.5">
        {items.map((item) => {
          const meta = STATUS_META[item.status];
          return (
            <li key={item.label} className="flex items-center gap-2.5 text-sm">
              <meta.Icon className="size-4 shrink-0" style={{ color: meta.color }} aria-hidden />
              <span className="text-[var(--muted-foreground)]">{item.label}</span>
              <span className="ml-auto font-medium tabular-nums">{item.count.toLocaleString("en-US")}</span>
              <span className="w-12 text-right text-xs tabular-nums text-[var(--muted-foreground)]">
                {((item.count / total) * 100).toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
