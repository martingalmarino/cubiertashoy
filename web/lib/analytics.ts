"use client";

import { track } from "@vercel/analytics";
import type { Oferta } from "@/lib/types";

type Props = Record<string, string | number | boolean | null | undefined>;

function clean(props: Props): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === null || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

export function trackClickTienda(oferta: Pick<
  Oferta,
  "tiendaId" | "tiendaNombre" | "medidaSlug" | "precioEfectivo" | "affiliateUrl"
>) {
  track(
    "click_tienda",
    clean({
      tienda: oferta.tiendaId,
      tienda_nombre: oferta.tiendaNombre,
      medida: oferta.medidaSlug,
      precio: oferta.precioEfectivo,
    })
  );
  if (oferta.affiliateUrl || oferta.tiendaId === "mercadolibre") {
    track(
      "click_afiliado",
      clean({
        tienda: oferta.tiendaId,
        medida: oferta.medidaSlug,
        precio: oferta.precioEfectivo,
      })
    );
  }
}

export function trackBusquedaMedida(medida: string, origen?: string) {
  track("busqueda_medida", clean({ medida, origen: origen ?? "search" }));
}

export function trackLeadEnviado(props: {
  medida: string;
  localidad: string;
  cantidad: number;
  estado: string;
}) {
  track(
    "lead_enviado",
    clean({
      medida: props.medida,
      localidad: props.localidad,
      cantidad: props.cantidad,
      estado: props.estado,
    })
  );
}
