import type { MetadataRoute } from "next";
import {
  buildSitemapEntries,
  SITEMAP_CHUNK_SIZE,
} from "@/lib/sitemap-entries";

export async function generateSitemaps() {
  const entries = await buildSitemapEntries();
  const chunks = Math.max(1, Math.ceil(entries.length / SITEMAP_CHUNK_SIZE));
  return Array.from({ length: chunks }, (_, id) => ({ id }));
}

export default async function sitemap(props: {
  id: number | Promise<number>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const entries = await buildSitemapEntries();
  const start = id * SITEMAP_CHUNK_SIZE;
  return entries.slice(start, start + SITEMAP_CHUNK_SIZE);
}
