import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PricesSourceBanner } from "@/components/PricesSourceBanner";
import { PriceCard } from "@/components/PriceCard";
import {
  getIndexableMarcaSlugs,
  getMarcaCatalog,
  getOfertasByMarca,
  isExampleData,
  MIN_INDEXABLE_OFFERS,
} from "@/lib/data";
import { formatARS } from "@/lib/format";
import { getSiteUrl, SITE_NAME_SHORT } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getIndexableMarcaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getMarcaCatalog();
  const marca = catalog.find((m) => m.slug === slug);
  if (!marca) return { title: "Marca no encontrada" };

  const thin = marca.ofertasCount < MIN_INDEXABLE_OFFERS;
  const title = `Neumáticos ${marca.nombre}: precios y medidas | ${SITE_NAME_SHORT}`;
  const description = `Precios de neumáticos ${marca.nombre} en Argentina. Desde ${formatARS(marca.precioMin)}. Compará medidas y tiendas.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/marca/${slug}` },
    robots: thin ? { index: false, follow: true } : undefined,
    openGraph: { title, description, locale: "es_AR", type: "website" },
  };
}

export default async function MarcaPage({ params }: PageProps) {
  const { slug } = await params;
  const catalog = await getMarcaCatalog();
  const marca = catalog.find((m) => m.slug === slug);
  if (!marca) notFound();

  const ofertas = await getOfertasByMarca(slug);
  const top = ofertas.slice(0, 6);
  const ejemplo = isExampleData(ofertas);
  const thin = marca.ofertasCount < MIN_INDEXABLE_OFFERS;
  const base = getSiteUrl();
  const pageUrl = `${base}/marca/${slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: base },
      { "@type": "ListItem", position: 2, name: "Marcas", item: `${base}/marca/${slug}` },
      { "@type": "ListItem", position: 3, name: marca.nombre, item: pageUrl },
    ],
  };

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Cubiertas ${marca.nombre}`,
    brand: { "@type": "Brand", name: marca.nombre },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "ARS",
      lowPrice: marca.precioMin,
      highPrice: marca.precioMax,
      offerCount: marca.ofertasCount,
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      {!thin ? <JsonLd data={productLd} /> : null}
      <PricesSourceBanner ejemplo={ejemplo} />

      <div className="container-site py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: marca.nombre },
          ]}
        />

        <header className="mt-6 max-w-3xl sm:mt-8">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl">
            Cubiertas {marca.nombre}: precios y medidas
          </h1>
          <p className="mt-2 text-tinta-500">
            <span className="font-mono tabular-nums">{marca.ofertasCount}</span>{" "}
            ofertas · desde{" "}
            <span className="font-mono tabular-nums">
              {formatARS(marca.precioMin)}
            </span>{" "}
            hasta{" "}
            <span className="font-mono tabular-nums">
              {formatARS(marca.precioMax)}
            </span>
          </p>
        </header>

        {thin ? (
          <p className="mt-8 rounded-xl border border-borde bg-fondo px-4 py-6 text-sm text-tinta-500">
            Todavía hay pocas ofertas de {marca.nombre}. Volvé más tarde.
          </p>
        ) : null}

        <section className="mt-10" aria-labelledby="medidas-marca">
          <h2
            id="medidas-marca"
            className="text-xl font-semibold tracking-[-0.02em] text-tinta-900"
          >
            Medidas disponibles
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {marca.medidas.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/medida/${m.slug}/${slug}`}
                  className="flex min-h-14 items-center justify-between rounded-xl border border-borde bg-superficie px-4 py-3 shadow-card transition-shadow hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accion-600"
                >
                  <span className="font-mono text-sm font-semibold tabular-nums text-tinta-900">
                    {m.label}
                  </span>
                  <span className="text-sm text-tinta-500">
                    desde{" "}
                    <span className="font-mono tabular-nums text-tinta-800">
                      {formatARS(m.precioDesde)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {marca.modelos.length > 0 ? (
          <section className="mt-10" aria-labelledby="modelos-marca">
            <h2
              id="modelos-marca"
              className="text-xl font-semibold tracking-[-0.02em] text-tinta-900"
            >
              Modelos
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {marca.modelos.slice(0, 24).map((modelo) => (
                <li
                  key={modelo}
                  className="rounded-full border border-borde bg-fondo px-3 py-1.5 text-sm text-tinta-700"
                >
                  {modelo}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {top.length > 0 ? (
          <section className="mt-10" aria-labelledby="ofertas-marca">
            <h2
              id="ofertas-marca"
              className="text-xl font-semibold tracking-[-0.02em] text-tinta-900"
            >
              Ofertas destacadas
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {top.map((o, i) => (
                <PriceCard key={o.id} oferta={o} destacada={i === 0} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
