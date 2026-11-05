"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { trackBusquedaMedida } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { toSlug } from "@/lib/medida";
import type { Medida } from "@/lib/types";

type VehicleOption = {
  slug: string;
  marca: string;
  modelo: string;
  label: string;
};

type MedidaSearchProps = {
  medidas: Medida[];
  vehicles?: VehicleOption[];
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
  /** Prefijo visual (ej. R en Rodado). No cambia el value. */
  prefix?: string;
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
  prefix,
}: SegmentProps) {
  const empty = value === "";
  return (
    <div
      className={cn(
        "min-w-0 text-left",
        mobileCard &&
          "flex h-16 flex-col justify-center rounded-xl bg-fondo px-3 py-1.5",
        !mobileCard && !compact && "min-w-0 flex-1",
        compact && "min-w-0"
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          "mb-0.5 block font-medium uppercase tracking-[0.08em] text-tinta-500",
          mobileCard ? "text-[10px]" : "text-[11px]",
          compact && "sr-only"
        )}
      >
        {label}
      </label>
      <div className="flex min-w-0 items-center">
        {prefix ? (
          <span
            aria-hidden
            className={cn(
              "font-mono font-semibold text-tinta-400",
              compact ? "text-sm" : "text-xl md:text-2xl",
              mobileCard && "text-xl"
            )}
          >
            {prefix}
          </span>
        ) : null}
        <select
          id={id}
          name={id}
          ref={selectRef}
          value={empty ? "" : String(value)}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required
          className={cn(
            "min-w-0 flex-1 appearance-none bg-transparent font-mono font-semibold tabular-nums",
            "focus-visible:outline-none disabled:cursor-not-allowed",
            prefix && "ml-1",
            compact ? "min-h-8 text-sm" : "text-xl leading-none md:text-2xl",
            mobileCard && "text-xl",
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
    </div>
  );
}

export function MedidaSearch({
  medidas,
  vehicles = [],
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
  const [marca, setMarca] = useState("");
  const [modeloQuery, setModeloQuery] = useState("");
  const [modeloSlug, setModeloSlug] = useState("");

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
    trackBusquedaMedida(slugCompleto, "medida");
    startTransition(() => {
      router.push(`/medida/${slugCompleto}`);
    });
  }

  const marcas = useMemo(
    () => [...new Set(vehicles.map((v) => v.marca))].sort((a, b) => a.localeCompare(b, "es")),
    [vehicles]
  );

  const modelosFiltrados = useMemo(() => {
    let list = vehicles;
    if (marca) list = list.filter((v) => v.marca === marca);
    const q = modeloQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (v) =>
          v.label.toLowerCase().includes(q) ||
          v.modelo.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 8);
  }, [vehicles, marca, modeloQuery]);

  function onAutoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!modeloSlug) return;
    trackBusquedaMedida(modeloSlug, "auto");
    startTransition(() => {
      router.push(`/auto/${modeloSlug}`);
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
          className="flex h-10 max-w-md items-center gap-1 rounded-full border border-borde bg-white pl-3 pr-1 shadow-card focus-within:border-accion-600"
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
          <div className="border-l border-borde pl-1">
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
              prefix="R"
            />
          </div>
          {submitBtn}
        </div>
      </form>
    );
  }

  const autoForm = (
    <form onSubmit={onAutoSubmit} className="mt-4 w-full">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-borde-fuerte bg-superficie p-4 text-left shadow-hero sm:rounded-full sm:p-2 sm:pl-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] sm:items-center sm:gap-2">
          <div>
            <label
              htmlFor={`marca-${variant}`}
              className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500 sm:sr-only"
            >
              Marca
            </label>
            <select
              id={`marca-${variant}`}
              value={marca}
              onChange={(e) => {
                setMarca(e.target.value);
                setModeloSlug("");
                setModeloQuery("");
              }}
              className="min-h-12 w-full appearance-none rounded-xl border border-borde bg-fondo px-3 text-base text-tinta-900 focus-visible:border-accion-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accion-600/20 sm:border-0 sm:bg-transparent sm:px-1"
            >
              <option value="">Marca</option>
              {marcas.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label
              htmlFor={`modelo-${variant}`}
              className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-tinta-500 sm:sr-only"
            >
              Modelo
            </label>
            <input
              id={`modelo-${variant}`}
              type="search"
              role="combobox"
              aria-expanded={modelosFiltrados.length > 0 && !modeloSlug}
              aria-controls={`modelo-list-${variant}`}
              aria-autocomplete="list"
              placeholder={marca ? "Buscá el modelo" : "Elegí marca o buscá"}
              value={modeloQuery}
              onChange={(e) => {
                setModeloQuery(e.target.value);
                setModeloSlug("");
              }}
              className="min-h-12 w-full rounded-xl border border-borde bg-fondo px-3 text-base text-tinta-900 placeholder:text-tinta-400 focus-visible:border-accion-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accion-600/20 sm:border-0 sm:bg-transparent"
              autoComplete="off"
            />
            {modeloQuery && !modeloSlug && modelosFiltrados.length > 0 ? (
              <ul
                id={`modelo-list-${variant}`}
                role="listbox"
                className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-xl border border-borde bg-superficie py-1 shadow-card"
              >
                {modelosFiltrados.map((v) => (
                  <li key={v.slug} role="option" aria-selected={modeloSlug === v.slug}>
                    <button
                      type="button"
                      className="flex min-h-11 w-full items-center px-3 text-left text-sm text-tinta-900 hover:bg-fondo"
                      onClick={() => {
                        setModeloSlug(v.slug);
                        setModeloQuery(v.label);
                        setMarca(v.marca);
                      }}
                    >
                      {v.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <motion.button
            type="submit"
            disabled={!modeloSlug}
            whileTap={reduce || !modeloSlug ? undefined : { scale: 0.97 }}
            className={cn(
              "inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium text-white",
              "focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2",
              modeloSlug
                ? "bg-accion-600 hover:bg-accion-700"
                : "cursor-not-allowed bg-accion-600/50"
            )}
          >
            <Search className="size-4" aria-hidden />
            Ver medidas
          </motion.button>
        </div>
      </div>
      <p className="mt-3 text-sm text-tinta-500">
        Ej.: Chevrolet Onix · Volkswagen Gol Trend · Fiat Cronos
      </p>
    </form>
  );

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
              ? "bg-tinta-900 text-white"
              : "bg-superficie text-tinta-500 ring-1 ring-borde"
          )}
        >
          Por medida
        </button>
        <button
          type="button"
          onClick={() => setMode("auto")}
          aria-pressed={mode === "auto"}
          disabled={vehicles.length === 0}
          className={cn(
            "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors",
            mode === "auto"
              ? "bg-tinta-900 text-white"
              : "bg-superficie text-tinta-500 ring-1 ring-borde",
            vehicles.length === 0 && "cursor-not-allowed opacity-60"
          )}
        >
          Por auto
        </button>
      </div>

      {mode === "auto" ? autoForm : null}

      {mode === "medida" ? (
      <>
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
              prefix="R"
            />
          </div>
          <div className="mt-3">{submitBtn}</div>
        </div>

        {/* Desktop / tablet pill */}
        <div
          className="mx-auto hidden h-16 w-full max-w-2xl items-center gap-0 rounded-full border border-borde-fuerte bg-white pl-6 pr-2 shadow-hero focus-within:border-accion-600 focus-within:ring-4 focus-within:ring-accion-600/15 sm:flex md:h-[72px]"
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
            className="shrink-0 px-1 pb-1 font-mono text-xl text-tinta-400 md:text-2xl"
          >
            /
          </span>
          <div className="min-w-0 flex-1 border-l border-borde pl-3">
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
          <div className="min-w-0 flex-1 border-l border-borde pl-3">
            <SegmentSelect
              id={`rodado-${variant}-d`}
              label="Rodado"
              value={rodado}
              placeholder="14"
              disabled={perfil === ""}
              onChange={onRodadoChange}
              options={rodados}
              selectRef={rodadoRef}
              prefix="R"
            />
          </div>
          <div className="ml-auto shrink-0 pl-2">{submitBtn}</div>
        </div>
      </form>

      <p className="mt-3 text-sm text-tinta-500">
        Ej.:{" "}
        <span className="font-mono font-semibold text-tinta-700">
          175/65 R14
        </span>{" "}
        — está en el flanco de tu cubierta
      </p>
      </>
      ) : null}
    </div>
  );
}
