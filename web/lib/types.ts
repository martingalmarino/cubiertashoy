export type Medida = {
  label: string;
  slug: string;
  ancho: number;
  perfil: number;
  rodado: number;
  prioridad: number;
  tipo: "auto" | "camioneta" | string;
};

export type Oferta = {
  id: string;
  medidaSlug: string;
  tiendaId: string;
  tiendaNombre: string;
  marca: string;
  modelo: string;
  indice: string;
  precioEfectivo: number;
  precioTarjeta: number;
  precioAnterior?: number;
  cuotas: number;
  cuotasSinInteres: boolean;
  colocacionGratis: boolean;
  url: string;
  actualizadoHaceHoras: number;
  ejemplo: true;
};

export type HistorialPunto = {
  medidaSlug: string;
  fecha: string;
  mediana: number;
  min: number;
  max: number;
  ejemplo: true;
};

export type MedidaParsed = {
  ancho: number;
  perfil: number;
  rodado: number;
  slug: string;
  label: string;
};

export type AutoMedida = {
  marca: string;
  modelo: string;
  version: string | null;
  anioDesde: number | null;
  anioHasta: number | null;
  medidaLabel: string;
  medidaSlug: string;
  fuente: string;
  estado: string;
};

export type DiscountKind = "real" | "inflado" | null;

export type OfertaEnriquecida = Oferta & {
  descuento: DiscountKind;
};
