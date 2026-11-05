import type { Metadata } from "next";
import { Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatARS } from "@/lib/format";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Tokens y componentes del sistema de diseño Banda de rodadura.",
  robots: { index: false, follow: false },
};

const colors = [
  { token: "asfalto-950", hex: "#0B0F14", className: "bg-asfalto-950" },
  { token: "asfalto-800", hex: "#1C232C", className: "bg-asfalto-800" },
  { token: "asfalto-600", hex: "#3A4552", className: "bg-asfalto-600" },
  { token: "grafito-400", hex: "#8A96A3", className: "bg-grafito-400" },
  { token: "niebla-200", hex: "#E3E7EB", className: "bg-niebla-200" },
  { token: "niebla-100", hex: "#F1F3F5", className: "bg-niebla-100" },
  { token: "papel", hex: "#FAFAF7", className: "bg-papel border border-niebla-200" },
  { token: "ambar-500", hex: "#F5A524", className: "bg-ambar-500" },
  { token: "ambar-100", hex: "#FEF3DC", className: "bg-ambar-100" },
  { token: "verde-600", hex: "#0F8A5F", className: "bg-verde-600" },
  { token: "verde-50", hex: "#E7F6EF", className: "bg-verde-50 border border-niebla-200" },
  { token: "rojo-600", hex: "#D1432F", className: "bg-rojo-600" },
  { token: "rojo-50", hex: "#FCECE9", className: "bg-rojo-50 border border-niebla-200" },
  { token: "azul-600", hex: "#2457D6", className: "bg-azul-600" },
] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-t border-niebla-200 pt-10">
      <h2 className="font-sans font-semibold text-xl font-semibold tracking-[-0.02em] text-asfalto-950 sm:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="container-site space-y-10 py-10 sm:py-14">
      <header className="space-y-3">
        <p className="text-sm font-medium text-asfalto-600">Sistema de diseño</p>
        <h1 className="font-sans font-semibold text-3xl font-bold tracking-[-0.02em] text-asfalto-950 sm:text-4xl">
          Banda de rodadura
        </h1>
        <p className="max-w-2xl text-asfalto-600">
          Paleta, tipografías y componentes base. Revisá esto a 375px y en
          desktop antes de seguir con pantallas.
        </p>
      </header>

      {/* Medida héroe */}
      <div className="overflow-hidden rounded-xl bg-asfalto-950 tread-texture px-6 py-12 text-center sm:px-10 sm:py-16">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-grafito-400">
          Medida (héroe)
        </p>
        <p className="font-mono text-5xl font-bold tabular-nums tracking-tight text-papel sm:text-7xl">
          175/65 R14
        </p>
        <p className="mt-4 font-mono text-2xl font-medium tabular-nums text-ambar-500 sm:text-3xl">
          {formatARS(118650)}
        </p>
        <p className="mt-1 text-sm text-grafito-400">por unidad</p>
      </div>

      <Section title="Colores (14)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {colors.map((c) => (
            <div key={c.token} className="space-y-2">
              <div
                className={`h-16 rounded-md ${c.className}`}
                aria-hidden
              />
              <div>
                <p className="font-mono text-xs font-medium text-asfalto-950">
                  {c.token}
                </p>
                <p className="font-mono text-xs text-asfalto-600">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tipografías">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-niebla-200 bg-white p-5 shadow-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-asfalto-600">
              Display · Inter Tight
            </p>
            <p className="font-sans font-semibold text-2xl font-bold tracking-[-0.02em] text-asfalto-950">
              Precio de hoy
            </p>
            <p className="mt-1 font-sans font-semibold text-lg font-semibold text-asfalto-600">
              600 / 700
            </p>
          </div>
          <div className="rounded-lg border border-niebla-200 bg-white p-5 shadow-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-asfalto-600">
              Sans · Inter
            </p>
            <p className="font-sans text-base text-asfalto-950">
              Comparamos tiendas de todo el país. Textos cortos y concretos.
            </p>
            <p className="mt-1 text-sm text-asfalto-600">400 / 500 / 600</p>
          </div>
          <div className="rounded-lg border border-niebla-200 bg-white p-5 shadow-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-asfalto-600">
              Mono · JetBrains Mono
            </p>
            <p className="font-mono text-xl font-bold tabular-nums text-asfalto-950">
              185/65 R15
            </p>
            <p className="mt-1 font-mono text-lg font-medium tabular-nums text-asfalto-600">
              {formatARS(89500)}
            </p>
          </div>
        </div>
      </Section>

      <Section title="Botones">
        <div className="flex flex-wrap items-center gap-3">
          <Button className="min-h-11 rounded-md bg-azul-600 px-5 text-white hover:bg-azul-600/90">
            Primario
          </Button>
          <Button
            variant="secondary"
            className="min-h-11 rounded-md border border-niebla-200 bg-ambar-500 px-5 text-asfalto-950 hover:bg-ambar-500/90"
          >
            Secundario ámbar
          </Button>
          <Button
            variant="outline"
            className="min-h-11 rounded-md border-niebla-200 bg-white px-5 text-asfalto-950 hover:bg-niebla-100"
          >
            Outline
          </Button>
          <Button
            variant="ghost"
            className="min-h-11 rounded-md px-5 text-asfalto-600 hover:bg-niebla-100 hover:text-asfalto-950"
          >
            Ghost
          </Button>
          <Button
            variant="destructive"
            className="min-h-11 rounded-md px-5"
          >
            Destructivo
          </Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="h-auto gap-1 rounded-full bg-verde-50 px-2.5 py-1 text-verde-600">
            <Check className="size-3.5" aria-hidden />
            Descuento real
          </Badge>
          <Badge className="h-auto gap-1 rounded-full bg-rojo-50 px-2.5 py-1 text-rojo-600">
            <AlertTriangle className="size-3.5" aria-hidden />
            Descuento inflado
          </Badge>
          <Badge className="h-auto rounded-full bg-ambar-100 px-2.5 py-1 text-asfalto-950">
            6 cuotas sin interés
          </Badge>
          <Badge className="h-auto rounded-full bg-asfalto-950 px-2.5 py-1 font-mono tabular-nums text-papel">
            175/65 R14
          </Badge>
          <Badge
            variant="outline"
            className="h-auto rounded-full border-niebla-200 px-2.5 py-1 text-asfalto-600"
          >
            Colocación gratis
          </Badge>
        </div>
      </Section>

      <Section title="Radios y sombras">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              { name: "sm · 8px", radius: "rounded-sm", shadow: "" },
              { name: "md · 12px", radius: "rounded-md", shadow: "shadow-sm" },
              { name: "lg · 16px", radius: "rounded-lg", shadow: "shadow-md" },
              { name: "xl · 24px", radius: "rounded-xl", shadow: "shadow-lg" },
            ] as const
          ).map((item) => (
            <div
              key={item.name}
              className={`border border-niebla-200 bg-white p-6 ${item.radius} ${item.shadow}`}
            >
              <p className="font-mono text-sm text-asfalto-950">{item.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Textura de rodadura">
        <div className="h-24 overflow-hidden rounded-lg bg-asfalto-950 tread-texture" />
      </Section>
    </div>
  );
}
