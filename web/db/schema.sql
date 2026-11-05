-- Schema canónico CubiertasHoy (Neon Postgres).
-- Precios: enteros ARS por unidad.
-- La fuente de verdad operativa es Drizzle (db/schema.ts + drizzle/).

CREATE TYPE plataforma AS ENUM ('vtex', 'woocommerce', 'html');
CREATE TYPE scrape_estado AS ENUM ('running', 'ok', 'error');

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  url TEXT NOT NULL,
  logo_url TEXT,
  plataforma plataforma NOT NULL DEFAULT 'html',
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE sizes (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE, -- '175-65-r14'
  ancho INTEGER NOT NULL,
  perfil INTEGER NOT NULL,
  rodado INTEGER NOT NULL,
  label TEXT NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  url TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  size_id INTEGER NOT NULL REFERENCES sizes (id) ON DELETE RESTRICT,
  indice_carga TEXT,
  indice_velocidad TEXT,
  unidades_por_paquete INTEGER NOT NULL DEFAULT 1,
  titulo_original TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (store_id, external_id)
);

CREATE INDEX products_size_idx ON products (size_id);

CREATE TABLE price_snapshots (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  precio_unitario_efectivo INTEGER NOT NULL,
  precio_unitario_tarjeta INTEGER NOT NULL,
  precio_lista INTEGER NULL,
  cuotas_sin_interes INTEGER NULL,
  colocacion_incluida BOOLEAN NULL,
  en_stock BOOLEAN NULL
);

CREATE INDEX price_snapshots_product_captured_idx
  ON price_snapshots (product_id, captured_at DESC);

CREATE TABLE scrape_runs (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  productos INTEGER NOT NULL DEFAULT 0,
  errores INTEGER NOT NULL DEFAULT 0,
  estado scrape_estado NOT NULL DEFAULT 'running'
);

-- Agregados diarios por medida (refrescable tras scrapes).
CREATE MATERIALIZED VIEW size_daily_stats AS
SELECT
  p.size_id,
  (ps.captured_at AT TIME ZONE 'America/Argentina/Buenos_Aires')::date AS dia,
  MIN(ps.precio_unitario_efectivo) AS min,
  PERCENTILE_CONT(0.5) WITHIN GROUP (
    ORDER BY ps.precio_unitario_efectivo
  )::INTEGER AS mediana,
  MAX(ps.precio_unitario_efectivo) AS max,
  COUNT(*)::INTEGER AS ofertas,
  COUNT(DISTINCT p.store_id)::INTEGER AS tiendas
FROM price_snapshots ps
JOIN products p ON p.id = ps.product_id
WHERE p.activo = TRUE
GROUP BY p.size_id, (ps.captured_at AT TIME ZONE 'America/Argentina/Buenos_Aires')::date;

CREATE UNIQUE INDEX size_daily_stats_size_dia_uidx
  ON size_daily_stats (size_id, dia);

-- Autos (Fase 3)
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL
);

CREATE TABLE vehicle_sizes (
  id SERIAL PRIMARY KEY,
  vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  version TEXT,
  anio_desde INT,
  anio_hasta INT,
  size_id INT NOT NULL REFERENCES sizes(id) ON DELETE RESTRICT,
  original BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX vehicle_sizes_vehicle_idx ON vehicle_sizes (vehicle_id);
