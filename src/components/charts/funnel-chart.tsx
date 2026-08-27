"use client";

import * as React from "react";
import { ChartFrame } from "./primitives";
import { formatNumber } from "@/lib/utils";

const ORDINAL = [
  "var(--viz-ordinal-1)",
  "var(--viz-ordinal-2)",
  "var(--viz-ordinal-3)",
  "var(--viz-ordinal-4)",
  "var(--viz-ordinal-5)",
];

/**
 * Funnel stages use an ordinal single-hue ramp (validated light and dark), with
 * a direct label on every bar — there are only five, and each one is the point.
 */
export function FunnelChart({
  title,
  subtitle,
  stages,
}: {
  title: string;
  subtitle?: string;
  stages: Array<{ stage: string; value: number }>;
}) {
  const max = stages[0]?.value ?? 1;

  return (
    <ChartFrame title={title} subtitle={subtitle}>
      <ol className="space-y-3">
        {stages.map((stage, i) => {
          const share = (stage.value / max) * 100;
          const dropFromPrevious = i > 0 ? ((stages[i - 1].value - stage.value) / stages[i - 1].value) * 100 : 0;
          return (
            <li key={stage.stage}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
                <span className="font-medium">{stage.stage}</span>
                <span className="flex items-baseline gap-2">
                  <span className="tabular-nums font-semibold">{formatNumber(stage.value)}</span>
                  <span className="tabular-nums text-[var(--muted-foreground)]">{share.toFixed(1)}%</span>
                </span>
              </div>
              <div className="h-6 overflow-hidden rounded bg-[var(--surface-muted)]">
                <div
                  className="h-full rounded-r"
                  style={{ width: `${share}%`, background: ORDINAL[i % ORDINAL.length] }}
                />
              </div>
              {i > 0 ? (
                <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                  {dropFromPrevious.toFixed(1)}% drop from {stages[i - 1].stage.toLowerCase()}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </ChartFrame>
  );
}
