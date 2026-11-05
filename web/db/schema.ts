import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const plataformaEnum = pgEnum("plataforma", [
  "vtex",
  "woocommerce",
  "html",
  "api",
]);

export const gomeriaPlanEnum = pgEnum("gomeria_plan", [
  "gratis",
  "basico",
  "pro",
]);

export const leadEstadoEnum = pgEnum("lead_estado", [
  "nuevo",
  "enviado",
  "sin_cobertura",
  "spam",
]);

export const scrapeEstadoEnum = pgEnum("scrape_estado", [
  "running",
  "ok",
  "error",
]);

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nombre: text("nombre").notNull(),
  url: text("url").notNull(),
  logoUrl: text("logo_url"),
  plataforma: plataformaEnum("plataforma").notNull().default("html"),
  activo: boolean("activo").notNull().default(true),
});

export const sizes = pgTable("sizes", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  ancho: integer("ancho").notNull(),
  perfil: integer("perfil").notNull(),
  rodado: integer("rodado").notNull(),
  label: text("label").notNull(),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    storeId: integer("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    externalId: text("external_id").notNull(),
    url: text("url").notNull(),
    affiliateUrl: text("affiliate_url"),
    marca: text("marca").notNull(),
    modelo: text("modelo").notNull(),
    sizeId: integer("size_id")
      .notNull()
      .references(() => sizes.id, { onDelete: "restrict" }),
    indiceCarga: text("indice_carga"),
    indiceVelocidad: text("indice_velocidad"),
    unidadesPorPaquete: integer("unidades_por_paquete").notNull().default(1),
    tituloOriginal: text("titulo_original"),
    activo: boolean("activo").notNull().default(true),
    firstSeen: timestamp("first_seen", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    lastSeen: timestamp("last_seen", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    uniqueIndex("products_store_external_uidx").on(t.storeId, t.externalId),
    index("products_size_idx").on(t.sizeId),
  ]
);

export const priceSnapshots = pgTable(
  "price_snapshots",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    capturedAt: timestamp("captured_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    precioUnitarioEfectivo: integer("precio_unitario_efectivo").notNull(),
    precioUnitarioTarjeta: integer("precio_unitario_tarjeta").notNull(),
    precioLista: integer("precio_lista"),
    cuotasSinInteres: integer("cuotas_sin_interes"),
    colocacionIncluida: boolean("colocacion_incluida"),
    enStock: boolean("en_stock"),
  },
  (t) => [
    index("price_snapshots_product_captured_idx").on(
      t.productId,
      t.capturedAt.desc()
    ),
  ]
);

export const scrapeRuns = pgTable("scrape_runs", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  productos: integer("productos").notNull().default(0),
  errores: integer("errores").notNull().default(0),
  estado: scrapeEstadoEnum("estado").notNull().default("running"),
});

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  marca: text("marca").notNull(),
  modelo: text("modelo").notNull(),
});

export const vehicleSizes = pgTable(
  "vehicle_sizes",
  {
    id: serial("id").primaryKey(),
    vehicleId: integer("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
    version: text("version"),
    anioDesde: integer("anio_desde"),
    anioHasta: integer("anio_hasta"),
    sizeId: integer("size_id")
      .notNull()
      .references(() => sizes.id, { onDelete: "restrict" }),
    original: boolean("original").notNull().default(true),
  },
  (t) => [index("vehicle_sizes_vehicle_idx").on(t.vehicleId)]
);

export const gomerias = pgTable(
  "gomerias",
  {
    id: serial("id").primaryKey(),
    nombre: text("nombre").notNull(),
    localidad: text("localidad").notNull(),
    whatsapp: text("whatsapp").notNull(),
    plan: gomeriaPlanEnum("plan").notNull().default("gratis"),
    activo: boolean("activo").notNull().default(true),
    email: text("email"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [index("gomerias_localidad_idx").on(t.localidad)]
);

export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    nombre: text("nombre").notNull(),
    whatsapp: text("whatsapp").notNull(),
    localidad: text("localidad").notNull(),
    medidaSlug: text("medida_slug").notNull(),
    medidaLabel: text("medida_label").notNull(),
    cantidad: integer("cantidad").notNull(),
    consentimiento: boolean("consentimiento").notNull().default(false),
    gomeriaId: integer("gomeria_id").references(() => gomerias.id, {
      onDelete: "set null",
    }),
    estado: leadEstadoEnum("estado").notNull().default("nuevo"),
    sourcePath: text("source_path"),
    ipHash: text("ip_hash"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index("leads_localidad_idx").on(t.localidad),
    index("leads_created_idx").on(t.createdAt.desc()),
  ]
);

export type Store = typeof stores.$inferSelect;
export type Size = typeof sizes.$inferSelect;
export type Product = typeof products.$inferSelect;
export type PriceSnapshot = typeof priceSnapshots.$inferSelect;
export type ScrapeRun = typeof scrapeRuns.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type VehicleSize = typeof vehicleSizes.$inferSelect;
export type Gomeria = typeof gomerias.$inferSelect;
export type Lead = typeof leads.$inferSelect;
