"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme";
import { Logo } from "./logo";

export interface ShellNavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface ShellNavGroup {
  label: string;
  items: ShellNavItem[];
}

export function AppShell({
  groups,
  account,
  contextLabel,
  exitHref = "/",
  exitLabel = "Back to site",
  children,
}: {
  groups: ShellNavGroup[];
  account: { name: string; secondary: string; initials: string };
  contextLabel: string;
  exitHref?: string;
  exitLabel?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Close the drawer when the route changes — adjusting state during render is
  // the recommended alternative to an effect that only mirrors a prop change.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-4" aria-label={contextLabel}>
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = getIcon(item.icon);
              const active = pathname === item.href || (item.href !== "/portal" && item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-[var(--primary-soft)] font-medium text-[var(--primary)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-[var(--danger)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-dvh bg-[var(--surface-muted)]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
        <div className="flex h-16 items-center border-b border-[var(--border)] px-5">
          <Link href="/" aria-label="Alon Software home">
            <Logo />
          </Link>
        </div>
        <p className="px-5 pt-4 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{contextLabel}</p>
        {nav}
        <div className="border-t border-[var(--border)] p-4">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-xs font-semibold text-white">
              {account.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{account.name}</span>
              <span className="block truncate text-xs text-[var(--muted-foreground)]">{account.secondary}</span>
            </span>
            <ChevronDown className="size-4 text-[var(--muted-foreground)]" aria-hidden />
          </div>
          <Link
            href={exitHref}
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
          >
            <LogOut className="size-4" aria-hidden />
            {exitLabel}
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-[var(--surface)] shadow-[var(--shadow-float)]">
            <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
              <Logo />
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)}>
                <X aria-hidden />
              </Button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/85 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu aria-hidden />
          </Button>
          <p className="text-sm font-medium lg:hidden">{contextLabel}</p>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main id="main" className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
