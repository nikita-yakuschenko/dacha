import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

// Проекты открываются окном на главной, отдельных адресов у них нет.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.siteUrl}/contacts`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
