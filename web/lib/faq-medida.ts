export function getMedidaFaqItems(medidaLabel: string) {
  return [
    {
      q: `¿Cuánto sale una cubierta ${medidaLabel} hoy?`,
      a: `En esta página ves el precio más bajo del día por unidad, la mediana y el historial de ${medidaLabel}. Los precios vienen de tiendas y pueden cambiar: verificá en la ficha antes de comprar.`,
    },
    {
      q: "¿El precio es por unidad o por kit?",
      a: "Siempre por unidad. Si la tienda publica kit x2 o x4, dividimos para comparar igual.",
    },
    {
      q: "¿Qué significa descuento real o inflado?",
      a: "Comparamos el precio “antes” con el percentil 75 del historial de 90 días. Si el “antes” está por encima, marcamos descuento inflado.",
    },
    {
      q: "¿Puedo financiar en cuotas?",
      a: "Donde la tienda lo ofrece, mostramos cantidad de cuotas y si son sin interés. Confirmá en el sitio de la tienda al comprar.",
    },
  ] as const;
}
