import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExampleDataBanner } from "@/components/ExampleDataBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MedidaBadge } from "@/components/MedidaBadge";
import { CheapestCard } from "@/components/CheapestCard";
import { EmptyMedida } from "@/components/EmptyMedida";
import { ResumenCard } from "@/components/ResumenCard";
import { PriceHistoryChartLazy } from "@/components/PriceHistoryChartLazy";
import { StoreTable } from "@/components/StoreTable";
import { MedidaFaq } from "@/components/MedidaFaq";
import { MobileStickyCta } from "@/components/MobileStickyCta";
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
  const hist90 = historial.slice(-90);
  const maximo90d =
    hist90.length > 0 ? Math.max(...hist90.map((h) => h.max)) : null;

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

      <div className="container-site py-8 pb-28 sm:py-10 md:pb-10">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Medidas", href: "/#medidas" },
            { label: medida.label },
          ]}
        />

        <header className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4">
          <MedidaBadge label={medida.label} />
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
            Precio de cubiertas {medida.label} hoy
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-tinta-500">
            <span
              className="relative inline-flex size-2.5"
              aria-hidden
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-ahorro-600/40" />
              <span className="relative inline-flex size-2.5 rounded-full bg-ahorro-600" />
            </span>
            <span>
              <span className="font-mono tabular-nums">
                {resumen.ofertasCount}
              </span>{" "}
              {resumen.ofertasCount === 1 ? "oferta" : "ofertas"} en{" "}
              <span className="font-mono tabular-nums">
                {resumen.tiendasCount}
              </span>{" "}
              {resumen.tiendasCount === 1 ? "tienda" : "tiendas"} ·{" "}
              {actualizado}
            </span>
          </p>
        </header>

        {ofertas.length === 0 ? (
          <div className="mt-10">
            <EmptyMedida label={medida.label} parecidas={parecidas} />
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 lg:grid-cols-5 lg:gap-6">
              <div className="lg:col-span-3">
                {cheapest && <CheapestCard oferta={cheapest} />}
              </div>
              <div className="lg:col-span-2">
                <ResumenCard
                  resumen={resumen}
                  precioBarato={cheapest?.precioEfectivo ?? null}
                  maximo90d={maximo90d}
                />
              </div>
            </div>

            <div className="mt-10 sm:mt-12">
              <PriceHistoryChartLazy
                historial={historial}
                medidaLabel={medida.label}
              />
            </div>

            <div className="mt-10 sm:mt-12">
              <StoreTable ofertas={ofertas} />
            </div>
          </>
        )}

        <section className="mt-10 border-t border-borde pt-10 sm:mt-12">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
            Autos que usan esta medida
          </h2>
          {autos.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {autos.map((a) => (
                <li key={`${a.marca}-${a.modelo}-${a.version ?? ""}`}>
                  <span className="inline-flex min-h-11 items-center rounded-md border border-borde bg-superficie px-3 text-sm font-medium text-tinta-900 shadow-card">
                    {a.marca} {a.modelo}
                    {a.version ? ` ${a.version}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-tinta-500">
              Todavía no tenemos autos mapeados a {medida.label}. La búsqueda
              por auto llega pronto.
            </p>
          )}
        </section>

        {parecidas.length > 0 && (
          <section className="mt-10 border-t border-borde pt-10">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
              Medidas parecidas
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {parecidas.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/medida/${m.slug}`}
                    className="inline-flex min-h-11 items-center rounded-md border border-borde bg-superficie px-3 font-mono text-sm font-semibold tabular-nums text-tinta-900 shadow-card transition-colors duration-200 hover:border-borde-fuerte focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
                  >
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 border-t border-borde pt-10 sm:mt-12">
          <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
            Preguntas frecuentes
          </h2>
          <MedidaFaq medidaLabel={medida.label} />
        </section>
      </div>

      {cheapest && <MobileStickyCta oferta={cheapest} />}
    </>
  );
}
