import type { MetadataRoute } from "next";
import { company } from "@/data/company";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${company.name} — Business Software`,
    short_name: company.name,
    description:
      "Download professional business software with a free 30-day trial. Retail POS, accounting, HR, healthcare, operations and education.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5b4bd6",
    categories: ["business", "productivity", "finance"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
