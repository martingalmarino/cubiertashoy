"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toSlug } from "@/lib/medida";
import type { Medida } from "@/lib/types";

type MedidaSearchProps = {
  medidas: Medida[];
  variant?: "hero" | "compact";
  className?: string;
};

type SegmentProps = {
  id: string;
  label: string;
  value: number | "";
  placeholder: string;
  disabled?: boolean;
  onChange: (v: string) => void;
  options: number[];
  selectRef?: React.RefObject<HTMLSelectElement | null>;
  compact?: boolean;
  mobileCard?: boolean;
};

function SegmentSelect({
  id,
  label,
  value,
  placeholder,
  disabled,
  onChange,
  options,
  selectRef,
  compact,
  mobileCard,
}: SegmentProps) {
  const empty = value === "";
  return (
    <div
      className={cn(
        "min-w-0 text-left",
        mobileCard &&
          "flex h-14 flex-col justify-center rounded-xl bg-fondo px-2 py-1.5",
        !mobileCard && !compact && "min-w-[88px] md:min-w-[120px]",
        compact && "min-w-[52px]"
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          "mb-0.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500",
          compact && "sr-only"
        )}
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        ref={selectRef}
        value={empty ? "" : String(value)}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
        className={cn(
          "w-full appearance-none bg-transparent font-mono font-semibold tabular-nums",
          "focus-visible:outline-none disabled:cursor-not-allowed",
          compact ? "min-h-8 text-sm" : "text-xl leading-none md:text-2xl",
          empty || disabled ? "text-tinta-400" : "text-tinta-900"
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

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

  const isCompact = variant === "compact";
  const isHero = variant === "hero";

  const submitBtn = (
    <motion.button
      type="submit"
      disabled={!slugCompleto}
      whileTap={reduce || !slugCompleto ? undefined : { scale: 0.97 }}
      title={!slugCompleto ? "Elegí ancho, perfil y rodado" : "Ver precios"}
      aria-label={!slugCompleto ? "Elegí ancho, perfil y rodado" : "Ver precios"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium text-white shadow-sm",
        "transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2",
        slugCompleto
          ? "bg-accion-600 hover:bg-accion-700"
          : "cursor-not-allowed bg-accion-600/50",
        isHero &&
          "h-12 w-full px-5 text-sm sm:ml-2 sm:h-12 sm:w-auto md:h-14 md:px-6",
        isCompact && "ml-1 h-8 shrink-0 gap-1 px-2.5 text-xs",
        pulse && slugCompleto && "ring-2 ring-ambar-500 ring-offset-2"
      )}
    >
      <Search className={isCompact ? "size-3.5" : "size-4"} aria-hidden />
      <span className={cn(isCompact && "hidden lg:inline")}>Ver precios</span>
    </motion.button>
  );

  if (isCompact) {
    return (
      <form onSubmit={onSubmit} className={cn("w-full", className)}>
        <div
          className="flex h-10 max-w-md items-center gap-1 rounded-full border border-borde bg-white pl-3 pr-1 shadow-card focus-within:border-accion-600 dark:bg-superficie"
          role="group"
          aria-label="Medida de cubierta"
        >
          <SegmentSelect
            id={`ancho-${variant}`}
            label="Ancho"
            value={ancho}
            placeholder="175"
            onChange={onAnchoChange}
            options={anchos}
            compact
          />
          <span aria-hidden className="font-mono text-base text-tinta-400">
            /
          </span>
          <SegmentSelect
            id={`perfil-${variant}`}
            label="Perfil"
            value={perfil}
            placeholder="65"
            disabled={ancho === ""}
            onChange={onPerfilChange}
            options={perfiles}
            selectRef={perfilRef}
            compact
          />
          <span aria-hidden className="font-mono text-base text-tinta-400">
            R
          </span>
          <SegmentSelect
            id={`rodado-${variant}`}
            label="Rodado"
            value={rodado}
            placeholder="14"
            disabled={perfil === ""}
            onChange={onRodadoChange}
            options={rodados}
            selectRef={rodadoRef}
            compact
          />
          {submitBtn}
        </div>
      </form>
    );
  }

  return (
    <div className={cn("w-full text-center", className)}>
      <div className="mt-8 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode("medida")}
          aria-pressed={mode === "medida"}
          className={cn(
            "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors",
            mode === "medida"
              ? "bg-tinta-900 text-white dark:bg-superficie dark:text-tinta-900"
              : "bg-superficie text-tinta-500 ring-1 ring-borde"
          )}
        >
          Por medida
        </button>
        <span
          aria-disabled="true"
          title="Pronto"
          className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-full bg-superficie px-4 text-sm font-medium text-tinta-500 ring-1 ring-borde"
        >
          Por auto
          <span className="rounded-full bg-ambar-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-asfalto-950">
            Pronto
          </span>
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-4 w-full">
        {/* Mobile card */}
        <div className="rounded-2xl border border-borde-fuerte bg-superficie p-4 shadow-hero sm:hidden">
          <div
            className="grid grid-cols-3 gap-2"
            role="group"
            aria-label="Medida de cubierta"
          >
            <SegmentSelect
              id={`ancho-${variant}-m`}
              label="Ancho"
              value={ancho}
              placeholder="175"
              onChange={onAnchoChange}
              options={anchos}
              mobileCard
            />
            <SegmentSelect
              id={`perfil-${variant}-m`}
              label="Perfil"
              value={perfil}
              placeholder="65"
              disabled={ancho === ""}
              onChange={onPerfilChange}
              options={perfiles}
              selectRef={perfilRef}
              mobileCard
            />
            <SegmentSelect
              id={`rodado-${variant}-m`}
              label="Rodado"
              value={rodado}
              placeholder="14"
              disabled={perfil === ""}
              onChange={onRodadoChange}
              options={rodados}
              selectRef={rodadoRef}
              mobileCard
            />
          </div>
          <div className="mt-3">{submitBtn}</div>
        </div>

        {/* Desktop / tablet pill */}
        <div
          className="mx-auto hidden h-16 w-full max-w-2xl items-center gap-2 rounded-full border border-borde-fuerte bg-white pl-6 pr-2 shadow-hero focus-within:border-accion-600 focus-within:ring-4 focus-within:ring-accion-600/15 sm:flex md:h-[72px] dark:bg-superficie"
          role="group"
          aria-label="Medida de cubierta"
        >
          <SegmentSelect
            id={`ancho-${variant}-d`}
            label="Ancho"
            value={ancho}
            placeholder="175"
            onChange={onAnchoChange}
            options={anchos}
          />
          <span
            aria-hidden
            className="pb-1 font-mono text-xl text-tinta-400 md:text-2xl"
          >
            /
          </span>
          <div className="border-l border-borde pl-2">
            <SegmentSelect
              id={`perfil-${variant}-d`}
              label="Perfil"
              value={perfil}
              placeholder="65"
              disabled={ancho === ""}
              onChange={onPerfilChange}
              options={perfiles}
              selectRef={perfilRef}
            />
          </div>
          <span
            aria-hidden
            className="pb-1 font-mono text-xl text-tinta-400 md:text-2xl"
          >
            R
          </span>
          <div className="border-l border-borde pl-2">
            <SegmentSelect
              id={`rodado-${variant}-d`}
              label="Rodado"
              value={rodado}
              placeholder="14"
              disabled={perfil === ""}
              onChange={onRodadoChange}
              options={rodados}
              selectRef={rodadoRef}
            />
          </div>
          <div className="ml-auto shrink-0">{submitBtn}</div>
        </div>
      </form>

      <p className="mt-3 text-sm text-tinta-500">
        Ej.:{" "}
        <span className="font-mono font-semibold text-tinta-700">
          175/65 R14
        </span>{" "}
        — está en el flanco de tu cubierta
      </p>
    </div>
  );
}
