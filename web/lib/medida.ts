import type { MedidaParsed } from "@/lib/types";

/**
 * Acepta formatos comunes: "175/65 R14", "175-65-r14", "175 65 14".
 */
export function parseMedida(input: string): MedidaParsed | null {
  const raw = input.trim().toLowerCase().replace(/,/g, ".");
  if (!raw) return null;

  // 175/65 R14 | 175-65-r14 | 175 65 14 | 175/65R14
  const match = raw.match(/(\d{3})\D+(\d{2})\D*?(\d{2})\b/);
  if (!match) return null;

  const ancho = Number(match[1]);
  const perfil = Number(match[2]);
  const rodado = Number(match[3]);

  if (!Number.isFinite(ancho) || !Number.isFinite(perfil) || !Number.isFinite(rodado)) {
    return null;
  }
  if (ancho < 100 || ancho > 400) return null;
  if (perfil < 20 || perfil > 90) return null;
  if (rodado < 10 || rodado > 30) return null;

  return {
    ancho,
    perfil,
    rodado,
    slug: `${ancho}-${perfil}-r${rodado}`,
    label: `${ancho}/${perfil} R${rodado}`,
  };
}

export function toSlug(ancho: number, perfil: number, rodado: number): string {
  return `${ancho}-${perfil}-r${rodado}`;
}

export function toLabel(ancho: number, perfil: number, rodado: number): string {
  return `${ancho}/${perfil} R${rodado}`;
}
