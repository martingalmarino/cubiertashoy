import Image from "next/image";
import { storeLogoSrc } from "@/lib/stores";
import { cn } from "@/lib/utils";

type StoreLogoProps = {
  storeId: string;
  nombre: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const HEIGHT = { sm: 20, md: 24, lg: 32 } as const;

export function StoreLogo({
  storeId,
  nombre,
  size = "sm",
  className,
}: StoreLogoProps) {
  const src = storeLogoSrc(storeId);
  const h = HEIGHT[size];

  if (!src) {
    return (
      <span
        className={cn(
          "truncate text-sm font-medium text-tinta-900",
          className
        )}
      >
        {nombre}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={nombre}
      width={size === "lg" ? 140 : size === "md" ? 110 : 88}
      height={h}
      className={cn(
        "w-auto object-contain",
        size === "sm" && "h-5 max-w-[88px]",
        size === "md" && "h-6 max-w-[110px]",
        size === "lg" && "h-8 max-w-[140px]",
        className
      )}
    />
  );
}
