import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getVehiclesByMarca } from "@/lib/data";
import { SITE_NAME_SHORT } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Cubiertas por auto | ${SITE_NAME_SHORT}` },
  description:
    "Buscá la medida de cubierta de tu auto por marca y modelo. Onix, Gol Trend, Cronos y más.",
  alternates: { canonical: "/auto" },
};

export default function AutoIndexPage() {
  const byMarca = getVehiclesByMarca();

  return (
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs
        items={[{ label: "Inicio", href: "/" }, { label: "Autos" }]}
      />

      <header className="mt-6 max-w-2xl sm:mt-8">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl">
          Cubiertas por auto
        </h1>
        <p className="mt-2 text-tinta-500">
          Elegí marca y modelo. Te mostramos la medida habitual y los precios
          de hoy.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        {byMarca.map(({ marca, vehicles }) => (
          <section key={marca} aria-labelledby={`marca-${marca}`}>
            <h2
              id={`marca-${marca}`}
              className="text-lg font-semibold tracking-[-0.02em] text-tinta-900"
            >
              {marca}
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`/auto/${v.slug}`}
                    className="flex min-h-14 items-center justify-between rounded-xl border border-borde bg-superficie px-4 py-3 text-tinta-900 shadow-card transition-shadow hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accion-600"
                  >
                    <span className="font-medium">
                      {v.marca} {v.modelo}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-tinta-500">
                      {v.sizes.find((s) => s.original)?.medidaLabel ??
                        v.sizes[0]?.medidaLabel}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
