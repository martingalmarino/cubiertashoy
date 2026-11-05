CREATE TABLE IF NOT EXISTS "vehicles" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "marca" text NOT NULL,
  "modelo" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicle_sizes" (
  "id" serial PRIMARY KEY NOT NULL,
  "vehicle_id" integer NOT NULL,
  "version" text,
  "anio_desde" integer,
  "anio_hasta" integer,
  "size_id" integer NOT NULL,
  "original" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicle_sizes" ADD CONSTRAINT "vehicle_sizes_vehicle_id_vehicles_id_fk"
   FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicle_sizes" ADD CONSTRAINT "vehicle_sizes_size_id_sizes_id_fk"
   FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vehicle_sizes_vehicle_idx" ON "vehicle_sizes" USING btree ("vehicle_id");
