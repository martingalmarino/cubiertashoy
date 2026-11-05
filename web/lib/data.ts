import { unstable_cache } from "next/cache";
import { neon } from "@neondatabase/serverless";
import medidasJson from "@/data/medidas.json";
import ofertasJson from "@/data/ofertas-ejemplo.json";
import vehiclesJson from "@/data/vehicles.json";
import { percentile } from "@/lib/stats";
import type {
  AutoMedida,
  DiscountKind,
  HistorialPunto,
  Medida,
  Oferta,
  OfertaEnriquecida,
  Vehicle,
  VehicleSizeOption,
} from "@/lib/types";

const medidas = medidasJson.medidas as Medida[];
const ofertasEjemplo = ofertasJson.ofertas as Oferta[];
const historialEjemplo = ofertasJson.historial as HistorialPunto[];
const vehiclesList = vehiclesJson.vehicles as Vehicle[];

/** ISR / cache de datos de precios: 12 h. */
export const DATA_REVALIDATE_SECONDS = 43_200;

const SNAPSHOT_MAX_AGE_HOURS = 36;
const DISCOUNT_MIN_HISTORY_DAYS = 14;

function databaseUrl(): string | null {
  return (
    process.env.DATABASE_URL ??
    process.env.DATABASE_POSTGRES_URL ??
    process.env.DATABASE_URL_UNPOOLED ??
    null
  );
}

function hoursSince(date: Date): number {
  return Math.max(0, Math.round((Date.now() - date.getTime()) / 3_600_000));
}

function indiceLabel(
  carga: string | null | undefined,
  vel: string | null | undefined
): string {
  if (carga && vel) return `${carga}${vel}`;
  if (carga) return carga;
  if (vel) return vel;
  return "—";
}

type DbOfferRow = {
  product_id: number;
  external_id: string;
  url: string;
  affiliate_url: string | null;
  marca: string;
  modelo: string;
  indice_carga: string | null;
  indice_velocidad: string | null;
  store_slug: string;
  store_nombre: string;
  size_slug: string;
  captured_at: string | Date;
  precio_unitario_efectivo: number;
  precio_unitario_tarjeta: number;
  precio_lista: number | null;
  cuotas_sin_interes: number | null;
  colocacion_incluida: boolean | null;
};

type DbHistRow = {
  size_slug: string;
  dia: string | Date;
  mediana: number;
  min: number;
  max: number;
};

function rowToOferta(row: DbOfferRow): Oferta {
  const captured =
    row.captured_at instanceof Date
      ? row.captured_at
      : new Date(row.captured_at);
  const lista = row.precio_lista ?? undefined;
  const precioAnterior =
    lista != null && lista > row.precio_unitario_efectivo ? lista : undefined;
  const cuotas = row.cuotas_sin_interes ?? 0;

  return {
    id: `${row.store_slug}-${row.external_id}`,
    medidaSlug: row.size_slug,
    tiendaId: row.store_slug,
    tiendaNombre: row.store_nombre,
    marca: row.marca,
    modelo: row.modelo,
    indice: indiceLabel(row.indice_carga, row.indice_velocidad),
    precioEfectivo: row.precio_unitario_efectivo,
    precioTarjeta: row.precio_unitario_tarjeta,
    precioAnterior,
    cuotas,
    cuotasSinInteres: cuotas > 0,
    colocacionGratis: Boolean(row.colocacion_incluida),
    url: row.url,
    affiliateUrl: row.affiliate_url ?? undefined,
    actualizadoHaceHoras: hoursSince(captured),
    ejemplo: false,
  };
}

