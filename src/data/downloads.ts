import type { Architecture, DownloadBuild, InstallerType, PlatformId } from "@/types";
import { products } from "./products";

export interface DownloadEntry {
  slug: string;
  name: string;
  category: string;
  icon: string;
  version: string;
  releaseDate: string;
  builds: DownloadBuild[];
  /** Highlights of the current release, shown beside the download button. */
  releaseHighlights: string[];
}

export const downloadIndex: DownloadEntry[] = products.map((product) => ({
  slug: product.slug,
  name: product.name,
  category: product.category,
  icon: product.icon,
  version: product.version,
  releaseDate: product.releaseDate,
  builds: product.builds,
  releaseHighlights: product.releases[0].highlights,
}));

export const PLATFORM_OPTIONS: Array<{ id: PlatformId; label: string; note: string }> = [
  { id: "windows", label: "Windows", note: "Windows 10 22H2 or later" },
  { id: "macos", label: "macOS", note: "macOS 13 Ventura or later" },
  { id: "linux", label: "Linux", note: "AppImage, .deb, .rpm" },
  { id: "android", label: "Android", note: "Android 10 or later" },
  { id: "ios", label: "iOS / iPadOS", note: "iOS 16 or later" },
];

export const ARCH_OPTIONS: Array<{ id: Architecture; label: string; note: string }> = [
  { id: "x64", label: "x64", note: "Intel and AMD 64-bit" },
  { id: "arm64", label: "ARM", note: "Apple Silicon, Snapdragon, Ampere" },
];

export const INSTALLER_OPTIONS: Array<{ id: InstallerType; label: string; note: string }> = [
  { id: "online", label: "Online installer", note: "Small download, fetches components during setup" },
  { id: "offline", label: "Offline installer", note: "Full package for machines without internet" },
];

export const installerFileName = (
  slug: string,
  version: string,
  platform: PlatformId,
  arch: Architecture,
  installer: InstallerType,
) => {
  const ext: Record<PlatformId, string> = {
    windows: "exe",
    macos: "dmg",
    linux: "AppImage",
    android: "apk",
    ios: "ipa",
  };
  const suffix = platform === "android" || platform === "ios" ? "" : `-${installer}`;
  return `${slug}-${version}-${platform}-${arch}${suffix}.${ext[platform]}`;
};

/** Aggregate release feed across the whole catalogue, newest first. */
export const releaseFeed = products
  .flatMap((product) =>
    product.releases.map((release) => ({
      product: product.name,
      slug: product.slug,
      icon: product.icon,
      ...release,
    })),
  )
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .slice(0, 24);
