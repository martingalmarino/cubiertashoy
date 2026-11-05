import Link from "next/link";
import { formatARS } from "@/lib/format";
import { cn } from "@/lib/utils";

export type PopularMedida = {
  slug: string;
  label: string;
  precioDesde: number | null;
};

type PopularesBandProps = {
  medidas: PopularMedida[];
};

export function PopularesBand({ medidas }: PopularesBandProps) {
  const mobile = medidas.slice(0, 9);

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-pastel-rosa via-pastel-lila to-pastel-lila p-5 ring-1 ring-black/5 md:p-7">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-tinta-900 md:text-xl">
            Medidas populares
          </h2>
          <p className="mt-1 text-sm text-tinta-700/80">
            Las más buscadas esta semana
          </p>
        </div>
        <Link
          href="/medidas"
          className="hidden shrink-0 text-sm font-medium text-tinta-900 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-accion-600 md:inline"
        >
          Ver todas →
        </Link>
      </div>

      <ul className="grid grid-cols-3 gap-2 md:hidden">
        {mobile.map((m) => (
          <li key={m.slug} className="min-w-0">
            <PopularChip medida={m} />
          </li>
        ))}
      </ul>

      <ul className="hidden grid-cols-4 gap-2 md:grid lg:grid-cols-6">
        {medidas.map((m) => (
          <li key={m.slug} className="min-w-0">
            <PopularChip medida={m} />
          </li>
        ))}
      </ul>

      <Link
        href="/medidas"
        className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-white/70 text-sm font-medium text-tinta-900 transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-accion-600 md:hidden"
      >
        Ver todas las medidas
      </Link>
    </div>
  );
}

function PopularChip({ medida }: { medida: PopularMedida }) {
  const hasPrice = medida.precioDesde != null;
  return (
    <Link
      href={`/medida/${medida.slug}`}
      className={cn(
        "flex h-14 flex-col justify-center rounded-xl bg-white px-3 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2",
        hasPrice ? "items-start" : "items-center"
      )}
    >
      <span className="font-mono text-sm font-semibold tabular-nums whitespace-nowrap text-tinta-900">
        {medida.label}
      </span>
      {hasPrice ? (
        <span className="mt-0.5 font-mono text-xs tabular-nums text-tinta-500">
          desde {formatARS(medida.precioDesde!)}
        </span>
      ) : null}
    </Link>
  );
}