async function fetchOfertasFromDb(slug: string): Promise<Oferta[] | null> {
  const url = databaseUrl();
  if (!url) return null;

  try {
    const sql = neon(url);
    const rows = (await sql`
      SELECT DISTINCT ON (p.id)
        p.id AS product_id,
        p.external_id,
        p.url,
        p.affiliate_url,
        p.marca,
        p.modelo,
        p.indice_carga,
        p.indice_velocidad,
        s.slug AS store_slug,
        s.nombre AS store_nombre,
        sz.slug AS size_slug,
        ps.captured_at,
        ps.precio_unitario_efectivo,
        ps.precio_unitario_tarjeta,
        ps.precio_lista,
        ps.cuotas_sin_interes,
        ps.colocacion_incluida
      FROM price_snapshots ps
      JOIN products p ON p.id = ps.product_id
      JOIN stores s ON s.id = p.store_id
      JOIN sizes sz ON sz.id = p.size_id
      WHERE p.activo = TRUE
        AND sz.slug = ${slug}
        AND ps.captured_at > NOW() - (${SNAPSHOT_MAX_AGE_HOURS} * INTERVAL '1 hour')
      ORDER BY p.id, ps.captured_at DESC
    `) as DbOfferRow[];

    if (!rows.length) return [];
    return rows.map(rowToOferta);
  } catch (err) {
    console.error("[data] fetchOfertasFromDb falló, uso JSON", err);
    return null;
  }
}

async function fetchHistorialFromDb(
  slug: string
): Promise<HistorialPunto[] | null> {
  const url = databaseUrl();
  if (!url) return null;

  try {
    const sql = neon(url);
    const rows = (await sql`
      SELECT
        sz.slug AS size_slug,
        sds.dia,
        sds.mediana,
        sds.min,
        sds.max
      FROM size_daily_stats sds
      JOIN sizes sz ON sz.id = sds.size_id
      WHERE sz.slug = ${slug}
      ORDER BY sds.dia ASC
    `) as DbHistRow[];

    return rows.map((r) => {
      const dia =
        r.dia instanceof Date
          ? r.dia.toISOString().slice(0, 10)
          : String(r.dia).slice(0, 10);
      return {
        medidaSlug: r.size_slug,
        fecha: dia,
        mediana: Number(r.mediana),
        min: Number(r.min),
        max: Number(r.max),
        ejemplo: false as const,
      };
    });
  } catch (err) {
    console.error("[data] fetchHistorialFromDb falló, uso JSON", err);
    return null;
  }
}

function ofertasFromJson(slug: string): Oferta[] {
  return ofertasEjemplo.filter((o) => o.medidaSlug === slug);
}

