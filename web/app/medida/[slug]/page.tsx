import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PricesSourceBanner } from "@/components/PricesSourceBanner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MedidaBadge } from "@/components/MedidaBadge";
import { CheapestCard } from "@/components/CheapestCard";
import { EmptyMedida } from "@/components/EmptyMedida";
import { AdSlot } from "@/components/AdSlot";
import { LeadForm } from "@/components/LeadForm";
import { ResumenCard } from "@/components/ResumenCard";
import { PriceHistoryChartLazy } from "@/components/PriceHistoryChartLazy";
import { StoreTable } from "@/components/StoreTable";
import { MedidaFaq } from "@/components/MedidaFaq";
import { MobileStickyCta } from "@/components/MobileStickyCta";
import { SeoCopyArticle } from "@/components/SeoCopyArticle";
import { JsonLd } from "@/components/JsonLd";
import { getMedidaCopy } from "@/content/medidas";
import localidadesJson from "@/data/localidades.json";
import {
  getAutosPorMedida,
  getHistorial,
  getMarcasEnMedida,
  getMedida,
  getMedidaResumen,
  getMedidas,
  getMedidasParecidas,
  getOfertas,
  isExampleData,
} from "@/lib/data";
import { formatARS } from "@/lib/format";
import { getMedidaFaqItems } from "@/lib/faq-medida";
import {
  faqPageJsonLd,
  resolveSeoCopy,
  type SeoCopyVars,
} from "@/lib/seo-copy";
import { getSiteUrl, SITE_NAME_SHORT } from "@/lib/site";

