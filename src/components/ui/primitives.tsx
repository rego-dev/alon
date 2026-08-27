import * as React from "react";
import { cn } from "@/lib/utils";

/* --------------------------------- Card ---------------------------------- */

export function Card({
  className,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-[var(--shadow-float)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-3", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-3 border-t border-[var(--border)] p-6", className)} {...props} />;
}

/* --------------------------------- Badge --------------------------------- */

const badgeTones = {
  neutral: "bg-[var(--surface-muted)] text-[var(--muted-foreground)] border-[var(--border)]",
  primary: "bg-[var(--primary-soft)] text-[var(--primary)] border-transparent",
  accent: "bg-[var(--accent-soft)] text-[var(--accent)] border-transparent",
  success: "bg-[var(--success-soft)] text-[var(--success)] border-transparent",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)] border-transparent",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)] border-transparent",
} as const;

export type BadgeTone = keyof typeof badgeTones;

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}

/* -------------------------------- Section -------------------------------- */

export function Section({
  className,
  muted = false,
  ...props
}: React.HTMLAttributes<HTMLElement> & { muted?: boolean }) {
  return (
    <section
      className={cn("py-20 md:py-28", muted && "bg-[var(--surface-muted)]", className)}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl text-center items-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-semibold leading-[1.15] md:text-4xl lg:text-[2.75rem]">{title}</h2>
      {description ? (
        <p className="text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

/* --------------------------------- Input --------------------------------- */

const fieldClass =
  "w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] transition-colors placeholder:text-[var(--muted-foreground)]/70 focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--ring)]/20 disabled:opacity-60";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClass, "min-h-32 resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldClass, "appearance-none pr-10", className)} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  hint,
  required,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-[var(--foreground)]">
        {label}
        {required ? <span className="ml-1 text-[var(--danger)]">*</span> : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-[var(--muted-foreground)]">{hint}</p> : null}
    </div>
  );
}

/* -------------------------------- Divider -------------------------------- */

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-[var(--border)]", className)} />;
}

/* --------------------------------- Table --------------------------------- */

export function DataTable({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]",
        className,
      )}
      {...props}
    />
  );
}

export function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("whitespace-nowrap px-4 py-3.5 text-sm", className)} {...props} />;
}
