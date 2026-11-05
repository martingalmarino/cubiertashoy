import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getMedidas } from "@/lib/data";
import { getSiteUrl, SITE_NAME_SHORT } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Todas las medidas de cubiertas | ${SITE_NAME_SHORT}`,
  },
  description:
    "Índice A–Z de medidas de cubiertas por rodado. Encontrá 175/65 R14, 185/60 R15 y más.",
  alternates: { canonical: "/medidas" },
  openGraph: {
    title: `Todas las medidas de cubiertas | ${SITE_NAME_SHORT}`,
    description: "Índice de medidas por rodado para comparar precios.",
    locale: "es_AR",
    type: "website",
  },
};

export default function MedidasIndexPage() {
  const medidas = [...getMedidas()].sort((a, b) => {
    if (a.rodado !== b.rodado) return a.rodado - b.rodado;
    if (a.ancho !== b.ancho) return a.ancho - b.ancho;
    return a.perfil - b.perfil;
  });

  const byRodado = new Map<number, typeof medidas>();
  for (const m of medidas) {
    const list = byRodado.get(m.rodado) ?? [];
    list.push(m);
    byRodado.set(m.rodado, list);
  }

  const rodados = [...byRodado.keys()].sort((a, b) => a - b);
  const base = getSiteUrl();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: base },
      {
        "@type": "ListItem",
        position: 2,
        name: "Medidas",
        item: `${base}/medidas`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <div className="container-site py-8 sm:py-10">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Medidas" }]}
        />

        <header className="mt-6 max-w-2xl sm:mt-8">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl">
            Todas las medidas
          </h1>
          <p className="mt-2 text-tinta-500">
            Índice por rodado. Elegí tu medida para ver precios de hoy.
          </p>
        </header>

        <nav
          aria-label="Ir a un rodado"
          className="mt-6 flex flex-wrap gap-2"
        >
          {rodados.map((r) => (
            <a
              key={r}
              href={`#rodado-${r}`}
              className="inline-flex min-h-11 items-center rounded-full border border-borde bg-superficie px-4 text-sm font-medium text-tinta-700 hover:border-accion-600 focus-visible:ring-2 focus-visible:ring-accion-600"
            >
              R{r}
            </a>
          ))}
        </nav>

        <div className="mt-10 space-y-12">
          {rodados.map((r) => {
            const list = byRodado.get(r) ?? [];
            return (
              <section key={r} id={`rodado-${r}`} aria-labelledby={`h-r${r}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2
                    id={`h-r${r}`}
                    className="text-xl font-semibold tracking-[-0.02em] text-tinta-900"
                  >
                    Rodado R{r}
                  </h2>
                  <Link
                    href={`/rodado/${r}`}
                    className="text-sm font-medium text-accion-600 hover:text-accion-700 focus-visible:ring-2 focus-visible:ring-accion-600"
                  >
                    Ver rodado R{r}
                  </Link>
                </div>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((m) => (
                    <li key={m.slug}>
                      <Link
                        href={`/medida/${m.slug}`}
                        className="flex min-h-14 items-center rounded-xl border border-borde bg-superficie px-4 font-mono text-sm font-semibold tabular-nums text-tinta-900 shadow-card transition-shadow hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accion-600"
                      >
                        {m.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
