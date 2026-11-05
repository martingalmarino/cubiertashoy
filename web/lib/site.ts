/** URL canónica del sitio (sin slash final). */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  // En production no caer a *.vercel.app: canonical/robots/sitemap deben ser el dominio.
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.precioneumaticos.com.ar";
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "Precio Neumáticos";
/** Alias usado en titles cortos; misma marca visible. */
export const SITE_NAME_SHORT = SITE_NAME;
