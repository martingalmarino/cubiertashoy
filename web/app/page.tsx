import type { Metadata } from "next";
import { PricesSourceBanner } from "@/components/PricesSourceBanner";
import { HomeFaq } from "@/components/HomeFaq";
import { MedidaCard } from "@/components/MedidaCard";
import { MedidaSearch } from "@/components/MedidaSearch";
import { AutosPopulares } from "@/components/AutosPopulares";
import { OfertasHoyLine } from "@/components/OfertasHoyLine";
import { PopularesBand } from "@/components/PopularesBand";
import { TiendasRow, type TiendaResumen } from "@/components/TiendasRow";
import { TrustRow } from "@/components/TrustRow";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { HoyUnderline } from "@/components/visual/HoyUnderline";
import {
  getAutosPopulares,
  getHistorial,
  getMedidas,
  getMedidasMasBuscadas,
  getMedidasPopulares,
  getOfertas,
  getPrecioDesde,
  getVehicleSearchIndex,
  isExampleData,
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

export default async function Home() {
  const medidas = getMedidas();
  const vehicles = getVehicleSearchIndex();
  const populares = getMedidasPopulares(12);
  const masBuscadas = await getMedidasMasBuscadas(8);
  const autosPopularesBase = getAutosPopulares(12);
  const autosPopulares = await Promise.all(
    autosPopularesBase.map(async (a) => ({
      ...a,
      precioDesde: await getPrecioDesde(a.medidaSlug),
    }))
  );

  const ofertasBySlug = await Promise.all(
    medidas.map(async (m) => ({ slug: m.slug, ofertas: await getOfertas(m.slug) }))
  );
  const historialBySlug = await Promise.all(
    masBuscadas.map(async (m) => ({
      slug: m.slug,
      hist: await getHistorial(m.slug),
    }))
  );
  const histMap = new Map(historialBySlug.map((h) => [h.slug, h.hist]));
  const ofertasMap = new Map(ofertasBySlug.map((o) => [o.slug, o.ofertas]));

  const tiendaMap = new Map<string, TiendaResumen>();
  let nOfertas = 0;
  let anyReal = false;
  let actualizadoHaceHoras: number | null = null;
  for (const { ofertas } of ofertasBySlug) {
    if (!isExampleData(ofertas) && ofertas.length > 0) anyReal = true;
    nOfertas += ofertas.length;
    for (const o of ofertas) {
      const prev = tiendaMap.get(o.tiendaId);
      if (prev) prev.ofertas += 1;
      else
        tiendaMap.set(o.tiendaId, {
          id: o.tiendaId,
          nombre: o.tiendaNombre,
          ofertas: 1,
        });
      if (
        actualizadoHaceHoras == null ||
        o.actualizadoHaceHoras < actualizadoHaceHoras
      ) {
        actualizadoHaceHoras = o.actualizadoHaceHoras;
      }
    }
  }
  const tiendas = [...tiendaMap.values()].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es")
  );

  return (
    <>
      <PricesSourceBanner ejemplo={!anyReal} />

      <section id="hero" className="grad-suave">
        <div className="mx-auto max-w-3xl px-4 pb-8 pt-10 text-center sm:pb-12 sm:pt-16 md:pb-16 md:pt-24">
          <h1 className="font-sans text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-tinta-900 sm:text-[40px] md:text-[64px] md:leading-[1.05]">
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
            <MedidaSearch medidas={medidas} vehicles={vehicles} />
          </div>

          <div className="mt-4 flex justify-center sm:mt-5">
            <OfertasHoyLine
              nOfertas={nOfertas}
              nTiendas={tiendas.length}
              actualizadoHaceHoras={actualizadoHaceHoras}
            />
          </div>

          <div className="mt-6 sm:mt-8">
            <TrustRow tiendas={tiendas.length} />
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16">
        <div className="container-site">
          <PopularesBand
            medidas={populares.map((m) => ({
              slug: m.slug,
              label: m.label,
              precioDesde:
                ofertasMap.get(m.slug)?.[0]?.precioEfectivo ?? null,
            }))}
          />
        </div>
      </section>

      <section
        id="autos-populares"
        className="scroll-mt-24 py-8 sm:py-12 md:py-16"
      >
        <div className="container-site">
          <AutosPopulares autos={autosPopulares} />
        </div>
      </section>

      <section id="buscadas" className="scroll-mt-24 py-8 sm:py-12 md:py-16">
        <div className="container-site">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-tinta-900 md:text-2xl">
              Medidas más buscadas
            </h2>
            <p className="mt-2 text-tinta-500">
              Precio desde por unidad, con la variación de la última semana.
            </p>
          </div>
          <Stagger className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {masBuscadas.map((m) => {
              const spark = (histMap.get(m.slug) ?? [])
                .slice(-30)
                .map((h) => h.mediana);
              const tiendasCount = new Set(
                (ofertasMap.get(m.slug) ?? []).map((o) => o.tiendaId)
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

      <section id="tiendas" className="scroll-mt-24 py-8 sm:py-12 md:py-16">
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
        className="scroll-mt-24 border-t border-borde py-8 sm:py-12 md:py-16"
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
