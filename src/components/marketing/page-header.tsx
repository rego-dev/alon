import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 ? <ChevronRight className="size-3.5 opacity-60" aria-hidden /> : null}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-[var(--primary)]">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-[var(--foreground)]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  bullets,
  bulletIcon: BulletIcon,
  breadcrumbs,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  bullets?: string[];
  bulletIcon?: LucideIcon;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden border-b border-[var(--border)] py-14 md:py-20", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-backdrop opacity-60" />
        <div className="absolute -top-32 left-1/3 size-[34rem] rounded-full bg-[var(--primary)] opacity-[0.10] blur-[110px]" />
      </div>

      <div className="container-page">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        {eyebrow ? (
          <Badge tone="primary" className="mb-5">
            {eyebrow}
          </Badge>
        ) : null}
        <h1 className="max-w-3xl text-3xl font-semibold leading-[1.1] md:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">{description}</p>
        ) : null}
        {bullets?.length ? (
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                {BulletIcon ? <BulletIcon className="size-4 text-[var(--success)]" aria-hidden /> : null}
                {bullet}
              </li>
            ))}
          </ul>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
