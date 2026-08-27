import { CircleAlert, FingerprintPattern, Monitor, RefreshCw } from "lucide-react";
import { demoDevices, demoLicenses } from "@/data/demo-account";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { Button, ButtonLink } from "@/components/ui/button";
import { PageTitle } from "@/components/layout/app-shell";
import { PLATFORM_META } from "@/components/marketing/platform-icons";
import { StatTile } from "@/components/charts/stat-tile";
import { formatDate } from "@/lib/utils";

export default function PortalDevicesPage() {
  const activeCount = demoDevices.filter((d) => d.status === "active").length;
  const totalSlots = demoLicenses.reduce((sum, l) => sum + l.deviceLimit, 0);

  return (
    <>
      <PageTitle
        title="Devices"
        description="Every device your licences are activated on. Release a slot before installing on replacement hardware."
        action={
          <ButtonLink href="/docs/device-activation-and-transfers" variant="secondary" size="sm">
            How transfers work
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Devices online" value={String(activeCount)} icon={Monitor} />
        <StatTile label="Activation slots used" value={`${demoDevices.length} / ${totalSlots}`} icon={FingerprintPattern} />
        <StatTile label="Transfers remaining" value="Unlimited" icon={RefreshCw} />
      </div>

      <DataTable className="mt-8">
        <table className="w-full min-w-[52rem]">
          <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
            <tr>
              <Th>Device</Th>
              <Th>Platform</Th>
              <Th>Product</Th>
              <Th>Location</Th>
              <Th>Last seen</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {demoDevices.map((device) => {
              const { Icon, label } = PLATFORM_META[device.platform];
              return (
                <tr key={device.id} className="transition-colors hover:bg-[var(--surface-muted)]">
                  <Td>
                    <span className="block font-medium">{device.hostname}</span>
                    <span className="block font-mono text-[11px] text-[var(--muted-foreground)]">
                      fp {device.fingerprint.slice(0, 12)}…
                    </span>
                  </Td>
                  <Td>
                    <span className="flex items-center gap-2">
                      <Icon width={15} height={15} aria-hidden />
                      <span className="text-[var(--muted-foreground)]">{device.osVersion}</span>
                      <span className="sr-only">{label}</span>
                    </span>
                  </Td>
                  <Td className="text-[var(--muted-foreground)]">{device.productName}</Td>
                  <Td className="text-[var(--muted-foreground)]">{device.location}</Td>
                  <Td className="text-[var(--muted-foreground)]">{formatDate(device.lastSeen)}</Td>
                  <Td>
                    <Badge tone={device.status === "active" ? "success" : "neutral"}>{device.status}</Badge>
                  </Td>
                  <Td className="text-right">
                    <Button variant="ghost" size="sm">
                      Release
                    </Button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DataTable>

      <Card className="mt-8 p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <CircleAlert className="size-4 text-[var(--primary)]" aria-hidden />
          Device unavailable?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          If a machine was lost, stolen or decommissioned before you released it, use a force release. It requires
          account verification, is recorded in the audit log, and frees the slot immediately. Releasing a device never
          touches the business data stored on it.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" size="sm">
            Force release a device
          </Button>
          <ButtonLink href="/portal/support" variant="ghost" size="sm">
            Contact support
          </ButtonLink>
        </div>
      </Card>
    </>
  );
}
