import Link from "next/link";
import { ArrowRight, Scale, Search, ShieldCheck } from "lucide-react";

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
          <span className="font-mono text-lg font-semibold text-tinta-900">
            3
          </span>{" "}
          <span className="font-semibold text-tinta-900">pasos</span>
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
          <span className="font-mono text-lg font-semibold text-tinta-900">
            {ofertasConDescuentoReal}
          </span>{" "}
          <span className="font-semibold text-tinta-900">ofertas</span> con
          descuento real
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
          <span className="font-semibold text-tinta-900">real o inflado</span>
        </>
      ),
      href: "/#tiendas",
    },
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className={`${card.bg} flex h-full flex-col rounded-xl p-6 text-tinta-900`}
        >
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-white text-tinta-900 shadow-card">
            <card.icon className="size-5" aria-hidden strokeWidth={1.75} />
          </span>
          <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">
            {card.title}
          </h3>
          <p className="mt-2 text-sm text-tinta-700">{card.body}</p>
          <div className="mt-5 rounded-xl bg-white/80 px-4 py-3 text-sm ring-1 ring-black/5">
            {card.highlight}
          </div>
          <div className="mt-auto pt-5">
          <Link
            href={card.href}
            className="inline-flex size-10 items-center justify-center rounded-full bg-white text-tinta-900 shadow-card transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
            aria-label={`Ir a ${card.title}`}
          >
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
