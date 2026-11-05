import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExampleDataBanner } from "@/components/ExampleDataBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MedidaBadge } from "@/components/MedidaBadge";
import { CheapestCard } from "@/components/CheapestCard";
import { ResumenCard } from "@/components/ResumenCard";
import { PriceHistoryChartLazy } from "@/components/PriceHistoryChartLazy";
import { StoreTable } from "@/components/StoreTable";
import { MedidaFaq } from "@/components/MedidaFaq";
import { JsonLd } from "@/components/JsonLd";
import {
  getAutosPorMedida,
  getHistorial,
  getMedida,
  getMedidaResumen,
  getMedidas,
  getMedidasParecidas,
  getOfertas,
} from "@/lib/data";
import { getMedidaFaqItems } from "@/lib/faq-medida";
import { formatARS } from "@/lib/format";
import { getSiteUrl, SITE_NAME_SHORT } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getMedidas().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const medida = getMedida(slug);
  if (!medida) {
    return { title: "Medida no encontrada" };
  }

  const resumen = getMedidaResumen(slug);
  const ofertas = getOfertas(slug);
  const desde = ofertas[0]?.precioEfectivo;
  const desdeLabel = desde != null ? formatARS(desde) : null;

  const title =
    desdeLabel != null
      ? `Precio cubiertas ${medida.label} hoy | desde ${desdeLabel} | ${SITE_NAME_SHORT}`
      : `Precio cubiertas ${medida.label} hoy | ${SITE_NAME_SHORT}`;

  const description =
    desdeLabel != null
      ? `Cubiertas ${medida.label}: desde ${desdeLabel} por unidad en ${resumen.tiendasCount} tiendas. Compará efectivo, tarjeta, cuotas e historial.`
      : `Compará precios de cubiertas ${medida.label} en Argentina. Efectivo, tarjeta, cuotas e historial.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/medida/${medida.slug}` },
    openGraph: {
      title,
      description,
      locale: "es_AR",
      type: "website",
      url: `/medida/${medida.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function MedidaPage({ params }: PageProps) {
  const { slug } = await params;
  const medida = getMedida(slug);
  if (!medida) notFound();

  const base = getSiteUrl();
  const ofertas = getOfertas(slug);
  const historial = getHistorial(slug);
  const resumen = getMedidaResumen(slug);
  const parecidas = getMedidasParecidas(slug);
  const autos = getAutosPorMedida(slug);
  const cheapest = ofertas[0] ?? null;
  const faqs = getMedidaFaqItems(medida.label);
  const pageUrl = `${base}/medida/${medida.slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Medidas",
        item: `${base}/#medidas`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: medida.label,
        item: pageUrl,
      },
    ],
  };

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Cubierta ${medida.label}`,
    sku: medida.slug,
    category: "Cubiertas / Neumáticos",
    description: `Precios de cubiertas ${medida.label} por unidad en Argentina.`,
    url: pageUrl,
    ...(cheapest
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "ARS",
            lowPrice: String(cheapest.precioEfectivo),
            highPrice: String(
              Math.max(...ofertas.map((o) => o.precioEfectivo))
            ),
            offerCount: ofertas.length,
            availability: "https://schema.org/InStock",
            url: pageUrl,
          },
        }
      : {}),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const actualizado =
    resumen.actualizadoHaceHoras !== null
      ? `actualizado hace ${resumen.actualizadoHaceHoras} h`
      : "sin datos recientes";

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={productLd} />
      <JsonLd data={faqLd} />
      <ExampleDataBanner />

      <div className="container-site py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Medidas", href: "/#medidas" },
            { label: medida.label },
          ]}
        />

        <header className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4">
          <MedidaBadge label={medida.label} />
          <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-asfalto-950 sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
            Precio de cubiertas {medida.label} hoy
          </h1>
          <p className="text-asfalto-600">
            <span className="font-mono tabular-nums">
              {resumen.ofertasCount}
            </span>{" "}
            {resumen.ofertasCount === 1 ? "oferta" : "ofertas"} en{" "}
            <span className="font-mono tabular-nums">
              {resumen.tiendasCount}
            </span>{" "}
            {resumen.tiendasCount === 1 ? "tienda" : "tiendas"} · {actualizado}
          </p>
        </header>

        <div className="mt-8 grid gap-4 lg:grid-cols-5 lg:gap-6">
          <div className="lg:col-span-3">
            {cheapest ? (
              <CheapestCard oferta={cheapest} />
            ) : (
              <div className="rounded-lg border border-niebla-200 bg-white p-6 text-asfalto-600">
                Todavía no hay ofertas de ejemplo para esta medida.
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <ResumenCard resumen={resumen} />
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <PriceHistoryChartLazy
            historial={historial}
            medidaLabel={medida.label}
          />
        </div>

        {ofertas.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <StoreTable ofertas={ofertas} />
          </div>
        )}

        <section className="mt-10 border-t border-niebla-200 pt-10 sm:mt-12">
          <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-asfalto-950 sm:text-2xl">
            Autos que usan esta medida
          </h2>
          {autos.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {autos.map((a) => (
                <li key={`${a.marca}-${a.modelo}-${a.version ?? ""}`}>
                  <span className="inline-flex min-h-11 items-center rounded-full border border-niebla-200 bg-niebla-100 px-3 text-sm font-medium text-asfalto-950">
                    {a.marca} {a.modelo}
                    {a.version ? ` ${a.version}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-asfalto-600">
              Todavía no tenemos autos mapeados a {medida.label}. La búsqueda
              por auto llega pronto.
            </p>
          )}
        </section>

        {parecidas.length > 0 && (
          <section className="mt-10 border-t border-niebla-200 pt-10">
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-asfalto-950 sm:text-2xl">
              Medidas parecidas
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {parecidas.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/medida/${m.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-niebla-200 bg-white px-3 font-mono text-sm font-medium tabular-nums text-asfalto-950 transition-colors duration-200 hover:border-asfalto-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-600"
                  >
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 border-t border-niebla-200 pt-10 sm:mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold tracking-[-0.02em] text-asfalto-950 sm:text-2xl">
            Preguntas frecuentes
          </h2>
          <MedidaFaq medidaLabel={medida.label} />
        </section>
      </div>
    </>
  );
}
