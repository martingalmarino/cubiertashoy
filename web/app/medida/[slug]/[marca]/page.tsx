import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { MedidaBadge } from "@/components/MedidaBadge";
import { PriceCard } from "@/components/PriceCard";
import { PricesSourceBanner } from "@/components/PricesSourceBanner";
import { StoreTable } from "@/components/StoreTable";
import {
  getIndexableMedidaMarcaPairs,
  getMedida,
  getOfertasByMedidaAndMarca,
  isExampleData,
  MIN_INDEXABLE_OFFERS,
} from "@/lib/data";
import { formatARS } from "@/lib/format";
import { getSiteUrl, SITE_NAME_SHORT } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string; marca: string }>;
};

export async function generateStaticParams() {
  return getIndexableMedidaMarcaPairs();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, marca } = await params;
  const medida = getMedida(slug);
  if (!medida) return { title: "No encontrada" };

  const ofertas = await getOfertasByMedidaAndMarca(slug, marca);
  const thin = ofertas.length < MIN_INDEXABLE_OFFERS;
  const nombre =
    ofertas[0]?.marca ??
    marca
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const desde = ofertas[0]?.precioEfectivo;
  const title =
    desde != null
      ? `Precio cubiertas ${nombre} ${medida.label} | desde ${formatARS(desde)} | ${SITE_NAME_SHORT}`
      : `Precio cubiertas ${nombre} ${medida.label} | ${SITE_NAME_SHORT}`;
  const description = `Compará precios de cubiertas ${nombre} ${medida.label} en Argentina. Efectivo, tarjeta y cuotas.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/medida/${slug}/${marca}` },
    robots: thin ? { index: false, follow: true } : undefined,
    openGraph: { title, description, locale: "es_AR", type: "website" },
  };
}

export default async function MedidaMarcaPage({ params }: PageProps) {
  const { slug, marca } = await params;
  const medida = getMedida(slug);
  if (!medida) notFound();

  const ofertas = await getOfertasByMedidaAndMarca(slug, marca);
  const nombre =
    ofertas[0]?.marca ??
    marca
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const thin = ofertas.length < MIN_INDEXABLE_OFFERS;
  const ejemplo = isExampleData(ofertas);
  const desde = ofertas[0]?.precioEfectivo ?? null;
  const hasta =
    ofertas.length > 0
      ? Math.max(...ofertas.map((o) => o.precioEfectivo))
      : null;
  const base = getSiteUrl();
  const pageUrl = `${base}/medida/${slug}/${marca}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: base },
      {
        "@type": "ListItem",
        position: 2,
        name: medida.label,
        item: `${base}/medida/${slug}`,
      },
      { "@type": "ListItem", position: 3, name: nombre, item: pageUrl },
    ],
  };

  const productLd =
    desde != null && hasta != null
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: `Cubierta ${nombre} ${medida.label}`,
          brand: { "@type": "Brand", name: nombre },
          category: "Cubiertas / Neumáticos",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "ARS",
            lowPrice: desde,
            highPrice: hasta,
            offerCount: ofertas.length,
          },
        }
      : null;

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      {!thin && productLd ? <JsonLd data={productLd} /> : null}
      <PricesSourceBanner ejemplo={ejemplo} />

      <div className="container-site py-8 pb-16 sm:py-10">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: medida.label, href: `/medida/${slug}` },
            { label: nombre },
          ]}
        />

        <header className="mt-6 flex flex-col items-start gap-3 sm:mt-8">
          <MedidaBadge label={medida.label} />
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl">
            Precio cubiertas {nombre} {medida.label}
          </h1>
          <p className="text-tinta-500">
            <span className="font-mono tabular-nums">{ofertas.length}</span>{" "}
            {ofertas.length === 1 ? "oferta" : "ofertas"}
            {desde != null ? (
              <>
                {" "}
                · desde{" "}
                <span className="font-mono tabular-nums">
                  {formatARS(desde)}
                </span>
              </>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/medida/${slug}`}
              className="inline-flex min-h-11 items-center rounded-full border border-borde bg-superficie px-4 text-sm font-medium text-tinta-700 hover:border-accion-600 focus-visible:ring-2 focus-visible:ring-accion-600"
            >
              Todas las marcas {medida.label}
            </Link>
            <Link
              href={`/marca/${marca}`}
              className="inline-flex min-h-11 items-center rounded-full border border-borde bg-superficie px-4 text-sm font-medium text-tinta-700 hover:border-accion-600 focus-visible:ring-2 focus-visible:ring-accion-600"
            >
              Más de {nombre}
            </Link>
            <Link
              href={`/rodado/${medida.rodado}`}
              className="inline-flex min-h-11 items-center rounded-full border border-borde bg-superficie px-4 text-sm font-medium text-tinta-700 hover:border-accion-600 focus-visible:ring-2 focus-visible:ring-accion-600"
            >
              Rodado R{medida.rodado}
            </Link>
          </div>
        </header>

        {thin ? (
          <p className="mt-6 rounded-xl border border-borde bg-fondo px-4 py-4 text-sm text-tinta-500">
            {ofertas.length === 0
              ? `No hay ofertas recientes de ${nombre} en ${medida.label}.`
              : `Hay pocas ofertas de ${nombre} en esta medida. Mostramos lo disponible.`}
          </p>
        ) : null}

        {ofertas.length > 0 ? (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {ofertas.slice(0, 3).map((o, i) => (
                <PriceCard key={o.id} oferta={o} destacada={i === 0} />
              ))}
            </div>
            <div className="my-10">
              <StoreTable ofertas={ofertas} />
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
