import Link from "next/link";
import { Logo } from "@/components/Logo";
import { TreadPattern } from "@/components/visual/TreadPattern";

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-asfalto-950 text-papel">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.04]"
        aria-hidden
      >
        <defs>
          <TreadPattern id="footer-tread" />
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-tread)" />
      </svg>

      <div className="container-site relative grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <Logo inverse />
          <p className="max-w-xs text-sm text-tinta-400">
            El mejor precio de tu cubierta, hoy. Comparamos tiendas de todo el
            país.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-papel">Explorar</p>
          <ul className="space-y-1 text-sm text-tinta-400">
            <li>
              <Link
                href="/medidas"
                className="inline-flex min-h-11 items-center transition-colors hover:text-papel"
              >
                Medidas
              </Link>
            </li>
            <li>
              <Link
                href="/rodado/15"
                className="inline-flex min-h-11 items-center transition-colors hover:text-papel"
              >
                Por rodado
              </Link>
            </li>
            <li>
              <Link
                href="/cuotas"
                className="inline-flex min-h-11 items-center transition-colors hover:text-papel"
              >
                Cuotas
              </Link>
            </li>
            <li>
              <Link
                href="/#tiendas"
                className="inline-flex min-h-11 items-center transition-colors hover:text-papel"
              >
                Tiendas
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-papel">Producto</p>
          <ul className="space-y-1 text-sm text-tinta-400">
            <li>
              <Link
                href="/#como"
                className="inline-flex min-h-11 items-center transition-colors hover:text-papel"
              >
                Cómo funciona
              </Link>
            </li>
            <li>
              <Link
                href="/auto"
                className="inline-flex min-h-11 items-center transition-colors hover:text-papel"
              >
                Por auto
              </Link>
            </li>
            <li>
              <Link
                href="/marca/fate"
                className="inline-flex min-h-11 items-center transition-colors hover:text-papel"
              >
                Marcas
              </Link>
            </li>
            <li>
              <Link
                href="/para-gomerias"
                className="inline-flex min-h-11 items-center transition-colors hover:text-papel"
              >
                Para gomerías
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-papel">Aviso</p>
          <p className="text-sm text-tinta-400">
            Precios por unidad, tomados de tiendas. Pueden cambiar: verificá en
            la ficha antes de comprar.
          </p>
          <p className="mt-3 text-sm text-tinta-400">
            <Link
              href="/como-ganamos-plata"
              className="underline underline-offset-2 transition-colors hover:text-papel"
            >
              Cómo ganamos plata
            </Link>
            {" · "}
            algunos links a Mercado Libre son de afiliados (
            <span className="font-mono text-[11px]">rel=sponsored</span>).
          </p>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-4 text-xs text-tinta-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 cubiertas hoy</p>
          <p>Precios en ARS · Argentina</p>
        </div>
      </div>
    </footer>
  );
}
