import type { ProductScreenshot } from "@/types";
import { cn } from "@/lib/utils";
import { seededInt } from "@/lib/hash";

/**
 * Product screenshots are rendered as lightweight DOM mocks rather than binary
 * images: they stay sharp at any density, respect the active theme, cost no
 * network requests, and never go stale against the real UI.
 */
export function ScreenshotMock({
  shot,
  seed,
  className,
}: {
  shot: ProductScreenshot;
  seed: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-raised)]",
        className,
      )}
      aria-hidden
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2">
        <span className="size-2 rounded-full bg-red-400/70" />
        <span className="size-2 rounded-full bg-amber-400/70" />
        <span className="size-2 rounded-full bg-emerald-400/70" />
        <span className="ml-2 truncate text-[10px] font-medium text-[var(--muted-foreground)]">{shot.title}</span>
      </div>
      <div className="p-3">
        <MockBody variant={shot.variant} seed={seed} />
      </div>
    </div>
  );
}

function MockBody({ variant, seed }: { variant: ProductScreenshot["variant"]; seed: string }) {
  switch (variant) {
    case "dashboard":
      return <DashboardMock seed={seed} />;
    case "table":
      return <TableMock seed={seed} />;
    case "form":
      return <FormMock />;
    case "report":
      return <ReportMock seed={seed} />;
    case "mobile":
      return <MobileMock seed={seed} />;
  }
}

function DashboardMock({ seed }: { seed: string }) {
  const bars = Array.from({ length: 12 }, (_, i) => seededInt(`${seed}:bar:${i}`, 25, 100));
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {["Revenue", "Orders", "Margin"].map((label, i) => (
          <div key={label} className="rounded-lg bg-[var(--surface-muted)] p-2.5">
            <p className="text-[9px] text-[var(--muted-foreground)]">{label}</p>
            <p className="mt-0.5 text-sm font-semibold">
              {["$284k", "1,284", "31.4%"][i]}
            </p>
          </div>
        ))}
      </div>
      <div className="flex h-24 items-end gap-1 rounded-lg bg-[var(--surface-muted)] p-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-[var(--primary)]/30 to-[var(--primary)]"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function TableMock({ seed }: { seed: string }) {
  const rows = Array.from({ length: 7 }, (_, i) => ({
    w1: seededInt(`${seed}:t1:${i}`, 40, 90),
    w2: seededInt(`${seed}:t2:${i}`, 30, 70),
    w3: seededInt(`${seed}:t3:${i}`, 25, 60),
    ok: seededInt(`${seed}:t4:${i}`, 0, 3) > 0,
  }));
  return (
    <div className="space-y-1.5">
      <div className="flex gap-2 border-b border-[var(--border)] pb-1.5">
        <div className="h-1.5 w-16 rounded-full bg-[var(--border-strong)]" />
        <div className="h-1.5 w-12 rounded-full bg-[var(--border-strong)]" />
        <div className="ml-auto h-1.5 w-10 rounded-full bg-[var(--border-strong)]" />
      </div>
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2 py-1">
          <div className="size-3 rounded bg-[var(--primary-soft)]" />
          <div className="h-1.5 rounded-full bg-[var(--border)]" style={{ width: `${row.w1}px` }} />
          <div className="h-1.5 rounded-full bg-[var(--border)]" style={{ width: `${row.w2}px` }} />
          <div className="ml-auto flex items-center gap-1.5">
            <div className="h-1.5 rounded-full bg-[var(--border)]" style={{ width: `${row.w3}px` }} />
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[8px] font-medium",
                row.ok
                  ? "bg-[var(--success-soft)] text-[var(--success)]"
                  : "bg-[var(--warning-soft)] text-[var(--warning)]",
              )}
            >
              {row.ok ? "Posted" : "Draft"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FormMock() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={cn("space-y-1", i === 4 && "col-span-2")}>
          <div className="h-1.5 w-12 rounded-full bg-[var(--border-strong)]" />
          <div className="h-6 rounded-md border border-[var(--border)] bg-[var(--surface-muted)]" />
        </div>
      ))}
      <div className="col-span-2 flex justify-end gap-2 pt-1">
        <div className="h-6 w-14 rounded-full border border-[var(--border-strong)]" />
        <div className="h-6 w-16 rounded-full bg-[var(--primary)]" />
      </div>
    </div>
  );
}

function ReportMock({ seed }: { seed: string }) {
  const lines = Array.from({ length: 9 }, (_, i) => seededInt(`${seed}:r:${i}`, 30, 96));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="h-2 w-24 rounded-full bg-[var(--border-strong)]" />
        <div className="flex gap-1">
          <div className="h-4 w-8 rounded bg-[var(--surface-muted)]" />
          <div className="h-4 w-8 rounded bg-[var(--surface-muted)]" />
        </div>
      </div>
      {lines.map((w, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-[var(--border)]" style={{ maxWidth: `${w}%` }} />
          <div className="h-1.5 w-10 rounded-full bg-[var(--primary)]/40" />
        </div>
      ))}
      <div className="mt-1 flex items-center gap-2 border-t border-[var(--border)] pt-2">
        <div className="h-2 w-16 rounded-full bg-[var(--border-strong)]" />
        <div className="ml-auto h-2 w-14 rounded-full bg-[var(--primary)]" />
      </div>
    </div>
  );
}

function MobileMock({ seed }: { seed: string }) {
  const rows = Array.from({ length: 5 }, (_, i) => seededInt(`${seed}:m:${i}`, 40, 90));
  return (
    <div className="mx-auto w-32 rounded-[1.1rem] border-4 border-[var(--border-strong)] bg-[var(--surface-muted)] p-1.5">
      <div className="mx-auto mb-1.5 h-1 w-8 rounded-full bg-[var(--border-strong)]" />
      <div className="space-y-1.5">
        <div className="rounded-md bg-[var(--primary)] p-1.5">
          <div className="h-1 w-10 rounded-full bg-white/60" />
          <div className="mt-1 h-2 w-14 rounded-full bg-white/90" />
        </div>
        {rows.map((w, i) => (
          <div key={i} className="flex items-center gap-1.5 rounded-md bg-[var(--surface)] p-1.5">
            <div className="size-3 shrink-0 rounded bg-[var(--primary-soft)]" />
            <div className="h-1 rounded-full bg-[var(--border)]" style={{ width: `${w * 0.5}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
