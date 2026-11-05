import type { MetadataRoute } from "next";
import {
  getIndexableMarcaSlugs,
  getIndexableMedidaMarcaPairs,
  getIndexableRodados,
  getLastSnapshotAt,
  getLastSnapshotByMedida,
  getMedidas,
  getOfertasConCuotas,
  getVehicles,
  MIN_INDEXABLE_OFFERS,
} from "@/lib/data";
import { getSiteUrl } from "@/lib/site";

/** Google recomienda ≤50k; partimos antes para margen. */
export const SITEMAP_CHUNK_SIZE = 4500;

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const medidas = getMedidas();
  const vehicles = getVehicles();
  const [marcaSlugs, medidaMarca, rodados, cuotas, lastGlobal, lastByMedida] =
    await Promise.all([
      getIndexableMarcaSlugs(),
      getIndexableMedidaMarcaPairs(),
      getIndexableRodados(),
      getOfertasConCuotas(),
      getLastSnapshotAt(),
      getLastSnapshotByMedida(),
    ]);

  const fallback = lastGlobal ?? new Date();

  const lastFor = (slug: string) => lastByMedida.get(slug) ?? fallback;

  const entries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: fallback,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/medidas`,
      lastModified: fallback,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${base}/auto`,
      lastModified: fallback,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/para-gomerias`,
      lastModified: fallback,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${base}/como-ganamos-plata`,
      lastModified: fallback,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...medidas.map((m) => ({
      url: `${base}/medida/${m.slug}`,
      lastModified: lastFor(m.slug),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    ...vehicles.map((v) => ({
      url: `${base}/auto/${v.slug}`,
      lastModified: fallback,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...marcaSlugs.map((slug) => ({
      url: `${base}/marca/${slug}`,
      lastModified: fallback,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...medidaMarca.map(({ slug, marca }) => ({
      url: `${base}/medida/${slug}/${marca}`,
      lastModified: lastFor(slug),
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
    ...rodados.map((n) => ({
      url: `${base}/rodado/${n}`,
      lastModified: fallback,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  if (cuotas.length >= MIN_INDEXABLE_OFFERS) {
    entries.push({
      url: `${base}/cuotas`,
      lastModified: fallback,
      changeFrequency: "daily",
      priority: 0.7,
    });
  }

  return entries;
}
