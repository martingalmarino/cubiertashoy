"use client";

import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getMedidaFaqItems } from "@/lib/faq-medida";

type FaqItem = { q: string; a: string };

type MedidaFaqProps = {
  medidaLabel: string;
  items?: FaqItem[];
};

export function MedidaFaq({ medidaLabel, items }: MedidaFaqProps) {
  const faqs = items ?? getMedidaFaqItems(medidaLabel);

  return (
    <Accordion className="divide-y divide-borde rounded-xl border border-borde bg-superficie px-4 shadow-card">
      {faqs.map((item, i) => (
        <AccordionItem key={item.q} value={`faq-${i}`} className="border-borde">
          <AccordionTrigger className="min-h-11 py-4 text-base font-medium text-tinta-900 hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
            <span className="pr-4 text-left">{item.q}</span>
            <Plus
              aria-hidden
              className="ml-auto size-4 shrink-0 text-tinta-500 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-45"
            />
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-tinta-500">
            <p>{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
