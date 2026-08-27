"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Download, Menu, X } from "lucide-react";
import { primaryNav } from "@/data/navigation";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "./theme";
import { Logo } from "./logo";

export type ProductMenu = Array<{
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  products: Array<{ slug: string; name: string; icon: string; tagline: string }>;
}>;

export function HeaderClient({ menu }: { menu: ProductMenu }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dismiss both menus when the route changes. Adjusting state during render is
  // React's recommended alternative to an effect that only mirrors a prop.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
    if (openMenu) setOpenMenu(null);
  }

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled || openMenu
          ? "glass border-[var(--border)] shadow-[var(--shadow-soft)]"
          : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--primary-foreground)]"
      >
        Skip to content
      </a>

      <div className="container-page flex h-16 items-center gap-3 md:h-18">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Alon Software home">
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
          {primaryNav.map((group) => {
            const isMega = group.label === "Products";
            const hasPanel = isMega || group.links.length > 0;
            const isActive = group.href ? pathname.startsWith(group.href) : false;

            if (!hasPanel && group.href) {
              return (
                <Link
                  key={group.label}
                  href={group.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                  )}
                >
                  {group.label}
                </Link>
              );
            }

            return (
              <div key={group.label} onMouseEnter={() => open(group.label)} onMouseLeave={scheduleClose}>
                <button
                  type="button"
                  aria-expanded={openMenu === group.label}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(openMenu === group.label ? null : group.label)}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    openMenu === group.label || isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                  )}
                >
                  {group.label}
                  <ChevronDown
                    className={cn("size-3.5 transition-transform", openMenu === group.label && "rotate-180")}
                    aria-hidden
                  />
                </button>

                {openMenu === group.label ? (
                  <div
                    className="absolute inset-x-0 top-full"
                    onMouseEnter={() => open(group.label)}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="container-page pb-6 pt-2">
                      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-float)]">
                        {isMega ? <MegaMenu menu={menu} /> : <SimpleMenu links={group.links} />}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className="hidden sm:inline-flex" />
          <ButtonLink href="/portal" variant="ghost" size="sm" className="hidden md:inline-flex">
            Sign in
          </ButtonLink>
          <ButtonLink href="/download" size="sm" className="hidden sm:inline-flex">
            <Download aria-hidden />
            Free download
          </ButtonLink>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </div>

      {mobileOpen ? <MobileMenu menu={menu} /> : null}
    </header>
  );
}

function MegaMenu({ menu }: { menu: ProductMenu }) {
  return (
    <div className="grid gap-6 p-6 lg:grid-cols-[1fr_18rem]">
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
        {menu.map((category) => {
          const Icon = getIcon(category.icon);
          return (
            <div key={category.slug}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group mb-2 flex items-center gap-2 text-sm font-semibold"
              >
                <span className="grid size-7 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Icon className="size-4" aria-hidden />
                </span>
                {category.name}
                <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
              </Link>
              <ul className="space-y-0.5">
                {category.products.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="block rounded-lg px-2 py-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                    >
                      {product.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-xl bg-gradient-to-br from-[var(--primary-soft)] to-[var(--accent-soft)] p-5">
        <div>
          <p className="text-sm font-semibold">Try anything free for 30 days</p>
          <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
            Every product, every feature, no credit card. Your data stays yours if you decide not to subscribe.
          </p>
        </div>
        <ButtonLink href="/products" size="sm" className="w-fit">
          Browse all 31 products
          <ArrowRight aria-hidden />
        </ButtonLink>
      </div>
    </div>
  );
}

function SimpleMenu({ links }: { links: Array<{ label: string; href: string; description?: string; icon?: string }> }) {
  return (
    <ul className="grid gap-1 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => {
        const Icon = getIcon(link.icon);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-[var(--surface-muted)]"
            >
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                <Icon className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-medium">{link.label}</span>
                {link.description ? (
                  <span className="mt-0.5 block text-xs leading-relaxed text-[var(--muted-foreground)]">
                    {link.description}
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MobileMenu({ menu }: { menu: ProductMenu }) {
  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-[var(--border)] bg-[var(--background)] lg:hidden">
      <div className="container-page space-y-6 py-6">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <ButtonLink href="/portal" variant="secondary" size="sm">
            Sign in
          </ButtonLink>
        </div>

        <ButtonLink href="/download" size="lg" className="w-full">
          <Download aria-hidden />
          Free download
        </ButtonLink>

        <details open className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold">Products</summary>
          <div className="space-y-4 px-4 pb-4">
            {menu.map((category) => (
              <div key={category.slug}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  {category.name}
                </p>
                <ul>
                  {category.products.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}`} className="block py-1.5 text-sm">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="block py-1.5 text-sm font-medium text-[var(--primary)]"
                    >
                      All {category.name} products
                    </Link>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </details>

        {primaryNav
          .filter((g) => g.label !== "Products")
          .map((group) =>
            group.links.length ? (
              <details key={group.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold">{group.label}</summary>
                <ul className="px-4 pb-4">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="block py-1.5 text-sm text-[var(--muted-foreground)]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <Link
                key={group.label}
                href={group.href ?? "/"}
                className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold"
              >
                {group.label}
              </Link>
            ),
          )}
      </div>
    </div>
  );
}
