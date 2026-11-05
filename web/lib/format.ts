const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/** Precio en pesos argentinos, sin decimales (por unidad). Espacio fino tras $. */
export function formatARS(n: number): string {
  return arsFormatter.format(n).replace(/\$\s?/, "$\u202F");
}

/** Compacto para chips mobile: `$75k`, `$1,2M`. */
export function formatARSCompact(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const label =
      m >= 10
        ? String(Math.round(m))
        : m
            .toFixed(1)
            .replace(".", ",")
            .replace(/,0$/, "");
    return `$\u202F${label}M`;
  }
  return `$\u202F${Math.round(n / 1000)}k`;
}

/** Mediana de una lista de enteros (vacía → null). */
export function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1]! + sorted[mid]!) / 2)
    : sorted[mid]!;
}
