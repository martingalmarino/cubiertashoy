import Link from "next/link";
import { formatARS } from "@/lib/format";
import type { AutoPopular } from "@/lib/data";

export type AutoPopularCard = AutoPopular & {
  precioDesde: number | null;
};

type AutosPopularesProps = {
  autos: AutoPopularCard[];
};

/** Grilla de autos frecuentes → /auto/[slug]. No renderiza si hay menos de 4. */
export function AutosPopulares({ autos }: AutosPopularesProps) {
  if (autos.length < 4) return null;

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
            Autos populares
          </h2>
          <p className="mt-2 text-tinta-500">
            Medida habitual y precio desde por unidad.
          </p>
        </div>
        <Link
          href="/auto"
          className="hidden shrink-0 text-sm font-medium text-tinta-900 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-accion-600 md:inline"
        >
          Ver todos →
        </Link>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {autos.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/auto/${a.slug}`}
              className="flex h-full min-h-28 flex-col rounded-xl border border-borde bg-superficie p-4 shadow-card transition-shadow duration-200 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
            >
              <p className="text-xs font-medium uppercase tracking-[0.06em] text-tinta-500">
                {a.marca}
              </p>
              <p className="mt-0.5 text-base font-semibold tracking-[-0.02em] text-tinta-900">
                {a.modelo}
              </p>
              <p className="mt-3 font-mono text-sm font-semibold tabular-nums text-tinta-800">
                {a.medidaLabel}
              </p>
              {a.precioDesde != null ? (
                <p className="mt-1 font-mono text-sm tabular-nums text-tinta-500">
                  desde {formatARS(a.precioDesde)}
                </p>
              ) : (
                <p className="mt-1 text-sm text-tinta-400">Sin precio hoy</p>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/auto"
        className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border border-borde bg-superficie text-sm font-medium text-tinta-900 transition-colors hover:border-accion-600 focus-visible:ring-2 focus-visible:ring-accion-600 md:hidden"
      >
        Ver todos los autos
      </Link>
    </div>
  );
}
