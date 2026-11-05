import medidasJson from "@/data/medidas.json";
import ofertasJson from "@/data/ofertas-ejemplo.json";
import autosJson from "@/data/autos-medidas.json";
import { percentile } from "@/lib/stats";
import type {
  AutoMedida,
  DiscountKind,
  HistorialPunto,
  Medida,
  Oferta,
  OfertaEnriquecida,
} from "@/lib/types";

const medidas = medidasJson.medidas as Medida[];
const ofertas = ofertasJson.ofertas as Oferta[];
const historial = ofertasJson.historial as HistorialPunto[];
const autos = autosJson.autos as AutoMedida[];

export function getMedidas(): Medida[] {
  return [...medidas].sort((a, b) => a.prioridad - b.prioridad);
}

export function getMedida(slug: string): Medida | undefined {
  return medidas.find((m) => m.slug === slug);
}

export function getHistorial(slug: string): HistorialPunto[] {
  return historial
    .filter((h) => h.medidaSlug === slug)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

/** Inflado si precio_anterior > p75 del historial de 90 días. */
export function classifyDiscount(
  precioAnterior: number | undefined,
  historial90: HistorialPunto[]
): DiscountKind {
  if (precioAnterior == null) return null;
  const p75 = percentile(
    historial90.map((h) => h.mediana),
    0.75
  );
  if (p75 == null) return null;
  return precioAnterior > p75 ? "inflado" : "real";
}

export function getOfertas(slug: string): OfertaEnriquecida[] {
  const hist = getHistorial(slug);
  const hist90 = hist.slice(-90);
  return ofertas
    .filter((o) => o.medidaSlug === slug)
    .map((o) => ({
      ...o,
      descuento: classifyDiscount(o.precioAnterior, hist90),
    }))
    .sort((a, b) => a.precioEfectivo - b.precioEfectivo);
}

export function getPrecioDesde(slug: string): number | null {
  const list = getOfertas(slug);
  if (list.length === 0) return null;
  return list[0]!.precioEfectivo;
}

/** Variación semanal aproximada vs mediana de hace 7 días. */
export function getVariacionSemanal(slug: string): number | null {
  const hist = getHistorial(slug);
  if (hist.length < 8) return null;
  const hoy = hist[hist.length - 1]!;
  const hace7 = hist[hist.length - 8]!;
  if (hace7.mediana === 0) return null;
  return ((hoy.mediana - hace7.mediana) / hace7.mediana) * 100;
}

export function getMedidasPopulares(limit = 6): Medida[] {
  return getMedidas().slice(0, limit);
}

export type MedidaCardData = Medida & {
  precioDesde: number | null;
  variacionSemanal: number | null;
};

export function getMedidasMasBuscadas(limit = 8): MedidaCardData[] {
  return getMedidas()
    .slice(0, limit)
    .map((m) => ({
      ...m,
      precioDesde: getPrecioDesde(m.slug),
      variacionSemanal: getVariacionSemanal(m.slug),
    }));
}

export type MedidaResumen = {
  medianaHoy: number | null;
  minimo90d: number | null;
  tendencia30d: number | null;
  ofertasCount: number;
  tiendasCount: number;
  actualizadoHaceHoras: number | null;
};

export function getMedidaResumen(slug: string): MedidaResumen {
  const of = getOfertas(slug);
  const hist = getHistorial(slug);
  const hoy = hist[hist.length - 1] ?? null;
  const hist90 = hist.slice(-90);
  const hist30 = hist.slice(-30);
  const hace30 = hist30[0] ?? null;

  let tendencia30d: number | null = null;
  if (hoy && hace30 && hace30.mediana > 0) {
    tendencia30d = ((hoy.mediana - hace30.mediana) / hace30.mediana) * 100;
  }

  const minimo90d =
    hist90.length > 0 ? Math.min(...hist90.map((h) => h.min)) : null;

  const tiendas = new Set(of.map((o) => o.tiendaId));
  const actualizadoHaceHoras =
    of.length > 0
      ? Math.min(...of.map((o) => o.actualizadoHaceHoras))
      : null;

  return {
    medianaHoy: hoy?.mediana ?? null,
    minimo90d,
    tendencia30d,
    ofertasCount: of.length,
    tiendasCount: tiendas.size,
    actualizadoHaceHoras,
  };
}

/** Mismo rodado, ±10 ancho o ±5 perfil (excluye la actual). */
export function getMedidasParecidas(slug: string, limit = 6): Medida[] {
  const actual = getMedida(slug);
  if (!actual) return [];
  return getMedidas()
    .filter((m) => {
      if (m.slug === slug) return false;
      if (m.rodado !== actual.rodado) return false;
      const dAncho = Math.abs(m.ancho - actual.ancho);
      const dPerfil = Math.abs(m.perfil - actual.perfil);
      return dAncho <= 10 || dPerfil <= 5;
    })
    .slice(0, limit);
}

export function getAutosPorMedida(slug: string): AutoMedida[] {
  return autos.filter((a) => a.medidaSlug === slug);
}
