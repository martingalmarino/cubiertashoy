import { formatARS } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MedidaResumen } from "@/lib/data";

type ResumenCardProps = {
  resumen: MedidaResumen;
  precioBarato: number | null;
  maximo90d: number | null;
};

export function ResumenCard({
  resumen,
  precioBarato,
  maximo90d,
}: ResumenCardProps) {
  const t = resumen.tendencia30d;
  const baja = t !== null && t < -0.5;
  const sube = t !== null && t > 0.5;

  const min = resumen.minimo90d;
  const max = maximo90d;
  let thermo = 50;
  if (precioBarato != null && min != null && max != null && max > min) {
    thermo = Math.min(
      100,
      Math.max(0, ((precioBarato - min) / (max - min)) * 100)
    );
  }

  return (
    <aside className="rounded-xl border border-borde bg-superficie p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500">
        Resumen
      </p>
      <dl className="mt-4 space-y-4">
        <div>
          <dt className="text-sm text-tinta-500">Mediana hoy</dt>
          <dd className="font-mono text-2xl font-semibold tabular-nums text-tinta-900">
            {resumen.medianaHoy !== null ? formatARS(resumen.medianaHoy) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-tinta-500">Mínimo 90 días</dt>
          <dd className="font-mono text-xl font-medium tabular-nums text-tinta-900">
            {resumen.minimo90d !== null ? formatARS(resumen.minimo90d) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-tinta-500">Tendencia 30 días</dt>
          <dd
            className={cn(
              "font-mono text-xl font-medium tabular-nums",
              baja && "text-ahorro-600",
              sube && "text-oferta-600",
              !baja && !sube && "text-tinta-900"
            )}
          >
            {t === null
              ? "—"
              : `${baja ? "↓" : sube ? "↑" : "→"} ${Math.abs(t).toFixed(1)}%`}
          </dd>
        </div>
      </dl>

      {min != null && max != null && precioBarato != null && (
        <div className="mt-6">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500">
            Más barato vs rango 90 días
          </p>
          <div className="relative h-2 rounded-full bg-fondo">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-accion-600/35"
              style={{ width: `${thermo}%` }}
            />
            <span
              className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ahorro-600 shadow-card"
              style={{ left: `${thermo}%` }}
              title={formatARS(precioBarato)}
            />
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-xs tabular-nums text-tinta-500">
            <span>{formatARS(min)}</span>
            <span>{formatARS(max)}</span>
          </div>
        </div>
      )}
    </aside>
  );
}
