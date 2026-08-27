"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CircleCheck,
  Download,
  FileText,
  HardDrive,
  Search,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import type { Architecture, InstallerType, PlatformId } from "@/types";
import {
  ARCH_OPTIONS,
  INSTALLER_OPTIONS,
  PLATFORM_OPTIONS,
  installerFileName,
  type DownloadEntry,
} from "@/data/downloads";
import { getIcon } from "@/lib/icons";
import { Badge, Card, Input, Select } from "@/components/ui/primitives";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { CopyField } from "@/components/ui/interactive";
import { PLATFORM_META } from "./platform-icons";
import { cn, formatDate } from "@/lib/utils";

/** Best-effort platform guess so the page opens on the right tab. */
function detectPlatform(): PlatformId {
  if (typeof navigator === "undefined") return "windows";
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Mac OS X|Macintosh/i.test(ua)) return "macos";
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return "linux";
  return "windows";
}

/** Detection never changes during a session, so there is nothing to subscribe to. */
const subscribeNoop = () => () => {};

function detectArch(): Architecture {
  if (typeof navigator === "undefined") return "x64";
  const ua = navigator.userAgent;
  if (/arm64|aarch64/i.test(ua)) return "arm64";
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "arm64";
  return "x64";
}

export function DownloadCenter({ entries }: { entries: DownloadEntry[] }) {
  const params = useSearchParams();
  const productParam = params.get("product");
  const osParam = params.get("os") as PlatformId | null;

  // Platform detection reads `navigator`, which does not exist during SSR.
  // useSyncExternalStore gives the server a stable snapshot and the client the
  // real one, without a setState-in-effect round trip.
  const detectedPlatform = React.useSyncExternalStore(subscribeNoop, detectPlatform, () => "windows" as PlatformId);
  const detectedArch = React.useSyncExternalStore(subscribeNoop, detectArch, () => "x64" as Architecture);

  const [platformChoice, setPlatform] = React.useState<PlatformId | null>(null);
  const [archChoice, setArch] = React.useState<Architecture | null>(null);
  const [installerChoice, setInstaller] = React.useState<InstallerType | null>(null);
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string>(productParam ?? entries[0].slug);

  const platform = platformChoice ?? osParam ?? detectedPlatform;
  const detected = !platformChoice && !osParam;

  const entry = entries.find((e) => e.slug === selected) ?? entries[0];
  const build = entry.builds.find((b) => b.platform === platform);

  // Architecture and installer are derived, not corrected after the fact: a
  // choice that the selected platform does not publish falls back to its first
  // available option, so the three selectors can never disagree.
  const preferredArch = archChoice ?? detectedArch;
  const arch: Architecture =
    build && build.architectures.includes(preferredArch) ? preferredArch : (build?.architectures[0] ?? "x64");
  const preferredInstaller = installerChoice ?? "online";
  const installer: InstallerType =
    build && build.installers.includes(preferredInstaller) ? preferredInstaller : (build?.installers[0] ?? "online");

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? entries.filter((e) => e.name.toLowerCase().includes(needle)) : entries;
  }, [entries, query]);

  const fileName = build ? installerFileName(entry.slug, entry.version, platform, arch, installer) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
      {/* ------------------------------------------------- Product picker */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="overflow-hidden">
          <div className="border-b border-[var(--border)] p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" aria-hidden />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a product"
                aria-label="Find a product to download"
                className="border-transparent bg-[var(--surface-muted)] pl-10"
              />
            </div>
          </div>
          <ul className="max-h-[28rem] overflow-y-auto p-2" role="listbox" aria-label="Products">
            {filtered.map((item) => {
              const ItemIcon = getIcon(item.icon);
              const active = item.slug === selected;
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => setSelected(item.slug)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      active ? "bg-[var(--primary-soft)] text-[var(--primary)]" : "hover:bg-[var(--surface-muted)]",
                    )}
                  >
                    <ItemIcon className="size-4 shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{item.name}</span>
                      <span className="block text-xs text-[var(--muted-foreground)]">v{item.version}</span>
                    </span>
                  </button>
                </li>
              );
            })}
            {!filtered.length ? (
              <li className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">No products match.</li>
            ) : null}
          </ul>
        </Card>
      </aside>

      {/* ---------------------------------------------------- Build chooser */}
      <div className="space-y-6">
        {detected ? (
          <p className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <CircleCheck className="size-4 text-[var(--success)]" aria-hidden />
            We detected <span className="font-medium text-[var(--foreground)]">{PLATFORM_META[platform].label}</span> on{" "}
            <span className="font-medium text-[var(--foreground)]">{arch}</span>. Change it below if that is wrong.
          </p>
        ) : null}

        <Card className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">{entry.name}</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Version {entry.version} · released {formatDate(entry.releaseDate)}
              </p>
            </div>
            <Badge tone="success">
              <ShieldCheck className="size-3.5" aria-hidden />
              30-day trial included
            </Badge>
          </div>

          {/* Step 1 — OS */}
          <Step number={1} label="Choose your operating system">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {PLATFORM_OPTIONS.map((option) => {
                const available = entry.builds.some((b) => b.platform === option.id);
                const { Icon } = PLATFORM_META[option.id];
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={!available}
                    onClick={() => setPlatform(option.id)}
                    aria-pressed={platform === option.id}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
                      platform === option.id
                        ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "border-[var(--border)] hover:border-[var(--border-strong)]",
                      !available && "cursor-not-allowed opacity-40",
                    )}
                  >
                    <Icon width={22} height={22} />
                    <span className="text-sm font-medium">{option.label}</span>
                    {!available ? <span className="text-[10px]">Not available</span> : null}
                  </button>
                );
              })}
            </div>
          </Step>

          {/* Step 2 — Architecture */}
          <Step number={2} label="Choose your architecture">
            <div className="grid gap-2 sm:grid-cols-2">
              {ARCH_OPTIONS.map((option) => {
                const available = build?.architectures.includes(option.id) ?? false;
                return (
                  <OptionRow
                    key={option.id}
                    active={arch === option.id}
                    disabled={!available}
                    onClick={() => setArch(option.id)}
                    title={option.label}
                    note={available ? option.note : "Not published for this platform"}
                  />
                );
              })}
            </div>
          </Step>

          {/* Step 3 — Installer type */}
          <Step number={3} label="Choose an installer">
            <div className="grid gap-2 sm:grid-cols-2">
              {INSTALLER_OPTIONS.map((option) => {
                const available = build?.installers.includes(option.id) ?? false;
                return (
                  <OptionRow
                    key={option.id}
                    active={installer === option.id}
                    disabled={!available}
                    onClick={() => setInstaller(option.id)}
                    title={option.label}
                    note={available ? option.note : "Mobile builds ship from the app store"}
                    meta={available && build ? build.size[option.id] : undefined}
                  />
                );
              })}
            </div>
          </Step>

          {/* Download summary */}
          {build && fileName ? (
            <div className="mt-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-muted)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <HardDrive className="size-4 text-[var(--primary)]" aria-hidden />
                    <span className="truncate font-mono text-xs sm:text-sm">{fileName}</span>
                  </p>
                  <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                    {build.size[installer]} · {PLATFORM_META[platform].label} {arch} · minimum {build.minOs}
                  </p>
                </div>
                {/* A real anchor, so the download works without JavaScript. The
                    endpoint records the event, issues a signed CDN URL and seeds
                    the trial licence before redirecting to the artefact. */}
                <a
                  href={`/api/downloads/${entry.slug}?platform=${platform}&arch=${arch}&installer=${installer}`}
                  className={buttonVariants({ size: "lg" })}
                >
                  <Download aria-hidden />
                  Download
                </a>
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  SHA-256 checksum
                </p>
                <CopyField value={build.checksum} label="SHA-256 checksum" />
                <p className="text-xs text-[var(--muted-foreground)]">
                  Verify before installing:{" "}
                  <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[11px]">
                    {platform === "windows" ? `certutil -hashfile ${fileName} SHA256` : `shasum -a 256 ${fileName}`}
                  </code>
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex items-start gap-3 rounded-[var(--radius-card)] border border-[var(--warning)]/40 bg-[var(--warning-soft)] p-5">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-[var(--warning)]" aria-hidden />
              <div>
                <p className="text-sm font-medium">{entry.name} is not published for {PLATFORM_META[platform].label}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Choose a different platform above, or{" "}
                  <Link href="/contact" className="font-medium text-[var(--primary)] hover:underline">
                    tell us you need it
                  </Link>{" "}
                  — platform requests inform the roadmap.
                </p>
              </div>
            </div>
          )}

          {/* Release highlights */}
          <div className="mt-8 border-t border-[var(--border)] pt-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="size-4 text-[var(--primary)]" aria-hidden />
                What is new in v{entry.version}
              </h3>
              <ButtonLink href={`/products/${entry.slug}#releases`} variant="link" size="sm">
                Full release notes
              </ButtonLink>
            </div>
            <ul className="mt-3 space-y-1.5">
              {entry.releaseHighlights.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-[var(--muted-foreground)]">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Bulk / silent install */}
        <Card className="p-6 md:p-8">
          <h3 className="text-lg font-semibold">Deploying to many machines?</h3>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Every desktop installer supports silent deployment with a pre-seeded licence key, so a branch rollout does
            not need someone clicking through setup on each till.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Windows (MSI / EXE)
              </p>
              <CopyField value={`msiexec /i ${entry.slug}.msi /qn LICENSE_KEY=XXXX-XXXX-XXXX ORG_ID=your-org`} />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                macOS / Linux
              </p>
              <CopyField value={`sudo ./${entry.slug}-installer --silent --license-key=XXXX-XXXX-XXXX`} />
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
            Group Policy, Intune and JAMF templates are in the{" "}
            <Link href="/docs/installation-windows" className="font-medium text-[var(--primary)] hover:underline">
              deployment guide
            </Link>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}

