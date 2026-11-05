import { ArrowUpRight } from "lucide-react";
import { CuotasChip } from "@/components/CuotasChip";
import { DiscountBadge } from "@/components/DiscountBadge";
import { formatARS } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OfertaEnriquecida } from "@/lib/types";

type PriceCardProps = {
  oferta: OfertaEnriquecida;
  destacada?: boolean;
};

export function PriceCard({ oferta, destacada }: PriceCardProps) {
  const iniciales = oferta.tiendaNombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  return (
    <article
      className={cn(
        "rounded-xl border bg-superficie p-4 shadow-card",
        destacada ? "border-ahorro-600 border-l-[3px]" : "border-borde"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-borde bg-fondo font-mono text-xs font-bold text-tinta-700"
        >
          {iniciales}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-tinta-500">
            {oferta.tiendaNombre}
          </p>
          <p className="truncate text-sm font-medium text-tinta-700">
            {oferta.marca} {oferta.modelo}
          </p>
          <p className="font-mono text-xs tabular-nums text-tinta-400">
            {oferta.indice}
          </p>
        </div>
        <a
          href={oferta.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-accion-600 text-white transition-colors hover:bg-accion-700 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
          aria-label={`Ver en ${oferta.tiendaNombre}`}
        >
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>

      <p className="mt-3 font-mono text-2xl font-bold tabular-nums text-tinta-900">
        {formatARS(oferta.precioEfectivo)}
      </p>

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
