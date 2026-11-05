"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { StoreLogo } from "@/components/StoreLogo";
import { trackClickTienda } from "@/lib/analytics";
import { formatARS } from "@/lib/format";
import { outboundHref, outboundRel } from "@/lib/outbound";
import type { OfertaEnriquecida } from "@/lib/types";

type MobileStickyCtaProps = {
  oferta: OfertaEnriquecida;
};

export function MobileStickyCta({ oferta }: MobileStickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById("mas-barato");
    if (!el) return;

    let seen = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!seen) {
          seen = true;
          setVisible(!entry.isIntersecting);
          return;
        }
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.05, rootMargin: "-8px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-borde bg-superficie/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex h-5 items-center gap-2">
            <StoreLogo
              storeId={oferta.tiendaId}
              nombre={oferta.tiendaNombre}
              size="sm"
            />
            <span className="truncate text-xs text-tinta-500">
              {oferta.marca}
            </span>
          </div>
          <p className="mt-0.5 font-mono text-lg font-bold tabular-nums text-tinta-900">
            {formatARS(oferta.precioEfectivo)}
          </p>
        </div>
        <a
          href={outboundHref(oferta)}
          target="_blank"
          rel={outboundRel(oferta)}
          onClick={() => trackClickTienda(oferta)}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-accion-600 px-4 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2"
        >
          Ir
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
