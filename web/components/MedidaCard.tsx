"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { TireIcon } from "@/components/visual/TireIcon";
import { formatARS } from "@/lib/format";
import type { MedidaCardData } from "@/lib/data";
import { cn } from "@/lib/utils";

type MedidaCardProps = {
  medida: MedidaCardData;
  sparkline?: number[];
  tiendasCount?: number;
};

export function MedidaCard({
  medida,
  sparkline = [],
  tiendasCount,
}: MedidaCardProps) {
  const reduce = useReducedMotion();
  const variacion = medida.variacionSemanal;
  const baja = variacion !== null && variacion < -0.3;
  const sube = variacion !== null && variacion > 0.3;
  const chartData = sparkline.map((v, i) => ({ i, v }));
  const stroke = baja ? "#0F8A5F" : sube ? "#CC0C39" : "#98A2B3";
  const gradId = `spark-${medida.slug}`;

  return (
    <motion.div whileHover={reduce ? undefined : { y: -2 }} className="h-full">
      <Link
        href={`/medida/${medida.slug}`}
        className="group flex h-full flex-col rounded-lg border border-borde bg-superficie p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-fondo text-tinta-700">
            <TireIcon className="size-4" />
          </span>
          <p className="font-mono text-base font-semibold tabular-nums tracking-tight text-tinta-900">
            {medida.label}
          </p>
        </div>

        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500">
          Desde
        </p>
        <p className="font-mono text-xl font-bold tabular-nums text-tinta-900">
          {medida.precioDesde !== null ? formatARS(medida.precioDesde) : "—"}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {variacion !== null && (
            <span
              className={cn(
                "inline-flex h-6 items-center rounded-md px-2 font-mono text-xs font-semibold tabular-nums",
                baja && "bg-ahorro-50 text-ahorro-600",
                sube && "bg-oferta-50 text-oferta-600",
                !baja && !sube && "bg-fondo text-tinta-500"
              )}
            >
              {baja ? "↓" : sube ? "↑" : "→"} {Math.abs(variacion).toFixed(1)}%
            </span>
          )}
          {tiendasCount != null && (
            <span className="text-xs text-tinta-500">
              <span className="font-mono tabular-nums">{tiendasCount}</span>{" "}
              {tiendasCount === 1 ? "tienda" : "tiendas"}
            </span>
          )}
        </div>

        {chartData.length > 1 && (
          <div className="mt-3 h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stroke} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={stroke}
                  strokeWidth={2}
                  fill={`url(#${gradId})`}
                  dot={false}
                  activeDot={{ r: 2.5, strokeWidth: 0, fill: stroke }}
                  isAnimationActive={!reduce}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
