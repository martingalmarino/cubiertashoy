"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Los precios son por unidad o por kit?",
    a: "Siempre por unidad. Si una tienda publica kit x2 o x4, dividimos el precio para comparar manzana con manzana.",
  },
  {
    q: "¿Cómo sé si un descuento es real?",
    a: "Comparamos el precio “antes” con el historial de las últimas semanas. Si el “antes” está inflado respecto a lo que se venía cobrando, lo marcamos.",
  },
  {
    q: "¿De dónde salen los precios?",
    a: "En esta fase mostramos datos de ejemplo. En la siguiente, scrapers de tiendas argentinas con actualización frecuente.",
  },
  {
    q: "¿Puedo buscar por auto?",
    a: "Todavía no. La búsqueda por auto (marca, modelo, versión y año) llega en una fase posterior.",
  },
] as const;

export function HomeFaq() {
  return (
    <Accordion className="divide-y divide-niebla-200 rounded-lg border border-niebla-200 bg-white px-4">
      {faqs.map((item, i) => (
        <AccordionItem key={item.q} value={`item-${i}`}>
          <AccordionTrigger className="min-h-11 py-4 text-base font-medium text-asfalto-950 hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-asfalto-600">
            <p>{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
