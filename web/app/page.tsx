import type { Metadata } from "next";
import { ExampleDataBanner } from "@/components/ExampleDataBanner";
import { HomeFaq } from "@/components/HomeFaq";
import { MedidaCard } from "@/components/MedidaCard";
import { MedidaSearch } from "@/components/MedidaSearch";
import { PopularesBand } from "@/components/PopularesBand";
import { TiendasRow, type TiendaResumen } from "@/components/TiendasRow";
import { TrustRow } from "@/components/TrustRow";
import { ValuePastelCards } from "@/components/ValuePastelCards";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { HoyUnderline } from "@/components/visual/HoyUnderline";
import {
  getHistorial,
  getMedidas,
  getMedidasMasBuscadas,
  getMedidasPopulares,
  getOfertas,
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
  const populares = getMedidasPopulares(8);
  const masBuscadas = getMedidasMasBuscadas(8);

  const tiendaMap = new Map<string, TiendaResumen>();
  let ofertasConDescuentoReal = 0;
  for (const m of medidas) {
    for (const o of getOfertas(m.slug)) {
      const prev = tiendaMap.get(o.tiendaId);
      if (prev) prev.ofertas += 1;
      else
        tiendaMap.set(o.tiendaId, {
          id: o.tiendaId,
          nombre: o.tiendaNombre,
          ofertas: 1,
        });
      if (o.descuento === "real") ofertasConDescuentoReal += 1;
    }
  }
  const tiendas = [...tiendaMap.values()].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es")
  );

  return (
    <>
      <ExampleDataBanner />

      <section id="hero" className="grad-suave">
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-16 text-center md:pb-20 md:pt-24">
          <h1 className="font-sans text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-tinta-900 md:text-[64px]">
            El mejor precio de tu cubierta, <HoyUnderline />.
          </h1>
          <p className="mt-4 text-base text-tinta-500 md:text-lg">
            Comparamos{" "}
            <strong className="font-semibold text-tinta-900">
              {tiendas.length}
            </strong>{" "}
            tiendas de Argentina. Elegí tu medida y listo.
          </p>

          <div id="medidas" className="scroll-mt-24">
            <MedidaSearch medidas={medidas} />
          </div>

          <div className="mt-10">
            <TrustRow tiendas={tiendas.length} />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-site">
          <PopularesBand medidas={populares} />
        </div>
      </section>

      <section id="buscadas" className="scroll-mt-24 py-12 md:py-16">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
              Medidas más buscadas
            </h2>
            <p className="mt-2 text-tinta-500">
              Precio desde por unidad, con la variación de la última semana.
            </p>
          </div>
          <Stagger className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {masBuscadas.map((m) => {
              const spark = getHistorial(m.slug)
                .slice(-30)
                .map((h) => h.mediana);
              const tiendasCount = new Set(
                getOfertas(m.slug).map((o) => o.tiendaId)
              ).size;
              return (
                <StaggerItem key={m.slug}>
                  <MedidaCard
                    medida={m}
                    sparkline={spark}
                    tiendasCount={tiendasCount}
                  />
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section id="como" className="scroll-mt-24 py-12 md:py-16">
        <div className="container-site">
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
              Cómo funciona
            </h2>
            <p className="mt-2 text-tinta-500">
              Tres pasos. Sin cuentas ni vueltas.
            </p>
          </div>
          <div className="mt-6">
            <ValuePastelCards
              ofertasConDescuentoReal={ofertasConDescuentoReal}
            />
          </div>
        </div>
      </section>

      <section id="tiendas" className="scroll-mt-24 py-12 md:py-16">
        <div className="container-site">
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
              Tiendas que comparamos
            </h2>
            <p className="mt-2 text-tinta-500">
              Solo las que ya tienen ofertas en nuestros datos.
            </p>
          </div>
          <div className="mt-6">
            <TiendasRow tiendas={tiendas} />
          </div>
        </div>
      </section>

      <section
        id="autos"
        className="scroll-mt-24 border-t border-borde py-12 md:py-16"
      >
        <div className="container-site max-w-3xl">
          <FadeIn>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
              Preguntas frecuentes
            </h2>
            <div className="mt-6">
              <HomeFaq />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
