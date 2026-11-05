"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Line,
  LineChart,
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
  const stroke = baja ? "#0F8A5F" : sube ? "#CC0C39" : "#3E6AE1";

  return (
    <motion.div whileHover={reduce ? undefined : { y: -2 }} className="h-full">
      <Link
        href={`/medida/${medida.slug}`}
        className="group flex h-full flex-col rounded-lg border border-borde bg-superficie p-4 shadow-card transition-shadow duration-200 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-md border border-borde bg-fondo text-tinta-700">
            <TireIcon className="size-4" />
          </span>
          <p className="font-mono text-lg font-bold tabular-nums tracking-tight text-tinta-900">
            {medida.label}
          </p>
        </div>

        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500">
          Desde
        </p>
        <p className="font-mono text-lg font-bold tabular-nums text-tinta-900">
          {medida.precioDesde !== null ? formatARS(medida.precioDesde) : "—"}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {variacion !== null && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-xs font-medium tabular-nums",
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
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={stroke}
                  strokeWidth={1.75}
                  dot={false}
                  isAnimationActive={!reduce}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
