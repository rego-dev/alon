import { Activity, ArrowUpRight, Boxes, CircleCheck, ShieldCheck, TrendingUp, Users } from "lucide-react";

const BARS = [38, 52, 44, 68, 58, 82, 74, 92, 86, 100];

/**
 * The hero illustration: a stylised application window with floating dashboard
 * cards. Everything is DOM + SVG so it costs nothing to load, scales cleanly at
 * any density, and inherits the active theme.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none" aria-hidden>
      {/* Main window */}
      <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-float)]">
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <div className="ml-3 h-5 flex-1 rounded-md bg-[var(--surface-muted)]" />
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Net revenue · this month</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">$284,912</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--success)]">
              <TrendingUp className="size-3.5" />
              +18.4%
            </span>
          </div>

          {/* Chart */}
          <div className="flex h-28 items-end gap-1.5 sm:h-32">
            {BARS.map((height, i) => (
              <div key={i} className="flex-1 overflow-hidden rounded-t-[3px]">
                <div
                  className="w-full rounded-t-[3px] bg-gradient-to-t from-[var(--primary)]/25 to-[var(--primary)]"
                  style={{ height: `${height}%`, minHeight: 4 }}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Orders", value: "1,284", Icon: Boxes },
              { label: "Active users", value: "312", Icon: Users },
              { label: "Uptime", value: "99.9%", Icon: Activity },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                <Icon className="mb-2 size-4 text-[var(--primary)]" />
                <p className="text-sm font-semibold">{value}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating card — trial countdown */}
      <div className="animate-float absolute -left-4 top-24 w-52 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow-float)] sm:-left-10">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
            <ShieldCheck className="size-4" />
          </span>
          <p className="text-xs font-semibold">Trial active</p>
        </div>
        <p className="text-[11px] text-[var(--muted-foreground)]">22 of 30 days remaining</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div className="h-full w-[73%] rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" />
        </div>
      </div>

      {/* Floating card — sync status */}
      <div className="animate-float-slow absolute -right-3 bottom-16 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-[var(--shadow-float)] sm:-right-8">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold">Branch sync</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--success)]">
            <CircleCheck className="size-3.5" />
            Complete
          </span>
        </div>
        <ul className="mt-2.5 space-y-1.5">
          {["Makati · 2s ago", "Cebu · 4s ago", "Davao · offline queue"].map((row) => (
            <li key={row} className="flex items-center gap-2 text-[11px] text-[var(--muted-foreground)]">
              <span className="size-1.5 rounded-full bg-[var(--accent)]" />
              {row}
            </li>
          ))}
        </ul>
      </div>

      {/* Floating card — conversion pill */}
      <div className="animate-float absolute -top-5 right-6 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 shadow-[var(--shadow-raised)] sm:right-10">
        <p className="flex items-center gap-1.5 text-xs font-semibold">
          <ArrowUpRight className="size-3.5 text-[var(--success)]" />
          38% trial-to-paid
        </p>
      </div>
    </div>
  );
}
