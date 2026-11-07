"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PriceCard } from "@/components/PriceCard";
import { CuotasChip } from "@/components/CuotasChip";
import { DiscountBadge } from "@/components/DiscountBadge";
import { StoreLogo } from "@/components/StoreLogo";
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
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900">
          Todas las ofertas
        </h2>
        <div
          role="group"
          aria-label="Ordenar ofertas"
          className="grid h-10 w-full grid-cols-3 rounded-xl border border-borde bg-fondo p-1 sm:inline-flex sm:w-auto sm:rounded-full"
        >
          {sorts.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSortKey(s.key)}
              aria-pressed={sortKey === s.key}
              className={cn(
                "min-h-8 rounded-lg px-3 text-sm font-medium transition-colors sm:rounded-full",
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

      <ul className="grid min-w-0 gap-3 md:hidden">
        {sorted.map((o) => (
          <li key={o.id} className="min-w-0">
            <PriceCard oferta={o} destacada={o.id === cheapestId} />
          </li>
        ))}
      </ul>

      <div className="hidden rounded-xl border border-borde bg-superficie shadow-card md:block">
        <div className="max-h-[70vh] overflow-auto rounded-xl">
          <table className="w-full table-fixed border-collapse text-sm">
            <colgroup>
              <col style={{ width: "7.5rem" }} />
              <col />
              <col className="hidden lg:table-column" style={{ width: "4rem" }} />
              <col style={{ width: "6.75rem" }} />
              <col style={{ width: "6.75rem" }} />
              <col style={{ width: "7.25rem" }} />
              <col
                className="hidden lg:table-column"
                style={{ width: "5.75rem" }}
              />
              <col style={{ width: "9.75rem" }} />
            </colgroup>
            <thead className="sticky top-0 z-20">
              <tr className="border-b border-borde bg-fondo/95 text-left text-[11px] uppercase tracking-[0.08em] text-tinta-500 backdrop-blur">
                <th scope="col" className="px-3 py-3 align-middle font-medium">
                  Tienda
                </th>
                <th scope="col" className="px-3 py-3 align-middle font-medium">
                  Marca / Modelo
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3 align-middle font-medium lg:table-cell"
                >
                  Índice
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right align-middle font-medium"
                >
                  Efectivo
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right align-middle font-medium"
                >
                  Tarjeta
                </th>
                <th scope="col" className="px-3 py-3 align-middle font-medium">
                  Cuotas
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3 align-middle font-medium lg:table-cell"
                >
                  Coloc.
                </th>
                <th
                  scope="col"
                  className="sticky right-0 z-30 bg-fondo/95 px-3 py-3 text-right align-middle font-medium backdrop-blur"
                >
                  <span className="sr-only">Ver oferta</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((o) => {
                const barata = o.id === cheapestId;
                const cuotasChip = (
                  <CuotasChip
                    cuotas={o.cuotas}
                    sinInteres={o.cuotasSinInteres}
                    compact
                  />
                );
                return (
                  <tr
                    key={o.id}
                    className={cn(
                      "group border-b border-borde transition-colors last:border-0 hover:bg-fondo",
                      barata &&
                        "bg-ahorro-50/50 shadow-[inset_3px_0_0_var(--ahorro-600)] hover:bg-ahorro-50/50"
                    )}
                  >
                    <td className="px-3 py-2.5 align-middle">
                      <div className="flex h-8 items-center rounded-md bg-white px-1.5">
                        <StoreLogo
                          storeId={o.tiendaId}
                          nombre={o.tiendaNombre}
                          size="sm"
                        />
                        <span className="sr-only">{o.tiendaNombre}</span>
                      </div>
                    </td>
                    <td className="min-w-0 px-3 py-2.5 align-middle text-tinta-900">
                      <p
                        className="truncate font-medium"
                        title={`${o.marca} ${o.modelo}`}
                      >
                        {o.marca} {o.modelo}
                      </p>
                      {o.descuento ? (
                        <div className="mt-1">
                          <DiscountBadge kind={o.descuento} />
                        </div>
                      ) : null}
                    </td>
                    <td className="hidden px-3 py-2.5 align-middle font-mono tabular-nums text-tinta-500 lg:table-cell">
                      {o.indice}
                    </td>
                    <td className="px-3 py-2.5 text-right align-middle font-mono font-semibold tabular-nums whitespace-nowrap text-tinta-900">
                      {formatARS(o.precioEfectivo)}
                    </td>
                    <td className="px-3 py-2.5 text-right align-middle font-mono tabular-nums whitespace-nowrap text-tinta-500">
                      {formatARS(o.precioTarjeta)}
                    </td>
                    <td className="px-3 py-2.5 align-middle">
                      {cuotasChip ?? (
                        <span className="text-tinta-400">—</span>
                      )}
                    </td>
                    <td className="hidden px-3 py-2.5 align-middle text-tinta-500 lg:table-cell">
                      {o.colocacionGratis ? (
                        <CuotasChip variant="colocacion" compact />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td
                      className={cn(
                        "sticky right-0 z-10 px-3 py-2.5 text-right align-middle",
                        barata
                          ? "bg-ahorro-50/50 group-hover:bg-ahorro-50/50"
                          : "bg-superficie group-hover:bg-fondo"
                      )}
                    >
                      <a
                        href={outboundHref(o)}
                        target="_blank"
                        rel={outboundRel(o)}
                        onClick={() => trackClickTienda(o)}
                        aria-label={`Ver oferta en ${o.tiendaNombre}`}
                        className="inline-flex h-11 w-full max-w-[9rem] items-center justify-center gap-1.5 rounded-lg bg-accion-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-accion-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
                      >
                        Ver oferta
                        <ArrowUpRight className="size-4 shrink-0" aria-hidden />
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
