import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { getSiteUrl, SITE_NAME_SHORT } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Para gomerías | ${SITE_NAME_SHORT}`,
  },
  description:
    "Recibí pedidos de cubiertas con colocación en tu zona. Planes para gomerías: leads calificados por WhatsApp.",
  alternates: { canonical: "/para-gomerias" },
  openGraph: {
    title: `Para gomerías | ${SITE_NAME_SHORT}`,
    description:
      "Leads de vecinos que buscan cubiertas con colocación cerca.",
    locale: "es_AR",
    type: "website",
  },
};

export default function ParaGomeriasPage() {
  const base = getSiteUrl();
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: base },
      {
        "@type": "ListItem",
        position: 2,
        name: "Para gomerías",
        item: `${base}/para-gomerias`,
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
            { label: "Para gomerías" },
          ]}
        />

        <header className="mt-6 max-w-2xl sm:mt-8">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-tinta-900 sm:text-4xl">
            Pedidos de cubiertas en tu zona
          </h1>
          <p className="mt-3 text-tinta-500">
            Cuando alguien pide presupuesto con colocación, te lo mandamos por
            WhatsApp o mail. Vos cotizás. Sin exclusividad.
          </p>
        </header>

        <ol className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "1",
              t: "Vecino pide",
              d: "Entra a una medida, elige localidad y cantidad, y deja WhatsApp.",
            },
            {
              n: "2",
              t: "Te llega el lead",
              d: "Nombre, medida, cantidad y barrio. Solo gomerías activas de esa localidad.",
            },
            {
              n: "3",
              t: "Cotizás vos",
              d: "Contactás por WhatsApp con precio y colocación. Cerrás la venta.",
            },
          ].map((s) => (
            <li
              key={s.n}
              className="rounded-xl border border-borde bg-superficie p-5 shadow-card"
            >
              <p className="font-mono text-sm tabular-nums text-tinta-400">
                {s.n}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-tinta-900">
                {s.t}
              </h2>
              <p className="mt-1 text-sm text-tinta-500">{s.d}</p>
            </li>
          ))}
        </ol>

        <section className="mt-12 max-w-2xl" aria-labelledby="planes">
          <h2
            id="planes"
            className="text-xl font-semibold tracking-[-0.02em] text-tinta-900"
          >
            Planes
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-tinta-500">
            <li className="rounded-xl border border-borde bg-fondo px-4 py-3">
              <span className="font-medium text-tinta-900">Gratis</span> —
              prueba en tu localidad, cupo acotado.
            </li>
            <li className="rounded-xl border border-borde bg-fondo px-4 py-3">
              <span className="font-medium text-tinta-900">Básico / Pro</span> —
              prioridad de ruteo y más leads. Precios al sumarte.
            </li>
          </ul>
        </section>

        <p className="mt-10 text-sm text-tinta-500">
          Escribinos a{" "}
          <a
            href="mailto:hola@precioneumaticos.com.ar"
            className="font-medium text-accion-600 hover:text-accion-700 focus-visible:ring-2 focus-visible:ring-accion-600"
          >
            hola@precioneumaticos.com.ar
          </a>{" "}
          con tu gomería, localidad y WhatsApp. También podés leer{" "}
          <Link
            href="/como-ganamos-plata"
            className="underline underline-offset-2 hover:text-tinta-800"
          >
            cómo ganamos plata
          </Link>
          .
        </p>
      </div>
    </>
  );
}
