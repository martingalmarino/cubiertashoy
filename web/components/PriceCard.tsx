"use client";

import { ArrowUpRight } from "lucide-react";
import { CuotasChip } from "@/components/CuotasChip";
import { DiscountBadge } from "@/components/DiscountBadge";
import { StoreLogo } from "@/components/StoreLogo";
import { trackClickTienda } from "@/lib/analytics";
import { formatARS } from "@/lib/format";
import { outboundHref, outboundRel } from "@/lib/outbound";
import { cn } from "@/lib/utils";
import type { OfertaEnriquecida } from "@/lib/types";

type PriceCardProps = {
  oferta: OfertaEnriquecida;
  destacada?: boolean;
};

export function PriceCard({ oferta, destacada }: PriceCardProps) {
  return (
    <article
      className={cn(
        "flex w-full min-w-0 flex-col gap-3 rounded-xl border bg-superficie p-4 shadow-card",
        destacada ? "border-l-[3px] border-ahorro-600" : "border-borde"
      )}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <div className="flex h-8 min-w-0 items-center rounded-md bg-white px-2">
          <StoreLogo
            storeId={oferta.tiendaId}
            nombre={oferta.tiendaNombre}
            size="sm"
          />
        </div>
        <span className="shrink-0 font-mono text-xs tabular-nums text-tinta-400">
          {oferta.indice}
        </span>
      </div>

      <p className="line-clamp-2 text-sm font-medium text-tinta-700">
        {oferta.marca} {oferta.modelo}
      </p>

      <div className="flex min-w-0 items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xl font-bold tabular-nums text-tinta-900">
            {formatARS(oferta.precioEfectivo)}
          </p>
          <p className="mt-0.5 font-mono text-xs tabular-nums text-tinta-500">
            tarjeta {formatARS(oferta.precioTarjeta)}
          </p>
        </div>
        <a
          href={outboundHref(oferta)}
          target="_blank"
          rel={outboundRel(oferta)}
          onClick={() => trackClickTienda(oferta)}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-accion-600 text-white transition-colors hover:bg-accion-700 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
          aria-label={`Ver en ${oferta.tiendaNombre}`}
        >
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <CuotasChip
          cuotas={oferta.cuotas}
          sinInteres={oferta.cuotasSinInteres}
          compact
        />
        {oferta.colocacionGratis && <CuotasChip variant="colocacion" compact />}
        {oferta.descuento && <DiscountBadge kind={oferta.descuento} />}
      </div>
    </article>
  );
}
