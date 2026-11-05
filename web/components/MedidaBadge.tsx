import { cn } from "@/lib/utils";

type MedidaBadgeProps = {
  label: string;
  className?: string;
};

export function MedidaBadge({ label, className }: MedidaBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-fit shrink-0 items-center self-start rounded-full bg-asfalto-950 px-3",
        "font-mono text-xs font-semibold tabular-nums tracking-tight text-white",
        className
      )}
    >
      {label}
    </span>
  );
}
