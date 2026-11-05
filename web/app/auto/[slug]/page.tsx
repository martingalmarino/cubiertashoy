import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/LeadForm";
import { MedidaBadge } from "@/components/MedidaBadge";
import { MedidaFaq } from "@/components/MedidaFaq";
import { PriceCard } from "@/components/PriceCard";
import { PricesSourceBanner } from "@/components/PricesSourceBanner";
import { SeoCopyArticle } from "@/components/SeoCopyArticle";
import { AutoVersionPicker } from "@/components/AutoVersionPicker";
import { getAutoCopy } from "@/content/autos";
import localidadesJson from "@/data/localidades.json";
import {
  getOfertas,
  getPrecioDesde,
  getVehicle,
  getVehicles,
  isExampleData,
  pickDefaultVehicleSize,
} from "@/lib/data";
import { formatARS } from "@/lib/format";
import { faqPageJsonLd, resolveSeoCopy } from "@/lib/seo-copy";
import { getSiteUrl, SITE_NAME_SHORT } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ version?: string; anio?: string }>;
};

export function generateStaticParams() {
  return getVehicles().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return { title: "Auto no encontrado" };
  const label = `${vehicle.marca} ${vehicle.modelo}`;
  const selected = pickDefaultVehicleSize(vehicle, null, null);
  const desde = await getPrecioDesde(selected.medidaSlug);
  const rawCopy = getAutoCopy(slug);
  const resolved = rawCopy
    ? resolveSeoCopy(rawCopy, {
        precio_min: desde != null ? formatARS(desde) : null,
      })
    : null;
  const title =
    resolved?.title ||
    `Cubiertas para ${label}: medidas y precios hoy | ${SITE_NAME_SHORT}`;
  const description =
    resolved?.metaDescription ||
    `Medida de fábrica y precios de cubiertas para ${label}. Compará tiendas en Argentina.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/auto/${vehicle.slug}` },
    openGraph: { title, description, locale: "es_AR", type: "website" },
  };
}

