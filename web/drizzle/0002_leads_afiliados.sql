DO $$ BEGIN
  ALTER TYPE "plataforma" ADD VALUE IF NOT EXISTS 'api';
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "gomeria_plan" AS ENUM ('gratis', 'basico', 'pro');
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "lead_estado" AS ENUM ('nuevo', 'enviado', 'sin_cobertura', 'spam');
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "affiliate_url" text;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gomerias" (
  "id" serial PRIMARY KEY NOT NULL,
  "nombre" text NOT NULL,
  "localidad" text NOT NULL,
  "whatsapp" text NOT NULL,
  "plan" "gomeria_plan" DEFAULT 'gratis' NOT NULL,
  "activo" boolean DEFAULT true NOT NULL,
  "email" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leads" (
  "id" serial PRIMARY KEY NOT NULL,
  "nombre" text NOT NULL,
  "whatsapp" text NOT NULL,
  "localidad" text NOT NULL,
  "medida_slug" text NOT NULL,
  "medida_label" text NOT NULL,
  "cantidad" integer NOT NULL,
  "consentimiento" boolean DEFAULT false NOT NULL,
  "gomeria_id" integer,
  "estado" "lead_estado" DEFAULT 'nuevo' NOT NULL,
  "source_path" text,
  "ip_hash" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leads" ADD CONSTRAINT "leads_gomeria_id_gomerias_id_fk"
   FOREIGN KEY ("gomeria_id") REFERENCES "public"."gomerias"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gomerias_localidad_idx" ON "gomerias" USING btree ("localidad");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_localidad_idx" ON "leads" USING btree ("localidad");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_created_idx" ON "leads" USING btree ("created_at" DESC);
