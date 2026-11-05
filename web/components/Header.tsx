import Link from "next/link";
import { Logo } from "@/components/Logo";

const nav = [
  { href: "/#medidas", label: "Medidas" },
  { href: "/#autos", label: "Autos" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-niebla-200 bg-papel/95 backdrop-blur-sm">
      <div className="container-site flex h-14 items-center justify-between gap-3 sm:h-16">
        <Logo />
        <nav aria-label="Principal" className="flex items-center">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center px-2.5 text-sm font-medium text-asfalto-600 transition-colors duration-200 ease-[var(--ease-brand)] hover:text-asfalto-950 sm:px-3"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/styleguide"
            className="ml-1 hidden min-h-11 items-center px-3 text-sm font-medium text-grafito-400 transition-colors duration-200 hover:text-asfalto-950 sm:inline-flex"
          >
            Styleguide
          </Link>
        </nav>
      </div>
    </header>
  );
}