function Step({ number, label, children }: { number: number; label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <p className="mb-3 flex items-center gap-2.5 text-sm font-semibold">
        <span className="grid size-6 place-items-center rounded-full bg-[var(--primary)] text-xs text-[var(--primary-foreground)]">
          {number}
        </span>
        {label}
      </p>
      {children}
    </div>
  );
}

function OptionRow({
  active,
  disabled,
  onClick,
  title,
  note,
  meta,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  note: string;
  meta?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
        active ? "border-[var(--primary)] bg-[var(--primary-soft)]" : "border-[var(--border)] hover:border-[var(--border-strong)]",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-2",
          active ? "border-[var(--primary)]" : "border-[var(--border-strong)]",
        )}
      >
        {active ? <span className="size-2 rounded-full bg-[var(--primary)]" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm font-medium", active && "text-[var(--primary)]")}>{title}</span>
        <span className="mt-0.5 block text-xs text-[var(--muted-foreground)]">{note}</span>
      </span>
      {meta ? <span className="shrink-0 text-xs font-medium text-[var(--muted-foreground)]">{meta}</span> : null}
    </button>
  );
}

/** Small platform switcher used in the page header. */
export function PlatformSummary() {
  return (
    <Select aria-label="Platform" className="w-48">
      {PLATFORM_OPTIONS.map((p) => (
        <option key={p.id} value={p.id}>
          {p.label}
        </option>
      ))}
    </Select>
  );
}
