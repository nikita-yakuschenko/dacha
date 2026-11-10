import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

// Открытый обход и основное зеркало для Яндекса.
export default function robots(): MetadataRoute.Robots {
  const tracking = "utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&ysclid";
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Yandex", allow: "/", other: { "Clean-param": tracking } },
    ],
    host: siteConfig.siteUrl,
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
