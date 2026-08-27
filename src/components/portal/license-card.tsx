import Link from "next/link";
import { ArrowRight, Download, Monitor, TriangleAlert } from "lucide-react";
import type { DemoLicense } from "@/data/demo-account";
import type { LicenseState } from "@/lib/licensing/state-machine";
import { Icon as RegistryIcon } from "@/components/ui/icon";
import { Badge, Card } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { CopyField } from "@/components/ui/interactive";
import { formatCurrency } from "@/lib/utils";

const STATE_META: Record<
  LicenseState,
  { label: string; tone: "success" | "primary" | "warning" | "danger" | "neutral"; description: (l: DemoLicense) => string }
> = {
  active: {
    label: "Active",
    tone: "success",
    description: (l) => `Renews in ${l.daysRemaining} days`,
  },
  trial: {
    label: "Trial",
    tone: "primary",
    description: (l) => `${l.daysRemaining} days left · all features unlocked`,
  },
  grace: {
    label: "Grace period",
    tone: "warning",
    description: (l) => `Read-only · ${l.daysRemaining} days before access locks`,
  },
  expired: {
    label: "Expired",
    tone: "danger",
    description: (l) => `Locked · data retained for ${l.daysRemaining} more days`,
  },
  purged: { label: "Data erased", tone: "danger", description: () => "Reactivates with a clean database" },
  suspended: { label: "Suspended", tone: "neutral", description: () => "Contact support to restore access" },
};

const PROGRESS_TONE: Record<string, string> = {
  success: "bg-[var(--viz-good)]",
  primary: "bg-[var(--primary)]",
  warning: "bg-[var(--viz-warning)]",
  danger: "bg-[var(--viz-critical)]",
  neutral: "bg-[var(--border-strong)]",
};

export function LicenseCard({ license }: { license: DemoLicense }) {
  const meta = STATE_META[license.state];
  const totalDays = license.state === "trial" ? 30 : license.state === "grace" ? 14 : license.state === "expired" ? 30 : 365;
  const progress = Math.min(100, Math.max(4, (license.daysRemaining / totalDays) * 100));
  const needsAction = license.state === "grace" || license.state === "expired";

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
          <RegistryIcon name={license.icon} className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">
            <Link href={`/products/${license.productSlug}`} className="hover:text-[var(--primary)]">
              {license.productName}
            </Link>
          </h3>
          <p className="text-xs text-[var(--muted-foreground)]">
            {license.plan ? `${license.plan[0].toUpperCase()}${license.plan.slice(1)} · ${license.cycle}` : "No subscription"}
          </p>
        </div>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-[var(--muted-foreground)]">{meta.description(license)}</span>
          <span className="font-medium tabular-nums">{license.daysRemaining}d</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div className={`h-full rounded-full ${PROGRESS_TONE[meta.tone]}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {needsAction ? (
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-[var(--warning-soft)] p-3 text-xs text-[var(--foreground)]">
          <TriangleAlert className="mt-px size-3.5 shrink-0 text-[var(--viz-warning)]" aria-hidden />
          {license.state === "grace"
            ? "Export is still enabled. Subscribe now and everything is restored instantly, with no reinstall."
            : "Your data is still on the device. Subscribe before the retention window ends and nothing is lost."}
        </p>
      ) : null}

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4 text-xs">
        <div>
          <dt className="text-[var(--muted-foreground)]">Devices</dt>
          <dd className="mt-0.5 flex items-center gap-1.5 font-medium">
            <Monitor className="size-3.5" aria-hidden />
            {license.devicesUsed} / {license.deviceLimit}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--muted-foreground)]">Users</dt>
          <dd className="mt-0.5 font-medium">
            {license.seatsUsed} / {license.seats}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="mb-1 text-[var(--muted-foreground)]">Licence key</dt>
          <dd>
            <CopyField value={license.key} label="licence key" />
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-2">
        {needsAction || license.state === "trial" ? (
          <ButtonLink href="/pricing" size="sm" className="flex-1">
            Subscribe
            <ArrowRight aria-hidden />
          </ButtonLink>
        ) : (
          <ButtonLink href="/portal/billing" variant="secondary" size="sm" className="flex-1">
            Manage
          </ButtonLink>
        )}
        <ButtonLink
          href={`/download?product=${license.productSlug}`}
          variant="ghost"
          size="sm"
          aria-label={`Download ${license.productName}`}
        >
          <Download aria-hidden />
        </ButtonLink>
      </div>

      {license.amount > 0 ? (
        <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
          {formatCurrency(license.amount)} per year
        </p>
      ) : null}
    </Card>
  );
}
