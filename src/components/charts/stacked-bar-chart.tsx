"use client";

import * as React from "react";
import { ChartFrame, Legend, TableToggle, TableView, Tooltip } from "./primitives";
import { formatNumber } from "@/lib/utils";

export interface StackedSeries {
  key: string;
  label: string;
  color: string;
}

export interface StackedRow {
  label: string;
  values: Record<string, number>;
}

/**
 * Stacked bars, up to four categories. Segments carry a 2px surface gap so
 * adjacent hues never touch, and a table view is available — which is also the
 * relief for the two light-mode slots that sit below 3:1 against white.
 */
export function StackedBarChart({
  title,
  subtitle,
  series,
  rows,
}: {
  title: string;
  subtitle?: string;
  series: StackedSeries[];
  rows: StackedRow[];
}) {
  const [hover, setHover] = React.useState<{ row: number; x: number; y: number } | null>(null);
  const [showTable, setShowTable] = React.useState(false);

  const totals = rows.map((row) => series.reduce((sum, s) => sum + (row.values[s.key] ?? 0), 0));
  const max = Math.max(...totals);
  const height = 200;

  const grandTotals = series.map((s) => ({
    ...s,
    total: rows.reduce((sum, row) => sum + (row.values[s.key] ?? 0), 0),
  }));

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      action={<TableToggle open={showTable} onToggle={() => setShowTable((v) => !v)} />}
      legend={
        <Legend items={grandTotals.map((s) => ({ label: s.label, color: s.color, value: formatNumber(s.total) }))} />
      }
    >
      <div
        className="relative"
        role="img"
        aria-label={`${title}. ${rows
          .map((row, i) => `${row.label}: ${formatNumber(totals[i])} total`)
          .join(", ")}`}
      >
        <div className="flex items-end gap-2" style={{ height }}>
          {rows.map((row, i) => {
            const total = totals[i];
            return (
              <div
                key={row.label}
                className="group flex flex-1 flex-col items-center gap-1.5"
                onMouseEnter={(e) => {
                  const parent = e.currentTarget.parentElement!.getBoundingClientRect();
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHover({ row: i, x: rect.left - parent.left + rect.width / 2, y: 20 });
                }}
                onMouseLeave={() => setHover(null)}
              >
                <div
                  className="flex w-full max-w-14 flex-col-reverse justify-start overflow-hidden rounded-t"
                  style={{ height: `${(total / max) * (height - 26)}px` }}
                >
                  {series.map((s, si) => {
                    const value = row.values[s.key] ?? 0;
                    return (
                      <div
                        key={s.key}
                        className="w-full"
                        style={{
                          height: `${(value / total) * 100}%`,
                          background: s.color,
                          // 2px surface gap so adjacent hues never abut.
                          marginTop: si === 0 ? 0 : 2,
                          borderTopLeftRadius: si === series.length - 1 ? 4 : 0,
                          borderTopRightRadius: si === series.length - 1 ? 4 : 0,
                        }}
                      />
                    );
                  })}
                </div>
                <span className="text-[10px] text-[var(--viz-ink-muted)]">{row.label}</span>
              </div>
            );
          })}
        </div>

        {hover ? (
          <Tooltip
            x={hover.x}
            y={hover.y}
            title={rows[hover.row].label}
            containerWidth={640}
            rows={[
              ...series.map((s) => ({
                label: s.label,
                value: formatNumber(rows[hover.row].values[s.key] ?? 0),
                color: s.color,
              })),
              { label: "Total", value: formatNumber(totals[hover.row]) },
            ]}
          />
        ) : null}
      </div>

      {showTable ? (
        <TableView
          caption={title}
          head={["Period", ...series.map((s) => s.label), "Total"]}
          rows={rows.map((row, i) => [
            row.label,
            ...series.map((s) => formatNumber(row.values[s.key] ?? 0)),
            formatNumber(totals[i]),
          ])}
        />
      ) : null}
    </ChartFrame>
  );
}
