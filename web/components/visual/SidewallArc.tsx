"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TreadPattern } from "@/components/visual/TreadPattern";

type SidewallArcProps = {
  className?: string;
};

/** Arco de flanco con patrón de banda; rotación lenta del fill. */
export function SidewallArc({ className }: SidewallArcProps) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 640 420"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <TreadPattern id="sidewall-tread" />
        <clipPath id="sidewall-clip">
          <path d="M40 400 C120 80, 520 80, 600 400 L560 400 C500 140, 140 140, 80 400 Z" />
        </clipPath>
      </defs>

      <g className="text-asfalto-800 opacity-[0.11] dark:opacity-[0.22]">
        <path
          d="M40 400 C120 80, 520 80, 600 400"
          fill="none"
          stroke="currentColor"
          strokeWidth="56"
          strokeLinecap="round"
        />
        <g clipPath="url(#sidewall-clip)">
          <motion.g
            style={{ originX: "50%", originY: "70%" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={
              reduce
                ? undefined
                : { duration: 60, ease: "linear", repeat: Infinity }
            }
          >
            <rect
              x="-80"
              y="-80"
              width="800"
              height="600"
              fill="url(#sidewall-tread)"
              className="text-asfalto-800"
            />
          </motion.g>
        </g>
      </g>
    </svg>
  );
}
