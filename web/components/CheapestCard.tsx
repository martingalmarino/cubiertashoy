"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedPrice } from "@/components/AnimatedPrice";
import { CuotasChip } from "@/components/CuotasChip";
import { DiscountBadge } from "@/components/DiscountBadge";
import { formatARS } from "@/lib/format";
import type { OfertaEnriquecida } from "@/lib/types";

type CheapestCardProps = {
  oferta: OfertaEnriquecida;
};

export function CheapestCard({ oferta }: CheapestCardProps) {
  const reduce = useReducedMotion();
  const pctOff =
    oferta.precioAnterior && oferta.precioAnterior > oferta.precioEfectivo
      ? Math.round(
          ((oferta.precioAnterior - oferta.precioEfectivo) /
            oferta.precioAnterior) *
            100
        )
      : null;

  return (
    <article
      id="mas-barato"
      className="relative overflow-hidden rounded-xl border-2 border-ahorro-600 bg-superficie shadow-card"
    >
      <div className="bg-ahorro-600 px-4 py-1.5 text-center text-xs font-semibold tracking-wide text-white">
        MÁS BARATO HOY
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-medium text-tinta-700 line-clamp-2 md:text-base">
            {oferta.marca} {oferta.modelo}{" "}
            <span className="font-mono text-sm font-medium tabular-nums text-tinta-500">
              {oferta.indice}
            </span>
          </h2>
          <p className="mt-1 text-sm text-tinta-500">{oferta.tiendaNombre}</p>
        </div>

        <div className="lg:text-right">
          <p className="font-mono text-[32px] font-bold leading-none tracking-tight text-tinta-900 md:text-[44px]">
            <AnimatedPrice value={oferta.precioEfectivo} fromZero durationMs={600} />
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 lg:justify-end">
            {oferta.precioAnterior != null && (
              <span className="font-mono text-sm tabular-nums text-oferta-600 line-through">
                {formatARS(oferta.precioAnterior)}
              </span>
            )}
            {pctOff != null && oferta.descuento === "real" && (
              <span className="inline-flex rounded-full bg-oferta-50 px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-oferta-600">
                {pctOff}% OFF
              </span>
            )}
            {oferta.descuento === "inflado" && (
              <DiscountBadge kind="inflado" />
            )}
            {oferta.descuento === "real" && pctOff == null && (
              <DiscountBadge kind="real" />
            )}
          </div>
        </div>
      </div>

      <div className="mx-5 mb-5 grid grid-cols-2 gap-2 sm:mx-6">
        <div className="rounded-lg bg-fondo px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500">
            Precio en efectivo
          </p>
          <p className="mt-1 font-mono text-base font-bold tabular-nums text-tinta-900">
            {formatARS(oferta.precioEfectivo)}
          </p>
        </div>
        <div className="rounded-lg bg-fondo px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500">
            Precio con tarjeta
          </p>
          <p className="mt-1 font-mono text-base font-bold tabular-nums text-tinta-900">
            {formatARS(oferta.precioTarjeta)}
          </p>
        </div>
      </div>

      <div className="mx-5 mb-5 flex flex-wrap items-center gap-2 sm:mx-6">
        <CuotasChip
          cuotas={oferta.cuotas}
          sinInteres={oferta.cuotasSinInteres}
        />
        {oferta.colocacionGratis && <CuotasChip variant="colocacion" />}
      </div>

      <div className="mx-5 mb-5 sm:mx-6">
        <motion.a
          href={oferta.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          whileTap={reduce ? undefined : { scale: 0.97 }}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accion-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-accion-700 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2 sm:w-auto"
        >
          Ir a {oferta.tiendaNombre}
          <ArrowUpRight className="size-4" aria-hidden />
        </motion.a>
        <p className="mt-3 text-xs text-tinta-400">
          Actualizado hace {oferta.actualizadoHaceHoras} h
        </p>
      </div>
    </article>
  );
}
