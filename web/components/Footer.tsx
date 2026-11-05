import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="mt-auto bg-asfalto-950 text-papel">
      <div className="tread-texture">
        <div className="container-site grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <Logo inverse />
            <p className="max-w-xs text-sm text-grafito-400">
              El mejor precio de tu cubierta, hoy. Comparamos tiendas de todo el
              país.
            </p>
          </div>

          <div>
            <p className="mb-3 font-display text-sm font-semibold text-papel">
              Explorar
            </p>
            <ul className="space-y-2 text-sm text-grafito-400">
              <li>
                <Link
                  href="/#medidas"
                  className="inline-flex min-h-11 items-center transition-colors hover:text-papel"
                >
                  Medidas
                </Link>
              </li>
              <li>
                <Link
                  href="/styleguide"
                  className="inline-flex min-h-11 items-center transition-colors hover:text-papel"
                >
                  Styleguide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-display text-sm font-semibold text-papel">
              Aviso
            </p>
            <p className="text-sm text-grafito-400">
              Los precios se muestran por unidad. En fase 1 algunos datos son de
              ejemplo.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-site flex flex-col gap-2 py-4 text-xs text-grafito-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 cubiertas hoy</p>
            <p>Precios en ARS · Argentina</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
