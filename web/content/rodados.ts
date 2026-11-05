/** Configuración editorial SEO de páginas /rodado/{n}. Solo 13–18. */

export const SEO_RODADOS = [13, 14, 15, 16, 17, 18] as const;

export type SeoRodado = (typeof SEO_RODADOS)[number];

export type RodadoSeoSection = {
  title: string;
  paragraphs: [string, string];
};

export type RodadoSeoFaq = {
  q: string;
  a: string;
};

export type RodadoSeoCopy = {
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  listadoH2: string;
  secciones: RodadoSeoSection[];
  faqsTitle: string;
  faqs: RodadoSeoFaq[];
  otrosRodadosH2: string;
};

const INTROS: Record<SeoRodado, string> = {
  13: "Compará precios de cubiertas rodado 13 en tiendas de Argentina. Elegí la medida completa de tus neumáticos R13 para consultar las opciones y evaluar dónde comprar. Además del rodado, verificá el ancho y el perfil indicados para tu vehículo.",
  14: "Encontrá tu medida de neumáticos rodado 14 y compará precios entre tiendas de Argentina. Las cubiertas R14 pueden tener distintos anchos y perfiles: seleccioná la medida indicada para tu vehículo antes de comparar las opciones.",
  15: "Consultá medidas de cubiertas rodado 15 y compará precios en tiendas de Argentina. Para elegir tus neumáticos R15, identificá primero el ancho y el perfil que necesita tu vehículo y luego revisá las alternativas de esa misma medida.",
  16: "Compará cubiertas rodado 16 a partir de la medida que necesita tu vehículo. Elegí el ancho y el perfil de tus neumáticos R16 para consultar precios en tiendas de Argentina y revisar las características de cada opción.",
  17: "Buscá neumáticos rodado 17 por medida y compará precios entre tiendas de Argentina. Antes de elegir una cubierta R17, comprobá que su ancho, perfil e índices de carga y velocidad correspondan a las especificaciones de tu vehículo.",
  18: "Explorá las medidas de cubiertas rodado 18 y consultá precios en tiendas de Argentina. Seleccioná la medida completa de tus neumáticos R18 para comparar opciones y revisá las condiciones de cada publicación antes de comprar.",
};

function isSeoRodado(n: number): n is SeoRodado {
  return (SEO_RODADOS as readonly number[]).includes(n);
}

function buildSecciones(n: number): RodadoSeoSection[] {
  return [
    {
      title: `Cómo elegir cubiertas rodado ${n}`,
      paragraphs: [
        `Para buscar cubiertas rodado ${n}, empezá por identificar la medida completa indicada para tu vehículo. El diámetro de llanta es solo una parte: también debés comprobar el ancho, el perfil y los índices de carga y velocidad.`,
        "Consultá las especificaciones del fabricante en el manual o en la etiqueta del vehículo. La inscripción del neumático instalado puede ayudarte a reconocer la medida, pero conviene contrastarla con esa información antes de comprar.",
      ],
    },
    {
      title: `Qué significa R${n} en un neumático`,
      paragraphs: [
        `En una medida de neumático, la letra R indica una construcción radial y el número ${n} corresponde al diámetro de la llanta en pulgadas. Ese número no representa el diámetro total de la rueda ni define por sí solo la compatibilidad con el vehículo.`,
        `Dos cubiertas R${n} pueden tener diferentes anchos y perfiles. Por eso, compartir rodado no significa que puedan reemplazarse entre sí.`,
      ],
    },
    {
      title: `Cómo comparar precios de neumáticos rodado ${n}`,
      paragraphs: [
        "Compará opciones de la misma medida y con las especificaciones requeridas para tu vehículo. Además del precio publicado, revisá la marca, el modelo y las características de cada neumático.",
        "Antes de decidir, comprobá si el importe corresponde a una unidad o a un conjunto y si incluye envío, colocación u otros servicios. Verificá también la disponibilidad, el medio de pago y el precio final en la tienda que publica la oferta.",
      ],
    },
  ];
}

function buildFaqs(n: number): RodadoSeoFaq[] {
  return [
    {
      q: `¿Todas las cubiertas rodado ${n} sirven para el mismo vehículo?`,
      a: "No. Compartir rodado solo indica que corresponden al mismo diámetro de llanta. También deben cumplir con la medida completa y las especificaciones que requiere el vehículo.",
    },
    {
      q: `¿Cuánto cuesta una cubierta rodado ${n}?`,
      a: "El precio depende de la medida completa, la marca, el modelo y las condiciones de venta. Elegí una medida del listado para consultar las ofertas relevadas y verificá el importe final en la tienda antes de comprar.",
    },
    {
      q: `¿Cómo sé qué medida necesito dentro del rodado ${n}?`,
      a: "Consultá el manual o la etiqueta de especificaciones de tu vehículo. Identificá el ancho, el perfil y el diámetro de llanta, junto con los índices de carga y velocidad indicados por el fabricante.",
    },
  ];
}

/** Copy editorial para /rodado/{n}. Null si el rodado no tiene configuración SEO. */
export function getRodadoSeoCopy(rodado: number): RodadoSeoCopy | null {
  if (!isSeoRodado(rodado)) return null;

  return {
    title: `Cubiertas rodado ${rodado}: precios y medidas | Precio Neumáticos`,
    metaDescription: `Compará precios de cubiertas rodado ${rodado} en tiendas de Argentina. Buscá tu medida R${rodado} y revisá las opciones antes de elegir dónde comprar.`,
    h1: `Cubiertas y neumáticos rodado ${rodado}`,
    intro: INTROS[rodado],
    listadoH2: `Medidas de cubiertas rodado ${rodado}: compará precios`,
    secciones: buildSecciones(rodado),
    faqsTitle: `Preguntas frecuentes sobre cubiertas rodado ${rodado}`,
    faqs: buildFaqs(rodado),
    otrosRodadosH2: "Explorá otros rodados",
  };
}

/** Texto de enlace a otro rodado con copy SEO (13–18). */
export function getRodadoLinkLabel(rodado: number): string {
  if (isSeoRodado(rodado)) return `Cubiertas rodado ${rodado}`;
  return `R${rodado}`;
}
