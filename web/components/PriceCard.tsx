import { ArrowUpRight } from "lucide-react";
import { CuotasChip } from "@/components/CuotasChip";
import { DiscountBadge } from "@/components/DiscountBadge";
import { formatARS } from "@/lib/format";
import type { OfertaEnriquecida } from "@/lib/types";

type PriceCardProps = {
  oferta: OfertaEnriquecida;
  destacada?: boolean;
};

export function PriceCard({ oferta, destacada }: PriceCardProps) {
  const inicial = oferta.tiendaNombre.charAt(0).toUpperCase();

  return (
    <article
      className={
        destacada
          ? "rounded-lg border border-verde-600/30 bg-verde-50 p-4"
          : "rounded-lg border border-niebla-200 bg-white p-4"
      }
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-asfalto-950 font-display text-sm font-semibold text-papel"
        >
          {inicial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-asfalto-600">
            {oferta.tiendaNombre}
          </p>
          <p className="truncate font-medium text-asfalto-950">
            {oferta.marca} {oferta.modelo}
          </p>
          <p className="font-mono text-xs tabular-nums text-asfalto-600">
            {oferta.indice}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-2xl font-bold tabular-nums text-asfalto-950">
            {formatARS(oferta.precioEfectivo)}
          </p>
          <p className="text-xs text-asfalto-600">
            Tarjeta{" "}
            <span className="font-mono tabular-nums">
              {formatARS(oferta.precioTarjeta)}
            </span>
          </p>
        </div>
        <a
          href={oferta.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md bg-azul-600 text-white transition-colors hover:bg-azul-600/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-600"
          aria-label={`Ir a ${oferta.tiendaNombre}`}
        >
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <CuotasChip
          cuotas={oferta.cuotas}
          sinInteres={oferta.cuotasSinInteres}
        />
        {oferta.colocacionGratis && <CuotasChip variant="colocacion" />}
        {oferta.descuento && <DiscountBadge kind={oferta.descuento} />}
      </div>
    </article>
  );
}
