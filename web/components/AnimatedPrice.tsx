"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { formatARS } from "@/lib/format";
import { cn } from "@/lib/utils";

type AnimatedPriceProps = {
  value: number;
  className?: string;
  durationMs?: number;
  /** Si true, cuenta desde 0 (CheapestCard). */
  fromZero?: boolean;
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

export function AnimatedPrice({
  value,
  className,
  durationMs = 600,
  fromZero = false,
}: AnimatedPriceProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);
  const didRun = useRef(false);

  useEffect(() => {
    if (reduceMotion) return;
    if (fromZero && didRun.current) return;
    didRun.current = true;

    const from = fromZero ? 0 : Math.round(value * 0.88);
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
  }, [value, durationMs, reduceMotion, fromZero]);

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {formatARS(reduceMotion ? value : display)}
    </span>
  );
}
