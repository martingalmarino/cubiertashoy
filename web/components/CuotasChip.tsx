import { cn } from "@/lib/utils";

type CuotasChipProps = {
  cuotas?: number;
  sinInteres?: boolean;
  variant?: "cuotas" | "colocacion";
  className?: string;
};

export function CuotasChip({
  cuotas,
  sinInteres = true,
  variant = "cuotas",
  className,
}: CuotasChipProps) {
  const label =
    variant === "colocacion"
      ? "Colocación gratis"
      : `${cuotas} cuotas${sinInteres ? " sin interés" : ""}`;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-ambar-100 px-2.5 py-1",
        "text-xs font-medium text-asfalto-950",
        className
      )}
    >
      {label}
    </span>
  );
}
