"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FlancoIllustration } from "@/components/FlancoIllustration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toSlug } from "@/lib/medida";
import type { Medida } from "@/lib/types";

type MedidaSearchProps = {
  medidas: Medida[];
  populares: Medida[];
};

export function MedidaSearch({ medidas, populares }: MedidaSearchProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const perfilRef = useRef<HTMLSelectElement>(null);
  const rodadoRef = useRef<HTMLSelectElement>(null);

  const [ancho, setAncho] = useState<number | "">("");
  const [perfil, setPerfil] = useState<number | "">("");
  const [rodado, setRodado] = useState<number | "">("");
  const [pulse, setPulse] = useState(false);

  const anchos = useMemo(
    () => [...new Set(medidas.map((m) => m.ancho))].sort((a, b) => a - b),
    [medidas]
  );

  const perfiles = useMemo(() => {
    if (ancho === "") return [];
    return [
      ...new Set(
        medidas.filter((m) => m.ancho === ancho).map((m) => m.perfil)
      ),
    ].sort((a, b) => a - b);
  }, [medidas, ancho]);

  const rodados = useMemo(() => {
    if (ancho === "" || perfil === "") return [];
    return [
      ...new Set(
        medidas
          .filter((m) => m.ancho === ancho && m.perfil === perfil)
          .map((m) => m.rodado)
      ),
    ].sort((a, b) => a - b);
  }, [medidas, ancho, perfil]);

  const slugCompleto =
    ancho !== "" && perfil !== "" && rodado !== ""
      ? toSlug(ancho, perfil, rodado)
      : null;

  const labelPreview =
    ancho !== "" && perfil !== "" && rodado !== ""
      ? `${ancho}/${perfil} R${rodado}`
      : "175/65 R14";

  function onAnchoChange(value: string) {
    const next = value === "" ? "" : Number(value);
    setAncho(next);
    setPerfil("");
    setRodado("");
    if (next !== "") {
      requestAnimationFrame(() => perfilRef.current?.focus());
    }
  }

  function onPerfilChange(value: string) {
    const next = value === "" ? "" : Number(value);
    setPerfil(next);
    setRodado("");
    if (next !== "") {
      requestAnimationFrame(() => rodadoRef.current?.focus());
    }
  }

  function onRodadoChange(value: string) {
    const next = value === "" ? "" : Number(value);
    setRodado(next);
    if (next !== "") {
      setPulse(true);
      window.setTimeout(() => setPulse(false), 400);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slugCompleto) return;
    startTransition(() => {
      router.push(`/medida/${slugCompleto}`);
    });
  }

  const selectClass = cn(
    "min-h-12 w-full appearance-none rounded-md border border-niebla-200 bg-white",
    "px-2 py-2 font-mono text-base font-medium tabular-nums text-asfalto-950",
    "transition-colors duration-200 ease-[var(--ease-brand)]",
    "focus-visible:border-azul-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-600",
    "disabled:cursor-not-allowed disabled:bg-niebla-100 disabled:text-grafito-400"
  );

  return (
    <div className="rounded-xl border border-niebla-200 bg-white p-4 shadow-md sm:p-6">
      <Tabs defaultValue="medida">
        <TabsList className="mb-5 h-11 w-full max-w-md rounded-md bg-niebla-100 p-1">
          <TabsTrigger
            value="medida"
            className="min-h-9 flex-1 rounded-sm px-3 data-active:bg-white data-active:text-asfalto-950 data-active:shadow-sm"
          >
            Por medida
          </TabsTrigger>
          <span
            aria-disabled="true"
            title="Pronto"
            className="inline-flex min-h-9 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-sm px-3 text-sm font-medium text-grafito-400"
          >
            <span>Por auto</span>
            <span className="rounded-full bg-ambar-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-asfalto-950">
              Pronto
            </span>
          </span>
        </TabsList>

        <TabsContent value="medida" className="outline-none">
          <form onSubmit={onSubmit} className="space-y-4">
            <div
              className="flex items-end gap-1.5 sm:gap-2"
              role="group"
              aria-label="Medida de cubierta"
            >
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="ancho"
                  className="mb-1.5 block text-xs font-medium text-asfalto-600"
                >
                  Ancho en mm
                </label>
                <select
                  id="ancho"
                  name="ancho"
                  value={ancho === "" ? "" : String(ancho)}
                  onChange={(e) => onAnchoChange(e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">—</option>
                  {anchos.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <span
                aria-hidden
                className="mb-3 font-mono text-xl font-bold text-asfalto-600 sm:mb-2.5 sm:text-2xl"
              >
                /
              </span>

              <div className="min-w-0 flex-1">
                <label
                  htmlFor="perfil"
                  className="mb-1.5 block text-xs font-medium text-asfalto-600"
                >
                  Perfil
                </label>
                <select
                  id="perfil"
                  name="perfil"
                  ref={perfilRef}
                  value={perfil === "" ? "" : String(perfil)}
                  onChange={(e) => onPerfilChange(e.target.value)}
                  className={selectClass}
                  disabled={ancho === ""}
                  required
                >
                  <option value="">—</option>
                  {perfiles.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <span
                aria-hidden
                className="mb-3 font-mono text-xl font-bold text-asfalto-600 sm:mb-2.5 sm:text-2xl"
              >
                R
              </span>

              <div className="min-w-0 flex-[0.85]">
                <label
                  htmlFor="rodado"
                  className="mb-1.5 block text-xs font-medium text-asfalto-600"
                >
                  Rodado
                </label>
                <select
                  id="rodado"
                  name="rodado"
                  ref={rodadoRef}
                  value={rodado === "" ? "" : String(rodado)}
                  onChange={(e) => onRodadoChange(e.target.value)}
                  className={selectClass}
                  disabled={perfil === ""}
                  required
                >
                  <option value="">—</option>
                  {rodados.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!slugCompleto}
              className={cn(
                "inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-md",
                "bg-azul-600 px-5 text-sm font-semibold text-white",
                "transition-all duration-200 ease-[var(--ease-brand)]",
                "hover:bg-azul-600/90 disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul-600",
                pulse && "ring-2 ring-ambar-500 ring-offset-2 ring-offset-white"
              )}
            >
              Ver precios
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </form>

          <div className="mt-6 border-t border-niebla-200 pt-5">
            <FlancoIllustration medida={labelPreview} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 border-t border-niebla-200 pt-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-asfalto-600">
          Populares
        </p>
        <ul className="flex flex-wrap gap-2">
          {populares.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/medida/${m.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border border-niebla-200 bg-niebla-100 px-3 font-mono text-sm font-medium tabular-nums text-asfalto-950 transition-colors hover:border-asfalto-600 hover:bg-white"
              >
                {m.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
