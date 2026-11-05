const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/** Precio en pesos argentinos, sin decimales (por unidad). */
export function formatARS(n: number): string {
  return arsFormatter.format(n);
}
