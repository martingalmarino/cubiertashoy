"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { MedidaSearch } from "@/components/MedidaSearch";
import { cn } from "@/lib/utils";
import type { Medida } from "@/lib/types";

const nav = [
  { href: "/medidas", label: "Medidas" },
  { href: "/auto", label: "Autos" },
  { href: "/cuotas", label: "Cuotas" },
] as const;

type VehicleOption = {
  slug: string;
  marca: string;
  modelo: string;
  label: string;
};

type HeaderProps = {
  medidas?: Medida[];
  vehicles?: VehicleOption[];
};

export function Header({ medidas = [], vehicles = [] }: HeaderProps) {
  const [showCompact, setShowCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const canShowSearch = medidas.length > 0;

  useEffect(() => {
    if (!canShowSearch) return;
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowCompact(!entry?.isIntersecting);
      },
      { threshold: 0, rootMargin: "-56px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [canShowSearch]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const mobileMenu =
    menuOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            id="nav-mobile"
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
          >
            <button
              type="button"
              className="absolute inset-0 bg-asfalto-950/40"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute inset-y-0 right-0 flex w-[min(100%,320px)] flex-col bg-white shadow-hero">
              <div className="flex h-14 items-center justify-between border-b border-borde px-4">
                <p className="text-sm font-semibold text-tinta-900">Menú</p>
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-xl text-tinta-700 hover:bg-fondo focus-visible:ring-2 focus-visible:ring-accion-600"
                  aria-label="Cerrar menú"
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <nav
                className="flex flex-col gap-1 p-3"
                aria-label="Principal móvil"
              >
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex h-12 items-center rounded-xl px-4 text-lg font-medium text-tinta-900 hover:bg-fondo focus-visible:ring-2 focus-visible:ring-accion-600"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-borde bg-white/90 backdrop-blur-md">
        <div className="container-site flex h-14 min-w-0 items-center gap-2 md:h-16 md:gap-3">
          <Logo />

          <div
            className={cn(
              "mx-auto hidden min-w-0 flex-1 justify-center px-4 transition-opacity duration-300 md:flex",
              showCompact && canShowSearch
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            )}
            aria-hidden={!showCompact}
          >
            {canShowSearch && (
              <MedidaSearch
                medidas={medidas}
                vehicles={vehicles}
                variant="compact"
                className="w-full max-w-md"
              />
            )}
          </div>

          <nav
            aria-label="Principal"
            className="ml-auto hidden items-center gap-1 md:flex"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-tinta-500 transition-colors duration-200 hover:text-tinta-900 focus-visible:ring-2 focus-visible:ring-accion-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="ml-auto inline-flex size-11 items-center justify-center rounded-xl text-tinta-700 hover:bg-fondo focus-visible:ring-2 focus-visible:ring-accion-600 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="nav-mobile"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
