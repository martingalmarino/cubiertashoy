"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Medida } from "@/lib/types";

type PopularesBandProps = {
  medidas: Medida[];
};

export function PopularesBand({ medidas }: PopularesBandProps) {
  const scroller = useRef<HTMLUListElement>(null);

  function scrollNext() {
    scroller.current?.scrollBy({ left: 180, behavior: "smooth" });
  }

  return (
    <div className="grad-lila rounded-xl p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-[-0.02em] text-tinta-900 md:text-lg dark:text-tinta-900">
          Medidas populares
        </h2>
        <button
          type="button"
          onClick={scrollNext}
          className="inline-flex size-11 items-center justify-center rounded-full bg-superficie text-tinta-700 shadow-card transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
          aria-label="Ver más medidas populares"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
      <ul
        ref={scroller}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {medidas.map((m) => (
          <li key={m.slug} className="snap-start shrink-0">
            <Link
              href={`/medida/${m.slug}`}
              className="inline-flex h-11 items-center rounded-md bg-superficie px-4 font-mono text-sm font-semibold tabular-nums text-tinta-900 shadow-card transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
            >
              {m.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
