"use client";

import * as React from "react";
import { ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------- Accordion -------------------------------- */

export function Accordion({
  items,
  className,
  defaultOpen = -1,
}: {
  items: Array<{ question: string; answer: React.ReactNode }>;
  className?: string;
  defaultOpen?: number;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={cn("divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[15px] font-medium transition-colors hover:bg-[var(--surface-muted)] md:px-6"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cn("size-5 shrink-0 text-[var(--muted-foreground)] transition-transform duration-300", isOpen && "rotate-180 text-[var(--primary)]")}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted-foreground)] md:px-6">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------- Tabs ---------------------------------- */

export function Tabs({
  tabs,
  className,
  panelClassName,
}: {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  className?: string;
  panelClassName?: string;
}) {
  const [active, setActive] = React.useState(tabs[0]?.id);
  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 overflow-x-auto rounded-full border border-[var(--border)] bg-[var(--surface-muted)] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
              active === tab.id
                ? "bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) =>
        tab.id === active ? (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            className={cn("mt-6", panelClassName)}
          >
            {tab.content}
          </div>
        ) : null,
      )}
    </div>
  );
}

/* -------------------------------- Rating ---------------------------------- */

export function Rating({ value, count, size = 16 }: { value: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn(
              i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-[var(--border-strong)]",
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium">{value.toFixed(1)}</span>
      {count !== undefined ? (
        <span className="text-sm text-[var(--muted-foreground)]">({count.toLocaleString("en-US")})</span>
      ) : null}
    </div>
  );
}

/* -------------------------------- Reveal ---------------------------------- */

/** Lightweight scroll reveal — IntersectionObserver only, no animation library. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------ Counter ----------------------------------- */

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1600,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // Respect the reduced-motion preference by landing on the final value.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setDisplay(value);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(value * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ------------------------------- Copy field -------------------------------- */

export function CopyField({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="group flex w-full items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-left font-mono text-xs transition-colors hover:border-[var(--primary)]"
      title={label ? `Copy ${label}` : "Copy"}
    >
      <span className="truncate text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]">{value}</span>
      <span className="ml-auto shrink-0 font-sans text-[11px] font-medium text-[var(--primary)]">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
