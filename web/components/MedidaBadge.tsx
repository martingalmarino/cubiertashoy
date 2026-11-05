import { cn } from "@/lib/utils";

type MedidaBadgeProps = {
  label: string;
  className?: string;
};

export function MedidaBadge({ label, className }: MedidaBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-auto items-center rounded-full bg-asfalto-950 px-3",
        "font-mono text-sm font-bold tabular-nums tracking-tight text-papel",
        className
      )}
    >
      {label}
    </span>
  );
}
