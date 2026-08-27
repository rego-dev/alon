import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden role="presentation">
      <defs>
        <linearGradient id="alon-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#alon-mark)" />
      <path
        d="M9 22.5 15.1 9.5a1 1 0 0 1 1.8 0L23 22.5h-3.4l-1.3-2.9h-4.6l-1.3 2.9H9Zm5.6-5.6h2.8L16 13.6l-1.4 3.3Z"
        fill="white"
        fillOpacity="0.95"
      />
    </svg>
  );
}

export function Logo({ className, wordmarkClassName }: { className?: string; wordmarkClassName?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("text-[17px] font-semibold tracking-tight", wordmarkClassName)}>
        Alon<span className="text-[var(--muted-foreground)] font-normal">Software</span>
      </span>
    </span>
  );
}
