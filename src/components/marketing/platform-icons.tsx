import type { SVGProps } from "react";
import type { PlatformId } from "@/types";
import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement>;

const svgBase = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;

export function WindowsIcon(props: IconProps) {
  return (
    <svg {...svgBase} {...props}>
      <path d="M3 5.6 10.2 4.6v6.9H3V5.6Zm0 12.8 7.2 1v-6.8H3v5.8Zm8.1 1.1L21 21V12.6h-9.9v6.9Zm0-14.9v7h9.9V3l-9.9 1.6Z" />
    </svg>
  );
}

export function AppleIcon(props: IconProps) {
  return (
    <svg {...svgBase} {...props}>
      <path d="M16.36 12.72c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.98.9-3.77 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.35 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 3 .72 1.24-.02 2.02-1.12 2.78-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.4-3.69ZM14.1 5.98c.63-.77 1.06-1.83.94-2.9-.91.04-2.01.61-2.67 1.37-.59.68-1.1 1.77-.96 2.81 1.02.08 2.06-.51 2.69-1.28Z" />
    </svg>
  );
}

export function LinuxIcon(props: IconProps) {
  return (
    <svg {...svgBase} {...props}>
      <path d="M12 2c-2.2 0-3.4 1.6-3.4 4.1 0 1.6.2 2.5-.3 3.6-.6 1.4-2 2.8-2.7 4.7-.4 1-.3 1.9.1 2.4-.5.6-.7 1.4-.3 2 .4.7 1.4.9 2.5.9.9 0 1.6.3 2.4.7.8.4 1.6.7 2.5.6.9 0 1.6-.4 2.3-.8.7-.4 1.4-.6 2.2-.6 1 0 2-.2 2.4-.9.4-.7.1-1.5-.4-2.1.4-.5.4-1.4 0-2.4-.8-1.9-2.1-3.2-2.8-4.6-.5-1.1-.3-2-.3-3.5C16.2 3.6 14.9 2 12 2Zm-1.6 3.4c.4 0 .8.5.8 1.1s-.4 1.1-.8 1.1-.8-.5-.8-1.1.4-1.1.8-1.1Zm3.3 0c.5 0 .8.5.8 1.1s-.3 1.1-.8 1.1c-.4 0-.8-.5-.8-1.1s.4-1.1.8-1.1Zm-2.9 3.3c.5-.1 1.1.2 1.5.2.5 0 1-.3 1.4-.2.5.1.4.5-.2.9-.5.3-.8.6-1.3.6-.4 0-.9-.4-1.3-.7-.5-.3-.6-.7-.1-.8Z" />
    </svg>
  );
}

export function AndroidIcon(props: IconProps) {
  return (
    <svg {...svgBase} {...props}>
      <path d="M17.6 9.5H6.4a.6.6 0 0 0-.6.6v7.3c0 .6.5 1.1 1.1 1.1h.7v2.4a1.2 1.2 0 0 0 2.4 0v-2.4h4v2.4a1.2 1.2 0 0 0 2.4 0v-2.4h.7c.6 0 1.1-.5 1.1-1.1v-7.3a.6.6 0 0 0-.6-.6ZM4.2 9.4A1.2 1.2 0 0 0 3 10.6v4.9a1.2 1.2 0 0 0 2.4 0v-4.9a1.2 1.2 0 0 0-1.2-1.2Zm15.6 0a1.2 1.2 0 0 0-1.2 1.2v4.9a1.2 1.2 0 0 0 2.4 0v-4.9a1.2 1.2 0 0 0-1.2-1.2ZM15.3 4.1l.9-1.6a.3.3 0 0 0-.5-.3l-.9 1.6a5.9 5.9 0 0 0-4.6 0l-.9-1.6a.3.3 0 0 0-.5.3l.9 1.6A5 5 0 0 0 6.2 8.3h11.6a5 5 0 0 0-2.5-4.2ZM9.4 6.6a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm5.2 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Z" />
    </svg>
  );
}

export const PLATFORM_META: Record<PlatformId, { label: string; Icon: (p: IconProps) => React.JSX.Element }> = {
  windows: { label: "Windows", Icon: WindowsIcon },
  macos: { label: "macOS", Icon: AppleIcon },
  linux: { label: "Linux", Icon: LinuxIcon },
  android: { label: "Android", Icon: AndroidIcon },
  ios: { label: "iOS", Icon: AppleIcon },
};

export function PlatformIcons({
  platforms,
  className,
  size = 14,
}: {
  platforms: PlatformId[];
  className?: string;
  size?: number;
}) {
  // iOS and macOS share a glyph — collapse the duplicate.
  const seen = new Set<string>();
  const unique = platforms.filter((p) => {
    const key = PLATFORM_META[p].label === "iOS" ? "apple" : PLATFORM_META[p].label === "macOS" ? "apple" : p;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span className="sr-only">Available on {platforms.map((p) => PLATFORM_META[p].label).join(", ")}</span>
      {unique.map((platform) => {
        const { Icon, label } = PLATFORM_META[platform];
        return <Icon key={platform} width={size} height={size} aria-hidden data-platform={label} />;
      })}
    </span>
  );
}
