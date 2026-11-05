"use client";

import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";

type AdSlotProps = {
  /** Identificador lógico del slot (ej. medida-mid). */
  slot: string;
  /** Alto reservado para no romper CLS (px). Default 90. */
  height?: number;
  className?: string;
};

const ADSENSE_ENABLED =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID ?? "";

/**
 * Placeholder de AdSense con altura fija (CLS estable).
 * Desactivado hasta NEXT_PUBLIC_ADSENSE_ENABLED=true + client/slot.
 */
export function AdSlot({ slot, height = 90, className }: AdSlotProps) {
  const reactId = useId();
  const enabled = ADSENSE_ENABLED && Boolean(ADSENSE_CLIENT && ADSENSE_SLOT);

  useEffect(() => {
    if (!enabled) return;
    try {
      const w = window as Window & {
        adsbygoogle?: Record<string, unknown>[];
      };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      // ignore
    }
  }, [enabled, reactId]);

  // Altura fija siempre → al activar AdSense no debería saltar el layout (CLS).
  return (
    <aside
      className={cn(
        "w-full overflow-hidden",
        enabled && "rounded-xl border border-borde bg-fondo",
        className
      )}
      style={{ minHeight: height, height }}
      aria-label={enabled ? "Publicidad" : undefined}
      aria-hidden={!enabled}
      data-ad-slot={slot}
    >
      {enabled ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: height, height, width: "100%" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={ADSENSE_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : null}
    </aside>
  );
}
