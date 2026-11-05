import { ArrowUpRight } from "lucide-react";
import { AnimatedPrice } from "@/components/AnimatedPrice";
import { CuotasChip } from "@/components/CuotasChip";
import { DiscountBadge } from "@/components/DiscountBadge";
import type { OfertaEnriquecida } from "@/lib/types";

type CheapestCardProps = {
  oferta: OfertaEnriquecida;
};

export function CheapestCard({ oferta }: CheapestCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-niebla-200 border-l-4 border-l-verde-600 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-verde-600">
        Más barata hoy
      </p>
      <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.02em] text-asfalto-950 sm:text-2xl">
        {oferta.marca} {oferta.modelo}{" "}
        <span className="font-mono text-base font-medium tabular-nums text-asfalto-600">
          {oferta.indice}
        </span>
      </h2>

      <p className="mt-4 text-4xl font-bold tracking-tight text-asfalto-950 sm:text-[40px] sm:leading-none">
        <AnimatedPrice value={oferta.precioEfectivo} />
      </p>
      <p className="mt-1 text-sm text-asfalto-600">por unidad</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-asfalto-950">
          {oferta.tiendaNombre}
        </span>
        <CuotasChip
          cuotas={oferta.cuotas}
          sinInteres={oferta.cuotasSinInteres}
        />
        {oferta.colocacionGratis && <CuotasChip variant="colocacion" />}
        {oferta.descuento && <DiscountBadge kind={oferta.descuento} />}
      </div>

      <a
        href={oferta.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-azul-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-azul-600/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-600 sm:w-auto"
      >
        Ir a la tienda
        <ArrowUpRight className="size-4" aria-hidden />
      </a>

      <p className="mt-4 text-xs text-grafito-400">
        Actualizado hace {oferta.actualizadoHaceHoras} h
      </p>
    </article>
  );
}
