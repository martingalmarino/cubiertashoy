"use client";

import { AlertTriangle, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { DiscountKind } from "@/lib/types";

type DiscountBadgeProps = {
  kind: Exclude<DiscountKind, null>;
  className?: string;
};

const copy = {
  real: {
    label: "Descuento real",
    tip: "El precio “antes” está en línea con el historial (≤ percentil 75 de 90 días).",
    className: "bg-verde-50 text-verde-600",
    Icon: Check,
  },
  inflado: {
    label: "Descuento inflado",
    tip: "El precio “antes” supera el percentil 75 del historial de 90 días.",
    className: "bg-rojo-50 text-rojo-600",
    Icon: AlertTriangle,
  },
} as const;

export function DiscountBadge({ kind, className }: DiscountBadgeProps) {
  const cfg = copy[kind];
  const Icon = cfg.Icon;

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          "inline-flex h-auto items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
          cfg.className,
          className
        )}
      >
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {cfg.label}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-asfalto-800 text-papel [&_svg]:bg-asfalto-800 [&_svg]:fill-asfalto-800"
      >
        {cfg.tip}
      </TooltipContent>
    </Tooltip>
  );
}
