import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CuotasFilter } from "@/components/CuotasFilter";
import { JsonLd } from "@/components/JsonLd";
import { PricesSourceBanner } from "@/components/PricesSourceBanner";
import {
  getMedidas,
  getOfertasConCuotas,
  isExampleData,
  MIN_INDEXABLE_OFFERS,
} from "@/lib/data";
import { getSiteUrl, SITE_NAME_SHORT } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const ofertas = await getOfertasConCuotas();
  const thin = ofertas.length < MIN_INDEXABLE_OFFERS;
  const title = `Cubiertas en cuotas sin interés | ${SITE_NAME_SHORT}`;
  const description =
    "Ofertas de cubiertas con más cuotas sin interés. Filtrá por medida. Las condiciones de cada tienda pueden cambiar.";

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/cuotas" },
    robots: thin ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description:
        "Compará ofertas con cuotas sin interés. Verificá siempre en la tienda.",
      locale: "es_AR",
      type: "website",
    },
  };
}

export default async function CuotasPage() {
  const ofertas = await getOfertasConCuotas();
  const ejemplo = isExampleData(ofertas);
  const medidasConCuotas = [
    ...new Map(
      ofertas.map((o) => {
        const m = getMedidas().find((x) => x.slug === o.medidaSlug);
        return [
          o.medidaSlug,
          { slug: o.medidaSlug, label: m?.label ?? o.medidaSlug },
        ] as const;
      })
    ).values(),
  ].sort((a, b) => a.label.localeCompare(b.label, "es"));

  const base = getSiteUrl();
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: base },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cuotas",
        item: `${base}/cuotas`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <PricesSourceBanner ejemplo={ejemplo} />

      <div className="container-site py-8 sm:py-10">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Cuotas" }]}
        />

        <header className="mt-6 max-w-2xl sm:mt-8">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl">
            Cubiertas en cuotas sin interés
          </h1>
          <p className="mt-2 text-tinta-500">
            Ordenadas por cantidad de cuotas y precio. Las condiciones de cada
            tienda pueden cambiar: verificá en la ficha antes de comprar.
          </p>
        </header>

        <div
          role="note"
          className="mt-6 rounded-xl border border-ambar-200 bg-ambar-100/60 px-4 py-3 text-sm text-asfalto-950"
        >
          Las cuotas sin interés dependen del banco, la tarjeta y la promoción
          del momento. El número que ves es el máximo publicado al scrapear; en
          el checkout puede variar.
        </div>

        <div className="mt-8">
          <CuotasFilter ofertas={ofertas} medidas={medidasConCuotas} />
        </div>
      </div>
    </>
  );
}
