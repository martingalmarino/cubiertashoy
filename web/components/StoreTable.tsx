"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PriceCard } from "@/components/PriceCard";
import { CuotasChip } from "@/components/CuotasChip";
import { DiscountBadge } from "@/components/DiscountBadge";
import { trackClickTienda } from "@/lib/analytics";
import { formatARS } from "@/lib/format";
import { outboundHref, outboundRel } from "@/lib/outbound";
import { cn } from "@/lib/utils";
import type { OfertaEnriquecida } from "@/lib/types";

type SortKey = "efectivo" | "tarjeta" | "cuotas";

type StoreTableProps = {
  ofertas: OfertaEnriquecida[];
};

export function StoreTable({ ofertas }: StoreTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("efectivo");

  const sorted = useMemo(() => {
    const list = [...ofertas];
    list.sort((a, b) => {
      if (sortKey === "cuotas") return b.cuotas - a.cuotas;
      const av = sortKey === "efectivo" ? a.precioEfectivo : a.precioTarjeta;
      const bv = sortKey === "efectivo" ? b.precioEfectivo : b.precioTarjeta;
      return av - bv;
    });
    return list;
  }, [ofertas, sortKey]);

  const cheapestId =
    [...ofertas].sort((a, b) => a.precioEfectivo - b.precioEfectivo)[0]?.id ??
    null;

  const sorts: { key: SortKey; label: string }[] = [
    { key: "efectivo", label: "Efectivo" },
    { key: "tarjeta", label: "Tarjeta" },
    { key: "cuotas", label: "Cuotas" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900">
          Todas las ofertas
        </h2>
        <div
          role="group"
          aria-label="Ordenar ofertas"
          className="inline-flex rounded-full border border-borde bg-fondo p-1"
        >
          {sorts.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSortKey(s.key)}
              aria-pressed={sortKey === s.key}
              className={cn(
                "min-h-9 rounded-full px-3 text-sm font-medium transition-colors",
                sortKey === s.key
                  ? "bg-superficie text-tinta-900 shadow-card"
                  : "text-tinta-500 hover:text-tinta-900"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-3 md:hidden">
        {sorted.map((o) => (
          <li key={o.id}>
            <PriceCard oferta={o} destacada={o.id === cheapestId} />
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-xl border border-borde bg-superficie shadow-card md:block">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-borde bg-fondo text-left text-[11px] uppercase tracking-[0.08em] text-tinta-500">
                <th scope="col" className="px-3 py-3 font-medium">
                  Tienda
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Marca / Modelo
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Índice
                </th>
                <th scope="col" className="px-3 py-3 text-right font-medium">
                  Efectivo
                </th>
                <th scope="col" className="px-3 py-3 text-right font-medium">
                  Tarjeta
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Cuotas
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Coloc.
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  <span className="sr-only">Ir a la tienda</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((o) => {
                const barata = o.id === cheapestId;
                return (
                  <tr
                    key={o.id}
                    className={cn(
                      "group h-16 border-b border-borde transition-colors last:border-0 hover:bg-fondo",
                      barata &&
                        "border-l-[3px] border-l-ahorro-600 bg-ahorro-50/40 hover:bg-ahorro-50/40"
                    )}
                  >
                    <td className="px-3 py-3 font-medium text-tinta-900">
                      {o.tiendaNombre}
                    </td>
                    <td className="px-3 py-3 text-tinta-900">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>
                          {o.marca} {o.modelo}
                        </span>
                        {o.descuento && <DiscountBadge kind={o.descuento} />}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono tabular-nums text-tinta-500">
                      {o.indice}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-semibold tabular-nums text-tinta-900">
                      {formatARS(o.precioEfectivo)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono tabular-nums text-tinta-500">
                      {formatARS(o.precioTarjeta)}
                    </td>
                    <td className="px-3 py-3">
                      <CuotasChip
                        cuotas={o.cuotas}
                        sinInteres={o.cuotasSinInteres}
                      />
                    </td>
                    <td className="px-3 py-3 text-tinta-500">
                      {o.colocacionGratis ? (
                        <CuotasChip variant="colocacion" />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <a
                        href={outboundHref(o)}
                        target="_blank"
                        rel={outboundRel(o)}
                        onClick={() => trackClickTienda(o)}
                        className="inline-flex size-11 items-center justify-center rounded-full text-accion-600 opacity-70 transition-all duration-200 group-hover:opacity-100 hover:bg-accion-50 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
                        aria-label={`Ir a ${o.tiendaNombre}`}
                      >
                        <ArrowUpRight className="size-4" aria-hidden />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
