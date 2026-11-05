"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { formatARS } from "@/lib/format";
import { cn } from "@/lib/utils";

type AnimatedPriceProps = {
  value: number;
  className?: string;
  durationMs?: number;
};

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true
  );
}

/**
 * Microinteracción de precio: primer paint = valor final (bueno para LCP),
 * luego un conteo corto desde ~88% si no hay reduced-motion.
 */
export function AnimatedPrice({
  value,
  className,
  durationMs = 300,
}: AnimatedPriceProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduceMotion) return;

    const from = Math.round(value * 0.88);
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs, reduceMotion]);

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {formatARS(display)}
    </span>
  );
}
