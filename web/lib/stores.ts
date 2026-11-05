/** Logos de tienda (solo presentación). Clave = tiendaId / store slug. */
export const STORE_LOGOS: Record<string, string> = {
  norauto: "/logos/norauto.svg",
  naldo: "/logos/naldo.svg",
  neumaflores: "/logos/neumaflores.png",
  "360-neumaticos": "/logos/360-neumaticos.png",
  mercadolibre: "/logos/mercadolibre.svg",
};

export function storeLogoSrc(storeId: string): string | null {
  return STORE_LOGOS[storeId] ?? null;
}
