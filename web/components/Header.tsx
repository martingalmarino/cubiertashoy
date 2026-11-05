"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { MedidaSearch } from "@/components/MedidaSearch";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import type { Medida } from "@/lib/types";

const nav = [
  { href: "/#medidas", label: "Medidas" },
  { href: "/#autos", label: "Autos" },
] as const;

type HeaderProps = {
  medidas?: Medida[];
};

export function Header({ medidas = [] }: HeaderProps) {
  const [showCompact, setShowCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowCompact(window.scrollY > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-white/80 backdrop-blur-md dark:bg-superficie/80">
      <div className="container-site flex h-16 items-center gap-3">
        <Logo />

        <div
          className={cn(
            "mx-auto hidden min-w-0 flex-1 justify-center px-4 transition-all duration-200 lg:flex",
            showCompact && medidas.length > 0
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          )}
        >
          {medidas.length > 0 && (
            <MedidaSearch
              medidas={medidas}
              variant="compact"
              className="w-full max-w-md"
            />
          )}
        </div>

        <nav aria-label="Principal" className="ml-auto flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center px-2.5 text-sm font-medium text-tinta-500 transition-colors duration-200 hover:text-tinta-900 sm:px-3"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
