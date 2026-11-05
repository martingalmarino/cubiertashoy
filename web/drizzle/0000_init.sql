CREATE TYPE "public"."plataforma" AS ENUM('vtex', 'woocommerce', 'html');--> statement-breakpoint
CREATE TYPE "public"."scrape_estado" AS ENUM('running', 'ok', 'error');--> statement-breakpoint
CREATE TABLE "price_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"precio_unitario_efectivo" integer NOT NULL,
	"precio_unitario_tarjeta" integer NOT NULL,
	"precio_lista" integer,
	"cuotas_sin_interes" integer,
	"colocacion_incluida" boolean,
	"en_stock" boolean
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"external_id" text NOT NULL,
	"url" text NOT NULL,
	"marca" text NOT NULL,
	"modelo" text NOT NULL,
	"size_id" integer NOT NULL,
	"indice_carga" text,
	"indice_velocidad" text,
	"unidades_por_paquete" integer DEFAULT 1 NOT NULL,
	"titulo_original" text,
	"activo" boolean DEFAULT true NOT NULL,
	"first_seen" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scrape_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"productos" integer DEFAULT 0 NOT NULL,
	"errores" integer DEFAULT 0 NOT NULL,
	"estado" "scrape_estado" DEFAULT 'running' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sizes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"ancho" integer NOT NULL,
	"perfil" integer NOT NULL,
	"rodado" integer NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "sizes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"url" text NOT NULL,
	"logo_url" text,
	"plataforma" "plataforma" DEFAULT 'html' NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "price_snapshots" ADD CONSTRAINT "price_snapshots_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scrape_runs" ADD CONSTRAINT "scrape_runs_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "price_snapshots_product_captured_idx" ON "price_snapshots" USING btree ("product_id","captured_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "products_store_external_uidx" ON "products" USING btree ("store_id","external_id");--> statement-breakpoint
CREATE INDEX "products_size_idx" ON "products" USING btree ("size_id");--> statement-breakpoint
CREATE MATERIALIZED VIEW "size_daily_stats" AS
SELECT
  p.size_id,
  (ps.captured_at AT TIME ZONE 'America/Argentina/Buenos_Aires')::date AS dia,
  MIN(ps.precio_unitario_efectivo) AS min,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ps.precio_unitario_efectivo)::INTEGER AS mediana,
  MAX(ps.precio_unitario_efectivo) AS max,
  COUNT(*)::INTEGER AS ofertas,
  COUNT(DISTINCT p.store_id)::INTEGER AS tiendas
FROM price_snapshots ps
JOIN products p ON p.id = ps.product_id
WHERE p.activo = TRUE
GROUP BY p.size_id, (ps.captured_at AT TIME ZONE 'America/Argentina/Buenos_Aires')::date;--> statement-breakpoint
CREATE UNIQUE INDEX "size_daily_stats_size_dia_uidx" ON "size_daily_stats" ("size_id", "dia");