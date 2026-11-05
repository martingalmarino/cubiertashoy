import type { MetadataRoute } from "next";
import { getMedidas } from "@/lib/data";
import { getSiteUrl } from "@/lib/site";

const LAST_MOD = "2026-11-04";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const medidas = getMedidas();

  return [
    {
      url: base,
      lastModified: LAST_MOD,
      changeFrequency: "daily",
      priority: 1,
    },
    ...medidas.map((m) => ({
      url: `${base}/medida/${m.slug}`,
      lastModified: LAST_MOD,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}
