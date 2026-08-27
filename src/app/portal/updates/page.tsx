import Link from "next/link";
import { CircleCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { demoLicenses } from "@/data/demo-account";
import { downloadIndex } from "@/data/downloads";
import { getIcon } from "@/lib/icons";
import { Badge, Card } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { formatDate } from "@/lib/utils";

export default function PortalUpdatesPage() {
  const entitled = downloadIndex.filter((entry) => demoLicenses.some((l) => l.productSlug === entry.slug));
  // The three most recent releases are treated as pending on this account.
  const pending = entitled.slice(0, 3);
  const current = entitled.slice(3);

  return (
    <>
      <PageTitle
        title="Updates"
        description="Delta updates download in the background and apply on next launch. Enterprise plans can pin a version and roll out per branch."
        action={
          <Button variant="secondary" size="sm">
            <RefreshCw aria-hidden />
            Check for updates
          </Button>
        }
      />

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          Available updates
          <Badge tone="primary">{pending.length}</Badge>
        </h2>
        <div className="space-y-4">
          {pending.map((entry) => {
            const Icon = getIcon(entry.icon);
            return (
              <Card key={entry.slug} className="p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{entry.name}</h3>
                    <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                      v{entry.version} · released {formatDate(entry.releaseDate)}
                    </p>
                  </div>
                  <ButtonLink href={`/download?product=${entry.slug}`} size="sm">
                    Update now
                  </ButtonLink>
                </div>
                <ul className="mt-4 space-y-1.5 border-t border-[var(--border)] pt-4">
                  {entry.releaseHighlights.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-[var(--muted-foreground)]">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                  <Link href={`/products/${entry.slug}#releases`} className="font-medium text-[var(--primary)] hover:underline">
                    Full release notes
                  </Link>
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {current.length ? (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Up to date</h2>
          <Card className="divide-y divide-[var(--border)]">
            {current.map((entry) => {
              const Icon = getIcon(entry.icon);
              return (
                <div key={entry.slug} className="flex items-center gap-4 p-4">
                  <Icon className="size-5 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{entry.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">v{entry.version}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-[var(--viz-good)]">
                    <CircleCheck className="size-4" aria-hidden />
                    Current
                  </span>
                </div>
              );
            })}
          </Card>
        </section>
      ) : null}

      <Card className="mt-8 p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="size-4 text-[var(--viz-good)]" aria-hidden />
          Update channel
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          Your organisation is on the <span className="font-medium text-[var(--foreground)]">stable</span> channel:
          releases arrive on the six-week train, and security fixes ship the day they are ready regardless of the train.
          Every update is SHA-256 verified by the in-app updater before it is applied.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" size="sm">
            Change channel
          </Button>
          <ButtonLink href="/docs/installation-windows" variant="ghost" size="sm">
            Deployment guide
          </ButtonLink>
        </div>
      </Card>
    </>
  );
}
