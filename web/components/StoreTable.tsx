"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDown, ArrowUp } from "lucide-react";
import { PriceCard } from "@/components/PriceCard";
import { CuotasChip } from "@/components/CuotasChip";
import { DiscountBadge } from "@/components/DiscountBadge";
import { formatARS } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OfertaEnriquecida } from "@/lib/types";

type SortKey = "efectivo" | "tarjeta";

type StoreTableProps = {
  ofertas: OfertaEnriquecida[];
};

export function StoreTable({ ofertas }: StoreTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("efectivo");
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const list = [...ofertas];
    list.sort((a, b) => {
      const av = sortKey === "efectivo" ? a.precioEfectivo : a.precioTarjeta;
      const bv = sortKey === "efectivo" ? b.precioEfectivo : b.precioTarjeta;
      return asc ? av - bv : bv - av;
    });
    return list;
  }, [ofertas, sortKey, asc]);

  const cheapestId =
    [...ofertas].sort((a, b) => a.precioEfectivo - b.precioEfectivo)[0]?.id ??
    null;

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      setAsc(true);
    }
  }

  const SortIcon = asc ? ArrowUp : ArrowDown;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-asfalto-950">
          Todas las ofertas
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-asfalto-600">Ordenar:</span>
          <button
            type="button"
            onClick={() => toggleSort("efectivo")}
            className={cn(
              "inline-flex min-h-11 items-center gap-1 rounded-md border px-3 font-medium transition-colors",
              sortKey === "efectivo"
                ? "border-asfalto-950 bg-asfalto-950 text-papel"
                : "border-niebla-200 bg-white text-asfalto-950 hover:bg-niebla-100"
            )}
          >
            Efectivo
            {sortKey === "efectivo" && (
              <SortIcon className="size-3.5" aria-hidden />
            )}
          </button>
          <button
            type="button"
            onClick={() => toggleSort("tarjeta")}
            className={cn(
              "inline-flex min-h-11 items-center gap-1 rounded-md border px-3 font-medium transition-colors",
              sortKey === "tarjeta"
                ? "border-asfalto-950 bg-asfalto-950 text-papel"
                : "border-niebla-200 bg-white text-asfalto-950 hover:bg-niebla-100"
            )}
          >
            Tarjeta
            {sortKey === "tarjeta" && (
              <SortIcon className="size-3.5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile: cards */}
      <ul className="grid gap-3 md:hidden">
        {sorted.map((o) => (
          <li key={o.id}>
            <PriceCard oferta={o} destacada={o.id === cheapestId} />
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-lg border border-niebla-200 md:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-niebla-200 bg-niebla-100 text-left text-asfalto-600">
              <th scope="col" className="px-3 py-3 font-medium">
                Tienda
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Marca / Modelo
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Índice
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("efectivo")}
                  className="inline-flex items-center gap-1 hover:text-asfalto-950"
                >
                  Efectivo
                  {sortKey === "efectivo" && (
                    <SortIcon className="size-3.5" aria-hidden />
                  )}
                </button>
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("tarjeta")}
                  className="inline-flex items-center gap-1 hover:text-asfalto-950"
                >
                  Tarjeta
                  {sortKey === "tarjeta" && (
                    <SortIcon className="size-3.5" aria-hidden />
                  )}
                </button>
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
                    "group border-b border-niebla-200 transition-shadow duration-200 ease-[var(--ease-brand)] last:border-0 hover:bg-white hover:shadow-sm",
                    barata && "bg-verde-50 hover:bg-verde-50"
                  )}
                >
                  <td className="px-3 py-3 font-medium text-asfalto-950">
                    {o.tiendaNombre}
                  </td>
                  <td className="px-3 py-3 text-asfalto-950">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>
                        {o.marca} {o.modelo}
                      </span>
                      {o.descuento && <DiscountBadge kind={o.descuento} />}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums text-asfalto-600">
                    {o.indice}
                  </td>
                  <td className="px-3 py-3 font-mono font-semibold tabular-nums text-asfalto-950">
                    {formatARS(o.precioEfectivo)}
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums text-asfalto-600">
                    {formatARS(o.precioTarjeta)}
                  </td>
                  <td className="px-3 py-3">
                    <CuotasChip
                      cuotas={o.cuotas}
                      sinInteres={o.cuotasSinInteres}
                    />
                  </td>
                  <td className="px-3 py-3 text-asfalto-600">
                    {o.colocacionGratis ? (
                      <CuotasChip variant="colocacion" />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-azul-600 opacity-70 transition-all duration-200 ease-[var(--ease-brand)] group-hover:translate-x-0.5 group-hover:opacity-100 hover:bg-niebla-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-600"
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
  );
}
