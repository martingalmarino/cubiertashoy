"use client";

import { useMemo, useState } from "react";
import { PriceCard } from "@/components/PriceCard";
import type { OfertaEnriquecida } from "@/lib/types";

type CuotasFilterProps = {
  ofertas: OfertaEnriquecida[];
  medidas: { slug: string; label: string }[];
};

export function CuotasFilter({ ofertas, medidas }: CuotasFilterProps) {
  const [medida, setMedida] = useState("");

  const filtradas = useMemo(() => {
    if (!medida) return ofertas;
    return ofertas.filter((o) => o.medidaSlug === medida);
  }, [ofertas, medida]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label
            htmlFor="cuotas-medida"
            className="mb-1.5 block text-sm font-medium text-tinta-500"
          >
            Filtrar por medida
          </label>
          <select
            id="cuotas-medida"
            value={medida}
            onChange={(e) => setMedida(e.target.value)}
            className="min-h-11 min-w-[220px] rounded-xl border border-borde bg-superficie px-3 text-sm text-tinta-900 focus-visible:border-accion-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accion-600/20"
          >
            <option value="">Todas</option>
            {medidas.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-tinta-500">
          <span className="font-mono tabular-nums">{filtradas.length}</span>{" "}
          ofertas con cuotas sin interés
        </p>
      </div>

      {filtradas.length === 0 ? (
        <p className="mt-8 rounded-xl border border-borde bg-fondo px-4 py-6 text-sm text-tinta-500">
          No hay ofertas con cuotas sin interés para ese filtro.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtradas.slice(0, 36).map((o, i) => (
            <PriceCard key={o.id} oferta={o} destacada={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
