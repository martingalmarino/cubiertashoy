"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type MedidaOdometerProps = {
  label: string;
  className?: string;
};

/** Cada carácter con slide vertical al cambiar (efecto odómetro). */
export function MedidaOdometer({ label, className }: MedidaOdometerProps) {
  const reduce = useReducedMotion();
  const chars = label.split("");

  return (
    <span
      aria-label={label}
      className={cn(
        "inline-flex overflow-hidden font-mono font-bold tabular-nums tracking-[-0.04em]",
        className
      )}
    >
      {chars.map((ch, i) => (
        <span
          key={`slot-${i}`}
          className="relative inline-block h-[1.05em] min-w-[0.55ch] overflow-hidden"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${i}-${ch}`}
              className="absolute inset-x-0 top-0 text-center"
              initial={reduce ? false : { y: "70%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={reduce ? undefined : { y: "-70%", opacity: 0 }}
              transition={{
                duration: reduce ? 0 : 0.28,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