export default async function AutoPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const anio = sp.anio ? Number(sp.anio) : null;
  const selected = pickDefaultVehicleSize(
    vehicle,
    sp.version ?? null,
    Number.isFinite(anio) ? anio : null
  );

  const ofertas = await getOfertas(selected.medidaSlug);
  const top3 = ofertas.slice(0, 3);
  const desde = await getPrecioDesde(selected.medidaSlug);
  const ejemplo = isExampleData(ofertas);
  const label = `${vehicle.marca} ${vehicle.modelo}`;
  const base = getSiteUrl();
  const pageUrl = `${base}/auto/${vehicle.slug}`;

  const otherSizes = [
    ...new Map(
      vehicle.sizes
        .filter((s) => s.medidaSlug !== selected.medidaSlug)
        .map((s) => [s.medidaSlug, s] as const)
    ).values(),
  ];

  const rawCopy = getAutoCopy(slug);
  const copy = rawCopy
    ? resolveSeoCopy(rawCopy, {
        precio_min: desde != null ? formatARS(desde) : null,
      })
    : null;

  const faqs = copy?.faqs?.length
    ? copy.faqs
    : [
        {
          q: `¿Cuál es la medida de cubierta del ${label}?`,
          a: `La medida más habitual es ${selected.medidaLabel}${selected.version ? ` (versión ${selected.version})` : ""}. Siempre confirmá en el costado de tu cubierta o en el manual.`,
        },
        {
          q: "¿Puedo poner otra medida?",
          a: "Algunos modelos admiten equivalentes. Si cambiás medida, verificá que entre en el guardabarros y respetá el índice de carga/velocidad.",
        },
        {
          q: "¿Los precios son por unidad?",
          a: "Sí. Si una tienda publica kit x2 o x4, mostramos el precio dividido por unidad.",
        },
      ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: base },
      { "@type": "ListItem", position: 2, name: "Autos", item: `${base}/auto` },
      { "@type": "ListItem", position: 3, name: label, item: pageUrl },
    ],
  };

  const faqLd = faqPageJsonLd(faqs);

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />
      <PricesSourceBanner ejemplo={ejemplo} />

      <div className="container-site py-8 pb-16 sm:py-10">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Autos", href: "/auto" },
            { label },
          ]}
        />

        <header className="mt-6 max-w-3xl sm:mt-8">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl lg:text-[40px] lg:leading-[1.1]">
            {copy?.h1 || `Cubiertas para ${label}: medidas y precios hoy`}
          </h1>
          {!copy ? (
            <p className="mt-2 text-tinta-500">
              Elegí versión y año si aplica. Después confirmá la medida en el
              costado de tu cubierta.
            </p>
          ) : null}
        </header>

        <div className="mt-8">
          <Suspense fallback={null}>
            <AutoVersionPicker vehicle={vehicle} />
          </Suspense>
        </div>

        <section
          aria-labelledby="tu-medida"
          className="mt-8 rounded-xl border border-borde bg-superficie p-5 shadow-card sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p id="tu-medida" className="text-sm font-medium text-tinta-500">
                Tu medida
              </p>
              <div className="mt-2">
                <MedidaBadge label={selected.medidaLabel} />
              </div>
              {selected.version ? (
                <p className="mt-2 text-sm text-tinta-500">
                  Versión {selected.version}
                  {selected.anioDesde
                    ? ` · desde ${selected.anioDesde}`
                    : ""}
                </p>
              ) : null}
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-tinta-500">Desde</p>
              <p className="font-mono text-3xl font-semibold tabular-nums text-tinta-900">
                {desde != null ? formatARS(desde) : "—"}
              </p>
              <Link
                href={`/medida/${selected.medidaSlug}`}
                className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-accion-600 hover:text-accion-700 focus-visible:ring-2 focus-visible:ring-accion-600"
              >
                Ver todas las ofertas {selected.medidaLabel} →
              </Link>
            </div>
          </div>
        </section>

        {top3.length > 0 ? (
          <section className="mt-10" aria-labelledby="top3">
            <h2
              id="top3"
              className="text-xl font-semibold tracking-[-0.02em] text-tinta-900"
            >
              Las 3 más baratas hoy
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {top3.map((o, i) => (
                <PriceCard key={o.id} oferta={o} destacada={i === 0} />
              ))}
            </div>
          </section>
        ) : (
          <p className="mt-8 rounded-xl border border-borde bg-fondo px-4 py-6 text-sm text-tinta-500">
            Todavía no hay ofertas recientes para {selected.medidaLabel}. Probá
            más tarde o mirá la ficha de la medida.
          </p>
        )}

        {copy ? <SeoCopyArticle copy={copy} /> : null}

        <div className="mt-10">
          <LeadForm
            medidaSlug={selected.medidaSlug}
            medidaLabel={selected.medidaLabel}
            localidades={localidadesJson.localidades}
          />
        </div>

        {otherSizes.length > 0 ? (
          <section className="mt-12" aria-labelledby="otras">
            <h2
              id="otras"
              className="text-xl font-semibold tracking-[-0.02em] text-tinta-900"
            >
              Otras medidas del {vehicle.modelo}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {otherSizes.map((s) => (
                <li key={s.medidaSlug}>
                  <Link
                    href={`/medida/${s.medidaSlug}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-borde bg-superficie px-4 font-mono text-sm tabular-nums text-tinta-800 transition-colors hover:border-accion-600 focus-visible:ring-2 focus-visible:ring-accion-600"
                  >
                    {s.medidaLabel}
                    {!s.original ? (
                      <span className="ml-2 text-xs text-tinta-500">alt.</span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12 max-w-3xl">
          <MedidaFaq medidaLabel={label} items={faqs} />
        </section>
      </div>
    </>
  );
}
