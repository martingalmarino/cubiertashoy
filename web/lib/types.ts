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
  /** Link de afiliado (p. ej. Mercado Libre). Si existe, los CTAs lo usan. */
  affiliateUrl?: string;
  actualizadoHaceHoras: number;
  ejemplo: boolean;
};

export type HistorialPunto = {
  medidaSlug: string;
  fecha: string;
  mediana: number;
  min: number;
  max: number;
  ejemplo: boolean;
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
  vehicleSlug?: string;
};

export type VehicleSizeOption = {
  version: string | null;
  anioDesde: number | null;
  anioHasta: number | null;
  medidaSlug: string;
  medidaLabel: string;
  original: boolean;
  fuente: string;
  estado: string;
};

export type Vehicle = {
  slug: string;
  marca: string;
  modelo: string;
  sizes: VehicleSizeOption[];
};

export type DiscountKind = "real" | "inflado" | null;

export type OfertaEnriquecida = Oferta & {
  descuento: DiscountKind;
};
