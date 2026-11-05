type PricesSourceBannerProps = {
  ejemplo: boolean;
};

/** Aviso de fuente: ejemplo (fase 1) o disclaimer de precios reales. */
export function PricesSourceBanner({ ejemplo }: PricesSourceBannerProps) {
  if (ejemplo) {
    return (
      <div className="pointer-events-none relative z-30 flex justify-center px-4">
        <p
          role="status"
          className="mt-3 inline-flex min-h-8 items-center rounded-full bg-ambar-100 px-3.5 text-center text-xs font-medium text-asfalto-950 shadow-card"
        >
          Datos de ejemplo · todavía no son precios reales
        </p>
      </div>
    );
  }

  return (
    <div className="pointer-events-none relative z-30 flex justify-center px-4">
      <p
        role="status"
        className="mt-3 max-w-xl text-center text-xs text-tinta-500"
      >
        Precios de tiendas, pueden cambiar. Verificá en la tienda antes de
        comprar.
      </p>
    </div>
  );
}
