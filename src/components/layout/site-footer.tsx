import Link from "next/link";
import { ArrowRight, Globe, Mail, MapPin, Phone } from "lucide-react";
import { footerNav, legalNav } from "@/data/navigation";
import { socialLinks } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/primitives";
import { Logo } from "./logo";
import { company } from "@/data/company";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-muted)]">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2.5fr]">
          <div className="space-y-6">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
              Business software for retail, finance, people, healthcare, operations and education. Download free, try
              everything for 30 days, subscribe only if it earns its place.
            </p>

            <form className="max-w-sm space-y-2.5">
              <label htmlFor="footer-email" className="text-sm font-medium">
                Release notes in your inbox
              </label>
              <div className="flex gap-2">
                <Input
                  id="footer-email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
                <Button type="submit" size="md" aria-label="Subscribe to release notes">
                  <ArrowRight aria-hidden />
                </Button>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                Monthly. Product updates and security advisories only.
              </p>
            </form>

            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" aria-hidden />
                {company.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden />
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-[var(--foreground)]">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden />
                <a href={`mailto:${company.email}`} className="hover:text-[var(--foreground)]">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.label}>
                <h3 className="mb-4 text-sm font-semibold">{group.label}</h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="container-page flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            © {company.foundedYear}–2026 {company.legalName}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="mr-2 hidden items-center gap-1.5 text-sm text-[var(--muted-foreground)] sm:flex">
              <Globe className="size-4" aria-hidden />
              English
            </span>
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                rel="noreferrer noopener"
                target="_blank"
                className="grid size-9 place-items-center rounded-full text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--primary)]"
              >
                <Icon width={16} height={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
