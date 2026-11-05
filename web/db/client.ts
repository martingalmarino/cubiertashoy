import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

function getDatabaseUrl() {
  const url =
    process.env.DATABASE_URL ??
    process.env.DATABASE_POSTGRES_URL ??
    process.env.DATABASE_URL_UNPOOLED;
  if (!url) {
    throw new Error("DATABASE_URL no está definida");
  }
  return url;
}

/** Cliente HTTP Neon + Drizzle (Server Components / scripts). */
export function createDb() {
  const sql = neon(getDatabaseUrl());
  return drizzle(sql, { schema });
}

export type Db = ReturnType<typeof createDb>;
