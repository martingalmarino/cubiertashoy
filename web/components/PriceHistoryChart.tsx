"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatARS } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { HistorialPunto } from "@/lib/types";

type Range = 30 | 90 | 180;

type PriceHistoryChartProps = {
  historial: HistorialPunto[];
  medidaLabel: string;
};

type ChartRow = {
  fecha: string;
  label: string;
  mediana: number;
  min: number;
  max: number;
  bandBase: number;
  bandSpread: number;
};

function formatShortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

/** Aproxima p25–p75 como banda entre min y max del día (sin cambiar cálculos). */
export function PriceHistoryChart({
  historial,
  medidaLabel,
}: PriceHistoryChartProps) {
  const [range, setRange] = useState<Range>(90);
  const ready = useIsClient();
  const reduceMotion = usePrefersReducedMotion();

  const data: ChartRow[] = useMemo(() => {
    const slice = historial.slice(-range);
    return slice.map((h) => {
      const span = Math.max(0, h.max - h.min);
      const bandBase = h.min + span * 0.25;
      const bandTop = h.min + span * 0.75;
      return {
        fecha: h.fecha,
        label: formatShortDate(h.fecha),
        mediana: h.mediana,
        min: h.min,
        max: h.max,
        bandBase,
        bandSpread: Math.max(0, bandTop - bandBase),
      };
    });
  }, [historial, range]);

  const minimoHistorico = useMemo(() => {
    if (data.length === 0) return null;
    return Math.min(...data.map((d) => d.min));
  }, [data]);

  const resumenTextual = useMemo(() => {
    if (data.length === 0) {
      return `No hay historial de precios para ${medidaLabel}.`;
    }
    const ultimo = data[data.length - 1]!;
    const min = Math.min(...data.map((d) => d.min));
    const max = Math.max(...data.map((d) => d.max));
    return `En los últimos ${range} días, la mediana de ${medidaLabel} terminó en ${formatARS(ultimo.mediana)}. El mínimo del período fue ${formatARS(min)} y el máximo ${formatARS(max)}.`;
  }, [data, medidaLabel, range]);

  const ranges: { value: Range; label: string }[] = [
    { value: 30, label: "30d" },
    { value: 90, label: "90d" },
    { value: 180, label: "180d" },
  ];

  return (
    <section
      aria-labelledby="historial-heading"
      className="rounded-xl border border-borde bg-superficie p-4 shadow-card sm:p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2
          id="historial-heading"
          className="text-xl font-semibold tracking-[-0.02em] text-tinta-900"
        >
          Historial de precios
        </h2>
        <div
          role="group"
          aria-label="Rango del historial"
          className="inline-flex rounded-full border border-borde bg-fondo p-1"
        >
          {ranges.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRange(r.value)}
              aria-pressed={range === r.value}
              className={cn(
                "min-h-9 rounded-full px-3 font-mono text-sm font-medium tabular-nums transition-colors duration-200",
                range === r.value
                  ? "bg-superficie text-tinta-900 shadow-card"
                  : "text-tinta-500 hover:text-tinta-900"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-fondo/60 p-1 sm:p-2">
        {!ready ? (
          <Skeleton className="h-64 w-full rounded-md skeleton-shimmer" />
        ) : data.length === 0 ? (
          <p className="flex h-64 items-center justify-center text-sm text-tinta-500">
            Sin historial para esta medida todavía.
          </p>
        ) : (
          <div className="h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="medianaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3E6AE1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3E6AE1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#E5E7EB"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#98A2B3", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                  minTickGap={28}
                />
                <YAxis
                  tick={{ fill: "#98A2B3", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={64}
                  tickFormatter={(v: number) =>
                    new Intl.NumberFormat("es-AR", {
                      notation: "compact",
                      maximumFractionDigits: 0,
                    }).format(v)
                  }
                />
                <Tooltip
                  cursor={{ stroke: "#98A2B3", strokeDasharray: "4 4" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as ChartRow;
                    return (
                      <div className="rounded-lg border border-borde bg-superficie px-3 py-2 text-xs shadow-card-hover">
                        <p className="mb-1 font-medium text-tinta-500">
                          {row.fecha}
                        </p>
                        <p className="font-mono text-sm font-bold tabular-nums text-tinta-900">
                          {formatARS(row.mediana)}
                        </p>
                        <p className="font-mono tabular-nums text-tinta-400">
                          {formatARS(row.min)} – {formatARS(row.max)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bandBase"
                  stackId="pband"
                  stroke="none"
                  fill="transparent"
                  isAnimationActive={!reduceMotion}
                  animationDuration={200}
                />
                <Area
                  type="monotone"
                  dataKey="bandSpread"
                  stackId="pband"
                  stroke="none"
                  fill="#EEF2FD"
                  isAnimationActive={!reduceMotion}
                  animationDuration={200}
                />
                <Area
                  type="monotone"
                  dataKey="mediana"
                  stroke="none"
                  fill="url(#medianaFill)"
                  isAnimationActive={!reduceMotion}
                  animationDuration={200}
                />
                <Line
                  type="monotone"
                  dataKey="mediana"
                  stroke="#3E6AE1"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={!reduceMotion}
                  animationDuration={200}
                />
                {minimoHistorico !== null && (
                  <ReferenceLine
                    y={minimoHistorico}
                    stroke="#0F8A5F"
                    strokeDasharray="4 4"
                    label={{
                      value: "mín. período",
                      position: "insideTopRight",
                      fill: "#0F8A5F",
                      fontSize: 11,
                    }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-tinta-500">{resumenTextual}</p>
    </section>
  );
}
