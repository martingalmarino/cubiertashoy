import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";

export type TiendaResumen = {
  id: string;
  nombre: string;
  ofertas: number;
};

type TiendasRowProps = {
  tiendas: TiendaResumen[];
};

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function TiendasRow({ tiendas }: TiendasRowProps) {
  if (tiendas.length === 0) return null;

  return (
    <FadeIn>
      <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiendas.map((t) => (
          <StaggerItem key={t.id}>
            <article className="rounded-xl border border-borde bg-superficie p-4 shadow-card">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-md border border-borde bg-fondo font-mono text-xs font-bold text-tinta-700">
                  {iniciales(t.nombre)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-tinta-700">
                    {t.nombre}
                  </p>
                  <p className="mt-1 rounded-md bg-fondo px-2 py-1 font-mono text-xs tabular-nums text-tinta-500">
                    {t.ofertas} ofertas →
                  </p>
                </div>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </FadeIn>
  );
}
