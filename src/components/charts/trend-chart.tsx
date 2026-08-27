"use client";

import * as React from "react";
import { ChartFrame, TableToggle, TableView, Tooltip } from "./primitives";
import { formatCompact, formatCurrency } from "@/lib/utils";

export interface TrendPoint {
  label: string;
  value: number;
}

/**
 * Single-series trend. One series means no legend — the title names it — and a
 * direct label on the final point rather than a number on every point.
 */
export function TrendChart({
  title,
  subtitle,
  points,
  format = "currency",
}: {
  title: string;
  subtitle?: string;
  points: TrendPoint[];
  format?: "currency" | "number";
}) {
  const [hover, setHover] = React.useState<number | null>(null);
  const [showTable, setShowTable] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(640);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const height = 220;
  const padding = { top: 16, right: 56, bottom: 28, left: 8 };
  const plotW = Math.max(120, width - padding.left - padding.right);
  const plotH = height - padding.top - padding.bottom;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  // Headroom so the peak never touches the frame.
  const yMin = min - span * 0.25;
  const yMax = max + span * 0.12;

  const x = (i: number) => padding.left + (i / Math.max(1, points.length - 1)) * plotW;
  const y = (v: number) => padding.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(points.length - 1).toFixed(1)} ${padding.top + plotH} L ${x(0).toFixed(1)} ${padding.top + plotH} Z`;

  const fmt = (v: number) => (format === "currency" ? formatCurrency(v) : formatCompact(v));
  const last = points[points.length - 1];
  const first = points[0];
  const change = ((last.value - first.value) / first.value) * 100;

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const index = Math.round(((px - padding.left) / plotW) * (points.length - 1));
    setHover(Math.min(points.length - 1, Math.max(0, index)));
  };

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      action={<TableToggle open={showTable} onToggle={() => setShowTable((v) => !v)} />}
    >
      <div className="mb-3 flex items-end gap-3">
        <p className="text-3xl font-semibold tracking-tight">{fmt(last.value)}</p>
        <p className={`pb-1 text-sm font-medium ${change >= 0 ? "text-[var(--viz-good)]" : "text-[var(--viz-critical)]"}`}>
          {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% over {points.length} months
        </p>
      </div>

      <div
        ref={ref}
        className="relative"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={`${title}. ${points.map((p) => `${p.label}: ${fmt(p.value)}`).join(", ")}`}
      >
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--viz-series-1)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--viz-series-1)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Recessive gridlines */}
          {[0, 0.5, 1].map((t) => {
            const gy = padding.top + t * plotH;
            return <line key={t} x1={padding.left} x2={padding.left + plotW} y1={gy} y2={gy} stroke="var(--viz-grid)" strokeWidth="1" />;
          })}

          <path d={area} fill="url(#trend-fill)" />
          <path d={line} fill="none" stroke="var(--viz-series-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Direct label on the final point only */}
          <circle cx={x(points.length - 1)} cy={y(last.value)} r="4.5" fill="var(--viz-series-1)" stroke="var(--surface)" strokeWidth="2" />

          {hover !== null ? (
            <>
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={padding.top}
                y2={padding.top + plotH}
                stroke="var(--viz-axis)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle cx={x(hover)} cy={y(points[hover].value)} r="5" fill="var(--viz-series-1)" stroke="var(--surface)" strokeWidth="2" />
            </>
          ) : null}

          {/* X axis */}
          {points.map((p, i) =>
            i % 2 === 0 || i === points.length - 1 ? (
              <text
                key={p.label}
                x={x(i)}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px]"
                fill="var(--viz-ink-muted)"
              >
                {p.label}
              </text>
            ) : null,
          )}
        </svg>

        {hover !== null ? (
          <Tooltip
            x={x(hover)}
            y={y(points[hover].value)}
            title={points[hover].label}
            rows={[{ label: title, value: fmt(points[hover].value), color: "var(--viz-series-1)" }]}
            containerWidth={width}
          />
        ) : null}
      </div>

      {showTable ? (
        <TableView
          caption={title}
          head={["Period", format === "currency" ? "Amount" : "Count"]}
          rows={points.map((p) => [p.label, fmt(p.value)])}
        />
      ) : null}
    </ChartFrame>
  );
}
