import Link from "next/link";
import { ArrowRight, Download, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const SUGGESTIONS = [
  { label: "Browse all products", href: "/products" },
  { label: "Download center", href: "/download" },
  { label: "Documentation", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
  { label: "Support", href: "/support" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 items-center py-24">
        <div className="container-page text-center">
          <p className="text-[7rem] font-semibold leading-none tracking-tighter text-gradient md:text-[10rem]">404</p>
          <h1 className="mt-4 text-2xl font-semibold md:text-3xl">We could not find that page</h1>
          <p className="mx-auto mt-4 max-w-md text-[var(--muted-foreground)]">
            The link may be out of date, or the page may have moved. Here are the places people usually want.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg">
              Back to home
              <ArrowRight aria-hidden />
            </ButtonLink>
            <ButtonLink href="/download" variant="secondary" size="lg">
              <Download aria-hidden />
              Download center
            </ButtonLink>
          </div>

          <nav aria-label="Suggested pages" className="mt-10 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--foreground)]"
              >
                <Search className="size-3.5" aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
