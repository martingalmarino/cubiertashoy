import { StoreLogo } from "@/components/StoreLogo";

export type TiendaResumen = {
  id: string;
  nombre: string;
  ofertas: number;
};

type TiendasRowProps = {
  tiendas: TiendaResumen[];
};

export function TiendasRow({ tiendas }: TiendasRowProps) {
  if (tiendas.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiendas.map((t) => (
        <li
          key={t.id}
          className="rounded-xl border border-borde bg-superficie p-4 shadow-card"
        >
          <div className="grid h-16 w-full place-items-center rounded-lg bg-white px-3">
            <StoreLogo storeId={t.id} nombre={t.nombre} size="lg" />
          </div>
          <p className="mt-4 rounded-lg bg-fondo px-3 py-2 text-sm text-tinta-500">
            <span className="font-mono font-semibold tabular-nums text-tinta-900">
              {t.ofertas}
            </span>{" "}
            {t.ofertas === 1 ? "oferta" : "ofertas"}
          </p>
        </li>
      ))}
    </ul>
  );
}
