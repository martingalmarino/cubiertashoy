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
  /** max - min, apilado sobre min para banda */
  spread: number;
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

export function PriceHistoryChart({
  historial,
  medidaLabel,
}: PriceHistoryChartProps) {
  const [range, setRange] = useState<Range>(90);
  const ready = useIsClient();
  const reduceMotion = usePrefersReducedMotion();

  const data: ChartRow[] = useMemo(() => {
    const slice = historial.slice(-range);
    return slice.map((h) => ({
      fecha: h.fecha,
      label: formatShortDate(h.fecha),
      mediana: h.mediana,
      min: h.min,
      max: h.max,
      spread: Math.max(0, h.max - h.min),
    }));
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
    <section aria-labelledby="historial-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2
          id="historial-heading"
          className="font-display text-xl font-semibold tracking-[-0.02em] text-asfalto-950"
        >
          Historial de precios
        </h2>
        <div
          role="group"
          aria-label="Rango del historial"
          className="inline-flex rounded-md border border-niebla-200 bg-niebla-100 p-1"
        >
          {ranges.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRange(r.value)}
              aria-pressed={range === r.value}
              className={cn(
                "min-h-9 rounded-sm px-3 font-mono text-sm font-medium tabular-nums transition-colors duration-200",
                range === r.value
                  ? "bg-white text-asfalto-950 shadow-sm"
                  : "text-asfalto-600 hover:text-asfalto-950"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-niebla-200 bg-white p-3 sm:p-4">
        {!ready ? (
          <Skeleton className="h-64 w-full rounded-md bg-niebla-100" />
        ) : data.length === 0 ? (
          <p className="flex h-64 items-center justify-center text-sm text-asfalto-600">
            Sin historial para esta medida todavía.
          </p>
        ) : (
          <div className="h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#E3E7EB"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#3A4552", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#E3E7EB" }}
                  minTickGap={28}
                />
                <YAxis
                  tick={{ fill: "#3A4552", fontSize: 11 }}
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
                  cursor={{ stroke: "#8A96A3", strokeDasharray: "4 4" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as ChartRow;
                    return (
                      <div className="rounded-md bg-asfalto-800 px-3 py-2 text-xs text-papel shadow-md">
                        <p className="mb-1 font-medium">{row.fecha}</p>
                        <p className="font-mono tabular-nums">
                          Mediana {formatARS(row.mediana)}
                        </p>
                        <p className="font-mono tabular-nums text-grafito-400">
                          {formatARS(row.min)} – {formatARS(row.max)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="min"
                  stackId="band"
                  stroke="none"
                  fill="transparent"
                  isAnimationActive={!reduceMotion}
                  animationDuration={200}
                />
                <Area
                  type="monotone"
                  dataKey="spread"
                  stackId="band"
                  stroke="none"
                  fill="#2457D6"
                  fillOpacity={0.12}
                  isAnimationActive={!reduceMotion}
                  animationDuration={200}
                />
                <Line
                  type="monotone"
                  dataKey="mediana"
                  stroke="#2457D6"
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

      <p className="mt-3 text-sm text-asfalto-600">{resumenTextual}</p>
    </section>
  );
}
