import type { Metadata } from "next";
import {
  Search,
  Scale,
  ShoppingCart,
  Store,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { ExampleDataBanner } from "@/components/ExampleDataBanner";
import { MedidaSearch } from "@/components/MedidaSearch";
import { MedidaCard } from "@/components/MedidaCard";
import { HomeFaq } from "@/components/HomeFaq";
import {
  getMedidas,
  getMedidasMasBuscadas,
  getMedidasPopulares,
} from "@/lib/data";
import { SITE_NAME, SITE_NAME_SHORT } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `Compará precios de cubiertas por medida | ${SITE_NAME_SHORT}`,
  },
  description:
    "El mejor precio de tu cubierta, hoy. Compará tiendas de todo el país por medida exacta. Efectivo, tarjeta, cuotas e historial.",
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description:
      "El mejor precio de tu cubierta, hoy. Compará tiendas de todo el país.",
    locale: "es_AR",
    type: "website",
    url: "/",
  },
};

export default function Home() {
  const medidas = getMedidas();
  const populares = getMedidasPopulares(6);
  const masBuscadas = getMedidasMasBuscadas(8);

  return (
    <>
      <ExampleDataBanner />

      <section className="relative overflow-hidden border-b border-niebla-200 bg-asfalto-950 text-papel">
        <div className="tread-texture absolute inset-0 opacity-80" aria-hidden />
        <div className="container-site relative py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-papel sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
              El mejor precio de tu cubierta, hoy.
            </h1>
            <p className="mt-4 text-base text-grafito-400 sm:text-lg">
              Comparamos tiendas de todo el país. Poné tu medida y listo.
            </p>
          </div>

          <div
            id="medidas"
            className="mx-auto mt-8 max-w-2xl scroll-mt-24 sm:mt-10"
          >
            <MedidaSearch medidas={medidas} populares={populares} />
          </div>
        </div>
      </section>

      <section className="border-b border-niebla-200 bg-papel py-12 sm:py-16">
        <div className="container-site">
          <div className="mb-8 max-w-2xl">
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-asfalto-950 sm:text-[30px]">
              Medidas más buscadas
            </h2>
            <p className="mt-2 text-asfalto-600">
              Precio desde por unidad, con la variación de la última semana.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {masBuscadas.map((m) => (
              <MedidaCard key={m.slug} medida={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-niebla-200 bg-niebla-100 py-12 sm:py-16">
        <div className="container-site">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-asfalto-950 sm:text-[30px]">
            Cómo funciona
          </h2>
          <p className="mt-2 max-w-xl text-asfalto-600">
            Tres pasos. Sin cuentas ni vueltas.
          </p>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Search,
                n: "1",
                title: "Elegí tu medida",
                body: "Ancho, perfil y rodado como en el flanco de tu cubierta.",
              },
              {
                icon: Scale,
                n: "2",
                title: "Compará ofertas",
                body: "Efectivo, tarjeta, cuotas y colocación en un solo lugar.",
              },
              {
                icon: ShoppingCart,
                n: "3",
                title: "Comprá donde conviene",
                body: "Te llevamos a la tienda con el mejor precio de hoy.",
              },
            ].map((step) => (
              <li
                key={step.n}
                className="rounded-lg border border-niebla-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-md bg-asfalto-950 font-mono text-sm font-bold text-papel">
                    {step.n}
                  </span>
                  <step.icon
                    className="size-5 text-azul-600"
                    aria-hidden
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-asfalto-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-asfalto-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="autos"
        className="scroll-mt-24 border-b border-niebla-200 bg-papel py-12 sm:py-16"
      >
        <div className="container-site">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-asfalto-950 sm:text-[30px]">
            Por qué confiar
          </h2>
          <p className="mt-2 max-w-xl text-asfalto-600">
            Transparencia primero. Sin “ofertón” inventado.
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Store,
                title: "Varias tiendas",
                body: "Norauto, Naldo, Neumaflores, 360 Neumáticos y más.",
              },
              {
                icon: RefreshCw,
                title: "Actualización frecuente",
                body: "Los precios se refrescan para que veas el día de hoy.",
              },
              {
                icon: ShieldCheck,
                title: "Descuento real",
                body: "Señalamos cuando el “antes” está inflado respecto al historial.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md bg-ambar-100 text-asfalto-950">
                  <item.icon className="size-5" aria-hidden strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-asfalto-950">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-asfalto-600">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-md border border-niebla-200 bg-niebla-100 px-4 py-3 text-sm text-asfalto-600">
            La búsqueda por auto llega pronto. Por ahora, usá la medida del
            flanco.
          </p>
        </div>
      </section>

      <section className="bg-papel py-12 sm:py-16">
        <div className="container-site max-w-3xl">
          <h2 className="mb-6 font-display text-2xl font-semibold tracking-[-0.02em] text-asfalto-950 sm:text-[30px]">
            Preguntas frecuentes
          </h2>
          <HomeFaq />
        </div>
      </section>
    </>
  );
}
