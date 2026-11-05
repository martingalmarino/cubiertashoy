"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { trackLeadEnviado } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type LeadFormProps = {
  medidaSlug: string;
  medidaLabel: string;
  localidades: string[];
  className?: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export function LeadForm({
  medidaSlug,
  medidaLabel,
  localidades,
  className,
}: LeadFormProps) {
  const pathname = usePathname();
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cantidad, setCantidad] = useState<2 | 4>(4);
  const [consentimiento, setConsentimiento] = useState(false);
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return localidades.slice(0, 12);
    return localidades
      .filter((l) => l.toLowerCase().includes(q))
      .slice(0, 12);
  }, [localidades, query]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!localidad) {
      setStatus({ kind: "error", message: "Elegí una localidad de la lista" });
      return;
    }
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          whatsapp,
          localidad,
          medidaSlug,
          medidaLabel,
          cantidad,
          consentimiento,
          company,
          sourcePath: pathname,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        estado?: string;
        gomeriaNombre?: string | null;
      };
      if (!res.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? "No se pudo enviar",
        });
        return;
      }
      trackLeadEnviado({
        medida: medidaSlug,
        localidad,
        cantidad,
        estado: data.estado ?? "ok",
      });
      const msg =
        data.estado === "sin_cobertura"
          ? "Recibimos tu pedido. Todavía no hay gomería activa en tu zona; te avisamos cuando haya."
          : data.gomeriaNombre
            ? `Listo. Pasamos tu pedido a ${data.gomeriaNombre}. Te van a contactar por WhatsApp.`
            : "Listo. Recibimos tu pedido.";
      setStatus({ kind: "ok", message: msg });
      setNombre("");
      setWhatsapp("");
      setLocalidad("");
      setQuery("");
      setConsentimiento(false);
    } catch {
      setStatus({
        kind: "error",
        message: "Error de red. Probá de nuevo.",
      });
    }
  }

  return (
    <section
      className={cn(
        "relative rounded-xl border border-borde bg-superficie p-5 shadow-card sm:p-6",
        className
      )}
      aria-labelledby="lead-title"
    >
      <h2
        id="lead-title"
        className="text-xl font-semibold tracking-[-0.02em] text-tinta-900"
      >
        Pedí precio con colocación en tu zona
      </h2>
      <p className="mt-1 text-sm text-tinta-500">
        Te conectamos con una gomería cercana. Medida{" "}
        <span className="font-mono font-semibold tabular-nums text-tinta-800">
          {medidaLabel}
        </span>
        .
      </p>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Honeypot */}
        <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="lead-company">Empresa</label>
          <input
            id="lead-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="lead-nombre"
            className="mb-1.5 block text-sm font-medium text-tinta-500"
          >
            Nombre
          </label>
          <input
            id="lead-nombre"
            name="nombre"
            required
            maxLength={80}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="min-h-11 w-full rounded-xl border border-borde bg-fondo px-3 text-sm text-tinta-900 focus-visible:border-accion-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accion-600/20"
          />
        </div>

        <div className="sm:col-span-1">
          <label
            htmlFor="lead-wa"
            className="mb-1.5 block text-sm font-medium text-tinta-500"
          >
            WhatsApp
          </label>
          <input
            id="lead-wa"
            name="whatsapp"
            type="tel"
            required
            inputMode="tel"
            placeholder="11 2345 6789"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="min-h-11 w-full rounded-xl border border-borde bg-fondo px-3 font-mono text-sm tabular-nums text-tinta-900 focus-visible:border-accion-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accion-600/20"
          />
        </div>

        <div className="relative sm:col-span-2">
          <label
            htmlFor="lead-localidad"
            className="mb-1.5 block text-sm font-medium text-tinta-500"
          >
            Localidad
          </label>
          <input
            id="lead-localidad"
            name="localidad"
            role="combobox"
            aria-expanded={open}
            aria-controls="lead-localidad-list"
            aria-autocomplete="list"
            required
            autoComplete="off"
            placeholder="Buscá tu barrio o ciudad"
            value={open ? query : localidad || query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLocalidad("");
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              // defer close so click on option registers
              window.setTimeout(() => setOpen(false), 150);
            }}
            className="min-h-11 w-full rounded-xl border border-borde bg-fondo px-3 text-sm text-tinta-900 focus-visible:border-accion-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accion-600/20"
          />
          {open && filtradas.length > 0 ? (
            <ul
              id="lead-localidad-list"
              role="listbox"
              className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-borde bg-superficie py-1 shadow-card"
            >
              {filtradas.map((l) => (
                <li key={l} role="option" aria-selected={l === localidad}>
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center px-3 text-left text-sm text-tinta-800 hover:bg-fondo focus-visible:bg-fondo focus-visible:outline-none"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setLocalidad(l);
                      setQuery(l);
                      setOpen(false);
                    }}
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <fieldset className="sm:col-span-1">
          <legend className="mb-1.5 text-sm font-medium text-tinta-500">
            Cantidad
          </legend>
          <div className="flex gap-2">
            {([2, 4] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCantidad(n)}
                className={cn(
                  "inline-flex min-h-11 flex-1 items-center justify-center rounded-full border text-sm font-medium focus-visible:ring-2 focus-visible:ring-accion-600",
                  cantidad === n
                    ? "border-tinta-900 bg-tinta-900 text-white"
                    : "border-borde bg-fondo text-tinta-700"
                )}
              >
                {n} cubiertas
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex items-start gap-3 sm:col-span-1 sm:items-end sm:pb-1">
          <input
            id="lead-consent"
            type="checkbox"
            required
            checked={consentimiento}
            onChange={(e) => setConsentimiento(e.target.checked)}
            className="mt-1 size-5 rounded border-borde text-accion-600 focus-visible:ring-accion-600"
          />
          <label htmlFor="lead-consent" className="text-sm text-tinta-500">
            Acepto que una gomería de mi zona me contacte por WhatsApp con un
            presupuesto.
          </label>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status.kind === "loading"}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-accion-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-accion-700 focus-visible:ring-2 focus-visible:ring-accion-600 focus-visible:ring-offset-2 disabled:opacity-60 sm:w-auto"
          >
            {status.kind === "loading" ? "Enviando…" : "Pedir presupuesto"}
          </button>
          <p className="mt-2 text-xs text-tinta-400">
            Servicio para gomerías:{" "}
            <Link
              href="/para-gomerias"
              className="underline underline-offset-2 hover:text-tinta-700"
            >
              conocé el plan
            </Link>
            .
          </p>
        </div>

        {status.kind === "ok" ? (
          <p
            role="status"
            className="sm:col-span-2 rounded-xl border border-ahorro-600/30 bg-ahorro-50 px-4 py-3 text-sm text-asfalto-950"
          >
            {status.message}
          </p>
        ) : null}
        {status.kind === "error" ? (
          <p
            role="alert"
            className="sm:col-span-2 rounded-xl border border-borde bg-fondo px-4 py-3 text-sm text-tinta-700"
          >
            {status.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
