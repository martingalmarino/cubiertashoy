import Image from "next/image";
import { ArrowRight } from "lucide-react";

export type TiendaResumen = {
  id: string;
  nombre: string;
  ofertas: number;
};

type TiendasRowProps = {
  tiendas: TiendaResumen[];
};

const LOGO_BY_ID: Record<string, string> = {
  norauto: "/logos/norauto.svg",
  naldo: "/logos/naldo.svg",
  neumaflores: "/logos/neumaflores.svg",
  "360-neumaticos": "/logos/360-neumaticos.svg",
};

export function TiendasRow({ tiendas }: TiendasRowProps) {
  if (tiendas.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiendas.map((t) => {
        const logo = LOGO_BY_ID[t.id];
        return (
          <article
            key={t.id}
            className="rounded-xl border border-borde bg-superficie p-4 shadow-card"
          >
            <div className="grid h-12 w-full place-items-center">
              {logo ? (
                <Image
                  src={logo}
                  alt={t.nombre}
                  width={140}
                  height={28}
                  className="max-h-8 w-auto object-contain"
                />
              ) : (
                <span className="font-sans text-sm font-semibold text-tinta-900">
                  {t.nombre}
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-fondo px-3 py-2 text-sm">
              <span className="text-tinta-500">
                <span className="font-mono font-semibold tabular-nums text-tinta-900">
                  {t.ofertas}
                </span>{" "}
                ofertas
              </span>
              <span
                className="inline-flex size-8 items-center justify-center rounded-full bg-superficie text-tinta-700 shadow-card"
                aria-hidden
              >
                <ArrowRight className="size-3.5" />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
