/**
 * Seed: sizes desde data/medidas.json + 4 tiendas.
 * Uso: npm run db:seed
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import medidasJson from "@/data/medidas.json";
import { sizes, stores } from "@/db/schema";

config({ path: ".env.local" });

const STORES = [
  {
    slug: "norauto",
    nombre: "Norauto",
    url: "https://www.norauto.com.ar",
    logoUrl: "/logos/norauto.svg",
    plataforma: "html" as const,
  },
  {
    slug: "neumaflores",
    nombre: "Neumaflores",
    url: "https://www.neumaflores.com.ar",
    logoUrl: "/logos/neumaflores.svg",
    plataforma: "woocommerce" as const,
  },
  {
    slug: "naldo",
    nombre: "Naldo",
    url: "https://www.naldo.com.ar",
    logoUrl: "/logos/naldo.svg",
    plataforma: "vtex" as const,
  },
  {
    slug: "360-neumaticos",
    nombre: "360 Neumáticos",
    url: "https://www.360neumaticos.com.ar",
    logoUrl: "/logos/360-neumaticos.svg",
    plataforma: "html" as const,
  },
] as const;

async function main() {
  const url =
    process.env.DATABASE_URL ??
    process.env.DATABASE_POSTGRES_URL ??
    process.env.DATABASE_URL_UNPOOLED;
  if (!url) throw new Error("DATABASE_URL no definida");

  const db = drizzle(neon(url));

  const sizeRows = medidasJson.medidas.map((m) => ({
    slug: m.slug,
    ancho: m.ancho,
    perfil: m.perfil,
    rodado: m.rodado,
    label: m.label,
  }));

  await db
    .insert(sizes)
    .values(sizeRows)
    .onConflictDoNothing({ target: sizes.slug });

  await db
    .insert(stores)
    .values([...STORES])
    .onConflictDoNothing({ target: stores.slug });

  const [{ sizesCount }] = await db
    .select({ sizesCount: sql<number>`count(*)::int` })
    .from(sizes);
  const [{ storesCount }] = await db
    .select({ storesCount: sql<number>`count(*)::int` })
    .from(stores);

  console.log(`sizes: ${sizesCount} (seed ${sizeRows.length})`);
  console.log(`stores: ${storesCount} (seed ${STORES.length})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
