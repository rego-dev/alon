import { ArrowRight, CircleCheck, Download, Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { HeroVisual } from "./hero-visual";

const PROOF = ["No credit card required", "30-day full-feature trial", "Cancel or walk away anytime"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-backdrop opacity-70" />
        <div className="absolute -top-40 left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-[var(--primary)] opacity-[0.13] blur-[120px]" />
        <div className="absolute -right-32 top-40 size-[30rem] rounded-full bg-[var(--accent)] opacity-[0.12] blur-[110px]" />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div>
            <Badge tone="primary" className="mb-6 py-1.5 pl-1.5 pr-3.5">
              <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary-foreground)]">
                New
              </span>
              31 products across 6 industries
            </Badge>

            <h1 className="text-4xl font-semibold leading-[1.06] sm:text-5xl lg:text-[3.7rem]">
              Business software that{" "}
              <span className="text-gradient">grows with your company</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)]">
              Download professional business software for free. Try every product for 30 days before subscribing — full
              features, every platform, and your data stays yours either way.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/download" size="lg">
                <Download aria-hidden />
                Download now
              </ButtonLink>
              <ButtonLink href="/products" variant="secondary" size="lg">
                View products
                <ArrowRight aria-hidden />
              </ButtonLink>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
              {PROOF.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                  <CircleCheck className="size-4 text-[var(--success)]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#demo"
              className="mt-8 inline-flex items-center gap-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
            >
              <span className="grid size-10 place-items-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--shadow-soft)]">
                <Play className="size-3.5 fill-current" aria-hidden />
              </span>
              Watch the 2-minute product tour
            </a>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
