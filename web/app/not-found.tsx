import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site flex flex-1 flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-sm font-medium tabular-nums text-asfalto-600">
        404
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-[-0.02em] text-asfalto-950 sm:text-4xl">
        No encontramos esa medida
      </h1>
      <p className="mt-3 max-w-md text-asfalto-600">
        Puede que el enlace esté mal o que todavía no la tengamos en el
        catálogo. Probá buscar por ancho, perfil y rodado.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/#medidas"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-azul-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-azul-600/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-600"
        >
          Buscar medida
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-niebla-200 bg-white px-5 text-sm font-medium text-asfalto-950 transition-colors hover:bg-niebla-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-600"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
