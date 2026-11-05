/**
 * Seed: sizes, stores, vehicles (+ vehicle_sizes).
 * Uso: npm run db:seed
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import medidasJson from "@/data/medidas.json";
import vehiclesJson from "@/data/vehicles.json";
import {
  gomerias,
  sizes,
  stores,
  vehicleSizes,
  vehicles,
} from "@/db/schema";

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
  {
    slug: "mercadolibre",
    nombre: "Mercado Libre",
    url: "https://www.mercadolibre.com.ar",
    logoUrl: "/logos/mercadolibre.svg",
    plataforma: "api" as const,
  },
] as const;

const GOMERIAS_SEED = [
  {
    nombre: "Gomería Demo Palermo",
    localidad: "CABA · Palermo",
    whatsapp: "5491112345678",
    plan: "basico" as const,
    activo: true,
    email: "demo-palermo@example.com",
  },
  {
    nombre: "Gomería Demo Caballito",
    localidad: "CABA · Caballito",
    whatsapp: "5491198765432",
    plan: "gratis" as const,
    activo: true,
    email: null,
  },
];

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

  const sizeIdBySlug = new Map(
    (await db.select({ id: sizes.id, slug: sizes.slug }).from(sizes)).map(
      (r) => [r.slug, r.id] as const
    )
  );

  for (const v of vehiclesJson.vehicles) {
    await db
      .insert(vehicles)
      .values({ slug: v.slug, marca: v.marca, modelo: v.modelo })
      .onConflictDoNothing({ target: vehicles.slug });

    const [row] = await db
      .select({ id: vehicles.id })
      .from(vehicles)
      .where(eq(vehicles.slug, v.slug))
      .limit(1);
    if (!row) continue;

    await db
      .delete(vehicleSizes)
      .where(eq(vehicleSizes.vehicleId, row.id));

    const vsRows = v.sizes
      .map((s) => {
        const sizeId = sizeIdBySlug.get(s.medidaSlug);
        if (!sizeId) {
          console.warn(`size faltante: ${s.medidaSlug} (${v.slug})`);
          return null;
        }
        return {
          vehicleId: row.id,
          version: s.version,
          anioDesde: s.anioDesde,
          anioHasta: s.anioHasta,
          sizeId,
          original: s.original,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x != null);

    if (vsRows.length) {
      await db.insert(vehicleSizes).values(vsRows);
    }
  }

  for (const g of GOMERIAS_SEED) {
    const existing = await db
      .select({ id: gomerias.id })
      .from(gomerias)
      .where(eq(gomerias.nombre, g.nombre))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(gomerias).values(g);
    }
  }

  const [{ sizesCount }] = await db
    .select({ sizesCount: sql<number>`count(*)::int` })
    .from(sizes);
  const [{ storesCount }] = await db
    .select({ storesCount: sql<number>`count(*)::int` })
    .from(stores);
  const [{ vehiclesCount }] = await db
    .select({ vehiclesCount: sql<number>`count(*)::int` })
    .from(vehicles);
  const [{ vehicleSizesCount }] = await db
    .select({ vehicleSizesCount: sql<number>`count(*)::int` })
    .from(vehicleSizes);
  const [{ gomeriasCount }] = await db
    .select({ gomeriasCount: sql<number>`count(*)::int` })
    .from(gomerias);

  console.log(`sizes: ${sizesCount}`);
  console.log(`stores: ${storesCount}`);
  console.log(`vehicles: ${vehiclesCount}`);
  console.log(`vehicle_sizes: ${vehicleSizesCount}`);
  console.log(`gomerias: ${gomeriasCount}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
