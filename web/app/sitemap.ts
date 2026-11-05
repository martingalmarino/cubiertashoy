import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/sitemap-entries";

/** Un solo /sitemap.xml (~300 URLs). Reintroducir generateSitemaps si pasan ~4500. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries();
}
