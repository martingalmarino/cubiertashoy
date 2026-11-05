import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getSiteUrl, SITE_NAME_SHORT } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Cómo ganamos plata | ${SITE_NAME_SHORT}`,
  },
  description:
    "Transparencia: comparador gratis para vos. Ingresos por afiliados (Mercado Libre) y leads a gomerías.",
  alternates: { canonical: "/como-ganamos-plata" },
  openGraph: {
    title: `Cómo ganamos plata | ${SITE_NAME_SHORT}`,
    description:
      "Te contamos de dónde salen los ingresos del comparador.",
    locale: "es_AR",
    type: "website",
  },
};

export default function ComoGanamosPlataPage() {
  const base = getSiteUrl();
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: base },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cómo ganamos plata",
        item: `${base}/como-ganamos-plata`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <div className="container-site py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Cómo ganamos plata" },
          ]}
        />

        <header className="mt-6 max-w-2xl sm:mt-8">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl">
            Cómo ganamos plata
          </h1>
          <p className="mt-3 text-tinta-500">
            El comparador es gratis para vos. Los ingresos vienen de dos lados,
            sin cambiar el orden de precios.
          </p>
        </header>

        <div className="mt-10 max-w-2xl space-y-8 text-tinta-700">
          <section>
            <h2 className="text-lg font-semibold text-tinta-900">
              Afiliados de Mercado Libre
            </h2>
            <p className="mt-2 text-sm text-tinta-500">
              Si comprás en Mercado Libre desde un link nuestro, podemos cobrar
              una comisión del programa de afiliados. Ese link lleva{" "}
              <span className="font-mono text-xs">rel=&quot;sponsored&quot;</span>
              . El precio que ves es el de la publicación; no te cobramos de más.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-tinta-900">
              Leads a gomerías
            </h2>
            <p className="mt-2 text-sm text-tinta-500">
              Si pedís presupuesto con colocación, pasamos tu contacto a una
              gomería de tu zona. Ellas pagan por esos pedidos. Detalle en{" "}
              <Link
                href="/para-gomerias"
                className="font-medium text-accion-600 hover:text-accion-700"
              >
                para gomerías
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-tinta-900">
              Lo que no hacemos
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-tinta-500">
              <li>No reordenamos ofertas según quién paga más.</li>
              <li>No inventamos descuentos.</li>
              <li>No vendemos tus datos a listas de spam.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
