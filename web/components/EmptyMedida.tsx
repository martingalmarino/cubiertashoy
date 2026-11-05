import Link from "next/link";
import { FlatTire } from "@/components/visual/FlatTire";
import type { Medida } from "@/lib/types";

type EmptyMedidaProps = {
  label: string;
  parecidas: Medida[];
};

export function EmptyMedida({ label, parecidas }: EmptyMedidaProps) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-borde bg-superficie px-6 py-10 text-center shadow-card">
      <FlatTire className="mx-auto h-24 w-auto text-tinta-400" />
      <h2 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-tinta-900">
        Todavía no tenemos precios para {label}
      </h2>
      <p className="mt-2 text-sm text-tinta-500">
        Estamos sumando tiendas. Podés mirar medidas parecidas o avisarte cuando
        haya (pronto).
      </p>
      <button
        type="button"
        disabled
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-accion-50 px-5 text-sm font-semibold text-accion-600 opacity-70"
      >
        Avisame cuando haya
      </button>
      {parecidas.length > 0 && (
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {parecidas.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/medida/${m.slug}`}
                className="inline-flex min-h-11 items-center rounded-md border border-borde bg-superficie px-3 font-mono text-sm font-semibold tabular-nums text-tinta-900 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
              >
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
