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
    scroller.current?.scrollBy({ left: 200, behavior: "smooth" });
  }

  return (
    <div className="grad-lila relative rounded-xl p-5 md:p-6">
      <div className="mb-4 flex items-end justify-between gap-3 pr-12">
        <div>
          <h2 className="text-lg font-semibold text-tinta-900">
            Medidas populares
          </h2>
          <p className="mt-1 text-sm text-tinta-700/80">
            Las más buscadas esta semana
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-4 top-5 inline-flex size-11 items-center justify-center rounded-full bg-superficie text-tinta-700 shadow-card transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2 md:right-6 md:top-6"
        aria-label="Ver más medidas populares"
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>

      <div className="relative">
        <ul
          ref={scroller}
          className="scrollbar-none flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-0 sm:px-0 max-sm:-mx-4 max-sm:px-4 [&::-webkit-scrollbar]:hidden"
        >
          {medidas.map((m) => (
            <li key={m.slug} className="snap-start shrink-0">
              <Link
                href={`/medida/${m.slug}`}
                className="inline-flex h-12 items-center rounded-xl bg-white px-5 font-mono text-base font-semibold tabular-nums text-tinta-900 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
              >
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white/50 to-transparent sm:hidden"
        />
      </div>
    </div>
  );
}
