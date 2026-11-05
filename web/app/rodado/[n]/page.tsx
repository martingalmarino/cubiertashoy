import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PricesSourceBanner } from "@/components/PricesSourceBanner";
import {
  getRodadoLinkLabel,
  getRodadoSeoCopy,
} from "@/content/rodados";
import {
  getIndexableRodados,
  getMedidasPorRodado,
  MIN_INDEXABLE_OFFERS,
  RODADOS,
} from "@/lib/data";
import { formatARS } from "@/lib/format";
import { getSiteUrl, SITE_NAME_SHORT } from "@/lib/site";

type PageProps = {
  params: Promise<{ n: string }>;
};

export async function generateStaticParams() {
  const rodados = await getIndexableRodados();
  return rodados.map((n) => ({ n: String(n) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { n } = await params;
  const rodado = Number(n);
  if (!RODADOS.includes(rodado as (typeof RODADOS)[number])) {
    return { title: "Rodado no encontrado" };
  }
  const medidas = await getMedidasPorRodado(rodado);
  const total = medidas.reduce((a, m) => a + m.ofertasCount, 0);
  const thin = total < MIN_INDEXABLE_OFFERS;
  const seo = getRodadoSeoCopy(rodado);
  const title =
    seo?.title ??
    `Cubiertas R${rodado}: medidas y precios | ${SITE_NAME_SHORT}`;
  const description =
    seo?.metaDescription ??
    `Todas las medidas de cubiertas con rodado R${rodado}. Compará precios por unidad en Argentina.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/rodado/${rodado}` },
    robots: thin ? { index: false, follow: true } : undefined,
    openGraph: { title, description, locale: "es_AR", type: "website" },
  };
}

export default async function RodadoPage({ params }: PageProps) {
  const { n } = await params;
  const rodado = Number(n);
  if (!RODADOS.includes(rodado as (typeof RODADOS)[number])) notFound();

  const medidas = (await getMedidasPorRodado(rodado)).filter(
    (m) => m.ofertasCount > 0
  );
  const total = medidas.reduce((a, m) => a + m.ofertasCount, 0);
  const thin = total < MIN_INDEXABLE_OFFERS;
  const base = getSiteUrl();
  const pageUrl = `${base}/rodado/${rodado}`;
  const seo = getRodadoSeoCopy(rodado);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: base },
      { "@type": "ListItem", position: 2, name: `Rodado R${rodado}`, item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <PricesSourceBanner ejemplo={false} />

      <div className="container-site py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: `Rodado R${rodado}` },
          ]}
        />

        <header className="mt-6 max-w-2xl sm:mt-8">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl">
            {seo?.h1 ?? `Cubiertas R${rodado}`}
          </h1>
          <p className="mt-2 text-base leading-relaxed text-tinta-500">
            {seo?.intro ?? (
              <>
                Medidas con rodado{" "}
                <span className="font-mono tabular-nums">R{rodado}</span> y
                precio desde por unidad.
              </>
            )}
          </p>
        </header>

        {thin ? (
          <p className="mt-6 rounded-xl border border-borde bg-fondo px-4 py-4 text-sm text-tinta-500">
            Todavía hay pocas ofertas en R{rodado}.
          </p>
        ) : null}

        {seo ? (
          <h2 className="mt-8 text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
            {seo.listadoH2}
          </h2>
        ) : null}

        <ul
          className={`${seo ? "mt-4" : "mt-8"} grid gap-3 sm:grid-cols-2 lg:grid-cols-3`}
        >
          {medidas.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/medida/${m.slug}`}
                className="flex min-h-16 flex-col justify-center rounded-xl border border-borde bg-superficie px-4 py-3 shadow-card transition-shadow hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accion-600"
              >
                <span className="font-mono text-lg font-semibold tabular-nums text-tinta-900">
                  {m.label}
                </span>
                <span className="mt-1 text-sm text-tinta-500">
                  {m.precioDesde != null ? (
                    <>
                      desde{" "}
                      <span className="font-mono tabular-nums text-tinta-800">
                        {formatARS(m.precioDesde)}
                      </span>
                    </>
                  ) : (
                    "sin precio reciente"
                  )}
                  {" · "}
                  <span className="font-mono tabular-nums">{m.ofertasCount}</span>{" "}
                  ofertas
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {seo ? (
          <div className="mt-10 max-w-3xl space-y-8">
            {seo.secciones.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-2 text-base leading-relaxed text-tinta-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <section>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
                {seo.faqsTitle}
              </h2>
              <div className="mt-4 space-y-6">
                {seo.faqs.map((faq) => (
                  <div key={faq.q}>
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-tinta-900">
                      {faq.q}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-tinta-700">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        <nav aria-label="Otros rodados" className="mt-10 max-w-3xl">
          {seo ? (
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
              {seo.otrosRodadosH2}
            </h2>
          ) : null}
          <div className={`${seo ? "mt-4" : ""} flex flex-wrap gap-2`}>
            {RODADOS.map((r) => (
              <Link
                key={r}
                href={`/rodado/${r}`}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-accion-600 ${
                  r === rodado
                    ? "bg-tinta-900 text-white"
                    : "bg-superficie text-tinta-700 ring-1 ring-borde"
                }`}
              >
                {seo ? getRodadoLinkLabel(r) : `R${r}`}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
