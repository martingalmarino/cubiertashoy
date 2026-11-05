type OfertasHoyLineProps = {
  nOfertas: number;
  nTiendas: number;
  actualizadoHaceHoras: number | null;
};

/** Una línea de contexto bajo el buscador. Sin cards ni iconos. */
export function OfertasHoyLine({
  nOfertas,
  nTiendas,
  actualizadoHaceHoras,
}: OfertasHoyLineProps) {
  if (nOfertas === 0) return null;

  const fecha =
    actualizadoHaceHoras == null
      ? "hoy"
      : actualizadoHaceHoras <= 0
        ? "hace instantes"
        : actualizadoHaceHoras === 1
          ? "hace 1 h"
          : `hace ${actualizadoHaceHoras} h`;

  return (
    <p className="text-sm text-tinta-500">
      Hoy comparamos{" "}
      <span className="font-mono tabular-nums">{nOfertas}</span> ofertas de{" "}
      <span className="font-mono tabular-nums">{nTiendas}</span>{" "}
      {nTiendas === 1 ? "tienda" : "tiendas"} · actualizado {fecha}
    </p>
  );
}
