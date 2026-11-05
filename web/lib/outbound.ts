import type { Oferta } from "@/lib/types";

/** URL de salida: afiliado si existe, si no el link de la tienda. */
export function outboundHref(oferta: Pick<Oferta, "url" | "affiliateUrl">): string {
  return oferta.affiliateUrl || oferta.url;
}

/** rel para CTAs a tiendas (afiliados ML / comerciales). */
export function outboundRel(
  oferta?: Pick<Oferta, "affiliateUrl" | "tiendaId">
): string {
  const base = "noopener noreferrer sponsored nofollow";
  if (!oferta) return base;
  if (oferta.affiliateUrl || oferta.tiendaId === "mercadolibre") {
    return base;
  }
  return "noopener noreferrer sponsored";
}
