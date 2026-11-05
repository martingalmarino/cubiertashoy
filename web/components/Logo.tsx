import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  href?: string;
  /** Versión clara para fondos oscuros (footer). */
  inverse?: boolean;
};

export function Logo({ className, href = "/", inverse = false }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 no-underline",
        inverse ? "text-papel" : "text-tinta-900",
        "rounded-md focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2",
        className
      )}
      aria-label="cubiertas hoy — inicio"
    >
      <span className="font-sans text-lg font-semibold tracking-[-0.02em] sm:text-xl">
        cubiertas
      </span>
      <span className="inline-flex items-center rounded-full bg-ambar-500 px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-asfalto-950 sm:text-sm">
        hoy
      </span>
    </Link>
  );
}
