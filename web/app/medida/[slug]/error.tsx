"use client";

export default function MedidaError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-site flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-[-0.02em] text-tinta-900">
        No pudimos cargar esta medida
      </h1>
      <p className="mt-2 max-w-md text-sm text-tinta-500">
        Hubo un problema al mostrar las ofertas. Reintentá.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-accion-600 px-5 text-sm font-semibold text-white hover:bg-accion-700 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
      >
        Reintentar
      </button>
    </div>
  );
}