function historialFromJson(slug: string): HistorialPunto[] {
  return historialEjemplo
    .filter((h) => h.medidaSlug === slug)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

const cachedOfertas = (slug: string) =>
  unstable_cache(
    async () => {
      const fromDb = await fetchOfertasFromDb(slug);
      if (fromDb != null) return fromDb;
      return ofertasFromJson(slug);
    },
    ["ofertas", slug],
    {
      revalidate: DATA_REVALIDATE_SECONDS,
      tags: ["ofertas", `medida:${slug}`],
    }
  )();

const cachedHistorial = (slug: string) =>
  unstable_cache(
    async () => {
      const fromDb = await fetchHistorialFromDb(slug);
      if (fromDb != null && fromDb.length > 0) return fromDb;
      if (fromDb != null && fromDb.length === 0) {
        // DB OK pero sin stats aún → no inventar ejemplo si hay ofertas reales
        const ofertas = await fetchOfertasFromDb(slug);
        if (ofertas != null && ofertas.length > 0) return [];
      }
      return historialFromJson(slug);
    },
    ["historial", slug],
    {
      revalidate: DATA_REVALIDATE_SECONDS,
      tags: ["historial", `medida:${slug}`],
    }
  )();

export function getMedidas(): Medida[] {
  return [...medidas].sort((a, b) => a.prioridad - b.prioridad);
}

export function getMedida(slug: string): Medida | undefined {
  return medidas.find((m) => m.slug === slug);
}

export async function getHistorial(slug: string): Promise<HistorialPunto[]> {
  return cachedHistorial(slug);
}

/**
 * Inflado si precio_anterior > p75 del historial de 90 días.
 * Sin badge si hay menos de 14 días de historial.
 */
export function classifyDiscount(
  precioAnterior: number | undefined,
  historial90: HistorialPunto[]
): DiscountKind {
  if (precioAnterior == null) return null;
  if (historial90.length < DISCOUNT_MIN_HISTORY_DAYS) return null;
  const p75 = percentile(
    historial90.map((h) => h.mediana),
    0.75
  );
  if (p75 == null) return null;
  return precioAnterior > p75 ? "inflado" : "real";
}

export async function getOfertas(slug: string): Promise<OfertaEnriquecida[]> {
  const [raw, hist] = await Promise.all([
    cachedOfertas(slug),
    cachedHistorial(slug),
  ]);
  const hist90 = hist.slice(-90);
  return raw
    .map((o) => ({
      ...o,
      descuento: classifyDiscount(o.precioAnterior, hist90),
    }))
    .sort((a, b) => a.precioEfectivo - b.precioEfectivo);
}

export async function getPrecioDesde(slug: string): Promise<number | null> {
  const list = await getOfertas(slug);
  if (list.length === 0) return null;
  return list[0]!.precioEfectivo;
}

/** Variación semanal aproximada vs mediana de hace 7 días. */
export async function getVariacionSemanal(slug: string): Promise<number | null> {
  const hist = await getHistorial(slug);
  if (hist.length < 8) return null;
  const hoy = hist[hist.length - 1]!;
  const hace7 = hist[hist.length - 8]!;
  if (hace7.mediana === 0) return null;
  return ((hoy.mediana - hace7.mediana) / hace7.mediana) * 100;
}

export function getMedidasPopulares(limit = 6): Medida[] {
  return getMedidas().slice(0, limit);
}

export type MedidaCardData = Medida & {
  precioDesde: number | null;
  variacionSemanal: number | null;
};

export async function getMedidasMasBuscadas(
  limit = 8
): Promise<MedidaCardData[]> {
  const base = getMedidas().slice(0, limit);
  return Promise.all(
    base.map(async (m) => ({
      ...m,
      precioDesde: await getPrecioDesde(m.slug),
      variacionSemanal: await getVariacionSemanal(m.slug),
    }))
  );
}

export type MedidaResumen = {
  medianaHoy: number | null;
  minimo90d: number | null;
  tendencia30d: number | null;
  ofertasCount: number;
  tiendasCount: number;
  actualizadoHaceHoras: number | null;
};

export async function getMedidaResumen(slug: string): Promise<MedidaResumen> {
  const [of, hist] = await Promise.all([getOfertas(slug), getHistorial(slug)]);
  const hoy = hist[hist.length - 1] ?? null;
  const hist90 = hist.slice(-90);
  const hist30 = hist.slice(-30);
  const hace30 = hist30[0] ?? null;

  let tendencia30d: number | null = null;
  if (hoy && hace30 && hace30.mediana > 0) {
    tendencia30d = ((hoy.mediana - hace30.mediana) / hace30.mediana) * 100;
  }

  const minimo90d =
    hist90.length > 0 ? Math.min(...hist90.map((h) => h.min)) : null;

  const tiendas = new Set(of.map((o) => o.tiendaId));
  // max(captured_at) ≈ el snapshot más reciente → menor "hace X h"
  const actualizadoHaceHoras =
    of.length > 0
      ? Math.min(...of.map((o) => o.actualizadoHaceHoras))
      : null;

  return {
    medianaHoy: hoy?.mediana ?? null,
    minimo90d,
    tendencia30d,
    ofertasCount: of.length,
    tiendasCount: tiendas.size,
    actualizadoHaceHoras,
  };
}

/** Mismo rodado, ±10 ancho o ±5 perfil (excluye la actual). */
export function getMedidasParecidas(slug: string, limit = 6): Medida[] {
  const actual = getMedida(slug);
  if (!actual) return [];
  return getMedidas()
    .filter((m) => {
      if (m.slug === slug) return false;
      if (m.rodado !== actual.rodado) return false;
      const dAncho = Math.abs(m.ancho - actual.ancho);
      const dPerfil = Math.abs(m.perfil - actual.perfil);
      return dAncho <= 10 || dPerfil <= 5;
    })
    .slice(0, limit);
}

export function getVehicles(): Vehicle[] {
  return [...vehiclesList].sort((a, b) => {
    const m = a.marca.localeCompare(b.marca, "es");
    if (m !== 0) return m;
    return a.modelo.localeCompare(b.modelo, "es");
  });
}

export function getVehicle(slug: string): Vehicle | undefined {
  return vehiclesList.find((v) => v.slug === slug);
}

export function getVehiclesByMarca(): { marca: string; vehicles: Vehicle[] }[] {
  const map = new Map<string, Vehicle[]>();
  for (const v of getVehicles()) {
    const list = map.get(v.marca) ?? [];
    list.push(v);
    map.set(v.marca, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "es"))
    .map(([marca, vs]) => ({ marca, vehicles: vs }));
}

/** Opciones de marca/modelo para el combobox "Por auto". */
export function getVehicleSearchIndex(): {
  slug: string;
  marca: string;
  modelo: string;
  label: string;
}[] {
  return getVehicles().map((v) => ({
    slug: v.slug,
    marca: v.marca,
    modelo: v.modelo,
    label: `${v.marca} ${v.modelo}`,
  }));
}

export function pickDefaultVehicleSize(
  vehicle: Vehicle,
  version?: string | null,
  anio?: number | null
): VehicleSizeOption {
  let candidates = vehicle.sizes;
  if (version) {
    const byVersion = candidates.filter(
      (s) => (s.version ?? "").toLowerCase() === version.toLowerCase()
    );
    if (byVersion.length) candidates = byVersion;
  }
  if (anio != null) {
    const byYear = candidates.filter((s) => {
      const from = s.anioDesde ?? 0;
      const to = s.anioHasta ?? 9999;
      return anio >= from && anio <= to;
    });
    if (byYear.length) candidates = byYear;
  }
  return (
    candidates.find((s) => s.original) ??
    candidates[0] ??
    vehicle.sizes[0]!
  );
}

export function getAutosPorMedida(slug: string): AutoMedida[] {
  const out: AutoMedida[] = [];
  for (const v of vehiclesList) {
    for (const s of v.sizes) {
      if (s.medidaSlug !== slug) continue;
      out.push({
        marca: v.marca,
        modelo: v.modelo,
        version: s.version,
        anioDesde: s.anioDesde,
        anioHasta: s.anioHasta,
        medidaLabel: s.medidaLabel,
        medidaSlug: s.medidaSlug,
        fuente: s.fuente,
        estado: s.estado,
        vehicleSlug: v.slug,
      });
    }
  }
  return out;
}

/** true si las ofertas vienen del seed JSON de ejemplo. */
export function isExampleData(ofertas: Oferta[]): boolean {
  return ofertas.length > 0 && ofertas.every((o) => o.ejemplo === true);
}

/** Mínimo de ofertas reales para indexar páginas de marca / medida+marca / rodado. */
export const MIN_INDEXABLE_OFFERS = 3;

export function marcaToSlug(marca: string): string {
  return marca
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ofertaMarcaSlug(o: Oferta): string {
  return marcaToSlug(o.marca);
}

export async function getAllOfertas(): Promise<OfertaEnriquecida[]> {
  const lists = await Promise.all(getMedidas().map((m) => getOfertas(m.slug)));
  return lists.flat();
}

export async function getOfertasByMarca(
  marcaSlug: string
): Promise<OfertaEnriquecida[]> {
  const all = await getAllOfertas();
  return all
    .filter((o) => ofertaMarcaSlug(o) === marcaSlug)
    .sort((a, b) => a.precioEfectivo - b.precioEfectivo);
}

export async function getOfertasByMedidaAndMarca(
  medidaSlug: string,
  marcaSlug: string
): Promise<OfertaEnriquecida[]> {
  const ofertas = await getOfertas(medidaSlug);
  return ofertas.filter((o) => ofertaMarcaSlug(o) === marcaSlug);
}

export async function getMarcaCatalog(): Promise<
  {
    slug: string;
    nombre: string;
    ofertasCount: number;
    modelos: string[];
    medidas: { slug: string; label: string; precioDesde: number; count: number }[];
    precioMin: number;
    precioMax: number;
  }[]
> {
  const all = await getAllOfertas();
  const byMarca = new Map<string, OfertaEnriquecida[]>();
  for (const o of all) {
    const slug = ofertaMarcaSlug(o);
    if (!slug) continue;
    const list = byMarca.get(slug) ?? [];
    list.push(o);
    byMarca.set(slug, list);
  }

  const out = [];
  for (const [slug, ofertas] of byMarca) {
    const modelos = [
      ...new Set(ofertas.map((o) => o.modelo).filter((m) => m && m !== "—")),
    ].sort((a, b) => a.localeCompare(b, "es"));
    const byMedida = new Map<string, OfertaEnriquecida[]>();
    for (const o of ofertas) {
      const list = byMedida.get(o.medidaSlug) ?? [];
      list.push(o);
      byMedida.set(o.medidaSlug, list);
    }
    const medidas = [...byMedida.entries()]
      .map(([mslug, list]) => {
        const medida = getMedida(mslug);
        return {
          slug: mslug,
          label: medida?.label ?? mslug,
          precioDesde: Math.min(...list.map((o) => o.precioEfectivo)),
          count: list.length,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label, "es"));

    out.push({
      slug,
      nombre: ofertas[0]!.marca,
      ofertasCount: ofertas.length,
      modelos,
      medidas,
      precioMin: Math.min(...ofertas.map((o) => o.precioEfectivo)),
      precioMax: Math.max(...ofertas.map((o) => o.precioEfectivo)),
    });
  }
  return out.sort((a, b) => b.ofertasCount - a.ofertasCount);
}

export async function getIndexableMarcaSlugs(): Promise<string[]> {
  const catalog = await getMarcaCatalog();
  return catalog
    .filter((m) => m.ofertasCount >= MIN_INDEXABLE_OFFERS)
    .map((m) => m.slug);
}

export async function getIndexableMedidaMarcaPairs(): Promise<
  { slug: string; marca: string }[]
> {
  const pairs: { slug: string; marca: string }[] = [];
  for (const m of getMedidas()) {
    const ofertas = await getOfertas(m.slug);
    const byMarca = new Map<string, number>();
    for (const o of ofertas) {
      const ms = ofertaMarcaSlug(o);
      byMarca.set(ms, (byMarca.get(ms) ?? 0) + 1);
    }
    for (const [marca, count] of byMarca) {
      if (count >= MIN_INDEXABLE_OFFERS) {
        pairs.push({ slug: m.slug, marca });
      }
    }
  }
  return pairs;
}

export async function getMarcasEnMedida(
  medidaSlug: string
): Promise<{ slug: string; nombre: string; count: number; precioDesde: number }[]> {
  const ofertas = await getOfertas(medidaSlug);
  const map = new Map<string, OfertaEnriquecida[]>();
  for (const o of ofertas) {
    const s = ofertaMarcaSlug(o);
    const list = map.get(s) ?? [];
    list.push(o);
    map.set(s, list);
  }
  return [...map.entries()]
    .map(([slug, list]) => ({
      slug,
      nombre: list[0]!.marca,
      count: list.length,
      precioDesde: Math.min(...list.map((o) => o.precioEfectivo)),
    }))
    .sort((a, b) => a.precioDesde - b.precioDesde);
}

export const RODADOS = [13, 14, 15, 16, 17, 18] as const;

export async function getMedidasPorRodado(
  rodado: number
): Promise<(MedidaCardData & { ofertasCount: number })[]> {
  const list = getMedidas().filter((m) => m.rodado === rodado);
  return Promise.all(
    list.map(async (m) => {
      const ofertas = await getOfertas(m.slug);
      return {
        ...m,
        precioDesde: ofertas[0]?.precioEfectivo ?? null,
        variacionSemanal: await getVariacionSemanal(m.slug),
        ofertasCount: ofertas.length,
      };
    })
  );
}

export async function getIndexableRodados(): Promise<number[]> {
  const out: number[] = [];
  for (const n of RODADOS) {
    const medidas = await getMedidasPorRodado(n);
    const total = medidas.reduce((acc, m) => acc + m.ofertasCount, 0);
    if (total >= MIN_INDEXABLE_OFFERS) out.push(n);
  }
  return out;
}

export async function getOfertasConCuotas(
  medidaSlug?: string
): Promise<OfertaEnriquecida[]> {
  const source = medidaSlug
    ? await getOfertas(medidaSlug)
    : await getAllOfertas();
  return source
    .filter((o) => o.cuotasSinInteres && o.cuotas >= 3)
    .sort((a, b) => {
      if (b.cuotas !== a.cuotas) return b.cuotas - a.cuotas;
      return a.precioEfectivo - b.precioEfectivo;
    });
}

async function fetchLastSnapshotAt(): Promise<string | null> {
  const url = databaseUrl();
  if (!url) return null;
  try {
    const sql = neon(url);
    const rows = (await sql`
      SELECT MAX(captured_at) AS last_at FROM price_snapshots
    `) as { last_at: string | Date | null }[];
    const raw = rows[0]?.last_at;
    if (!raw) return null;
    const d = raw instanceof Date ? raw : new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  } catch (err) {
    console.error("[data] getLastSnapshotAt falló", err);
    return null;
  }
}

/** Último snapshot global (para sitemap lastModified). */
export async function getLastSnapshotAt(): Promise<Date | null> {
  const cached = unstable_cache(
    fetchLastSnapshotAt,
    ["last-snapshot-at"],
    { revalidate: DATA_REVALIDATE_SECONDS, tags: ["precios"] }
  );
  const iso = await cached();
  return iso ? new Date(iso) : null;
}

async function fetchLastSnapshotByMedida(): Promise<[string, string][]> {
  const url = databaseUrl();
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = (await sql`
      SELECT sz.slug, MAX(ps.captured_at) AS last_at
      FROM price_snapshots ps
      JOIN products p ON p.id = ps.product_id
      JOIN sizes sz ON sz.id = p.size_id
      WHERE p.activo = TRUE
      GROUP BY sz.slug
    `) as { slug: string; last_at: string | Date }[];
    const out: [string, string][] = [];
    for (const r of rows) {
      const d = r.last_at instanceof Date ? r.last_at : new Date(r.last_at);
      if (!Number.isNaN(d.getTime())) out.push([r.slug, d.toISOString()]);
    }
    return out;
  } catch (err) {
    console.error("[data] getLastSnapshotByMedida falló", err);
    return [];
  }
}

/** lastModified por medida (slug → Date). */
export async function getLastSnapshotByMedida(): Promise<Map<string, Date>> {
  const cached = unstable_cache(
    fetchLastSnapshotByMedida,
    ["last-snapshot-by-medida"],
    { revalidate: DATA_REVALIDATE_SECONDS, tags: ["precios"] }
  );
  const pairs = await cached();
  return new Map(pairs.map(([slug, iso]) => [slug, new Date(iso)]));
}
