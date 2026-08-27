import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";
import { demoLicenses } from "@/data/demo-account";
import { downloadIndex } from "@/data/downloads";
import { getIcon } from "@/lib/icons";
import { Badge, Card, DataTable, Td, Th } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { CopyField } from "@/components/ui/interactive";
import { PageTitle } from "@/components/layout/app-shell";
import { PLATFORM_META } from "@/components/marketing/platform-icons";
import { formatDate } from "@/lib/utils";

export default function PortalDownloadsPage() {
  const entitled = downloadIndex.filter((entry) => demoLicenses.some((l) => l.productSlug === entry.slug));

  return (
    <>
      <PageTitle
        title="Downloads"
        description="Installers for every product your organisation is licensed for, with published checksums."
        action={
          <ButtonLink href="/download" variant="secondary" size="sm">
            Full download center
          </ButtonLink>
        }
      />

      <div className="space-y-4">
        {entitled.map((entry) => {
          const Icon = getIcon(entry.icon);
          const license = demoLicenses.find((l) => l.productSlug === entry.slug)!;
          return (
            <Card key={entry.slug} className="p-5">
              <div className="flex flex-wrap items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">
                    <Link href={`/products/${entry.slug}`} className="hover:text-[var(--primary)]">
                      {entry.name}
                    </Link>
                  </h2>
                  <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                    v{entry.version} · released {formatDate(entry.releaseDate)}
                  </p>
                </div>
                <Badge tone={license.state === "active" ? "success" : license.state === "trial" ? "primary" : "warning"}>
                  {license.state}
                </Badge>
                <ButtonLink href={`/download?product=${entry.slug}`} size="sm">
                  <Download aria-hidden />
                  Download
                </ButtonLink>
              </div>

              <DataTable className="mt-4 border-0">
                <table className="w-full min-w-[40rem]">
                  <thead className="border-b border-[var(--border)]">
                    <tr>
                      <Th>Platform</Th>
                      <Th>Architectures</Th>
                      <Th>Online</Th>
                      <Th>Offline</Th>
                      <Th>SHA-256</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {entry.builds.map((build) => (
                      <tr key={build.platform}>
                        <Td className="font-medium">{PLATFORM_META[build.platform].label}</Td>
                        <Td className="text-[var(--muted-foreground)]">{build.architectures.join(", ")}</Td>
                        <Td className="text-[var(--muted-foreground)]">{build.size.online}</Td>
                        <Td className="text-[var(--muted-foreground)]">
                          {build.installers.includes("offline") ? build.size.offline : "—"}
                        </Td>
                        <Td className="w-72">
                          <CopyField value={build.checksum} label="SHA-256 checksum" />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DataTable>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="size-4 text-[var(--viz-good)]" aria-hidden />
          Verify before you install
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)]">
          Every artefact is built by CI from a tagged commit, signed, and published with its SHA-256 digest. Comparing
          the digest takes ten seconds and rules out a corrupted or tampered download.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <CopyField value="certutil -hashfile <file> SHA256" label="Windows command" />
          <CopyField value="shasum -a 256 <file>" label="macOS and Linux command" />
        </div>
      </Card>
    </>
  );
}
