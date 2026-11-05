"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { MedidaOdometer } from "@/components/visual/MedidaOdometer";
import { SidewallDiagram } from "@/components/visual/SidewallDiagram";
import { cn } from "@/lib/utils";
import { toSlug } from "@/lib/medida";
import type { Medida } from "@/lib/types";

type MedidaSearchProps = {
  medidas: Medida[];
  /** Compacto para header sticky */
  variant?: "hero" | "compact";
  className?: string;
};

export function MedidaSearch({
  medidas,
  variant = "hero",
  className,
}: MedidaSearchProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const reduce = useReducedMotion();
  const perfilRef = useRef<HTMLSelectElement>(null);
  const rodadoRef = useRef<HTMLSelectElement>(null);

  const [ancho, setAncho] = useState<number | "">("");
  const [perfil, setPerfil] = useState<number | "">("");
  const [rodado, setRodado] = useState<number | "">("");
  const [mode, setMode] = useState<"medida" | "auto">("medida");
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
    if (next !== "") requestAnimationFrame(() => perfilRef.current?.focus());
  }

  function onPerfilChange(value: string) {
    const next = value === "" ? "" : Number(value);
    setPerfil(next);
    setRodado("");
    if (next !== "") requestAnimationFrame(() => rodadoRef.current?.focus());
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
    "min-h-11 w-full appearance-none bg-transparent",
    "px-1 font-mono text-base font-semibold tabular-nums text-tinta-900",
    "focus-visible:outline-none disabled:cursor-not-allowed disabled:text-tinta-400",
    variant === "compact" && "min-h-9 text-sm"
  );

  const searchForm = (
    <form onSubmit={onSubmit} className="w-full">
      <div
        className={cn(
          "border border-accion-600/40 bg-superficie shadow-hero",
          variant === "hero" &&
            "rounded-2xl p-3 md:flex md:h-16 md:items-center md:rounded-full md:p-2 md:pl-5",
          variant === "compact" &&
            "flex h-11 items-center rounded-full p-1 pl-3"
        )}
        role="group"
        aria-label="Medida de cubierta"
      >
        <div
          className={cn(
            "grid grid-cols-[1fr_auto_1fr_auto_1fr] items-end gap-1",
            variant === "hero" && "md:flex md:flex-1 md:items-center md:gap-2",
            variant === "compact" && "flex flex-1 items-center gap-1"
          )}
        >
          <div className="min-w-0">
            <label
              htmlFor={`ancho-${variant}`}
              className={cn(
                "mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500",
                variant === "compact" && "sr-only"
              )}
            >
              Ancho
            </label>
            <select
              id={`ancho-${variant}`}
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
            className="pb-2 font-mono text-xl font-bold text-tinta-400 md:pb-0"
          >
            /
          </span>

          <div className="min-w-0">
            <label
              htmlFor={`perfil-${variant}`}
              className={cn(
                "mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500",
                variant === "compact" && "sr-only"
              )}
            >
              Perfil
            </label>
            <select
              id={`perfil-${variant}`}
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
            className="pb-2 font-mono text-xl font-bold text-tinta-400 md:pb-0"
          >
            R
          </span>

          <div className="min-w-0">
            <label
              htmlFor={`rodado-${variant}`}
              className={cn(
                "mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500",
                variant === "compact" && "sr-only"
              )}
            >
              Rodado
            </label>
            <select
              id={`rodado-${variant}`}
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

        <motion.button
          type="submit"
          disabled={!slugCompleto}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          aria-label="Ver precios"
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-accion-600 text-white",
            "transition-colors duration-200 hover:bg-accion-700",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2",
            variant === "hero" &&
              "mt-3 h-12 w-full gap-2 text-sm font-semibold md:mt-0 md:ml-2 md:size-12 md:w-12 md:shrink-0",
            variant === "compact" && "ml-1 size-9 shrink-0",
            pulse && "ring-2 ring-ambar-500 ring-offset-2"
          )}
        >
          <Search
            className={variant === "compact" ? "size-4" : "size-5"}
            aria-hidden
          />
          <span className={cn(variant === "hero" ? "md:sr-only" : "sr-only")}>
            Ver precios
          </span>
        </motion.button>
      </div>
    </form>
  );

  if (variant === "compact") {
    return <div className={className}>{searchForm}</div>;
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode("medida")}
          aria-pressed={mode === "medida"}
          className={cn(
            "inline-flex min-h-9 items-center rounded-full px-3.5 text-sm font-medium transition-colors",
            mode === "medida"
              ? "bg-tinta-900 text-white dark:bg-superficie dark:text-tinta-900"
              : "bg-superficie/80 text-tinta-500 ring-1 ring-borde"
          )}
        >
          Por medida
        </button>
        <span
          aria-disabled="true"
          title="Pronto"
          className="inline-flex min-h-9 cursor-not-allowed items-center gap-2 rounded-full bg-superficie/60 px-3.5 text-sm font-medium text-tinta-400 ring-1 ring-borde"
        >
          Por auto
          <span className="rounded-full bg-ambar-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-asfalto-950">
            Pronto
          </span>
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-8">
        <div>{searchForm}</div>

        <div className="rounded-xl bg-asfalto-950 p-5 text-papel shadow-card sm:p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-400">
            Tu medida
          </p>
          <MedidaOdometer
            label={labelPreview}
            className="mt-2 text-[40px] leading-none text-papel md:text-[56px]"
          />
          <div className="mt-4">
            <SidewallDiagram ancho={ancho} perfil={perfil} rodado={rodado} />
          </div>
          <p className="mt-2 text-center text-sm text-tinta-400">
            ¿Dónde está tu medida?
          </p>
        </div>
      </div>
    </div>
  );
}
