import Link from "next/link";
import { formatARS } from "@/lib/format";
import type { MedidaCardData } from "@/lib/data";
import { cn } from "@/lib/utils";

type MedidaCardProps = {
  medida: MedidaCardData;
};

export function MedidaCard({ medida }: MedidaCardProps) {
  const variacion = medida.variacionSemanal;
  const baja = variacion !== null && variacion < -0.3;
  const sube = variacion !== null && variacion > 0.3;

  return (
    <Link
      href={`/medida/${medida.slug}`}
      className="group flex flex-col rounded-lg border border-niebla-200 bg-white p-4 shadow-sm transition-all duration-200 ease-[var(--ease-brand)] hover:border-grafito-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-600"
    >
      <p className="font-mono text-lg font-bold tabular-nums tracking-tight text-asfalto-950 sm:text-xl">
        {medida.label}
      </p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-asfalto-600">
        Desde
      </p>
      <p className="font-mono text-xl font-semibold tabular-nums text-asfalto-950">
        {medida.precioDesde !== null ? formatARS(medida.precioDesde) : "—"}
      </p>
      {variacion !== null && (
        <p
          className={cn(
            "mt-2 font-mono text-sm tabular-nums",
            baja && "text-verde-600",
            sube && "text-rojo-600",
            !baja && !sube && "text-asfalto-600"
          )}
        >
          {baja ? "↓" : sube ? "↑" : "→"} {Math.abs(variacion).toFixed(1)}%
          semana
        </p>
      )}
    </Link>
  );
}
