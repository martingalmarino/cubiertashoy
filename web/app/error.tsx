"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-site flex flex-1 flex-col items-center justify-center py-20 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500">
        Error
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl">
        Algo salió mal
      </h1>
      <p className="mt-3 max-w-md text-tinta-500">
        No pudimos cargar esta página. Probá de nuevo en unos segundos.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 inline-flex h-12 min-w-[160px] items-center justify-center rounded-full bg-accion-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-accion-700 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
      >
        Reintentar
      </button>
    </div>
  );
}
