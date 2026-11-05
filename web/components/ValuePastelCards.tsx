import Link from "next/link";
import { ArrowRight, Scale, Search, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

type ValuePastelCardsProps = {
  ofertasConDescuentoReal: number;
};

export function ValuePastelCards({
  ofertasConDescuentoReal,
}: ValuePastelCardsProps) {
  const cards = [
    {
      bg: "bg-pastel-limon",
      icon: Search,
      title: "Elegí tu medida",
      body: "Ancho, perfil y rodado como en el flanco. Sin cuentas.",
      highlight: (
        <>
          Buscá en{" "}
          <strong className="font-semibold text-tinta-900">3 pasos</strong>
        </>
      ),
      href: "/#medidas",
    },
    {
      bg: "bg-pastel-menta",
      icon: Scale,
      title: "Compará ofertas",
      body: "Efectivo, tarjeta, cuotas y colocación en un solo lugar.",
      highlight: (
        <>
          Hoy hay{" "}
          <strong className="font-semibold text-tinta-900">
            {ofertasConDescuentoReal} ofertas
          </strong>{" "}
          con descuento real
        </>
      ),
      href: "/#buscadas",
    },
    {
      bg: "bg-pastel-cielo",
      icon: ShieldCheck,
      title: "Comprá con criterio",
      body: "Señalamos cuando el “antes” está inflado respecto al historial.",
      highlight: (
        <>
          Descuento{" "}
          <strong className="font-semibold text-tinta-900">real o inflado</strong>
        </>
      ),
      href: "/#tiendas",
    },
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, i) => (
        <FadeIn key={card.title} delay={i * 0.04} as="article">
          <div
            className={`${card.bg} flex h-full flex-col rounded-xl p-6 text-tinta-900`}
          >
            <span className="inline-flex size-11 items-center justify-center rounded-md bg-superficie text-tinta-900 shadow-card">
              <card.icon className="size-5" aria-hidden strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-tinta-700">{card.body}</p>
            <div className="mt-4 rounded-lg bg-white/70 px-3 py-2.5 text-sm backdrop-blur-sm dark:bg-superficie/70">
              {card.highlight}
            </div>
            <Link
              href={card.href}
              className="mt-5 inline-flex size-11 items-center justify-center rounded-full bg-superficie text-tinta-900 shadow-card transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
              aria-label={`Ir a ${card.title}`}
            >
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
