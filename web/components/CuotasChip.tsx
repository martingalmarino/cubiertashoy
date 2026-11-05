import { cn } from "@/lib/utils";

type CuotasChipProps = {
  cuotas?: number;
  sinInteres?: boolean;
  variant?: "cuotas" | "colocacion";
  /** Texto corto para tablas densas. */
  compact?: boolean;
  className?: string;
};

export function CuotasChip({
  cuotas,
  sinInteres = true,
  variant = "cuotas",
  compact = false,
  className,
}: CuotasChipProps) {
  if (variant === "cuotas" && (cuotas == null || cuotas < 2)) {
    return null;
  }

  const full =
    variant === "colocacion"
      ? "Colocación gratis"
      : `${cuotas} ${cuotas === 1 ? "cuota" : "cuotas"}${sinInteres ? " sin interés" : ""}`;

  const short =
    variant === "colocacion"
      ? "Coloc. gratis"
      : `${cuotas} ${cuotas === 1 ? "cuota" : "cuotas"}${sinInteres ? " s/int." : ""}`;

  return (
    <span
      title={full}
      className={cn(
        "inline-flex max-w-full items-center rounded-md bg-ambar-100 px-2 py-0.5 text-left text-[11px] font-medium leading-tight text-asfalto-950 whitespace-normal",
        !compact && "rounded-full px-2.5 py-1 text-xs",
        className
      )}
    >
      {compact ? short : full}
    </span>
  );
}