function medidaCopyVars(input: {
  precioMin: number | null | undefined;
  mediana: number | null | undefined;
  tiendas: number;
  ofertas: number;
  actualizadoHaceHoras: number | null;
}): SeoCopyVars {
  return {
    precio_min:
      input.precioMin != null ? formatARS(input.precioMin) : null,
    precio_mediana:
      input.mediana != null ? formatARS(input.mediana) : null,
    n_tiendas: String(input.tiendas),
    n_ofertas: String(input.ofertas),
    fecha_actualizacion:
      input.actualizadoHaceHoras != null
        ? `hace ${input.actualizadoHaceHoras} h`
        : null,
  };
}

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

  const resumen = await getMedidaResumen(slug);
  const ofertas = await getOfertas(slug);
  const desde = ofertas[0]?.precioEfectivo;
  const desdeLabel = desde != null ? formatARS(desde) : null;
  const rawCopy = getMedidaCopy(slug);
  const resolvedCopy = rawCopy
    ? resolveSeoCopy(
        rawCopy,
        medidaCopyVars({
          precioMin: desde ?? null,
          mediana: resumen.medianaHoy,
          tiendas: resumen.tiendasCount,
          ofertas: resumen.ofertasCount,
          actualizadoHaceHoras: resumen.actualizadoHaceHoras,
        })
      )
    : null;

  const title =
    resolvedCopy?.title ||
    (desdeLabel != null
      ? `Precio neumáticos ${medida.label} hoy | desde ${desdeLabel} | ${SITE_NAME_SHORT}`
      : `Precio neumáticos ${medida.label} hoy | ${SITE_NAME_SHORT}`);

  const description =
    resolvedCopy?.metaDescription ||
    (desdeLabel != null
      ? `Neumáticos ${medida.label}: desde ${desdeLabel} por unidad en ${resumen.tiendasCount} tiendas. También buscadas como cubiertas ${medida.label}.`
      : `Compará precios de neumáticos ${medida.label} en Argentina. También buscadas como cubiertas ${medida.label}.`);

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
  const ofertas = await getOfertas(slug);
  const historial = await getHistorial(slug);
  const resumen = await getMedidaResumen(slug);
  const parecidas = getMedidasParecidas(slug);
  const autos = getAutosPorMedida(slug);
  const marcas = await getMarcasEnMedida(slug);
  const cheapest = ofertas[0] ?? null;
  const ejemplo = isExampleData(ofertas);
  const pageUrl = `${base}/medida/${medida.slug}`;
  const hist90 = historial.slice(-90);
  const maximo90d =
    hist90.length > 0 ? Math.max(...hist90.map((h) => h.max)) : null;

  const rawCopy = getMedidaCopy(slug);
  const copy = rawCopy
    ? resolveSeoCopy(
        rawCopy,
        medidaCopyVars({
          precioMin: cheapest?.precioEfectivo ?? null,
          mediana: resumen.medianaHoy,
          tiendas: resumen.tiendasCount,
          ofertas: resumen.ofertasCount,
          actualizadoHaceHoras: resumen.actualizadoHaceHoras,
        })
      )
    : null;
  const faqs = copy?.faqs?.length
    ? copy.faqs
    : [...getMedidaFaqItems(medida.label)];

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

  const faqLd = faqPageJsonLd(faqs);

  const actualizado =
    resumen.actualizadoHaceHoras !== null
      ? `actualizado hace ${resumen.actualizadoHaceHoras} h`
      : "sin datos recientes";

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={productLd} />
      <JsonLd data={faqLd} />
      <PricesSourceBanner ejemplo={ejemplo} />

      <div className="container-site py-8 pb-24 sm:py-10 md:pb-10">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Medidas", href: "/#medidas" },
            { label: medida.label },
          ]}
        />

        <header className="mt-6 flex flex-col items-start gap-3 sm:mt-8 sm:gap-4">
          <MedidaBadge label={medida.label} />
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-tinta-900 sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
            {copy?.h1 || `Precio de neumáticos ${medida.label} hoy`}
          </h1>
          <p className="flex flex-wrap items-center gap-2 text-tinta-500">
            <span className="relative inline-flex size-2.5" aria-hidden>
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
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/rodado/${medida.rodado}`}
              className="inline-flex min-h-11 items-center rounded-full border border-borde bg-superficie px-4 text-sm font-medium text-tinta-700 transition-colors hover:border-accion-600 focus-visible:ring-2 focus-visible:ring-accion-600"
            >
              Rodado R{medida.rodado}
            </Link>
            <Link
              href="/cuotas"
              className="inline-flex min-h-11 items-center rounded-full border border-borde bg-superficie px-4 text-sm font-medium text-tinta-700 transition-colors hover:border-accion-600 focus-visible:ring-2 focus-visible:ring-accion-600"
            >
              Cuotas sin interés
            </Link>
          </div>
        </header>

        {ofertas.length === 0 ? (
          <div className="mt-10">
            <EmptyMedida label={medida.label} parecidas={parecidas} />
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 lg:grid-cols-5 lg:gap-6">
              <div className="lg:col-span-3">
                {cheapest && (
                  <CheapestCard
                    oferta={cheapest}
                    actualizadoHaceHoras={resumen.actualizadoHaceHoras}
                  />
                )}
              </div>
              <div className="lg:col-span-2">
                <ResumenCard
                  resumen={resumen}
                  precioBarato={cheapest?.precioEfectivo ?? null}
                  maximo90d={maximo90d}
                />
              </div>
            </div>

            <div className="my-10">
              <PriceHistoryChartLazy
                historial={historial}
                medidaLabel={medida.label}
              />
            </div>

            <div className="my-10">
              <StoreTable ofertas={ofertas} />
            </div>
          </>
        )}

        {copy ? <SeoCopyArticle copy={copy} /> : null}

        <div className="my-10">
          <AdSlot slot="medida-mid" height={90} />
        </div>

        <div className="my-10">
          <LeadForm
            medidaSlug={medida.slug}
            medidaLabel={medida.label}
            localidades={localidadesJson.localidades}
          />
        </div>

        {marcas.length > 0 && (
          <section className="my-10" aria-labelledby="marcas-medida">
            <h2
              id="marcas-medida"
              className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl"
            >
              Por marca
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {marcas.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/medida/${slug}/${m.slug}`}
                    className="flex min-h-14 items-center justify-between rounded-xl border border-borde bg-superficie px-4 py-3 shadow-card transition-shadow hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accion-600"
                  >
                    <span className="text-sm font-medium text-tinta-900">
                      {m.nombre}
                      <span className="mt-0.5 block text-xs font-normal text-tinta-500">
                        <span className="font-mono tabular-nums">{m.count}</span>{" "}
                        {m.count === 1 ? "oferta" : "ofertas"}
                      </span>
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
        )}

        {autos.length > 0 && (
          <section className="my-10">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
              Autos que usan esta medida
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {autos.map((a) => {
                const label = `${a.marca} ${a.modelo}${a.version ? ` ${a.version}` : ""}`;
                const key = `${a.vehicleSlug ?? a.marca}-${a.modelo}-${a.version ?? ""}-${a.medidaSlug}`;
                return (
                  <li key={key}>
                    {a.vehicleSlug ? (
                      <Link
                        href={`/auto/${a.vehicleSlug}`}
                        className="inline-flex min-h-11 items-center rounded-md border border-borde bg-superficie px-3 text-sm font-medium text-tinta-900 shadow-card transition-colors hover:border-accion-600 focus-visible:ring-2 focus-visible:ring-accion-600"
                      >
                        {label}
                      </Link>
                    ) : (
                      <span className="inline-flex min-h-11 items-center rounded-md border border-borde bg-superficie px-3 text-sm font-medium text-tinta-900 shadow-card">
                        {label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {parecidas.length >= 2 && (
          <section className="my-10">
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

        <section className="my-10">
          <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
            Preguntas frecuentes
          </h2>
          <MedidaFaq medidaLabel={medida.label} items={faqs} />
        </section>
      </div>

      {cheapest && <MobileStickyCta oferta={cheapest} />}
    </>
  );
}
