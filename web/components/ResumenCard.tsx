import { formatARS } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MedidaResumen } from "@/lib/data";

type ResumenCardProps = {
  resumen: MedidaResumen;
};

export function ResumenCard({ resumen }: ResumenCardProps) {
  const t = resumen.tendencia30d;
  const baja = t !== null && t < -0.5;
  const sube = t !== null && t > 0.5;

  return (
    <aside className="rounded-lg border border-niebla-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-asfalto-600">
        Resumen
      </p>
      <dl className="mt-4 space-y-4">
        <div>
          <dt className="text-sm text-asfalto-600">Mediana hoy</dt>
          <dd className="font-mono text-2xl font-semibold tabular-nums text-asfalto-950">
            {resumen.medianaHoy !== null ? formatARS(resumen.medianaHoy) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-asfalto-600">Mínimo 90 días</dt>
          <dd className="font-mono text-xl font-medium tabular-nums text-asfalto-950">
            {resumen.minimo90d !== null ? formatARS(resumen.minimo90d) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-asfalto-600">Tendencia 30 días</dt>
          <dd
            className={cn(
              "font-mono text-xl font-medium tabular-nums",
              baja && "text-verde-600",
              sube && "text-rojo-600",
              !baja && !sube && "text-asfalto-950"
            )}
          >
            {t === null
              ? "—"
              : `${baja ? "↓" : sube ? "↑" : "→"} ${Math.abs(t).toFixed(1)}%`}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
