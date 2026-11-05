"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getMedidaFaqItems } from "@/lib/faq-medida";

type MedidaFaqProps = {
  medidaLabel: string;
};

export function MedidaFaq({ medidaLabel }: MedidaFaqProps) {
  const faqs = getMedidaFaqItems(medidaLabel);

  return (
    <Accordion className="divide-y divide-niebla-200 rounded-lg border border-niebla-200 bg-white px-4">
      {faqs.map((item, i) => (
        <AccordionItem key={item.q} value={`faq-${i}`}>
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
